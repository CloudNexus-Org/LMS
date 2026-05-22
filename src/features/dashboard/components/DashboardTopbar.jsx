import { Menu, Search, Bell, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";

export default function DashboardTopbar({ onMenuClick, role }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-0 z-10 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4 pl-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted hover:text-text transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* SEARCH */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search courses, tracks..."
            className="h-10 w-64 rounded-full border border-border bg-bg pl-10 pr-4 text-[13px] font-medium text-text transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 pr-6">

        {/* STREAK — students only */}
        {role === "student" && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-500">
            <Flame className="h-4 w-4" />
            <span>12 Day Streak</span>
          </div>
        )}

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* NOTIFICATIONS */}
        <Link
          to={`/${role}/notifications`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-bg hover:text-text"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
        </Link>

        {/* DIVIDER */}
        <div className="mx-1 h-8 w-px bg-border" />

        {/* AVATAR → navigates to Profile Page */}
        <Link
          to={`/${role}/profile`}
          className="block rounded-full transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-surface"
          aria-label="Go to profile"
        >
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