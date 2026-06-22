import { useState, useMemo } from 'react';
import {
  Bell, Check, Activity, UserPlus, Server,
  CheckCheck, Trash2, ChevronRight, Sparkles, AlertTriangle,
  DollarSign, BookOpen, Shield, Zap, RefreshCw,
  Clock
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1, type: 'alert',
    icon: AlertTriangle,
    title: 'High Server Load Detected',
    content: 'Database CPU utilization hit 85% in us-east-1. Auto-scaling has been initiated. Monitor closely.',
    time: '10 mins ago', unread: true, priority: 'critical',
    actionLabel: 'View Metrics',
  },
  {
    id: 2, type: 'approval',
    icon: BookOpen,
    title: '14 Courses Awaiting QA Review',
    content: 'Mentor submissions from Sarah Chen, Liam Carter (+12 others) need quality assurance approval before publishing.',
    time: '1 hour ago', unread: true, priority: 'high',
    actionLabel: 'Review Now',
  },
  {
    id: 3, type: 'user',
    icon: UserPlus,
    title: 'New Mentor Application',
    content: 'David Kim applied to become a mentor in the Backend Engineering & Systems Design track. Portfolio attached.',
    time: '3 hours ago', unread: true, priority: 'normal',
    actionLabel: 'View Application',
  },
  {
    id: 4, type: 'payout',
    icon: DollarSign,
    title: 'Monthly Payouts Pending Authorization',
    content: '$42,500 in mentor payouts across 18 mentors is awaiting your authorization for this billing cycle.',
    time: '5 hours ago', unread: false, priority: 'high',
    actionLabel: 'Authorize',
  },
  {
    id: 5, type: 'system',
    icon: Server,
    title: 'Automated Database Backup Complete',
    content: 'Daily snapshot of production databases completed successfully. 12.4 GB compressed and stored to S3.',
    time: '12 hours ago', unread: false, priority: 'normal',
    actionLabel: null,
  },
  {
    id: 6, type: 'security',
    icon: Shield,
    title: 'Unusual Login Activity Detected',
    content: '142 failed login attempts detected from 3 different IPs over the last 2 hours. Auto-block has been triggered.',
    time: '1 day ago', unread: false, priority: 'critical',
    actionLabel: 'View Logs',
  },
  {
    id: 7, type: 'deployment',
    icon: Zap,
    title: 'Platform Deployment Successful',
    content: 'Cloud Nexus v1.2.4 has been deployed to production. Zero downtime rollout completed across all regions.',
    time: '2 days ago', unread: false, priority: 'normal',
    actionLabel: null,
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'alert', label: 'Alerts' },
  { key: 'approval', label: 'Approvals' },
  { key: 'user', label: 'Users' },
  { key: 'payout', label: 'Payouts' },
  { key: 'security', label: 'Security' },
  { key: 'system', label: 'System' },
];

const TYPE_CONFIG = {
  alert:      { iconColor: 'text-warning',  bg: 'bg-warning/10',  border: 'border-warning/20',  unreadBg: 'bg-warning/5',  actionColor: 'text-warning hover:text-text'  },
  approval:   { iconColor: 'text-primary',  bg: 'bg-primary/10',  border: 'border-primary/20',  unreadBg: 'bg-primary/5',  actionColor: 'text-primary hover:text-primary-hover' },
  user:       { iconColor: 'text-success',  bg: 'bg-success/10',  border: 'border-success/20',  unreadBg: 'bg-success/5',  actionColor: 'text-success hover:text-text'  },
  payout:     { iconColor: 'text-success',  bg: 'bg-success/10',  border: 'border-success/20',  unreadBg: 'bg-success/5',  actionColor: 'text-success hover:text-text'  },
  security:   { iconColor: 'text-danger',   bg: 'bg-danger/10',   border: 'border-danger/20',   unreadBg: 'bg-danger/5',   actionColor: 'text-danger hover:text-text'   },
  system:     { iconColor: 'text-muted',    bg: 'bg-border',      border: 'border-border',      unreadBg: 'bg-bg',         actionColor: 'text-muted hover:text-text'    },
  deployment: { iconColor: 'text-accent',   bg: 'bg-accent/10',   border: 'border-accent/20',   unreadBg: 'bg-accent/5',   actionColor: 'text-accent hover:text-text'   },
};

const PRIORITY_CONFIG = {
  critical: 'bg-danger/10 text-danger border-danger/20',
  high:     'bg-warning/10 text-warning border-warning/20',
  normal:   'bg-border text-muted',
};

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markOneRead = id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const dismiss = id => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearRead = () => setNotifications(prev => prev.filter(n => n.unread));

  const filtered = useMemo(() =>
    filter === 'all' ? notifications : notifications.filter(n => n.type === filter),
    [filter, notifications]
  );

  const unreadCount = notifications.filter(n => n.unread).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

  const STATS = [
    { title: 'Unread', value: unreadCount, icon: Bell, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
    { title: 'Pending Actions', value: notifications.filter(n => n.actionLabel).length, icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'System Logs', value: notifications.filter(n => n.type === 'system' || n.type === 'deployment').length, icon: Server, color: 'text-muted', bg: 'bg-border' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto -ml-2 -mt-2">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-[5px] px-6 py-7 shadow-sm">
        <div className="absolute right-[-80px] top-[-80px] h-[220px] w-[220px] rounded-lg bg-primary/8 blur-[80px]" />
        <div className="absolute bottom-[-60px] left-[-60px] h-[180px] w-[180px] rounded-lg bg-accent/6 blur-[70px]" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-[5px] border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
              <Sparkles className="h-3 w-3" /> Admin Notification Center
            </div>
            <h1 className="text-3xl font-bold text-text font-display tracking-tight">System Alerts</h1>
            <p className="text-muted mt-1.5 font-medium max-w-lg">
              Critical platform alerts, approval queues, security events, and system logs — all in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={markAllRead}
              className="
                  relative
                  inline-flex
                  h-[48px]
                  w-full
                  sm:w-auto
                  min-w-[80px]
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
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </button>
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
                  dark:bg-white

                  px-6
                  text-[14px]
                  font-semibold

                  text-black
                  dark:text-black

                  overflow-hidden
                  rounded-lg

                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40
                  dark:hover:border-primary/60
                ">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-surface border border-border rounded-[5px] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-[5px] ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-text">{stat.value}</p>
              <p className="text-xs font-bold text-muted mt-0.5">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* ── MAIN CARD ── */}
      <div className="bg-surface border border-border rounded-[5px] shadow-sm overflow-hidden">

        {/* Filter Tabs */}
        <div className="flex items-center gap-0 overflow-x-auto hide-scrollbar border-b border-border bg-bg/40">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`relative shrink-0 px-5 py-4 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === tab.key ? 'text-primary' : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
              {filter === tab.key && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-lg bg-primary" />
              )}
              {tab.key !== 'all' && notifications.some(n => n.type === tab.key && n.unread) && (
                <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-lg bg-primary" />
              )}
            </button>
          ))}
          <div className="ml-auto shrink-0 px-5">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-[5px] bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted opacity-20 mb-4" />
              <p className="font-bold text-text">No notifications here</p>
              <p className="text-sm text-muted mt-1">Platform is operating normally.</p>
            </div>
          ) : (
            filtered.map(note => {
              const Icon = note.icon;
              const cfg = TYPE_CONFIG[note.type] ?? TYPE_CONFIG.system;
              return (
                <div
                  key={note.id}
                  className={`group relative px-6 py-5 transition-all duration-300 hover:bg-bg/40 ${note.unread ? cfg.unreadBg : ''}`}
                >
                  {/* Left unread bar */}
                  {note.unread && (
                    <div className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-[5px]" />
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border ${cfg.bg} ${cfg.border} ${cfg.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                      {note.unread && (
                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-lg bg-primary ring-2 ring-surface" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className={`text-sm font-bold leading-tight ${note.unread ? 'text-text' : 'text-muted'}`}>
                              {note.title}
                            </h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${PRIORITY_CONFIG[note.priority]}`}>
                              {note.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted font-medium leading-relaxed">{note.content}</p>
                        </div>

                        {/* Time + delete */}
                        <div className="flex shrink-0 items-center gap-3 sm:ml-4">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-muted whitespace-nowrap">
                            <Clock className="h-3 w-3" /> {note.time}
                          </span>
                          <button
                            onClick={() => dismiss(note.id)}
                            className="text-muted hover:text-danger transition-all hover:scale-110"
                            title="Dismiss"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Action row */}
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        {note.actionLabel && (
                          <button className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5 ${cfg.actionColor}`}>
                            {note.actionLabel}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {note.unread && (
                          <button
                            onClick={() => markOneRead(note.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-text transition-all"
                          >
                            <Check className="h-3.5 w-3.5" /> Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3 bg-bg/30">
            <p className="text-xs font-bold text-muted">
              Showing {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={clearRead}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-danger transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
