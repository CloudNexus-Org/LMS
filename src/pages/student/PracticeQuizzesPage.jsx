import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ListChecks,
  Sparkles,
  Trophy,
  ArrowRight,
  Clock3,
} from "lucide-react";
import { getAllPracticeQuizzes, getBestAttempt } from "@/data/quizzes";

const EASE = [0.16, 1, 0.3, 1];

export default function PracticeQuizzesPage() {
  const quizzes = useMemo(() => getAllPracticeQuizzes(), []);

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
            Udemy-style practice tests for every module — unlimited attempts, instant feedback.
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
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="learn-chip">{quiz.trackName}</span>
                {best && (
                  <span className="rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    Best {best.score}%
                  </span>
                )}
              </div>

              <h3 className="mt-3 line-clamp-2 font-display text-base font-bold text-text">
                {quiz.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{quiz.courseTitle}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="learn-preview-meta">
                  <ListChecks className="h-3 w-3" />
                  {quiz.questions.length} questions
                </span>
                <span className="learn-preview-meta">
                  <Trophy className="h-3 w-3" />
                  Pass {quiz.passingScore}%
                </span>
                <span className="learn-preview-meta">
                  <Clock3 className="h-3 w-3" />
                  {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : "Untimed"}
                </span>
              </div>

              <Link
                to={`/learn/${quiz.trackId}/${quiz.lessonId}`}
                className="review-cta review-cta-primary mt-4"
              >
                {best ? "Retake quiz" : "Start quiz"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.article>
          );
        })}
      </section>
    </motion.div>
  );
}
