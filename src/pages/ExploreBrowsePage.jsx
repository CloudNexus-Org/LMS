import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

import CatalogCourseCard from '@/components/courses/CatalogCourseCard';
import Container from '@/components/ui/Container';
import {
  EXPLORE_SECTION_LABELS,
  EXPLORE_TYPES,
  explorePath,
  findExploreItem,
  getExploreSectionItems,
} from '@/data/exploreMenu';
import { fetchPublishedCourses } from '@/lib/api/catalogApi';
import { pageShell } from '@/styles/theme';

const EASE = [0.16, 1, 0.3, 1];
const VALID_TYPES = Object.values(EXPLORE_TYPES);

function ExploreHub({ type }) {
  const shouldReduceMotion = useReducedMotion();
  const items = getExploreSectionItems(type);
  const label = EXPLORE_SECTION_LABELS[type] ?? 'Explore';

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
    <div className={pageShell}>
      <main id="main" className="pt-[88px] pb-20 md:pt-[104px] md:pb-28">
        <Container size="lg">
          <Link
            to="/courses"
            className="group mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
            Back to courses
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-soft/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              <Sparkles size={11} aria-hidden />
              Explore
            </span>
            <h1 className="mt-4 font-display text-[32px] font-bold tracking-[-0.025em] text-text sm:text-[40px]">
              {label}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Browse topics curated by Realm mentors. Select a path to see matching courses and learning tracks.
            </p>
          </motion.div>

          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <motion.div key={item.slug} variants={cardVariants}>
                <Link
                  to={item.to ?? explorePath(type, item.slug)}
                  className="
                    group flex h-full flex-col rounded-2xl border border-border bg-surface/90
                    p-5 shadow-[var(--shadow-card-value)] transition-all duration-200
                    hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elevated-value)]
                  "
                >
                  <h2 className="font-display text-[18px] font-bold text-text transition-colors group-hover:text-primary">
                    {item.label}
                  </h2>
                  <span className="mt-3 text-[13px] font-medium text-primary">
                    Browse courses →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </main>
    </div>
  );
}

function ExploreDetail({ type, slug }) {
  const shouldReduceMotion = useReducedMotion();
  const item = findExploreItem(type, slug);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    fetchPublishedCourses()
      .then((data) => setCatalog(data || []))
      .catch(() => setCatalog([]));
  }, []);

  const filtered = useMemo(() => {
    if (!item?.keywords) return catalog;
    return catalog.filter((course) => {
      const haystack = `${course.title} ${course.description} ${course.slug} ${course.professor}`.toLowerCase();
      return item.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
    });
  }, [type, slug, item, catalog]);

  if (!item) {
    return <Navigate to={explorePath(type)} replace />;
  }

  if (type === 'degrees' && item.to) {
    return <Navigate to={item.to} replace />;
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <div className={pageShell}>
      <main id="main" className="pt-[88px] pb-20 md:pt-[104px] md:pb-28">
        <Container size="lg">
          <Link
            to={explorePath(type)}
            className="group mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
            {EXPLORE_SECTION_LABELS[type] ?? 'Explore'}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="font-display text-[32px] font-bold tracking-[-0.025em] text-text sm:text-[40px]">
              {item.label}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              {filtered.length} course{filtered.length !== 1 ? 's' : ''} matched for this topic.
              {filtered.length < catalog.length && ' Refine with search on the full catalog.'}
            </p>
          </motion.div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
            >
              <BookOpen size={40} className="text-muted" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-[22px] font-bold text-text">
                No courses yet
              </h2>
              <p className="mt-2 max-w-sm text-[14px] text-muted">
                We&apos;re adding more content for this topic. Browse the full catalog in the meantime.
              </p>
              <Link
                to="/courses"
                className="mt-6 text-[14px] font-semibold text-primary hover:underline"
              >
                Browse all courses
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 mt-10 text-[13px] font-medium text-muted"
              >
                Showing {filtered.length} course{filtered.length !== 1 ? 's' : ''}
              </motion.p>
              <motion.div
                key={`${type}-${slug}`}
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
      </main>
    </div>
  );
}

export default function ExploreBrowsePage() {
  const { type, slug } = useParams();

  if (!VALID_TYPES.includes(type)) {
    return <Navigate to="/courses" replace />;
  }

  if (type === 'degrees') {
    return <Navigate to="/courses" replace />;
  }

  if (!slug) {
    return <ExploreHub type={type} />;
  }

  return <ExploreDetail type={type} slug={slug} />;
}
