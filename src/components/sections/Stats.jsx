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
      className={`
        relative flex flex-col items-start
        px-8 py-10
        text-left
        ${!isLast ? "xl:border-r xl:border-border/50" : ""}
      `}
    >
      {/* TOP ACCENT LINE */}
      <div className="mb-6 h-[3px] w-14 rounded-full bg-primary" />


      <div className="flex items-center gap-4">
  {/* ICON */}
  <Icon
    size={35}
    className="text-primary"
    strokeWidth={2}
    aria-hidden
  />

  {/* NUMBER */}
  <div
    className="
      font-display
      text-[36px]
      font-bold
      leading-none
      tracking-[-0.04em]
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
</div>

      {/* TITLE */}
      <div
        className="
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