import { motion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1];

export const COLOR_TINT = {
  primary: {
    bg: "bg-primary-soft",
    text: "text-primary",
    border: "border-primary/20",
    grad: "from-primary via-primary to-accent",
  },
  accent: {
    bg: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent/20",
    grad: "from-accent via-accent to-primary",
  },
  success: {
    bg: "bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)]",
    text: "text-success",
    border: "border-[color:color-mix(in_oklab,var(--success)_30%,transparent)]",
    grad: "from-success via-success to-primary",
  },
  warning: {
    bg: "bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)]",
    text: "text-warning",
    border: "border-[color:color-mix(in_oklab,var(--warning)_30%,transparent)]",
    grad: "from-warning via-warning to-accent",
  },
};

/* ── Eyebrow Label ── */
export function Eyebrow({ children, className = "" }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle ${className}`}>
      {children}
    </div>
  );
}

/* ── Section Title ── */
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

/* ── Scroll-Reveal Section Wrapper ── */
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

/* ── Floating Background Orbs ── */
export function MeshOrbs({ variant = "default" }) {
  if (variant === "hero") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="mesh-orb absolute -top-32 left-[15%] h-[500px] w-[500px] rounded-full bg-primary-soft opacity-50 blur-[140px]" />
        <div className="mesh-orb-2 absolute -top-20 right-[5%] h-[400px] w-[400px] rounded-full bg-accent-soft opacity-40 blur-[120px]" />
        <div className="mesh-orb-3 absolute top-[300px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary-soft opacity-30 blur-[100px]" />
        <div className="animated-grid absolute inset-0 h-[600px]" />
      </div>
    );
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="mesh-orb absolute -top-20 left-[20%] h-[360px] w-[360px] rounded-full bg-primary-soft opacity-40 blur-[120px]" />
      <div className="mesh-orb-2 absolute -bottom-16 right-[10%] h-[280px] w-[280px] rounded-full bg-accent-soft opacity-30 blur-[100px]" />
    </div>
  );
}

/* ── Glass Card ── */
export function GlassCard({ children, className = "", hover = true }) {
  return (
    <div
      className={`glass-card rounded-2xl ${hover ? "hover-glow" : ""} transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Stat Block ── */
export function StatBlock({ value, label, sub, className = "" }) {
  return (
    <div className={`rounded-xl border border-border bg-elevated/70 px-4 py-3.5 backdrop-blur ${className}`}>
      <div className="font-display text-[22px] font-bold leading-none tracking-tight text-text sm:text-[24px]">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        {label}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted">{sub}</div>}
    </div>
  );
}

/* ── Section Divider ── */
export function SectionDivider() {
  return <div className="section-divider mx-auto w-full max-w-[1320px]" aria-hidden />;
}

/* ── Skill Tag ── */
export function SkillTag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors duration-200 hover:border-border-strong">
      {children}
    </span>
  );
}
