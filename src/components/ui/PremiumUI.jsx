import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export function Eyebrow({ children, className = "" }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, gradient = false }) {
  return (
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 font-display text-[24px] font-bold tracking-[-0.01em] text-text md:text-[30px]">
        {gradient ? <span className="animated-gradient-text">{title}</span> : title}
      </h2>
      {sub && (
        <p className="mt-2 max-w-[640px] text-[14.5px] leading-7 text-muted">{sub}</p>
      )}
    </div>
  );
}

export function RevealSection({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionDivider() {
  return <div className="section-divider mx-auto w-full max-w-[1320px]" aria-hidden />;
}
