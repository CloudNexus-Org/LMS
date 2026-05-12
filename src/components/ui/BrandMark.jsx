import { Link, useLocation } from "react-router-dom";
import { Layers } from "lucide-react";
import { scrollToTop } from "../../utils/scroll";

const SIZES = {
  sm: {
    box: "h-7 w-7 rounded-lg shadow-[0_4px_12px_-4px_var(--primary)]",
    icon: 14,
    label: "text-[16px] sm:text-[18px]",
    gap: "gap-2.5",
  },
  md: {
    box: "h-9 w-9 rounded-lg shadow-[0_6px_18px_-6px_var(--primary)]",
    icon: 16,
    label: "text-[19px]",
    gap: "gap-2.5",
  },
};

/**
 * Brand logomark used in the Navbar (sm) and Footer (md).
 *
 * Clicking always lands you at the top of the home page:
 *   - if already on `/` → smooth-scroll to top (honors prefers-reduced-motion)
 *   - else              → React Router navigates to `/`, then ScrollToTop snaps
 *
 * @param {{
 *   logoText?: string,
 *   size?: "sm" | "md",
 *   className?: string,
 *   onNavigate?: () => void,   // optional extra side-effect (e.g. close mobile menu)
 * }} props
 */
export default function BrandMark({
  logoText = "CLOUD NEXUS",
  size = "sm",
  className = "",
  onNavigate,
}) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const s = SIZES[size] || SIZES.sm;

  const handleClick = (e) => {
    if (onNavigate) onNavigate();
    if (isHome) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <Link
      to="/"
      onClick={handleClick}
      aria-label="Go to home"
      className={`group/brand inline-flex items-center ${s.gap} ${className}`}
    >
      <span
        className={`relative flex items-center justify-center bg-gradient-to-br from-primary to-accent transition-transform duration-200 group-hover/brand:scale-105 ${s.box}`}
      >
        <Layers
          size={s.icon}
          className="text-white"
          strokeWidth={2.5}
          aria-hidden
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-tr from-white/20 via-transparent to-transparent"
        />
      </span>
      <span
        className={`font-extrabold tracking-[-0.02em] text-text ${s.label}`}
      >
        {logoText}
      </span>
    </Link>
  );
}
