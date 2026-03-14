# JSDA Server

HTTP server for JSDA applications with Symbiote.js SSR, real-time esbuild bundling, and in-memory caching.

## Usage

```bash
npx jsda serve
npx jsda serve --port=8080
```

## Route Pipeline

```
Request → Route Lookup → Data Injection → SSR → Minification → Response
```

1. Route resolved via `getRouteFn(url, headers)`
2. Page module imported, data injected with `applyData()`
3. Custom elements rendered via Symbiote.js `SSR.processHtml()`
4. HTML minified before response

## Routes

```js
// src/dynamic/routes.js
export default {
  '/': './src/dynamic/home.html.js',
  '/about/': './src/dynamic/about.html.js',
};
```

## Configuration

See [docs/configuration.md](../docs/configuration.md) for full reference.

```js
// project.cfg.js
export default {
  dynamic: {
    port: 3000,
    routes: './src/dynamic/routes.js',
    cache: { inMemory: true },
  },
};
```

## Detailed Documentation

- [Server docs](../docs/server.md) — routes, caching, custom data/route functions
- [SSR docs](../docs/ssr.md) — Symbiote.js SSR integration
- [Configuration](../docs/configuration.md) — all config options

## License

MIT © [RND-PRO.com](https://rnd-pro.com)