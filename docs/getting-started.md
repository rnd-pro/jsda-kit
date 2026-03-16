# Getting Started

## Installation

```bash
npm install jsda-kit
```

## Quick Start — Scaffold a New Project

```bash
npx jsda scaffold
```

This creates a complete runnable project:
```
project/
├── src/
│   ├── static/
│   │   ├── index.html.js              # SSG page (renders README via md2html)
│   │   ├── page.tpl.html              # Shared HTML template for static pages
│   │   └── robots.txt
│   ├── dynamic/
│   │   ├── routes.js                  # Route map
│   │   ├── index.html.js              # Main route (applyData + wcSsr)
│   │   ├── 404.html.js                # 404 page
│   │   ├── tpl/
│   │   │   └── main.tpl.html          # Shared HTML template for dynamic pages
│   │   ├── css/
│   │   │   └── index.css.js           # Page CSS aggregator
│   │   ├── browser/
│   │   │   └── index.js               # Browser entry point
│   │   └── node/
│   │       └── handlers.js            # Server-side getDataFn / getRouteFn
│   ├── components/
│   │   ├── app-hello.js               # Isomorphic Symbiote.js component
│   │   ├── server-only/               # SSR-only components
│   │   │   ├── server-info.js
│   │   │   └── exports.js
│   │   ├── client-only/               # Browser-only components
│   │   │   ├── client-counter.js
│   │   │   └── exports.js
│   │   └── iso/                       # Isomorphic components (SSR + client)
│   │       ├── iso-card.js
│   │       └── exports.js
│   ├── css/
│   │   └── common.css.js              # Design tokens + CSS reset
│   └── md/
│       └── about.md                   # Sample markdown content
├── types/
│   └── globals.d.ts                   # Type reference for JSDA_CFG
├── project.cfg.js                     # Configuration (SSR enabled)
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmrc
├── README.md
└── LICENSE
```

## Running the Dev Server

```bash
npx jsda serve
npx jsda serve --port=8080
```

## Building for Production

```bash
npx jsda build
npx jsda build --output=./public
```

## SSG Watcher (Dev Mode)

```bash
npx jsda ssg
```

Watches `sourceDir` for changes and rebuilds automatically.

## Next Steps

- [Configuration](./configuration.md) — full config reference
- [SSR](./ssr.md) — server-side rendering with Symbiote.js
- [CLI](./cli.md) — all commands and flags
