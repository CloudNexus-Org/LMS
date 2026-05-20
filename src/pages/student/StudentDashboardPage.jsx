import {
  Play,
  Sparkles,
  CalendarDays,
  ArrowRight,
  Trophy,
  Star,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">

      {/* DARK MODE GLOW */}
      <div
        className="
          hidden dark:block
          pointer-events-none absolute
          left-1/2 top-0
          h-[500px] w-[500px]
          -translate-x-1/2
          rounded-full
         
          blur-[140px]
        "
      />



      <div className="relative z-10 w-full space-y-8 px-2 sm:px-4 lg:px-6 pt-1">

        {/* TOP HERO */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

          {/* LEFT */}
          <div className="xl:col-span-2">

            <h1
              className="
                text-[42px]
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
                text-[15px]
                leading-8
                text-muted
              "
            >
              You’ve completed 72% of your current module.
              Your mentor uploaded a new critique of your
              parametric facade design.
            </p>

          </div>

          {/* STREAK CARD */}
          <div
            className="
              relative overflow-hidden
              rounded-[5px]
              border border-gray-200 dark:border-border
              bg-white dark:bg-elevated/80
              p-6
              shadow-sm
            "
          >

            <div
              className="
                absolute right-[-30px] bottom-[-30px]
                text-blue-500/10
              "
            >
              <Trophy size={120} />
            </div>

            <p className="text-sm font-semibold text-muted">
              Weekly Streak
            </p>

            <h2 className="mt-3 text-[44px] font-black leading-none">
              14 Days
            </h2>

            <div className="mt-6 flex gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-primary text-white font-bold">
                M
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[5px]  bg-primary text-white font-bold">
                T
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-primary text-white font-bold">
                W
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-bg text-muted font-bold border border-gray-200 dark:border-border">
                T
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-bg text-muted font-bold border border-gray-200 dark:border-border">
                F
              </div>

            </div>

          </div>

        </section>

        {/* MAIN GRID */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          {/* BIG CARD */}
          <div className="xl:col-span-8">

            <div
              className="
                group relative overflow-hidden
                rounded-[5px]
                
                min-h-[420px]
              "
            >

              {/* IMAGE */}
              <div className="absolute inset-0">

                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
                  alt="Learning"
                  className="
                    h-full w-full object-cover
                    opacity-100 dark:opacity-20
                    transition duration-700
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute inset-0
                  
                  "
                />

              </div>

              <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-8">

                <div className="mb-4 flex items-center gap-3">

                  <span
                    className="
                      rounded-full
                      border border-primary/20
                      bg-primary/10
                      px-4 py-2
                      text-[11px]
                      font-bold
                      uppercase tracking-[0.18em]
                      text-primary
                    "
                  >
                    Next Lesson
                  </span>

                  <span className="text-xs text-muted">
                    12 min read
                  </span>

                </div>

                <h2
                  className="
                    max-w-2xl
                    text-[42px]
                    font-black
                    leading-tight
                    tracking-[-0.04em]
                  "
                >
                  Mastering Generative Space Design
                </h2>

                <p
                  className="
                    mt-5 max-w-xl
                    text-[15px]
                    leading-8
                    text-muted
                  "
                >
                  Explore the intersection of algorithmic logic
                  and human ergonomics in contemporary urban planning.
                </p>

                <button
                  className="
                    mt-8 inline-flex w-fit items-center gap-3
                    rounded-[5px]
                    bg-primary
                    px-7 py-4
                    text-sm font-bold
                    text-white
                    transition
                    hover:-translate-y-1
                  "
                >
                  Start Learning
                  <Play size={18} />
                </button>

              </div>

            </div>

          </div>

          {/* CURRICULUM */}
          <div className="xl:col-span-4">

            <div
              className="
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <h3 className="text-[22px] font-black">
                  Curriculum
                </h3>

                <button className="text-muted">
                  ...
                </button>

              </div>

              <div className="mt-8 space-y-7">

                {[
                  {
                    title: "Urban Planning 101",
                    progress: "85%",
                    width: "85%",
                  },
                  {
                    title: "Structural Integrity",
                    progress: "42%",
                    width: "42%",
                  },
                  {
                    title: "Sustainable Materials",
                    progress: "18%",
                    width: "18%",
                  },
                ].map((item, index) => (
                  <div key={index}>

                    <div className="mb-3 flex items-center justify-between">

                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>

                      <span className="text-xs text-primary">
                        {item.progress}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-border">

                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: item.width }}
                      />

                    </div>

                  </div>
                ))}

              </div>

              {/* AI TIP */}
              <div
                className="
                  mt-10 rounded-[5px]
                  border border-gray-200 dark:border-border
                  bg-bg/70
                  p-1
                "
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-[5px]
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Sparkles size={22} />
                  </div>

                  <div>

                    <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
                      AI Mentor Tip
                    </p>

                    <p className="mt-2 text-sm leading-7 text-muted">
                      Focus on “Structural” this week
                      to hit your learning goal faster.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* BOTTOM GRID */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          {/* CERTIFICATIONS */}
          <div className="xl:col-span-5">

            <div
              className="
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-7
                shadow-sm
              "
            >

              <h3 className="text-[24px] font-black">
                Recent Certifications
              </h3>

              <div className="mt-7 space-y-5">

                {[
                  {
                    title: "BIM Excellence Level 1",
                    date: "Issued Oct 24, 2024",
                  },
                  {
                    title: "Advanced CAD Modeling",
                    date: "Issued Sep 12, 2024",
                  },
                  
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center gap-4
                      rounded-[5px]
                      border border-gray-200 dark:border-border
                      bg-bg/60
                      p-6
                      transition
                      hover:border-primary/20
                    "
                  >

                    <div
                      className="
                        flex h-12 w-12
                        items-center justify-center
                        rounded-[5px]
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Star size={20} />
                    </div>

                    <div className="flex-1">

                      <h4 className="text-sm font-bold">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-xs text-muted">
                        {item.date}
                      </p>

                    </div>

                    <ArrowRight
                      size={18}
                      className="text-muted"
                    />

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* MENTOR */}
          <div className="xl:col-span-7">

            <div
              className="
                flex flex-col gap-8
                rounded-[5px]
                border border-gray-200 dark:border-border
                bg-white dark:bg-elevated/80
                p-5
                shadow-sm
                lg:flex-row
              "
            >

              <div
                className="
                  h-[220px]
                  overflow-hidden
                  rounded-[5px]
                  lg:w-[260px]
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop"
                  alt="Mentor"
                  className="h-full w-full object-cover"
                />

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-[28px] font-black text-primary">
                      Elena Rossi
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-subtle">
                      Senior Mentor
                    </p>

                  </div>

                  <div
                    className="
                      rounded-full
                      border border-primary/20
                      bg-primary/10
                      px-4 py-2
                      text-[11px]
                      font-bold
                      uppercase tracking-[0.15em]
                      text-primary
                    "
                  >
                    New Message
                  </div>

                </div>

                <p
                  className="
                    mt-6
                    text-[15px]
                    italic leading-8
                    text-muted
                  "
                >
                  “Your use of negative space in the plaza
                  design is revolutionary, Julian. However,
                  let’s revisit the structural load before
                  you finalize the 3D model.”
                </p>

                <div className="mt-8 flex gap-4">

                  <button
                    className="
                      flex-1 rounded-[5px]
                      border border-gray-200 dark:border-border
                      bg-bg
                      py-4
                      text-sm font-bold
                      transition
                      hover:border-primary/20
                    "
                  >
                    Reply
                  </button>

                  <button
                    className="
                      flex-1 rounded-[5px]
                      bg-primary
                      py-4
                      text-sm font-bold
                      text-white
                      transition
                      hover:-translate-y-1
                    "
                  >
                    View Critique
                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* LEARNING SCHEDULE */}
        <section>

          <div className="mb-6 flex items-center justify-between">

            <h3 className="text-[28px] font-black">
              Learning Schedule
            </h3>

            <button className="text-sm font-semibold text-primary hover:underline">
              View Calendar
            </button>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                date: "Tomorrow",
                title: "Final Design Submission",
                subtitle: "Modernism Module 4",
              },
              {
                date: "In 3 Days",
                title: "Peer Review Workshop",
                subtitle: "Sustainability Cohort",
              },
              {
                date: "Nov 12",
                title: "Materials Science Quiz",
                subtitle: "Materiality Lab",
              },
              {
                date: "Nov 15",
                title: "Group Presentation",
                subtitle: "Urban Dynamics",
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
                  transition
                  hover:border-primary/20
                "
              >

                <div className="flex items-center gap-2 text-primary">

                  <CalendarDays size={16} />

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