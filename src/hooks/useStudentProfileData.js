import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { fetchProfile, updateProfile } from '@/lib/api/userApi';
import { fetchStudentDashboard } from '@/lib/api/analyticsApi';
import { fetchMyEnrollments } from '@/lib/api/enrollmentApi';
import { fetchMyCertificates } from '@/lib/api/certificateApi';
import {
  buildProfileStats,
  mapApiProfileToView,
  mapCertificatesToView,
  mapEnrollmentsToCompleted,
  mapEnrollmentsToCoursesInProgress,
} from '@/lib/profile/profileMapper';

export default function useStudentProfileData() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(() =>
    mapApiProfileToView(null, user)
  );
  const [stats, setStats] = useState([]);
  const [coursesInProgress, setCoursesInProgress] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const reload = useCallback(async () => {
    if (!user?.id || !token) {
      setProfile(mapApiProfileToView(null, user));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [apiProfile, dash, enrollments, certs] = await Promise.all([
        fetchProfile(user, token),
        fetchStudentDashboard(user, token).catch(() => null),
        fetchMyEnrollments(user, token).catch(() => []),
        fetchMyCertificates(user, token).catch(() => []),
      ]);

      const viewProfile = mapApiProfileToView(apiProfile, user);
      setProfile(viewProfile);
      setDashboard(dash);
      setCoursesInProgress(mapEnrollmentsToCoursesInProgress(enrollments));
      setCompletedCourses(mapEnrollmentsToCompleted(enrollments));
      setCertificates(mapCertificatesToView(certs));
      setStats(buildProfileStats(dash, enrollments, certs));
    } catch {
      setProfile(mapApiProfileToView(null, user));
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveProfile = useCallback(
    async (formPayload) => {
      if (!user?.id || !token) return false;
      const updated = await updateProfile(user, token, formPayload);
      const viewProfile = mapApiProfileToView(updated, user);
      setProfile(viewProfile);
      if (updated?.fullName) {
        updateUser({ fullName: updated.fullName });
      }
      return true;
    },
    [user, token, updateUser]
  );

  return {
    loading,
    profile,
    setProfile,
    stats,
    coursesInProgress,
    completedCourses,
    certificates,
    dashboard,
    reload,
    saveProfile,
  };
}
