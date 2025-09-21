import fs from 'fs';
import CFG from '../cfg/CFG.js';

let packages = CFG.importmap.packageList;

/**
 * This function creates an HTML-chunk with importmap and preload links 
 * for the packages used as https-dependencies. The list of package name could be passed via
 * 'networkPackages' field in ./project.cfg.js file, placed in the project's root.
 * Package versions will be taken from the package.json file by default.
 * @param {String[]} [pkgList] list of package names which are should be imported over https://
 * @param {Boolean} [useVersion] use certain version from package.json
 * @param {String} [cdnSrcScheme] url string template for the package imports. Use {{PKG}} as a package name placeholder
 * @returns {String}
 */
export function getImportMap(
  pkgList = packages, 
  useVersion = true,
  cdnSrcScheme = CFG.importmap.srcSchema,
) {

  let hostPkg = JSON.parse(fs.readFileSync('./package.json').toString());
  
  let iMap = {
    imports: {},
  };

  /**
   * 
   * @param {String} pkgName 
   * @returns {String}
   */
  let getUrl = (pkgName) => {
    return cdnSrcScheme.replaceAll('{pkg-name}', pkgName);
  }
  
  pkgList.forEach((pkg) => {
    let version = useVersion ? (hostPkg?.dependencies?.[pkg]?.replace('^', '@') || '') : '';
    iMap.imports[pkg] = getUrl(pkg + version);
  });

  let polyfills = /*html*/ `
    <!-- Import maps polyfill for older browsers without import maps support (eg Safari 16.3) -->
    <script async src="${getUrl('es-module-shims')}" crossorigin="anonymous" type="module"></script>
    <!-- Customizable built-in elements polyfill (Safari) -->
    <script async src="${getUrl('@ungap/custom-elements')}" crossorigin="anonymous" type="module"></script>
  `;

  let preload = Object.values(iMap.imports).map((url) => {
    return /*html*/ `<!-- Preload dependencies for speed -->
    <link rel="modulepreload" href="${url}"/>`;
  }).join('\n');

  return /*html*/ `
    <script type="importmap">${JSON.stringify(iMap, undefined, 2)}</script>
    ${CFG.importmap.polyfills ? polyfills : ''}
    ${CFG.importmap.preload ? preload : ''}
  `.trim();
}

export default getImportMap();