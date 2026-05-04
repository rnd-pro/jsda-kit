import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('scaffold', () => {
  let tmpDir;
  let originalCwd;

  before(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-scaffold-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);

    let { scaffold } = await import('../../cli/scaffold.js');
    scaffold();
  });

  after(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should create expected directories', () => {
    let expected = [
      'types',
      'src/static-pages',
      'src/dynamic-pages',
      'src/ui-components',
      'src/common-styles',
      'secrets',
      'cit'
    ];
    for (let dir of expected) {
      assert.ok(fs.existsSync(path.join(tmpDir, dir)), `Missing folder: ${dir}`);
    }
  });

  it('should create package.json with correct fields and remove package-lock.json', () => {
    let file = path.join(tmpDir, 'package.json');
    assert.ok(fs.existsSync(file));
    let pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(pkg.type, 'module');
    assert.equal(pkg.name, path.basename(tmpDir));
    assert.equal(pkg.version, '0.0.1');

    assert.ok(!fs.existsSync(path.join(tmpDir, 'package-lock.json')), 'package-lock.json should be removed');
  });

  it('should create project.cfg.js', () => {
    let file = path.join(tmpDir, 'project.cfg.js');
    assert.ok(fs.existsSync(file));
  });

  it('should create tsconfig.json', () => {
    let file = path.join(tmpDir, 'tsconfig.json');
    assert.ok(fs.existsSync(file));
  });

  it('should create secrets/access.js', () => {
    let file = path.join(tmpDir, 'secrets/access.js');
    assert.ok(fs.existsSync(file));
    let content = fs.readFileSync(file, 'utf8');
    assert.ok(content.includes('export default'));
  });

  it('should create dynamic routes and handlers', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/dynamic-pages/routes/routes.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/dynamic-pages/node/handlers.js')));
  });

  it('should create static pages', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/static-pages/index.html.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/static-pages/robots.txt')));
  });

  it('should create UI components', () => {
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/ui-components/client-only/client-counter/client-counter.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/ui-components/server-only/server-info/logic.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/ui-components/universal/login-widget/logic.js')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'src/ui-components/ssr-exports.js')));
  });

  it('should not overwrite existing files if scaffold is run again', async () => {
    let readmePath = path.join(tmpDir, 'README.md');
    fs.writeFileSync(readmePath, 'MODIFIED', 'utf8');
    let { scaffold } = await import('../../cli/scaffold.js');
    scaffold();
    // degit doesn't overwrite by default unless --force is used
    assert.equal(fs.readFileSync(readmePath, 'utf8'), 'MODIFIED');
  });
});
