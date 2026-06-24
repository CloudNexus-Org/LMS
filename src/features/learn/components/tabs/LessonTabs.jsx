import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  MessagesSquare,
  ArrowRight,
  ArrowUpRight,
  Target,
  User,
} from "lucide-react";
import { useNotesAutosave } from "@/features/learn/hooks/useNotesAutosave";

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
            <p className="text-sm font-bold text-text">Cloud Nexus mentor</p>
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
        Notes are saved locally in this browser. Sync across devices with Cloud Nexus Pro.
      </p>
    </motion.div>
  );
});

export function TranscriptPane({ lesson }) {
  const lines = [
    { t: "0:00", text: `In this lesson we'll cover ${lesson.title}.` },
    { t: "0:42", text: "The first thing to know is the high-level intent — why this exists in production." },
    { t: "1:38", text: "Let's pull up a real example from a system I've worked on." },
    { t: "3:10", text: "Notice how the trade-off changes as load increases — that's the key insight." },
    { t: "5:25", text: "A common failure mode is to skip this step. Here's what happens when you do." },
    { t: "8:02", text: "Pause here and try it on your own. We'll regroup in the next clip." },
    { t: "10:18", text: "If you got that working — congrats. Move on to the next lesson." },
  ];

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Transcript</p>
      <ul className="learn-transcript-list">
        {lines.map((l, i) => (
          <li key={i} className="learn-transcript-row">
            <button type="button" className="learn-transcript-time">
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
  const files = [
    { label: `${lesson.title} — slides.pdf`, meta: "2.1 MB · PDF" },
    { label: "Starter code repository", meta: "GitHub · Public" },
    { label: "Recommended reading list", meta: "3 articles" },
    { label: "Sandbox environment", meta: "Hosted · 1-click open" },
  ];

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Lesson resources</p>
      <ul className="learn-resource-grid">
        {files.map((f) => (
          <li key={f.label} className="learn-resource-card">
            <span className="learn-resource-icon">
              <Download size={14} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text">{f.label}</span>
              <span className="block text-xs text-muted">{f.meta}</span>
            </span>
            <button type="button" className="learn-resource-btn">
              Download
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function QAPane({ lesson }) {
  const threads = [
    {
      author: "Priya I.",
      time: "2 hours ago",
      text: `When applying ${lesson.title.toLowerCase()} in a multi-region setup, do we keep one writer or share writes?`,
      replies: 3,
    },
    {
      author: "Karan M.",
      time: "yesterday",
      text: "The example at 3:10 — would this still work if the upstream was eventually-consistent?",
      replies: 5,
    },
  ];

  return (
    <motion.div {...fadeIn} className="learn-pane">
      <p className="learn-pane-label">Questions from learners</p>
      <div className="space-y-2.5">
        {threads.map((t) => (
          <div key={t.author} className="learn-qa-card">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-bold text-text">{t.author}</span>
              <span aria-hidden>·</span>
              <span>{t.time}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.text}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
              <MessagesSquare size={12} aria-hidden />
              {t.replies} replies
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="learn-ask-btn">
        Ask a question
        <ArrowRight size={13} aria-hidden />
      </button>
    </motion.div>
  );
}
