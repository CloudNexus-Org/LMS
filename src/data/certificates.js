export const MOCK_CERTS = [
  {
    id: "CN-AWSA-8412",
    title: "AWS Solution Architect",
    description:
      "An immersive, project-backed track in cloud architecture and DevOps",
    issueDate: "Mar 2026",
    duration: "24h",
    recipient: "Aarav Sharma",
    verifyLink: "cloudnexus.com/verify/CN-AWSA-8412",
    track: "Cloud Architecture",
    mentor: "Priya Nair",
    status: "verified",
  },
  {
    id: "CN-FSR-9921",
    title: "Fullstack React Enterprise",
    description:
      "Advanced patterns for building scalable frontend systems",
    issueDate: "Jan 2026",
    duration: "32h",
    recipient: "Aarav Sharma",
    verifyLink: "cloudnexus.com/verify/CN-FSR-9921",
    track: "Frontend Engineering",
    mentor: "James Okonkwo",
    status: "verified",
  },
];

export function getCertificateById(id) {
  return MOCK_CERTS.find((cert) => cert.id === id) ?? null;
}
