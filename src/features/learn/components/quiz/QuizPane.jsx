import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListChecks,
  RotateCcw,
  Trophy,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getBestAttempt,
  getQuizForLesson,
  saveQuizAttempt,
  scoreQuiz,
} from "@/data/quizzes";

const EASE = [0.16, 1, 0.3, 1];

export default function QuizPane({
  trackId,
  lessonId,
  lesson,
  isQuizLesson = false,
  onPassed,
  onGoToQuizLesson,
}) {
  const quiz = useMemo(() => getQuizForLesson(lessonId, trackId), [lessonId, trackId]);
  const best = quiz ? getBestAttempt(quiz.id) : null;

  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!quiz) {
    return (
      <div className="learn-quiz-empty">
        <ListChecks className="h-10 w-10 text-muted" />
        <p className="mt-3 font-bold text-text">No practice quiz yet</p>
        <p className="mt-1 text-sm text-muted">Your mentor hasn&apos;t published a quiz for this lesson.</p>
      </div>
    );
  }

  const targetLessonId = isQuizLesson ? lessonId : quiz.lessonId;
  const showModuleLink = !isQuizLesson && quiz.lessonId !== lessonId;

  const startQuiz = () => {
    setPhase("taking");
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  };

  const selectAnswer = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const submitQuiz = () => {
    const scored = scoreQuiz(quiz, answers);
    setResult(scored);
    setPhase("results");
    saveQuizAttempt({
      quizId: quiz.id,
      lessonId: targetLessonId,
      trackId,
      title: quiz.title,
      passingScore: quiz.passingScore,
      ...scored,
    });
    if (scored.passed && onPassed) onPassed();
  };

  const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined).length;
  const q = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="learn-quiz">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="learn-quiz-intro"
          >
            <div className="learn-quiz-intro-icon">
              <ListChecks className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-text">{quiz.title}</h3>
            <p className="mt-2 text-sm text-muted">
              {showModuleLink
                ? `Practice quiz for module "${quiz.courseTitle}" — Udemy-style knowledge check.`
                : "Test your understanding with multiple-choice questions. Unlimited attempts."}
            </p>

            <div className="learn-quiz-stats">
              <div className="learn-quiz-stat">
                <span className="learn-quiz-stat-value">{quiz.questions.length}</span>
                <span className="learn-quiz-stat-label">Questions</span>
              </div>
              <div className="learn-quiz-stat">
                <span className="learn-quiz-stat-value">{quiz.passingScore}%</span>
                <span className="learn-quiz-stat-label">To pass</span>
              </div>
              <div className="learn-quiz-stat">
                <span className="learn-quiz-stat-value">
                  {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes}m` : "∞"}
                </span>
                <span className="learn-quiz-stat-label">Time limit</span>
              </div>
              {best && (
                <div className="learn-quiz-stat">
                  <span className="learn-quiz-stat-value text-primary">{best.score}%</span>
                  <span className="learn-quiz-stat-label">Best score</span>
                </div>
              )}
            </div>

            <div className="learn-quiz-actions">
              {showModuleLink && onGoToQuizLesson ? (
                <button type="button" onClick={() => onGoToQuizLesson(quiz.lessonId)} className="learn-quiz-btn learn-quiz-btn-primary">
                  Go to module quiz <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={startQuiz} className="learn-quiz-btn learn-quiz-btn-primary">
                  Start quiz <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {best && !showModuleLink && (
                <button type="button" onClick={startQuiz} className="learn-quiz-btn learn-quiz-btn-outline">
                  <RotateCcw className="h-4 w-4" /> Retake
                </button>
              )}
            </div>
          </motion.div>
        )}

        {phase === "taking" && q && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="learn-quiz-progress-head">
              <span className="text-xs font-bold text-muted">
                Question {currentQ + 1} of {quiz.questions.length}
              </span>
              <span className="learn-quiz-topic">{q.topic}</span>
            </div>
            <div className="learn-quiz-progress-bar">
              <motion.div
                className="learn-quiz-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <h4 className="learn-quiz-question">{q.question}</h4>

            <div className="learn-quiz-options">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectAnswer(q.id, i)}
                    className={`learn-quiz-option ${selected ? "learn-quiz-option-selected" : ""}`}
                  >
                    <span className="learn-quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="learn-quiz-nav">
              <button
                type="button"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ((c) => c - 1)}
                className="learn-quiz-btn learn-quiz-btn-outline"
              >
                Previous
              </button>

              {currentQ < quiz.questions.length - 1 ? (
                <button
                  type="button"
                  disabled={answers[q.id] === undefined}
                  onClick={() => setCurrentQ((c) => c + 1)}
                  className="learn-quiz-btn learn-quiz-btn-primary"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={unanswered > 0}
                  onClick={submitQuiz}
                  className="learn-quiz-btn learn-quiz-btn-primary"
                >
                  Submit quiz
                </button>
              )}
            </div>

            {unanswered > 0 && currentQ === quiz.questions.length - 1 && (
              <p className="learn-quiz-warning">
                <AlertCircle className="h-3.5 w-3.5" />
                {unanswered} question{unanswered > 1 ? "s" : ""} unanswered
              </p>
            )}
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="learn-quiz-results"
          >
            <div className={`learn-quiz-score-ring ${result.passed ? "learn-quiz-pass" : "learn-quiz-fail"}`}>
              {result.passed ? (
                <Trophy className="h-10 w-10 text-success" />
              ) : (
                <XCircle className="h-10 w-10 text-danger" />
              )}
              <span className="learn-quiz-score-value">{result.score}%</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-text">
              {result.passed ? "Great work!" : "Keep practicing"}
            </h3>
            <p className="mt-1 text-sm text-muted">
              You got {result.correct} of {result.total} correct
              {result.passed ? " — lesson marked complete." : `. Need ${quiz.passingScore}% to pass.`}
            </p>

            <div className="learn-quiz-review">
              {result.reviewed.map((r, i) => (
                <div key={i} className={`learn-quiz-review-row ${r.isCorrect ? "learn-quiz-review-ok" : "learn-quiz-review-bad"}`}>
                  {r.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-danger" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text">{r.question}</p>
                    {!r.isCorrect && r.explanation && (
                      <p className="mt-1 text-xs text-muted">{r.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="learn-quiz-actions">
              {result.passed ? (
                <button
                  type="button"
                  onClick={() => setPhase("intro")}
                  className="learn-quiz-btn learn-quiz-btn-primary"
                >
                  Back to overview
                </button>
              ) : (
                <button type="button" onClick={startQuiz} className="learn-quiz-btn learn-quiz-btn-primary">
                  <RotateCcw className="h-4 w-4" /> Retake quiz
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
