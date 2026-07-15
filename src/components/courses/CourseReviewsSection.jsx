import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { fetchCourseReviews } from '@/lib/api/reviewApi';
import {
  formatRatingValue,
  formatReviewCount,
  resolveCourseRating,
} from '@/lib/course/courseStats';

const EASE = [0.16, 1, 0.3, 1];

function StarRow({ rating, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'fill-warning text-warning' : 'text-muted/25'}
        />
      ))}
    </span>
  );
}

function DistributionBars({ distribution, total }) {
  const rows = [5, 4, 3, 2, 1];
  return (
    <div className="space-y-2">
      {rows.map((star) => {
        const count = distribution?.[star] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-[12px]">
            <span className="w-14 shrink-0 text-muted">{star} star</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-warning transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-subtle">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <article className="rounded-xl border border-border bg-surface/80 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-text">
            {review.reviewerName || 'Student'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StarRow rating={review.rating} size={12} />
            {date && <span className="text-[11px] text-subtle">{date}</span>}
          </div>
        </div>
      </div>
      <h4 className="mt-3 font-display text-[15px] font-bold text-text">{review.title}</h4>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{review.body}</p>
      {(review.helpful ?? 0) > 0 && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-subtle">
          <ThumbsUp size={12} />
          {review.helpful} found this helpful
        </p>
      )}
    </article>
  );
}

export default function CourseReviewsSection({ course, reviewSummary }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(
    () => resolveCourseRating(course, reviewSummary),
    [course, reviewSummary]
  );

  const distribution = reviewSummary?.distribution ?? {};

  useEffect(() => {
    if (!course?.id) return;
    let cancelled = false;
    setLoading(true);
    fetchCourseReviews(course.id, page, 5)
      .then((data) => {
        if (cancelled) return;
        setReviews(data.content || []);
        setTotalPages(data.totalPages ?? 0);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [course?.id, page]);

  if (!course?.id) return null;

  return (
    <section className="border-t border-border py-12 md:py-16" aria-labelledby="reviews-title">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
          Student feedback
        </p>
        <h2
          id="reviews-title"
          className="mt-1 font-display text-[24px] font-bold tracking-tight text-text md:text-[28px]"
        >
          Ratings &amp; reviews
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div className="rounded-2xl border border-border bg-elevated/50 p-5 md:p-6">
          {stats.hasReviews ? (
            <>
              <div className="flex items-end gap-3">
                <span className="font-display text-[48px] font-bold leading-none text-text">
                  {formatRatingValue(stats.rating)}
                </span>
                <div className="pb-1">
                  <StarRow rating={Math.round(stats.rating)} size={16} />
                  <p className="mt-1 text-[12px] text-muted">
                    {formatReviewCount(stats.reviews)}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <DistributionBars distribution={distribution} total={stats.reviews} />
              </div>
            </>
          ) : (
            <div className="text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted/40" />
              <p className="mt-3 text-[14px] font-semibold text-text">No reviews yet</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                Be the first to rate this course after you enroll and complete lessons.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
              <p className="text-[14px] text-muted">
                {stats.hasReviews
                  ? 'Reviews are being synced. Check back shortly.'
                  : 'Students can leave star ratings and written reviews from My Learning after they start the course.'}
              </p>
            </div>
          ) : (
            reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: EASE }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-text disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-[12px] text-muted">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold text-text disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
