#!/usr/bin/env node

import CMDs from './commands.js';
import { Log } from '../node/Log.js';

/** @type {Record<keyof CMDs, () => void>} */
const CMD_MAP = {

  ssg: () => {
    import('../node/watch.js');
  },

  serve: () => {
    import('../server/index.js');
  },

  build: () => {
    import('../node/ci.js');
  },

  scaffold: () => {
    Log.info('JSDA CLI:', 'CREATE PROJECT STRUCTURE');
  },

};

try {
  CMD_MAP[process.argv[2]]();
} catch (e) {
  Log.err('JSDA CLI ERROR:', e);
}

