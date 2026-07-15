import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ListChecks,
  Sparkles,
  Trophy,
  Clock3,
} from "lucide-react";
import { getBestAttempt, loadMentorQuizzes } from "@/data/quizzes";
import { getEnrolledTrackIds } from "@/lib/student/studentMappers";
import useStudentEnrollments from "@/hooks/useStudentEnrollments";

const EASE = [0.16, 1, 0.3, 1];

export default function PracticeQuizzesPage() {
  const { loading, enrollments } = useStudentEnrollments();
  const trackIds = useMemo(() => getEnrolledTrackIds(enrollments), [enrollments]);

  const quizzes = useMemo(() => {
    if (!trackIds.length) return [];
    const enrolled = new Set(trackIds);
    return loadMentorQuizzes().filter((q) => enrolled.has(q.trackId));
  }, [trackIds]);

  const stats = useMemo(() => {
    const attempted = quizzes.filter((q) => getBestAttempt(q.id)).length;
    const scores = quizzes
      .map((q) => getBestAttempt(q.id)?.score)
      .filter((s) => s != null);
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    return { attempted, avg, total: quizzes.length };
  }, [quizzes]);

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-[1200px] space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <section className="dashboard-analytics-bar">
        <div className="min-w-0">
          <span className="dashboard-pill">
            <ListChecks className="h-3 w-3" />
            Practice quizzes
          </span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Test your <span className="text-primary">knowledge</span>
          </p>
          <p className="dashboard-greeting-sub">
            Quizzes for your enrolled tracks only — unlimited attempts, instant feedback.
          </p>
        </div>
        <div className="dashboard-analytics-metrics">
          <div className="dashboard-analytics-metric">
            <ListChecks className="h-4 w-4 text-primary" />
            <div>
              <span className="dashboard-metric-value">{stats.total}</span>
              <span className="dashboard-metric-label">Available</span>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Trophy className="h-4 w-4 text-success" />
            <div>
              <span className="dashboard-metric-value">{stats.attempted}</span>
              <span className="dashboard-metric-label">Attempted</span>
            </div>
          </div>
          <div className="dashboard-analytics-metric">
            <Sparkles className="h-4 w-4 text-accent" />
            <div>
              <span className="dashboard-metric-value">{stats.avg || "—"}%</span>
              <span className="dashboard-metric-label">Avg. score</span>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <p className="text-center text-sm text-muted">Loading your courses…</p>
      ) : !trackIds.length ? (
        <div className="dashboard-card p-8 text-center">
          <p className="text-base font-semibold text-text">No quizzes yet</p>
          <p className="mt-1 text-sm text-muted">
            Enroll in a course to unlock practice quizzes for that track.
          </p>
          <Link
            to="/student/catalog"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz, i) => {
            const best = getBestAttempt(quiz.id);
            return (
              <motion.article
                key={quiz.id}
                className="review-card dashboard-card p-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {quiz.trackName}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold text-text">{quiz.title}</h3>
                  </div>
                  {best ? (
                    <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">
                      {best.score}%
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] text-muted">
                  {quiz.courseTitle || quiz.trackName} — practice test
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <ListChecks className="h-3.5 w-3.5" />
                    {quiz.questions?.length ?? 0} questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : "Untimed"}
                  </span>
                </div>
                <Link
                  to={`/learn/${quiz.trackId}/quiz/${quiz.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-white hover:bg-primary-hover"
                >
                  {best ? "Retake quiz" : "Start quiz"}
                </Link>
              </motion.article>
            );
          })}
        </section>
      )}
    </motion.div>
  );
}
