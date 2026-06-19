import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { authCardMotion, authItemMotion } from "./authMotion";

export default function AuthShell({ title, subtitle, children, compact = false }) {
  return (
    <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-3 py-4 sm:px-6 sm:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[70px] auth-orb-pulse sm:h-[320px] sm:w-[320px] sm:blur-[80px] dark:bg-primary/12"
      />

      <motion.div
        {...authCardMotion}
        className="
          relative
          w-full
          max-w-[440px]
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-elevated
          shadow-elevated
          sm:rounded-2xl
          dark:border-white/10
          dark:bg-surface/80
          dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)]
          dark:backdrop-blur-xl
        "
      >
        <Link
          to="/"
          aria-label="Close and return home"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-bg
            text-muted
            transition-all
            duration-200
            hover:border-primary
            hover:text-primary
            sm:right-4
            sm:top-4
            sm:h-9
            sm:w-9
            dark:border-white/10
            dark:bg-elevated/80
            dark:backdrop-blur-sm
          "
        >
          <X size={14} className="sm:hidden" />
          <X size={15} className="hidden sm:block" />
        </Link>

        <div
          className={`
            flex
            flex-col
            items-center
            justify-center
            border-b
            border-border
            px-4
            pt-5
            text-center
            sm:px-6
            dark:border-white/10
            ${compact ? "pb-3.5 sm:pb-4" : "pb-4 sm:pb-5"}
            ${subtitle ? "min-h-[92px] sm:min-h-[96px]" : "min-h-[72px] sm:min-h-[80px]"}
          `}
        >
          <motion.div
            {...authItemMotion(0.1)}
            className="w-full max-w-[320px] px-8 sm:max-w-none sm:px-0"
          >
            <h1
              className={`font-bold tracking-tight text-text ${compact ? "text-[18px] sm:text-[20px]" : "text-[20px] sm:text-[22px]"}`}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className={`mx-auto text-muted ${compact ? "mt-1 max-w-[260px] text-[10px] leading-4 sm:max-w-none sm:text-[11px]" : "mt-1.5 max-w-[280px] text-[11px] leading-4 sm:max-w-none sm:text-[13px] sm:leading-5"}`}
              >
                {subtitle}
              </p>
            ) : null}
          </motion.div>
        </div>

        <div
          className={`px-4 sm:px-7 ${compact ? "py-3.5 sm:py-4" : "py-5 sm:py-7"}`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
