import code from './code.css.js';
import tuiShellCom from './tui-shell.css.js';
import tuiArticleCom from './tui-article.css.js';

export default /*css*/ `
::-webkit-scrollbar {
  display: none;
}

@view-transition {
  navigation: auto;
}

:root {
  scroll-behavior: smooth;

  --clr-h1: #ff00a6;
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
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  min-width: 100vw;
  background-color: #000;
}

* {
  box-sizing: border-box;
}

body {
  font-family: monospace;
  font-size: large;
  background-color: #000;
  color: #b3eeff;
  text-shadow: 0 0 30px currentColor;
  background: radial-gradient(#0e110f, #000);
  background-attachment: fixed;
}

h1 {
  margin-top: 0;
  padding-top: var(--gap-mid);
  margin-bottom: var(--gap-mid);
  color: var(--clr-h1);
  &::before {
    content: '# ';
  }
}

h2 {
  margin: 0;
  padding-top: var(--gap-mid);
  padding-bottom: var(--gap-min);
  color: var(--clr-h2);
  &::before {
    content: '## ';
  }
}

h3 {
  margin: 0;
  padding-top: var(--gap-mid);
  padding-bottom: var(--gap-min);
  color: var(--clr-h3);
  &::before {
    content: '### ';
  }
}

blockquote, [box] {
  margin: 0;
  margin-top: 2lh;
  margin-bottom: 2lh;
  position: relative;
  color: var(--clr-blockquote);
  border: var(--gap-min) dotted currentColor;
  padding: 2ch;

  &::after {
    position: absolute;
    content: "//////";
    top: -1.2ch;
    left: calc(2ch - 4px);
    pointer-events: none;
    background-color: #000;
    padding-left: var(--gap-min);
    padding-right: var(--gap-min);
  }

  &[caption]::after {
    content: attr(caption);
  }
  
}

pre {
  position: relative;
  margin: 0;
  margin-top: 2lh;
  margin-bottom: 2lh;
  color: var(--clr-pre);
  padding: 2ch;
  overflow: hidden;
  overflow-x: auto;
  border: var(--gap-min) dotted currentColor;
}

p {
  margin: 2ch 0;
  text-shadow: none;

  &:nth-of-type(odd) {
    color: var(--clr-p-odd);
  }
}

ul {
  --bullet-color: var(--clr-ul);
  color: var(--bullet-color);
  position: relative;
  list-style-type: none;
  padding: 0;
  margin-top: var(--gap-max);
  margin-bottom: var(--gap-max);

  li {
    position: relative;
    display: block;
    padding: var(--gap-mid);
    padding-left: 3ch;
    border-left: var(--gap-min) dotted var(--bullet-color);
    margin-bottom: 0;

    &::before {
      position: absolute;
      left: 0;
      top: calc(50% - var(--gap-min));
      width: var(--gap-mid);
      height: var(--gap-min);
      border-bottom: var(--gap-min) dotted var(--bullet-color);
      content: "";
      color: var(--bullet-color);
      margin-right: var(--gap-mid);
    }
  }
}

ol {
  --bullet-color: var(--clr-ol);
  color: var(--bullet-color);
  position: relative;
  list-style-type: none;
  padding: 0;
  margin-top: var(--gap-max);
  margin-bottom: var(--gap-max);
  counter-reset: ordered-list;

  li {
    position: relative;
    display: block;
    padding: var(--gap-mid);
    padding-left: calc(var(--gap-max) + var(--gap-min));
    margin-bottom: 0;
    counter-increment: ordered-list;

    &::before {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      left: 0;
      top: calc(1ch + 3px);
      padding: var(--gap-min);
      width: calc(1lh + 4px);
      height: calc(1lh + 4px);
      text-align: center;
      border: var(--gap-min) dotted var(--bullet-color);
      border-radius: 100%;
      content: counter(ordered-list);
      color: var(--bullet-color);
    }
  }
}

a {
  color: currentColor
}

${tuiShellCom}
${tuiArticleCom}
${code}
`;