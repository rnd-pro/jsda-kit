import fs from 'fs';
import { Log } from './Log.js';

/**
 * 
 * @param {String} dirPath
 */
export function checkDirExists(dirPath) {
  let dir = dirPath.split('/').filter((part, idx) => {
    return !(idx !== 0 && part.includes('.'));
  }).join('/');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
    Log.msg('Directory created: ', dir);
  }
}