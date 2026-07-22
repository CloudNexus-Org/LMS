import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { fetchPublishedCourses } from '@/lib/api/catalogApi';
import FeaturedCourseCard from '@/components/courses/FeaturedCourseCard';

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

// MAIN COMPONENT
export default function Courses() {
  const [courses, setCourses] = useState([]);
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
      .then((data) => setCourses(data || []))
      .catch(() => setCourses([]));
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
  }, []);

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
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex-none w-full sm:w-[300px] md:w-[320px]"
                >
                  <FeaturedCourseCard course={course} />
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
              inline-flex items-center justify-center
              rounded-lg px-7 py-3
              text-[14px] font-semibold text-center
              transition-all duration-300 ease-out
              ${sectionCta}
            `}
          >
            Browse all {courses.length} courses
          </Link>
        </div>
      </Container>
    </SectionShell>
  );
}
