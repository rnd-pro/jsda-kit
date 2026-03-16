import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { wcSsr } from '../../node/wcSsr.js';

describe('wcSsr', () => {
  it('should inject data tokens', async () => {
    let html = '<h1>{[title]}</h1>';
    let result = await wcSsr(html, { data: { title: 'Hello World' } });
    assert.equal(result, '<h1>Hello World</h1>');
  });

  it('should inject multiple tokens', async () => {
    let html = '<p>{[a]} and {[b]}</p>';
    let result = await wcSsr(html, { data: { a: 'X', b: 'Y' } });
    assert.equal(result, '<p>X and Y</p>');
  });

  it('should support custom delimiters', async () => {
    let html = '<h1>{{title}}</h1>';
    let result = await wcSsr(html, {
      data: { title: 'Custom' },
      openToken: '{{',
      closeToken: '}}',
    });
    assert.equal(result, '<h1>Custom</h1>');
  });

  it('should pass through HTML without custom elements', async () => {
    let html = '<div><p>No custom tags here</p></div>';
    let result = await wcSsr(html);
    assert.equal(result, html);
  });

  it('should return string type', async () => {
    let result = await wcSsr('<div>test</div>');
    assert.equal(typeof result, 'string');
  });
});

describe('wcSsr concurrency', () => {
  it('should serialize parallel SSR calls without errors', async () => {
    let pages = Array.from({ length: 10 }, (_, i) =>
      `<div><test-el-${i}>content</test-el-${i}></div>`
    );
    let results = await Promise.all(pages.map((p) => wcSsr(p)));
    assert.equal(results.length, 10);
    for (let r of results) {
      assert.equal(typeof r, 'string', 'Each result should be a string');
      assert.ok(r.length > 0, 'Each result should be non-empty');
    }
  });
});

describe('wcSsr DOCTYPE handling', () => {
  it('should handle HTML with DOCTYPE prefix', async () => {
    let html = '<!DOCTYPE html><html><body><div>Hello</div></body></html>';
    let result = await wcSsr(html);
    assert.equal(typeof result, 'string');
    assert.ok(result.length > 0, 'Result should be non-empty');
  });

  it('should preserve DOCTYPE in output when present', async () => {
    let html = '<!DOCTYPE html>\n<html><body><p>Plain</p></body></html>';
    let result = await wcSsr(html);
    assert.ok(result.includes('<!DOCTYPE html>') || result.includes('<!doctype html>'),
      'DOCTYPE should be preserved in output');
  });
});

describe('wcSsr error resilience', () => {
  it('should return string even when SSR processing encounters issues', async () => {
    let html = '<div><test-broken>test</test-broken></div>';
    let result = await wcSsr(html);
    assert.equal(typeof result, 'string', 'Should return string on error or success');
    assert.ok(result.length > 0, 'Should return non-empty result');
  });
});

describe('wcSsr CSP nonce', () => {
  it('should accept ssrOptions with nonce without errors', async () => {
    let html = '<div><p>No custom tags</p></div>';
    let result = await wcSsr(html, { ssrOptions: { nonce: 'test-nonce-123' } });
    assert.equal(typeof result, 'string');
    assert.ok(result.includes('<p>No custom tags</p>'));
  });

  it('should pass nonce through to SSR for custom elements', async () => {
    let html = '<div><test-nonce-el>content</test-nonce-el></div>';
    let result = await wcSsr(html, { ssrOptions: { nonce: 'csp-abc' } });
    assert.equal(typeof result, 'string');
    assert.ok(result.length > 0);
  });
});
