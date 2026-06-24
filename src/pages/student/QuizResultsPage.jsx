import { ChevronLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getContinueLearningUrl } from "@/features/learn/learningSession";
import { getLatestAttempt, loadQuizAttempts } from "@/data/quizzes";

const EASE = [0.16, 1, 0.3, 1];

const FALLBACK = {
  title: "Practice Quiz",
  score: 0,
  passingScore: 70,
  total: 0,
  correct: 0,
  strengths: [],
  reviewed: [],
};

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};

  const stored = state.quizId
    ? getLatestAttempt(state.quizId)
    : Object.values(loadQuizAttempts()).flat()[0];

  const data = {
    ...FALLBACK,
    ...stored,
    ...state,
    title: state.title ?? stored?.title ?? FALLBACK.title,
    passingScore: state.passingScore ?? stored?.passingScore ?? 70,
  };

  const passed = data.score >= data.passingScore;

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-5xl space-y-6 py-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="learn-back-btn !text-sm"
      >
        <ChevronLeft className="h-4 w-4" /> Back to lesson
      </button>

      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-text">Quiz results</h1>
        <p className="mt-2 text-muted">{data.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="dashboard-card flex flex-col items-center p-8 text-center md:col-span-1">
          <div className={`learn-quiz-score-ring ${passed ? "learn-quiz-pass" : "learn-quiz-fail"}`}>
            <span className="learn-quiz-score-value">{data.score}%</span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-text">
            {passed ? "Outstanding!" : "Keep trying!"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {data.correct} of {data.total} correct
          </p>
          <Link
            to={getContinueLearningUrl()}
            className="upload-btn upload-btn-primary mt-6 w-full"
          >
            {passed ? "Continue learning" : "Retake quiz"}
          </Link>
        </div>

        <div className="space-y-4 md:col-span-2">
          {data.strengths?.length > 0 && (
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-text">Topic strengths</h3>
              <div className="mt-4 space-y-3">
                {data.strengths.map((topic) => (
                  <div key={topic.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted">{topic.label}</span>
                      <span className="font-bold text-text">{topic.value}%</span>
                    </div>
                    <div className="learn-sidebar-progress">
                      <div
                        className="learn-sidebar-progress-fill"
                        style={{ width: `${topic.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.reviewed?.length > 0 && (
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-text">Answer review</h3>
              <ul className="mt-4 space-y-3">
                {data.reviewed.map((a, i) => (
                  <li
                    key={i}
                    className={`learn-quiz-review-row ${a.isCorrect ? "learn-quiz-review-ok" : "learn-quiz-review-bad"}`}
                  >
                    {a.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-danger" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-text">{a.question}</p>
                      {!a.isCorrect && a.explanation && (
                        <p className="mt-1 flex items-start gap-1 text-xs text-muted">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                          {a.explanation}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
