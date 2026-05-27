import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const location = useLocation();
  
  // Hide footer on specific pages
  const isTrackDetailPage = location.pathname.match(/^\/tracks\/[^/]+$/);
  const isMentorDetailPage = location.pathname.match(/^\/mentors\/[^/]+$/);
  const hideFooter = isTrackDetailPage || isMentorDetailPage;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
