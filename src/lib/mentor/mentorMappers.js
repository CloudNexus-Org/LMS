import { buildCourseMix, formatMentorCurrency } from '@/data/mentorDashboard';

const COURSE_COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--accent)'];
const PROGRESS_COLORS = ['bg-primary', 'bg-success', 'bg-warning', 'bg-accent'];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

function progressToGrade(progress) {
  const p = Number(progress) || 0;
  if (p >= 97) return 'A+';
  if (p >= 93) return 'A';
  if (p >= 90) return 'A-';
  if (p >= 87) return 'B+';
  if (p >= 83) return 'B';
  if (p >= 80) return 'B-';
  if (p >= 77) return 'C+';
  if (p >= 73) return 'C';
  if (p >= 70) return 'C-';
  if (p >= 60) return 'D';
  return 'F';
}

function mapStudentStatus(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return 'Completed';
  if (s === 'inactive') return 'Inactive';
  return 'Active';
}

export function mapMentorStudentRow(raw) {
  if (!raw) return null;
  const name = raw.studentName || 'Student';
  const progress = Number(raw.progress) || 0;
  return {
    id: raw.studentId ?? raw.id,
    name,
    email: raw.studentEmail || '',
    avatar: initials(name),
    enrolled: raw.courseTitle || 'Course',
    progress,
    lastActive: 'Recently',
    status: mapStudentStatus(raw.status),
    joined: '—',
    grade: progressToGrade(progress),
    messages: 0,
  };
}

export function buildMentorStudentsSummary(students) {
  const rows = (students || []).map(mapMentorStudentRow).filter(Boolean);
  const active = rows.filter((s) => s.status === 'Active').length;
  const completed = rows.filter((s) => s.status === 'Completed').length;
  const avgProgress = rows.length
    ? Math.round(rows.reduce((sum, s) => sum + s.progress, 0) / rows.length)
    : 0;
  return { rows, total: rows.length, active, completed, avgProgress };
}

function dayLabel(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr.slice(5);
  return DAY_NAMES[d.getDay()];
}

function buildChartData(revenueWeek, revenueMonth, analytics) {
  const weekFromRevenue = revenueWeek?.points?.length
    ? revenueWeek.points.map((p) => ({
        label: dayLabel(p.date),
        enrollments: p.students ?? 0,
        watchHours: Math.round((p.revenue ?? 0) / 20),
      }))
    : [];

  const monthFromRevenue =
    revenueMonth?.points?.length >= 4
      ? revenueMonth.points.slice(-4).map((p, i) => ({
          label: `W${i + 1}`,
          enrollments: p.students ?? 0,
          watchHours: Math.round((p.revenue ?? 0) / 20),
        }))
      : [];

  if (weekFromRevenue.length || monthFromRevenue.length) {
    return {
      week: weekFromRevenue,
      month: monthFromRevenue.length ? monthFromRevenue : analytics?.chartData?.month ?? [],
    };
  }

  return analytics?.chartData ?? { week: [], month: [] };
}

function buildCourseList(taughtCourses, students, analytics) {
  if (!taughtCourses?.length) return [];

  const fromAnalytics = analytics?.courseList ?? [];

  return taughtCourses.map((course, index) => {
    const title = course.title || `Course ${index + 1}`;
    const enrolled = students.filter(
      (s) => (s.courseTitle || '').toLowerCase() === title.toLowerCase()
    );
    const match = fromAnalytics.find(
      (c) => (c.name || '').toLowerCase() === title.toLowerCase()
    );
    const studentCount = enrolled.length || match?.students || 0;
    const revenue = match?.revenue ?? 0;
    return {
      id: match?.id ?? `course-${index}`,
      name: title,
      students: studentCount,
      revenue,
      rating: match?.rating ?? 0,
      trend: match?.trend ?? 'up',
      color: COURSE_COLORS[index % COURSE_COLORS.length],
    };
  });
}

export function mapStudentToEnrollmentRow(student) {
  return {
    name: student.studentName || 'Student',
    initials: initials(student.studentName),
    course: student.courseTitle || 'Course',
    time: student.status === 'Completed' ? 'Completed' : 'Active learner',
    amount: student.progress != null ? `${student.progress}%` : '—',
  };
}

export function buildCourseProgress(students, taughtCourses) {
  const titles =
    taughtCourses?.map((c) => c.title).filter(Boolean) ??
    [...new Set(students.map((s) => s.courseTitle).filter(Boolean))];

  return titles.slice(0, 4).map((title, index) => {
    const rows = students.filter((s) => s.courseTitle === title);
    const value = rows.length
      ? Math.round(rows.reduce((sum, s) => sum + (s.progress ?? 0), 0) / rows.length)
      : 0;
    return {
      title,
      value,
      color: PROGRESS_COLORS[index % PROGRESS_COLORS.length],
    };
  });
}

export function buildActivities(students, pendingQa) {
  const items = [];
  const recent = students.slice(0, 2);
  recent.forEach((s) => {
    items.push({
      title: 'New enrollment',
      desc: `${s.studentName || 'A student'} joined ${s.courseTitle || 'your course'}`,
      icon: 'users',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      time: 'Recent',
    });
  });
  if (pendingQa > 0) {
    items.push({
      title: 'Q&A needs reply',
      desc: `${pendingQa} student question${pendingQa > 1 ? 's' : ''} awaiting answers`,
      icon: 'message',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      time: 'Pending',
    });
  }
  const completed = students.find((s) => s.status === 'Completed');
  if (completed) {
    items.push({
      title: 'Course completed',
      desc: `${completed.studentName} finished ${completed.courseTitle}`,
      icon: 'star',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      time: 'Milestone',
    });
  }
  return items.slice(0, 4);
}

export function buildActionItems({ pendingQa = 0, pendingDrafts = 0, revenue = 0 }) {
  const items = [];
  if (pendingQa > 0) {
    items.push({
      icon: 'message',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      title: `${pendingQa} Q&A thread${pendingQa > 1 ? 's' : ''} need replies`,
      desc: 'Students are waiting for your answers.',
      action: { label: 'Reply now', to: '/mentor/notifications', variant: 'primary' },
    });
  }
  if (pendingDrafts > 0) {
    items.push({
      icon: 'book',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: `${pendingDrafts} lesson${pendingDrafts > 1 ? 's' : ''} pending review`,
      desc: 'Upload drafts need approval before publishing.',
      action: { label: 'Review', to: '/mentor/lessons', variant: 'outline' },
    });
  }
  if (revenue > 0) {
    items.push({
      icon: 'dollar',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      title: 'Revenue this week',
      desc: `${formatMentorCurrency(revenue)} estimated from enrollments.`,
      action: { label: 'View revenue', to: '/mentor/analytics', variant: 'outline' },
    });
  }
  return items;
}

export function buildMentorDashboardSnapshot({
  hub = null,
  students = [],
  analytics = null,
  revenueWeek = null,
  revenueMonth = null,
  drafts = [],
  profile = null,
  pendingQa = 0,
}) {
  const taught = profile?.taughtCourses ?? [];
  const totalStudents = hub?.totalStudents ?? students.length ?? analytics?.students ?? 0;
  const rating = hub?.rating ?? profile?.rating ?? analytics?.rating ?? 0;
  const courseCount = hub?.totalCourses ?? taught.length ?? analytics?.courses ?? 0;
  const revenue = analytics?.revenue ?? 0;
  const weeklyGrowth = analytics?.weeklyGrowth ?? 0;
  const newReviews = profile?.reviews ?? analytics?.newReviews ?? 0;
  const engagement = analytics?.engagement ?? 0;
  const trend = analytics?.trend?.length ? analytics.trend : [0];

  const courseList = buildCourseList(taught, students, analytics);
  const chartData = buildChartData(revenueWeek, revenueMonth, analytics);
  const courseProgress = buildCourseProgress(students, taught);
  const avgCompletion = courseProgress.length
    ? Math.round(courseProgress.reduce((sum, c) => sum + c.value, 0) / courseProgress.length)
    : 0;

  const weekPoints = chartData.week ?? [];
  const avgWatchHours = weekPoints.length
    ? (weekPoints.reduce((sum, p) => sum + (p.watchHours ?? 0), 0) / weekPoints.length).toFixed(1)
    : '0';

  const hasMentorActivity = totalStudents > 0 || courseCount > 0 || taught.length > 0;
  const effectivePendingQa = hasMentorActivity ? pendingQa : 0;

  const pendingDrafts = drafts.filter((d) => {
    const s = (d.status || '').toUpperCase();
    return s === 'DRAFT' || s === 'PENDING';
  }).length;

  return {
    students: totalStudents,
    revenue,
    courses: courseCount,
    rating,
    pendingQa: effectivePendingQa,
    weeklyGrowth,
    newReviews,
    engagement,
    trend,
    chartData,
    courseList,
    revenueMix: buildCourseMix(courseList, 'revenue'),
    enrollmentMix: buildCourseMix(courseList, 'students'),
    totalRevenue: courseList.reduce((sum, c) => sum + (c.revenue ?? 0), 0),
    totalStudents: courseList.reduce((sum, c) => sum + (c.students ?? 0), 0) || totalStudents,
    courseProgress,
    avgCompletion,
    avgWatchHours,
    completionRate: avgCompletion,
    recentEnrollments: students.slice(0, 4).map(mapStudentToEnrollmentRow),
    activities: buildActivities(students, effectivePendingQa),
    actionItems: buildActionItems({ pendingQa: effectivePendingQa, pendingDrafts, revenue }),
    upcomingSessions: [],
    displayName: profile?.name?.split(' ')[0] || profile?.name || 'Mentor',
  };
}

export function toTopCoursesTable(courses) {
  return (courses || []).map((course) => ({
    name: course.name,
    students: course.students ?? 0,
    rating: course.rating ?? 0,
    revenue: formatMentorCurrency(course.revenue ?? 0),
    trend: course.trend ?? 'up',
  }));
}
