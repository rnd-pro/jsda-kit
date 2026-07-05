# Static Site Generation (SSG)

JSDA-Kit's SSG pipeline converts ESM modules into static assets.

## How It Works

1. Scans `sourceDir` for files matching configured `entryPatterns`
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

By default, JSDA scans `['index.js', 'index.*.js']`. Add more patterns when you want non-index files to generate output:

```js
export default {
  static: {
    entryPatterns: [
      'index.js',
      'index.*.js',
      '*.html.js',
      '*.xml.js',
      '*.pdf.js',
    ],
  },
};
```

```txt
src/static/about.html.js -> dist/about.html
src/static/feed.xml.js   -> dist/feed.xml
```

## HTML Page Example

```js
// src/static/index.html.js
export const ssrImports = [
  './src/components/app-header.js'
];

export default /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Site</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <app-header></app-header>
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
npx jsda build-pdf
```

`build` skips `.pdf.js` entries. Use `build-pdf` to generate regular static output and PDFs.

## SSG Watcher

For development, the watcher rebuilds on file changes and starts a local static file server (`npx serve`) on the output directory after the first successful build:

```bash
npx jsda ssg
npx jsda ssg-pdf
```

`ssg` skips PDFs for fast development builds. `ssg-pdf` watches and rebuilds regular output plus PDF files.

## PDF Generation

PDF entries use the `.pdf.js` extension and are generated with Puppeteer by `jsda build-pdf` and `jsda ssg-pdf`.

```js
// src/static/reports/annual.pdf.js
export const pdfOptions = {
  format: 'A4',
  margin: {
    top: '16mm',
    right: '16mm',
    bottom: '16mm',
    left: '16mm',
  },
};

export default () => `
  <!doctype html>
  <html>
    <body>
      <h1>Annual Report</h1>
    </body>
  </html>
`;
```

Install Puppeteer in projects that generate PDFs:

```bash
npm install -D puppeteer
```

PDF defaults live under `static.pdf`:

```js
export default {
  static: {
    pdf: {
      waitUntil: 'load',
      outputDir: '',
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
};
```

When `pdf.outputDir` is set, PDFs are written there instead of `outputDir`. This is useful for committing generated PDFs and letting CI copy them into `dist` without running Puppeteer.

## Static Copy

Use `static.copy` to copy committed files or folders into `outputDir`:

```js
export default {
  static: {
    copy: [
      { from: './generated/pdf', to: './pdf' },
      { from: './src/static-files', to: './' },
    ],
  },
};
```

For zero-config colocated assets, use folders under `sourceDir` whose name starts with `copy-`. The prefix is stripped in the output path:

```txt
src/static/copy-assets/favicon.ico            -> dist/assets/favicon.ico
src/static/reports/copy-pdf/annual-report.pdf -> dist/reports/pdf/annual-report.pdf
```

Files inside `copy-*` folders are copied as raw files and are not processed as JSDA entries.

## Tagged Template Minification

During bundling, `html` and `css` tagged template literals are automatically minified using `esbuild-minify-templates`. Untagged templates are left untouched.

To exclude a specific template:

```js
/*! minify-templates-ignore */
let preserved = html`
  keep   this   spacing
`;
```

## Sitemap Generation

The build pipeline can automatically generate a `sitemap.xml` from the produced HTML pages.

### Configuration

Enable in `project.cfg.js`:

```js
export default {
  static: {
    sourceDir: './src/static',
    outputDir: './dist',
  },
  sitemap: {
    enabled: true,
    baseUrl: 'https://example.com',
  },
};
```

Full options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable sitemap generation |
| `baseUrl` | `string` | `''` | **Required.** Site origin for absolute URLs |
| `exclude` | `string[]` | `[]` | URL path substrings to exclude |
| `changefreq` | `string` | `''` | Default change frequency for all entries |
| `priority` | `string` | `''` | Default priority for all entries |
| `filename` | `string` | `'sitemap.xml'` | Output filename |

Shorthand: `sitemap: true` enables with defaults (you still need `baseUrl` set separately, or it will warn and skip).

### Path Normalization

Output paths are normalized for clean URLs:

```
dist/index.html         → https://example.com/
dist/about/index.html   → https://example.com/about/
dist/404.html           → https://example.com/404.html
```

### Exclusions

Paths are filtered by substring matching against the normalized URL path:

```js
sitemap: {
  enabled: true,
  baseUrl: 'https://example.com',
  exclude: ['/admin/', '/internal/'],
},
```

### `lastmod`

Each `<url>` entry includes a `<lastmod>` date derived from the output file's modification time.
