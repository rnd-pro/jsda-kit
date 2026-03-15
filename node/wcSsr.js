import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { SSR } from '@symbiotejs/symbiote/node/SSR.js';
import { Log } from './Log.js';
import pth from './pth.js';

/**
 * @typedef {Object} WcSsrOptions
 * @property {Object<string, string>} [data] Data to inject before SSR
 * @property {string} [openToken] Token open delimiter (default: '{[')
 * @property {string} [closeToken] Token close delimiter (default: ']}')
 * @property {string[]} [imports] Component module paths to import for SSR
 * @property {{ nonce?: string }} [ssrOptions] Options passed to SSR.processHtml
 */

/**
 * Import component modules into the current SSR session.
 * Resolves barrel file re-exports and applies cache-busting to each inner module
 * so `.reg()` calls re-execute against the fresh SSR DOM on every session.
 *
 * @param {string[]} imports
 */
async function loadSsrImports(imports) {
  let ts = '?ssr=' + Date.now();
  for (let imp of imports) {
    let fileUrl = pth(imp, true);
    let filePath = fileURLToPath(fileUrl);
    /** @type {string} */
    let source;
    try {
      source = readFileSync(filePath, 'utf8');
    } catch (e) {
      Log.warn('[WC SSR] Cannot read import:', imp, e.message);
      continue;
    }

    let reExportPattern = /export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    let hasReExports = false;

    while ((match = reExportPattern.exec(source)) !== null) {
      hasReExports = true;
      let specifier = match[1];
      /** @type {string} */
      let resolved;
      if (specifier.startsWith('.')) {
        resolved = new URL(specifier, fileUrl).href;
      } else {
        try {
          resolved = import.meta.resolve(specifier);
        } catch {
          Log.warn('[WC SSR] Cannot resolve bare specifier:', specifier);
          continue;
        }
      }
      try {
        await import(resolved + ts);
      } catch (e) {
        Log.warn('[WC SSR] Failed to import re-export:', specifier, e.message);
      }
    }

    if (!hasReExports) {
      try {
        await import(fileUrl + ts);
      } catch (e) {
        Log.warn('[WC SSR] Failed to import:', imp, e.message);
      }
    }
  }
}

/**
 * Render HTML with Web Component SSR using Symbiote.js SSR engine.
 * Injects data tokens first, then processes custom elements via SSR.processHtml().
 *
 * @param {String} html HTML with Custom Elements to render
 * @param {WcSsrOptions} [options]
 * @returns {Promise<String>} Rendered HTML string
 */
/** @type {Promise<void>} */
let _ssrLock = Promise.resolve();

export async function wcSsr(html, options = {}) {
  let {
    data = {},
    openToken = '{[',
    closeToken = ']}',
    imports = [],
    ssrOptions = {},
  } = options;

  // Pre-pass: inject data tokens
  for (let key in data) {
    html = html.replaceAll(openToken + key + closeToken, data[key]);
  }

  // Check if there are any custom elements to process
  if (!/\<[a-z]+-[\w-]+/.test(html)) {
    return html;
  }

  // Serialize SSR calls — SSR.init/processHtml/destroy use shared global state
  /** @type {() => void} */
  let unlock = () => {};
  let prev = _ssrLock;
  _ssrLock = new Promise((resolve) => { unlock = resolve; });
  await prev;

  try {
    if (imports.length) {
      await SSR.init();
      await loadSsrImports(imports);
      html = await SSR.processHtml(html, ssrOptions);
      SSR.destroy();
    } else {
      html = await SSR.processHtml(html, ssrOptions);
    }
  } catch (e) {
    Log.warn('[WC SSR] SSR processing failed:', e.message);
  } finally {
    unlock();
  }

  return html;
}

export { SSR };