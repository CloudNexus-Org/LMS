import { useState, useEffect } from "react";

import {
  BookOpen,
  CheckCircle,
  Users,
  Star,
  Clock3,
  Layers3,
} from "lucide-react";

import useIsDarkTheme from "@/hooks/useIsDarkTheme";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";

const MOCK_COURSES = [
  {
    id: 1,
    title: "AWS Solution Architect",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
    progress: 65,
    status: "in-progress",
    totalLessons: 42,
    completedLessons: 27,
    badge: "Intermediate",
    badgeColor: "bg-cyan-500/10 text-cyan-300",
    instructor: "Dr. Arjan Singh",
    rating: "4.8",
    duration: "24 Hours",
    modules: "12 Modules",
    students: "15.4k",
    description:
      "Master EC2, S3, and Lambda to build highly scalable and fault-tolerant cloud infrastructures.",
  },

  {
    id: 2,
    title: "Azure Generative AI ",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
    progress: 100,
    status: "completed",
    totalLessons: 50,
    completedLessons: 50,
    badge: "Advanced",
    badgeColor: "bg-violet-500/10 text-violet-300",
    instructor: "Sarah Jenkins",
    rating: "4.9",
    duration: "18 Hours",
    modules: "9 Modules",
    students: "5k",
    description:
      "Dive deep into generative models, neural networks, and the future of machine learning integration on Azure.",
  },

  {
    id: 3,
    title: "Modern JavaScript",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    progress: 12,
    status: "in-progress",
    totalLessons: 30,
    completedLessons: 4,
    badge: "Beginner",
    badgeColor: "bg-blue-500/10 text-blue-300",
    instructor: "Prof. David Miller",
    rating: "4.7",
    duration: "30 Hours",
    modules: "15 Modules",
    students: "12k",
    description:
      "Build robust frontend applications with ES6+, asynchronous patterns, and scalable architectural techniques.",
  },
];

export default function MyCoursesPage() {

  const isDarkTheme = useIsDarkTheme();

  const [filter, setFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);

  const [courses, setCourses] = useState([]);

  useEffect(() => {

    const timer = setTimeout(() => {

      setCourses(MOCK_COURSES);

      setIsLoading(false);

    }, 1200);

    return () => clearTimeout(timer);

  }, []);

  const filteredCourses = courses.filter((course) =>
    filter === "all"
      ? true
      : course.status === filter
  );

  return (
    <div
      className="
        mx-auto max-w-7xl
        space-y-8
        animate-in fade-in slide-in-from-bottom-4 duration-500
      "
    >

      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1
            className="
              text-4xl
              font-black
              tracking-[-0.04em]
              text-text
            "
          >
            My Courses
          </h1>

          <p className="mt-2 text-muted text-lg">
            Pick up right where you left off.
          </p>

        </div>

        {/* FILTERS */}
        <div
          className="
            flex items-center gap-2
            overflow-x-auto
            rounded-[5px]
            border border-border
            bg-surface
            p-2
            shadow-sm
          "
        >

          {["all", "in-progress", "completed"].map((f) => (

            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                whitespace-nowrap
                rounded-[5px]
                px-5 py-3
                text-[13px]
                font-bold
                capitalize
                transition-all duration-300

                ${
                  filter === f
                    ? "bg-text text-bg shadow-md"
                    : "text-muted hover:bg-bg hover:text-text"
                }
              `}
            >

              {f.replace("-", " ")}

            </button>

          ))}

        </div>

      </div>

      {/* CONTENT */}
      {isLoading ? (

        <DashboardGridSkeleton cards={4} />

      ) : filteredCourses.length === 0 ? (

        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            filter === "all"
              ? "You haven't enrolled in any courses yet."
              : `You don't have any ${filter} courses right now.`
          }
          actionLabel="Browse Courses"
          onAction={() => (window.location.href = "/tracks")}
        />

      ) : (

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          {filteredCourses.map((course) => (

            <div
              key={course.id}
              className="
                group relative overflow-hidden

                rounded-[5px]

                p-4

                transition-all duration-500

                hover:-translate-y-1
              "
              style={{
                backgroundColor: isDarkTheme ? "#0b1220" : "#ffffff",
                borderColor: isDarkTheme ? "black" : "#e5e7eb",
                border: "1px solid",
                boxShadow: isDarkTheme
                  ? "0 16px 40px rgba(0, 15, 42, 0.35)"
                  : "0 20px 60px rgba(0, 0, 0, 0.08)",
              }}
            >

              {/* IMAGE */}
              <div
                className="
                  relative h-[240px]
                  overflow-hidden
                  rounded-[5px]
                "
              >

                <img
                  src={course.image}
                  alt={course.title}
                  className="
                    h-full w-full
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0

                    bg-gradient-to-t
                    from-black/60
                    via-black/10
                    to-transparent
                  "
                />

                {/* BADGE */}
                <div
                  className={`
                    absolute right-4 top-4

                    rounded-full

                    px-2 py-1

                    text-[11px]
                    font-bold

                    uppercase
                    tracking-[0.2em]

                    backdrop-blur-xl

                    ${course.badgeColor}
                  `}
                >

                  {course.badge}

                </div>

              </div>

              {/* CONTENT */}
              <div className="pt-5">

                <h3
                  className="
                    text-[22px]
                    font-black

                    tracking-[-0.03em]
                  "
                  style={{
                    color: isDarkTheme ? "#ffffff" : "#172554",
                  }}
                >
                  {course.title}
                </h3>

                <p
                  className="
                    mt-2

                    text-[13px]

                    font-semibold

                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color: isDarkTheme ? "#60a5fa" : "#1d4ed8",
                  }}
                >
                  BY {course.instructor}
                </p>

                {/* STATS */}
                <div className="mt-6 flex flex-wrap items-center gap-3">

                  <div
                    className="
                      inline-flex items-center gap-2

                      rounded-[5px]

                      px-3 py-2
                    "
                    style={{
                      backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#ffffff",
                      borderColor: isDarkTheme ? "rgba(148, 163, 184, 0.15)" : "#e5e7eb",
                      border: "1px solid",
                    }}
                  >

                    <Star
                      size={14}
                      className="fill-blue-500 text-blue-500"
                    />

                    <span
                      className="
                        text-[14px]
                        font-bold
                      "
                      style={{
                        color: isDarkTheme ? "#f8fafc" : "#0f172a",
                      }}
                    >
                      {course.rating}
                    </span>

                  </div>

                  <div
                    className="
                      inline-flex items-center gap-2

                      rounded-[5px]

                      px-3 py-2
                    "
                    style={{
                      backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#ffffff",
                      borderColor: isDarkTheme ? "rgba(148, 163, 184, 0.15)" : "#e5e7eb",
                      border: "1px solid",
                    }}
                  >

                    <Clock3
                      size={14}
                      className="text-gray-400"
                    />

                    <span
                      className="text-[14px]"
                      style={{
                        color: isDarkTheme ? "#e2e8f0" : "#0f172a",
                      }}
                    >
                      {course.duration}
                    </span>

                  </div>

                  <div
                    className="
                      inline-flex items-center gap-2

                      rounded-[5px]

                      px-3 py-2
                    "
                    style={{
                      backgroundColor: isDarkTheme ? "rgba(255,255,255,0.03)" : "#ffffff",
                      borderColor: isDarkTheme ? "rgba(148, 163, 184, 0.15)" : "#e5e7eb",
                      border: "1px solid",
                    }}
                  >

                    <Layers3
                      size={14}
                      className="text-gray-400"
                    />

                    <span
                      className="text-[14px]"
                      style={{
                        color: isDarkTheme ? "#e2e8f0" : "#0f172a",
                      }}
                    >
                      {course.modules}
                    </span>

                  </div>

                </div>

                {/* DESCRIPTION */}
                <p
                  className="
                    mt-6

                    text-[16px]
                    leading-8

                    line-clamp-3
                  "
                  style={{
                    color: isDarkTheme ? "#cbd5e1" : "#374151",
                  }}
                >
                  "{course.description}"
                </p>

                {/* PROGRESS SECTION */}
                <div className="mt-7">

                  {/* TOP */}
                  <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      {course.status === "completed" ? (

                        <div
                          className="
                            inline-flex items-center gap-2

                            rounded-full

                            bg-emerald-500/10

                            px-3 py-1.5

                            text-[11px]
                            font-bold

                            uppercase
                            tracking-[0.15em]

                            text-emerald-600
                          "
                        >

                          <CheckCircle size={13} />

                          Completed

                        </div>

                      ) : (

                        <div
                          className="
                            inline-flex items-center gap-2

                            rounded-full

                            bg-blue-500/10

                            px-3 py-1.5

                            text-[11px]
                            font-bold

                            uppercase
                            tracking-[0.15em]

                            text-blue-600
                          "
                        >

                          <BookOpen size={13} />

                          {course.progress}% In Progress

                        </div>

                      )}

                    </div>

                    <span
                      className="
                        text-[13px]
                        font-semibold
                      "
                      style={{
                        color: isDarkTheme ? "#cbd5e1" : "#64748b",
                      }}
                    >
                      {course.completedLessons}/{course.totalLessons} Lessons
                    </span>

                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    className="
                      h-3

                      overflow-hidden

                      rounded-full

                      bg-gray-200
                    "
                  >

                    <div
                      className={`
                        h-full rounded-full

                        transition-all duration-700

                        ${
                          course.status === "completed"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : "bg-gradient-to-r from-blue-600 to-blue-400"
                        }
                      `}
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />

                  </div>

                </div>  

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}