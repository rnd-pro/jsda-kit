export default /*css*/ `
tui-article {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2ch;
  padding-left: var(--gap-max);
  padding-right: var(--gap-max);
  padding-bottom: 3lh;

  &::part(content) {
    display: block;
    width: 100%;
    max-width: 120ch;
    margin: 0 auto;
    max-height: 100vh;
    overflow: auto;
    scrollbar-width: none;
    scroll-behavior: smooth;
  }

  &::part(nav) {
    padding: 2ch;
    padding-right: 0;
    scrollbar-width: none;
  }

  &::part(nav-items) {
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: 1lh;
    top: calc(2lh + var(--gap-max));
    max-height: calc(100vh - 4lh);
    scrollbar-width: none;
    color: var(--clr-h1);
    font-size: 0.9em;
    padding-left: 3ch;
    overflow: auto;
  }

  &::part(nav-mark) {
    position: fixed;
    color: var(--clr-h1);
    transition: top .3s ease-in-out, opacity .5s;
    transform: translateY(-50%);
    pointer-events: none;
    margin-left: -1ch;
  }

  &::part(nav-item-h1) {
    color: currentColor;
    text-decoration: none;
    color: var(--clr-h1);
  }
  &::part(nav-item-h2) {
    color: currentColor;
    text-decoration: none;
    color: var(--clr-h2);
  }
  &::part(nav-item-h3) {
    color: currentColor;
    text-decoration: none;
    color: var(--clr-h3);
    padding-left: 1ch;
    border-left: 2px dotted currentColor;
    font-size: 0.9em;
  }

  & > *, li {
    transition: opacity .2s ease-in-out;
    transition-delay: .4s;
  }

  & > *:not(.tui-fade-in), li:not(.tui-fade-in) {
    opacity: 0;
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
    color: var(--clr-a);
    word-wrap: break-word;
    word-break: break-word;
  }

  hr {
    border: none;
    border-bottom: var(--gap-min) dotted var(--clr-h1);
    margin: var(--gap-max) 0;
  }

  a[btn] {
    --loc-bw: 20px;
    --loc-clr: #eee;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 0;
    padding-left: 1ch;
    padding-right: 1ch;
    margin: 0;
    height: var(--ui-size);
    min-width: var(--ui-size);
    background-color: transparent;
    border-top: var(--loc-bw) solid var(--loc-clr);
    border-bottom: var(--loc-bw) solid var(--loc-clr);
    border-left: 10px solid transparent;
    color: #000;
    cursor: pointer;
    text-decoration: none;
    font-family: "Doto", sans-serif;
    font-optical-sizing: auto;
    font-weight: 900;
    font-style: bold;
    white-space: nowrap;

    &:hover {
      --loc-clr: var(--clr-h1);
    }

    &:after {
      content: '';
      display: inline-flex;
      position: absolute;
      right: -30px;
      border-left: 10px solid var(--loc-clr);
      border-top: var(--loc-bw) solid transparent;
      border-bottom: var(--loc-bw) solid transparent;
      border-right: var(--loc-bw) solid transparent;
    }
  }

  arrow-links-css {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: var(--gap-max);
    margin-bottom: var(--gap-max);
  }

  iframe[code] {
    width: 100%;
    border: none;
    min-height: 500px;
  }

  table {
    border-collapse: collapse;
    border: 1px solid currentColor;

    th {
      border: 1px solid currentColor;
      background-color: #b3eeff;
      color: #000;
      padding: .8em;
    }

    td {
      border: 1px solid currentColor;
      padding: .8em;
    } 
  }

  code:not([class]) {
    background-color: rgba(240, 240, 255, .1);
    color: #fff;
    padding: .2em;
  }

  pre {
    code:not([class]) {
      background-color: transparent !important;
    }
  }

  img {
    max-width: 100%;
  }
}
`;