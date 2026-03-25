import pth from '../node/pth.js';

/**
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function deepMerge(target, source) {
  let result = { ...target };
  for (let key in source) {
    if (
      source[key] !== null
      && typeof source[key] === 'object'
      && !Array.isArray(source[key])
      && typeof result[key] === 'object'
      && result[key] !== null
      && !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/** @type {JSDA_CFG} */
const defaults = {
  dynamic: {
    port: 3000,
    routes: './src/dynamic/routes.js',
    cache: {
      inMemory: true,
      exclude: [],
    },
    getDataFn: async () => { return {} },
    getRouteFn: async () => '',
    baseDir: './src/',
  },

  static: {
    outputDir: './dist',
    sourceDir: './src/static',
    port: 3001,
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

  ssr: {
    enabled: false,
    imports: [],
    cspNonce: '',
  },

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
  cfg = deepMerge(defaults, cfgObj);
} catch {
  // project.cfg.js not found — using defaults (zero-config mode)
}

/**
 * @param {JSDA_CFG} c
 * @returns {boolean}
 */
function getSsrEnabled(c) {
  if (typeof c.ssr === 'boolean') return c.ssr;
  return !!c.ssr?.enabled;
}

/**
 * @param {JSDA_CFG} c
 * @returns {string[]}
 */
function getSsrImports(c) {
  if (typeof c.ssr === 'object' && c.ssr?.imports) return c.ssr.imports;
  return [];
}

/**
 * @param {JSDA_CFG} c
 * @returns {string}
 */
function getSsrNonce(c) {
  if (typeof c.ssr === 'object' && c.ssr?.cspNonce) return c.ssr.cspNonce;
  return '';
}

export { cfg, defaults, deepMerge, getSsrEnabled, getSsrImports, getSsrNonce };
export default cfg;
