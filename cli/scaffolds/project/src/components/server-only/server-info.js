import Symbiote, { html, css } from '@symbiotejs/symbiote';

class ServerInfo extends Symbiote {
  isoMode = true;

  init$ = {
    serverTime: new Date().toISOString(),
  };
}

ServerInfo.template = html`
<div class="info">
  <span class="label">Server Time:</span>
  <time>{{serverTime}}</time>
</div>
`;

ServerInfo.rootStyles = css`
server-info {
  display: block;
  padding: 0.75em 1em;
  font-family: system-ui, sans-serif;
  background: var(--surface, #f5f5f5);
  border-radius: 6px;

  .info {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }

  .label {
    font-weight: 600;
    color: var(--primary, #007acc);
  }

  time {
    font-variant-numeric: tabular-nums;
    opacity: 0.8;
  }
}
`;

ServerInfo.reg('server-info');

export default ServerInfo;
