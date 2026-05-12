import { motion } from "framer-motion";
import { Compass, Users, Award, Star } from "lucide-react";

import { stats } from "../../data/stats";
import SectionShell from "../ui/SectionShell";
import Container from "../ui/Container";
import CountUp from "../ui/CountUp";

const ICONS = {
  Compass,
  Users,
  Award,
  Star,
};

function StatItem({ value, suffix, decimals, label, icon, delay = 0 }) {
  const Icon = ICONS[icon] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        group relative overflow-hidden
        rounded-[28px]
        border border-border/60
        bg-gradient-to-b from-white/[0.06] to-white/[0.02]
        dark:from-white/[0.04] dark:to-white/[0.01]
        backdrop-blur-xl
        px-5 py-7
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        transition-all duration-500
        hover:border-primary/30
        hover:shadow-[0_20px_60px_rgba(47,91,255,0.15)]
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute -right-10 -top-10
          h-28 w-28 rounded-full
          bg-[#2F5BFF]/10 blur-3xl
          transition-all duration-500
          group-hover:bg-[#2F5BFF]/20
        "
      />

      {/* TOP LINE */}
      <div
        className="
          absolute left-0 top-0 h-[3px] w-full
          bg-gradient-to-r from-[#2F5BFF]/0 via-[#2F5BFF] to-[#2F5BFF]/0
          opacity-70
        "
      />

      {/* ICON */}
      <div
        className="
          relative mx-auto flex h-[58px] w-[58px]
          items-center justify-center
          rounded-2xl
          bg-[#2F5BFF]
          shadow-[0_10px_25px_rgba(47,91,255,0.35)]
        "
      >
        {/* SMALL INNER SHAPE */}
        <div
          className="
            absolute inset-[8px]
            rounded-xl
            border border-white/15
          "
        />

        <Icon
          size={18}
          className="relative z-10 text-white"
          strokeWidth={2.2}
          aria-hidden
        />
      </div>

      {/* NUMBER */}
      <div
        className="
          mt-5 text-center
          font-display text-[32px]
          font-semibold tracking-tight
          text-text
        "
      >
        <CountUp
          end={value}
          duration={1.6}
          decimals={decimals || 0}
          delay={delay}
        />
        {suffix ? <span>{suffix}</span> : null}
      </div>

      {/* LABEL */}
      <p
        className="
          mt-2 text-center
          text-[13px] font-medium
          tracking-wide text-muted
        "
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <SectionShell size="sm">
      <Container>
        <div
          className="
            mx-auto grid max-w-6xl
            grid-cols-1 gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stats.map((s, i) => (
            <StatItem
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals || 0}
              label={s.label}
              icon={s.icon}
              delay={i * 0.08}
            />
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}