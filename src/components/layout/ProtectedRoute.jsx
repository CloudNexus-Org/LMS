import { Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

export default function ProtectedRoute({ allowedRoles = ['student', 'mentor', 'admin'] }) {
  const location = useLocation();
  const { isAuthenticated, user, login } = useAuthStore();
  
  // For the frontend template demonstration: 
  // If the user navigates directly to a route but is not authenticated, 
  // we automatically mock-authenticate them so they can view the page.
  if (!isAuthenticated) {
    // Auto-login for demo purposes based on the URL path
    const path = location.pathname;
    let autoRole = 'student';
    if (path.startsWith('/mentor')) autoRole = 'mentor';
    if (path.startsWith('/admin')) autoRole = 'admin';
    
    // Defer state update to next tick to avoid React warning during render
    setTimeout(() => {
      login({ username: 'demo_user', role: autoRole }, 'mock-jwt-token');
    }, 0);
    
    return null; // Return nothing while we log them in instantly
  }

  // Also, for demo purposes, if they try to access a page they don't have the role for,
  // we just dynamically update their role so they can see the page!
  const userRole = user?.role || 'student';
  if (!allowedRoles.includes(userRole)) {
    setTimeout(() => {
      login({ ...user, role: allowedRoles[0] }, 'mock-jwt-token');
    }, 0);
    return null; // Return nothing while we switch their role instantly
  }

  return <Outlet />;
}
