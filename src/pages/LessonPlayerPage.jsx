import { useMemo, useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
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
  Clock3,
  PanelRightOpen,
  Keyboard,
} from "lucide-react";
import { getTrackById, getLessonsByTrack } from "@/data/tracks";
import { getMentorBySlug } from "@/data/mentors";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { VideoPlayer } from "@/features/learn/components/player/VideoPlayer";
import { SidebarOutline } from "@/features/learn/components/sidebar/SidebarOutline";
import {
  OverviewPane,
  NotesPane,
  TranscriptPane,
  ResourcesPane,
  QAPane,
} from "@/features/learn/components/tabs/LessonTabs";
import { useCourseProgress } from "@/features/learn/hooks/useCourseProgress";
import { saveLastLearningSession } from "@/features/learn/learningSession";

const EASE = [0.16, 1, 0.3, 1];
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

function ProgressRing({ pct, size = 40 }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="learn-progress-ring" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} className="learn-progress-ring-bg" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="learn-progress-ring-fill"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export default function LessonPlayerPage() {
  const { trackId, lessonId } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
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

  useEffect(() => {
    if (track && !lessonId && lessons[0]) {
      navigate(`/learn/${trackId}/${lessons[0].id}`, { replace: true });
    }
  }, [track, lessonId, lessons, trackId, navigate]);

  useEffect(() => {
    if (!track || !initialLesson) return;
    saveLastLearningSession({
      trackId,
      lessonId: initialLesson.id,
      trackName: track.name,
      lessonTitle: initialLesson.title,
    });
  }, [track, trackId, initialLesson]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [initialLesson?.id]);

  if (!track) return <Navigate to="/tracks" replace />;
  if (!initialLesson) return <Navigate to={`/tracks/${trackId}`} replace />;

  const idx = lessons.findIndex((l) => l.id === initialLesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const isDone = completed[initialLesson.id];
  const TypeIcon = TYPE_ICON[initialLesson.type] || PlayCircle;

  const mentor = track.leadMentorSlug ? getMentorBySlug(track.leadMentorSlug) : null;

  const onToggleComplete = () => toggleLessonComplete(initialLesson.id);

  const onPickLesson = (l) => {
    setDrawerOpen(false);
    setActiveTab("overview");
    navigate(`/learn/${trackId}/${l.id}`);
  };

  const onCompleteAndNext = () => {
    markLessonComplete(initialLesson.id);
    if (next) onPickLesson(next);
  };

  return (
    <div className="learn-page min-h-screen bg-bg text-text">
      {/* Ambient glow */}
      <div className="learn-ambient" aria-hidden />

      {/* Top progress hairline */}
      <div className="learn-hairline" aria-hidden>
        <motion.div
          className="learn-hairline-fill"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>

      {/* Header */}
      <header className="learn-header sticky top-0 z-40">
        <div className="learn-header-inner">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              to={`/tracks/${track.id}`}
              className="learn-back-btn"
              aria-label="Back to track"
            >
              <ArrowLeft size={15} aria-hidden />
              <span className="hidden sm:inline">Back to track</span>
            </Link>

            <div className="hidden h-5 w-px bg-border md:block" />

            <div className="min-w-0 flex-1">
              <p className="learn-breadcrumb">{track.name}</p>
              <p className="learn-lesson-meta truncate">
                Lesson {idx + 1} of {lessons.length} · {initialLesson.title}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative">
                <ProgressRing pct={progressPct} />
                <span className="learn-progress-pct">{progressPct}%</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Progress</p>
                <p className="text-xs font-bold text-text">
                  {doneCount}/{lessons.length} lessons
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="learn-curriculum-btn lg:hidden"
            >
              <PanelRightOpen size={15} />
              <span className="hidden xs:inline">Curriculum</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="learn-main">
        <div className="learn-grid">
          {/* Left column */}
          <div className="learn-content min-w-0">
            <motion.div
              key={initialLesson.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="learn-player-shell">
                <VideoPlayer
                  src={VIDEO_SRC}
                  lesson={initialLesson}
                  onEnded={onCompleteAndNext}
                />
              </div>

              {/* Lesson header */}
              <div className="learn-lesson-header">
                <div className="min-w-0 flex-1">
                  <div className="learn-lesson-chips">
                    <span className="learn-chip">{initialLesson.courseTitle}</span>
                    <span className="learn-chip learn-chip-primary">
                      <TypeIcon size={11} aria-hidden />
                      {TYPE_LABEL[initialLesson.type]}
                    </span>
                    <span className="learn-chip">
                      <Clock3 size={11} aria-hidden />
                      {initialLesson.duration}
                    </span>
                  </div>
                  <h1 className="learn-title">{initialLesson.title}</h1>
                </div>

                <motion.button
                  type="button"
                  onClick={onToggleComplete}
                  whileTap={{ scale: 0.97 }}
                  className={`learn-complete-btn ${isDone ? "learn-complete-btn-done" : ""}`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 size={15} aria-hidden />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle size={15} aria-hidden />
                      Mark complete
                    </>
                  )}
                </motion.button>
              </div>

              {/* Keyboard hint */}
              <div className="learn-shortcuts hidden md:flex">
                <Keyboard size={13} className="text-muted" />
                <span>
                  <kbd>Space</kbd> play · <kbd>←</kbd><kbd>→</kbd> seek · <kbd>M</kbd> mute · <kbd>F</kbd> fullscreen
                </span>
              </div>

              {/* Tabs */}
              <div className="learn-tabs-shell">
                <div className="learn-tabs" role="tablist">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(t.id)}
                        className={`learn-tab ${isActive ? "learn-tab-active" : ""}`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="learn-tab-indicator"
                            className="learn-tab-indicator"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon size={14} className="relative z-[1]" aria-hidden />
                        <span className="relative z-[1]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab content */}
              <div className="learn-tab-panel dashboard-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${initialLesson.id}-${activeTab}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev / Next */}
              <div className="learn-nav-grid">
                {prev ? (
                  <motion.button
                    type="button"
                    onClick={() => onPickLesson(prev)}
                    whileHover={{ y: -2 }}
                    className="learn-nav-card"
                  >
                    <ChevronLeft size={16} className="shrink-0 text-muted" />
                    <div className="min-w-0">
                      <p className="learn-nav-label">Previous</p>
                      <p className="learn-nav-title">{prev.title}</p>
                    </div>
                  </motion.button>
                ) : (
                  <div />
                )}

                {next ? (
                  <motion.button
                    type="button"
                    onClick={onCompleteAndNext}
                    whileHover={{ y: -2 }}
                    className="learn-nav-card learn-nav-card-next"
                  >
                    <div className="min-w-0 text-right">
                      <p className="learn-nav-label learn-nav-label-primary">Up next</p>
                      <p className="learn-nav-title">{next.title}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-primary" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => navigate(`/tracks/${trackId}`)}
                    whileHover={{ y: -2 }}
                    className="learn-nav-card learn-nav-card-done"
                  >
                    <Award size={18} className="shrink-0 text-success" />
                    <div className="min-w-0 text-right">
                      <p className="learn-nav-label text-success">Track complete</p>
                      <p className="learn-nav-title">Claim your certificate</p>
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Desktop sidebar */}
          <aside className="learn-sidebar hidden lg:block">
            <div className="learn-sidebar-inner">
              <SidebarOutline
                track={track}
                lessons={lessons}
                currentId={initialLesson.id}
                completedMap={completed}
                onPick={onPickLesson}
              />
              <div className="learn-sidebar-footer">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    <span className="font-bold text-text">{doneCount}</span> / {lessons.length} done
                  </span>
                  <span className="font-bold text-primary">{progressPct}%</span>
                </div>
                <div className="learn-sidebar-progress">
                  <motion.div
                    className="learn-sidebar-progress-fill"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close curriculum"
              className="learn-drawer-backdrop lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="learn-drawer lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Course curriculum"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <SidebarOutline
                track={track}
                lessons={lessons}
                currentId={initialLesson.id}
                completedMap={completed}
                onPick={onPickLesson}
                onClose={() => setDrawerOpen(false)}
              />
              <div className="learn-sidebar-footer">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>
                    <span className="font-bold text-text">{doneCount}</span> / {lessons.length} done
                  </span>
                  <span className="font-bold text-primary">{progressPct}%</span>
                </div>
                <div className="learn-sidebar-progress">
                  <div
                    className="learn-sidebar-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
