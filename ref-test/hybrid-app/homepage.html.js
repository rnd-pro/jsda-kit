import { md } from '../../node/md.js';
import { wcSsr } from '../../node/wcSsr.js';
import importmap from '../../node/importmap.js';

export default /*html*/`
${importmap}
<base href="./ref-test/hybrid-app/">
<script src="./app/app.js" type="module"></script>
<link rel="stylesheet" href="./css/common.css.js">
<article>${await md('./README.md')}</article>
${await wcSsr(/*html*/ `<test-wc></test-wc>`, './ref-test/hybrid-app/wc/{tag-name}/tpl.html.js', {})}
`;
