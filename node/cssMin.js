import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";

/** @param {String} css */
export function cssMin(css) {
  return minifyHtml.minify(Buffer.from(`<style>${css}</style>`), {
    minify_css: true,
  }).toString().replace(/<style>/, '').replace(/<\/style>/, '');
}