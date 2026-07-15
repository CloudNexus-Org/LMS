/** Merge catalog course fields with live review summary from review-service. */
export function resolveCourseRating(course, reviewSummary) {
  const rating = Number(reviewSummary?.avgRating ?? course?.rating ?? 0) || 0;
  const reviews = Number(reviewSummary?.totalReviews ?? course?.reviews ?? 0) || 0;
  return {
    rating: Math.round(rating * 10) / 10,
    reviews,
    hasReviews: reviews > 0 && rating > 0,
  };
}

export function formatReviewCount(count) {
  const n = Number(count) || 0;
  if (n === 0) return 'No reviews yet';
  if (n === 1) return '1 review';
  return `${n.toLocaleString('en-IN')} reviews`;
}

export function formatStudentCount(enrolled) {
  if (enrolled == null || enrolled === '' || enrolled === '0' || enrolled === 0) {
    return '0 students';
  }
  const raw = String(enrolled).trim();
  if (/student/i.test(raw)) return raw;
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    return `${n.toLocaleString('en-IN')} student${n === 1 ? '' : 's'}`;
  }
  return `${raw} students`;
}

export function formatRatingValue(rating) {
  const n = Number(rating) || 0;
  if (n <= 0) return '—';
  return n.toFixed(1);
}
