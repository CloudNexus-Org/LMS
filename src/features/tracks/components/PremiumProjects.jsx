import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code2, HeartPulse, ShoppingCart, Brain, BarChart3, Users, Layers, Rocket, Globe, Database, Sparkles } from 'lucide-react';

/* ─── 12 Real-world projects ─── */
const ALL_PROJECTS = [
  {
    id: '[01]',
    title: 'AI POWERED DISCORD ASSISTANT',
    description: 'Generative AI assistant that transforms Discord into an intelligent, multi-modal hub with context-aware responses.',
    Icon: Bot,
  },
  {
    id: '[02]',
    title: 'AI CODE REVIEWER',
    description: 'Automated multi-agent pipeline that performs deep static analysis, detects bugs, and enforces code quality standards.',
    Icon: Code2,
  },
  {
    id: '[03]',
    title: 'HEALTH RISK ASSESSMENT',
    description: 'ML-powered decision tree model that delivers real-time, personalised health-risk scores from patient vitals.',
    Icon: HeartPulse,
  },
  {
    id: '[04]',
    title: 'SMART INVENTORY & BILLING',
    description: 'End-to-end inventory management system with automated restocking triggers and integrated POS billing.',
    Icon: ShoppingCart,
  },
  {
    id: '[05]',
    title: 'PATIENT ADHERENCE PREDICTOR',
    description: 'Predicts medication non-adherence using behavioural signals and sends proactive intervention alerts.',
    Icon: Brain,
  },
  {
    id: '[06]',
    title: 'HR ATTRITION DASHBOARD',
    description: 'Interactive analytics dashboard that identifies flight-risk employees using XGBoost classification models.',
    Icon: BarChart3,
  },
  {
    id: '[07]',
    title: 'CUSTOMER SEGMENTATION MODEL',
    description: 'DBSCAN and K-Means clustering pipeline that segments customers for hyper-personalised marketing campaigns.',
    Icon: Users,
  },
  {
    id: '[08]',
    title: 'REALTIME COLLABORATION TOOL',
    description: 'Figma-style multiplayer document editor with CRDT conflict resolution and presence awareness built in Go.',
    Icon: Globe,
  },
  {
    id: '[09]',
    title: 'MULTI-TENANT SAAS STARTER',
    description: 'Production-ready SaaS boilerplate with Stripe billing, role-based auth, organisation namespacing and audit logs.',
    Icon: Layers,
  },
  {
    id: '[10]',
    title: 'DEVOPS PIPELINE ORCHESTRATOR',
    description: 'Self-healing CI/CD orchestrator with cost-aware auto-scaling policies and Slack incident notifications.',
    Icon: Rocket,
  },
  {
    id: '[11]',
    title: 'BOOK VAULT — LIBRARY SYSTEM',
    description: 'Full-stack library management platform with a semantic recommendation engine powered by sentence transformers.',
    Icon: Database,
  },
];

const CARD_WIDTH = 290;   // px
const CARD_GAP   = 20;    // px — matches gap-5
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

// Brand Colors
const BRAND_BLUE = '#215cff';
const BRAND_BLUE_LIGHT = '#4b79ff';
const BRAND_BLUE_DARK = '#1d4ed8';

/* ─── Individual Card ─── */
function ProjectCard({ project, index }) {
  const { id, title, description, Icon } = project;
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        height: 380,
        flexShrink: 0,
        position: 'relative',
        borderRadius: 20,
        backgroundColor: '#0a0a0a',
        border: hovered ? `1px solid rgba(75, 121, 255, 0.35)` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered
          ? `0 20px 60px -10px rgba(33, 92, 255, 0.35), 0 0 0 1px rgba(33, 92, 255, 0.15)`
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.03) translateY(-4px)' : 'scale(1) translateY(0)',
        overflow: 'hidden',
        cursor: 'default',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(75, 121, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75, 121, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Cursor-following spotlight */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(75, 121, 255, 0.18) 0%, transparent 55%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Pulsing bottom border glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(33, 92, 255, 0.6), transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top row: id + icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
          }}>
            {id}
          </span>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: hovered ? `rgba(33, 92, 255, 0.15)` : 'rgba(255,255,255,0.04)',
            border: hovered ? `1px solid rgba(33, 92, 255, 0.4)` : '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <Icon size={18} color={hovered ? BRAND_BLUE_LIGHT : 'rgba(255,255,255,0.3)'} style={{ transition: 'color 0.3s ease' }} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 19,
          fontWeight: 800,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          color: hovered ? BRAND_BLUE_LIGHT : '#f5f5f5',
          transition: 'color 0.3s ease',
          marginBottom: 16,
        }}>
          {title}
        </h3>

        {/* Divider */}
        <div style={{
          width: 32,
          height: 2,
          borderRadius: 2,
          backgroundColor: hovered ? `rgba(33, 92, 255, 0.5)` : 'rgba(255,255,255,0.08)',
          transition: 'background-color 0.3s ease',
          marginBottom: 16,
        }} />

        {/* Description */}
        <p style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.45)',
          flex: 1,
        }}>
          {description}
        </p>

        {/* Bottom tag */}
        <div style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <Sparkles size={12} color="rgba(75, 121, 255, 0.6)" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
            Portfolio Grade
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CTA Card ─── */
function CtaCard({ totalCount }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        height: 380,
        flexShrink: 0,
        position: 'relative',
        borderRadius: 20,
        backgroundColor: '#050a14',
        border: hovered ? `1px solid rgba(75, 121, 255, 0.5)` : `1px solid rgba(33, 92, 255, 0.2)`,
        boxShadow: hovered
          ? `0 30px 80px -10px rgba(33, 92, 255, 0.4), 0 0 0 1px rgba(33, 92, 255, 0.2)`
          : `0 8px 40px rgba(33, 92, 255, 0.1)`,
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'scale(1.05) translateY(-6px)' : 'scale(1) translateY(0)',
        overflow: 'hidden',
        cursor: 'default',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(75, 121, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(75, 121, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />

      {/* Strong center glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, rgba(33, 92, 255, 0.2) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'rgba(75, 121, 255, 0.6)',
          letterSpacing: '0.15em',
        }}>
          (+more)
        </span>
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1,
            color: BRAND_BLUE_LIGHT,
            letterSpacing: '-0.04em',
          }}>
            {totalCount}+
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 900,
            color: BRAND_BLUE_LIGHT,
            letterSpacing: '-0.02em',
            marginTop: 4,
            opacity: 0.85,
          }}>
            PROJECTS
          </div>
        </div>

        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 16,
          lineHeight: 1.5,
          maxWidth: 240,
        }}>
          Build a portfolio that speaks louder than any resume.
        </p>
      </div>

      {/* CTA button */}
      <button
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: '16px 24px',
          borderRadius: 0,
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          background: hovered
            ? `linear-gradient(135deg, ${BRAND_BLUE_LIGHT}, ${BRAND_BLUE})`
            : `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE_DARK})`,
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.01em',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: hovered
            ? `0 0 40px rgba(33, 92, 255, 0.6), 0 8px 24px rgba(33, 92, 255, 0.4)`
            : `0 0 20px rgba(33, 92, 255, 0.3)`,
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        View All Projects
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function PremiumProjects({ track }) {
  const trackRef = useRef(null);
  const [glowX, setGlowX] = useState(50);

  /* Build final project list */
  const rawProjects = track?.projects?.length > 0
    ? track.projects.map((p, i) => ({
        id: `[${String(i + 1).padStart(2, '0')}]`,
        title: p.title.toUpperCase(),
        description: p.description,
        Icon: ALL_PROJECTS[i % ALL_PROJECTS.length].Icon,
      }))
    : ALL_PROJECTS;

  const totalCount = Math.max(rawProjects.length * 4 + 12, 44);

  /* Dynamically center if all cards fit in the viewport */
  const [isCentered, setIsCentered] = useState(false);
  useEffect(() => {
    const checkWidth = () => {
      // Total cards = rawProjects + 1 (CtaCard)
      const totalWidth = (rawProjects.length + 1) * (CARD_WIDTH + CARD_GAP) - CARD_GAP;
      setIsCentered(window.innerWidth > totalWidth + 96); // 96px for padding
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [rawProjects.length]);

  /* Click-to-scroll with wrap-around */
  const handleMore = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 10) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      setGlowX(50);
    } else {
      el.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
      const progress = Math.min((el.scrollLeft + SCROLL_STEP) / maxScroll, 1);
      setGlowX(20 + progress * 60);
    }
  }, []);

  /* Update ambient glow position on manual scroll too */
  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = el.scrollLeft / maxScroll;
    setGlowX(20 + progress * 60);
  }, []);

  return (
    <section
      style={{ background: '#000000', position: 'relative', overflow: 'hidden', padding: '60px 0 50px' }}
      aria-labelledby="projects-heading"
    >
      {/* ─── Layered ambient atmosphere ─── */}
      {/* Layer 1: Large blue radial */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          left: `${glowX}%`,
          transform: 'translate(-50%, 0)',
          width: 900,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(33, 92, 255, 0.15) 0%, transparent 65%)`,
          filter: 'blur(80px)',
          transition: 'left 1.2s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: 'none',
        }}
      />
      {/* Layer 2: Deep blue fog */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: `linear-gradient(0deg, rgba(20, 50, 180, 0.05) 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Layer 3: Vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* ─── Staged header ─── */}
        <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: `1px solid rgba(33, 92, 255, 0.3)`,
              background: `rgba(33, 92, 255, 0.06)`,
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            Skills
          </motion.div>

          <motion.h2
            id="projects-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              maxWidth: 900,
              margin: '0 auto 12px',
            }}
          >
            Projects You Will Build To Master<br />
            <span style={{ color: BRAND_BLUE_LIGHT }}>Real-World</span> Development
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              maxWidth: 400,
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            A modern, high-curated gallery of projects built to navigate a smooth horizontal rail.
          </motion.p>
        </div>

        {/* ─── Scrollable card rail ─── */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            gap: CARD_GAP,
            overflowX: 'scroll',
            overflowY: 'visible',
            scrollbarWidth: 'none',         /* Firefox */
            msOverflowStyle: 'none',        /* IE/Edge */
            paddingLeft: 'max(48px, calc((100vw - 1200px) / 2))',
            paddingRight: 'max(48px, calc((100vw - 1200px) / 2))',
            paddingBottom: 20,
            justifyContent: isCentered ? 'center' : 'flex-start',
            scrollSnapType: isCentered ? 'none' : 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          className="hide-scrollbar"
        >
          {rawProjects.map((project, index) => (
            <div key={project.id || index} style={{ scrollSnapAlign: 'start' }}>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
          <div style={{ scrollSnapAlign: 'start' }}>
            <CtaCard totalCount={totalCount} />
          </div>
        </div>

        {/* ─── More pill ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 32 }}>
          <motion.button
            onClick={handleMore}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 32px',
              borderRadius: 0,
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `rgba(75, 121, 255, 0.5)`;
              e.currentTarget.style.boxShadow = `0 0 30px rgba(33, 92, 255, 0.25)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            More
            <ArrowRight size={16} color={BRAND_BLUE_LIGHT} />
          </motion.button>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            Swipe or scroll horizontally to explore
          </span>
        </div>
      </div>

      {/* Hide scrollbar for webkit */}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
