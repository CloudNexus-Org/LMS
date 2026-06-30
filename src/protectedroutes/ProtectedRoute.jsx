import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import LoadingFallback from "@/components/ui/LoadingFallback";
import { ROLE_DASHBOARDS, ROUTES } from "@/protectedroutes/routePaths";

/**
 * Guards child routes — requires login and an allowed role.
 * Unauthenticated users are sent to /login with the return URL saved.
 */
export default function ProtectedRoute({
  allowedRoles = ["student", "mentor", "admin"],
}) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist?.hasHydrated?.() ?? true
  );

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setHydrated(true);
      return undefined;
    }

    const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });

    return unsub;
  }, []);

  if (!hydrated) {
    return <LoadingFallback />;
  }

  const returnPath = `${location.pathname}${location.search}${location.hash}`;

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: returnPath }} />
    );
  }

  const userRole = user?.role || "student";

  if (!allowedRoles.includes(userRole)) {
    const fallback =
      ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.student;
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
