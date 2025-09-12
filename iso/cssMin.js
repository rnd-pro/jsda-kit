const REPLACE_MAP = {
  '  ': ' ',
  ', ': ',',
  '; ': ';',
  ': ': ':',
  ' :': ':',
  '{ ': '{',
  ' {': '{',
  '} ': '}',
  ' }': '}',
};

/** @param {String} css */
export function cssMin(css) {
  css = css.replaceAll('\n', ' ');
  for (let subStr in REPLACE_MAP) {
    while (css.includes(subStr)) {
      css = css.replaceAll(subStr, REPLACE_MAP[subStr]);
    }
  }
  return css;
}