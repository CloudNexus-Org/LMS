import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Code2,
  FileText,
  Globe,
  Heart,
  Infinity as InfinityIcon,
  Layers3,
  PlayCircle,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import {
  featuredCourses as mockCourses,
  getCourseBySlug,
} from '@/data/courses';
import { fetchCourseBySlug, fetchFeaturedCourses } from '@/lib/api/catalogApi';
import { fetchCourseReviewSummary } from '@/lib/api/reviewApi';
import Container from '@/components/ui/Container';
import CatalogCourseCard, {
  formatPrice,
  getDiscountPercent,
} from '@/components/courses/CatalogCourseCard';
import CourseReviewsSection from '@/components/courses/CourseReviewsSection';
import useCartStore from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';

const EASE = [0.16, 1, 0.3, 1];

const DEFAULT_INSTRUCTORS = [
  {
    id: 'love-babbar',
    name: 'Love Babbar',
    roleBadge: 'Founder',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tagline: 'Previously worked at Amazon and Microsoft.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    highlights: [
      { title: 'Senior Software Engineer', desc: 'Ex-Amazon & Ex-Microsoft SDE with extensive industry experience.' },
      { title: 'Popular Mentor & Educator', desc: 'Known for simplified explanations and real-life teaching examples.' },
      { title: 'Proven Student Success', desc: 'Ex-students now working at Microsoft, Amazon, Google, De-Shaw, and top firms.' },
      { title: 'Expert DSA Mentor', desc: 'Skilled at breaking down complex computer concepts into easy-to-grasp lessons.' },
    ],
  },
  {
    id: 'lakshay-kumar',
    name: 'Lakshay Kumar',
    roleBadge: 'Lead Instructor',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    tagline: 'Currently working at Adobe & Instructor at CodeHelp.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    highlights: [
      { title: 'Computer Scientist II at Adobe', desc: '6+ years of industry experience solving real-world production problems.' },
      { title: 'Popular CodeHelp Instructor', desc: 'Known for simplified explanations and hands-on coding demos.' },
      { title: 'Proven Student Placements', desc: 'Ex-students now working at Microsoft, Amazon, De-Shaw, and other top firms.' },
      { title: 'Expert Problem Solver', desc: 'Skilled at breaking down computer concepts into easy-to-grasp lessons.' },
    ],
  },
];

const DEFAULT_MODULES = [
  {
    id: 'mod-1',
    title: 'Namaste Coder !!',
    lessons: [
      { title: 'Welcome to Red', duration: '05:12', type: 'doc' },
      { title: 'What is LIVE Dashboard', duration: '08:45', type: 'doc' },
      { title: 'What is RED Dashboard', duration: '07:30', type: 'doc' },
      { title: 'How to access Lectures', duration: '10:15', type: 'video' },
      { title: 'How to Join Discord', duration: '04:20', type: 'doc' },
      { title: 'How to clear Doubts', duration: '09:10', type: 'video' },
      { title: 'How to download Course Certificate', duration: '06:00', type: 'doc' },
      { title: 'How to Raise Issue/Tickets', duration: '05:50', type: 'doc' },
    ],
  },
  {
    id: 'mod-2',
    title: 'Learn C++ & Flowcharts',
    lessons: [
      { title: 'Introduction to Programming & Flowcharts', duration: '45:00', type: 'video' },
      { title: 'C++ Setup, Variables & Data Types', duration: '52:10', type: 'video' },
      { title: 'Conditionals & Loop Patterns', duration: '1:15:00', type: 'video' },
      { title: 'Bitwise Operators & Functions', duration: '1:05:00', type: 'video' },
    ],
  },
  {
    id: 'mod-3',
    title: 'Programming in C++ & Data Structures',
    lessons: [
      { title: 'Arrays & Vector Operations', duration: '1:20:00', type: 'video' },
      { title: '2D Arrays & Matrix Traversals', duration: '1:10:00', type: 'video' },
      { title: 'Strings & Character Arrays Mastery', duration: '1:05:00', type: 'video' },
      { title: 'Pointers & Dynamic Memory Allocation', duration: '1:35:00', type: 'video' },
    ],
  },
  {
    id: 'mod-4',
    title: 'Recursion & Backtracking Roadmap',
    lessons: [
      { title: 'Recursion Fundamentals & Call Stack', duration: '1:10:00', type: 'video' },
      { title: 'Divide & Conquer: Merge Sort & Quick Sort', duration: '1:40:00', type: 'video' },
      { title: 'Backtracking: N-Queens & Maze Problems', duration: '2:05:00', type: 'video' },
    ],
  },
  {
    id: 'mod-5',
    title: 'Advanced Data Structures (LinkedList, Trees & Graphs)',
    lessons: [
      { title: 'Singly & Doubly Linked List Operations', duration: '2:10:00', type: 'video' },
      { title: 'Stacks & Queues with Monotonic Applications', duration: '2:20:00', type: 'video' },
      { title: 'Binary Trees & Binary Search Trees', duration: '2:45:00', type: 'video' },
      { title: 'Graph Traversals: BFS, DFS & Shortest Path', duration: '2:15:00', type: 'video' },
    ],
  },
  {
    id: 'mod-6',
    title: 'Dynamic Programming & Interview Patterns',
    lessons: [
      { title: '1D DP & Memoization Patterns', duration: '1:50:00', type: 'video' },
      { title: '2D DP Grid & Subset Sum Problems', duration: '2:30:00', type: 'video' },
      { title: 'Top 50 FAANG Interview Problem Walkthrough', duration: '3:10:00', type: 'video' },
    ],
  },
];

const ROADMAP_STEPS = [
  { step: '01', title: 'Basics & C++', desc: 'Flowcharts, Conditionals, Loops & Bitwise Operators' },
  { step: '02', title: 'Arrays & Strings', desc: 'Vectors, 2D Matrices, Search & Sorting Patterns' },
  { step: '03', title: 'Recursion & Trees', desc: 'Divide & Conquer, BSTs, Heaps & Backtracking' },
  { step: '04', title: 'Graphs & DP', desc: 'BFS/DFS, Shortest Path, 1D/2D Dynamic Programming' },
  { step: '05', title: 'FAANG Interview Prep', desc: 'System Design Basics, Mock Interviews & Resume Review' },
];

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState(mockCourses);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Accordion state
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true });
  const [searchSectionQuery, setSearchSectionQuery] = useState('');
  const [currentInstructorIdx, setCurrentInstructorIdx] = useState(0);

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
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const addToCart = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => (course ? s.isInCart(course.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => (course ? s.isInWishlist(course.id) : false));

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        <div className="flex items-center gap-2">
          <Sparkles className="animate-spin text-primary" size={20} />
          <span>Loading course details…</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const discount = getDiscountPercent(course.price, course.originalPrice) || 41;
  const originalPriceVal = course.originalPrice || 7000;
  const priceVal = course.price || 4100;
  const related = relatedCourses.filter((c) => c.id !== course.id).slice(0, 4);

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

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllModules = () => {
    const allExpanded = DEFAULT_MODULES.every((m) => expandedModules[m.id]);
    if (allExpanded) {
      setExpandedModules({});
    } else {
      const next = {};
      DEFAULT_MODULES.forEach((m) => (next[m.id] = true));
      setExpandedModules(next);
    }
  };

  const filteredModules = DEFAULT_MODULES.filter((m) => {
    if (!searchSectionQuery.trim()) return true;
    const q = searchSectionQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.lessons.some((l) => l.title.toLowerCase().includes(q))
    );
  });

  const nextInstructor = () => {
    setCurrentInstructorIdx((prev) => (prev + 1) % DEFAULT_INSTRUCTORS.length);
  };

  const prevInstructor = () => {
    setCurrentInstructorIdx((prev) => (prev - 1 + DEFAULT_INSTRUCTORS.length) % DEFAULT_INSTRUCTORS.length);
  };

  const currentInstructor = DEFAULT_INSTRUCTORS[currentInstructorIdx];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white">
      {/* Top Banner Notice */}
      {!bannerDismissed && (
        <div className="relative bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 px-4 py-2.5 text-center text-xs font-semibold text-purple-200 border-b border-purple-800/40">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Run/Submit are not working, we are trying to resolve it asap</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <main id="main" className="relative pb-12 md:pb-16">
        {/* Main Content Area: 2-Column Layout */}
        <section className="relative overflow-hidden pt-6 pb-10 md:pt-8 md:pb-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-[10%] h-[500px] w-[600px] rounded-full bg-purple-600/10 opacity-40 blur-[150px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-10 right-[-10%] h-[400px] w-[500px] rounded-full bg-indigo-600/10 opacity-30 blur-[130px]"
          />

          <Container size="lg">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-400">
              <Link to="/courses" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <ArrowLeft size={12} />
                All Courses
              </Link>
              <span>/</span>
              <span className="text-neutral-200 truncate">{course.title}</span>
            </nav>

            {/* 2-Column Grid Layout: Left Content Flow, Right Sticky Purchase Card */}
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
              {/* Left Column Flow (Header -> Description -> What You'll Learn -> Course Content -> Roadmap -> Instructors -> Reviews) */}
              <div className="space-y-10 md:space-y-12 min-w-0">
                {/* 1. Header & Title Section */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <h1 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                    {course.title}
                  </h1>

                  {/* Badges Pill Row */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-300">
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-purple-300 backdrop-blur-md">
                      <Star size={12} className="fill-warning text-warning" />
                      <span>{course.rating || '4.9'} ({course.reviews || '3k+'} Ratings)</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-indigo-300 backdrop-blur-md">
                      <Users size={12} />
                      <span>{course.enrolled || '3k+'} students</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-purple-300 backdrop-blur-md">
                      <Clock3 size={12} />
                      <span>{course.duration || '295 Hours'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-indigo-300 backdrop-blur-md">
                      <Layers3 size={12} />
                      <span>{course.sectionsCount || course.modules || '41'} Sections</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-purple-300 backdrop-blur-md">
                      <Globe size={12} />
                      <span>Hindi</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm md:text-base leading-relaxed text-neutral-300">
                    Master Data Structures and Algorithms in this LIVE DSA Course led by Love Babbar (Ex-Amazon, Ex-Microsoft SDE) and Lakshay Kumar (Computer Scientist at Adobe with 6+ years of experience). Learn problem-solving techniques, crack coding interviews, and build a strong foundation with personalized guidance from top industry experts.
                  </p>
                </motion.div>

                {/* 2. What You'll Learn Section */}
                <section aria-labelledby="outcomes-heading" className="rounded-2xl border border-white/10 bg-[#13141a] p-6 shadow-xl">
                  <h2 id="outcomes-heading" className="font-display text-xl md:text-2xl font-bold text-white">
                    What you'll learn
                  </h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    Discover the key skills and concepts you'll master in this course to advance your programming expertise.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(course.outcomes?.length ? course.outcomes : [
                      "Master Arrays, Vectors, Strings, Matrices, and Recursion",
                      "Build strong foundation in LinkedList, Trees, BSTs & Graphs",
                      "Solve 250+ FAANG Coding Interview Problems with optimal approach",
                      "Master 1D/2D Dynamic Programming & Backtracking algorithms",
                      "Learn C++ Memory Management, Pointers & System Design basics",
                      "Get Certificate of Completion & Lifetime Discord Community Access"
                    ]).map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs md:text-sm text-neutral-300">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-purple-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Course Content Accordion Section */}
                <section aria-labelledby="content-heading">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 id="content-heading" className="font-display text-2xl md:text-3xl font-bold text-white">
                        Course Content
                      </h2>
                      <p className="mt-1 text-xs text-neutral-400">
                        Explore detailed modules, lessons, and hands-on coding exercises.
                      </p>
                    </div>

                    {/* Search sections */}
                    <div className="relative min-w-[240px]">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={searchSectionQuery}
                        onChange={(e) => setSearchSectionQuery(e.target.value)}
                        placeholder="Search sections..."
                        className="h-10 w-full rounded-xl border border-white/10 bg-[#13141a] pl-9 pr-4 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  {/* Modules Accordion List */}
                  <div className="mt-6 space-y-3">
                    {filteredModules.map((mod) => {
                      const isExpanded = !!expandedModules[mod.id];
                      return (
                        <div
                          key={mod.id}
                          className="overflow-hidden rounded-xl border border-white/10 bg-[#13141a] transition-all duration-200"
                        >
                          {/* Header */}
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.id)}
                            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm text-white hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-purple-400">{mod.title}</span>
                              <span className="text-xs font-normal text-neutral-400">
                                ({mod.lessons.length} lessons)
                              </span>
                            </div>
                            {isExpanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                          </button>

                          {/* Content Lessons */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="border-t border-white/5 bg-[#0f1015] px-4 py-3 space-y-2"
                              >
                                {mod.lessons.map((lesson) => (
                                  <div
                                    key={lesson.title}
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-white/5 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      {lesson.type === 'video' ? (
                                        <PlayCircle size={14} className="text-purple-400 shrink-0" />
                                      ) : (
                                        <FileText size={14} className="text-neutral-400 shrink-0" />
                                      )}
                                      <span>{lesson.title}</span>
                                    </div>
                                    <span className="text-neutral-500 font-mono text-[11px]">{lesson.duration}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show All Modules Button */}
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={toggleAllModules}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#13141a] px-6 py-2.5 text-xs font-semibold text-neutral-300 hover:border-white/20 hover:text-white transition-all"
                    >
                      <span>{DEFAULT_MODULES.every((m) => expandedModules[m.id]) ? 'Collapse all modules' : 'Show all modules'}</span>
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </section>

                {/* 4. Full Roadmap Timeline Section */}
                <section aria-labelledby="roadmap-heading" className="rounded-2xl border border-white/10 bg-[#0f1015] p-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Step by Step Path</span>
                  <h2 id="roadmap-heading" className="mt-1 font-display text-xl md:text-2xl font-bold text-white">
                    Course Learning Roadmap
                  </h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    Structured path designed to take you from foundational concepts to FAANG interview readiness.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ROADMAP_STEPS.map((s) => (
                      <div key={s.step} className="rounded-xl border border-white/10 bg-[#13141a] p-4 shadow-md">
                        <span className="font-display text-xl font-extrabold text-purple-500/50">{s.step}</span>
                        <h3 className="mt-1 text-sm font-bold text-white">{s.title}</h3>
                        <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Our Instructors Section */}
                <section aria-labelledby="instructors-heading">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 id="instructors-heading" className="font-display text-xl md:text-2xl font-bold text-white">
                        Our Instructors
                      </h2>
                      <p className="mt-1 text-xs text-neutral-400">
                        Passionate mentors dedicated to fuelling your coding journey at CodeHelp.
                      </p>
                    </div>

                    {/* Slider Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={prevInstructor}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#13141a] text-neutral-300 hover:border-white/20 hover:text-white transition-all"
                        aria-label="Previous instructor"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={nextInstructor}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#13141a] text-neutral-300 hover:border-white/20 hover:text-white transition-all"
                        aria-label="Next instructor"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Instructor Card */}
                  <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#13141a] p-5 md:p-6">
                    <div className="grid items-center gap-6 sm:grid-cols-[160px_1fr]">
                      {/* Avatar */}
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={currentInstructor.image}
                          alt={currentInstructor.name}
                          className="h-36 w-36 rounded-2xl object-cover border-2 border-purple-500/30 shadow-xl"
                        />
                      </div>

                      {/* Info & Highlights Grid */}
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-xl font-bold text-white">
                            {currentInstructor.name}
                          </h3>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${currentInstructor.badgeColor}`}>
                            {currentInstructor.roleBadge}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-neutral-300 font-medium">
                          {currentInstructor.tagline}
                        </p>

                        {/* Highlights 2x2 Grid */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {currentInstructor.highlights.map((h) => (
                            <div key={h.title} className="rounded-xl border border-white/5 bg-[#0d0e12] p-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                                <Code2 size={13} />
                                <span>{h.title}</span>
                              </div>
                              <p className="mt-1 text-[11px] text-neutral-400 leading-relaxed">
                                {h.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. Student Reviews */}
                <section className="pt-2">
                  <CourseReviewsSection course={course} reviewSummary={reviewSummary} />
                </section>
              </div>

              {/* Right Column: Sticky Purchase Card */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
                className="lg:sticky lg:top-24"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13141a] shadow-2xl backdrop-blur-xl">
                  <div className="relative aspect-video overflow-hidden bg-neutral-900">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                        {discount}% Off
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-display text-3xl font-extrabold text-white">
                        {formatPrice(priceVal)}
                      </span>
                      <span className="text-sm text-neutral-400 line-through">
                        {formatPrice(originalPriceVal)}
                      </span>
                      {discount > 0 && (
                        <span className="rounded-md bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-xs font-bold text-purple-300">
                          {discount}% Off
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-400 font-medium">
                      (Included in subscription)
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-indigo-700 active:scale-[0.98]"
                      >
                        Buy Course
                      </button>

                      <button
                        type="button"
                        onClick={handleCart}
                        className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        {isInCart ? 'Go to Cart' : 'Add to Cart'}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWishlist(course)}
                        className={`w-full rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                          isWishlisted
                            ? 'border-red-500/40 bg-red-500/10 text-red-400'
                            : 'border-white/10 bg-neutral-900/80 text-neutral-300 hover:border-white/20'
                        }`}
                      >
                        <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
                        {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      </button>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4 text-center">
                      <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>30-day money-back guarantee</span>
                      </p>
                    </div>

                    {/* Included Features */}
                    <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <PlayCircle size={14} className="text-purple-400" />
                        <span>On-demand video lectures & LIVE sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-indigo-400" />
                        <span>Downloadable DSA Cheat Sheets & Notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-purple-400" />
                        <span>Certificate of Completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <InfinityIcon size={14} className="text-indigo-400" />
                        <span>Lifetime Access & Discord Doubt Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </Container>
        </section>

        {/* Related Courses */}
        {related.length > 0 && (
          <section className="border-t border-white/5 py-12 md:py-16">
            <Container size="lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Keep Learning</span>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white">
                    Related Courses
                  </h2>
                </div>
                <Link to="/courses" className="text-xs font-semibold text-purple-400 hover:underline">
                  Browse All Courses
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
