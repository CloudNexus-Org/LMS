import { motion } from "framer-motion";
import { useRef } from "react";
import { Compass, Users, Award, Star } from "lucide-react";

import { stats } from '@/data/stats';
import SectionShell from "@/app/layouts/SectionShell";
import Container from '@/components/ui/Container';
import CountUp from '@/components/ui/CountUp';

const ICONS = {
  Compass,
  Users,
  Award,
  Star,
};

function StatItem({
  value,
  suffix,
  decimals,
  label,
  icon,
  delay = 0,
  isLast,
}) {
  const Icon = ICONS[icon] || Users;
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", `50%`);
    el.style.setProperty("--y", `50%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ['--x']: '50%', ['--y']: '50%' }}
      className={`stat-card relative flex flex-col items-start px-8 py-10 text-left ${!isLast ? "xl:border-r xl:border-border/50" : ""}`}
    >
      {/* TOP ACCENT LINE */}
      <div className="mb-6 h-[3px] stat-accent rounded-full bg-primary" />


      <div className="flex items-center gap-4">
  {/* ICON */}
  <Icon
    size={35}
    className="stat-icon text-primary"
    strokeWidth={2}
    aria-hidden
  />

  {/* NUMBER */}
  <div
    className="
      stat-label
      font-display
      text-[36px]
      font-bold
      leading-none
      tracking-[-0.04em]
      text-text
    "
  >
    <span className="stat-number">
      <CountUp
        end={value}
        duration={1.6}
        decimals={decimals || 0}
        delay={delay}
      />
    </span>
    {suffix ? <span>{suffix}</span> : null}
  </div>
</div>

      {/* TITLE */}
      <div
        className="
          stat-meta
          mt-4
          text-[24px]
          font-normal
          leading-tight
          text-text
        "
      >
        {label}
      </div>


    </motion.div>
  );
}

export default function Stats() {
  return (
    <SectionShell size="sm">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            mx-auto
            max-w-7xl
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-0
              md:grid-cols-2
              xl:grid-cols-4
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
                isLast={i === stats.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </SectionShell>
  );
}