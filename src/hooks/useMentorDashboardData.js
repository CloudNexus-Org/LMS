import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchMentorDashboard, fetchMentorRevenue } from '@/lib/api/analyticsApi';
import {
  fetchMentorHubDashboard,
  fetchMyMentorProfile,
  fetchMyMentorStudents,
} from '@/lib/api/mentorApi';
import { fetchCourseDrafts } from '@/lib/api/contentApi';
import { fetchPendingQaCount } from '@/lib/api/learningApi';
import { buildMentorDashboardSnapshot } from '@/lib/mentor/mentorMappers';

const EMPTY_SNAPSHOT = buildMentorDashboardSnapshot({});

export default function useMentorDashboardData() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setSnapshot(EMPTY_SNAPSHOT);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
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

      const next = buildMentorDashboardSnapshot({
        hub,
        students: Array.isArray(students) ? students : [],
        analytics,
        revenueWeek,
        revenueMonth,
        drafts: Array.isArray(drafts) ? drafts : [],
        profile,
        pendingQa: typeof pendingQa === 'number' ? pendingQa : pendingQa?.count ?? 0,
      });

      setSnapshot(next);
      setLastUpdated(new Date());
    } catch {
      setSnapshot(EMPTY_SNAPSHOT);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    loading,
    snapshot,
    lastUpdated,
    reload,
    displayName: snapshot.displayName || user?.fullName?.split(' ')[0] || 'Mentor',
  };
}
