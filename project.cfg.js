/** @type {JSDA_CFG} */
export default {

  dynamic: {
    port: 3000,
    routes: './ref-test/hybrid-app/routes.js',
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
