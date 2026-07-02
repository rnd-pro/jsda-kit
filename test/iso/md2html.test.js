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

  it('should add configured attributes to external http links', async () => {
    let result = await md2html('[Example](https://example.com)', {
      externalLinks: {
        enabled: true,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: [],
      },
    });
    assert.match(result, /<a target="_blank" rel="noopener noreferrer" href="https:\/\/example.com">Example<\/a>/);
  });

  it('should add configured attributes to protocol-relative links', async () => {
    let result = await md2html('[CDN](//cdn.example.com/lib.js)', {
      externalLinks: {
        enabled: true,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: [],
      },
    });
    assert.match(result, /<a target="_blank" rel="noopener noreferrer" href="\/\/cdn.example.com\/lib.js">CDN<\/a>/);
  });

  it('should match external link schemes case-insensitively', async () => {
    let result = await md2html('[Example](HTTPS://example.com)', {
      externalLinks: {
        enabled: true,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: [],
      },
    });
    assert.match(result, /target="_blank"/);
  });

  it('should not add attributes to relative links', async () => {
    let result = await md2html('[Local](./local.md) [Parent](../parent.md) [Root](/root)', {
      externalLinks: {
        enabled: true,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: [],
      },
    });
    assert.doesNotMatch(result, /target="_blank"/);
    assert.doesNotMatch(result, /rel="noopener noreferrer"/);
  });

  it('should not add attributes to excluded external links', async () => {
    let result = await md2html('[Example](https://example.com)', {
      externalLinks: {
        enabled: true,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: ['example.com'],
      },
    });
    assert.doesNotMatch(result, /target="_blank"/);
    assert.doesNotMatch(result, /rel="noopener noreferrer"/);
  });

  it('should not add external link attributes when disabled', async () => {
    let result = await md2html('[Example](https://example.com)', {
      externalLinks: {
        enabled: false,
        target: '_blank',
        rel: 'noopener noreferrer',
        exclude: [],
      },
    });
    assert.doesNotMatch(result, /target="_blank"/);
    assert.doesNotMatch(result, /rel="noopener noreferrer"/);
  });
});
