import { Users, DollarSign, BookOpen, Star, ArrowUpRight, TrendingUp, MessageSquare } from 'lucide-react';

const STATS = [
  { label: 'Total Students', value: '1,248', trend: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary-soft' },
  { label: 'Monthly Revenue', value: '$4,250', trend: '+8.4%', icon: DollarSign, color: 'text-success', bg: 'bg-[color:color-mix(in_oklab,var(--success)_15%,transparent)]' },
  { label: 'Active Courses', value: '4', trend: '0%', icon: BookOpen, color: 'text-accent', bg: 'bg-[color:color-mix(in_oklab,var(--accent)_15%,transparent)]' },
  { label: 'Avg. Rating', value: '4.8', trend: '+0.1', icon: Star, color: 'text-warning', bg: 'bg-[color:color-mix(in_oklab,var(--warning)_15%,transparent)]' },
];

const RECENT_ENROLLMENTS = [
  { name: 'Alex Chen', course: 'Advanced State Management', time: '2 hours ago', amount: '$89.99' },
  { name: 'Sarah Miller', course: 'Cloud Architecture Patterns', time: '5 hours ago', amount: '$129.99' },
  { name: 'James Wilson', course: 'Cloud Architecture Patterns', time: '1 day ago', amount: '$129.99' },
];

export default function MentorDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted mt-1 font-medium">Welcome back! Here's what's happening with your courses.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-card transition-shadow flex flex-col relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-success bg-[color:color-mix(in_oklab,var(--success)_15%,transparent)] px-2 py-1 rounded">
                  <TrendingUp className="h-3 w-3" /> {stat.trend}
                </div>
              </div>
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-display font-bold text-text mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enrollments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-text">Recent Enrollments</h3>
            <button className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-muted">Student</th>
                  <th className="px-6 py-4 font-bold text-muted">Course</th>
                  <th className="px-6 py-4 font-bold text-muted">Revenue</th>
                  <th className="px-6 py-4 font-bold text-muted text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RECENT_ENROLLMENTS.map((req, i) => (
                  <tr key={i} className="hover:bg-bg/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-text">{req.name}</td>
                    <td className="px-6 py-4 font-medium text-muted">{req.course}</td>
                    <td className="px-6 py-4 font-bold text-success">{req.amount}</td>
                    <td className="px-6 py-4 text-right text-xs text-muted font-medium">{req.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unanswered Questions */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-text">Q&A Pending</h3>
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold">JD</div>
              <div>
                <p className="text-sm font-bold text-text">John Doe</p>
                <p className="text-xs text-muted font-medium mb-2">Cloud Architecture · Lesson 3</p>
                <p className="text-sm text-text bg-bg p-3 rounded-lg border border-border font-medium">"Could you clarify the difference between standard and FIFO queues here?"</p>
                <button className="mt-3 text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" /> Reply
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
