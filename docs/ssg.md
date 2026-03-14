# Static Site Generation (SSG)

JSDA-Kit's SSG pipeline converts ESM modules into static assets.

## How It Works

1. Scans `sourceDir` for files matching `index.*.js` pattern
2. Imports each module and reads its default export (string or function returning string)
3. Applies SSR (if `ssr: true`) for HTML files containing custom elements
4. Applies minification based on output type
5. Writes results to `outputDir`

## File Naming Convention

```
src/static/index.html.js  →  dist/index.html
src/static/style.css.js   →  dist/style.css
src/static/icon.svg.js    →  dist/icon.svg
src/static/app/index.js   →  dist/app/index.js  (bundled by esbuild)
```

Files named `index.js` (without a second extension) are treated as JavaScript bundles and processed by esbuild.

## HTML Page Example

```js
// src/static/index.html.js
export default /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Site</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Welcome</h1>
  <script type="module" src="/app/index.js"></script>
</body>
</html>
`;
```

## Dynamic Content with Functions

Default exports can be functions for dynamic generation:

```js
// src/static/sitemap.xml.js
export default function() {
  let pages = ['/about', '/contact', '/blog'];
  return /*html*/ `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `<url><loc>https://example.com${p}</loc></url>`).join('\n')}
</urlset>`;
}
```

## Build Command

```bash
npx jsda build
npx jsda build --output=./public
```

## SSG Watcher

For development, the watcher rebuilds on file changes:

```bash
npx jsda ssg
```

## Tagged Template Minification

During bundling, `html` and `css` tagged template literals are automatically minified using `esbuild-minify-templates`. Untagged templates are left untouched.

To exclude a specific template:

```js
/*! minify-templates-ignore */
let preserved = html`
  keep   this   spacing
`;
```
