import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "@/protectedroutes/ProtectedRoute";

const DashboardLayout = lazy(() =>
  import("@/features/dashboard/components/DashboardLayout")
);

const MentorDashboardPage = lazy(() =>
  import("@/pages/mentor/MentorDashboardPage")
);
const UploadCoursePage = lazy(() => import("@/pages/mentor/UploadCoursePage"));
const ManageLessonsPage = lazy(() =>
  import("@/pages/mentor/ManageLessonsPage")
);
const AnalyticsPage = lazy(() => import("@/pages/mentor/AnalyticsPage"));
const StudentsPage = lazy(() => import("@/pages/mentor/StudentsPage"));
const MentorNotificationsPage = lazy(() =>
  import("@/pages/mentor/MentorNotificationsPage")
);
const ProfileSettingsPage = lazy(() =>
  import("@/pages/student/ProfileSettingsPage")
);

/** All /mentor/* routes — login required */
export const mentorRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
    <Route path="/mentor" element={<DashboardLayout role="mentor" />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<MentorDashboardPage />} />
      <Route path="upload" element={<UploadCoursePage />} />
      <Route path="lessons" element={<ManageLessonsPage />} />
      <Route
        path="revenue"
        element={<Navigate to="/mentor/analytics" replace />}
      />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="students" element={<StudentsPage />} />
      <Route path="notifications" element={<MentorNotificationsPage />} />
      <Route path="profile" element={<ProfileSettingsPage />} />
    </Route>
  </Route>
);
