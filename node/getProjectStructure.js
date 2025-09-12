import fs from 'fs';
import path from 'path';

/**
 * 
 * @param {String} [startPath] 
 */
export default function getProjectStructure(startPath = './') {
  let result = {};

  /**
   * 
   * @param {String} fPath 
   * @param {Object<string, *>} level 
   */
  let processFolder = (fPath, level) => {
    let files = fs.readdirSync(fPath);
    for (let i = 0; i < files.length; i++) {
      let filePath = path.join(fPath, files[i]);
      let stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
        let folderName = filePath.split('/').pop();
        level[folderName] = {};
        processFolder(filePath, level[folderName]);
        let fSet = new Set(files);
        fSet.delete(filePath);
        files = [...fSet];
      }
    }
    for (let i = 0; i < files.length; i++) {
      let filePath = path.join(fPath, files[i]);
      let stat = fs.lstatSync(filePath);
      if (!stat.isDirectory()) {
        if (filePath.toLowerCase().includes('/index.') || filePath.toLowerCase().endsWith('.md')) {
          let fileName = filePath.split('/').pop();
          let fileTxt = fs.readFileSync(filePath).toString();
          level[fileName] = fileTxt.length;
        }
      }
    }
  };

  processFolder(startPath, result);
  
  return result;
}

export { getProjectStructure }