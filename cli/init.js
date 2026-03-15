import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkDirExists } from '../node/checkDirExists.js';
import { defaults } from '../cfg/CFG.js';
import { Log } from '../node/Log.js';

let __dirname = path.dirname(fileURLToPath(import.meta.url));

const gitignore = `
## editors
/.idea
/.vscode

## system files
.DS_Store

## npm
/node_modules/
/npm-debug.log
/package-lock.json

## dev
TMP
build
dist
env

## Runtime
secrets/
.env
`;

const folders = [
  './types',
  './src/static',
  './src/dynamic',
  './src/components',
  './src/components/server-only',
  './src/components/client-only',
  './src/components/iso',
  './src/css',
  './src/md',
];

const sampleComponent = `import Symbiote, { html, css } from '@symbiotejs/symbiote';

class AppHello extends Symbiote {
  init$ = {
    name: 'World',
  };
}

AppHello.template = html\`
<div class="greeting">Hello, {{name}}!</div>
\`;

AppHello.rootStyles = css\`
app-hello {
  display: block;
  padding: 1em;
  font-family: system-ui, sans-serif;
}

app-hello .greeting {
  font-size: 1.5rem;
  color: var(--primary, #007acc);
}
\`;

AppHello.reg('app-hello');

export default AppHello;
`;

const sampleRoute = `export default /*html*/ \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{[title]}</title>
  <script type="module" src="/src/components/app-hello.js"></script>
  <script type="module" src="/src/components/iso/iso-card.js"></script>
</head>
<body>
  <h1>{[title]}</h1>
  <app-hello></app-hello>
  <iso-card></iso-card>
</body>
</html>
\`;
`;

/**
 * Read a scaffold file shipped with the package.
 * @param  {...string} segments Path segments relative to cli/scaffolds/
 * @returns {string}
 */
function readScaffold(...segments) {
  return fs.readFileSync(path.join(__dirname, 'scaffolds', ...segments), 'utf8');
}

function createFile(filePath, content) {
  if (filePath.replace('./', '').split('/').length > 1) {
    checkDirExists(filePath);
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    Log.success('File created:', filePath);
  } else {
    Log.warn('File already exists:', filePath);
  }
}

export function init() {

  folders.forEach((folder) => {
    checkDirExists(folder);
  });

  createFile('./project.cfg.js', `export default ${JSON.stringify(defaults, null, 2)}`);
  createFile('./README.md', `# Project Name`);
  createFile('./LICENSE', 'MIT');
  createFile('./tsconfig.json', fs.readFileSync('./node_modules/jsda-kit/tsconfig.json', 'utf8'));
  createFile('./.npmrc', 'package-lock=false');
  createFile('./.gitignore', gitignore);
  createFile('./src/components/app-hello.js', sampleComponent);
  createFile('./src/dynamic/index.html.js', sampleRoute);

  // Component sub-folder examples
  createFile('./src/components/server-only/server-info.js', readScaffold('server-only', 'server-info.js'));
  createFile('./src/components/server-only/exports.js', readScaffold('server-only', 'exports.js'));

  createFile('./src/components/client-only/client-counter.js', readScaffold('client-only', 'client-counter.js'));
  createFile('./src/components/client-only/exports.js', readScaffold('client-only', 'exports.js'));

  createFile('./src/components/iso/iso-card.js', readScaffold('iso', 'iso-card.js'));
  createFile('./src/components/iso/exports.js', readScaffold('iso', 'exports.js'));

}
