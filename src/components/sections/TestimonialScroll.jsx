import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Avatar from "@/components/ui/Avatar";

function ReviewCard({ item }) {
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
        border-border
        bg-surface

        shadow-[var(--shadow-card-value)]

        transition-all
        duration-700

        md:w-[420px]

        hover:-translate-y-2
        hover:border-primary/30
        hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--primary)_12%,transparent)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-14
          -top-14
          h-44
          w-44
          rounded-full
          bg-gradient-to-br
          from-primary/20
          via-primary/5
          to-accent/15
          blur-3xl
          opacity-70
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-primary/40
          to-transparent
          opacity-0
          transition-opacity
          duration-700
          group-hover:opacity-100
        "
      />

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
        <div
          className="
            absolute
            -inset-[1px]
            animate-spin-slow
            rounded-lg
            blur-[3px]
          "
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--primary) 35deg, var(--accent) 55deg, transparent 95deg)",
          }}
        />

        <div
          className="
            absolute
            inset-[1.5px]
            rounded-lg
            bg-surface/90
            backdrop-blur-xl
          "
        />
      </div>

      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={item.avatar} name={item.name} size="md" />

            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-text transition-colors duration-300">
                {item.name}
              </div>

              <div className="text-[12px] text-muted transition-colors duration-300 group-hover:text-primary dark:group-hover:text-white/80">
                {item.role}
              </div>
            </div>
          </div>

          <Quote
            size={24}
            className="
              rotate-180
              text-primary/35
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:text-primary
            "
          />
        </div>

        <div className="mt-5 h-px w-full bg-border transition-all duration-700 group-hover:bg-gradient-to-r group-hover:from-primary/20 group-hover:via-primary/50 group-hover:to-accent/30" />

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[15px] font-medium text-muted transition-colors duration-300 group-hover:text-primary dark:group-hover:text-white">
            {item.rating}.0
          </span>

          <div className="flex items-center gap-1">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-primary text-primary transition-colors duration-300 group-hover:fill-[color-mix(in_srgb,var(--primary)_70%,var(--accent))] group-hover:text-[color-mix(in_srgb,var(--primary)_70%,var(--accent))]"
              />
            ))}
          </div>
        </div>

        <p className="mt-6 flex-1 text-[15px] leading-8 text-muted transition-colors duration-500 group-hover:text-text dark:group-hover:text-white/92">
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
              <ReviewCard key={`top-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
