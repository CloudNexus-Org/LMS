import { Outlet } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import HeroLight from "@/assets/hero-section/custom_light_bg.png";
import HeroDark from "@/assets/hero-section/custom_dark_bg.png";

export default function AuthLayout() {
  const isDarkTheme = useIsDarkTheme();
  const heroBackground = isDarkTheme ? HeroDark : HeroLight;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-bg text-text transition-colors duration-300">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={heroBackground}
          alt=""
          className="h-full w-full object-cover object-center transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/75 to-bg/95 dark:from-transparent dark:via-bg/5 dark:to-bg/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="mesh-orb absolute -top-28 left-[8%] h-[320px] w-[320px] rounded-full bg-primary/10 blur-[130px] sm:h-[440px] sm:w-[440px] dark:bg-primary/12" />
        <div className="mesh-orb-2 absolute -top-16 right-[6%] h-[280px] w-[280px] rounded-full bg-primary/8 blur-[110px] sm:h-[380px] sm:w-[380px] dark:bg-primary/10" />
        <div className="mesh-orb-3 absolute bottom-[8%] left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-accent-soft opacity-30 blur-[100px] sm:h-[300px] sm:w-[300px] dark:opacity-35" />
      </div>

      <div
        aria-hidden
        className="auth-dot-cluster pointer-events-none absolute left-4 top-20 -z-10 h-20 w-24 opacity-25 sm:left-10 sm:top-24 sm:h-24 sm:w-28 dark:opacity-25"
      />
      <div
        aria-hidden
        className="auth-dot-cluster pointer-events-none absolute bottom-24 right-4 -z-10 h-16 w-24 opacity-20 sm:bottom-28 sm:right-14 sm:h-20 sm:w-32 dark:opacity-20"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 blueprint-grid opacity-10 dark:opacity-[0.07]"
      />

      <div
        aria-hidden
        className="
          auth-orb-pulse
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[400px]
          w-[400px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary/6
          blur-[110px]
          sm:h-[560px]
          sm:w-[560px]
          dark:bg-primary/10
        "
      />

      <div className="absolute right-3 top-3 z-30 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>

      <Outlet />
    </div>
  );
}
