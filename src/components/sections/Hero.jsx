import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import Button from "../ui/Button";
import Container from "../ui/Container";
import HeroBackdrop from "./HeroBackdrop";
import HeroLight from "../../assets/hero-section/herolandinglight.png";
import HeroDark from "../../assets/hero-section/herolandingdark.png";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const isDarkTheme = useIsDarkTheme();
  const shouldReduceMotion = useReducedMotion();

  const heroBackground = isDarkTheme ? HeroDark : HeroLight;

  const primaryBlue = "#215cff";

  const headlineColor = isDarkTheme
    ? "text-white"
    : "text-slate-950";

  const bodyColor = isDarkTheme
    ? "text-white/78"
    : "text-slate-700";

  // CLEAN SIMPLE SURFACES
  const mutedCardClass = isDarkTheme
    ? "border border-white/10 bg-[#0f172a] text-white"
    : "border border-slate-200 bg-white text-slate-900";

  const badgeClass = isDarkTheme
    ? "border border-white/10 bg-[#0f172a] text-white"
    : "border border-slate-200 bg-white text-slate-900";

  const secondaryButtonClass = isDarkTheme
    ? "!border !border-white/10 !bg-[#0f172a] !text-white hover:!bg-[#172033]"
    : "!border !border-slate-200 !bg-white !text-slate-900 hover:!bg-slate-50";

  const fadeUp = (y = 10, delay = 0, duration = 0.55) => ({
    initial: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y },

    animate: {
      opacity: 1,
      y: 0,
    },

    transition: shouldReduceMotion
      ? { duration: 0 }
      : {
        duration,
        ease: EASE,
        delay,
      },
  });

  return (
    <HeroBackdrop
      id="home"
      imageSrc={heroBackground}
      positions={{ desktop: "right 0%", tablet: "80% 0%", mobile: "center 0%" }}
    >
      <Container>
        {/* CLEAN HERO LAYOUT */}
        <div className="grid min-h-screen items-center py-24 md:py-28">
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-10 max-w-[760px]">
            {/* BADGE */}
            <motion.div
              {...fadeUp(10, 0.05)}
              className={`${badgeClass} inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold`}
            >
              <Sparkles
                size={14}
                style={{ color: primaryBlue }}
              />

              Trusted by 12,000+ learners worldwide
            </motion.div>

            {/* HEADING */}
            <motion.h1
              {...fadeUp(12, 0.12, 0.6)}
              className={`hero-title mt-8 max-w-[760px] leading-[1.02] tracking-[-0.03em] ${headlineColor}`}
            >
              Find suitable courses from the{" "}
              <span
                className={
                  isDarkTheme
                    ? "text-[#7fb0ff]"
                    : "text-[#215cff]"
                }
              >
                best mentors
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              {...fadeUp(10, 0.22)}
              className={`mt-7 max-w-[580px] text-[17px] leading-8 ${bodyColor}`}
            >
              Cloud Nexus offers career-focused learning in
              cloud, AI, devops, and full-stack development
              taught by expert mentors.
            </motion.p>

            {/* STATS */}
            <motion.div
              {...fadeUp(10, 0.3)}
              className="mt-14 flex flex-wrap items-center gap-5"
            >
              {/* CARD 1 */}
              <div
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${mutedCardClass}`}
              >
                <Star
                  size={16}
                  style={{
                    fill: primaryBlue,
                    color: primaryBlue,
                  }}
                  aria-hidden
                />

                <div>
                  <div className="text-[14px] font-semibold">
                    4.9/5 Rating
                  </div>

                  <div
                    className={
                      isDarkTheme
                        ? "text-[12px] text-white/60"
                        : "text-[12px] text-slate-500"
                    }
                  >
                    2k+ reviews
                  </div>
                </div>
              </div>

              {/* CARD 2 */}
              <div
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${mutedCardClass}`}
              >
                <Zap
                  size={16}
                  style={{ color: primaryBlue }}
                  aria-hidden
                />

                <div>
                  <div className="text-[14px] font-semibold">
                    Fast-track learning
                  </div>

                  <div
                    className={
                      isDarkTheme
                        ? "text-[12px] text-white/60"
                        : "text-[12px] text-slate-500"
                    }
                  >
                    Job-ready skills
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              {...fadeUp(10, 0.38)}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                to="/signup"
                size="lg"
                className="!rounded-[18px] !bg-[#215cff] !px-7 !text-white hover:!bg-[#4b79ff]"
                rightIcon={<ArrowRight size={18} />}
              >
                Start free trial
              </Button>

              <Button
                to="/demo"
                variant="ghost"
                size="lg"
                className={`!rounded-[18px] !px-7 ${secondaryButtonClass}`}
                leftIcon={<PlayCircle size={18} />}
              >
                Watch demo
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </HeroBackdrop>
  );
}