import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "@/protectedroutes/ProtectedRoute";

const DashboardLayout = lazy(() =>
  import("@/features/dashboard/components/DashboardLayout")
);

const StudentDashboardPage = lazy(() =>
  import("@/pages/student/StudentDashboardPage")
);
const MyCoursesPage = lazy(() => import("@/pages/student/MyCoursesPage"));
const StudentBrowseCoursesPage = lazy(() =>
  import("@/pages/student/StudentBrowseCoursesPage")
);
const StudentCartPage = lazy(() => import("@/pages/student/StudentCartPage"));
const ProfilePage = lazy(() => import("@/pages/student/ProfilePage"));
const CertificatesPage = lazy(() =>
  import("@/pages/student/CertificatesPage")
);
const CertificateDetailPage = lazy(() =>
  import("@/pages/student/CertificateDetailPage")
);
const StudentWishlistPage = lazy(() =>
  import("@/pages/student/StudentWishlistPage")
);
const NotesAndBookmarksPage = lazy(() =>
  import("@/pages/student/NotesAndBookmarksPage")
);
const ProfileSettingsPage = lazy(() =>
  import("@/pages/student/ProfileSettingsPage")
);
const CoursePaymentPage = lazy(() =>
  import("@/pages/student/CoursePaymentPage")
);
const PendingAssignmentsPage = lazy(() =>
  import("@/pages/student/PendingAssignmentsPage")
);
const StudentLearnRedirect = lazy(() =>
  import("@/pages/student/StudentLearnRedirect")
);
const NotificationsPage = lazy(() =>
  import("@/pages/student/NotificationsPage")
);
const CourseReviewsPage = lazy(() =>
  import("@/pages/student/CourseReviewsPage")
);

/** All /student/* routes — login required */
export const studentRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/student" element={<DashboardLayout role="student" />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboardPage />} />
      <Route path="courses" element={<MyCoursesPage />} />
      <Route path="catalog" element={<StudentBrowseCoursesPage />} />
      <Route path="cart" element={<StudentCartPage />} />
      <Route path="learn" element={<StudentLearnRedirect />} />
      <Route path="certificates" element={<CertificatesPage />} />
      <Route path="certificates/:id" element={<CertificateDetailPage />} />
      <Route path="wishlist" element={<StudentWishlistPage />} />
      <Route path="reviews" element={<CourseReviewsPage />} />
      <Route path="notes" element={<NotesAndBookmarksPage />} />
      <Route path="settings" element={<ProfileSettingsPage />} />
      <Route path="payment" element={<CoursePaymentPage />} />
      <Route path="assignments" element={<PendingAssignmentsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>
  </Route>
);
