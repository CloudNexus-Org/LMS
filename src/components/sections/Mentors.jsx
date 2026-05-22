import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { mentors } from '@/data/mentors';
import SectionShell from "@/app/layouts/SectionShell";
import SectionHeading from "@/app/layouts/SectionHeading";
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const EASE = [0.16, 1, 0.3, 1];

function MentorCard({ mentor, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
      className="h-full"
    >
      <Link
        to={`/mentors/${mentor.slug}`}
        aria-label={`View profile for ${mentor.name}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-elevated/40 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-elevated hover:shadow-xl hover:shadow-primary/[0.08]"
      >
        {/* Soft background glow on hover */}
        <div className="pointer-events-none absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Identity Row */}
        <div className="relative z-10 flex items-start gap-4">
          <div className="relative shrink-0">
            {/* Glowing avatar ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-40 blur-[8px] transition-opacity duration-300 group-hover:opacity-80" />
            <img
              src={mentor.avatar}
              alt={mentor.name}
              loading="lazy"
              className="relative h-16 w-16 rounded-full object-cover ring-2 ring-elevated transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="truncate font-display text-[17px] font-semibold tracking-tight text-text transition-colors group-hover:text-primary">
              {mentor.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="truncate text-[13.5px] text-muted">
                {mentor.role}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-border-strong" aria-hidden />
              <span className="truncate text-[13.5px] font-medium text-text">
                {mentor.company.replace(/^Ex-/, "")}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="relative z-10 mt-6 text-[14.5px] leading-relaxed text-subtle line-clamp-2">
          {mentor.bio}
        </p>

        {/* Specialties Tags */}
        <div className="relative z-10 mt-1 flex flex-wrap gap-2">
          {mentor.specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center rounded-full border border-border/80 bg-bg/50 px-3 py-1 text-[11.5px] font-medium text-muted transition-colors group-hover:border-primary/20 group-hover:text-text"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Footer Stats & Action */}
        <div className="relative z-10 flex items-end justify-between border-t border-border/60 mt-1">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="font-display text-[16px] font-semibold leading-none text-text">
                {mentor.courses}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Courses
              </span>
            </div>

            <div className="h-7 w-px bg-border/80" aria-hidden />

            <div className="flex items-center gap-2">
              <span className="font-display text-[16px] font-semibold leading-none text-text">
                {mentor.learners}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Learners
              </span>
            </div>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/20">
            <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Mentors() {
  return (
    <SectionShell id="mentors">
      <Container>
        <SectionHeading
          eyebrow="Meet the team"
          title="Learn from"
          highlight="industry mentors"
          description="Every track is built and taught by ex-FAANG engineers and senior practitioners shipping at scale."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {mentors.slice(0, 6).map((mentor, i) => (
            <MentorCard key={mentor.name} mentor={mentor} index={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            to="/mentors"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight size={16} />}
          >
            See all {mentors.length}+ mentors
          </Button>
        </div>
      </Container>
    </SectionShell>
  );
}
