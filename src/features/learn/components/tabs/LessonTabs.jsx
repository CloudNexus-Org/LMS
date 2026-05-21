import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, MessagesSquare, ArrowRight, ArrowUpRight } from "lucide-react";
import { getStored, setStored } from "@/utils/storage";

/* --- HELPERS --- */
const noteKey = (trackId, lessonId) => `cn:notes:${trackId}:${lessonId}`;

/* --- TAB COMPONENTS --- */

export function OverviewPane({ lesson, mentor }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
          About this lesson
        </div>
        <p className="mt-2 text-[14.5px] leading-7 text-muted">
          {lesson.summary}
        </p>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
          You'll be able to
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            `Explain ${lesson.title.toLowerCase()} from first principles`,
            `Recognise the trade-offs in real production code`,
            `Apply the pattern in your own project`,
            `Debug common failure modes with confidence`,
          ].map((t) => (
            <li
              key={t}
              className="flex items-start gap-2.5 rounded-xl border border-border bg-elevated/60 px-3.5 py-2.5 text-[13px] leading-6 text-muted"
            >
              <CheckCircle2
                size={13}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden
              />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {mentor ? (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Taught by
          </div>
          <Link
            to={`/mentors/${mentor.slug}`}
            className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-elevated/60 p-3.5 transition-colors hover:border-border-strong"
          >
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-[14px] font-semibold tracking-tight text-text">
                {mentor.name}
              </div>
              <div className="truncate text-[12.5px] text-muted">
                {mentor.role} at {mentor.company.replace(/^Ex-/, "")}
              </div>
            </div>
            <ArrowUpRight
              size={14}
              aria-hidden
              className="shrink-0 text-muted"
            />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

import { useNotesAutosave } from "@/features/learn/hooks/useNotesAutosave";

export const NotesPane = memo(function NotesPane({ trackId, lessonId }) {
  const { value, setValue, saved } = useNotesAutosave({ trackId, lessonId });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
          Your notes
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-subtle">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              saved ? "bg-success" : "bg-border-strong"
            }`}
          />
          {saved ? "Saved" : "Autosaving"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Jot down key takeaways, timestamps, questions…"
        rows={9}
        className="mt-3 w-full resize-y rounded-xl border border-border bg-elevated px-4 py-3 text-[13.5px] leading-7 text-text placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <p className="mt-2 text-[11.5px] text-subtle">
        Notes are saved to this browser. Sync across devices comes with a paid plan.
      </p>
    </div>
  );
});

export function TranscriptPane({ lesson }) {
  const lines = [
    { t: "0:00", text: `In this lesson we'll cover ${lesson.title}.` },
    { t: "0:42", text: `The first thing to know is the high-level intent — why this exists in production.` },
    { t: "1:38", text: `Let's pull up a real example from a system I've worked on.` },
    { t: "3:10", text: `Notice how the trade-off changes as load increases — that's the key insight.` },
    { t: "5:25", text: `A common failure mode is to skip this step. Here's what happens when you do.` },
    { t: "8:02", text: `Pause here and try it on your own. We'll regroup in the next clip.` },
    { t: "10:18", text: `If you got that working — congrats. Move on to the next lesson.` },
  ];
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
        Transcript
      </div>
      <ul className="mt-3 space-y-2">
        {lines.map((l, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
          >
            <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
              {l.t}
            </span>
            <span className="text-[13.5px] leading-7 text-muted">{l.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResourcesPane({ lesson }) {
  const files = [
    { label: `${lesson.title} — slides.pdf`, meta: "2.1 MB · PDF" },
    { label: `Starter code repository`, meta: "GitHub · Public" },
    { label: `Recommended reading list`, meta: "3 articles" },
    { label: `Sandbox environment`, meta: "Hosted · 1-click open" },
  ];
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
        Lesson resources
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {files.map((f) => (
          <li
            key={f.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-elevated/60 px-3.5 py-3 transition-colors hover:border-border-strong"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Download size={14} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-text">
                {f.label}
              </span>
              <span className="block text-[11.5px] text-subtle">{f.meta}</span>
            </span>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-bg px-2.5 text-[11.5px] font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
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
      text: `The example at 3:10 — would this still work if the upstream was eventually-consistent?`,
      replies: 5,
    },
  ];
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
        Questions from learners
      </div>
      <div className="mt-3 space-y-2.5">
        {threads.map((t) => (
          <div
            key={t.author}
            className="rounded-xl border border-border bg-elevated/60 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-[12px] text-subtle">
              <span className="font-semibold text-text">{t.author}</span>
              <span aria-hidden>·</span>
              <span>{t.time}</span>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-6 text-muted">
              {t.text}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
              <MessagesSquare size={12} aria-hidden />
              {t.replies} replies
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-elevated px-4 text-[13px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
      >
        Ask a question
        <ArrowRight size={13} aria-hidden />
      </button>
    </div>
  );
}
