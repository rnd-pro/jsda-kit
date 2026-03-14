import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cssMin } from '../../node/cssMin.js';

describe('cssMin', () => {
  it('should minify CSS', () => {
    let input = `
      body {
        color: red;
        background: blue;
      }
    `;
    let result = cssMin(input);
    assert.ok(result.length < input.length);
    assert.ok(result.includes('color'));
  });

  it('should handle empty input', () => {
    let result = cssMin('');
    assert.equal(result, '');
  });
});
