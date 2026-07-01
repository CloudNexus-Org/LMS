import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  Clock3,
  Download,
  Eye,
} from "lucide-react";
import { MOCK_CERTS } from "@/data/certificates";
import CertificateDocument from "@/features/certificates/CertificateDocument";
import { downloadCertificatePdf } from "@/features/certificates/downloadCertificatePdf";
import useAuthStore from "@/store/useAuthStore";
import { fetchMyCertificates } from "@/lib/api/certificateApi";

function CertificateListCard({ cert }) {
  const hiddenRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const pdfFilename = `${cert.id}-${cert.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  const handleDownload = async () => {
    if (!hiddenRef.current || downloading) return;

    setDownloading(true);
    setDownloadError("");

    try {
      await downloadCertificatePdf(hiddenRef.current, pdfFilename);
    } catch (error) {
      console.error("PDF download failed:", error);
      setDownloadError("Download failed. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="cert-list-card">
      <div className="cert-list-card-icon">
        <Award className="h-5 w-5 text-primary" />
      </div>

      <div className="cert-list-card-body">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="cert-list-card-title">{cert.title}</h2>
          <span className="cert-list-badge">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        </div>

        <p className="cert-list-card-desc">{cert.description}</p>

        <div className="cert-list-meta">
          <span className="cert-list-meta-item">
            <Clock3 className="h-3.5 w-3.5" />
            {cert.duration} completed
          </span>
          <span className="cert-list-meta-item font-mono">{cert.id}</span>
          <span className="cert-list-meta-item">Issued {cert.issueDate}</span>
        </div>
      </div>

      <div className="cert-list-card-actions">
        {downloadError ? (
          <p className="text-xs font-semibold text-danger">{downloadError}</p>
        ) : null}
        <Link to={`/student/certificates/${cert.id}`} className="cert-btn-primary">
          <Eye className="h-4 w-4" />
          View Certificate
        </Link>
        <button
          type="button"
          className="cert-btn-outline"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="h-4 w-4" />
          {downloading ? "Preparing…" : "Download PDF"}
        </button>
      </div>

      <div
        className="cert-list-hidden-render"
        aria-hidden="true"
        inert=""
      >
        <div ref={hiddenRef} className="cert-list-hidden-document">
          <CertificateDocument cert={cert} />
        </div>
      </div>
    </article>
  );
}

export default function CertificatesPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [certs, setCerts] = useState(MOCK_CERTS);

  useEffect(() => {
    if (!user?.id || !token) return;
    fetchMyCertificates(user, token)
      .then((data) => { if (data?.length) setCerts(data); })
      .catch(() => {});
  }, [user?.id, token]);

  const totalHours = certs.reduce((sum, cert) => {
    const hours = parseInt(cert.duration, 10);
    return sum + (Number.isNaN(hours) ? 0 : hours);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
          My Certificates
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          View, download, and verify your earned credentials.
        </p>
      </div>

      {certs.length > 0 && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="dashboard-card cert-summary-card">
            <p className="cert-summary-value">{certs.length}</p>
            <p className="cert-summary-label">Total certificates</p>
          </div>
          <div className="dashboard-card cert-summary-card">
            <p className="cert-summary-value">{certs.length}</p>
            <p className="cert-summary-label">Verified credentials</p>
          </div>
          <div className="dashboard-card cert-summary-card">
            <p className="cert-summary-value">{totalHours}h</p>
            <p className="cert-summary-label">Learning hours certified</p>
          </div>
        </section>
      )}

      {certs.length === 0 ? (
        <div className="dashboard-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Award className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-text">No certificates yet</h2>
          <p className="mt-1 max-w-sm text-[15px] text-muted">
            Complete a course track and pass the final assessment to earn your first certificate.
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          {certs.map((cert) => (
            <CertificateListCard key={cert.id} cert={cert} />
          ))}
        </section>
      )}
    </div>
  );
}
