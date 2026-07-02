import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import CFG from '../../cfg/CFG.js';
import { cssBuild, jsBuild } from '../../server/build-asset.js';

let tmpDir;
let originalCfg;

/**
 * @param {String} fileName
 * @param {String} content
 * @returns {String}
 */
function writeAsset(fileName, content) {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-build-asset-'));
  let entry = path.join(tmpDir, fileName);
  fs.writeFileSync(entry, content);
  return entry;
}

/**
 * @param {String} content
 * @returns {String}
 */
function writeEntry(content) {
  return writeAsset('index.js', content);
}

function snapshotCfg() {
  return {
    minify: {
      ...CFG.minify,
      exclude: [...CFG.minify.exclude],
    },
    bundle: {
      ...CFG.bundle,
      exclude: [...CFG.bundle.exclude],
    },
  };
}

function restoreCfg() {
  CFG.minify = originalCfg.minify;
  CFG.bundle = originalCfg.bundle;
}

describe('jsBuild', () => {
  beforeEach(() => {
    originalCfg = snapshotCfg();
  });

  afterEach(() => {
    restoreCfg();
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = undefined;
  });

  it('should minify tagged HTML template literals only', async () => {
    let entry = writeEntry(`
      const html = String.raw;
      let tagged = html\`
        <section>
          <h1> Hello </h1>
          <p class="intro"> World </p>
        </section>
      \`;
      let untagged = \`
        <section>
          <h1> Hello </h1>
          <p class="intro"> World </p>
        </section>
      \`;
      console.log(tagged, untagged);
    `);

    let result = await jsBuild(entry);

    assert.match(result, /<section><h1> Hello <\/h1><p class="intro"> World <\/p><\/section>/);
    assert.match(result, /`\n\s*<section>\n\s*<h1> Hello <\/h1>\n\s*<p class="intro"> World <\/p>\n\s*<\/section>\n\s*`/);
  });

  it('should minify tagged CSS template literals', async () => {
    let entry = writeEntry(`
      const css = String.raw;
      let rootStyles = css\`
        :root {
          --space:  16px;
          color:   rebeccapurple;
        }
      \`;
      console.log(rootStyles);
    `);

    let result = await jsBuild(entry);

    assert.match(result, /` :root { --space: 16px; color: rebeccapurple; } `/);
  });

  it('should skip JS minification when the entry matches a minify exclude pattern', async () => {
    let entry = writeEntry(`
      const html = String.raw;
      let tagged = html\`
        <section>
          <h1> Hello </h1>
        </section>
      \`;
      console.log(tagged);
    `);
    CFG.minify.exclude = [path.basename(tmpDir)];

    let result = await jsBuild(entry);

    assert.match(result, /`\n\s*<section>\n\s*<h1> Hello <\/h1>\n\s*<\/section>\n\s*`/);
  });

  it('should skip CSS minification when the entry matches a minify exclude pattern', () => {
    let entry = writeAsset('index.css', `
      :root {
        --space:  16px;
        color:   rebeccapurple;
      }
    `);
    CFG.minify.exclude = [path.basename(tmpDir)];

    let result = cssBuild(entry);

    assert.match(result, /:root {\n  --space: 16px;\n  color: rebeccapurple;\n}/);
  });
});
