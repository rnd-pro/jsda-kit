import fs from 'fs';
import { execFile } from 'child_process';
import CFG from '../cfg/CFG.js';
import { Log } from './Log.js';

let processor = process.argv[3] || './node_modules/jsda-kit/node/build.js';
let localPath = './node/build.js';

if (fs.existsSync(localPath)) {
  processor = localPath;
}

let watchTimeout;
/** @type {import('child_process').ChildProcess} */
let cp;

let src = process.argv[2] || CFG.static.sourceDir || './src';

function onFsChange() {
  cp = execFile('node', [processor, src], (err, stdout, stderr) => {
    err && Log.err('JSDA Static error: ', err);
    stdout && Log.msg(stdout);
    stderr && Log.err(stderr);
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