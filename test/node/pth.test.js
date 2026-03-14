import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import pth from '../../node/pth.js';
import path from 'path';

describe('pth', () => {
  it('should resolve a relative path to absolute', () => {
    let result = pth('./src/index.js');
    assert.ok(path.isAbsolute(result));
    assert.ok(result.endsWith('src/index.js'));
  });

  it('should handle already absolute paths', () => {
    let result = pth('/absolute/path/file.js');
    assert.ok(path.isAbsolute(result));
  });

  it('should return file:// URL when isFileUrl is true', () => {
    let result = pth('./src/index.js', true);
    assert.ok(result.startsWith('file://'));
    assert.ok(result.includes('src/index.js'));
    // Should NOT have double cwd:
    let afterProtocol = result.replace('file://', '');
    assert.ok(path.isAbsolute(afterProtocol));
  });

  it('should pass through remote URLs when isFileUrl is true', () => {
    let result = pth('https://example.com/module.js', true);
    assert.equal(result, 'https://example.com/module.js');
  });
});
