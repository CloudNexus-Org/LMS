import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import Container from "../ui/Container";

const POINTS = [
  "Industry-recognized and verifiable on LinkedIn",
  "Issued only after a real, hands-on capstone project",
  "Unique credential URL with QR-verifiable hash",
  "Shareable to your portfolio or resume in one click",
];

// 8x8 stylized QR matrix (visual only, not a real scannable code)
const QR_MATRIX = [
  [1, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 0, 1, 1],
];

function CornerOrnament({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12 V2 H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 16 V5 H16"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="2" cy="2" r="1.6" fill="currentColor" />
    </svg>
  );
}

function MiniQR() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-full w-full text-text"
      aria-hidden="true"
    >
      {QR_MATRIX.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * 4}
              y={y * 4}
              width="3.4"
              height="3.4"
              rx="0.5"
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function Signature({ d, label, delay = 0 }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <svg
        viewBox="0 0 80 26"
        className="h-6 w-full max-w-[96px]"
        aria-hidden="true"
      >
        <motion.path
          d={d}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="text-text"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            pathLength: { duration: 1.1, delay, ease: "easeOut" },
            opacity: { duration: 0.2, delay },
          }}
        />
      </svg>
      <span className="mt-0.5 w-full border-t border-border pt-1 text-center text-[8px] font-semibold uppercase tracking-[0.14em] text-subtle">
        {label}
      </span>
    </div>
  );
}

function Seal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.45, rotate: -25 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-16 w-16 shrink-0 sm:h-[72px] sm:w-[72px]"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-spin-slow"
        aria-hidden="true"
      >
        <defs>
          <path
            id="seal-text-path"
            d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0"
          />
        </defs>
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          opacity="0.35"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.55"
        />
        <text
          fontSize="9"
          fontWeight="800"
          letterSpacing="2.4"
          fill="var(--primary)"
          fontFamily="var(--font-display, sans-serif)"
        >
          <textPath href="#seal-text-path">
            OFFICIAL · VERIFIED · CLOUD NEXUS ·{" "}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[10px] flex items-center justify-center rounded-full border-2 border-primary/50 bg-primary-soft shadow-[inset_0_0_12px_var(--primary-soft)]">
        <ShieldCheck size={22} className="text-primary" strokeWidth={2.2} />
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-primary/10 blur-md"
      />
    </motion.div>
  );
}

export default function CertificateShowcase() {
  return (
    <SectionShell>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading
            align="left"
            eyebrow="Certificates"
            title="Earn a credential"
            highlight="that actually counts"
            description="Our certificates are verifiable, project-backed, and recognized by hiring teams \u2014 not just a PDF you forget about."
            className="mb-0"
          >
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 text-[14px] text-text"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-success"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </SectionHeading>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-accent/[0.06] blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 -z-10 rounded-[28px] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-25 blur-lg"
            />

            <motion.figure
              initial={{ opacity: 0, y: 28, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotate: 0, y: -6 }}
              className="certificate-paper group relative isolate aspect-[5/4] overflow-hidden rounded-3xl border border-border bg-elevated p-6 text-text shadow-[var(--shadow-elevated)] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-2xl border border-primary/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[14px] rounded-[18px] border border-primary/10"
              />

              <CornerOrnament className="pointer-events-none absolute left-5 top-5 h-5 w-5 text-primary" />
              <CornerOrnament className="pointer-events-none absolute right-5 top-5 h-5 w-5 -scale-x-100 text-primary" />
              <CornerOrnament className="pointer-events-none absolute bottom-5 left-5 h-5 w-5 -scale-y-100 text-primary" />
              <CornerOrnament className="pointer-events-none absolute bottom-5 right-5 h-5 w-5 -scale-100 text-primary" />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]"
              >
                <Award size={280} className="text-primary" strokeWidth={1} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="absolute -top-3 right-6 z-30 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-elevated px-3 py-1 shadow-[var(--shadow-card)]"
              >
                <BadgeCheck size={12} className="text-success" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-success">
                  Verified
                </span>
              </motion.div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-2 -left-1/2 z-20 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-full group-hover:opacity-100"
              />

              <div className="relative z-10 flex h-full flex-col items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-primary">
                    <Award size={18} strokeWidth={2.2} />
                    <span className="font-display text-[11px] font-bold tracking-[0.32em] text-text sm:text-[12px]">
                      CLOUD NEXUS ACADEMY
                    </span>
                    <Award
                      size={18}
                      strokeWidth={2.2}
                      className="-scale-x-100"
                    />
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="block h-px w-12 bg-gradient-to-r from-transparent to-border sm:w-16" />
                    <span className="text-[8px] text-primary">◆</span>
                    <span className="block h-px w-12 bg-gradient-to-l from-transparent to-border sm:w-16" />
                  </div>

                  <span className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.28em] text-subtle sm:text-[10px]">
                    Certificate of Completion · 2026
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center sm:mt-5">
                  <p className="font-display text-[11px] italic text-muted">
                    This is to certify that
                  </p>

                  <h3
                    className="mt-1.5 font-display text-[28px] font-extrabold italic leading-tight tracking-tight text-text sm:text-[34px] md:text-[38px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, var(--text) 60%, var(--primary) 140%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Aarav Sharma
                  </h3>

                  <svg
                    viewBox="0 0 220 8"
                    className="mt-0.5 h-2 w-44 sm:w-52"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M 4 4 Q 55 -2, 110 4 T 216 4"
                      stroke="var(--primary)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                    />
                  </svg>

                  <p className="mt-2.5 font-display text-[11px] italic text-muted">
                    has successfully completed
                  </p>
                  <h4 className="mt-1 inline-flex items-center gap-1.5 font-display text-[16px] font-bold tracking-tight text-primary sm:text-[18px]">
                    <Sparkles
                      size={13}
                      className="text-primary/70"
                      strokeWidth={2.4}
                    />
                    AWS Solution Architect
                    <Sparkles
                      size={13}
                      className="text-primary/70"
                      strokeWidth={2.4}
                    />
                  </h4>
                  <p className="mt-1 max-w-[80%] text-[10px] leading-relaxed text-subtle sm:text-[11px]">
                    An immersive, project-backed track in cloud architecture
                    and DevOps
                  </p>
                </div>

                <div className="mt-auto grid w-full grid-cols-[auto_1fr_auto] items-end gap-3 pt-3 sm:gap-4 sm:pt-4">
                  <Seal />

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Signature
                      d="M 4 18 C 10 6, 18 4, 26 14 S 42 24, 50 12 Q 60 6, 76 14"
                      label="Director"
                      delay={0.8}
                    />
                    <Signature
                      d="M 4 16 Q 14 4, 24 14 T 44 16 Q 56 22, 76 12"
                      label="Lead Mentor"
                      delay={0.95}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                    className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border border-border bg-surface p-1.5 shadow-[var(--shadow-card)] sm:h-[72px] sm:w-[72px]"
                  >
                    <div className="h-9 w-9 sm:h-10 sm:w-10">
                      <MiniQR />
                    </div>
                    <span className="text-[7px] font-mono uppercase tracking-wider text-subtle">
                      Verify
                    </span>
                  </motion.div>
                </div>

                <div className="mt-3 flex w-full items-center justify-between gap-2 border-t border-border/60 pt-2 text-[9px] sm:text-[9.5px]">
                  <span className="font-mono font-semibold text-text">
                    CN-AWSA-8412
                  </span>
                  <span className="hidden font-mono text-subtle sm:inline">
                    cloudnexus.com/verify
                  </span>
                  <span className="font-mono text-subtle">
                    Mar 2026 · 24h
                  </span>
                </div>
              </div>
            </motion.figure>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}
