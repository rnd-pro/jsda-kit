import fs from 'fs';
import CFG, { getSsrEnabled, getSsrImports } from '../cfg/CFG.js';
import { checkDirExists } from './checkDirExists.js';
import { findFiles } from './findFiles.js';
import esbuild from 'esbuild';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';
import { Log } from '../node/Log.js';
import { htmlMin } from './htmlMin.js';
import { cssMin } from './cssMin.js';
import { wcSsr } from './wcSsr.js';
import { getExternalDeps } from '../server/getExternalDeps.js';

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
 * @param {String} path
 * @returns {Promise<String | { content: String, ssrImports: String[] } | null>}
 */
async function impWa(path) {
  let result = null;
  if (path.includes('/index.js')) {
    let buildResult = await esbuild.build({
      entryPoints: [path],
      format: 'esm',
      bundle: true,
      minify: true,
      sourcemap: false,
      external: getExternalDeps(),
      target: 'esnext',
      write: false,
      plugins: [minifyTemplates({ taggedOnly: true }), writeFiles()],
    });
    result = buildResult.outputFiles[0].text;
  } else {
    let processRoot = process.cwd();
    let mdlUrl = 'file://' + processRoot + '/' + path;
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
    indexSrc = imported;
  }

  let outPath = fmtPath(indexPath);
  if (!outPath.includes('index.js')) {
    outPath = outPath.replace('.js', '');
  }
  outPath = outPath.replace(fmtPath(CFG.static.sourceDir), fmtPath(CFG.static.outputDir));

  if (outPath.includes('/index.html')) {
    if (getSsrEnabled(CFG)) {
      let imports = [...getSsrImports(CFG), ...endpointSsrImports];
      indexSrc = await wcSsr(indexSrc, { imports });
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
  let indexArr = findFiles(CFG.static.sourceDir, ['index.', '.js'], []);
  Log.info('Processing JSDA entries:', indexArr);
  await Promise.all(indexArr.map(processIndex));
}
