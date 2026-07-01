import { API } from './config';
import { getJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export async function fetchStudentDashboard(user, token) {
  return getJson(`${base}/api/analytics/student/dashboard`, authHeaders(user, token));
}

export async function fetchMentorDashboard(user, token) {
  return getJson(`${base}/api/analytics/mentor/dashboard`, authHeaders(user, token));
}

export async function fetchMentorRevenue(user, token, period = 'week') {
  return getJson(`${base}/api/analytics/mentor/revenue?period=${period}`, authHeaders(user, token));
}

export async function fetchMentorStudents(user, token) {
  return getJson(`${base}/api/analytics/mentor/students`, authHeaders(user, token));
}

export async function fetchMentorCourseAnalytics(user, token, courseId) {
  return getJson(`${base}/api/analytics/mentor/courses/${courseId}`, authHeaders(user, token));
}

export async function fetchAdminDashboard(user, token) {
  return getJson(`${base}/api/analytics/admin/dashboard`, authHeaders(user, token));
}

export async function fetchEnrollmentReport(user, token, from, to) {
  return getJson(
    `${base}/api/analytics/admin/reports/enrollments?from=${from}&to=${to}`,
    authHeaders(user, token)
  );
}

export async function fetchRevenueReport(user, token, from, to) {
  return getJson(
    `${base}/api/analytics/admin/reports/revenue?from=${from}&to=${to}`,
    authHeaders(user, token)
  );
}

export async function fetchCourseReport(user, token, from, to) {
  return getJson(
    `${base}/api/analytics/admin/reports/courses?from=${from}&to=${to}`,
    authHeaders(user, token)
  );
}
