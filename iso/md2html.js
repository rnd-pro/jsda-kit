import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  async: false,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}));

/**
 * Transforms the input markdown text into the HTML format
 * @param {String} mdTxt source markdown
 */
export function md2html(mdTxt) {
  return marked.parse(mdTxt);
}