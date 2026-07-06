/** Map enrollment API rows → UI shapes used across student pages */

export function mapEnrollmentToReviewCourse(enrollment) {
  const courseId = enrollment.courseId ?? enrollment.id;
  return {
    id: courseId,
    courseId,
    enrollmentId: enrollment.id,
    slug: enrollment.trackId || String(courseId),
    title: enrollment.title || 'Course',
    instructor: enrollment.instructor || 'Mentor',
    image: enrollment.image || '/assets/profile-cover-default.svg',
    progress: enrollment.progress ?? 0,
    status: enrollment.status === 'completed' ? 'completed' : 'in-progress',
    platformRating: parseFloat(enrollment.rating) || 0,
    trackId: enrollment.trackId,
  };
}

export function mapEnrollmentToProgressBar(enrollment) {
  const progress = enrollment.progress ?? 0;
  const color =
    progress >= 80 ? 'bg-success' : progress >= 40 ? 'bg-primary' : 'bg-warning';
  return {
    title: enrollment.title || 'Course',
    value: progress,
    color,
    trackId: enrollment.trackId,
  };
}

export function mapEnrollmentToRecentRow(enrollment) {
  const lessonsLeft = Math.max(
    (enrollment.totalLessons || 0) - (enrollment.completedLessons || 0),
    0
  );
  const subtitle =
    enrollment.status === 'completed'
      ? 'Course completed'
      : lessonsLeft
        ? `${lessonsLeft} lessons remaining`
        : 'Continue learning';
  return {
    id: enrollment.id,
    title: enrollment.title || 'Course',
    subtitle,
    trackId: enrollment.trackId,
    progress: enrollment.progress ?? 0,
  };
}

export function getEnrolledTrackIds(enrollments = []) {
  return [...new Set(enrollments.map((e) => e.trackId).filter(Boolean))];
}

export function buildDashboardStats({ enrollments = [], analytics = null, enrollmentDash = null }) {
  const inProgress = enrollments.filter((e) => e.status !== 'completed').length;
  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const totalLessons = enrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0);
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  return {
    courses: {
      count: String(enrollments.length).padStart(2, '0'),
      subtitle: inProgress ? `${inProgress} active` : 'No active courses',
    },
    lessons: {
      count: String(enrollmentDash?.totalLessonsCompleted ?? analytics?.lessonsCompleted ?? totalLessons),
      subtitle: analytics?.streak ? `${analytics.streak} day streak` : 'Keep learning',
    },
    tasks: {
      count: String(inProgress).padStart(2, '0'),
      subtitle: completed ? `${completed} completed` : 'Enroll in a course',
    },
    badges: {
      count: String(completed).padStart(2, '0'),
      subtitle: completed ? 'Courses finished' : 'None yet',
    },
    avgProgress: enrollmentDash?.averageProgress ?? avgProgress,
    studyHours: analytics?.hoursLearned
      ? `${analytics.hoursLearned}`
      : '0',
    weeklyActivity: analytics?.weeklyActivity?.length
      ? analytics.weeklyActivity
      : [0, 0, 0, 0, 0, 0, 0],
    totalModules: enrollments.reduce((sum, e) => {
      const mod = parseInt(String(e.modules || '').replace(/\D/g, ''), 10);
      return sum + (Number.isNaN(mod) ? 0 : mod);
    }, 0),
  };
}
