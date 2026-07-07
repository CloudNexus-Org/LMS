const EMPTY_SNAPSHOT = {
  mrrGrowth: 0,
  activeLearners: 0,
  learnerGrowth: 0,
  mrrLabel: '$0',
  completions: 0,
  completionGrowth: 0,
  pendingApprovals: 0,
  resolvedToday: 0,
  revenueTrend: [0],
  revenueData: { week: [], month: [], year: [] },
  systemHealth: [],
  newUsersToday: 0,
  topCourses: [],
  actionItems: [],
  totalUsers: 0,
  totalMentors: 0,
};

const CATEGORY_COLORS = ['bg-primary', 'bg-success', 'bg-warning', 'bg-accent'];
const CATEGORY_TEXT = ['text-primary', 'text-success', 'text-warning', 'text-accent'];
const GEO_COLORS = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning'];

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function countJoinedThisMonth(users = []) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return users.filter((u) => {
    if (!u.joined) return false;
    const d = new Date(u.joined);
    return !Number.isNaN(d.getTime()) && d.getMonth() === month && d.getFullYear() === year;
  }).length;
}

export function buildCourseTitleMap(catalogCourses = []) {
  const map = {};
  catalogCourses.forEach((c) => {
    if (c.id != null) map[c.id] = c.title || c.name;
    if (c.slug) map[c.slug] = c.title || c.name;
  });
  return map;
}

function resolveCourseName(course, titleMap = {}) {
  const id = course.courseId ?? course.id;
  return (
    course.name ||
    course.title ||
    titleMap[id] ||
    titleMap[String(id)] ||
    (id != null ? `Course #${id}` : 'Course')
  );
}

function mapRevenueData(revenueData) {
  if (!revenueData || typeof revenueData !== 'object') {
    return { week: [], month: [], year: [] };
  }
  const normalize = (points) =>
    (points || []).map((p) => ({
      month: p?.month ?? p?.label ?? '—',
      s: safeNumber(p?.s ?? p?.sales, 0),
      m: safeNumber(p?.m ?? p?.payouts, 0),
    }));
  return {
    week: normalize(revenueData.week),
    month: normalize(revenueData.month),
    year: normalize(revenueData.year),
  };
}

export function buildCategoriesFromApprovals(approvals = []) {
  const counts = {};
  approvals.forEach((a) => {
    const cat = a.category || a.trackLabel || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  if (!total) return [];

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count], index) => ({
      name,
      share: Math.round((count / total) * 100),
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      text: CATEGORY_TEXT[index % CATEGORY_TEXT.length],
    }));
}

export function buildGeoFromUsers(users = []) {
  const active = users.filter((u) => (u.status || '').toLowerCase() === 'active');
  if (!active.length) return [];

  const buckets = {};
  active.forEach((u) => {
    const loc = (u.location || u.trackLabel || 'Unknown').trim() || 'Unknown';
    buckets[loc] = (buckets[loc] || 0) + 1;
  });

  const total = active.length;
  return Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([region, count], index) => ({
      region,
      pct: Math.max(1, Math.round((count / total) * 100)),
      color: GEO_COLORS[index % GEO_COLORS.length],
    }));
}

function mapTopCourses(courseReport = [], approvals = [], titleMap = {}) {
  if (courseReport.length) {
    return courseReport.slice(0, 5).map((course, index) => ({
      name: resolveCourseName(course, titleMap),
      mentor: course.mentor || 'Mentor',
      students: safeNumber(course.enrollments ?? course.students, 0),
      rating: safeNumber(course.avgRating ?? course.rating, 0),
      revenue: `$${(safeNumber(course.enrollments, 0) * 90).toLocaleString()}`,
      trend:
        safeNumber(course.completions, 0) >= safeNumber(course.enrollments, 0) / 2
          ? 'up'
          : 'down',
    }));
  }

  return (approvals || []).slice(0, 5).map((course) => ({
    name: course.title || course.courseId,
    mentor: course.mentor || 'Mentor',
    students: safeNumber(course.lessons, 0) * 10,
    rating: safeNumber(course.previewRating, 4.5),
    revenue: '—',
    trend: 'up',
  }));
}

export function buildAdminActionItems({ pendingApprovals = 0, financialSummary = null }) {
  const items = [];
  if (pendingApprovals > 0) {
    items.push({
      type: 'row',
      title: `${pendingApprovals} Course${pendingApprovals > 1 ? 's' : ''} Awaiting Review`,
      desc: 'Mentor submissions need QA approval before publishing.',
      action: { label: 'Review Now', to: '/admin/approvals', variant: 'primary' },
    });
  }
  const pendingPayouts = financialSummary?.pendingPayouts ?? financialSummary?.pendingPayoutCount;
  if (pendingPayouts > 0) {
    items.push({
      type: 'row',
      title: 'Mentor Payouts Pending',
      desc: `$${safeNumber(financialSummary?.pendingPayoutAmount, 0).toLocaleString()} across ${pendingPayouts} mentors needs authorization.`,
      action: { label: 'Authorize', to: '/admin/revenue', variant: 'outline' },
    });
  }
  if (items.length === 0) {
    items.push({
      type: 'row',
      title: 'Platform queue is clear',
      desc: 'No urgent admin actions right now.',
      action: { label: 'View Reports', to: '/admin/reports', variant: 'outline' },
    });
  }
  return items;
}

function formatMrrLabel(amount) {
  const n = safeNumber(amount, 0);
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

export function buildAdminDashboardSnapshot({
  analytics = null,
  approvals = [],
  financialSummary = null,
  users = [],
  catalogCourses = [],
} = {}) {
  const titleMap = buildCourseTitleMap(catalogCourses);
  const pendingApprovals = (approvals || []).filter(
    (a) => (a.status || '').toLowerCase() === 'pending'
  ).length;

  const revenueTrend = Array.isArray(analytics?.revenueTrend)
    ? analytics.revenueTrend.map((v) => safeNumber(v, 0))
    : [0];

  const mentors = (users || []).filter((u) => (u.role || '').toLowerCase() === 'mentor').length;
  const totalUsers = users.length || safeNumber(analytics?.activeLearners, 0);
  const hasAnalytics = analytics && Object.keys(analytics).length > 0;

  const mrrLabel =
    analytics?.mrrLabel ||
    (financialSummary?.netRevenue != null
      ? formatMrrLabel(financialSummary.netRevenue)
      : financialSummary?.totalSales != null
        ? formatMrrLabel(financialSummary.totalSales)
        : '$0');

  if (!hasAnalytics && !users.length && !approvals.length && !financialSummary) {
    return { ...EMPTY_SNAPSHOT };
  }

  return {
    mrrGrowth: safeNumber(analytics?.mrrGrowth, 0),
    activeLearners: totalUsers,
    learnerGrowth: safeNumber(analytics?.learnerGrowth, 0),
    mrrLabel,
    completions: safeNumber(analytics?.completions, 0),
    completionGrowth: safeNumber(analytics?.completionGrowth, 0),
    pendingApprovals: pendingApprovals || safeNumber(analytics?.pendingApprovals, 0),
    resolvedToday: (approvals || []).filter(
      (a) => (a.status || '').toLowerCase() === 'approved'
    ).length,
    revenueTrend: revenueTrend.length ? revenueTrend : [0],
    revenueData: mapRevenueData(analytics?.revenueData),
    systemHealth: analytics?.systemHealth || [],
    newUsersToday: countJoinedThisMonth(users) || safeNumber(analytics?.newUsersToday, 0),
    topCourses: mapTopCourses(analytics?.topCourses, approvals, titleMap),
    actionItems: buildAdminActionItems({ pendingApprovals, financialSummary }),
    totalUsers,
    totalMentors: mentors,
  };
}

export function buildAdminReportsSnapshot({
  analytics = null,
  enrollmentReport = [],
  revenueReport = [],
  courseReport = [],
  mentors = [],
  approvals = [],
  allUsers = [],
  catalogCourses = [],
} = {}) {
  const titleMap = buildCourseTitleMap(catalogCourses);
  const totalRevenue = revenueReport.reduce((sum, row) => sum + safeNumber(row.revenue, 0), 0);
  const publishedCourses = catalogCourses.length || courseReport.length;

  const avgCompletion =
    courseReport.length > 0
      ? Math.round(
          courseReport.reduce((sum, c) => {
            const enrollments = safeNumber(c.enrollments, 0);
            const completions = safeNumber(c.completions, 0);
            return sum + (enrollments > 0 ? (completions / enrollments) * 100 : 0);
          }, 0) / courseReport.length
        )
      : 0;

  const coursesPublishedThisPeriod = enrollmentReport.reduce(
    (sum, row) => sum + safeNumber(row.enrollments, 0),
    0
  );

  return {
    revenue: totalRevenue > 0 ? totalRevenue / 1000 : parseFloat(String(analytics?.mrrLabel || '0').replace(/[^\d.]/g, '')) || 0,
    users: allUsers.length || safeNumber(analytics?.activeLearners, 0),
    courses: publishedCourses,
    completion: avgCompletion,
    coursesPublishedMeta: coursesPublishedThisPeriod,
    topCourses: courseReport.slice(0, 5).map((course, index) => ({
      rank: index + 1,
      name: resolveCourseName(course, titleMap),
      mentor: course.mentor || '—',
      students: safeNumber(course.enrollments, 0),
      revenue: `$${(safeNumber(course.enrollments, 0) * 90).toLocaleString()}`,
      rating: safeNumber(course.avgRating, 0),
      growth:
        safeNumber(course.completions, 0) > 0 && safeNumber(course.enrollments, 0) > 0
          ? `+${Math.round((safeNumber(course.completions, 0) / safeNumber(course.enrollments, 1)) * 100)}%`
          : '—',
      up: safeNumber(course.completions, 0) >= safeNumber(course.enrollments, 0) / 2,
    })),
    topMentors: (mentors || []).slice(0, 5).map((mentor, index) => ({
      rank: index + 1,
      name: mentor.name || mentor.fullName || 'Mentor',
      students: safeNumber(mentor.students ?? mentor.learners, 0),
      courses: safeNumber(mentor.courses, 0),
      rating: safeNumber(mentor.rating, 0),
      revenue: mentor.revenue || '—',
      trackLabel: mentor.trackLabel || mentor.professionalRole || '—',
    })),
    categories: buildCategoriesFromApprovals(approvals),
    geography: buildGeoFromUsers(allUsers),
    enrollmentReport,
    revenueReport,
  };
}

export { EMPTY_SNAPSHOT };
