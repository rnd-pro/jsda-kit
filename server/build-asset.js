import CFG from '../cfg/CFG.js';
import esbuild from 'esbuild';
import { getExternalDeps } from './getExternalDeps.js';


export function jsBuild(url) {
  let entry = '.' + url;
  return esbuild.buildSync({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(url) && CFG.bundle.js,
    format: 'esm',
    target: 'esnext',
    minify: !CFG.minify.exclude.includes(url) && CFG.minify.js,
    sourcemap: false,
    external: getExternalDeps(),
    treeShaking: true,
    write: false,
  }).outputFiles[0].text;
}

export function cssBuild(url) {
  let entry = '.' + url;
  return esbuild.buildSync({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(url) && CFG.bundle.css,
    minify: !CFG.minify.exclude.includes(url) && CFG.minify.css,
    write: false,
  }).outputFiles[0].text;
}