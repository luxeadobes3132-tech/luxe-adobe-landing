import { PAGE_HEADER_IMAGES } from '../data/criticalHeroImages';
import { preloadImage, resolveOptimizedHeroUrl } from './imageCache';

/** LCP image for each main nav route (matches PageHeader variants). */
const ROUTE_LCP_IMAGES = {
  '/about': PAGE_HEADER_IMAGES.about,
  '/properties': PAGE_HEADER_IMAGES.properties,
  '/contact': PAGE_HEADER_IMAGES.contact,
};

const ROUTE_CHUNKS = {
  '/about': () => import('../pages/About'),
  '/properties': () => import('../pages/Properties'),
  '/contact': () => import('../pages/Contact'),
};

const prefetched = new Set();

/** Prefetch route JS + header LCP image on nav hover/focus (once per path). */
export function prefetchRoute(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/' || prefetched.has(path)) return;
  prefetched.add(path);

  const lcp = ROUTE_LCP_IMAGES[path];
  if (lcp) {
    preloadImage(resolveOptimizedHeroUrl(lcp), { priority: 'low' }).catch(() => {});
  }

  ROUTE_CHUNKS[path]?.();
}
