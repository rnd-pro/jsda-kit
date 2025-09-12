# JSDA Server

## The solution to serve JSDA files as web assets

### What is JSDA?

**JSDA** (Java Script Distributed Web Assets) is a modern approach that leverages JavaScript and JavaScript Template Literals to create a powerful web asset serving system. It provides a PHP-like templating experience with enhanced capabilities and modern JavaScript features, supporting multiple web application architectures.

### Core Features

- **Web Asset Serving**: Serve JS string exports as any text-based web assets with appropriate MIME types (HTML, CSS, SVG, etc.)
- **On-the-fly**: Build and minification for all assets. You don't need Webpack or that "yet-another-newer-hipster-thing" anymore
- **Server-Side Rendering**: Built-in SSR support for native Custom Elements
- **Performance Optimized**: Fast in-memory cache for production usage
- **Isomorphic Code**: Full-stack DRY support with shared code between client and server
- **Modern Dependency Management**: Automated importmap generation based on package.json and your endpoints structure. Share the common code with ease
- **Platform Standards**: Modern web standards usage without legacy dependencies
- **Hybrid Web App Model Support**: Seamlessly combine SSR, SPA, micro-frontends, and on-demand dynamic components without complex configurations
- **Distributed Assets Model**: ESM over HTTPS support with direct URL access to application components
- **Extensibility**: Add custom middleware to support your specific use cases
- **Flexible Styling**: Use JavaScript right in your styles, forget about additional pre- or post-processors for CSS and their creepy syntax. Use classic way styling or encapsulated Shadow DOM. Or use them both without any limitations
- **SVG as JSDA**: Make your SVG-illustration images dynamic as everything else in your project

### Installation

```bash
npm install https://github.com/rnd-pro/jsda-server.git
```

### Quick Start

1. Create a configuration file (`project.cfg.js`):
```javascript
export default {
  routes: './ref/routes.js',
  pageDataFn: './ref/data.js',
  ssrComponents: {
    templates: './ref/wc/{name}/tpl.html.js',
    scripts: './ref/wc/{name}/index.js',
    styles: './ref/wc/{name}/style.css',
  },
  cache: true,
  port: 3000,
  importmap: true,
}
```

2. Start the server using one of these methods:

Using the CLI (recommended):

```bash
# Start with default settings
jsda

# Start with custom port
jsda --port 8080

# Start with caching enabled
jsda --cache

# Start with both options
jsda --port 8080 --cache
```

Using Node directly:
```bash
node ./node_modules/jsda-server/src/index.js
```

### CLI Options

| Option | Description |
|--------|-------------|
| `--port <number>` | Set the server port number |
| `--cache` | Enable in-memory caching |

### Configuration Options

| Option | Description |
|--------|-------------|
| `routes` | Path to your routes configuration file |
| `pageDataFn` | Path to your page data middleware function |
| `ssrComponents` | Configuration for server-side rendered components |
| `cache` | Enable/disable in-memory caching |
| `port` | Server port number |
| `importmap` | Enable/disable automatic importmap generation |

#### SSR Components Configuration

| Option | Description |
|--------|-------------|
| `templates` | Template path schema |
| `scripts` | Component scripts path schema |
| `styles` | Component styles path schema |

#### Defining Routes

```javascript
// ref/routes.js
export default {
  '/': './pages/home/index.html.js',
  '/about/': './pages/about/index.html.js',
  '/contact/': './pages/contact/index.html.js'
};
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### License

MIT

### Authors

rnd-pro.com (team@rnd-pro.com)