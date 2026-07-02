import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deepMerge, getMarkdownExternalLinksConfig, isMinifyEnabled } from '../../cfg/CFG.js';

describe('deepMerge', () => {
  it('should merge flat objects', () => {
    let result = deepMerge({ a: 1 }, { b: 2 });
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it('should override scalar values', () => {
    let result = deepMerge({ a: 1 }, { a: 2 });
    assert.equal(result.a, 2);
  });

  it('should deep merge nested objects', () => {
    let target = {
      cache: { inMemory: true, exclude: [] },
      port: 3000,
    };
    let source = {
      cache: { inMemory: false },
    };
    let result = deepMerge(target, source);
    assert.equal(result.cache.inMemory, false);
    assert.deepEqual(result.cache.exclude, []);
    assert.equal(result.port, 3000);
  });

  it('should not mutate the original target', () => {
    let target = { nested: { a: 1 } };
    let source = { nested: { b: 2 } };
    deepMerge(target, source);
    assert.equal(target.nested.b, undefined);
  });

  it('should replace arrays instead of merging', () => {
    let result = deepMerge({ items: [1, 2] }, { items: [3] });
    assert.deepEqual(result.items, [3]);
  });

  it('should handle null values in source', () => {
    let result = deepMerge({ a: { b: 1 } }, { a: null });
    assert.equal(result.a, null);
  });
});

describe('CFG defaults', () => {
  it('should load default config when project.cfg.js is missing', async () => {
    let { default: cfg } = await import('../../cfg/CFG.js');
    assert.equal(cfg.dynamic.port, 3000);
    assert.equal(cfg.minify.html, true);
    assert.equal(cfg.log, true);
  });

  it('should have all expected top-level keys', async () => {
    let { default: cfg } = await import('../../cfg/CFG.js');
    let keys = Object.keys(cfg);
    assert.ok(keys.includes('dynamic'));
    assert.ok(keys.includes('static'));
    assert.ok(keys.includes('minify'));
    assert.ok(keys.includes('bundle'));
    assert.ok(keys.includes('importmap'));
    assert.ok(keys.includes('markdown'));
  });
});

describe('getMarkdownExternalLinksConfig', () => {
  it('should return markdown external link defaults', () => {
    let cfg = getMarkdownExternalLinksConfig({});
    assert.deepEqual(cfg, {
      enabled: true,
      target: '_blank',
      rel: 'noopener noreferrer',
      exclude: [],
    });
  });

  it('should allow disabling external link attributes globally', () => {
    let cfg = getMarkdownExternalLinksConfig({
      markdown: {
        externalLinks: {
          enabled: false,
        },
      },
    });
    assert.equal(cfg.enabled, false);
    assert.equal(cfg.target, '_blank');
    assert.equal(cfg.rel, 'noopener noreferrer');
  });

  it('should read target, rel, and exclude overrides', () => {
    let cfg = getMarkdownExternalLinksConfig({
      markdown: {
        externalLinks: {
          target: '_top',
          rel: 'external',
          exclude: ['example.com'],
        },
      },
    });
    assert.deepEqual(cfg, {
      enabled: true,
      target: '_top',
      rel: 'external',
      exclude: ['example.com'],
    });
  });
});

describe('isMinifyEnabled', () => {
  it('should match minify exclude entries as path patterns', () => {
    let cfg = {
      minify: {
        js: true,
        css: true,
        html: true,
        svg: true,
        exclude: ['vendor/'],
      },
    };
    assert.equal(isMinifyEnabled(cfg, 'js', './src/vendor/index.js'), false);
    assert.equal(isMinifyEnabled(cfg, 'js', './src/app/index.js'), true);
  });

  it('should match minify exclude patterns against any provided path', () => {
    let cfg = {
      minify: {
        js: true,
        css: true,
        html: true,
        svg: true,
        exclude: ['dist/admin/'],
      },
    };
    assert.equal(isMinifyEnabled(cfg, 'html', ['./src/admin/index.html.js', './dist/admin/index.html']), false);
  });
});
