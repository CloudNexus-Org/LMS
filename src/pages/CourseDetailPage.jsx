import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Globe,
  Heart,
  Infinity,
  Layers3,
  ShoppingCart,
} from 'lucide-react';
import {
  featuredCourses as mockCourses,
  getCourseBySlug,
} from '@/data/courses';
import { fetchCourseBySlug, fetchFeaturedCourses } from '@/lib/api/catalogApi';
import { fetchCourseReviewSummary } from '@/lib/api/reviewApi';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import CatalogCourseCard, {
  formatPrice,
  getDiscountPercent,
} from '@/components/courses/CatalogCourseCard';
import CourseRatingDisplay from '@/components/courses/CourseRatingDisplay';
import CourseReviewsSection from '@/components/courses/CourseReviewsSection';
import useCartStore from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';

const EASE = [0.16, 1, 0.3, 1];

const INCLUDES = [
  { icon: BookOpen, label: 'On-demand video' },
  { icon: Layers3, label: 'Structured modules' },
  { icon: Award, label: 'Certificate of completion' },
  { icon: Infinity, label: 'Lifetime access' },
  { icon: Globe, label: 'English' },
];

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState(mockCourses);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchCourseBySlug(slug).catch(() => getCourseBySlug(slug)),
      fetchFeaturedCourses().catch(() => mockCourses),
    ])
      .then(([c, all]) => {
        if (cancelled) return;
        setCourse(c);
        setRelatedCourses(all || mockCourses);
        if (c?.id) {
          fetchCourseReviewSummary(c.id)
            .then((s) => !cancelled && setReviewSummary(s))
            .catch(() => {});
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [slug]);

  const addToCart = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) =>
    course ? s.isInCart(course.id) : false
  );
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    course ? s.isInWishlist(course.id) : false
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading course…
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const discount = getDiscountPercent(course.price, course.originalPrice);
  const related = relatedCourses
    .filter((c) => c.id !== course.id)
    .slice(0, 4);

  const handleCart = () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    addToCart(course);
  };

  const handleBuyNow = () => {
    addToCart(course);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-page text-text">
      <main id="main" className="relative pb-16 md:pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden pt-[88px] pb-10 md:pt-[104px] md:pb-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-[10%] h-[420px] w-[520px] rounded-full bg-primary-soft opacity-50 blur-[140px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-[-8%] h-[360px] w-[400px] rounded-full bg-accent-soft opacity-40 blur-[120px]"
          />

          <Container size="lg">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-subtle"
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-primary"
              >
                <ArrowLeft size={13} aria-hidden />
                All courses
              </Link>
              <span aria-hidden>/</span>
              <span className="truncate text-text">{course.title}</span>
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
              {/* Left — content */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <div className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {course.difficulty}
                </div>

                <h1 className="mt-4 font-display text-[28px] font-bold leading-[1.1] tracking-tight text-text sm:text-[36px] md:text-[42px]">
                  {course.title}
                </h1>

                <p className="mt-3 text-[15px] text-muted md:text-[16px]">
                  Taught by{' '}
                  <span className="font-semibold text-text">{course.professor}</span>
                </p>

                <div className="mt-4">
                  <CourseRatingDisplay
                    course={course}
                    reviewSummary={reviewSummary}
                    size="md"
                  />
                </div>

                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted md:text-[16px]">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-muted">
                  {[
                    { icon: Clock3, label: course.duration },
                    { icon: Layers3, label: `${course.modules} modules` },
                    { icon: BookOpen, label: `${course.lessons} lessons` },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-elevated/60 px-3 py-1.5"
                    >
                      <Icon size={14} className="text-primary" />
                      {label}
                    </span>
                  ))}
                </div>

                {/* What you'll learn */}
                {course.outcomes?.length > 0 && (
                  <section className="mt-10 md:mt-12" aria-labelledby="outcomes-title">
                    <h2
                      id="outcomes-title"
                      className="font-display text-[22px] font-bold tracking-tight text-text md:text-[26px]"
                    >
                      What you&apos;ll learn
                    </h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {course.outcomes.map((outcome) => (
                        <motion.li
                          key={outcome}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-success"
                            strokeWidth={2.5}
                          />
                          {outcome}
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Includes — desktop only inline list */}
                <section className="mt-10 hidden lg:block" aria-labelledby="includes-title">
                  <h2
                    id="includes-title"
                    className="font-display text-[22px] font-bold tracking-tight text-text"
                  >
                    This course includes
                  </h2>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {INCLUDES.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-2.5 text-[14px] text-muted"
                      >
                        <Icon size={16} className="text-primary" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </section>
              </motion.div>

              {/* Right — purchase card */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
                className="lg:sticky lg:top-24"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
                  <div className="relative aspect-video overflow-hidden bg-elevated">
                    <img
                      src={course.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-md bg-success px-2.5 py-1 text-[11px] font-bold text-white">
                        {discount}% off
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-display text-[28px] font-bold text-primary">
                        {formatPrice(course.price)}
                      </span>
                      {course.originalPrice > course.price && (
                        <span className="text-[14px] text-muted line-through">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 border-t border-border pt-4">
                      <CourseRatingDisplay
                        course={course}
                        reviewSummary={reviewSummary}
                        size="sm"
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-2.5">
                      <Button
                        size="lg"
                        fullWidth
                        onClick={handleBuyNow}
                      >
                        Buy now
                      </Button>
                      <Button
                        size="lg"
                        variant="secondary"
                        fullWidth
                        leftIcon={<ShoppingCart size={16} />}
                        onClick={handleCart}
                      >
                        {isInCart ? 'View cart' : 'Add to cart'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(course)}
                        className={`
                          inline-flex w-full items-center justify-center gap-2 rounded-lg border
                          px-4 py-2.5 text-[14px] font-semibold transition-colors
                          ${isWishlisted
                            ? 'border-danger/30 bg-danger/10 text-danger'
                            : 'border-border bg-elevated text-text hover:border-primary hover:text-primary'
                          }
                        `}
                      >
                        <Heart
                          size={16}
                          className={isWishlisted ? 'fill-current' : ''}
                        />
                        {isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
                      </button>
                    </div>

                    <p className="mt-4 text-center text-[12px] text-subtle">
                      30-day money-back guarantee
                    </p>

                    <ul className="mt-5 space-y-2.5 border-t border-border pt-5 lg:hidden">
                      {INCLUDES.map(({ icon: Icon, label }) => (
                        <li
                          key={label}
                          className="flex items-center gap-2.5 text-[13px] text-muted"
                        >
                          <Icon size={15} className="text-primary" />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.aside>
            </div>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container size="lg">
            <CourseReviewsSection course={course} reviewSummary={reviewSummary} />
          </Container>
        </section>

        {/* Related courses */}
        {related.length > 0 && (
          <section className="border-t border-border py-12 md:py-16">
            <Container size="lg">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
                    Keep learning
                  </p>
                  <h2 className="mt-1 font-display text-[24px] font-bold tracking-tight text-text md:text-[28px]">
                    Related courses
                  </h2>
                </div>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center text-[13px] font-semibold text-primary hover:text-primary-hover"
                >
                  Browse all
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((c) => (
                  <CatalogCourseCard key={c.id} course={c} />
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
    </div>
  );
}
