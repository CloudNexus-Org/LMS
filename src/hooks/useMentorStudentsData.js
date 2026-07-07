import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchMyMentorStudents } from '@/lib/api/mentorApi';
import { buildMentorStudentsSummary } from '@/lib/mentor/mentorMappers';

const EMPTY_SUMMARY = buildMentorStudentsSummary([]);

export default function useMentorStudentsData() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setSummary(EMPTY_SUMMARY);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const students = await fetchMyMentorStudents(user, token).catch(() => []);
      setSummary(buildMentorStudentsSummary(Array.isArray(students) ? students : []));
    } catch {
      setSummary(EMPTY_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { loading, ...summary, reload };
}
