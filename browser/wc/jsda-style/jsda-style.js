import Symbiote from '@symbiotejs/symbiote';

export class JsdaStyle extends Symbiote {

  connectedCallback() {
    super.connectedCallback();
    this.sub('src', async (src) => {
      if (!src) return;
      if (!src.includes('.css.js')) {
        console.warn('jsda-style: src should point to a .css.js file');
        return;
      }
        /** @type {String} */
      let jsdaCssTxt = (await import(src)).default;
      if (typeof jsdaCssTxt !== 'string') {
        console.warn('jsda-style: imported file does not export a string as default');
        return;
      }
      let styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(jsdaCssTxt);
      /** @type {ShadowRoot | Document} */
      // @ts-expect-error
      let root = this.getRootNode() || document;
      root.adoptedStyleSheets = [
        ...root.adoptedStyleSheets,
        styleSheet,
      ];
    });
    this.style.display = 'none';
  }

}

JsdaStyle.bindAttributes({
  src: 'src',
});

JsdaStyle.reg('jsda-style');

export default JsdaStyle;