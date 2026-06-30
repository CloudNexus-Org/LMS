import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { featuredCourses as mockCourses } from '@/data/courses';
import { fetchPublishedCourses } from '@/lib/api/catalogApi';

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';
import {
  fadeEdgeLeft,
  fadeEdgeRight,
  pageBg,
  sectionCta,
  sectionTextDark,
} from '@/styles/theme';

const EASE = [0.16, 1, 0.3, 1];

const DIFFICULTY_STYLES = {
  Beginner: "bg-success/90 text-white",
  Intermediate: "bg-primary/90 text-white",
  Advanced: "bg-accent/90 text-white",
};

// COURSE CARD — minimal, links to course detail
function CourseCard({ course }) {
  const difficultyStyle =
    DIFFICULTY_STYLES[course.difficulty] || DIFFICULTY_STYLES.Intermediate;

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="
          flex h-full flex-col overflow-hidden rounded-xl
          border border-border/70 bg-surface
          shadow-[var(--shadow-card-value)]
          transition-all duration-300
          hover:border-primary/30
          hover:shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--primary)_30%,transparent)]
        "
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
          <img
            src={course.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span
            className={`absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${difficultyStyle}`}
          >
            {course.difficulty}
          </span>
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            <Star size={11} className="fill-warning text-warning" />
            {course.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h4 className="line-clamp-2 font-display text-[16px] font-bold leading-snug tracking-tight text-text transition-colors group-hover:text-primary">
            {course.title}
          </h4>
          <p className="truncate text-[12px] text-muted">{course.professor}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[12px]">
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock3 size={12} className="text-primary" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-primary">
              Explore
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// MAIN COMPONENT
export default function Courses() {
  const [courses, setCourses] = useState(mockCourses);
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

  useEffect(() => {
    fetchPublishedCourses()
      .then((data) => { if (data?.length) setCourses(data); })
      .catch(() => {});
  }, []);

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
    <SectionShell
      id="courses"
      glow
      className={`${pageBg} ${sectionTextDark}`}
    >
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
          <div className={`absolute left-0 top-0 z-10 h-full w-16 ${fadeEdgeLeft} pointer-events-none md:w-20`} />
          <div className={`absolute right-0 top-0 z-10 h-full w-16 ${fadeEdgeRight} pointer-events-none md:w-20`} />

          {/* NAVIGATION BUTTONS */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`
              absolute top-1/2 z-20 -translate-y-1/2
              left-0 md:-left-4 lg:-left-12
              flex h-10 w-10 items-center justify-center
              rounded-lg border border-border/80 bg-elevated/95 text-text backdrop-blur-xl
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
              rounded-lg border border-border/80 bg-elevated/95 text-text backdrop-blur-xl
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
              {courses.map((course, i) => (
                <div
                  key={course.id}
                  className="flex-none w-full sm:w-[280px] md:w-[300px]"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/courses"
            className={`
              group inline-flex items-center gap-2
              rounded-lg px-7 py-3
              text-[14px] font-semibold
              transition-all duration-300 ease-out
              ${sectionCta}
            `}
          >
            Browse all {courses.length} courses

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
