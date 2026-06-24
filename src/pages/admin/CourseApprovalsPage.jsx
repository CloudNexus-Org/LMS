import { useState } from 'react';
import {
  CheckSquare,
  XSquare,
  BookOpen,
  Clock3,
  Star,
  AlertTriangle,
  Eye,
  Download,
  CheckCircle2,
  X,
  Layers3,
} from 'lucide-react';

const INITIAL_APPROVALS = [
  {
    id: 'C-8291',
    title: 'Advanced Next.js 15 Patterns',
    mentor: 'Sarah Chen',
    mentorAvatar: 'SC',
    category: 'Frontend Engineering',
    submitted: '2 hours ago',
    modules: 12,
    lessons: 48,
    duration: '4h 15m',
    previewRating: 4.7,
    thumbnail: 'from-blue-500 to-cyan-400',
    status: 'Pending',
    priority: 'high',
    description: 'Deep dive into Next.js 15 server components, caching strategies, and app router patterns.',
  },
  {
    id: 'C-8292',
    title: 'Go Microservices Architecture',
    mentor: 'David Kim',
    mentorAvatar: 'DK',
    category: 'Backend & Systems',
    submitted: '1 day ago',
    modules: 8,
    lessons: 32,
    duration: '6h 30m',
    previewRating: 4.9,
    thumbnail: 'from-emerald-500 to-teal-400',
    status: 'Pending',
    priority: 'normal',
    description: 'Build production-ready microservices with Go, gRPC, Kafka, and Kubernetes orchestration.',
  },
  {
    id: 'C-8290',
    title: 'LangChain & LLM Engineering',
    mentor: 'Priya Nair',
    mentorAvatar: 'PN',
    category: 'Data & AI',
    submitted: '3 days ago',
    modules: 10,
    lessons: 40,
    duration: '5h 45m',
    previewRating: 4.8,
    thumbnail: 'from-violet-500 to-fuchsia-400',
    status: 'Pending',
    priority: 'normal',
    description: 'Production LLM apps using LangChain, vector databases, RAG pipelines, and fine-tuning.',
  },
  {
    id: 'C-8289',
    title: 'Rust Systems Programming',
    mentor: 'Liam Carter',
    mentorAvatar: 'LC',
    category: 'Systems Programming',
    submitted: '5 days ago',
    modules: 14,
    lessons: 56,
    duration: '8h 00m',
    previewRating: 5.0,
    thumbnail: 'from-orange-500 to-red-400',
    status: 'Approved',
    priority: 'normal',
    description: 'Comprehensive Rust course covering ownership, lifetimes, async, and systems-level programming.',
  },
];

const STATUS_ACCENT = {
  Pending: 'bg-warning',
  Approved: 'bg-success',
  Rejected: 'bg-danger',
};

const STATUS_BADGE = {
  Pending: 'admin-status-badge-pending',
  Approved: 'admin-status-badge-approved',
  Rejected: 'admin-status-badge-rejected',
};

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function CourseApprovalsPage() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const approve = (id) =>
    setApprovals((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c)));
  const reject = (id) =>
    setApprovals((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c)));

  const filtered = filter === 'All' ? approvals : approvals.filter((c) => c.status === filter);

  const pending = approvals.filter((c) => c.status === 'Pending').length;
  const approved = approvals.filter((c) => c.status === 'Approved').length;
  const rejected = approvals.filter((c) => c.status === 'Rejected').length;
  const highPriority = approvals.filter((c) => c.status === 'Pending' && c.priority === 'high').length;

  const stats = [
    {
      label: 'Pending review',
      value: pending,
      meta: highPriority > 0 ? `${highPriority} high priority` : 'Queue clear',
      metaTone: highPriority > 0 ? 'warning' : 'muted',
      icon: AlertTriangle,
      iconColor: 'text-warning',
    },
    {
      label: 'Approved',
      value: approved,
      meta: 'Ready to publish',
      metaTone: 'muted',
      icon: CheckCircle2,
      iconColor: 'text-success',
    },
    {
      label: 'Rejected',
      value: rejected,
      meta: 'Sent back to mentors',
      metaTone: rejected > 0 ? 'warning' : 'muted',
      icon: XSquare,
      iconColor: 'text-danger',
    },
  ];

  return (
    <div className="dashboard-page mx-auto w-full max-w-[1320px] space-y-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-text sm:text-[36px]">
            Course Approvals
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Review and quality-check mentor-submitted curriculum before publishing.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-text sm:self-center"
        >
          <Download className="h-4 w-4" />
          Export queue
        </button>
      </div>

      <section className="admin-stat-strip admin-stat-strip-3" aria-label="Approval queue statistics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-cell">
              <div className={`admin-stat-icon ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="admin-stat-value">{stat.value}</p>
                <p className="admin-stat-label">{stat.label}</p>
                <p
                  className={`admin-stat-meta ${
                    stat.metaTone === 'muted'
                      ? 'admin-stat-meta-muted'
                      : stat.metaTone === 'warning'
                        ? 'admin-stat-meta-warning'
                        : ''
                  }`}
                >
                  {stat.meta}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="admin-queue-toolbar">
        <div className="admin-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`admin-filter-tab ${filter === f ? 'admin-filter-tab-active' : ''}`}
            >
              {f}
              {f === 'Pending' && pending > 0 ? ` (${pending})` : ''}
            </button>
          ))}
        </div>
        <p className="text-[12px] font-medium text-muted">
          {filtered.length} submission{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="dashboard-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <CheckSquare className="mb-4 h-12 w-12 text-muted opacity-30" />
          <h2 className="text-lg font-bold text-text">Queue empty</h2>
          <p className="mt-1 max-w-sm text-[15px] text-muted">
            No courses in this category right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <article key={course.id} className="admin-approval-card">
              <div className="admin-approval-card-inner">
                <div
                  className={`admin-approval-accent ${STATUS_ACCENT[course.status]}`}
                  aria-hidden
                />

                <div className="admin-approval-body">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-border bg-bg px-2 py-0.5 font-mono text-[10px] font-bold text-muted">
                      {course.id}
                    </span>
                    <span className={`admin-status-badge ${STATUS_BADGE[course.status]}`}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          course.status === 'Pending' ? 'animate-pulse bg-warning' : STATUS_ACCENT[course.status]
                        }`}
                      />
                      {course.status}
                    </span>
                    {course.priority === 'high' && course.status === 'Pending' ? (
                      <span className="admin-priority-badge">High priority</span>
                    ) : null}
                  </div>

                  <h2 className="text-[17px] font-bold leading-snug text-text">{course.title}</h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{course.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${course.thumbnail} text-[9px] font-bold text-white`}
                      >
                        {course.mentorAvatar}
                      </span>
                      <span className="font-semibold text-text">{course.mentor}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {course.modules} modules
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Layers3 className="h-3.5 w-3.5" />
                      {course.lessons} lessons
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {course.previewRating} preview
                    </span>
                    <span className="rounded-lg border border-border bg-bg px-2 py-0.5 text-[11px] font-semibold">
                      {course.category}
                    </span>
                    <span className="text-[11px]">Submitted {course.submitted}</span>
                  </div>
                </div>

                <div className="admin-approval-actions">
                  <button
                    type="button"
                    onClick={() => setSelected(course)}
                    className="dashboard-header-btn dashboard-header-btn-outline w-full justify-center"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>

                  {course.status === 'Pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => reject(course.id)}
                        className="dashboard-header-btn dashboard-header-btn-outline w-full justify-center text-danger hover:border-danger/30 hover:bg-danger/5"
                      >
                        <XSquare className="h-3.5 w-3.5" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => approve(course.id)}
                        className="dashboard-header-btn dashboard-header-btn-primary w-full justify-center"
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    </>
                  ) : (
                    <span className={`admin-status-badge w-full justify-center ${STATUS_BADGE[course.status]}`}>
                      {course.status === 'Approved' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XSquare className="h-3.5 w-3.5" />
                      )}
                      {course.status}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="dashboard-card w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${selected.thumbnail}`} />
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-muted">{selected.id}</span>
                  <h3 className="mt-1 text-xl font-bold text-text">{selected.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">by {selected.mentor}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="p-1 text-muted hover:text-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-muted">{selected.description}</p>

              <div className="mb-5 grid grid-cols-2 gap-3">
                {[
                  { label: 'Category', value: selected.category },
                  { label: 'Duration', value: selected.duration },
                  { label: 'Modules', value: selected.modules },
                  { label: 'Lessons', value: selected.lessons },
                  { label: 'Preview rating', value: `${selected.previewRating} ★` },
                  { label: 'Submitted', value: selected.submitted },
                ].map((item) => (
                  <div key={item.label} className="dashboard-mini-stat">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-text">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      reject(selected.id);
                      setSelected(null);
                    }}
                    className="dashboard-header-btn dashboard-header-btn-outline flex-1 justify-center text-danger hover:border-danger/30 hover:bg-danger/5"
                  >
                    <XSquare className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      approve(selected.id);
                      setSelected(null);
                    }}
                    className="dashboard-header-btn dashboard-header-btn-primary flex-1 justify-center"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Approve &amp; publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
