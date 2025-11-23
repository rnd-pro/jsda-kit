import cfg from '../cfg/CFG.js';

export function getExternalDeps() {
  return cfg.importmap.packageList;
}