# Scaffolding

JSDA-Kit provides a quick way to bootstrap a new project using the official template repository. 

## Usage

```bash
npx jsda scaffold
```

This command will:
1. Fetch the official [JSDA Template](https://github.com/rnd-pro/jsda-template) using `degit`.
2. Configure `package.json` with your current directory's name and set the version to `0.0.1`.
3. Remove the template's `package-lock.json` so you can install dependencies freshly.
4. Generate an empty `secrets/access.js` file required for the code example provided.

> **Live Demo**: See the scaffolded template in action at [https://rnd-pro.github.io/jsda-template/](https://rnd-pro.github.io/jsda-template/)

## What's Included

The scaffolded project comes with a complete, production-ready structure:
- **SSG & SSR Examples** — demonstrates how to generate static pages and handle dynamic routes.
- **Symbiote.js Components** — includes server-only, client-only, and isomorphic web components.
- **Design Tokens** — configured with standard CSS variables and a reset.
- **Cloud Images Toolkit** — pre-configured `cit` integration for media management and automated embeds.
- **TypeScript Configuration** — pre-configured `tsconfig.json` for JSDoc and IDE support.
