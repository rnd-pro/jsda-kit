import fs from 'fs';
import { checkDirExists } from '../node/checkDirExists.js';
import { defaults } from '../cfg/CFG.js';
import { Log } from '../node/Log.js';

const folders = [
  './types',
  './src/static',
  './src/dynamic',
  './src/css',
  './src/md',
  './cit/',
];

function createFile(name, content) {
  checkDirExists(name);
  if (!fs.existsSync(name)) {
    fs.writeFileSync(name, content);
    Log.success('File created:', name);
  } else {
    Log.info('File already exists:', name);
  }
}

export function scaffold() {

  folders.forEach((folder) => {
    checkDirExists(folder);
  });

  createFile('./project.cfg.js', `export default ${JSON.stringify(defaults, null, 2)}`);
  createFile('./README.md', `# Project Name`);
  createFile('./LICENSE', 'MIT');
  createFile('./tsconfig.json', fs.readFileSync('./node_modules/jsda-kit/tsconfig.json', 'utf8'));
  createFile('./.npmrc', fs.readFileSync('./node_modules/jsda-kit/.npmrc', 'utf8'));
  createFile('./.gitignore', fs.readFileSync('./node_modules/jsda-kit/.gitignore', 'utf8'));

}
