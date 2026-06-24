import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  DollarSign,
  Download,
  Eye,
  Globe,
  RefreshCw,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { buildSnapshot, formatMentorCurrency } from "@/data/mentorDashboard";

const EASE = [0.16, 1, 0.3, 1];

const pageVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

const ENROLLMENT_BARS = [
  { label: "Jan", value: 480, height: 40, growth: "+12%" },
  { label: "Feb", value: 720, height: 65, growth: "+24%" },
  { label: "Mar", value: 540, height: 45, growth: "+8%" },
  { label: "Apr", value: 1100, height: 80, growth: "+32%" },
  { label: "May", value: 1600, height: 100, growth: "+48%" },
  { label: "Jun", value: 1200, height: 85, growth: "+26%" },
];

const TOP_COURSES = [
  { name: "Cloud Architecture Patterns", revenue: 28400, share: 42 },
  { name: "Advanced State Management", revenue: 19850, share: 29 },
  { name: "React Performance Patterns", revenue: 14200, share: 21 },
];

const PAYOUTS = [
  { id: "PO-2026-05", date: "May 1", amount: "$4,250", status: "Processing" },
  { id: "PO-2026-04", date: "Apr 1", amount: "$3,890", status: "Paid" },
  { id: "PO-2026-03", date: "Mar 1", amount: "$4,010", status: "Paid" },
];

const AUDIENCE = [
  { country: "India", pct: 48 },
  { country: "United States", pct: 24 },
  { country: "Germany", pct: 14 },
  { country: "Canada", pct: 9 },
];

const REVENUE_MIX = [
  { label: "Course sales", pct: 72, color: "bg-primary" },
  { label: "Subscriptions", pct: 18, color: "bg-success" },
  { label: "Affiliate", pct: 10, color: "bg-warning" },
];

function MotionCard({ className = "", children, delay = 0, hover = true }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      whileHover={hover && !shouldReduceMotion ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`dashboard-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

function AnimatedBar({ height, delay = 0, className = "bg-primary" }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`w-full max-w-[48px] rounded-t-md ${className}`}
      initial={{ height: shouldReduceMotion ? `${height}%` : 0 }}
      animate={{ height: `${height}%` }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    />
  );
}

function AnimatedProgress({ value, color, delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: shouldReduceMotion ? `${value}%` : 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: EASE, delay }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [snapshot, setSnapshot] = useState(() => buildSnapshot());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 650));
    setSnapshot(buildSnapshot());
    setChartKey((k) => k + 1);
    setIsRefreshing(false);
  }, []);

  const kpis = useMemo(
    () => [
      { title: "Course views", count: "14.2k", subtitle: "+24% this month", icon: Eye, iconBg: "bg-primary/10", iconColor: "text-primary", accent: "dashboard-kpi-primary" },
      { title: "Conversion", count: "8.4%", subtitle: "+1.2% vs last month", icon: Activity, iconBg: "bg-success/10", iconColor: "text-success", accent: "dashboard-kpi-success" },
      { title: "Active students", count: snapshot.students.toLocaleString(), subtitle: `+${snapshot.weeklyGrowth}% weekly`, icon: Users, iconBg: "bg-warning/10", iconColor: "text-warning", accent: "dashboard-kpi-warning" },
      { title: "Monthly earnings", count: `$${snapshot.revenue.toLocaleString()}`, subtitle: "Payout Jun 1", icon: Wallet, iconBg: "bg-accent-soft", iconColor: "text-accent", accent: "dashboard-kpi-accent" },
    ],
    [snapshot]
  );

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-[1320px] space-y-3 pb-2"
      variants={shouldReduceMotion ? undefined : pageVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
    >
      {/* Header */}
      <motion.section variants={sectionVariants} className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro min-w-0">
          <motion.span
            className="dashboard-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Sparkles className="h-3 w-3" />
            Performance analytics
          </motion.span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Track your <span className="text-primary">teaching impact</span>
          </p>
          <p className="dashboard-greeting-sub">
            Enrollments, engagement, audience insights, and key earnings at a glance.
          </p>
        </div>

        <div className="dashboard-analytics-metrics min-w-0">
          <motion.div className="dashboard-analytics-metric" whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}>
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="dashboard-metric-value">+{snapshot.weeklyGrowth}%</p>
              <p className="dashboard-metric-label">Weekly growth</p>
            </div>
          </motion.div>
          <motion.div className="dashboard-analytics-metric" whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}>
            <DollarSign className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="dashboard-metric-value">${snapshot.revenue.toLocaleString()}</p>
              <p className="dashboard-metric-label">This month</p>
            </div>
          </motion.div>
          <motion.div className="dashboard-analytics-metric" whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}>
            <Activity className="h-3.5 w-3.5 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="dashboard-metric-value">{snapshot.engagement}%</p>
              <p className="dashboard-metric-label">Engagement</p>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-analytics-status w-full lg:w-auto">
          <motion.button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="dashboard-header-btn dashboard-header-btn-outline w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </motion.button>
        </div>
      </motion.section>

      {/* KPI cards */}
      <motion.section variants={sectionVariants} className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {kpis.map((item, index) => {
          const Icon = item.icon;
          return (
            <MotionCard key={item.title} delay={index * 0.04} className={`dashboard-kpi-card p-3 ${item.accent}`}>
              <motion.div
                key={chartKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3, ease: EASE }}
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold leading-none text-text sm:text-lg">{item.count}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">{item.title}</p>
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-muted">{item.subtitle}</p>
              </motion.div>
            </MotionCard>
          );
        })}
      </motion.section>

      {/* Performance content */}
      <motion.div
        key={chartKey}
        variants={sectionVariants}
        className="space-y-3"
      >
        {/* Enrollment + top courses */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <MotionCard className="p-3.5 lg:col-span-3" delay={0.05} hover={false}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="dashboard-section-title">Enrollment trend</h2>
                <p className="text-[10px] text-muted">Last 6 months</p>
              </div>
              <span className="dashboard-status-live text-[10px]">● Live</span>
            </div>
            <div className="flex h-[168px] items-end justify-between gap-1.5 border-b border-border pb-6 sm:gap-2">
              {ENROLLMENT_BARS.map((bar, i) => (
                <div key={bar.label} className="group flex flex-1 flex-col items-center min-w-0">
                  <div className="relative flex h-[130px] w-full items-end justify-center">
                    <div className="absolute -top-7 z-10 hidden whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-[9px] font-bold text-text group-hover:block">
                      {bar.value.toLocaleString()} · {bar.growth}
                    </div>
                    <AnimatedBar height={bar.height} delay={0.08 + i * 0.06} className="bg-gradient-to-t from-primary to-accent" />
                  </div>
                  <span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-muted">{bar.label}</span>
                </div>
              ))}
            </div>
          </MotionCard>

          <MotionCard className="p-3.5 lg:col-span-2" delay={0.08}>
            <h2 className="dashboard-section-title mb-2">Top courses</h2>
            <div className="space-y-2.5">
              {TOP_COURSES.map((course, i) => (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: EASE }}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] font-semibold text-text">{course.name}</p>
                    <span className="shrink-0 text-[11px] font-bold text-success">{formatMentorCurrency(course.revenue)}</span>
                  </div>
                  <AnimatedProgress value={course.share} color="bg-primary" delay={0.12 + i * 0.06} />
                </motion.div>
              ))}
            </div>
          </MotionCard>
        </div>

        {/* Earnings snapshot — from revenue section */}
        <MotionCard className="p-3.5" delay={0.1} hover={false}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Available balance</p>
              <motion.p
                className="text-2xl font-black text-text sm:text-3xl"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35, ease: EASE }}
              >
                ${snapshot.revenue.toLocaleString()}.00
              </motion.p>
              <p className="mt-0.5 text-[10px] text-muted">Next payout · Jun 1, 2026</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:max-w-[360px] sm:flex-1">
              {[
                { label: "Lifetime", value: "$42.8k" },
                { label: "Pending", value: "$2,140" },
                { label: "Refund", value: "1.8%" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="dashboard-mini-stat px-2 py-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.3, ease: EASE }}
                >
                  <p className="text-sm font-bold text-text">{s.value}</p>
                  <p className="text-[10px] text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </MotionCard>

        {/* Audience + revenue mix + ratings */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MotionCard className="p-3.5" delay={0.12}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="dashboard-section-title">Audience</h2>
              <Globe className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="space-y-2">
              {AUDIENCE.map((row, i) => (
                <motion.div
                  key={row.country}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: EASE }}
                >
                  <div className="mb-0.5 flex justify-between text-[11px]">
                    <span className="font-semibold text-text">{row.country}</span>
                    <span className="font-bold text-primary">{row.pct}%</span>
                  </div>
                  <AnimatedProgress value={row.pct} color="bg-primary" delay={0.1 + i * 0.05} />
                </motion.div>
              ))}
            </div>
          </MotionCard>

          <MotionCard className="p-3.5" delay={0.14}>
            <h2 className="dashboard-section-title mb-2">Revenue mix</h2>
            <div className="space-y-2">
              {REVENUE_MIX.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: EASE }}
                >
                  <div className="mb-0.5 flex justify-between text-[11px]">
                    <span className="font-semibold text-text">{row.label}</span>
                    <span className="font-bold text-primary">{row.pct}%</span>
                  </div>
                  <AnimatedProgress value={row.pct} color={row.color} delay={0.1 + i * 0.05} />
                </motion.div>
              ))}
            </div>
          </MotionCard>

          <MotionCard className="p-3.5 text-center md:col-span-2 xl:col-span-1" delay={0.16}>
            <h2 className="dashboard-section-title mb-0.5">Ratings</h2>
            <p className="text-[10px] text-muted">{snapshot.newReviews}+ reviews</p>
            <motion.p
              className="mt-2 text-4xl font-black text-text"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 20 }}
            >
              {snapshot.rating}
            </motion.p>
            <div className="mt-2 flex justify-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
              ))}
            </div>
          </MotionCard>
        </div>

        {/* Payout history — compact from revenue section */}
        <MotionCard className="overflow-hidden p-0" delay={0.18} hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
            <div>
              <h2 className="dashboard-section-title">Recent payouts</h2>
              <p className="text-[10px] text-muted">Last 3 transactions</p>
            </div>
            <button type="button" className="dashboard-header-btn dashboard-header-btn-outline !h-8 !px-2.5 text-[11px]">
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
          <div className="divide-y divide-border">
            {PAYOUTS.map((row, i) => (
              <motion.div
                key={row.id}
                className="flex items-center justify-between gap-2 px-3.5 py-2.5"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: EASE }}
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text">{row.date}</p>
                  <p className="truncate text-[10px] text-muted">{row.id}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-success">{row.amount}</p>
                  <span className={`text-[9px] font-bold uppercase ${row.status === "Paid" ? "text-success" : "text-warning"}`}>
                    {row.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </MotionCard>
      </motion.div>

      {/*
        Revenue tab section — commented out; key widgets merged above.
        <AnimatePresence mode="wait">
          {tab === "revenue" && (
            ... balance card, payment method, monthly revenue chart ...
          )}
        </AnimatePresence>
      */}
    </motion.div>
  );
}
