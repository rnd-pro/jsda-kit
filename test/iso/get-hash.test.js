import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getHash } from '../../iso/getHash.js';

describe('getHash', () => {
  it('should return a hex string', async () => {
    let result = await getHash('test');
    assert.match(result, /^[0-9a-f]+$/);
  });

  it('should return consistent results for the same input', async () => {
    let a = await getHash('hello');
    let b = await getHash('hello');
    assert.equal(a, b);
  });

  it('should return different results for different inputs', async () => {
    let a = await getHash('foo');
    let b = await getHash('bar');
    assert.notEqual(a, b);
  });
});
