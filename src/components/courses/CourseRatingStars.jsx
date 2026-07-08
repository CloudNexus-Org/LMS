import { Star } from 'lucide-react';
import {
  formatRatingValue,
  resolveCourseRating,
} from '@/lib/course/courseStats';

/** Single star with yellow fill proportional to rating (0–5). */
export function PartialStar({ rating = 0, size = 14, className = '' }) {
  const value = Number(rating) || 0;
  if (value <= 0) {
    return (
      <Star
        size={size}
        className={`shrink-0 fill-none text-subtle ${className}`}
        strokeWidth={2.25}
        aria-hidden
      />
    );
  }

  const fillPct = Math.min(100, (value / 5) * 100);

  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Star size={size} className="absolute text-muted/30" strokeWidth={2} />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPct}%` }}>
        <Star size={size} className="fill-warning text-warning" strokeWidth={2} />
      </span>
    </span>
  );
}

/** Five stars — filled count follows rounded rating. */
export function StarRow({ rating = 0, size = 14, className = '' }) {
  const value = Number(rating) || 0;
  const filled = Math.round(value);

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? 'fill-warning text-warning' : 'text-muted/30'}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

/**
 * Catalog / wishlist rating row — star + value, or grey star + "New".
 */
export function CourseRatingInline({ course, reviewSummary, starSize = 11, className = '' }) {
  const { rating, reviews, hasReviews } = resolveCourseRating(course, reviewSummary);

  if (!hasReviews) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <PartialStar rating={0} size={starSize} />
        <span className="rounded border border-primary/20 bg-primary-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
          New
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-bold text-warning ${className}`}>
      <PartialStar rating={rating} size={starSize} />
      <span>{formatRatingValue(rating)}</span>
      {reviews > 0 && (
        <span className="font-normal text-subtle">
          ({reviews.toLocaleString('en-IN')})
        </span>
      )}
    </span>
  );
}

/**
 * Reviews page — platform average for a course.
 */
export function CoursePlatformRating({ rating = 0, className = '' }) {
  const value = Number(rating) || 0;
  const hasReviews = value > 0;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <PartialStar rating={value} size={14} />
      <span className={hasReviews ? 'text-muted' : 'text-muted/80'}>
        {hasReviews ? `${formatRatingValue(value)} course avg.` : 'No ratings yet'}
      </span>
    </span>
  );
}
