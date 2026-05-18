import { CheckSquare, XSquare, ExternalLink, PlayCircle } from 'lucide-react';

const APPROVALS = [
  { id: 'C-8291', title: 'Advanced Next.js 15 Patterns', mentor: 'Sarah Miller', submitted: '2 hours ago', modules: 12, duration: '4h 15m' },
  { id: 'C-8292', title: 'Go Microservices Architecture', mentor: 'David Kim', submitted: '1 day ago', modules: 8, duration: '6h 30m' },
];

export default function CourseApprovalsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Course Approvals</h1>
        <p className="text-muted mt-1 font-medium">Review and QA mentor-submitted curriculum before publishing.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {APPROVALS.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <CheckSquare className="h-12 w-12 mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text">Inbox Zero</h3>
            <p className="text-muted mt-1 font-medium">No courses are currently awaiting QA approval.</p>
          </div>
        ) : (
          APPROVALS.map((course) => (
            <div key={course.id} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 justify-between md:items-center hover:border-primary/30 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-bg border border-border text-muted text-xs font-mono px-2 py-1 rounded font-bold">
                    {course.id}
                  </span>
                  <span className="text-xs font-bold text-warning flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-warning rounded-full animate-pulse" /> Pending QA Review
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text font-display">{course.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
                  <span>Mentor: <span className="text-text font-bold">{course.mentor}</span></span>
                  <span>•</span>
                  <span>{course.modules} Modules</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>Submitted {course.submitted}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-bg border border-border rounded-xl font-bold text-sm text-text hover:border-primary hover:text-primary transition-colors shadow-sm">
                  <PlayCircle className="h-4 w-4" /> Preview
                </button>
                <div className="flex gap-2 flex-1 md:flex-none">
                  <button className="flex-1 md:flex-none flex items-center justify-center h-10 w-12 bg-danger/10 text-danger border border-danger/20 rounded-xl hover:bg-danger hover:text-white transition-colors">
                    <XSquare className="h-5 w-5" />
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center h-10 w-12 bg-success/10 text-success border border-success/20 rounded-xl hover:bg-success hover:text-white transition-colors">
                    <CheckSquare className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
