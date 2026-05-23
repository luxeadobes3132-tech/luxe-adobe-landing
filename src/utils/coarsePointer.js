/** Phones / tablets — touch-first, no hover fine pointer. */
export const COARSE_POINTER_MQ = '(hover: none) and (pointer: coarse)';

export function isCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(COARSE_POINTER_MQ).matches;
}
