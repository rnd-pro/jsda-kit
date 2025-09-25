import fs from 'fs';
import { checkDirExists } from '../node/checkDirExists.js';
import { defaults } from '../cfg/CFG.js';
import { Log } from '../node/Log.js';

const folders = [
  './types',
  './src/static',
  './src/dynamic',
  './src/templates/wc-ssr',
  './src/css',
  './src/md',
  './cit/',
];

function createFile(filePath, content) {
  if (filePath.replace('./', '').split('/').length > 1) {
    checkDirExists(filePath);
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    Log.success('File created:', filePath);
  } else {
    Log.warn('File already exists:', filePath);
  }
}

export function init() {

  folders.forEach((folder) => {
    checkDirExists(folder);
  });

  createFile('./project.cfg.js', `export default ${JSON.stringify(defaults, null, 2)}`);
  createFile('./README.md', `# Project Name`);
  createFile('./LICENSE', 'MIT');
  createFile('./tsconfig.json', fs.readFileSync('./node_modules/jsda-kit/tsconfig.json', 'utf8'));
  createFile('./.npmrc', 'package-lock=false');
  createFile('./.gitignore', fs.readFileSync('./node_modules/jsda-kit/.gitignore', 'utf8'));

}
