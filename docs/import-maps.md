# Import Maps

JSDA-Kit can automatically generate [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) for your dependencies.

## Configuration

```js
export default {
  importmap: {
    packageList: ['@symbiotejs/symbiote', 'lodash-es'],
    srcSchema: 'https://cdn.jsdelivr.net/npm/{pkg-name}/+esm',
    polyfills: false,
    preload: true,
  },
};
```

## Generated Output

For the configuration above, `getImportMap()` generates:

```html
<script type="importmap">
{
  "imports": {
    "@symbiotejs/symbiote": "https://cdn.jsdelivr.net/npm/@symbiotejs/symbiote/+esm",
    "lodash-es": "https://cdn.jsdelivr.net/npm/lodash-es/+esm"
  }
}
</script>
```

## CDN Schemas

The `srcSchema` property uses `{pkg-name}` as a placeholder:

| CDN | Schema |
|-----|--------|
| jsDelivr (ESM) | `https://cdn.jsdelivr.net/npm/{pkg-name}/+esm` |
| jsDelivr | `https://cdn.jsdelivr.net/npm/{pkg-name}` |
| unpkg | `https://unpkg.com/{pkg-name}` |
| esm.run | `https://esm.run/{pkg-name}` |

## Programmatic API

```js
import { getImportMap } from 'jsda-kit/node';

let mapHtml = getImportMap();
// Returns the full <script type="importmap"> HTML string
```

## Preloading

When `preload: true`, generates `<link rel="modulepreload">` tags for each mapped module to improve loading performance.

## Polyfills

When `polyfills: true`, includes the [ES Module Shims](https://github.com/nicotordev/es-module-shims) polyfill for browsers without native import map support.
