import React from "react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const Analytics = () => {
  const isDark = useIsDarkTheme();

  const barFrom = "from-blue-500";
  const barTo = "to-cyan-400";

  const cardBg = isDark ? "bg-[#0d111d]" : "bg-white";

  const cardBorder = isDark
    ? "border-white/10"
    : "border-border";

  const glassGlow = isDark
    ? "shadow-[0_20px_60px_rgba(37,99,235,0.18)]"
    : "shadow-[0_20px_60px_rgba(37,99,235,0.08)]";

  return (
    <div className="min-h-screen bg-bg text-text p-1 space-y-6">
      {/* HEADER */}
      <div>
        

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
              Analytics Dashboard
            </span>

            <span className="rounded-[5px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Live Insights
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-text">
            Student Insights
          </h2>

          <p className=" text-lg font-medium leading-[1.7] text-muted">
            Visualizing your learning growth, performance trends,
            certification readiness, and placement progress with
            intelligent analytics.
          </p>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Overall Growth", "+24%", "trending_up"],
          ["Active Streak", "18 Days", "local_fire_department"],
          ["Practice Hours", "128h", "schedule"],
          ["Leaderboard", "#12", "military_tech"],
        ].map(([title, value, icon]) => (
          <div
            key={title}
            className={`
              relative overflow-hidden rounded-[6px] border
              ${cardBorder}
              ${cardBg}
              ${glassGlow}
              group p-6 transition-all duration-300 hover:-translate-y-1
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-cyan-400/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">
                  {title}
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  {value}
                </h3>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <span className="material-symbols-outlined text-[28px]">
                  {icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEARNING VELOCITY */}
        <div
          className={`
            col-span-12 xl:col-span-8
            rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            ${glassGlow}
            relative overflow-hidden
            p-8 backdrop-blur-xl
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

              <span className="rounded-[5px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-400">
                Azure
              </span>
            </div>
          </div>

          {/* CHART */}
          <div className="relative z-10 flex h-[320px] items-end gap-5 sm:gap-8">
            {[
              ["Mon", "40%"],
              ["Tue", "60%"],
              ["Wed", "55%"],
              ["Thu", "85%"],
              ["Fri", "70%"],
              ["Sat", "95%"],
            ].map(([day, height]) => (
              <div
                key={day}
                className="flex w-1/6 flex-col items-center gap-3"
              >
                <div
                  className={`
                    relative flex h-[240px] w-full max-w-[70px] items-end overflow-hidden rounded-[6px]
                    ${isDark ? "bg-white/[0.04]" : "bg-muted"}
                    border border-white/5
                  `}
                >
                  <div
                    className={`
                      absolute inset-x-0 bottom-0 rounded-[6px]
                      bg-gradient-to-t ${barFrom} ${barTo}
                      shadow-[0_0_30px_rgba(59,130,246,0.45)]
                      transition-all duration-500 hover:brightness-110
                    `}
                    style={{ height }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-white/[0.08]" />
                </div>

                <span className="text-sm font-bold uppercase tracking-wider text-muted">
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
            ${glassGlow}
            relative overflow-hidden
            p-8 backdrop-blur-xl
          `}
        >
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-black">
              Market Ready
            </h2>

            <p className="text-muted">
              Placement alignment score
            </p>
          </div>

          {/* CIRCLE */}
          <div className="relative z-10 flex justify-center py-10">
            <div className="relative h-52 w-52">
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl" />

              <svg
                className="-rotate-90"
                viewBox="0 0 200 200"
              >
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
                  className="stroke-blue-500"
                  fill="none"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                  style={{
                    filter:
                      "drop-shadow(0px 0px 12px rgba(59,130,246,0.7))",
                  }}
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
              rounded-[5px]
              border border-blue-500/20
              bg-blue-500
              px-6
             relative
                      items-center
                      justify-center
                      overflow-hidden
                   
                    rounded-none
                    text-black
                    dark:text-white
                      shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                      dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                      transition-all
                      duration-300
                      hover:-translate-y-[2px]
                    hover:border-[#2563ff]/40
                      [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
            "
          >
            Optimize CV
          </button>
        </div>

        {/* DOMAIN CARDS */}
        <div className="col-span-12 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {[
            [
              "AWS Architect",
              "82%",
              "Advanced",
              "cloud",
            ],
            [
              "Azure Solutions",
              "45%",
              "Intermediate",
              "terminal",
            ],
            [
              "GCP Engineer",
              "15%",
              "Novice",
              "dataset",
            ],
          ].map(([title, percent, level, icon]) => (
            <div
              key={title}
              className={`
                relative overflow-hidden rounded-[6px] border
                ${cardBorder}
                ${cardBg}
                ${glassGlow}
                group p-6 backdrop-blur-xl
                transition-all duration-300 hover:-translate-y-1
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-400/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-8 flex justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                    <span className="material-symbols-outlined">
                      {icon}
                    </span>
                  </div>

                  <span className="h-fit rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500">
                    {level}
                  </span>
                </div>

                <h3 className="text-2xl font-black">
                  {title}
                </h3>

                <div
                  className={`
                    mt-5 h-3 overflow-hidden rounded-[5px]
                    ${isDark ? "bg-white/[0.05]" : "bg-muted"}
                  `}
                >
                  <div
                    className="
                      h-full rounded-[5px]
                      bg-gradient-to-r from-blue-500 to-cyan-400
                      shadow-[0_0_20px_rgba(59,130,246,0.4)]
                    "
                    style={{ width: percent }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-sm text-muted">
                  <span>{percent} Mastered</span>

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
            ${glassGlow}
            p-8 backdrop-blur-xl
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
              [
                "Serverless Architecture",
                "94/100",
                "2 hours ago",
              ],
              [
                "VPC Networking",
                "82/100",
                "Yesterday",
              ],
              [
                "IAM Policies",
                "78/100",
                "3 days ago",
              ],
            ].map(([title, score, time]) => (
              <div
                key={title}
                className={`
                  flex items-center justify-between rounded-[6px]
                  border border-blue-500/10
                  ${isDark ? "bg-blue-500/[0.07]" : "bg-blue-500/[0.05]"}
                  p-5 transition-all duration-300 hover:translate-x-1
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500">
                    <span className="material-symbols-outlined">
                      quiz
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {title}
                    </h3>

                    <p className="text-sm text-muted">
                      {time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-2xl font-black text-blue-500">
                    {score}
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
            ${glassGlow}
            relative overflow-hidden
            p-8 backdrop-blur-xl
          `}
        >
          <div className="absolute right-0 top-0 h-36 w-36 bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black">
              Mentor Assessment
            </h2>

            <p className="mt-2 text-muted">
              AI-driven analysis of your practical labs.
            </p>

            <div className="mt-10 space-y-8">
              {[
                ["Logical Mapping", "Excellent", 80],
                ["Cost Optimization", "Optimal", 60],
                ["Security Hardening", "Mastery", 100],
              ].map(([title, label, width]) => (
                <div key={title}>
                  <div className="mb-3 flex justify-between">
                    <span className="font-semibold">
                      {title}
                    </span>

                    <span className="font-semibold text-blue-500">
                      {label}
                    </span>
                  </div>

                  <div
                    className={`
                      h-3 overflow-hidden rounded-[5px]
                      ${isDark ? "bg-white/[0.05]" : "bg-muted"}
                    `}
                  >
                    <div
                      className="
                        h-full rounded-[5px]
                        bg-gradient-to-r from-blue-500 to-cyan-400
                        shadow-[0_0_20px_rgba(59,130,246,0.4)]
                      "
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI TIP */}
            <div className="mt-10 rounded-[6px] border border-blue-500/10 bg-blue-500/[0.05] p-5">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500">
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                </div>

                <div>
                  <h4 className="font-bold">
                    AI Recommendation
                  </h4>

                  <p className="mt-1 text-sm leading-7 text-muted">
                    Focus on Lambda cold-start optimization
                    to reach Elite Tier Architect status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;