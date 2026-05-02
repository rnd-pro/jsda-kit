import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { buildSitemapXml, normalizePath, isExcluded } from '../../node/sitemap.js';
import { findFiles } from '../../node/findFiles.js';

/**
 * @param {String} base
 * @param {String[]} files
 */
function createFixtures(base, files) {
  for (let f of files) {
    let full = path.join(base, f);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, '<!DOCTYPE html><html></html>');
  }
}

describe('normalizePath', () => {
  it('should strip index.html from root', () => {
    assert.equal(normalizePath('/index.html'), '/');
  });

  it('should strip index.html from nested path', () => {
    assert.equal(normalizePath('/about/index.html'), '/about/');
  });

  it('should keep non-index html paths unchanged', () => {
    assert.equal(normalizePath('/404.html'), '/404.html');
  });
});

describe('isExcluded', () => {
  it('should match substring patterns', () => {
    assert.equal(isExcluded('/admin/dashboard/', ['/admin/']), true);
  });

  it('should not match unrelated paths', () => {
    assert.equal(isExcluded('/about/', ['/admin/']), false);
  });

  it('should return false for empty exclude list', () => {
    assert.equal(isExcluded('/anything/', []), false);
  });

  it('should match any pattern from the list', () => {
    assert.equal(isExcluded('/secret/', ['/admin/', '/secret/']), true);
  });
});

describe('findFiles for HTML discovery', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-sitemap-'));
    createFixtures(tmpDir, [
      'index.html',
      'about/index.html',
      'blog/post-1/index.html',
      'style.css',
      'app/index.js',
    ]);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should find all html files', () => {
    let files = findFiles(tmpDir, ['.html'], []);
    assert.equal(files.length, 3);
  });

  it('should not include non-html files', () => {
    let files = findFiles(tmpDir, ['.html'], []);
    assert.ok(!files.some((f) => f.endsWith('.css')));
    assert.ok(!files.some((f) => f.endsWith('.js')));
  });

  it('should convert to relative URL paths', () => {
    let files = findFiles(tmpDir, ['.html'], []);
    let urls = files.map((f) => '/' + path.relative(tmpDir, f).split(path.sep).join('/'));
    for (let u of urls) {
      assert.ok(u.startsWith('/'), `Expected ${u} to start with /`);
    }
  });
});

describe('buildSitemapXml', () => {
  it('should generate valid XML structure', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/', lastmod: '2026-01-01' },
    ]);
    assert.ok(xml.startsWith('<?xml version="1.0"'));
    assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
    assert.ok(xml.includes('</urlset>'));
  });

  it('should include loc and lastmod', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/about/', lastmod: '2026-05-01' },
    ]);
    assert.ok(xml.includes('<loc>https://example.com/about/</loc>'));
    assert.ok(xml.includes('<lastmod>2026-05-01</lastmod>'));
  });

  it('should include changefreq when provided', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/', lastmod: '2026-01-01', changefreq: 'weekly' },
    ]);
    assert.ok(xml.includes('<changefreq>weekly</changefreq>'));
  });

  it('should include priority when provided', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/', lastmod: '2026-01-01', priority: '0.8' },
    ]);
    assert.ok(xml.includes('<priority>0.8</priority>'));
  });

  it('should omit changefreq and priority when not provided', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/', lastmod: '2026-01-01' },
    ]);
    assert.ok(!xml.includes('<changefreq>'));
    assert.ok(!xml.includes('<priority>'));
  });

  it('should handle multiple entries', () => {
    let xml = buildSitemapXml([
      { loc: 'https://example.com/', lastmod: '2026-01-01' },
      { loc: 'https://example.com/about/', lastmod: '2026-01-02' },
      { loc: 'https://example.com/blog/', lastmod: '2026-01-03' },
    ]);
    assert.equal((xml.match(/<url>/g) || []).length, 3);
    assert.equal((xml.match(/<\/url>/g) || []).length, 3);
  });

  it('should handle empty entries', () => {
    let xml = buildSitemapXml([]);
    assert.ok(xml.includes('<urlset'));
    assert.ok(xml.includes('</urlset>'));
    assert.ok(!xml.includes('<url>'));
  });
});

describe('config helpers', () => {
  it('getSitemapEnabled should handle boolean true', async () => {
    let { getSitemapEnabled } = await import('../../cfg/CFG.js');
    assert.equal(getSitemapEnabled({ sitemap: true }), true);
  });

  it('getSitemapEnabled should handle boolean false', async () => {
    let { getSitemapEnabled } = await import('../../cfg/CFG.js');
    assert.equal(getSitemapEnabled({ sitemap: false }), false);
  });

  it('getSitemapEnabled should handle object with enabled', async () => {
    let { getSitemapEnabled } = await import('../../cfg/CFG.js');
    assert.equal(getSitemapEnabled({ sitemap: { enabled: true } }), true);
    assert.equal(getSitemapEnabled({ sitemap: { enabled: false } }), false);
  });

  it('getSitemapEnabled should return false when missing', async () => {
    let { getSitemapEnabled } = await import('../../cfg/CFG.js');
    assert.equal(getSitemapEnabled({}), false);
  });

  it('getSitemapConfig should return defaults for boolean config', async () => {
    let { getSitemapConfig } = await import('../../cfg/CFG.js');
    let cfg = getSitemapConfig({ sitemap: true });
    assert.equal(cfg.baseUrl, '');
    assert.equal(cfg.filename, 'sitemap.xml');
    assert.deepEqual(cfg.exclude, []);
  });

  it('getSitemapConfig should merge object config', async () => {
    let { getSitemapConfig } = await import('../../cfg/CFG.js');
    let cfg = getSitemapConfig({ sitemap: { baseUrl: 'https://test.com', exclude: ['/admin/'] } });
    assert.equal(cfg.baseUrl, 'https://test.com');
    assert.deepEqual(cfg.exclude, ['/admin/']);
    assert.equal(cfg.filename, 'sitemap.xml');
  });
});
