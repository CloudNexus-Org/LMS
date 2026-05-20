import React from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {/* HERO */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="dashboard-fade-up space-y-4 lg:col-span-2">
          <h2
            className="
              text-4xl font-extrabold
              leading-tight tracking-tight
              text-text
              md:text-5xl
            "
          >
            Welcome back,{" "}
            <span className="text-primary">
              Kunal
            </span>
            .
          </h2>

          <p
            className="
              max-w-2xl
              text-base leading-8
              text-muted
              md:text-lg
            "
          >
            You've completed 72% of your current module.
            Your mentor uploaded a new critique of your
            parametric facade design.
          </p>
        </div>

{/* STREAK */}
<div
  className="
    static-dashboard-card
    dashboard-scale

    relative overflow-hidden
    rounded-3xl

    p-8
    h-fit
  "
>
  {/* GLOW */}
  <div
    className="
      absolute -right-10 -top-10
      h-32 w-32 rounded-full
      bg-primary/10 blur-3xl
    "
  />

  <div className="relative z-10">
    <div className="flex items-start justify-between">
      <div>
        <h3
          className="
            text-lg font-semibold
            text-primary
          "
        >
          Weekly Streak
        </h3>

        <h2
          className="
            mt-2
            text-5xl font-black
            tracking-tight
            text-text
          "
        >
          14 Days
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border border-primary/10
          bg-primary/10
          px-3 py-2
          text-xs font-semibold
          text-primary
        "
      >
        +18%
      </div>
    </div>

    {/* CHART */}
    <div className="mt-10 flex h-40 items-end gap-3">
      {[
        { day: "M", h: "45%" },
        { day: "T", h: "65%" },
        { day: "W", h: "95%" },
        { day: "T", h: "70%" },
        { day: "F", h: "82%" },
      ].map((item) => (
        <div
          key={item.day + item.h}
          className="flex flex-1 flex-col items-center gap-3"
        >
          <div
            className="
              relative flex w-full items-end
              overflow-hidden rounded-full
              bg-surface/80
            "
            style={{ height: "120px" }}
          >
            <div
              className={`
                absolute bottom-0 w-full rounded-full
                transition-all duration-500
                ${
                  item.day === "W"
                    ? "bg-primary shadow-[0_0_25px_hsl(var(--primary)/0.45)]"
                    : "bg-primary/35"
                }
              `}
              style={{ height: item.h }}
            />
          </div>

          <span
            className={`
              text-xs font-bold
              ${
                item.day === "W"
                  ? "text-primary"
                  : "text-muted"
              }
            `}
          >
            {item.day}
          </span>
        </div>
      ))}
    </div>

    {/* BOTTOM CARD */}
    <div
      className="
        mt-8
        rounded-2xl
        border border-primary/10
        bg-primary/5
        p-4
      "
    >
      <p className="text-sm leading-6 text-muted">
        You performed{" "}
        <span className="font-bold text-primary">
          better than 82%
        </span>{" "}
        of active students this week.
      </p>
    </div>
  </div>
</div>
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-12 ">
        {/* LESSON */}
        <div
          className="
            static-dashboard-card
            dashboard-hover

            relative min-h-[420px]
            overflow-hidden rounded-[5px]

            md:col-span-8 md:-mt-72
          "
        >
          <img
            className="
              absolute left-0
              rounded-[5px] 
              h-[65%] w-full
              object-cover
              opacity-30
            "
            src="https://www.shutterstock.com/image-photo/close-businessman-hand-using-polygonal-260nw-2466905937.jpg"
            alt="lesson"
          />

          {/* OVERLAY */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-background
              via-background/60
              to-transparent
            "
          />

          <div
            className="
           relative z-10
flex h-full flex-col justify-start
p-8 md:p-10
            "
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="
                  rounded-full
                  border border-primary/20
                  bg-primary/10

                  px-3 py-1

                  text-[11px]
                  font-bold uppercase
                  tracking-[0.2em]

                  text-primary
                "
              >
                Next Lesson
              </span>

              <span className="text-xs text-muted">
                12 min read
              </span>
            </div>

            <h3
              className="
                mb-4
                text-3xl font-black
                leading-tight
                text-text
              "
            >
              Mastering Generative Space Design
            </h3>

            <p
              className="
                mb-8 max-w-2xl
                leading-8
                text-muted
              "
            >
              Explore the intersection of algorithmic logic
              and human ergonomics in contemporary urban planning.
            </p>

            <button
              onClick={() => navigate("/lesson")}
              className="
                flex w-fit items-center gap-3

                rounded-2xl
                bg-primary

                px-8 py-4

                font-bold
                text-white

                shadow-[0_10px_30px_hsl(var(--primary)/0.35)]

                transition-all duration-300
                hover:translate-y-[-2px]
              "
            >
              Start Learning

              <span className="material-symbols-outlined">
                play_arrow
              </span>
            </button>
          </div>
        </div>

        {/* CURRICULUM */}
        <div
          className="
            static-dashboard-card
            dashboard-hover

            rounded-3xl
            p-8

            md:col-span-4
          "
        >
          <div className="mb-8 flex items-center justify-between">
            <h3
              className="
                text-xl font-bold
                text-text
              "
            >
              Curriculum
            </h3>

            <span className="material-symbols-outlined text-muted">
              more_horiz
            </span>
          </div>

          <div className="space-y-6">
            {[
              ["Urban Planning 101", "85%"],
              ["Structural Integrity", "42%"],
              ["Sustainable Materials", "18%"],
            ].map(([title, pct]) => (
              <div key={title} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text">
                    {title}
                  </span>

                  <span className="text-primary">
                    {pct}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;