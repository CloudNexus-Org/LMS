import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Users,
  DollarSign,
  BookOpen,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MessageSquare,
  Activity,
  Clock3,
  Sparkles,
  ChevronRight,
  Flame,
  BarChart2,
  Upload,
  RefreshCw,
  Video,
  PlayCircle,
  PieChart,
} from "lucide-react";
import {
  formatMentorCurrency,
} from "@/data/mentorDashboard";
import { toTopCoursesTable } from "@/lib/mentor/mentorMappers";
import useMentorDashboardData from "@/hooks/useMentorDashboardData";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";

const EASE = [0.16, 1, 0.3, 1];

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

const QUICK_ACTIONS = [
  { label: "Upload Course", icon: Upload, to: "/mentor/upload" },
  { label: "Manage Lessons", icon: BookOpen, to: "/mentor/lessons" },
  { label: "View Analytics", icon: BarChart2, to: "/mentor/analytics" },
];

const ACTION_ICONS = {
  message: MessageSquare,
  book: BookOpen,
  dollar: DollarSign,
};

const ACTIVITY_ICONS = {
  users: Users,
  message: MessageSquare,
  star: Star,
  flame: Flame,
};

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeDonutSegment(cx, cy, outerR, innerR, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, startAngle);
  const endInner = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function buildPieSegments(data) {
  let cursor = 0;
  return data.map((slice) => {
    const sweep = (slice.share / 100) * 360;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    return { ...slice, startAngle: start, endAngle: end };
  });
}

function MentorRevenuePieChart({ data, metric, chartKey, centerLabel, centerValue }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 88;
  const innerR = 54;
  const segments = useMemo(() => buildPieSegments(data), [data]);
  const active = activeId ? segments.find((s) => s.id === activeId) : null;

  if (!data?.length) {
    return (
      <div className="dashboard-pie-chart flex flex-1 flex-col items-center justify-center py-8 text-center">
        <PieChart className="mb-2 h-8 w-8 text-muted opacity-40" />
        <p className="text-sm font-semibold text-text">No course data yet</p>
        <p className="mt-1 max-w-[220px] text-[11px] text-muted">
          Publish courses and enroll students to see revenue and enrollment breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-pie-chart">
      <div className="dashboard-pie-chart-visual">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="dashboard-pie-chart-svg"
          role="img"
          aria-label={`Course ${metric} distribution pie chart`}
        >
          {segments.map((slice, i) => (
            <motion.path
              key={`${slice.id}-${chartKey}`}
              d={describeDonutSegment(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              className="dashboard-pie-chart-segment"
              initial={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.82 }
              }
              animate={{
                opacity: activeId && activeId !== slice.id ? 0.45 : 1,
                scale: activeId === slice.id ? 1.04 : 1,
              }}
              transition={{
                opacity: { duration: 0.2 },
                scale: { type: "spring", stiffness: 320, damping: 22 },
                delay: shouldReduceMotion ? 0 : 0.08 + i * 0.07,
                duration: 0.45,
                ease: EASE,
              }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              onMouseEnter={() => setActiveId(slice.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(slice.id)}
              onBlur={() => setActiveId(null)}
              tabIndex={0}
            />
          ))}
          <circle cx={cx} cy={cy} r={innerR - 1} className="dashboard-pie-chart-hole" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="dashboard-pie-chart-center-value">
            {active ? `${active.share}%` : centerValue}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" className="dashboard-pie-chart-center-label">
            {active ? active.name.split(" ").slice(0, 2).join(" ") : centerLabel}
          </text>
        </svg>
      </div>

      <ul className="dashboard-pie-chart-legend">
        {segments.map((slice, i) => (
          <motion.li
            key={slice.id}
            className={`dashboard-pie-chart-legend-row ${activeId === slice.id ? "dashboard-pie-chart-legend-row-active" : ""}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease: EASE }}
            onMouseEnter={() => setActiveId(slice.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <span className="dashboard-pie-chart-swatch" style={{ background: slice.color }} />
            <span className="dashboard-pie-chart-legend-name">{slice.name}</span>
            <span className="dashboard-pie-chart-legend-value">
              {metric === "revenue" ? formatMentorCurrency(slice.value) : slice.value.toLocaleString()}
            </span>
            <span className="dashboard-pie-chart-legend-share">{slice.share}%</span>
          </motion.li>
        ))}
      </ul>
    </div>
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

function MentorEngagementLineChart({ data, animate = true }) {
  const shouldReduceMotion = useReducedMotion();

  if (!data?.length || data.length < 2) {
    return (
      <div className="dashboard-line-chart flex min-h-[200px] flex-col items-center justify-center py-8 text-center">
        <Activity className="mb-2 h-8 w-8 text-muted opacity-40" />
        <p className="text-sm font-semibold text-text">No engagement data yet</p>
        <p className="mt-1 max-w-[280px] text-[11px] text-muted">
          Enrollments and watch hours will appear here once students start learning.
        </p>
      </div>
    );
  }

  const width = 640;
  const height = 200;
  const pad = { top: 28, right: 52, bottom: 32, left: 8 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const baseline = pad.top + chartH;

  const enrollments = data.map((d) => d.enrollments);
  const watchHours = data.map((d) => d.watchHours);
  const max = Math.max(...enrollments, ...watchHours, 1);
  const min = Math.min(...enrollments, ...watchHours, 0);
  const range = max - min || 1;

  const toCoords = (values) =>
    values.map((v, i) => ({
      x: pad.left + (i / (values.length - 1)) * chartW,
      y: pad.top + chartH - ((v - min) / range) * chartH,
    }));

  const enrollmentCoords = toCoords(enrollments);
  const watchCoords = toCoords(watchHours);
  const enrollmentPath = buildSmoothPath(enrollmentCoords);
  const watchPath = buildSmoothPath(watchCoords);
  const enrollmentArea = buildAreaPath(enrollmentCoords, baseline);

  const lastEnrollments = enrollments[enrollments.length - 1];
  const lastWatch = watchHours[watchHours.length - 1];
  const totalEnrollments = enrollments.reduce((sum, v) => sum + v, 0);
  const totalWatch = watchHours.reduce((sum, v) => sum + v, 0);
  const enrollmentGrowth =
    enrollments.length > 1
      ? (((lastEnrollments - enrollments[0]) / enrollments[0]) * 100).toFixed(1)
      : "0.0";
  const watchGrowth =
    watchHours.length > 1
      ? (((lastWatch - watchHours[0]) / watchHours[0]) * 100).toFixed(1)
      : "0.0";

  const gridLines = 4;
  const pathTransition = shouldReduceMotion || !animate
    ? { duration: 0 }
    : { duration: 1.1, ease: EASE };

  return (
    <div className="dashboard-line-chart -mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="dashboard-line-chart-svg min-w-[280px] w-full"
        role="img"
        aria-label="Student engagement line chart"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="mentor-eng-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="55%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--success)" />
          </linearGradient>
          <linearGradient id="mentor-eng-fill" x1="0%" y1="0%" x2="0%" y2="100%">
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

        <motion.path
          d={enrollmentArea}
          fill="url(#mentor-eng-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        />
        <motion.path
          d={watchPath}
          className="dashboard-line-chart-payouts"
          fill="none"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ ...pathTransition, delay: 0.2 }}
        />
        <motion.path
          d={enrollmentPath}
          className="dashboard-line-chart-sales"
          stroke="url(#mentor-eng-stroke)"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={pathTransition}
        />

        {enrollmentCoords.map((pt, i) => (
          <motion.circle
            key={`enrollment-${data[i].label}`}
            cx={pt.x}
            cy={pt.y}
            r={i === enrollmentCoords.length - 1 ? 4.5 : 2.5}
            className={
              i === enrollmentCoords.length - 1
                ? "dashboard-line-chart-dot-sales"
                : "dashboard-line-chart-dot"
            }
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.06, duration: 0.35, ease: EASE }}
          />
        ))}

        {watchCoords.map((pt, i) => (
          <motion.circle
            key={`watch-${data[i].label}`}
            cx={pt.x}
            cy={pt.y}
            r={i === watchCoords.length - 1 ? 4 : 2}
            className={
              i === watchCoords.length - 1
                ? "dashboard-line-chart-dot-payouts"
                : "dashboard-line-chart-dot-muted"
            }
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45 + i * 0.06, duration: 0.35, ease: EASE }}
          />
        ))}

        <text
          x={enrollmentCoords[enrollmentCoords.length - 1].x + 8}
          y={enrollmentCoords[enrollmentCoords.length - 1].y + 4}
          className="dashboard-line-chart-label-sales"
        >
          {lastEnrollments}
        </text>
        <text
          x={watchCoords[watchCoords.length - 1].x + 8}
          y={watchCoords[watchCoords.length - 1].y + 4}
          className="dashboard-line-chart-label-payouts"
        >
          {lastWatch}h
        </text>

        {data.map((d, i) => (
          <text
            key={d.label}
            x={enrollmentCoords[i].x}
            y={height - 8}
            textAnchor="middle"
            className="dashboard-line-chart-axis"
          >
            {d.label}
          </text>
        ))}
      </svg>

      <motion.div
        className="dashboard-line-chart-summary grid-cols-1 sm:grid-cols-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
      >
        <div className="dashboard-line-chart-stat">
          <div className="dashboard-line-chart-stat-head">
            <span className="dashboard-line-chart-marker dashboard-line-chart-marker-sales" />
            <span className="dashboard-line-chart-stat-label">Enrollments</span>
          </div>
          <p className="dashboard-line-chart-stat-value">{totalEnrollments}</p>
          <p className="dashboard-line-chart-stat-change dashboard-line-chart-stat-change-up">
            +{enrollmentGrowth}% <span className="text-muted">vs start</span>
          </p>
        </div>
        <div className="dashboard-line-chart-stat">
          <div className="dashboard-line-chart-stat-head">
            <span className="dashboard-line-chart-marker dashboard-line-chart-marker-payouts" />
            <span className="dashboard-line-chart-stat-label">Watch hours</span>
          </div>
          <p className="dashboard-line-chart-stat-value">{totalWatch}h</p>
          <p className="dashboard-line-chart-stat-change dashboard-line-chart-stat-change-up">
            +{watchGrowth}% <span className="text-muted">vs start</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function formatLastUpdated(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function MotionCard({ className = "", children, delay = 0, hover = true }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      whileHover={
        hover && !shouldReduceMotion
          ? { y: -3, transition: { duration: 0.2 } }
          : undefined
      }
      className={`dashboard-card ${className}`}
    >
      {children}
    </motion.div>
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
        transition={{ duration: 0.85, ease: EASE, delay }}
      />
    </div>
  );
}

function MiniSparkline({ data }) {
  const shouldReduceMotion = useReducedMotion();
  const w = 88;
  const h = 28;
  const safe = (data?.length ? data : [0]).map((v) => Number(v) || 0);
  const max = Math.max(...safe, 1);
  const min = Math.min(...safe, 0);
  const range = max - min || 1;
  const points = safe
    .map((v, i) => {
      const x = safe.length > 1 ? (i / (safe.length - 1)) * w : w / 2;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="dashboard-sparkline w-full max-w-[88px]" aria-hidden>
      <motion.polyline
        points={points}
        className="dashboard-sparkline-line"
        fill="none"
        initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </svg>
  );
}

export default function MentorDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const { loading, snapshot, reload, displayName, lastUpdated } = useMentorDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartTab, setChartTab] = useState("week");
  const [pieTab, setPieTab] = useState("revenue");
  const [chartKey, setChartKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await reload();
      setChartKey((key) => key + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [reload]);

  const topCourses = useMemo(
    () => (snapshot.courseList ? toTopCoursesTable(snapshot.courseList) : []),
    [snapshot.courseList]
  );

  const pieData = pieTab === "revenue" ? snapshot.revenueMix ?? [] : snapshot.enrollmentMix ?? [];
  const pieCenterValue =
    pieTab === "revenue"
      ? formatMentorCurrency(snapshot.totalRevenue)
      : snapshot.totalStudents?.toLocaleString() ?? "0";

  const courseProgress = snapshot.courseProgress ?? [];
  const avgCompletion = snapshot.avgCompletion ?? 0;
  const actionItems = snapshot.actionItems ?? [];
  const activities = snapshot.activities ?? [];
  const recentEnrollments = snapshot.recentEnrollments ?? [];
  const upcomingSessions = snapshot.upcomingSessions ?? [];

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

  if (loading) {
    return (
      <div className="dashboard-page mx-auto w-full max-w-[1320px]">
        <DashboardGridSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4 pb-2"
      variants={shouldReduceMotion ? undefined : pageVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
    >
      {/* Analytics header */}
      <motion.section variants={sectionVariants} className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro min-w-0">
          <motion.span
            className="dashboard-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Sparkles className="h-3 w-3" />
            Mentor hub
          </motion.span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Welcome back, <span className="text-primary">{displayName}</span>
          </p>
          <p className="dashboard-greeting-sub">
            Track students, revenue, and course performance from one place.
          </p>
        </div>

        <div className="dashboard-analytics-metrics min-w-0">
          <motion.div
            className="dashboard-analytics-metric"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          >
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="dashboard-metric-value">+{snapshot.weeklyGrowth}%</p>
              <p className="dashboard-metric-label">Weekly growth</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-analytics-metric"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          >
            <Activity className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="dashboard-metric-value">{snapshot.engagement}%</p>
              <p className="dashboard-metric-label">Engagement</p>
            </div>
          </motion.div>
          <motion.div
            className="dashboard-analytics-chart col-span-2 sm:col-span-1"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          >
            <p className="dashboard-metric-label mb-1">Student trend</p>
            <MiniSparkline data={snapshot.trend} />
          </motion.div>
        </div>

        <div className="dashboard-analytics-status w-full lg:w-auto">
          <p className="w-full text-center text-[11px] text-muted sm:w-auto sm:text-left lg:text-right">
            Updated {formatLastUpdated(lastUpdated)}
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <motion.button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="dashboard-header-btn dashboard-header-btn-outline w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </motion.button>
            <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                to="/mentor/upload"
                className="dashboard-header-btn dashboard-header-btn-primary w-full sm:w-auto"
              >
                <Upload className="h-3.5 w-3.5" />
                Create Course
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* KPI cards */}
      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
      >
        {kpis.map((item, index) => {
          const Icon = item.icon;
          return (
            <MotionCard
              key={item.title}
              delay={index * 0.05}
              className={`dashboard-kpi-card p-3.5 ${item.accent}`}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  whileHover={shouldReduceMotion ? undefined : { rotate: 4, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold leading-none text-text sm:text-xl">{item.count}</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    {item.title}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted">{item.subtitle}</p>
            </MotionCard>
          );
        })}
      </motion.section>

      {/* Main widgets */}
      <motion.section variants={sectionVariants} className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <MotionCard className="flex h-full flex-col p-4" delay={0.05}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Teaching Actions</h2>
            <PlayCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: EASE }}
                >
                  <Link to={action.to} className="dashboard-action-btn group justify-center">
                  <div className="flex min-w-0 items-center justify-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate text-xs font-semibold text-text">{action.label}</span>
                  </div>
                </Link>
                </motion.div>
              );
            })}
          </div>
        </MotionCard>

        <MotionCard className="flex h-full flex-col p-4" delay={0.1}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Course Completion</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3.5">
            {courseProgress.length ? courseProgress.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.35, ease: EASE }}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-text">{course.title}</p>
                  <span className="shrink-0 text-[11px] font-bold text-muted">{course.value}%</span>
                </div>
                <AnimatedProgress value={course.value} color={course.color} delay={0.15 + i * 0.08} />
              </motion.div>
            )) : (
              <p className="text-xs text-muted">No student progress yet. Enrollments will appear here.</p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{avgCompletion}%</p>
              <p className="text-[11px] text-muted">Avg. completion</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.pendingQa}</p>
              <p className="text-[11px] text-muted">Pending Q&amp;A</p>
            </div>
          </div>
        </MotionCard>

        <MotionCard className="flex h-full flex-col p-4 lg:col-span-2 xl:col-span-1" delay={0.15}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Recent Activity</h2>
            <Clock3 className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {activities.length ? activities.map((item, i) => {
              const Icon = ACTIVITY_ICONS[item.icon] || Users;
              return (
                <motion.div
                  key={`${item.title}-${i}`}
                  className="dashboard-recent-row"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: EASE }}
                  whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-text">{item.title}</p>
                    <p className="text-[11px] text-muted">{item.desc}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted">{item.time}</span>
                </motion.div>
              );
            }) : (
              <p className="text-xs text-muted">No recent activity yet.</p>
            )}
          </div>
        </MotionCard>
      </motion.section>

      {/* Engagement line chart + course mix pie chart */}
      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
      >
        <MotionCard className="flex min-h-0 flex-col p-4 lg:col-span-3" delay={0.05} hover={false}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Student Engagement</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Enrollments vs watch hours across your courses
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <span className="dashboard-status-live whitespace-nowrap">● Live data</span>
              <div className="dashboard-chart-tabs w-full sm:w-auto">
                {["week", "month"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChartTab(t)}
                    className={`dashboard-chart-tab flex-1 capitalize sm:flex-none ${chartTab === t ? "dashboard-chart-tab-active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-3">
            <span className="dashboard-chart-legend dashboard-chart-legend-primary">Enrollments</span>
            <span className="dashboard-chart-legend dashboard-chart-legend-success">Watch hours</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${chartTab}-${chartKey}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <MentorEngagementLineChart
                key={chartKey}
                data={snapshot.chartData?.[chartTab] ?? []}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.newReviews}</p>
              <p className="text-[11px] text-muted">New reviews</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.completionRate ?? avgCompletion}%</p>
              <p className="text-[11px] text-muted">Completion rate</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.avgWatchHours ?? 0}h</p>
              <p className="text-[11px] text-muted">Avg. watch time</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{snapshot.students.toLocaleString()}</p>
              <p className="text-[11px] text-muted">Total students</p>
            </div>
          </div>
        </MotionCard>

        <MotionCard className="flex min-h-0 flex-col p-4 lg:col-span-2" delay={0.1} hover={false}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Course Mix</h2>
              <p className="mt-0.5 text-[11px] text-muted">Share by course performance</p>
            </div>
            <PieChart className="h-4 w-4 shrink-0 text-primary" />
          </div>

          <div className="dashboard-chart-tabs mb-3 w-full">
            {[
              { id: "revenue", label: "Revenue" },
              { id: "students", label: "Students" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPieTab(tab.id)}
                className={`dashboard-chart-tab flex-1 ${pieTab === tab.id ? "dashboard-chart-tab-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${pieTab}-${chartKey}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-1 flex-col"
            >
              <MentorRevenuePieChart
                data={pieData}
                metric={pieTab}
                chartKey={chartKey}
                centerLabel={pieTab === "revenue" ? "Total revenue" : "Total students"}
                centerValue={pieCenterValue}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {pieTab === "revenue" ? "Gross revenue" : "Active learners"}
              </p>
              <p className="text-base font-bold text-text">{pieCenterValue}</p>
            </div>
            <Link
              to="/mentor/analytics"
              className="dashboard-admin-btn dashboard-admin-btn-outline shrink-0"
            >
              Analytics
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </MotionCard>
      </motion.section>

      {/* Action items */}
      <motion.section variants={sectionVariants} className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <MotionCard className="flex h-full flex-col p-4 xl:col-span-2" delay={0.05} hover={false}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="dashboard-section-title">Action Items</h2>
            <span className="dashboard-trend dashboard-trend-down">{actionItems.length} pending</span>
          </div>
          <div className="space-y-2">
            {actionItems.length ? actionItems.map((item, i) => {
              const Icon = ACTION_ICONS[item.icon] || MessageSquare;
              return (
                <motion.div
                  key={item.title}
                  className="dashboard-recent-row flex-col gap-3 sm:flex-row sm:items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.35, ease: EASE }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-text">{item.title}</p>
                      <p className="text-[11px] text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <Link
                    to={item.action.to}
                    className={`dashboard-admin-btn dashboard-admin-btn-${item.action.variant} w-full shrink-0 sm:w-auto`}
                  >
                    {item.action.label}
                  </Link>
                </motion.div>
              );
            }) : (
              <p className="text-xs text-muted">You&apos;re all caught up — no pending actions.</p>
            )}
          </div>
        </MotionCard>

        <MotionCard className="overflow-hidden" delay={0.1}>
          <div className="border-b border-border p-4">
            <h2 className="dashboard-section-title">Recent Enrollments</h2>
            <p className="mt-0.5 text-[11px] text-muted">Latest students who joined</p>
          </div>
          <div className="divide-y divide-border">
            {recentEnrollments.length ? recentEnrollments.map((row, i) => (
              <motion.div
                key={`${row.name}-${row.time}`}
                className="flex items-center gap-3 p-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: EASE }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                  {row.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-text">{row.name}</p>
                  <p className="truncate text-[11px] text-muted">{row.course}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-success">{row.amount}</p>
                  <p className="text-[10px] text-muted">{row.time}</p>
                </div>
              </motion.div>
            )) : (
              <div className="p-6 text-center text-xs text-muted">No enrollments yet.</div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <Link
              to="/mentor/students"
              className="flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all students <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </MotionCard>
      </motion.section>

      {/* Upcoming sessions */}
      <motion.section variants={sectionVariants}>
        <h2 className="dashboard-section-title mb-3">Upcoming Sessions</h2>
        {upcomingSessions.length ? (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4">
          {upcomingSessions.map((item, i) => (
            <MotionCard
              key={item.title}
              delay={0.05 + i * 0.05}
              className="group min-w-[220px] shrink-0 snap-start p-4 transition-colors duration-200 hover:border-primary/25 sm:min-w-0"
            >
              <div className="flex items-center gap-2 text-primary">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Video className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]">{item.date}</p>
              </div>
              <h3 className="mt-3 text-sm font-bold leading-snug text-text">{item.title}</h3>
              <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
            </MotionCard>
          ))}
        </div>
        ) : (
          <p className="dashboard-card p-4 text-sm text-muted">No scheduled sessions. Live sessions can be added from your calendar.</p>
        )}
      </motion.section>

      {/* Top courses table */}
      <MotionCard className="overflow-hidden" delay={0.08} hover={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h2 className="dashboard-section-title">Top Performing Courses</h2>
            <p className="mt-0.5 text-[11px] text-muted">By enrollment &amp; revenue</p>
          </div>
          <Link
            to="/mentor/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View analytics <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:px-0">
          <table className="dashboard-table w-full min-w-[520px] text-sm">
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
              {topCourses.length ? topCourses.map((course, i) => (
                <motion.tr
                  key={course.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: EASE }}
                >
                  <td className="text-muted">{i + 1}</td>
                  <td>
                    <p className="max-w-[180px] truncate font-semibold text-text sm:max-w-none">{course.name}</p>
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
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted">
                    No published courses yet. Upload a course to see performance here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </MotionCard>
    </motion.div>
  );
}
