import { Link } from "react-router-dom";
import {
  Sparkles,
  Activity,
  CheckCircle2,
  Clock3,
  BookOpen,
  Trophy,
  FileText,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { getContinueLearningUrl, getResumeUrlForTrack } from "@/features/learn/learningSession";
import useStudentDashboardData from "@/hooks/useStudentDashboardData";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";

const STAT_ICONS = [BookOpen, CheckCircle2, FileText, Trophy];
const STAT_ACCENTS = [
  "dashboard-kpi-primary",
  "dashboard-kpi-success",
  "dashboard-kpi-warning",
  "dashboard-kpi-accent",
];
const STAT_ICON_BG = [
  "bg-primary/10 text-primary",
  "bg-success/10 text-success",
  "bg-warning/10 text-warning",
  "bg-accent-soft text-accent",
];

const LEARNING_ACTIONS = [
  { label: "Continue Course", getTo: getContinueLearningUrl },
  { label: "Browse Courses", to: "/student/catalog" },
  { label: "Submit Assignment", to: "/student/assignments" },
  { label: "View Certificates", to: "/student/certificates" },
];

function Card({ className = "", children }) {
  return <div className={`dashboard-card ${className}`}>{children}</div>;
}

function MiniSparkline({ data }) {
  const w = 88;
  const h = 28;
  const safe = data?.length ? data : [0];
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
    <svg viewBox={`0 0 ${w} ${h}`} className="dashboard-sparkline" aria-hidden>
      <polyline points={points} className="dashboard-sparkline-line" />
    </svg>
  );
}

export default function StudentDashboardPage() {
  const {
    loading,
    enrollments,
    stats,
    courseProgress,
    recentLearning,
    resumeSession,
    displayName,
  } = useStudentDashboardData();

  if (loading) {
    return (
      <div className="dashboard-page mx-auto w-full max-w-[1320px]">
        <DashboardGridSkeleton />
      </div>
    );
  }

  const statCards = stats
    ? [
        { title: "Courses", count: stats.courses.count, subtitle: stats.courses.subtitle },
        { title: "Lessons", count: stats.lessons.count, subtitle: stats.lessons.subtitle },
        { title: "In progress", count: stats.tasks.count, subtitle: stats.tasks.subtitle },
        { title: "Completed", count: stats.badges.count, subtitle: stats.badges.subtitle },
      ]
    : [];

  const avgProgress = stats?.avgProgress ?? 0;
  const studyHours = stats?.studyHours ?? "0";
  const studyTrend = stats?.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0];
  const continueUrl = resumeSession?.trackId
    ? getResumeUrlForTrack(resumeSession.trackId)
    : getContinueLearningUrl();

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      <section className="dashboard-analytics-bar">
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Good afternoon
          </span>
          <p className="dashboard-greeting">
            Welcome back, <span className="text-primary">{displayName}</span>
          </p>
          <p className="dashboard-greeting-sub">
            {enrollments.length
              ? "Track progress, assignments, and classes from one place."
              : "Enroll in a course to start your learning journey."}
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
              <p className="dashboard-metric-value">{studyHours}</p>
              <p className="dashboard-metric-label">Study hours</p>
            </div>
          </div>
          <div className="dashboard-analytics-chart">
            <p className="dashboard-metric-label mb-1">Weekly trend</p>
            <MiniSparkline data={studyTrend} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {statCards.map((item, i) => {
          const Icon = STAT_ICONS[i];
          return (
            <Card key={item.title} className={`dashboard-kpi-card p-3.5 ${STAT_ACCENTS[i]}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${STAT_ICON_BG[i]}`}
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

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Learning Actions</h2>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {LEARNING_ACTIONS.map((action, idx) => (
              <Link
                key={action.label}
                to={
                  idx === 0
                    ? continueUrl
                    : action.getTo
                      ? action.getTo()
                      : action.to
                }
                className="dashboard-action-btn group justify-center"
              >
                <div className="flex min-w-0 items-center justify-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PlayCircle className="h-4 w-4" />
                  </div>
                  <span className="truncate text-xs font-semibold text-text">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Course Progress</h2>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          {courseProgress.length ? (
            <div className="space-y-3.5">
              {courseProgress.map((course) => (
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
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm font-semibold text-text">No courses yet</p>
              <p className="mt-1 text-xs text-muted">
                Browse the catalog and enroll to see progress here.
              </p>
              <Link
                to="/student/catalog"
                className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
              >
                Browse courses
              </Link>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{studyHours}</p>
              <p className="text-[11px] text-muted">Hours</p>
            </div>
            <div className="dashboard-mini-stat">
              <p className="text-lg font-bold text-text">{stats?.totalModules ?? 0}</p>
              <p className="text-[11px] text-muted">Modules</p>
            </div>
          </div>
        </Card>

        <Card className="flex h-full flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="dashboard-section-title">Recent Learning</h2>
            <Clock3 className="h-4 w-4 text-primary" />
          </div>
          {recentLearning.length ? (
            <div className="space-y-2">
              {recentLearning.map((item) => (
                <Link
                  key={item.id}
                  to={item.trackId ? getResumeUrlForTrack(item.trackId) : "/student/courses"}
                  className="dashboard-recent-row block transition-colors hover:bg-primary/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-text">{item.title}</p>
                    <p className="text-[11px] text-muted">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted">
                    {item.progress}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm font-semibold text-text">Nothing yet</p>
              <p className="mt-1 text-xs text-muted">Your enrolled courses will appear here.</p>
              <Link
                to="/student/courses"
                className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
              >
                My courses
              </Link>
            </div>
          )}
        </Card>
      </section>

      {!enrollments.length ? (
        <section>
          <Card className="p-6 text-center">
            <p className="text-sm font-semibold text-text">Get started with your first course</p>
            <p className="mt-1 text-xs text-muted">
              Purchase or enroll in a track — your dashboard, quizzes, and assignments will reflect
              only what you own.
            </p>
            <Link
              to="/student/catalog"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Explore catalog
            </Link>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
