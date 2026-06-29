import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import LoadingFallback from "@/components/ui/LoadingFallback";
import { ROLE_DASHBOARDS } from "@/protectedroutes/routePaths";

/** Login / signup pages — redirect already-authenticated users to their dashboard */
export default function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
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

  if (isAuthenticated) {
    const role = userRole || "student";
    const dashboard = ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.student;
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
}
