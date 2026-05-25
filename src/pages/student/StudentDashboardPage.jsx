import {
  Sparkles,
  CalendarDays,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock3,
  BookOpen,
  Trophy,
  FileText,
  PlayCircle,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      <div className="relative z-10 w-full space-y-5 px-2 pt-2 sm:px-4 lg:px-6">
        {/* HERO */}
        <section
          className="
            -ml-5 -mt-5
            relative overflow-hidden
            rounded-[5px]
            border border-gray-200 dark:border-border
            bg-white/90 dark:bg-elevated/80
            p-5 md:p-7
            shadow-sm
          "
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_28%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* LEFT */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div
                  className="
                    inline-flex items-center gap-2
                    rounded-[5px]
                    bg-blue-500/10
                    px-4 py-2
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-blue-500
                  "
                >
                  <Sparkles size={14} />
                  Good Afternoon
                </div>
              </div>

              <h1
                className="
                  text-[36px] sm:text-[48px]
                  font-black
                  tracking-[-0.05em]
                  leading-tight
                "
              >
                Welcome back,
                <span className="text-primary"> Kunal</span>
              </h1>

              <p
                className="
                  mt-4 max-w-2xl
                  text-[16px]
                  leading-7
                  text-muted
                "
              >
                Continue your learning journey, complete your
                assignments and track your progress from one
                dashboard.
              </p>
            </div>

            {/* STATUS */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="
                  mt-10
                  rounded-[5px]
                  border border-emerald-500/10
                  bg-emerald-500/10
                  px-5 py-3
                  text-xs font-bold uppercase tracking-[0.15em]
                  text-emerald-500
                "
              >
                ● LEARNING ACTIVE
              </div>

              <div
                className="
                  mt-10
                  rounded-[5px]
                  border border-gray-200 dark:border-border
                  bg-white dark:bg-bg
                  px-5 py-3
                  text-sm font-semibold
                  text-muted
                "
              >
                Mon, May 28
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4 -ml-5">
          {[
            {
              title: "COURSES",
              count: "08",
              subtitle: "2 active",
              icon: BookOpen,
              color: "text-blue-500",
              bg: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
            },
            {
              title: "LESSONS",
              count: "42",
              subtitle: "7 today",
              icon: CheckCircle2,
              color: "text-emerald-500",
              bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5",
            },
            {
              title: "TASKS",
              count: "05",
              subtitle: "2 pending",
              icon: FileText,
              color: "text-orange-500",
              bg: "bg-gradient-to-br from-orange-500/20 to-orange-500/5",
            },
            {
              title: "BADGES",
              count: "12",
              subtitle: "4 verified",
              icon: Trophy,
              color: "text-violet-500",
              bg: "bg-gradient-to-br from-violet-500/20 to-violet-500/5",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                group
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-4
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:border-primary/20
                hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]
              "
            >
              <div className="flex items-start justify-between">
                <div
                  className={`
                    flex h-11 w-11 items-center justify-center
                    rounded-[10px]
                    shadow-sm
                    ${item.bg}
                    ${item.color}
                  `}
                >
                  <item.icon size={19} />
                </div>

                <ArrowRight
                  size={16}
                  className="
                    text-muted
                    transition-transform duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />
              </div>

              <h2 className="mt-5 text-[34px] font-black leading-none">
                {item.count}
              </h2>

              <p className="mt-3 text-[11px] font-black tracking-[0.14em] text-muted">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-muted">
                {item.subtitle}
              </p>
            </div>
          ))}
        </section>

        {/* LOWER GRID */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12 -ml-5">
          {/* LEARNING ACTIONS */}
          <div className="xl:col-span-4">
            <div
              className="
                h-full
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-5
                shadow-sm
                transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
              "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-black">
                  Learning Actions
                </h3>

                <Sparkles className="text-primary" size={18} />
              </div>

              <div className="mt-5 space-y-3">
                {[
                  "Continue Course",
                  "Join Live Class",
                  "Submit Assignment",
                  "View Certificates",
                ].map((item, index) => (
                  <button
                    key={index}
                    className="
                      group flex w-full items-center justify-between
                      rounded-[5px]
                      border border-gray-200 dark:border-border
                      bg-bg/70
                      px-4 py-4
                      text-left
                      transition-all duration-300
                      hover:border-primary/20
                      hover:bg-primary/[0.03]
                      hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-10 w-10 items-center justify-center
                          rounded-[10px]
                          bg-gradient-to-br
                          from-primary/20
                          to-primary/5
                          text-primary
                          shadow-sm
                        "
                      >
                        <PlayCircle size={18} />
                      </div>

                      <span className="text-sm font-semibold">
                        {item}
                      </span>
                    </div>

                    <ArrowRight
                      size={16}
                      className="
                        text-muted
                        transition-transform duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COURSE PROGRESS */}
          <div className="xl:col-span-4">
            <div
              className="
                h-full
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-5
                shadow-sm
                transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
              "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-black">
                  Course Progress
                </h3>

                <Activity className="text-primary" size={18} />
              </div>

              <div className="mt-6 space-y-5">
                {[
                  {
                    title: "UI/UX Design",
                    width: "85%",
                    value: "85%",
                    color: "bg-blue-500",
                  },
                  {
                    title: "React Development",
                    width: "64%",
                    value: "64%",
                    color: "bg-emerald-500",
                  },
                  {
                    title: "System Design",
                    width: "28%",
                    value: "28%",
                    color: "bg-orange-500",
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>

                      <span className="text-xs font-bold text-muted">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-[5px] bg-gray-100 dark:bg-border">
                      <div
                        className={`h-full rounded-[5px] ${item.color}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  {
                    title: "124+",
                    subtitle: "Hours",
                  },
                  {
                    title: "18",
                    subtitle: "Modules",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                      rounded-[5px]
                      border border-gray-200 dark:border-border
                      bg-bg/70
                      p-4
                      transition-all duration-300
                      hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                    "
                  >
                    <h4 className="text-[22px] font-black">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-xs text-muted">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT LEARNING */}
          <div className="xl:col-span-4">
            <div
              className="
                h-full
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-5
                shadow-sm
                transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
              "
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-black">
                  Recent Learning
                </h3>

                <Clock3 className="text-primary" size={18} />
              </div>

              <div className="mt-5 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="
                      flex items-start gap-3
                      rounded-[5px]
                      border border-gray-200 dark:border-border
                      bg-bg/60
                      p-3
                      transition-all duration-300
                      hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                    "
                  >
                    <div
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-[10px]
                        bg-gradient-to-br
                        from-violet-500/20
                        to-violet-500/5
                        text-violet-500
                        shadow-sm
                      "
                    >
                      <CheckCircle2 size={17} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold">
                        UI Design Fundamentals
                      </h4>

                      <p className="mt-1 text-xs text-muted">
                        Completed lesson successfully
                      </p>
                    </div>

                    <span className="text-[10px] text-muted">
                      14m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UPCOMING CLASSES */}
        <section className="-ml-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[26px] font-black">
              Upcoming Classes
            </h3>

            <button className="text-sm font-semibold text-primary hover:underline">
              View Calendar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                date: "Tomorrow",
                title: "Live UI Workshop",
                subtitle: "Advanced Design Systems",
              },
              {
                date: "In 2 Days",
                title: "React Masterclass",
                subtitle: "Hooks & State Management",
              },
              {
                date: "May 12",
                title: "Portfolio Review",
                subtitle: "1-on-1 Mentor Session",
              },
              {
                date: "May 15",
                title: "Final Assessment",
                subtitle: "Frontend Development Track",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="
                  rounded-[5px]
                  border border-gray-200 dark:border-border
                  bg-white dark:bg-elevated/80
                  p-6
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-primary/20
                  hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]
                "
              >
                <div className="flex items-center gap-2 text-primary">
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-[10px]
                      bg-gradient-to-br
                      from-primary/20
                      to-primary/5
                      shadow-sm
                    "
                  >
                    <CalendarDays size={16} />
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
                    {item.date}
                  </p>
                </div>

                <h4 className="mt-5 text-lg font-black leading-snug">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm text-muted">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}