import { prefersReducedMotion } from "./motion";

/**
 * Smooth-scroll to a given Y offset. Honors prefers-reduced-motion (jumps instantly).
 *
 * @param {number} [top=0]
 */
export function scrollToTop(top = 0) {
  if (typeof window === "undefined") return;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/**
 * Smooth-scroll to a CSS selector or DOM node, with an optional vertical offset
 * (useful when there's a sticky navbar). Honors prefers-reduced-motion.
 *
 * @param {string | Element} target   CSS selector (e.g. "#courses") or Element
 * @param {number} [offset=0]         pixels subtracted from the target's top
 * @returns {boolean}                 true if scrolled, false if target not found
 */
export function scrollToSection(target, offset = 0) {
  if (typeof window === "undefined") return false;
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return false;
  const top = Math.max(0, el.offsetTop - offset);
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  return true;
}
