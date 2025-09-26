import fs from 'fs';
import { md2html } from '../iso/md2html.js';

/**
 * Renders markdown file contents as a HTML-string
 * @param {String} path path to markdown file
 */
export async function md(path) {
  return path.startsWith('https') ? md2html((await fetch(path)).toString()) : md2html(fs.readFileSync(path).toString());
}