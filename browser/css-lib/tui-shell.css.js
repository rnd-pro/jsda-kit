export default /*css*/ `
tui-shell {
  position: relative;
  display: grid;
  grid-template-columns: min-content auto;
  min-height: 100vh;

  &::part(nav) {
    position: relative;
    padding-left: var(--gap-max);
  }

  &::part(nav-inner) {
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: var(--gap-mid);
    top: var(--gap-max);
    padding: var(--gap-mid);
    background-color: var(--clr-h1);
    color: #000;
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
}
`;