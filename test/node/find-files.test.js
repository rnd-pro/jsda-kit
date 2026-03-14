import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findFiles } from '../../node/findFiles.js';
import path from 'path';

let fixturesDir = path.resolve(import.meta.dirname, '../fixtures');

describe('findFiles', () => {
  it('should find files matching include patterns', () => {
    let results = findFiles(fixturesDir, ['.js'], []);
    assert.ok(results.length > 0);
    results.forEach((file) => {
      assert.ok(file.endsWith('.js'));
    });
  });

  it('should exclude files matching exclude patterns', () => {
    let results = findFiles(fixturesDir, ['.js'], ['components']);
    results.forEach((file) => {
      assert.ok(!file.includes('components'));
    });
  });

  it('should return empty for non-existent path', () => {
    let results = findFiles('./nonexistent-path-xyz', ['.js'], []);
    assert.equal(results, undefined);
  });
});
