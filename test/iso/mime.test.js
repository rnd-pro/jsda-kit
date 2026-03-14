import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import MIME_MAP from '../../iso/MIME.js';
import MIME_TYPES from '../../server/MIME_TYPES.js';

describe('MIME_MAP (iso)', () => {
  it('should have common web types', () => {
    assert.equal(MIME_MAP.html, 'text/html');
    assert.equal(MIME_MAP.css, 'text/css');
    assert.equal(MIME_MAP.js, 'text/javascript');
    assert.equal(MIME_MAP.json, 'application/json');
    assert.equal(MIME_MAP.svg, 'image/svg+xml');
    assert.equal(MIME_MAP.png, 'image/png');
  });

  it('should use extension keys without dots', () => {
    for (let key of Object.keys(MIME_MAP)) {
      assert.ok(!key.startsWith('.'), `Key "${key}" should not start with a dot`);
    }
  });

  it('should have audio types', () => {
    assert.equal(MIME_MAP.mp3, 'audio/mpeg');
    assert.equal(MIME_MAP.wav, 'audio/wav');
  });

  it('should have archive types', () => {
    assert.equal(MIME_MAP.zip, 'application/zip');
    assert.equal(MIME_MAP.gz, 'application/gzip');
  });
});

describe('MIME_TYPES (server) re-export', () => {
  it('should be the same object as MIME_MAP', () => {
    assert.equal(MIME_TYPES, MIME_MAP);
  });
});
