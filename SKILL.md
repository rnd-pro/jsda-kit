---
name: jsda-kit
description: Build and debug JSDA-Kit projects using ESM asset generation, static builds, Symbiote.js SSR, dynamic server routes, and PDF output. Use when a project depends on jsda-kit or a task involves the jsda CLI or project.cfg.js.
---

# JSDA-Kit

JSDA-Kit turns JavaScript ESM modules into text assets and renders Symbiote.js Web Components. Use the consuming project's existing source layout, scripts, and `project.cfg.js`. Run the CLI from that project's root; configuration and SSR import paths resolve from there.

Read the relevant canonical guides below for complete examples and options. When working against a specific installed release, check its source and package exports before using an API from the latest documentation.

## Asset modules and static builds

- Use Node.js 20 or later and ESM (`"type": "module"` in `package.json`).
- Asset modules default-export a string, or, for SSG, a function returning a string. Compose HTML, CSS, SVG, Markdown, feeds, and other text with ordinary JavaScript imports and template literals.
- By default, SSG scans `src/static/` for `index.js` and `index.*.js`, then writes to `dist/`. An `index.js` entry is bundled as JavaScript; other asset entries lose their final `.js` extension.

```text
src/static/index.html.js       -> dist/index.html
src/static/about/index.html.js -> dist/about/index.html
src/static/notes/index.md.js   -> dist/notes/index.md
src/static/app/index.js        -> dist/app/index.js
```

A minimal page is an ESM asset:

```js
// src/static/index.html.js
export default /*html*/ `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Example</title></head>
  <body><h1>Hello, JSDA!</h1></body>
</html>`;
```

For filenames such as `feed.xml.js` or `report.md.js`, extend `static.entryPatterns` in `project.cfg.js`. Include the default patterns if those entries should still build: configuration deep-merges objects but replaces arrays.

```js
export default {
  static: {
    entryPatterns: ['index.js', 'index.*.js', '*.xml.js', '*.md.js'],
  },
};
```

Use the existing project's scripts, or invoke the CLI directly:

```bash
npx jsda serve                 # Dynamic server
npx jsda ssg                   # Static build watcher and output server
npx jsda build                 # Production static build
npx jsda build --output=./dist # Explicit output directory
```

For a new starter project, `npm install jsda-kit` followed by `npx jsda scaffold` fetches the official [JSDA Template](https://github.com/rnd-pro/jsda-template). Read the scaffolding guide for its source structure and component examples.

## Web Component SSR

Enable SSR for static HTML builds and list shared components in `project.cfg.js`:

```js
export default {
  ssr: {
    enabled: true,
    imports: ['./src/components/app-header.js'],
  },
};
```

- Export `ssrImports` from a `.html.js` endpoint for page-specific components. These paths resolve from the project root, including for deeply nested pages: `export const ssrImports = ['./src/components/about-card.js'];`.
- Global and endpoint imports are combined. For bundled `index.js` entries, use global SSR imports.
- Component imports must be Node-resolvable ESM JavaScript. Compile TypeScript before importing it into SSR. Use explicit `.js` extensions and relative specifiers inside barrel files.
- Register Symbiote components with `.reg('app-name')`. Set `isoMode = true` for components shared between SSR and the browser, and include their definitions in the browser entry for client behavior.
- For programmatic rendering, import `wcSsr` from `jsda-kit/node` and pass `{ imports, data, ssrOptions }` as needed. Prefer it to manually managing the shared `SSR` lifecycle.
- Supply a CSP style nonce through `ssr.cspNonce`, or `ssrOptions.nonce` for `wcSsr()`.

See the SSR and SSR import guides for full component, barrel, hydration, and programmatic examples.

## Dynamic routes and data

The default route map is `src/dynamic/routes.js`:

```js
export default {
  '/': './src/dynamic/home.html.js',
  '/about/': './src/dynamic/about.html.js',
};
```

Dynamic HTML modules must default-export strings. Supply request-specific values through `dynamic.getDataFn(route, url, headers)` and `{[key]}` tokens in the template. The server applies data, renders components, and minifies the result. It runs the SSR pipeline for HTML routes independently of the static build's SSR toggle.

`applyData()` performs literal token replacement without HTML escaping. Escape untrusted values before inserting them into HTML. Use `dynamic.getRouteFn(url, headers)` for custom route selection.

Response caching is enabled by default and keyed by the request URL, including its query string. For request-specific or personalized responses, configure caching explicitly; `dynamic.cache.inMemory: false` disables it. The default static serving directory is `dynamic.baseDir: './src/'`.

## Other output and APIs

- Use `static.copy` for explicit raw-file copies, or `copy-*` folders under `static.sourceDir` for colocated assets; the folder prefix is stripped in output paths. Files inside these folders are copied without JSDA processing.
- Use `static.exclude` or `exclude-*` folders to skip source content. Explicit `static.copy` rules are not filtered by `static.exclude`.
- PDF entries default-export HTML from `.pdf.js` files and must match `static.entryPatterns`. Install the optional `puppeteer` dependency and use `jsda build-pdf` or `jsda ssg-pdf`; ordinary builds skip PDFs. Configure defaults under `static.pdf` and per-entry overrides with `pdfOptions`.
- Enable generated sitemaps with `sitemap.enabled` and a `sitemap.baseUrl`. Use the SSG guide for exclusions and URL normalization.
- Configure CDN package mappings under `importmap`; `getImportMap()` from `jsda-kit/node` returns markup to include in a page.
- Use `jsda-kit/node` for build and SSR APIs, `jsda-kit/browser` for browser utilities, and `jsda-kit/cfg` for resolved configuration. Check the installed entry modules for individual helper exports.

## Verify the result

For consuming projects, run their relevant scripts and inspect generated files or served responses for the changed behavior. Verify the emitted asset path, rendered content, and browser behavior when applicable. Check build logs as well as the process exit code.

When changing JSDA-Kit itself, use `npm run test:unit`, `npm run test:server`, or `npm run test:browser` for the affected layer; `npm test` runs all three. The implementation lives in `node/`, `server/`, `cfg/`, `iso/`, `browser/`, and `cli/`, with corresponding tests under `test/`.

## Canonical documentation

These links remain usable when this skill is installed outside the repository. Read only the guides relevant to the task; they contain the complete examples and reference tables.

- [Documentation index](https://github.com/rnd-pro/jsda-kit/blob/main/docs/README.md) — guide navigation.
- [Getting Started](https://github.com/rnd-pro/jsda-kit/blob/main/docs/getting-started.md) — installation and first project.
- [JSDA Concept](https://github.com/rnd-pro/jsda-kit/blob/main/docs/jsda-concept.md) — ESM assets and file mapping.
- [Scaffolding](https://github.com/rnd-pro/jsda-kit/blob/main/docs/scaffolding.md) — starter layout and component examples.
- [Configuration](https://github.com/rnd-pro/jsda-kit/blob/main/docs/configuration.md) — defaults, overrides, and deep merging.
- [SSG](https://github.com/rnd-pro/jsda-kit/blob/main/docs/ssg.md) — asset examples, entry patterns, PDFs, copies, and sitemaps.
- [SSR](https://github.com/rnd-pro/jsda-kit/blob/main/docs/ssr.md) — components, data, programmatic rendering, and CSP.
- [SSR Import Formats](https://github.com/rnd-pro/jsda-kit/blob/main/docs/ssr-imports.md) — direct imports, barrels, and endpoint imports.
- [Server](https://github.com/rnd-pro/jsda-kit/blob/main/docs/server.md) — routes, data hooks, static serving, and caching.
- [Import Maps](https://github.com/rnd-pro/jsda-kit/blob/main/docs/import-maps.md) — CDN mappings and generated markup.
- [CLI](https://github.com/rnd-pro/jsda-kit/blob/main/docs/cli.md) — commands and flags.
- [API Reference](https://github.com/rnd-pro/jsda-kit/blob/main/docs/api-reference.md) — package entry points and helpers.
- [Browser Utilities](https://github.com/rnd-pro/jsda-kit/blob/main/docs/browser-utilities.md) — interpolation, Markdown, hashing, and IndexedDB examples.
