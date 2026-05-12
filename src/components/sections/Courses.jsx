import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Clock3,
  Users,
  Layers3,
} from "lucide-react";

import { featuredCourses } from "../../data/courses";
import { tracks } from "../../data/tracks";

import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import Container from "../ui/Container";

const EASE = [0.16, 1, 0.3, 1];

// FIND TRACK
function findTrackForCourse(courseId) {
  return tracks.find((t) => t.courseIds.includes(courseId)) || tracks[0];
}

// PROFESSIONAL UNIQUE VARIANTS
const CARD_VARIANTS = [
  {
    accent: "from-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-400",
    imageRadius: "rounded-[5px]",
  },

  {
    accent: "from-violet-500/20",
    badge: "bg-violet-500/10 text-violet-400",
    imageRadius: "rounded-[5px]",
  },

  {
    accent: "from-blue-500/20",
    badge: "bg-blue-500/10 text-blue-400",
    imageRadius: "rounded-[5px]",
  },
];

// COURSE CARD
function CourseCard({ course, index }) {
  const track = findTrackForCourse(course.id);
  const href = track ? `/tracks/${track.id}` : "/tracks";

  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        ease: EASE,
        delay: index * 0.06,
      }}
      className="group h-full"
    >
      <Link
        to={href}
        className="
          relative flex h-full flex-col
          overflow-hidden
          rounded-[10px]
          border border-border/60
          bg-elevated/90
          backdrop-blur-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          transition-all duration-500
          hover:border-primary/20
          hover:shadow-[0_25px_80px_rgba(37,99,235,0.14)]
        "
      >
        {/* TOP GLOW */}
        <div
          className={`
            absolute right-0 top-0
            h-32 w-32 rounded-full
            bg-gradient-to-br ${variant.accent} to-transparent
            blur-3xl
            opacity-80
          `}
        />

        {/* IMAGE */}
        <div className="relative p-4 pb-0">
          <div
            className={`
              relative h-[190px]
              overflow-hidden
              bg-[#071018]
              ${variant.imageRadius}
            `}
          >
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              className="
                h-full w-full
                object-cover
              "
            />

            {/* OVERLAY */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-black/60
                via-black/10
                to-transparent
              "
            />

            {/* BADGE */}
            <div
              className={`
                absolute right-2 top-2
                inline-flex items-center gap-2
                rounded-full
                px-1 py-1
                text-[10px]
                font-normal
                uppercase tracking-[0.18em]
                backdrop-blur-xl
                ${variant.badge}
              `}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {course.difficulty}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {/* CONTENT */}
<div className="flex flex-1 flex-col px-5 pb-5 pt-4">
  {/* TITLE & RATING ROW (Dono ko ek line mein ya upar-neeche balanced rakhein) */}
  <div className="flex flex-col gap-1">
    <h3 className="text-[22px] font-semibold leading-[1.2] tracking-tight text-text transition-colors duration-300 group-hover:text-primary">
      {course.title}
    </h3>
    <p className="text-[12px] font-medium text-text transition-colors duration-300 group-hover:text-primary uppercase tracking-[0.1em] ">
      By {course.professor}
    </p>
  </div>

  {/* META STATS - Title ke thik niche for quick value check */}
  <div className="mt-4 flex flex-wrap items-center gap-2">
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 border border-border/40">
      <Star size={12} className="fill-primary text-primary" />
      <span className="text-[13px] font-bold text-text">{course.rating}</span>
    </div>
    
    <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 border border-border/40">
      <Clock3 size={12} className="text-muted" />
      <span className="text-[13px] font-medium text-text">{course.duration}</span>
    </div>

    <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 border border-border/40">
      <Layers3 size={12} className="text-muted" />
      <span className="text-[13px] font-medium text-text">{course.modules} Modules</span>
    </div>
  </div>

  {/* DESCRIPTION - Thoda gap dekar */}
  <p className="mt-3 text-[13.5px] leading-relaxed text-text line-clamp-2 opacity-90">
    "{course.description}"
  </p>

  {/* FOOTER - Sabse niche aligned */}
  <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/30">
    <div className="flex items-center gap-2 text-[12px] text-muted">
      <Users size={16} className="opacity-70" />
      <span>
        <span className="font-semibold text-text">{course.enrolled}</span> enrolled
      </span>
    </div>

    <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95">
      Explore
      <ArrowRight size={16} />
    </div>
  </div>
</div>
      </Link>
    </motion.div>
  );
}

// MAIN COMPONENT
export default function Courses() {
  return (
    <SectionShell id="courses" glow>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Featured Courses"
          title="Career-aligned learning paths"
          highlight="built by senior engineers."
          description="Curated tracks designed for the next generation of cloud, AI, and full-stack engineers."
        />

        {/* GRID */}
        <div
          className="
            mt-14
            grid grid-cols-1
            gap-7
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {featuredCourses.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              index={i}
            />
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/tracks"
            className="
              group inline-flex items-center gap-2
              rounded-full
              border border-border
              bg-elevated
              px-7 py-3
              text-[14px]
              font-semibold
              text-text
              transition-all duration-300 ease-out
              hover:border-primary
              hover:text-primary
            "
          >
            Browse all {tracks.length} career tracks

            <ArrowRight
              size={15}
              className="
                transition-all duration-300 ease-out
              "
            />
          </Link>
        </div>
      </Container>
    </SectionShell>
  );
}