import { htmlMin, applyData } from './index.js';

/**
 * 
 * @param {String} template 
 * @param {Object<string, string>} data 
 */
export function buildHtml(template, data) {
  return htmlMin(applyData(template, data));
}