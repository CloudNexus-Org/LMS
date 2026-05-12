import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  Users,
  GraduationCap,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  Briefcase,
  Globe,
  Quote,
  Sparkles,
} from "lucide-react";
import { FaLinkedinIn, FaGithub, FaTwitter } from "react-icons/fa";
import { mentors, getMentorBySlug } from "../../data/mentors";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Container from "../ui/Container";
import Button from "../ui/Button";

const EASE = [0.16, 1, 0.3, 1];

const LEVEL_TONE = {
  Advanced: "bg-primary-soft text-primary border border-primary/20",
  Intermediate: "bg-accent-soft text-accent border border-accent/20",
  Beginner:
    "bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] text-success border border-[color:color-mix(in_oklab,var(--success)_25%,transparent)]",
};

/* ----------------------------------------------------------------------
   Small primitives
---------------------------------------------------------------------- */

function Eyebrow({ children, className = "" }) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle ${className}`}
    >
      {children}
    </div>
  );
}

function KpiTile({ value, label, sub }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/70 px-4 py-3.5 backdrop-blur">
      <div className="font-display text-[22px] font-bold leading-none tracking-tight text-text sm:text-[24px]">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
        {label}
      </div>
      {sub ? (
        <div className="mt-0.5 text-[11px] text-muted">{sub}</div>
      ) : null}
    </div>
  );
}

function SocialChip({ href, icon: Icon, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-elevated text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
    >
      <Icon size={14} aria-hidden />
    </a>
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

/* ----------------------------------------------------------------------
   Page
---------------------------------------------------------------------- */

export default function MentorDetailPage() {
  const { slug } = useParams();
  const mentor = useMemo(() => getMentorBySlug(slug), [slug]);

  if (!mentor) {
    return <Navigate to="/" replace />;
  }

  const firstName = mentor.name.split(" ").pop();
  const otherMentors = mentors
    .filter((m) => m.slug !== mentor.slug)
    .slice(0, 3);
  const portrait = mentor.avatar.replace("200?u=", "600?u=");

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <main id="main" className="relative">
        {/* =========================================================
            HERO — editorial two-column layout
        ========================================================== */}
        <section className="relative overflow-hidden pt-[88px] pb-14 md:pt-[112px] md:pb-20">
          {/* Subtle ambient halos */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-[15%] -z-10 h-[480px] w-[640px] -translate-x-1/2 rounded-full bg-primary-soft opacity-60 blur-[160px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-[-5%] -z-10 h-[380px] w-[460px] rounded-full bg-accent-soft opacity-50 blur-[140px]"
          />
          {/* faint blueprint grid behind the hero only */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] blueprint-grid opacity-[0.45]"
          />

          <Container size="lg">
            {/* Back link + breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-10 flex items-center gap-2 text-[13px] text-subtle"
            >
              <Link
                to="/mentors"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-primary"
              >
                <ArrowLeft size={13} aria-hidden />
                All mentors
              </Link>
              <span aria-hidden>/</span>
              <span className="truncate text-text">{mentor.name}</span>
            </nav>

            <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              {/* ---------- LEFT: identity + bio ---------- */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {/* Eyebrow row: track + availability */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    <Sparkles size={11} aria-hidden />
                    {mentor.trackLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted backdrop-blur">
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full ${
                        mentor.available
                          ? "bg-success animate-pulse"
                          : "bg-warning"
                      }`}
                    />
                    {mentor.available ? "Open to new mentees" : "Waitlist only"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted backdrop-blur">
                    <CheckCircle2 size={11} className="text-primary" aria-hidden />
                    Verified
                  </span>
                </div>

                {/* Name */}
                <h1 className="mt-6 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.025em] text-text sm:text-[44px] md:text-[56px]">
                  {mentor.name}
                </h1>

                {/* Role line */}
                <p className="mt-3 text-[17px] leading-7 text-muted md:text-[18px]">
                  {mentor.role}{" "}
                  <span className="mx-1.5 text-subtle">·</span>{" "}
                  <span className="text-text">
                    {mentor.company.replace(/^Ex-/, "Previously at ")}
                  </span>
                </p>

                {/* Location + meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden />
                    {mentor.location}
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={13} aria-hidden />
                    {mentor.yearsExp}+ years in industry
                  </span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} aria-hidden />
                    Responds within 24h
                  </span>
                </div>

                {/* Bio — editorial style */}
                <p className="mt-7 max-w-[600px] text-[15.5px] leading-[1.75] text-muted md:text-[16.5px]">
                  {mentor.longBio}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                    href="#contact-mentor"
                  >
                    Book a session
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    to="/#courses"
                    rightIcon={<ArrowUpRight size={16} />}
                  >
                    See their courses
                  </Button>
                </div>

                {/* Socials */}
                <div className="mt-7 flex items-center gap-2.5">
                  <SocialChip
                    href={mentor.linkedin}
                    icon={FaLinkedinIn}
                    label={`${mentor.name} on LinkedIn`}
                  />
                  <SocialChip
                    href={mentor.twitter}
                    icon={FaTwitter}
                    label={`${mentor.name} on Twitter`}
                  />
                  <SocialChip
                    href={mentor.github}
                    icon={FaGithub}
                    label={`${mentor.name} on GitHub`}
                  />
                  {mentor.website ? (
                    <SocialChip
                      href={mentor.website}
                      icon={Globe}
                      label={`${mentor.name}'s website`}
                    />
                  ) : null}
                </div>
              </motion.div>

              {/* ---------- RIGHT: refined portrait card ---------- */}
              <motion.aside
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                className="relative lg:mt-1"
              >
                {/* Halo behind card */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-primary/15 via-transparent to-accent/15 opacity-60 blur-2xl"
                />

                <figure className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-border bg-elevated shadow-[var(--shadow-card)]">
                  {/* Portrait — true square so faces stay framed */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src={portrait}
                      alt={mentor.name}
                      className="h-full w-full object-cover"
                    />
                    {/* Top-left rating chip */}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11.5px] font-semibold text-[#0b1020] shadow-sm">
                      <Star
                        size={11}
                        className="fill-current text-[#f59e0b]"
                        aria-hidden
                      />
                      {mentor.rating}
                      <span className="font-normal text-[#52607a]">
                        ({mentor.reviews?.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Info strip below photo — proper card footer (no overlap) */}
                  <figcaption className="border-t border-border px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-display text-[14px] font-semibold tracking-tight text-text">
                          {mentor.name}
                        </div>
                        <div className="mt-0.5 truncate text-[12px] text-muted">
                          {mentor.role} ·{" "}
                          {mentor.company.replace(/^Ex-/, "Ex ")}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-border bg-bg px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {mentor.sessions}+ sessions
                      </span>
                    </div>
                  </figcaption>
                </figure>

                {/* Mini "what you get" strip below card */}
                <ul className="mx-auto mt-4 grid w-full max-w-[420px] gap-2 rounded-xl border border-border bg-elevated/60 p-3 text-[12.5px] backdrop-blur">
                  {[
                    "60-min 1:1 video session",
                    "Async follow-up on Slack",
                    "Personalised study plan",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-muted"
                    >
                      <CheckCircle2
                        size={13}
                        className="shrink-0 text-primary"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.aside>
            </div>

            {/* ---------- KPI BAR (full width, anchors the hero) ---------- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
              className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              <KpiTile
                value={mentor.rating}
                label="Avg. rating"
                sub={`${mentor.reviews?.toLocaleString()} reviews`}
              />
              <KpiTile
                value={mentor.learners}
                label="Learners taught"
                sub="all-time"
              />
              <KpiTile
                value={`${mentor.sessions}+`}
                label="1:1 Sessions led"
                sub="last 24 months"
              />
              <KpiTile
                value={mentor.courses}
                label="Courses authored"
                sub={`${mentor.yearsExp}+ yrs experience`}
              />
            </motion.div>
          </Container>
        </section>

        {/* =========================================================
            QUOTE
        ========================================================== */}
        <section className="relative pb-6 md:pb-10">
          <Container size="lg">
            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="relative rounded-2xl border border-border bg-elevated/40 px-6 py-8 backdrop-blur md:px-12 md:py-12"
            >
              <Quote
                size={32}
                aria-hidden
                className="absolute left-5 top-5 text-primary/35 md:left-8 md:top-7"
              />
              <blockquote className="pl-9 font-display text-[20px] leading-snug tracking-[-0.01em] text-text md:text-[28px] md:leading-[1.25]">
                &ldquo;{mentor.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 pl-9 text-[12px] font-semibold uppercase tracking-[0.22em] text-subtle">
                — {firstName} · {mentor.role}
              </figcaption>
            </motion.figure>
          </Container>
        </section>

        {/* =========================================================
            ABOUT + SPECIALTIES + QUICK FACTS
        ========================================================== */}
        <section className="relative py-12 md:py-16">
          <Container size="lg">
            <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
              {/* Main column */}
              <div>
                <SectionTitle
                  eyebrow="About"
                  title={`Why learn with ${firstName}`}
                  sub={`Real production experience translated into clear, hands-on lessons. No theory-only fluff — every session ends with something you can ship.`}
                />

                <div className="mt-7 space-y-5 text-[15px] leading-[1.8] text-muted md:text-[16px]">
                  <p>{mentor.longBio}</p>
                  <p>
                    {firstName} works closely with each mentee on production
                    problems, code reviews, and career strategy — not just
                    syllabus material. Expect direct feedback, war stories from
                    real outages, and the exact playbooks senior engineers use
                    on the job.
                  </p>
                </div>

                {/* Specialties */}
                <div className="mt-10">
                  <Eyebrow>Specialties</Eyebrow>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mentor.specialties.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center rounded-full border border-border bg-elevated px-3 py-1.5 text-[12.5px] font-medium text-text"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recognition */}
                {mentor.achievements?.length > 0 && (
                  <div className="mt-10">
                    <Eyebrow>Recognition</Eyebrow>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {mentor.achievements.map((a) => (
                        <li
                          key={a}
                          className="flex items-start gap-3 rounded-xl border border-border bg-elevated/50 px-4 py-3 text-[13.5px] leading-6 text-muted"
                        >
                          <Award
                            size={14}
                            className="mt-0.5 shrink-0 text-primary"
                            aria-hidden
                          />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sticky quick facts */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-border bg-elevated/60 p-5 backdrop-blur">
                  <Eyebrow>Quick facts</Eyebrow>
                  <dl className="mt-4 divide-y divide-border text-[13.5px]">
                    {[
                      ["Track", mentor.trackLabel],
                      ["Based in", mentor.location],
                      ["Experience", `${mentor.yearsExp}+ years`],
                      ["Sessions led", `${mentor.sessions}+`],
                      ["Total learners", mentor.learners],
                      [
                        "Availability",
                        mentor.available ? "Open this week" : "Waitlist",
                      ],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-right font-medium text-text">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Button
                    href="#contact-mentor"
                    size="md"
                    fullWidth
                    className="mt-5"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Request a session
                  </Button>
                  <p className="mt-2.5 text-center text-[11.5px] text-subtle">
                    Cancel anytime · no card required
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* =========================================================
            EXPERIENCE TIMELINE
        ========================================================== */}
        {mentor.experience?.length > 0 && (
          <section className="relative py-12 md:py-16">
            <Container size="lg">
              <SectionTitle
                eyebrow="Career"
                title="A decade of production scars"
                sub="The roles, the rooms, the systems that shaped how they teach."
              />

              <ol className="relative mt-10 space-y-7 border-l border-border pl-7 md:pl-9">
                {mentor.experience.map((e, i) => (
                  <motion.li
                    key={`${e.org}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Dot + ring */}
                    <span
                      aria-hidden
                      className="absolute -left-[34px] top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-bg md:-left-[40px]"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-[17px] font-semibold tracking-tight text-text">
                        {e.title}
                        <span className="mx-2 text-subtle" aria-hidden>
                          ·
                        </span>
                        <span className="text-muted">{e.org}</span>
                      </h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/60 px-2.5 py-1 text-[11.5px] font-medium text-muted">
                        <Calendar size={11} aria-hidden />
                        {e.period}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-7 text-muted">
                      {e.text}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </Container>
          </section>
        )}

        {/* =========================================================
            COURSES TAUGHT
        ========================================================== */}
        {mentor.taughtCourses?.length > 0 && (
          <section className="relative py-12 md:py-16">
            <Container size="lg">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionTitle
                  eyebrow="What they teach"
                  title={`Courses by ${firstName}`}
                  sub={`Tracks designed and delivered personally by ${firstName} — every module built around real production work.`}
                />
                <Link
                  to="/#courses"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  Browse all tracks
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mentor.taughtCourses.map((c, i) => (
                  <motion.article
                    key={c.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                    className="group/course relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-card)]"
                  >
                    {/* Hairline accent on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary via-primary to-accent transition-transform duration-300 group-hover/course:scale-x-100"
                    />
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        LEVEL_TONE[c.level] || LEVEL_TONE.Intermediate
                      }`}
                    >
                      {c.level}
                    </span>
                    <h3 className="mt-3 font-display text-[16.5px] font-semibold leading-snug tracking-tight text-text">
                      {c.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-x-4 gap-y-1.5 pt-5 text-[12.5px] text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={13} aria-hidden />
                        {c.modules} modules
                      </span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} aria-hidden />
                        {c.hours}h video
                      </span>
                    </div>
                    <Link
                      to="/#courses"
                      className="mt-4 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                      View course
                      <ArrowUpRight size={13} aria-hidden />
                    </Link>
                  </motion.article>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* =========================================================
            CONTACT CTA
        ========================================================== */}
        <section
          id="contact-mentor"
          className="relative py-12 md:py-16"
          aria-labelledby="contact-mentor-title"
        >
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
                  <Eyebrow>1:1 mentorship</Eyebrow>
                  <h2
                    id="contact-mentor-title"
                    className="mt-2 font-display text-[26px] font-bold tracking-[-0.01em] text-text md:text-[34px]"
                  >
                    Ready to learn with {firstName}?
                  </h2>
                  <p className="mt-3 max-w-[560px] text-[14.5px] leading-7 text-muted md:text-[16px]">
                    Book a 1:1 session, ask a question, or join one of their
                    live cohorts. We&rsquo;ll match you to the right format.
                  </p>
                  {/* trust line */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-subtle">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2
                        size={12}
                        className="text-success"
                        aria-hidden
                      />
                      7-day free trial
                    </span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2
                        size={12}
                        className="text-success"
                        aria-hidden
                      />
                      No credit card
                    </span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2
                        size={12}
                        className="text-success"
                        aria-hidden
                      />
                      Cancel anytime
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    to="/signup"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Start free trial
                  </Button>
                  <Button to="/#contact" variant="outline" size="lg">
                    Send a message
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* =========================================================
            OTHER MENTORS
        ========================================================== */}
        {otherMentors.length > 0 && (
          <section className="relative pb-16 pt-2 md:pb-20">
            <Container size="lg">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <SectionTitle
                  eyebrow="Keep exploring"
                  title="More mentors you may like"
                />
                <Link
                  to="/mentors"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover"
                >
                  See all
                  <ArrowRight size={13} aria-hidden />
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherMentors.map((m, i) => (
                  <motion.div
                    key={m.slug}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/mentors/${m.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-elevated p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          loading="lazy"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-display text-[15px] font-semibold tracking-tight text-text">
                            {m.name}
                          </div>
                          <div className="truncate text-[12.5px] text-muted">
                            {m.role} at {m.company.replace(/^Ex-/, "")}
                          </div>
                        </div>
                        <ArrowUpRight
                          size={14}
                          aria-hidden
                          className="shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                        />
                      </div>
                      <p className="mt-4 line-clamp-2 text-[13px] leading-6 text-muted">
                        {m.bio}
                      </p>
                      <div className="mt-auto flex items-center gap-x-3 gap-y-1.5 pt-4 text-[12px] text-subtle">
                        <span className="inline-flex items-center gap-1.5">
                          <Star
                            size={12}
                            className="fill-current text-primary"
                            aria-hidden
                          />
                          <span className="text-text">{m.rating}</span>
                        </span>
                        <span aria-hidden>·</span>
                        <span>
                          <span className="text-text">{m.courses}</span> courses
                        </span>
                        <span aria-hidden>·</span>
                        <span>
                          <span className="text-text">{m.learners}</span>{" "}
                          learners
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
