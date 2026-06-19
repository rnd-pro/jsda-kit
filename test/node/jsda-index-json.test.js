import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { once } from 'events';
import CFG from '../../cfg/CFG.js';
import { build } from '../../node/build.js';
import { createServer } from '../../server/JSDAServer.js';

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
    dynamic: {
      ...CFG.dynamic,
      cache: { ...CFG.dynamic.cache },
    },
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
  CFG.dynamic = originalCfg.dynamic;
  CFG.minify = originalCfg.minify;
  CFG.bundle = originalCfg.bundle;
  CFG.sitemap = originalCfg.sitemap;
  CFG.log = originalCfg.log;
}

/**
 * @param {import('http').Server} server
 * @returns {number}
 */
function getServerPort(server) {
  let address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Expected server to listen on a TCP port');
  }
  return address.port;
}

describe('index.json.js entries', () => {
  beforeEach(() => {
    originalCfg = snapshotCfg();
    tmpRoot = fs.mkdtempSync(path.join(process.cwd(), 'tmp-jsda-index-json-'));
    CFG.log = false;
    CFG.sitemap = typeof CFG.sitemap === 'object' && CFG.sitemap
      ? { ...CFG.sitemap, enabled: false }
      : { enabled: false };
  });

  afterEach(() => {
    restoreCfg();
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('builds index.json.js to index.json instead of index.js output', async () => {
    let srcDir = path.join(tmpRoot, 'src/static');
    let distDir = path.join(tmpRoot, 'dist');
    writeFixture(path.join(srcDir, 'index.json.js'), `export default '{"ok":true}';\n`);
    writeFixture(path.join(srcDir, 'app/index.js'), `console.log('bundle');\n`);

    CFG.static.sourceDir = relPath(srcDir);
    CFG.static.outputDir = relPath(distDir);

    await build();

    assert.equal(fs.readFileSync(path.join(distDir, 'index.json'), 'utf8'), '{"ok":true}');
    assert.equal(fs.existsSync(path.join(distDir, 'index.json.js')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'indexon.js')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'app/index.js')), true);
  });

  it('serves index.json.js as a JSON JSDA endpoint', async () => {
    let srcDir = path.join(tmpRoot, 'src');
    writeFixture(path.join(srcDir, 'index.json.js'), `export default '{"ok":true}';\n`);

    CFG.dynamic.baseDir = relPath(srcDir) + '/';
    CFG.dynamic.cache.inMemory = false;

    let server = createServer({ port: 0 });
    await once(server, 'listening');

    try {
      let port = getServerPort(server);
      let res = await fetch(`http://127.0.0.1:${port}/index.json.js`);
      assert.equal(res.status, 200);
      assert.match(res.headers.get('content-type'), /^application\/json/);
      assert.equal(await res.text(), '{"ok":true}');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('serves index.json.js with search parameters after the filename', async () => {
    let srcDir = path.join(tmpRoot, 'src');
    writeFixture(path.join(srcDir, 'index.json.js'), `export default '{"ok":true}';\n`);

    CFG.dynamic.baseDir = relPath(srcDir) + '/';
    CFG.dynamic.cache.inMemory = false;

    let server = createServer({ port: 0 });
    await once(server, 'listening');

    try {
      let port = getServerPort(server);
      let res = await fetch(`http://127.0.0.1:${port}/index.json.js?version=1&debug=true`);
      assert.equal(res.status, 200);
      assert.match(res.headers.get('content-type'), /^application\/json/);
      assert.equal(await res.text(), '{"ok":true}');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
