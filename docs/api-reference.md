# API Reference

Consolidated index of all public APIs. Types are resolved from JSDoc in source files.

## Package Exports

| Import Path | Entry | Description |
|-------------|-------|-------------|
| `jsda-kit` | `iso/index.js` | Isomorphic utilities |
| `jsda-kit/node` | `node/index.js` | Node.js APIs |
| `jsda-kit/server` | `server/index.js` | Server |
| `jsda-kit/browser` | `browser/index.js` | Browser utilities |
| `jsda-kit/cfg` | `cfg/CFG.js` | Configuration |

## `jsda-kit` (Isomorphic)

| Export | Type | Description |
|--------|------|-------------|
| `applyData` | `(html, data, open?, close?) → string` | Template token injection |
| `getHash` | `(str) → Promise<string>` | SHA-1 hex hash |
| `b64Src` | `(data, mimeType, encode?) → string` | Base64 data URI creator |
| `md2html` | `(md) → Promise<string>` | Markdown → HTML with syntax highlighting |
| `MIME_MAP` | `Object<string, string>` | File extension → MIME type map |
| `addHeadingId` | `(html) → string` | Add IDs to HTML headings |
| `fromUrl` | `(url) → Promise<string>` | Fetch text content from URL |

## `jsda-kit/node`

| Export | Type | Description |
|--------|------|-------------|
| `htmlMin` | `(html) → string` | HTML minification |
| `cssMin` | `(css) → string` | CSS minification |
| `build` | `() → Promise<void>` | SSG build pipeline |
| `findFiles` | `(dir, include, exclude) → string[]` | Recursive file discovery |
| `getProjectStructure` | `(dir) → Object` | Directory structure analysis |
| `getImportMap` | `() → string` | Import map HTML generation |
| `wcSsr` | `(html, options?) → Promise<string>` | Web component SSR |
| `SSR` | `Class` | Symbiote.js SSR class (re-export) |
| `Log` | `Class` | Logging utility |

## `jsda-kit/server`

| Export | Type | Description |
|--------|------|-------------|
| `createServer` | `() → http.Server` | Create and start JSDA dev server |
| `jsBuild` | `(entry) → Promise<string>` | Bundle JS with esbuild + template minification |
| `cssBuild` | `(entry) → string` | Bundle CSS with esbuild |

## `jsda-kit/browser`

| Export | Type | Description |
|--------|------|-------------|
| `IDB` | `Class` | IndexedDB key-value wrapper |
| `cssLib` | `(url) → void` | Dynamic CSS loader |

## `jsda-kit/cfg`

| Export | Type | Description |
|--------|------|-------------|
| `default` / `cfg` | `JSDA_CFG` | Resolved configuration object |
| `defaults` | `JSDA_CFG` | Default configuration values |
| `deepMerge` | `(target, source) → Object` | Deep merge utility |
