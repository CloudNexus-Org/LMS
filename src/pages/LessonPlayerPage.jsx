import { useMemo, useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  ListChecks,
  FileText,
  StickyNote,
  Download,
  MessagesSquare,
  PlayCircle,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  getTrackById,
  getLessonsByTrack,
} from '@/data/tracks';
import { getMentorBySlug } from '@/data/mentors';
import Container from '@/components/ui/Container';
import ThemeToggle from '@/components/ui/ThemeToggle';

// Extracted Domain Components
import { VideoPlayer } from "@/features/learn/components/player/VideoPlayer";
import { SidebarOutline } from "@/features/learn/components/sidebar/SidebarOutline";
import {
  OverviewPane,
  NotesPane,
  TranscriptPane,
  ResourcesPane,
  QAPane,
} from "@/features/learn/components/tabs/LessonTabs";

/* ----------------------------------------------------------------------
   Constants
---------------------------------------------------------------------- */

const VIDEO_SRC = "/videos/how-it-works.mp4";

const TYPE_LABEL = {
  video: "Video",
  reading: "Reading",
  quiz: "Quiz",
  project: "Project",
};

const TYPE_ICON = {
  video: PlayCircle,
  reading: BookOpen,
  quiz: ListChecks,
  project: Award,
};

const TABS = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "transcript", label: "Transcript", icon: FileText },
  { id: "resources", label: "Resources", icon: Download },
  { id: "qa", label: "Q & A", icon: MessagesSquare },
];

import { useCourseProgress } from "@/features/learn/hooks/useCourseProgress";

/* ----------------------------------------------------------------------
   PAGE
---------------------------------------------------------------------- */

export default function LessonPlayerPage() {
  const { trackId, lessonId } = useParams();
  const navigate = useNavigate();
  const track = useMemo(() => getTrackById(trackId), [trackId]);
  const lessons = useMemo(() => getLessonsByTrack(trackId), [trackId]);

  const initialLesson = lessonId
    ? lessons.find((l) => l.id === lessonId) || lessons[0]
    : lessons[0];

  const {
    completedMap: completed,
    doneCount,
    progressPct,
    toggleLessonComplete,
    markLessonComplete,
  } = useCourseProgress({ trackId, lessons });

  const [activeTab, setActiveTab] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep URL canonical: if the page was loaded without lessonId, redirect once.
  useEffect(() => {
    if (track && !lessonId && lessons[0]) {
      navigate(`/learn/${trackId}/${lessons[0].id}`, { replace: true });
    }
  }, [track, lessonId, lessons, trackId, navigate]);

  if (!track) {
    return <Navigate to="/" replace />;
  }
  if (!initialLesson) {
    return <Navigate to={`/tracks/${trackId}`} replace />;
  }

  const idx = lessons.findIndex((l) => l.id === initialLesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const mentor = track.leadMentorSlug
    ? getMentorBySlug(track.leadMentorSlug)
    : null;

  const onToggleComplete = () => {
    toggleLessonComplete(initialLesson.id);
  };

  const onPickLesson = (l) => {
    setDrawerOpen(false);
    setActiveTab("overview");
    navigate(`/learn/${trackId}/${l.id}`);
  };

  const onCompleteAndNext = () => {
    markLessonComplete(initialLesson.id);
    if (next) {
      onPickLesson(next);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text relative">
      {/* Ambient Background Glow for Cinematic Feel */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-[800px] opacity-20 dark:opacity-30 mix-blend-screen blur-[120px]" 
           style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }} />

      {/* ============= MINIMAL TOP BAR ============= */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-bg/60 backdrop-blur-2xl shadow-sm">
        <Container size="xl">
          <div className="flex h-[60px] items-center gap-3">
            <Link
              to={`/tracks/${track.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
              aria-label="Back to track"
            >
              <ArrowLeft size={14} aria-hidden />
              <span className="hidden sm:inline">Back to track</span>
            </Link>

            <div className="mx-2 hidden h-5 w-px bg-border md:block" />

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-subtle">
                {track.name}
              </div>
              <div className="truncate text-[13px] font-semibold text-text">
                Lesson {idx + 1} of {lessons.length} · {initialLesson.title}
              </div>
            </div>

            {/* Progress (md+) */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col items-end">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-subtle">
                  Progress
                </div>
                <div className="text-[13px] font-bold text-text">
                  {progressPct}%
                </div>
              </div>
              <div className="h-1.5 w-28 overflow-hidden rounded-lg bg-border lg:w-40">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Curriculum drawer toggle (mobile/tablet) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-elevated px-3 text-[12.5px] font-semibold text-text transition-colors hover:border-primary hover:text-primary lg:hidden"
            >
              <ListChecks size={14} />
              Curriculum
            </button>

            <ThemeToggle />
          </div>
        </Container>
      </header>

      {/* Top progress hairline */}
      <div
        aria-hidden
        className="h-0.5 w-full overflow-hidden bg-border"
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ============= MAIN LAYOUT ============= */}
      <main id="main">
        <Container size="xl" className="py-5 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* ===== LEFT: player + content ===== */}
            <div className="min-w-0">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] ring-1 ring-border/50 bg-black">
                <VideoPlayer
                  src={VIDEO_SRC}
                  lesson={initialLesson}
                  onEnded={onCompleteAndNext}
                />
              </div>

              {/* Lesson title + actions */}
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                    <span>{initialLesson.courseTitle}</span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1 text-primary">
                      {(() => {
                        const I = TYPE_ICON[initialLesson.type] || PlayCircle;
                        return <I size={11} aria-hidden />;
                      })()}
                      {TYPE_LABEL[initialLesson.type]}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{initialLesson.duration}</span>
                  </div>
                  <h1 className="mt-1.5 font-display text-[22px] font-bold leading-tight tracking-tight text-text sm:text-[26px]">
                    {initialLesson.title}
                  </h1>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleComplete}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-[13px] font-semibold transition-all duration-200 ${
                      completed[initialLesson.id]
                        ? "border-success/40 bg-[color:color-mix(in_oklab,var(--success)_12%,transparent)] text-success"
                        : "border-border bg-elevated text-text hover:border-primary hover:text-primary"
                    }`}
                  >
                    {completed[initialLesson.id] ? (
                      <>
                        <CheckCircle size={14} aria-hidden />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle size={14} aria-hidden />
                        Mark complete
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ===== PREMIUM TABS ===== */}
              <div className="mt-8 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative flex h-10 items-center gap-2 rounded-lg px-5 text-[13px] font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-white shadow-[0_4px_15px_rgba(33,92,255,0.4)] scale-105"
                            : "bg-elevated/50 text-muted hover:bg-elevated hover:text-text border border-border/50"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-white" : ""} aria-hidden />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ===== TAB PANES ===== */}
              <div className="mt-6">
                {activeTab === "overview" && (
                  <OverviewPane lesson={initialLesson} mentor={mentor} />
                )}
                {activeTab === "notes" && (
                  <NotesPane trackId={trackId} lessonId={initialLesson.id} />
                )}
                {activeTab === "transcript" && (
                  <TranscriptPane lesson={initialLesson} />
                )}
                {activeTab === "resources" && (
                  <ResourcesPane lesson={initialLesson} />
                )}
                {activeTab === "qa" && <QAPane lesson={initialLesson} />}
              </div>

              {/* ===== PREV / NEXT NAV ===== */}
              <div className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                {prev ? (
                  <button
                    type="button"
                    onClick={() => onPickLesson(prev)}
                    className="group/prev flex items-center gap-3 rounded-xl border border-border bg-elevated/60 p-4 text-left transition-colors hover:border-border-strong"
                  >
                    <ChevronLeft
                      size={16}
                      aria-hidden
                      className="shrink-0 text-muted transition-transform duration-200 group-hover/prev:-translate-x-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-subtle">
                        Previous lesson
                      </div>
                      <div className="mt-0.5 truncate text-[13.5px] font-semibold text-text">
                        {prev.title}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div />
                )}
                {next ? (
                  <button
                    type="button"
                    onClick={onCompleteAndNext}
                    className="group/next flex items-center gap-3 rounded-xl border border-primary/30 bg-primary-soft p-4 text-left transition-colors hover:border-primary"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Next lesson
                      </div>
                      <div className="mt-0.5 truncate text-[13.5px] font-semibold text-text">
                        {next.title}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      aria-hidden
                      className="shrink-0 text-primary transition-transform duration-200 group-hover/next:translate-x-0.5"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/tracks/${trackId}`)}
                    className="flex items-center gap-3 rounded-xl border border-success/40 bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] p-4 text-left transition-colors hover:border-success"
                  >
                    <Award
                      size={18}
                      aria-hidden
                      className="shrink-0 text-success"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-success">
                        Track complete
                      </div>
                      <div className="mt-0.5 truncate text-[13.5px] font-semibold text-text">
                        Claim your certificate
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* ===== RIGHT: sidebar (desktop) ===== */}
            <aside className="hidden lg:block">
              <div className="sticky top-[84px] flex h-[calc(100vh-104px)] flex-col overflow-hidden rounded-[1.5rem] border border-border/60 bg-elevated/40 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <SidebarOutline
                  track={track}
                  lessons={lessons}
                  currentId={initialLesson.id}
                  completedMap={completed}
                  onPick={onPickLesson}
                />
                <div className="border-t border-border px-4 py-3">
                  <div className="flex items-center justify-between text-[12px] text-muted">
                    <span>
                      <span className="font-semibold text-text">
                        {doneCount}
                      </span>{" "}
                      / {lessons.length} done
                    </span>
                    <span className="font-semibold text-text">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-lg bg-border">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* ===== Mobile drawer ===== */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Course curriculum"
        >
          <button
            type="button"
            aria-label="Close curriculum"
            onClick={() => setDrawerOpen(false)}
            className="flex-1 bg-bg/60 backdrop-blur-sm"
          />
          <div className="flex h-full w-[88%] max-w-[380px] flex-col overflow-hidden border-l border-border bg-elevated shadow-[var(--shadow-elevated)]">
            <SidebarOutline
              track={track}
              lessons={lessons}
              currentId={initialLesson.id}
              completedMap={completed}
              onPick={onPickLesson}
              onClose={() => setDrawerOpen(false)}
            />
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center justify-between text-[12px] text-muted">
                <span>
                  <span className="font-semibold text-text">{doneCount}</span>{" "}
                  / {lessons.length} done
                </span>
                <span className="font-semibold text-text">{progressPct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-lg bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
