// !!!UNSAFE!!!

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
  ' =': '=',
  '= ': '=',
};

/** @param {String} js */
export function jsMin(js) {
  js = js.replaceAll('\n', ' ');
  for (let subStr in REPLACE_MAP) {
    while (js.includes(subStr)) {
      js = js.replaceAll(subStr, REPLACE_MAP[subStr]);
    }
  }
  return js;
}