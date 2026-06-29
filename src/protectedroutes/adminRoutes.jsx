import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "@/protectedroutes/ProtectedRoute";

const DashboardLayout = lazy(() =>
  import("@/features/dashboard/components/DashboardLayout")
);

const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/AdminDashboardPage")
);
const UserManagementPage = lazy(() =>
  import("@/pages/admin/UserManagementPage")
);
const AddMentorPage = lazy(() => import("@/pages/admin/AddMentorPage"));
const CourseApprovalsPage = lazy(() =>
  import("@/pages/admin/CourseApprovalsPage")
);
const FinancialsPage = lazy(() => import("@/pages/admin/FinancialsPage"));
const SystemSettingsPage = lazy(() =>
  import("@/pages/admin/SystemSettingsPage")
);
const AdminReportsPage = lazy(() =>
  import("@/pages/admin/AdminReportsPage")
);
const AdminNotificationsPage = lazy(() =>
  import("@/pages/admin/AdminNotificationsPage")
);
const AdminProfilePage = lazy(() =>
  import("@/pages/admin/AdminProfilePage")
);

/** All /admin/* routes — login required */
export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin" element={<DashboardLayout role="admin" />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="users" element={<UserManagementPage />} />
      <Route path="users/add-mentor" element={<AddMentorPage />} />
      <Route path="approvals" element={<CourseApprovalsPage />} />
      <Route path="revenue" element={<FinancialsPage />} />
      <Route path="reports" element={<AdminReportsPage />} />
      <Route path="settings" element={<SystemSettingsPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
    </Route>
  </Route>
);
