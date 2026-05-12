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
} from "lucide-react";
import { tracks } from "../../data/tracks";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Container from "../ui/Container";
import Button from "../ui/Button";

const EASE = [0.16, 1, 0.3, 1];

const COLOR_TINT = {
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

function TrackListCard({ track, index }) {
  const accent = COLOR_TINT[track.color] || COLOR_TINT.primary;
  const Icon = track.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.03 }}
      className="h-full"
    >
      <Link
        to={`/tracks/${track.id}`}
        aria-label={`Open ${track.name} track`}
        className="group/track relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-elevated shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-elevated)] focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div
          aria-hidden
          className={`h-1.5 w-full bg-gradient-to-r ${accent.grad}`}
        />

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}
            >
              <Icon size={16} aria-hidden />
            </span>
            {track.badge ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-warning">
                <Sparkles size={9} className="text-warning" aria-hidden />
                {track.badge}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 font-display text-[18px] font-extrabold leading-tight tracking-tight text-text">
            {track.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted">
            {track.tagline}
          </p>

          {/* Meta row */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} aria-hidden />
              {track.durationWeeks} wks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={12} aria-hidden />
              {track.curriculum.length} courses
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} aria-hidden />
              {track.nextCohort.split(",")[1]?.trim() || track.nextCohort}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp size={12} className="text-success" aria-hidden />
              {track.salary}
            </span>
          </div>

          {/* Skills row */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {track.skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-bg/60 px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Footer */}
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
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} aria-hidden />
                <span className="font-semibold text-text">
                  {track.enrolled}
                </span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted transition-colors duration-200 group-hover/track:text-primary">
              Explore
              <ArrowUpRight
                size={12}
                strokeWidth={2.2}
                aria-hidden
                className="transition-transform duration-200 group-hover/track:translate-x-0.5 group-hover/track:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TracksListPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tracks.filter((t) => {
      if (q) {
        const haystack = [
          t.name,
          t.tagline,
          t.longDescription,
          ...(t.skills || []),
        ]
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
        list = [...list].sort(
          (a, b) => parseEnrolled(b.enrolled) - parseEnrolled(a.enrolled)
        );
        break;
      case "salary":
        list = [...list].sort(
          (a, b) => parseSalary(b.salary) - parseSalary(a.salary)
        );
        break;
      default:
        break;
    }
    return list;
  }, [query, level, sort]);

  const totalLearners = tracks.reduce(
    (acc, t) => acc + parseEnrolled(t.enrolled),
    0
  );

  const clearAll = () => {
    setQuery("");
    setLevel("all");
    setSort("featured");
  };

  const isFiltered = query.trim() !== "" || level !== "all" || sort !== "featured";

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <main id="main" className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden pt-[88px] pb-10 md:pt-[112px] md:pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[660px] -translate-x-1/2 rounded-full bg-primary-soft opacity-60 blur-[150px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] blueprint-grid opacity-40"
          />

          <Container size="lg">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft size={13} aria-hidden />
              Back to home
            </Link>

            <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  <Sparkles size={11} aria-hidden />
                  All career tracks
                </div>
                <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-text sm:text-[44px] md:text-[52px]">
                  Become a{" "}
                  <span className="text-primary">senior engineer</span> —
                  faster.
                </h1>
                <p className="mt-4 max-w-[640px] text-[15px] leading-7 text-muted md:text-[16.5px]">
                  Pick the career you want. Get a mentor-led curriculum,
                  capstone projects, and warm intros to companies hiring at
                  staff-engineer level.
                </p>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-3 self-end rounded-2xl border border-border bg-elevated/70 p-4 backdrop-blur md:min-w-[340px]">
                <div>
                  <div className="font-display text-[20px] font-bold tracking-tight text-text">
                    {tracks.length}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Tracks
                  </div>
                </div>
                <div className="border-l border-border pl-3">
                  <div className="font-display text-[20px] font-bold tracking-tight text-text">
                    {(totalLearners / 1000).toFixed(1)}k+
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Enrolled
                  </div>
                </div>
                <div className="border-l border-border pl-3">
                  <div className="font-display text-[20px] font-bold tracking-tight text-success">
                    98%
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Job-ready
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* TOOLBAR */}
        <div className="sticky top-[68px] z-30 border-y border-border bg-bg/85 backdrop-blur-xl">
          <Container size="lg">
            <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-4">
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
                  className="h-10 w-full rounded-lg border border-border bg-elevated pl-9 pr-9 text-[13.5px] text-text placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    className={`h-8 whitespace-nowrap rounded-md px-3 text-[12.5px] font-medium transition-colors ${
                      level === l.value
                        ? "bg-primary text-white"
                        : "text-muted hover:text-text"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

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
                  className="h-10 rounded-lg border border-border bg-elevated px-3 text-[13px] font-medium text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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

        {/* RESULTS */}
        <section className="relative py-8 md:py-10">
          <Container size="lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">
                Showing{" "}
                <span className="font-semibold text-text">
                  {filtered.length}
                </span>{" "}
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
              <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-elevated/40 px-6 py-16 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg text-muted">
                  <Search size={18} aria-hidden />
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
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-4 py-2 text-[13px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {filtered.map((t, i) => (
                  <TrackListCard key={t.id} track={t} index={i} />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* CTA */}
        <section className="relative py-10 md:py-14">
          <Container size="lg">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-elevated px-6 py-10 shadow-[var(--shadow-card)] md:px-12 md:py-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary-soft opacity-60 blur-[110px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-16 h-[260px] w-[260px] rounded-full bg-accent-soft opacity-50 blur-[110px]"
              />
              <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
                    Not sure which track?
                  </div>
                  <h2 className="mt-2 font-display text-[24px] font-bold tracking-[-0.01em] text-text md:text-[30px]">
                    Take a 2-minute career quiz.
                  </h2>
                  <p className="mt-3 max-w-[560px] text-[14.5px] leading-7 text-muted">
                    Answer a few questions about your background and goals,
                    we&rsquo;ll recommend the best track for you.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    to="/signup"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Start the quiz
                  </Button>
                  <Button to="/#contact" variant="outline" size="lg">
                    Talk to us
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
