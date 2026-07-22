import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders, parseApiError } from './apiHelpers';
import { resolveTrackForCourseId } from './catalogApi';

const base = API.base;

export function computeEnrollmentProgress(enrollment) {
  const total = Number(enrollment?.totalLessons) || 0;
  const completed = Number(enrollment?.completedLessons) || 0;
  if (total > 0) {
    return Math.min(100, Math.round((completed / total) * 100));
  }
  return Number(enrollment?.progress) || 0;
}

export function mapEnrollmentCourse(c) {
  if (!c) return null;
  const raw = String(c.status || '').toLowerCase();
  const totalLessons = c.totalLessons ?? 0;
  const completedLessons = c.completedLessons ?? 0;
  const progress = computeEnrollmentProgress(c);
  let uiStatus =
    raw === 'completed'
      ? 'completed'
      : raw === 'not-started'
        ? 'not-started'
        : raw === 'in-progress'
          ? 'in-progress'
          : raw === 'active'
            ? 'not-started'
            : 'in-progress';
  if (uiStatus === 'not-started' && (completedLessons > 0 || progress > 0)) {
    uiStatus = 'in-progress';
  }
  if (progress >= 100) {
    uiStatus = 'completed';
  }
  return {
    ...c,
    courseId: c.courseId,
    trackId: c.trackId,
    title: c.title,
    image: c.image,
    progress,
    status: uiStatus,
    totalLessons,
    completedLessons,
    badge: c.badge ?? 'Intermediate',
    instructor: c.instructor ?? c.professor ?? 'Mentor',
    rating: String(c.rating ?? '0'),
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
  return postJson(
    `${base}/api/enrollments`,
    { trackId, courseId },
    authHeaders(user, token)
  );
}

/** Enroll cart/checkout items — one enrollment per purchased course */
export async function enrollPurchasedItems(user, token, items) {
  const enrolled = [];
  const skipped = [];
  const failed = [];

  for (const item of items) {
    const courseId = item.id ?? item.courseId;
    if (courseId == null) {
      failed.push({ item, error: 'Missing course id' });
      continue;
    }

    let trackId = item.trackId;
    if (!trackId) {
      const track = await resolveTrackForCourseId(courseId);
      trackId = track?.id;
    }

    try {
      await enrollInTrack(user, token, { trackId, courseId });
      enrolled.push({ trackId, courseId });
    } catch (err) {
      if (err?.status === 409) {
        skipped.push({ trackId, courseId });
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

export async function completeLesson(user, token, lessonId, trackId, options = {}) {
  return postJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}/complete`,
    {
      trackId,
      requireQuizPass: options.requireQuizPass === true ? true : undefined,
    },
    authHeaders(user, token)
  );
}

export async function submitQuizAttempt(user, token, lessonId, payload) {
  return postJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}/quiz-attempts`,
    payload,
    authHeaders(user, token)
  );
}

export async function fetchQuizAttempts(user, token, lessonId) {
  return getJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}/quiz-attempts`,
    authHeaders(user, token)
  );
}

export async function fetchLessonProgressStatus(user, token, lessonId, trackId) {
  return getJson(
    `${base}/api/enrollments/progress/lessons/${lessonId}/status?trackId=${encodeURIComponent(trackId)}`,
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
