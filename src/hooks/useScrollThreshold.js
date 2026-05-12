import { useEffect, useState } from "react";

/**
 * Returns `true` once the window has been scrolled past `threshold` pixels.
 * Uses a passive scroll listener and updates only on state changes.
 *
 * @param {number} [threshold=0]
 * @returns {boolean}
 */
export default function useScrollThreshold(threshold = 0) {
  const [isPast, setIsPast] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > threshold;
  });

  useEffect(() => {
    const onScroll = () => setIsPast(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isPast;
}
