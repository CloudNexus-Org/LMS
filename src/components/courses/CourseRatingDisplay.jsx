import {
  formatRatingValue,
  formatReviewCount,
  formatStudentCount,
  resolveCourseRating,
} from '@/lib/course/courseStats';
import { PartialStar, StarRow } from '@/components/courses/CourseRatingStars';

/**
 * Udemy/Coursera-style rating row for course cards and purchase panels.
 */
export default function CourseRatingDisplay({
  course,
  reviewSummary,
  showStudents = true,
  size = 'md',
  className = '',
}) {
  const { rating, reviews, hasReviews } = resolveCourseRating(course, reviewSummary);
  const textSize = size === 'sm' ? 'text-[12px]' : 'text-[13px]';

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${textSize} ${className}`}>
      {hasReviews ? (
        <>
          <span className="inline-flex items-center gap-1.5 font-bold text-warning">
            <PartialStar rating={rating} size={size === 'sm' ? 12 : 14} />
            {formatRatingValue(rating)}
          </span>
          <span className="text-muted">{formatReviewCount(reviews)}</span>
        </>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
          <PartialStar rating={0} size={size === 'sm' ? 12 : 14} />
          New · no ratings yet
        </span>
      )}
      {showStudents && (
        <>
          <span className="text-subtle" aria-hidden>·</span>
          <span className="text-muted">{formatStudentCount(course?.enrolled)}</span>
        </>
      )}
      {hasReviews && size === 'lg' && (
        <div className="mt-1 w-full">
          <StarRow rating={rating} size={16} />
        </div>
      )}
    </div>
  );
}
