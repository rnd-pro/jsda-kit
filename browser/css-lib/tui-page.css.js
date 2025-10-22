import code from './code.css.js';
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
  --clr-p: #b3ffe7;
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
  margin-bottom: 2lh;
  color: var(--clr-h1);
  &::before {
    content: '# ';
  }
}

h2 {
  margin-top: 3lh;
  color: var(--clr-h2);
  &::before {
    content: '## ';
  }
}

h3 {
  margin-top: 3lh;
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
  color: #00ff2f;
  border: 2px dotted currentColor;
  padding: 2ch;

  &::after {
    position: absolute;
    content: "//////";
    top: -1.2ch;
    left: calc(2ch - 4px);
    pointer-events: none;
    background-color: #000;
    padding-left: 2px;
    padding-right: 2px;
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
  color: #53a6ff;
  padding: 2ch;
  overflow: hidden;
  overflow-x: auto;
  border: 2px dotted currentColor;
}

p {
  margin: 2ch 0;
  text-shadow: none;

  &:nth-of-type(odd) {
    color: #b3ffe7;
  }
}

ul {
  --bullet-color: #ffaf4c;
  color: var(--bullet-color);
  position: relative;
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  margin-bottom: 20px;

  li {
    position: relative;
    display: block;
    padding: 10px;
    padding-left: 30px;
    border-left: 2px dotted var(--bullet-color);
    margin-bottom: 0;

    &::before {
      position: absolute;
      left: 0;
      top: 50%;
      width: 10px;
      height: 2px;
      border-bottom: 2px dotted var(--bullet-color);
      content: "";
      color: var(--bullet-color);
      margin-right: 10px;
    }
  }
}

ol {
  --bullet-color: #b1ff4c;
  color: var(--bullet-color);
  position: relative;
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  counter-reset: ordered-list;

  li {
    position: relative;
    display: block;
    padding: 10px;
    padding-left: 40px;
    margin-bottom: 0;
    counter-increment: ordered-list;

    &::before {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      left: 0;
      top: 4px;
      padding: 2px;
      width: calc(1lh + 4px);
      height: calc(1lh + 4px);
      text-align: center;
      border: 2px dotted var(--bullet-color);
      border-radius: 100%;
      content: counter(ordered-list);
      color: var(--bullet-color);
    }
  }
}

a {
  color: currentColor
}

${tuiArticleCom}
${code}
`;