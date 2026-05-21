import { Outlet } from 'react-router-dom';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text transition-colors duration-300">
      {/* CENTER BG GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[170px]" />
      
      {/* GRID */}
      <div aria-hidden className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" />

      {/* CORNER GLOWS */}
      <div aria-hidden className="pointer-events-none absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />

      {/* THEME TOGGLE */}
      <div className="absolute right-5 top-5 z-30">
        <ThemeToggle />
      </div>

      <Outlet />
    </div>
  );
}
