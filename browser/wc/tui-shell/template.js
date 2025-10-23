import { html } from '@symbiotejs/symbiote';

export default html`
<nav part="nav">
  <nav part="nav-inner">
    <slot name="nav"></slot>
  </nav>
</nav>
<div part="content">
  <slot></slot>
</div>
`;