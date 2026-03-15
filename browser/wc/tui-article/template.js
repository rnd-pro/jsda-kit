import { html } from '@symbiotejs/symbiote';

export default html`
<article part="content">
  <slot></slot>
</article>
<div part="nav">
  <div part="nav-items" itemize="mdNav" tag-name="article-nav-item" ref="navItems">
    <a ${{href: 'anchor', onclick: 'onClick', '@part': 'hType', textContent: 'heading'}}></a>
  </div>
  <div part="nav-mark" ref="navMark" style="opacity: 0; top: 0;">|<br>&gt;<br>|</div>
</div>
`;