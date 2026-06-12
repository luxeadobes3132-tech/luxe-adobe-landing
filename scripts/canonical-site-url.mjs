/** Canonical production origin — always www. Used by build-time SEO generators. */
export const CANONICAL_ORIGIN = 'https://www.luxeadobes.com';

/** Resolve site URL, forcing www.luxeadobes.com regardless of VITE_SITE_URL env typos. */
export function getCanonicalSiteUrl() {
  const raw = (process.env.VITE_SITE_URL || CANONICAL_ORIGIN).replace(/\/$/, '');
  try {
    const url = new URL(raw);
    if (url.hostname === 'luxeadobes.com') {
      url.hostname = 'www.luxeadobes.com';
    }
    return url.origin;
  } catch {
    return CANONICAL_ORIGIN;
  }
}
