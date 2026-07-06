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
    <div className="cert-signature">
      <svg viewBox="0 0 80 26" className="cert-signature-line" aria-hidden="true">
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="cert-signature-label">{label}</span>
    </div>
  );
}

function Seal({ sealPathId }) {
  return (
    <div className="cert-seal">
      <svg viewBox="0 0 100 100" className="cert-seal-ring" aria-hidden="true">
        <defs>
          <path id={sealPathId} d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" />
        </defs>
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.55" />
        <text fontSize="9" fontWeight="800" letterSpacing="2.4" fill="var(--primary)" fontFamily="var(--font-display, sans-serif)">
          <textPath href={`#${sealPathId}`}>OFFICIAL · VERIFIED · CLOUD NEXUS · </textPath>
        </text>
      </svg>
      <div className="cert-seal-center">
        <ShieldCheck size={18} className="text-primary" strokeWidth={2} />
      </div>
    </div>
  );
}

export default function CertificateDocument({ cert, className = "" }) {
  const year = cert.issueDate.split(" ")[1] ?? "2026";
  const sealPathId = `cert-seal-path-${cert.id}`;

  return (
    <figure
      className={`certificate-paper cert-document ${className}`}
      data-certificate-id={cert.id}
    >
      <div className="cert-frame cert-frame-outer" />
      <div className="cert-frame cert-frame-inner" />

      <CornerOrnament className="cert-corner cert-corner-tl" />
      <CornerOrnament className="cert-corner cert-corner-tr" />
      <CornerOrnament className="cert-corner cert-corner-bl" />
      <CornerOrnament className="cert-corner cert-corner-br" />

      <div className="cert-watermark" aria-hidden="true">
        <Award size={180} strokeWidth={1} />
      </div>

      <div className="cert-verified-badge">
        <BadgeCheck size={11} className="text-success" />
        <span>Verified</span>
      </div>

      <div className="cert-layout">
        <header className="cert-header">
          <div className="cert-academy-row">
            <Award size={16} strokeWidth={2.2} />
            <span className="cert-academy-name">Cloud Nexus Academy</span>
            <Award size={16} strokeWidth={2.2} className="cert-academy-icon-mirror" />
          </div>
          <div className="cert-header-divider" aria-hidden="true">
            <span className="cert-header-line" />
            <span className="cert-header-diamond">◆</span>
            <span className="cert-header-line cert-header-line-reverse" />
          </div>
          <p className="cert-header-subtitle">Certificate of Completion · {year}</p>
        </header>

        <section className="cert-body">
          <p className="cert-intro">This is to certify that</p>
          <h3 className="cert-recipient">{cert.recipient}</h3>
          <svg viewBox="0 0 220 8" className="cert-name-underline" aria-hidden="true">
            <path
              d="M 4 4 Q 55 -2, 110 4 T 216 4"
              stroke="var(--primary)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <p className="cert-completed-label">has successfully completed</p>
          <h4 className="cert-course-title">
            <Sparkles size={14} className="cert-sparkle" strokeWidth={2.4} />
            {cert.title}
            <Sparkles size={14} className="cert-sparkle" strokeWidth={2.4} />
          </h4>
          {cert.description ? <p className="cert-course-desc">{cert.description}</p> : null}
        </section>

        <footer className="cert-footer">
          <div className="cert-footer-band">
            <Seal sealPathId={sealPathId} />
            <div className="cert-signatures">
              <Signature d="M 4 18 C 10 6, 18 4, 26 14 S 42 24, 50 12 Q 60 6, 76 14" label="Director" />
              <Signature d="M 4 16 Q 14 4, 24 14 T 44 16 Q 56 22, 76 12" label="Lead Mentor" />
            </div>
            <div className="cert-qr-block">
              <div className="cert-qr-code">
                <MiniQR />
              </div>
              <span className="cert-qr-label">Verify</span>
            </div>
          </div>

          <div className="cert-meta-row">
            <span className="cert-meta-id">{cert.id}</span>
            <span className="cert-meta-link">{cert.verifyLink}</span>
            <span className="cert-meta-date">{cert.issueDate}</span>
          </div>
        </footer>
      </div>
    </figure>
  );
}
