import { Star, Quote } from "lucide-react";
import { testimonials } from '@/data/testimonials';

import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Avatar from '@/components/ui/Avatar';

import Testimonialbg1 from '@/assets/Testimonialbg1.png';
import Testimonialbg2 from '@/assets/Testimonialbg2 (2).png';
import Testimonialbg3 from '@/assets/Testimonialbg4.png';


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
        testimonial-card
        group

        relative

        flex h-[280px] w-[360px]
        shrink-0 flex-col

        overflow-visible

        rounded-[8px]

        border border-border

        bg-elevated

        p-[2px]

        transition-all duration-500

        md:w-[420px]

        hover:-translate-y-3
      "
    >
{/* ANIMATED BORDER */}
<div
  className="
    absolute
    inset-0

    rounded-[8px]

    opacity-0

    transition-opacity duration-500

    group-hover:opacity-100
  "
>

  <div
    className="
      absolute
      -inset-[3px]

      rounded-[10px]

      animate-spin-slow

      

      blur-[0.5px]
    "
  />

</div>

      {/* MAIN CARD */}
      <div
        className="
          relative

          flex h-full w-full flex-col

          overflow-hidden

          rounded-[7px]

          bg-elevated

          p-6

          transition-all duration-500

          group-hover:border-blue-500/40

          group-hover:shadow-[0_0_40px_rgba(37,99,235,0.45)]

          dark:group-hover:shadow-[0_0_55px_rgba(37,99,235,0.35)]
        "
      >

        {/* BG IMAGE */}
        <div
          className="
            absolute inset-0

            scale-[1.18]

            opacity-0

            transition-all duration-700

            group-hover:scale-100
            
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

          {/* OVERLAY */}
          <div
            className="
              absolute inset-0

              bg-black/72

              transition-all duration-500

              group-hover:bg-black/58

              dark:bg-black/72
            "
          />


        </div>



        {/* CONTENT */}
        <div className="relative z-10 flex h-full flex-col">

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

                    text-text

                    transition-all duration-300

                    group-hover:text-white
                  "
                >
                  {item.name}
                </div>

                <div
                  className="
                    text-[12px]

                    text-muted

                    transition-all duration-300

                    group-hover:text-white/75
                  "
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

                transition-all duration-500

                group-hover:scale-110
                group-hover:text-blue-300
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

              transition-all duration-500

              group-hover:bg-blue-400/40
            "
          />

          {/* RATING */}
          <div className="mt-5 flex items-center gap-3">

            <span
              className="
                text-[15px]
                font-medium

                text-muted

                transition-all duration-300

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

              transition-all duration-500

              group-hover:text-white/92
            "
          >
            {item.text}
          </p>

        </div>

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