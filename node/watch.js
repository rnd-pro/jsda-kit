import fs from 'fs';
import { spawn } from 'child_process';
import CFG from '../cfg/CFG.js';
import { Log } from './Log.js';

let processor = fs.existsSync('./node_modules/jsda-kit/node/ci.js') 
  ? './node_modules/jsda-kit/node/ci.js' 
  : './node/ci.js';

let watchTimeout;
/** @type {import('child_process').ChildProcess} */
let cp;
let serveStarted = false;

let src = CFG.static.sourceDir;
let out = CFG.static.outputDir;
let port = CFG.static.port;

function startServe() {
  if (serveStarted) return;
  serveStarted = true;
  let serve = spawn('npx', ['-y', 'serve', out, '-l', String(port)], { stdio: 'pipe', shell: true });
  serve.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  serve.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  serve.on('error', (err) => {
    Log.err('Serve error:', err);
  });
  Log.info('SSG Serve:', `http://localhost:${port}`);
}

function onFsChange() {
  cp = spawn('node', [processor], { stdio: 'inherit' });
  cp.on('close', (code) => {
    if (code !== 0) {
      Log.err('JSDA Static error:', 'exit code ' + code);
    }
    startServe();
  });
}

fs.watch(src, {
  recursive: true,
}, () => {
  if (watchTimeout) {
    clearTimeout(watchTimeout);
  }
  watchTimeout = setTimeout(() => {
    if (cp) {
      cp.kill();
      cp = null;
    }
    onFsChange();
  });
});

onFsChange();