import { useMemo, useState } from "react";
import {
  csvFilename,
  downloadMultiSectionCsv,
} from "@/lib/exportCsv";
import {
  Download,
  Users,
  DollarSign,
  BookOpen,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Award,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import useAdminReportsData from "@/hooks/useAdminReportsData";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";

const KPI_BASE = {
  revenue: 428.5,
  users: 12482,
  courses: 284,
  completion: 63,
};

const TOP_COURSES = [
  {
    rank: 1,
    name: "AWS Cloud Architect Pro",
    mentor: "Sarah Chen",
    students: 2840,
    revenue: "$28,400",
    rating: 4.9,
    growth: "+22%",
    up: true,
  },
  {
    rank: 2,
    name: "Kubernetes & DevOps Mastery",
    mentor: "Liam Carter",
    students: 2210,
    revenue: "$22,100",
    rating: 4.8,
    growth: "+18%",
    up: true,
  },
  {
    rank: 3,
    name: "React & Next.js Complete",
    mentor: "Priya Nair",
    students: 1985,
    revenue: "$19,850",
    rating: 4.7,
    growth: "+15%",
    up: true,
  },
  {
    rank: 4,
    name: "Python for Data Science",
    mentor: "Omar Hassan",
    students: 1740,
    revenue: "$17,400",
    rating: 4.6,
    growth: "-3%",
    up: false,
  },
  {
    rank: 5,
    name: "System Design at Scale",
    mentor: "Yuki Tanaka",
    students: 1320,
    revenue: "$13,200",
    rating: 4.8,
    growth: "+12%",
    up: true,
  },
];

const TOP_MENTORS = [
  {
    name: "Sarah Chen",
    courses: 4,
    students: 5840,
    revenue: "$58,400",
    rating: 4.9,
    avatar: "SC",
    grad: "from-blue-500 to-cyan-400",
  },
  {
    name: "Liam Carter",
    courses: 3,
    students: 4210,
    revenue: "$42,100",
    rating: 4.8,
    avatar: "LC",
    grad: "from-violet-500 to-fuchsia-400",
  },
  {
    name: "Priya Nair",
    courses: 5,
    students: 3985,
    revenue: "$39,850",
    rating: 4.7,
    avatar: "PN",
    grad: "from-emerald-500 to-lime-400",
  },
];

const CATEGORIES = [
  { name: "Cloud & DevOps", share: 45, color: "bg-primary", text: "text-primary" },
  { name: "Frontend Engineering", share: 30, color: "bg-success", text: "text-success" },
  { name: "Backend & Systems", share: 15, color: "bg-warning", text: "text-warning" },
  { name: "Data & AI", share: 10, color: "bg-accent", text: "text-accent" },
];

const GEO_DATA = [
  { region: "North America", pct: 42, color: "bg-primary" },
  { region: "Europe", pct: 28, color: "bg-accent" },
  { region: "Asia Pacific", pct: 20, color: "bg-success" },
  { region: "Rest of World", pct: 10, color: "bg-warning" },
];

const PERIOD_MULTIPLIER = { month: 0.18, quarter: 0.42, year: 1 };

export default function AdminReportsPage() {
  const { loading, snapshot } = useAdminReportsData();
  const [period, setPeriod] = useState("year");
  const [search, setSearch] = useState("");

  const kpiBase = {
    revenue: snapshot.revenue || 0,
    users: snapshot.users || 0,
    courses: snapshot.courses || 0,
    completion: snapshot.completion || 0,
  };

  const topCoursesData = snapshot.topCourses || [];
  const topMentorsData = (snapshot.topMentors || []).map((m, i) => ({
    ...m,
    avatar: (m.name || "M").slice(0, 2).toUpperCase(),
    grad: TOP_MENTORS[i % TOP_MENTORS.length]?.grad || "from-blue-500 to-cyan-400",
    revenue: m.revenue || "—",
    courses: m.courses ?? 0,
    trackLabel: m.trackLabel || "—",
  }));
  const categoriesData = snapshot.categories?.length ? snapshot.categories : [];
  const geographyData = snapshot.geography?.length ? snapshot.geography : [];

  const multiplier = PERIOD_MULTIPLIER[period];

  const stats = useMemo(
    () => [
      {
        label: "Total revenue",
        value: `$${(kpiBase.revenue * multiplier).toFixed(1)}k`,
        meta: snapshot.revenueReport?.length
          ? `${snapshot.revenueReport.length} days tracked`
          : "From analytics API",
        metaTone: "success",
        icon: DollarSign,
        iconColor: "text-success",
      },
      {
        label: "New users",
        value: Math.round(kpiBase.users * multiplier).toLocaleString(),
        meta: `${kpiBase.users.toLocaleString()} in directory`,
        metaTone: "success",
        icon: Users,
        iconColor: "text-primary",
      },
      {
        label: "Courses published",
        value: Math.round(kpiBase.courses * multiplier),
        meta: snapshot.coursesPublishedMeta
          ? `${snapshot.coursesPublishedMeta} enrollments (30d)`
          : "Published in catalog",
        metaTone: "muted",
        icon: BookOpen,
        iconColor: "text-accent",
      },
      {
        label: "Avg completion",
        value: `${kpiBase.completion}%`,
        meta: kpiBase.completion > 0 ? "From course metrics" : "No completion data yet",
        metaTone: "success",
        icon: Award,
        iconColor: "text-warning",
      },
    ],
    [multiplier, kpiBase]
  );

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase();
    return topCoursesData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || (c.mentor || "").toLowerCase().includes(q)
    );
  }, [search, topCoursesData]);

  if (loading) {
    return (
      <div className="dashboard-page mx-auto w-full max-w-[1320px]">
        <DashboardGridSkeleton cards={6} />
      </div>
    );
  }

  const handleExport = () => {
    downloadMultiSectionCsv(csvFilename(`reports-${period}`), [
      {
        title: `Platform Reports — ${period}`,
        headers: ["Metric", "Value", "Trend"],
        rows: stats.map((s) => [s.label, s.value, s.meta]),
      },
      {
        title: "Top Categories",
        headers: ["Category", "Share %"],
        rows: CATEGORIES.map((c) => [c.name, c.share]),
      },
      {
        title: "User Geography",
        headers: ["Region", "Share %"],
        rows: GEO_DATA.map((g) => [g.region, g.pct]),
      },
      {
        title: "Top Performing Courses",
        headers: ["Rank", "Course", "Mentor", "Students", "Rating", "Revenue", "Growth"],
        rows: topCoursesData.map((c) => [
          c.rank,
          c.name,
          c.mentor,
          c.students,
          c.rating,
          c.revenue,
          c.growth,
        ]),
      },
      {
        title: "Top Mentors",
        headers: ["Mentor", "Courses", "Students", "Revenue", "Rating"],
        rows: topMentorsData.map((m) => [
          m.name,
          m.courses,
          m.students,
          m.revenue,
          m.rating,
        ]),
      },
    ]);
  };

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
            Platform Reports
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Detailed insights into platform growth, user engagement, and revenue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="admin-filter-tabs rounded-[5px] border border-border bg-bg p-1">
            {[
              { key: "month", label: "Month" },
              { key: "quarter", label: "Quarter" },
              { key: "year", label: "Year" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`admin-filter-tab ${period === p.key ? "admin-filter-tab-active" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <section className="admin-stat-strip" aria-label="Platform report summary">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-cell">
              <div className={`admin-stat-icon ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-label">{stat.label}</p>
                <p
                  className={`admin-stat-meta ${
                    stat.metaTone === "muted" ? "admin-stat-meta-muted" : ""
                  }`}
                >
                  {stat.meta}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="dashboard-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="dashboard-section-title">Top Categories</h2>
              <p className="mt-0.5 text-[11px] text-muted">Enrollment share by track</p>
            </div>
            <BookOpen className="h-4 w-4 text-muted" />
          </div>
          <div className="space-y-4">
            {categoriesData.length === 0 ? (
              <p className="text-sm text-muted">No category data from approvals yet.</p>
            ) : (
            categoriesData.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-xs font-bold text-text">{cat.name}</span>
                  <span className={`text-xs font-bold ${cat.text}`}>{cat.share}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-lg border border-border bg-bg">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 ${cat.color}`}
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        <div className="dashboard-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted" />
            <div>
              <h2 className="dashboard-section-title">User Geography</h2>
              <p className="mt-0.5 text-[11px] text-muted">Active users by location</p>
            </div>
          </div>
          <div className="space-y-3">
            {geographyData.length === 0 ? (
              <p className="text-sm text-muted">No location data in user profiles yet.</p>
            ) : (
            geographyData.map((geo) => (
              <div key={geo.region}>
                <div className="mb-1 flex justify-between">
                  <span className="text-xs font-bold text-muted">{geo.region}</span>
                  <span className="text-xs font-bold text-text">{geo.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-lg border border-border bg-bg">
                  <div
                    className={`h-full rounded-lg ${geo.color}`}
                    style={{ width: `${geo.pct}%` }}
                  />
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface overflow-hidden rounded-[5px] border border-border shadow-sm">
        <div className="flex flex-col items-start gap-3 border-b border-border bg-bg/30 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="dashboard-section-title">Top Performing Courses</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Ranked by enrollment and revenue
            </p>
          </div>
          <div className="relative ml-auto w-full max-w-xs sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search course, mentor..."
              className="h-10 w-full rounded-[5px] border border-border bg-surface pl-10 pr-8 text-sm font-medium text-text outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-border bg-bg/50">
              <tr>
                {["#", "Course", "Mentor", "Students", "Rating", "Revenue", "Growth"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map((course) => (
                <tr key={course.rank} className="transition-colors hover:bg-bg/40">
                  <td className="px-5 py-4 text-xs font-bold text-muted">{course.rank}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-text">{course.name}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-muted">
                    {course.mentor}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted" />
                      <span className="text-xs font-bold text-text">
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-xs font-bold text-text">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-success">{course.revenue}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`flex items-center gap-0.5 text-xs font-bold ${
                        course.up ? "text-success" : "text-danger"
                      }`}
                    >
                      {course.up ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {course.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCourses.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted opacity-20" />
              <p className="font-bold text-text">No courses found</p>
              <p className="mt-1 text-sm text-muted">Try a different search term.</p>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-bg/30 px-5 py-3">
          <p className="text-xs font-bold text-muted">
            Showing {filteredCourses.length} of {topCoursesData.length} courses
          </p>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="dashboard-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="dashboard-section-title">Top Mentors</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              By total student impact and revenue
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            All mentors <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topMentorsData.map((mentor) => (
            <div
              key={mentor.name}
              className="rounded-xl border border-border bg-bg/50 p-4 transition-all duration-200 hover:border-primary/25"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${mentor.grad} text-sm font-bold text-white shadow-sm`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <span className="relative z-10">{mentor.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{mentor.name}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-bold text-muted">{mentor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] font-bold text-muted">Courses</p>
                  <p className="mt-0.5 text-sm font-bold text-text">{mentor.courses}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted">Students</p>
                  <p className="mt-0.5 text-sm font-bold text-text">
                    {(mentor.students / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted">Revenue</p>
                  <p className="mt-0.5 text-sm font-bold text-success">{mentor.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
