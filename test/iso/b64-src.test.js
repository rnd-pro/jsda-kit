import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { b64Src } from '../../iso/b64Src.js';

describe('b64Src', () => {
  it('should create a data URI with given MIME type', () => {
    let result = b64Src('dGVzdA==', 'text/html');
    assert.equal(result, 'data:text/html;base64,dGVzdA==');
  });

  it('should encode input when encode flag is true', () => {
    let result = b64Src('hello', 'text/css', true);
    assert.equal(result, `data:text/css;base64,${btoa('hello')}`);
  });

  it('should support image MIME types', () => {
    let result = b64Src('abc', 'image/svg+xml');
    assert.match(result, /^data:image\/svg\+xml;base64,/);
  });
});
