import { motion } from "framer-motion";
import { authItemMotion } from "./authMotion";

export default function AuthDivider({ label = "Or", delay = 0.12 }) {
  return (
    <motion.div
      {...authItemMotion(delay)}
      className="flex items-center gap-3 py-0.5"
    >
      <div className="h-px flex-1 bg-border dark:bg-white/10" />
      <span className="text-[12px] text-subtle">{label}</span>
      <div className="h-px flex-1 bg-border dark:bg-white/10" />
    </motion.div>
  );
}
