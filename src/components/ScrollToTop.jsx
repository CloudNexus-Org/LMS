import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // Skip the auto-top-scroll when navigation includes a hash target —
    // the Navbar will smooth-scroll to it instead.
    if (hash) return;
    
    // Use a small timeout to allow Suspense/lazy routes to render their content first
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.body.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, hash]);

  return null;
}
