export default /*css*/ `
tui-article {
  position: relative;
  display: flex;
  gap: 2ch;
  padding-left: var(--gap-max);
  padding-right: var(--gap-max);
  padding-top: 2lh;
  padding-bottom: 3lh;

  &::part(content) {
    display: block;
    width: 100%;
    max-width: 120ch;
    margin: 0 auto;
  }

  &::part(nav) {
    padding: 2ch;
    padding-right: 0;
  }

  &::part(nav-items) {
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: 1lh;
    top: 2lh;
    max-height: calc(100vh - 4lh);
    scrollbar-width: none;
    color: #ff66c4;
    font-size: 0.9em;
    padding-left: 3ch;
    overflow: auto;
  }

  &::part(nav-mark) {
    position: fixed;
    color: var(--clr-h1);
    transition: top .3s ease-in-out;
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

  & > * {
    transition: opacity .2s ease-in-out;
    transition-delay: .4s;
  }

  & > *:not(.tui-fade-in) {
    opacity: 0;
  }
}
`;