import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  RotateCcw,
  RotateCw,
  ListChecks,
  FileText,
  StickyNote,
  Download,
  MessagesSquare,
  PlayCircle,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle,
  ArrowUpRight,
  X,
} from "lucide-react";
import {
  getTrackById,
  getLessonsByTrack,
  getLessonById,
} from "../../data/tracks";
import { getMentorBySlug } from "../../data/mentors";
import Container from "../ui/Container";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import {
  getStored,
  setStored,
  getStoredJSON,
  setStoredJSON,
} from "../../utils/storage";

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

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/* ----------------------------------------------------------------------
   Persistence helpers
---------------------------------------------------------------------- */

const completedKey = (trackId) => `cn:progress:${trackId}`;
const noteKey = (trackId, lessonId) => `cn:notes:${trackId}:${lessonId}`;

function loadCompleted(trackId) {
  return getStoredJSON(completedKey(trackId), {});
}

function saveCompleted(trackId, map) {
  setStoredJSON(completedKey(trackId), map);
}

/* ----------------------------------------------------------------------
   Helpers
---------------------------------------------------------------------- */

function formatTime(s) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ----------------------------------------------------------------------
   Sidebar — course outline (grouped by course → lessons)
---------------------------------------------------------------------- */

function SidebarOutline({
  track,
  lessons,
  currentId,
  completedMap,
  onPick,
  onClose,
}) {
  const grouped = useMemo(() => {
    const m = new Map();
    for (const l of lessons) {
      const key = `${l.courseIndex}::${l.courseTitle}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(l);
    }
    return Array.from(m.entries()).map(([key, items]) => {
      const [_idx, title] = key.split("::");
      return { title, items };
    });
  }, [lessons]);

  const current = lessons.find((l) => l.id === currentId);
  const [openCourse, setOpenCourse] = useState(current?.courseIndex ?? 0);

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Career track
          </div>
          <Link
            to={`/tracks/${track.id}`}
            className="mt-1 inline-flex items-center gap-1 truncate font-display text-[14.5px] font-bold tracking-tight text-text transition-colors hover:text-primary"
          >
            {track.name}
            <ArrowUpRight size={12} className="shrink-0" aria-hidden />
          </Link>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close curriculum"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {/* Scrollable lesson list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {grouped.map((g, gi) => {
          const isOpen = openCourse === gi;
          const courseLessons = g.items;
          const doneInCourse = courseLessons.filter(
            (l) => completedMap[l.id]
          ).length;
          return (
            <div key={g.title} className="mb-2">
              <button
                type="button"
                onClick={() => setOpenCourse(isOpen ? -1 : gi)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface"
              >
                <span className="font-display text-[12.5px] font-bold uppercase tracking-[0.12em] text-text">
                  {String(gi + 1).padStart(2, "0")} · {g.title}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-subtle">
                  <span className="font-medium text-muted">
                    {doneInCourse}/{courseLessons.length}
                  </span>
                  <ChevronDown
                    size={13}
                    aria-hidden
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-0.5">
                  {courseLessons.map((l) => {
                    const isActive = l.id === currentId;
                    const isDone = !!completedMap[l.id];
                    const Icon = TYPE_ICON[l.type] || PlayCircle;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          onClick={() => onPick(l)}
                          aria-current={isActive ? "true" : undefined}
                          className={`group/lesson flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            isActive
                              ? "bg-primary-soft"
                              : "hover:bg-surface"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              isDone
                                ? "text-success"
                                : isActive
                                  ? "text-primary"
                                  : "text-subtle"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Circle size={14} />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[13px] font-medium leading-5 ${
                                isActive ? "text-primary" : "text-text"
                              } ${isDone ? "line-through opacity-70" : ""}`}
                            >
                              {l.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle">
                              <Icon size={10} aria-hidden />
                              <span>{TYPE_LABEL[l.type]}</span>
                              <span aria-hidden>·</span>
                              <span>{l.duration}</span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   Video player
---------------------------------------------------------------------- */

function VideoPlayer({ src, lesson, onEnded }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rate, setRate] = useState(1);
  const [showRates, setShowRates] = useState(false);
  const hideTimerRef = useRef(null);

  // Reset playback when lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrent(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [lesson.id]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const seekBy = useCallback((delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  }, []);

  const onSeek = useCallback((e) => {
    const v = videoRef.current;
    if (!v) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * (v.duration || 0);
    setProgress(pct);
  }, []);

  const setPlaybackRate = useCallback((r) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = r;
    setRate(r);
    setShowRates(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-hide controls when playing
  const nudgeControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (videoRef.current && !videoRef.current.paused) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2400);
    }
  }, []);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        seekBy(-10);
      } else if (e.code === "ArrowRight") {
        seekBy(10);
      } else if (e.code === "KeyM") {
        toggleMute();
      } else if (e.code === "KeyF") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, seekBy, toggleMute, toggleFullscreen]);

  return (
    <div
      ref={containerRef}
      onMouseMove={nudgeControls}
      onMouseLeave={() => {
        if (videoRef.current && !videoRef.current.paused) setShowControls(false);
      }}
      className="group/player relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-[var(--shadow-elevated)]"
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full"
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setCurrent(v.currentTime || 0);
          setProgress(((v.currentTime || 0) / (v.duration || 1)) * 100);
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
      />

      {/* Center play button when paused */}
      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-black/10 backdrop-blur-[1px] transition-opacity duration-200"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform duration-200 hover:scale-105 md:h-20 md:w-20">
            <Play size={28} fill="currentColor" />
          </span>
        </button>
      ) : null}

      {/* Lesson title overlay (top-left) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/55 to-transparent px-4 py-3 transition-opacity duration-200 sm:px-5 sm:py-4 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70">
          {lesson.courseTitle}
        </div>
        <div className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-white sm:text-[15px]">
          {lesson.title}
        </div>
      </div>

      {/* Controls bar */}
      <div
        className={`pointer-events-auto absolute inset-x-0 bottom-0 z-10 px-3 pb-3 transition-opacity duration-200 sm:px-5 sm:pb-4 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Scrubber */}
        <div className="mb-2 flex items-center gap-2">
          <span className="min-w-[36px] text-[11px] font-medium text-white/80">
            {formatTime(current)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={onSeek}
            aria-label="Seek"
            className="cn-scrubber h-1 w-full appearance-none rounded-full bg-white/25"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary) ${progress}%, transparent ${progress}%)`,
            }}
          />
          <span className="min-w-[36px] text-right text-[11px] font-medium text-white/80">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-black/45 px-2 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              type="button"
              onClick={() => seekBy(-10)}
              aria-label="Back 10 seconds"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={() => seekBy(10)}
              aria-label="Forward 10 seconds"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              <RotateCw size={14} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowRates((s) => !s)}
              aria-label="Playback speed"
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11.5px] font-semibold text-white hover:bg-white/15"
            >
              <Settings size={13} />
              {rate}x
            </button>
            {showRates ? (
              <div className="absolute bottom-9 right-10 z-20 grid w-28 grid-cols-1 gap-0.5 rounded-lg border border-white/10 bg-black/90 p-1 backdrop-blur-md">
                {PLAYBACK_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    className={`rounded-md px-2 py-1 text-left text-[12px] font-medium transition-colors hover:bg-white/15 ${
                      r === rate ? "text-primary" : "text-white"
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/15"
            >
              {isFullscreen ? (
                <Minimize2 size={14} />
              ) : (
                <Maximize2 size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------
   Tab content
---------------------------------------------------------------------- */

function OverviewPane({ lesson, mentor }) {
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

function NotesPane({ trackId, lessonId }) {
  const storageKey = noteKey(trackId, lessonId);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(getStored(storageKey, ""));
  }, [storageKey]);

  useEffect(() => {
    if (value === null) return;
    const id = setTimeout(() => {
      if (setStored(storageKey, value)) {
        setSaved(true);
        const t = setTimeout(() => setSaved(false), 1200);
        return () => clearTimeout(t);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [value, storageKey]);

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
        Notes are saved to this browser. Sync across devices comes with a paid
        plan.
      </p>
    </div>
  );
}

function TranscriptPane({ lesson }) {
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

function ResourcesPane({ lesson }) {
  const files = [
    {
      label: `${lesson.title} — slides.pdf`,
      meta: "2.1 MB · PDF",
    },
    {
      label: `Starter code repository`,
      meta: "GitHub · Public",
    },
    {
      label: `Recommended reading list`,
      meta: "3 articles",
    },
    {
      label: `Sandbox environment`,
      meta: "Hosted · 1-click open",
    },
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

function QAPane({ lesson }) {
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

/* ----------------------------------------------------------------------
   PAGE
---------------------------------------------------------------------- */

export default function LessonPlayerPage() {
  const { trackId, lessonId } = useParams();
  const navigate = useNavigate();
  const track = useMemo(() => getTrackById(trackId), [trackId]);
  const lessons = useMemo(() => getLessonsByTrack(trackId), [trackId]);

  const initialLesson = lessonId
    ? getLessonById(trackId, lessonId)
    : lessons[0];

  const [completed, setCompleted] = useState(() => loadCompleted(trackId));
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

  const doneCount = lessons.filter((l) => completed[l.id]).length;
  const progressPct = Math.round((doneCount / lessons.length) * 100);

  const mentor = track.leadMentorSlug
    ? getMentorBySlug(track.leadMentorSlug)
    : null;

  const onToggleComplete = () => {
    const newMap = { ...completed, [initialLesson.id]: !completed[initialLesson.id] };
    setCompleted(newMap);
    saveCompleted(trackId, newMap);
  };

  const onPickLesson = (l) => {
    setDrawerOpen(false);
    setActiveTab("overview");
    navigate(`/learn/${trackId}/${l.id}`);
  };

  const onCompleteAndNext = () => {
    const newMap = { ...completed, [initialLesson.id]: true };
    setCompleted(newMap);
    saveCompleted(trackId, newMap);
    if (next) {
      onPickLesson(next);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ============= MINIMAL TOP BAR ============= */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-xl">
        <Container size="xl">
          <div className="flex h-14 items-center gap-3">
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
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-border lg:w-40">
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
              <VideoPlayer
                src={VIDEO_SRC}
                lesson={initialLesson}
                onEnded={onCompleteAndNext}
              />

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

              {/* ===== TABS ===== */}
              <div className="mt-6 border-b border-border">
                <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative inline-flex h-11 shrink-0 items-center gap-1.5 px-3 text-[13px] font-semibold transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-muted hover:text-text"
                        }`}
                      >
                        <Icon size={13} aria-hidden />
                        {t.label}
                        {isActive ? (
                          <span
                            aria-hidden
                            className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
                          />
                        ) : null}
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
              <div className="sticky top-[72px] flex h-[calc(100vh-92px)] flex-col overflow-hidden rounded-2xl border border-border bg-elevated">
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
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
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
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
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
