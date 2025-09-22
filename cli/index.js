#!/usr/bin/env node

import CMDs from './commands.js';
import { Log } from '../node/Log.js';

/** @type {Record<keyof CMDs, () => Promise<void>>} */
const CMD_MAP = {

  ssg: async () => {
    await import('../node/watch.js');
  },

  serve: async () => {
    await import('../server/index.js');
  },

  build: async () => {
    await import('../node/ci.js');
  },

  scaffold: async () => {
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
  await CMD_MAP[command]();
} catch (e) {
  Log.err('JSDA CLI ERROR:', e);
  process.exit(1);
}

