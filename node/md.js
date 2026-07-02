import fs from 'fs';
import CFG, { getMarkdownExternalLinksConfig } from '../cfg/CFG.js';
import { md2html } from '../iso/md2html.js';

/**
 * Renders markdown file contents as a HTML-string
 * @param {String} path path to markdown file
 */
export async function md(path) {
  let mdTxt = path.startsWith('http') ? await (await fetch(path)).text() : fs.readFileSync(path).toString();
  return md2html(mdTxt, {
    externalLinks: getMarkdownExternalLinksConfig(CFG),
  });
}
