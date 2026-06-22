import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from "@/components/ui/Container";
import Avatar from "@/components/ui/Avatar";

function ReviewCard({ item }) {
  const isDarkTheme = useIsDarkTheme();

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

        transition-[transform,border-color,box-shadow]
        duration-500
        ease-out

        md:w-[420px]

        hover:-translate-y-1

        hover:border-primary/25

        hover:shadow-[0_12px_48px_rgba(139,97,210,0.12)]

        dark:hover:shadow-[0_16px_56px_rgba(139,97,210,0.16)]
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

          opacity-25

          blur-[90px]

          transition-opacity
          duration-500
          ease-out

          group-hover:opacity-60
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

          opacity-15

          blur-[70px]

          transition-opacity
          duration-500
          ease-out

          group-hover:opacity-45
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

          transition-opacity
          duration-500
          ease-out

          group-hover:opacity-80
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

                  transition-colors
                  duration-400
                  ease-out

                  group-hover:text-primary/90
                  dark:group-hover:text-white/75
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

              transition-colors
              duration-400
              ease-out

              group-hover:text-primary/80
            "
          />

        </div>

        {/* LINE */}
        <div
          className="
            mt-5

            h-px
            w-full

            transition-colors
            duration-400
            ease-out

            group-hover:bg-primary/30
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

              transition-colors
              duration-400
              ease-out

              group-hover:text-primary/90
              dark:group-hover:text-white/85
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

            transition-colors
            duration-400
            ease-out

            group-hover:text-slate-700
            dark:group-hover:text-white/88
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
              />

            ))}

          </div>

        </div>

      </div>

    </SectionShell>

  );
}