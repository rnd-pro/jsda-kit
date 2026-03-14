import Symbiote, { html } from '@symbiotejs/symbiote';

class TestGreeting extends Symbiote {
  init$ = {
    name: 'World',
  };
}

TestGreeting.template = html`
<div class="greeting">Hello, {{name}}!</div>
`;

TestGreeting.reg('test-greeting');

export default TestGreeting;
