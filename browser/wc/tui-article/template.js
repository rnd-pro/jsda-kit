import { html } from '@symbiotejs/symbiote';

export default html`
<article part="content">
  <slot></slot>
</article>
<div part="nav">
  <div part="nav-items" itemize="mdNav" ref="navItems">
    <a ${{href: 'anchor', onclick: 'onClick', '@part': 'hType'}}>{{heading}}</a>
  </div>
  <div part="nav-mark" ref="navMark">|<br>&gt;<br>|</div>
</div>
`;