import code from './code.css.js';
import tuiArticleCom from './tui-article.css.js';

export default /*css*/ `
::-webkit-scrollbar {
  display: none;
}

@view-transition {
  navigation: auto;
}

* {
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

:root {
  scroll-behavior: smooth;

  --clr-h1: #ffbbf4ff;
  --clr-h2: #00ffff;
  --clr-h3: #ffff00;
  --clr-blockquote: #00ff2f;
  --clr-pre: #53a6ff;
  --clr-p-odd: #b3ffe7;
  --clr-ul: #ffaf4c;
  --clr-ol: #b1ff4c;
  --clr-a: currentColor;

  --gap-min: 2px;
  --gap-mid: 2ch;
  --gap-max: 4ch;

  --ui-size: 40px;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  display: block;
  font-family: monospace;
  font-size: large;
  background-color: #000;
  color: #b3eeff;
  text-shadow: 0 0 30px currentColor;
  background: radial-gradient( #121a15ff, #000);
  background-attachment: fixed;
  max-height: 100vh;
  overflow: auto;
}

${tuiArticleCom}
${code}
`;