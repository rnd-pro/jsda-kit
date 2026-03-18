/**
 * Worker script forked by scaffold.test.js.
 * Starts a JSDA server with custom port on the scaffolded project's cwd.
 * Sends 'ready' message back via IPC when the server is listening.
 */
import { createServer } from '../../server/JSDAServer.js';

let port = Number(process.argv[2]) || 4001;

let server = createServer({ port });

server.on('listening', () => {
  process.send('ready');
});
