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
  BookOpen,
  Network,
  Search,
  Rocket,
  ClipboardCheck,
  Link2,
} from "lucide-react";
import { tracks, getTrackById, getLessonsByTrack } from '@/data/tracks';
import { featuredCourses } from '@/data/courses';
import { getMentorBySlug } from '@/data/mentors';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import {
  EASE,
  COLOR_TINT,
  Eyebrow,
  SectionTitle,
  StatBlock as Stat,
  MeshOrbs,
  RevealSection,
  GlassCard,
  SkillTag,
  SectionDivider,
} from '@/components/ui/PremiumUI';

function CurriculumItem({
  module,
  index,
  total,
  isOpen,
  onToggle,
  accent,
  trackId,
  firstLessonId,
}) {
  const isLast = index === total - 1;
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.05 }}
      className="group/timeline relative flex gap-6 pb-8 last:pb-0 md:gap-8"
    >
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center">
        {/* Glow dot */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Toggle ${module.title}`}
          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[15px] font-bold shadow-sm transition-all duration-300 ${isOpen
            ? "bg-primary/10 text-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]"
            : "border border-border bg-elevated/50 text-muted hover:border-primary/40 hover:bg-elevated hover:text-primary hover:shadow-lg hover:shadow-primary/[0.08]"
            }`}
        >
          {String(index + 1).padStart(2, "0")}
        </button>
        {/* Connector line */}
        {!isLast && (
          <div
            aria-hidden
            className={`absolute bottom-[-24px] top-14 w-[2px] rounded-full transition-all duration-300 ${isOpen
              ? "bg-gradient-to-b from-primary/40 to-border opacity-100"
              : "bg-border opacity-60 group-hover/timeline:bg-primary/20"
              }`}
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className={`glass-card hover-glow group/ci w-full overflow-hidden rounded-2xl border border-border bg-elevated/40 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300 ${isOpen ? "border-primary/30 bg-elevated/80 shadow-md shadow-primary/[0.04]" : "hover:bg-elevated/60"
            }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className={`block font-display text-[17px] font-bold tracking-tight transition-colors duration-300 ${isOpen ? "text-primary" : "text-text group-hover/ci:text-primary/90"}`}>
                {module.title}
              </span>
              <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/50 px-2.5 py-1 text-[12px] font-semibold text-muted">
                  <Clock size={12} aria-hidden className="text-primary/70" />
                  {module.weeks} {module.weeks === 1 ? "week" : "weeks"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/50 px-2.5 py-1 text-[12px] font-semibold text-muted">
                  <BookOpen size={12} aria-hidden className="text-primary/70" />
                  {module.modules} modules
                </span>
              </div>
            </div>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-bg/50 text-muted group-hover/ci:border-primary/20 group-hover/ci:text-primary"}`}>
              <ChevronDown
                size={18}
                aria-hidden
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-3 overflow-hidden rounded-2xl border border-border bg-bg/30 p-6 backdrop-blur-sm"
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {module.topics.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2
                      size={12}
                      aria-hidden
                      className="text-primary"
                    />
                  </div>
                  <span className="text-[14px] leading-relaxed text-muted">{t}</span>
                </li>
              ))}
            </ul>
            {trackId && firstLessonId ? (
              <div className="mt-6 pt-5 border-t border-border/50">
                <Link
                  to={`/learn/${trackId}/${firstLessonId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-fg shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md hover:shadow-primary/20"
                >
                  <PlayCircle size={16} aria-hidden />
                  Watch first lesson preview
                  <ArrowRight size={14} aria-hidden className="ml-1" />
                </Link>
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </motion.li>
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <li className={`group/faq relative overflow-hidden rounded-2xl border border-border bg-elevated/30 transition-all duration-300 ${isOpen ? "bg-elevated/70 shadow-sm border-primary/20" : "hover:bg-elevated/50 hover:border-primary/10"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 p-5 text-left sm:p-6"
      >
        <span className={`font-display text-[16px] font-bold tracking-tight transition-colors duration-300 sm:text-[17px] ${isOpen ? "text-primary" : "text-text group-hover/faq:text-primary/90"}`}>
          {q}
        </span>
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-bg/50 text-muted group-hover/faq:border-primary/20 group-hover/faq:text-primary"}`}>
          <ChevronDown
            size={14}
            aria-hidden
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.35, ease: EASE }}
          className="border-t border-border/50 bg-bg/30 px-5 pb-6 pt-5 text-[15px] leading-relaxed text-muted sm:px-6"
        >
          {a}
        </motion.div>
      )}
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


      <main id="main" className="relative">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-bg via-bg to-[color:color-mix(in_oklab,var(--primary)_3%,var(--bg))] pt-6 pb-6 md:pt-25 md:pb-10">
          {/* Ambient glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute right-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
            <div className="absolute -left-[5%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-primary/[0.03] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            {/* Breadcrumb removed */}

            <div className="flex flex-col items-center text-center">
              <h1 className="font-display text-[38px] font-black leading-[1.02] tracking-[-0.03em] text-text sm:text-[44px] xl:text-[56px]">
                {track.name}
              </h1>
              <p className="mt-3 max-w-[640px] text-[18px] font-normal leading-8 text-muted sm:text-[18px]">
                {track.tagline}
              </p>
              <p className="mt-3 max-w-[700px] text-[15px] leading-[1.6] text-subtle md:text-[15px]">
                {track.longDescription}
              </p>
            </div>

            {/* ─── MIDDLE ROW: FEATURES & MENTORS ─── */}
            <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">

              {/* Left Feature Block */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="hidden flex-col items-start lg:flex rounded-[1.5rem] bg-elevated/50 p-6 sm:p-7 border border-border/50 h-full justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
              >
                <h3 className="font-display text-[18px] font-bold text-text">From idea to shipped product</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Learn by building real projects that take you from zero to production with confidence.
                </p>
                <div className="mt-6 w-full border-t border-dashed border-border/50 pt-6 mt-auto">
                  <ul className="space-y-3 text-[13px] font-medium text-subtle">
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Real-world projects</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Production-ready code</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Industry best practices</li>
                  </ul>
                </div>
              </motion.div>

              {/* Center Mentors Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                className="relative mx-auto w-full px-2 sm:px-4"
              >
                {/* Nav Arrows */}
                {/* <button className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-elevated text-muted shadow-sm hover:text-primary sm:flex">
                  <ArrowLeft size={18} />
                </button>
                <button className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-elevated text-muted shadow-sm hover:text-primary sm:flex">
                  <ArrowRight size={18} />
                </button> */}

                <div className="flex items-stretch justify-center gap-4 sm:gap-4">
                  {(track.heroMentors || []).map((m, i) => (
                    <div
                      key={m.name}
                      className="group flex w-[160px] flex-col items-center rounded-[1.5rem] bg-elevated p-5 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-primary/20"
                    >
                      <div className="relative mb-3">
                        <div className="relative h-[95px] w-[95px] overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-elevated transition-all duration-300 group-hover:ring-primary/25">
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-elevated bg-bg shadow-md">
                          <img src={m.logo} alt="" className="h-4 w-4" aria-hidden />
                        </div>
                      </div>
                      <h3 className="font-display text-[13px] font-bold tracking-tight text-text line-clamp-1">
                        {m.name}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium text-primary line-clamp-2">
                        {m.role}
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-subtle">
                        <Briefcase size={10} aria-hidden />
                        <span className="truncate">{m.company}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Feature Block */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="hidden flex-col items-start lg:flex rounded-[1.5rem] bg-elevated/50 p-6 sm:p-7 border border-border/50 h-full justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
              >
                <h3 className="font-display text-[18px] font-bold text-text">Build. Ship. Scale.</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Master the tools and mindset used by top engineers to build, deploy and scale modern apps.
                </p>
                <div className="mt-6 w-full border-t border-dashed border-border/50 pt-6 mt-auto">
                  <ul className="space-y-3 text-[13px] font-medium text-subtle">
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Modern tech stack</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Scalable architecture</li>
                    <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-primary" /> Career growth focused</li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* ─── CTA ROW ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
              <Link
                to={`/learn/${track.id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-[14px] font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                <PlayCircle size={18} aria-hidden />
                Start learning
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-elevated px-6 py-4 text-[14px] font-semibold text-text shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
              >
                <Calendar size={16} aria-hidden />
                Enroll for {track.nextCohort.split(",")[1]?.trim() || "the next cohort"}
              </Link>
            </motion.div>

            {/* ─── BOTTOM TRUST BAR ─── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="mt-16 overflow-hidden rounded-2xl border border-border bg-elevated/80 shadow-sm backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-between gap-8 p-6 lg:flex-row lg:px-10 py-8">
                {/* Trusted By Logos */}
                <div className="flex flex-col items-center gap-4 lg:items-start max-w-sm">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-subtle">
                    Trusted by learners & teams at
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-6 text-[15px] font-display font-bold text-muted lg:justify-start">
                    <span className="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span></span>
                    <span className="text-red-600 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">NETFLIX</span>
                    <span className="text-black dark:text-white grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">Uber</span>
                    <span className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">amazon</span>
                    <span className="text-red-500 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">Adobe</span>
                  </div>
                </div>

                <div className="hidden h-16 w-px bg-border/80 lg:block" aria-hidden />

                {/* Track Stats */}
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Star size={20} className="fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[15px] font-bold text-text">
                        {track.rating}
                        <div className="flex text-yellow-400 text-[12px] gap-0.5">
                          <Star size={12} className="fill-current" />
                          <Star size={12} className="fill-current" />
                          <Star size={12} className="fill-current" />
                          <Star size={12} className="fill-current" />
                          <Star size={12} className="fill-current" />
                        </div>
                      </div>
                      <div className="text-[12px] text-subtle">({track.reviews?.toLocaleString()} reviews)</div>
                    </div>
                  </div>

                  {/* Enrollments */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-text">{track.enrolled}</div>
                      <div className="text-[12px] text-subtle">Enrolled learners</div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-text">{track.durationWeeks} Weeks</div>
                      <div className="text-[12px] text-subtle">{track.hoursPerWeek}h/week</div>
                    </div>
                  </div>

                  {/* Certificate */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-text">Certificate</div>
                      <div className="text-[12px] text-subtle">Included</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= WHAT YOU'LL LEARN ================= */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Ambient background */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
            <div className="absolute bottom-0 right-[15%] h-[350px] w-[350px] rounded-full bg-primary/[0.025] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            {/* ─── HEADER ─── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center text-center"
            >
              {/* Outcomes pill removed */}
              <h2 className="mt-6 font-display text-[40px] font-black leading-[1.05] tracking-[-0.03em] text-text sm:text-[48px] xl:text-[56px]">
                What you'll learn
              </h2>
              <div className="mt-3 h-[3px] w-12 rounded-full bg-primary/40" aria-hidden />
              <p className="mt-5 max-w-[600px] text-[16px] leading-7 text-muted sm:text-[17px]">
                Concrete skills that translate directly to senior-engineer work.
              </p>
            </motion.div>

            {/* ─── FEATURE CARDS ─── */}
            {/* <div className="mt-7 grid gap-5 sm:grid-cols-1">
              {track.outcomes.map((outcome, i) => {
                // Auto-assign icons per position for visual variety
                const ICONS = [Network, BookOpen, Search, Rocket, ClipboardCheck, Link2];
                const OutcomeIcon = ICONS[i % ICONS.length];
                return (
                  <motion.div
                    key={outcome}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-border bg-elevated p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.06] sm:p-8"
                  > */}
            {/* Left accent line */}
            {/* <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary/20 transition-all duration-300 group-hover:bg-primary/60 group-hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)]"
                    /> */}
            {/* Icon */}
            {/* <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.07] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
                      <OutcomeIcon size={24} className="text-primary" strokeWidth={1.6} aria-hidden />
                    </div> */}
            {/* Content */}
            {/* <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[15px] font-bold tracking-tight text-text sm:text-[16px]">
                        {outcome}
                      </h3>
                    </div> */}
            {/* Arrow */}
            {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.05] group-hover:text-primary">
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                    </div>
                  </motion.div>
                );
              })}
            </div> */}


            <div className="mt-2 max-w-[700px] mx-auto grid gap-4 sm:grid-cols-1">
              {track.outcomes.map((outcome, i) => {
                const ICONS = [
                  Network,
                  BookOpen,
                  Search,
                  Rocket,
                  ClipboardCheck,
                  Link2,
                ];

                const OutcomeIcon = ICONS[i % ICONS.length];

                return (
                  <motion.div
                    key={outcome}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      ease: EASE,
                      delay: i * 0.06,
                    }}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-elevated p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/[0.06]"
                  >
                    {/* Left accent line */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-primary/20 transition-all duration-300 group-hover:bg-primary/60"
                    />

                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] transition-transform duration-300 group-hover:scale-105">
                      <OutcomeIcon
                        size={18}
                        className="text-primary"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-text">
                        {outcome}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.05] group-hover:text-primary">
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="relative overflow-hidden py-12 md:py-6">
          {/* Ambient Glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[300px] w-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles size={14} className="text-primary" />
                <span>Tech Stack</span>
              </span>
              <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px]">
                Master the tools of the trade
              </h2>
              <p className="mx-auto mt-4 max-w-[600px] text-[15px] leading-relaxed text-muted">
                Get hands-on with the exact same enterprise technologies that power the world's most scalable applications.
              </p>
            </div>

            <div className="mx-auto mt-14 flex max-w-[900px] flex-wrap justify-center gap-3 md:gap-4">
              {track.skills.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-elevated/50 px-6 py-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-elevated hover:shadow-lg hover:shadow-primary/[0.08]"
                >
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 font-display text-[15px] font-bold text-text">
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CURRICULUM ================= */}
        <RevealSection
          id="curriculum"
          className="py-12 md:py-16"
          aria-labelledby="curriculum-title"
        >
          <div aria-hidden className="radial-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px]" />
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

            <ul className="mt-8 space-y-0">
              {track.curriculum.map((c, i) => (
                <CurriculumItem
                  key={c.id}
                  module={c}
                  index={i}
                  total={track.curriculum.length}
                  accent={accent}
                  trackId={track.id}
                  firstLessonId={firstLessonByCourse[i]}
                  isOpen={openModule === i}
                  onToggle={() => setOpenModule(openModule === i ? -1 : i)}
                />
              ))}
            </ul>

            {/* Linked featured courses (real catalog items) */}
            {courses.length > 0 && (
              <div className="mt-10">
                <Eyebrow>Featured course in this track</Eyebrow>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="card-shimmer glass-card hover-glow group/course relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
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
        </RevealSection>

        <RevealSection className="py-12 md:py-16">
          <SectionDivider />
          <Container size="lg" className="mt-10">
            <SectionTitle eyebrow="Mentor" title="Who you'll learn from" />
            <div className="glass-card hover-glow mt-7 grid gap-6 rounded-2xl p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-8">
              <img
                src={mentor?.avatar || track.leadMentor.photo}
                alt={track.leadMentor.name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20 md:h-28 md:w-28"
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
                      <SkillTag key={s}>{s}</SkillTag>
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
        </RevealSection>

        {/* ================= PROJECTS ================= */}
        {track.projects?.length > 0 && (
          <RevealSection className="relative py-20 md:py-28">
            <Container size="lg">
              <div className="mb-16 flex flex-col items-center text-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Briefcase size={14} className="text-primary" />
                  Capstone
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px]">
                  Projects you'll ship
                </h2>
                <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-muted">
                  Portfolio-grade deliverables you can confidently present in senior-level engineering interviews.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {track.projects.map((p, i) => (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-elevated/30 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-elevated/80 hover:shadow-lg hover:shadow-primary/[0.08]"
                  >
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="mb-6 flex items-center justify-between">
                      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text} shadow-sm`}>
                        <Briefcase size={20} aria-hidden />
                      </span>
                      <span className="font-display text-[48px] font-black leading-none text-border/40 transition-colors group-hover:text-primary/10">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-display text-[20px] font-bold tracking-tight text-text">
                      {p.title}
                    </h3>

                    <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                      {p.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </Container>
          </RevealSection>
        )}

        {/* ================= CAREER OUTCOMES ================= */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Ambient Glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[400px] w-[800px] rounded-full bg-primary/[0.04] blur-[150px]" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="overflow-hidden rounded-[2.5rem] border border-border bg-elevated/40 p-8 shadow-sm backdrop-blur-xl md:p-14 lg:p-20">
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
                {/* Left: Salary & Stats */}
                <div className="flex flex-col justify-center">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                    <TrendingUp size={14} className="text-primary" />
                    Career Outcomes
                  </span>

                  <h2 className="mt-8 font-display text-[28px] font-black tracking-tight text-text sm:text-[36px] md:text-[42px]">
                    Command a premium salary.
                  </h2>

                  <div className="mt-6 flex flex-col">
                    <span className="text-[16px] font-medium text-muted">Graduates average starting base</span>
                    <div className="mt-1 font-display text-[64px] font-extrabold leading-none tracking-[-0.03em] md:text-[80px]">
                      <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        {track.medianSalary}
                      </span>
                    </div>
                  </div>

                  <p className="mt-8 max-w-[480px] text-[15px] leading-relaxed text-muted">
                    Career services include unlimited mock interviews, expert resume tear-downs, and warm introductions to companies hiring at the senior and staff engineer level.
                  </p>

                  <div className="mt-10 grid grid-cols-3 gap-4">
                    <div className="flex flex-col rounded-2xl border border-border bg-bg/50 p-4 text-center">
                      <span className="font-display text-[24px] font-bold text-success">98%</span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">Placed in tech</span>
                    </div>
                    <div className="flex flex-col rounded-2xl border border-border bg-bg/50 p-4 text-center">
                      <span className="font-display text-[24px] font-bold text-primary">45d</span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">Avg time to hire</span>
                    </div>
                    <div className="flex flex-col rounded-2xl border border-border bg-bg/50 p-4 text-center">
                      <span className="font-display text-[24px] font-bold text-text">{track.salary}</span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">Base range</span>
                    </div>
                  </div>
                </div>

                {/* Right: Hiring Partners */}
                <div className="flex flex-col justify-center rounded-3xl border border-border/50 bg-bg/40 p-8 md:p-12">
                  <h3 className="font-display text-[20px] font-bold text-text">Where our alumni work</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">
                    We've built direct pipelines to the best engineering cultures in the world. Skip the recruiter screen.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    {track.hiringPartners.map((h, i) => (
                      <motion.span
                        key={h}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="inline-flex items-center rounded-xl border border-border bg-elevated/80 px-4 py-2.5 text-[14px] font-semibold text-text shadow-sm transition-colors hover:border-primary/30"
                      >
                        {h}
                      </motion.span>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center gap-4 rounded-2xl border border-primary/10 bg-primary/[0.05] p-5">
                    <ShieldCheck size={32} className="shrink-0 text-primary" />
                    <p className="text-[13px] leading-relaxed text-primary">
                      <strong>The Cloud Nexus Guarantee:</strong> If you don't land a role within 6 months of graduation, your tuition is fully refunded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        {track.testimonials?.length > 0 && (
          <RevealSection className="py-20 md:py-32">
            <Container size="lg">
              <div className="mb-16 text-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Star size={14} className="fill-primary" />
                  From our learners
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px]">
                  Don't just take our word for it.
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                {track.testimonials.map((t, i) => (
                  <motion.figure
                    key={t.author}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border bg-elevated/40 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-elevated/80 hover:shadow-lg hover:shadow-primary/[0.08] md:p-10"
                  >
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div>
                      <div className="mb-6 flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={16}
                            className="fill-primary text-primary"
                            aria-hidden
                          />
                        ))}
                      </div>
                      <blockquote className="relative font-display text-[18px] leading-[1.6] tracking-tight text-text sm:text-[20px]">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                    </div>
                    <figcaption className="mt-10 flex items-center gap-4 border-t border-border/50 pt-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 font-display text-[16px] font-bold text-white shadow-md">
                        {t.author.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-[15px] font-bold text-text">
                          {t.author}
                        </span>
                        <span className="text-[13px] font-medium text-muted">{t.title || t.role}</span>
                      </div>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </Container>
          </RevealSection>
        )}

        {/* ================= FAQ ================= */}
        {track.faq?.length > 0 && (
          <RevealSection className="py-20 md:py-32">
            <Container size="lg">
              <div className="mb-16 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  FAQ
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px]">
                  Common questions
                </h2>
              </div>
              <div className="mx-auto max-w-[800px]">
                <ul className="space-y-4">
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
              </div>
            </Container>
          </RevealSection>
        )}

        {/* ================= FINAL CTA ================= */}
        <RevealSection className="py-20 md:py-32">
          <Container size="lg">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-elevated/40 p-8 shadow-sm backdrop-blur-xl md:p-16 lg:p-20">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary/[0.02]" />
              <div aria-hidden className="absolute -right-[20%] top-[-20%] h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />

              <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                    <TrendingUp size={14} className="text-primary" />
                    Limited Seats
                  </span>
                  <h2 className="mt-6 font-display text-[32px] font-black leading-[1.1] tracking-tight text-text sm:text-[40px] md:text-[46px]">
                    Join the {track.name} cohort starting <span className="text-primary">{track.nextCohort}</span>.
                  </h2>
                  <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-muted">
                    Mentors review every line of code. Career services walk with you through every interview. You'll ship work you can actually show.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      to="/signup"
                      size="xl"
                      className="h-14 rounded-2xl px-8 text-[15px]"
                      rightIcon={<ArrowRight size={18} />}
                    >
                      Enroll now
                    </Button>
                    <Button
                      to="/#contact"
                      variant="outline"
                      size="xl"
                      className="h-14 rounded-2xl border-border/60 px-8 text-[15px] hover:bg-bg/50"
                    >
                      Talk to admissions
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-border/50 bg-bg/50 p-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                        <CheckCircle2 size={20} aria-hidden />
                      </div>
                      <div>
                        <div className="font-display text-[15px] font-bold text-text">Job guarantee</div>
                        <div className="mt-0.5 text-[13px] text-muted">Full refund if not hired in 6 mo</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-bg/50 p-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users size={20} aria-hidden />
                      </div>
                      <div>
                        <div className="font-display text-[15px] font-bold text-text">Cohort-based</div>
                        <div className="mt-0.5 text-[13px] text-muted">Learn with top engineering peers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </RevealSection>

        {/* ================= MORE TRACKS ================= */}
        {others.length > 0 && (
          <RevealSection className="pb-16 pt-4 md:pb-20">
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
                        className="group glass-card hover-glow flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
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
          </RevealSection>
        )}
      </main>


    </div>
  );
}
