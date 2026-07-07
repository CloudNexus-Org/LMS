import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchAdminDashboard } from '@/lib/api/analyticsApi';
import { fetchCourseApprovals, fetchFinancialSummary } from '@/lib/api/adminApi';
import { fetchUsers } from '@/lib/api/userApi';
import { fetchPublishedCourses } from '@/lib/api/catalogApi';
import { buildAdminDashboardSnapshot, EMPTY_SNAPSHOT } from '@/lib/admin/adminMappers';

export default function useAdminDashboardData() {
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
      const [analytics, approvals, financialSummary, userPage, catalogCourses] =
        await Promise.all([
          fetchAdminDashboard(user, token).catch(() => null),
          fetchCourseApprovals(user, token).catch(() => []),
          fetchFinancialSummary(user, token).catch(() => null),
          fetchUsers(user, token, { size: 500 }).catch(() => ({ content: [] })),
          fetchPublishedCourses().catch(() => []),
        ]);

      setSnapshot(
        buildAdminDashboardSnapshot({
          analytics: analytics || {},
          approvals: Array.isArray(approvals) ? approvals : [],
          financialSummary,
          users: userPage.content || [],
          catalogCourses: Array.isArray(catalogCourses) ? catalogCourses : [],
        })
      );
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

  return { loading, snapshot, lastUpdated, reload };
}
