import Symbiote, { html, css } from '@symbiotejs/symbiote';

class BarrelCompB extends Symbiote {
  isoMode = true;

  init$ = {
    label: 'Beta',
  };
}

BarrelCompB.template = html`
<span class="barrel-b">Component {{label}}</span>
`;

BarrelCompB.rootStyles = css`
barrel-comp-b {
  display: inline-block;
}
`;

BarrelCompB.reg('barrel-comp-b');

export default BarrelCompB;
