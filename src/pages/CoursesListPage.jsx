import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Heart,
  Search,
  Shield,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { featuredCourses } from '@/data/courses';
import CatalogCourseCard from '@/components/courses/CatalogCourseCard';
import CartButton from '@/components/courses/CartButton';
import CoursesHeroBackground, { COURSES_HERO_EASE } from '@/components/courses/CoursesHeroBackground';
import Container from '@/components/ui/Container';
import useWishlistStore from '@/store/useWishlistStore';
import { pageShell } from '@/styles/theme';

const EASE = COURSES_HERO_EASE;

const LEVELS = [
  { value: 'all', label: 'All levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popular', label: 'Most enrolled' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
];

function parseEnrolled(v) {
  if (!v) return 0;
  const m = String(v).replace(/,/g, '').trim().match(/^([\d.]+)([kKmM]?)\+?$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (m[2].toLowerCase() === 'k') return n * 1_000;
  if (m[2].toLowerCase() === 'm') return n * 1_000_000;
  return n;
}

function TrustBadge({ icon: Icon, text, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      whileHover={{ y: -2, scale: 1.04, borderColor: 'var(--primary)' }}
      className="
        inline-flex cursor-default items-center gap-1.5 rounded-lg
        border border-border/80 bg-surface/70 px-3 py-1.5
        text-[11px] font-semibold text-muted backdrop-blur-md
        transition-colors hover:bg-primary/5 hover:text-text
      "
    >
      <Icon size={12} className="text-primary" aria-hidden />
      {text}
    </motion.span>
  );
}

function HeroStat({ value, label, delay = 0, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      whileHover={{ scale: 1.06 }}
      className="text-center"
    >
      <motion.div
        className={`font-display text-[24px] font-bold tracking-tight ${accent ? 'text-primary' : 'text-text'}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: delay + 0.1 }}
      >
        {value}
      </motion.div>
      <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-subtle">
        {label}
      </div>
    </motion.div>
  );
}

function AnimatedStatsCard({ children, delay = 0.12 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: EASE, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="
        glass-card relative grid grid-cols-3 gap-5 self-end
        overflow-hidden rounded-2xl border border-border/60 p-5
        shadow-[var(--shadow-card-value)] md:min-w-[360px]
      "
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{
          background:
            'radial-gradient(400px circle at 50% 0%, color-mix(in srgb, var(--primary) 15%, transparent), transparent 65%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: hovered ? 1 : 0.4, scaleX: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
      />
      <div className="relative z-10 contents">{children}</div>
    </motion.div>
  );
}

export default function CoursesListPage() {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('featured');
  const [searchFocused, setSearchFocused] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = featuredCourses.filter((course) => {
      if (q) {
        const haystack = [course.title, course.professor, course.description, course.difficulty]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (level !== 'all' && course.difficulty !== level) return false;
      return true;
    });

    switch (sort) {
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        list = [...list].sort((a, b) => parseEnrolled(b.enrolled) - parseEnrolled(a.enrolled));
        break;
      case 'price-low':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return list;
  }, [query, level, sort]);

  const totalEnrolled = featuredCourses.reduce(
    (acc, c) => acc + parseEnrolled(c.enrolled),
    0
  );
  const clearAll = () => {
    setQuery('');
    setLevel('all');
    setSort('featured');
  };
  const isFiltered = query.trim() !== '' || level !== 'all' || sort !== 'featured';

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <div className={pageShell}>
      <main id="main" className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden pt-[88px] pb-10 md:pt-[112px] md:pb-14">
          <CoursesHeroBackground />

          <Container size="lg">
            <div className="mb-8 flex items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Link
                  to="/"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
                >
                  <ArrowLeft
                    size={13}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />
                  Back to home
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex items-center gap-2"
              >
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/student/wishlist"
                    aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
                    className="
                      relative inline-flex h-10 w-10 items-center justify-center
                      rounded-lg border border-border text-text
                      transition-all duration-200
                      hover:border-primary/40 hover:bg-primary/10 hover:text-primary
                      hover:shadow-[0_0_20px_-6px_var(--primary)]
                    "
                  >
                    <Heart size={20} strokeWidth={2} />
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white"
                      >
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <CartButton />
                </motion.div>
              </motion.div>
            </div>

            <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="
                    inline-flex items-center gap-1.5 rounded-lg
                    border border-primary/20 bg-primary-soft/80 px-3.5 py-1.5
                    text-[11px] font-semibold uppercase tracking-[0.18em] text-primary
                    backdrop-blur-sm
                  "
                >
                  <motion.span
                    animate={shouldReduceMotion ? undefined : { rotate: [0, 15, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles size={11} aria-hidden />
                  </motion.span>
                  Course catalog
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.06 }}
                  className="mt-5 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.025em] text-text sm:text-[44px] md:text-[54px]"
                >
                  Browse expert-led{' '}
                  <span className="animated-gradient-text">courses</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
                  className="mt-5 max-w-[640px] text-[15.5px] leading-[1.7] text-muted md:text-[17px]"
                >
                  Pick individual courses in cloud, AI, devops, and full-stack —
                  taught by senior mentors. Add to cart or buy instantly.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="mt-6 flex flex-wrap gap-2.5"
                >
                  <TrustBadge icon={Shield} text="7-day free trial" delay={0.22} />
                  <TrustBadge icon={Award} text="Certificate included" delay={0.28} />
                  <TrustBadge icon={Target} text="Lifetime access" delay={0.34} />
                </motion.div>
              </div>

              <AnimatedStatsCard delay={0.14}>
                <HeroStat value={featuredCourses.length} label="Courses" delay={0.18} />
                <div className="border-l border-border/60 pl-4">
                  <HeroStat
                    value={`${(totalEnrolled / 1000).toFixed(0)}k+`}
                    label="Learners"
                    delay={0.24}
                  />
                </div>
                <div className="border-l border-border/60 pl-4">
                  <HeroStat value="4.8" label="Avg rating" delay={0.3} accent />
                </div>
              </AnimatedStatsCard>
            </div>
          </Container>
        </section>

        {/* Toolbar + grid */}
        <section
          id="courses-catalog"
          className="scroll-mt-[88px] pb-20 md:scroll-mt-[96px] md:pb-28"
        >
          <Container size="lg">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
              className={`
                sticky top-[72px] z-20 mb-8 rounded-2xl border p-4
                backdrop-blur-xl shadow-[var(--shadow-card-value)]
                transition-all duration-300 md:top-[80px] md:p-5
                ${searchFocused
                  ? 'border-primary/40 bg-surface/95 shadow-[0_8px_32px_-12px_var(--primary)]'
                  : 'border-border bg-surface/90'
                }
              `}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted'}`}
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search courses, mentors, topics…"
                    className="
                      h-11 w-full rounded-lg border border-border bg-elevated
                      pl-10 pr-4 text-[14px] text-text outline-none
                      transition-all duration-200 placeholder:text-subtle
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                    "
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="h-11 rounded-lg border border-border bg-elevated px-3 text-[13px] font-medium text-text outline-none transition-colors hover:border-primary/40 focus:border-primary"
                    aria-label="Filter by level"
                  >
                    {LEVELS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-11 rounded-lg border border-border bg-elevated px-3 text-[13px] font-medium text-text outline-none transition-colors hover:border-primary/40 focus:border-primary"
                    aria-label="Sort courses"
                  >
                    {SORTS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {isFiltered && (
                    <motion.button
                      type="button"
                      onClick={clearAll}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      <X size={14} />
                      Clear
                    </motion.button>
                  )}

                  <div className="ml-auto flex items-center gap-2 lg:hidden">
                    <CartButton />
                  </div>
                </div>
              </div>
            </motion.div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
              >
                <BookOpen size={40} className="text-muted" strokeWidth={1.5} />
                <h2 className="mt-4 font-display text-[22px] font-bold text-text">
                  No courses found
                </h2>
                <p className="mt-2 max-w-sm text-[14px] text-muted">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-6 text-[14px] font-semibold text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 text-[13px] font-medium text-muted"
                >
                  Showing {filtered.length} of {featuredCourses.length} courses
                </motion.p>
                <motion.div
                  key={`${query}-${level}-${sort}`}
                  variants={gridVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filtered.map((course) => (
                    <motion.div key={course.id} variants={cardVariants}>
                      <CatalogCourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </Container>
        </section>
      </main>
    </div>
  );
}
