#!/usr/bin/env node

import { Log } from '../node/Log.js';
import { scaffold } from './scaffold.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

let __dirname = dirname(fileURLToPath(import.meta.url));
let pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

/**
 * @param {String[]} argv
 * @returns {{ command: string, flags: Object<string, string|boolean> }}
 */
export function parseArgs(argv) {
  /** @type {Record<string, string|boolean>} */
  let flags = {};
  let command = '';
  for (let arg of argv) {
    if (arg.startsWith('--')) {
      let [key, val] = arg.slice(2).split('=');
      flags[key] = val ?? true;
    } else if (!command) {
      command = arg;
    }
  }
  return { command, flags };
}

const HELP_TEXT = `
JSDA-Kit v${pkg.version} — JSDA Toolkit for modern Web

Usage: jsda <command> [options]

Commands:
  serve            Start the development server
  build            Build static assets for production
  ssg              Start SSG watcher (dev mode)
  scaffold         Scaffold a new JSDA project (alias: init)

Options:
  --help           Show this help message
  --version        Show version number
  --port=<number>  Port for the dev server (default: 3000)
  --output=<dir>   Output directory for build (default: ./dist)

Examples:
  jsda serve --port=8080
  jsda build --output=./public
  jsda scaffold
`.trim();

/** @type {Record<keyof cli_commands, (flags: Object) => Promise<void>>} */
const CMD_MAP = {

  ssg: async () => {
    await import('../node/watch.js');
  },

  serve: async (flags) => {
    if (flags.port) {
      process.env.JSDA_PORT = String(flags.port);
    }
    await import('../server/index.js');
  },

  build: async (flags) => {
    if (flags.output) {
      process.env.JSDA_OUTPUT = String(flags.output);
    }
    await import('../node/ci.js');
  },

  scaffold: async () => {
    scaffold();
  },

  // Backward compatibility alias
  init: async () => {
    scaffold();
  },

};

let { command, flags } = parseArgs(process.argv.slice(2));

if (flags.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (flags.help || !command) {
  console.log(HELP_TEXT);
  process.exit(0);
}

if (!CMD_MAP[command]) {
  Log.err('JSDA CLI:', `Unknown command: ${command}`);
  console.log(HELP_TEXT);
  process.exit(1);
}

try {
  await CMD_MAP[command](flags);
} catch (e) {
  Log.err('JSDA CLI:', e);
  process.exit(1);
}
