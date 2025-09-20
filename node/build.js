import fs from 'fs';
import CFG from '../cfg/CFG.js';
import { checkDirExists } from './checkDirExists.js';
import { findFiles } from './findFiles.js';
import esbuild from 'esbuild';

/**
 * 
 * @param {String} path 
 */
function fmtPath(path) {
  if (path && !path.startsWith('.')) {
    path = './' + path;
  }
  return path;
}

/**
 * 
 * @param {String} path 
 * @returns {Promise<String>}
 */
async function impWa(path) {
  let result = null;
  if (path.includes('/index.js')) {
    let buildResult = esbuild.buildSync({
      entryPoints: [path],
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      target: 'esnext',
      write: false,
    });
    result = buildResult.outputFiles[0].text;
  } else {
    let processRoot = process.cwd();
    let mdlUrl = 'file://' + processRoot + '/' + path;
    try {
      let str = (await import(mdlUrl)).default;
      if (str.constructor === Function) {
        str = str();
      }
      result = str;
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

/**
 * 
 * @param {String} indexPath 
 */
 async function processIndex(indexPath) {
  let indexSrc = await impWa(indexPath);
  if (!indexSrc) {
    return;
  }
  let outPath = fmtPath(indexPath);
  if (!outPath.includes('index.js')) {
    outPath = outPath.replace('.js', '');
  }
  outPath = outPath.replace(fmtPath(CFG.static.sourceDir), fmtPath(CFG.static.outputDir));
  checkDirExists(outPath);
  fs.writeFileSync(outPath, indexSrc);
  console.log('Output file created: ' + outPath);
}

export async function build() {
  let indexArr = findFiles(CFG.static.sourceDir, ['index.', '.js'], []);
  console.log('Processing DWA files:');
  console.log(indexArr);
  await Promise.all(indexArr.map(processIndex));
}

try {
  await build().then(() => {
    process.exit(0);
  }).catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
} catch (e) {
  console.log(e.message);
  process.exit(1);
}