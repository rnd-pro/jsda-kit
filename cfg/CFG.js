import pth from '../node/pth.js';
import { Log } from '../node/Log.js';

/** @type {JSDA_CFG} */
const defaults = {
  dynamic: {
    port: 3000,
    routes: './jsda/routes.js',
    cache: {
      inMemory: true,
      exclude: [],
    },
  },

  static: {
    outputDir: './dist',
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

  logging: true,
}

/** @type {JSDA_CFG} */
let cfg = {...defaults};

try {
  /** @type {JSDA_CFG} */
  let cfgObj = (await import(pth('project.cfg.js'))).default;
  Object.assign(cfg, cfgObj);
} catch(err) {
  Log.err('DWA Server:', 'Error loading config');
  Log.err(err);
}

export { cfg, defaults };
export default cfg;
