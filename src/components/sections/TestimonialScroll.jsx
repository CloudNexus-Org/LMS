import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from "@/components/ui/Container";
import Avatar from "@/components/ui/Avatar";

import Testimonialbg1 from "@/assets/testimonial/Testimonialbg1.png";
import Testimonialbg2 from "@/assets/testimonial/Testimonialbg2 (2).png";
import Testimonialbg3 from "@/assets/testimonial/Testimonialbg4.png";

const bgImages = [
  Testimonialbg1,
  Testimonialbg2,
  Testimonialbg3,
];

function ReviewCard({ item, index }) {
  const isDarkTheme = useIsDarkTheme();
  const bgImage = bgImages[index % bgImages.length];

  return (
    <article
      className="
        group
        relative

        flex
        h-[280px]
        w-[360px]
        shrink-0
        flex-col

        overflow-hidden

        rounded-[26px]

        border
        border-black/[0.06]
        dark:border-white/[0.08]

        transition-all
        duration-700

        md:w-[420px]

        hover:-translate-y-2

        hover:border-primary/30

        hover:shadow-[0_0_70px_rgba(139,97,210,0.18)]

        dark:hover:shadow-[0_0_90px_rgba(139,97,210,0.22)]
      "
      style={{
        backgroundColor: isDarkTheme ? "#06070b" : "#ffffff",
        backdropFilter: "blur(12px)",
      }}
    >

      {/* BIG BLUE AMBIENT GLOW */}
      <div
        className="
          pointer-events-none

          absolute

          -bottom-28
          -left-24

          h-72
          w-72

          rounded-full

          opacity-0

          blur-[90px]

          transition-all
          duration-700

          group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(circle, rgba(139,97,210,0.65) 0%, rgba(139,97,210,0.35) 42%, transparent 74%)",
        }}
      />

      {/* EXTRA TOP BLUE GLOW */}
      <div
        className="
          pointer-events-none

          absolute

          -right-16
          -top-16

          h-44
          w-44

          rounded-full

          opacity-0

          blur-[70px]

          transition-all
          duration-700

          group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(circle, rgba(180,150,235,0.55) 0%, rgba(139,97,210,0.25) 45%, transparent 72%)",
        }}
      />

      {/* ROTATING BLURRED BORDER */}
      <div
        className="
          pointer-events-none

          absolute
          inset-0

          rounded-[26px]

          opacity-0

          transition-all
          duration-700

          group-hover:opacity-100
        "
      >

        {/* WIDE GLOW */}
        <div
          className="
            absolute
            -inset-[4px]

            rounded-[30px]

            animate-spin-slow

            blur-xl
          "
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(139,97,210,0.95) 55deg, transparent 110deg)",
          }}
        />

        {/* SHARP INNER BORDER */}
        <div
          className="
            absolute
            -inset-[1px]

            rounded-[28px]

            animate-spin-slow

            blur-[3px]
          "
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(96,165,250,1) 45deg, transparent 95deg)",
          }}
        />

        {/* CENTER MASK */}
        <div
          className="
            absolute
            inset-[1.5px]

            rounded-[24px]

            backdrop-blur-xl
          "
          style={{
            backgroundColor: isDarkTheme ? "rgba(6, 7, 11, 0.88)" : "rgba(255, 255, 255, 0.88)",
          }}
        />

      </div>

      {/* BG IMAGE */}
      <div
        className="
          absolute
          inset-0

          overflow-hidden
        "
      >

        <img
          src={bgImage}
          alt="testimonial background"
          className="
            h-full
            w-full

            object-cover

            scale-[1.12]

            opacity-[0.14]

            transition-all
            duration-700
            ease-out

            brightness-[1.15]

            group-hover:scale-[1.22]

            group-hover:opacity-[0.65]
          "
          style={{
            filter: isDarkTheme ? "blur(4px)" : "none",
          }}
        />

        {/* LIGHT THEME OVERLAY */}
        <div
          className="
            absolute
            inset-0

            transition-all
            duration-700
            
            opacity-100
            group-hover:opacity-40
          "
          style={{
            display: isDarkTheme ? "none" : "block",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.98))",
          }}
        />

        {/* DARK THEME OVERLAY */}
        <div
          className="
            absolute
            inset-0

            transition-all
            duration-700
            
            opacity-100
            group-hover:opacity-50
          "
          style={{
            display: isDarkTheme ? "block" : "none",
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.68), rgba(5, 6, 10, 0.92))",
          }}
        />

      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col p-6">

        {/* TOP */}
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <Avatar
              src={item.avatar}
              name={item.name}
              size="md"
            />

            <div className="min-w-0">

              <div
                className="
                  truncate

                  text-[15px]
                  font-semibold

                  transition-all
                  duration-300
                "
                style={{
                  color: isDarkTheme ? "#ffffff" : "#0f172a",
                }}
              >
                {item.name}
              </div>

              <div
                className="
                  text-[12px]

                  transition-all
                  duration-300

                  group-hover:text-primary
                  dark:group-hover:text-white/80
                "
                style={{
                  color: isDarkTheme ? "rgba(255, 255, 255, 0.65)" : "rgb(100, 116, 139)",
                }}
              >
                {item.role}
              </div>

            </div>

          </div>

          <Quote
            size={24}
            className="
              rotate-180

              text-primary/40

              transition-all
              duration-500

              group-hover:scale-110
              group-hover:text-primary
            "
          />

        </div>

        {/* LINE */}
        <div
          className="
            mt-5

            h-px
            w-full

            transition-all
            duration-700

            group-hover:bg-primary/35
          "
          style={{
            backgroundColor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
          }}
        />

        {/* RATING */}
        <div className="mt-5 flex items-center gap-3">

          <span
            className="
              text-[15px]
              font-medium

              transition-all
              duration-300

              group-hover:text-primary
              dark:group-hover:text-white
            "
            style={{
              color: isDarkTheme ? "rgba(255, 255, 255, 0.7)" : "rgb(71, 85, 105)",
            }}
          >
            {item.rating}.0
          </span>

          <div className="flex items-center gap-1">

            {Array.from({ length: item.rating }).map((_, i) => (

              <Star
                key={i}
                size={14}
                className="
                  fill-primary
                  text-primary
                "
              />

            ))}

          </div>

        </div>

        {/* REVIEW */}
        <p
          className="
            mt-6

            flex-1

            text-[15px]
            leading-8

            transition-all
            duration-500

            group-hover:text-slate-800
            dark:group-hover:text-white/92
          "
          style={{
            color: isDarkTheme ? "rgba(255, 255, 255, 0.65)" : "rgb(71, 85, 105)",
          }}
        >
          {item.text}
        </p>

      </div>

    </article>
  );
}

export default function TestimonialScroll() {

  const firstRow = [...testimonials, ...testimonials];

  return (

    <SectionShell id="testimonials">

      <SectionHeading
        eyebrow="Learner stories"
        title="Real progress,"
        highlight="real voices"
        description="Hear from learners who shipped real projects, earned certificates"
      />

      <div className="space-y-6">

        <div className="testimonial-mask overflow-visible">

          <div className="testimonial-row-left flex w-max gap-5 py-6">

            {firstRow.map((item, index) => (

              <ReviewCard
                key={`top-${index}`}
                item={item}
                index={index}
              />

            ))}

          </div>

        </div>

      </div>

    </SectionShell>

  );
}