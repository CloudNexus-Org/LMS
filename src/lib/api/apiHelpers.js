/** Map backend auth user → frontend auth store shape */
export function mapAuthUser(user) {
  if (!user) return null;
  const role = (user.role || 'STUDENT').toLowerCase();
  return {
    id: user.id,
    username: user.username || user.email,
    email: user.email,
    fullName: user.fullName,
    role,
  };
}

export function toFrontendRole(role) {
  if (!role) return 'Student';
  const r = role.toUpperCase();
  if (r === 'ADMIN') return 'Admin';
  if (r === 'MENTOR') return 'Mentor';
  return 'Student';
}

export function toBackendRole(role) {
  if (!role) return 'STUDENT';
  const r = String(role).toLowerCase();
  if (r === 'admin') return 'ADMIN';
  if (r === 'mentor') return 'MENTOR';
  return 'STUDENT';
}

export function toFrontendStatus(status) {
  if (!status) return 'Active';
  const s = status.toUpperCase();
  if (s === 'BANNED') return 'Banned';
  if (s === 'INACTIVE') return 'Inactive';
  return 'Active';
}

export function toBackendStatus(status) {
  if (!status) return 'ACTIVE';
  const s = String(status).toLowerCase();
  if (s === 'banned') return 'BANNED';
  if (s === 'inactive') return 'INACTIVE';
  return 'ACTIVE';
}

export function mapAdminUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name || u.fullName || '',
    email: u.email,
    role: toFrontendRole(u.role),
    status: toFrontendStatus(u.status),
    joined: u.joined || '',
    courses: u.courses ?? 0,
    lastActive: u.lastActive || '',
    avatar: u.avatar,
    spend: u.spend,
    username: u.username,
    professionalRole: u.professionalRole,
    company: u.company,
    trackLabel: u.trackLabel,
    location: u.location,
    bio: u.bio,
  };
}

export function authHeaders(user, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (user?.id != null) headers['X-User-Id'] = String(user.id);
  if (user?.role) headers['X-User-Role'] = toBackendRole(user.role);
  return headers;
}

export function dashboardPathForRole(role) {
  const r = (role || 'student').toLowerCase();
  if (r === 'admin') return '/admin/dashboard';
  if (r === 'mentor') return '/mentor/dashboard';
  return '/student/dashboard';
}

export function parseApiError(err) {
  const msg = err?.message || '';
  const status = err?.status;

  try {
    const parsed = JSON.parse(msg);
    if (parsed.message) return parsed.message;
    if (parsed.status === 409 || status === 409) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (parsed.status === 401 || status === 401) {
      return 'Invalid email or password.';
    }
    if (parsed.status === 403 || status === 403) {
      return 'Your account is inactive. Contact support.';
    }
    if (parsed.status === 429 || status === 429) {
      return 'Too many failed attempts. Please try again later.';
    }
    return parsed.error || msg;
  } catch {
    if (status === 409) return 'This email is already registered. Please sign in instead.';
    if (status === 401) return 'Invalid email or password.';
    if (status === 403) return 'Your account is inactive. Contact support.';
    if (status === 429) return 'Too many failed attempts. Please try again later.';
    return msg || 'Something went wrong';
  }
}
