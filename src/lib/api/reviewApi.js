import { API, DEV_USER } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';

const base = API.base;

export function mapReview(r) {
  if (!r) return null;
  return {
    ...r,
    helpful: r.helpful ?? r.helpfulCount ?? 0,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function fetchCourseReviews(courseId, page = 0, size = 10) {
  const data = await getJson(`${base}/api/reviews/courses/${courseId}?page=${page}&size=${size}`);
  return { ...data, content: (data.content || []).map(mapReview) };
}

export async function fetchCourseReviewSummary(courseId) {
  return getJson(`${base}/api/reviews/courses/${courseId}/summary`);
}

export async function fetchMyReviews(userId = DEV_USER.studentId) {
  const list = await getJson(`${base}/api/reviews/me`, { 'X-User-Id': userId });
  return list.map(mapReview);
}

export async function submitReview(courseId, body, userId = DEV_USER.studentId) {
  return mapReview(
    await postJson(`${base}/api/reviews/courses/${courseId}`, body, { 'X-User-Id': userId })
  );
}

export async function updateReview(reviewId, body, userId = DEV_USER.studentId) {
  return mapReview(
    await putJson(`${base}/api/reviews/${reviewId}`, body, { 'X-User-Id': userId })
  );
}

export async function deleteReview(reviewId, userId = DEV_USER.studentId) {
  return deleteJson(`${base}/api/reviews/${reviewId}`, { 'X-User-Id': userId });
}

export async function markReviewHelpful(reviewId, userId = DEV_USER.studentId) {
  return mapReview(
    await postJson(`${base}/api/reviews/${reviewId}/helpful`, {}, { 'X-User-Id': userId })
  );
}
