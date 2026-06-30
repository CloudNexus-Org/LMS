import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, Layers3, Star, Users } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const DIFFICULTY_STYLES = {
  Beginner: 'bg-success/90 text-white',
  Intermediate: 'bg-primary/90 text-white',
  Advanced: 'bg-accent/90 text-white',
};

const ENROLLED_AVATARS = [
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80',
];

function StatPill({ icon: Icon, label }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-elevated/80 px-2 py-2">
      <Icon size={13} className="shrink-0 text-primary" strokeWidth={2.25} />
      <span className="truncate text-[11px] font-semibold text-text">{label}</span>
    </div>
  );
}

export default function FeaturedCourseCard({ course }) {
  const difficultyStyle =
    DIFFICULTY_STYLES[course.difficulty] || DIFFICULTY_STYLES.Intermediate;
  const modulesLabel = course.modules ? `${course.modules} Mod` : '—';
  const enrolledLabel = course.enrolled || '—';

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="
          flex h-full flex-col overflow-hidden rounded-2xl
          border border-border/70 bg-surface
          shadow-[var(--shadow-card-value)]
          transition-all duration-300
          hover:border-primary/30
          hover:shadow-[0_16px_40px_-14px_color-mix(in_srgb,var(--primary)_32%,transparent)]
        "
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
          <img
            src={course.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <span
            className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${difficultyStyle}`}
          >
            {course.difficulty}
          </span>
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            <Star size={11} className="fill-warning text-warning" />
            {course.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h4 className="line-clamp-2 font-display text-[17px] font-bold leading-snug tracking-tight text-text transition-colors group-hover:text-primary">
              {course.title}
            </h4>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              By {course.professor}
            </p>
          </div>

          <div className="flex gap-2">
            <StatPill icon={Clock3} label={course.duration} />
            <StatPill icon={Layers3} label={modulesLabel} />
            <StatPill icon={Users} label={enrolledLabel} />
          </div>

          <p className="line-clamp-2 text-[12px] leading-relaxed text-muted">
            {course.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex -space-x-2">
                {ENROLLED_AVATARS.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-7 w-7 rounded-full border-2 border-surface object-cover"
                    style={{ zIndex: ENROLLED_AVATARS.length - i }}
                  />
                ))}
              </div>
              <span className="truncate text-[11px] font-semibold text-muted">
                {enrolledLabel} enrolled
              </span>
            </div>

            <span
              className="
                inline-flex shrink-0 items-center justify-center rounded-xl
                bg-primary px-3.5 py-2 text-[12px] font-bold text-white
                shadow-sm transition-all duration-300
                group-hover:bg-primary-hover group-hover:shadow-md
              "
            >
              Explore
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
