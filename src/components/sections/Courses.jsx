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
      whileHover={{ y: -8 }}
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
              relative h-[220px]
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
                transition-transform duration-700
                group-hover:scale-105
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
                absolute left-4 top-4
                inline-flex items-center gap-2
                rounded-full
                px-3 py-1
                text-[10px]
                font-semibold
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
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
          {/* TITLE */}
          <h3
            className="
              text-[23px]
              font-semibold
              leading-[1.12]
              tracking-tight
              text-text
              transition-colors duration-300
              group-hover:text-primary
            "
          >
            {course.title}
          </h3>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3
              text-[13.5px]
              leading-6
              text-muted
            "
          >
            Learn practical cloud-native engineering skills with
            real-world projects and production-ready mentorship.
          </p>

          {/* META */}
          <div
            className="
              mt-6
              flex flex-wrap items-center
              gap-2
            "
          >
            {/* RATING */}
            <div
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                bg-surface
                px-3 py-2
              "
            >
              <Star
                size={13}
                className="fill-primary text-primary"
              />

              <span className="text-[12px] font-semibold text-text">
                {course.rating}
              </span>
            </div>

            {/* TIME */}
            <div
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                bg-surface
                px-3 py-2
              "
            >
              <Clock3
                size={13}
                className="text-primary"
              />

              <span className="text-[12px] font-semibold text-text">
                {course.duration}
              </span>
            </div>

            {/* MODULES */}
            <div
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                bg-surface
                px-3 py-2
              "
            >
              <Layers3
                size={13}
                className="text-primary"
              />

              <span className="text-[12px] font-semibold text-text">
                {course.modules} Modules
              </span>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="
              mt-auto pt-7
              flex items-center justify-between
            "
          >
            {/* USERS */}
            <div
              className="
                flex items-center gap-2
                text-[12px]
                text-muted
              "
            >
              <Users size={13} />

              <span>
                <span className="font-semibold text-text">
                  {course.enrolled}
                </span>{" "}
                enrolled
              </span>
            </div>

            {/* BUTTON */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                bg-primary
                px-4 py-2
                text-[12px]
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.28)]
                transition-all duration-300
                group-hover:translate-x-1
              "
            >
              Explore

              <ArrowRight
                size={13}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
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
              transition-all duration-300
              hover:-translate-y-1
              hover:border-primary
              hover:text-primary
            "
          >
            Browse all {tracks.length} career tracks

            <ArrowRight
              size={15}
              className="
                transition-transform duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </Container>
    </SectionShell>
  );
}