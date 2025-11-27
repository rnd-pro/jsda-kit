import Symbiote from '@symbiotejs/symbiote';
import template from './template.js';

const visibleHElements = new Set();
const reactOnTags = ['H1', 'H2', 'H3'];

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
    this.ref.navMark.style.opacity = 1;
  }

  /**
   * 
   * @param { Element } navTarget 
   */
  onIntersection(navTarget) {
    if (this.$.currentChapter) return;
    let navItems = [...this.ref.navItems.children];
    let targetNavItem = navItems[0];
    if (window.scrollY > 20) {
      targetNavItem = navItems.find((navItem) => {
        return navItem.$.hElement === navTarget;
      });
    }
    targetNavItem && this.markCurrent(targetNavItem);
  }

  /**
   * 
   * @param { String } headingId 
   */
  onChapter(headingId) {
    this.$.currentChapter = headingId;
    this.currentChapterTimeout && window.clearTimeout(this.currentChapterTimeout);
    this.currentChapterTimeout = window.setTimeout(() => {
      this.$.currentChapter = '';
    }, 1500);
  }

  init() {
    let articleElements = [...this.children, ...this.querySelectorAll('li')];
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tui-fade-in');
          reactOnTags.includes(entry.target.tagName) && visibleHElements.add(entry.target);
          this.onScroll();
        } else {
          entry.target.classList.remove('tui-fade-in');
          visibleHElements.delete(entry.target);
        }
      });
      }, {}
    );

    articleElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });

    let headingElements = this.querySelectorAll(reactOnTags.join(','));
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
          this.onChapter(headingId);
        },
      });
    });
    this.$.mdNav = mdNav;
  }

  intersectedH = null;
  onScroll() {
    let newDetection = [...visibleHElements].pop();
    if (newDetection !== this.intersectedH) {
      this.intersectedH = newDetection;
      this.onIntersection(this.intersectedH);
    }
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

    window.setTimeout(() => {
      let chapter = window.location.hash.replace('#', '');
      if (chapter) {
        this.onChapter(chapter);
        let navTarget = this.querySelector(`#${chapter}`);
        navTarget?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.onScroll();
      }
    }, 100);
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