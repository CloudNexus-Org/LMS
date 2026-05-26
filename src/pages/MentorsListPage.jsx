import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Star,
  Users,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";
import { mentors } from '@/data/mentors';


import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const EASE = [0.16, 1, 0.3, 1];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top rated" },
  { value: "learners", label: "Most learners" },
  { value: "experience", label: "Most experienced" },
];

const AVAILABILITY = [
  { value: "all", label: "All" },
  { value: "available", label: "Open this week" },
  { value: "waitlist", label: "Waitlist" },
];

function parseLearners(v) {
  if (typeof v !== "string") return Number(v) || 0;
  const m = v.trim().toLowerCase().match(/^([\d.]+)\s*([km]?)$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (m[2] === "k") return n * 1_000;
  if (m[2] === "m") return n * 1_000_000;
  return n;
}

/* ----------------------------------------------------------------------
   Mentor card — listing variant
---------------------------------------------------------------------- */
function MentorListCard({ mentor, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.03 }}
      className="h-full"
    >
      <Link
        to={`/mentors/${mentor.slug}`}
        aria-label={`View profile for ${mentor.name}`}
        className="group/mentor relative flex h-full flex-col rounded-2xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong focus-visible:-translate-y-0.5 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {/* Top row: availability + arrow chip */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] ${mentor.available
                ? "border-[color:color-mix(in_oklab,var(--success)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] text-success"
                : "border-border bg-elevated text-muted"
              }`}
          >
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${mentor.available ? "bg-success animate-pulse" : "bg-warning"
                }`}
            />
            {mentor.available ? "Available" : "Waitlist"}
          </span>
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg/70 text-muted opacity-0 transition-all duration-200 group-hover/mentor:opacity-100 group-hover/mentor:border-primary group-hover/mentor:text-primary group-focus-visible/mentor:opacity-100"
          >
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </span>
        </div>

        {/* Identity */}
        <div className="mt-4 flex items-center gap-3">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            loading="lazy"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[16px] font-semibold tracking-tight text-text">
              {mentor.name}
            </h3>
            <p className="mt-0.5 truncate text-[12.5px] text-muted">
              {mentor.role} ·{" "}
              <span className="text-text">
                {mentor.company.replace(/^Ex-/, "")}
              </span>
            </p>
          </div>
        </div>

        {/* Track pill */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles size={10} aria-hidden />
            {mentor.trackLabel}
          </span>
        </div>

        {/* Bio */}
        <p className="mt-3.5 text-[13px] leading-6 text-muted line-clamp-3">
          {mentor.bio}
        </p>

        {/* Specialties */}
        <div className="mt-3.5 pb-3 flex flex-wrap gap-1.5">
          {mentor.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-full border border-border bg-bg/60 px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------
   Page
---------------------------------------------------------------------- */
export default function MentorsListPage() {
  const [query, setQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");

  // Build the unique track list from data
  const tracks = useMemo(() => {
    const set = new Set();
    mentors.forEach((m) => m.trackLabel && set.add(m.trackLabel));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = mentors.filter((m) => {
      // search
      if (q) {
        const haystack = [
          m.name,
          m.role,
          m.company,
          m.trackLabel,
          ...(m.specialties || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // track filter
      if (activeTrack !== "All" && m.trackLabel !== activeTrack) return false;
      // availability filter
      if (availability === "available" && !m.available) return false;
      if (availability === "waitlist" && m.available) return false;
      return true;
    });

    // sort
    switch (sort) {
      case "rating":
        list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "learners":
        list = [...list].sort(
          (a, b) => parseLearners(b.learners) - parseLearners(a.learners)
        );
        break;
      case "experience":
        list = [...list].sort((a, b) => (b.yearsExp || 0) - (a.yearsExp || 0));
        break;
      case "featured":
      default:
        break;
    }
    return list;
  }, [query, activeTrack, availability, sort]);

  const totalAvailable = mentors.filter((m) => m.available).length;

  const clearAll = () => {
    setQuery("");
    setActiveTrack("All");
    setAvailability("all");
    setSort("featured");
  };

  const isFiltered =
    query.trim() !== "" ||
    activeTrack !== "All" ||
    availability !== "all" ||
    sort !== "featured";

  return (
    <div className="min-h-screen bg-bg text-text">


      <main id="main" className="relative">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden pt-[88px] pb-10 md:pt-[112px] md:pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-primary-soft opacity-60 blur-[160px]"
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
                  All mentors
                </div>
                <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] text-text sm:text-[44px] md:text-[52px]">
                  Learn from people who&rsquo;ve{" "}
                  <span className="text-primary">shipped at scale</span>
                </h1>
                <p className="mt-4 max-w-[640px] text-[15px] leading-7 text-muted md:text-[16.5px]">
                  Browse {mentors.length} ex-FAANG and senior practitioners. Filter by track, search by specialty, book a 1:1 session in minutes.
                </p>
              </div>

              {/* Live stats pill */}
              <div className="grid grid-cols-3 gap-3 self-end rounded-2xl border border-border bg-elevated/70 p-4 backdrop-blur md:min-w-[320px]">
                <div>
                  <div className="font-display text-[20px] font-bold tracking-tight text-text">
                    {mentors.length}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Mentors
                  </div>
                </div>
                <div className="border-l border-border pl-3">
                  <div className="font-display text-[20px] font-bold tracking-tight text-success">
                    {totalAvailable}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Available
                  </div>
                </div>
                <div className="border-l border-border pl-3">
                  <div className="font-display text-[20px] font-bold tracking-tight text-text">
                    {tracks.length - 1}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Tracks
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ================= TOOLBAR (sticky) ================= */}
        <div className="border-y border-border bg-bg/80">
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
                  placeholder="Search by name, company, specialty…"
                  aria-label="Search mentors"
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

              {/* Availability segmented */}
              <div
                role="group"
                aria-label="Availability"
                className="inline-flex items-center rounded-lg border border-border bg-elevated p-1"
              >
                {AVAILABILITY.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setAvailability(a.value)}
                    aria-pressed={availability === a.value}
                    className={`h-8 whitespace-nowrap rounded-md px-3 text-[12.5px] font-medium transition-colors ${availability === a.value
                        ? "bg-primary text-white"
                        : "text-muted hover:text-text"
                      }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="mentor-sort"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-subtle"
                >
                  Sort
                </label>
                <select
                  id="mentor-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-elevated px-3 text-[13px] font-medium text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Track filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tracks.map((t) => {
                const isActive = activeTrack === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTrack(t)}
                    aria-pressed={isActive}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${isActive
                        ? "border-primary bg-primary text-white shadow-[0_4px_12px_-4px_var(--primary)]"
                        : "border-border bg-elevated text-muted hover:border-border-strong hover:text-text"
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Container>
        </div>

        {/* ================= RESULTS ================= */}
        <section className="relative py-8 md:py-10">
          <Container size="lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-muted">
                Showing{" "}
                <span className="font-semibold text-text">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-text">
                  {mentors.length}
                </span>{" "}
                mentors
                {activeTrack !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="font-semibold text-text">
                      {activeTrack}
                    </span>
                  </>
                )}
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
                  No mentors match those filters
                </h3>
                <p className="mt-2 max-w-[420px] text-[13.5px] leading-6 text-muted">
                  Try removing a filter, broadening your search, or browsing by
                  another track.
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
                {filtered.map((m, i) => (
                  <MentorListCard key={m.slug} mentor={m} index={i} />
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ================= CTA ================= */}
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
                    Can&rsquo;t decide?
                  </div>
                  <h2 className="mt-2 font-display text-[24px] font-bold tracking-[-0.01em] text-text md:text-[30px]">
                    Tell us your goal — we&rsquo;ll match you to a mentor.
                  </h2>
                  <p className="mt-3 max-w-[560px] text-[14.5px] leading-7 text-muted">
                    Answer 3 quick questions and we&rsquo;ll suggest the right
                    mentor based on your level, goal, and timezone.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    to="/signup"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Get matched
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


    </div>
  );
}
