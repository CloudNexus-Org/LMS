import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition hover:border-primary hover:text-primary ${className}`}
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
