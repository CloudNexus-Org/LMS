import { motion, useReducedMotion } from "framer-motion";
import { Star, Clock3, Users, TrendingUp, Award } from "lucide-react";

import AWS from "@/assets/courses/thumbs/image1.webp";
import Azure from "@/assets/courses/thumbs/image2.webp";
import KUBERNETES from "@/assets/courses/thumbs/image8.webp";

const EASE = [0.16, 1, 0.3, 1];

const COURSE_CARDS = [
  {
    image: AWS,
    title: "AWS Solution Architect",
    author: "Dr. Arjan Singh",
    rating: "4.8",
    duration: "24h",
    learners: "15.4k",
    tag: "Bestseller",
    progress: 72,
    float: "float-1",
    offset: "ml-0",
  },
  {
    image: Azure,
    title: "Azure Generative AI",
    author: "Sarah Jenkins",
    rating: "4.9",
    duration: "18h",
    learners: "5k",
    tag: "New",
    progress: 48,
    float: "float-2",
    offset: "ml-auto",
  },
  {
    image: KUBERNETES,
    title: "Kubernetes Mastery",
    author: "Prof. Elena Rodriguez",
    rating: "4.9",
    duration: "28h",
    learners: "12k",
    tag: "Trending",
    progress: 35,
    float: "float-3",
    offset: "ml-6",
  },
];

const TAG_STYLES = {
  Bestseller: "bg-warning/15 text-warning border-warning/25",
  New: "bg-success/15 text-success border-success/25",
  Trending: "bg-primary-soft text-primary border-primary/25",
};

function CourseCard({ course, index, reduced }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.3 + index * 0.18 }}
      className={`
        w-[88%] max-w-[360px] ${course.offset}
        ${reduced ? "" : course.float}
      `}
    >
      <div
        className="
          flex gap-3 rounded-lg border border-border
          bg-surface/90 p-3 backdrop-blur-xl
          shadow-[var(--shadow-elevated-value)]
          transition-transform duration-300 hover:scale-[1.02]
        "
      >
        {/* Thumbnail */}
        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg bg-elevated">
          <img
            src={course.image}
            alt={course.title}
            width={76}
            height={76}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[13px] font-bold leading-tight text-text">
              {course.title}
            </p>
            <span
              className={`
                shrink-0 rounded-md border px-1.5 py-0.5
                text-[9px] font-bold uppercase tracking-wide
                ${TAG_STYLES[course.tag] || TAG_STYLES.Trending}
              `}
            >
              {course.tag}
            </span>
          </div>

          <p className="mt-0.5 truncate text-[11px] text-muted">
            {course.author}
          </p>

          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Star size={11} className="fill-warning text-warning" />
              <span className="font-semibold text-text">{course.rating}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={11} />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={11} />
              {course.learners}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-primary-soft">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: reduced ? `${course.progress}%` : "0%" }}
              animate={{ width: `${course.progress}%` }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.6, ease: EASE, delay: 0.8 + index * 0.18 }
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroLmsVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[480px] xl:max-w-[520px]">
      {/* Ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[90px]"
        aria-hidden
      />

      {/* Floating stat badge — top right */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        className={`
          absolute -right-2 -top-4 z-20
          flex items-center gap-2.5 rounded-lg border border-border
          bg-surface/95 px-3.5 py-2.5 backdrop-blur-md
          shadow-[var(--shadow-elevated-value)]
          ${reduced ? "" : "float-2"}
        `}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
          <TrendingUp size={16} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13px] font-bold leading-tight text-text">
            +48% skills
          </p>
          <p className="text-[10px] text-muted">in 3 months</p>
        </div>
      </motion.div>

      {/* Course cards stack */}
      <div className="relative z-10 flex flex-col gap-4 py-4">
        {COURSE_CARDS.map((course, i) => (
          <CourseCard key={course.title} course={course} index={i} reduced={reduced} />
        ))}
      </div>

      {/* Floating achievement badge — bottom left */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -24, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1.2 }}
        className={`
          absolute -bottom-3 -left-3 z-20
          flex items-center gap-2.5 rounded-lg border border-border
          bg-surface/95 px-3.5 py-2.5 backdrop-blur-md
          shadow-[var(--shadow-elevated-value)]
          ${reduced ? "" : "float-3"}
        `}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Award size={17} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[12px] font-bold leading-tight text-text">
            Certificate earned
          </p>
          <p className="text-[10px] text-muted">Cloud Fundamentals</p>
        </div>
      </motion.div>
    </div>
  );
}
