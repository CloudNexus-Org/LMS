import { Plus, Trash2, ListChecks } from 'lucide-react';

function emptyQuestion() {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    prompt: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  };
}

export function createEmptyQuiz() {
  return {
    passingScore: 70,
    questions: [emptyQuestion()],
  };
}

/**
 * Inline quiz editor for a single lesson (mentor upload / manage flow).
 */
export default function LessonQuizEditor({ quiz, onChange, compact = false }) {
  const value = quiz?.questions?.length ? quiz : createEmptyQuiz();

  const update = (patch) => onChange({ ...value, ...patch });

  const updateQuestion = (qi, patch) => {
    update({
      questions: value.questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)),
    });
  };

  const updateOption = (qi, oi, text) => {
    updateQuestion(qi, {
      options: value.questions[qi].options.map((o, i) => (i === oi ? text : o)),
    });
  };

  return (
    <div className={`rounded-xl border border-border bg-bg/40 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-text">
          <ListChecks className="h-4 w-4 text-primary" />
          Lesson quiz
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          Pass score %
          <input
            type="number"
            min={1}
            max={100}
            value={value.passingScore ?? 70}
            onChange={(e) => update({ passingScore: Math.min(100, Math.max(1, Number(e.target.value) || 70)) })}
            className="h-8 w-16 rounded-lg border border-border bg-surface px-2 text-sm text-text outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="space-y-3">
        {value.questions.map((q, qi) => (
          <div key={q.id || qi} className="rounded-lg border border-border bg-surface p-3">
            <div className="mb-2 flex items-start gap-2">
              <span className="mt-2 text-[11px] font-bold text-muted">Q{qi + 1}</span>
              <input
                value={q.prompt}
                onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                placeholder="Question prompt"
                className="h-9 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-text outline-none focus:border-primary"
              />
              <button
                type="button"
                disabled={value.questions.length <= 1}
                onClick={() =>
                  update({ questions: value.questions.filter((_, i) => i !== qi) })
                }
                className="mt-1 rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                aria-label="Remove question"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="ml-6 grid gap-1.5 sm:grid-cols-2">
              {(q.options || []).map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${
                    q.correctIndex === oi
                      ? 'border-success/40 bg-success/5'
                      : 'border-border bg-bg'
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${q.id || qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                  />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${oi + 1}`}
                    className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => update({ questions: [...value.questions, emptyQuestion()] })}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" />
        Add question
      </button>
    </div>
  );
}

export function quizIsValid(quiz) {
  if (!quiz?.questions?.length) return false;
  return quiz.questions.every(
    (q) =>
      q.prompt?.trim() &&
      Array.isArray(q.options) &&
      q.options.filter((o) => o?.trim()).length >= 2 &&
      Number.isInteger(q.correctIndex)
  );
}
