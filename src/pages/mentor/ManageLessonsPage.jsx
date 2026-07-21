import { useState, useEffect, useCallback } from 'react';
import {
  Edit3, Plus, Users, Star, BarChart, Clock,
  ChevronDown, GripVertical, CheckCircle2,
  Video, FileText, Lock, Eye, Trash2,
  TrendingUp, BookOpen, Globe,
  AlertCircle, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { fetchCourseDrafts, publishCourse, fetchCourse, deleteCourse, deleteLesson } from '@/lib/api/contentApi';
import { fetchMentorHubDashboard, fetchMentorStudentCountsByCourse } from '@/lib/api/mentorApi';
import { fetchMentorDashboard } from '@/lib/api/analyticsApi';
import { fetchEnrollmentCountsByCourse } from '@/lib/api/enrollmentApi';
import { CONTENT_CHANGED, mapDraftToManageCourse } from '@/lib/api/contentSync';
import { parseApiError } from '@/lib/api/apiHelpers';

function LessonTypeIcon({ type }) {
  if (type === 'quiz') return <FileText className="h-3.5 w-3.5" />;
  return <Video className="h-3.5 w-3.5" />;
}

export default function ManageLessonsPage() {
  const { user, token } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
  });

  const [courseDetails, setCourseDetails] = useState({});

  const loadCourses = useCallback(() => {
    if (!user?.id || !token) {
      setCourses([]);
      setSummary({ totalStudents: 0, totalRevenue: 0, avgRating: 0 });
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchCourseDrafts(user, token).catch(() => []),
      fetchMentorHubDashboard(user, token).catch(() => null),
      fetchMentorStudentCountsByCourse(user, token).catch(() => ({})),
      fetchMentorDashboard(user, token).catch(() => null),
    ])
      .then(async ([list, hub, mentorCounts, analytics]) => {
        const mapped = Array.isArray(list) ? list.map(mapDraftToManageCourse) : [];
        const catalogIds = [...new Set(
          mapped
            .map((c) => c.catalogCourseId)
            .filter((id) => id != null && Number(id) > 0)
            .map(Number)
        )];

        const enrollmentCounts = catalogIds.length
          ? await fetchEnrollmentCountsByCourse(catalogIds).catch(() => ({}))
          : {};

        const withStudents = mapped.map((course) => {
          const catalogId = course.catalogCourseId != null ? Number(course.catalogCourseId) : null;
          const fromEnrollment =
            catalogId != null
              ? (enrollmentCounts[catalogId] ?? enrollmentCounts[String(catalogId)] ?? null)
              : null;
          const fromMentor =
            catalogId != null
              ? (mentorCounts[catalogId] ?? mentorCounts[String(catalogId)] ?? null)
              : null;
          const students = Number(
            fromEnrollment ?? fromMentor ?? course.students ?? 0
          ) || 0;
          return { ...course, students };
        });

        setCourses(withStudents);
        setExpandedCourse((prev) => {
          if (prev != null && withStudents.some((c) => c.id === prev)) return prev;
          return withStudents[0]?.id ?? null;
        });

        const enrolledSum = withStudents.reduce((sum, c) => sum + (c.students || 0), 0);
        setSummary({
          totalStudents: enrolledSum > 0 ? enrolledSum : Number(hub?.totalStudents) || 0,
          totalRevenue: analytics?.revenue ?? 0,
          avgRating: hub?.rating ?? analytics?.rating ?? 0,
        });

        if (withStudents.length && user?.id && token) {
          const entries = await Promise.all(
            withStudents.map((course) =>
              fetchCourse(user, token, course.id)
                .then((full) => {
                  const detail = mapDraftToManageCourse(full);
                  const catalogId = detail.catalogCourseId ?? course.catalogCourseId;
                  const students =
                    Number(
                      (catalogId != null
                        ? enrollmentCounts[catalogId] ??
                          enrollmentCounts[String(catalogId)] ??
                          mentorCounts[catalogId] ??
                          mentorCounts[String(catalogId)]
                        : null) ??
                        detail.students ??
                        course.students ??
                        0
                    ) || 0;
                  return [course.id, { ...detail, catalogCourseId: catalogId, students }];
                })
                .catch(() => [course.id, course])
            )
          );
          setCourseDetails(Object.fromEntries(entries));
        }
      })
      .catch(() => {
        setCourses([]);
        setSummary({ totalStudents: 0, totalRevenue: 0, avgRating: 0 });
      })
      .finally(() => setLoading(false));
  }, [user?.id, token]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    const onChange = () => loadCourses();
    window.addEventListener(CONTENT_CHANGED, onChange);
    return () => window.removeEventListener(CONTENT_CHANGED, onChange);
  }, [loadCourses]);

  const handleExpand = async (courseId) => {
    const next = expandedCourse === courseId ? null : courseId;
    setExpandedCourse(next);
    if (next && user?.id && token && !courseDetails[courseId]?.lessons?.length) {
      try {
        const full = await fetchCourse(user, token, courseId);
        const mapped = mapDraftToManageCourse(full);
        setCourseDetails((prev) => ({ ...prev, [courseId]: mapped }));
      } catch {
        /* keep summary */
      }
    }
  };

  const handlePublish = async (courseId) => {
    if (!user?.id || !token) return;
    try {
      await publishCourse(user, token, courseId);
      loadCourses();
    } catch {
      /* keep UI state */
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!user?.id || !token) return;
    if (course.status === 'Published') {
      window.alert('Published courses cannot be deleted. Contact admin if you need it removed.');
      return;
    }
    if (!window.confirm(`Delete "${course.title}"? This will remove all modules and lessons.`)) return;
    try {
      await deleteCourse(user, token, course.id);
      setCourseDetails((prev) => {
        const next = { ...prev };
        delete next[course.id];
        return next;
      });
      setExpandedCourse(null);
      loadCourses();
    } catch (err) {
      window.alert(parseApiError(err) || 'Could not delete course');
    }
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (!user?.id || !token) return;
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(user, token, courseId, lessonId);
      const full = await fetchCourse(user, token, courseId);
      setCourseDetails((prev) => ({ ...prev, [courseId]: mapDraftToManageCourse(full) }));
      loadCourses();
    } catch (err) {
      window.alert(parseApiError(err) || 'Could not delete lesson');
    }
  };

  const totalStudents = summary.totalStudents;
  const totalRevenue = summary.totalRevenue;
  const avgRating =
    summary.avgRating > 0 ? Number(summary.avgRating).toFixed(2) : '—';
  const published = courses.filter((c) => c.status === 'Published').length;

  const filtered = activeTab === 'all' ? courses :
    activeTab === 'published' ? courses.filter(c => c.status === 'Published') :
    courses.filter(c => c.status === 'Draft' || c.status === 'Pending');

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-300">
        <div className="h-24 rounded-[5px] bg-surface border border-border animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-[5px] bg-surface border border-border animate-pulse" />
          ))}
        </div>
        <div className="h-12 w-64 rounded-[5px] bg-surface border border-border animate-pulse" />
        <div className="h-40 rounded-[5px] bg-surface border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[5px] border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
          
            Course Manager
          </div>
          <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Manage Courses</h1>
          <p className="text-muted mt-1 font-medium">Build, edit, and organize your entire curriculum.</p>
        </div>
        <Link
          to="/mentor/upload?new=1"
         className="
                  relative
                  inline-flex

                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[180px]

                  items-center
                  justify-center

                  border
                  border-border
                  dark:border-border

                  bg-primary
                  dark:bg-primary

                  px-6

                  text-[14px]
                  font-semibold

                  text-white
                  dark:text-white

                  overflow-hidden
                  rounded-lg

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                "
        >
          <Plus className="h-4 w-4" /> New Course
        </Link>
      </div>

      {/* ── KPI STRIP ── */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    {
      label: 'Total Students',
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      line: 'bg-blue-500/20',
      hover: 'hover:border-blue-500/20',
    },
    {
      label: 'Total Revenue',
      value: totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : '$0',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      line: 'bg-emerald-500/20',
      hover: 'hover:border-emerald-500/20',
    },
    {
      label: 'Avg. Rating',
      value: avgRating,
      icon: Star,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      line: 'bg-orange-500/20',
      hover: 'hover:border-orange-500/20',
    },
    {
      label: 'Published',
      value: `${published}/${courses.length}`,
      icon: Globe,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      line: 'bg-violet-500/20',
      hover: 'hover:border-violet-500/20',
    },
  ].map((kpi) => {
    const Icon = kpi.icon;

    return (
      <div
        key={kpi.label}
        className={`
          group
          relative overflow-hidden

          rounded-[5px]

          border border-gray-200
          dark:border-border

          bg-white
          dark:bg-elevated/80

          px-5 py-4

          shadow-sm

          transition-all duration-300

          hover:-translate-y-1

          ${kpi.hover}

          hover:shadow-[0_20px_50px_rgba(37,99,235,0.10)]
        `}
      >
       

        {/* CONTENT */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div
              className={`
                flex h-11 w-11 items-center justify-center
                rounded-[5px]

                ${kpi.bg}
                ${kpi.color}

                shadow-sm
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* VALUE + TITLE */}
            <div>
              <h3 className="text-[30px] font-black leading-none text-text">
                {kpi.value}
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-muted
                "
              >
                {kpi.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1 w-fit">
        {[
          { key: 'all', label: `All Courses (${courses.length})` },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Drafts' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-[5px] text-xs font-bold transition-all capitalize ${activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── COURSE CARDS ── */}
      <div className="space-y-4">
        {filtered.map((course) => {
          const isExpanded = expandedCourse === course.id;
          const detail = courseDetails[course.id];
          const lessons = detail?.lessons?.length ? detail.lessons : course.lessons ?? [];
          const lessonCount = detail?.lessonCount ?? course.lessonCount ?? lessons.length;
          return (
            <div key={course.id} className="bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden transition-all duration-300">

              {/* Course Header Row */}
              <div className="flex items-center gap-5 p-5">
                {/* Thumbnail */}
                <div className={`h-16 w-20 rounded-[5px] ${course.thumbnailClass || course.thumbnail || ''} flex-shrink-0 flex items-center justify-center shadow-sm overflow-hidden`}>
                  {course.thumbnail && course.thumbnail.startsWith('http') ? (
                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-7 w-7 text-white/80" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-text text-base leading-tight">{course.title}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                      course.status === 'Published' ? 'bg-success/15 text-success' : 'bg-border text-muted'
                    }`}>{course.status}</span>
                  </div>
                  <p className="text-xs text-muted font-medium">{course.category}</p>

                  {/* Mini stats */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-bold text-muted">
                      <Users className="h-3.5 w-3.5" /> {course.students.toLocaleString()}
                    </span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-muted">
                        <Star className="h-3.5 w-3.5 text-warning fill-warning" /> {course.rating}
                        <span className="text-subtle">({course.reviews})</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-bold text-success">
                      <TrendingUp className="h-3.5 w-3.5" /> {course.revenue}
                    </span>
                    {course.completionRate > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-muted">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {course.completionRate}% completion
                      </span>
                    )}
                    {course.status === 'Draft' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-warning">
                        <AlertCircle className="h-3.5 w-3.5" /> Not published
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion ring */}
                {course.completionRate > 0 && (
                  <div className="hidden sm:flex flex-col items-center gap-1">
                    <div className="relative h-12 w-12">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="18" fill="none" stroke="var(--border)" strokeWidth="4" />
                        <circle
                          cx="24" cy="24" r="18"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(course.completionRate / 100) * 113} 113`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text">{course.completionRate}%</span>
                    </div>
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Completion</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/mentor/upload?courseId=${course.id}`}
                    className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                    title="Edit course"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  {course.status !== 'Published' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course)}
                      className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all"
                      title="Delete course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleExpand(course.id)}
                    className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-text hover:bg-bg transition-all"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Lesson List (Accordion) */}
              {isExpanded && (
                <div className="border-t border-border">
                  <div className="px-5 py-3 bg-bg/50 flex items-center justify-between">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">{lessonCount} Lessons</p>
                    <Link
                      to={`/mentor/upload?courseId=${course.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Lesson
                    </Link>
                  </div>

                  <div className="divide-y divide-border">
                    {lessons.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-muted">
                        No lessons yet.{' '}
                        <Link to={`/mentor/upload?courseId=${course.id}`} className="font-semibold text-primary hover:underline">
                          Add curriculum in course editor
                        </Link>
                      </div>
                    ) : (
                    lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg/40 transition-colors group">
                        <GripVertical className="h-4 w-4 text-border group-hover:text-muted transition-colors cursor-grab flex-shrink-0" />

                        <span className="text-xs font-bold text-muted w-5 flex-shrink-0">{String(idx + 1).padStart(2, '0')}</span>

                        <div className={`h-7 w-7 rounded-[5px] flex items-center justify-center flex-shrink-0 ${
                          lesson.type === 'quiz' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                        }`}>
                          <LessonTypeIcon type={lesson.type} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-text truncate">{lesson.title}</p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          {lesson.free && (
                            <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-lg uppercase tracking-wider">Free</span>
                          )}
                          {!lesson.free && (
                            <Lock className="h-3.5 w-3.5 text-muted" />
                          )}
                          <span className="text-xs font-medium text-muted flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {lesson.duration}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                            lesson.published ? 'bg-success/10 text-success' : 'bg-border text-muted'
                          }`}>{lesson.published ? 'Live' : 'Draft'}</span>

                          <div className="hidden group-hover:flex items-center gap-1">
                            <button className="h-7 w-7 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 transition-all">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(course.id, lesson.id)}
                              className="h-7 w-7 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 transition-all"
                              title="Delete lesson"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                    )}
                  </div>

                  {/* Course Footer */}
                  <div className="px-5 py-4 bg-bg/30 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text border border-border px-3 py-1.5 rounded-[5px] hover:border-primary/40 transition-all">
                        <BarChart className="h-3.5 w-3.5" /> Analytics
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text border border-border px-3 py-1.5 rounded-[5px] hover:border-primary/40 transition-all">
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text border border-border px-3 py-1.5 rounded-[5px] hover:border-primary/40 transition-all">
                        <Download className="h-3.5 w-3.5" /> Export
                      </button>
                    </div>
                    {course.status === 'Draft' && (
                      <button className="flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-4 py-1.5 rounded-[5px] hover:bg-primary-hover transition-all">
                        <Globe className="h-3.5 w-3.5" /> Submit for Review
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── EMPTY STATE for filtered ── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-surface border border-border rounded-[5px]">
          <BookOpen className="h-14 w-14 mx-auto text-muted opacity-30 mb-4" />
          <p className="font-bold text-text">
            {courses.length === 0 ? 'No courses yet' : 'No courses in this category'}
          </p>
          <p className="text-sm text-muted mt-1">
            {courses.length === 0
              ? 'Create your first course to start building your curriculum.'
              : 'Try a different filter or create a new course.'}
          </p>
          <Link to="/mentor/upload?new=1" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white rounded-[5px] font-bold text-sm shadow-sm hover:bg-primary-hover transition-all">
            <Plus className="h-4 w-4" /> Create Course
          </Link>
        </div>
      )}

    </div>
  );
}
