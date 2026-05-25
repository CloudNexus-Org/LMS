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
const Analytics = lazy(() =>
  import('@/pages/student/Analytics')
);
const ProfilePage = lazy(() =>
  import('@/pages/student/ProfilePage')
);
const CertificatesPage = lazy(() =>
  import('@/pages/student/CertificatesPage')
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
const BillingSubscriptionPage = lazy(() =>
  import('@/pages/student/BillingSubscriptionPage')
);
const NotificationsPage = lazy(() =>
  import('@/pages/student/NotificationsPage')
);
const QuizResultsPage = lazy(() =>
  import('@/pages/student/QuizResultsPage')
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
const RevenuePage = lazy(() =>
  import('@/pages/mentor/RevenuePage')
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
                <Route
                  path="dashboard"
                  element={<StudentDashboardPage />}
                />

                <Route
                  path="courses"
                  element={<MyCoursesPage />}
                />
                <Route
                  path="analyticse"
                  element={<Analytics/>}
                />

                <Route
                  path="learn"
                  element={
                    <Navigate
                      to="/learn/cloud"
                      replace
                    />
                  }
                />

                <Route
                  path="certificates"
                  element={<CertificatesPage />}
                />

                <Route
                  path="wishlist"
                  element={<StudentWishlistPage />}
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
                  path="billing"
                  element={<BillingSubscriptionPage />}
                />

                <Route
                  path="notifications"
                  element={<NotificationsPage />}
                />
                <Route
                  path="profile"
                  element={<ProfilePage />}
                />

                <Route
                  path="quiz"
                  element={<QuizResultsPage />}
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
                  element={<RevenuePage />}
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
                <Route
                  path="dashboard"
                  element={<AdminDashboardPage />}
                />

                <Route
                  path="users"
                  element={<UserManagementPage />}
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
                  element={<ProfileSettingsPage />}
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