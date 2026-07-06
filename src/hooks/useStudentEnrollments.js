import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchEnrollmentDashboard, fetchMyEnrollments } from '@/lib/api/enrollmentApi';

export default function useStudentEnrollments() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setEnrollments([]);
      setDashboard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [courses, dash] = await Promise.all([
        fetchMyEnrollments(user, token),
        fetchEnrollmentDashboard(user, token).catch(() => null),
      ]);
      setEnrollments(courses || []);
      setDashboard(dash);
    } catch {
      setEnrollments([]);
      setDashboard(null);
      setError('Could not load your courses.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { loading, enrollments, dashboard, error, reload, user, token };
}
