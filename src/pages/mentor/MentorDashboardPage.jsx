import { useMemo } from "react";
import {
  Users,
  DollarSign,
  BookOpen,
  Star,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Bell,
  Activity,
  Clock3,
  CalendarDays,
  PlayCircle,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

const STATS = [
  {
    label: "Total Students",
    value: "1,248",
    trend: "+12%",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Monthly Revenue",
    value: "$4,250",
    trend: "+8.4%",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Active Courses",
    value: "4",
    trend: "+2",
    icon: BookOpen,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    trend: "+0.1",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const RECENT_ENROLLMENTS = [
  {
    name: "Alex Chen",
    course: "Advanced State Management",
    time: "2 hours ago",
    amount: "$89.99",
  },
  {
    name: "Sarah Miller",
    course: "Cloud Architecture Patterns",
    time: "5 hours ago",
    amount: "$129.99",
  },
  {
    name: "James Wilson",
    course: "Cloud Architecture Patterns",
    time: "1 day ago",
    amount: "$129.99",
  },
];

const ACTIVITIES = [
  {
    title: "New review received",
    desc: "Your React course got a 5 star review.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Course trending",
    desc: "Cloud Architecture Patterns is trending today.",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Live session reminder",
    desc: "You have a mentoring session at 7 PM.",
    icon: CalendarDays,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export default function MentorDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const heroGlowClasses = useMemo(() => ({
    primary: isDark ? "bg-blue-500/8 blur-[120px]" : "bg-blue-500/10 blur-[100px]",
    secondary: isDark ? "bg-indigo-500/6 blur-[100px]" : "bg-cyan-500/10 blur-[100px]",
  }), [isDark]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HERO */}
      <div
        className="
          relative overflow-hidden
          rounded-[5px]
          border border-gray-200 dark:border-border
          bg-white/90 dark:bg-elevated/80
          p-8
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        "
      >
      {/* GLOW */}
        <div className={`absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full ${heroGlowClasses.primary}`} />
        <div className={`absolute bottom-[-100px] left-[-100px] h-[240px] w-[240px] rounded-full ${heroGlowClasses.secondary}`} />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">
              <Sparkles className="h-3 w-3" />
              Mentor Analytics Hub
            </div>

            <h1
              className="
                mt-5
                max-w-[700px]
                text-[42px]
                font-black
                tracking-[-0.05em]
                text-text
                sm:text-5xl
              "
            >
              Welcome back, Mentor ðŸ‘‹
            </h1>

            <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-muted">
              Your courses are performing exceptionally well this week.
              Keep engaging with your students and growing your academy.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <button
                className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[180px]

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
                "
              >
                Create Course
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[180px]

                  items-center
                  justify-center

                  overflow-hidden
                  rounded-full

                  border
                  border-border
                  dark:border-border

                  bg-black
                  dark:bg-surface

                  px-6

                  text-[14px]
                  font-semibold

                  text-white
                  dark:text-text

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/40
                "
              >
                <PlayCircle className="h-4 w-4" />
                Watch Analytics
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "Weekly Growth",
                value: "+24%",
                icon: TrendingUp,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                title: "New Reviews",
                value: "86",
                icon: Star,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                title: "Engagement",
                value: "92%",
                icon: Activity,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
              },
              {
                title: "Pending Q&A",
                value: "12",
                icon: Bell,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="
                    rounded-[5px]
                    border border-gray-200 dark:border-border
                    bg-white dark:bg-elevated/80
                    p-5
                    backdrop-blur-xl
                  "
                >
                  <div
                    className={`
                      flex h-12 w-12 items-center justify-center rounded-full
                      ${item.bg}
                      ${item.color}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-muted">
                    {item.title}
                  </p>

                  <h3 className="mt-1 text-3xl font-black text-text">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI GRID */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {STATS.map((stat) => {
    const Icon = stat.icon;

    return (
      <div
        key={stat.label}
        className={`
          group
          relative overflow-hidden

          rounded-[5px]

          border border-gray-200
          dark:border-border

          bg-white
          dark:bg-elevated/80

          px-5 py-4

          shadow-sm

          transition-all duration-300

          hover:-translate-y-1
          hover:border-primary/20

          hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
        `}
      >
        

        {/* CONTENT */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div
              className={`
                flex h-11 w-11 items-center justify-center
                rounded-[10px]

                ${stat.bg}
                ${stat.color}

                shadow-sm
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* VALUE + TITLE */}
            <div>
              <h3 className="text-[25px] font-black leading-none text-text">
                {stat.value}
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-muted
                "
              >
                {stat.label}
              </p>
            </div>

            {/* TREND */}
            <div
              className="
                ml-auto
                flex items-center gap-1

                rounded-[5px]

                bg-emerald-500/10

                px-2 py-1

                text-[10px]
                font-black

                text-emerald-500
              "
            >
              <TrendingUp className="h-3 w-3" />
              {stat.trend}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="space-y-8 xl:col-span-2">
          {/* RECENT ENROLLMENTS */}
          <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-7 py-6">
              <div>
                <h3 className="text-2xl font-black text-text">
                  Recent Enrollments
                </h3>

                <p className="mt-1 text-sm text-muted">
                  Students who joined recently.
                </p>
              </div>

              <button className="flex items-center gap-1 text-sm font-bold text-blue-500 transition-all hover:gap-2">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="border-b border-gray-200 dark:border-border bg-gray-50 dark:bg-elevated/80">
                  <tr>
                    <th className="px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-muted">
                      Student
                    </th>

                    <th className="px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-muted">
                      Course
                    </th>

                    <th className="px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-muted">
                      Revenue
                    </th>

                    <th className="px-7 py-4 text-right text-xs font-black uppercase tracking-[0.15em] text-muted">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {RECENT_ENROLLMENTS.map((req, i) => (
                    <tr
                      key={i}
                      className="transition-all hover:bg-elevated/60 dark:hover:bg-elevated/80"
                    >
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 font-black text-blue-500">
                            {req.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-bold text-text">
                              {req.name}
                            </p>

                            <p className="text-xs text-muted">
                              Premium Student
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-7 py-5 font-medium text-muted">
                        {req.course}
                      </td>

                      <td className="px-7 py-5 font-black text-emerald-500">
                        {req.amount}
                      </td>

                      <td className="px-7 py-5 text-right text-xs font-bold text-muted">
                        {req.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COURSE PERFORMANCE */}
<div
  className="
    rounded-[5px]
    border border-gray-200 dark:border-border
    bg-white dark:bg-elevated/80
    p-8
    shadow-sm
    transition-all duration-300
    hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
  "
>
  {/* HEADER */}
  <div className="flex items-center p-3 justify-between">
    <div>
      <h3 className="text-2xl font-black text-text">
        Course Performance
      </h3>

      <p className="mt-2 text-sm text-muted">
        Student engagement analytics overview.
      </p>
    </div>

    <div
      className="
        rounded-[5px]
        bg-gradient-to-br
        from-blue-500/20
        via-blue-500/10
        to-cyan-400/10

        px-4 py-2

        text-xs
        font-black
        uppercase
        tracking-[0.15em]
        text-blue-500
      "
    >
      Live Data
    </div>
  </div>

  {/* CHART */}
  <div className="mt-10 flex items-end gap-3">
    {[
      {
        h: 80,
        color:
          "from-blue-600 via-blue-500 to-cyan-400",
      },
      {
        h: 120,
        color:
          "from-emerald-600 via-emerald-500 to-lime-400",
      },
      {
        h: 95,
        color:
          "from-orange-600 via-orange-500 to-yellow-400",
      },
      {
        h: 150,
        color:
          "from-violet-600 via-violet-500 to-fuchsia-400",
      },
      {
        h: 130,
        color:
          "from-cyan-600 via-cyan-500 to-blue-400",
      },
      {
        h: 180,
        color:
          "from-pink-600 via-fuchsia-500 to-violet-400",
      },
      {
        h: 160,
        color:
          "from-blue-600 via-indigo-500 to-cyan-400",
      },
    ].map((bar, i) => (
      <div
        key={i}
        className="group flex-1"
      >
        <div
          className={`
            relative overflow-hidden
            rounded-t-[5px]
            bg-gradient-to-t
            ${bar.color}

            transition-all duration-500
            group-hover:-translate-y-2
            group-hover:shadow-[0_15px_30px_rgba(37,99,235,0.18)]
          `}
          style={{
            height: `${bar.h}px`,
          }}
        >
          {/* SHINE */}
          <div
            className="
              absolute inset-0
              bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.3)_50%,transparent_80%)]
              animate-[shine_2.5s_linear_infinite]
            "
          />
        </div>
      </div>
    ))}
  </div>

  {/* LABELS */}
  <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-muted">
    <span>Mon</span>
    <span>Tue</span>
    <span>Wed</span>
    <span>Thu</span>
    <span>Fri</span>
    <span>Sat</span>
    <span>Sun</span>
  </div>

  {/* PERFORMANCE LINES */}
  
       
    
  


</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">
          {/* PENDING Q&A */}
          <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 p-10 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-text">
                Q&A Pending
              </h3>

              <div className="rounded-[5px] bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">
                12 Pending
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-[5px] border border-gray-200 dark:border-border bg-gray-50 dark:bg-elevated/90 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-black text-blue-500">
                    JD
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-text">
                        John Doe
                      </p>

                      <span className="rounded-[5px] bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-500">
                        urgent
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-medium text-muted">
                      Cloud Architecture Â· Lesson 3
                    </p>

                    <p className="mt-4 rounded-[5px] border border-gray-200 dark:border-border bg-gray-50/80 dark:bg-black/30 p-4 text-sm leading-7 text-text">
                      â€œCould you clarify the difference between
                      standard and FIFO queues here?â€
                    </p>

                    <button className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-500 transition-all hover:gap-3">
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="rounded-[5px] border border-gray-200 dark:border-border bg-white dark:bg-elevated/80 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-text">
                Recent Activity
              </h3>

              <Clock3 className="h-5 w-5 text-muted" />
            </div>

            <div className="mt-6 space-y-5">
              {ACTIVITIES.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="flex gap-4 rounded-[5px] border border-gray-200 dark:border-border bg-gray-50 dark:bg-elevated/90 p-4 transition-all hover:bg-gray-100 dark:hover:bg-elevated"
                  >
                    <div
                      className={`
                        flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                        ${item.bg}
                        ${item.color}
                      `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-bold text-text">
                        {item.title}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}