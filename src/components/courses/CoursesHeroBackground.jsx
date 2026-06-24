import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Cloud,
  Code2,
  GraduationCap,
  Layers3,
  Sparkles,
} from 'lucide-react';
import {
  heroFadeBottom,
  heroFadeTop,
  pageBg,
} from '@/styles/theme';

const EASE = [0.16, 1, 0.3, 1];

const FLOATING_ICONS = [
  { Icon: BookOpen, x: '8%', y: '18%', size: 28, duration: 9, delay: 0 },
  { Icon: Cloud, x: '82%', y: '12%', size: 32, duration: 11, delay: 1.2 },
  { Icon: Code2, x: '72%', y: '55%', size: 24, duration: 10, delay: 0.6 },
  { Icon: GraduationCap, x: '14%', y: '62%', size: 26, duration: 12, delay: 2 },
  { Icon: Brain, x: '48%', y: '8%', size: 22, duration: 13, delay: 1.8 },
  { Icon: Layers3, x: '90%', y: '38%', size: 20, duration: 8, delay: 0.4 },
  { Icon: Sparkles, x: '28%', y: '42%', size: 18, duration: 7, delay: 2.4 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${6 + (i * 5.2) % 88}%`,
  top: `${10 + (i * 7.3) % 75}%`,
  size: 2 + (i % 3),
  duration: 4 + (i % 5),
  delay: i * 0.35,
}));

export default function CoursesHeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div className={`absolute inset-0 ${pageBg}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04]" />
      <div className={`absolute inset-0 ${heroFadeTop}`} />

      {/* Animated mesh orbs */}
      <motion.div
        className="mesh-orb absolute -top-32 left-[12%] h-[520px] w-[520px] rounded-full bg-primary-soft opacity-45 blur-[140px]"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 40, 10, 0], y: [0, -25, 15, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="mesh-orb-2 absolute -top-16 right-[4%] h-[420px] w-[420px] rounded-full bg-accent-soft opacity-35 blur-[120px]"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="mesh-orb-3 absolute top-[45%] left-[55%] h-[280px] w-[280px] rounded-full bg-primary-soft opacity-25 blur-[100px]"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 25, -15, 0], y: [0, -20, 10, 0] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Sweeping light beam */}
      <div className="courses-hero-beam" />

      {/* Radial pulse ring */}
      <div className="courses-hero-pulse" />

      {/* Blueprint grid */}
      <div className="animated-grid absolute inset-0 h-full opacity-80" />
      <div className="blueprint-grid absolute inset-0 opacity-[0.12]" />

      {/* Floating course-themed icons */}
      {!shouldReduceMotion &&
        FLOATING_ICONS.map(({ Icon, x, y, size, duration, delay }) => (
          <motion.div
            key={`${x}-${y}`}
            className="absolute text-primary/20 dark:text-primary/25"
            style={{ left: x, top: y }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.12, 0.28, 0.12],
              rotate: [0, 6, -4, 0],
            }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        ))}

      {/* Particle dots */}
      {!shouldReduceMotion &&
        PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-primary/30"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ opacity: [0.15, 0.55, 0.15], scale: [1, 1.6, 1] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}

      {/* Bottom fade into page */}
      <div className={`absolute inset-x-0 bottom-0 h-24 ${heroFadeBottom}`} />
    </div>
  );
}

export { EASE as COURSES_HERO_EASE };
