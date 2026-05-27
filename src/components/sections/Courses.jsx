import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Clock3,
  Users,
  Layers3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { featuredCourses } from '@/data/courses';
import { tracks } from '@/data/tracks';

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';

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
      className="group h-full min-h-[300px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <Link
        to={href}
        className="
          relative flex h-full flex-col
          overflow-hidden
          rounded-[5px]
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
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          {/* TITLE & RATING ROW (Dono ko ek line mein ya upar-neeche balanced rakhein) */}
          <div className="flex flex-col gap-1">
            <h4 className="text-[22px] font-semibold leading-[1.2] tracking-tight text-text transition-colors duration-300 group-hover:text-primary">
              {course.title}
            </h4>
            <p className="text-[12px] font-normal text-text transition-colors duration-300 group-hover:text-primary uppercase tracking-[0.1em] ">
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
          <div className="mt-auto pt-5 flex items-center justify-between border-t border-border/30">
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <Users size={16} className="opacity-70" />
              <span>
                <span className="font-semibold text-text">{course.enrolled}</span> enrolled
              </span>
            </div>

            <div className="
    relative
    inline-flex
    h-[32px]
    min-w-[90px]
    items-center
    justify-center

    overflow-hidden
rounded-none
    border border-[#d9e2ff]
    dark:border-white/10

    bg-white
    dark:bg-primary

    px-6

    text-[14px]
    font-semibold

    text-black
    dark:text-white

    shadow-[0_10px_30px_rgba(37,99,235,0.08)]
    dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

    transition-all
    duration-300

    hover:-translate-y-[2px]
    hover:border-[#2563ff]/40

    [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
  ">
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [, setScrollProgress] = useState(0);
  const [, setSelectedIndex] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", onScroll);
    onScroll();
  }, [emblaApi, onScroll]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Initialize state on mount
  useEffect(() => {
    if (emblaApi) {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

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

        {/* CAROUSEL CONTAINER */}
        <div className="relative mt-14">
          {/* FADE EDGES */}
          <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none md:w-20" />
          <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none md:w-20" />

          {/* NAVIGATION BUTTONS */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`
              absolute top-1/2 z-20 -translate-y-1/2
              left-0 md:-left-4 lg:-left-12
              flex h-10 w-10 items-center justify-center
              rounded-full border border-border/80 bg-elevated/95 text-text backdrop-blur-xl
              shadow-md transition-all duration-300
              hover:border-primary/50 hover:bg-surface hover:text-primary hover:shadow-lg
              disabled:opacity-0 disabled:cursor-not-allowed
              ${canScrollPrev ? "opacity-100" : "opacity-0"}
            `}
            aria-label="Previous courses"
          >
            <ChevronLeft size={20} className="transition-transform duration-300 hover:-translate-x-0.5" />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`
              absolute top-1/2 z-20 -translate-y-1/2
              right-0 md:-right-4 lg:-right-12
              flex h-10 w-10 items-center justify-center
              rounded-full border border-border/80 bg-elevated/95 text-text backdrop-blur-xl
              shadow-md transition-all duration-300
              hover:border-primary/50 hover:bg-surface hover:text-primary hover:shadow-lg
              disabled:opacity-0 disabled:cursor-not-allowed
              ${canScrollNext ? "opacity-100" : "opacity-0"}
            `}
            aria-label="Next courses"
          >
            <ChevronRight size={20} className="transition-transform duration-300 hover:translate-x-0.5" />
          </button>

          {/* CAROUSEL */}
          <div
            className="overflow-hidden"
            ref={emblaRef}
            onMouseEnter={() => emblaApi?.plugins()?.autoplay?.stop()}
            onMouseLeave={() => emblaApi?.plugins()?.autoplay?.play()}
          >
            <div className="flex gap-4 px-4 md:gap-6 md:px-6">
              {featuredCourses.map((course, i) => (
                <div
                  key={course.id}
                  className="flex-none w-full sm:w-72 md:w-[340px] lg:w-[360px]"
                >
                  <CourseCard
                    course={course}
                    index={i}
                  />
                </div>
              ))}
            </div>
          </div>
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
