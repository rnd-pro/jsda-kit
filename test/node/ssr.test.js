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
