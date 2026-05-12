import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { mentors } from "../../data/mentors";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import Container from "../ui/Container";
import Button from "../ui/Button";

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
        className="group/mentor relative flex h-full flex-col rounded-2xl border border-border bg-elevated p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong focus-visible:-translate-y-0.5 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {/* Subtle "view profile" affordance — top right */}
        <span
          aria-hidden
          className="absolute right-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg/70 text-muted opacity-0 transition-all duration-200 group-hover/mentor:opacity-100 group-hover/mentor:border-primary group-hover/mentor:text-primary group-focus-visible/mentor:opacity-100"
        >
          <ArrowUpRight size={13} strokeWidth={2.2} />
        </span>

        {/* Identity row */}
        <div className="flex items-center gap-4">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            loading="lazy"
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="truncate font-display text-[16px] font-semibold tracking-tight text-text">
              {mentor.name}
            </h3>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {mentor.role} at{" "}
              <span className="text-text">
                {mentor.company.replace(/^Ex-/, "")}
              </span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-5 text-[13.5px] leading-6 text-muted">{mentor.bio}</p>

        {/* Specialties */}
        <div className="mt-4 text-[12px] text-subtle">
          {mentor.specialties.slice(0, 3).join(" · ")}
        </div>

        {/* Footer — stats + "view profile" hint */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[12.5px] text-muted">
          <span>
            <span className="font-semibold text-text">{mentor.courses}</span>{" "}
            courses
            <span className="mx-2 text-subtle" aria-hidden>
              ·
            </span>
            <span className="font-semibold text-text">{mentor.learners}</span>{" "}
            learners
          </span>

          <span className="inline-flex items-center gap-1 font-medium text-muted transition-colors duration-200 group-hover/mentor:text-primary">
            View profile
            <ArrowUpRight
              size={12}
              strokeWidth={2.2}
              aria-hidden
              className="transition-transform duration-200 group-hover/mentor:translate-x-0.5 group-hover/mentor:-translate-y-0.5"
            />
          </span>
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
