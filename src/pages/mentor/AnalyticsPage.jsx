import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BarChart2,
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
import { formatMentorCurrency } from "@/data/mentorDashboard";
import { fetchMentorStudents } from "@/lib/api/analyticsApi";
import useMentorDashboardData from "@/hooks/useMentorDashboardData";
import useAuthStore from "@/store/useAuthStore";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";

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

const REVENUE_MIX_COLORS = ["bg-primary", "bg-success", "bg-warning"];

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

function EmptyBlock({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Icon className="mb-2 h-8 w-8 text-muted opacity-40" />
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 max-w-[260px] text-[11px] text-muted">{desc}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const shouldReduceMotion = useReducedMotion();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const { loading, snapshot, reload } = useMentorDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [studentInsights, setStudentInsights] = useState(null);

  const loadInsights = useCallback(async () => {
    if (!user?.id || !token) {
      setStudentInsights(null);
      return;
    }
    try {
      const data = await fetchMentorStudents(user, token);
      setStudentInsights(data);
    } catch {
      setStudentInsights(null);
    }
  }, [user, token]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([reload(), loadInsights()]);
      setChartKey((k) => k + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [reload, loadInsights]);

  const hasActivity = snapshot.students > 0 || snapshot.courses > 0 || snapshot.revenue > 0;

  const enrollmentBars = useMemo(() => {
    const points = snapshot.chartData?.month?.length
      ? snapshot.chartData.month
      : snapshot.chartData?.week ?? [];
    if (!points.length) return [];
    const maxVal = Math.max(...points.map((p) => p.enrollments ?? 0), 1);
    return points.map((p) => ({
      label: p.label,
      value: p.enrollments ?? 0,
      height: Math.max(4, Math.round(((p.enrollments ?? 0) / maxVal) * 100)),
    }));
  }, [snapshot.chartData]);

  const topCourses = useMemo(() => {
    const list = snapshot.courseList ?? [];
    const total = snapshot.totalRevenue || list.reduce((sum, c) => sum + (c.revenue ?? 0), 0);
    return list.slice(0, 5).map((course) => ({
      name: course.name,
      revenue: course.revenue ?? 0,
      share: total > 0 ? Math.round(((course.revenue ?? 0) * 1000) / total) / 10 : 0,
    }));
  }, [snapshot.courseList, snapshot.totalRevenue]);

  const revenueMix = useMemo(() => {
    const mix = snapshot.revenueMix ?? [];
    if (!mix.length) return [];
    return mix.map((row, i) => ({
      label: row.name,
      pct: row.share ?? 0,
      color: REVENUE_MIX_COLORS[i % REVENUE_MIX_COLORS.length],
    }));
  }, [snapshot.revenueMix]);

  const audience = useMemo(() => {
    const regions = studentInsights?.topRegions ?? [];
    if (!regions.length) return [];
    const total = regions.reduce((sum, r) => sum + (r.students ?? 0), 0) || 1;
    return regions.map((r) => ({
      country: r.region,
      pct: Math.round(((r.students ?? 0) * 1000) / total) / 10,
    }));
  }, [studentInsights]);

  const conversionRate = useMemo(() => {
    if (!hasActivity || !snapshot.engagement) return "0%";
    return `${snapshot.engagement}%`;
  }, [hasActivity, snapshot.engagement]);

  const kpis = useMemo(
    () => [
      {
        title: "Course views",
        count: hasActivity ? snapshot.students.toLocaleString() : "0",
        subtitle: hasActivity ? `+${snapshot.weeklyGrowth}% this week` : "No views yet",
        icon: Eye,
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        accent: "dashboard-kpi-primary",
      },
      {
        title: "Conversion",
        count: conversionRate,
        subtitle: hasActivity ? "Based on engagement" : "No enrollments yet",
        icon: Activity,
        iconBg: "bg-success/10",
        iconColor: "text-success",
        accent: "dashboard-kpi-success",
      },
      {
        title: "Active students",
        count: snapshot.students.toLocaleString(),
        subtitle: `+${snapshot.weeklyGrowth}% weekly`,
        icon: Users,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
        accent: "dashboard-kpi-warning",
      },
      {
        title: "Monthly earnings",
        count: `$${snapshot.revenue.toLocaleString()}`,
        subtitle: hasActivity ? "From your courses" : "No earnings yet",
        icon: Wallet,
        iconBg: "bg-accent-soft",
        iconColor: "text-accent",
        accent: "dashboard-kpi-accent",
      },
    ],
    [snapshot, hasActivity, conversionRate]
  );

  if (loading) {
    return (
      <div className="dashboard-page mx-auto w-full max-w-[1320px]">
        <DashboardGridSkeleton />
      </div>
    );
  }

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
      <motion.div key={chartKey} variants={sectionVariants} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <MotionCard className="p-3.5 lg:col-span-3" delay={0.05} hover={false}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="dashboard-section-title">Enrollment trend</h2>
                <p className="text-[10px] text-muted">Recent activity</p>
              </div>
              <span className="dashboard-status-live text-[10px]">● Live</span>
            </div>
            {enrollmentBars.length ? (
              <div className="flex h-[168px] items-end justify-between gap-1.5 border-b border-border pb-6 sm:gap-2">
                {enrollmentBars.map((bar, i) => (
                  <div key={bar.label} className="group flex flex-1 flex-col items-center min-w-0">
                    <div className="relative flex h-[130px] w-full items-end justify-center">
                      <div className="absolute -top-7 z-10 hidden whitespace-nowrap rounded-md border border-border bg-surface px-1.5 py-0.5 text-[9px] font-bold text-text group-hover:block">
                        {bar.value.toLocaleString()}
                      </div>
                      <AnimatedBar height={bar.height} delay={0.08 + i * 0.06} className="bg-gradient-to-t from-primary to-accent" />
                    </div>
                    <span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-muted">{bar.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBlock
                icon={BarChart2}
                title="No enrollment data yet"
                desc="Publish courses and enroll students to see trends here."
              />
            )}
          </MotionCard>

          <MotionCard className="p-3.5 lg:col-span-2" delay={0.08}>
            <h2 className="dashboard-section-title mb-2">Top courses</h2>
            {topCourses.length ? (
              <div className="space-y-2.5">
                {topCourses.map((course, i) => (
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
            ) : (
              <EmptyBlock
                icon={TrendingUp}
                title="No course performance yet"
                desc="Your top earning courses will appear here."
              />
            )}
          </MotionCard>
        </div>

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
              <p className="mt-0.5 text-[10px] text-muted">
                {hasActivity ? "Earnings from your published courses" : "No payouts until you earn revenue"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:max-w-[360px] sm:flex-1">
              {[
                { label: "Lifetime", value: formatMentorCurrency(snapshot.totalRevenue) },
                { label: "Pending", value: "$0" },
                { label: "Courses", value: String(snapshot.courses) },
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MotionCard className="p-3.5" delay={0.12}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="dashboard-section-title">Audience</h2>
              <Globe className="h-3.5 w-3.5 text-primary" />
            </div>
            {audience.length ? (
              <div className="space-y-2">
                {audience.map((row, i) => (
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
            ) : (
              <EmptyBlock
                icon={Globe}
                title="No audience data yet"
                desc="Student geography will appear once learners enroll."
              />
            )}
          </MotionCard>

          <MotionCard className="p-3.5" delay={0.14}>
            <h2 className="dashboard-section-title mb-2">Revenue mix</h2>
            {revenueMix.length ? (
              <div className="space-y-2">
                {revenueMix.map((row, i) => (
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
            ) : (
              <EmptyBlock
                icon={DollarSign}
                title="No revenue breakdown yet"
                desc="Course revenue share will show here after sales."
              />
            )}
          </MotionCard>

          <MotionCard className="p-3.5 text-center md:col-span-2 xl:col-span-1" delay={0.16}>
            <h2 className="dashboard-section-title mb-0.5">Ratings</h2>
            <p className="text-[10px] text-muted">{snapshot.newReviews} reviews</p>
            <motion.p
              className="mt-2 text-4xl font-black text-text"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 20 }}
            >
              {snapshot.rating || 0}
            </motion.p>
            <div className="mt-2 flex justify-center gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.round(snapshot.rating) ? "fill-warning text-warning" : "text-border"}`}
                />
              ))}
            </div>
          </MotionCard>
        </div>

        <MotionCard className="overflow-hidden p-0" delay={0.18} hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
            <div>
              <h2 className="dashboard-section-title">Recent payouts</h2>
              <p className="text-[10px] text-muted">Transaction history</p>
            </div>
            <button
              type="button"
              disabled={!hasActivity}
              className="dashboard-header-btn dashboard-header-btn-outline !h-8 !px-2.5 text-[11px] disabled:opacity-50"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
          {hasActivity && snapshot.revenue > 0 ? (
            <div className="divide-y divide-border px-3.5 py-2.5">
              <p className="text-xs text-muted">Payout details will appear here once processed.</p>
            </div>
          ) : (
            <EmptyBlock
              icon={Wallet}
              title="No payouts yet"
              desc="Earn revenue from course sales to see payout history."
            />
          )}
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}
