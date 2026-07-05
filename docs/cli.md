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

Build static assets for production. PDF entries are skipped.

```bash
jsda build
jsda build --output=./public
```

| Option | Description |
|--------|-------------|
| `--output=<dir>` | Output directory (default: from config or ./dist) |

### `build-pdf`

Build static assets and PDF entries for production.

```bash
jsda build-pdf
jsda build-pdf --output=./public
```

PDF rendering requires `puppeteer` installed in the project.

| Option | Description |
|--------|-------------|
| `--output=<dir>` | Output directory for regular static outputs. PDFs use `static.pdf.outputDir` when configured. |

### `ssg`

Start SSG watcher for development. Watches `sourceDir` for changes and rebuilds automatically. PDF entries are skipped.

```bash
jsda ssg
jsda ssg --output=./public
```

### `ssg-pdf`

Start SSG watcher with PDF generation enabled.

```bash
jsda ssg-pdf
jsda ssg-pdf --output=./public
```

### `scaffold`

Scaffold a new JSDA project with a complete runnable structure.

```bash
jsda scaffold
```

Creates project structure by fetching the official [JSDA Template](https://github.com/rnd-pro/jsda-template).

See the [Live Demo](https://rnd-pro.github.io/jsda-template/) or read the [Scaffolding Guide](./scaffolding.md) for more details on the included structure.

## Global Options

| Option | Description |
|--------|-------------|
| `--help` | Show help message |
| `--version` | Show version number |
