import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { htmlMin } from '../../node/htmlMin.js';

describe('htmlMin', () => {
  it('should minify HTML', () => {
    let result = htmlMin('<div>  <p>  hello  </p>  </div>');
    assert.ok(result.length <= '<div>  <p>  hello  </p>  </div>'.length);
    assert.ok(result.includes('hello'));
  });

  it('should strip comments', () => {
    let result = htmlMin('<!-- comment --><p>text</p>');
    assert.ok(!result.includes('comment'));
    assert.ok(result.includes('text'));
  });

  it('should handle empty input', () => {
    let result = htmlMin('');
    assert.equal(result, '');
  });
});
