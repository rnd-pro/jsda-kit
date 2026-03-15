import Symbiote, { html, css } from '@symbiotejs/symbiote';

class NestedCompA extends Symbiote {
  isoMode = true;

  init$ = {
    label: 'Nested-Alpha',
  };
}

NestedCompA.template = html`
<span class="nested-a">{{label}}</span>
`;

NestedCompA.rootStyles = css`
nested-comp-a {
  display: inline-block;
}
`;

NestedCompA.reg('nested-comp-a');

export default NestedCompA;
