import { useEffect, useRef, useState } from "react";

function getScrollRatio() {
  const scrollTop = window.scrollY;
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  const maxScroll = Math.max(0, scrollHeight - window.innerHeight);
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / maxScroll));
}

/** Scroll progress from 0 (top) to 1 (bottom). Updates on rAF for smooth tracking. */
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const latestRef = useRef(0);

  useEffect(() => {
    const commit = () => {
      rafRef.current = 0;
      const ratio = getScrollRatio();
      if (Math.abs(ratio - latestRef.current) > 0.0005) {
        latestRef.current = ratio;
        setProgress(ratio);
      }
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(commit);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    commit();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
}

export { getScrollRatio };
