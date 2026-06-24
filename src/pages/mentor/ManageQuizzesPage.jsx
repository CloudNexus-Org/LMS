import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ListChecks,
  Sparkles,
  Edit3,
  CheckCircle2,
} from "lucide-react";
import {
  loadMentorQuizzes,
  upsertMentorQuiz,
  deleteMentorQuiz,
  getAllPracticeQuizzes,
} from "@/data/quizzes";
import { getTrackById, getLessonsByTrack } from "@/data/tracks";

const EASE = [0.16, 1, 0.3, 1];

const EMPTY_QUESTION = {
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
  topic: "General",
};

const EMPTY_QUIZ = {
  title: "",
  trackId: "cloud",
  lessonId: "",
  passingScore: 70,
  timeLimitMinutes: null,
  questions: [{ ...EMPTY_QUESTION, id: "q1" }],
};

export default function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState(() => loadMentorQuizzes());
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const platformQuizzes = useMemo(() => getAllPracticeQuizzes(), []);
  const tracks = useMemo(
    () => ["cloud", "ai", "fullstack"].map((id) => getTrackById(id)).filter(Boolean),
    []
  );

  const lessonOptions = useMemo(() => {
    if (!form?.trackId) return [];
    return getLessonsByTrack(form.trackId).filter((l) => l.type === "quiz");
  }, [form?.trackId]);

  const openCreate = () => {
    setForm({ ...EMPTY_QUIZ, id: `mentor-quiz-${Date.now()}` });
    setEditing(true);
  };

  const openEdit = (quiz) => {
    setForm(JSON.parse(JSON.stringify(quiz)));
    setEditing(true);
  };

  const saveQuiz = () => {
    if (!form?.title.trim() || form.questions.length < 1) return;
    const cleaned = {
      ...form,
      questions: form.questions.map((q, i) => ({
        ...q,
        id: q.id || `q-${i}`,
        options: q.options.filter(Boolean),
      })),
    };
    setQuizzes(upsertMentorQuiz(cleaned));
    setEditing(false);
    setForm(null);
  };

  const removeQuiz = (id) => {
    setQuizzes(deleteMentorQuiz(id));
  };

  const updateQuestion = (idx, patch) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    }));
  };

  return (
    <motion.div
      className="dashboard-page mx-auto w-full max-w-[1100px] space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <section className="dashboard-analytics-bar">
        <div className="min-w-0">
          <span className="dashboard-pill">
            <ListChecks className="h-3 w-3" />
            Quiz builder
          </span>
          <p className="dashboard-greeting text-base sm:text-lg">
            Create <span className="text-primary">practice quizzes</span> for students
          </p>
          <p className="dashboard-greeting-sub">
            Coursera-style assessments — publish to lesson player and practice portal.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="upload-btn upload-btn-primary">
          <Plus className="h-4 w-4" /> Create quiz
        </button>
      </section>

      {/* Mentor quizzes */}
      <section className="dashboard-card p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold text-text">Your custom quizzes</h2>
        <p className="mt-1 text-sm text-muted">{quizzes.length} published by you</p>

        {quizzes.length === 0 ? (
          <div className="learn-quiz-empty mt-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <p className="mt-2 font-bold text-text">No custom quizzes yet</p>
            <p className="text-sm text-muted">Create one to assign practice questions to a module.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {quizzes.map((q) => (
              <li key={q.id} className="learn-resource-card">
                <span className="learn-resource-icon">
                  <ListChecks size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-text">{q.title}</p>
                  <p className="text-xs text-muted">
                    {q.questions.length} questions · Pass {q.passingScore}%
                  </p>
                </div>
                <button type="button" onClick={() => openEdit(q)} className="learn-resource-btn">
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeQuiz(q.id)}
                  className="learn-resource-btn !text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Platform quizzes reference */}
      <section className="dashboard-card p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold text-text">Platform quizzes</h2>
        <p className="mt-1 text-sm text-muted">Auto-generated per module — {platformQuizzes.length} available</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {platformQuizzes.slice(0, 6).map((q) => (
            <div key={q.id} className="learn-outcome-item !flex-row items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{q.title}</p>
                <p className="text-xs text-muted">{q.trackName} · {q.questions.length} Q</p>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            </div>
          ))}
        </div>
      </section>

      {/* Editor modal */}
      <AnimatePresence>
        {editing && form && (
          <motion.div
            className="review-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(false)}
          >
            <motion.div
              className="review-modal dashboard-card max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-border p-4 sm:p-5">
                <h3 className="font-display text-lg font-bold text-text">
                  {form.createdAt ? "Edit quiz" : "Create quiz"}
                </h3>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 sm:p-5">
                <label className="block">
                  <span className="upload-label">Quiz title</span>
                  <input
                    className="upload-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Module 1 knowledge check"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="upload-label">Track</span>
                    <select
                      className="upload-input upload-select"
                      value={form.trackId}
                      onChange={(e) => setForm({ ...form, trackId: e.target.value, lessonId: "" })}
                    >
                      {tracks.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="upload-label">Link to lesson</span>
                    <select
                      className="upload-input upload-select"
                      value={form.lessonId}
                      onChange={(e) => setForm({ ...form, lessonId: e.target.value })}
                    >
                      <option value="">Select quiz lesson…</option>
                      {lessonOptions.map((l) => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block max-w-xs">
                  <span className="upload-label">Passing score (%)</span>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    className="upload-input"
                    value={form.passingScore}
                    onChange={(e) => setForm({ ...form, passingScore: Number(e.target.value) })}
                  />
                </label>

                {form.questions.map((q, qi) => (
                  <div key={qi} className="upload-module p-3">
                    <p className="mb-2 text-xs font-bold text-muted">Question {qi + 1}</p>
                    <input
                      className="upload-input mb-2"
                      value={q.question}
                      onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                      placeholder="Question text"
                    />
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="mb-1.5 flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qi}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateQuestion(qi, { correctIndex: oi })}
                        />
                        <input
                          className="upload-input flex-1"
                          value={opt}
                          onChange={(e) => {
                            const options = [...q.options];
                            options[oi] = e.target.value;
                            updateQuestion(qi, { options });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        />
                      </div>
                    ))}
                    <input
                      className="upload-input mt-2"
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qi, { explanation: e.target.value })}
                      placeholder="Explanation (shown on wrong answer)"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      questions: [
                        ...form.questions,
                        { ...EMPTY_QUESTION, id: `q-${Date.now()}` },
                      ],
                    })
                  }
                  className="upload-add-lesson"
                >
                  <Plus className="h-3.5 w-3.5" /> Add question
                </button>
              </div>

              <div className="flex justify-end gap-2 border-t border-border p-4">
                <button type="button" onClick={() => setEditing(false)} className="upload-btn upload-btn-outline">
                  Cancel
                </button>
                <button type="button" onClick={saveQuiz} className="upload-btn upload-btn-primary">
                  Publish quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
