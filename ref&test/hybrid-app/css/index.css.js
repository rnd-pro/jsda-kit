export default /*css*/ `
:root {
  --color-1: #272630;
  --color-2: #e4f1ff;

  --gap-min: 2px;
  --gap-mid: 10px;
  --gap-max: 20px;
  
  --column-w: 960px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-1);
  color: var(--color-2);
  font-family: 'Inter', sans-serif;
}

code {
  display: inline-block;
  font-family: 'Fira Code', monospace;
  background-color: rgba(0, 0, 0, 0.4);
  color: rgb(163, 241, 244);
  padding: 0.2rem 0.5rem;
  border-radius: 0.2rem;

  &.hljs {
    display: block;
    padding: 1rem;
  }
}

div[doc] {
  padding: calc(var(--gap-max) * 2);
  background-color: rgba(255, 255, 255, .01);
  border-radius: 0.5rem;
  max-width: var(--column-w);
  margin: 2rem auto;
}

a {
  color: currentColor;
}

td {
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, .05);
  border-radius: 0.2rem;
  margin: 0.2rem;
}

test-wc {
  display: block;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  max-width: var(--column-w);
  margin: 2rem auto;
}
`;