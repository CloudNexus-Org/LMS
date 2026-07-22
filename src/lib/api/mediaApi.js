import { API } from './config';
import { deleteJson, getJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

async function uploadMultipart(path, file, user, token, extraFields = {}) {
  const form = new FormData();
  form.append('file', file);
  Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  const headers = authHeaders(user, token);
  const res = await fetch(`${base}${path}`, { method: 'POST', headers, body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `Upload failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function uploadMultipartWithProgress(path, file, user, token, onProgress, extraFields = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append('file', file);
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          resolve({ id: null, url: null });
        }
      } else {
        let errMsg = `Upload failed (${xhr.status})`;
        try {
          const errObj = JSON.parse(xhr.responseText);
          errMsg = errObj.message || errObj.error || errMsg;
        } catch { /* ignore */ }
        const err = new Error(errMsg);
        err.status = xhr.status;
        reject(err);
      }
    };

    xhr.onerror = () => reject(new Error('Network error during file upload'));
    xhr.ontimeout = () => reject(new Error('Upload request timed out'));

    xhr.open('POST', `${base}${path}`, true);
    const headers = authHeaders(user, token);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.send(form);
  });
}

export async function uploadImage(user, token, file) {
  return uploadMultipart('/api/media/upload/image', file, user, token);
}

export async function uploadVideo(user, token, file, onProgress) {
  if (typeof onProgress === 'function') {
    return uploadMultipartWithProgress('/api/media/upload/video', file, user, token, onProgress);
  }
  return uploadMultipart('/api/media/upload/video', file, user, token);
}

export async function uploadVideoWithProgress(user, token, file, onProgress) {
  return uploadMultipartWithProgress('/api/media/upload/video', file, user, token, onProgress);
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
