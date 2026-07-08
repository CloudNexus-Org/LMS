import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import {
  fetchAdminDashboard,
  fetchCourseReport,
  fetchEnrollmentReport,
  fetchRevenueReport,
} from '@/lib/api/analyticsApi';
import { fetchCourseApprovals } from '@/lib/api/adminApi';
import { fetchUsers } from '@/lib/api/userApi';
import { fetchPublishedCourses } from '@/lib/api/catalogApi';
import { buildAdminReportsSnapshot } from '@/lib/admin/adminMappers';

const EMPTY = buildAdminReportsSnapshot({});

function defaultDateRange(period = 'year') {
  const to = new Date();
  const from = new Date();
  if (period === 'month') {
    from.setDate(from.getDate() - 30);
  } else if (period === 'quarter') {
    from.setDate(from.getDate() - 90);
  } else {
    from.setDate(from.getDate() - 365);
  }
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export default function useAdminReportsData(period = 'year') {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const range = useMemo(() => defaultDateRange(period), [period]);
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(EMPTY);

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setSnapshot(EMPTY);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [
        analytics,
        enrollmentReport,
        revenueReport,
        courseReport,
        mentorPage,
        allUsersPage,
        approvals,
        catalogCourses,
      ] = await Promise.all([
        fetchAdminDashboard(user, token).catch(() => null),
        fetchEnrollmentReport(user, token, range.from, range.to).catch(() => []),
        fetchRevenueReport(user, token, range.from, range.to).catch(() => []),
        fetchCourseReport(user, token, range.from, range.to).catch(() => []),
        fetchUsers(user, token, { roleFilter: 'Mentor', size: 50 }).catch(() => ({ content: [] })),
        fetchUsers(user, token, { size: 500 }).catch(() => ({ content: [] })),
        fetchCourseApprovals(user, token).catch(() => []),
        fetchPublishedCourses().catch(() => []),
      ]);

      setSnapshot(
        buildAdminReportsSnapshot({
          analytics,
          enrollmentReport: Array.isArray(enrollmentReport) ? enrollmentReport : [],
          revenueReport: Array.isArray(revenueReport) ? revenueReport : [],
          courseReport: Array.isArray(courseReport) ? courseReport : [],
          mentors: mentorPage.content || [],
          allUsers: allUsersPage.content || [],
          approvals: Array.isArray(approvals) ? approvals : [],
          catalogCourses: Array.isArray(catalogCourses) ? catalogCourses : [],
        })
      );
    } catch {
      setSnapshot(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [user, token, range.from, range.to]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { loading, snapshot, reload };
}
