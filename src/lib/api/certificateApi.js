import { API } from './config';
import { getJson, postJson } from './http';
import { authHeaders } from './apiHelpers';
import { finishTrackLearning } from './enrollmentApi';

const base = API.base;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
    trackId: c.trackId,
    mentor: c.mentor,
    status: c.status || 'verified',
  };
}

export async function fetchMyCertificates(user, token) {
  const list = await getJson(`${base}/api/certificates/me`, authHeaders(user, token));
  return (list || []).map(mapCertificate);
}

/** Mark track finished and wait for Kafka-issued certificate, then return it. */
export async function claimTrackCertificate(user, token, trackId) {
  if (!user?.id || !token || !trackId) return null;

  await finishTrackLearning(user, token, trackId).catch(() => {});

  for (let attempt = 0; attempt < 6; attempt += 1) {
    if (attempt > 0) await sleep(600);
    const list = await fetchMyCertificates(user, token);
    const cert = list.find((c) => c.trackId === trackId);
    if (cert) return cert;
  }
  return null;
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
