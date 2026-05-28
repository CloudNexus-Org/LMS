import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
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

  const headlineColor = isDarkTheme
    ? "text-white"
    : "text-slate-950";

  const bodyColor = isDarkTheme
    ? "text-white/78"
    : "text-slate-700";

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
      positions={{
        desktop: "right 0%",
        tablet: "80% 0%",
        mobile: "center 0%",
      }}
    >
      <Container>
        {/* HERO SECTION */}
        <div
          className="
    grid
    sm:min-h-screen
    items-center

    pt-32
    pb-10

    sm:pt-32
    sm:pb-20

    md:py-24
    lg:py-28
  "
        >

          {/* LEFT CONTENT */}
          <div
            className="
              relative
              z-10

              w-full
              max-w-[620px]
              xl:max-w-[700px]

              px-1
              sm:px-4
              md:px-0
            "
          >
            {/* BADGE */}
            <motion.div
              {...fadeUp(10, 0.05)}
              className="
    inline-flex
    items-center
    gap-3.5

    rounded-full
    border
    border-slate-200/60
    dark:border-white/10

    bg-white/90
dark:bg-[#0f172a]/80
    backdrop-blur-md

    pl-2
    pr-5
    py-1.5

    text-[14px]
    sm:text-[15px]
    font-semibold
    tracking-wide
    
    shadow-[0_4px_12px_rgba(0,0,0,0.03)]
  "
            >
              {/* OVERLAPPING AVATARS CONTAINER */}
              <div className="flex flex-row-reverse justify-end -space-x-3 space-x-reverse shrink-0">
                <img
                  className="h-8 w-8 rounded-full border-2 border-white dark:border-[#0f172a] object-cover bg-slate-100 ring-1 ring-black/5"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 4"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white dark:border-[#0f172a] object-cover bg-slate-100 ring-1 ring-black/5"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 3"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white dark:border-[#0f172a] object-cover bg-slate-100 ring-1 ring-black/5"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 2"
                />
                <img
                  className="h-8 w-8 rounded-full border-2 border-white dark:border-[#0f172a] object-cover bg-slate-100 ring-1 ring-black/5"
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 1"
                />
              </div>
              <span className="text-slate-900 dark:text-white font-semibold whitespace-nowrap">
                Trusted by <span className="text-blue-600 dark:text-[#7fb0ff] font-bold">12,000+</span> learners
              </span>
            </motion.div>

            {/* HEADING */}
            <motion.h1
              {...fadeUp(2, 0.12, 0.6)}
              className={`
                hero-title
                mt-12
                sm:mt-12

                
                  mb-12
                  sm:mb-12

                max-w-[720px]

                font-extrabold

                leading-[0.95]

                tracking-[-0.04em]

                text-[42px]
                sm:text-[58px]
                md:text-[72px]
                lg:text-[88px]

                ${headlineColor}
              `}
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
              className={`
                  mt-12
                  sm:mt-12
                
                  mb-12
                  sm:mb-12
                
                  max-w-[580px]
                
                  text-[17px]
                  leading-7
                
                  sm:text-[21px]
                  sm:leading-8
                
                  ${bodyColor}
                `}
            >
              Cloud Nexus offers career-focused learning in
              cloud, AI, devops, and full-stack development
              taught by expert mentors.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              {...fadeUp(10, 0.38)}
              className="
                mt-8
                sm:mt-10

                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-center
              "
            >
              {/* START BUTTON */}
              <Button
                to="/signup"
                size="lg"
                className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[180px]

                  items-center
                  justify-center

                  border
                  border-[#d9e2ff]
                  dark:border-white/10

                  bg-primary
                  dark:bg-primary

                  px-6

                  text-[18px]
                  font-semibold

                  text-white
                  dark:text-white

                  overflow-hidden
                  rounded-none

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-[#2563ff]/40

                  [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
                "
                rightIcon={<ArrowRight size={18} />}
              >
                Start free trial
              </Button>

              {/* DEMO BUTTON */}
              
<Button
  to="/demo"
  size="lg"
  className="
    !bg-black
    dark:!bg-[#030303]

    !text-white
    dark:!text-white

    !border-black
    dark:!border-white/10

    relative
    inline-flex

    h-[48px]
    w-full
    sm:w-auto
    min-w-[180px]

    items-center
    justify-center

    overflow-hidden
    rounded-none

    border

    px-6

    text-[14px]
    font-semibold

    shadow-[0_10px_30px_rgba(0,0,0,0.25)]
    dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]

    transition-all
    duration-300

    hover:-translate-y-[2px]
    hover:!bg-[#111111]
    dark:hover:!bg-[#0a0a0a]

    hover:border-white/20

    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
  "
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
