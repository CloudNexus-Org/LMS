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
import Button from '@/components/ui/Button';

const EASE = [0.16, 1, 0.3, 1];

// FIND TRACK
function findTrackForCourse(courseId) {
  return tracks.find((t) => t.courseIds.includes(courseId)) || tracks[0];
}

// PROFESSIONAL UNIQUE VARIANTS
const CARD_VARIANTS = [
  {
    accent: "from-primary/25",
    glow: "group-hover:shadow-[0_28px_60px_rgba(44,91,255,0.18)]",
    ring: "group-hover:ring-primary/20",
  },
  {
    accent: "from-accent/25",
    glow: "group-hover:shadow-[0_28px_60px_rgba(139,97,210,0.16)]",
    ring: "group-hover:ring-accent/20",
  },
  {
    accent: "from-success/20",
    glow: "group-hover:shadow-[0_28px_60px_rgba(5,150,105,0.14)]",
    ring: "group-hover:ring-success/20",
  },
];

const DIFFICULTY_STYLES = {
  Beginner: "bg-success/15 text-success border-success/25",
  Intermediate: "bg-primary-soft text-primary border-primary/25",
  Advanced: "bg-accent-soft text-accent border-accent/25",
};

// COURSE CARD
function CourseCard({ course, index }) {
  const track = findTrackForCourse(course.id);
  const href = track ? `/tracks/${track.id}` : "/tracks";

  const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
  const difficultyStyle =
    DIFFICULTY_STYLES[course.difficulty] || DIFFICULTY_STYLES.Intermediate;

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Link
        to={href}
        className={`
          relative flex h-full min-h-[420px] flex-col overflow-hidden
          rounded-2xl border border-border/70 bg-surface/90
          ring-1 ring-transparent backdrop-blur-xl
          shadow-[var(--shadow-card-value)]
          transition-all duration-500
          hover:border-primary/25
          ${variant.glow} ${variant.ring}
        `}
      >
        {/* Top accent line */}
        <div
          className="
            absolute inset-x-0 top-0 z-10 h-[3px]
            scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent
            transition-transform duration-500 group-hover:scale-x-100
          "
          aria-hidden
        />

        {/* Corner glow */}
        <div
          className={`
            pointer-events-none absolute -right-8 -top-8
            h-36 w-36 rounded-full bg-gradient-to-br ${variant.accent} to-transparent
            blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100
          `}
          aria-hidden
        />

        {/* IMAGE */}
        <div className="relative p-4 pb-0">
          <div className="relative h-[200px] overflow-hidden rounded-xl bg-elevated">
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-110
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

            {/* Difficulty badge */}
            <div
              className={`
                absolute right-3 top-3 inline-flex items-center gap-1.5
                rounded-full border px-2.5 py-1
                text-[10px] font-bold uppercase tracking-[0.14em]
                backdrop-blur-md
                ${difficultyStyle}
              `}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {course.difficulty}
            </div>

            {/* Rating overlay */}
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
              <Star size={12} className="fill-warning text-warning" />
              <span className="text-[12px] font-bold text-white">{course.rating}</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <div>
            <h4 className="font-display text-[20px] font-bold leading-tight tracking-tight text-text transition-colors duration-300 group-hover:text-primary">
              {course.title}
            </h4>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              By {course.professor}
            </p>
          </div>

          {/* Meta stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Clock3, label: course.duration },
              { icon: Layers3, label: `${course.modules} Mod` },
              { icon: Users, label: course.enrolled },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="
                  flex flex-col items-center gap-1 rounded-xl
                  border border-border/50 bg-elevated/70 px-2 py-2.5
                  transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary-soft/40
                "
              >
                <Icon size={13} className="text-primary" strokeWidth={2.5} />
                <span className="text-center text-[10px] font-semibold leading-tight text-text">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Mini progress bar — LMS touch */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium">
              <span className="text-muted">Course completion</span>
              <span className="text-primary">
                {Math.min(95, 55 + (index % 3) * 15)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-primary-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-700 group-hover:w-[88%]"
                style={{ width: `${Math.min(95, 55 + (index % 3) * 15)}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 flex-1 text-[13px] leading-relaxed text-muted line-clamp-2">
            {course.description}
          </p>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((n) => (
                  <div
                    key={n}
                    className="h-6 w-6 rounded-full border-2 border-surface bg-primary-soft"
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/40?img=${(index * 3 + n + 10) % 70})`,
                      backgroundSize: "cover",
                    }}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted">
                <span className="font-bold text-text">{course.enrolled}</span> enrolled
              </span>
            </div>

            <Button
              as="span"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={14} />}
              className="pointer-events-none shrink-0"
            >
              Explore
            </Button>
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
                  className="flex-none w-full sm:w-80 md:w-[360px] lg:w-[380px]"
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
