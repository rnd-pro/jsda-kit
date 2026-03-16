import CFG from '../cfg/CFG.js';
import esbuild from 'esbuild';
import { minifyTemplates } from 'esbuild-minify-templates';
import { getExternalDeps } from './getExternalDeps.js';

/**
 * @param {String} entry
 * @returns {Promise<String>}
 */
export async function jsBuild(entry) {
  let result = await esbuild.build({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(entry) && CFG.bundle.js,
    format: 'esm',
    target: 'esnext',
    minify: !CFG.minify.exclude.includes(entry) && CFG.minify.js,
    sourcemap: false,
    external: getExternalDeps(),
    treeShaking: true,
    write: false,
    plugins: [minifyTemplates({ taggedOnly: true })],
  });
  return result.outputFiles[0].text;
}

/**
 * @param {String} entry
 * @returns {String}
 */
export function cssBuild(entry) {
  return esbuild.buildSync({
    entryPoints: [entry],
    bundle: !CFG.bundle.exclude.includes(entry) && CFG.bundle.css,
    minify: !CFG.minify.exclude.includes(entry) && CFG.minify.css,
    write: false,
  }).outputFiles[0].text;
}