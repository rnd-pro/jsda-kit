import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Log } from '../node/Log.js';

let __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCAFFOLD_DIR = path.join(__dirname, 'scaffolds', 'project');

/**
 * Recursively copy scaffold tree to target, skipping existing files.
 * @param {string} srcDir
 * @param {string} destDir
 */
function copyTree(srcDir, destDir) {
  let entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(srcDir, entry.name);
    let destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyTree(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        Log.success('File created:', destPath);
      } else {
        Log.warn('File already exists:', destPath);
      }
    }
  }
}

/**
 * Create a file only if it doesn't exist.
 * @param {string} filePath
 * @param {string} content
 */
function createFile(filePath, content) {
  let dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    Log.success('File created:', filePath);
  } else {
    Log.warn('File already exists:', filePath);
  }
}

const PROJECT_CFG = `import { getDataFn, getRouteFn } from './src/dynamic/node/handlers.js';

/** @type {JSDA_CFG} */
export default {
  dynamic: {
    port: 3000,
    routes: './src/dynamic/routes.js',
    baseDir: './src/dynamic/',
    getRouteFn,
    getDataFn,
  },
  static: {
    outputDir: './dist',
    sourceDir: './src/static',
  },
  ssr: {
    enabled: true,
    imports: [
      './src/components/server-only/exports.js',
      './src/components/iso/exports.js',
    ],
  },
  importmap: {
    packageList: ['@symbiotejs/symbiote'],
  },
};
`;

export function scaffold() {
  // 1. Copy scaffold file tree
  copyTree(SCAFFOLD_DIR, '.');

  // 2. Generate package.json with project folder name
  let folderName = path.basename(process.cwd());
  let packageJson = JSON.stringify({
    name: folderName,
    version: '0.0.1',
    type: 'module',
    scripts: {
      dev: 'jsda serve',
      build: 'jsda build',
    },
    dependencies: {
      '@symbiotejs/symbiote': '^3.5.7',
      'jsda-kit': '^1.2.0',
    },
    devDependencies: {
      '@types/node': '^24.0.0',
    },
  }, null, 2) + '\n';
  createFile('./package.json', packageJson);

  // 3. Generate project.cfg.js
  createFile('./project.cfg.js', PROJECT_CFG);

  // 4. Copy tsconfig.json from package
  let tsconfigSrc = './node_modules/jsda-kit/tsconfig.json';
  if (fs.existsSync(tsconfigSrc)) {
    createFile('./tsconfig.json', fs.readFileSync(tsconfigSrc, 'utf8'));
  } else {
    // Fallback: create a sensible default
    createFile('./tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'bundler',
        checkJs: true,
        noEmit: true,
        strict: false,
        skipLibCheck: true,
      },
      include: ['src/**/*.js', 'types/**/*.d.ts'],
    }, null, 2) + '\n');
  }
}
