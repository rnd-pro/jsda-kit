/**
 * 
 * @param {String} inputString 
 * @param {'image/png' | 'text/html' | 'text/javascript' | 'text/css' | 'image/svg+xml' | 'image/gif'} mimeType 
 * @param {Boolean} [encode]
 * @returns 
 */
export function b64Src(inputString, mimeType, encode) {
  return `data:${mimeType};base64,${encode ? btoa(inputString) : inputString}`;
}