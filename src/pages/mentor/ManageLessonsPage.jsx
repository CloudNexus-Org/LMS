import { useState } from 'react';
import {
  Edit3, EyeOff, Plus, Users, Star, BarChart, Clock,
  ChevronDown, GripVertical, CheckCircle2,
  Video, FileText, Lock, Eye, Trash2,
  TrendingUp, ArrowUpRight, BookOpen, Globe,
  AlertCircle, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const COURSES = [
  {
    id: 1,
    title: 'Advanced State Management',
    status: 'Published',
    category: 'Frontend Engineering',
    students: 842,
    rating: 4.8,
    reviews: 214,
    revenue: '$8,420',
    completionRate: 68,
    thumbnail: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    lessons: [
      { id: 1, title: 'Introduction to State Patterns', type: 'video', duration: '12:40', free: true, published: true },
      { id: 2, title: 'Redux Deep Dive', type: 'video', duration: '28:15', free: false, published: true },
      { id: 3, title: 'Zustand vs Jotai', type: 'video', duration: '18:22', free: false, published: true },
      { id: 4, title: 'Module Quiz', type: 'quiz', duration: '15 Q', free: false, published: true },
      { id: 5, title: 'Advanced Context Patterns', type: 'video', duration: '22:08', free: false, published: false },
    ],
  },
  {
    id: 2,
    title: 'Cloud Architecture Patterns',
    status: 'Published',
    category: 'Cloud & DevOps',
    students: 406,
    rating: 4.9,
    reviews: 98,
    revenue: '$4,060',
    completionRate: 54,
    thumbnail: 'bg-gradient-to-br from-violet-500 to-fuchsia-400',
    lessons: [
      { id: 1, title: 'Cloud Fundamentals', type: 'video', duration: '10:30', free: true, published: true },
      { id: 2, title: 'Microservices Architecture', type: 'video', duration: '32:10', free: false, published: true },
      { id: 3, title: 'Event-Driven Design', type: 'video', duration: '24:45', free: false, published: true },
    ],
  },
  {
    id: 3,
    title: 'Rust for Frontend Devs',
    status: 'Draft',
    category: 'Systems Programming',
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: '$0',
    completionRate: 0,
    thumbnail: 'bg-gradient-to-br from-orange-500 to-yellow-400',
    lessons: [
      { id: 1, title: 'Why Rust for Web?', type: 'video', duration: '8:20', free: true, published: false },
      { id: 2, title: 'WebAssembly Basics', type: 'video', duration: '20:10', free: false, published: false },
    ],
  },
];

function LessonTypeIcon({ type }) {
  if (type === 'quiz') return <FileText className="h-3.5 w-3.5" />;
  return <Video className="h-3.5 w-3.5" />;
}

export default function ManageLessonsPage() {
  const [expandedCourse, setExpandedCourse] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  const totalStudents = COURSES.reduce((a, c) => a + c.students, 0);
  const totalRevenue = '$12,480';
  const avgRating = '4.85';
  const published = COURSES.filter(c => c.status === 'Published').length;

  const filtered = activeTab === 'all' ? COURSES :
    activeTab === 'published' ? COURSES.filter(c => c.status === 'Published') :
    COURSES.filter(c => c.status === 'Draft');

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
          to="/mentor/upload"
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
                  rounded-none

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60

                  [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]
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
      trend: '+12%',
      line: 'bg-blue-500/20',
      hover: 'hover:border-blue-500/20',
    },
    {
      label: 'Total Revenue',
      value: totalRevenue,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      trend: '+18%',
      line: 'bg-emerald-500/20',
      hover: 'hover:border-emerald-500/20',
    },
    {
      label: 'Avg. Rating',
      value: avgRating,
      icon: Star,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      trend: '+0.1',
      line: 'bg-orange-500/20',
      hover: 'hover:border-orange-500/20',
    },
    {
      label: 'Published',
      value: `${published}/${COURSES.length}`,
      icon: Globe,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      trend: '',
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

            {/* TREND */}
            {kpi.trend && (
              <div
                className="
                  ml-auto
                  flex items-center gap-1

                  rounded-[5px]

                  bg-emerald-500/10

                  px-2 py-1

                  text-[10px]
                  font-black

                  text-emerald-500
                "
              >
                <ArrowUpRight className="h-3 w-3" />
                {kpi.trend}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1 w-fit">
        {[
          { key: 'all', label: `All Courses (${COURSES.length})` },
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
          return (
            <div key={course.id} className="bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden transition-all duration-300">

              {/* Course Header Row */}
              <div className="flex items-center gap-5 p-5">
                {/* Thumbnail */}
                <div className={`h-16 w-20 rounded-[5px] ${course.thumbnail} flex-shrink-0 flex items-center justify-center shadow-sm`}>
                  <BookOpen className="h-7 w-7 text-white/80" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-text text-base leading-tight">{course.title}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
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
                  <button className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="h-9 w-9 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all">
                    <EyeOff className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
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
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">{course.lessons.length} Lessons</p>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                      <Plus className="h-3.5 w-3.5" /> Add Lesson
                    </button>
                  </div>

                  <div className="divide-y divide-border">
                    {course.lessons.map((lesson, idx) => (
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
                            <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full uppercase tracking-wider">Free</span>
                          )}
                          {!lesson.free && (
                            <Lock className="h-3.5 w-3.5 text-muted" />
                          )}
                          <span className="text-xs font-medium text-muted flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {lesson.duration}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            lesson.published ? 'bg-success/10 text-success' : 'bg-border text-muted'
                          }`}>{lesson.published ? 'Live' : 'Draft'}</span>

                          <div className="hidden group-hover:flex items-center gap-1">
                            <button className="h-7 w-7 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-primary hover:border-primary/40 transition-all">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button className="h-7 w-7 flex items-center justify-center rounded-[5px] border border-border text-muted hover:text-danger hover:border-danger/40 transition-all">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
          <p className="font-bold text-text">No courses in this category</p>
          <p className="text-sm text-muted mt-1">Create your first course to get started.</p>
          <Link to="/mentor/upload" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white rounded-[5px] font-bold text-sm shadow-sm hover:bg-primary-hover transition-all">
            <Plus className="h-4 w-4" /> Create Course
          </Link>
        </div>
      )}

    </div>
  );
}
