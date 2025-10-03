import CFG from '../cfg/CFG.js';
import esbuild from 'esbuild';
import { getExternalDeps } from './getExternalDeps.js';

export function jsBuild(entry) {
  return esbuild.buildSync({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(entry) && CFG.bundle.js,
    format: 'esm',
    target: 'esnext',
    minify: !CFG.minify.exclude.includes(entry) && CFG.minify.js,
    sourcemap: false,
    external: getExternalDeps(),
    treeShaking: true,
    write: false,
  }).outputFiles[0].text;
}

export function cssBuild(entry) {
  return esbuild.buildSync({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(entry) && CFG.bundle.css,
    minify: !CFG.minify.exclude.includes(entry) && CFG.minify.css,
    write: false,
  }).outputFiles[0].text;
}