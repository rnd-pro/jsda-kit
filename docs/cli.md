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

### `init`

Scaffold a new JSDA project.

```bash
jsda init
```

Creates project structure with:
- `project.cfg.js` — configuration
- `src/components/` — sample Symbiote.js component
- `src/dynamic/` — sample server route
- `src/static/` — SSG source directory
- `tsconfig.json` — TypeScript configuration

## Global Options

| Option | Description |
|--------|-------------|
| `--help` | Show help message |
| `--version` | Show version number |
