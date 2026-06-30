import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { getScrollRatio } from "@/hooks/useScrollProgress";
import { scrollToTop } from "@/utils/scroll";

const REVEAL_THRESHOLD = 120;
const SIZE = 48;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const progressCircleRef = useRef(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const paint = () => {
      rafRef.current = 0;

      const ratio = getScrollRatio();
      const shouldShow = window.scrollY > REVEAL_THRESHOLD;

      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = String(
          CIRCUMFERENCE * (1 - ratio)
        );
      }

      if (shouldShow !== visibleRef.current) {
        visibleRef.current = shouldShow;
        setIsVisible(shouldShow);
      }
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(paint);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    paint();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isVisible || !progressCircleRef.current) return;
    const ratio = getScrollRatio();
    progressCircleRef.current.style.strokeDashoffset = String(
      CIRCUMFERENCE * (1 - ratio)
    );
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={() => scrollToTop()}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-bg/90 text-primary shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors duration-200 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:bottom-8 sm:right-8"
        >
          <svg
            aria-hidden
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="pointer-events-none absolute inset-0 -rotate-90"
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-border/80"
            />
            <circle
              ref={progressCircleRef}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              className="text-primary"
              style={{ willChange: "stroke-dashoffset" }}
            />
          </svg>

          <ArrowUp
            size={18}
            strokeWidth={2.4}
            className="relative transition-transform duration-200 group-hover:-translate-y-0.5"
          />
          <span className="sr-only">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
