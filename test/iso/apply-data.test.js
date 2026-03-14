import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyData } from '../../iso/applyData.js';

describe('applyData', () => {
  it('should replace tokens with data values', () => {
    let result = applyData('Hello, {{name}}!', { name: 'World' });
    assert.equal(result, 'Hello, World!');
  });

  it('should replace multiple tokens', () => {
    let result = applyData('{{a}} and {{b}}', { a: 'X', b: 'Y' });
    assert.equal(result, 'X and Y');
  });

  it('should replace all occurrences of the same token', () => {
    let result = applyData('{{x}} is {{x}}', { x: 'same' });
    assert.equal(result, 'same is same');
  });

  it('should leave unmatched tokens untouched', () => {
    let result = applyData('{{known}} and {{unknown}}', { known: 'yes' });
    assert.equal(result, 'yes and {{unknown}}');
  });

  it('should support custom token delimiters', () => {
    let result = applyData('Hello, {[name]}!', { name: 'World' }, '{[', ']}');
    assert.equal(result, 'Hello, World!');
  });

  it('should handle empty data object', () => {
    let result = applyData('{{a}}', {});
    assert.equal(result, '{{a}}');
  });

  it('should handle empty string input', () => {
    let result = applyData('', { a: 'b' });
    assert.equal(result, '');
  });
});
