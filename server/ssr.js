import fs from 'fs';
import pth from './pth.js';

/**
 * 
 * @param {String} html HTML to render  
 * @param {String} tplPathSchema Component template path schema (e.g. './ref/wc/{name}/tpl.html')
 * @param {Object<string, string>} [data] Data to render
 * @returns {Promise<String>} Rendered HTML string
 */
export async function ssr(html, tplPathSchema, data = {}) {
  Object.keys(data).forEach((key) => {
    html = html.replaceAll(`{[${key}]}`, data[key]);
  });
  
  const matches = html.matchAll(/<([a-z]+-[\w-]+)(?:\s+[^>]*)?>/g);
  for (const match of matches) {
    const [fullMatch, tagName] = match;
    let tplPath = tplPathSchema.replace('{name}', tagName);
    let tpl = '';
    
    if (tplPath.endsWith('.html')) {
      tpl = fs.existsSync(tplPath) ? fs.readFileSync(tplPath, 'utf8') : '';
    } else if (tplPath.endsWith('.js') || tplPath.endsWith('.mjs')) {
      tpl = (await import(pth(tplPath))).default;
    }
    
    if (tpl) {
      if (!tpl.includes(`<${tagName}`)) {
        tpl = await ssr(tpl, tplPathSchema, data);
      } else {
        tpl = '';
        console.warn(`[SSR] Endless loop detected for component ${tagName}`);
      }
    }
    html = html.replace(fullMatch, fullMatch + tpl);
  }
  
  return html;
}