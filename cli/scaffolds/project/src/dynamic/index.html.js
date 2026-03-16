import fs from 'fs';
import { wcSsr } from 'jsda-kit/node/wcSsr.js';
import { applyData } from 'jsda-kit/iso/applyData.js';
import IMPORTMAP from 'jsda-kit/node/importmap.js';

let tpl = fs.readFileSync(new URL('./tpl/main.tpl.html', import.meta.url), 'utf-8');

export default applyData(await wcSsr(tpl), {
  IMPORTMAP,
  TITLE: 'Home',
  CSS_PATH: './css/index.css.js',
  JS_PATH: './browser/index.js',
});
