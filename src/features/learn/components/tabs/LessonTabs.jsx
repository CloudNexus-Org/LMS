import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Download,
  MessagesSquare,
  ArrowUpRight,
  Target,
  User,
  Loader2,
  Check,
  BookOpen,
} from "lucide-react";
import { useNotesAutosave } from "@/features/learn/hooks/useNotesAutosave";
import useAuthStore from "@/store/useAuthStore";
import { fetchLessonQa, postLessonQuestion } from "@/lib/api/learningApi";
import {
  getLessonResources,
  downloadResource,
  getTranscriptLines,
  loadLessonQA,
  addLessonQuestion,
  getReadingContent,
} from "@/data/lessonContent";
import { fetchLessonResources, fetchLessonTranscript } from "@/lib/api/contentApi";
import { resolveMediaUrl } from "@/lib/api/mediaApi";

const EASE = [0.16, 1, 0.3, 1];

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function OverviewPane({ lesson, mentor }) {
  const outcomes = [
    `Explain ${lesson.title.toLowerCase()} from first principles`,
    "Recognise trade-offs in real production code",
    "Apply the pattern in your own project",
    "Debug common failure modes with confidence",
  ];

  return (
    <motion.div {...fadeIn} className="learn-pane space-y-5">
      <div>
        <p className="learn-pane-label">About this lesson</p>
        <p className="learn-pane-text">{lesson.summary}</p>
      </div>

      <div>
        <p className="learn-pane-label">You&apos;ll be able to</p>
        <ul className="learn-outcome-grid">
          {outcomes.map((t) => (
            <li key={t} className="learn-outcome-item">
              <Target size={13} className="mt-0.5 shrink-0 text-primary" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {mentor ? (
        <div>
          <p className="learn-pane-label">Taught by</p>
          <Link to={`/mentors/${mentor.slug}`} className="learn-mentor-card">
            <img src={mentor.avatar} alt={mentor.name} className="learn-mentor-avatar" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold text-text">{mentor.name}</p>
              <p className="truncate text-xs text-muted">
                {mentor.role} at {mentor.company.replace(/^Ex-/, "")}
              </p>
            </div>
            <ArrowUpRight size={14} className="shrink-0 text-muted" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="learn-mentor-card">
          <span className="learn-mentor-avatar flex items-center justify-center bg-primary-soft text-primary">
            <User size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-text">Realm mentor</p>
            <p className="text-xs text-muted">Senior industry engineer</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export const NotesPane = memo(function NotesPane({ trackId, lessonId }) {
  const { value, setValue, saved } = useNotesAutosave({ trackId, lessonId });

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <div className="flex items-center justify-between">
        <p className="learn-pane-label !mb-0">Your notes</p>
        <span className="learn-save-badge">
          <span className={`learn-save-dot ${saved ? "learn-save-dot-on" : ""}`} aria-hidden />
          {saved ? "Saved" : "Autosaving…"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Jot down key takeaways, timestamps, questions…"
        rows={9}
        className="learn-notes-input"
      />
      <p className="learn-notes-hint">
        Notes are saved locally in this browser. Sync across devices with Realm Pro.
      </p>
    </motion.div>
  );
});

export function TranscriptPane({ lesson, onSeek }) {
  const [lines, setLines] = useState(() => getTranscriptLines(lesson));

  useEffect(() => {
    setLines(getTranscriptLines(lesson));
    const numericId = Number(lesson?.id);
    if (Number.isNaN(numericId)) return;
    fetchLessonTranscript(numericId)
      .then((data) => {
        if (data?.lines?.length) setLines(data.lines);
        else if (data?.transcriptText) {
          setLines(
            data.transcriptText
              .split("\n")
              .map((text, i) => ({ t: `0:${String(i * 5).padStart(2, "0")}`, seconds: i * 5, text: text.trim() }))
              .filter((l) => l.text)
          );
        }
      })
      .catch(() => {});
  }, [lesson?.id]);

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Transcript</p>
      <p className="mb-3 text-xs text-muted">Click a timestamp to jump in the video.</p>
      <ul className="learn-transcript-list">
        {lines.map((l, i) => (
          <li key={i} className="learn-transcript-row">
            <button
              type="button"
              onClick={() => onSeek?.(l.seconds)}
              className="learn-transcript-time"
            >
              {l.t}
            </button>
            <span className="learn-transcript-text">{l.text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function ResourcesPane({ lesson }) {
  const [resources, setResources] = useState(() => getLessonResources(lesson));
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded] = useState({});

  useEffect(() => {
    setResources(getLessonResources(lesson));
    const numericId = Number(lesson?.id);
    if (Number.isNaN(numericId)) return;
    fetchLessonResources(numericId)
      .then((list) => {
        if (!Array.isArray(list) || !list.length) return;
        setResources(
          list.map((r) => ({
            id: r.id,
            label: r.title || r.label,
            meta: r.fileType || r.meta || "file",
            type: r.type || (r.fileUrl?.startsWith("http") ? "link" : "file"),
            url: resolveMediaUrl(r.fileUrl) || r.fileUrl,
          }))
        );
      })
      .catch(() => {});
  }, [lesson?.id]);

  const handleDownload = async (resource) => {
    setDownloading(resource.id);
    if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
      setDownloading(null);
      setDownloaded((prev) => ({ ...prev, [resource.id]: true }));
      setTimeout(() => setDownloaded((prev) => ({ ...prev, [resource.id]: false })), 2000);
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
    const ok = downloadResource(resource);
    setDownloading(null);
    if (ok) {
      setDownloaded((prev) => ({ ...prev, [resource.id]: true }));
      setTimeout(() => setDownloaded((prev) => ({ ...prev, [resource.id]: false })), 2000);
    }
  };

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Lesson resources</p>
      <ul className="learn-resource-grid">
        {resources.map((f) => {
          const isLoading = downloading === f.id;
          const justDone = downloaded[f.id];
          return (
            <li key={f.id} className="learn-resource-card">
              <span className="learn-resource-icon">
                <Download size={14} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-text">{f.label}</span>
                <span className="block text-xs text-muted">{f.meta}</span>
              </span>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDownload(f)}
                className="learn-resource-btn"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : justDone ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Done
                  </>
                ) : f.type === "link" ? (
                  "Open"
                ) : (
                  "Download"
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export function QAPane({ trackId, lessonId, lesson }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [threads, setThreads] = useState(() => loadLessonQA(trackId, lessonId));
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setThreads(loadLessonQA(trackId, lessonId));
    setQuestion("");
    const numericId = Number(lessonId);
    if (!Number.isNaN(numericId)) {
      fetchLessonQa(numericId)
        .then((list) => { if (list?.length) setThreads(list); })
        .catch(() => {});
    }
  }, [trackId, lessonId]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);
    const numericId = Number(lessonId);
    try {
      if (user?.id && token && !Number.isNaN(numericId)) {
        const posted = await postLessonQuestion(user, token, numericId, question);
        setThreads((prev) => [posted, ...prev]);
      } else {
        await new Promise((r) => setTimeout(r, 350));
        const next = addLessonQuestion(trackId, lessonId, question);
        setThreads(next);
      }
    } catch {
      const next = addLessonQuestion(trackId, lessonId, question);
      setThreads(next);
    }
    setQuestion("");
    setSubmitting(false);
  };

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Questions from learners</p>

      <form onSubmit={handleAsk} className="learn-qa-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask a question about "${lesson.title}"…`}
          rows={3}
          className="learn-notes-input !mt-0"
        />
        <button
          type="submit"
          disabled={!question.trim() || submitting}
          className="learn-ask-btn mt-2"
        >
          {submitting ? "Posting…" : "Post question"}
        </button>
      </form>

      <div className="mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {threads.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="learn-qa-card"
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="font-bold text-text">{t.author}</span>
                <span aria-hidden>·</span>
                <span>{t.time}</span>
                {!t.seed && (
                  <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    New
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.text}</p>
              {t.replies > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  <MessagesSquare size={12} aria-hidden />
                  {t.replies} replies
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ReadingPane({ lesson }) {
  const content =
    (lesson?.readingContent && typeof lesson.readingContent === 'object'
      ? lesson.readingContent
      : null) || getReadingContent(lesson);
  const sections = Array.isArray(content?.sections) ? content.sections : [];

  return (
    <motion.div {...fadeIn} className="learn-pane space-y-4">
      <div className="learn-reading-header">
        <BookOpen className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-bold text-text">{content?.title || lesson?.title}</p>
          <p className="text-xs text-muted">
            {content?.duration || lesson?.duration || ''} read · {content?.courseTitle || lesson?.courseTitle || ''}
          </p>
        </div>
      </div>
      {sections.length === 0 ? (
        <p className="learn-pane-text text-muted">No reading content available for this lesson yet.</p>
      ) : (
        sections.map((section) => (
          <div key={section.heading}>
            <p className="learn-pane-label">{section.heading}</p>
            {section.body && <p className="learn-pane-text">{section.body}</p>}
            {section.bullets && (
              <ul className="mt-2 space-y-1.5">
                {section.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </motion.div>
  );
}
