import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/protectedroutes/ProtectedRoute";

const LessonPlayerPage = lazy(() => import("@/pages/LessonPlayerPage"));

/** Lesson player — login required (student only) */
export const learnRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
    <Route path="/learn/:trackId" element={<LessonPlayerPage />} />
    <Route path="/learn/:trackId/:lessonId" element={<LessonPlayerPage />} />
  </Route>
);
