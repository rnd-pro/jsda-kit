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
});
