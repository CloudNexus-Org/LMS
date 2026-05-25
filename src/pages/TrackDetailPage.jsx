import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Briefcase,
  Sparkles,
  BookOpen,
  Network,
  Search,
  Rocket,
  ClipboardCheck,
  Link2,
  ChevronDown,
} from "lucide-react";
import { tracks, getTrackById } from '@/data/tracks';
import { getMentorBySlug } from '@/data/mentors';
import Container from '@/components/ui/Container';
import {
  EASE,
  COLOR_TINT,
  SectionTitle,
  RevealSection,
  SectionDivider,
} from '@/components/ui/PremiumUI';
import TrackHero from "@/features/tracks/components/TrackHero";
import PremiumCurriculum from "@/features/tracks/components/PremiumCurriculum";
import PremiumProjects from "@/features/tracks/components/PremiumProjects";



function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <li className={`group/faq relative overflow-hidden rounded-2xl border border-border bg-elevated/20 transition-all duration-300 ${isOpen ? "bg-elevated/35 border-primary/30 shadow-md shadow-primary/[0.03]" : "hover:bg-elevated/30 hover:border-primary/10"} card-shimmer`}>
      {/* Left indicator active line */}
      <div aria-hidden className={`absolute inset-y-0 left-0 w-[3px] bg-primary/20 transition-all duration-300 ${isOpen ? "bg-primary shadow-[0_0_12px_var(--primary)]" : "group-hover/faq:bg-primary/20"}`} />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-6 p-6 text-left"
      >
        <span className={`font-display text-[16px] font-bold tracking-tight transition-colors duration-300 sm:text-[17px] ${isOpen ? "text-primary" : "text-text group-hover/faq:text-primary/95"}`}>
          {q}
        </span>
        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-bg/50 text-muted group-hover/faq:border-primary/20 group-hover/faq:text-primary"}`}>
          <ChevronDown
            size={16}
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
          className="border-t border-border/40 bg-bg/25 px-6 pb-6 pt-5 text-[15px] leading-relaxed text-muted"
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
  const [openFaq, setOpenFaq] = useState(null);

  if (!track) {
    return <Navigate to="/" replace />;
  }

  const accent = COLOR_TINT[track.color] || COLOR_TINT.primary;
  const mentor = track.leadMentorSlug
    ? getMentorBySlug(track.leadMentorSlug)
    : null;
  const others = tracks.filter((t) => t.id !== track.id).slice(0, 3);



  return (
    <div className="min-h-screen bg-bg text-text">


      <main id="main" className="relative">
        {/* ================= HERO ================= */}
        <TrackHero track={track} />

        {/* ================= CURRICULUM ================= */}
        <PremiumCurriculum track={track} />

        {/* ================= PROJECTS SHOWCASE ================= */}
        <PremiumProjects track={track} />

        {/* ================= WHAT YOU'LL LEARN ================= */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Ambient background */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
            <div className="absolute bottom-0 right-[15%] h-[350px] w-[350px] rounded-full bg-primary/[0.025] blur-[100px]" />
          </div>

          <Container size="lg" className="relative">
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
            <div className="mt-10 max-w-[900px] mx-auto grid gap-6 sm:grid-cols-2">
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
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: i * 0.08,
                    }}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-[1.75rem] border border-border bg-elevated/20 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/45 hover:bg-elevated/35 hover:shadow-2xl hover:shadow-primary/[0.05] card-shimmer"
                  >
                    {/* Immersive Blueprint Grid Overlay */}
                    <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]" />

                    {/* Floating Glow Index Marker */}
                    <div aria-hidden className="absolute -right-2 -bottom-2 font-display text-[72px] font-black leading-none text-border/10 select-none transition-all duration-500 group-hover:text-primary/10 group-hover:scale-105">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Left premium thick accent neon line */}
                    <div
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[4px] bg-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:shadow-[0_0_15px_var(--primary)]"
                    />

                    {/* Highly polished Icon frame */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-bg/50 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/20">
                      <div className="absolute inset-0.5 rounded-[14px] bg-primary/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <OutcomeIcon
                        size={22}
                        className="text-primary transition-all duration-300 group-hover:scale-105"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </div>

                    {/* Content text */}
                    <div className="min-w-0 flex-1 relative z-10 pr-2">
                      <h3 className="font-display text-[15.5px] font-bold tracking-tight text-text leading-snug transition-colors duration-300 group-hover:text-primary">
                        {outcome}
                      </h3>
                    </div>

                    {/* Minimalist Tech Arrow */}
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-bg/30 text-muted transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/[0.08] group-hover:text-primary">
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="relative overflow-hidden py-16 md:py-10">
          {/* Ambient Cosmic Glow */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[400px] w-[800px] rounded-full bg-primary/[0.04] blur-[150px] animate-pulse duration-[6s]" />
          </div>

          <Container size="lg" className="relative">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles size={14} className="text-primary" />
                <span>Tech Stack</span>
              </span>
              <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px] headline-gradient">
                Master the tools of the trade
              </h2>
              <p className="mx-auto mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-muted">
                Get hands-on with the exact same enterprise technologies that power the world's most scalable applications.
              </p>
            </div>

            {/* Glowing Holographic Skill Tags */}
            <div className="mx-auto mt-14 flex max-w-[950px] flex-wrap justify-center gap-4">
              {track.skills.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                  className="group relative overflow-hidden rounded-[1.25rem] border border-border bg-elevated/20 px-6 py-4.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/45 hover:bg-elevated/35 hover:shadow-xl hover:shadow-primary/[0.05] card-shimmer"
                >
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="relative z-10 flex items-center gap-3">
                    {/* Pulsing micro-service status node */}
                    <div className="h-2 w-2 rounded-full bg-primary/40 transition-all duration-300 group-hover:bg-primary group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-display text-[15px] font-bold text-text transition-colors duration-300 group-hover:text-primary">
                      {s}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>


        <RevealSection className="py-16 md:py-24">
          <SectionDivider />
          <Container size="lg" className="mt-14">
            <div className="text-center md:text-left">
              <SectionTitle eyebrow="Mentor" title="Who you'll learn from" />
            </div>

            {/* Premium Spotlight Card */}
            <div className="group/mentor relative mt-8 overflow-hidden rounded-[2.5rem] border border-border bg-elevated/20 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-elevated/35 hover:shadow-2xl hover:shadow-primary/[0.05] card-shimmer">
              {/* Internal Mesh Orbs for Ambient Backlighting */}
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-[60px] opacity-0 transition-opacity duration-500 group-hover/mentor:opacity-100" />
                <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/10 blur-[60px] opacity-0 transition-opacity duration-500 group-hover/mentor:opacity-100" />
              </div>

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                {/* Glowing Avatar Frame */}
                <div className="relative self-center shrink-0 transition-transform duration-500 group-hover/mentor:scale-105">
                  <img
                    src={mentor?.avatar || track.leadMentor.photo}
                    alt={track.leadMentor.name}
                    className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20 transition-all duration-300 group-hover/mentor:ring-primary/45 md:h-32 md:w-32"
                  />
                  <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-bg bg-primary text-white shadow-md">
                    <Star size={14} className="fill-current" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-[22px] font-bold tracking-tight text-text md:text-[26px]">
                      {track.leadMentor.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-primary">
                      Lead Instructor
                    </span>
                  </div>
                  <p className="mt-1 text-[14.5px] font-semibold text-primary">
                    {track.leadMentor.role}
                  </p>
                  <p className="mt-3 max-w-[700px] text-[14px] leading-relaxed text-muted">
                    {mentor?.longBio ||
                      `${track.leadMentor.name} leads the ${track.name} track at Cloud Nexus and brings deep production experience to every cohort.`}
                  </p>
                  {mentor?.specialties?.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {mentor.specialties.slice(0, 5).map((s) => (
                        <span key={s} className="inline-flex items-center rounded-xl border border-border bg-bg/50 px-3.5 py-1.5 text-[12.5px] font-medium text-text transition-colors duration-300 hover:border-primary/30 hover:bg-elevated">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {mentor ? (
                  <Link
                    to={`/mentors/${mentor.slug}`}
                    className="inline-flex items-center gap-2 self-center rounded-2xl bg-primary/10 border border-primary/20 px-6 py-3.5 text-[13.5px] font-bold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
                  >
                    Full profile
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                ) : null}
              </div>
            </div>
          </Container>
        </RevealSection>

        {/* ================= PROJECTS ================= */}
        {track.projects?.length > 0 && (
          <RevealSection className="relative py-24 md:py-32">
            {/* Ambient Backlighting */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[160px]" />

            <Container size="lg">
              <div className="mb-20 flex flex-col items-center text-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Briefcase size={14} className="text-primary" />
                  Capstone
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px] headline-gradient">
                  Projects you'll ship
                </h2>
                <p className="mt-4 max-w-[620px] text-[15.5px] leading-relaxed text-muted">
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
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-border bg-elevated/20 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/45 hover:bg-elevated/30 hover:shadow-2xl hover:shadow-primary/[0.05] card-shimmer"
                  >
                    {/* Futuristic Grid Outline Background */}
                    <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]" />

                    {/* Glowing Accent Gradient Tag */}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="mb-8 flex items-center justify-between relative z-10">
                      <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accent.bg} ${accent.text} border border-primary/20 shadow-md shadow-primary/[0.04] transition-all duration-300 group-hover:scale-110`}>
                        <Briefcase size={22} aria-hidden />
                      </span>
                      <span className="font-display text-[48px] font-black leading-none text-border/20 transition-colors duration-300 group-hover:text-primary/10 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-display text-[19px] font-bold tracking-tight text-text relative z-10 transition-colors duration-300 group-hover:text-primary">
                      {p.title}
                    </h3>

                    <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-muted relative z-10 pr-2">
                      {p.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </Container>
          </RevealSection>
        )}



    

        {/* ================= FAQ ================= */}
        {track.faq?.length > 0 && (
          <RevealSection className="py-18 md:py-25">
            <Container size="lg">
              <div className="mb-20 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  FAQ
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[48px] headline-gradient">
                  Common questions
                </h2>
              </div>
              <div className="mx-auto max-w-[850px]">
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
