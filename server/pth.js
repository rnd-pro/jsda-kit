import path from 'path';

/**
 * 
 * @param {String} p 
 * @param {Boolean} [isDwa]
 * @returns 
 */
export default function pth(p, isDwa) {
  if (isDwa) {
    let local = !p.includes('//');
    return local ? 'file://' + process.cwd() + path.resolve(process.cwd(), p) : p;
  } else {
    return path.resolve(process.cwd(), p);
  }
}
