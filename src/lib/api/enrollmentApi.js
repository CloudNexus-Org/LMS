import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export function mapEnrollmentCourse(c) {
  if (!c) return null;
  const status = String(c.status || '').toUpperCase();
  const uiStatus = status === 'COMPLETED' ? 'completed' : 'in-progress';
  return {
    ...c,
    id: c.id,
    trackId: c.trackId,
    title: c.title,
    image: c.image,
    progress: c.progress ?? 0,
    status: uiStatus,
    totalLessons: c.totalLessons ?? 0,
    completedLessons: c.completedLessons ?? 0,
    badge: c.badge ?? 'Intermediate',
    instructor: c.instructor ?? c.professor ?? 'Mentor',
    rating: String(c.rating ?? '4.8'),
    duration: c.duration ?? '',
    modules: c.modules ?? '',
    description: c.description ?? '',
  };
}

export async function fetchMyEnrollments(user, token) {
  const list = await getJson(`${base}/api/enrollments/me`, authHeaders(user, token));
  return (list || []).map(mapEnrollmentCourse);
}

export async function enrollInTrack(user, token, { trackId, courseId }) {
  return postJson(`${base}/api/enrollments`, { trackId, courseId }, authHeaders(user, token));
}

export async function fetchTrackProgress(user, token, trackId) {
  return getJson(`${base}/api/enrollments/progress/tracks/${trackId}`, authHeaders(user, token));
}

export async function completeLesson(user, token, lessonId, trackId) {
  return postJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}/complete`,
    { trackId },
    authHeaders(user, token)
  );
}

export async function updateLessonProgress(user, token, lessonId, payload) {
  return putJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}`,
    payload,
    authHeaders(user, token)
  );
}

export async function fetchEnrollmentDashboard(user, token) {
  return getJson(`${base}/api/enrollments/dashboard/student`, authHeaders(user, token));
}

export async function checkEnrollment(user, token, trackId) {
  return getJson(`${base}/api/enrollments/check/${trackId}`, authHeaders(user, token));
}

export async function cancelEnrollment(user, token, enrollmentId) {
  return deleteJson(`${base}/api/enrollments/${enrollmentId}`, authHeaders(user, token));
}
