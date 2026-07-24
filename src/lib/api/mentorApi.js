import { API, DEV_USER } from './config';
import { getJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export function mapMentor(m) {
  if (!m) return null;
  return {
    ...m,
    avatar: m.avatar || m.avatarUrl,
    specialties: m.specialties || [],
    achievements: m.achievements || [],
    experience: m.experience || [],
    taughtCourses: m.taughtCourses || [],
  };
}

export async function fetchMentors() {
  const list = await getJson(`${base}/api/mentors`);
  return list.map(mapMentor);
}

export async function fetchMentorBySlug(slug) {
  const mentor = await getJson(`${base}/api/mentors/${slug}`);
  return mapMentor(mentor);
}

export async function fetchMentorCourses(slug) {
  return getJson(`${base}/api/mentors/${slug}/courses`);
}

export async function fetchMyMentorProfile(user, token) {
  const headers = user && token ? authHeaders(user, token) : { 'X-User-Id': String(DEV_USER.mentorId) };
  return mapMentor(await getJson(`${base}/api/mentors/me/profile`, headers));
}

export async function fetchMentorHubDashboard(user, token) {
  return getJson(`${base}/api/mentors/me/dashboard`, authHeaders(user, token));
}

export async function fetchMyMentorStudents(user, token) {
  return getJson(`${base}/api/mentors/me/students`, authHeaders(user, token));
}

/** Map of catalogCourseId → enrolled student count for the logged-in mentor. */
export async function fetchMentorStudentCountsByCourse(user, token) {
  const data = await getJson(`${base}/api/mentors/me/student-counts`, authHeaders(user, token));
  const map = {};
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([courseId, count]) => {
      map[String(courseId)] = Number(count) || 0;
      map[Number(courseId)] = Number(count) || 0;
    });
  }
  return map;
}

export async function updateMentorProfile(body, userId = DEV_USER.mentorId) {
  return mapMentor(
    await putJson(`${base}/api/mentors/me/profile`, body, { 'X-User-Id': userId })
  );
}
