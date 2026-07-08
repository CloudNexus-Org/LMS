import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";
import { DashboardGridSkeleton } from "@/components/ui/Skeletons";
import { getResumeUrlForCourse } from "@/features/learn/learningSession";
import useAuthStore from "@/store/useAuthStore";
import { fetchMyEnrollments } from "@/lib/api/enrollmentApi";
import { formatRatingValue, resolveCourseRating } from "@/lib/course/courseStats";
import { PartialStar } from "@/components/courses/CourseRatingStars";

const EASE = [0.16, 1, 0.3, 1];

const CARD_VARIANTS = [
  {
    accent: "from-primary/25",
    glow: "group-hover:shadow-[0_28px_60px_rgba(139,97,210,0.18)]",
    ring: "group-hover:ring-primary/20",
  },
  {
    accent: "from-accent/25",
    glow: "group-hover:shadow-[0_28px_60px_rgba(124,58,237,0.16)]",
    ring: "group-hover:ring-accent/20",
  },
  {
    accent: "from-success/20",
    glow: "group-hover:shadow-[0_28px_60px_rgba(5,150,105,0.14)]",
    ring: "group-hover:ring-success/20",
  },
];

const DIFFICULTY_STYLES = {
  Beginner: "bg-success/15 text-success border-success/25",
  Intermediate: "bg-primary-soft text-primary border-primary/25",
  Advanced: "bg-accent-soft text-accent border-accent/25",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];


function CourseRatingBadge({ course }) {
  const { rating, hasReviews } = resolveCourseRating(course);
  if (!hasReviews) {
    return (
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
        <PartialStar rating={0} size={12} />
        <span className="text-[11px] font-semibold text-white/70">New</span>
      </div>
    );
  }
  return (
    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
      <PartialStar rating={rating} size={12} />
      <span className="text-[12px] font-bold text-white">{formatRatingValue(rating)}</span>
    </div>
  );
}

function MyCourseCard({ course, index }) {
  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const difficultyStyle =
    DIFFICULTY_STYLES[course.badge] || DIFFICULTY_STYLES.Intermediate;
  const isCompleted = course.status === "completed";

  return (
    <motion.article
      className="group h-full"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div
        className={`
          relative flex h-full flex-col overflow-hidden
          rounded-lg border border-border/70 bg-surface/90
          ring-1 ring-transparent backdrop-blur-xl
          shadow-[var(--shadow-card-value)]
          transition-all duration-500
          hover:border-primary/25
          ${variant.glow} ${variant.ring}
        `}
      >
        <div
          className="
            absolute inset-x-0 top-0 z-10 h-[3px]
            scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent
            transition-transform duration-500 group-hover:scale-x-100
          "
          aria-hidden
        />

        <div
          className={`
            pointer-events-none absolute -right-8 -top-8
            h-36 w-36 rounded-full bg-gradient-to-br ${variant.accent} to-transparent
            blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100
          `}
          aria-hidden
        />

        <div className="relative p-3 pb-0">
          <div className="relative h-[150px] overflow-hidden rounded-lg bg-elevated">
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

            <div
              className={`
                absolute right-3 top-3 inline-flex items-center gap-1.5
                rounded-lg border px-2.5 py-1
                text-[10px] font-bold uppercase tracking-[0.14em]
                backdrop-blur-md
                ${difficultyStyle}
              `}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {course.badge}
            </div>

            <CourseRatingBadge course={course} />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <div>
            <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-text transition-colors duration-300 group-hover:text-primary line-clamp-2">
              {course.title}
            </h3>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              By {course.instructor}
            </p>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {[
              { icon: Clock3, label: course.duration },
              { icon: Layers3, label: course.modules },
              {
                icon: isCompleted ? CheckCircle2 : BookOpen,
                label: isCompleted ? "Done" : `${course.progress}%`,
              },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="
                  flex flex-col items-center gap-0.5 rounded-lg
                  border border-border/50 bg-elevated/70 px-1.5 py-1.5
                  transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary-soft/40
                "
              >
                <Icon size={12} className="text-primary" strokeWidth={2.5} />
                <span className="text-center text-[9px] font-semibold leading-tight text-text">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2.5">
            <div className="mb-1 flex items-center justify-between text-[9px] font-medium">
              <span className="text-muted">Progress</span>
              <span className={isCompleted ? "text-success" : "text-primary"}>
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-primary-soft">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCompleted
                    ? "bg-gradient-to-r from-success to-success/80"
                    : "bg-gradient-to-r from-primary to-primary-hover"
                }`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-muted line-clamp-1">
            {course.description}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-success/25 bg-success/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-success">
                <CheckCircle2 size={11} />
                Done
              </span>
            ) : (
              <span className="text-[11px] text-muted">
                <span className="font-semibold text-primary">{course.progress}%</span>
              </span>
            )}

            <Link
              to={getResumeUrlForCourse(course)}
              className="
                inline-flex h-8 shrink-0 items-center justify-center gap-1
                rounded-lg bg-primary px-3.5
                text-[12px] font-semibold text-white
                transition-all duration-300
                hover:bg-primary-hover
              "
            >
              {isCompleted ? "Review" : "Continue"}
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user?.id || !token) {
      setCourses([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchMyEnrollments(user, token)
      .then((data) => setCourses(data || []))
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, [user?.id, token, location.pathname, location.key]);

  const filteredCourses = courses.filter((course) =>
    filter === "all" ? true : course.status === filter
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
            My Learning
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Pick up right where you left off.
          </p>
          <Link
            to="/student/catalog"
            className="mt-3 inline-flex items-center justify-center text-[14px] font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Browse new courses
          </Link>
        </div>

        <div className="flex gap-2">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`
                rounded-lg px-4 py-2 text-[13px] font-medium capitalize
                transition-colors
                ${
                  filter === id
                    ? "bg-primary text-white"
                    : "border border-border text-muted hover:text-text"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <DashboardGridSkeleton cards={7} />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            filter === "all"
              ? "You haven't enrolled in any courses yet."
              : `You don't have any ${filter.replace("-", " ")} courses right now.`
          }
          actionLabel="Browse Courses"
          onAction={() => navigate("/student/catalog")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course, index) => (
              <MyCourseCard
                key={`${course.courseId ?? course.id}-${course.id}`}
                course={course}
                index={index}
              />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link
              to="/student/catalog"
              className="
                inline-flex items-center justify-center rounded-lg
                border border-border px-6 py-2.5
                text-[14px] font-medium text-text
                transition-colors hover:border-primary hover:text-primary
              "
            >
              Browse more courses
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
