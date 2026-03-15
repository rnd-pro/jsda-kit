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
 * Uses cache-busting to force re-execution of .reg() calls.
 *
 * @param {string[]} imports
 */
async function loadSsrImports(imports) {
  for (let imp of imports) {
    try {
      await import(pth(imp, true) + '?ssr=' + Date.now());
    } catch (e) {
      Log.warn('[WC SSR] Failed to import:', imp, e.message);
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
  }

  return html;
}

export { SSR };