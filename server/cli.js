#!/usr/bin/env node

import { createServer } from './JSDAServer.js';

// Parse command line arguments
const args = process.argv.slice(2);
let port = parseInt(args[args.indexOf('--port') + 1]);
let cacheOff = args.includes('--disable-cache');
let options = {};
if (port) {
  options.port = port;
}
if (cacheOff) {
  options.cache = false;
}


// Start the server with the provided options
createServer(options);
