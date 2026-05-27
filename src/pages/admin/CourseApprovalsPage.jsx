import { useState } from 'react';
import {
  CheckSquare, XSquare, PlayCircle, BookOpen, Users, Clock,
  Star, MessageSquare, ChevronRight, Sparkles, AlertTriangle,
  Eye, Download, Filter, ArrowUpRight, Award, CheckCircle2,
  X, FileText, Video, BarChart2
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

const STATUS_CONFIG = {
  Pending:  { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', dot: 'bg-warning animate-pulse' },
  Approved: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', dot: 'bg-success' },
  Rejected: { color: 'text-danger',  bg: 'bg-danger/10',  border: 'border-danger/20',  dot: 'bg-danger'  },
};

export default function CourseApprovalsPage() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const approve = id => setApprovals(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  const reject  = id => setApprovals(prev => prev.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));

  const filtered = filter === 'All' ? approvals : approvals.filter(c => c.status === filter);

  const pending  = approvals.filter(c => c.status === 'Pending').length;
  const approved = approvals.filter(c => c.status === 'Approved').length;
  const rejected = approvals.filter(c => c.status === 'Rejected').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[5px] border border-warning/20 bg-warning/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-warning mb-3">
            <Sparkles className="h-3 w-3" /> QA Review Queue
          </div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">Course Approvals</h1>
          <p className="text-muted mt-1 font-medium">Review and quality-check mentor-submitted curriculum before publishing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="
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

                  bg-white
                  dark:bg-primary

                  px-6

                  text-[14px]
                  font-semibold

                  text-black
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
                ">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pending, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
          { label: 'Approved', value: approved, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
          { label: 'Rejected', value: rejected, icon: XSquare, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`bg-surface border ${kpi.border} rounded-[5px] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`}>
              <div className={`h-10 w-10 rounded-[5px] ${kpi.bg} ${kpi.color} flex items-center justify-center mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-display font-bold text-text">{kpi.value}</p>
              <p className="text-xs font-bold text-muted mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-1 bg-bg border border-border rounded-[5px] p-1 w-fit">
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-[5px] text-xs font-bold transition-all ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'}`}>
            {f} {f === 'Pending' && pending > 0 ? `(${pending})` : ''}
          </button>
        ))}
      </div>

      {/* ── APPROVAL CARDS ── */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-[5px] p-16 text-center">
          <CheckSquare className="h-14 w-14 mx-auto text-muted opacity-25 mb-4" />
          <h3 className="text-xl font-bold text-text">Inbox Zero 🎉</h3>
          <p className="text-muted mt-1.5 font-medium">No courses in this category right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(course => {
            const sc = STATUS_CONFIG[course.status];
            return (
              <div key={course.id} className="bg-surface border border-border rounded-[5px] shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-0">

                  {/* Left thumbnail strip */}
                  <div className={`bg-gradient-to-br ${course.thumbnail} w-full lg:w-2 flex-shrink-0`} />

                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row gap-5 justify-between">

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Header row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-bg border border-border text-muted text-xs font-mono px-2 py-1 rounded-[5px] font-bold">{course.id}</span>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sc.bg} ${sc.border} ${sc.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {course.status}
                          </span>
                          {course.priority === 'high' && (
                            <span className="text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-text font-display leading-tight">{course.title}</h3>
                        <p className="text-sm text-muted font-medium leading-relaxed">{course.description}</p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
                          <span className="flex items-center gap-1.5">
                            <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${course.thumbnail} flex items-center justify-center text-white text-[9px] font-bold`}>
                              {course.mentorAvatar}
                            </div>
                            <span className="font-bold text-text">{course.mentor}</span>
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <BookOpen className="h-3.5 w-3.5" /> {course.modules} modules · {course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <Clock className="h-3.5 w-3.5" /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <Star className="h-3.5 w-3.5 text-warning fill-warning" /> {course.previewRating} preview
                          </span>
                          <span className="text-xs bg-bg border border-border px-2 py-0.5 rounded-[5px] font-bold">{course.category}</span>
                          <span className="text-xs text-subtle">Submitted {course.submitted}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col gap-3 items-start lg:items-end justify-start flex-shrink-0">
                        <button
                          onClick={() => setSelected(course)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg border border-border rounded-[5px] font-bold text-sm text-muted hover:text-text hover:border-primary/40 transition-all"
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </button>

                        {course.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => reject(course.id)}
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-danger/10 text-danger border border-danger/20 rounded-[5px] font-bold text-sm hover:bg-danger hover:text-white transition-all"
                            >
                              <XSquare className="h-4 w-4" /> Reject
                            </button>
                            <button
                              onClick={() => approve(course.id)}
                              className="flex items-center gap-1.5 px-4 py-2.5 bg-success/10 text-success border border-success/20 rounded-[5px] font-bold text-sm hover:bg-success hover:text-white transition-all"
                            >
                              <CheckSquare className="h-4 w-4" /> Approve
                            </button>
                          </div>
                        )}

                        {course.status !== 'Pending' && (
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-[5px] border ${sc.bg} ${sc.border} ${sc.color}`}>
                            {course.status === 'Approved' ? <CheckCircle2 className="h-4 w-4" /> : <XSquare className="h-4 w-4" />}
                            {course.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── COURSE PREVIEW MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-surface border border-border rounded-[5px] shadow-elevated w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`h-2 w-full bg-gradient-to-r ${selected.thumbnail}`} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-muted">{selected.id}</span>
                  <h3 className="text-xl font-bold text-text mt-1">{selected.title}</h3>
                  <p className="text-sm text-muted mt-1">by {selected.mentor}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted hover:text-text p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted font-medium leading-relaxed mb-5">{selected.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Category', value: selected.category },
                  { label: 'Duration', value: selected.duration },
                  { label: 'Modules', value: selected.modules },
                  { label: 'Lessons', value: selected.lessons },
                  { label: 'Preview Rating', value: `${selected.previewRating} ⭐` },
                  { label: 'Submitted', value: selected.submitted },
                ].map(item => (
                  <div key={item.label} className="bg-bg border border-border rounded-[5px] p-3">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                    <p className="font-bold text-text mt-1 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.status === 'Pending' && (
                <div className="flex gap-3">
                  <button onClick={() => { reject(selected.id); setSelected(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-danger/10 text-danger border border-danger/20 rounded-[5px] text-sm font-bold hover:bg-danger hover:text-white transition-all">
                    <XSquare className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => { approve(selected.id); setSelected(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-success text-white rounded-[5px] text-sm font-bold hover:opacity-90 transition-all">
                    <CheckSquare className="h-4 w-4" /> Approve & Publish
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
