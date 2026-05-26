import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Star,
  GraduationCap,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
} from "lucide-react";
import { mentors, getMentorBySlug } from '@/data/mentors';


import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

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

function SectionTitle({ eyebrow, title, sub, eyebrowClassName }) {
  return (
    <div>
      {eyebrow ? <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow> : null}
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

                <figure className="relative mx-auto w-full max-w-[350px] overflow-hidden rounded-2xl border border-border bg-elevated shadow-[var(--shadow-card)]">
                  {/* Portrait — true square so faces stay framed */}
                  <div className="relative h-[320px] w-full overflow-hidden">
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
              </motion.aside>
            </div>


          </Container>
        </section>

        {/* =========================================================
            QUOTE
        ========================================================== */}
        {/* <section className="relative pb-6 md:pb-10">
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
        </section> */}

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
                        className="inline-flex items-center rounded-full border border-border/60 bg-elevated/50 px-3 py-1.5 text-[12.5px] font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
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
                          className="group flex items-start gap-3 rounded-xl border border-border/60 bg-elevated/40 px-4 py-3 text-[13.5px] leading-6 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-elevated hover:shadow-[0_8px_24px_-8px_rgba(var(--primary-rgb),0.15)]"
                        >
                          <Award
                            size={14}
                            className="mt-0.5 shrink-0 text-primary/70 transition-colors group-hover:text-primary"
                            aria-hidden
                          />
                          <span className="transition-colors group-hover:text-text">{a}</span>
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

                  <div className="group relative mt-5 w-full">
                    <div
                      aria-hidden
                      className="absolute -inset-1 rounded-xl bg-primary/40 opacity-70 blur-xl transition-all duration-300 group-hover:bg-primary/50 group-hover:opacity-100"
                    />
                    <Button
                      href="#contact-mentor"
                      size="md"
                      fullWidth
                      className="relative w-full shadow-lg"
                      rightIcon={<ArrowRight size={14} />}
                    >
                      Request a session
                    </Button>
                  </div>
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
                eyebrowClassName="!text-primary"
                title="A decade of production scars"
                sub="The roles, the rooms, the systems that shaped how they teach."
              />

              <div className="relative mt-10">
                {/* Animated Timeline Line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 1.5, ease: EASE }}
                  className="absolute left-[11.5px] top-0 h-full w-[1px] origin-top bg-border"
                />

                <motion.ol
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="relative space-y-7 pl-10 sm:pl-12"
                >
                  {mentor.experience.map((e, i) => (
                    <motion.li
                      key={`${e.org}-${i}`}
                      variants={{
                        hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
                        show: {
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: { duration: 0.5, ease: EASE },
                        },
                      }}
                      className="relative"
                    >
                      {/* Dot + ring */}
                      <motion.span
                        aria-hidden
                        variants={{
                          hidden: { scale: 0, opacity: 0 },
                          show: {
                            scale: 1,
                            opacity: 1,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                              delay: 0.15,
                            },
                          },
                        }}
                        className="absolute -left-[40px] top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/10 sm:-left-[48px]"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </motion.span>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-[17px] font-semibold tracking-tight text-text">
                          {e.title}
                          <span className="mx-2 text-subtle" aria-hidden>
                            ·
                          </span>
                          <span className="text-primary">{e.org}</span>
                        </h3>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated/60 px-2.5 py-1 text-[11.5px] font-medium text-muted">
                          <Calendar size={11} aria-hidden />
                          {e.period}
                        </span>
                      </div>
                      <div className="mt-3 rounded-lg border border-border/40 bg-elevated/30 px-4 py-3 shadow-sm">
                        <p className="text-[14px] leading-relaxed text-muted">
                          {e.text}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
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
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${LEVEL_TONE[c.level] || LEVEL_TONE.Intermediate
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
          className="relative py-12 md:py-20"
          aria-labelledby="contact-mentor-title"
        >
          <Container size="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="group relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-12 shadow-2xl md:px-14 md:py-16"
            >
              {/* Ambient premium glows */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-primary/20 opacity-50 blur-[100px] transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/30 group-hover:opacity-70"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -right-16 h-[350px] w-[350px] rounded-full bg-accent/20 opacity-50 blur-[100px] transition-all duration-700 group-hover:scale-110 group-hover:bg-accent/30 group-hover:opacity-70"
              />

              <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1fr_auto]">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Eyebrow className="!text-indigo-600 font-bold">1:1 Mentorship</Eyebrow>
                  </motion.div>
                  
                  <motion.h2
                    id="contact-mentor-title"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-3 font-display text-[32px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[36px] md:text-[42px]"
                  >
                    Ready to level up with{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      {firstName}
                    </span>
                    ?
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 max-w-[500px] text-[15.5px] leading-relaxed text-gray-600 md:text-[17px]"
                  >
                    Book a 1:1 session, ask a technical question, or join one of their
                    live cohorts. We&rsquo;ll match you to the format that fits your goals.
                  </motion.p>

                  {/* trust line */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-medium text-gray-700"
                  >
                    {[
                      "7-day free trial",
                      "No credit card required",
                      "Cancel anytime",
                    ].map((text) => (
                      <div key={text} className="flex items-center gap-2.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle2 size={13} strokeWidth={2.5} aria-hidden />
                        </div>
                        {text}
                      </div>
                    ))}
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                >
                  <div className="group/btn relative">
                    <div
                      className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-primary to-accent opacity-40 blur-lg transition-all duration-300 group-hover/btn:opacity-80 group-hover/btn:blur-xl"
                      aria-hidden
                    />
                    <Button
                      to="/signup"
                      size="lg"
                      className="relative w-full shadow-xl sm:w-auto md:w-full lg:w-auto"
                      rightIcon={<ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />}
                    >
                      Start free trial
                    </Button>
                  </div>
                  <Button
                    to="/#contact"
                    variant="outline"
                    size="lg"
                    className="w-full border-gray-300 bg-white !text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 sm:w-auto md:w-full lg:w-auto"
                  >
                    Send a message
                  </Button>
                </motion.div>
              </div>
            </motion.div>
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


    </div>
  );
}
