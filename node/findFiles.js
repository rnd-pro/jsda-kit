import fs from 'fs';
import path from 'path';
import { Log } from './Log.js';

/**
 * 
 * @param {String} startPath 
 * @param {String[]} include 
 * @param {String[]} exclude 
 * @returns {String[]}
 */
export function findFiles(startPath, include, exclude) {

  if (!fs.existsSync(startPath)) {
    Log.err('findFiles error:', 'invalid start path >', startPath);
    return;
  }

  let collection = [];

  /**
   * 
   * @param {String} startPath 
   */
  let search = (startPath) => {
    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      let filePath = path.join(startPath, files[i]);
      let stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
        search(filePath);
      } else {
        let checkPassed = true;
        include.forEach((pattern) => {
          if (!filePath.includes(pattern)) {
            checkPassed = false;
          }
        });
        exclude.forEach((pattern) => {
          if (filePath.includes(pattern)) {
            checkPassed = false;
          }
        });
        checkPassed && collection.push(filePath);
      };
    };
  };

  search(startPath);

  return collection;
};