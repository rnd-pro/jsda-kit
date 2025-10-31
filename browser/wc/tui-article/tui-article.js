import Symbiote from '@symbiotejs/symbiote';
import template from './template.js';

export class TuiArticle extends Symbiote {

  renderShadow = true;

  init$ = {
    mdNav: [],
    currentChapter: '',
  }

  /**
   * 
   * @param { HTMLElement } navItem 
   */
  markCurrent(navItem) {
    let link = navItem.querySelector('a');
    let rect = link.getBoundingClientRect();
    this.ref.navMark.style.top = `${rect.top + rect.height / 2}px`;
  }

  /**
   * 
   * @param { Element } navTarget 
   */
  onIntersection(navTarget) {
    if (this.$.currentChapter) return;
    let navItems = [...this.ref.navItems.children];
    let targetNavItem = navItems.find((navItem) => {
      return navItem.$.hElement === navTarget;
    });
    if (targetNavItem) {
      this.markCurrent(targetNavItem);
    }
  }

  init() {
    let articleElements = [...this.children, ...this.querySelectorAll('li')];
    let reactOn = ['H1', 'H2', 'H3'];
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tui-fade-in');
          if (reactOn.includes(entry.target.tagName)) {
            this.onIntersection(entry.target);
          }
        } else {
          entry.target.classList.remove('tui-fade-in');
        }
      });
      }, {
        // threshold: 0.1,
        // rootMargin: '0px 0px -10% 0px',
      }
    );

    articleElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });

    let headingElements = this.querySelectorAll('h1, h2, h3, h4');
    let mdNav = [];
    headingElements.forEach((headingEl) => {
      let headingText = headingEl.textContent.trim();
      let headingId = headingEl.id || headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
      !headingEl.id && (headingEl.id = headingId);
      mdNav.push({
        heading: headingText,
        anchor: `${window.location.pathname}#${headingId}`,
        hType: 'nav-item-' + headingEl.tagName.toLowerCase(),
        hElement: headingEl,
        onClick: () => {
          this.$.currentChapter = headingId;
          window.setTimeout(() => {
            this.$.currentChapter = '';
          }, 1500);
        },
      });
    });
    this.$.mdNav = mdNav;
  }

  renderCallback() {
    this.sub('src', async (newSrc) => {
      if (!newSrc) return;
      let resp = await fetch(newSrc);
      let mdText = await resp.text();
      if (mdText) {
        // @ts-expect-error
        let md2html = (await import('jsda-kit/iso/md2html.js')).md2html;
        let html = await md2html(mdText);
        this.insertAdjacentHTML('afterbegin', html);
        this.init();
      }
    });
    this.init();

    this.sub('currentChapter', (newChapter) => {
      if (!newChapter) return;
      let currentNavElement = this.ref.navItems.querySelector(`a[href$="#${newChapter}"]`);
      if (currentNavElement) {
        this.markCurrent(currentNavElement.parentElement);
      }
    });
  }

  destroyCallback() {
    this.intersectionObserver.disconnect();
  }

}

TuiArticle.template = template;
TuiArticle.bindAttributes({
  src: 'src',
});

TuiArticle.reg('tui-article');

export default TuiArticle;