import { useRef } from "react";
import CertificateDocument from "./CertificateDocument";

export default function CertificateViewer({ cert, focusOnly = false }) {
  const certRef = useRef(null);

  if (focusOnly) {
    return (
      <div className="cert-focus-viewer">
        <div ref={certRef} className="cert-focus-document">
          <CertificateDocument cert={cert} />
        </div>
      </div>
    );
  }

  return null;
}
