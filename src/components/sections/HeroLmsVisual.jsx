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
    <span aria-hidden className="inline-flex h-3 items-end gap-[2px]">
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
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
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
    <div className="relative mx-auto w-full max-w-[480px] xl:max-w-[520px]">
      {/* Ambient glow */}
      <div
        className="absolute -inset-8 rounded-full bg-primary/[0.07] blur-[80px]"
        aria-hidden
      />

      {/* Floating notification */}
      <motion.div
        key={notifIndex}
        initial={shouldReduceMotion ? false : { opacity: 0, x: 20, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="
          absolute -right-2 -top-6 z-20
          flex items-center gap-2.5
          rounded-lg border border-border
          bg-surface/95 px-3.5 py-2.5
          shadow-[var(--shadow-elevated-value)]
          backdrop-blur-md
        "
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <NotifIcon size={15} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[12px] font-semibold leading-tight text-text">
            {Notif.text}
          </p>
          <p className="text-[10px] text-muted">{Notif.sub}</p>
        </div>
        {!shouldReduceMotion && (
          <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-success animate-pulse" />
        )}
      </motion.div>

      {/* Main dashboard card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        className={shouldReduceMotion ? "" : "float-2"}
      >
        <div
          className="
            relative overflow-hidden rounded-lg
            border border-border bg-surface/85
            shadow-[var(--shadow-elevated-value),0_0_48px_rgba(139,97,210,0.08)]
            backdrop-blur-xl
          "
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-danger/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/80" />
            <span className="ml-2 text-[11px] font-medium text-muted">
              learner.cloudnexus.app
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-text">My Learning</p>
                  <p className="text-[11px] text-muted">Cloud & DevOps Track</p>
                </div>
              </div>
              <ProgressRing value={progress} reduced={shouldReduceMotion} />
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-[10px] font-medium">
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
              <div className="h-2 overflow-hidden rounded-full bg-primary-soft">
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

            {/* Video preview */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
              className="
                relative mt-4 overflow-hidden rounded-lg
                border border-border bg-elevated
                aspect-[16/9]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-elevated to-accent-soft" />
              <div className="absolute inset-0 blueprint-grid opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : { scale: [1, 1.08, 1] }
                  }
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-lg border border-primary/30
                    bg-primary/90 text-white shadow-lg
                  "
                >
                  <Play size={18} className="ml-0.5 fill-white" />
                </motion.div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  Module 3 · VPC Setup
                </span>
                {!shouldReduceMotion && <Equalizer />}
              </div>
            </motion.div>

            {/* Lesson list */}
            <ul className="mt-4 space-y-2">
              {LESSONS.map((lesson, i) => {
                const isActive = activeLesson === i;
                const isDone =
                  checkedLessons.includes(i) || lesson.progress === 100;

                return (
                  <motion.li
                    key={lesson.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.1 + i * 0.12,
                      ease: EASE,
                    }}
                    className={`
                      flex items-center gap-3 rounded-lg border px-3 py-2.5
                      transition-colors duration-300
                      ${
                        isActive
                          ? "border-primary/40 bg-primary-soft"
                          : "border-border bg-elevated/60"
                      }
                    `}
                  >
                    <motion.div
                      animate={
                        isDone
                          ? { scale: [1, 1.15, 1], rotate: [0, 0, 0] }
                          : isActive && !shouldReduceMotion
                            ? { scale: [1, 1.05, 1] }
                            : {}
                      }
                      transition={{
                        duration: 0.4,
                        repeat: isActive && !isDone ? Infinity : 0,
                        repeatDelay: 1.5,
                      }}
                      className={`
                        flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                        ${isDone ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}
                      `}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[11px] font-bold">{i + 1}</span>
                      )}
                    </motion.div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-text">
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-muted">{lesson.duration}</p>
                    </div>

                    {isActive && !isDone && !shouldReduceMotion && (
                      <Equalizer />
                    )}
                    {isDone && (
                      <span className="text-[10px] font-semibold text-success">
                        Done
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Floating course card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, x: -24, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
        className={`
          absolute -bottom-4 -left-4 z-10
          rounded-lg border border-border
          bg-surface/95 px-3 py-2.5
          shadow-[var(--shadow-card-value)] backdrop-blur-md
          ${shouldReduceMotion ? "" : "float-3"}
        `}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-lg bg-primary-soft">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=80&h=80&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold text-text">GenAI & ML</p>
            <p className="text-[10px] text-primary font-semibold">Enrolled ✓</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
