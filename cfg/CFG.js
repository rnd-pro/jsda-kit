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

  sitemap: {
    enabled: false,
    baseUrl: '',
    exclude: [],
    changefreq: '',
    priority: '',
    filename: 'sitemap.xml',
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

/**
 * @param {JSDA_CFG} c
 * @returns {boolean}
 */
function getSitemapEnabled(c) {
  if (typeof c.sitemap === 'boolean') return c.sitemap;
  return !!c.sitemap?.enabled;
}

/**
 * @param {JSDA_CFG} c
 * @returns {{ baseUrl: string, exclude: string[], changefreq: string, priority: string, filename: string }}
 */
function getSitemapConfig(c) {
  let d = /** @type {Required<Exclude<JSDA_CFG['sitemap'], boolean | undefined>>} */ (defaults.sitemap);
  if (typeof c.sitemap !== 'object' || !c.sitemap) return { ...d };
  /** @type {Partial<typeof d>} */
  let s = c.sitemap;
  return {
    baseUrl: s.baseUrl || d.baseUrl,
    exclude: s.exclude || d.exclude,
    changefreq: s.changefreq || d.changefreq,
    priority: s.priority || d.priority,
    filename: s.filename || d.filename,
  };
}

export { cfg, defaults, deepMerge, getSsrEnabled, getSsrImports, getSsrNonce, getSitemapEnabled, getSitemapConfig };
export default cfg;
