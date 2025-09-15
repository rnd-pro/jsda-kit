export default {
  routes: './ref&test/hybrid-app/routes.js',
  pageDataFn: './ref&test/hybrid-app/data.js',
  ssrComponents: {
    templates: './ref&test/hybrid-app/wc/{name}/tpl.html.js',
    scripts: './ref&test/hybrid-app/wc/{name}/index.js',
    styles: './ref&test/hybrid-app/wc/{name}/style.css',
  },
  cache: true,
  port: 3000,
  importmap: true,
}
