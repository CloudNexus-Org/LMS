import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  BookOpen,
  Star,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Activity,
  Clock3,
  CalendarDays,
  Sparkles,
  ChevronRight,
  Flame,
  BarChart2,
  Upload,
  RefreshCw,
  Bell,
  Video,
} from "lucide-react";

const ENGAGEMENT_WEEK = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 78 },
  { label: "Wed", value: 71 },
  { label: "Thu", value: 88 },
  { label: "Fri", value: 95 },
  { label: "Sat", value: 82 },
  { label: "Sun", value: 74 },
];

const ENGAGEMENT_TREND = [58, 64, 61, 72, 78, 74, 86, 90, 88, 94, 98, 92];

const BASE_KPIS = {
  students: 1248,
  revenue: 4250,
  courses: 4,
  rating: 4.8,
  pendingQa: 12,
  weeklyGrowth: 24,
  newReviews: 86,
  engagement: 92,
};

const RECENT_ENROLLMENTS = [
  {
    name: "Alex Chen",
    initials: "AC",
    course: "Advanced State Management",
    time: "2 hours ago",
    amount: "$89.99",
  },
  {
    name: "Sarah Miller",
    initials: "SM",
    course: "Cloud Architecture Patterns",
    time: "5 hours ago",
    amount: "$129.99",
  },
  {
    name: "James Wilson",
    initials: "JW",
    course: "Cloud Architecture Patterns",
    time: "1 day ago",
    amount: "$129.99",
  },
  {
    name: "Emily Davis",
    initials: "ED",
    course: "React Performance Patterns",
    time: "2 days ago",
    amount: "$79.99",
  },
];

const TOP_COURSES = [
  {
    name: "Cloud Architecture Patterns",
    students: 842,
    rating: 4.9,
    revenue: "$28,400",
    trend: "up",
  },
  {
    name: "Advanced State Management",
    students: 621,
    rating: 4.8,
    revenue: "$19,850",
    trend: "up",
  },
  {
    name: "React Performance Patterns",
    students: 498,
    rating: 4.7,
    revenue: "$14,200",
    trend: "up",
  },
  {
    name: "System Design Fundamentals",
    students: 312,
    rating: 4.6,
    revenue: "$9,800",
    trend: "down",
  },
];

const ACTIVITIES = [
  {
    title: "New review received",
    desc: "Your React course got a 5 star review.",
    icon: Star,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    title: "Course trending",
    desc: "Cloud Architecture Patterns is trending today.",
    icon: Flame,
    iconBg: "bg-[color:color-mix(in_oklab,var(--warning)_12%,transparent)]",
    iconColor: "text-warning",
  },
  {
    title: "Live session reminder",
    desc: "You have a mentoring session at 7 PM.",
    icon: CalendarDays,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

const UPCOMING = [
  { date: "Today", title: "Live Q&A Session", subtitle: "Cloud Architecture · 7:00 PM" },
  { date: "Tomorrow", title: "Course Review Call", subtitle: "Platform QA feedback" },
  { date: "Fri", title: "Student Office Hours", subtitle: "React Performance track" },
  { date: "Mon", title: "New Cohort Kickoff", subtitle: "Advanced State Management" },
];

const QUICK_ACTIONS = [
  { label: "Upload Course", icon: Upload, to: "/mentor/upload" },
  { label: "Manage Lessons", icon: BookOpen, to: "/mentor/lessons" },
  { label: "View Analytics", icon: BarChart2, to: "/mentor/analytics" },
  { label: "Revenue & Payouts", icon: DollarSign, to: "/mentor/revenue" },
];

const PENDING_QA = {
  name: "John Doe",
  initials: "JD",
  course: "Cloud Architecture",
  lesson: "Lesson 3",
  urgent: true,
  question:
    "Could you clarify the difference between standard and FIFO queues here?",
};

function jitterValue(value, spread = 0.08) {
  const next = Math.round(value * (1 + (Math.random() * 2 - 1) * spread));
  return Math.max(1, next);
}

function jitterDecimal(value, spread = 0.04) {
  const next = value * (1 + (Math.random() * 2 - 1) * spread);
  return +Math.max(0, next).toFixed(1);
}

function buildSnapshot() {
  return {
    students: jitterValue(BASE_KPIS.students, 0.03),
    revenue: jitterValue(BASE_KPIS.revenue, 0.06),
    courses: BASE_KPIS.courses,
    rating: jitterDecimal(BASE_KPIS.rating, 0.02),
    pendingQa: BASE_KPIS.pendingQa,
    weeklyGrowth: jitterDecimal(BASE_KPIS.weeklyGrowth, 0.05),
    newReviews: jitterValue(BASE_KPIS.newReviews, 0.1),
    engagement: jitterValue(BASE_KPIS.engagement, 0.04),
    engagementWeek: ENGAGEMENT_WEEK.map((d) => ({
      ...d,
      value: jitterValue(d.value, 0.12),
    })),
    trend: ENGAGEMENT_TREND.map((v) => jitterValue(v, 0.08)),
  };
}

function formatLastUpdated(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

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

export default function MentorDashboardPage() {
  const [snapshot, setSnapshot] = useState(() => buildSnapshot());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [chartTab, setChartTab] = useState("week");

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setSnapshot(buildSnapshot());
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const kpis = useMemo(
    () => [
      {
        title: "Students",
        count: snapshot.students.toLocaleString(),
        subtitle: `+${snapshot.weeklyGrowth}% this week`,
        icon: Users,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        accent: "dashboard-kpi-primary",
      },
      {
        title: "Revenue",
        count: `$${snapshot.revenue.toLocaleString()}`,
        subtitle: "Monthly earnings",
        icon: DollarSign,
        iconBg: "bg-success/10",
        iconColor: "text-success",
        accent: "dashboard-kpi-success",
      },
      {
        title: "Courses",
        count: String(snapshot.courses),
        subtitle: "All published",
        icon: BookOpen,
        iconBg: "bg-accent-soft",
        iconColor: "text-accent",
        accent: "dashboard-kpi-accent",
      },
      {
        title: "Avg. Rating",
        count: String(snapshot.rating),
        subtitle: `${snapshot.newReviews} new reviews`,
        icon: Star,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
        accent: "dashboard-kpi-warning",
      },
    ],
    [snapshot]
  );

  const chartData = snapshot.engagementWeek;
  const maxBar = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      {/* Analytics header — aligned with admin & student dashboards */}
      <section className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Mentor hub
          </span>
          <p className="dashboard-greeting">
            Welcome back, <span className="text-primary">Mentor</span>
          </p>
          <p className="dashboard-greeting-sub">
            Track students, revenue, and course performance from one place.
          </p>
        </div>

        <div className="dashboard-analytics-metrics">
          <div className="dashboard-analytics-metric">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <div>
              <p className="dashboard-metric-value">+{snapshot.weeklyGrowth}%</p>
              <p className="dashboard-metric-label">Weekly growth</p>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="dashboard-metric-value">{snapshot.engagement}%</p>
              <p className="dashboard-metric-label">Engagement</p>
            </div>
          </div>
          <div className="dashboard-analytics-chart">
            <p className="dashboard-metric-label mb-1">Student trend</p>
            <MiniSparkline data={snapshot.trend} />
          </div>
        </div>

        <div className="dashboard-analytics-status">
          <p className="hidden text-[11px] text-muted sm:block">
            Updated {formatLastUpdated(lastUpdated)}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="dashboard-header-btn dashboard-header-btn-outline disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
          <Link
            to="/mentor/upload"
            className="dashboard-header-btn dashboard-header-btn-primary"
          >
            <Upload className="h-3.5 w-3.5" />
            Create Course
          </Link>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className={`dashboard-kpi-card p-3.5 ${item.accent}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold leading-none text-text">{item.count}</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    {item.title}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted">{item.subtitle}</p>
            </Card>
          );
        })}
      </section>

      {/* Engagement chart + quick actions */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="flex h-full flex-col p-4 xl:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Course Performance</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Student engagement analytics overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="dashboard-status-live">● Live data</span>
              <div className="dashboard-chart-tabs">
                {["week", "month"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChartTab(t)}
                    className={`dashboard-chart-tab capitalize ${chartTab === t ? "dashboard-chart-tab-active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-bar-chart-bars">
            {chartData.map((bar, i) => (
              <div key={bar.label} className="dashboard-bar-col">
                <div className="dashboard-bar-track">
                  <div
                    className={`dashboard-bar-fill w-full transition-all duration-500 ${i % 2 === 0 ? "" : "dashboard-bar-fill-success"}`}
                    style={{ height: `${(bar.value / maxBar) * 100}%` }}
                  />
                </div>
                <span className="dashboard-bar-label">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.newReviews}</p>
              <p className="text-[11px] text-muted">New reviews</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.pendingQa}</p>
              <p className="text-[11px] text-muted">Pending Q&amp;A</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">94%</p>
              <p className="text-[11px] text-muted">Completion rate</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">3.2h</p>
              <p className="text-[11px] text-muted">Avg. watch time</p>
            </div>
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Quick Actions</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.to} className="dashboard-action-btn group">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate text-xs font-semibold text-text">
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
          <div className="dashboard-mini-stat mt-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Pending Q&amp;A
              </p>
              <p className="mt-0.5 text-lg font-bold text-text">{snapshot.pendingQa}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </section>

      {/* Enrollments + Q&A / activity */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 className="dashboard-section-title">Recent Enrollments</h2>
              <p className="mt-0.5 text-[11px] text-muted">Students who joined recently</p>
            </div>
            <Link
              to="/mentor/students"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table w-full text-sm">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Revenue</th>
                  <th className="text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ENROLLMENTS.map((row) => (
                  <tr key={`${row.name}-${row.time}`}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                          {row.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-text">{row.name}</p>
                          <p className="text-[10px] text-muted">Premium student</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{row.course}</td>
                    <td>
                      <span className="font-bold text-success">{row.amount}</span>
                    </td>
                    <td className="text-right text-[11px] text-muted">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="dashboard-section-title">Q&amp;A Pending</h2>
              <span className="dashboard-trend dashboard-trend-down">
                {snapshot.pendingQa} pending
              </span>
            </div>
            <div className="dashboard-recent-row flex-col !items-stretch !gap-3">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-bold text-primary">
                  {PENDING_QA.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-text">{PENDING_QA.name}</p>
                    {PENDING_QA.urgent ? (
                      <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                        Urgent
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-muted">
                    {PENDING_QA.course} · {PENDING_QA.lesson}
                  </p>
                </div>
              </div>
              <p className="rounded-lg border border-border bg-bg/50 p-3 text-[12px] leading-relaxed text-text">
                &ldquo;{PENDING_QA.question}&rdquo;
              </p>
              <Link
                to="/mentor/notifications"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Reply
              </Link>
            </div>
          </Card>

          <Card className="flex flex-col p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="dashboard-section-title">Recent Activity</h2>
              <Clock3 className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              {ACTIVITIES.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="dashboard-recent-row">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-text">{item.title}</p>
                      <p className="text-[11px] text-muted">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Upcoming sessions */}
      <section>
        <h2 className="dashboard-section-title mb-3">Upcoming Sessions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {UPCOMING.map((item) => (
            <Card
              key={item.title}
              className="group p-4 transition-colors duration-200 hover:border-primary/25"
            >
              <div className="flex items-center gap-2 text-primary">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Video className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  {item.date}
                </p>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-snug text-text">{item.title}</h3>
              <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Top courses table */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="dashboard-section-title">Top Performing Courses</h2>
            <p className="mt-0.5 text-[11px] text-muted">By enrollment &amp; revenue</p>
          </div>
          <Link
            to="/mentor/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View analytics <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="dashboard-table w-full text-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th className="hidden sm:table-cell">Students</th>
                <th className="hidden md:table-cell">Rating</th>
                <th className="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {TOP_COURSES.map((course, i) => (
                <tr key={course.name}>
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <p className="font-semibold text-text">{course.name}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted" />
                      <span className="text-xs font-semibold">
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-xs font-semibold">{course.rating}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs font-bold text-success">{course.revenue}</span>
                      {course.trend === "up" ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5 rotate-180 text-danger" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
