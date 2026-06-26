export function getRouteAuthRole(path = "") {
  if (path.startsWith("/student")) return "student";
  if (path.startsWith("/mentor")) return "mentor";
  if (path.startsWith("/admin")) return "admin";
  return null;
}

export function canAccessRoute(isAuthenticated, userRole, requiredRole) {
  if (!requiredRole) return true;
  if (!isAuthenticated) return false;
  return userRole === requiredRole;
}

/**
 * Resolve where a footer (or nav) link should go based on auth.
 * Returns { type: 'route' | 'login' | 'section', target: string }
 */
export function resolveFooterLinkTarget({
  isAuthenticated,
  userRole,
  to,
  section,
  auth,
  guestSection,
  guestTo,
}) {
  const requiredRole = auth ?? (to ? getRouteAuthRole(to) : null);

  if (requiredRole) {
    if (canAccessRoute(isAuthenticated, userRole, requiredRole)) {
      return { type: "route", target: to };
    }

    if (!isAuthenticated) {
      if (guestSection) return { type: "section", target: guestSection };
      if (guestTo) return { type: "route", target: guestTo };
      return { type: "login", target: to };
    }

    return { type: "login", target: to };
  }

  if (section) return { type: "section", target: section };
  if (to) return { type: "route", target: to };
  return null;
}
