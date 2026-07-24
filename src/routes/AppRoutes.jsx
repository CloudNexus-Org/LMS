import { lazy } from "react";
import { Route } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import GuestRoute from "@/protectedroutes/GuestRoute";
import {
  studentRoutes,
  mentorRoutes,
  adminRoutes,
  learnRoutes,
} from "@/protectedroutes";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const VerifyOtpPage = lazy(() => import("@/pages/OtpVerificationPage"));
const MentorDetailPage = lazy(() => import("@/pages/MentorDetailPage"));
const MentorsListPage = lazy(() => import("@/pages/MentorsListPage"));
const CoursesListPage = lazy(() => import("@/pages/CoursesListPage"));
const ExploreBrowsePage = lazy(() => import("@/pages/ExploreBrowsePage"));
const CourseDetailPage = lazy(() => import("@/pages/CourseDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const publicRoutes = (
  <Route path="/" element={<PublicLayout />}>
    <Route index element={<LandingPage />} />
    <Route path="mentors" element={<MentorsListPage />} />
    <Route path="mentors/:slug" element={<MentorDetailPage />} />
    <Route path="courses" element={<CoursesListPage />} />
    <Route path="courses/:slug" element={<CourseDetailPage />} />
    <Route path="explore/:type" element={<ExploreBrowsePage />} />
    <Route path="explore/:type/:slug" element={<ExploreBrowsePage />} />
    <Route path="cart" element={<CartPage />} />
  </Route>
);

export const authRoutes = (
  <Route element={<GuestRoute />}>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
    </Route>
  </Route>
);

export const protectedRoutes = (
  <>
    {learnRoutes}
    {studentRoutes}
    {mentorRoutes}
    {adminRoutes}
  </>
);

export const notFoundRoute = <Route path="*" element={<NotFoundPage />} />;
