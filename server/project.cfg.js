export default {
  routes: './ref/routes.js',
  pageDataFn: './ref/data.js',
  ssrComponents: {
    templates: './ref/wc/{name}/tpl.html.js',
    scripts: './ref/wc/{name}/index.js',
    styles: './ref/wc/{name}/style.css',
  },
  cache: true,
  port: 3000,
  importmap: true,
}
