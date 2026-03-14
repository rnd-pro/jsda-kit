import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deepMerge } from '../../cfg/CFG.js';

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
  });
});
