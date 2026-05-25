// import { motion, useReducedMotion } from "framer-motion";
// import {
//   ArrowRight,
//   PlayCircle,
// } from "lucide-react";

// import Button from "../ui/Button";
// import Container from "../ui/Container";
// import HeroBackdrop from "./HeroBackdrop";
// import HeroLight from "../../assets/hero-section/herolandinglight.png";
// import HeroDark from "../../assets/hero-section/herolandingdark.png";
// import useIsDarkTheme from "../../hooks/useIsDarkTheme";

// const EASE = [0.16, 1, 0.3, 1];

// export default function Hero() {
//   const isDarkTheme = useIsDarkTheme();
//   const shouldReduceMotion = useReducedMotion();

//   const heroBackground = isDarkTheme ? HeroDark : HeroLight;

//   const headlineColor = isDarkTheme
//     ? "text-white"
//     : "text-slate-950";

//   const bodyColor = isDarkTheme
//     ? "text-white/78"
//     : "text-slate-700";

//   const badgeClass = isDarkTheme
//     ? "border border-white/10 bg-[#0f172a] text-white"
//     : "border border-slate-200 bg-white text-slate-900";

//   const fadeUp = (y = 10, delay = 0, duration = 0.55) => ({
//     initial: shouldReduceMotion
//       ? { opacity: 1, y: 0 }
//       : { opacity: 0, y },

//     animate: {
//       opacity: 1,
//       y: 0,
//     },

//     transition: shouldReduceMotion
//       ? { duration: 0 }
//       : {
//           duration,
//           ease: EASE,
//           delay,
//         },
//   });

//   return (
//     <HeroBackdrop
//       id="home"
//       imageSrc={heroBackground}
//       positions={{
//         desktop: "right 0%",
//         tablet: "right bottom",
//         mobile: "center bottom",
//       }}
//       fits={{
//         desktop: "cover",
//         tablet: "contain",
//         mobile: "contain",
//       }}
//       imageLayerClassName="
//         absolute
//         inset-x-0
//         top-[64%]
//         bottom-0
//         -z-10
//         pointer-events-none

//         min-[375px]:top-[60%]
//         sm:top-[58%]
//         md:top-[60%]
//         lg:top-[58px]
//       "
//     >
//       <Container>
//         {/* HERO SECTION */}
//         <div
//           className="
//             grid
//             min-h-[760px]
//             items-start

//             pt-24
//             pb-[250px]

//             min-[375px]:min-h-[790px]
//             min-[375px]:pb-[280px]

//             sm:min-h-[860px]
//             sm:pt-28
//             sm:pb-[340px]

//             md:min-h-[920px]
//             md:pt-32
//             md:pb-[390px]

//             lg:min-h-screen
//             lg:items-center
//             lg:py-28
//           "
//         >
//           {/* LEFT CONTENT */}
//           <div
//             className="
//               relative
//               z-10

//               w-full
//               max-w-[520px]
//               md:max-w-[560px]
//               lg:max-w-[760px]

//               px-0
//               sm:px-2
//               md:px-0
//             "
//           >
//             {/* BADGE */}
//             <motion.div
//               {...fadeUp(10, 0.05)}
//               className={`
//                 ${badgeClass}

//                 inline-flex
//                 items-center
//                 gap-2

//                 rounded-[5px]

//                 px-3
//                 py-2

//                 text-[10px]
//                 sm:text-[12px]

//                 font-bold

//                 backdrop-blur-md
//               `}
//             >
//               Trusted by 12,000+ learners worldwide
//             </motion.div>

//             {/* HEADING */}
//             <motion.h1
//               {...fadeUp(2, 0.12, 0.6)}
//               className={`
//                 hero-title
//                 mt-6
//                 sm:mt-8

//                 max-w-[720px]

//                 font-extrabold

//                 leading-[1]
//                 sm:leading-[0.98]
//                 lg:leading-[0.95]

//                 tracking-[-0.025em]
//                 sm:tracking-[-0.035em]
//                 lg:tracking-[-0.04em]

//                 text-[clamp(34px,10.5vw,42px)]
//                 sm:text-[54px]
//                 md:text-[64px]
//                 lg:text-[88px]

//                 ${headlineColor}
//               `}
//             >
//               Find suitable courses from the{" "}
//               <span
//                 className={
//                   isDarkTheme
//                     ? "text-[#7fb0ff]"
//                     : "text-[#215cff]"
//                 }
//               >
//                 best mentors
//               </span>
//             </motion.h1>

//             {/* DESCRIPTION */}
//             <motion.p
//               {...fadeUp(10, 0.22)}
//               className={`
//                 mt-5
//                 sm:mt-7

//                 max-w-[580px]

//                 text-[15px]
//                 leading-6

//                 sm:text-[18px]
//                 sm:leading-8

//                 md:text-[20px]
//                 lg:text-[23px]

//                 ${bodyColor}
//               `}
//             >
//               Cloud Nexus offers career-focused learning in
//               cloud, AI, devops, and full-stack development
//               taught by expert mentors.
//             </motion.p>

//             {/* BUTTONS */}
//             <motion.div
//               {...fadeUp(10, 0.38)}
//               className="
//                 mt-8
//                 sm:mt-10

//                 flex
//                 flex-col
//                 gap-3

//                 min-[375px]:flex-row
//                 min-[375px]:items-center

//                 sm:gap-4
//               "
//             >
//               {/* START BUTTON */}
//               <Button
//                 to="/signup"
//                 size="lg"
//                 className="
//                   relative
//                   inline-flex

//                   h-[46px]
//                   w-full
//                   min-w-0

//                   min-[375px]:w-auto
//                   min-[375px]:min-w-[152px]
//                   min-[375px]:flex-1

//                   sm:min-w-[170px]
//                   sm:flex-none

//                   lg:h-[48px]
//                   lg:min-w-[180px]

//                   items-center
//                   justify-center

//                   border
//                   border-[#d9e2ff]
//                   dark:border-white/10

//                   bg-white
//                   dark:bg-primary

//                   px-6

//                   text-[14px]
//                   font-semibold
//                   [&>span]:text-[13px]
//                   sm:[&>span]:text-[14px]
//                   lg:[&>span]:text-base

//                   text-black
//                   dark:text-white

//                   overflow-hidden
//                   rounded-none

//                   shadow-[0_10px_30px_rgba(37,99,235,0.08)]
//                   dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

//                   transition-all
//                   duration-300

//                   hover:-translate-y-[2px]
//                   hover:border-[#2563ff]/40

//                   [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
//                 "
//                 rightIcon={<ArrowRight size={18} />}
//               >
//                 Start free trial
//               </Button>

//               {/* DEMO BUTTON */}
//               <Button
//                 to="/demo"
//                 size="lg"
//                 className="
//                   relative
//                   inline-flex

//                   h-[46px]
//                   w-full
//                   min-w-0

//                   min-[375px]:w-auto
//                   min-[375px]:min-w-[152px]
//                   min-[375px]:flex-1

//                   sm:min-w-[170px]
//                   sm:flex-none

//                   lg:h-[48px]
//                   lg:min-w-[180px]

//                   items-center
//                   justify-center

//                   overflow-hidden
//                   rounded-none

//                   border
//                   border-[#d9e2ff]
//                   dark:border-white/10

//                   bg-white
//                   dark:bg-[#030303]

//                   px-6

//                   text-[14px]
//                   font-semibold
//                   [&>span]:text-[13px]
//                   sm:[&>span]:text-[14px]
//                   lg:[&>span]:text-base

//                   text-black
//                   dark:text-white

//                   shadow-[0_10px_30px_rgba(37,99,235,0.08)]
//                   dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

//                   transition-all
//                   duration-300

//                   hover:-translate-y-[2px]
                  

//                   [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
//                 "
//                 leftIcon={<PlayCircle size={18} />}
//               >
//                 Watch demo
//               </Button>
//             </motion.div>
//           </div>
//         </div>
//       </Container>
//     </HeroBackdrop>
//   );
// }


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

  const badgeClass = isDarkTheme
    ? "border border-white/10 bg-[#0f172a] text-white"
    : "border border-slate-200 bg-white text-slate-900";

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
            min-h-screen
            items-center

            pt-28
            pb-16

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
              className={`
                ${badgeClass}

                inline-flex
                items-center
                gap-2

                rounded-[5px]

                px-3
                py-2

                text-[10px]
                sm:text-[12px]

                font-bold

                backdrop-blur-md
              `}
            >
              Trusted by 12,000+ learners worldwide
            </motion.div>

            {/* HEADING */}
            <motion.h1
              {...fadeUp(2, 0.12, 0.6)}
              className={`
                hero-title
                mt-6
                sm:mt-8

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
                mt-5
                sm:mt-7

                max-w-[580px]

                text-[15px]
                leading-7

                sm:text-[23px]
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

                  bg-white
                  dark:bg-primary

                  px-6

                  text-[14px]
                  font-semibold

                  text-black
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
                  border-[#d9e2ff]
                  dark:border-white/10

                  bg-white
                  dark:bg-[#030303]

                  px-6

                  text-[14px]
                  font-semibold

                  text-black
                  dark:text-white

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  

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