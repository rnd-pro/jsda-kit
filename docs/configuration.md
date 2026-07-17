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
    entryPatterns: ['index.js', 'index.*.js'],
    exclude: [],
    copy: [],
    pdf: {
      waitUntil: 'load',
      outputDir: '',
      launchOptions: {},
      options: {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '16mm',
          right: '16mm',
          bottom: '16mm',
          left: '16mm',
        },
      },
    },
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
| `sourceDir` | `string` | `'./src/static'` | Source directory to scan for SSG entries |
| `entryPatterns` | `string[]` | `['index.js', 'index.*.js']` | Glob-style JSDA entry patterns |
| `exclude` | `string[]` | `[]` | Glob-style source paths to skip during static processing |
| `copy` | `{ from: string, to: string }[]` | `[]` | Static file/folder copy rules; `to` is relative to `outputDir` |
| `pdf.waitUntil` | `string \| string[]` | `'load'` | Puppeteer `page.setContent()` wait condition for PDF rendering |
| `pdf.outputDir` | `string` | `''` | Optional alternate destination for generated PDFs |
| `pdf.launchOptions` | `object` | `{}` | Options passed to `puppeteer.launch()` |
| `pdf.options` | `object` | `{ format: 'A4', printBackground: true, margin: ... }` | Options passed to Puppeteer `page.pdf()` |

`entryPatterns` supports filename patterns such as `*.html.js` and relative path patterns such as `pages/*.html.js`. Patterns without `/` match filenames at any depth under `sourceDir`.

`exclude` patterns are relative to `sourceDir`. Patterns without `/` match a file or folder name at any depth; path patterns match from the source root. Excluding a folder also excludes its descendants:

```js
static: {
  exclude: ['drafts', 'pages/private/**', '**/*.draft.html.js'],
}
```

For zero-config exclusion, prefix any folder name with `exclude-`. Such folders are skipped wherever they occur under `sourceDir`:

```txt
src/static/exclude-drafts/index.html.js         # skipped
src/static/pages/exclude-preview/index.html.js  # skipped
```

Exclusions also apply to files discovered in zero-config `copy-*` folders. Explicit `static.copy` rules remain explicit and are not filtered by `static.exclude`.

Folders under `sourceDir` whose name starts with `copy-` are copied to `outputDir` with the prefix stripped:

```txt
src/static/copy-assets/favicon.ico -> dist/assets/favicon.ico
src/static/docs/copy-pdf/file.pdf  -> dist/docs/pdf/file.pdf
```

PDF files are generated only by `jsda build-pdf` and `jsda ssg-pdf`. Plain `jsda build` and `jsda ssg` skip `.pdf.js` entries.

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
