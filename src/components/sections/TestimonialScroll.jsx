import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import useIsDarkTheme from "@/hooks/useIsDarkTheme";

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
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

        rounded-lg

        border
        border-black/[0.06]
        dark:border-white/[0.08]

        transition-all
        duration-700

        md:w-[420px]

        hover:-translate-y-2

        hover:border-[#2563ff]/30
      "
      style={{
        backgroundColor: isDarkTheme ? "#06070b" : "#ffffff",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* ROTATING BLURRED BORDER */}
      <div
        className="
          pointer-events-none

          absolute
          inset-0

          rounded-lg

          opacity-0

          transition-all
          duration-700

          group-hover:opacity-100
        "
      >
        {/* SHARP INNER BORDER */}
        <div
          className="
            absolute
            -inset-[1px]

            rounded-lg

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

            rounded-lg

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

                  group-hover:text-[#2563ff]
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

              text-[#2563ff]/40

              transition-all
              duration-500

              group-hover:scale-110
              group-hover:text-[#2563ff]
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

            group-hover:bg-[#2563ff]/35
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

              group-hover:text-[#2563ff]
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
                  fill-[#2563ff]
                  text-[#2563ff]
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
              />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
