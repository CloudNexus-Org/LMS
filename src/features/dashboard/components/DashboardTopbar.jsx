import { Menu, Search, Bell, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Avatar from '@/components/ui/Avatar';

export default function DashboardTopbar({ onMenuClick, role }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted hover:text-text transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search courses, tracks..."
            className="h-10 w-64 rounded-full border border-border bg-bg pl-10 pr-4 text-[13px] font-medium text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Streak Component (Student only) */}
        {role === 'student' && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-500 border border-orange-500/20">
            <Flame className="h-4 w-4" />
            <span>12 Day Streak</span>
          </div>
        )}

        <ThemeToggle />

        <Link to={`/${role}/notifications`} className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-text transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-primary ring-2 ring-surface"></span>
        </Link>

        <div className="h-8 w-px bg-border mx-1" />

        <Link to={role === 'student' ? '/student/settings' : `/${role}/profile`} className="cursor-pointer hover:opacity-80 transition-opacity block">
          <Avatar 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="User Avatar" 
            size="sm" 
          />
        </Link>
      </div>
    </header>
  );
}
