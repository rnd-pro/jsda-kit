import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import CFG from '../../cfg/CFG.js';
import { build } from '../../node/build.js';

let tmpRoot;
let originalCfg;

/**
 * @param {String} filePath
 * @param {String} content
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

function snapshotCfg() {
  return {
    static: { ...CFG.static },
    minify: {
      ...CFG.minify,
      exclude: [...CFG.minify.exclude],
    },
    bundle: {
      ...CFG.bundle,
      exclude: [...CFG.bundle.exclude],
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
  CFG.bundle = originalCfg.bundle;
  CFG.sitemap = originalCfg.sitemap;
  CFG.log = originalCfg.log;
}

describe('build minify config', () => {
  beforeEach(() => {
    originalCfg = snapshotCfg();
    tmpRoot = fs.mkdtempSync(path.join(process.cwd(), 'tmp-jsda-build-minify-'));
    CFG.log = false;
    CFG.sitemap = typeof CFG.sitemap === 'object' && CFG.sitemap
      ? { ...CFG.sitemap, enabled: false }
      : { enabled: false };
  });

  afterEach(() => {
    restoreCfg();
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('should skip SSG minification when source paths match exclude patterns', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'index.html.js'), `export default '<main>   <p> Hello </p>   </main>';\n`);
    writeFixture(path.join(srcDir, 'styles/index.css.js'), `export default ':root {\\n  --space:  16px;\\n  color:   rebeccapurple;\\n}\\n';\n`);
    writeFixture(path.join(srcDir, 'app/index.js'), `
      const html = String.raw;
      let tagged = html\`
        <section>
          <h1> Hello </h1>
        </section>
      \`;
      console.log(tagged);
    `);

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);
    CFG.minify.exclude = ['index.html.js', 'styles/index.css.js', 'app/index.js'];

    await build();

    assert.equal(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'), '<main>   <p> Hello </p>   </main>');
    assert.equal(fs.readFileSync(path.join(distDir, 'styles/index.css'), 'utf8'), ':root {\n  --space:  16px;\n  color:   rebeccapurple;\n}\n');
    assert.match(fs.readFileSync(path.join(distDir, 'app/index.js'), 'utf8'), /`\n\s*<section>\n\s*<h1> Hello <\/h1>\n\s*<\/section>\n\s*`/);
  });
});
