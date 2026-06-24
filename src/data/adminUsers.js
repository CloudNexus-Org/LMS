export const INITIAL_ADMIN_USERS = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@example.com', role: 'Student', joined: 'Mar 12, 2026', status: 'Active', courses: 4, lastActive: '2 hours ago', avatar: 'AC', spend: '$360' },
  { id: 2, name: 'Dr. Arjan Singh', email: 'arjan@cloudnexus.com', role: 'Mentor', joined: 'Jan 5, 2024', status: 'Active', courses: 3, lastActive: '30 mins ago', avatar: 'AS', spend: '$0' },
  { id: 3, name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'Student', joined: 'Feb 18, 2026', status: 'Active', courses: 6, lastActive: '5 hours ago', avatar: 'SM', spend: '$540' },
  { id: 4, name: 'Admin User', email: 'admin@cloudnexus.com', role: 'Admin', joined: 'Dec 1, 2023', status: 'Active', courses: 0, lastActive: '1 hour ago', avatar: 'AU', spend: '$0' },
  { id: 5, name: 'James Wilson', email: 'j.wilson@example.com', role: 'Student', joined: 'Jan 22, 2026', status: 'Inactive', courses: 2, lastActive: '3 days ago', avatar: 'JW', spend: '$180' },
  { id: 6, name: 'Priya Nair', email: 'priya.n@cloudnexus.com', role: 'Mentor', joined: 'Mar 3, 2025', status: 'Active', courses: 5, lastActive: '1 day ago', avatar: 'PN', spend: '$0' },
  { id: 7, name: 'Spam Account', email: 'fake1234@spam.com', role: 'Student', joined: 'May 5, 2026', status: 'Banned', courses: 0, lastActive: 'Never', avatar: 'SA', spend: '$0' },
  { id: 8, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Student', joined: 'Apr 10, 2026', status: 'Active', courses: 3, lastActive: '4 hours ago', avatar: 'ED', spend: '$270' },
];

const STORAGE_KEY = 'lms-admin-users';

export const MENTOR_TRACK_OPTIONS = [
  'Full-Stack Web',
  'AI / ML',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Engineering',
  'Mobile Development',
  'Web3 & Blockchain',
];

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatJoinedDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function loadAdminUsers() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return INITIAL_ADMIN_USERS;
}

export function saveAdminUsers(users) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function buildMentorUser(form) {
  const joined = formatJoinedDate();
  return {
    id: Date.now(),
    name: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    role: 'Mentor',
    joined,
    status: 'Active',
    courses: 0,
    lastActive: 'Just now',
    avatar: getInitials(form.fullName),
    spend: '$0',
    username: form.username.trim(),
    professionalRole: form.professionalRole.trim(),
    company: form.company.trim(),
    trackLabel: form.trackLabel,
    location: form.location.trim(),
    bio: form.bio.trim(),
  };
}

export function addMentorToDirectory(users, form) {
  const mentor = buildMentorUser(form);
  const next = [mentor, ...users];
  saveAdminUsers(next);
  return next;
}

export function updateAdminUser(users, id, updates) {
  const next = users.map((user) =>
    user.id === id
      ? {
          ...user,
          ...updates,
          avatar: updates.name ? getInitials(updates.name) : user.avatar,
        }
      : user
  );
  saveAdminUsers(next);
  return next;
}

export function removeAdminUser(users, id) {
  const next = users.filter((user) => user.id !== id);
  saveAdminUsers(next);
  return next;
}

export function toggleUserBan(users, id) {
  const next = users.map((user) => {
    if (user.id !== id) return user;
    if (user.role === 'Admin') return user;
    return {
      ...user,
      status: user.status === 'Banned' ? 'Active' : 'Banned',
    };
  });
  saveAdminUsers(next);
  return next;
}
