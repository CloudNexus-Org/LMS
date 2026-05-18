import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import useScrollThreshold from '@/hooks/useScrollThreshold';
import { scrollToTop } from '@/utils/scroll';

const REVEAL_THRESHOLD = 320;

export default function BackToTop() {
  const isVisible = useScrollThreshold(REVEAL_THRESHOLD);

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
          className="group fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-border bg-elevated/85 text-text shadow-[var(--shadow-card)] backdrop-blur-xl transition-colors duration-200 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-accent/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
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
