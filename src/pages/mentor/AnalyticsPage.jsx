import { BarChart as BarChartIcon, TrendingUp, Users, Activity, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Performance Analytics</h1>
        <p className="text-muted mt-1 font-medium">Deep dive into your course metrics and learner engagement.</p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Course Views', value: '14.2k', trend: '+24%', icon: Eye },
          { label: 'Conversion Rate', value: '8.4%', trend: '+1.2%', icon: Activity },
          { label: 'Completion Rate', value: '42%', trend: '-2%', icon: TrendingUp },
          { label: 'Active Students', value: '842', trend: '+15%', icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-bg border border-border flex items-center justify-center text-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider">{stat.label}</h3>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-display font-bold text-text">{stat.value}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${stat.trend.startsWith('+') ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart (CSS only bar chart) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-text">Enrollments Overview</h3>
              <p className="text-sm text-muted font-medium mt-1">Last 6 months of course signups</p>
            </div>
            <select className="bg-bg border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-text outline-none focus:border-primary">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-4 border-b border-border relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="w-full h-px bg-muted" />
            </div>
            
            {/* Bars */}
            {[
              { month: 'Jan', val: 40 },
              { month: 'Feb', val: 65 },
              { month: 'Mar', val: 45 },
              { month: 'Apr', val: 80 },
              { month: 'May', val: 100 },
              { month: 'Jun', val: 85 },
            ].map((d, i) => (
              <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full group">
                <div 
                  className="w-full sm:w-12 bg-primary rounded-t-lg transition-all duration-500 ease-out group-hover:bg-primary-hover relative"
                  style={{ height: `${d.val}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-bg text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {d.val * 12}
                  </div>
                </div>
                <span className="absolute -bottom-6 text-xs font-bold text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-bold text-xl text-text mb-6">Top Performing</h3>
          <div className="space-y-5">
            {[
              { name: 'Advanced State Mgmt', rev: '$8.4k', share: 65 },
              { name: 'Cloud Arch Patterns', rev: '$4.0k', share: 35 },
            ].map((course, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-text truncate max-w-[150px]">{course.name}</span>
                  <span className="font-bold text-success">{course.rev}</span>
                </div>
                <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${course.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
