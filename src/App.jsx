import { Suspense } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/ui/BackToTop";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import LoadingFallback from "@/components/ui/LoadingFallback";
import {
  publicRoutes,
  authRoutes,
  protectedRoutes,
  notFoundRoute,
} from "@/routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <BackToTop />

        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {publicRoutes}
            {authRoutes}
            {protectedRoutes}
            {notFoundRoute}
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}



export default App;
