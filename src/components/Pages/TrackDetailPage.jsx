import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Clock,
  Users,
  Star,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Award,
  PlayCircle,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { tracks, getTrackById, getLessonsByTrack } from "../../data/tracks";
import { featuredCourses } from "../../data/courses";
import { getMentorBySlug } from "../../data/mentors";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Container from "../ui/Container";
import Button from "../ui/Button";

const EASE = [0.16, 1, 0.3, 1];

const COLOR_TINT = {
  primary: {
    bg: "bg-primary-soft",
    text: "text-primary",
    border: "border-primary/20",
    grad: "from-primary via-primary to-accent",
  },
  accent: {
    bg: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent/20",
    grad: "from-accent via-accent to-primary",
  },
  success: {
    bg: "bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)]",
    text: "text-success",
    border: "border-[color:color-mix(in_oklab,var(--success)_30%,transparent)]",
    grad: "from-success via-success to-primary",
  },
  warning: {
    bg: "bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)]",
    text: "text-warning",
    border: "border-[color:color-mix(in_oklab,var(--warning)_30%,transparent)]",
    grad: "from-warning via-warning to-accent",
  },
};

function Eyebrow({ children, className = "" }) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-2 font-display text-[24px] font-bold tracking-[-0.01em] text-text md:text-[30px]">
        {title}
      </h2>
      {sub ? (
        <p className="mt-2 max-w-[640px] text-[14.5px] leading-7 text-muted">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function Stat({ value, label, sub }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/70 px-4 py-3.5 backdrop-blur">
      <div className="font-display text-[22px] font-bold leading-none tracking-tight text-text sm:text-[24px]">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        {label}
      </div>
      {sub ? <div className="mt-0.5 text-[11px] text-muted">{sub}</div> : null}
    </div>
  );
}

function CurriculumItem({
  module,
  index,
  isOpen,
  onToggle,
  accent,
  trackId,
  firstLessonId,
}) {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-elevated/60 transition-colors duration-200 hover:border-border-strong">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold ${accent.bg} ${accent.text}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-semibold tracking-tight text-text sm:text-[16px]">
            {module.title}
          </span>
          <span className="mt-0.5 block text-[12.5px] text-muted">
            {module.modules} modules · {module.weeks}{" "}
            {module.weeks === 1 ? "week" : "weeks"}
          </span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-border bg-bg/30 px-4 py-3.5 sm:px-5">
          <ul className="grid gap-2 text-[13px] text-muted sm:grid-cols-2">
            {module.topics.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <PlayCircle
                  size={13}
                  aria-hidden
                  className={`mt-0.5 shrink-0 ${accent.text}`}
                />
                {t}
              </li>
            ))}
          </ul>
          {trackId && firstLessonId ? (
            <Link
              to={`/learn/${trackId}/${firstLessonId}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Watch the first lesson
              <ArrowUpRight size={12} aria-hidden />
            </Link>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-elevated/60 transition-colors hover:border-border-strong">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span className="font-display text-[14.5px] font-semibold tracking-tight text-text sm:text-[15.5px]">
          {q}
        </span>
        <ChevronDown
          size={15}
          aria-hidden
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-border px-4 py-3.5 text-[13.5px] leading-7 text-muted sm:px-5">
          {a}
        </div>
      ) : null}
    </li>
  );
}

export default function TrackDetailPage() {
  const { id } = useParams();
  const track = useMemo(() => getTrackById(id), [id]);
  const [openModule, setOpenModule] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  if (!track) {
    return <Navigate to="/" replace />;
  }

  const accent = COLOR_TINT[track.color] || COLOR_TINT.primary;
  const Icon = track.icon;
  const courses = featuredCourses.filter((c) => track.courseIds.includes(c.id));
  const totalModules = track.curriculum.reduce((acc, c) => acc + c.modules, 0);
  const mentor = track.leadMentorSlug
    ? getMentorBySlug(track.leadMentorSlug)
    : null;
  const others = tracks.filter((t) => t.id !== track.id).slice(0, 3);

  // For each curriculum entry, find the first lesson id so the
  // "Watch the first lesson" link can deep-link into the player.
  const lessons = getLessonsByTrack(track.id);
  const firstLessonByCourse = track.curriculum.map(
    (_c, ci) => lessons.find((l) => l.courseIndex === ci)?.id || null
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <main id="main" className="relative">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden pt-[88px] pb-12 md:pt-[112px] md:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-[20%] -z-10 h-[460px] w-[620px] -translate-x-1/2 rounded-full bg-primary-soft opacity-60 blur-[150px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-[-8%] -z-10 h-[360px] w-[460px] rounded-full bg-accent-soft opacity-50 blur-[130px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] blueprint-grid opacity-40"
          />

          <Container size="lg">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-[13px] text-subtle"
            >
              <Link
                to="/"
                className="text-muted transition-colors hover:text-primary"
              >
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link
                to="/tracks"
                className="text-muted transition-colors hover:text-primary"
              >
                Tracks
              </Link>
              <span aria-hidden>/</span>
              <span className="truncate text-text">{track.name}</span>
            </nav>

            <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
              {/* Left: hero text */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {/* Eyebrow row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${accent.bg} ${accent.text} ${accent.border}`}
                  >
                    <Icon size={11} aria-hidden />
                    Career track
                  </span>
                  {track.badge ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-warning">
                      <Sparkles size={10} aria-hidden />
                      {track.badge}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted backdrop-blur">
                    <Calendar size={11} aria-hidden />
                    Next cohort · {track.nextCohort}
                  </span>
                </div>

                {/* Title */}
                <h1 className="mt-6 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.025em] text-text sm:text-[44px] md:text-[54px]">
                  {track.name}
                </h1>
                <p className="mt-3 max-w-[640px] text-[16px] leading-7 text-muted md:text-[18px]">
                  {track.tagline}
                </p>
                <p className="mt-4 max-w-[640px] text-[14.5px] leading-7 text-muted md:text-[15.5px]">
                  {track.longDescription}
                </p>

                {/* Rating / meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Star
                      size={13}
                      className="fill-current text-primary"
                      aria-hidden
                    />
                    <span className="font-semibold text-text">
                      {track.rating}
                    </span>
                    <span>
                      ({track.reviews?.toLocaleString()} reviews)
                    </span>
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} aria-hidden />
                    <span className="font-semibold text-text">
                      {track.enrolled}
                    </span>{" "}
                    enrolled
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} aria-hidden />
                    {track.durationWeeks} weeks · {track.hoursPerWeek}h/week
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    to={`/learn/${track.id}`}
                    size="lg"
                    leftIcon={<PlayCircle size={16} />}
                  >
                    Start watching
                  </Button>
                  <Button
                    to="/signup"
                    variant="outline"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Enroll for {track.nextCohort.split(",")[1]?.trim() || "the next cohort"}
                  </Button>
                </div>

                {/* Trust line */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-success" aria-hidden />
                    7-day free trial
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-success" aria-hidden />
                    No credit card needed
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award size={12} className="text-primary" aria-hidden />
                    Certificate included
                  </span>
                </div>
              </motion.div>

              {/* Right: facts card */}
              <motion.aside
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                className="lg:sticky lg:top-24"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border bg-elevated p-5 shadow-[var(--shadow-card)]">
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.grad}`}
                  />
                  <Eyebrow>What you get</Eyebrow>
                  <dl className="mt-4 divide-y divide-border text-[13.5px]">
                    {[
                      ["Level", track.level],
                      ["Duration", `${track.durationWeeks} weeks`],
                      ["Effort", `${track.hoursPerWeek}h / week`],
                      ["Cohort", track.nextCohort],
                      ["Language", track.language],
                      ["Certificate", track.certificate],
                      [
                        "Modules",
                        `${totalModules} across ${track.curriculum.length} courses`,
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-start justify-between gap-3 py-2.5"
                      >
                        <dt className="text-muted">{k}</dt>
                        <dd className="max-w-[60%] text-right font-medium text-text">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Button
                    to={`/learn/${track.id}`}
                    size="md"
                    fullWidth
                    className="mt-5"
                    leftIcon={<PlayCircle size={14} />}
                  >
                    Start watching
                  </Button>
                  <Button
                    to="/signup"
                    variant="outline"
                    size="md"
                    fullWidth
                    className="mt-2"
                  >
                    Start free trial
                  </Button>
                  <p className="mt-2 text-center text-[11.5px] text-subtle">
                    Cancel anytime · 7-day refund window
                  </p>

                  {/* Live signal */}
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-bg/40 px-3 py-2 text-[12px] text-muted">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    <span className="font-semibold text-text">
                      {track.activeLearners}
                    </span>{" "}
                    learners currently active in this cohort
                  </div>
                </div>
              </motion.aside>
            </div>

            {/* KPI band */}
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                value={track.rating}
                label="Avg. rating"
                sub={`${track.reviews?.toLocaleString()} reviews`}
              />
              <Stat
                value={track.enrolled}
                label="Learners"
                sub="all-time"
              />
              <Stat
                value={track.medianSalary}
                label="Median salary"
                sub="post-graduation"
              />
              <Stat
                value={`${track.curriculum.length}`}
                label="Courses"
                sub={`${totalModules} modules total`}
              />
            </div>
          </Container>
        </section>

        {/* ================= WHAT YOU'LL LEARN ================= */}
        <section className="relative py-10 md:py-14">
          <Container size="lg">
            <SectionTitle
              eyebrow="Outcomes"
              title="What you'll learn"
              sub="Concrete skills that translate directly to senior-engineer work."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {track.outcomes.map((o, i) => (
                <motion.div
                  key={o}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-elevated/60 px-4 py-3.5 backdrop-blur"
                >
                  <CheckCircle2
                    size={16}
                    className={`mt-0.5 shrink-0 ${accent.text}`}
                    aria-hidden
                  />
                  <p className="text-[13.5px] leading-6 text-muted">{o}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="relative py-8 md:py-10">
          <Container size="lg">
            <SectionTitle eyebrow="Tech stack" title="Skills you'll gain" />
            <div className="mt-5 flex flex-wrap gap-2">
              {track.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[12.5px] font-medium text-text"
                >
                  {s}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* ================= CURRICULUM ================= */}
        <section
          id="curriculum"
          className="relative py-10 md:py-14"
          aria-labelledby="curriculum-title"
        >
          <Container size="lg">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <SectionTitle
                eyebrow="Curriculum"
                title="Course path"
                sub={`${track.curriculum.length} courses · ${totalModules} modules · ${track.durationWeeks} weeks`}
              />
              <p className="text-[12.5px] text-subtle">
                Click any course to preview its modules.
              </p>
            </div>

            <ol className="mt-8 space-y-3">
              {track.curriculum.map((c, i) => (
                <CurriculumItem
                  key={c.id}
                  module={c}
                  index={i}
                  accent={accent}
                  trackId={track.id}
                  firstLessonId={firstLessonByCourse[i]}
                  isOpen={openModule === i}
                  onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                />
              ))}
            </ol>

            {/* Linked featured courses (real catalog items) */}
            {courses.length > 0 && (
              <div className="mt-10">
                <Eyebrow>Featured course in this track</Eyebrow>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-elevated transition-colors duration-200 hover:border-border-strong"
                    >
                      <img
                        src={c.image}
                        alt={c.title}
                        loading="lazy"
                        className="h-28 w-full object-cover"
                      />
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-display text-[14.5px] font-semibold tracking-tight text-text">
                          {c.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-muted">
                          {c.description}
                        </p>
                        <div className="mt-auto flex items-center gap-x-3 gap-y-1.5 pt-3 text-[11.5px] text-subtle">
                          <span className="inline-flex items-center gap-1">
                            <Star
                              size={11}
                              className="fill-current text-primary"
                              aria-hidden
                            />
                            <span className="font-semibold text-text">
                              {c.rating}
                            </span>
                          </span>
                          <span aria-hidden>·</span>
                          <span>{c.duration}</span>
                          <span aria-hidden>·</span>
                          <span>{c.modules} modules</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>

        {/* ================= MENTOR ================= */}
        <section className="relative py-10 md:py-14">
          <Container size="lg">
            <SectionTitle eyebrow="Mentor" title="Who you'll learn from" />
            <div className="mt-7 grid gap-6 rounded-2xl border border-border bg-elevated p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-8">
              <img
                src={mentor?.avatar || track.leadMentor.photo}
                alt={track.leadMentor.name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-border md:h-28 md:w-28"
              />
              <div>
                <h3 className="font-display text-[20px] font-bold tracking-tight text-text md:text-[24px]">
                  {track.leadMentor.name}
                </h3>
                <p className="mt-1 text-[14px] text-muted md:text-[15px]">
                  {track.leadMentor.role}
                </p>
                <p className="mt-3 max-w-[640px] text-[13.5px] leading-7 text-muted">
                  {mentor?.longBio ||
                    `${track.leadMentor.name} leads the ${track.name} track at Cloud Nexus and brings deep production experience to every cohort.`}
                </p>
                {mentor?.specialties?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mentor.specialties.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center rounded-full border border-border bg-bg/60 px-2.5 py-0.5 text-[11.5px] font-medium text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {mentor ? (
                <Link
                  to={`/mentors/${mentor.slug}`}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border bg-bg px-4 py-2 text-[13px] font-semibold text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary md:self-center"
                >
                  Full profile
                  <ArrowUpRight size={13} aria-hidden />
                </Link>
              ) : null}
            </div>
          </Container>
        </section>

        {/* ================= PROJECTS ================= */}
        {track.projects?.length > 0 && (
          <section className="relative py-10 md:py-14">
            <Container size="lg">
              <SectionTitle
                eyebrow="Capstone"
                title="Projects you'll ship"
                sub="Portfolio-grade deliverables you can show in interviews."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {track.projects.map((p, i) => (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                    className="group/proj relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
                  >
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r ${accent.grad} transition-transform duration-300 group-hover/proj:scale-x-100`}
                    />
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}
                    >
                      <Briefcase size={15} aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-[16px] font-semibold tracking-tight text-text">
                      Project {String(i + 1).padStart(2, "0")} — {p.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-muted">
                      {p.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ================= CAREER OUTCOMES ================= */}
        <section className="relative py-10 md:py-14">
          <Container size="lg">
            <div className="grid gap-8 rounded-3xl border border-border bg-elevated p-6 md:grid-cols-[1fr_1fr] md:gap-12 md:p-10">
              <div>
                <Eyebrow>Career outcomes</Eyebrow>
                <h2 className="mt-2 font-display text-[24px] font-bold tracking-[-0.01em] text-text md:text-[30px]">
                  Graduates earn an average of{" "}
                  <span className={accent.text}>{track.medianSalary}</span>
                </h2>
                <p className="mt-3 max-w-[480px] text-[14px] leading-7 text-muted">
                  Career services include mock interviews, resume reviews, and
                  warm intros to companies hiring at staff-engineer level.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <TrendingUp
                      size={13}
                      className="text-success"
                      aria-hidden
                    />
                    Avg post-grad salary{" "}
                    <span className="font-semibold text-text">
                      {track.salary}
                    </span>
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={13} aria-hidden />
                    Verified certificate
                  </span>
                </div>
              </div>
              <div>
                <Eyebrow>Hiring partners</Eyebrow>
                <div className="mt-3 flex flex-wrap gap-2">
                  {track.hiringPartners.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center rounded-lg border border-border bg-bg/60 px-3 py-2 text-[12.5px] font-semibold text-text"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[12.5px] text-subtle">
                  Companies that have hired Cloud Nexus alumni in the last 12
                  months. Outcomes vary based on profile and effort.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        {track.testimonials?.length > 0 && (
          <section className="relative py-10 md:py-14">
            <Container size="lg">
              <SectionTitle
                eyebrow="From learners"
                title="What graduates say"
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {track.testimonials.map((t, i) => (
                  <motion.figure
                    key={t.author}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                    className="rounded-2xl border border-border bg-elevated/60 p-6 backdrop-blur"
                  >
                    <blockquote className="font-display text-[16px] leading-[1.55] tracking-tight text-text md:text-[17px]">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-[12.5px] text-subtle">
                      <span className="font-semibold text-text">
                        {t.author}
                      </span>{" "}
                      · {t.title}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ================= FAQ ================= */}
        {track.faq?.length > 0 && (
          <section className="relative py-10 md:py-14">
            <Container size="lg">
              <SectionTitle eyebrow="FAQ" title="Common questions" />
              <ul className="mt-8 space-y-3">
                {track.faq.map((f, i) => (
                  <FaqItem
                    key={f.q}
                    q={f.q}
                    a={f.a}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </ul>
            </Container>
          </section>
        )}

        {/* ================= FINAL CTA ================= */}
        <section className="relative py-10 md:py-14">
          <Container size="lg">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-elevated px-6 py-10 shadow-[var(--shadow-card)] md:px-12 md:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 h-[320px] w-[320px] rounded-full bg-primary-soft opacity-60 blur-[110px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-16 h-[280px] w-[280px] rounded-full bg-accent-soft opacity-50 blur-[110px]"
              />
              <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <Eyebrow>Limited seats</Eyebrow>
                  <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.01em] text-text md:text-[34px]">
                    Join the {track.name} cohort starting {track.nextCohort}.
                  </h2>
                  <p className="mt-3 max-w-[560px] text-[14.5px] leading-7 text-muted md:text-[16px]">
                    Mentors review every project. Career services walk with you
                    through interviews. You ship work you can actually show.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    to="/signup"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Enroll now
                  </Button>
                  <Button to="/#contact" variant="outline" size="lg">
                    Talk to admissions
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ================= MORE TRACKS ================= */}
        {others.length > 0 && (
          <section className="relative pb-16 pt-2 md:pb-20">
            <Container size="lg">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <SectionTitle
                  eyebrow="Keep exploring"
                  title="Other career tracks"
                />
                <Link
                  to="/tracks"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover"
                >
                  All tracks
                  <ArrowRight size={13} aria-hidden />
                </Link>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((t, i) => {
                  const A = COLOR_TINT[t.color] || COLOR_TINT.primary;
                  const TIcon = t.icon;
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        ease: EASE,
                        delay: i * 0.04,
                      }}
                    >
                      <Link
                        to={`/tracks/${t.id}`}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${A.bg} ${A.text}`}
                          >
                            <TIcon size={16} aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-display text-[15px] font-semibold tracking-tight text-text">
                              {t.name}
                            </h3>
                            <p className="mt-0.5 truncate text-[12px] text-muted">
                              {t.durationWeeks} wks · {t.curriculum.length}{" "}
                              courses
                            </p>
                          </div>
                          <ArrowUpRight
                            size={13}
                            aria-hidden
                            className="shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                          />
                        </div>
                        <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-muted">
                          {t.tagline}
                        </p>
                        <div className="mt-auto flex items-center gap-x-3 gap-y-1.5 pt-4 text-[12px] text-subtle">
                          <span className="inline-flex items-center gap-1">
                            <Star
                              size={11}
                              className="fill-current text-primary"
                              aria-hidden
                            />
                            <span className="text-text">{t.rating}</span>
                          </span>
                          <span aria-hidden>·</span>
                          <span>
                            <span className="text-text">{t.enrolled}</span>{" "}
                            enrolled
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </Container>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
