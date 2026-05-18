import { useEffect, useRef, useState } from "react";

export default function useSmartNavbar({
  threshold = 0,
  topGuard = 0,
  stopDelay = 200,
} = {}) {
  const [state, setState] = useState({
    isVisible: true,
    isScrolled: false,
  });
  
  const lastScrollY = useRef(0);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isScrolled = currentScrollY > threshold;
        const isAtTop = currentScrollY <= topGuard;
        
        // Determine scroll direction (allow 5px threshold to avoid jitter)
        const diff = currentScrollY - lastScrollY.current;
        const isScrollingUp = diff < -5;
        const isScrollingDown = diff > 5;

        setState((prev) => {
          let nextVisible = prev.isVisible;
          
          if (isAtTop) {
            nextVisible = true;
          } else if (isScrollingUp) {
            nextVisible = true;
          } else if (isScrollingDown) {
            nextVisible = false;
          }

          if (prev.isVisible === nextVisible && prev.isScrolled === isScrolled) {
            return prev;
          }
          return { isVisible: nextVisible, isScrolled };
        });

        // Only update lastScrollY if we moved significantly to avoid tiny jitters changing state
        if (Math.abs(diff) > 5) {
          lastScrollY.current = currentScrollY;
        }

        // Set timeout to show navbar when scrolling stops
        if (!isAtTop) {
          timeoutRef.current = window.setTimeout(() => {
            setState((prev) => {
              if (prev.isVisible && prev.isScrolled === isScrolled) return prev;
              return { isVisible: true, isScrolled };
            });
          }, stopDelay);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [threshold, topGuard, stopDelay]);

  return state;
}
