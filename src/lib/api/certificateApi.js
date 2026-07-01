import { API } from './config';
import { getJson, postJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export function mapCertificate(c) {
  if (!c) return null;
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    issueDate: c.issueDate,
    duration: c.duration,
    recipient: c.recipient,
    verifyLink: c.verifyLink,
    track: c.track,
    mentor: c.mentor,
    status: c.status || 'verified',
  };
}

export async function fetchMyCertificates(user, token) {
  const list = await getJson(`${base}/api/certificates/me`, authHeaders(user, token));
  return (list || []).map(mapCertificate);
}

export async function fetchCertificateById(user, token, certificateId) {
  const cert = await getJson(`${base}/api/certificates/${certificateId}`, authHeaders(user, token));
  return mapCertificate(cert);
}

export async function verifyCertificate(certificateCode) {
  return getJson(`${base}/api/certificates/verify/${encodeURIComponent(certificateCode)}`);
}

export async function shareCertificate(user, token, certificateId) {
  return postJson(`${base}/api/certificates/${certificateId}/share`, {}, authHeaders(user, token));
}

export async function downloadCertificate(user, token, certificateId) {
  const res = await fetch(`${base}/api/certificates/${certificateId}/download`, {
    headers: authHeaders(user, token),
  });
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}
