let fs;
try {
  fs = (await import('fs')).default;
} catch (e) {}
let resourcePath = import.meta.url.split('?')[1];
/** @type {String} */
let resource;
if (resourcePath?.includes('//')) {
  resource = await (await fetch(resourcePath)).text();
} else if (fs) {
  resource =  fs.readFileSync(resourcePath).toString();
} else {
  resource = 'IMPORT ERROR: ' + resourcePath;
}
export default resource;