import { BarChart as BarChartIcon, Download, Calendar, Filter, PieChart, TrendingUp } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">Platform Reports</h1>
          <p className="text-muted mt-1 font-medium">Detailed insights into platform growth and user engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-text hover:bg-bg transition-colors shadow-sm">
            <Calendar className="h-4 w-4" /> This Year
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-sm hover:bg-primary-hover transition-colors">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Growth Chart */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-text">User Growth</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Students</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Mentors</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 pt-4 border-b border-border relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
            </div>
            
            {[
              { month: 'Q1', s: 40, m: 20 },
              { month: 'Q2', s: 60, m: 35 },
              { month: 'Q3', s: 80, m: 50 },
              { month: 'Q4', s: 100, m: 70 },
            ].map((d, i) => (
              <div key={i} className="relative flex-1 flex justify-center items-end h-full gap-1 sm:gap-2">
                <div className="w-4 sm:w-8 bg-primary rounded-t-sm" style={{ height: `${d.s}%` }} />
                <div className="w-4 sm:w-8 bg-success rounded-t-sm" style={{ height: `${d.m}%` }} />
                <span className="absolute -bottom-6 text-xs font-bold text-muted w-full text-center">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Content Categories */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-text">Top Categories</h3>
            <PieChart className="h-5 w-5 text-muted" />
          </div>
          
          <div className="space-y-6">
            {[
              { name: 'Cloud Computing & DevOps', share: 45, color: 'bg-primary' },
              { name: 'Frontend Engineering', share: 30, color: 'bg-success' },
              { name: 'Backend & Systems', share: 15, color: 'bg-warning' },
              { name: 'Data & AI', share: 10, color: 'bg-accent' },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-text">{cat.name}</span>
                  <span className="font-bold text-muted">{cat.share}%</span>
                </div>
                <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
