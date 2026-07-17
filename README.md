[![npm version](https://img.shields.io/npm/v/jsda-kit)](https://www.npmjs.com/package/jsda-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![ESM](https://img.shields.io/badge/ESM-only-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

# JSDA-Kit

<img src="https://rnd-pro.com/svg/jsda/index.svg" width="200" alt="JSDA">

**AI-ready development, built on open standards.**

JSDA-Kit builds model-legible applications and text artifacts from plain JavaScript ESM modules. Raw HTML, Markdown, meaningful Custom Elements, declarative data bindings, and predictable source conventions give LLMs structured context while keeping the result readable and controllable by humans.

Build static pages, server-rendered routes, API-like responses, CSS, SVG, feeds, sitemaps, Markdown documents, prompts, RAG corpora, manifests, and other text-based artifacts without a complex meta-framework, template DSL, or heavyweight runtime. There is no AI runtime dependency: the output is ordinary, inspectable text and web code that can be used by people, agents, browsers, and other tools.

## Why JSDA-Kit?

- **One mental model for every output** -- pages, styles, SVG, API responses, feeds, Markdown, model context, and generated files are just ESM modules with imports, functions, loops, data, and tests.
- **Dynamic output without framework gravity** -- use full JavaScript at build time, request time, or both; choose SSG, SSR, dynamic server routes, or plain static assets per project.
- **Fast installs, fast builds, fast CI** -- a small dependency graph and esbuild-powered pipeline keep local development and deployment pipelines lightweight.
- **Platform-native UI** -- SSR and hydrate W3C Custom Elements with [Symbiote.js](https://github.com/symbiotejs/symbiote.js) instead of coupling every component to a framework-specific runtime.
- **LLM-legible by default** -- raw HTML exposes content, hierarchy, state, and available actions directly to models and browser-operating agents.
- **Markdown-native model interchange** -- generate `.md` files for documentation, knowledge bases, prompts, reports, and other artifacts using the format LLMs commonly consume and produce.
- **RAG-ready content pipelines** -- use JavaScript to normalize, filter, split, enrich, and compose source data into Markdown, JSON, JSONL, metadata, citation maps, or task-specific context packages.
- **Context-efficient architecture** -- compact modules, explicit bindings, and predictable conventions reduce the amount of code humans and agents must reconstruct to understand a feature.
- **Deploy anywhere** -- ship a static `dist/` folder, run the JSDA server, or mix both; no vendor platform is required.

## What is JSDA?

**JSDA** (JavaScript Distributed Assets) treats JavaScript ESM modules as text-generation endpoints. Those modules can produce web assets such as HTML, CSS, SVG, and feeds, or model-friendly artifacts such as Markdown, prompts, reports, manifests, and structured text.

> **Learn more**: https://github.com/rnd-pro/jsda

## Built for LLMs—On the Web and Beyond

JSDA-Kit treats HTML as more than a rendering target. HTML is a compact, structured interface for content, relationships, state, and actions—useful to people, development tools, and language models alike.

```html
<product-card bind="$.cardData: cardData" product-id="sku-42" availability="in-stock">
  <h2 bind="textContent: productName">Mechanical Keyboard</h2>
  <data bind="@value: itemPrice" value="129.00">$129</data>
  <button bind="onclick: addToCart, textContent: l10n/addToCart">Add to cart</button>
</product-card>
```

This markup gives a model useful vocabulary and boundaries directly in the DOM: what the object is, which facts belong to it, and which action is available. Symbiote.js strengthens that model by turning application concepts into named Custom Elements and keeping data relationships explicit through declarative bindings.

- **Domain vocabulary in the DOM** -- names such as `<login-widget>`, `<product-card>`, and `<account-summary>` preserve application concepts instead of hiding everything behind generic elements and generated classes.
- **Markdown as model interchange** -- Markdown is a de facto standard for LLM input and output. JSDA modules can construct `.md` files with full JavaScript, making generated documentation, context packages, prompts, and reports first-class build artifacts.
- **Structured context without client execution** -- SSG and SSR materialize content as HTML that agents, crawlers, and retrieval systems can inspect immediately.
- **DOM as an agent interface** -- elements and attributes describe both the current page and the interactions available through links, buttons, inputs, and forms.
- **Less context, less guesswork** -- standard ESM, HTML, CSS, and Web APIs minimize proprietary abstractions an agent must learn before it can contribute safely.
- **One representation, human-controlled** -- the context available to an agent is also visible in source, page output, tests, diffs, and browser developer tools.

JSDA-Kit does not hide the web from AI. It makes the web's existing structure easier for AI to use and easier for humans to supervise.

### RAG-Ready Content Pipelines

Because every output is backed by a JavaScript module, JSDA-Kit can prepare content for different retrieval-augmented generation strategies instead of forcing one storage or retrieval model:

- Generate stable, chunk-oriented Markdown documents with headings, source identifiers, and front matter.
- Produce JSON or JSONL records containing content, metadata, relationships, permissions, and citation targets.
- Build domain-specific context packs, indexes, manifests, `llms.txt` files, and human-readable mirrors of model input.
- Create static knowledge snapshots at build time or dynamic context endpoints at request time.
- Integrate existing parsers, embedding services, vector stores, search systems, or rerankers through ordinary ESM imports and JavaScript functions.

```txt
Source data → JSDA transforms → Markdown / JSONL / HTML → index or retriever → LLM
```

JSDA-Kit is not an opinionated vector database or embedding engine. It provides the inspectable generation layer around them, making RAG inputs reproducible, testable, and easy for humans to audit.

## Key Features

### ESM-Native Asset Pipeline
- **JS modules as generated assets** -- `.html.js`, `.css.js`, `.svg.js`, `.md.js`, and other modules export strings that become production files; use full JavaScript (loops, conditionals, imports) instead of limited template engines
- **Convention-based file mapping** -- `src/static/index.html.js → dist/index.html`; no routing config or manifest files needed for static output
- **Any text format** -- generate Markdown, prompts, manifests, configuration, reports, or domain-specific text formats in addition to browser-facing assets
- **RAG-ready artifacts** -- produce chunked knowledge files, metadata records, citation maps, and context packages for indexing or direct model input
- **Function exports** -- default exports can be functions for dynamic generation (sitemaps, feeds, documentation, context files, config-driven pages)

### Web Component SSR
- **Symbiote.js SSR engine** -- custom elements rendered on the server with Declarative Shadow DOM support 
- **Three-tier SSR imports** -- global imports in `project.cfg.js`, per-endpoint `ssrImports` exports in individual `.html.js` files, and programmatic `wcSsr()` API for full control
- **Isomorphic components** -- set `isoMode = true` on a Symbiote.js component and it auto-detects its environment; same code runs SSR on server, hydrates on client, or renders client-only
- **Barrel file resolution** -- SSR import loader automatically resolves `export *`, re-exports, and side-effect imports from barrel files

### Security
- **Trusted Types & CSP support** -- pass a nonce to SSR and all inline `<style>` tags get the `nonce` attribute automatically, enabling strict Content Security Policy

### Build & Bundling
- **Static Site Generation** -- JAMStack-ready SSG; source folder structure maps directly to output (`src/static/about/index.html.js → dist/about/index.html`), deploy the `dist/` folder to any static hosting as-is
- **Configurable SSG entries and PDFs** -- add non-index entry patterns, generate `.pdf.js` files with Puppeteer via `build-pdf`/`ssg-pdf`, and copy committed static artifacts into output
- **esbuild-powered** -- JS/CSS bundling with tree-shaking, ESM output; works both at build time and on-the-fly during `serve`
- **Tagged template minification** -- `html` and `css` tagged template literals minified automatically inside bundles; untagged templates left untouched
- **Asset minification** -- HTML (via `@minify-html/node`), CSS, and SVG minified by default with per-file excludes
- **Automatic sitemap** -- generates `sitemap.xml` from built HTML pages with configurable base URL, exclusions, `lastmod`, change frequency, and priority
- **SSG watcher** -- `jsda ssg` rebuilds on file changes during development

### JSDA Server
- **Route-based SSR pipeline** -- `Request → Route Lookup → Data Injection → SSR → Minification → Response`; define routes as a simple JS object mapping paths to `.html.js` modules
- **Custom data and route hooks** -- `getDataFn(route, url, headers)` injects data into templates, `getRouteFn(url, headers)` enables dynamic route resolution (i18n, A/B testing)
- **In-memory response caching** -- enabled by default with URL-level granularity and per-path excludes

### Configuration & DX
- **Zero-config start** -- works out of the box; all settings have sensible defaults
- **Deep-mergeable config** -- `project.cfg.js` is deep-merged with defaults; override only what you need; `boolean` shorthand for feature toggles (SSR, sitemap)
- **Project scaffolding** -- `jsda scaffold` fetches a complete runnable template ([Live Demo](https://rnd-pro.github.io/jsda-template/)) with folder structure, config, sample components (server-only, client-only, isomorphic), routes, static SSG page, CSS design tokens, and dev tooling config
- **Automatic import maps** -- generates `<script type="importmap">` from `package.json` versions with configurable CDN schema, `<link rel="modulepreload">`, and optional polyfills
- **CLI** -- `serve`, `build`, `ssg`, `scaffold` with `--port`, `--output`, `--help`, `--version`

### Isomorphic Utilities
- **Markdown to HTML** -- `md2html()` with syntax highlighting (highlight.js) and automatic heading IDs; works in both Node.js and browser
- **Template data injection** -- `applyData()` replaces `{[key]}` tokens in any string; customizable delimiters
- **Cross-environment hashing** -- `getHash()` produces SHA-1 hex using Web Crypto (browser) or Node.js crypto
- **IndexedDB wrapper** -- `IDB` class with key-value CRUD, cross-tab sync via `storage` events, and subscription API

## JSDA-Kit vs Next.js

If you've grown tired of fighting meta-platform opaque complexity, JSDA-Kit offers a radically different path -- with the flexibility to handle projects of any scale.

| | **JSDA-Kit** | **Next.js** |
|---|---|---|
| **Philosophy** | You control everything -- ESM modules are your assets, Web Components are your UI | The framework controls everything -- conventions, rendering strategy, deployment target |
| **Component model** | W3C Custom Elements -- platform-native, zero runtime lock-in, interoperable with anything | React-only -- JSX compilation required, components don't work outside React |
| **Agent legibility** | Raw HTML, named Custom Elements, and explicit bindings expose application structure directly | JSX, React Server Components, build transforms, and framework conventions require additional context |
| **SSR granularity** | Per-component `isoMode` -- mix SSR, client-only, and isomorphic on the same page with zero config | Per-page/layout rendering strategy -- `'use client'` / `'use server'` boundary management |
| **Build speed** | esbuild -- fast by default, no config, no plugins to debug | Turbopack/webpack -- fast when it works, complex when it doesn't |
| **Dependencies** | 7 production deps, ~50 MB `node_modules` | 700+ transitive deps, 300+ MB `node_modules`, long install times |
| **CI speed** | Seconds to install, seconds to build -- minimal deps mean fast pipelines | Minutes for `npm install` alone; large dependency trees slow down every CI run |
| **Runtime weight** | 0 KB for static pages; Symbiote.js ~7 KB gzipped for interactive | React ~44 KB gzipped + framework chunks on every page |
| **Configuration** | Single `project.cfg.js`, deep-mergeable -- override only what you need | `next.config.js` + App Router conventions + caching rules + middleware config |
| **Debugging** | ~2,500 LOC total -- readable source, no black boxes | ~300,000+ LOC framework internals -- good luck tracing a build issue |
| **Vendor lock-in** | None -- standard ESM, plain file output, deploy anywhere | Vercel-optimized -- self-hosting has documented rough edges |
| **Flexibility** | Full access to Node.js, custom route/data hooks, any hosting, any structure | Opinionated conventions -- step outside them and you fight the framework |

**Image optimization and management** -- [Cloud Images Toolkit](https://github.com/rnd-pro/cloud-images-toolkit) handles the media side: CDN synchronization, adaptive image embed code generation, smart local caching, built-in management UI, and interactive widget generation (galleries, panoramas, 360° views). Framework-independent -- works with JSDA-Kit (as part of the ecosystem) or any other project. Unlike Next.js, which locks image optimization into the Vercel edge network, CIT lets you choose almost any image CDN -- with Cloudflare Images, Cloudinary, ImageKit, and Bunny.net supported out of the box.

> [!IMPORTANT]
> JSDA-Kit handles projects of any complexity -- from a single landing page to a full-scale web application. The difference is: **you stay in control**.

> [!TIP]
> **Free hosting friendly** -- the light CI pipeline fits comfortably within the free tiers of GitHub Pages or Cloudflare Pages -- no paid plan required for most projects.

## Quick Start

```bash
npm install jsda-kit

# Scaffold a new project
npx jsda scaffold

# Start dev server
npx jsda serve

# Start SSG watcher (dev mode)
npx jsda ssg

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

The same pipeline can generate Markdown or any other text format:

```javascript
// src/static/knowledge/index.md.js → dist/knowledge/index.md
let project = 'Example Project';
let modules = [
  { name: 'auth', summary: 'Authentication and session handling' },
  { name: 'catalog', summary: 'Product discovery and metadata' },
];

export default () => `
# ${project}

${modules.map((module) => `- ${module.name}: ${module.summary}`).join('\n')}
`;
```

This makes JSDA-Kit useful for producing model context, documentation, prompts, reports, and machine-consumable text alongside, or independently of a website.

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

Same code runs everywhere -- SSR on the server, hydration on the client, or pure client rendering. Set `isoMode = true` and the component auto-detects. Server-only and client-only components are also possible -- `isoMode` is opt-in per component.

## CLI

```
jsda <command> [options]

Commands:
  serve            Start the development server
  build            Build static assets for production
  build-pdf        Build static assets and PDF files for production
  ssg              Start SSG watcher (dev mode)
  ssg-pdf          Start SSG watcher with PDF generation enabled
  scaffold         Scaffold a new JSDA project

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
- [Scaffolding](./docs/scaffolding.md)
- [Browser Utilities](./docs/browser-utilities.md)
- [API Reference](./docs/api-reference.md)

## License

MIT © [RND-PRO.com](https://rnd-pro.com)

## Related Projects

- [JSDA Manifest](https://github.com/rnd-pro/jsda) -- JSDA concept and conventions
- [JSDA Project Template](https://github.com/rnd-pro/jsda-template) -- official starter template repository
- [Symbiote.js](https://github.com/symbiotejs/symbiote.js) -- Isomorphic Reactive Web Components framework
- [Cloud Images Toolkit](https://github.com/rnd-pro/cloud-images-toolkit) -- CDN image sync, adaptive embed code generation, media library management UI, and interactive widget generation

---

**Made with ❤️ by the RND-PRO team**
