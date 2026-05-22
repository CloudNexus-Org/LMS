import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  Star,
  Users,
  Clock,
  GraduationCap,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Award,
  BookOpen,
  Target,
  Shield,
} from "lucide-react";
import { tracks } from "@/data/tracks";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1];

const COLOR_TINT = {
  primary: {
    bg: "bg-primary-soft",
    text: "text-primary",
    grad: "from-primary via-primary to-accent",
    glow: "shadow-[0_0_20px_-4px_var(--primary)]",
  },
  accent: {
    bg: "bg-accent-soft",
    text: "text-accent",
    grad: "from-accent via-accent to-primary",
    glow: "shadow-[0_0_20px_-4px_var(--accent)]",
  },
  success: {
    bg: "bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)]",
    text: "text-success",
    grad: "from-success via-success to-primary",
    glow: "shadow-[0_0_20px_-4px_var(--success)]",
  },
  warning: {
    bg: "bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)]",
    text: "text-warning",
    grad: "from-warning via-warning to-accent",
    glow: "shadow-[0_0_20px_-4px_var(--warning)]",
  },
};

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "popular", label: "Most enrolled" },
  { value: "salary", label: "Highest salary" },
];

function parseEnrolled(v) {
  if (!v) return 0;
  const m = String(v).replace(/,/g, "").trim().match(/^([\d.]+)([kKmM]?)\+?$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (m[2].toLowerCase() === "k") return n * 1_000;
  if (m[2].toLowerCase() === "m") return n * 1_000_000;
  return n;
}

function parseSalary(v) {
  if (!v) return 0;
  const m = String(v).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/* ── Floating Orb Background ── */
function BackgroundEffects() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Mesh gradient orbs */}
      <div className="mesh-orb absolute -top-32 left-[15%] h-[500px] w-[500px] rounded-full bg-primary-soft opacity-50 blur-[140px]" />
      <div className="mesh-orb-2 absolute -top-20 right-[5%] h-[400px] w-[400px] rounded-full bg-accent-soft opacity-40 blur-[120px]" />
      <div className="mesh-orb-3 absolute top-[300px] left-[50%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary-soft opacity-30 blur-[100px]" />
      {/* Animated grid overlay */}
      <div className="animated-grid absolute inset-0 h-[600px]" />
    </div>
  );
}

/* ── Stat Pill (hero area) ── */
function HeroStat({ value, label, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="text-center"
    >
      <div className={`font-display text-[24px] font-bold tracking-tight ${accent || "text-text"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
        {label}
      </div>
    </motion.div>
  );
}

/* ── Premium Track Card ── */
function TrackListCard({ track, index }) {
  const accent = COLOR_TINT[track.color] || COLOR_TINT.primary;
  const Icon = track.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      className="h-full"
    >
      <Link
        to={`/tracks/${track.id}`}
        aria-label={`Open ${track.name} track`}
        className="group/track card-shimmer relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-elevated shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[var(--shadow-elevated)] focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {/* Gradient accent bar */}
        <div
          aria-hidden
          className={`h-1 w-full bg-gradient-to-r ${accent.grad} opacity-80 transition-opacity duration-300 group-hover/track:opacity-100`}
        />

        {/* Hover glow overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/track:opacity-100"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), color-mix(in srgb, var(--primary), transparent 92%), transparent 40%)`,
          }}
        />

        <div className="relative flex flex-1 flex-col p-5">
          {/* Header: Icon + Badge */}
          <div className="flex items-start justify-between">
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text} transition-transform duration-300 group-hover/track:scale-110`}
            >
              <Icon size={18} aria-hidden />
            </span>
            {track.badge ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-warning ring-1 ring-warning/20">
                <Sparkles size={9} className="text-warning" aria-hidden />
                {track.badge}
              </span>
            ) : null}
          </div>

          {/* Title & Tagline */}
          <h3 className="mt-4 font-display text-[18px] font-extrabold leading-tight tracking-tight text-text">
            {track.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.6] text-muted">
            {track.tagline}
          </p>

          {/* Meta Grid */}
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

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {track.skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-bg/60 px-2 py-0.5 text-[11px] font-medium text-muted transition-colors duration-200 group-hover/track:border-border-strong"
              >
                {s}
              </span>
            ))}
            {track.skills.length > 4 && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium text-subtle">
                +{track.skills.length - 4}
              </span>
            )}
          </div>

          {/* Divider + Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[12px] text-muted">
            <div className="flex items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Star
                  size={12}
                  className="fill-current text-primary"
                  aria-hidden
                />
                <span className="font-semibold text-text">{track.rating}</span>
              </span>
              <span aria-hidden className="text-border">·</span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} aria-hidden />
                <span className="font-semibold text-text">{track.enrolled}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted transition-all duration-300 group-hover/track:gap-2 group-hover/track:text-primary">
              Explore
              <ArrowUpRight
                size={12}
                strokeWidth={2.2}
                aria-hidden
                className="transition-transform duration-300 group-hover/track:translate-x-0.5 group-hover/track:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Trust Badge ── */
function TrustBadge({ icon: IconComp, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated/70 px-3.5 py-2 text-[12px] font-medium text-muted backdrop-blur"
    >
      <IconComp size={13} className="text-primary" aria-hidden />
      {text}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function TracksListPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tracks.filter((t) => {
      if (q) {
        const haystack = [t.name, t.tagline, t.longDescription, ...(t.skills || [])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (level !== "all" && !(t.level || "").toLowerCase().includes(level.toLowerCase()))
        return false;
      return true;
    });

    switch (sort) {
      case "rating":
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        list = [...list].sort((a, b) => parseEnrolled(b.enrolled) - parseEnrolled(a.enrolled));
        break;
      case "salary":
        list = [...list].sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
        break;
      default:
        break;
    }
    return list;
  }, [query, level, sort]);

  const totalLearners = tracks.reduce((acc, t) => acc + parseEnrolled(t.enrolled), 0);
  const clearAll = () => { setQuery(""); setLevel("all"); setSort("featured"); };
  const isFiltered = query.trim() !== "" || level !== "all" || sort !== "featured";

  return (
    <div className="min-h-screen bg-bg text-text">
      <main id="main" className="relative">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden pt-[88px] pb-14 md:pt-[112px] md:pb-20">
          <BackgroundEffects />

          <Container size="lg">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
              >
                <ArrowLeft size={13} aria-hidden />
                Back to home
              </Link>
            </motion.div>

            <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
              {/* Left: Headline */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  <Sparkles size={11} aria-hidden />
                  All career tracks
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  className="mt-5 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.025em] text-text sm:text-[44px] md:text-[54px]"
                >
                  Become a{" "}
                  <span className="animated-gradient-text">senior engineer</span>{" "}
                  faster.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="mt-5 max-w-[640px] text-[15.5px] leading-[1.7] text-muted md:text-[17px]"
                >
                  Pick the career you want. Get a mentor-led curriculum,
                  capstone projects, and warm intros to companies hiring at
                  staff-engineer level.
                </motion.p>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 flex flex-wrap gap-2.5"
                >
                  <TrustBadge icon={Shield} text="7-day free trial" delay={0.22} />
                  <TrustBadge icon={Award} text="Certificate included" delay={0.26} />
                  <TrustBadge icon={Target} text="98% job-ready rate" delay={0.3} />
                </motion.div>
              </div>

              {/* Right: Stats panel */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
                className="glass-card grid grid-cols-3 gap-5 self-end rounded-2xl p-5 md:min-w-[360px]"
              >
                <HeroStat value={tracks.length} label="Tracks" delay={0.16} />
                <div className="border-l border-border pl-4">
                  <HeroStat
                    value={`${(totalLearners / 1000).toFixed(1)}k+`}
                    label="Enrolled"
                    delay={0.2}
                  />
                </div>
                <div className="border-l border-border pl-4">
                  <HeroStat value="98%" label="Job-ready" accent="text-success" delay={0.24} />
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ═══════════════ STICKY TOOLBAR ═══════════════ */}
        <div className="border-y border-border bg-bg">
          <Container size="lg">
            <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={15}
                  aria-hidden
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by track, skill, or technology…"
                  aria-label="Search tracks"
                  className="h-10 w-full rounded-lg border border-border bg-elevated pl-9 pr-9 text-[13.5px] text-text placeholder:text-subtle transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-text"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Level filter */}
              <div
                role="group"
                aria-label="Level"
                className="inline-flex items-center rounded-lg border border-border bg-elevated p-1"
              >
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setLevel(l.value)}
                    aria-pressed={level === l.value}
                    className={`h-8 whitespace-nowrap rounded-md px-3 text-[12.5px] font-medium transition-all duration-200 ${
                      level === l.value
                        ? "bg-primary text-white shadow-[0_2px_8px_-2px_var(--primary)]"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="track-sort"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-subtle"
                >
                  Sort
                </label>
                <select
                  id="track-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-elevated px-3 text-[13px] font-medium text-text transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Container>
        </div>

        {/* ═══════════════ RESULTS ═══════════════ */}
        <section className="relative py-10 md:py-14">
          {/* Subtle radial glow behind cards */}
          <div aria-hidden className="radial-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px]" />

          <Container size="lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">
                Showing{" "}
                <span className="font-semibold text-text">{filtered.length}</span>{" "}
                of{" "}
                <span className="font-semibold text-text">{tracks.length}</span>{" "}
                tracks
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  <X size={12} aria-hidden />
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-elevated/40 px-6 py-16 text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg text-muted">
                  <Search size={20} aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-[18px] font-semibold tracking-tight text-text">
                  No tracks match your filters
                </h3>
                <p className="mt-2 max-w-[420px] text-[13.5px] leading-6 text-muted">
                  Try a broader search or reset your filters.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-4 py-2.5 text-[13px] font-semibold text-text transition-all duration-200 hover:border-primary hover:text-primary"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((t, i) => (
                  <TrackListCard key={t.id} track={t} index={i} />
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
    </div>
  );
}
