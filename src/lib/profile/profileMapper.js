import { resolveMediaUrl } from '@/lib/api/mediaApi';

const LANGUAGE_LABELS = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  hi: 'Hindi',
  zh: 'Mandarin Chinese',
  ja: 'Japanese',
  ar: 'Arabic',
  ko: 'Korean',
};

function splitName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

function isAvatarUrl(value) {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('http') || value.startsWith('/') || value.startsWith('data:');
}

function formatUsername(username, email) {
  if (username) return username.startsWith('@') ? username : `@${username}`;
  const local = (email || '').split('@')[0];
  return local ? `@${local}` : '@student';
}

export function mapApiProfileToView(apiProfile, authUser) {
  const fullName = apiProfile?.fullName || authUser?.fullName || '';
  const { firstName, lastName } = splitName(fullName);
  const email = apiProfile?.email || authUser?.email || '';
  const avatarRaw = apiProfile?.avatar;
  const avatar = isAvatarUrl(avatarRaw) ? resolveMediaUrl(avatarRaw) : null;

  return {
    firstName,
    lastName,
    username: formatUsername(apiProfile?.username, email),
    email,
    phone: apiProfile?.phone || '',
    headline: apiProfile?.professionalRole || '',
    bio: apiProfile?.bio || '',
    location: apiProfile?.location || '',
    timezone: 'UTC',
    language: LANGUAGE_LABELS[apiProfile?.settings?.language] || 'English',
    memberSince: apiProfile?.joined || '—',
    lastActive: apiProfile?.lastActive || '—',
    plan: 'Student',
    avatar,
    avatarInitials: avatarRaw && !isAvatarUrl(avatarRaw) ? avatarRaw : `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase(),
    cover: '/assets/profile-cover-default.svg',
    verified: apiProfile?.status === 'Active',
    twoFactorEnabled: false,
    streak: 0,
    social: {
      github: '',
      linkedin: '',
      portfolio: '',
    },
  };
}

export function buildProfileStats(dashboard, enrollments = [], certificates = []) {
  const activeCourses = enrollments.filter((c) => c.status !== 'completed').length;
  const completedCourses = enrollments.filter((c) => c.status === 'completed').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, c) => sum + (c.progress || 0), 0) / enrollments.length)
    : 0;

  return [
    {
      label: 'Courses',
      value: enrollments.length || dashboard?.coursesInProgress || 0,
      suffix: '',
      sub: `${activeCourses || dashboard?.coursesInProgress || 0} active`,
      accent: 'profile-kpi-primary',
    },
    {
      label: 'Study hours',
      value: dashboard?.hoursLearned || 0,
      suffix: dashboard?.hoursLearned ? '+' : '',
      sub: dashboard?.streak ? `${dashboard.streak} day streak` : 'This week',
      accent: 'profile-kpi-success',
    },
    {
      label: 'Certificates',
      value: certificates.length,
      suffix: '',
      sub: certificates.length ? `${certificates.length} earned` : 'None yet',
      accent: 'profile-kpi-accent',
    },
    {
      label: 'Avg. progress',
      value: avgProgress || dashboard?.avgProgress || 0,
      suffix: '%',
      sub: 'Across tracks',
      accent: 'profile-kpi-warning',
    },
    {
      label: 'Lessons done',
      value: dashboard?.lessonsCompleted || 0,
      suffix: '',
      sub: dashboard?.weeklyActivity?.length ? 'This week' : 'Keep learning',
      accent: 'profile-kpi-primary',
    },
    {
      label: 'Quiz score',
      value: dashboard?.quizAvg || 0,
      suffix: dashboard?.quizAvg ? '%' : '',
      sub: dashboard?.quizAvg ? 'Avg. grade' : 'No quizzes yet',
      accent: 'profile-kpi-success',
    },
  ];
}

export function mapEnrollmentsToCoursesInProgress(enrollments = []) {
  return enrollments
    .filter((c) => c.status !== 'completed')
    .map((c, index) => ({
      id: c.id || index + 1,
      trackId: c.trackId || 'cloud',
      title: c.title || 'Course',
      progress: c.progress ?? 0,
      lessonsLeft: Math.max((c.totalLessons || 0) - (c.completedLessons || 0), 0),
      instructor: c.instructor || 'Mentor',
      nextLesson: c.completedLessons ? 'Continue learning' : 'Start course',
      image: c.image || '/assets/profile-cover-default.svg',
    }));
}

export function mapEnrollmentsToCompleted(enrollments = []) {
  return enrollments
    .filter((c) => c.status === 'completed')
    .map((c, index) => ({
      id: c.id || index + 1,
      title: c.title || 'Course',
      completedOn: 'Completed',
      grade: '—',
      hours: 0,
    }));
}

export function mapCertificatesToView(certificates = []) {
  return certificates.map((c) => ({
    id: c.id,
    title: c.title,
    issued: c.issueDate || '—',
    credentialId: c.id,
  }));
}

export function buildProfileFormPayload(form) {
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();
  return {
    fullName,
    phone: form.phone || '',
    bio: form.bio || '',
    location: form.location || '',
    username: (form.username || '').replace(/^@/, ''),
    professionalRole: form.headline || '',
  };
}
