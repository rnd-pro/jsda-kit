import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { addHeadingId } from './addHeadingId.js';

const defaultExternalLinksConfig = {
  enabled: false,
  target: '_blank',
  rel: 'noopener noreferrer',
  exclude: [],
};

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  async: false,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}));

/**
 * @param {String} value
 * @returns {String}
 */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @param {String} href
 * @param {String[]} exclude
 * @returns {boolean}
 */
function isExternalLink(href, exclude) {
  return /^(https?:)?\/\//i.test(href) && !exclude.some((pattern) => href.includes(pattern));
}

/**
 * @param {JSDA_MD2HTML_OPTIONS} options
 * @returns {import('marked').MarkedOptions}
 */
function getMarkedOptions(options = {}) {
  let externalLinks = {
    ...defaultExternalLinksConfig,
    ...(options.externalLinks || {}),
  };

  if (!externalLinks.enabled) return {};

  let renderer = new marked.Renderer();
  let defaultLinkRenderer = renderer.link.bind(renderer);

  renderer.link = (token) => {
    let html = defaultLinkRenderer(token);
    if (!isExternalLink(token.href || '', externalLinks.exclude)) return html;

    let attrs = '';
    if (externalLinks.target) attrs += ` target="${escapeAttr(externalLinks.target)}"`;
    if (externalLinks.rel) attrs += ` rel="${escapeAttr(externalLinks.rel)}"`;

    return html.replace(/^<a\b/, `<a${attrs}`);
  };

  return {renderer};
}

/**
 * Transforms the input markdown text into the HTML format
 * @param {String} mdTxt source markdown
 * @param {JSDA_MD2HTML_OPTIONS} options render options
 */
export async function md2html(mdTxt, options = {}) {
  return addHeadingId(await marked.parse(mdTxt, getMarkedOptions(options)));
}

export { isExternalLink };
