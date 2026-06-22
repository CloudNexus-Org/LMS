import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  Video,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const LESSONS = [
  { title: "Cloud Fundamentals", duration: "12 min", progress: 100 },
  { title: "AWS VPC & Networking", duration: "18 min", progress: 72 },
  { title: "Docker & Kubernetes", duration: "24 min", progress: 0 },
];

const NOTIFICATIONS = [
  { icon: Award, text: "Certificate earned!", sub: "Cloud Basics" },
  { icon: Video, text: "Live mentor session", sub: "Starts in 10 min" },
];

function Equalizer() {
  return (
    <span aria-hidden className="inline-flex h-2.5 items-end gap-[2px]">
      <span className="eq-bar b1 h-full w-[2px] rounded-full bg-primary" />
      <span className="eq-bar b2 h-full w-[2px] rounded-full bg-primary" />
      <span className="eq-bar b3 h-full w-[2px] rounded-full bg-primary" />
    </span>
  );
}

function ProgressRing({ value, reduced }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <svg width="36" height="36" viewBox="0 0 44 44" aria-hidden>
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="3"
      />
      <motion.circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: reduced ? c - (68 / 100) * c : offset }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 2, ease: EASE, delay: 0.6 }
        }
        transform="rotate(-90 22 22)"
      />
      <text
        x="22"
        y="23"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-text text-[9px] font-bold"
        style={{ fontFamily: "inherit" }}
      >
        68%
      </text>
    </svg>
  );
}

export default function HeroLmsVisual() {
  const shouldReduceMotion = useReducedMotion();
  const [activeLesson, setActiveLesson] = useState(1);
  const [progress, setProgress] = useState(shouldReduceMotion ? 68 : 0);
  const [notifIndex, setNotifIndex] = useState(0);
  const [checkedLessons, setCheckedLessons] = useState(
    shouldReduceMotion ? [0] : []
  );

  useEffect(() => {
    if (shouldReduceMotion) return;

    const progressTimer = setTimeout(() => setProgress(68), 800);
    const checkTimer = setTimeout(() => setCheckedLessons([0]), 1400);
    const checkTimer2 = setTimeout(() => setCheckedLessons([0, 1]), 2200);

    const lessonCycle = setInterval(() => {
      setActiveLesson((prev) => (prev + 1) % LESSONS.length);
    }, 3200);

    const notifCycle = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
    }, 4000);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(checkTimer);
      clearTimeout(checkTimer2);
      clearInterval(lessonCycle);
      clearInterval(notifCycle);
    };
  }, [shouldReduceMotion]);

  const Notif = NOTIFICATIONS[notifIndex];
  const NotifIcon = Notif.icon;

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[520px] flex-col md:max-w-[560px] lg:mx-0 lg:max-w-none lg:w-full xl:max-w-[700px] 2xl:max-w-[740px]">
      <div
        className="absolute -inset-6 rounded-full bg-primary/10 blur-[60px]"
        aria-hidden
      />

      {/* Floating notification — stays inside hero bounds */}
      <motion.div
        key={notifIndex}
        initial={shouldReduceMotion ? false : { opacity: 0, x: 12, y: -6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="
          absolute right-0 top-0 z-20
          flex items-center gap-2
          rounded-lg border border-border
          bg-surface/95 px-2.5 py-1.5
          shadow-[var(--shadow-card-value)]
          backdrop-blur-md
        "
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-soft text-primary">
          <NotifIcon size={12} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold leading-tight text-text truncate">
            {Notif.text}
          </p>
          <p className="text-[9px] text-muted">{Notif.sub}</p>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        className={`flex h-full flex-1 flex-col ${shouldReduceMotion ? "" : "float-2"}`}
      >
        <div
          className="
            relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl
            border border-border bg-surface/80
            shadow-[var(--shadow-elevated-value)]
            backdrop-blur-xl
          "
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-danger/80" />
            <div className="h-2 w-2 rounded-full bg-warning/80" />
            <div className="h-2 w-2 rounded-full bg-success/80" />
            <span className="ml-1.5 truncate text-[10px] font-medium text-muted">
              learner.cloudnexus.app
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col space-y-2.5 p-3 sm:space-y-3 sm:p-3.5 lg:space-y-3 lg:p-4">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <BookOpen size={14} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-text">My Learning</p>
                  <p className="truncate text-[10px] text-muted">Cloud & DevOps Track</p>
                </div>
              </div>
              <ProgressRing value={progress} reduced={shouldReduceMotion} />
            </div>

            {/* Progress bar */}
            <div className="shrink-0">
              <div className="mb-1 flex justify-between text-[9px] font-medium">
                <span className="text-muted">Course progress</span>
                <motion.span
                  key={progress}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary"
                >
                  {progress}%
                </motion.span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-primary-soft">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: shouldReduceMotion ? "68%" : "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 2.2, ease: EASE, delay: 0.5 }
                  }
                />
              </div>
            </div>

            {/* Video preview — grows to fill card on desktop */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
              className="
                relative min-h-[120px] flex-1 overflow-hidden rounded-lg
                border border-border bg-elevated
                sm:min-h-[140px] lg:min-h-[180px]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-elevated to-accent-soft" />
              <div className="absolute inset-0 blueprint-grid opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    shouldReduceMotion ? {} : { scale: [1, 1.06, 1] }
                  }
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full border border-primary/30
                    bg-primary/90 text-white shadow-md
                    sm:h-10 sm:w-10
                  "
                >
                  <Play size={16} className="ml-0.5 fill-white" />
                </motion.div>
              </div>
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                <span className="rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                  Module 3 · VPC Setup
                </span>
                {!shouldReduceMotion && <Equalizer />}
              </div>
            </motion.div>

            {/* Lesson list — compact rows */}
            <ul className="shrink-0 space-y-1.5">
              {LESSONS.map((lesson, i) => {
                const isActive = activeLesson === i;
                const isDone =
                  checkedLessons.includes(i) || lesson.progress === 100;

                return (
                  <motion.li
                    key={lesson.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.1 + i * 0.12,
                      ease: EASE,
                    }}
                    className={`
                      flex items-center gap-2 rounded-lg border px-2.5 py-1.5
                      transition-colors duration-300
                      ${
                        isActive
                          ? "border-primary/40 bg-primary-soft"
                          : "border-border bg-elevated/60"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-6 w-6 shrink-0 items-center justify-center rounded-md
                        ${isDone ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}
                      `}
                    >
                      {isDone ? (
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[10px] font-bold">{i + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-text">
                        {lesson.title}
                      </p>
                      <p className="text-[9px] text-muted">{lesson.duration}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {isActive && !isDone && !shouldReduceMotion && (
                        <Equalizer />
                      )}
                      {isDone && (
                        <span className="text-[9px] font-semibold text-success">
                          Done
                        </span>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            {/* Enrolled course — inside card, no overflow */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
              className="
                flex shrink-0 items-center gap-2 rounded-lg border border-border
                bg-elevated/60 px-2.5 py-1.5
              "
            >
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-md bg-primary-soft">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=80&h=80&q=80"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-text">GenAI & ML</p>
                <p className="text-[9px] font-semibold text-primary">Enrolled ✓</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
