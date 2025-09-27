import http from 'http';
import fs from 'fs';
import CFG from '../cfg/CFG.js';
import MIME_TYPES from './MIME_TYPES.js';
import { jsBuild, cssBuild } from './build-asset.js';
import { htmlMin } from '../node/htmlMin.js';
import { cssMin } from '../node/cssMin.js';
import pth from '../node/pth.js';
import { Log } from '../node/Log.js';

/** @type {Object<string, {type: string, content: string, code: number}>} */
const cache = Object.create(null);

const encPart = '; charset=utf-8';

function isJsda(url) {
  let result = false;
  let fileName = url
    .split('/')
    .pop()
    .split('?')[0]
    .toLowerCase();
  Object.keys(MIME_TYPES).forEach((ext) => {
    if (fileName.includes(`.${ext}.js`)) {
      result = true;
    }
  });
  return result;
}

function getExt(url) {
  return url.split('/').pop().split('.js')[0].split('.').pop().toLowerCase();
}

export function createServer(options = {}) {
  // Override CFG with options
  if (options.cache) {
    CFG.dynamic.cache.inMemory = options.cache;
  }
  if (options.port !== undefined) {
    CFG.dynamic.port = options.port;
  }

  const DWAServer = http.createServer(async (req, res) => {

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
        respond('text/javascript', jsBuild(req.url));
      } catch (err) {
        Log.err('JS error:', err);
        respond('text/plain', 'JS BUILD ERROR', 500);
      }
      return;
    } else if (fileName === 'index.css') { 
      // Handle CSS bundles:
      try {
        respond('text/css', cssBuild(req.url));
      } catch (err) {
        Log.err('CSS error:', err);
        respond('text/plain', 'CSS BUILD ERROR', 500);
      }
      return;
    } else if (isJsda(req.url)) {
      // Handle any JSDA:
      try {
        let fileExt = getExt(req.url);
        let dwaPath = pth(req.url, true);
        let fileTxt = (await import(dwaPath + params)).default;
        if (typeof fileTxt === 'string') {
          if (fileExt === 'html' && CFG.minify.html) {
            fileTxt = htmlMin(fileTxt);
          }
          if (fileExt === 'css' && CFG.minify.css) {
            fileTxt = cssMin(fileTxt);
          }
          respond(MIME_TYPES[fileExt], fileTxt);
        } else {
          Log.err('JSDA IMPORT ERROR: ', req.url + ' > ' + dwaPath + params);
          respond('text/plain', 'JSDA IMPORT ERROR', 404);
        }
      } catch (err) {
        Log.err(err);
        respond('text/plain', 'JSDA IMPORT ERROR', 500);
      }
      return;
    } else if (Object.keys(MIME_TYPES).find(type => req.url.includes('.' + type))) { 
      // Handle other static files:
      if (fs.existsSync('.' + req.url)) {
        let fileTxt = fs.readFileSync('.' + req.url).toString();
        let fileExt = getExt(req.url);
        if (fileExt === 'html' && CFG.minify.html) {
          fileTxt = htmlMin(fileTxt);
        }
        if (fileExt === 'css' && CFG.minify.css) {
          fileTxt = cssMin(fileTxt);
        }
        respond(MIME_TYPES[req.url.split('.')[1].split('?')[0].toLowerCase()], fileTxt);
      } else {
        respond('text/plain', '404', 404);
      }
      return;
    }

    // Process routes:
    let route = req.url.split('?')[0];
    route.endsWith('/') || (route += '/');
    let routes = (await import(pth(CFG.dynamic.routes))).default;
    if (routes[route]) {
      try {
        let html = (await import(pth(routes[route]) + params)).default;
        respond('text/html', htmlMin(html));
      } catch (err) {
        Log.err(err);
        respond('text/plain', 'JSDA IMPORT ERROR', 500);
        return;
      }
    } else {
      respond('text/plain', 'ERROR', 404);
    }
  });

  DWAServer.listen(CFG.dynamic.port, () => {
    Log.success('HTTP server started:', `http://localhost:${CFG.dynamic.port}`);
  });

  return DWAServer;
}
