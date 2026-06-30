import { useCallback } from "react";
import useAuthStore from "@/store/useAuthStore";
import { ROUTES } from "@/protectedroutes/routePaths";

/** Sign out and return to the public landing page. */
export default function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useCallback(() => {
    logout();
    window.location.replace(ROUTES.home);
  }, [logout]);
}
