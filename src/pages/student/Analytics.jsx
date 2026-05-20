import React from "react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const Analytics = () => {

  const isDark = useIsDarkTheme();

  const barFrom = isDark
    ? "from-blue-400"
    : "from-blue-600";

  const barTo = isDark
    ? "to-cyan-300"
    : "to-cyan-500";

  const cardBg = isDark
    ? "bg-[#0d111d]"
    : "bg-white";

  const cardBorder = isDark
    ? "border-white/10"
    : "border-border";

  return (
    <div
      className="
        min-h-screen
        bg-bg
        text-text
       p-1
        space-y-5
      "
    >

      {/* HEADER */}
      <div className="space-y-2">

        <h2
          className="font-display text-[clamp(2rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-text"
        >
          Student Insights
        </h2>

        <p
          className="text-muted text-lg font-sans font-medium leading-[1.5]"
        >
          Visualizing your learning growth and
          placement readiness.
        </p>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEARNING VELOCITY */}
        <div
          className={`
            col-span-12 xl:col-span-8

            rounded-[5px]
            border

            ${cardBorder}
            ${cardBg}

            p-8

            shadow-[0_20px_60px_rgba(0,0,0,0.15)]

            backdrop-blur-xl
          `}
        >

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-black">
                Learning Velocity
              </h2>

              <p className="mt-1 text-muted">
                Weekly knowledge acquisition rate
              </p>

            </div>

            <div className="flex gap-3">

              <span
                className="
                  rounded-[5px]
                  bg-blue-500/10
                  px-4 py-2

                  text-sm
                  font-bold
                  text-blue-500
                "
              >
                AWS
              </span>

              <span
                className="
                  rounded-[5px]
                  bg-cyan-500/10
                  px-4 py-2

                  text-sm
                  font-bold
                  text-cyan-500
                "
              >
                Azure
              </span>

            </div>

          </div>

          {/* CHART */}
          <div className="flex h-[300px] items-end gap-8">

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
                className="
                  flex w-1/6
                  flex-col items-center gap-2
                "
              >

                <div
                  className={`
                    relative flex h-[220px] w-16 items-end overflow-hidden

                    rounded-[5px]

                    ${isDark
                      ? "bg-white/5"
                      : "bg-muted"}

                    shadow-lg
                  `}
                >

                  <div
                    className={`
                      absolute bottom-0 left-0 w-full

                      bg-gradient-to-t
                      ${barFrom}
                      ${barTo}

                      rounded-[5px]

                      shadow-xl

                      transition-all duration-500
                    `}
                    style={{ height }}
                  />

                </div>

                <span
                  className="
                    mt-2 text-sm
                    font-bold
                    uppercase
                    tracking-wide
                    text-muted
                  "
                >
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

            rounded-[5px]
            border

            ${cardBorder}
            ${cardBg}

            p-8

            shadow-[0_20px_60px_rgba(0,0,0,0.15)]

            backdrop-blur-xl
          `}
        >

          <div className="space-y-2">

            <h2 className="text-2xl font-black">
              Market Ready
            </h2>

            <p className="text-muted">
              Placement alignment score
            </p>

          </div>

          {/* CIRCLE */}
          <div className="flex justify-center py-10">

            <div className="relative h-50 w-50">

              <svg
                className="-rotate-90"
                viewBox="0 0 200 200"
              >

                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  strokeWidth="17"
                  className={`
                    ${isDark
                      ? "stroke-white/10"
                      : "stroke-muted"}
                  `}
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
                />

              </svg>

              <div
                className="
                  absolute inset-0
                  flex flex-col
                  items-center justify-center
                "
              >

                <h1 className="text-5xl font-black">
                  75%
                </h1>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-muted
                  "
                >
                  Elite Tier
                </p>

              </div>

            </div>

          </div>

          <button
            className="
              w-full

              rounded-[5px]

              bg-gradient-to-r
              from-blue-500
              to-cyan-400

              py-4

              font-bold
              text-white

              transition-all duration-300

              hover:-translate-y-1
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
                rounded-[5px]
                border

                ${cardBorder}
                ${cardBg}

                p-6

                shadow-[0_20px_60px_rgba(0,0,0,0.15)]

                backdrop-blur-xl

                transition-all duration-300

                hover:-translate-y-1
              `}
            >

              <div className="mb-8 flex justify-between">

                <div
                  className="
                    flex h-14 w-14
                    items-center justify-center

                    rounded-[5px]

                    bg-blue-500/10
                    text-blue-500
                  "
                >

                  <span className="material-symbols-outlined">
                    {icon}
                  </span>

                </div>

                <span
                  className="
                    h-fit

                    rounded-[5px]

                    bg-blue-500/10

                    px-3 py-1

                    text-xs
                    font-bold
                    text-blue-500
                  "
                >
                  {level}
                </span>

              </div>

              <h3 className="text-2xl font-black">
                {title}
              </h3>

              <div
                className={`
                  mt-5 h-3 overflow-hidden

                  rounded-[5px]

                  ${isDark
                    ? "bg-white/5"
                    : "bg-muted"}
                `}
              >

                <div
                  className="
                    h-full

                    rounded-[5px]

                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-400
                  "
                  style={{ width: percent }}
                />

              </div>

              <div
                className="
                  mt-3 flex justify-between

                  text-sm
                  text-muted
                "
              >

                <span>{percent} Mastered</span>

                <span>Level 7</span>

              </div>

            </div>

          ))}

        </div>

        {/* QUIZ HISTORY */}
        <div
          className={`
            col-span-12 xl:col-span-7

            rounded-[5px]
            border

            ${cardBorder}
            ${cardBg}

            p-8

            shadow-[0_20px_60px_rgba(0,0,0,0.15)]

            backdrop-blur-xl
          `}
        >

          <h2 className="mb-8 text-3xl font-black">
            Quiz History
          </h2>

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
                  flex items-center justify-between

                  rounded-[5px]

                  ${isDark
                    ? "bg-blue-500/10"
                    : "bg-blue-500/20"}

                  p-5

                  transition-all duration-300

                  hover:bg-blue-500/10
                `}
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center

                      rounded-[5px]

                      bg-blue-500/10
                      text-blue-500
                    "
                  >

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

                  <h3
                    className="
                      text-xl
                      font-black
                      text-blue-500
                    "
                  >
                    {score}
                  </h3>

                  <p
                    className="
                      text-xs
                      uppercase
                      text-muted
                    "
                  >
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

            rounded-[5px]
            border

            ${cardBorder}
            ${cardBg}

            p-8

            shadow-[0_20px_60px_rgba(0,0,0,0.15)]

            backdrop-blur-xl
          `}
        >

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

                  <span className="text-blue-500">
                    {label}
                  </span>

                </div>

                <div
                  className={`
                    h-3 overflow-hidden

                    rounded-[5px]

                    ${isDark
                      ? "bg-white/5"
                      : "bg-muted"}
                  `}
                >

                  <div
                    className="
                      h-full

                      rounded-[5px]

                      bg-gradient-to-r
                      from-blue-500
                      to-cyan-400
                    "
                    style={{ width: `${width}%` }}
                  />

                </div>

              </div>

            ))}

          </div>

          {/* AI TIP */}
          <div
            className="
              mt-10

              rounded-[5px]

              border border-blue-500/10
              bg-blue-500/5

              p-5
            "
          >

            <div className="flex gap-4">

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center

                  rounded-[5px]

                  bg-blue-500/10
                  text-blue-500
                "
              >

                <span className="material-symbols-outlined">
                  auto_awesome
                </span>

              </div>

              <p
                className="
                  text-sm
                  leading-7
                  text-muted
                "
              >
                Focus on Lambda cold-start optimization
                to reach Elite Tier Architect status.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;