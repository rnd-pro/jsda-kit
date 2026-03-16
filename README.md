[![npm version](https://img.shields.io/npm/v/jsda-kit)](https://www.npmjs.com/package/jsda-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![ESM](https://img.shields.io/badge/ESM-only-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

# JSDA-Kit

<img src="https://rnd-pro.com/svg/jsda/index.svg" width="200" alt="JSDA">

A comprehensive toolkit for building modern web applications with Static Site Generation (SSG), Server-Side Rendering (SSR), and dynamic servers. JSDA-Kit transforms standard JavaScript ESM modules into web assets.

## What is JSDA?

**JSDA** (JavaScript Distributed Assets) treats JavaScript ESM modules as text-based web asset generation endpoints — providing PHP-like templating with modern JavaScript and ESM modules.

> **Learn more**: https://github.com/rnd-pro/jsda

**[Symbiote.js](https://github.com/symbiotejs/symbiote.js)** — lightweight Web Components framework used by JSDA-Kit for isomorphic UI: same components render via SSR on the server and hydrate on the client.

## Key Features

### ESM-Native Asset Pipeline
- **JS modules as web assets** — `.html.js`, `.css.js`, `.svg.js` files export strings that become production assets; use full JavaScript (loops, conditionals, imports) instead of limited template engines
- **Convention-based file mapping** — `src/static/index.html.js → dist/index.html`; no routing config or manifest files needed for static output
- **Function exports** — default exports can be functions for dynamic generation (sitemaps, feeds, config-driven pages)

### Web Component SSR
- **Symbiote.js SSR engine** — custom elements rendered on the server with Declarative Shadow DOM support 
- **Three-tier SSR imports** — global imports in `project.cfg.js`, per-endpoint `ssrImports` exports in individual `.html.js` files, and programmatic `wcSsr()` API for full control
- **Isomorphic components** — set `isoMode = true` on a Symbiote.js component and it auto-detects its environment; same code runs SSR on server, hydrates on client, or renders client-only
- **Barrel file resolution** — SSR import loader automatically resolves `export *`, re-exports, and side-effect imports from barrel files

### Security
- **Trusted Types & CSP support** — pass a nonce to SSR and all inline `<style>` tags get the `nonce` attribute automatically, enabling strict Content Security Policy

### Build & Bundling
- **Static Site Generation** — JAMStack-ready SSG; source folder structure maps directly to output (`src/static/about/index.html.js → dist/about/index.html`), deploy the `dist/` folder to any static hosting as-is
- **esbuild-powered** — JS/CSS bundling with tree-shaking, ESM output; works both at build time and on-the-fly during `serve`
- **Tagged template minification** — `html` and `css` tagged template literals minified automatically inside bundles; untagged templates left untouched
- **Asset minification** — HTML (via `@minify-html/node`), CSS, and SVG minified by default with per-file excludes
- **SSG watcher** — `jsda ssg` rebuilds on file changes during development

### JSDA Server
- **Route-based SSR pipeline** — `Request → Route Lookup → Data Injection → SSR → Minification → Response`; define routes as a simple JS object mapping paths to `.html.js` modules
- **Custom data and route hooks** — `getDataFn(route, url, headers)` injects data into templates, `getRouteFn(url, headers)` enables dynamic route resolution (i18n, A/B testing)
- **In-memory response caching** — enabled by default with URL-level granularity and per-path excludes

### Configuration & DX
- **Zero-config start** — works out of the box; all settings have sensible defaults
- **Deep-mergeable config** — `project.cfg.js` is deep-merged with defaults; override only what you need
- **Project scaffolding** — `jsda init` generates folder structure, config, sample components (server-only, client-only, isomorphic), routes, and dev tooling config
- **Automatic import maps** — generates `<script type="importmap">` from `package.json` versions with configurable CDN schema, `<link rel="modulepreload">`, and optional polyfills
- **CLI** — `serve`, `build`, `ssg`, `init` with `--port`, `--output`, `--help`, `--version`

### Isomorphic Utilities
- **Markdown to HTML** — `md2html()` with syntax highlighting (highlight.js) and automatic heading IDs; works in both Node.js and browser
- **Template data injection** — `applyData()` replaces `{[key]}` tokens in any string; customizable delimiters
- **Cross-environment hashing** — `getHash()` produces SHA-1 hex using Web Crypto (browser) or Node.js crypto
- **IndexedDB wrapper** — `IDB` class with key-value CRUD, cross-tab sync via `storage` events, and subscription API

## JSDA-Kit vs Next.js

If you've grown tired of fighting meta-platform opaque complexity, JSDA-Kit offers a radically different path — with the flexibility to handle projects of any scale.

| | **JSDA-Kit** | **Next.js** |
|---|---|---|
| **Philosophy** | You control everything — ESM modules are your assets, Web Components are your UI | The framework controls everything — conventions, rendering strategy, deployment target |
| **Component model** | W3C Custom Elements — platform-native, zero runtime lock-in, interoperable with anything | React-only — JSX compilation required, components don't work outside React |
| **SSR granularity** | Per-component `isoMode` — mix SSR, client-only, and isomorphic on the same page with zero config | Per-page/layout rendering strategy — `'use client'` / `'use server'` boundary management |
| **Build speed** | esbuild — fast by default, no config, no plugins to debug | Turbopack/webpack — fast when it works, complex when it doesn't |
| **Dependencies** | 7 production deps, ~50 MB `node_modules` | 700+ transitive deps, 300+ MB `node_modules`, long install times |
| **CI speed** | Seconds to install, seconds to build — minimal deps mean fast pipelines | Minutes for `npm install` alone; large dependency trees slow down every CI run |
| **Runtime weight** | 0 KB for static pages; Symbiote.js ~7 KB gzipped for interactive | React ~44 KB gzipped + framework chunks on every page |
| **Configuration** | Single `project.cfg.js`, deep-mergeable — override only what you need | `next.config.js` + App Router conventions + caching rules + middleware config |
| **Debugging** | ~2,500 LOC total — readable source, no black boxes | ~300,000+ LOC framework internals — good luck tracing a build issue |
| **Vendor lock-in** | None — standard ESM, plain file output, deploy anywhere | Vercel-optimized — self-hosting has documented rough edges |
| **Flexibility** | Full access to Node.js, custom route/data hooks, any hosting, any structure | Opinionated conventions — step outside them and you fight the framework |

**Image optimization and management** — [Cloud Images Toolkit](https://github.com/rnd-pro/cloud-images-toolkit) handles the media side: CDN synchronization, adaptive image embed code generation, smart local caching, built-in management UI, and interactive widget generation (galleries, panoramas, 360° views). Framework-independent — works with JSDA-Kit (as a prt of ecosystem) or any other project. Unlike Next.js, which locks image optimization into the Vercel edge network, CIT lets you choose any image CDN — with Cloudflare Images supported out of the box.

> [!IMPORTANT]
> JSDA-Kit handles projects of any complexity — from a single landing page to a full-scale web application. The difference is: **you stay in control**.

> [!TIP]
> **Free hosting friendly** — the light CI pipeline fits comfortably within the free tiers of GitHub Pages or Cloudflare Pages — no paid plan required for most projects.

## Quick Start

```bash
npm install jsda-kit

# Scaffold a new project
npx jsda init

# Start dev server
npx jsda serve

# Build for production
npx jsda build
```

## Example: ESM as Assets

```javascript
// src/static/index.html.js → dist/index.html
export default /*html*/ `
<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body>
  <h1>Hello, JSDA!</h1>
  <app-greeting></app-greeting>
  <script type="module" src="/app/index.js"></script>
</body>
</html>
`;
```

## Example: Isomorphic Component

```javascript
import Symbiote, { html, css } from '@symbiotejs/symbiote';

class AppGreeting extends Symbiote {
  isoMode = true;
  greeting = 'Hello, World!';
}

AppGreeting.template = html`
<h2 ${{textContent: 'greeting'}}></h2>
`;

AppGreeting.rootStyles = css`
app-greeting {
  display: block;
  padding: 1em;
}
`;

AppGreeting.reg('app-greeting');
```

Same code runs everywhere — SSR on the server, hydration on the client, or pure client rendering. Set `isoMode = true` and the component auto-detects. Server-only and client-only components are also possible — `isoMode` is opt-in per component.

## CLI

```
jsda <command> [options]

Commands:
  serve            Start the development server
  build            Build static assets for production
  ssg              Start SSG watcher (dev mode)
  init             Scaffold a new JSDA project

Options:
  --help           Show help message
  --version        Show version number
  --port=<number>  Port for dev server (default: 3000)
  --output=<dir>   Output directory for build (default: ./dist)
```

## Documentation

Detailed docs in the [`docs/`](./docs/) folder:

- [Getting Started](./docs/getting-started.md)
- [JSDA Concept](./docs/jsda-concept.md)
- [Configuration](./docs/configuration.md)
- [SSR](./docs/ssr.md)
- [SSG](./docs/ssg.md)
- [Server](./docs/server.md)
- [Import Maps](./docs/import-maps.md)
- [CLI](./docs/cli.md)
- [Browser Utilities](./docs/browser-utilities.md)
- [API Reference](./docs/api-reference.md)

## License

MIT © [RND-PRO.com](https://rnd-pro.com)

## Related Projects

- [JSDA Manifest](https://github.com/rnd-pro/jsda) — JSDA concept and conventions
- [Symbiote.js](https://github.com/symbiotejs/symbiote.js) — Isomorphic Reactive Web Components framework
- [Cloud Images Toolkit](https://github.com/rnd-pro/cloud-images-toolkit) — CDN image sync, adaptive embed code generation, media library management UI, and interactive widget generation

---

**Made with ❤️ by the RND-PRO team**
