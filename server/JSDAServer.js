import http from 'http';
import fs from 'fs';
import CFG from '../cfg/CFG.js';
import MIME_TYPES from './MIME_TYPES.js';
import { htmlMin } from '../node/htmlMin.js';
import { cssMin } from '../node/cssMin.js';
import esbuild from 'esbuild';
import pth from '../node/pth.js';
import { getExternalDeps } from './getExternalDeps.js';
import { Log } from '../node/Log.js';

/** @type {Object<string, {type: string, content: string}>} */
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

export function createServer(options = {}) {
  // Override CFG with options
  if (options.cache) {
    CFG.dynamic.cache.inMemory = options.cache;
  }
  if (options.port !== undefined) {
    CFG.dynamic.port = options.port;
  }

  const DWAServer = http.createServer(async (req, res) => {

    if (CFG.dynamic.cache.inMemory && !CFG.dynamic.cache.exclude.includes(req.url) && cache[req.url]) {
      res.setHeader('Content-Type', cache[req.url].type + encPart);
      res.end(cache[req.url].content);
      return;
    }

    Log.info(req.method, req.url);

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

    let respond = (type, content) => {
      cache[req.url] = { type, content };
      res.setHeader('Content-Type', type + encPart);
      res.end(content);
    };
    
    let fileName = req.url
      .split('/')
      .pop()
      .split('?')[0]
      .toLowerCase();

    if (fileName === 'index.js') {
      // Handle JS bundles:
      try {
        let entry = '.' + req.url;
        let js = esbuild.buildSync({
          entryPoints: [entry],
          bundle: !CFG.bundle.exclude.includes(req.url) && CFG.bundle.js,
          format: 'esm',
          target: 'esnext',
          minify: !CFG.minify.exclude.includes(req.url) && CFG.minify.js,
          sourcemap: false,
          external: getExternalDeps(),
          treeShaking: true,
          write: false,
        }).outputFiles[0].text;
        res.setHeader('Content-Type', 'text/javascript' + encPart);
        res.end(js);
      } catch (err) {
        Log.err('JS error:', err);
        respond('text/plain', 'JS BUNDLE ERROR');
      }
      return;
    } else if (fileName === 'index.css') { 
      // Handle CSS bundles:
      try {
        let entry = '.' + req.url;
        let css = esbuild.buildSync({
          entryPoints: [entry],
          bundle: !CFG.bundle.exclude.includes(req.url) && CFG.bundle.css,
          minify: !CFG.minify.exclude.includes(req.url) && CFG.minify.css,
          write: false,
        }).outputFiles[0].text;
        res.setHeader('Content-Type', 'text/css' + encPart);
        res.end(css);
      } catch (err) {
        Log.err('CSS error:', err);
        respond('text/plain', 'CSS BUNDLE ERROR');
      }
      return;
    } else if (isJsda(req.url)) {
      // Handle any JSDA:
      try {
        let fileExt = req.url.split('/').pop().split('.js')[0].split('.').pop().toLowerCase();
        let dwaPath = pth(req.url, true);
        let fileTxt = (await import(dwaPath + params)).default;
        if (typeof fileTxt === 'string') {
          respond(MIME_TYPES[fileExt], fileTxt);
        } else {
          Log.err('JSDA IMPORT ERROR: ', req.url + ' > ' + dwaPath + params);
          respond('text/plain', 'JSDA IMPORT ERROR');
        }
      } catch (err) {
        Log.err(err);
        respond('text/plain', 'JSDA IMPORT ERROR');
      }
      return;
    } else if (Object.keys(MIME_TYPES).find(type => req.url.includes('.' + type))) { 
      // Handle other static files:
      if (fs.existsSync('.' + req.url)) {
        let file = fs.readFileSync('.' + req.url);
        respond(MIME_TYPES[req.url.split('.')[1].split('?')[0].toLowerCase()], file);
      } else {
        respond('text/plain', '404');
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
        respond('text/plain', 'JSDA IMPORT ERROR');
        return;
      }
    } else {
      respond('text/plain', 'ERROR');
    }
  });

  DWAServer.listen(CFG.dynamic.port, () => {
    Log.success('HTTP server started:', `http://localhost:${CFG.dynamic.port}`);
  });

  return DWAServer;
}
