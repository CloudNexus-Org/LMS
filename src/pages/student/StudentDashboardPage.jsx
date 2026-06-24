import { Link } from "react-router-dom";
import {
  Sparkles,
  CalendarDays,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock3,
  BookOpen,
  Trophy,
  FileText,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { getContinueLearningUrl } from "@/features/learn/learningSession";

const STATS = [
  {
    title: "Courses",
    count: "08",
    subtitle: "2 active",
    icon: BookOpen,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accent: "dashboard-kpi-primary",
  },
  {
    title: "Lessons",
    count: "42",
    subtitle: "7 today",
    icon: CheckCircle2,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    accent: "dashboard-kpi-success",
  },
  {
    title: "Tasks",
    count: "05",
    subtitle: "2 pending",
    icon: FileText,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    accent: "dashboard-kpi-warning",
  },
  {
    title: "Badges",
    count: "12",
    subtitle: "4 verified",
    icon: Trophy,
    iconBg: "bg-accent-soft",
    iconColor: "text-accent",
    accent: "dashboard-kpi-accent",
  },
];

const COURSE_PROGRESS = [
  { title: "UI/UX Design", value: 85, color: "bg-primary" },
  { title: "React Development", value: 64, color: "bg-success" },
  { title: "System Design", value: 28, color: "bg-warning" },
];

const LEARNING_ACTIONS = [
  { label: "Continue Course", getTo: getContinueLearningUrl },
  { label: "Browse Courses", to: "/student/catalog" },
  { label: "Submit Assignment", to: "/student/assignments" },
  { label: "View Certificates", to: "/student/certificates" },
];

const UPCOMING = [
  { date: "Tomorrow", title: "Live UI Workshop", subtitle: "Advanced Design Systems" },
  { date: "In 2 Days", title: "React Masterclass", subtitle: "Hooks & State Management" },
  { date: "May 12", title: "Portfolio Review", subtitle: "1-on-1 Mentor Session" },
  { date: "May 15", title: "Final Assessment", subtitle: "Frontend Development Track" },
];

const STUDY_TREND = [42, 48, 45, 58, 62, 55, 68, 72, 70, 78, 82, 85];

function Card({ className = "", children }) {
  return <div className={`dashboard-card ${className}`}>{children}</div>;
}

function MiniSparkline({ data }) {
  const w = 88;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="dashboard-sparkline" aria-hidden>
      <polyline points={points} className="dashboard-sparkline-line" />
    </svg>
  );
}

export default function StudentDashboardPage() {
  const avgProgress = Math.round(
    COURSE_PROGRESS.reduce((sum, c) => sum + c.value, 0) / COURSE_PROGRESS.length
  );

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      {/* Compact analytics header — replaces large welcome */}
      <section className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Good afternoon
          </span>
          <p className="dashboard-greeting">
            Welcome back, <span className="text-primary">Kunal</span>
          </p>
          <p className="dashboard-greeting-sub">
            Track progress, assignments, and classes from one place.
          </p>
        </div>

        <div className="dashboard-analytics-metrics">
          <div className="dashboard-analytics-metric">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="dashboard-metric-value">{avgProgress}%</p>
              <p className="dashboard-metric-label">Avg progress</p>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="dashboard-metric-value">124+</p>
              <p className="dashboard-metric-label">Study hours</p>
            </div>
          </div>
          <div className="dashboard-analytics-chart">
            <p className="dashboard-metric-label mb-1">Weekly trend</p>
            <MiniSparkline data={STUDY_TREND} />
          </div>
        </div>
      </section>

      {/* KPI stat cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {STATS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className={`dashboard-kpi-card p-3.5 ${item.accent}`}>
              <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold leading-none text-text">{item.count}</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">{item.title}</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted">{item.subtitle}</p>
            </Card>
          );
        })}
      </section>

      {/* Main widgets */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Learning Actions</h2>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {LEARNING_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.getTo ? action.getTo() : action.to}
                className="dashboard-action-btn group"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PlayCircle className="h-4 w-4" />
                  </div>
                  <span className="truncate text-xs font-semibold text-text">{action.label}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Course Progress</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3.5">
            {COURSE_PROGRESS.map((course) => (
              <div key={course.title}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-text">{course.title}</p>
                  <span className="shrink-0 text-[11px] font-bold text-muted">{course.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                  <div
                    className={`h-full rounded-full ${course.color}`}
                    style={{ width: `${course.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">124+</p>
              <p className="text-[11px] text-muted">Hours</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">18</p>
              <p className="text-[11px] text-muted">Modules</p>
            </div>
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Recent Learning</h2>
            <Clock3 className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="dashboard-recent-row">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-text">UI Design Fundamentals</p>
                  <p className="text-[11px] text-muted">Completed lesson successfully</p>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-muted">14m</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Upcoming classes */}
      <section>
        <h2 className="dashboard-section-title mb-3">Upcoming Classes</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {UPCOMING.map((item) => (
            <Card
              key={item.title}
              className="group p-4 transition-colors duration-200 hover:border-primary/25"
            >
              <div className="flex items-center gap-2 text-primary">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]">{item.date}</p>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-snug text-text">{item.title}</h3>
              <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
