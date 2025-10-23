export default /*css*/ `
tui-shell {
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: 100vh;
  min-height: 100vh;
  width: 100vw;

  &::part(nav) {
    position: relative;
    overflow: auto;
    scrollbar-width: none;
    padding-left: var(--gap-max);
  }

  &::part(nav-inner) {
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: var(--gap-mid);
    top: var(--gap-max);
    padding: var(--gap-max);
    background-color: var(--clr-h1);

  }
  &::part(nav-inner)::after {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    content: "";
    height: 2px;
    color: var(--clr-h1);
    border-bottom: 2px dotted currentColor;
    transform: scaleY(6);
    opacity: .6;
  }

  &::part(content) {
    overflow: auto;
    scrollbar-width: none;
  }
}
`;