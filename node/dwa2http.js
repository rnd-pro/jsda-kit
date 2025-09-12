import http from 'node:http';
import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';

import MIME_MAP from '../iso/MIME.js';

export class Dwa2Http {

  /** @type {http.Server} */
  #httpServer;

  /** @type {Number} */
  #port;

  /**
   * 
   * @param {Number} port 
   */
  constructor(port) {

    this.#port = port;
    this.#httpServer = http.createServer(async (request, response) => {

      if (request.method === 'POST') {
        // Save file
        return;
      }

      let parsedUrl = url.parse(request.url);
      let filePath = '.' + parsedUrl.pathname;
      let fileExt = path.parse(filePath).ext;

      let dwaList = [
        'htm',
        'html',
        'css',
        'svg',
        'md',
        'json',
      ];

      let dwaType = dwaList.find((type) => {
        return filePath.includes(`index.${type}.js`);
      });

      if (dwaType) {
        let dwaPath = '../..' + parsedUrl.pathname;
        let dwaTxt = (await import(dwaPath)).default;
        if (dwaTxt && dwaTxt.constructor === String) {
          let mime = MIME_MAP[`.${dwaType}`];
          response.setHeader('Content-type', mime);
          response.end(dwaTxt);
        } else {
          response.statusCode = 404;
          response.end('DWA error: ' + parsedUrl.pathname);
          return;
        }
      } else {
        fs.stat(filePath, { bigint: false }, (err, stat) => {
          if (err) {
            response.statusCode = 404;
            response.end('File not found: ' + filePath);
            return;
          }
  
          if (fs.statSync(filePath).isDirectory()) {
            filePath += 'index.html';
            fileExt = '.html';
          }
  
          fs.readFile(filePath, {}, async (err, /** @type {Buffer | String} */ data) => {
            if (err) {
              console.log(filePath);
              response.statusCode = 500;
              response.end('Internal Server Error');
              return;
            }
            response.setHeader('Content-type', MIME_MAP[fileExt] || 'text/plain');
            response.end(data);
          });
        });
      }

    });
  }

  start() {
    this.#httpServer.listen(this.#port);
    console.log('DWA2HTTP started...');
  }
}

let dwa2Http = new Dwa2Http(8080);
dwa2Http.start();