import Symbiote, { html, css } from '@symbiotejs/symbiote';

class BarrelCompA extends Symbiote {
  isoMode = true;

  init$ = {
    label: 'Alpha',
  };
}

BarrelCompA.template = html`
<span class="barrel-a">Component {{label}}</span>
`;

BarrelCompA.rootStyles = css`
barrel-comp-a {
  display: inline-block;
}
`;

BarrelCompA.reg('barrel-comp-a');

export default BarrelCompA;
