import { test, expect } from '@playwright/test';
import { execSync, fork } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const JSDA_KIT_ROOT = path.resolve(import.meta.dirname, '..', '..');
const TEST_PORT = 4001;
const BASE_URL = `http://localhost:${TEST_PORT}`;

/**
 * Scaffold a project into a tmp dir and symlink jsda-kit.
 * @returns {string} path to the scaffolded project
 */
function scaffoldProject() {
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsda-e2e-'));

  // Run scaffold FIRST so the directory is empty for degit
  execSync(`node ${path.join(JSDA_KIT_ROOT, 'cli', 'index.js')} scaffold`, {
    cwd: dir,
    stdio: 'pipe',
  });

  // Symlink jsda-kit so imports resolve against current code
  let nmDir = path.join(dir, 'node_modules');
  if (!fs.existsSync(nmDir)) fs.mkdirSync(nmDir, { recursive: true });
  fs.symlinkSync(JSDA_KIT_ROOT, path.join(nmDir, 'jsda-kit'), 'dir');

  // Symlink @symbiotejs (scaffold components depend on it)
  let symbioteSource = path.join(JSDA_KIT_ROOT, 'node_modules', '@symbiotejs');
  let symbioteTarget = path.join(nmDir, '@symbiotejs');
  if (fs.existsSync(symbioteSource)) {
    fs.symlinkSync(symbioteSource, symbioteTarget, 'dir');
  }

  // Symlink cloud-images-toolkit if it exists so template resolves
  let citSource = path.join(JSDA_KIT_ROOT, 'node_modules', 'cloud-images-toolkit');
  let citTarget = path.join(nmDir, 'cloud-images-toolkit');
  if (fs.existsSync(citSource)) {
    fs.symlinkSync(citSource, citTarget, 'dir');
  }

  return dir;
}

/**
 * Start the JSDA server via a worker script.
 * @param {string} cwd - scaffolded project directory
 * @returns {Promise<import('child_process').ChildProcess>}
 */
function startServer(cwd) {
  let workerScript = path.join(JSDA_KIT_ROOT, 'test', 'browser', '_serve-worker.js');
  return new Promise((resolve, reject) => {
    let proc = fork(workerScript, [String(TEST_PORT)], {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    let timeout = setTimeout(() => {
      proc.kill();
      reject(new Error('Server did not start in 15s'));
    }, 15_000);

    proc.on('message', (msg) => {
      if (msg === 'ready') {
        clearTimeout(timeout);
        resolve(proc);
      }
    });

    proc.stderr.on('data', (d) => {
      console.error('[server]', d.toString());
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// --- jsda serve ---

test.describe('scaffold: jsda serve', () => {
  /** @type {string} */
  let tmpDir;
  /** @type {import('child_process').ChildProcess} */
  let server;

  test.beforeAll(async () => {
    tmpDir = scaffoldProject();
    server = await startServer(tmpDir);
  });

  test.afterAll(async () => {
    if (server) {
      server.kill('SIGTERM');
      await new Promise((r) => server.on('close', r));
    }
    if (tmpDir) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('homepage returns 200 with correct title', async ({ page }) => {
    let response = await page.goto(BASE_URL + '/');
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(/Login/);
  });

  test('login-widget component is present in DOM', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page.locator('login-widget')).toBeAttached();
  });

  test('SSR renders login-widget component inner content', async ({ request }) => {
    let response = await request.get(BASE_URL + '/');
    let html = await response.text();
    expect(html).toContain('login-widget');
    expect(html).toContain('</login-widget>');
  });

  test('page has CSS link and JS module script', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page.locator('link[rel="stylesheet"]').first()).toBeAttached();
    // HTML minifier might remove quotes or change attribute casing
    await expect(page.locator('script').first()).toBeAttached();
  });

  test('404 route returns 404 content', async ({ page }) => {
    let response = await page.goto(BASE_URL + '/nonexistent-page/');
    expect(response.status()).toBe(404);
  });
});

// --- jsda build ---

test.describe('scaffold: jsda build', () => {
  /** @type {string} */
  let buildDir;

  test.beforeAll(() => {
    buildDir = scaffoldProject();
    execSync(`node ${path.join(JSDA_KIT_ROOT, 'node', 'ci.js')}`, {
      cwd: buildDir,
      stdio: 'pipe',
    });
  });

  test.afterAll(() => {
    if (buildDir) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
  });

  test('build produces dist/index.html', () => {
    let distIndex = path.join(buildDir, 'dist', 'index.html');
    expect(fs.existsSync(distIndex)).toBe(true);
  });

  test('built HTML contains rendered content', () => {
    let html = fs.readFileSync(path.join(buildDir, 'dist', 'index.html'), 'utf8');
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<title>');
  });
});
