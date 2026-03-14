import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { md2html } from '../../iso/md2html.js';

describe('md2html', () => {
  it('should convert markdown heading to HTML', async () => {
    let result = await md2html('# Hello');
    assert.match(result, /<h1[^>]*>Hello<\/h1>/);
  });

  it('should convert markdown paragraph to HTML', async () => {
    let result = await md2html('Some text');
    assert.match(result, /<p>Some text<\/p>/);
  });

  it('should add heading IDs', async () => {
    let result = await md2html('## My Section');
    assert.match(result, /id="my-section"/);
  });

  it('should highlight code blocks', async () => {
    let result = await md2html('```js\nlet x = 1;\n```');
    assert.match(result, /hljs/);
  });
});
