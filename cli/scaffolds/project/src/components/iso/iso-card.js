import Symbiote, { html, css } from '@symbiotejs/symbiote';

class IsoCard extends Symbiote {
  isoMode = true;

  init$ = {
    heading: 'Isomorphic Card',
    text: 'This component renders on both server and client.',
    elapsed: '0s',
  };

  renderCallback() {
    let sec = 0;
    this.#timer = setInterval(() => {
      sec++;
      this.$.elapsed = sec + 's';
    }, 1000);
  }

  destroyCallback() {
    clearInterval(this.#timer);
  }

  #timer;
}

IsoCard.template = html`
<div class="card">
  <h3 ${{textContent: 'heading'}}></h3>
  <p ${{textContent: 'text'}}></p>
  <div class="timer">
    Hydrated: <span ${{textContent: 'elapsed'}}></span>
  </div>
</div>
`;

IsoCard.rootStyles = css`
iso-card {
  display: block;
  font-family: system-ui, sans-serif;

  .card {
    padding: 1.25em;
    border-radius: 8px;
    background: var(--surface, #fff);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

    h3 {
      margin: 0 0 0.5em;
      color: var(--primary, #007acc);
    }

    p {
      margin: 0;
      line-height: 1.5;
      opacity: 0.85;
    }

    .timer {
      margin-top: 1em;
      padding-top: 0.75em;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      font-size: 0.85rem;
      color: var(--primary, #007acc);
      font-variant-numeric: tabular-nums;
    }
  }
}
`;

IsoCard.reg('iso-card');

export default IsoCard;
