import fs from 'fs';
import { execFile } from 'child_process'; // child_process is used to drop nested ESM cache in JSDA files
import CFG from '../cfg/CFG.js';
import { Log } from './Log.js';

let processor = process.argv[3] || './node_modules/jsda-kit/node/ci.js';
let localPath = './node/ci.js';

if (fs.existsSync(localPath)) {
  processor = localPath;
}

let watchTimeout;
/** @type {import('child_process').ChildProcess} */
let cp;

let src = process.argv[2] || CFG.static.sourceDir || './src';

/**
 * 
 * @param {String} str 
 * @returns 
 */
function fmtOut(str) {
  if (str.startsWith('>')) {
    str = str.replace(/^>/, '');
  }
  /** @type {[string, ...any]} */
  // @ts-expect-error
  let res = str.split(':');
  if (res.length > 1) {
    res[0] = res[0].trim() + ':';
    res[1] = res[1].trim();
  }
  return res;
}

function onFsChange() {
  cp = execFile('node', [processor, src], (err, stdout, stderr) => {
    err && Log.err('JSDA Static error: ', err);
    stdout && Log.info(...fmtOut(stdout));
    stderr && Log.err(...fmtOut(stderr));
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