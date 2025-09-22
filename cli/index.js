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

const command = process.argv[2];

if (!command) {
  Log.info('JSDA CLI:', 'Available commands: serve, build, ssg, scaffold');
  Log.info('Usage:', 'jsda <command>');
  process.exit(1);
}

if (!CMD_MAP[command]) {
  Log.err('JSDA CLI ERROR:', `Unknown command: ${command}`);
  Log.info('Available commands:', Object.keys(CMD_MAP).join(', '));
  process.exit(1);
}

try {
  CMD_MAP[command]();
} catch (e) {
  Log.err('JSDA CLI ERROR:', e);
}

