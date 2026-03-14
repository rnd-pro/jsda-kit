# Server-Side Rendering (SSR)

JSDA-Kit v1.0 uses [Symbiote.js SSR](https://github.com/nicotordev/symbiote.js) for rendering web components on the server.

## Requirements

```bash
npm install linkedom
```

`linkedom` is an optional peer dependency — required only when using SSR features.

## How It Works

The SSR pipeline:

1. **Data injection** — template tokens (`{{key}}`) are replaced with data values
2. **Component rendering** — `SSR.processHtml()` processes all custom elements in the HTML
3. **Minification** — HTML is minified before serving

Custom elements must be registered Symbiote.js components with `customElements.define()` (via `.reg()`).

## Usage in Server Routes

SSR is automatically applied to all routes served by `JSDAServer`. The pipeline is:

```
Route HTML → applyData() → wcSsr() → htmlMin() → Response
```

## Usage in SSG Build

Enable SSR during static site generation by setting `ssr: true` in `project.cfg.js`:

```js
export default {
  ssr: true,
};
```

## Programmatic API

### `wcSsr(html, options?)`

```js
import { wcSsr } from 'jsda-kit/node';

let result = await wcSsr('<app-hello></app-hello>', {
  data: { title: 'My Page' },
  ssrOptions: { nonce: 'abc123' },
});
```

**Options:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `Object` | `{}` | Data tokens to inject before SSR |
| `openToken` | `string` | `'{{'` | Token open delimiter |
| `closeToken` | `string` | `'}}'` | Token close delimiter |
| `ssrOptions` | `Object` | `{}` | Options passed to `SSR.processHtml()` |

### Direct SSR Access

For advanced usage, the Symbiote.js `SSR` class is re-exported:

```js
import { SSR } from 'jsda-kit/node';

// Render a single component
let html = await SSR.renderToString('my-component', { attr: 'value' });

// Process full HTML document
let processed = await SSR.processHtml(fullHtml);

// Streaming SSR
let stream = SSR.renderToStream('my-component');
```

## Component Example

```js
import Symbiote, { html, css } from '@symbiotejs/symbiote';

class AppCard extends Symbiote {
  init$ = {
    title: 'Default Title',
    body: '',
  };
}

AppCard.template = html`
<h2>{{title}}</h2>
<div class="body">{{body}}</div>
`;

AppCard.rootStyles = css`
app-card {
  display: block;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
`;

AppCard.reg('app-card');
```
