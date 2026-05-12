import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  Users,
  GraduationCap,
  Star,
  Zap,
} from "lucide-react";

import Button from "../ui/Button";
import Container from "../ui/Container";
import HeroWhite from "../../assets/Herowhite.png";
import dashboardArt from "../../assets/hero-laptop.png";

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative isolate overflow-hidden
        bg-bg
        pt-[112px] pb-24
        md:pt-[140px] md:pb-32
      "
    >
      {/* BLUEPRINT GRID */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          blueprint-grid opacity-50
        "
      />

      {/* TOP GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          -top-24 left-1/2 -z-10
          h-[560px] w-[920px]
          -translate-x-1/2
          rounded-full
          bg-primary-soft
          blur-[150px]
          opacity-90
        "
      />

      {/* RIGHT GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          right-[-10%] top-[22%] -z-10
          h-[420px] w-[620px]
          rounded-full
          bg-accent-soft
          blur-[140px]
          opacity-80
        "
      />

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* ================= LEFT ================= */}
          <div className="relative z-20">
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-border
                bg-surface/80
                backdrop-blur-xl
                px-4 py-2
                text-[12px]
                font-semibold
                text-muted
                shadow-[var(--shadow-card)]
              "
            >
              <Sparkles size={14} className="text-primary" />
              Trusted by 12,000+ learners worldwide
            </motion.div>

            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
              className="
                hero-title
                mt-8
                max-w-[680px]
                text-text
                leading-[1.02]
              "
            >
              Find suitable courses from the{" "}
              <span className="gradient-text relative inline-block">
                best mentors
                <span
                  aria-hidden
                  className="
                    absolute -bottom-2 left-0
                    h-[10px] w-full
                    rounded-full
                    bg-primary-soft
                    blur-md
                  "
                />
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
              className="
                mt-7
                max-w-[570px]
                text-[17px]
                leading-8
                text-muted
              "
            >
              Cloud Nexus offers career-focused learning in cloud, AI, devops,
              and full-stack development taught by expert mentors.
            </motion.p>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-5"
            >
              <div
                className="
                  flex items-center gap-2.5
                  rounded-xl
                  border border-border
                  bg-surface/70
                  px-4 py-3
                  shadow-[var(--shadow-card)]
                  backdrop-blur
                "
              >
                <Star
                  size={16}
                  className="fill-primary text-primary"
                  aria-hidden
                />
                <div>
                  <div className="text-[14px] font-semibold text-text">
                    4.9/5 Rating
                  </div>
                  <div className="text-[12px] text-muted">2k+ reviews</div>
                </div>
              </div>

              <div
                className="
                  flex items-center gap-2.5
                  rounded-xl
                  border border-border
                  bg-surface/70
                  px-4 py-3
                  shadow-[var(--shadow-card)]
                  backdrop-blur
                "
              >
                <Zap size={16} className="text-primary" aria-hidden />
                <div>
                  <div className="text-[14px] font-semibold text-text">
                    Fast-track learning
                  </div>
                  <div className="text-[12px] text-muted">Job-ready skills</div>
                </div>
              </div>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                to="/signup"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Start free trial
              </Button>

              <Button
                to="/demo"
                variant="outline"
                size="lg"
                leftIcon={<PlayCircle size={18} />}
              >
                Watch demo
              </Button>
            </motion.div>
          </div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="relative hidden lg:block"
          >
            {/* MAIN IMAGE BOX */}
            <div
              className="
                relative aspect-[4/3] w-full overflow-hidden
                rounded-[32px]
                border border-border
                bg-elevated
                shadow-[var(--shadow-elevated)]
              "
            >
                <picture className="absolute inset-0 h-full w-full">
                  {/* Dark mode image */}
                  <source srcSet={dashboardArt} media="(prefers-color-scheme: dark)" />
                  {/* Light mode fallback (default) image */}
                  <img
                    src={HeroWhite}
                    alt="Cloud Nexus dashboard preview"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable="false"
                  />
                </picture>

              {/* subtle inner sheen */}
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_40%)]
                "
              />
            </div>

            {/* TOP CARD — pill on top-right corner of laptop */}
            <div
              className="
                absolute right-2 top-0
                z-20
                flex items-center gap-3
                rounded-full
                border border-border
                bg-elevated/95
                backdrop-blur-xl
                pl-2 pr-5 py-2
                shadow-[var(--shadow-elevated)]
                float-1
                sm:-right-8 sm:-top-3
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-success/15
                  text-success
                "
              >
                <Users size={18} aria-hidden />
              </div>

              <div className="min-w-0">
                <div className="whitespace-nowrap text-[13px] font-semibold text-text leading-tight">
                  Live mentor session
                </div>
                <div className="whitespace-nowrap text-[12px] text-muted leading-tight">
                  Today · 6:00 PM
                </div>
              </div>
            </div>

            {/* BOTTOM CARD — pill on bottom-left corner of laptop */}
            <div
              className="
                absolute -bottom-3 left-2
                z-20
                flex items-center gap-3
                rounded-full
                border border-border
                bg-elevated/95
                backdrop-blur-xl
                pl-2 pr-5 py-2
                shadow-[var(--shadow-elevated)]
                float-2
                sm:-bottom-4 sm:-left-4
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-success/15
                  text-success
                "
              >
                <GraduationCap size={18} aria-hidden />
              </div>

              <div className="min-w-0">
                <div className="whitespace-nowrap text-[13px] font-semibold text-text leading-tight">
                  Certificate earned
                </div>
                <div className="whitespace-nowrap text-[12px] text-muted leading-tight">
                  AWS Architect track
                </div>
              </div>
            </div>

            {/* FLOATING BLUR UNDER IMAGE */}
            <div
              aria-hidden
              className="
                pointer-events-none absolute
                -bottom-12 left-1/2 -z-10
                h-[220px] w-[75%]
                -translate-x-1/2
                rounded-full
                bg-primary-soft
                blur-[100px]
              "
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
