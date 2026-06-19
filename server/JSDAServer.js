import http from 'http';
import fs from 'fs';
import CFG, { getSsrImports, getSsrNonce } from '../cfg/CFG.js';
import MIME_TYPES from './MIME_TYPES.js';
import { jsBuild, cssBuild } from './build-asset.js';
import { htmlMin } from '../node/htmlMin.js';
import { cssMin } from '../node/cssMin.js';
import pth from '../node/pth.js';
import { Log } from '../node/Log.js';
import { applyData } from '../iso/applyData.js';
import { wcSsr } from '../node/wcSsr.js';

/** @type {Object<string, {type: string, content: string, code: number}>} */
const cache = Object.create(null);

const encPart = '; charset=utf-8';

/**
 * @param {String} url
 * @returns {String}
 */
function getFileName(url) {
  return url
    .split('/')
    .pop()
    .split('?')[0]
    .toLowerCase();
}

/**
 * @param {String} url 
 * @returns {Boolean}
 */
function isJsda(url) {
  let fileName = getFileName(url);
  return Object.keys(MIME_TYPES).some((ext) => fileName.endsWith(`.${ext}.js`));
}

/**
 * 
 * @param {String} url 
 * @returns {String} - file extension
 */
function getExt(url) {
  let fileName = getFileName(url);
  if (isJsda(url)) {
    fileName = fileName.slice(0, -'.js'.length);
  }
  return fileName.split('.').pop().toLowerCase();
}

/**
 * 
 * @param {Object} jsdaMdl 
 * @param {String} routeKey 
 * @param {String} reqUrl 
 * @param {Object} reqHeaders 
 * @returns {Promise<String>} - HTML string
 */
async function processHtmlPipeline(jsdaMdl, routeKey, reqUrl, reqHeaders) {
  let html = jsdaMdl.default;
  if (typeof html !== 'string') {
    throw new Error('JSDA HTML module must export a string as default. Type: ' + typeof html + ', Keys: ' + Object.keys(jsdaMdl).join(', '));
  }
  let ssrImports = jsdaMdl.ssrImports ? jsdaMdl.ssrImports.map(imp => {
    return imp.startsWith('/') ? pth(CFG.dynamic.baseDir + imp.slice(1)) : imp;
  }) : [];
  let data = (await CFG.dynamic.getDataFn(routeKey, reqUrl, reqHeaders)) || {};
  html = applyData(html, data);
  let imports = [...getSsrImports(CFG), ...ssrImports];
  let nonce = getSsrNonce(CFG);
  let ssrOptions = nonce ? { nonce } : {};
  html = await wcSsr(html, { imports, ssrOptions });
  return CFG.minify.html ? htmlMin(html) : html;
}

/**
 * 
 * @param {Object} [options={}]
 */
export function createServer(options = {}) {
  // Override CFG with options
  if (options.cache) {
    CFG.dynamic.cache.inMemory = options.cache;
  }
  if (options.port !== undefined) {
    CFG.dynamic.port = options.port;
  }

  const JSDAServer = http.createServer(async (req, res) => {

    /**
     * 
     * @param {String} type 
     * @param {String} content 
     * @param {Number} [code] 
     */
    let respond = (type, content, code = 200) => {
      cache[req.url] = { type, content, code };
      res.statusCode = code;
      res.setHeader('Content-Type', type + encPart);
      res.end(content);
      Log[code === 200 ? 'info' : 'err'](req.method, req.url, code);
    };

    let filePath = req.url.split('?')[0];
    if (!filePath.includes(CFG.dynamic.baseDir)) {
      filePath = CFG.dynamic.baseDir + (filePath.startsWith('/') ? filePath.slice(1) : filePath);
    }

    if (CFG.dynamic.cache.inMemory && !CFG.dynamic.cache.exclude.includes(req.url) && cache[req.url]) {
      respond(cache[req.url].type, cache[req.url].content, cache[req.url].code);
      return;
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.setHeader('Content-Type', 'text/plain' + encPart);
      res.end('Unsupported request method: ' + req.method);
      return;
    }

    let params = CFG.dynamic.cache.inMemory ? '' : '?' + Date.now();
    
    let fileName = req.url
      .split('/')
      .pop()
      .split('?')[0]
      .toLowerCase();

    if (fileName === 'index.js') {
      // Handle JS bundles:
      try {
        respond('text/javascript', await jsBuild(filePath));
      } catch (err) {
        Log.err('JS build error:', err);
        respond('text/plain', 'JS ASSET BUILD ERROR', 500);
      }
      return;
    } else if (fileName === 'index.css') { 
      // Handle CSS bundles:
      try {
        respond('text/css', cssBuild(filePath));
      } catch (err) {
        Log.err('CSS build error:', err);
        respond('text/plain', 'CSS ASSET BUILD ERROR', 500);
      }
      return;
    } else if (isJsda(req.url)) {
      // Handle any JSDA:
      try {
        let fileExt = getExt(req.url);
        let jsdaMdl = await import(pth(filePath) + params);
        
        let mimeType = MIME_TYPES[fileExt];
        if (mimeType === 'text/html') {
          let routeKey = req.url.split('?')[0];
          let html = await processHtmlPipeline(jsdaMdl, routeKey, req.url, req.headers);
          respond(mimeType, html);
        } else {
          let fileTxt = jsdaMdl.default;
          if (typeof fileTxt === 'string') {
            if (mimeType === 'text/css' && CFG.minify.css) {
              fileTxt = cssMin(fileTxt);
            }
            respond(mimeType, fileTxt);
          } else {
            Log.err('JSDA IMPORT ERROR: ', req.url + ' > ' + filePath + params);
            respond('text/plain', 'JSDA IMPORT ERROR', 500);
          }
        }
      } catch (err) {
        Log.err('JSDA File error:', err, filePath + params);
        respond('text/plain', 'JSDA FILE ERROR', 500);
      }
      return;
    } else if (Object.keys(MIME_TYPES).find(type => req.url.includes('.' + type))) { 
      // Handle other static files:
      if (fs.existsSync(filePath)) {
        let fileTxt = fs.readFileSync(filePath).toString();
        let fileExt = getExt(req.url);
        let mimeType = MIME_TYPES[fileExt];
        if (mimeType === 'text/html' && CFG.minify.html) {
          fileTxt = htmlMin(fileTxt);
        }
        if (mimeType === 'text/css' && CFG.minify.css) {
          fileTxt = cssMin(fileTxt);
        }
        respond(mimeType, fileTxt);
      } else {
        respond('text/plain', '404', 404);
      }
      return;
    }

    // Process pre-defined server routes:
    let reqPath = req.url.split('?')[0];
    reqPath.endsWith('/') || (reqPath += '/');
    let serverRoutes = (await import(pth(CFG.dynamic.routes))).default;
    if (serverRoutes[reqPath]) {
      try {
        let routeKey = (await CFG.dynamic.getRouteFn(req.url, req.headers)) || reqPath;
        let routeMdl = await import(pth(serverRoutes[routeKey]) + params);
        let html = await processHtmlPipeline(routeMdl, routeKey, req.url, req.headers);
        respond('text/html', html);
      } catch (err) {
        Log.err('Route error:', err);
        respond('text/plain', 'JSDA ROUTE ERROR', 500);
        return;
      }
    } else {
      respond('text/plain', '404', 404);
    }
  });

  JSDAServer.listen(CFG.dynamic.port, () => {
    Log.success('HTTP server started:', `http://localhost:${CFG.dynamic.port}`);
  });

  return JSDAServer;
}
