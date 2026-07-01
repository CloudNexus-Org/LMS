import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import {
  STUDENT_COURSES_FOR_REVIEW,
  deleteCourseReview,
  getReviewStats,
  loadStudentReviews,
  upsertCourseReview,
} from "@/data/courseReviews";
import useAuthStore from "@/store/useAuthStore";
import { deleteReview, fetchMyReviews, submitReview, updateReview } from "@/lib/api/reviewApi";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const FILTERS = [
  { id: "all", label: "All courses" },
  { id: "pending", label: "Pending" },
  { id: "reviewed", label: "Reviewed" },
];

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

function StarPicker({ value, onChange, size = "md" }) {
  const [hover, setHover] = useState(0);
  const iconSize = size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <div className="flex flex-wrap items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          aria-label={`Rate ${star} stars`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-md p-0.5 text-warning transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Star
            className={`${iconSize} ${
              star <= (hover || value) ? "fill-warning text-warning" : "text-muted/40"
            }`}
          />
        </motion.button>
      ))}
      {(hover || value) > 0 && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-2 text-xs font-semibold text-muted"
        >
          {RATING_LABELS[hover || value]}
        </motion.span>
      )}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${iconSize} ${i < rating ? "fill-warning text-warning" : "text-muted/30"}`}
        />
      ))}
    </div>
  );
}

export default function CourseReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [reviews, setReviews] = useState(() => loadStudentReviews());
  const [filter, setFilter] = useState("all");
  const [activeCourse, setActiveCourse] = useState(null);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    if (!user?.id || !token) return;
    fetchMyReviews(user, token)
      .then((list) => {
        if (!list?.length) return;
        const mapped = {};
        list.forEach((r) => {
          const courseId = r.courseId;
          if (courseId != null) {
            mapped[courseId] = {
              courseId,
              rating: r.rating,
              title: r.title,
              body: r.body || r.comment,
              createdAt: r.createdAt,
              helpful: r.helpful ?? 0,
              reviewId: r.id,
            };
          }
        });
        setReviews((prev) => ({ ...prev, ...mapped }));
      })
      .catch(() => {});
  }, [user?.id, token]);

  const stats = useMemo(() => getReviewStats(reviews, STUDENT_COURSES_FOR_REVIEW), [reviews]);

  const filteredCourses = useMemo(() => {
    return STUDENT_COURSES_FOR_REVIEW.filter((course) => {
      const hasReview = Boolean(reviews[course.id]);
      if (filter === "pending") return !hasReview;
      if (filter === "reviewed") return hasReview;
      return true;
    });
  }, [filter, reviews]);

  const openReviewForm = (course) => {
    const existing = reviews[course.id];
    setActiveCourse(course);
    setForm({
      rating: existing?.rating ?? 0,
      title: existing?.title ?? "",
      body: existing?.body ?? "",
    });
  };

  const closeForm = () => {
    setActiveCourse(null);
    setForm({ rating: 0, title: "", body: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeCourse || form.rating < 1 || !form.title.trim() || !form.body.trim()) return;

    const next = upsertCourseReview(reviews, activeCourse.id, form);
    setReviews(next);

    if (user?.id && token) {
      const existing = reviews[activeCourse.id];
      const body = { rating: form.rating, title: form.title, body: form.body };
      try {
        if (existing?.reviewId) {
          await updateReview(user, token, existing.reviewId, body);
        } else {
          await submitReview(user, token, activeCourse.id, body);
        }
      } catch {
        /* keep local state */
      }
    }

    setSuccessId(activeCourse.id);
    closeForm();
    setTimeout(() => setSuccessId(null), 2500);
  };

  const handleDelete = async (courseId) => {
    const existing = reviews[courseId];
    setReviews(deleteCourseReview(reviews, courseId));
    if (user?.id && token && existing?.reviewId) {
      deleteReview(user, token, existing.reviewId).catch(() => {});
    }
  };

  return (
    <motion.div
      className="dashboard-page review-page mx-auto w-full max-w-[1320px] space-y-3 sm:space-y-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="dashboard-analytics-bar" variants={item}>
        <div className="dashboard-analytics-intro min-w-0">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Course reviews
          </span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Rate your <span className="text-primary">learning</span> experience
          </p>
          <p className="dashboard-greeting-sub">
            Share star ratings and written feedback on courses — like Udemy and Coursera.
          </p>
        </div>
      </motion.section>

      <motion.section variants={item} className="profile-stats-wrap">
        <div className="profile-stats-scroll profile-stats-6 notif-stats-grid">
          {[
            { label: "Reviews given", value: stats.reviewedCount, sub: "Published", icon: MessageSquare, accent: "profile-kpi-primary" },
            { label: "Pending", value: stats.pendingCount, sub: "Awaiting feedback", icon: BookOpen, accent: "profile-kpi-warning" },
            { label: "Your avg. rating", value: stats.avgRating || "—", sub: "Stars given", icon: Star, accent: "profile-kpi-success" },
            { label: "Helpful votes", value: stats.totalHelpful, sub: "From community", icon: ThumbsUp, accent: "profile-kpi-accent" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`profile-stat-card ${stat.accent}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.35, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <div className={`profile-stat-icon ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="profile-stat-value">{stat.value}</p>
                  <p className="profile-stat-label">{stat.label}</p>
                  <p className="profile-stat-sub">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.div variants={item} className="profile-tabs-shell dashboard-card">
        <div className="profile-tabs-scroll notif-filters" role="tablist" aria-label="Filter reviews">
          {FILTERS.map((tab) => {
            const count =
              tab.id === "all"
                ? STUDENT_COURSES_FOR_REVIEW.length
                : tab.id === "pending"
                  ? stats.pendingCount
                  : stats.reviewedCount;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`profile-tab relative ${filter === tab.id ? "profile-tab-active" : ""}`}
              >
                {filter === tab.id && (
                  <motion.span
                    layoutId="review-tab-bg"
                    className="profile-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-[1]">{tab.label}</span>
                <span className="notif-filter-count relative z-[1]">{count}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.section variants={item} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length === 0 ? (
            <motion.div
              key="empty"
              className="review-empty dashboard-card md:col-span-2 xl:col-span-3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <CheckCircle2 className="h-10 w-10 text-success" />
              <h3 className="mt-3 text-base font-bold text-text">All caught up!</h3>
              <p className="mt-1 text-sm text-muted">No courses in this filter.</p>
            </motion.div>
          ) : (
            filteredCourses.map((course, i) => {
              const review = reviews[course.id];
              const isSuccess = successId === course.id;

              return (
                <motion.article
                  key={course.id}
                  layout
                  className={`review-card dashboard-card overflow-hidden ${isSuccess ? "review-card-success" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-36 overflow-hidden sm:h-40">
                    <img src={course.image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-md bg-surface/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text backdrop-blur-sm">
                      {course.status === "completed" ? "Completed" : `${course.progress}% done`}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-text">{course.title}</h3>
                    <p className="mt-1 text-xs text-muted">{course.instructor}</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span>{course.platformRating} course avg.</span>
                      </div>
                    </div>

                    {review ? (
                      <div className="mt-3 rounded-xl border border-border bg-bg/50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <StarDisplay rating={review.rating} />
                          <button
                            type="button"
                            onClick={() => handleDelete(course.id)}
                            className="text-muted transition-colors hover:text-danger"
                            aria-label="Delete review"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-2 text-xs font-bold text-text">{review.title}</p>
                        <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-muted">{review.body}</p>
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted">
                          <ThumbsUp className="h-3 w-3" />
                          {review.helpful} found helpful
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-muted">Share how this course helped you learn.</p>
                    )}

                    <motion.button
                      type="button"
                      onClick={() => openReviewForm(course)}
                      whileTap={{ scale: 0.97 }}
                      className={`review-cta mt-4 ${review ? "review-cta-outline" : "review-cta-primary"}`}
                    >
                      {review ? "Edit review" : "Write a review"}
                    </motion.button>
                  </div>
                </motion.article>
              );
            })
          )}
        </AnimatePresence>
      </motion.section>

      {/* Review modal */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div
            className="review-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
          >
            <motion.div
              className="review-modal dashboard-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Rate this course</p>
                  <h2 className="mt-1 truncate text-lg font-bold text-text">{activeCourse.title}</h2>
                  <p className="text-xs text-muted">{activeCourse.instructor}</p>
                </div>
                <button type="button" onClick={closeForm} className="text-muted hover:text-text" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
                <div>
                  <p className="mb-2 text-xs font-semibold text-text">Your rating</p>
                  <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} size="lg" />
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-text">Review title</span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="review-input"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-text">Your review</span>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="What did you like? What could be improved?"
                    rows={4}
                    maxLength={800}
                    className="review-input resize-none"
                    required
                  />
                  <span className="mt-1 block text-right text-[10px] text-muted">{form.body.length}/800</span>
                </label>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeForm} className="review-cta review-cta-outline">
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={form.rating < 1 || !form.title.trim() || !form.body.trim()}
                    whileTap={{ scale: 0.97 }}
                    className="review-cta review-cta-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Publish review
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
