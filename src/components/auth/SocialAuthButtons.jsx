import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authItemMotion } from "./authMotion";

/**
 * Social OAuth is not wired to the backend yet (no Google/GitHub endpoints in auth-service).
 * Buttons show a clear message so users are not left with a dead click.
 */
export default function SocialAuthButtons({ delay = 0.05 }) {
  const [notice, setNotice] = useState("");

  const handleSocial = (provider) => {
    setNotice(
      `${provider} sign-in is not configured for this environment. Please use your email and password.`
    );
  };

  return (
    <div className="space-y-2">
      <motion.div
        {...authItemMotion(delay)}
        className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 min-[420px]:gap-3"
      >
        <button
          type="button"
          onClick={() => handleSocial("Google")}
          className="
            auth-social-btn
            flex h-11 w-full items-center justify-center gap-2
            rounded-xl border border-border bg-bg
            text-[13px] font-medium text-text
            transition-all duration-200
            hover:border-primary/40 hover:bg-primary-soft
            dark:border-white/10 dark:bg-elevated dark:hover:border-primary/40
          "
          aria-label="Continue with Google"
        >
          <FaGoogle className="text-[15px]" />
          Google
        </button>

        <button
          type="button"
          onClick={() => handleSocial("GitHub")}
          className="
            auth-social-btn
            flex h-11 w-full items-center justify-center gap-2
            rounded-xl border border-border bg-bg
            text-[13px] font-medium text-text
            transition-all duration-200
            hover:border-primary/40 hover:bg-primary-soft
            dark:border-white/10 dark:bg-elevated dark:hover:border-primary/40
          "
          aria-label="Continue with GitHub"
        >
          <FaGithub className="text-[15px]" />
          Github
        </button>
      </motion.div>

      <AnimatePresence>
        {notice ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-center text-[12px] text-muted"
            role="status"
          >
            {notice}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
