# Browser Utilities

Isomorphic and browser-specific utilities available from `jsda-kit` and `jsda-kit/browser`.

## Isomorphic Utilities (`jsda-kit`)

### `applyData(html, data, open?, close?)`

Replace template tokens in a string.

```js
import { applyData } from 'jsda-kit';

applyData('Hello, {{name}}!', { name: 'World' });
// → 'Hello, World!'

// Custom delimiters:
applyData('Hello, {[name]}!', { name: 'World' }, '{[', ']}');
```

### `getHash(str)`

Generate a SHA-1 hex hash of a string. Works in both Node.js and browser.

```js
import { getHash } from 'jsda-kit';

let hash = await getHash('my content');
```

### `b64Src(data, mimeType, encode?)`

Create a base64 data URI.

```js
import { b64Src } from 'jsda-kit';

let uri = b64Src(svgContent, 'image/svg+xml', true);
// → 'data:image/svg+xml;base64,...'
```

### `md2html(markdown)`

Convert Markdown to HTML with syntax highlighting and heading IDs.

```js
import { md2html } from 'jsda-kit';

let html = await md2html('# Hello\n\n```js\nlet x = 1;\n```');
```

### `MIME_MAP`

Map of file extensions to MIME types.

```js
import { MIME_MAP } from 'jsda-kit';

MIME_MAP.html  // → 'text/html'
MIME_MAP.js    // → 'text/javascript'
```

## Browser Utilities (`jsda-kit/browser`)

### `IDB` — IndexedDB Wrapper

Simple key-value store using IndexedDB.

```js
import { IDB } from 'jsda-kit/browser';

let db = new IDB('myApp', 'store');
await db.set('key', { data: 'value' });
let val = await db.get('key');
await db.delete('key');
```

### `cssLib` — CSS Library Loader

Load CSS files dynamically.

```js
import { cssLib } from 'jsda-kit/browser';

cssLib('https://cdn.example.com/styles.css');
```
