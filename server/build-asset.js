import CFG, { isMinifyEnabled } from '../cfg/CFG.js';
import esbuild from 'esbuild';
import { minifyTemplates } from 'esbuild-minify-templates';
import { getExternalDeps } from './getExternalDeps.js';

/**
 * @param {String} entry
 * @returns {Promise<String>}
 */
export async function jsBuild(entry) {
  let minify = isMinifyEnabled(CFG, 'js', entry);
  let result = await esbuild.build({
    entryPoints: [entry],
    outfile: 'index.js',
    bundle: !CFG.bundle.exclude.includes(entry) && CFG.bundle.js,
    format: 'esm',
    target: 'esnext',
    minify,
    sourcemap: false,
    external: getExternalDeps(),
    treeShaking: true,
    write: false,
    plugins: minify ? [minifyTemplates({ taggedOnly: true })] : [],
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
    minify: isMinifyEnabled(CFG, 'css', entry),
    write: false,
  }).outputFiles[0].text;
}
