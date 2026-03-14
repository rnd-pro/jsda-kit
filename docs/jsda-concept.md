# JSDA Concept

**JSDA** stands for **JavaScript Delivery Approach** — a modern methodology for building web applications where JavaScript modules serve as the primary asset generation format.

## Core Philosophy

Instead of using traditional templating engines or build-time preprocessors, JSDA treats ESM modules as the universal source for all web assets:

- **HTML pages** are default exports of `.html.js` files
- **CSS stylesheets** are default exports of `.css.js` files  
- **SVG graphics** are default exports of `.svg.js` files

```js
// src/static/index.html.js
export default /*html*/ `
<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body><h1>Hello JSDA</h1></body>
</html>
`;
```

## Why ESM as Assets?

1. **Dynamic generation** — use JavaScript logic (loops, conditionals, functions) to compose assets
2. **Data injection** — import and embed data at build time
3. **Code sharing** — share constants, utilities, and templates across all asset types
4. **Type safety** — full IDE support with JSDoc and TypeScript
5. **No new syntax** — just standard JavaScript template literals

## How It Works

The JSDA-Kit build pipeline:

1. Finds all `index.*.js` files in `sourceDir`
2. Imports each module and reads its default export
3. Applies minification based on the output type
4. Writes the result to `outputDir` (stripping the `.js` extension)

```
src/static/index.html.js  →  dist/index.html
src/static/style.css.js   →  dist/style.css
src/static/icon.svg.js    →  dist/icon.svg
```

## JSDA + Symbiote.js

JSDA-Kit is designed to work seamlessly with [Symbiote.js](https://github.com/nicotordev/symbiote.js) web components. Combined with the built-in SSR support, you get:

- Isomorphic components that render on server and hydrate on client
- Tagged template literal minification (`html` and `css` tagged templates)
- Import map generation for CDN-based dependency loading
