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

describe('SSR named re-export barrel file', () => {
  it('multi-session: named re-export barrel renders on SECOND call', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';

    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-named-exports.js'],
    });
    console.log('[named barrel session 1]:', result1);

    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-named-exports.js'],
    });
    console.log('[named barrel session 2]:', result2);

    assert.ok(result2.includes('Component Alpha'),
      'barrel-comp-a should render in second session (named re-export)');
    assert.ok(result2.includes('Component Beta'),
      'barrel-comp-b should render in second session (named re-export)');
  });
});

describe('SSR nested subdirectory barrel file', () => {
  it('multi-session: nested barrel renders on SECOND call', async () => {
    let html = '<div><nested-comp-a></nested-comp-a><nested-comp-b></nested-comp-b></div>';

    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-nested-exports.js'],
    });
    console.log('[nested barrel session 1]:', result1);

    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-nested-exports.js'],
    });
    console.log('[nested barrel session 2]:', result2);

    assert.ok(result2.includes('Nested-Alpha'),
      'nested-comp-a should render in second session');
    assert.ok(result2.includes('Nested-Beta'),
      'nested-comp-b should render in second session');
  });
});

describe('SSR import-then-export barrel file', () => {
  it('multi-session: import/export barrel renders on SECOND call', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';

    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-import-export.js'],
    });
    console.log('[import-export barrel session 1]:', result1);

    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-import-export.js'],
    });
    console.log('[import-export barrel session 2]:', result2);

    assert.ok(result2.includes('Component Alpha'),
      'barrel-comp-a should render in second session (import/export)');
    assert.ok(result2.includes('Component Beta'),
      'barrel-comp-b should render in second session (import/export)');
  });
});

describe('SSR side-effect import barrel file', () => {
  it('multi-session: side-effect barrel renders on SECOND call', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';

    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-side-effect.js'],
    });
    console.log('[side-effect barrel session 1]:', result1);

    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-side-effect.js'],
    });
    console.log('[side-effect barrel session 2]:', result2);

    assert.ok(result2.includes('Component Alpha'),
      'barrel-comp-a should render in second session (side-effect)');
    assert.ok(result2.includes('Component Beta'),
      'barrel-comp-b should render in second session (side-effect)');
  });
});

describe('SSR multi-line import barrel file', () => {
  it('multi-session: multi-line barrel renders on SECOND call', async () => {
    let html = '<div><barrel-comp-a></barrel-comp-a><barrel-comp-b></barrel-comp-b></div>';

    let result1 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-multiline.js'],
    });
    console.log('[multiline barrel session 1]:', result1);

    let result2 = await wcSsr(html, {
      imports: ['./test/fixtures/components/barrel-multiline.js'],
    });
    console.log('[multiline barrel session 2]:', result2);

    assert.ok(result2.includes('Component Alpha'),
      'barrel-comp-a should render in second session (multi-line)');
    assert.ok(result2.includes('Component Beta'),
      'barrel-comp-b should render in second session (multi-line)');
  });
});
