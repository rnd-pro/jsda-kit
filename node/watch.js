import fs from 'fs';
import CFG from '../cfg/CFG.js';
import { build } from './build.js';

let watchTimeout;
let src = process.argv[2] || CFG.static.sourceDir || './src';

await build();

fs.watch(src, {
  recursive: true,
}, () => {
  if (watchTimeout) {
    clearTimeout(watchTimeout);
  }
  watchTimeout = setTimeout(() => {
    build();
  }, 200);
});
