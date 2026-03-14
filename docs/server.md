# JSDA Server

The built-in HTTP server for development and production.

## Starting

```bash
npx jsda serve
npx jsda serve --port=8080
```

## Routes

Routes are defined in a mapping module (default: `./src/dynamic/routes.js`):

```js
// src/dynamic/routes.js
export default {
  '/': './src/dynamic/home.html.js',
  '/about/': './src/dynamic/about.html.js',
  '/api/data/': './src/dynamic/api-data.js',
};
```

## Route Processing Pipeline

```
Request → Route Lookup → Import Module → applyData() → wcSsr() → htmlMin() → Response
```

1. **Route resolution** — `getRouteFn(url, headers)` can dynamically remap routes
2. **Data injection** — `getDataFn(route, url, headers)` provides data for template tokens
3. **SSR** — custom elements are rendered via Symbiote.js SSR
4. **Minification** — HTML is minified before response

## Static File Serving

Files in `baseDir` (default: `./src/`) are served directly with proper MIME types.

JavaScript files named `index.js` are bundled by esbuild on-the-fly with tagged template minification.

## Custom Data Provider

```js
export default {
  dynamic: {
    getDataFn: async (route, url, headers) => {
      // Return data for template token injection
      return {
        title: 'My Page',
        user: headers['x-user'] || 'Guest',
      };
    },
  },
};
```

## Custom Route Resolution

```js
export default {
  dynamic: {
    getRouteFn: async (url, headers) => {
      // Return a different route key based on conditions
      if (headers['accept-language']?.startsWith('ru')) {
        return '/ru/';
      }
      return ''; // empty = use original route
    },
  },
};
```

## Response Caching

In-memory caching is enabled by default:

```js
export default {
  dynamic: {
    cache: {
      inMemory: true,
      exclude: ['/api/'],
    },
  },
};
```

Cache is keyed by URL (including query parameters).
