/**
 * 
 * @param {String} html 
 * @param {Object<string, string>} data 
 * @param {String} [openToken]
 * @param {String} [closeToken]
 * @returns 
 */
export function applyData(html, data, openToken = '{{', closeToken = '}}') {
  for (let key in data) {
    html = html.replaceAll(openToken + key + closeToken, data[key]);
  }
  return html;
}