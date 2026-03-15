import Symbiote, { html, css } from '@symbiotejs/symbiote';

class NestedCompB extends Symbiote {
  isoMode = true;

  init$ = {
    label: 'Nested-Beta',
  };
}

NestedCompB.template = html`
<span class="nested-b">{{label}}</span>
`;

NestedCompB.rootStyles = css`
nested-comp-b {
  display: inline-block;
}
`;

NestedCompB.reg('nested-comp-b');

export default NestedCompB;
