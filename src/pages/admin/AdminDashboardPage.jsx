import { useState } from "react";
import {
  Users,
  DollarSign,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  BarChart2,
  UserCheck,
  RefreshCw,
  Download,
  ChevronRight,
  Server,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";

function Sparkline({ data, color = "var(--primary)" }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 88;
  const h = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="dashboard-sparkline" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

function RadialProgress({ pct, color, size = 48 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
      />
    </svg>
  );
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => Math.max(d.s, d.m)));
  return (
    <div className="dashboard-bar-chart-bars">
      {data.map((d) => (
        <div key={d.month} className="dashboard-bar-col">
          <div className="dashboard-bar-track">
            <div className="flex h-full w-full items-end gap-0.5">
              <div
                className="dashboard-bar-fill flex-1 min-h-[8%]"
                style={{ height: `${(d.s / max) * 100}%` }}
              />
              <div
                className="dashboard-bar-fill dashboard-bar-fill-success flex-1 min-h-[8%]"
                style={{ height: `${(d.m / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="dashboard-bar-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ className = "", children }) {
  return <div className={`dashboard-card ${className}`}>{children}</div>;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("week");

  const kpis = [
    {
      label: "Total MRR",
      value: "$124.5k",
      sub: "Monthly Recurring Revenue",
      trend: "+15.2%",
      positive: true,
      icon: DollarSign,
      color: "text-success",
      iconBg: "bg-success/10",
      spark: [60, 75, 65, 90, 80, 100, 95, 115, 108, 124],
      sparkColor: "var(--success)",
      accent: "dashboard-kpi-success",
    },
    {
      label: "Active Learners",
      value: "12,482",
      sub: "Registered students",
      trend: "+5.4%",
      positive: true,
      icon: Users,
      color: "text-primary",
      iconBg: "bg-primary/10",
      spark: [80, 85, 90, 88, 95, 100, 98, 105, 110, 125],
      sparkColor: "var(--primary)",
      accent: "dashboard-kpi-primary",
    },
    {
      label: "Course Completions",
      value: "3,841",
      sub: "This month",
      trend: "+8.7%",
      positive: true,
      icon: Award,
      color: "text-accent",
      iconBg: "bg-accent-soft",
      spark: [30, 40, 38, 55, 48, 62, 60, 75, 70, 85],
      sparkColor: "var(--accent)",
      accent: "dashboard-kpi-accent",
    },
    {
      label: "Pending Approvals",
      value: "14",
      sub: "Awaiting QA review",
      trend: "-2 today",
      positive: false,
      icon: CheckSquare,
      color: "text-warning",
      iconBg: "bg-warning/10",
      spark: [20, 18, 22, 16, 19, 14, 16, 15, 16, 14],
      sparkColor: "var(--warning)",
      accent: "dashboard-kpi-warning",
    },
  ];

  const revenueData = {
    week: [
      { month: "Mon", s: 42, m: 18 },
      { month: "Tue", s: 58, m: 28 },
      { month: "Wed", s: 75, m: 35 },
      { month: "Thu", s: 62, m: 30 },
      { month: "Fri", s: 88, m: 45 },
      { month: "Sat", s: 70, m: 38 },
      { month: "Sun", s: 55, m: 25 },
    ],
    month: [
      { month: "W1", s: 40, m: 20 },
      { month: "W2", s: 60, m: 35 },
      { month: "W3", s: 80, m: 50 },
      { month: "W4", s: 100, m: 70 },
    ],
    year: [
      { month: "Q1", s: 40, m: 20 },
      { month: "Q2", s: 60, m: 35 },
      { month: "Q3", s: 80, m: 50 },
      { month: "Q4", s: 100, m: 70 },
    ],
  };

  const topCourses = [
    { name: "AWS Cloud Architect Pro", mentor: "Sarah Chen", students: 2840, rating: 4.9, revenue: "$28,400", trend: "up" },
    { name: "Kubernetes & DevOps Mastery", mentor: "Liam Carter", students: 2210, rating: 4.8, revenue: "$22,100", trend: "up" },
    { name: "React & Next.js Complete", mentor: "Priya Nair", students: 1985, rating: 4.7, revenue: "$19,850", trend: "up" },
    { name: "Python for Data Science", mentor: "Omar Hassan", students: 1740, rating: 4.6, revenue: "$17,400", trend: "down" },
    { name: "System Design at Scale", mentor: "Yuki Tanaka", students: 1320, rating: 4.8, revenue: "$13,200", trend: "up" },
  ];

  const systemHealth = [
    { label: "API Uptime", value: 99.9, color: "var(--success)", icon: Wifi, status: "Operational" },
    { label: "DB Load", value: 68, color: "var(--warning)", icon: HardDrive, status: "Moderate" },
    { label: "CPU Usage", value: 42, color: "var(--primary)", icon: Cpu, status: "Normal" },
    { label: "CDN Health", value: 95, color: "var(--success)", icon: Server, status: "Healthy" },
  ];

  const quickActions = [
    { label: "Review Courses", icon: BookOpen, to: "/admin/approvals", tone: "primary" },
    { label: "Manage Users", icon: Users, to: "/admin/users", tone: "accent" },
    { label: "View Reports", icon: BarChart2, to: "/admin/reports", tone: "success" },
    { label: "Financials", icon: DollarSign, to: "/admin/revenue", tone: "warning" },
  ];

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      {/* Compact analytics header */}
      <header className="dashboard-hello-strip">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="dashboard-status-live">● Live dashboard</span>
          </div>
          <h1 className="dashboard-hello-title">Platform Overview</h1>
          <p className="dashboard-hello-date">
            Global metrics, system health &amp; insights for Cloud Nexus.
          </p>
        </div>
        <div className="dashboard-hello-meta">
          <button type="button" className="dashboard-header-btn dashboard-header-btn-outline">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button type="button" className="dashboard-header-btn dashboard-header-btn-primary">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </header>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={kpi.label} className={`dashboard-kpi-card p-3.5 ${kpi.accent}`}>
              <div className="flex items-start justify-between gap-2">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${kpi.iconBg} ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`dashboard-trend ${kpi.positive ? "dashboard-trend-up" : "dashboard-trend-down"}`}>
                  <TrendIcon className="h-3 w-3" />
                  {kpi.trend}
                </span>
              </div>
              <p className="mt-3 text-xl font-bold leading-none text-text">{kpi.value}</p>
              <p className="mt-1 text-[11px] font-semibold text-muted">{kpi.label}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-[10px] text-muted">{kpi.sub}</p>
                <Sparkline data={kpi.spark} color={kpi.sparkColor} />
              </div>
            </Card>
          );
        })}
      </section>

      {/* Revenue + quick actions */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="p-4 xl:col-span-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Revenue Trend</h2>
              <p className="text-[11px] text-muted">Course sales vs mentor payouts</p>
            </div>
            <div className="dashboard-chart-tabs">
              {["week", "month", "year"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`dashboard-chart-tab capitalize ${activeTab === t ? "dashboard-chart-tab-active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-3">
            <span className="dashboard-chart-legend dashboard-chart-legend-primary">Sales</span>
            <span className="dashboard-chart-legend dashboard-chart-legend-success">Payouts</span>
          </div>
          <MiniBarChart data={revenueData[activeTab]} />
        </Card>

        <Card className="flex flex-col p-4 xl:col-span-4">
          <h2 className="dashboard-section-title">Quick Actions</h2>
          <p className="mt-0.5 text-[11px] text-muted">Shortcuts to key admin tasks</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.label}
                  to={qa.to}
                  className={`dashboard-quick-action dashboard-quick-action-${qa.tone}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{qa.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="dashboard-mini-stat mt-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">New users today</p>
              <p className="mt-0.5 text-lg font-bold text-text">+284</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </section>

      {/* Action items + system health */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="p-4 xl:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Action Items</h2>
            <span className="dashboard-trend dashboard-trend-down">3 pending</span>
          </div>
          <div className="space-y-2">
            <div className="dashboard-admin-alert">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text">High Server Load Detected</p>
                <p className="text-[11px] text-muted">DB CPU hit 85% in us-east-1. Auto-scaling initiated.</p>
              </div>
              <button type="button" className="dashboard-admin-btn dashboard-admin-btn-warning">
                Acknowledge
              </button>
            </div>

            <div className="dashboard-admin-row">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text">14 Courses Awaiting Review</p>
                <p className="text-[11px] text-muted">Mentor submissions need QA approval before publishing.</p>
              </div>
              <Link to="/admin/approvals" className="dashboard-admin-btn dashboard-admin-btn-primary">
                Review Now
              </Link>
            </div>

            <div className="dashboard-admin-row">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text">Monthly Mentor Payouts Pending</p>
                <p className="text-[11px] text-muted">$42,500 across 18 mentors needs authorization.</p>
              </div>
              <Link to="/admin/revenue" className="dashboard-admin-btn dashboard-admin-btn-outline">
                Authorize
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-4 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">System Health</h2>
            <span className="dashboard-status-live">● All systems go</span>
          </div>
          <div className="space-y-3">
            {systemHealth.map((sh) => {
              const Icon = sh.icon;
              return (
                <div key={sh.label} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <RadialProgress pct={sh.value} color={sh.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5" style={{ color: sh.color }} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-text">{sh.label}</p>
                      <p className="text-[11px] font-bold" style={{ color: sh.color }}>
                        {sh.value}%
                      </p>
                    </div>
                    <p className="text-[10px] text-muted">{sh.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Top courses */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="dashboard-section-title">Top Performing Courses</h2>
            <p className="text-[11px] text-muted">By enrollment &amp; revenue</p>
          </div>
          <Link to="/admin/approvals" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View All <ChevronRight className="h-3.5 w-3.5" />
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
              {topCourses.map((course, i) => (
                <tr key={course.name}>
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <p className="font-semibold text-text">{course.name}</p>
                    <p className="text-[11px] text-muted">{course.mentor}</p>
                  </td>
                  <td className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted" />
                      <span className="text-xs font-semibold">{course.students.toLocaleString()}</span>
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
                        <ArrowDownRight className="h-3.5 w-3.5 text-danger" />
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
