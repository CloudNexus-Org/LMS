import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchStudentDashboard } from '@/lib/api/analyticsApi';
import { fetchEnrollmentDashboard, fetchMyEnrollments } from '@/lib/api/enrollmentApi';
import { fetchResumeSession } from '@/lib/api/learningApi';
import {
  buildDashboardStats,
  mapEnrollmentToProgressBar,
  mapEnrollmentToRecentRow,
} from '@/lib/student/studentMappers';

export default function useStudentDashboardData() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [recentLearning, setRecentLearning] = useState([]);
  const [resumeSession, setResumeSession] = useState(null);

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setEnrollments([]);
      setStats(null);
      setCourseProgress([]);
      setRecentLearning([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [courses, analytics, enrollmentDash, resume] = await Promise.all([
        fetchMyEnrollments(user, token),
        fetchStudentDashboard(user, token).catch(() => null),
        fetchEnrollmentDashboard(user, token).catch(() => null),
        fetchResumeSession(user, token).catch(() => null),
      ]);

      const list = courses || [];
      setEnrollments(list);
      setResumeSession(resume);
      setStats(buildDashboardStats({ enrollments: list, analytics, enrollmentDash }));
      setCourseProgress(
        list
          .filter((e) => e.status !== 'completed')
          .slice(0, 4)
          .map(mapEnrollmentToProgressBar)
      );
      setRecentLearning(list.slice(0, 4).map(mapEnrollmentToRecentRow));
    } catch {
      setEnrollments([]);
      setStats(buildDashboardStats({ enrollments: [] }));
      setCourseProgress([]);
      setRecentLearning([]);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const displayName =
    user?.fullName?.split(' ')[0] || user?.username || 'Student';

  return {
    loading,
    enrollments,
    stats,
    courseProgress,
    recentLearning,
    resumeSession,
    displayName,
    reload,
  };
}
