import { motion } from "framer-motion";
import { authItemMotion } from "./authMotion";

export default function AuthPrimaryButton({
  children,
  type = "submit",
  disabled = false,
  delay = 0,
  compact = false,
}) {
  return (
    <motion.button
      {...authItemMotion(delay)}
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={`
        flex
        w-full
        ${compact ? "h-11 text-[13px]" : "h-12 text-[14px]"}
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-primary
        font-semibold
        text-white
        shadow-[0_4px_16px_-6px_var(--primary)]
        transition-colors
        duration-200
        hover:bg-primary-hover
        hover:shadow-[0_6px_18px_-6px_var(--primary)]
        disabled:cursor-not-allowed
        disabled:opacity-60
        dark:shadow-[0_4px_16px_-6px_rgba(91,140,255,0.35)]
        dark:hover:shadow-[0_6px_18px_-6px_rgba(91,140,255,0.4)]
      `}
    >
      {children}
    </motion.button>
  );
}
