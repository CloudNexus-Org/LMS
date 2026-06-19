import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authItemMotion } from "./authMotion";

export default function SocialAuthButtons({ delay = 0.05 }) {
  return (
    <motion.div
      {...authItemMotion(delay)}
      className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 min-[420px]:gap-3"
    >
      <button
        type="button"
        className="
          auth-social-btn
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-border
          bg-bg
          text-[13px]
          font-medium
          text-text
          transition-all
          duration-200
          hover:border-primary/40
          hover:bg-primary-soft
          dark:border-white/10
          dark:bg-elevated
          dark:hover:border-primary/40
        "
      >
        <FaGoogle className="text-[15px]" />
        Google
      </button>

      <button
        type="button"
        className="
          auth-social-btn
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-border
          bg-bg
          text-[13px]
          font-medium
          text-text
          transition-all
          duration-200
          hover:border-primary/40
          hover:bg-primary-soft
          dark:border-white/10
          dark:bg-elevated
          dark:hover:border-primary/40
        "
      >
        <FaGithub className="text-[15px]" />
        Github
      </button>
    </motion.div>
  );
}
