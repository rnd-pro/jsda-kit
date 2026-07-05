import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import CFG, { getSsrEnabled, getSsrImports, getSsrNonce, isMinifyEnabled } from '../cfg/CFG.js';
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

/** @type {Promise<any> | null} */
let pdfBrowserPromise = null;
let importOptional = Function('specifier', 'return import(specifier)');

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
 * @param {String} pattern
 * @returns {RegExp}
 */
function globToRegExp(pattern) {
  let result = '';
  for (let i = 0; i < pattern.length; i++) {
    let char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        result += '.*';
        i++;
      } else {
        result += '[^/]*';
      }
    } else if (char === '?') {
      result += '[^/]';
    } else if ('\\^$+?.()|{}[]'.includes(char)) {
      result += '\\' + char;
    } else {
      result += char;
    }
  }
  return new RegExp('^' + result + '$');
}

/**
 * @param {String} filePath
 * @returns {String}
 */
function relativeSourcePath(filePath) {
  return path.relative(
    path.resolve(String(CFG.static.sourceDir)),
    path.resolve(String(filePath)),
  ).split(path.sep).join('/');
}

/**
 * @param {String} relPath
 * @returns {Boolean}
 */
function hasCopyPathSegment(relPath) {
  return relPath.split('/').some((segment) => segment.startsWith('copy-'));
}

/**
 * @param {String} filePath
 * @returns {Boolean}
 */
function isInsideCopyFolder(filePath) {
  return hasCopyPathSegment(relativeSourcePath(filePath));
}

/**
 * @returns {String[]}
 */
function getEntryPatterns() {
  return CFG.static.entryPatterns || ['index.js', 'index.*.js'];
}

/**
 * @param {String} filePath
 * @param {String} pattern
 * @returns {Boolean}
 */
function matchesEntryPattern(filePath, pattern) {
  let normalizedPattern = pattern.split(path.sep).join('/');
  let target = normalizedPattern.includes('/')
    ? relativeSourcePath(filePath)
    : fileNameFromPath(filePath);
  return globToRegExp(normalizedPattern).test(target);
}

/**
 * @param {String} filePath
 * @returns {Boolean}
 */
function isStaticEntry(filePath) {
  if (isInsideCopyFolder(filePath)) return false;
  if (!fileNameFromPath(filePath).endsWith('.js')) return false;
  return getEntryPatterns().some((pattern) => matchesEntryPattern(filePath, pattern));
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
 * @returns {Boolean}
 */
function isPdfEntry(filePath) {
  return getOutputPath(filePath, { pdf: true }).endsWith('.pdf');
}

/**
 * @param {String} filePath
 * @param {{ pdf?: Boolean }} [options]
 * @returns {String}
 */
function getOutputPath(filePath, options = {}) {
  let relPath = relativeSourcePath(filePath);
  let outPath = relPath;
  if (!isIndexJsBundle(filePath) && outPath.endsWith('.js')) {
    outPath = outPath.slice(0, -'.js'.length);
  }
  let outputDir = options.pdf && CFG.static.pdf?.outputDir
    ? String(CFG.static.pdf.outputDir)
    : String(CFG.static.outputDir);
  return fmtPath(path.join(outputDir, outPath).split(path.sep).join('/'));
}

/**
 * @param {String} outPath
 * @returns {String}
 */
function outputType(outPath) {
  return outPath.split('.').pop() || '';
}

/**
 * @returns {String[]}
 */
function getStaticEntries() {
  return (findFiles(CFG.static.sourceDir, ['.js'], []) || []).filter(isStaticEntry);
}

/**
 * @returns {Promise<any>}
 */
async function getPdfBrowser() {
  if (!pdfBrowserPromise) {
    pdfBrowserPromise = (async () => {
      try {
        let puppeteer = await importOptional('puppeteer');
        return await puppeteer.default.launch(CFG.static.pdf?.launchOptions || {});
      } catch (error) {
        pdfBrowserPromise = null;
        let code = error && typeof error === 'object' && 'code' in error
          ? /** @type {{ code?: string }} */ (error).code
          : '';
        if (code === 'ERR_MODULE_NOT_FOUND') {
          throw new Error('Puppeteer is required to generate PDF entries. Install it in your project with: npm install -D puppeteer');
        }
        throw error;
      }
    })();
  }
  return pdfBrowserPromise;
}

async function closePdfBrowser() {
  if (!pdfBrowserPromise) return;
  let browserPromise = pdfBrowserPromise;
  pdfBrowserPromise = null;
  try {
    let browser = await browserPromise;
    await browser.close();
  } catch {
    // Preserve the original render/import failure.
  }
}

/**
 * @param {String} html
 * @param {Object} [endpointPdfOptions]
 * @returns {Promise<Buffer>}
 */
async function htmlToPdf(html, endpointPdfOptions = {}) {
  let browser = await getPdfBrowser();
  let page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: CFG.static.pdf?.waitUntil || 'load' });
    let pdfOptions = {
      printBackground: true,
      ...(CFG.static.pdf?.options || {}),
      ...endpointPdfOptions,
    };
    return Buffer.from(await page.pdf(pdfOptions));
  } finally {
    await page.close();
  }
}

/**
 * @param {String} filePath
 * @returns {Promise<String | { content: String, ssrImports: String[], pdfOptions?: Object } | null>}
 */
async function impWa(filePath) {
  let result = null;
  if (isIndexJsBundle(filePath)) {
    let minify = isMinifyEnabled(CFG, 'js', filePath);
    let buildResult = await esbuild.build({
      entryPoints: [filePath],
      outfile: fileNameFromPath(filePath),
      format: 'esm',
      bundle: true,
      minify,
      sourcemap: false,
      external: getExternalDeps(),
      target: 'esnext',
      write: false,
      plugins: minify ? [minifyTemplates({ taggedOnly: true })] : [],
    });
    result = buildResult.outputFiles[0].text;
  } else {
    let processRoot = process.cwd();
    let mdlUrl = pathToFileURL(path.resolve(processRoot, filePath)).href;
    try {
      let mdl = await import(mdlUrl);
      let str = mdl.default;
      if (str?.constructor === Function) {
        str = await str();
      }
      result = {
        content: str,
        ssrImports: mdl.ssrImports || [],
        pdfOptions: mdl.pdfOptions || {},
      };
    } catch (e) {
      Log.err(e);
    }
  }
  return result;
}

/**
 * @param {String} entryPath
 * @param {Set<String>} writtenPaths
 * @param {{ pdf?: Boolean }} [options]
 */
async function processEntry(entryPath, writtenPaths, options = {}) {
  let imported = await impWa(entryPath);
  if (!imported) {
    return;
  }

  /** @type {String | Buffer} */
  let indexSrc;
  /** @type {String[]} */
  let endpointSsrImports = [];
  /** @type {Object} */
  let endpointPdfOptions = {};

  if (typeof imported === 'object' && imported.content !== undefined) {
    indexSrc = imported.content;
    endpointSsrImports = imported.ssrImports || [];
    endpointPdfOptions = imported.pdfOptions || {};
  } else {
    indexSrc = /** @type {string} */ (imported);
  }

  let outPath = getOutputPath(entryPath, options);
  let type = outputType(outPath);

  if (type === 'html' || type === 'pdf') {
    if (getSsrEnabled(CFG)) {
      let imports = [...getSsrImports(CFG), ...endpointSsrImports];
      let nonce = getSsrNonce(CFG);
      let ssrOptions = nonce ? { nonce } : {};
      indexSrc = await wcSsr(String(indexSrc), { imports, ssrOptions });
    }
    if (type === 'html' && isMinifyEnabled(CFG, 'html', [entryPath, outPath])) {
      indexSrc = htmlMin(String(indexSrc)).toString();
    }
  }

  if (type === 'css' && isMinifyEnabled(CFG, 'css', [entryPath, outPath])) {
    indexSrc = cssMin(String(indexSrc));
  }

  if (type === 'pdf') {
    indexSrc = await htmlToPdf(String(indexSrc), endpointPdfOptions);
  }

  if (writtenPaths.has(outPath)) {
    throw new Error('Output path conflict: ' + outPath);
  }

  checkDirExists(outPath);
  fs.writeFileSync(outPath, indexSrc);
  writtenPaths.add(outPath);
  Log.info('Output file created:', outPath);
}

/**
 * @param {String} dirPath
 * @param {String[]} collection
 * @returns {String[]}
 */
function collectFiles(dirPath, collection = []) {
  if (!fs.existsSync(dirPath)) return collection;
  let stat = fs.lstatSync(dirPath);
  if (stat.isFile()) {
    collection.push(dirPath);
    return collection;
  }
  for (let name of fs.readdirSync(dirPath)) {
    collectFiles(path.join(dirPath, name), collection);
  }
  return collection;
}

/**
 * @param {String} dirPath
 * @param {String[]} collection
 * @returns {String[]}
 */
function collectCopyDirs(dirPath, collection = []) {
  if (!fs.existsSync(dirPath)) return collection;
  for (let name of fs.readdirSync(dirPath)) {
    let filePath = path.join(dirPath, name);
    if (!fs.lstatSync(filePath).isDirectory()) continue;
    if (name.startsWith('copy-')) {
      collection.push(filePath);
    } else {
      collectCopyDirs(filePath, collection);
    }
  }
  return collection;
}

/**
 * @param {String} copyDir
 * @returns {String}
 */
function copyDirOutputBase(copyDir) {
  let relPath = relativeSourcePath(copyDir)
    .split('/')
    .map((segment) => segment.startsWith('copy-') ? segment.slice('copy-'.length) : segment)
    .join('/');
  return path.join(CFG.static.outputDir, relPath);
}

/**
 * @param {String} srcPath
 * @param {String} outPath
 * @param {Set<String>} writtenPaths
 */
function copyFileToOutput(srcPath, outPath, writtenPaths) {
  let normalizedOut = fmtPath(outPath.split(path.sep).join('/'));
  if (writtenPaths.has(normalizedOut)) {
    throw new Error('Output path conflict: ' + normalizedOut);
  }
  checkDirExists(normalizedOut);
  fs.copyFileSync(srcPath, normalizedOut);
  writtenPaths.add(normalizedOut);
  Log.info('Static file copied:', normalizedOut);
}

/**
 * @param {String} from
 * @param {String} to
 * @param {Set<String>} writtenPaths
 * @param {Boolean} [toDir]
 */
function copyPath(from, to, writtenPaths, toDir = false) {
  if (!fs.existsSync(from)) {
    throw new Error('Static copy source not found: ' + from);
  }
  let stat = fs.lstatSync(from);
  if (stat.isFile()) {
    let outPath = toDir || (fs.existsSync(to) && fs.lstatSync(to).isDirectory())
      ? path.join(to, path.basename(from))
      : to;
    copyFileToOutput(from, outPath, writtenPaths);
    return;
  }
  for (let filePath of collectFiles(from)) {
    let relPath = path.relative(from, filePath);
    copyFileToOutput(filePath, path.join(to, relPath), writtenPaths);
  }
}

/**
 * @param {Set<String>} writtenPaths
 */
function copyConfiguredStaticFiles(writtenPaths) {
  for (let rule of CFG.static.copy || []) {
    let from = String(rule.from);
    let ruleTo = String(rule.to || './');
    let to = path.join(String(CFG.static.outputDir), ruleTo);
    let toDir = ruleTo === '.' || ruleTo === './' || ruleTo.endsWith('/');
    copyPath(from, to, writtenPaths, toDir);
  }
}

/**
 * @param {Set<String>} writtenPaths
 */
function copyConventionStaticFiles(writtenPaths) {
  let copyDirs = collectCopyDirs(String(CFG.static.sourceDir));
  for (let copyDir of copyDirs) {
    copyPath(copyDir, copyDirOutputBase(copyDir), writtenPaths);
  }
}

/**
 * @param {Set<String>} writtenPaths
 */
function copyStaticFiles(writtenPaths) {
  copyConfiguredStaticFiles(writtenPaths);
  copyConventionStaticFiles(writtenPaths);
}

/**
 * @param {{ pdf?: Boolean }} [options]
 */
export async function build(options = {}) {
  let writtenPaths = new Set();
  let entryArr = getStaticEntries();
  let regularEntries = entryArr.filter((entryPath) => !isPdfEntry(entryPath));
  let pdfEntries = options.pdf ? entryArr.filter(isPdfEntry) : [];
  Log.info('Processing JSDA entries:', regularEntries);
  await Promise.all(regularEntries.map((entryPath) => processEntry(entryPath, writtenPaths)));
  if (options.pdf) {
    Log.info('Processing JSDA PDF entries:', pdfEntries);
    try {
      for (let pdfEntry of pdfEntries) {
        await processEntry(pdfEntry, writtenPaths, { pdf: true });
      }
    } finally {
      await closePdfBrowser();
    }
  }
  copyStaticFiles(writtenPaths);
  await generateSitemap();
}

export {
  copyDirOutputBase,
  getOutputPath,
  globToRegExp,
  isInsideCopyFolder,
  isPdfEntry,
  isStaticEntry,
};
