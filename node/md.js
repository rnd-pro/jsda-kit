import fs from 'fs';
import { md2html } from '../iso/md2html.js';

/**
 * Renders markdown file contents as a HTML-string
 * @param {String} path path to markdown file
 */
export function md(path) {
  return md2html(fs.readFileSync(path).toString());
}