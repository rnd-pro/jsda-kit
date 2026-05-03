# SSR Import Formats

When providing component modules to JSDA-Kit's SSR pipeline, there are specific requirements for the file formats and module structures supported.

## Standard ES Modules

The SSR engine uses Node.js native dynamic imports (`await import(...)`). Therefore, all imported component files must be valid **ES Modules (`.js`)**. 

- Use standard ES module syntax (`import` / `export`).
- TypeScript (`.ts`) or other languages that require transpilation are not supported natively by the SSR pipeline and must be compiled to `.js` before being imported.
- All dependencies within the components must be resolvable by Node.js.

## Barrel Files (`index.js`)

You can use "barrel files" to import multiple components at once. For example:

```js
// src/components/index.js
export * from './app-header.js';
export * from './app-footer.js';
import './app-card.js';
```

JSDA-Kit includes a special loader that parses these barrel files to ensure that each inner module is imported individually. This applies a cache-busting mechanism (`?ssr=timestamp`) to every component, ensuring that `Symbiote.reg()` calls re-execute against the fresh SSR DOM on every render session.

### Barrel File Requirements

To ensure the SSR loader can correctly parse and cache-bust your barrel files, follow these rules:

1. **Relative Paths**: You must use relative paths starting with `.` (e.g., `./` or `../`). The loader uses regular expressions to find imports:
   - `export ... from './path/to/module.js'`
   - `import './path/to/module.js'`
2. **Extensions**: It is highly recommended to include the `.js` extension in your imports, as Node.js requires them for ES module resolution.
3. **No Bare Specifiers**: Bare module specifiers (e.g., `import 'my-package'`) are not cache-busted by the barrel loader. 

## Single Component Files

When importing a single component file directly, the cache-busting timestamp is applied to that file:

```js
// project.cfg.js
export default {
  ssr: {
    enabled: true,
    imports: [
      './src/components/app-header.js' // Direct import
    ]
  }
}
```

This ensures the component's registration code runs correctly for the current SSR session.
