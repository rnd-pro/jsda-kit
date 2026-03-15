import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SSR } from '@symbiotejs/symbiote/node/SSR.js';
import { wcSsr } from '../../node/wcSsr.js';

describe('SSR isoMode component rendering', () => {
  it('renderToString renders isoMode component with correct lifecycle', async () => {
    await SSR.init();
    await import('../fixtures/components/iso-greeting.js');

    let result = SSR.renderToString('iso-greeting');
    console.log('[renderToString]:', result);

    assert.ok(result.includes('Hello, World!'), 'Should contain resolved template content');
    assert.ok(result.includes('<div class="greeting">'), 'Should contain template markup');
    assert.ok(result.includes('<style>'), 'Should contain rootStyles');

    SSR.destroy();
  });

  it('processHtml renders component within same SSR session', async () => {
    await SSR.init();
    await import('../fixtures/components/iso-greeting.js' + '?v=2');

    let html = '<div><iso-greeting></iso-greeting></div>';
    let result = await SSR.processHtml(html);
    console.log('[processHtml same session]:', result);

    assert.ok(result.includes('Hello, World!'), 'Should render component template');

    SSR.destroy();
  });

  it('wcSsr with imports option renders component', async () => {
    let html = '<div><iso-greeting></iso-greeting></div>';
    let result = await wcSsr(html, {
      imports: ['./test/fixtures/components/iso-greeting.js'],
    });

    console.log('[wcSsr with imports]:', result);

    assert.ok(result.includes('iso-greeting'), 'Should contain custom element tag');
    assert.ok(result.includes('Hello, World!'), 'Should contain rendered template content');
    assert.ok(result.includes('<style>'), 'Should contain rootStyles');
  });

  it('wcSsr without imports leaves tags unrendered', async () => {
    let html = '<div><unknown-widget></unknown-widget></div>';
    let result = await wcSsr(html);

    console.log('[wcSsr no imports]:', result);

    assert.ok(result.includes('unknown-widget'), 'Unregistered tag should pass through');
    assert.ok(!result.includes('Hello,'), 'Should NOT contain any rendered content');
  });

  it('wcSsr still works for plain HTML (no custom elements)', async () => {
    let html = '<div><p>No custom tags here</p></div>';
    let result = await wcSsr(html);
    assert.equal(result, html, 'Plain HTML should pass through unchanged');
  });

  it('wcSsr data injection still works with imports', async () => {
    let html = '<h1>{[title]}</h1><iso-greeting></iso-greeting>';
    let result = await wcSsr(html, {
      data: { title: 'Test Page' },
      imports: ['./test/fixtures/components/iso-greeting.js'],
    });

    console.log('[wcSsr data + imports]:', result);

    assert.ok(result.includes('Test Page'), 'Should inject data tokens');
    assert.ok(result.includes('Hello, World!'), 'Should render component');
  });
});
