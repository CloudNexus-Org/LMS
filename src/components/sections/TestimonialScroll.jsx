import { Star, Quote } from "lucide-react";
import { testimonials } from '@/data/testimonials';

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Avatar from '@/components/ui/Avatar';

import Testimonialbg1 from '@/assets/Testimonialbg.png';
import Testimonialbg2 from '@/assets/Testimonialbg2.png';
import Testimonialbg3 from '@/assets/Testimonialbg3.png';

const bgImages = [
  Testimonialbg1,
  Testimonialbg2,
  Testimonialbg3,
];

function ReviewCard({ item, index }) {
  const bgImage = bgImages[index % bgImages.length];

  return (
    <article
      className="
        group

        relative

        flex h-[280px] w-[360px]
        shrink-0 flex-col

        overflow-hidden

        rounded-[10px]

        border border-border

        bg-elevated

        p-6

        shadow-[var(--shadow-card)]

        transition-all duration-500

        hover:border-primary/40

        md:w-[420px]
      "
    >
      {/* BACKGROUND IMAGE */}
      <div
        className="
          absolute inset-0

          opacity-0

          transition-all duration-500

          group-hover:opacity-100
        "
      >
        <img
          src={bgImage}
          alt="testimonial background"

          className="
            h-full w-full
            object-cover
          "
        />

        {/* DARK OVERLAY */}
        <div
          className="
            absolute inset-0

            bg-black/55
          "
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col">

        {/* TOP */}
        <div className="flex items-start justify-between">

          {/* USER */}
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

                  text-text

                  transition-colors duration-300

                  group-hover:text-white
                "
              >
                {item.name}
              </div>

              <div
                className="
                  text-[12px]

                  text-muted

                  transition-colors duration-300

                  group-hover:text-white/70
                "
              >
                {item.role}
              </div>
            </div>
          </div>

          {/* QUOTE */}
          <Quote
            size={24}
            className="
              rotate-180

              text-primary/40

              transition-colors duration-300

              group-hover:text-white/70
            "
          />
        </div>

        {/* LINE */}
        <div
          className="
            mt-5

            h-px
            w-full

            bg-border

            transition-colors duration-300

            group-hover:bg-white/20
          "
        />

        {/* RATING */}
        <div className="mt-5 flex items-center gap-3">

          <span
            className="
              text-[15px]
              font-medium

              text-muted

              transition-colors duration-300

              group-hover:text-white/80
            "
          >
            {item.rating}.0
          </span>

          <div className="flex items-center gap-1">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className="
                  fill-warning
                  text-warning
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

            text-muted

            transition-colors duration-300

            group-hover:text-white/90
          "
        >
          {item.text}
        </p>
      </div>
    </article>
  );
}

export default function TestimonialScroll() {
  const firstRow = [...testimonials, ...testimonials];

  const secondRow = [
    ...testimonials.slice().reverse(),
    ...testimonials.slice().reverse(),
  ];

  return (
    <SectionShell id="testimonials">
      <SectionHeading
        eyebrow="Learner stories"
        title="Real progress,"
        highlight="real voices"
        description="Hear from learners who shipped real projects, earned certificates"
      />

      <div className="space-y-6">

        {/* TOP ROW */}
        <div className="testimonial-mask overflow-hidden">
          <div className="testimonial-row-left flex w-max gap-5">
            {firstRow.map((item, index) => (
              <ReviewCard
                key={`top-${index}`}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="testimonial-mask hidden overflow-hidden md:block">
          <div className="testimonial-row-right flex w-max gap-5 translate-x-62">
            {secondRow.map((item, index) => (
              <ReviewCard
                key={`bottom-${index}`}
                item={item}
                index={index + 3}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}