import chalk from 'chalk';
import pth from './pth.js';

class CFG {

  routes = './ref/routes.js';
  pageData = './ref/data.js';
  ssrComponents = {
    templates: './ssrComponents/{name}/tpl.html',
    scripts: './ssrComponents/{name}/index.js',
    styles: './ssrComponents/{name}/style.css',
  };
  cache = true;
  port = 3000;
  importmap = true;

  constructor(/** @type {Partial<CFG>} */ initObj) {
    if (initObj) {
      Object.assign(this, initObj);
    }
  }
}

let cfg = new CFG();
try {
  let cfgObj = (await import(pth('project.cfg.js'))).default;
  Object.assign(cfg, cfgObj);
} catch(err) {
  console.log(chalk.bgRed('DWA Server:') + chalk.white('Error loading config'));
  console.log(err);
}

export { cfg, CFG };
export default cfg;
