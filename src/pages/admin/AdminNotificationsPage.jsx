import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform, useInView } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellOff,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Server,
  Shield,
  Sparkles,
  Trash2,
  UserPlus,
  Zap,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const NOTIFICATIONS = [
  {
    id: 1,
    type: "alert",
    priority: "critical",
    title: "High server load detected",
    content:
      "Database CPU utilization hit 85% in us-east-1. Auto-scaling has been initiated — monitor closely.",
    time: "10 min ago",
    unread: true,
    action: { label: "View metrics", to: "/admin/reports" },
  },
  {
    id: 2,
    type: "approval",
    priority: "high",
    title: "14 courses awaiting QA review",
    content:
      "Mentor submissions from Sarah Chen, Liam Carter (+12 others) need quality assurance before publishing.",
    time: "1 hour ago",
    unread: true,
    action: { label: "Review now", to: "/admin/approvals" },
  },
  {
    id: 3,
    type: "user",
    priority: "normal",
    title: "New mentor application",
    content:
      "David Kim applied to mentor Backend Engineering & Systems Design. Portfolio and credentials attached.",
    time: "3 hours ago",
    unread: true,
    action: { label: "View application", to: "/admin/users" },
  },
  {
    id: 4,
    type: "payout",
    priority: "high",
    title: "Monthly payouts pending authorization",
    content: "$42,500 in mentor payouts across 18 mentors awaits your authorization for this billing cycle.",
    time: "5 hours ago",
    unread: false,
    action: { label: "Authorize payouts", to: "/admin/revenue" },
  },
  {
    id: 5,
    type: "security",
    priority: "critical",
    title: "Unusual login activity detected",
    content:
      "142 failed login attempts from 3 IPs in the last 2 hours. Auto-block triggered on suspicious ranges.",
    time: "1 day ago",
    unread: false,
    action: { label: "View security logs", to: "/admin/settings" },
  },
  {
    id: 6,
    type: "system",
    priority: "normal",
    title: "Automated database backup complete",
    content: "Daily snapshot of production databases completed. 12.4 GB compressed and stored to S3.",
    time: "12 hours ago",
    unread: false,
    action: { label: "View backup log", to: "/admin/reports" },
  },
  {
    id: 7,
    type: "deployment",
    priority: "normal",
    title: "Platform deployment successful",
    content: "Cloud Nexus v1.2.4 deployed to production. Zero-downtime rollout completed across all regions.",
    time: "2 days ago",
    unread: false,
    action: null,
  },
  {
    id: 8,
    type: "approval",
    priority: "high",
    title: "3 course content flags resolved",
    content: "Moderation team flagged copyright issues in 3 lessons. Mentor revisions are ready for re-review.",
    time: "Yesterday",
    unread: true,
    action: { label: "Open approvals", to: "/admin/approvals" },
  },
  {
    id: 9,
    type: "user",
    priority: "normal",
    title: "Bulk student import completed",
    content: "Enterprise cohort import finished — 248 students provisioned with default track assignments.",
    time: "2 days ago",
    unread: false,
    action: { label: "View users", to: "/admin/users" },
  },
  {
    id: 10,
    type: "alert",
    priority: "high",
    title: "Payment gateway latency spike",
    content: "Stripe webhook delays averaged 4.2s during peak enrollment. No failed transactions reported.",
    time: "3 days ago",
    unread: false,
    action: { label: "View financials", to: "/admin/revenue" },
  },
  {
    id: 11,
    type: "security",
    priority: "normal",
    title: "Admin API key rotation reminder",
    content: "Production API keys expire in 14 days. Schedule rotation to avoid service interruption.",
    time: "4 days ago",
    unread: false,
    action: { label: "Manage keys", to: "/admin/settings" },
  },
  {
    id: 12,
    type: "system",
    priority: "normal",
    title: "Weekly platform summary ready",
    content: "DAU up 6.4%, course completions up 11%, and mentor satisfaction at 4.7/5 this week.",
    time: "1 week ago",
    unread: false,
    action: { label: "View reports", to: "/admin/reports" },
  },
];

const TYPE_CONFIG = {
  alert: { icon: AlertTriangle, accent: "notif-accent-warning", label: "Alert" },
  approval: { icon: BookOpen, accent: "notif-accent-primary", label: "Approval" },
  user: { icon: UserPlus, accent: "notif-accent-success", label: "Users" },
  payout: { icon: DollarSign, accent: "notif-accent-success", label: "Payout" },
  security: { icon: Shield, accent: "notif-accent-accent", label: "Security" },
  system: { icon: Server, accent: "notif-accent-accent", label: "System" },
  deployment: { icon: Zap, accent: "notif-accent-primary", label: "Deploy" },
};

const PRIORITY_STYLES = {
  critical: "notif-priority-critical",
  high: "notif-priority-high",
  normal: "notif-priority-normal",
};

const FILTERS = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: AlertCircle },
  { id: "alert", label: "Alerts", icon: AlertTriangle },
  { id: "approval", label: "Approvals", icon: BookOpen },
  { id: "user", label: "Users", icon: UserPlus },
  { id: "security", label: "Security", icon: Shield },
];

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => String(Math.round(v)));

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  return (
    <motion.span ref={ref} className="notif-stat-value">
      {display}
    </motion.span>
  );
}

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const criticalCount = notifications.filter((n) => n.priority === "critical").length;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.unread;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const stats = [
    {
      label: "Unread",
      value: unreadCount,
      sub: "Need attention",
      icon: Bell,
      accent: "profile-kpi-primary",
    },
    {
      label: "Critical",
      value: criticalCount,
      sub: "High priority",
      icon: AlertTriangle,
      accent: "profile-kpi-warning",
    },
    {
      label: "Approvals",
      value: notifications.filter((n) => n.type === "approval").length,
      sub: "Pending review",
      icon: BookOpen,
      accent: "profile-kpi-accent",
    },
    {
      label: "Security",
      value: notifications.filter((n) => n.type === "security").length,
      sub: "Events logged",
      icon: Shield,
      accent: "profile-kpi-success",
    },
  ];

  return (
    <motion.div
      className="dashboard-page notif-page mx-auto w-full max-w-[1320px] space-y-3 sm:space-y-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.section className="notif-header dashboard-analytics-bar" variants={item}>
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Admin notification center
          </span>
          <p className="dashboard-greeting">
            Monitor your <span className="text-primary">platform</span>
          </p>
          <p className="dashboard-greeting-sub">
            Alerts, approvals, security events, payouts, and system logs in one place.
          </p>
        </div>

        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <motion.span
              className="notif-unread-pill"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={unreadCount}
            >
              <span className="notif-unread-dot" />
              {unreadCount} unread
            </motion.span>
          )}
          <motion.button
            type="button"
            className="profile-btn profile-btn-primary"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            whileHover={{ y: unreadCount > 0 ? -2 : 0 }}
            whileTap={{ scale: unreadCount > 0 ? 0.97 : 1 }}
          >
            <Check className="h-4 w-4" />
            Mark all read
          </motion.button>
        </div>
      </motion.section>

      <motion.section className="profile-stats-wrap" variants={item}>
        <div className="profile-stats-scroll profile-stats-6 notif-stats-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`profile-stat-card ${stat.accent}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <div className={`profile-stat-icon ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <AnimatedNumber value={stat.value} />
                  <p className="profile-stat-label">{stat.label}</p>
                  <p className="profile-stat-sub">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.div className="profile-tabs-shell dashboard-card" variants={item}>
        <div className="profile-tabs-scroll notif-filters" role="tablist" aria-label="Filter admin notifications">
          {FILTERS.map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.id;
            const count =
              tab.id === "all"
                ? notifications.length
                : tab.id === "unread"
                  ? unreadCount
                  : notifications.filter((n) => n.type === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(tab.id)}
                className={`profile-tab relative ${isActive ? "profile-tab-active" : ""}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-notif-tab-bg"
                    className="profile-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative z-[1] h-4 w-4" />
                <span className="relative z-[1]">{tab.label}</span>
                <span className="notif-filter-count relative z-[1]">{count}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.section className="notif-list-stack" variants={item}>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="notif-empty dashboard-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="notif-empty-icon">
                <BellOff className="h-8 w-8 text-muted" />
              </div>
              <h3 className="text-base font-bold text-text">All clear</h3>
              <p className="mt-1 max-w-xs text-sm text-muted">
                {filter === "unread"
                  ? "No unread admin notifications."
                  : "No notifications in this category."}
              </p>
            </motion.div>
          ) : (
            <ul className="notif-list">
              {filtered.map((note, i) => {
                const config = TYPE_CONFIG[note.type] || TYPE_CONFIG.system;
                const Icon = config.icon;

                return (
                  <motion.li
                    key={note.id}
                    layout
                    className={`notif-card dashboard-card ${note.unread ? "notif-item-unread" : ""}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ delay: i * 0.04, duration: 0.38, ease: EASE }}
                    whileHover={{ y: -3 }}
                  >
                    <div className={`notif-item-icon ${config.accent}`}>
                      <Icon className="h-5 w-5" />
                      {note.unread && <span className="notif-item-dot" aria-label="Unread" />}
                    </div>

                    <div className="notif-item-body min-w-0 flex-1">
                      <div className="notif-item-top">
                        <div className="min-w-0 flex-1">
                          <div className="notif-item-meta">
                            <span className={`notif-type-chip ${config.accent}`}>{config.label}</span>
                            <span className={`notif-priority-chip ${PRIORITY_STYLES[note.priority]}`}>
                              {note.priority}
                            </span>
                            <span className="notif-item-time">
                              <Clock3 className="h-3 w-3" />
                              {note.time}
                            </span>
                          </div>
                          <h3 className={`notif-item-title ${note.unread ? "notif-item-title-unread" : ""}`}>
                            {note.title}
                          </h3>
                          <p className="notif-item-content">{note.content}</p>
                        </div>

                        <div className="notif-item-actions">
                          {note.unread && (
                            <motion.button
                              type="button"
                              className="notif-action-btn"
                              aria-label="Mark as read"
                              onClick={() => markRead(note.id)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </motion.button>
                          )}
                          <motion.button
                            type="button"
                            className="notif-action-btn notif-action-btn-danger"
                            aria-label="Delete notification"
                            onClick={() => removeNotification(note.id)}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>

                      {note.action && (
                        <Link to={note.action.to} className="notif-item-cta group">
                          {note.action.label}
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
}
