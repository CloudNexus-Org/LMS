import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

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

export async function fetchMyReviews(user, token) {
  const list = await getJson(`${base}/api/reviews/me`, authHeaders(user, token));
  return (list || []).map(mapReview);
}

export async function submitReview(user, token, courseId, body) {
  return mapReview(
    await postJson(`${base}/api/reviews/courses/${courseId}`, body, authHeaders(user, token))
  );
}

export async function updateReview(user, token, reviewId, body) {
  return mapReview(
    await putJson(`${base}/api/reviews/${reviewId}`, body, authHeaders(user, token))
  );
}

export async function deleteReview(user, token, reviewId) {
  return deleteJson(`${base}/api/reviews/${reviewId}`, authHeaders(user, token));
}

export async function markReviewHelpful(user, token, reviewId) {
  return mapReview(
    await postJson(`${base}/api/reviews/${reviewId}/helpful`, {}, authHeaders(user, token))
  );
}
