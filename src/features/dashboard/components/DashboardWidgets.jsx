import { motion } from 'framer-motion';

export function WidgetCard({ children, className = '', title, action }) {
  return (
    <div className={`rounded-2xl border border-border bg-surface shadow-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
          <h3 className="font-semibold text-text">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function StatsCard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-card"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{title}</p>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h4 className="text-3xl font-bold text-text font-display tracking-tight">{value}</h4>
        {trend && (
          <span className={`text-xs font-bold ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function ActivityTimeline({ activities }) {
  return (
    <div className="space-y-6">
      {activities.map((activity, idx) => (
        <div key={idx} className="relative flex gap-4 group">
          <div className="absolute left-[11px] top-7 h-full w-px bg-border group-last:hidden" />
          <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface border border-border transition-colors group-hover:border-primary/50">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text">{activity.title}</p>
            <p className="mt-1 text-xs font-medium text-muted">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
