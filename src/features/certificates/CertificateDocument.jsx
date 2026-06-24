import { Award, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

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
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 16 V5 H16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
      <circle cx="2" cy="2" r="1.6" fill="currentColor" />
    </svg>
  );
}

function MiniQR() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full text-text" aria-hidden="true">
      {QR_MATRIX.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${x}-${y}`} x={x * 4} y={y * 4} width="3.4" height="3.4" rx="0.5" fill="currentColor" />
          ) : null
        )
      )}
    </svg>
  );
}

function Signature({ d, label }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <svg viewBox="0 0 80 26" className="h-4 w-full max-w-[80px]" aria-hidden="true">
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="text-text"
        />
      </svg>
      <span className="mt-0.5 w-full border-t border-border pt-1 text-center text-[7px] font-semibold uppercase tracking-[0.14em] text-subtle">
        {label}
      </span>
    </div>
  );
}

function Seal({ sealPathId }) {
  return (
    <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
      <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden="true">
        <defs>
          <path id={sealPathId} d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" />
        </defs>
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.55" />
        <text fontSize="9" fontWeight="800" letterSpacing="2.4" fill="var(--primary)" fontFamily="var(--font-display, sans-serif)">
          <textPath href={`#${sealPathId}`}>OFFICIAL · VERIFIED · CLOUD NEXUS · </textPath>
        </text>
      </svg>
      <div className="absolute inset-[8px] flex items-center justify-center rounded-lg border border-primary/50 bg-primary-soft shadow-sm">
        <ShieldCheck size={16} className="text-primary" strokeWidth={2} />
      </div>
      <span aria-hidden="true" className="absolute inset-0 rounded-lg bg-primary/10 blur-[4px]" />
    </div>
  );
}

export default function CertificateDocument({ cert, className = "" }) {
  const year = cert.issueDate.split(" ")[1] ?? "2026";
  const sealPathId = `cert-seal-path-${cert.id}`;

  return (
    <figure
      className={`certificate-paper cert-document relative isolate aspect-[1.4] w-full overflow-hidden rounded-[20px] border border-border bg-elevated p-4 text-text shadow-sm ${className}`}
      data-certificate-id={cert.id}
    >
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-primary/20" />
      <div className="pointer-events-none absolute inset-[10px] rounded-lg border border-primary/10" />

      <CornerOrnament className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-primary" />
      <CornerOrnament className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 -scale-x-100 text-primary" />
      <CornerOrnament className="pointer-events-none absolute bottom-3 left-3 h-3.5 w-3.5 -scale-y-100 text-primary" />
      <CornerOrnament className="pointer-events-none absolute bottom-3 right-3 h-3.5 w-3.5 -scale-100 text-primary" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <Award size={180} className="text-primary" strokeWidth={1} />
      </div>

      <div className="absolute -top-1.5 right-3 z-30 inline-flex items-center gap-1 rounded-lg border border-success/30 bg-elevated px-2 py-0.5 shadow-sm">
        <BadgeCheck size={9} className="text-success" />
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-success">Verified</span>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-primary">
            <Award size={13} strokeWidth={2.2} />
            <span className="font-display text-[8px] font-bold tracking-[0.32em] text-text sm:text-[9px]">
              CLOUD NEXUS ACADEMY
            </span>
            <Award size={13} strokeWidth={2.2} className="-scale-x-100" />
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="block h-px w-6 bg-gradient-to-r from-transparent to-border sm:w-8" />
            <span className="text-[5px] text-primary">◆</span>
            <span className="block h-px w-6 bg-gradient-to-l from-transparent to-border sm:w-8" />
          </div>

          <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.28em] text-subtle sm:text-[8px]">
            Certificate of Completion · {year}
          </span>
        </div>

        <div className="mt-2.5 flex flex-col items-center">
          <p className="font-display text-[9px] italic text-muted">This is to certify that</p>

          <h3
            className="mt-0.5 font-display text-[20px] font-extrabold italic leading-tight tracking-tight text-text sm:text-[22px]"
            style={{
              backgroundImage: "linear-gradient(180deg, var(--text) 60%, var(--primary) 140%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {cert.recipient}
          </h3>

          <svg viewBox="0 0 220 8" className="mt-0.5 h-1.5 w-32 sm:w-40" aria-hidden="true">
            <path
              d="M 4 4 Q 55 -2, 110 4 T 216 4"
              stroke="var(--primary)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <p className="mt-1.5 font-display text-[9px] italic text-muted">has successfully completed</p>
          <h4 className="mt-0.5 inline-flex items-center gap-1 font-display text-[12px] font-bold tracking-tight text-primary sm:text-[13px]">
            <Sparkles size={10} className="text-primary/70" strokeWidth={2.4} />
            {cert.title}
            <Sparkles size={10} className="text-primary/70" strokeWidth={2.4} />
          </h4>
          <p className="mt-0.5 max-w-[90%] text-[8px] leading-relaxed text-subtle sm:text-[9px]">
            {cert.description}
          </p>
        </div>

        <div className="mt-auto grid w-full grid-cols-[auto_1fr_auto] items-end gap-2 pt-2 sm:gap-3 sm:pt-3">
          <Seal sealPathId={sealPathId} />

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Signature d="M 4 18 C 10 6, 18 4, 26 14 S 42 24, 50 12 Q 60 6, 76 14" label="Director" />
            <Signature d="M 4 16 Q 14 4, 24 14 T 44 16 Q 56 22, 76 12" label="Lead Mentor" />
          </div>

          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded border border-border bg-surface p-1 shadow-sm sm:h-12 sm:w-12">
            <div className="h-6 w-6 sm:h-7 sm:w-7">
              <MiniQR />
            </div>
            <span className="text-[5px] font-mono uppercase tracking-wider text-subtle">Verify</span>
          </div>
        </div>

        <div className="mt-1.5 flex w-full items-center justify-between gap-1 border-t border-border/60 pt-1 text-[7px] sm:text-[8px]">
          <span className="font-mono font-semibold text-text">{cert.id}</span>
          <span className="hidden font-mono text-subtle sm:inline">{cert.verifyLink}</span>
          <span className="font-mono text-subtle">{cert.issueDate}</span>
        </div>
      </div>
    </figure>
  );
}
