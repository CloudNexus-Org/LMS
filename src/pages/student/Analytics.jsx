import React from "react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const Analytics = () => {
  const isDark = useIsDarkTheme();

  const cardBg = isDark ? "bg-[#0d111d]" : "bg-white";

  const cardBorder = isDark
    ? "border-white/10"
    : "border-border";

  return (
    <div className="min-h-screen bg-bg text-text p-1 space-y-6">
      {/* HEADER */}
      <div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Analytics Dashboard
            </span>

            <span className="rounded-[5px] border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-500">
              Live Insights
            </span>
          </div>

          <h2 className="font-display text-[42px] font-black leading-[1.02] tracking-[-0.04em] text-text">
            Student Insights
          </h2>

          <p className="text-lg font-medium leading-[1.7] text-muted">
            Visualizing your learning growth, performance trends,
            certification readiness and placement progress with
            intelligent analytics.
          </p>
        </div>
      </div>

     {/* QUICK STATS */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {[
    {
      title: "Overall Growth",
      value: "+24%",
      icon: "trending_up",
      iconColor: "text-blue-500",
      line: "bg-blue-500/20",
      iconBg: "bg-blue-500/10",
      hover: "hover:border-blue-500/20",
      glow:
        "hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]",
    },
    {
      title: "Active Streak",
      value: "18 Days",
      icon: "local_fire_department",
      iconColor: "text-orange-500",
      line: "bg-orange-500/20",
      iconBg: "bg-orange-500/10",
      hover: "hover:border-orange-500/20",
      glow:
        "hover:shadow-[0_20px_50px_rgba(249,115,22,0.12)]",
    },
    {
      title: "Practice Hours",
      value: "128h",
      icon: "schedule",
      iconColor: "text-emerald-500",
      line: "bg-emerald-500/20",
      iconBg: "bg-emerald-500/10",
      hover: "hover:border-emerald-500/20",
      glow:
        "hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]",
    },
    {
      title: "Leaderboard",
      value: "#12",
      icon: "military_tech",
      iconColor: "text-violet-500",
      line: "bg-violet-500/20",
      iconBg: "bg-violet-500/10",
      hover: "hover:border-violet-500/20",
      glow:
        "hover:shadow-[0_20px_50px_rgba(139,92,246,0.12)]",
    },
  ].map((item) => (
    <div
      key={item.title}
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

        ${item.hover}
        ${item.glow}
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

              ${item.iconBg}

              shadow-sm

              ${item.iconColor}
            `}
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
          </div>

          {/* VALUE + TITLE */}
          <div>
            <h3 className="text-[30px] font-black leading-none">
              {item.value}
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
              {item.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEARNING VELOCITY */}
        <div
          className={`
            col-span-12 xl:col-span-8
            rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            relative overflow-hidden
            p-8
            backdrop-blur-xl
            transition-all duration-500
            hover:-translate-y-1
            hover:shadow-[0_30px_70px_rgba(37,99,235,0.18)]
          `}
        >
          <div className="absolute right-0 top-0 h-44 w-44 bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">
                Learning Velocity
              </h2>

              <p className="mt-2 text-muted">
                Weekly knowledge acquisition rate
              </p>
            </div>

            <div className="flex gap-3">
              <span className="rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-500">
                AWS
              </span>

              <span className="rounded-[5px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-500">
                Azure
              </span>
            </div>
          </div>

          {/* CHART */}
          <div className="relative z-10 flex h-[320px] items-end gap-5 sm:gap-8">
            {[
              ["Mon", "40%", "from-blue-500 to-cyan-400"],
              ["Tue", "60%", "from-blue-500 to-cyan-400"],
              ["Wed", "55%", "from-blue-500 to-cyan-400"],
              ["Thu", "85%", "from-blue-500 to-cyan-400"],
              ["Fri", "70%", "from-blue-500 to-cyan-400"],
              ["Sat", "95%", "from-blue-500 to-cyan-400"],
            ].map(([day, height, gradient]) => (
              <div
                key={day}
                className="group flex w-1/6 flex-col items-center gap-3"
              >
                <div
                  className={`
                    relative flex h-[240px] w-full max-w-[70px]
                    items-end overflow-hidden rounded-[6px]
                    ${isDark ? "bg-white/[0.04]" : "bg-muted"}
                    border border-white/5
                  `}
                >
                  <div
                    className={`
                      absolute inset-x-0 bottom-0 rounded-[6px]
                      bg-gradient-to-t ${gradient}
                      shadow-[0_0_30px_rgba(59,130,246,0.25)]
                      transition-all duration-500 ease-out
                      group-hover:scale-y-125
                      origin-bottom
                    `}
                    style={{ height }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.08]" />
                </div>

                <span className="text-sm font-bold uppercase tracking-wider text-muted transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MARKET READY */}
        <div
          className={`
            col-span-12 xl:col-span-4
            rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            relative overflow-hidden
            p-8
            backdrop-blur-xl
            transition-all duration-500
            hover:-translate-y-1
            hover:shadow-[0_30px_70px_rgba(139,92,246,0.18)]
          `}
        >
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-black">
              Market Ready
            </h2>

            <p className="text-muted">
              Placement alignment score
            </p>
          </div>

          <div className="relative z-10 flex justify-center py-10">
            <div className="relative h-52 w-52">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

              <svg className="-rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  strokeWidth="17"
                  className={`${
                    isDark
                      ? "stroke-white/10"
                      : "stroke-muted"
                  }`}
                  fill="none"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="stroke-primary"
                  fill="none"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-5xl font-black">
                  75%
                </h2>

                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-muted">
                  Elite Tier
                </p>
              </div>
            </div>
          </div>

          <button
            className="
              relative inline-flex h-[44px] w-full items-center justify-center overflow-hidden
              rounded-none border border-primary/20 bg-primary px-6
              text-white
              transition-all duration-300
              hover:-translate-y-[2px]
              hover:scale-[1.02]
              hover:shadow-[0_25px_60px_rgba(139,92,246,0.18)]
              [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
            "
          >
            Optimize CV
          </button>
        </div>

        {/* DOMAIN CARDS */}
        <div className="col-span-12 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {[
            {
              title: "AWS Architect",
              percent: "82%",
              level: "Advanced",
              icon: "cloud",
              iconColor: "text-blue-500",
              bg: "from-blue-500/30 via-blue-500/10 to-cyan-400/20",
              progress: "from-blue-500 to-cyan-400",
              glow:
                "hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]",
            },
            {
              title: "Azure Solutions",
              percent: "45%",
              level: "Intermediate",
              icon: "terminal",
              iconColor: "text-emerald-500",
              bg: "from-emerald-500/30 via-emerald-500/10 to-lime-400/20",
              progress: "from-emerald-500 to-lime-400",
              glow:
                "hover:shadow-[0_25px_60px_rgba(16,185,129,0.18)]",
            },
            {
              title: "GCP Engineer",
              percent: "15%",
              level: "Novice",
              icon: "dataset",
              iconColor: "text-red-500",
              bg: "from-red-500/30 via-red-500/10 to-orange-400/20",
              progress: "from-red-500 to-orange-400",
              glow:
                "hover:shadow-[0_25px_60px_rgba(239,68,68,0.18)]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`
                group
                relative overflow-hidden rounded-[6px]
                border
                ${cardBorder}
                ${cardBg}
                p-6
                transition-all duration-500
                hover:-translate-y-2
                hover:border-primary/20
                ${item.glow}
              `}
            >
              <div className="relative z-10">
                <div className="mb-8 flex justify-between">
                  <div
                    className={`
                      relative
                      flex h-14 w-14 items-center justify-center
                      rounded-[14px]
                      bg-gradient-to-br
                      ${item.bg}
                      overflow-hidden
                    `}
                  >
                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-br
                        from-white/40
                        to-transparent
                      "
                    />

                    <span
                      className={`material-symbols-outlined relative z-10 text-[28px] ${item.iconColor}`}
                    >
                      {item.icon}
                    </span>
                  </div>

                  <span className="h-fit rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500">
                    {item.level}
                  </span>
                </div>

                <h3 className="text-[24px] font-black">
                  {item.title}
                </h3>

                <div
                  className={`
                    mt-5 h-3 overflow-hidden rounded-[5px]
                    ${isDark ? "bg-white/[0.05]" : "bg-muted"}
                  `}
                >
                  <div
                    className={`
                      h-full rounded-[5px]
                      bg-gradient-to-r ${item.progress}
                    `}
                    style={{ width: item.percent }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-sm text-muted">
                  <span>{item.percent} Mastered</span>
                  <span>Level 7</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUIZ HISTORY */}
        <div
          className={`
            col-span-12 xl:col-span-7
            rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            p-8 backdrop-blur-xl
            transition-all duration-500
            hover:shadow-[0_30px_70px_rgba(37,99,235,0.18)]
          `}
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black">
              Quiz History
            </h2>

            <span className="rounded-[5px] bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              Latest Activity
            </span>
          </div>

          <div className="space-y-5">
            {[
              {
                title: "Serverless Architecture",
                score: "94/100",
                time: "2 hours ago",
                bg: "from-blue-500/25 via-blue-500/10 to-cyan-400/10",
                text: "text-blue-500",
              },
              {
                title: "VPC Networking",
                score: "82/100",
                time: "Yesterday",
                bg: "from-emerald-500/25 via-emerald-500/10 to-lime-400/10",
                text: "text-emerald-500",
              },
              {
                title: "IAM Policies",
                score: "78/100",
                time: "3 days ago",
                bg: "from-red-500/25 via-red-500/10 to-orange-400/10",
                text: "text-red-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`
                  flex items-center justify-between rounded-[6px]
                  border border-white/5
                  ${isDark ? "bg-white/[0.03]" : "bg-gray-100"}
                  p-5 transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_45px_rgba(37,99,235,0.14)]
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`
                      relative
                      flex h-12 w-12 items-center justify-center
                      rounded-[14px]
                      bg-gradient-to-br
                      ${item.bg}
                      overflow-hidden
                    `}
                  >
                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-br
                        from-white/40
                        to-transparent
                      "
                    />

                    <span
                      className={`material-symbols-outlined relative z-10 ${item.text}`}
                    >
                      quiz
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted">
                      {item.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className={`text-2xl font-black ${item.text}`}>
                    {item.score}
                  </h3>

                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Rank
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI ASSESSMENT */}
        <div
          className={`
            col-span-12 xl:col-span-5
            rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            relative overflow-hidden
            p-8 backdrop-blur-xl
            transition-all duration-500
            hover:shadow-[0_30px_70px_rgba(139,92,246,0.18)]
          `}
        >
          <div className="absolute right-0 top-0 h-36 w-36 bg-violet-500/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black">
              Mentor Assessment
            </h2>

            <p className="mt-2 text-muted">
              AI-driven analysis of your practical labs.
            </p>

            <div className="mt-10 space-y-8">
              {[
                {
                  title: "Logical Mapping",
                  label: "Excellent",
                  width: 80,
                  progress: "from-blue-500 to-cyan-400",
                  text: "text-blue-500",
                },
                {
                  title: "Cost Optimization",
                  label: "Optimal",
                  width: 60,
                  progress: "from-emerald-500 to-lime-400",
                  text: "text-emerald-500",
                },
                {
                  title: "Security Hardening",
                  label: "Mastery",
                  width: 100,
                  progress: "from-red-500 to-orange-400",
                  text: "text-red-500",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="mb-3 flex justify-between">
                    <span className="font-semibold">
                      {item.title}
                    </span>

                    <span className={`font-semibold ${item.text}`}>
                      {item.label}
                    </span>
                  </div>

                  <div
                    className={`
                      h-3 overflow-hidden rounded-[5px]
                      ${isDark ? "bg-white/[0.05]" : "bg-muted"}
                    `}
                  >
                    <div
                      className={`
                        h-full rounded-[5px]
                        bg-gradient-to-r ${item.progress}
                      `}
                      style={{ width: `${item.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;