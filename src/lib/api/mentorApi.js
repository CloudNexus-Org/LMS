import { API, DEV_USER } from './config';
import { getJson, putJson } from './http';

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

export async function fetchMyMentorProfile(userId = DEV_USER.mentorId) {
  return mapMentor(await getJson(`${base}/api/mentors/me/profile`, { 'X-User-Id': userId }));
}

export async function updateMentorProfile(body, userId = DEV_USER.mentorId) {
  return mapMentor(
    await putJson(`${base}/api/mentors/me/profile`, body, { 'X-User-Id': userId })
  );
}
