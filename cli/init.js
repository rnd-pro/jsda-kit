import fs from 'fs';
import { checkDirExists } from '../node/checkDirExists.js';
import { defaults } from '../cfg/CFG.js';
import { Log } from '../node/Log.js';

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
</head>
<body>
  <h1>{[title]}</h1>
  <app-hello></app-hello>
</body>
</html>
\`;
`;

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

}
