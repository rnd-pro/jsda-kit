import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('init scaffold', () => {
  let tmpDir;
  let originalCwd;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-init-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);

    // Simulate installed package so tsconfig copy works
    let fakePkgDir = path.join(tmpDir, 'node_modules/jsda-kit');
    fs.mkdirSync(fakePkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(fakePkgDir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: {} }),
    );
  });

  after(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should create expected folders', async () => {
    let { init } = await import('../../cli/init.js');
    init();

    let expected = [
      'types',
      'src/static',
      'src/dynamic',
      'src/components',
      'src/components/server-only',
      'src/components/client-only',
      'src/components/iso',
      'src/css',
      'src/md',
    ];
    for (let dir of expected) {
      assert.ok(fs.existsSync(path.join(tmpDir, dir)), `Missing folder: ${dir}`);
    }
  });

  it('should create project.cfg.js', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'project.cfg.js')));
    let content = fs.readFileSync(path.join(tmpDir, 'project.cfg.js'), 'utf8');
    assert.ok(content.includes('export default'));
  });

  it('should create sample component', () => {
    let file = path.join(tmpDir, 'src/components/app-hello.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('AppHello'));
    assert.ok(content.includes("reg('app-hello')"));
  });

  it('should create sample route with data tokens', () => {
    let file = path.join(tmpDir, 'src/dynamic/index.html.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('{[title]}'));
    assert.ok(content.includes('<app-hello>'));
    assert.ok(content.includes('<iso-card>'));
  });

  it('should create .gitignore', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, '.gitignore')));
  });

  it('should create server-only example component', () => {
    let file = path.join(tmpDir, 'src/components/server-only/server-info.js');
    assert.ok(fs.existsSync(file), 'Missing server-info.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('ServerInfo'), 'Should contain ServerInfo class');
    assert.ok(content.includes("reg('server-info')"), 'Should register server-info tag');
    assert.ok(content.includes('isoMode = true'), 'Should be an isoMode component');
  });

  it('should create client-only example component', () => {
    let file = path.join(tmpDir, 'src/components/client-only/client-counter.js');
    assert.ok(fs.existsSync(file), 'Missing client-counter.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('ClientCounter'), 'Should contain ClientCounter class');
    assert.ok(content.includes("reg('client-counter')"), 'Should register client-counter tag');
    assert.ok(!content.includes('isoMode'), 'Should NOT have isoMode');
  });

  it('should create iso example component', () => {
    let file = path.join(tmpDir, 'src/components/iso/iso-card.js');
    assert.ok(fs.existsSync(file), 'Missing iso-card.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('IsoCard'), 'Should contain IsoCard class');
    assert.ok(content.includes("reg('iso-card')"), 'Should register iso-card tag');
    assert.ok(content.includes('isoMode = true'), 'Should be an isoMode component');
  });

  it('should create barrel exports for each sub-folder', () => {
    let barrels = [
      { path: 'src/components/server-only/exports.js', expects: 'server-info.js' },
      { path: 'src/components/client-only/exports.js', expects: 'client-counter.js' },
      { path: 'src/components/iso/exports.js', expects: 'iso-card.js' },
    ];
    for (let { path: p, expects } of barrels) {
      let file = path.join(tmpDir, p);
      assert.ok(fs.existsSync(file), `Missing barrel: ${p}`);
      let content = fs.readFileSync(file, 'utf8');
      assert.ok(content.includes(expects), `Barrel ${p} should re-export from ${expects}`);
    }
  });

  it('should not overwrite existing files', async () => {
    let readmePath = path.join(tmpDir, 'README.md');
    let original = fs.readFileSync(readmePath, 'utf8');
    let { init } = await import('../../cli/init.js');
    init();
    assert.equal(fs.readFileSync(readmePath, 'utf8'), original);
  });
});
