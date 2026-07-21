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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

export function countJoinedToday(users = []) {
  const today = new Date();
  return users.filter((u) => {
    if (!u.joined) return false;
    const d = new Date(u.joined);
    return (
      !Number.isNaN(d.getTime()) &&
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;
}

export function buildCourseTitleMap(catalogCourses = []) {
  const map = {};
  catalogCourses.forEach((c) => {
    if (c.id != null) {
      map[c.id] = c;
      map[String(c.id)] = c;
    }
    if (c.slug) map[c.slug] = c;
  });
  return map;
}

/** Mentor-uploaded catalog listings (exclude platform seed catalog). */
export function filterMentorCatalogCourses(catalogCourses = []) {
  return catalogCourses.filter((c) => {
    const id = Number(c.id);
    if (Number.isFinite(id) && id >= 10) return true;
    return String(c.slug || '').startsWith('content-');
  });
}

function resolveCourseName(course, titleMap = {}) {
  const id = course.courseId ?? course.id;
  const catalog = titleMap[id] || titleMap[String(id)];
  return (
    course.name ||
    course.title ||
    catalog?.title ||
    catalog?.name ||
    (id != null ? `Course #${id}` : 'Course')
  );
}

function resolveCourseMentor(course, titleMap = {}) {
  const id = course.courseId ?? course.id;
  const catalog = titleMap[id] || titleMap[String(id)];
  return course.mentor || catalog?.professor || catalog?.mentorName || '—';
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

function toChartThousands(amount) {
  return Math.round(safeNumber(amount, 0) / 1000);
}

function dayLabelFromDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr || '—';
  return DAY_LABELS[d.getDay()];
}

/** Build sales/payout chart buckets from financial transactions. */
export function buildRevenueDataFromTransactions(transactions = []) {
  if (!transactions.length) return null;

  const sales = transactions.filter((t) => t.type === 'Course Sale');
  const payouts = transactions.filter((t) => t.type === 'Mentor Payout');

  const byDay = {};
  const addToDay = (tx, field, rawAmount) => {
    const key = tx.createdAt?.slice(0, 10) || tx.date || 'unknown';
    if (!byDay[key]) byDay[key] = { sales: 0, payouts: 0 };
    byDay[key][field] += Math.abs(safeNumber(rawAmount, 0));
  };

  sales.forEach((tx) => addToDay(tx, 'sales', tx.amount));
  payouts.forEach((tx) => addToDay(tx, 'payouts', tx.amount));

  const sortedDays = Object.keys(byDay).sort();
  const last7 = sortedDays.slice(-7);
  const week = last7.map((day) => ({
    month: dayLabelFromDate(day),
    s: toChartThousands(byDay[day].sales),
    m: toChartThousands(byDay[day].payouts),
  }));

  const weekBuckets = [];
  for (let w = 0; w < 4; w++) {
    const slice = sortedDays.slice(Math.max(0, sortedDays.length - (4 - w) * 7), Math.max(0, sortedDays.length - (3 - w) * 7));
    if (!slice.length) continue;
    const salesTotal = slice.reduce((sum, d) => sum + byDay[d].sales, 0);
    const payoutTotal = slice.reduce((sum, d) => sum + byDay[d].payouts, 0);
    weekBuckets.push({ month: `W${w + 1}`, s: toChartThousands(salesTotal), m: toChartThousands(payoutTotal) });
  }

  const quarterSize = Math.max(1, Math.ceil(sortedDays.length / 4));
  const year = [];
  for (let q = 0; q < 4; q++) {
    const slice = sortedDays.slice(q * quarterSize, (q + 1) * quarterSize);
    if (!slice.length) continue;
    const salesTotal = slice.reduce((sum, d) => sum + byDay[d].sales, 0);
    const payoutTotal = slice.reduce((sum, d) => sum + byDay[d].payouts, 0);
    year.push({ month: `Q${q + 1}`, s: toChartThousands(salesTotal), m: toChartThousands(payoutTotal) });
  }

  const trend = sortedDays.slice(-12).map((d) => toChartThousands(byDay[d].sales + byDay[d].payouts));

  return { week, month: weekBuckets, year, trend };
}

export function buildCategoriesFromCatalog(catalogCourses = []) {
  const counts = {};
  catalogCourses.forEach((c) => {
    const cat = c.category || c.exploreType || c.trackLabel || 'Other';
    const label = String(cat).replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
    counts[label] = (counts[label] || 0) + 1;
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
    const loc = (u.location || '').trim();
    if (!loc) return;
    buckets[loc] = (buckets[loc] || 0) + 1;
  });

  const located = Object.values(buckets).reduce((sum, n) => sum + n, 0);
  if (!located) return [];

  return Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([region, count], index) => ({
      region,
      pct: Math.max(1, Math.round((count / located) * 100)),
      color: GEO_COLORS[index % GEO_COLORS.length],
    }));
}

/** Count successful course purchases from admin financial transactions. */
function buildPurchaseStats(transactions = []) {
  const counts = {};
  const revenue = {};
  (transactions || []).forEach((tx) => {
    if ((tx.type || '').toLowerCase() !== 'course sale') return;
    const key = String(tx.course || '').trim().toLowerCase();
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
    revenue[key] = (revenue[key] || 0) + safeNumber(tx.amount, 0);
  });
  return { counts, revenue };
}

function parseEnrolledLabel(enrolled) {
  if (enrolled == null || enrolled === '') return 0;
  if (typeof enrolled === 'number') return Number.isFinite(enrolled) ? Math.max(0, Math.round(enrolled)) : 0;
  const s = String(enrolled).trim().toLowerCase().replace(/,/g, '');
  if (!s) return 0;
  if (s.endsWith('m')) {
    const n = parseFloat(s.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1_000_000) : 0;
  }
  if (s.endsWith('k')) {
    const n = parseFloat(s.slice(0, -1));
    return Number.isFinite(n) ? Math.round(n * 1_000) : 0;
  }
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function resolveStudentCount(course, purchaseCount = 0) {
  const fromEnrollmentField = safeNumber(
    course.enrollmentCount ?? course.enrollments ?? course.students,
    0
  );
  const fromLabel = parseEnrolledLabel(course.enrolled);
  // Real purchases / enrollments — never fall back to lesson counts
  return Math.max(fromEnrollmentField, fromLabel, purchaseCount);
}

function mapTopCourses(
  courseReport = [],
  approvals = [],
  titleMap = {},
  catalogCourses = [],
  transactions = []
) {
  const purchaseStats = buildPurchaseStats(transactions);

  if (courseReport.length) {
    return courseReport.slice(0, 5).map((course) => {
      const name = resolveCourseName(course, titleMap);
      const purchaseCount = purchaseStats.counts[name.toLowerCase()] || 0;
      const students = resolveStudentCount(course, purchaseCount);
      const saleRevenue = purchaseStats.revenue[name.toLowerCase()] || 0;
      return {
        name,
        mentor: resolveCourseMentor(course, titleMap),
        students,
        rating: safeNumber(course.avgRating ?? course.rating, 0),
        revenue:
          saleRevenue > 0
            ? `$${saleRevenue.toLocaleString()}`
            : students > 0
              ? `$${safeNumber(course.revenue ?? students * 90, 0).toLocaleString()}`
              : '—',
        trend:
          safeNumber(course.completions, 0) >= students / 2 || students === 0
            ? 'up'
            : 'down',
      };
    });
  }

  const mentorCourses = filterMentorCatalogCourses(catalogCourses);
  if (mentorCourses.length) {
    return [...mentorCourses]
      .map((course) => {
        const name = course.title || course.name || `Course #${course.id}`;
        const purchaseCount = purchaseStats.counts[name.toLowerCase()] || 0;
        const students = resolveStudentCount(course, purchaseCount);
        const saleRevenue = purchaseStats.revenue[name.toLowerCase()] || 0;
        return {
          name,
          mentor: course.professor || course.mentorName || '—',
          students,
          rating: safeNumber(course.rating, 0),
          revenue:
            saleRevenue > 0
              ? `$${saleRevenue.toLocaleString()}`
              : students > 0 && safeNumber(course.price, 0) > 0
                ? `$${(students * safeNumber(course.price, 0)).toLocaleString()}`
                : '—',
          trend: 'up',
        };
      })
      .sort((a, b) => b.students - a.students || a.name.localeCompare(b.name))
      .slice(0, 5);
  }

  return (approvals || []).slice(0, 5).map((course) => {
    const name = course.title || course.courseId || 'Course';
    const purchaseCount = purchaseStats.counts[String(name).toLowerCase()] || 0;
    return {
      name,
      mentor: course.mentor || '—',
      students: purchaseCount,
      rating: safeNumber(course.previewRating, 0),
      revenue:
        purchaseCount > 0 && purchaseStats.revenue[String(name).toLowerCase()]
          ? `$${purchaseStats.revenue[String(name).toLowerCase()].toLocaleString()}`
          : '—',
      trend: 'up',
    };
  });
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
  transactions = [],
} = {}) {
  const titleMap = buildCourseTitleMap(catalogCourses);
  const pendingApprovals = (approvals || []).filter(
    (a) => (a.status || '').toLowerCase() === 'pending'
  ).length;

  const txCharts = buildRevenueDataFromTransactions(transactions);
  const revenueTrend = txCharts?.trend?.length
    ? txCharts.trend
    : Array.isArray(analytics?.revenueTrend)
      ? analytics.revenueTrend.map((v) => safeNumber(v, 0))
      : [0];

  const mentors = (users || []).filter((u) => (u.role || '').toLowerCase() === 'mentor');
  const students = (users || []).filter((u) => (u.role || '').toLowerCase() === 'student');
  const totalMentors = mentors.length;
  const activeLearners = students.length;
  const totalUsers = users.length;
  const hasAnalytics = analytics && Object.keys(analytics).length > 0;
  const hasFinancials = financialSummary && Object.keys(financialSummary).length > 0;
  const hasUsers = users.length > 0;
  const hasApprovals = approvals.length > 0;

  const mrrLabel = hasFinancials && financialSummary.netRevenue != null
    ? formatMrrLabel(financialSummary.netRevenue)
    : analytics?.mrrLabel ||
      (financialSummary?.totalSales != null
        ? formatMrrLabel(financialSummary.totalSales)
        : '$0');

  if (!hasAnalytics && !hasUsers && !hasApprovals && !hasFinancials && !transactions.length) {
    return { ...EMPTY_SNAPSHOT };
  }

  const revenueData = txCharts
    ? { week: txCharts.week, month: txCharts.month, year: txCharts.year }
    : mapRevenueData(analytics?.revenueData);

  const newUsersToday = countJoinedToday(students) || safeNumber(analytics?.newUsersToday, 0);

  return {
    mrrGrowth: safeNumber(analytics?.mrrGrowth, 0),
    activeLearners,
    learnerGrowth: safeNumber(analytics?.learnerGrowth, 0),
    mrrLabel,
    completions: safeNumber(analytics?.completions, 0),
    completionGrowth: safeNumber(analytics?.completionGrowth, 0),
    pendingApprovals: pendingApprovals || safeNumber(analytics?.pendingApprovals, 0),
    resolvedToday: (approvals || []).filter(
      (a) => (a.status || '').toLowerCase() === 'approved'
    ).length,
    revenueTrend: revenueTrend.length ? revenueTrend : [0],
    revenueData,
    systemHealth: analytics?.systemHealth || [],
    newUsersToday,
    topCourses: mapTopCourses(
      analytics?.topCourses,
      approvals,
      titleMap,
      catalogCourses,
      transactions
    ),
    actionItems: buildAdminActionItems({ pendingApprovals, financialSummary }),
    totalUsers,
    totalMentors,
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
  const mentorCatalogCourses = filterMentorCatalogCourses(catalogCourses);
  const titleMap = buildCourseTitleMap(mentorCatalogCourses);
  const mentorCourseIds = new Set(
    mentorCatalogCourses.map((c) => Number(c.id)).filter((id) => Number.isFinite(id))
  );

  const totalRevenue = revenueReport.reduce((sum, row) => sum + safeNumber(row.revenue, 0), 0);
  const publishedCourses = mentorCatalogCourses.length;

  const mentorCourseReport = courseReport.filter((row) =>
    mentorCourseIds.has(Number(row.courseId))
  );

  const avgCompletion =
    mentorCourseReport.length > 0
      ? Math.round(
          mentorCourseReport.reduce((sum, c) => {
            const enrollments = safeNumber(c.enrollments, 0);
            const completions = safeNumber(c.completions, 0);
            return sum + (enrollments > 0 ? (completions / enrollments) * 100 : 0);
          }, 0) / mentorCourseReport.length
        )
      : 0;

  const coursesPublishedThisPeriod = enrollmentReport.reduce(
    (sum, row) => sum + safeNumber(row.enrollments, 0),
    0
  );

  const categories = buildCategoriesFromCatalog(mentorCatalogCourses);

  const rankedCourses = mentorCourseReport
    .filter(
      (course) =>
        safeNumber(course.enrollments, 0) > 0 || safeNumber(course.completions, 0) > 0
    )
    .slice(0, 5);

  return {
    revenue: totalRevenue > 0 ? totalRevenue / 1000 : 0,
    users: allUsers.length || safeNumber(analytics?.activeLearners, 0),
    courses: publishedCourses,
    completion: avgCompletion,
    coursesPublishedMeta: coursesPublishedThisPeriod,
    topCourses: rankedCourses.map((course, index) => ({
      rank: index + 1,
      name: resolveCourseName(course, titleMap),
      mentor: resolveCourseMentor(course, titleMap),
      students: safeNumber(course.enrollments, 0),
      revenue: `$${safeNumber(course.revenue ?? course.enrollments * 90, 0).toLocaleString()}`,
      rating: safeNumber(course.avgRating, 0),
      growth:
        safeNumber(course.completions, 0) > 0 && safeNumber(course.enrollments, 0) > 0
          ? `+${Math.round((safeNumber(course.completions, 0) / safeNumber(course.enrollments, 1)) * 100)}%`
          : '—',
      up: safeNumber(course.completions, 0) >= safeNumber(course.enrollments, 0) / 2,
    })),
    topMentors: (mentors || []).slice(0, 5).map((mentor) => ({
      rank: 0,
      name: mentor.name || mentor.fullName || 'Mentor',
      students: safeNumber(mentor.students ?? mentor.learners, 0),
      courses: safeNumber(mentor.courses, 0),
      rating: safeNumber(mentor.rating, 0),
      revenue: mentor.revenue || '—',
      trackLabel: mentor.trackLabel || mentor.professionalRole || '—',
    })),
    categories,
    geography: buildGeoFromUsers(allUsers),
    enrollmentReport,
    revenueReport,
  };
}

/** @deprecated use buildCategoriesFromCatalog */
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

export { EMPTY_SNAPSHOT };
