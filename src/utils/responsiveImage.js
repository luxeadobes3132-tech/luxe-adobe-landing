import manifest from '../data/imageDerivatives.manifest.json';

/** Percent-encode paths for HTML `src` / `srcset` (filenames may contain spaces). */
export function encodeAssetUrl(url) {
  if (!url) return url;
  return encodeURI(url);
}

function buildWebpSrcSet(webp) {
  return webp.map((x) => `${encodeAssetUrl(x.href)} ${x.w}w`).join(', ');
}

/**
 * @param {string} publicSrc e.g. `/images/home/destinations/wayanad/wayanad-misty-hills.jpg`
 * @param {string} [sizes='100vw'] passed to `<source sizes>` (and `<img sizes>` if used)
 * @returns {{ webpSrcSet?: string, sizes?: string, fallbackSrc: string }}
 */
export function getOptimizedSrcAt(publicSrc, targetW = 768) {
  const entry = manifest[publicSrc];
  const webp = entry?.webp;
  if (!webp?.length) return encodeAssetUrl(publicSrc);
  const sorted = [...webp].sort((a, b) => a.w - b.w);
  const href = sorted.find((x) => x.w >= targetW)?.href ?? sorted[sorted.length - 1].href;
  return encodeAssetUrl(href);
}

export function getResponsiveImageAttrs(publicSrc, sizes = '100vw') {
  const entry = manifest[publicSrc];
  const webp = entry?.webp;
  if (!webp?.length) {
    const encoded = encodeAssetUrl(publicSrc);
    return { fallbackSrc: encoded, imgSrc: encoded, webpSrcSet: undefined, sizes: undefined };
  }
  const webpSrcSet = buildWebpSrcSet(webp);
  const imgSrc = getOptimizedSrcAt(publicSrc, 768);
  return {
    webpSrcSet,
    sizes,
    /** Original path (OG, share cards). */
    fallbackSrc: encodeAssetUrl(publicSrc),
    /** Sized derivative for <img src> — avoids downloading multi‑MB originals on first paint. */
    imgSrc,
  };
}

/** Best single URL for preload / poster / og when you only want one file. */
export function getDefaultOptimizedSrc(publicSrc) {
  return getOptimizedSrcAt(publicSrc, 1200);
}

/** LCP preload: responsive srcset + a safe default href. */
export function getLcpPreloadAttrs(publicSrc, sizes = '100vw') {
  const entry = manifest[publicSrc];
  const webp = entry?.webp;
  if (!webp?.length) {
    const encoded = encodeAssetUrl(publicSrc);
    return { href: encoded, imageSrcSet: undefined, imageSizes: undefined };
  }
  return {
    href: getOptimizedSrcAt(publicSrc, 768),
    imageSrcSet: buildWebpSrcSet(webp),
    imageSizes: sizes,
  };
}

/** Indices to mount for a crossfading carousel (current + neighbors). */
export function carouselNeighborIndices(current, total) {
  if (total <= 1) return [0];
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;
  return [...new Set([prev, current, next])];
}
