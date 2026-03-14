[![npm version](https://badge.fury.io/js/jsda-kit.svg)](https://badge.fury.io/js/jsda-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![ESM](https://img.shields.io/badge/ESM-only-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![SSR](https://img.shields.io/badge/SSR-Symbiote.js-blueviolet)](https://github.com/symbiotejs/symbiote.js)

# JSDA-Kit

<img src="https://rnd-pro.com/svg/jsda/index.svg" width="200" alt="JSDA">

A comprehensive toolkit for building modern web applications with Static Site Generation (SSG), Server-Side Rendering (SSR), and dynamic servers. JSDA-Kit transforms standard JavaScript ESM modules into web assets.

## What is JSDA?

**JSDA** (JavaScript Distributed Web Assets) treats JavaScript ESM modules as text-based web asset generation endpoints — providing PHP-like templating with modern JavaScript and ESM modules.

> **Learn more**: https://github.com/rnd-pro/jsda

## Key Features

- **Isomorphic Architecture** — universal JS execution in browser and Node.js
- **Symbiote.js SSR** — standard SSR with `SSR.processHtml()`, streaming, and Declarative Shadow DOM
- **Real-Time Bundling** — instant JS/CSS bundling with esbuild
- **Tagged Template Minification** — `html` and `css` template literals minified automatically
- **Zero Configuration** — works out of the box with deep-mergeable defaults
- **Automatic Import Maps** — CDN-based dependency resolution
- **CLI** — `serve`, `build`, `ssg`, `init` with `--help`, `--version`, `--port`, `--output`
- **TypeScript Ready** — JSDoc-first types with `maxNodeModuleJsDepth` resolution
- **No frameworks** — no Webpack, no Babel, just ESM and the platform

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

## Example: SSR with Symbiote.js

```javascript
import Symbiote, { html, css } from '@symbiotejs/symbiote';

class AppGreeting extends Symbiote {
  init$ = {
    name: 'World',
  };
}

AppGreeting.template = html`
<div class="greeting">Hello, {{name}}!</div>
`;

AppGreeting.rootStyles = css`
app-greeting {
  display: block;
  padding: 1em;
}
`;

AppGreeting.reg('app-greeting');
```

Components are automatically SSR'd via `SSR.processHtml()` in both the dev server and SSG build.

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

---

**Made with ❤️ by the RND-PRO team**
