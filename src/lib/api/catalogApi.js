import { API } from './config';
import { deleteJson, getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

/** Normalize backend course → frontend shape */
export function mapCourse(c) {
  if (!c) return null;
  return {
    ...c,
    image: c.image || c.thumbnailUrl,
    originalPrice: c.originalPrice ?? c.original_price,
    reviews: c.reviews ?? c.reviewCount ?? 0,
  };
}

export async function fetchCourses(params = {}) {
  const qs = new URLSearchParams();
  if (params.page != null) qs.set('page', params.page);
  if (params.size != null) qs.set('size', params.size);
  if (params.difficulty) qs.set('difficulty', params.difficulty);
  if (params.sort) qs.set('sort', params.sort);
  const data = await getJson(`${base}/api/catalog/courses?${qs}`);
  return { ...data, content: (data.content || []).map(mapCourse) };
}

/** All published courses (used by courses list / browse pages) */
export async function fetchPublishedCourses(params = {}) {
  const data = await fetchCourses({ size: 100, page: 0, ...params });
  return data.content || [];
}

/** Resolve parent track for a catalog course id (falls back to course-{id}). */
export async function resolveTrackForCourseId(courseId) {
  try {
    const data = await getJson(`${base}/api/catalog/courses/id/${courseId}/track`);
    return data?.trackId ? { id: data.trackId } : { id: `course-${courseId}` };
  } catch {
    return { id: `course-${courseId}` };
  }
}

/** Build courseId → track map from published tracks (for offline/static fallback). */
export async function buildCourseTrackIndex() {
  const tracks = await fetchTracks().catch(() => []);
  const index = new Map();
  tracks.forEach((track) => {
    (track.courseIds || []).forEach((courseId) => {
      index.set(Number(courseId), track);
      index.set(String(courseId), track);
    });
  });
  return index;
}

export async function fetchFeaturedCourses() {
  const list = await getJson(`${base}/api/catalog/courses/featured`);
  return list.map(mapCourse);
}

export async function fetchCourseBySlug(slug) {
  const course = await getJson(`${base}/api/catalog/courses/${slug}`);
  return mapCourse(course);
}

export async function fetchTracks() {
  return getJson(`${base}/api/catalog/tracks`);
}

export async function fetchTrack(id) {
  return getJson(`${base}/api/catalog/tracks/${id}`);
}

export async function searchCourses(q, difficulty) {
  const qs = new URLSearchParams({ q: q || '' });
  if (difficulty) qs.set('difficulty', difficulty);
  const data = await getJson(`${base}/api/catalog/explore/search?${qs}`);
  return { ...data, content: (data.content || []).map(mapCourse) };
}

export async function fetchTestimonials() {
  const list = await getJson(`${base}/api/catalog/testimonials`);
  return list.map((t) => ({
    ...t,
    avatar: t.avatar || t.avatarUrl,
    text: t.text || t.quote,
  }));
}

export async function fetchFaqs() {
  return getJson(`${base}/api/catalog/faq`);
}

export async function fetchHowItWorks() {
  return getJson(`${base}/api/catalog/how-it-works`);
}

/** Mentor submits course → creates PENDING course + admin approval queue entry */
export async function submitCourseForApproval(user, token, payload) {
  return postJson(`${base}/api/catalog/courses/submit`, payload, authHeaders(user, token));
}

/** Mentor updates a pending/draft catalog listing */
export async function updateCatalogCourse(user, token, courseId, payload) {
  return putJson(`${base}/api/catalog/courses/${courseId}`, payload, authHeaders(user, token));
}

/** Mentor deletes own non-published catalog course (cascades skills/outcomes links) */
export async function deleteCatalogCourse(user, token, courseId) {
  return deleteJson(`${base}/api/catalog/courses/${courseId}`, authHeaders(user, token));
}
