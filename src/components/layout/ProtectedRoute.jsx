import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

export default function ProtectedRoute({ allowedRoles = ['student', 'mentor', 'admin'] }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = user.role || 'student';
  if (!allowedRoles.includes(userRole)) {
    const fallback =
      userRole === 'admin'
        ? '/admin/dashboard'
        : userRole === 'mentor'
          ? '/mentor/dashboard'
          : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
