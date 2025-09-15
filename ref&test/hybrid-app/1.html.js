import { md } from '../../node/md.js';

export default /*html*/`
{[importMap]}
<base href="./ref&test/hybrid-app/">
<script src="./app/index.js" type="module"></script>
<link rel="stylesheet" href="./css/index.css.js">
<div doc>${await md('./README.md')}</div>
<test-wc></test-wc>
`;
