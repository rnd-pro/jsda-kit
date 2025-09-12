import fs from 'fs';
import { execFile } from 'child_process';

let srcDir = process.argv[2] || process.env.SRC_DIR || './src/';
let processor = process.argv[3] || process.env.HANDLER_SCRIPT_PATH || './node_modules/@jam-do/jam-tools/node/build.js';

let watchTimeout;
/** @type {import('child_process').ChildProcess} */
let cp;

function onFsChange() {
  cp = execFile('node', [processor], (err, stdout, stderr) => {
    err && console.error(err);
    stdout && console.log(stdout);
    stderr && console.error(stderr);
  });
}

fs.watch(srcDir, {
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