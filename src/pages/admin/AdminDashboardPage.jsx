import { Users, Activity, DollarSign, ShieldAlert, CheckSquare, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total MRR', value: '$124.5k', trend: '+15.2%', icon: DollarSign, color: 'text-success' },
    { label: 'Active Learners', value: '12,482', trend: '+5.4%', icon: Users, color: 'text-primary' },
    { label: 'System Health', value: '99.9%', trend: 'Stable', icon: Activity, color: 'text-text' },
    { label: 'Pending Approvals', value: '14', trend: '-2', icon: CheckSquare, color: 'text-warning' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Platform Overview</h1>
        <p className="text-muted mt-1 font-medium">Global metrics and system health for Cloud Nexus.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-bg border border-border flex items-center justify-center text-muted">
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded bg-bg ${stat.color}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-display font-bold text-text mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts & Action Items */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="font-bold text-xl text-text mb-6">Action Items</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-warning/30 bg-[color:color-mix(in_oklab,var(--warning)_10%,transparent)]">
              <div className="mt-0.5 text-warning"><AlertTriangle className="h-5 w-5" /></div>
              <div>
                <p className="font-bold text-text text-sm">High Server Load Detected</p>
                <p className="text-xs text-muted font-medium mt-1">Database CPU utilization hit 85% in us-east-1. Auto-scaling initiated.</p>
              </div>
              <button className="ml-auto text-xs font-bold text-warning hover:text-text transition-colors">Acknowledge</button>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-bg hover:border-primary/30 transition-colors">
              <div className="mt-0.5 text-primary"><CheckSquare className="h-5 w-5" /></div>
              <div>
                <p className="font-bold text-text text-sm">14 Courses Awaiting Review</p>
                <p className="text-xs text-muted font-medium mt-1">Mentor submissions need QA approval before publishing.</p>
              </div>
              <button className="ml-auto text-xs font-bold bg-surface border border-border px-3 py-1.5 rounded-md hover:bg-bg transition-colors">Review Now</button>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-bg hover:border-primary/30 transition-colors">
              <div className="mt-0.5 text-success"><DollarSign className="h-5 w-5" /></div>
              <div>
                <p className="font-bold text-text text-sm">Monthly Mentor Payouts Pending</p>
                <p className="text-xs text-muted font-medium mt-1">$42,500 across 18 mentors needs authorization.</p>
              </div>
              <button className="ml-auto text-xs font-bold bg-surface border border-border px-3 py-1.5 rounded-md hover:bg-bg transition-colors">Authorize</button>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="font-bold text-xl text-text mb-6">System Logs</h3>
          <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
            {[
              { msg: 'Deployment successful (v1.2.4)', time: '10m ago', type: 'success' },
              { msg: 'Failed login attempt spike detected', time: '1h ago', type: 'warning' },
              { msg: 'Database backup completed', time: '4h ago', type: 'info' },
              { msg: 'New mentor application received', time: '5h ago', type: 'info' },
              { msg: 'Payment gateway sync complete', time: '12h ago', type: 'success' },
            ].map((log, i) => (
              <div key={i} className="relative pl-8">
                <span className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-surface ${
                  log.type === 'success' ? 'bg-success' : log.type === 'warning' ? 'bg-warning' : 'bg-primary'
                }`} />
                <p className="text-sm font-bold text-text">{log.msg}</p>
                <p className="text-xs font-medium text-muted">{log.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
