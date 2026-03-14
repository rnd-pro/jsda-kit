# Getting Started

## Installation

```bash
npm install jsda-kit
```

## Quick Start — Scaffold a New Project

```bash
npx jsda init
```

This creates:
```
project/
├── src/
│   ├── static/         # SSG source files
│   ├── dynamic/        # Server-side routes
│   ├── components/     # Symbiote.js components
│   ├── css/            # Stylesheets
│   └── md/             # Markdown content
├── types/
├── project.cfg.js      # Configuration
└── tsconfig.json
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
