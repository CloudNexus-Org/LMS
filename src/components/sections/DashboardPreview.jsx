import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Award,
  Users,
  Settings,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lock,
  Volume2,
  VolumeX,
  Radio,
  ChevronDown,
} from "lucide-react";
import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';
import Tag from '@/components/ui/Tag';

// Drop your video at: public/videos/dashboard-preview.mp4
// Vite serves the public folder as-is, so no import / rebuild needed.
const VIDEO_SRC = "/videos/dashboard-preview.mp4";

// Loop length used when no video has loaded yet (ms)
const FALLBACK_LOOP_MS = 9000;

const SIDEBAR_ITEMS = [
  { Icon: Home, label: "Dashboard", active: true },
  { Icon: BookOpen, label: "My courses" },
  { Icon: Award, label: "Certificates" },
  { Icon: Users, label: "Mentors" },
  { Icon: Settings, label: "Settings" },
];

const LESSONS = [
  {
    title: "Networking & VPC",
    duration: "12m",
    durationMin: 12,
    mentor: "Dr. Arjan Singh",
  },
  {
    title: "Identity & Access (IAM)",
    duration: "18m",
    durationMin: 18,
    mentor: "Dr. Arjan Singh",
  },
  {
    title: "EC2 deep dive",
    duration: "32m",
    durationMin: 32,
    mentor: "Dr. Arjan Singh",
  },
  {
    title: "S3 storage classes",
    duration: "16m",
    durationMin: 16,
    mentor: "Priya Menon",
  },
  {
    title: "Lambda + API Gateway",
    duration: "28m",
    durationMin: 28,
    mentor: "Priya Menon",
  },
];

const TOTAL_TRACK_MIN = LESSONS.reduce((s, l) => s + l.durationMin, 0);

// Precompute each lesson's normalised [start, end] position in the 0..1 loop.
const LESSON_BOUNDS = (() => {
  let cum = 0;
  return LESSONS.map((l) => {
    const start = cum / TOTAL_TRACK_MIN;
    cum += l.durationMin;
    return { start, end: cum / TOTAL_TRACK_MIN };
  });
})();

function findLessonAt(loopFraction) {
  const f = Math.max(0, Math.min(0.99999, loopFraction));
  for (let i = 0; i < LESSON_BOUNDS.length; i++) {
    const { start, end } = LESSON_BOUNDS[i];
    if (f < end) {
      return { index: i, within: (f - start) / (end - start) };
    }
  }
  return { index: LESSONS.length - 1, within: 1 };
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Equalizer() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-flex h-3 items-end gap-[2px]"
    >
      <span className="eq-bar b1 h-full w-[2px] rounded-full bg-primary" />
      <span className="eq-bar b2 h-full w-[2px] rounded-full bg-primary" />
      <span className="eq-bar b3 h-full w-[2px] rounded-full bg-primary" />
    </span>
  );
}

function VideoPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-soft via-bg to-accent-soft"
    >
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="float-1 absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <div className="float-2 absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-text text-bg shadow-[var(--shadow-elevated)]">
        <Play size={22} className="ml-1 fill-current" />
        <span className="absolute inset-0 animate-ping rounded-full ring-2 ring-text/30" />
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const startRef = useRef(0);
  const rafRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lessonWithin, setLessonWithin] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      cancelAnimationFrame(rafRef.current);
      const v = videoRef.current;
      if (v && !v.paused) v.pause();
      return;
    }

    const v = videoRef.current;
    if (v?.paused) v.play().catch(() => { });

    startRef.current = performance.now();

    const tick = (now) => {
      const vid = videoRef.current;
      let loopFrac;

      if (
        vid &&
        !vid.paused &&
        Number.isFinite(vid.duration) &&
        vid.duration > 0
      ) {
        loopFrac = vid.currentTime / vid.duration;
      } else {
        loopFrac = ((now - startRef.current) % FALLBACK_LOOP_MS) / FALLBACK_LOOP_MS;
      }

      const { index, within } = findLessonAt(loopFrac);

      // Track progress is weighted by real lesson lengths, so longer lessons
      // move the bar more — same as a real LMS.
      let completedMin = 0;
      for (let i = 0; i < index; i++) completedMin += LESSONS[i].durationMin;
      completedMin += within * LESSONS[index].durationMin;

      setActiveIndex(index);
      setLessonWithin(within);
      setTrackProgress((completedMin / TOTAL_TRACK_MIN) * 100);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView]);

  const activeLesson = LESSONS[activeIndex];
  const lessonTotalSec = activeLesson.durationMin * 60;
  const lessonElapsedSec = lessonWithin * lessonTotalSec;
  const lessonNumberLabel = `Lesson ${String(activeIndex + 1).padStart(2, "0")} / 12`;
  const isPlaying = videoReady && !videoFailed && isInView;

  return (
    <SectionShell>
      <Container>
        <SectionHeading
          eyebrow="The platform"
          title="A learning workspace,"
          highlight="not a video player"
          description="Track progress, ship projects, and join live sessions \u2014 all from one focused workspace."
        />

        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary-soft to-accent/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] bg-gradient-to-br from-primary/25 via-transparent to-accent/20 opacity-50 blur-xl"
          />

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="overflow-hidden rounded-2xl border border-border bg-elevated shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-center justify-between border-b border-border bg-bg/60 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/70 transition hover:bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70 transition hover:bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70 transition hover:bg-success" />
              </div>

              <div className="flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-1 text-[11px] text-subtle">
                <Lock size={11} className="text-success" />
                <span className="hidden sm:inline">
                  app.cloudnexus.io / dashboard
                </span>
                <span className="sm:hidden">cloudnexus.io</span>
              </div>

              <div className="flex items-center gap-1.5">
                {isPlaying ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-subtle">
                    <span className="h-1.5 w-1.5 rounded-full bg-subtle" />
                    Idle
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
              <aside className="hidden border-r border-border bg-bg/40 p-3 md:flex md:flex-col md:justify-between">
                <div>
                  <div className="mb-4 flex items-center gap-2 px-2 py-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_12px_var(--primary-soft)]">
                      <Award size={12} className="text-white" />
                    </span>
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-text">
                      CLOUD NEXUS
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {SIDEBAR_ITEMS.map((it, i) => (
                      <motion.li
                        key={it.label}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: 0.2 + i * 0.06,
                        }}
                      >
                        <button
                          type="button"
                          className={`group relative flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium transition ${it.active
                            ? "bg-primary-soft text-primary"
                            : "text-muted hover:bg-bg/60 hover:text-text"
                            }`}
                        >
                          {it.active ? (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary shadow-[0_0_10px_var(--primary)]"
                            />
                          ) : null}
                          <it.Icon size={14} />
                          {it.label}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-bg/60 p-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white">
                    AS
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-semibold text-text">
                      Aarav Sharma
                    </div>
                    <div className="text-[10px] text-subtle">
                      Pro · Cloud track
                    </div>
                  </div>
                </div>
              </aside>

              <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag variant="primary" size="sm">
                    Cloud Computing
                  </Tag>
                  <Tag variant="default" size="sm">
                    Track 3 of 8
                  </Tag>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[18px] font-bold text-text md:text-[22px]">
                    AWS Solution Architect
                  </h3>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 py-1 pl-1 pr-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-[10px] font-bold text-white">
                      AS
                    </span>
                    <span className="text-[11px] text-muted">Mentor:</span>
                    <span className="text-[11px] font-semibold text-text">
                      Dr. Arjan Singh
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12px] text-muted">
                    <span>Track progress</span>
                    <span className="font-mono">
                      <span className="font-semibold text-text">
                        {Math.round(trackProgress)}%
                      </span>{" "}
                      complete
                    </span>
                  </div>
                  <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_var(--primary-soft)] transition-[width] duration-150"
                      style={{ width: `${trackProgress}%` }}
                    >
                      <div className="shimmer-sweep absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-xl border border-border bg-bg/40 p-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-bg shadow-[var(--shadow-card)]">
                      {(!videoReady || videoFailed) && <VideoPlaceholder />}

                      {!videoFailed ? (
                        <video
                          ref={videoRef}
                          src={VIDEO_SRC}
                          autoPlay
                          muted={muted}
                          loop
                          playsInline
                          preload="auto"
                          aria-label="EC2 deep dive lesson preview"
                          onLoadedData={() => setVideoReady(true)}
                          onError={() => setVideoFailed(true)}
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"
                            }`}
                        />
                      ) : null}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                      />

                      {isPlaying ? (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-danger/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-[var(--shadow-card)]">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                          Live
                        </div>
                      ) : null}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-black/55 px-2 py-1 font-mono backdrop-blur">
                            {lessonNumberLabel}
                          </span>
                          <span className="rounded-md bg-black/55 px-2 py-1 font-mono backdrop-blur tabular-nums">
                            {formatTime(lessonElapsedSec)} /{" "}
                            {formatTime(lessonTotalSec)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMuted((m) => !m)}
                          aria-label={muted ? "Unmute video" : "Mute video"}
                          className="rounded-md bg-black/55 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
                        >
                          {muted ? (
                            <VolumeX size={12} />
                          ) : (
                            <Volume2 size={12} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-semibold text-text transition-colors duration-300">
                          {activeLesson.title}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-muted transition-colors duration-300">
                          with {activeLesson.mentor}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-bg/60 px-3 py-1.5 text-[12px] font-semibold text-primary transition hover:border-primary hover:bg-primary-soft"
                      >
                        Continue
                        <ArrowRight
                          size={12}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-bg/40 p-4">
                    <div className="mb-3 flex items-center justify-between text-[12px] font-semibold text-text">
                      <span className="inline-flex items-center gap-1.5">
                        <ChevronDown size={12} className="text-subtle" />
                        Module: Compute
                      </span>
                      <span className="text-[11px] font-medium text-subtle">
                        5 lessons
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {LESSONS.map((l, i) => {
                        const isCurrent = i === activeIndex;
                        const isDone = i < activeIndex;
                        return (
                          <motion.li
                            key={l.title}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.35,
                              delay: 0.4 + i * 0.06,
                            }}
                          >
                            <button
                              type="button"
                              className={`relative flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[12px] transition ${isCurrent
                                ? "border-primary/40 bg-primary-soft text-text"
                                : isDone
                                  ? "border-transparent text-muted/85 hover:bg-bg/60"
                                  : "border-transparent text-muted hover:bg-bg/60 hover:text-text"
                                }`}
                            >
                              {isCurrent ? (
                                <span
                                  aria-hidden="true"
                                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary shadow-[0_0_10px_var(--primary)]"
                                />
                              ) : null}
                              <span className="flex items-center gap-2">
                                {isDone ? (
                                  <CheckCircle2
                                    size={14}
                                    className="text-success"
                                  />
                                ) : isCurrent ? (
                                  <Equalizer />
                                ) : (
                                  <Clock size={14} />
                                )}
                                <span
                                  className={
                                    isCurrent ? "font-semibold text-text" : ""
                                  }
                                >
                                  {l.title}
                                </span>
                              </span>
                              <span className="text-[11px]">{l.duration}</span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </SectionShell>
  );
}
