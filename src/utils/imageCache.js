import { getAllCriticalHeroSources } from '../data/criticalHeroImages';
import { getOptimizedSrcAt } from './responsiveImage';

const SESSION_KEY = 'luxe-adobes:initial-load-v1';
const MIN_BOOT_MS = 3000;
const PRELOAD_WIDTH = 768;

/** @type {Map<string, Promise<HTMLImageElement>>} */
const cache = new Map();

export function isInitialLoadComplete() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markInitialLoadComplete() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode */
  }
}

export function resolveOptimizedHeroUrl(publicSrc) {
  return getOptimizedSrcAt(publicSrc, PRELOAD_WIDTH);
}

/**
 * Preload one URL into memory + HTTP cache. Returns the same promise for repeat calls.
 * @param {string} url
 * @param {{ priority?: 'high' | 'low' | 'auto' }} [options]
 */
export function preloadImage(url, options = {}) {
  if (!url) return Promise.reject(new Error('empty url'));
  const existing = cache.get(url);
  if (existing) return existing;

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    const priority = options.priority ?? 'low';
    if ('fetchPriority' in img) {
      img.fetchPriority = priority;
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });

  cache.set(url, promise);
  promise.catch(() => {
    cache.delete(url);
  });

  return promise;
}

export function getPreloadedImage(url) {
  return cache.get(url);
}

export function isImageCached(url) {
  const entry = cache.get(url);
  return Boolean(entry);
}

/** All optimized hero URLs used for first-visit bootstrap. */
export function getCriticalHeroUrls() {
  return getAllCriticalHeroSources().map((src) => resolveOptimizedHeroUrl(src));
}

/**
 * Preload every critical hero in parallel; failures do not block the splash.
 * @param {(ratio: number) => void} [onProgress] 0–1
 */
export async function preloadCriticalHeroes(onProgress) {
  const urls = getCriticalHeroUrls();
  if (!urls.length) {
    onProgress?.(1);
    return;
  }

  let completed = 0;
  const tick = () => {
    completed += 1;
    onProgress?.(completed / urls.length);
  };

  await Promise.all(
    urls.map((url, index) =>
      preloadImage(url, { priority: index === 0 ? 'high' : 'low' })
        .then(tick)
        .catch(tick)
    )
  );
}

/** First visit: preload heroes + main route chunks, minimum splash duration. */
export async function runInitialBootstrap(onProgress) {
  const start = Date.now();
  let imageRatio = 0;
  let tickInterval;

  const emit = () => {
    const timeRatio = Math.min(1, (Date.now() - start) / MIN_BOOT_MS);
    // Blend time + image load so the bar moves even when assets are cached
    const combined = Math.min(0.97, imageRatio * 0.65 + timeRatio * 0.35);
    onProgress?.(combined);
  };

  onProgress?.(0.04);
  tickInterval = setInterval(emit, 40);

  try {
    await Promise.all([
      new Promise((resolve) => {
        setTimeout(resolve, MIN_BOOT_MS);
      }),
      preloadCriticalHeroes((ratio) => {
        imageRatio = ratio;
        emit();
      }),
      Promise.all([
        import('../pages/About'),
        import('../pages/Properties'),
        import('../pages/Contact'),
      ]).catch(() => {}),
    ]);
    onProgress?.(1);
  } finally {
    clearInterval(tickInterval);
  }

  markInitialLoadComplete();
}
