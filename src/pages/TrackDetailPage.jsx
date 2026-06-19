import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Sparkles,
  BookOpen,
  Network,
  Search,
  Rocket,
  ClipboardCheck,
  Link2,
  ChevronDown,
  Database,
  Boxes,
  Plug,
  Activity,
  Cpu,
} from "lucide-react";
import { getTrackById } from '@/data/tracks';
import { getMentorBySlug } from '@/data/mentors';
import Container from '@/components/ui/Container';
import useIsDarkTheme from '@/hooks/useIsDarkTheme';
import bgDark from '@/assets/hero-section/custom_dark_bg.png';
import bgLight from '@/assets/hero-section/custom_light_bg.png';
import {
  EASE,
  SectionTitle,
  RevealSection,
  SectionDivider,
} from '@/components/ui/PremiumUI';
import TrackHero from "@/features/tracks/components/TrackHero";
import PremiumCurriculum from "@/features/tracks/components/PremiumCurriculum";



function FaqItem({ q, a, isOpen, onToggle, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-[10px] border border-border bg-elevated transition-colors duration-300 hover:border-primary/50`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-5 p-5 text-left outline-none sm:px-6 sm:py-5"
      >
        <span
          className={`font-sans text-[15.5px] sm:text-[16px] font-medium tracking-wide transition-colors ${
            isOpen ? "text-text" : "text-muted group-hover:text-text"
          }`}
        >
          {q}
        </span>
        
        <ChevronDown
          size={20}
          strokeWidth={2}
          aria-hidden
          className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-text" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pb-6 pt-1 text-[15px] leading-relaxed text-muted sm:px-6">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function TrackDetailPage() {
  const { id } = useParams();
  const track = useMemo(() => getTrackById(id), [id]);
  const [openFaq, setOpenFaq] = useState(null);

  if (!track) {
    return <Navigate to="/" replace />;
  }

  const mentor = track.leadMentorSlug
    ? getMentorBySlug(track.leadMentorSlug)
    : null;



  const isDarkTheme = useIsDarkTheme();

  return (
    <div 
      className="min-h-screen text-text"
      style={{
        backgroundImage: `url(${isDarkTheme ? bgDark : bgLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >


      <main id="main" className="relative">
        {/* ================= HERO ================= */}
        <TrackHero track={track} />

        {/* ================= CURRICULUM ================= */}
        <PremiumCurriculum track={track} />


        {/* ================= WHAT YOU'LL LEARN ================= */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Ambient background */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
            <div className="absolute bottom-0 right-[15%] h-[350px] w-[350px] rounded-full bg-primary/[0.025] blur-[100px]" />
          </div>

          <Container size="lg" className="relative">
            {/* â”€â”€â”€ HEADER â”€â”€â”€ */}
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

            {/* â”€â”€â”€ FEATURE CARDS â”€â”€â”€ */}
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

            {/* Colorful Brand-Logo Skill Chips */}
            {(() => {
              // Brand color + logo mapping
              const SKILL_META = {
                'AWS':            { color: '#FF9900', bg: 'rgba(255,153,0,0.12)',  logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
                'Azure':          { color: '#0078D4', bg: 'rgba(0,120,212,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
                'GCP':            { color: '#34A853', bg: 'rgba(52,168,83,0.12)',  logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
                'Terraform':      { color: '#7B42BC', bg: 'rgba(123,66,188,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
                'Kubernetes':     { color: '#326CE5', bg: 'rgba(50,108,229,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
                'Linux':          { color: '#FCC624', bg: 'rgba(252,198,36,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
                'IAM':            { color: '#FF4F00', bg: 'rgba(255,79,0,0.12)',   logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
                'Docker':         { color: '#2496ED', bg: 'rgba(36,150,237,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
                'Python':         { color: '#3776AB', bg: 'rgba(55,118,171,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                'React':          { color: '#61DAFB', bg: 'rgba(97,218,251,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                'Next.js':        { color: '#ffffff', bg: 'rgba(255,255,255,0.08)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
                'TypeScript':     { color: '#3178C6', bg: 'rgba(49,120,198,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
                'Node.js':        { color: '#339933', bg: 'rgba(51,153,51,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                'PostgreSQL':     { color: '#4169E1', bg: 'rgba(65,105,225,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
                'MongoDB':        { color: '#47A248', bg: 'rgba(71,162,72,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
                'Redis':          { color: '#DC382D', bg: 'rgba(220,56,45,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
                'GraphQL':        { color: '#E10098', bg: 'rgba(225,0,152,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
                'TensorFlow':     { color: '#FF6F00', bg: 'rgba(255,111,0,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
                'GitHub':         { color: '#ffffff', bg: 'rgba(255,255,255,0.08)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
                'Jenkins':        { color: '#D33833', bg: 'rgba(211,56,51,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
                'Go (Golang)':    { color: '#00ADD8', bg: 'rgba(0,173,216,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
                'Java':           { color: '#ED8B00', bg: 'rgba(237,139,0,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
                'MySQL':          { color: '#4479A1', bg: 'rgba(68,121,161,0.12)',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
                'VPC Networking': { color: '#FF9900', bg: 'rgba(255,153,0,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
                'Cost Optimization': { color: '#34A853', bg: 'rgba(52,168,83,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
                'System Design':  { color: '#7B42BC', bg: 'rgba(123,66,188,0.12)',logo: null, icon: Cpu },
                'LangChain':      { color: '#1DB954', bg: 'rgba(29,185,84,0.12)', logo: null, icon: Link2 },
                'RAG':            { color: '#E10098', bg: 'rgba(225,0,152,0.12)', logo: null, icon: Database },
                'Azure ML':       { color: '#0078D4', bg: 'rgba(0,120,212,0.12)', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
                'Microservices':  { color: '#FF6F00', bg: 'rgba(255,111,0,0.12)', logo: null, icon: Boxes },
                'REST APIs':      { color: '#61DAFB', bg: 'rgba(97,218,251,0.12)', logo: null, icon: Plug },
                'WebSockets':     { color: '#4B0082', bg: 'rgba(75,0,130,0.12)',   logo: null, icon: Activity },
              };

              return (
                <div className="mx-auto mt-14 flex max-w-[1000px] flex-wrap justify-center gap-3">
                  {track.skills.map((skill, i) => {
                    const meta = SKILL_META[skill] || { color: '#215cff', bg: 'rgba(33,92,255,0.1)', logo: null };
                    return (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                        whileHover={{ scale: 1.08, y: -4 }}
                        className="group relative flex items-center gap-2.5 rounded-2xl border px-4 py-3 cursor-default transition-all duration-300"
                        style={{
                          backgroundColor: meta.bg,
                          borderColor: `${meta.color}40`,
                          boxShadow: `0 2px 16px ${meta.color}10`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = `0 8px 30px ${meta.color}35`;
                          e.currentTarget.style.borderColor = `${meta.color}80`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = `0 2px 16px ${meta.color}10`;
                          e.currentTarget.style.borderColor = `${meta.color}40`;
                        }}
                      >
                        {/* Logo, Lucide Icon, or colored dot */}
                        {meta.logo ? (
                          <img
                            src={meta.logo}
                            alt={skill}
                            className="w-5 h-5 object-contain shrink-0"
                            draggable={false}
                          />
                        ) : meta.icon ? (
                          <meta.icon
                            size={18}
                            className="shrink-0"
                            style={{ color: meta.color }}
                            aria-hidden
                          />
                        ) : (
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                          />
                        )}
                        <span
                          className="font-display text-[14px] font-bold whitespace-nowrap"
                          style={{ color: meta.color }}
                        >
                          {skill}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
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
                    className="inline-flex items-center gap-2 self-center bg-primary/10 border border-primary/20 px-6 py-3.5 text-[13.5px] font-bold text-primary transition-all duration-300  hover:bg-primary hover:text-white  hover:shadow-primary/20"
                  >
                    Full profile
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                ) : null}
              </div>
            </div>
          </Container>
        </RevealSection>


        {/* ================= FAQ ================= */}
        {track.faq?.length > 0 && (
          <RevealSection className="py-18 md:py-25">
            <Container size="lg">
              <div className="mb-20 text-center flex flex-col items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Sparkles size={14} />
                  Clear Your Doubts
                </span>
                <h2 className="mt-6 font-display text-[32px] font-black tracking-tight text-text sm:text-[40px] md:text-[52px] headline-gradient">
                  Everything you need to know.
                </h2>
                <p className="mt-5 max-w-[600px] text-[16px] leading-relaxed text-zinc-400">
                  Find answers to common questions about prerequisites, the curriculum, and how this track can accelerate your engineering career.
                </p>
              </div>
              <div className="mx-auto max-w-[850px]">
                <ul className="space-y-3">
                  {track.faq.map((f, i) => (
                    <FaqItem
                      key={f.q}
                      index={i}
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
      </main>
    </div>
  );
}
