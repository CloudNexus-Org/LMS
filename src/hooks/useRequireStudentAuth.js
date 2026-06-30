import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { ROUTES } from "@/protectedroutes/routePaths";

/**
 * Returns a checker that redirects guests to /login before purchase actions.
 */
export default function useRequireStudentAuth() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role);

  return useCallback(
    (returnPath = ROUTES.student.cart) => {
      const role = userRole || "student";

      if (isAuthenticated && role === "student") {
        return true;
      }

      navigate(ROUTES.login, { state: { from: returnPath } });
      return false;
    },
    [isAuthenticated, navigate, userRole]
  );
}
