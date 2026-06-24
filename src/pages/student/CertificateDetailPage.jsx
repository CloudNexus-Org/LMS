import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Award } from "lucide-react";
import { getCertificateById } from "@/data/certificates";
import CertificateViewer from "@/features/certificates/CertificateViewer";

export default function CertificateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cert = getCertificateById(id);

  if (!cert) {
    return (
      <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
        <button type="button" onClick={() => navigate("/student/certificates")} className="cert-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Certificates
        </button>
        <div className="dashboard-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <Award className="mb-4 h-12 w-12 text-muted" />
          <h1 className="text-xl font-bold text-text">Certificate not found</h1>
          <p className="mt-2 max-w-md text-sm text-muted">
            This certificate may have been removed or the link is incorrect.
          </p>
          <Link to="/student/certificates" className="cert-btn-primary mt-6">
            View all certificates
          </Link>
        </div>  
      </div>
    );
  }

  return (
    <div className="cert-focus-page">
      <button type="button" onClick={() => navigate("/student/certificates")} className="cert-back-link">
        <ArrowLeft className="h-4 w-4" />
        Back to Certificates
      </button>

      <CertificateViewer cert={cert} focusOnly />
    </div>
  );
}
