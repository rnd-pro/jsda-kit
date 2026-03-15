import Symbiote, { html, css } from '@symbiotejs/symbiote';

class IsoGreeting extends Symbiote {
  isoMode = true;

  init$ = {
    name: 'World',
  };
}

IsoGreeting.template = html`
<div class="greeting">Hello, {{name}}!</div>
`;

IsoGreeting.rootStyles = css`
iso-greeting {
  display: block;
  padding: 1em;
}
`;

IsoGreeting.reg('iso-greeting');

export default IsoGreeting;
