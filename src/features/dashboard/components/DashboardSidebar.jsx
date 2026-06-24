import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Award,
  X,
  BarChart,
  Users,
  UploadCloud,
  ShieldAlert,
  DollarSign,
  ShoppingBag,
  Star,
  ListChecks,
} from 'lucide-react';

const navConfig = {
  student: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'Courses', icon: ShoppingBag, path: '/student/catalog' },
    { name: 'My Learning', icon: BookOpen, path: '/student/courses' },
    { name: 'Practice Quizzes', icon: ListChecks, path: '/student/quizzes' },
    { name: 'Reviews', icon: Star, path: '/student/reviews' },
    { name: 'Wishlist', icon: Heart, path: '/student/wishlist' },
    { name: 'Certificates', icon: Award, path: '/student/certificates' },
    // { name: 'Notes', icon: FileText, path: '/student/notes' },
  ],
  mentor: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/mentor/dashboard' },
    { name: 'Manage Lessons', icon: BookOpen, path: '/mentor/lessons' },
    { name: 'Quizzes', icon: ListChecks, path: '/mentor/quizzes' },
    { name: 'Upload Course', icon: UploadCloud, path: '/mentor/upload' },
    { name: 'Analytics', icon: BarChart, path: '/mentor/analytics' },
    { name: 'Students', icon: Users, path: '/mentor/students' },
  ],
  admin: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Approvals', icon: ShieldAlert, path: '/admin/approvals' },
    { name: 'Revenue', icon: DollarSign, path: '/admin/revenue' },
    { name: 'Reports', icon: BarChart, path: '/admin/reports' },
  ],
};

function NavItem({ link }) {
  const Icon = link.icon;
  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-primary-soft text-primary'
            : 'text-muted hover:bg-surface hover:text-text hover:shadow-sm'
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {link.name}
    </NavLink>
  );
}

export default function DashboardSidebar({ role, onClose }) {
  const links = navConfig[role] || navConfig.student;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-6 border-b border-border shrink-0">
        <Link to={`/${role}/dashboard`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold font-display text-white shadow-sm">
            CN
          </div>
          <span className="text-base font-semibold text-text">Cloud Nexus</span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-muted hover:text-text transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {links.map((link) => (
          <NavItem key={link.name} link={link} />
        ))}
      </nav>
    </div>
  );
}
