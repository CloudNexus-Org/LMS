import { Menu, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import CartButton from "@/components/courses/CartButton";
import useAuthStore from "@/store/useAuthStore";

const STUDENT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

export default function DashboardTopbar({ onMenuClick, role }) {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.fullName || user?.username || "Alex Chen";
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

        {role === "admin" && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search courses, tracks..."
              className="h-10 w-64 rounded-full border border-border bg-bg pl-10 pr-4 text-[13px] font-medium text-text transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 pr-6">
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

        {role === "student" && <CartButton to="/student/cart" />}

        <Link
          to={`/${role}/profile`}
          className="block rounded-full transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-surface"
          aria-label={`${displayName} profile`}
        >
          <Avatar
            src={user?.avatar || STUDENT_AVATAR}
            name={displayName}
            alt={`${displayName} profile`}
            size="sm"
          />
        </Link>
      </div>
    </header>
  );
}