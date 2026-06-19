import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import HeroBackdrop from "./HeroBackdrop";
import HeroLmsVisual from "./HeroLmsVisual";
import HeroLight from "../../assets/hero-section/custom_light_bg.png";
import HeroDark from "../../assets/hero-section/custom_dark_bg.png";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const EASE = [0.16, 1, 0.3, 1];

const AVATARS = [
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
];

export default function Hero() {
  const isDarkTheme = useIsDarkTheme();
  const shouldReduceMotion = useReducedMotion();

  const heroBackground = isDarkTheme ? HeroDark : HeroLight;

  const fadeUp = (y = 10, delay = 0, duration = 0.55) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { duration, ease: EASE, delay },
  });

  return (
    <HeroBackdrop
      id="home"
      imageSrc={heroBackground}
      className="bg-bg"
      positions={{
        desktop: "center center",
        tablet: "center center",
        mobile: "center center",
      }}
    >
      <Container size="shell">
        <div
          className="
            grid sm:min-h-screen items-center
            pt-32 pb-10 sm:pt-32 sm:pb-20
            md:py-24 lg:py-28
            lg:grid-cols-2
            lg:gap-6 xl:gap-8
          "
        >
          <div
            className="
              relative z-10 w-full max-w-[620px] xl:max-w-[700px]
              px-1 sm:px-4 md:px-0
              lg:max-w-[600px] lg:justify-self-start xl:max-w-[640px]
            "
          >
            {/* Badge */}
            <motion.div
              {...fadeUp(10, 0.05)}
              className="
                inline-flex items-center gap-3.5
                rounded-full border border-border
                bg-surface/90 backdrop-blur-md
                pl-2 pr-5 py-1.5
                text-[14px] sm:text-[15px] font-semibold tracking-wide
                shadow-[var(--shadow-card-value)]
              "
            >
              <div className="flex flex-row-reverse justify-end -space-x-3 space-x-reverse shrink-0">
                {AVATARS.map((src, i) => (
                  <img
                    key={src}
                    className="h-8 w-8 rounded-full border-2 border-surface object-cover bg-elevated ring-1 ring-border"
                    src={src}
                    alt={`Learner ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-text font-semibold whitespace-nowrap">
                Trusted by{" "}
                <span className="text-primary font-bold">12,000+</span> learners
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              {...fadeUp(2, 0.12, 0.6)}
              className="
                hero-title mt-12 mb-12 max-w-[720px]
                font-extrabold leading-[0.95] tracking-[-0.04em]
                text-[42px] sm:text-[58px] md:text-[72px] lg:text-[88px]
                text-text
              "
            >
              Find suitable courses from the{" "}
              <span className="text-primary">best mentors</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              {...fadeUp(10, 0.22)}
              className="
                mt-12 mb-12 max-w-[580px]
                text-[17px] leading-7
                sm:text-[21px] sm:leading-8
                text-muted
              "
            >
              Cloud Nexus offers career-focused learning in cloud, AI, devops,
              and full-stack development taught by expert mentors.
            </motion.p>

            {/* Buttons */}
            <motion.div
              {...fadeUp(10, 0.38)}
              className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button
                to="/signup"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                className="w-full sm:w-auto"
              >
                Start free trial
              </Button>

              <Button
                to="/demo"
                variant="secondary"
                size="lg"
                leftIcon={<PlayCircle size={18} />}
                className="w-full sm:w-auto"
              >
                Watch demo
              </Button>
            </motion.div>

            {/* Mobile LMS progress strip */}
            <motion.div
              {...fadeUp(10, 0.45)}
              className="mt-10 md:hidden rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-md shadow-[var(--shadow-card-value)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <BookOpen size={15} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-text">My Learning</p>
                    <p className="text-[10px] text-muted">3 courses in progress</p>
                  </div>
                </div>
                <motion.span
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="text-[13px] font-bold text-primary"
                >
                  68%
                </motion.span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-soft">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: shouldReduceMotion ? "68%" : "0%" }}
                  animate={{ width: "68%" }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 1.8, ease: EASE, delay: 0.6 }
                  }
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Cloud Basics ✓", "AWS VPC", "Kubernetes"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.35, ease: EASE }}
                    className={`
                      rounded-full border px-2.5 py-1 text-[10px] font-semibold
                      ${i === 0
                        ? "border-success/30 bg-success/10 text-success"
                        : i === 1
                          ? "border-primary/30 bg-primary-soft text-primary"
                          : "border-border bg-elevated text-muted"
                      }
                    `}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* LMS dashboard animation — desktop */}
          <motion.div
            {...fadeUp(24, 0.5, 0.8)}
            className="relative z-10 hidden w-full min-w-0 md:block"
          >
            <HeroLmsVisual />
          </motion.div>
        </div>
      </Container>
    </HeroBackdrop>
  );
}
