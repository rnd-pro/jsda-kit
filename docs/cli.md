# CLI Reference

## Usage

```bash
jsda <command> [options]
```

## Commands

### `serve`

Start the development server.

```bash
jsda serve
jsda serve --port=8080
```

| Option | Description |
|--------|-------------|
| `--port=<number>` | Server port (default: from config or 3000) |

### `build`

Build static assets for production.

```bash
jsda build
jsda build --output=./public
```

| Option | Description |
|--------|-------------|
| `--output=<dir>` | Output directory (default: from config or ./dist) |

### `ssg`

Start SSG watcher for development. Watches `sourceDir` for changes and rebuilds automatically.

```bash
jsda ssg
```

### `scaffold`

Scaffold a new JSDA project with a complete runnable structure.

```bash
jsda scaffold
```

Creates project structure with:
- `package.json` — project manifest with `dev` and `build` scripts
- `project.cfg.js` — configuration with SSR enabled
- `src/static/` — SSG page rendering README via `md2html`
- `src/dynamic/` — dynamic routes with `applyData` + `wcSsr`
- `src/components/` — server-only, client-only, and isomorphic examples
- `src/css/` — design tokens and CSS reset
- `tsconfig.json` — TypeScript configuration

## Global Options

| Option | Description |
|--------|-------------|
| `--help` | Show help message |
| `--version` | Show version number |
