const ENGAGEMENT_TREND = [58, 64, 61, 72, 78, 74, 86, 90, 88, 94, 98, 92];

export const BASE_ENGAGEMENT_CHART = {
  week: [
    { label: "Mon", enrollments: 62, watchHours: 48 },
    { label: "Tue", enrollments: 78, watchHours: 58 },
    { label: "Wed", enrollments: 71, watchHours: 52 },
    { label: "Thu", enrollments: 88, watchHours: 64 },
    { label: "Fri", enrollments: 95, watchHours: 72 },
    { label: "Sat", enrollments: 82, watchHours: 61 },
    { label: "Sun", enrollments: 74, watchHours: 55 },
  ],
  month: [
    { label: "W1", enrollments: 220, watchHours: 175 },
    { label: "W2", enrollments: 268, watchHours: 210 },
    { label: "W3", enrollments: 312, watchHours: 248 },
    { label: "W4", enrollments: 348, watchHours: 276 },
  ],
};

export const BASE_KPIS = {
  students: 1248,
  revenue: 4250,
  courses: 4,
  rating: 4.8,
  pendingQa: 12,
  weeklyGrowth: 24,
  newReviews: 86,
  engagement: 92,
};

export const MENTOR_COURSES = [
  {
    id: "cloud-arch",
    name: "Cloud Architecture Patterns",
    students: 842,
    revenue: 28400,
    rating: 4.9,
    trend: "up",
    color: "var(--primary)",
  },
  {
    id: "state-mgmt",
    name: "Advanced State Management",
    students: 621,
    revenue: 19850,
    rating: 4.8,
    trend: "up",
    color: "var(--success)",
  },
  {
    id: "react-perf",
    name: "React Performance Patterns",
    students: 498,
    revenue: 14200,
    rating: 4.7,
    trend: "up",
    color: "var(--warning)",
  },
  {
    id: "system-design",
    name: "System Design Fundamentals",
    students: 312,
    revenue: 9800,
    rating: 4.6,
    trend: "down",
    color: "var(--accent)",
  },
];

function jitterValue(value, spread = 0.08) {
  const next = Math.round(value * (1 + (Math.random() * 2 - 1) * spread));
  return Math.max(1, next);
}

function jitterDecimal(value, spread = 0.04) {
  const next = value * (1 + (Math.random() * 2 - 1) * spread);
  return +Math.max(0, next).toFixed(1);
}

export function buildCourseMix(courses, metric = "revenue") {
  const rows = courses.map((course) => ({
    ...course,
    value: metric === "revenue" ? course.revenue : course.students,
  }));
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    value: row.value,
    share: +((row.value / total) * 100).toFixed(1),
    color: row.color,
    rating: row.rating,
    trend: row.trend,
  }));
}

export function buildSnapshot() {
  const courseList = MENTOR_COURSES.map((course) => ({
    ...course,
    students: jitterValue(course.students, 0.06),
    revenue: jitterValue(course.revenue, 0.05),
  }));

  const chartData = Object.fromEntries(
    Object.entries(BASE_ENGAGEMENT_CHART).map(([key, points]) => [
      key,
      points.map((point) => ({
        ...point,
        enrollments: jitterValue(point.enrollments, 0.12),
        watchHours: jitterValue(point.watchHours, 0.12),
      })),
    ])
  );

  return {
    students: jitterValue(BASE_KPIS.students, 0.03),
    revenue: jitterValue(BASE_KPIS.revenue, 0.06),
    courses: courseList.length,
    rating: jitterDecimal(BASE_KPIS.rating, 0.02),
    pendingQa: BASE_KPIS.pendingQa,
    weeklyGrowth: jitterDecimal(BASE_KPIS.weeklyGrowth, 0.05),
    newReviews: jitterValue(BASE_KPIS.newReviews, 0.1),
    engagement: jitterValue(BASE_KPIS.engagement, 0.04),
    trend: ENGAGEMENT_TREND.map((v) => jitterValue(v, 0.08)),
    chartData,
    courseList,
    revenueMix: buildCourseMix(courseList, "revenue"),
    enrollmentMix: buildCourseMix(courseList, "students"),
    totalRevenue: courseList.reduce((sum, c) => sum + c.revenue, 0),
    totalStudents: courseList.reduce((sum, c) => sum + c.students, 0),
  };
}

/** Fetches live mentor dashboard metrics — delegates to API sources via hook/mappers. */
export async function fetchMentorDashboardSnapshot({ user, token } = {}) {
  const { buildMentorDashboardSnapshot } = await import('@/lib/mentor/mentorMappers');
  if (!user?.id || !token) {
    return buildMentorDashboardSnapshot({});
  }
  try {
    const [
      { fetchMentorHubDashboard, fetchMyMentorStudents, fetchMyMentorProfile },
      { fetchMentorDashboard, fetchMentorRevenue },
      { fetchCourseDrafts },
      { fetchPendingQaCount },
    ] = await Promise.all([
      import('@/lib/api/mentorApi'),
      import('@/lib/api/analyticsApi'),
      import('@/lib/api/contentApi'),
      import('@/lib/api/learningApi'),
    ]);

    const [hub, students, analytics, revenueWeek, revenueMonth, drafts, profile, pendingQa] =
      await Promise.all([
        fetchMentorHubDashboard(user, token).catch(() => null),
        fetchMyMentorStudents(user, token).catch(() => []),
        fetchMentorDashboard(user, token).catch(() => null),
        fetchMentorRevenue(user, token, 'week').catch(() => null),
        fetchMentorRevenue(user, token, 'month').catch(() => null),
        fetchCourseDrafts(user, token).catch(() => []),
        fetchMyMentorProfile(user, token).catch(() => null),
        fetchPendingQaCount(user, token).catch(() => 0),
      ]);

    return buildMentorDashboardSnapshot({
      hub,
      students: Array.isArray(students) ? students : [],
      analytics,
      revenueWeek,
      revenueMonth,
      drafts: Array.isArray(drafts) ? drafts : [],
      profile,
      pendingQa: typeof pendingQa === 'number' ? pendingQa : pendingQa?.count ?? 0,
    });
  } catch {
    return buildMentorDashboardSnapshot({});
  }
}

export function formatMentorCurrency(value) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toLocaleString()}`;
}

export function toTopCoursesTable(courses) {
  return courses.map((course) => ({
    name: course.name,
    students: course.students,
    rating: course.rating,
    revenue: formatMentorCurrency(course.revenue),
    trend: course.trend,
  }));
}
