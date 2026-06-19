import fs from 'fs';
import CFG, { getSsrEnabled, getSsrImports, getSsrNonce } from '../cfg/CFG.js';
import { checkDirExists } from './checkDirExists.js';
import { findFiles } from './findFiles.js';
import esbuild from 'esbuild';
import { minifyTemplates } from 'esbuild-minify-templates';
import { Log } from '../node/Log.js';
import { htmlMin } from './htmlMin.js';
import { cssMin } from './cssMin.js';
import { wcSsr } from './wcSsr.js';
import { getExternalDeps } from '../server/getExternalDeps.js';
import { generateSitemap } from './sitemap.js';

/**
 * @param {String} path
 */
function fmtPath(path) {
  if (path && !path.startsWith('.')) {
    path = './' + path;
  }
  return path;
}

/**
 * @param {String} filePath
 * @returns {String}
 */
function fileNameFromPath(filePath) {
  return filePath.split(/[\\/]/).pop() || '';
}

/**
 * @param {String} filePath
 * @returns {Boolean}
 */
function isIndexEntry(filePath) {
  let fileName = fileNameFromPath(filePath);
  return fileName.startsWith('index.') && fileName.endsWith('.js');
}

/**
 * @param {String} filePath
 * @returns {Boolean}
 */
function isIndexJsBundle(filePath) {
  return fileNameFromPath(filePath) === 'index.js';
}

/**
 * @param {String} filePath
 * @returns {Promise<String | { content: String, ssrImports: String[] } | null>}
 */
async function impWa(filePath) {
  let result = null;
  if (isIndexJsBundle(filePath)) {
    let buildResult = await esbuild.build({
      entryPoints: [filePath],
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      external: getExternalDeps(),
      target: 'esnext',
      write: false,
      plugins: [minifyTemplates({ taggedOnly: true })],
    });
    result = buildResult.outputFiles[0].text;
  } else {
    let processRoot = process.cwd();
    let mdlUrl = 'file://' + processRoot + '/' + filePath;
    try {
      let mdl = await import(mdlUrl);
      let str = mdl.default;
      if (str?.constructor === Function) {
        str = str();
      }
      result = { content: str, ssrImports: mdl.ssrImports || [] };
    } catch (e) {
      Log.err(e);
    }
  }
  return result;
}

/**
 * @param {String} indexPath
 */
async function processIndex(indexPath) {
  let imported = await impWa(indexPath);
  if (!imported) {
    return;
  }

  /** @type {String} */
  let indexSrc;
  /** @type {String[]} */
  let endpointSsrImports = [];

  if (typeof imported === 'object' && imported.content !== undefined) {
    indexSrc = imported.content;
    endpointSsrImports = imported.ssrImports || [];
  } else {
    indexSrc = /** @type {string} */ (imported);
  }

  let outPath = fmtPath(indexPath);
  if (!isIndexJsBundle(indexPath) && outPath.endsWith('.js')) {
    outPath = outPath.slice(0, -'.js'.length);
  }
  outPath = outPath.replace(fmtPath(CFG.static.sourceDir), fmtPath(CFG.static.outputDir));

  if (outPath.includes('/index.html')) {
    if (getSsrEnabled(CFG)) {
      let imports = [...getSsrImports(CFG), ...endpointSsrImports];
      let nonce = getSsrNonce(CFG);
      let ssrOptions = nonce ? { nonce } : {};
      indexSrc = await wcSsr(indexSrc, { imports, ssrOptions });
    }
    if (CFG.minify.html) {
      indexSrc = htmlMin(indexSrc).toString();
    }
  }

  if (outPath.includes('/index.css')) {
    indexSrc = cssMin(indexSrc);
  }

  checkDirExists(outPath);
  fs.writeFileSync(outPath, indexSrc);
  Log.info('Output file created:', outPath);
}

export async function build() {
  let indexArr = findFiles(CFG.static.sourceDir, ['index.', '.js'], []).filter(isIndexEntry);
  Log.info('Processing JSDA entries:', indexArr);
  await Promise.all(indexArr.map(processIndex));
  await generateSitemap();
}
