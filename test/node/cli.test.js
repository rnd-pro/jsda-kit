import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../../cli/index.js';

describe('parseArgs', () => {
  it('should parse command', () => {
    let { command, flags } = parseArgs(['serve']);
    assert.equal(command, 'serve');
    assert.deepEqual(flags, {});
  });

  it('should parse boolean flags', () => {
    let { command, flags } = parseArgs(['--help']);
    assert.equal(command, '');
    assert.equal(flags.help, true);
  });

  it('should parse key=value flags', () => {
    let { command, flags } = parseArgs(['serve', '--port=8080']);
    assert.equal(command, 'serve');
    assert.equal(flags.port, '8080');
  });

  it('should parse multiple flags', () => {
    let { command, flags } = parseArgs(['build', '--output=./public', '--verbose']);
    assert.equal(command, 'build');
    assert.equal(flags.output, './public');
    assert.equal(flags.verbose, true);
  });

  it('should parse --version flag', () => {
    let { flags } = parseArgs(['--version']);
    assert.equal(flags.version, true);
  });

  it('should handle empty args', () => {
    let { command, flags } = parseArgs([]);
    assert.equal(command, '');
    assert.deepEqual(flags, {});
  });
});
