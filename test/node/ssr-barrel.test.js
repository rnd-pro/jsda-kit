import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { wcSsr } from '../../node/wcSsr.js';

describe('SSR barrel file imports', () => {
  it('single session: barrel import renders both components', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';
    let result = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-exports.js'],
    });

    console.log('[barrel single session]:', result);

    assert.ok(result.includes('Component Alpha'), 'barrel-comp-a should render');
    assert.ok(result.includes('Component Beta'), 'barrel-comp-b should render');
  });

  it('multi-session: barrel components render on SECOND call too', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';

    // First SSR session
    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-exports.js'],
    });
    console.log('[barrel session 1]:', result1);

    // Second SSR session — this is where the bug manifests:
    // barrel-exports.js gets a new ?ssr= timestamp, but barrel-a.js / barrel-b.js
    // are cached from session 1, so .reg() never fires against the new SSR DOM.
    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-exports.js'],
    });
    console.log('[barrel session 2]:', result2);

    assert.ok(result2.includes('Component Alpha'),
      'barrel-comp-a should render in second session');
    assert.ok(result2.includes('Component Beta'),
      'barrel-comp-b should render in second session');
  });

  it('mixed: barrel import + direct import in same imports array', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><iso-greeting></iso-greeting></div>';
    let result = await wcSsr(html, {
      imports: [
        './test/fixtures/components/barrel-exports.js',
        './test/fixtures/components/iso-greeting.js',
      ],
    });

    console.log('[barrel mixed]:', result);

    assert.ok(result.includes('Component Alpha'), 'barrel component should render');
    assert.ok(result.includes('Hello, World!'), 'direct component should render');
  });
});
