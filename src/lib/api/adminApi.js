import { API } from './config';
import { getJson, postJson, putJson } from './http';
import { authHeaders } from './apiHelpers';

const base = API.base;

export async function fetchCourseApprovals(user, token, status) {
  const qs = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  return getJson(`${base}/api/admin/approvals/courses${qs}`, authHeaders(user, token));
}

export async function approveCourse(user, token, courseId) {
  return postJson(
    `${base}/api/admin/approvals/courses/${courseId}/approve`,
    {},
    authHeaders(user, token)
  );
}

export async function rejectCourse(user, token, courseId, reason = 'Does not meet quality standards') {
  return postJson(
    `${base}/api/admin/approvals/courses/${courseId}/reject`,
    { reason },
    authHeaders(user, token)
  );
}

export async function fetchFinancialSummary(user, token) {
  return getJson(`${base}/api/admin/financials/summary`, authHeaders(user, token));
}

export async function fetchTransactions(user, token, params = {}) {
  const qs = new URLSearchParams();
  if (params.type && params.type !== 'All') qs.set('type', params.type);
  if (params.search) qs.set('search', params.search);
  const query = qs.toString();
  const list = await getJson(
    `${base}/api/admin/financials/transactions${query ? `?${query}` : ''}`,
    authHeaders(user, token)
  );
  return list.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: Number(tx.amount),
    cut: tx.cut != null ? Number(tx.cut) : null,
    date: tx.date,
    student: tx.student,
    course: tx.course,
  }));
}

export async function fetchAdminSettings(user, token) {
  const data = await getJson(`${base}/api/admin/settings`, authHeaders(user, token));
  return data.settings || {};
}

export async function updateAdminSettings(user, token, payload) {
  const data = await putJson(`${base}/api/admin/settings`, payload, authHeaders(user, token));
  return data.settings || {};
}

/** Map backend settings map → frontend SystemSettingsPage state */
export function mapSettingsToFrontend(settings) {
  const commissionPct = settings['platform.commission_pct'];
  return {
    platformName: settings['platform.name'] || 'Cloud Nexus',
    supportEmail: settings['platform.support_email'] || 'support@cloudnexus.io',
    commission: commissionPct != null ? Math.round(parseFloat(commissionPct) * 100) : 30,
    allowSignups: settings['platform.allow_signups'] !== 'false',
    maintenanceMode: settings['platform.maintenance_mode'] === 'true',
    twoFactor: settings['platform.two_factor'] !== 'false',
    rateLimit: settings['platform.rate_limit'] !== 'false',
    emailVerification: settings['platform.email_verification'] !== 'false',
    autoScale: settings['platform.auto_scale'] !== 'false',
    debugMode: settings['platform.debug_mode'] === 'true',
    analyticsTracking: settings['platform.analytics_tracking'] !== 'false',
    mentorAutoApprove: settings['platform.mentor_auto_approve'] === 'true',
    minPayout: settings['platform.min_payout']
      ? Number(settings['platform.min_payout'])
      : 100,
    maxFileSize: settings['platform.max_file_size_mb']
      ? Number(settings['platform.max_file_size_mb'])
      : 500,
    maxVideoSize: settings['platform.max_video_size_mb']
      ? Number(settings['platform.max_video_size_mb'])
      : 4096,
  };
}

/** Map frontend settings → backend update payload */
export function mapSettingsToBackend(settings) {
  return {
    platformName: settings.platformName,
    supportEmail: settings.supportEmail,
    commissionPct: settings.commission,
    settings: {
      'platform.allow_signups': String(settings.allowSignups),
      'platform.maintenance_mode': String(settings.maintenanceMode),
      'platform.two_factor': String(settings.twoFactor),
      'platform.rate_limit': String(settings.rateLimit),
      'platform.email_verification': String(settings.emailVerification),
      'platform.auto_scale': String(settings.autoScale),
      'platform.debug_mode': String(settings.debugMode),
      'platform.analytics_tracking': String(settings.analyticsTracking),
      'platform.mentor_auto_approve': String(settings.mentorAutoApprove),
      'platform.min_payout': String(settings.minPayout),
      'platform.max_file_size_mb': String(settings.maxFileSize),
      'platform.max_video_size_mb': String(settings.maxVideoSize),
    },
  };
}
