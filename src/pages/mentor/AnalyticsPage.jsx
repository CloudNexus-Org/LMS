import {
  BarChart as BarChartIcon,
  TrendingUp,
  Users,
  Activity,
  Eye,
  Sparkles,
  ArrowUpRight,
  Clock3,
  Globe,
  Star,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* HERO */}
      <div
        className="
          relative overflow-hidden
          rounded-[5px]
          border border-border
          bg-surface
          p-8
          shadow-sm
        "
      >
        {/* GLOW */}
        <div className="absolute right-[-100px] top-[-100px] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">
              <Sparkles className="h-3.5 w-3.5" />
              Real-Time Analytics
            </div>

            <h1 className="mt-5 text-[42px] font-black tracking-[-0.05em] text-text leading-none">
              Performance Analytics
            </h1>

            <p className="text-muted mt-5 max-w-[700px] text-[15px] leading-8 font-medium">
              Deep dive into your course metrics, enrollments,
              engagement, audience behavior, and revenue performance.
            </p>

            {/* QUICK TAGS */}
            <div className="mt-7 flex flex-wrap gap-4">
              {[
                {
                  icon: Flame,
                  text: "Trending Courses",
                },
                {
                  icon: Globe,
                  text: "Global Audience",
                },
                {
                  icon: Clock3,
                  text: "24/7 Tracking",
                },
              ].map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="
                      flex items-center gap-2
                      rounded-[5px]
                      border border-border
                      bg-bg/60
                      px-4 py-3
                    "
                  >
                    <Icon className="h-4 w-4 text-blue-500" />

                    <span className="text-sm font-bold text-text">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div
            className="
              relative overflow-hidden
              rounded-[5px]
              border border-border
              bg-bg/70
              p-6
              xl:w-[350px]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-400/[0.04]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-muted">
                    Revenue Growth
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-text">
                    +24%
                  </h3>
                </div>

                <div className="rounded-[5px] bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-emerald-500">
                  This Month
                </div>
              </div>

              <div className="mt-8 flex items-end gap-2">
                {[30, 45, 35, 60, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[5px] bg-blue-500"
                    style={{
                      height: `${h}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Course Views",
            value: "14.2k",
            trend: "+24%",
            icon: Eye,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Conversion Rate",
            value: "8.4%",
            trend: "+1.2%",
            icon: Activity,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Completion Rate",
            value: "42%",
            trend: "-2%",
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
          {
            label: "Active Students",
            value: "842",
            trend: "+15%",
            icon: Users,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;

          return (
            <div
              key={i}
              className="
                group relative overflow-hidden
                rounded-[5px]
                border border-border
                bg-surface
                p-6
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-cyan-400/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      flex h-14 w-14 items-center justify-center rounded-[5px]
                      ${stat.bg}
                      ${stat.color}
                    `}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <div
                    className={`
                      rounded-[5px]
                      px-3 py-1
                      text-xs font-black

                      ${
                        stat.trend.startsWith("+")
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    `}
                  >
                    {stat.trend}
                  </div>
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.15em] text-muted">
                  {stat.label}
                </p>

                <h3 className="mt-2 text-4xl font-black text-text">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART */}
        <div
          className="
            lg:col-span-2
            relative overflow-hidden
            rounded-[5px]
            border border-border
            bg-surface
            p-6 sm:p-8
            shadow-sm
          "
        >
          {/* GLOW */}
          <div className="absolute right-[-100px] top-[-100px] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]" />

          {/* TOP */}
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-500">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Live Enrollment Data
              </div>

              <h3 className="mt-4 font-black text-[32px] leading-none tracking-[-0.04em] text-text">
                Enrollments Overview
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted font-medium">
                Last 6 months of course signups and student growth.
              </p>
            </div>

            <select
              className="
                h-11
                rounded-[5px]
                border border-border
                bg-bg
                px-4
                text-xs
                font-black
                uppercase
                tracking-[0.12em]
                text-text
                outline-none
                transition-all
                focus:border-blue-500
              "
            >
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>

          {/* CHART */}
          <div className="relative h-[320px]">
            
            {/* GRID */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
            </div>

            {/* Y LABELS */}
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] font-black uppercase tracking-[0.15em] text-muted">
              <span>12K</span>
              <span>8K</span>
              <span>4K</span>
              <span>0</span>
            </div>

            {/* BARS */}
            <div className="ml-10 h-full flex items-end justify-between gap-3 sm:gap-6 pt-4 border-b border-border relative">
              {[
                {
                  month: "Jan",
                  val: 40,
                  users: "480",
                  growth: "+12%",
                },
                {
                  month: "Feb",
                  val: 65,
                  users: "720",
                  growth: "+24%",
                },
                {
                  month: "Mar",
                  val: 45,
                  users: "540",
                  growth: "+8%",
                },
                {
                  month: "Apr",
                  val: 80,
                  users: "1.1k",
                  growth: "+32%",
                },
                {
                  month: "May",
                  val: 100,
                  users: "1.6k",
                  growth: "+48%",
                },
                {
                  month: "Jun",
                  val: 85,
                  users: "1.2k",
                  growth: "+26%",
                },
              ].map((d, i) => (
                <div
                  key={i}
                  className="
                    relative flex-1 flex flex-col items-center justify-end h-full group
                  "
                >
                  {/* TOOLTIP */}
                  <div
                    className="
                      absolute top-0 left-1/2 z-20
                      -translate-x-1/2
                      rounded-[5px]
                      border border-border
                      bg-surface
                      px-4 py-3
                      opacity-0
                      transition-all duration-300
                      group-hover:-translate-y-2
                      group-hover:opacity-100
                      shadow-[0_15px_40px_rgba(0,0,0,0.2)]
                      pointer-events-none
                    "
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted">
                      Enrollments
                    </p>

                    <h4 className="mt-1 text-lg font-black text-text">
                      {d.users}
                    </h4>

                    <span className="mt-2 inline-flex rounded-[5px] bg-emerald-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500">
                      {d.growth}
                    </span>
                  </div>

                  {/* BAR */}
                  <div
                    className="
                      relative
                      w-full sm:w-14
                      overflow-hidden
                      rounded-t-[5px]
                      transition-all duration-500 ease-out
                      group-hover:-translate-y-1
                      group-hover:scale-[1.04]
                    "
                    style={{
                      height: `${d.val}%`,
                    }}
                  >
                    {/* INNER MOVING BAR */}
                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-blue-600
                        via-blue-500
                        to-cyan-400
                        transition-all duration-500
                        group-hover:translate-y-2
                      "
                    />

                    {/* SHINE */}
                    <div
                      className="
                        absolute inset-0
                        bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.3)_50%,transparent_80%)]
                        animate-[shine_2.5s_linear_infinite]
                      "
                    />

                    {/* GLOW */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                  </div>

                  {/* MONTH */}
                  <span className="absolute -bottom-7 text-xs font-black uppercase tracking-[0.15em] text-muted">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP COURSES */}
        <div className="bg-surface border border-border rounded-[5px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-xl text-text">
              Top Performing
            </h3>

            <button className="flex items-center gap-1 text-sm font-bold text-blue-500 hover:gap-2 transition-all">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6">
            {[
              {
                name: "Advanced State Mgmt",
                rev: "$8.4k",
                share: 65,
              },
              {
                name: "Cloud Arch Patterns",
                rev: "$4.0k",
                share: 35,
              },
              {
                name: "System Design",
                rev: "$2.7k",
                share: 22,
              },
            ].map((course, i) => (
              <div
                key={i}
                className="
                  rounded-[5px]
                  border border-border
                  bg-bg/50
                  p-4
                "
              >
                <div className="flex justify-between text-sm">
                  <span className="font-black text-text truncate max-w-[170px]">
                    {course.name}
                  </span>

                  <span className="font-black text-emerald-500">
                    {course.rev}
                  </span>
                </div>

                <div className="mt-4 w-full h-3 bg-bg rounded-full overflow-hidden border border-border">
                  <div
                    className="
                      h-full rounded-full
                      bg-gradient-to-r
                      from-blue-500
                      to-cyan-400
                    "
                    style={{
                      width: `${course.share}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
                  <span className="text-muted">
                    Performance
                  </span>

                  <span className="text-blue-500">
                    {course.share}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NEW SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AUDIENCE INSIGHTS */}
        <div className="rounded-[5px] border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text">
                Audience Insights
              </h3>

              <p className="mt-1 text-sm text-muted font-medium">
                Viewer locations & traffic sources.
              </p>
            </div>

            <div className="h-12 w-12 rounded-[5px] bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {[
              { country: "India", val: "48%" },
              { country: "United States", val: "24%" },
              { country: "Germany", val: "14%" },
              { country: "Canada", val: "9%" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text">
                    {item.country}
                  </span>

                  <span className="text-xs font-black text-blue-500">
                    {item.val}
                  </span>
                </div>

                <div className="h-2 rounded-full overflow-hidden bg-bg border border-border">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: item.val,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COURSE RATINGS */}
        <div className="rounded-[5px] border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text">
                Course Ratings
              </h3>

              <p className="mt-1 text-sm text-muted font-medium">
                Based on student feedback.
              </p>
            </div>

            <div className="h-12 w-12 rounded-[5px] bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Star className="h-6 w-6 fill-current" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-6xl font-black text-text">
              4.9
            </h2>

            <div className="mt-4 flex justify-center gap-1 text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>

            <p className="mt-5 text-sm leading-7 text-muted font-medium">
              Based on 1,284 reviews from enrolled students.
            </p>

            <button
              className="
                mt-6 inline-flex items-center gap-2
                rounded-[5px]
                bg-blue-500
                px-5 py-3
                text-sm font-black text-white
                transition-all duration-300
                hover:-translate-y-1
                hover:bg-blue-600
              "
            >
              View Reviews
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}