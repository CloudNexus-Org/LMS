import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Layout & Global Components
import ScrollToTop from '@/components/ScrollToTop';
import BackToTop from '@/components/ui/BackToTop';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import PublicLayout from '@/components/layout/PublicLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import LoadingFallback from '@/components/ui/LoadingFallback';

// Public Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const VerifyOtpPage = lazy(() => import('@/pages/OtpVerificationPage'));

const MentorDetailPage = lazy(() => import('@/pages/MentorDetailPage'));
const MentorsListPage = lazy(() => import('@/pages/MentorsListPage'));
const TrackDetailPage = lazy(() => import('@/pages/TrackDetailPage'));
const TracksListPage = lazy(() => import('@/pages/TracksListPage'));
const CoursesListPage = lazy(() => import('@/pages/CoursesListPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const LessonPlayerPage = lazy(() => import('@/pages/LessonPlayerPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Dashboard Layout
const DashboardLayout = lazy(() =>
  import('@/features/dashboard/components/DashboardLayout')
);

// Student Pages
const StudentDashboardPage = lazy(() =>
  import('@/pages/student/StudentDashboardPage')
);
const MyCoursesPage = lazy(() =>
  import('@/pages/student/MyCoursesPage')
);
const StudentBrowseCoursesPage = lazy(() =>
  import('@/pages/student/StudentBrowseCoursesPage')
);
const StudentCartPage = lazy(() =>
  import('@/pages/student/StudentCartPage')
);
const ProfilePage = lazy(() =>
  import('@/pages/student/ProfilePage')
);
const CertificatesPage = lazy(() =>
  import('@/pages/student/CertificatesPage')
);
const CertificateDetailPage = lazy(() =>
  import('@/pages/student/CertificateDetailPage')
);
const StudentWishlistPage = lazy(() =>
  import('@/pages/student/StudentWishlistPage')
);
const NotesAndBookmarksPage = lazy(() =>
  import('@/pages/student/NotesAndBookmarksPage')
);
const ProfileSettingsPage = lazy(() =>
  import('@/pages/student/ProfileSettingsPage')
);
const CoursePaymentPage = lazy(() =>
  import('@/pages/student/CoursePaymentPage')
);
const PendingAssignmentsPage = lazy(() =>
  import('@/pages/student/PendingAssignmentsPage')
);
const StudentLearnRedirect = lazy(() =>
  import('@/pages/student/StudentLearnRedirect')
);
const NotificationsPage = lazy(() =>
  import('@/pages/student/NotificationsPage')
);
const CourseReviewsPage = lazy(() =>
  import('@/pages/student/CourseReviewsPage')
);

// Mentor Pages
const MentorDashboardPage = lazy(() =>
  import('@/pages/mentor/MentorDashboardPage')
);
const UploadCoursePage = lazy(() =>
  import('@/pages/mentor/UploadCoursePage')
);
const ManageLessonsPage = lazy(() =>
  import('@/pages/mentor/ManageLessonsPage')
);
const AnalyticsPage = lazy(() =>
  import('@/pages/mentor/AnalyticsPage')
);
const StudentsPage = lazy(() =>
  import('@/pages/mentor/StudentsPage')
);
const MentorNotificationsPage = lazy(() =>
  import('@/pages/mentor/MentorNotificationsPage')
);

// Admin Pages
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage')
);
const UserManagementPage = lazy(() =>
  import('@/pages/admin/UserManagementPage')
);
const AddMentorPage = lazy(() =>
  import('@/pages/admin/AddMentorPage')
);
const CourseApprovalsPage = lazy(() =>
  import('@/pages/admin/CourseApprovalsPage')
);
const FinancialsPage = lazy(() =>
  import('@/pages/admin/FinancialsPage')
);
const SystemSettingsPage = lazy(() =>
  import('@/pages/admin/SystemSettingsPage')
);
const AdminReportsPage = lazy(() =>
  import('@/pages/admin/AdminReportsPage')
);
const AdminNotificationsPage = lazy(() =>
  import('@/pages/admin/AdminNotificationsPage')
);
const AdminProfilePage = lazy(() =>
  import('@/pages/admin/AdminProfilePage')
);

function App() {
  return (
      <ErrorBoundary>
        <Router>
        <ScrollToTop />
        <BackToTop />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/demo" element={<DemoPage />} />

              <Route path="/mentors" element={<MentorsListPage />} />
              <Route path="/mentors/:slug" element={<MentorDetailPage />} />

              <Route path="/tracks" element={<TracksListPage />} />
              <Route path="/tracks/:id" element={<TrackDetailPage />} />

              <Route path="/courses" element={<CoursesListPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* AUTH ROUTES */}
            <Route element={<AuthLayout />}>

              <Route path="/login" element={<LoginPage />} />

              <Route path="/signup" element={<SignupPage />} />

              <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
              />

              <Route
                path="/verify-otp"
                element={<VerifyOtpPage />}
              />

            </Route>

            {/* LEARNING ROUTES */}
            <Route
              path="/learn/:trackId"
              element={<LessonPlayerPage />}
            />

            <Route
              path="/learn/:trackId/:lessonId"
              element={<LessonPlayerPage />}
            />

            {/* STUDENT ROUTES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['student']} />
              }
            >
              <Route
                path="/student"
                element={<DashboardLayout role="student" />}
              >
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route
                  path="dashboard"
                  element={<StudentDashboardPage />}
                />

                <Route
                  path="courses"
                  element={<MyCoursesPage />}
                />
                <Route
                  path="catalog"
                  element={<StudentBrowseCoursesPage />}
                />
                <Route
                  path="cart"
                  element={<StudentCartPage />}
                />
                <Route
                  path="learn"
                  element={<StudentLearnRedirect />}
                />

                <Route
                  path="certificates"
                  element={<CertificatesPage />}
                />

                <Route
                  path="certificates/:id"
                  element={<CertificateDetailPage />}
                />

                <Route
                  path="wishlist"
                  element={<StudentWishlistPage />}
                />

                <Route
                  path="reviews"
                  element={<CourseReviewsPage />}
                />

                <Route
                  path="notes"
                  element={<NotesAndBookmarksPage />}
                />

                <Route
                  path="settings"
                  element={<ProfileSettingsPage />}
                />

                <Route
                  path="payment"
                  element={<CoursePaymentPage />}
                />

                <Route
                  path="assignments"
                  element={<PendingAssignmentsPage />}
                />

                <Route
                  path="notifications"
                  element={<NotificationsPage />}
                />
                <Route
                  path="profile"
                  element={<ProfilePage />}
                />
              </Route>
            </Route>

            {/* MENTOR ROUTES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['mentor']} />
              }
            >
              <Route
                path="/mentor"
                element={<DashboardLayout role="mentor" />}
              >
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route
                  path="dashboard"
                  element={<MentorDashboardPage />}
                />

                <Route
                  path="upload"
                  element={<UploadCoursePage />}
                />

                <Route
                  path="lessons"
                  element={<ManageLessonsPage />}
                />

                <Route
                  path="revenue"
                  element={<Navigate to="/mentor/analytics" replace />}
                />

                <Route
                  path="analytics"
                  element={<AnalyticsPage />}
                />

                <Route
                  path="students"
                  element={<StudentsPage />}
                />

                <Route
                  path="notifications"
                  element={<MentorNotificationsPage />}
                />

                <Route
                  path="profile"
                  element={<ProfileSettingsPage />}
                />
              </Route>
            </Route>

            {/* ADMIN ROUTES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']} />
              }
            >
              <Route
                path="/admin"
                element={<DashboardLayout role="admin" />}
              >
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route
                  path="dashboard"
                  element={<AdminDashboardPage />}
                />

                <Route
                  path="users"
                  element={<UserManagementPage />}
                />

                <Route
                  path="users/add-mentor"
                  element={<AddMentorPage />}
                />

                <Route
                  path="approvals"
                  element={<CourseApprovalsPage />}
                />

                <Route
                  path="revenue"
                  element={<FinancialsPage />}
                />

                <Route
                  path="reports"
                  element={<AdminReportsPage />}
                />

                <Route
                  path="settings"
                  element={<SystemSettingsPage />}
                />

                <Route
                  path="notifications"
                  element={<AdminNotificationsPage />}
                />

                <Route
                  path="profile"
                  element={<AdminProfilePage />}
                />
              </Route>
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />

          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;