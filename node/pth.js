import path from 'path';

/**
 * @param {String} p
 * @param {Boolean} [isFileUrl]
 * @returns {String}
 */
export default function pth(p, isFileUrl) {
  let resolved = path.resolve(process.cwd(), p);
  if (isFileUrl) {
    let local = !p.includes('//');
    return local ? 'file://' + resolved : p;
  }
  return resolved;
}
