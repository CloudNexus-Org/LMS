import { useCallback, useMemo, useState } from "react";
import {
  Users,
  DollarSign,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Star,
  ArrowRight,
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
  Activity,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  csvFilename,
  downloadMultiSectionCsv,
} from "@/lib/exportCsv";

function MiniSparkline({ data, className = "" }) {
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
    <svg viewBox={`0 0 ${w} ${h}`} className={`dashboard-sparkline ${className}`} aria-hidden>
      <polyline points={points} className="dashboard-sparkline-line" />
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

function buildSmoothPath(coords) {
  if (coords.length < 2) return "";
  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i += 1) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const cpx = (p0.x + p1.x) / 2;
    d += ` C ${cpx},${p0.y} ${cpx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

function buildAreaPath(coords, baseline) {
  if (coords.length < 2) return "";
  const line = buildSmoothPath(coords);
  const last = coords[coords.length - 1];
  const first = coords[0];
  return `${line} L ${last.x},${baseline} L ${first.x},${baseline} Z`;
}

function RevenueLineChart({ data }) {
  const width = 640;
  const height = 200;
  const pad = { top: 28, right: 52, bottom: 32, left: 8 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const baseline = pad.top + chartH;

  const sales = data.map((d) => d.s);
  const payouts = data.map((d) => d.m);
  const max = Math.max(...sales, ...payouts, 1);
  const min = Math.min(...sales, ...payouts, 0);
  const range = max - min || 1;

  const toCoords = (values) =>
    values.map((v, i) => ({
      x: pad.left + (i / (values.length - 1)) * chartW,
      y: pad.top + chartH - ((v - min) / range) * chartH,
    }));

  const salesCoords = toCoords(sales);
  const payoutCoords = toCoords(payouts);
  const salesPath = buildSmoothPath(salesCoords);
  const payoutPath = buildSmoothPath(payoutCoords);
  const salesArea = buildAreaPath(salesCoords, baseline);

  const lastSales = sales[sales.length - 1];
  const lastPayouts = payouts[payouts.length - 1];
  const totalSales = sales.reduce((sum, v) => sum + v, 0);
  const totalPayouts = payouts.reduce((sum, v) => sum + v, 0);
  const salesGrowth = sales.length > 1
    ? (((lastSales - sales[0]) / sales[0]) * 100).toFixed(1)
    : "0.0";
  const payoutGrowth = payouts.length > 1
    ? (((lastPayouts - payouts[0]) / payouts[0]) * 100).toFixed(1)
    : "0.0";

  const gridLines = 4;

  return (
    <div className="dashboard-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="dashboard-line-chart-svg"
        role="img"
        aria-label="Revenue trend line chart"
      >
        <defs>
          <linearGradient id="revenue-sales-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--success)" />
            <stop offset="55%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--warning)" />
          </linearGradient>
          <linearGradient id="revenue-sales-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--primary) 22%, transparent)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--primary) 2%, transparent)" />
          </linearGradient>
        </defs>

        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = pad.top + (i / gridLines) * chartH;
          return (
            <line
              key={i}
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              className="dashboard-line-chart-grid"
            />
          );
        })}

        <path d={salesArea} fill="url(#revenue-sales-fill)" />
        <path d={payoutPath} className="dashboard-line-chart-payouts" />
        <path d={salesPath} className="dashboard-line-chart-sales" stroke="url(#revenue-sales-stroke)" />

        {salesCoords.map((pt, i) => (
          <circle
            key={`sales-${data[i].month}`}
            cx={pt.x}
            cy={pt.y}
            r={i === salesCoords.length - 1 ? 4.5 : 2.5}
            className={i === salesCoords.length - 1 ? "dashboard-line-chart-dot-sales" : "dashboard-line-chart-dot"}
          />
        ))}

        {payoutCoords.map((pt, i) => (
          <circle
            key={`payout-${data[i].month}`}
            cx={pt.x}
            cy={pt.y}
            r={i === payoutCoords.length - 1 ? 4 : 2}
            className={i === payoutCoords.length - 1 ? "dashboard-line-chart-dot-payouts" : "dashboard-line-chart-dot-muted"}
          />
        ))}

        <text
          x={salesCoords[salesCoords.length - 1].x + 8}
          y={salesCoords[salesCoords.length - 1].y + 4}
          className="dashboard-line-chart-label-sales"
        >
          {lastSales}k
        </text>
        <text
          x={payoutCoords[payoutCoords.length - 1].x + 8}
          y={payoutCoords[payoutCoords.length - 1].y + 4}
          className="dashboard-line-chart-label-payouts"
        >
          {lastPayouts}k
        </text>

        {data.map((d, i) => (
          <text
            key={d.month}
            x={salesCoords[i].x}
            y={height - 8}
            textAnchor="middle"
            className="dashboard-line-chart-axis"
          >
            {d.month}
          </text>
        ))}
      </svg>

      <div className="dashboard-line-chart-summary">
        <div className="dashboard-line-chart-stat">
          <div className="dashboard-line-chart-stat-head">
            <span className="dashboard-line-chart-marker dashboard-line-chart-marker-sales" />
            <span className="dashboard-line-chart-stat-label">Course sales</span>
          </div>
          <p className="dashboard-line-chart-stat-value">${totalSales}k</p>
          <p className="dashboard-line-chart-stat-change dashboard-line-chart-stat-change-up">
            +{salesGrowth}% <span className="text-muted">vs start</span>
          </p>
        </div>
        <div className="dashboard-line-chart-stat">
          <div className="dashboard-line-chart-stat-head">
            <span className="dashboard-line-chart-marker dashboard-line-chart-marker-payouts" />
            <span className="dashboard-line-chart-stat-label">Mentor payouts</span>
          </div>
          <p className="dashboard-line-chart-stat-value">${totalPayouts}k</p>
          <p className="dashboard-line-chart-stat-change dashboard-line-chart-stat-change-up">
            +{payoutGrowth}% <span className="text-muted">vs start</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({ className = "", children }) {
  return <div className={`dashboard-card ${className}`}>{children}</div>;
}

const BASE_REVENUE_TREND = [60, 75, 65, 90, 80, 100, 95, 115, 108, 124];

const BASE_REVENUE_DATA = {
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

const BASE_SYSTEM_HEALTH = [
  { label: "API Uptime", value: 99.9, color: "var(--success)", icon: Wifi, status: "Operational" },
  { label: "DB Load", value: 68, color: "var(--warning)", icon: HardDrive, status: "Moderate" },
  { label: "CPU Usage", value: 42, color: "var(--primary)", icon: Cpu, status: "Normal" },
  { label: "CDN Health", value: 95, color: "var(--success)", icon: Server, status: "Healthy" },
];

function jitterValue(value, spread = 0.08) {
  const next = Math.round(value * (1 + (Math.random() * 2 - 1) * spread));
  return Math.max(1, next);
}

function jitterDecimal(value, spread = 0.06) {
  const next = value * (1 + (Math.random() * 2 - 1) * spread);
  return +Math.max(0, next).toFixed(1);
}

const DEFAULT_PLATFORM_STATE = {
  users: Array.from({ length: 8 }, () => ({ role: "Student", status: "Active" })),
  courseSubmissions: [
    { status: "Pending" },
    { status: "Pending" },
    { status: "Approved" },
  ],
  enrollments: [],
};

function buildDashboardSnapshot(
  platformState = DEFAULT_PLATFORM_STATE
) {
  const { users, courseSubmissions, enrollments } = platformState;
  const pendingApprovals = courseSubmissions.filter((c) => c.status === "Pending").length;
  const approvedCount = courseSubmissions.filter((c) => c.status === "Approved").length;
  const activeStudents = users.filter(
    (u) => u.role === "Student" && u.status === "Active"
  ).length;
  const mrr = 118000 + enrollments.length * 3200 + approvedCount * 1800;

  return {
    mrrGrowth: jitterDecimal(15.2, 0.04),
    activeLearners: 12000 + activeStudents * 312 + enrollments.length * 48,
    learnerGrowth: jitterDecimal(5.4, 0.05),
    mrrLabel: `$${(mrr / 1000).toFixed(1)}k`,
    completions: 3600 + enrollments.length * 120 + approvedCount * 45,
    completionGrowth: jitterDecimal(8.7, 0.05),
    pendingApprovals,
    resolvedToday: Math.min(approvedCount, 2),
    revenueTrend: BASE_REVENUE_TREND.map((v) => jitterValue(v, 0.1)),
    revenueData: Object.fromEntries(
      Object.entries(BASE_REVENUE_DATA).map(([key, points]) => [
        key,
        points.map((point) => ({
          ...point,
          s: jitterValue(point.s, 0.12),
          m: jitterValue(point.m, 0.12),
        })),
      ])
    ),
    systemHealth: BASE_SYSTEM_HEALTH.map((item) => ({
      ...item,
      value:
        item.label === "API Uptime" || item.label === "CDN Health"
          ? +jitterDecimal(item.value, 0.002).toFixed(1)
          : jitterValue(item.value, 0.08),
    })),
    newUsersToday: 240 + activeStudents * 3,
  };
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshot, setSnapshot] = useState(() => buildDashboardSnapshot());
  const [chartKey, setChartKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSnapshot(buildDashboardSnapshot());
      setChartKey((key) => key + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const kpis = useMemo(
    () => [
      {
        title: "Total MRR",
        count: snapshot.mrrLabel,
        subtitle: `+${snapshot.mrrGrowth}% this month`,
        icon: DollarSign,
        iconBg: "bg-success/10",
        iconColor: "text-success",
        accent: "dashboard-kpi-success",
      },
      {
        title: "Learners",
        count: snapshot.activeLearners.toLocaleString(),
        subtitle: `+${snapshot.learnerGrowth}% active`,
        icon: Users,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        accent: "dashboard-kpi-primary",
      },
      {
        title: "Completions",
        count: snapshot.completions.toLocaleString(),
        subtitle: `+${snapshot.completionGrowth}% this month`,
        icon: Award,
        iconBg: "bg-accent-soft",
        iconColor: "text-accent",
        accent: "dashboard-kpi-accent",
      },
      {
        title: "Approvals",
        count: String(snapshot.pendingApprovals),
        subtitle:
          snapshot.resolvedToday > 0
            ? `${snapshot.resolvedToday} resolved today`
            : "Queue up to date",
        icon: CheckSquare,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
        accent: "dashboard-kpi-warning",
      },
    ],
    [snapshot]
  );

  const revenueData = snapshot.revenueData;
  const revenueTrend = snapshot.revenueTrend;
  const systemHealth = snapshot.systemHealth;

  const topCourses = [
    { name: "AWS Cloud Architect Pro", mentor: "Sarah Chen", students: 2840, rating: 4.9, revenue: "$28,400", trend: "up" },
    { name: "Kubernetes & DevOps Mastery", mentor: "Liam Carter", students: 2210, rating: 4.8, revenue: "$22,100", trend: "up" },
    { name: "React & Next.js Complete", mentor: "Priya Nair", students: 1985, rating: 4.7, revenue: "$19,850", trend: "up" },
    { name: "Python for Data Science", mentor: "Omar Hassan", students: 1740, rating: 4.6, revenue: "$17,400", trend: "down" },
    { name: "System Design at Scale", mentor: "Yuki Tanaka", students: 1320, rating: 4.8, revenue: "$13,200", trend: "up" },
  ];

  const quickActions = [
    { label: "Review Courses", icon: BookOpen, to: "/admin/approvals" },
    { label: "Manage Users", icon: Users, to: "/admin/users" },
    { label: "View Reports", icon: BarChart2, to: "/admin/reports" },
    { label: "Financials", icon: DollarSign, to: "/admin/revenue" },
  ];

  const actionItems = [
    {
      type: "alert",
      icon: AlertTriangle,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      title: "High Server Load Detected",
      desc: "DB CPU hit 85% in us-east-1. Auto-scaling initiated.",
      action: { label: "Acknowledge", variant: "warning" },
    },
    {
      type: "row",
      icon: CheckSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "14 Courses Awaiting Review",
      desc: "Mentor submissions need QA approval before publishing.",
      action: { label: "Review Now", to: "/admin/approvals", variant: "primary" },
    },
    {
      type: "row",
      icon: DollarSign,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      title: "Monthly Mentor Payouts Pending",
      desc: "$42,500 across 18 mentors needs authorization.",
      action: { label: "Authorize", to: "/admin/revenue", variant: "outline" },
    },
  ];

  const handleExportDashboard = () => {
    const weekRevenue = snapshot.revenueData.week;
    downloadMultiSectionCsv(csvFilename("admin-dashboard"), [
      {
        title: "Platform Overview KPIs",
        headers: ["Metric", "Value", "Detail"],
        rows: kpis.map((k) => [k.title, k.count, k.subtitle]),
      },
      {
        title: "Revenue Trend (Week)",
        headers: ["Day", "Course Sales (k)", "Mentor Payouts (k)"],
        rows: weekRevenue.map((d) => [d.month, d.s, d.m]),
      },
      {
        title: "System Health",
        headers: ["Component", "Value %", "Status"],
        rows: systemHealth.map((s) => [s.label, s.value, s.status]),
      },
      {
        title: "Action Items",
        headers: ["Title", "Description", "Type"],
        rows: actionItems.map((a) => [a.title, a.desc, a.type]),
      },
      {
        title: "Top Performing Courses",
        headers: ["Course", "Mentor", "Students", "Rating", "Revenue", "Trend"],
        rows: topCourses.map((c) => [
          c.name,
          c.mentor,
          c.students,
          c.rating,
          c.revenue,
          c.trend,
        ]),
      },
    ]);
  };

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      {/* Compact analytics header — matches student dashboard */}
      <section className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Live dashboard
          </span>
          <p className="dashboard-greeting">
            Platform <span className="text-primary">Overview</span>
          </p>
          <p className="dashboard-greeting-sub">
            Global metrics, system health &amp; insights for Cloud Nexus.
          </p>
        </div>

        <div className="dashboard-analytics-metrics">
          <div className="dashboard-analytics-metric">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <div>
              <p className="dashboard-metric-value">+{snapshot.mrrGrowth}%</p>
              <p className="dashboard-metric-label">MRR growth</p>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Users className="h-3.5 w-3.5 text-primary" />
            <div>
              <p className="dashboard-metric-value">
                {snapshot.activeLearners.toLocaleString()}
              </p>
              <p className="dashboard-metric-label">Active learners</p>
            </div>
          </div>
          <div className="dashboard-analytics-chart">
            <p className="dashboard-metric-label mb-1">Revenue trend</p>
            <MiniSparkline data={revenueTrend} />
          </div>
        </div>

        <div className="dashboard-analytics-status">
          <div className="dashboard-analytics-actions">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleExportDashboard}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </section>

      {/* KPI stat cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((item) => {
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

      {/* Revenue + quick actions */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="flex h-full flex-col p-4 xl:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Revenue Trend</h2>
              <p className="mt-0.5 text-[11px] text-muted">Course sales vs mentor payouts</p>
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
          <RevenueLineChart key={chartKey} data={revenueData[activeTab]} />
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Quick Actions</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link key={qa.label} to={qa.to} className="dashboard-action-btn group">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate text-xs font-semibold text-text">{qa.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
          <div className="dashboard-mini-stat mt-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">New users today</p>
              <p className="mt-0.5 text-lg font-bold text-text">+{snapshot.newUsersToday}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </section>

      {/* Action items + system health */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="flex h-full flex-col p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Action Items</h2>
            <span className="dashboard-trend dashboard-trend-down">3 pending</span>
          </div>
          <div className="space-y-2">
            {actionItems.map((item) => {
              const Icon = item.icon;
              const rowClass = item.type === "alert" ? "dashboard-admin-alert" : "dashboard-recent-row";
              return (
                <div key={item.title} className={rowClass}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-text">{item.title}</p>
                    <p className="text-[11px] text-muted">{item.desc}</p>
                  </div>
                  {item.action.to ? (
                    <Link
                      to={item.action.to}
                      className={`dashboard-admin-btn dashboard-admin-btn-${item.action.variant}`}
                    >
                      {item.action.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`dashboard-admin-btn dashboard-admin-btn-${item.action.variant}`}
                    >
                      {item.action.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
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
            <p className="mt-0.5 text-[11px] text-muted">By enrollment &amp; revenue</p>
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
