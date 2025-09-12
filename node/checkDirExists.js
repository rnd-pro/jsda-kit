import fs from 'fs';

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
    console.log('Directory created: ' + dir);
  }
}