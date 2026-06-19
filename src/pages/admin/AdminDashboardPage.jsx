import { useState } from 'react';
import {
  Users, DollarSign, CheckSquare,
  AlertTriangle, BookOpen, Star, ArrowUpRight,
  ArrowDownRight, Globe, Award, BarChart2,
  UserCheck, RefreshCw, Download, ChevronRight,
  Server, Cpu, HardDrive, Wifi
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* â”€â”€â”€ tiny inline sparkline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Sparkline({ data, color = 'var(--primary)', height = 36 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = height;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
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

/* â”€â”€â”€ radial progress ring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function RadialProgress({ pct, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

/* â”€â”€â”€ bar chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => Math.max(d.s, d.m)));
  return (
    <div className="h-48 flex items-end gap-1.5 pt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end gap-0.5 h-36">
            <div
              className="flex-1 rounded-t-[5px] bg-primary/80 transition-all duration-700"
              style={{ height: `${(d.s / max) * 100}%` }}
            />
            <div
              className="flex-1 rounded-[5px] bg-success/70 transition-all duration-700"
              style={{ height: `${(d.m / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-muted">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('week');

  const kpis = [
    {
      label: 'Total MRR',
      value: '$124.5k',
      sub: 'Monthly Recurring Revenue',
      trend: '+15.2%',
      positive: true,
      icon: DollarSign,
      color: 'text-success',
      iconBg: 'bg-success/10',
      spark: [60, 75, 65, 90, 80, 100, 95, 115, 108, 124],
      sparkColor: 'var(--success)',
    },
    {
      label: 'Active Learners',
      value: '12,482',
      sub: 'Registered students',
      trend: '+5.4%',
      positive: true,
      icon: Users,
      color: 'text-primary',
      iconBg: 'bg-primary/10',
      spark: [80, 85, 90, 88, 95, 100, 98, 105, 110, 125],
      sparkColor: 'var(--primary)',
    },
    {
      label: 'Course Completions',
      value: '3,841',
      sub: 'This month',
      trend: '+8.7%',
      positive: true,
      icon: Award,
      color: 'text-accent',
      iconBg: 'bg-accent/10',
      spark: [30, 40, 38, 55, 48, 62, 60, 75, 70, 85],
      sparkColor: 'var(--accent)',
    },
    {
      label: 'Pending Approvals',
      value: '14',
      sub: 'Awaiting QA review',
      trend: '-2 today',
      positive: false,
      icon: CheckSquare,
      color: 'text-warning',
      iconBg: 'bg-warning/10',
      spark: [20, 18, 22, 16, 19, 14, 16, 15, 16, 14],
      sparkColor: 'var(--warning)',
    },
  ];

  const revenueData = {
    week: [
      { month: 'Mon', s: 42, m: 18 },
      { month: 'Tue', s: 58, m: 28 },
      { month: 'Wed', s: 75, m: 35 },
      { month: 'Thu', s: 62, m: 30 },
      { month: 'Fri', s: 88, m: 45 },
      { month: 'Sat', s: 70, m: 38 },
      { month: 'Sun', s: 55, m: 25 },
    ],
    month: [
      { month: 'W1', s: 40, m: 20 },
      { month: 'W2', s: 60, m: 35 },
      { month: 'W3', s: 80, m: 50 },
      { month: 'W4', s: 100, m: 70 },
    ],
    year: [
      { month: 'Q1', s: 40, m: 20 },
      { month: 'Q2', s: 60, m: 35 },
      { month: 'Q3', s: 80, m: 50 },
      { month: 'Q4', s: 100, m: 70 },
    ],
  };

  const topCourses = [
    { name: 'AWS Cloud Architect Pro', mentor: 'Sarah Chen', students: 2840, rating: 4.9, revenue: '$28,400', trend: 'up' },
    { name: 'Kubernetes & DevOps Mastery', mentor: 'Liam Carter', students: 2210, rating: 4.8, revenue: '$22,100', trend: 'up' },
    { name: 'React & Next.js Complete', mentor: 'Priya Nair', students: 1985, rating: 4.7, revenue: '$19,850', trend: 'up' },
    { name: 'Python for Data Science', mentor: 'Omar Hassan', students: 1740, rating: 4.6, revenue: '$17,400', trend: 'down' },
    { name: 'System Design at Scale', mentor: 'Yuki Tanaka', students: 1320, rating: 4.8, revenue: '$13,200', trend: 'up' },
  ];

  const recentUsers = [
    { name: 'Aarav Mehta', role: 'student', action: 'Enrolled in AWS Cloud', time: '2m ago', avatar: 'AM' },
    { name: 'Sophie Laurent', role: 'mentor', action: 'Submitted new course for review', time: '15m ago', avatar: 'SL' },
    { name: 'Ethan Brooks', role: 'student', action: 'Completed Kubernetes module', time: '32m ago', avatar: 'EB' },
    { name: 'Mia Johansson', role: 'student', action: 'Purchased React & Next.js', time: '1h ago', avatar: 'MJ' },
    
  ];

  const systemHealth = [
    { label: 'API Uptime', value: 99.9, color: 'var(--success)', icon: Wifi, status: 'Operational' },
    { label: 'DB Load', value: 68, color: 'var(--warning)', icon: HardDrive, status: 'Moderate' },
    { label: 'CPU Usage', value: 42, color: 'var(--primary)', icon: Cpu, status: 'Normal' },
    { label: 'CDN Health', value: 95, color: 'var(--success)', icon: Server, status: 'Healthy' },
  ];

  const quickActions = [
    { label: 'Review Courses', icon: BookOpen, to: '/admin/approvals', color: 'bg-primary/10 text-primary hover:bg-primary/20' },
    { label: 'Manage Users', icon: Users, to: '/admin/users', color: 'bg-accent/10 text-accent hover:bg-accent/20' },
    { label: 'View Reports', icon: BarChart2, to: '/admin/reports', color: 'bg-success/10 text-success hover:bg-success/20' },
    { label: 'Financials', icon: DollarSign, to: '/admin/revenue', color: 'bg-warning/10 text-warning hover:bg-warning/20' },
  ];

  const geoData = [
    { region: 'North America', pct: 42, color: 'bg-primary' },
    { region: 'Europe', pct: 28, color: 'bg-accent' },
    { region: 'Asia Pacific', pct: 20, color: 'bg-success' },
    { region: 'Rest of World', pct: 10, color: 'bg-warning' },
  ];

  const roleColors = {
    student: 'bg-primary/10 text-primary',
    mentor: 'bg-accent/10 text-accent',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* â”€â”€ HEADER â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Live Dashboard</span>
          </div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Platform Overview</h1>
          <p className="text-muted mt-1 font-medium">Global metrics, system health & insights for Cloud Nexus.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="
                  relative
                  inline-flex
                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[100px]
                  items-center
                  justify-center
                  border
                  border-border
                  dark:border-border
                  bg-white
                  dark:bg-white
                  px-6
                  text-[14px]
                  font-semibold
                  text-black
                  dark:text-black
                  overflow-hidden
                  rounded-full
                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                ">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button className="
                  relative
                  inline-flex
                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[100px]
                  items-center
                  justify-center
                  border
                  border-border
                  dark:border-border
                  bg-primary
                  dark:bg-primary
                  px-6
                  text-[14px]
                  font-semibold
                  text-white
                  dark:text-white
                  overflow-hidden
                  rounded-full
                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                ">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

     {/* â”€â”€ KPI CARDS â”€â”€ */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {kpis.map((kpi) => {
    const Icon = kpi.icon;

    return (
      <div
        key={kpi.label}
        className="
          group
          relative
          overflow-hidden
          bg-surface
          border
          border-border
          p-5
          rounded-[5px]
          shadow-sm
          hover:-translate-y-1
          hover:border-primary/50
          hover:bg-primary/[0.03]
          dark:hover:bg-primary/[0.06]
          hover:shadow-[0_10px_40px_rgba(0,0,0,0.10)]
          dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          transition-all
          duration-500
        "
      >

        {/* LARGE BACKGROUND ICON */}
        <div
          className="
            absolute
            bottom-0
            right-0
            translate-y-6
            translate-x-6
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
            pointer-events-none
            z-0
          "
        >
          <Icon
            className={`
              w-[170px]
              h-[170px]
              ${kpi.color}
              opacity-10
              dark:opacity-[0.06]
            `}
            strokeWidth={0.9}
          />
        </div>

        {/* GRADIENT OVERLAY */}
        <div
          className="
            absolute
            inset-0
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
          "
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(99,102,241,0.10),
                transparent 45%
              )
            `,
          }}
        />

        {/* CONTENT */}
        <div className="relative z-10">

          {/* TOP */}
          <div className="flex items-start justify-between mb-4">

            {/* SMALL ICON */}
            <div
              className={`
                h-10
                w-10
                rounded-[5px]
                ${kpi.iconBg}
                flex
                items-center
                justify-center
                ${kpi.color}
                transition-all
                duration-300
                group-hover:scale-110
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* TREND */}
            <div
              className={`
                flex
                items-center
                gap-1
                text-xs
                font-bold
                px-2
                py-1
                rounded-[5px]
                ${
                  kpi.positive
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }
              `}
            >
              {kpi.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}

              {kpi.trend}
            </div>
          </div>

          {/* VALUE */}
          <p className="text-2xl font-display font-bold text-text">
            {kpi.value}
          </p>

          {/* LABEL */}
          <p className="text-xs font-bold text-muted mt-0.5 mb-3">
            {kpi.label}
          </p>

          {/* BOTTOM */}
          <div className="flex items-end justify-between">
            <p className="text-[11px] text-subtle font-medium">
              {kpi.sub}
            </p>

            <div className="transition-transform duration-300 group-hover:scale-105">
              <Sparkline
                data={kpi.spark}
                color={kpi.sparkColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
      {/* â”€â”€ REVENUE CHART + QUICK ACTIONS â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[5px] shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-text">Revenue Trend</h3>
              <p className="text-xs text-muted font-medium mt-0.5">Course sales vs Mentor payouts</p>
            </div>
            <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1">
              {['week', 'month', 'year'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${activeTab === t ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" /> Sales
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-muted">
              <span className="h-2.5 w-2.5 rounded-[5px] bg-success/70" /> Payouts
            </span>
          </div>

          <MiniBarChart data={revenueData[activeTab]} />
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-lg text-text mb-1">Quick Actions</h3>
          <p className="text-xs text-muted font-medium mb-5">Shortcuts to key admin tasks</p>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.label}
                  to={qa.to}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-full text-center transition-all duration-200 ${qa.color} group`}
                >
                  <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-xs font-bold leading-tight">{qa.label}</span>
                </Link>
              );
            })}
          </div>

          {/* mini stat */}
          <div className="mt-5 p-4 bg-bg border border-border rounded-[5px] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-wider">New Users Today</p>
              <p className="text-2xl font-display font-bold text-text mt-0.5">+284</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ ACTION ITEMS + SYSTEM HEALTH â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Action Items */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[5px] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-text">Action Items</h3>
            <span className="text-xs font-bold bg-warning/10 text-warning px-2 py-1 rounded-[5px]">3 Pending</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 rounded-[5px] border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-warning/15 flex items-center justify-center text-warning flex-shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text text-sm">High Server Load Detected</p>
                <p className="text-xs text-muted font-medium mt-0.5">DB CPU hit 85% in us-east-1. Auto-scaling initiated.</p>
              </div>
              <button className="ml-auto flex-shrink-0 text-xs font-bold text-warning hover:text-text border border-warning/30 px-3 py-1.5 rounded-full transition-colors">
                Acknowledge
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-[5px] border border-border bg-bg hover:border-primary/30 transition-colors group">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text text-sm">14 Courses Awaiting Review</p>
                <p className="text-xs text-muted font-medium mt-0.5">Mentor submissions need QA approval before publishing.</p>
              </div>
              <Link to="/admin/approvals" className="ml-auto flex-shrink-0 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-hover transition-colors">
                Review Now
              </Link>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-[5px] border border-border bg-bg hover:border-primary/30 transition-colors group">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text text-sm">Monthly Mentor Payouts Pending</p>
                <p className="text-xs text-muted font-medium mt-0.5">$42,500 across 18 mentors needs authorization.</p>
              </div>
              <Link to="/admin/revenue" className="ml-auto flex-shrink-0 text-xs font-bold bg-surface border border-border px-3 py-1.5 rounded-full hover:bg-bg hover:border-primary/40 transition-colors">
                Authorize
              </Link>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-surface border border-border rounded-[5px] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-text">System Health</h3>
            <span className="flex items-center gap-1.5 text-xs font-bold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> All Systems Go
            </span>
          </div>
          <div className="space-y-5">
            {systemHealth.map((sh) => {
              const Icon = sh.icon;
              return (
                <div key={sh.label} className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <RadialProgress pct={sh.value} color={sh.color} size={52} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-4 w-4" style={{ color: sh.color }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-text">{sh.label}</p>
                      <p className="text-xs font-bold" style={{ color: sh.color }}>{sh.value}%</p>
                    </div>
                    <p className="text-xs text-muted font-medium">{sh.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* â”€â”€ TOP COURSES + RECENT ACTIVITY â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Top Performing Courses */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden mr-">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="font-bold text-lg text-text">Top Performing Courses</h3>
              <p className="text-xs text-muted font-medium mt-0.5">By enrollment & revenue</p>
            </div>
            <Link to="/admin/approvals" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg border-b border-border">
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider hidden sm:table-cell">Students</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold text-muted uppercase tracking-wider hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold text-muted uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topCourses.map((course, i) => (
                  <tr key={i} className="hover:bg-bg/60 transition-colors group">
                    <td className="px-5 py-4 text-xs font-bold text-muted">{i + 1}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-text text-sm leading-tight">{course.name}</p>
                      <p className="text-xs text-muted font-medium mt-0.5">{course.mentor}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted" />
                        <span className="font-bold text-text text-xs">{course.students.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                        <span className="font-bold text-text text-xs">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-bold text-success text-sm">{course.revenue}</span>
                        {course.trend === 'up'
                          ? <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                          : <ArrowDownRight className="h-3.5 w-3.5 text-danger" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col: Recent Activity + Geo */}
        <div className="flex flex-col gap-5">

          {/* Recent User Activity */}
          {/* <div className="bg-surface border border-border rounded-[5px] shadow-sm p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-text">Recent Activity</h3>
              <Link to="/admin/users" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-bold flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-text leading-tight">{user.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted font-medium mt-0.5 truncate">{user.action}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] text-subtle font-medium whitespace-nowrap">{user.time}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* Geographic Distribution */}
          {/* <div className="bg-surface border border-border rounded-[5px] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-text">User Geography</h3>
              <Globe className="h-4 w-4 text-muted" />
            </div>
            <div className="space-y-3">
              {geoData.map((geo, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-bold text-text">{geo.region}</span>
                    <span className="text-xs font-bold text-muted">{geo.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full ${geo.color} rounded-full transition-all duration-700`}
                      style={{ width: `${geo.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

  

    </div>
  );
}
