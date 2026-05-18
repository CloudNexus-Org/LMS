import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { prefersReducedMotion } from '@/utils/motion';

export default function CountUp({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  delay = 0,
  threshold = 0.35,
}) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin: "0px 0px -8% 0px",
  });
  const startedRef = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const format = (v) =>
      `${prefix}${Number(v).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (prefersReducedMotion()) {
      node.textContent = format(end);
      return;
    }

    if (!isIntersecting || startedRef.current) return;
    startedRef.current = true;

    const controls = animate(0, end, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
  }, [isIntersecting, end, suffix, prefix, decimals, duration, delay, elementRef]);

  return (
    <span ref={elementRef} aria-label={`${prefix}${end}${suffix}`}>
      {prefix}0{suffix}
    </span>
  );
}
