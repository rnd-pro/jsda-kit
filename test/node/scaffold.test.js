import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('scaffold', () => {
  let tmpDir;
  let originalCwd;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-scaffold-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  after(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should create expected directories', async () => {
    let { scaffold } = await import('../../cli/scaffold.js');
    scaffold();

    let expected = [
      'types',
      'src/static',
      'src/dynamic',
      'src/dynamic/tpl',
      'src/dynamic/css',
      'src/dynamic/browser',
      'src/dynamic/node',
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

  // --- Root config files ---

  it('should create package.json with correct fields', () => {
    let file = path.join(tmpDir, 'package.json');
    assert.ok(fs.existsSync(file));
    let pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(pkg.type, 'module');
    assert.ok(pkg.scripts.dev);
    assert.ok(pkg.scripts.build);
    assert.ok(pkg.dependencies['@symbiotejs/symbiote']);
    assert.ok(pkg.dependencies['jsda-kit']);
  });

  it('should create project.cfg.js with SSR and handlers', () => {
    let file = path.join(tmpDir, 'project.cfg.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('getDataFn'), 'Should import getDataFn');
    assert.ok(content.includes('getRouteFn'), 'Should import getRouteFn');
    assert.ok(content.includes('ssr'), 'Should have SSR config');
    assert.ok(content.includes('importmap'), 'Should have importmap config');
  });

  it('should create tsconfig.json', () => {
    let file = path.join(tmpDir, 'tsconfig.json');
    assert.ok(fs.existsSync(file));
    let content = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.ok(content.compilerOptions);
  });

  it('should create .gitignore', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, '.gitignore')));
  });

  it('should not leave tsconfig.json.tpl after renaming', () => {
    assert.ok(!fs.existsSync(path.join(tmpDir, 'tsconfig.json.tpl')), 'Template should be renamed');
  });

  // --- Dynamic route infrastructure ---

  it('should create routes.js with route mapping', () => {
    let file = path.join(tmpDir, 'src/dynamic/routes.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes("'/'"), 'Should have root route');
    assert.ok(content.includes("'/404/'"), 'Should have 404 route');
  });

  it('should create dynamic index.html.js with applyData', () => {
    let file = path.join(tmpDir, 'src/dynamic/index.html.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('applyData'), 'Should use applyData');
    assert.ok(content.includes('IMPORTMAP'), 'Should inject IMPORTMAP');
  });

  it('should create 404.html.js', () => {
    let file = path.join(tmpDir, 'src/dynamic/404.html.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('404'));
  });

  it('should create main.tpl.html with token placeholders', () => {
    let file = path.join(tmpDir, 'src/dynamic/tpl/main.tpl.html');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('{[TITLE]}'), 'Should have TITLE token');
    assert.ok(content.includes('{[IMPORTMAP]}'), 'Should have IMPORTMAP token');
    assert.ok(content.includes('{[CSS_PATH]}'), 'Should have CSS_PATH token');
    assert.ok(content.includes('{[JS_PATH]}'), 'Should have JS_PATH token');
  });

  it('should create node/handlers.js with getDataFn and getRouteFn', () => {
    let file = path.join(tmpDir, 'src/dynamic/node/handlers.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('getDataFn'), 'Should export getDataFn');
    assert.ok(content.includes('getRouteFn'), 'Should export getRouteFn');
  });

  it('should create browser/index.js', () => {
    let file = path.join(tmpDir, 'src/dynamic/browser/index.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('client-counter'), 'Should import client-only component');
  });

  it('should create css/index.css.js', () => {
    let file = path.join(tmpDir, 'src/dynamic/css/index.css.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('common'), 'Should import common CSS');
  });

  // --- Static SSG ---

  it('should create static/index.html.js with md2html', () => {
    let file = path.join(tmpDir, 'src/static/index.html.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('md2html'), 'Should use md2html');
    assert.ok(content.includes('README.md'), 'Should read README.md');
  });

  it('should create static/page.tpl.html', () => {
    let file = path.join(tmpDir, 'src/static/page.tpl.html');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('{[CONTENT]}'), 'Should have CONTENT token');
    assert.ok(content.includes('{[TITLE]}'), 'Should have TITLE token');
  });

  it('should create static/robots.txt', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/static/robots.txt')));
  });

  // --- Shared CSS + markdown ---

  it('should create common.css.js with design tokens', () => {
    let file = path.join(tmpDir, 'src/css/common.css.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes(':root'), 'Should have :root');
    assert.ok(content.includes('--primary'), 'Should have --primary token');
    assert.ok(content.includes('--clr-1'), 'Should have --clr-1 token');
  });

  it('should create md/about.md', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/md/about.md')));
  });

  // --- Types ---

  it('should create types/globals.d.ts', () => {
    let file = path.join(tmpDir, 'types/globals.d.ts');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('jsda-kit'), 'Should reference jsda-kit types');
  });

  // --- Component sub-folders ---

  it('should create app-hello component', () => {
    let file = path.join(tmpDir, 'src/components/server-only/app-hello/app-hello.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('AppHello'));
    assert.ok(content.includes("reg('app-hello')"));
    assert.ok(content.includes('isoMode = true'));
  });

  it('should create server-only example component', () => {
    let file = path.join(tmpDir, 'src/components/server-only/server-info/server-info.js');
    assert.ok(fs.existsSync(file), 'Missing server-info.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('ServerInfo'), 'Should contain ServerInfo class');
    assert.ok(content.includes("reg('server-info')"), 'Should register server-info tag');
    assert.ok(content.includes('isoMode = true'), 'Should be an isoMode component');
  });

  it('should create client-only example component', () => {
    let file = path.join(tmpDir, 'src/components/client-only/client-counter/client-counter.js');
    assert.ok(fs.existsSync(file), 'Missing client-counter.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('ClientCounter'), 'Should contain ClientCounter class');
    assert.ok(content.includes("reg('client-counter')"), 'Should register client-counter tag');
    assert.ok(!content.includes('isoMode'), 'Should NOT have isoMode');
  });

  it('should create iso example component', () => {
    let file = path.join(tmpDir, 'src/components/iso/iso-card/iso-card.js');
    assert.ok(fs.existsSync(file), 'Missing iso-card.js');
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('IsoCard'), 'Should contain IsoCard class');
    assert.ok(content.includes("reg('iso-card')"), 'Should register iso-card tag');
    assert.ok(content.includes('isoMode = true'), 'Should be an isoMode component');
  });

  it('should create barrel exports for each sub-folder', () => {
    let barrels = [
      { path: 'src/components/server-only/exports.js', expects: 'server-info/server-info.js' },
      { path: 'src/components/client-only/exports.js', expects: 'client-counter/client-counter.js' },
      { path: 'src/components/iso/exports.js', expects: 'iso-card/iso-card.js' },
    ];
    for (let { path: p, expects } of barrels) {
      let file = path.join(tmpDir, p);
      assert.ok(fs.existsSync(file), `Missing barrel: ${p}`);
      let content = fs.readFileSync(file, 'utf8');
      assert.ok(content.includes(expects), `Barrel ${p} should re-export from ${expects}`);
    }
  });

  // --- Idempotency ---

  it('should not overwrite existing files', async () => {
    let readmePath = path.join(tmpDir, 'README.md');
    let original = fs.readFileSync(readmePath, 'utf8');
    let { scaffold } = await import('../../cli/scaffold.js');
    scaffold();
    assert.equal(fs.readFileSync(readmePath, 'utf8'), original);
  });
});
