import pth from '../node/pth.js';
import chalk from 'chalk';

/** @type {JSDA_CFG} */
const defaults = {
  dynamic: {
    port: 3000,
    routes: './src.dynamic/routes.js',
    cache: {
      inMemory: true,
      exclude: [],
    },
    getDataFn: () => { return {} },
    getRouteFn: () => '',
    baseDir: './src/',
  },

  static: {
    outputDir: './dist/static',
    sourceDir: './src',
  },

  minify: {
    js: true,
    css: true,
    html: true,
    svg: true,
    exclude: [],
  },

  bundle: {
    js: true,
    css: true,
    exclude: [],
  },

  log: true,

  importmap: {
    packageList: [],
    srcSchema: 'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm',
    polyfills: false,
    preload: true,
  },
  
}

/** @type {JSDA_CFG} */
let cfg = {...defaults};

try {
  /** @type {JSDA_CFG} */
  let cfgObj = (await import(pth('project.cfg.js'))).default;
  Object.assign(cfg, cfgObj);
} catch(err) {
  console.log(chalk.red('DWA Server:'), 'Error loading config');
  console.error(err);
}

export { cfg, defaults };
export default cfg;
