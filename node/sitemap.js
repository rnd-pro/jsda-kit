import fs from 'fs';
import path from 'path';
import CFG, { getSitemapEnabled, getSitemapConfig } from '../cfg/CFG.js';
import { Log } from './Log.js';
import { findFiles } from './findFiles.js';

/**
 * @param {String} urlPath
 * @returns {String}
 */
function normalizePath(urlPath) {
  if (urlPath.endsWith('/index.html')) {
    return urlPath.slice(0, -'index.html'.length);
  }
  return urlPath;
}

/**
 * @param {String} urlPath
 * @param {String[]} exclude
 * @returns {boolean}
 */
function isExcluded(urlPath, exclude) {
  return exclude.some((pattern) => urlPath.includes(pattern));
}

/**
 * @param {String} filePath
 * @returns {String}
 */
function getLastmod(filePath) {
  let stat = fs.statSync(filePath);
  return stat.mtime.toISOString().split('T')[0];
}

/**
 * @typedef {Object} SitemapEntry
 * @property {String} loc
 * @property {String} lastmod
 * @property {String} [changefreq]
 * @property {String} [priority]
 */

/**
 * @param {SitemapEntry[]} entries
 * @returns {String}
 */
export function buildSitemapXml(entries) {
  let urls = entries.map((e) => {
    let parts = [`    <loc>${e.loc}</loc>`];
    if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
    if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (e.priority) parts.push(`    <priority>${e.priority}</priority>`);
    return `  <url>\n${parts.join('\n')}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export async function generateSitemap() {
  if (!getSitemapEnabled(CFG)) return;

  let smCfg = getSitemapConfig(CFG);

  if (!smCfg.baseUrl) {
    Log.warn('Sitemap:', 'baseUrl is not set, skipping sitemap generation');
    return;
  }

  let baseUrl = smCfg.baseUrl.replace(/\/+$/, '');
  let outputDir = CFG.static.outputDir;
  let found = findFiles(outputDir, ['.html'], []) || [];
  let htmlPaths = found.map((f) => '/' + path.relative(outputDir, f).split(path.sep).join('/'));

  /** @type {SitemapEntry[]} */
  let entries = [];

  for (let urlPath of htmlPaths) {
    let normalized = normalizePath(urlPath);
    if (isExcluded(normalized, smCfg.exclude)) continue;

    let filePath = path.join(outputDir, urlPath);
    let entry = {
      loc: baseUrl + normalized,
      lastmod: getLastmod(filePath),
    };
    if (smCfg.changefreq) entry.changefreq = smCfg.changefreq;
    if (smCfg.priority) entry.priority = smCfg.priority;
    entries.push(entry);
  }

  entries.sort((a, b) => a.loc.localeCompare(b.loc));

  let xml = buildSitemapXml(entries);
  let outPath = path.join(outputDir, smCfg.filename);
  fs.writeFileSync(outPath, xml);
  Log.info('Sitemap:', `${entries.length} URLs → ${outPath}`);
}

export { normalizePath, isExcluded };
