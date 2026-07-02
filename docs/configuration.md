# Configuration

JSDA-Kit uses a `project.cfg.js` file at the project root. All properties are optional — sensible defaults are used when not specified.

## Example

```js
export default {
  dynamic: {
    port: 3000,
    routes: './src/dynamic/routes.js',
    cache: {
      inMemory: true,
      exclude: [],
    },
    baseDir: './src/',
  },

  static: {
    outputDir: './dist',
    sourceDir: './src/static',
  },

  ssr: {
    enabled: true,
    imports: ['./src/components/index.js'],
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
    packageList: ['@symbiotejs/symbiote'],
    srcSchema: 'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm',
    polyfills: false,
    preload: true,
  },

  markdown: {
    externalLinks: {
      enabled: true,
      target: '_blank',
      rel: 'noopener noreferrer',
      exclude: [],
    },
  },
};
```

## Reference

### `dynamic`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `port` | `number` | `3000` | Dev server port |
| `routes` | `string` | `'./src/dynamic/routes.js'` | Path to routes mapping module |
| `cache.inMemory` | `boolean` | `true` | Enable in-memory response caching |
| `cache.exclude` | `string[]` | `[]` | Paths to exclude from caching |
| `baseDir` | `string` | `'./src/'` | Base directory for static file serving |
| `getRouteFn` | `Function` | `async () => ''` | Custom route resolution function |
| `getDataFn` | `Function` | `async () => {}` | Custom data provider for route templates |

### `static`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `outputDir` | `string` | `'./dist'` | Output directory for SSG build |
| `sourceDir` | `string` | `'./src/static'` | Source directory to scan for `index.*.js` files |

### `ssr`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ssr` | `boolean \| object` | `{ enabled: false }` | SSR configuration — `true` enables with defaults |
| `ssr.enabled` | `boolean` | `false` | Enable Symbiote.js SSR |
| `ssr.imports` | `string[]` | `[]` | Component module paths to import for SSR |
| `ssr.cspNonce` | `string` | `''` | CSP nonce added to all inline `<style>` tags during SSR |

When enabled, HTML output is processed through `SSR.processHtml()` after importing the specified component modules. Supports both `ssr: true` (boolean shorthand) and the full object form.

Individual JSDA endpoints can also export `ssrImports` for page-specific components — see [SSR docs](./ssr.md).

### `minify`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `js` | `boolean` | `true` | Minify JavaScript bundles |
| `css` | `boolean` | `true` | Minify CSS output |
| `html` | `boolean` | `true` | Minify HTML output |
| `svg` | `boolean` | `true` | Minify SVG output |
| `exclude` | `string[]` | `[]` | File path substrings to exclude from minification |

### `bundle`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `js` | `boolean` | `true` | Bundle JavaScript with esbuild |
| `css` | `boolean` | `true` | Bundle CSS with esbuild |
| `exclude` | `string[]` | `[]` | Entry points to exclude from bundling |

### `importmap`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `packageList` | `string[]` | `[]` | Packages to include in generated import map |
| `srcSchema` | `string` | `'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm'` | URL template for CDN imports |
| `polyfills` | `boolean` | `false` | Include import map polyfill script |
| `preload` | `boolean` | `true` | Add `<link rel="modulepreload">` for mapped modules |

### `markdown`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `externalLinks.enabled` | `boolean` | `true` | Add configured attributes to external Markdown links |
| `externalLinks.target` | `string` | `'_blank'` | Target attribute for external links |
| `externalLinks.rel` | `string` | `'noopener noreferrer'` | Rel attribute for external links |
| `externalLinks.exclude` | `string[]` | `[]` | URL substrings to exclude from external-link attributes |

External links are links whose `href` starts with `http://`, `https://`, or `//`.

### `log`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `log` | `boolean` | `true` | Enable console logging |

## Deep Merge Behavior

Configuration is deep-merged with defaults. This means you only need to specify the properties you want to override:

```js
// Only override cache settings — other dynamic properties keep their defaults
export default {
  dynamic: {
    cache: {
      inMemory: false,
    },
  },
};
```
