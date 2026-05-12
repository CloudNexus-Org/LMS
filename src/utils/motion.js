/**
 * Returns true when the user has requested reduced motion via OS settings.
 * Safe in non-browser environments (SSR-safe).
 *
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
