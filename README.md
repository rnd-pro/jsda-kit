# JSDA-Kit

[![npm version](https://badge.fury.io/js/jsda-kit.svg)](https://badge.fury.io/js/jsda-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, isomorphic JavaScript toolkit for building modern web applications with support for Static Site Generation (SSG), Server-Side Rendering (SSR), and dynamic real-time servers. JSDA-Kit transforms standard JavaScript ESM modules into powerful web asset generation endpoints.

## What is JSDA?

**JSDA** (JavaScript Distributed Web Assets) revolutionizes web development by treating JavaScript ESM modules as text-based web asset generation endpoints. This approach provides PHP-like templating capabilities while leveraging modern JavaScript's universal nature and ESM module system.

🔗 **Learn more**: https://github.com/rnd-pro/jsda

## ✨ Key Features

- **🔄 Isomorphic Architecture**: Universal JavaScript execution in both browser and Node.js environments
- **⚡ Real-Time Asset Bundling**: Instant JS/CSS bundling with esbuild - no Webpack required
- **🖥️ Server-Side Rendering**: Native SSR support for Custom Elements and Web Components
- **📦 Zero Configuration**: Works out of the box with sensible defaults
- **🗺️ Automatic ImportMaps**: Dynamic import map generation based on project structure
- **🎯 Hybrid App Support**: Seamlessly combine SSR, SPA, micro-frontends, and dynamic components
- **🌐 Distributed Assets**: ESM-over-HTTPS delivery for modular components
- **🎨 Dynamic Styling**: JavaScript-powered CSS with Shadow DOM support
- **📊 Performance Optimized**: Fast in-memory caching for production
- **🧩 Extensible**: Clean APIs for custom middleware and extensions

## 🚀 Quick Start

### Installation

```bash
npm install jsda-kit
```

### Basic Usage

```javascript
// Start a JSDA server
import { JSDAServer } from 'jsda-kit/server';

const server = new JSDAServer({
  port: 3000,
  cache: true,
  routes: './routes.js'
});

server.start();
```

## 📁 Project Structure

JSDA-Kit follows a modular architecture with clear separation of concerns:

```
jsda-kit/
├── 📁 server/           # Core server implementation
│   ├── JSDAServer.js    # Main HTTP server
│   ├── ssr.js           # Server-side rendering engine
│   ├── pth.js           # Path resolution utilities
│   ├── CFG.js           # Configuration management
│   └── cli.js           # Command-line interface
├── 📁 browser/          # Browser-specific utilities
│   ├── IDB.js           # IndexedDB wrapper
│   └── b64Src.js        # Base64 encoding
├── 📁 iso/              # Isomorphic tools (universal)
│   ├── buildHtml.js     # HTML generation
│   ├── cssMin.js        # CSS minification
│   ├── jsMin.js         # JavaScript minification
│   ├── md2html.js       # Markdown to HTML conversion
│   └── MIME.js          # MIME type handling
├── 📁 node/             # Node.js-specific utilities
│   ├── build.js         # Static build system
│   ├── watch.js         # File watching
│   ├── findFiles.js     # File system utilities
│   └── getImportMap.js  # Import map generation
└── 📁 ref&test/         # Reference implementations & examples
    └── hybrid-app/      # Example hybrid application
```

## 🛠️ Core Components

### Server Engine
- **JSDAServer**: Main HTTP server with request routing and asset transformation
- **SSR Engine**: Recursive server-side rendering for Web Components
- **Configuration System**: Flexible, hierarchical configuration management
- **Path Resolution**: Smart module path resolution for local and remote assets

### Isomorphic Tools
- **Asset Processing**: HTML/CSS/JS minification and optimization
- **MIME Handling**: Automatic content-type detection and serving
- **Data Processing**: Template data injection and transformation
- **Markdown Support**: Integrated Markdown to HTML conversion

### Build System
- **Static Generation**: Export static sites from dynamic JSDA applications
- **File Watching**: Development mode with hot reload capabilities
- **Import Maps**: Automatic generation of browser-compatible module maps
- **Asset Bundling**: Real-time bundling with esbuild integration

## 🎯 Use Cases

- **JAMStack Sites**: Static site generation with dynamic capabilities
- **Micro-Frontends**: Modular, distributed web application architecture
- **Rapid Prototyping**: Quick setup for testing ideas and concepts
- **AI-Augmented Development**: Integration-ready for AI-powered workflows
- **Component Libraries**: Distributable web component ecosystems
- **Hybrid Applications**: Mixed SSR/SPA applications with seamless transitions

## 🧪 Example Usage

### Creating a Simple HTML Page

```javascript
// pages/home.html.js
export default /*html*/ `
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to JSDA</title>
</head>
<body>
  <h1>Hello, JSDA World!</h1>
  <p>Current time: ${new Date().toISOString()}</p>
</body>
</html>
`;
```

### Building Dynamic CSS

```javascript
// styles/theme.css.js
const primaryColor = '#007acc';
const secondaryColor = '#f0f0f0';

export default /*css*/ `
:root {
  --primary: ${primaryColor};
  --secondary: ${secondaryColor};
}

body {
  background: var(--secondary);
  color: var(--primary);
  font-family: system-ui, sans-serif;
}
`;
```

### Web Component with SSR

```javascript
// components/my-component/index.js
import { Symbiote } from '@symbiotejs/symbiote';

class MyComponent extends Symbiote {

  ssrMode = true;

  init$ = {
    message: 'Hello from Web Component!',
    timestamp: Date.now(),
  };
}

MyComponent.reg('my-component');
```

```js
// SSR component template:
import myData from `../myData.js`;

export default /*html*/ `
<div>
  <p>${myData.message}</p>
  <my-another-component></my-another-component>
</div>
`;
```

```js
// Component usage:
export  default /*html*/ `
<!-- Some HTML -->
  <my-component></my-component>
<!-- Some HTML -->
`;
```

## 📚 Documentation

For detailed documentation, examples, and advanced usage patterns, visit:
- [Server Documentation](./server/README.md)
- [API Reference](https://github.com/rnd-pro/jsda-kit/wiki)
- [Examples](./ref&test/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

### Development Setup

```bash
# Clone the repository
git clone https://github.com/rnd-pro/jsda-kit.git
cd jsda-kit

# Install dependencies
npm install

# Run examples
cd ref&test/hybrid-app
node ../../server/cli.js
```

## 📄 License

MIT © [RND-PRO](https://rnd-pro.com)

## 🔗 Related Projects

- [JSDA Manifest](https://github.com/rnd-pro/jsda) - JSDA concept and basic conventions description
- [Symbiote.js](https://github.com/symbiotejs/symbiote) - Reactive Web Components framework

---

**Made with ❤️ by the RND-PRO team**

