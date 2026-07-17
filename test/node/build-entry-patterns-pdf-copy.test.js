import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import CFG from '../../cfg/CFG.js';
import { build, getOutputPath } from '../../node/build.js';

let tmpRoot;
let originalCfg;

/**
 * @param {String} filePath
 * @param {String | Buffer} content
 */
function writeFixture(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

/**
 * @param {String} filePath
 * @returns {String}
 */
function relPath(filePath) {
  return './' + path.relative(process.cwd(), filePath).split(path.sep).join('/');
}

/**
 * @param {String} filePath
 * @returns {String}
 */
function readFixture(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function snapshotCfg() {
  return {
    static: {
      ...CFG.static,
      entryPatterns: [...CFG.static.entryPatterns],
      exclude: [...CFG.static.exclude],
      copy: CFG.static.copy.map((rule) => ({ ...rule })),
      pdf: {
        ...CFG.static.pdf,
        launchOptions: { ...CFG.static.pdf.launchOptions },
        options: {
          ...CFG.static.pdf.options,
          margin: { .../** @type {Object} */ (CFG.static.pdf.options.margin) },
        },
      },
    },
    minify: {
      ...CFG.minify,
      exclude: [...CFG.minify.exclude],
    },
    sitemap: typeof CFG.sitemap === 'object' && CFG.sitemap
      ? { ...CFG.sitemap, exclude: [...CFG.sitemap.exclude] }
      : CFG.sitemap,
    log: CFG.log,
  };
}

function restoreCfg() {
  CFG.static = originalCfg.static;
  CFG.minify = originalCfg.minify;
  CFG.sitemap = originalCfg.sitemap;
  CFG.log = originalCfg.log;
}

describe('SSG entry patterns, PDFs, and static copy', () => {
  beforeEach(() => {
    originalCfg = snapshotCfg();
    tmpRoot = fs.mkdtempSync(path.join(process.cwd(), 'tmp-jsda-entry-patterns-'));
    CFG.log = false;
    CFG.minify.html = false;
    CFG.minify.css = false;
    CFG.sitemap = typeof CFG.sitemap === 'object' && CFG.sitemap
      ? { ...CFG.sitemap, enabled: false }
      : { enabled: false };
  });

  afterEach(() => {
    restoreCfg();
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('builds configured non-index entries and skips PDF entries in regular build', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'index.html.js'), `export default '<main>Index</main>';\n`);
    writeFixture(path.join(srcDir, 'about.html.js'), `export default '<main>About</main>';\n`);
    writeFixture(path.join(srcDir, 'feed.xml.js'), `export default '<feed></feed>';\n`);
    writeFixture(path.join(srcDir, 'report.pdf.js'), `export default '<h1>Report</h1>';\n`);

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['index.js', 'index.*.js', '*.html.js', '*.xml.js', '*.pdf.js'];

    await build();

    assert.equal(readFixture(path.join(distDir, 'index.html')), '<main>Index</main>');
    assert.equal(readFixture(path.join(distDir, 'about.html')), '<main>About</main>');
    assert.equal(readFixture(path.join(distDir, 'feed.xml')), '<feed></feed>');
    assert.equal(fs.existsSync(path.join(distDir, 'report.pdf')), false);
  });

  it('copies zero-config copy-* folders without processing JSDA files inside them', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'copy-assets/logo.txt'), 'logo');
    writeFixture(path.join(srcDir, 'copy-assets/index.html.js'), 'raw jsda-looking file');
    writeFixture(path.join(srcDir, 'docs/copy-pdf/report.pdf'), 'pdf bytes');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['*.html.js'];

    await build();

    assert.equal(readFixture(path.join(distDir, 'assets/logo.txt')), 'logo');
    assert.equal(readFixture(path.join(distDir, 'assets/index.html.js')), 'raw jsda-looking file');
    assert.equal(fs.existsSync(path.join(distDir, 'assets/index.html')), false);
    assert.equal(readFixture(path.join(distDir, 'docs/pdf/report.pdf')), 'pdf bytes');
  });

  it('skips entries matching static.exclude file and folder patterns', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'index.html.js'), `export default '<main>Index</main>';\n`);
    writeFixture(path.join(srcDir, 'drafts/index.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'pages/private/index.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'root.draft.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'pages/article.draft.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'pages/skip.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'copy-assets/public.txt'), 'public');
    writeFixture(path.join(srcDir, 'copy-assets/private.txt'), 'private');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['*.html.js'];
    CFG.static.exclude = [
      'drafts',
      'pages/private/**',
      '**/*.draft.html.js',
      'skip.html.js',
      'private.txt',
    ];

    await build();

    assert.equal(readFixture(path.join(distDir, 'index.html')), '<main>Index</main>');
    assert.equal(fs.existsSync(path.join(distDir, 'drafts/index.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'pages/private/index.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'root.draft.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'pages/article.draft.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'pages/skip.html')), false);
    assert.equal(readFixture(path.join(distDir, 'assets/public.txt')), 'public');
    assert.equal(fs.existsSync(path.join(distDir, 'assets/private.txt')), false);
  });

  it('skips exclude-* folders without configuration', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'index.html.js'), `export default '<main>Index</main>';\n`);
    writeFixture(path.join(srcDir, 'exclude-drafts/index.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'pages/exclude-preview/index.html.js'), 'this is intentionally invalid JavaScript');
    writeFixture(path.join(srcDir, 'copy-assets/public.txt'), 'public');
    writeFixture(path.join(srcDir, 'copy-assets/exclude-private/secret.txt'), 'secret');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['*.html.js'];
    CFG.static.exclude = [];

    await build();

    assert.equal(readFixture(path.join(distDir, 'index.html')), '<main>Index</main>');
    assert.equal(readFixture(path.join(distDir, 'assets/public.txt')), 'public');
    assert.equal(fs.existsSync(path.join(distDir, 'exclude-drafts/index.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'pages/exclude-preview/index.html')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'assets/exclude-private/secret.txt')), false);
  });

  it('copies explicit static copy rules', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let publicDir = path.join(tmpRoot, 'public-files');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(publicDir, 'downloads/catalog.pdf'), 'catalog');
    writeFixture(path.join(publicDir, 'favicon.ico'), 'icon');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.copy = [
      { from: relPath(publicDir), to: './static' },
      { from: relPath(path.join(publicDir, 'favicon.ico')), to: './icons/' },
    ];

    await build();

    assert.equal(readFixture(path.join(distDir, 'static/downloads/catalog.pdf')), 'catalog');
    assert.equal(readFixture(path.join(distDir, 'icons/favicon.ico')), 'icon');
  });

  it('fails when copied files conflict with generated outputs', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let publicDir = path.join(tmpRoot, 'public-files');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'about.html.js'), `export default '<main>About</main>';\n`);
    writeFixture(path.join(publicDir, 'about.html'), 'copied about');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['*.html.js'];
    CFG.static.copy = [{ from: path.join(publicDir, 'about.html'), to: './about.html' }];

    await assert.rejects(build(), /Output path conflict:/);
  });

  it('maps PDF output to static.pdf.outputDir when configured', () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    let pdfDir = path.join(srcDir, 'copy-pdf');
    let pdfEntry = path.join(srcDir, 'reports/annual.pdf.js');

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.pdf.outputDir = relPath(pdfDir);

    assert.equal(
      getOutputPath(pdfEntry, { pdf: true }),
      relPath(path.join(pdfDir, 'reports/annual.pdf')),
    );
    assert.equal(
      getOutputPath(pdfEntry),
      relPath(path.join(distDir, 'reports/annual.pdf')),
    );
  });

  it('reports missing Puppeteer only for PDF-enabled builds', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'report.pdf.js'), `export default '<h1>Report</h1>';\n`);

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.static.entryPatterns = ['*.pdf.js'];

    await build();
    assert.equal(fs.existsSync(path.join(distDir, 'report.pdf')), false);

    await assert.rejects(
      build({ pdf: true }),
      /Puppeteer is required to generate PDF entries/,
    );
  });
});
