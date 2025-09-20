import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";

/** @param {String} html */
export function htmlMin(html) {
  return minifyHtml.minify(Buffer.from(html), {
    minify_css: true,
    minify_js: true,
    keep_comments: false,
  });
}