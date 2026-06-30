import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useRequireStudentAuth from "@/hooks/useRequireStudentAuth";
import { ROUTES } from "@/protectedroutes/routePaths";
import {
  Calendar,
  Check,
  Clock,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { formatTrackPrice } from "@/data/tracks";

const EASE = [0.16, 1, 0.3, 1];

export const TRACK_COLOR_TINT = {
  primary: {
    bg: "bg-primary-soft",
    text: "text-primary",
    grad: "from-primary via-primary to-accent",
  },
  accent: {
    bg: "bg-accent-soft",
    text: "text-accent",
    grad: "from-accent via-accent to-primary",
  },
  success: {
    bg: "bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)]",
    text: "text-success",
    grad: "from-success via-success to-primary",
  },
  warning: {
    bg: "bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)]",
    text: "text-warning",
    grad: "from-warning via-warning to-accent",
  },
};

export default function TrackCatalogCard({
  track,
  index = 0,
  variant = "catalog",
  selected = false,
  onSelect,
}) {
  const navigate = useNavigate();
  const requireStudentAuth = useRequireStudentAuth();
  const paymentUrl = `${ROUTES.student.payment}?track=${track.id}`;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireStudentAuth(paymentUrl)) return;
    navigate(paymentUrl);
  };

  const accent = TRACK_COLOR_TINT[track.color] || TRACK_COLOR_TINT.primary;
  const Icon = track.icon;
  const isPayment = variant === "payment";

  const cardBody = (
    <>
      <div
        aria-hidden
        className={`h-1 w-full bg-gradient-to-r ${accent.grad} opacity-80 transition-opacity duration-300 group-hover/track:opacity-100`}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/track:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), color-mix(in srgb, var(--primary), transparent 92%), transparent 40%)",
        }}
      />

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text} transition-transform duration-300 group-hover/track:scale-110`}
          >
            <Icon size={18} aria-hidden />
          </span>
          {track.badge ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-warning ring-1 ring-warning/20">
              <Sparkles size={9} className="text-warning" aria-hidden />
              {track.badge}
            </span>
          ) : null}
        </div>

        {isPayment ? (
          <div className="mt-4">
            <h3 className="font-display text-[18px] font-extrabold leading-tight tracking-tight text-text">
              {track.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-muted">
              {track.tagline}
            </p>
          </div>
        ) : (
          <Link
            to={`/tracks/${track.id}`}
            className="mt-4 block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <h3 className="font-display text-[18px] font-extrabold leading-tight tracking-tight text-text transition-colors group-hover/track:text-primary">
              {track.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-muted">
              {track.tagline}
            </p>
          </Link>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2.5 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} className="text-subtle" aria-hidden />
            {track.durationWeeks} weeks
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={12} className="text-subtle" aria-hidden />
            {track.curriculum.length} courses
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} className="text-subtle" aria-hidden />
            {track.nextCohort.split(",")[1]?.trim() || track.nextCohort}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp size={12} className="text-success" aria-hidden />
            <span className="font-semibold text-success">{track.salary}</span>
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {track.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-lg border border-border bg-bg/60 px-2 py-0.5 text-[11px] font-medium text-muted transition-colors duration-200 group-hover/track:border-border-strong"
            >
              {s}
            </span>
          ))}
          {track.skills.length > 4 ? (
            <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium text-subtle">
              +{track.skills.length - 4}
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <div>
          {track.originalPrice > track.price ? (
            <p className="text-[12px] text-subtle line-through">
              {formatTrackPrice(track.originalPrice)}
            </p>
          ) : null}
          <p className="font-display text-[18px] font-bold text-text">
            {formatTrackPrice(track.price)}
          </p>
        </div>

        {isPayment ? (
          <span
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
              selected
                ? "bg-primary text-white shadow-[0_2px_8px_-2px_var(--primary)]"
                : "border border-border bg-bg text-muted"
            }`}
          >
            {selected ? (
              <>
                <Check size={14} aria-hidden />
                Selected
              </>
            ) : (
              "Select"
            )}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleBuyNow}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_8px_-2px_var(--primary)] transition-all duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Buy Now
          </button>
        )}
      </div>
    </>
  );

  const shellClass = `group/track card-shimmer relative flex h-full flex-col overflow-hidden rounded-2xl border bg-elevated shadow-[var(--shadow-card)] transition-all duration-300 ${
    isPayment && selected
      ? "border-primary ring-2 ring-primary/25"
      : "border-border hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[var(--shadow-elevated)]"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      className="h-full"
    >
      {isPayment ? (
        <button
          type="button"
          onClick={() => onSelect?.(track.id)}
          aria-pressed={selected}
          aria-label={`Select ${track.name} for checkout`}
          className={`${shellClass} w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
        >
          {cardBody}
        </button>
      ) : (
        <div className={shellClass}>{cardBody}</div>
      )}
    </motion.div>
  );
}
