import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Users,
  BookOpen,
} from "lucide-react";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import { mentors as ALL_MENTORS_DATA } from "@/data/mentors";

/* ─────────────────────────────────────────
   Mentor data
───────────────────────────────────────── */
const PAGES = [
  ALL_MENTORS_DATA.slice(0, 4),
  ALL_MENTORS_DATA.slice(4, 8),
];

const COMPANIES = ["Google", "Meta", "AWS", "Netflix", "Stripe", "GitHub"];

function MentorCard({ mentor }) {
  const mentorSlug = mentor.slug || mentor.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative rounded-[22px] shadow-lg hover:shadow-2xl cursor-pointer transition-shadow duration-500 w-full"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
    >
      {/* Inner wrapper enforcing border radius clip */}
      <Link
        to={`/mentors/${mentorSlug}`}
        className="block relative w-full h-full overflow-hidden rounded-[22px]"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Portrait */}
        <div className="h-[360px] overflow-hidden bg-gray-200">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 will-change-transform group-hover:scale-[1.07]"
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-[22px] pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-in-out bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12" />
        </div>

        {/* Text content slides up on hover */}
        <div className="absolute bottom-0 left-0 w-full p-5 z-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <span
            className="block text-[10.5px] font-bold tracking-[0.18em] uppercase mb-1.5"
            style={{ color: "rgba(100,160,255,0.85)" }}
          >
            {mentor.company}
          </span>
          <h3 className="text-white text-[19px] font-bold tracking-tight leading-snug">
            {mentor.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
            />
            <p className="text-gray-300 text-[13px] font-medium">{mentor.role}</p>
          </div>

          {/* Stats strip slides up on hover */}
          <div className="mt-3 flex items-center gap-5 border-t border-white/10 pt-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-1.5 text-white/60 text-[12px]">
              <BookOpen size={11} style={{ color: "var(--primary)" }} />
              <span className="font-bold text-white">{mentor.courses}</span>&nbsp;Courses
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-[12px]">
              <Users size={11} style={{ color: "var(--primary)" }} />
              <span className="font-bold text-white">{mentor.learners}</span>&nbsp;Learners
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main exported section
───────────────────────────────────────── */
export default function Mentors() {
  const isDark = useIsDarkTheme();
  const [paused, setPaused] = useState(false);

  /* ── Theme tokens ── */
  const sectionBg = isDark ? "#0a0a0a" : "#ffffff";
  const headingColor = isDark ? "#ffffff" : "#0f172a";   // slate-950 in light
  const subTextColor = isDark ? "#94a3b8" : "#475569";   // slate-600 in light
  const strongColor = isDark ? "#f1f5f9" : "#0f172a";
  const badgeBg = isDark ? "rgba(33,92,255,0.12)" : "rgba(33,92,255,0.08)";
  const badgeBorder = isDark ? "rgba(33,92,255,0.25)" : "rgba(33,92,255,0.20)";
  const pillBg = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const pillBorder = isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0";
  const pillText = isDark ? "#64748b" : "#64748b";
  const dividerColor = isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0";
  const ctaBg = isDark ? "#ffffff" : "#2c5bff"; 
  const ctaText = isDark ? "#0f172a" : "#ffffff";
  const ctaHoverBg = isDark ? "#f1f5f9" : "#1e293b";
  const blobColor = isDark ? "rgba(33,92,255,0.06)" : "rgba(33,92,255,0.04)";

  return (
    <section
      id="mentors"
      style={{ background: sectionBg, position: "relative", overflow: "hidden" }}
      className="py-24 px-6"
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-10%", left: "30%",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${blobColor} 0%, transparent 70%)`,
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "-10%", right: "20%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${blobColor} 0%, transparent 70%)`,
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>

        {/* ══════════════ HEADING ══════════════ */}
        <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 720, margin: "0 auto 64px" }}>
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 18px", borderRadius: 999,
              background: badgeBg, border: `1px solid ${badgeBorder}`,
              color: "var(--primary)", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.2em",
              marginBottom: 24,
            }}
          >
            <Sparkles size={12} />
            World-Class Mentorship
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              color: headingColor,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Meet the{" "}
            <span
              style={{
                display: "inline-block",
                position: "relative",
                background: "linear-gradient(135deg, #215cff 0%, #4b79ff 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expert Creators
              {/* Decorative wavy underline */}
              <svg
                viewBox="0 0 320 12"
                fill="none"
                style={{
                  position: "absolute", bottom: -6, left: 0, width: "100%",
                  opacity: 0.55,
                }}
                aria-hidden
              >
                <path
                  d="M0 9 Q40 3 80 9 Q120 15 160 9 Q200 3 240 9 Q280 15 320 9"
                  stroke="url(#wave)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="wave" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#215cff" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              marginTop: 24, fontSize: 17, lineHeight: 1.75,
              color: subTextColor, maxWidth: 600, marginLeft: "auto", marginRight: "auto",
            }}
          >
            Learn directly from{" "}
            <strong style={{ color: strongColor, fontWeight: 700 }}>
              ex-FAANG engineers
            </strong>
            , industry leaders, and open-source contributors who have shipped at
            global scale.
          </motion.p>

          {/* Company trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.35 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, marginTop: 28, flexWrap: "wrap",
            }}
          >
            {COMPANIES.map((co) => (
              <span
                key={co}
                style={{
                  fontSize: 12, fontWeight: 600, color: pillText,
                  background: pillBg, border: `1px solid ${pillBorder}`,
                  padding: "4px 14px", borderRadius: 999,
                }}
              >
                {co}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ══════════════ MARQUEE ══════════════ */}
        <div
          style={{ width: "100%", overflow: "hidden", position: "relative", padding: "20px 0", margin: "-20px 0" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              width: "max-content",
              animation: `mentorMarquee 30s linear infinite`,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...PAGES.flat(), ...PAGES.flat()].map((mentor, index) => (
              <div key={index} style={{ width: 280, flexShrink: 0 }}>
                <MentorCard mentor={mentor} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes mentorMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
          }
        `}</style>

        {/* ══════════════ CTA ══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 56,
            paddingTop: 32,
            borderTop: `1px solid ${dividerColor}`,
          }}
        >
          {/* View All CTA */}
          <Link
            to="/mentors"
            className="group"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              height: 48, padding: "0 28px",
              background: ctaBg, color: ctaText,
              fontWeight: 700, fontSize: 15,
              textDecoration: "none",
              clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = ctaHoverBg; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ctaBg; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            View All Mentors
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
