# JSDA-Kit Documentation

JSDA-Kit is an ESM-native toolkit for building static assets, server-rendered pages, dynamic routes, and isomorphic Web Components. This index links to the guides and references for the current release.

New to JSDA-Kit? Start with [Getting Started](./getting-started.md), then read the [JSDA Concept](./jsda-concept.md) for the ideas behind the toolkit.

## Start Here

- [Getting Started](./getting-started.md) -- install JSDA-Kit, scaffold a project, run development servers, and create a production build.
- [JSDA Concept](./jsda-concept.md) -- understand the ESM-as-assets model and how JSDA works with Symbiote.js.
- [Scaffolding](./scaffolding.md) -- create a complete starter project and review its generated structure.
- [Configuration](./configuration.md) -- configure static and dynamic output, SSR, minification, import maps, Markdown, and logging.

## Build and Rendering

- [Static Site Generation](./ssg.md) -- generate HTML, JavaScript, CSS, SVG, feeds, and PDFs; configure entry patterns, exclusions, static copies, and sitemaps.
- [Server-Side Rendering](./ssr.md) -- render Web Components in static builds or dynamic routes, including per-endpoint imports and CSP nonces.
- [SSR Import Formats](./ssr-imports.md) -- use direct component imports, barrel modules, re-exports, and endpoint-specific imports.
- [JSDA Server](./server.md) -- define routes, serve static files, provide data, customize route resolution, and configure caching.
- [Import Maps](./import-maps.md) -- map package imports to CDN URLs, add module preloads, and configure polyfills.

## Commands and APIs

- [CLI Reference](./cli.md) -- reference for `serve`, `build`, `build-pdf`, `ssg`, `ssg-pdf`, and `scaffold`.
- [API Reference](./api-reference.md) -- package exports for isomorphic, Node.js, server, browser, and configuration APIs.
- [Browser Utilities](./browser-utilities.md) -- use data interpolation, hashing, base64 sources, Markdown rendering, MIME types, IndexedDB, and CSS loading helpers.

## Related Resources

- [Project README](../README.md) -- feature overview, quick start, examples, and project comparison.
- [JSDA Manifest](https://github.com/rnd-pro/jsda) -- the broader JSDA concept and conventions.
- [JSDA Project Template](https://github.com/rnd-pro/jsda-template) -- the official starter template.
- [Symbiote.js](https://github.com/symbiotejs/symbiote.js) -- the isomorphic Web Components framework used by JSDA-Kit.
