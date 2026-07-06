import { API } from './config';
import { deleteJson, getJson, patchJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

/** Turn API markdown or object reading content into pane shape */
export function normalizeReadingContent(raw, lesson = {}) {
  if (raw && typeof raw === 'object' && Array.isArray(raw.sections)) {
    return raw;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const paragraphs = raw.split(/\n\n+/).filter(Boolean);
    const sections = paragraphs.map((block) => {
      const lines = block.split('\n');
      const heading = lines[0].replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      return body ? { heading, body } : { heading, body: lines[0].replace(/^#+\s*/, '') };
    });
    return {
      title: lesson.title || 'Reading',
      courseTitle: lesson.courseTitle || '',
      duration: lesson.duration || '',
      sections: sections.length ? sections : [{ heading: 'Content', body: raw }],
    };
  }
  return null;
}

export function mapLesson(n) {
  if (!n) return null;
  const readingContent = normalizeReadingContent(n.readingContent, n);
  return {
    id: n.id,
    moduleId: n.moduleId,
    courseId: n.courseId,
    courseTitle: n.courseTitle,
    title: n.title,
    type: n.type,
    duration: n.duration || (n.durationMin ? `${n.durationMin} min` : '—'),
    durationMin: n.durationMin,
    order: n.orderIndex ?? n.order,
    orderIndex: n.orderIndex,
    courseIndex: n.courseIndex ?? 0,
    contentUrl: n.contentUrl,
    readingContent,
    summary: n.summary,
    free: n.free ?? n.previewFree,
    previewFree: n.previewFree,
  };
}

export async function createCourseDraft(user, token, payload) {
  return postJson(`${base}/api/content/courses`, payload, authHeaders(user, token));
}

export async function updateCourse(user, token, courseId, payload) {
  return putJson(`${base}/api/content/courses/${courseId}`, payload, authHeaders(user, token));
}

export async function deleteCourse(user, token, courseId) {
  return deleteJson(`${base}/api/content/courses/${courseId}`, authHeaders(user, token));
}

export async function fetchCourse(user, token, courseId) {
  return getJson(`${base}/api/content/courses/${courseId}`, authHeaders(user, token));
}

export async function fetchCourseDrafts(user, token) {
  return getJson(`${base}/api/content/courses/drafts`, authHeaders(user, token));
}

export async function addModule(user, token, courseId, payload) {
  return postJson(`${base}/api/content/courses/${courseId}/modules`, payload, authHeaders(user, token));
}

export async function updateModule(user, token, courseId, moduleId, payload) {
  return putJson(`${base}/api/content/courses/${courseId}/modules/${moduleId}`, payload, authHeaders(user, token));
}

export async function deleteModule(user, token, courseId, moduleId) {
  return deleteJson(`${base}/api/content/courses/${courseId}/modules/${moduleId}`, authHeaders(user, token));
}

export async function addLesson(user, token, courseId, moduleId, payload) {
  return postJson(`${base}/api/content/courses/${courseId}/modules/${moduleId}/lessons`, payload, authHeaders(user, token));
}

export async function updateLesson(user, token, courseId, lessonId, payload) {
  return putJson(`${base}/api/content/courses/${courseId}/lessons/${lessonId}`, payload, authHeaders(user, token));
}

export async function deleteLesson(user, token, courseId, lessonId) {
  return deleteJson(`${base}/api/content/courses/${courseId}/lessons/${lessonId}`, authHeaders(user, token));
}

export async function reorderCurriculum(user, token, courseId, payload) {
  return putJson(`${base}/api/content/courses/${courseId}/curriculum/reorder`, payload, authHeaders(user, token));
}

export async function submitCourseForApproval(user, token, courseId) {
  return postJson(`${base}/api/content/courses/${courseId}/submit-for-approval`, {}, authHeaders(user, token));
}

export async function updateCoursePricing(user, token, courseId, payload) {
  return patchJson(`${base}/api/content/courses/${courseId}/pricing`, payload, authHeaders(user, token));
}

export async function publishCourse(user, token, courseId) {
  return postJson(`${base}/api/content/courses/${courseId}/publish`, {}, authHeaders(user, token));
}

export async function fetchTrackLessons(trackId) {
  const list = await getJson(`${base}/api/content/tracks/${trackId}/lessons`);
  return (Array.isArray(list) ? list : []).map(mapLesson);
}

export async function fetchLesson(lessonId) {
  const id = String(lessonId ?? '');
  if (!/^\d+$/.test(id)) return null;
  return mapLesson(await getJson(`${base}/api/content/lessons/${id}`));
}

export async function fetchLessonResources(lessonId) {
  return getJson(`${base}/api/content/lessons/${lessonId}/resources`);
}

export async function fetchLessonTranscript(lessonId) {
  return getJson(`${base}/api/content/lessons/${lessonId}/transcript`);
}
