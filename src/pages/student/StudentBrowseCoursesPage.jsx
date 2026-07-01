import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { featuredCourses } from '@/data/courses';
import { fetchPublishedCourses } from '@/lib/api/catalogApi';
import CatalogCourseCard from '@/components/courses/CatalogCourseCard';

const EASE = [0.16, 1, 0.3, 1];

const CATEGORIES = [
  { id: 'all', label: 'All courses' },
  { id: 'cloud', label: 'Cloud', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
  { id: 'ai', label: 'AI & ML', keywords: ['ai', 'generative', 'machine'] },
  { id: 'dev', label: 'Development', keywords: ['javascript', 'go', 'python', 'golang'] },
  { id: 'devops', label: 'DevOps', keywords: ['docker', 'kubernetes', 'container'] },
];

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

function matchesCategory(course, categoryId) {
  if (categoryId === 'all') return true;
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat?.keywords) return true;
  const haystack = `${course.title} ${course.description} ${course.slug}`.toLowerCase();
  return cat.keywords.some((kw) => haystack.includes(kw));
}

function TrustPill({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-elevated/80 px-2.5 py-1 text-[10px] font-semibold text-muted">
      <Icon size={11} className="text-primary" aria-hidden />
      {text}
    </span>
  );
}

export default function StudentBrowseCoursesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [sort, setSort] = useState('featured');
  const [searchFocused, setSearchFocused] = useState(false);
  const [courses, setCourses] = useState(featuredCourses);

  useEffect(() => {
    fetchPublishedCourses()
      .then((data) => { if (data?.length) setCourses(data); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = courses.filter((course) => {
      if (q) {
        const haystack = [course.title, course.professor, course.description, course.difficulty]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (!matchesCategory(course, category)) return false;
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
  }, [query, category, level, sort, courses]);

  const totalEnrolled = courses.reduce(
    (acc, c) => acc + parseEnrolled(c.enrolled),
    0
  );

  const clearAll = () => {
    setQuery('');
    setCategory('all');
    setLevel('all');
    setSort('featured');
  };

  const isFiltered =
    query.trim() !== '' || category !== 'all' || level !== 'all' || sort !== 'featured';

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.04 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles size={10} aria-hidden />
            Course catalog
          </div>
          <h1 className="mt-3 font-display text-[32px] font-bold tracking-tight text-text sm:text-[38px]">
            Find your next course
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            Browse expert-led courses in cloud, AI, full-stack, and DevOps.
            Add to cart or buy instantly — like Udemy and Coursera.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <TrustPill icon={Shield} text="7-day free trial" />
            <TrustPill icon={Award} text="Certificate included" />
            <TrustPill icon={Target} text="Lifetime access" />
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="dashboard-card grid grid-cols-3 gap-4 px-4 py-3 sm:min-w-[300px]">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-text">{courses.length}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Courses</p>
            </div>
            <div className="border-l border-border text-center">
              <p className="font-display text-xl font-bold text-primary">
                {(totalEnrolled / 1000).toFixed(0)}k+
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Learners</p>
            </div>
            <div className="border-l border-border text-center">
              <p className="font-display text-xl font-bold text-text">4.8</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div className="dashboard-card relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,97,210,0.12),transparent_55%)]"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                Limited-time offer
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-text">
                Up to 50% off on all courses this week
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                New enrollments include lifetime access and a verified certificate.
              </p>
            </div>
          </div>
          <Link
            to="/student/cart"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            View cart
          </Link>
        </div>
      </div>

      {/* Search & filters */}
      <div
        className={`
          relative space-y-3
          ${searchFocused ? 'ring-2 ring-inset ring-primary/15 rounded-2xl' : ''}
        `}
      >
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`
                shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors
                ${
                  category === cat.id
                    ? 'bg-primary text-white shadow-[0_4px_14px_-4px_var(--primary)]'
                    : 'border border-border bg-surface text-muted hover:border-primary/30 hover:text-text'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="dashboard-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${searchFocused ? 'text-primary' : 'text-muted'}`}
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
                  h-10 w-full rounded-lg border border-border bg-bg
                  pl-10 pr-4 text-[14px] text-text outline-none
                  transition-colors placeholder:text-subtle
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                "
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="h-10 rounded-lg border border-border bg-bg px-3 text-[13px] font-medium text-text outline-none focus:border-primary"
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
                className="h-10 rounded-lg border border-border bg-bg px-3 text-[13px] font-medium text-text outline-none focus:border-primary"
                aria-label="Sort courses"
              >
                {SORTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {isFiltered && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="dashboard-card flex flex-col items-center justify-center py-16 text-center">
          <BookOpen size={40} className="text-muted" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-xl font-bold text-text">No courses found</h2>
          <p className="mt-2 max-w-sm text-[14px] text-muted">
            Try a different search or category to discover more courses.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-5 text-[14px] font-semibold text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-[13px] font-medium text-muted">
            Showing {filtered.length} of {courses.length} courses
          </p>
          <motion.div
            key={`${query}-${category}-${level}-${sort}`}
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((course) => (
              <motion.div key={course.id} variants={cardVariants}>
                <CatalogCourseCard course={course} cartPath="/student/cart" />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
