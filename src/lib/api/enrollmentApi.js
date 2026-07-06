import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders, parseApiError } from './apiHelpers';

const base = API.base;

export function mapEnrollmentCourse(c) {
  if (!c) return null;
  const raw = String(c.status || '').toLowerCase();
  const uiStatus =
    raw === 'completed'
      ? 'completed'
      : raw === 'not-started'
        ? 'not-started'
        : raw === 'in-progress'
          ? 'in-progress'
          : raw === 'active'
            ? 'not-started'
            : 'in-progress';
  return {
    ...c,
    courseId: c.courseId,
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

/** Enroll cart/checkout items — maps each course to its parent track via findTrackForCourse */
export async function enrollPurchasedItems(user, token, items, findTrackForCourse) {
  const enrolled = [];
  const skipped = [];
  const failed = [];

  for (const item of items) {
    const courseId = item.id ?? item.courseId;
    const track = findTrackForCourse?.(courseId);
    if (!track?.id) {
      failed.push({ item, error: 'Course is not linked to a career track' });
      continue;
    }
    try {
      await enrollInTrack(user, token, { trackId: track.id, courseId });
      enrolled.push({ trackId: track.id, courseId });
    } catch (err) {
      if (err?.status === 409) {
        skipped.push({ trackId: track.id, courseId });
      } else {
        failed.push({ item, error: parseApiError(err) });
      }
    }
  }

  return { enrolled, skipped, failed };
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

export async function finishTrackLearning(user, token, trackId) {
  return postJson(
    `${base}/api/enrollments/progress/tracks/${trackId}/finish`,
    {},
    authHeaders(user, token)
  );
}

export async function cancelEnrollment(user, token, enrollmentId) {
  return deleteJson(`${base}/api/enrollments/${enrollmentId}`, authHeaders(user, token));
}
