import fs from 'fs';
import process from 'process';

let packages = (await import(process.cwd() + '/project.cfg.js')).default?.networkPackages || [
  '@symbiotejs/symbiote',
  '@jam-do/ims',
  'jam-x',
];

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
export default function getImportMap(
  pkgList = packages, 
  useVersion = true,
  cdnSrcScheme = 'https://cdn.jsdelivr.net/npm/{{PKG}}/+esm'
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
    return cdnSrcScheme.replaceAll('{{PKG}}', pkgName);
  }
  
  pkgList.forEach((pkg) => {
    let version = useVersion ? (hostPkg?.dependencies?.[pkg]?.replace('^', '@') || '') : '';
    iMap.imports[pkg] = getUrl(pkg + version);
  });

  return /*html*/ `
    <script type="importmap">${JSON.stringify(iMap, undefined, 2)}</script>
    <!-- Import maps polyfill for older browsers without import maps support (eg Safari 16.3) -->
    <script async src="${getUrl('es-module-shims')}" crossorigin="anonymous" type="module"></script>
    <!-- Customizable built-in elements polyfill (Safari) -->
    <script async src="${getUrl('@ungap/custom-elements')}" crossorigin="anonymous" type="module"></script>
    <!-- Preload dependencies for speed -->
    ${Object.values(iMap.imports).map((url) => {
      return /*html*/ `<link rel="modulepreload" href="${url}"/>`;
    }).join('\n')}
  `.trim();
}

export { getImportMap }