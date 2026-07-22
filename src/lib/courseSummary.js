/** Tiny util — keep cart/wishlist free of heavy course image imports. */
export function toCourseSummary(course) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    professor: course.professor,
    image: course.image,
    price: course.price,
    originalPrice: course.originalPrice,
    rating: course.rating,
    reviews: course.reviews,
  };
}
