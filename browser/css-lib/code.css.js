let params = new URLSearchParams(import.meta.url.split('?')[1] || '');

let hlSelectorsList = [
  '.hljs-string',
  '.hljs-comment',
  '.hljs-attr',
  '.hljs-attribute',
  '.hljs-function',
  '.hljs-variable',
  '.hljs-title',
  '.hljs-property',
  '.hljs-selector-class',
  '.hljs-keyword',
  '.hljs-tag',
  '.hljs-name',
  '.hljs-number',
  '.hljs-params',
  '.hljs-literal',
];

let generated = '';

let h = parseFloat(params.get('h') || '150');
let s = params.get('s') || '95';
let l = params.get('l') || '74';

let step = 0;
let hsl = () => {
  return `hsl(${step++ * h}deg ${s}% ${l}%)`;
};

hlSelectorsList.forEach((selector) => {
  generated += /*css*/ `${selector} {color: ${hsl()};}`;
});

let hlStyles = /*css*/ `
pre {
  font-family: monospace;

  code {
    ${generated}

    .hljs-comment {
      font-style: italic;
      opacity: .7;
    }
  }
}
`;

export default hlStyles;