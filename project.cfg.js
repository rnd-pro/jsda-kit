/** @type {JSDA_CFG} */
export default {

  dynamic: {
    port: 3000,
    routes: './ref-test/hybrid-app/routes.js',
    cache: {
      inMemory: true,
      exclude: [],
    },
    getDataFn: () => {},
  },

  static: {
    outputDir: './dist',
    sourceDir: './ref-test/hybrid-app/static',
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
    packageList: [
      '@symbiotejs/symbiote',
    ],
    srcSchema: 'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm',
    polyfills: false,
    preload: true,
  },

}
