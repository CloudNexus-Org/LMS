import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

function formatRelative(iso) {
  if (!iso) return 'Recently';
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function mapNote(n) {
  if (!n) return null;
  return {
    id: n.id,
    courseTitle: n.trackId ? `${n.trackId} track` : 'Course',
    lessonTitle: n.lessonId ? `Lesson ${n.lessonId}` : 'Lesson',
    timestamp: '00:00',
    content: n.content || '',
    date: formatRelative(n.updatedAt || n.createdAt),
    category: n.trackId || 'General',
    lessonId: n.lessonId,
    trackId: n.trackId,
  };
}

export function mapBookmark(b) {
  if (!b) return null;
  return {
    id: b.id,
    courseTitle: b.trackId ? `${b.trackId} track` : 'Course',
    lessonTitle: b.title || `Lesson ${b.lessonId}`,
    timestamp: '00:00',
    date: formatRelative(b.createdAt),
    trackId: b.trackId,
    lessonId: b.lessonId,
  };
}

export function mapQaThread(q) {
  return {
    id: q.id,
    author: 'Learner',
    time: formatRelative(q.createdAt),
    text: q.question,
    replies: q.answer ? 1 : 0,
    seed: false,
  };
}

export async function fetchResumeSession(user, token) {
  const res = await fetch(`${base}/api/learning/sessions/resume`, {
    headers: authHeaders(user, token),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function saveLearningSession(user, token, payload) {
  return postJson(`${base}/api/learning/sessions`, payload, authHeaders(user, token));
}

export async function updateLearningSession(user, token, sessionId, payload) {
  return putJson(`${base}/api/learning/sessions/${sessionId}`, payload, authHeaders(user, token));
}

export async function fetchNotes(user, token) {
  const list = await getJson(`${base}/api/learning/notes`, authHeaders(user, token));
  return (list || []).map(mapNote);
}

export async function createNote(user, token, payload) {
  const note = await postJson(`${base}/api/learning/notes`, payload, authHeaders(user, token));
  return mapNote(note);
}

export async function updateNote(user, token, noteId, payload) {
  const note = await putJson(`${base}/api/learning/notes/${noteId}`, payload, authHeaders(user, token));
  return mapNote(note);
}

export async function deleteNote(user, token, noteId) {
  return deleteJson(`${base}/api/learning/notes/${noteId}`, authHeaders(user, token));
}

export async function fetchBookmarks(user, token) {
  const list = await getJson(`${base}/api/learning/bookmarks`, authHeaders(user, token));
  return (list || []).map(mapBookmark);
}

export async function addBookmark(user, token, payload) {
  const b = await postJson(`${base}/api/learning/bookmarks`, payload, authHeaders(user, token));
  return mapBookmark(b);
}

export async function removeBookmark(user, token, bookmarkId) {
  return deleteJson(`${base}/api/learning/bookmarks/${bookmarkId}`, authHeaders(user, token));
}

export async function fetchLessonQa(lessonId) {
  const list = await getJson(`${base}/api/learning/lessons/${lessonId}/qa`);
  return (list || []).map(mapQaThread);
}

export async function postLessonQuestion(user, token, lessonId, question) {
  const q = await postJson(
    `${base}/api/learning/lessons/${lessonId}/qa`,
    { question },
    authHeaders(user, token)
  );
  return mapQaThread(q);
}

/** Unanswered student questions across lessons (mentor dashboard). */
export async function fetchPendingQaCount(user, token) {
  const data = await getJson(`${base}/api/learning/mentor/qa/pending`, authHeaders(user, token));
  return data?.count ?? 0;
}
