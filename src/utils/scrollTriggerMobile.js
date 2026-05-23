import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isCoarsePointer } from './coarsePointer';

/**
 * Brewingleads-style mobile scroll: native touch scroll + normalizeScroll for pinned sections.
 * Desktop keeps Lenis; normalizeScroll is off when not on a coarse pointer.
 */
export function syncScrollTriggerMobileConfig() {
  const mobile = isCoarsePointer();
  ScrollTrigger.config({ ignoreMobileResize: mobile });
  ScrollTrigger.normalizeScroll(mobile);
}

let resizeTimer = 0;

export function bindScrollTriggerMobileResize() {
  if (typeof window === 'undefined') return () => {};

  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncScrollTriggerMobileConfig();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener('resize', onResize);
  return () => {
    window.removeEventListener('resize', onResize);
    window.clearTimeout(resizeTimer);
  };
}
