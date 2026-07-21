import { API } from './config';
import { deleteJson, getJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

async function uploadMultipart(path, file, user, token, extraFields = {}) {
  const form = new FormData();
  form.append('file', file);
  Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  const headers = authHeaders(user, token);
  // Use a longer timeout for uploads — large video files can take time.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);
  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      headers,
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(text || `Upload failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout = new Error('Upload timed out. Please try again.');
      timeout.status = 0;
      throw timeout;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function uploadImage(user, token, file) {
  return uploadMultipart('/api/media/upload/image', file, user, token);
}

export async function uploadVideo(user, token, file) {
  return uploadMultipart('/api/media/upload/video', file, user, token);
}

export async function uploadDocument(user, token, file) {
  return uploadMultipart('/api/media/upload/document', file, user, token);
}

export async function uploadCourseThumbnail(user, token, file, courseId) {
  const q = courseId != null ? `?courseId=${courseId}` : '';
  return uploadMultipart(`/api/media/upload/course-thumbnail${q}`, file, user, token);
}

export async function uploadAvatar(user, token, file) {
  return uploadMultipart('/api/media/upload/avatar', file, user, token);
}

export async function fetchMediaFile(fileId) {
  return getJson(`${base}/api/media/files/${fileId}`);
}

export async function fetchPresignedUrl(fileId) {
  return getJson(`${base}/api/media/files/${fileId}/presigned-url`);
}

export async function deleteMediaFile(user, token, fileId) {
  return deleteJson(`${base}/api/media/files/${fileId}`, authHeaders(user, token));
}

export function mediaDownloadUrl(fileId) {
  return `${base}/api/media/files/${fileId}/download`;
}

/** Resolve a playable/display URL — prefers gateway path for local dev */
export function resolveMediaUrl(fileOrId) {
  if (!fileOrId) return null;
  if (typeof fileOrId === 'string') {
    if (fileOrId.startsWith('http') || fileOrId.startsWith('/')) return fileOrId;
    return mediaDownloadUrl(fileOrId);
  }
  const id = fileOrId.id;
  const url = fileOrId.url || fileOrId.storageUrl;
  if (url?.startsWith('http://localhost:8095')) {
    return mediaDownloadUrl(id);
  }
  if (url?.startsWith('http') || url?.startsWith('/')) return url;
  return id ? mediaDownloadUrl(id) : null;
}
