import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform, useInView } from "framer-motion";
import {
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Flame,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
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
    type: "qna",
    title: "New Q&A question",
    content:
      'A student asked about Redux vs Zustand in "Advanced State Management" — Lesson 3.',
    time: "2 hours ago",
    unread: true,
    action: { label: "Reply now", to: "/mentor/notifications" },
  },
  {
    id: 2,
    type: "review",
    title: "5-star review received",
    content:
      'Sarah M. left a 5-star review on "Cloud Architecture Patterns" — "Best course ever!"',
    time: "5 hours ago",
    unread: true,
    action: { label: "View review", to: "/mentor/analytics" },
  },
  {
    id: 3,
    type: "enrollment",
    title: "New student enrolled",
    content:
      'Alex Chen enrolled in "Advanced State Management". You now have 1,249 students total.',
    time: "8 hours ago",
    unread: true,
    action: { label: "View student", to: "/mentor/students" },
  },
  {
    id: 4,
    type: "qna",
    title: "Urgent Q&A thread",
    content:
      'John Doe needs clarification on FIFO queues in "Cloud Architecture" — Lesson 3.',
    time: "35 min ago",
    unread: true,
    action: { label: "Reply now", to: "/mentor/notifications" },
  },
  {
    id: 5,
    type: "payout",
    title: "Payout processed",
    content:
      "Your monthly payout of $4,250 has been processed and will arrive in 1–2 business days.",
    time: "1 day ago",
    unread: false,
    action: { label: "View details", to: "/mentor/analytics" },
  },
  {
    id: 6,
    type: "approval",
    title: "Course approved & live",
    content:
      '"Rust for Frontend Devs" passed QA review and is now live on the marketplace.',
    time: "2 days ago",
    unread: false,
    action: { label: "View course", to: "/mentor/lessons" },
  },
  {
    id: 7,
    type: "trending",
    title: "Course is trending",
    content:
      '"Cloud Architecture Patterns" is in the top 5 today — 84 new enrollments in 24 hours.',
    time: "3 days ago",
    unread: false,
    action: { label: "See analytics", to: "/mentor/analytics" },
  },
  {
    id: 8,
    type: "upload",
    title: "Course under review",
    content:
      '"TypeScript Deep Dive" was submitted and is under QA review. Expected: 24–48 hours.',
    time: "4 days ago",
    unread: false,
    action: { label: "Track status", to: "/mentor/upload" },
  },
  {
    id: 9,
    type: "enrollment",
    title: "Cohort milestone reached",
    content:
      '"Advanced State Management" crossed 600 enrolled students — a new personal best.',
    time: "Yesterday",
    unread: true,
    action: { label: "View cohort", to: "/mentor/students" },
  },
  {
    id: 10,
    type: "review",
    title: "New 4-star review",
    content:
      'James W. rated "React Performance Patterns" 4 stars with feedback on lesson pacing.',
    time: "2 days ago",
    unread: false,
    action: { label: "Read review", to: "/mentor/analytics" },
  },
  {
    id: 11,
    type: "qna",
    title: "Q&A thread resolved",
    content:
      'Your answer on "System Design Fundamentals" was marked helpful by 12 students.',
    time: "3 days ago",
    unread: false,
    action: { label: "View thread", to: "/mentor/notifications" },
  },
  {
    id: 12,
    type: "payout",
    title: "Revenue summary ready",
    content:
      "April earnings report is ready — $4,250 gross with $3,820 net after platform fees.",
    time: "5 days ago",
    unread: false,
    action: { label: "Open report", to: "/mentor/analytics" },
  },
];

const TYPE_CONFIG = {
  qna: { icon: MessageSquare, accent: "notif-accent-primary", label: "Q&A" },
  review: { icon: Star, accent: "notif-accent-warning", label: "Review" },
  enrollment: { icon: Users, accent: "notif-accent-success", label: "Enrollment" },
  payout: { icon: DollarSign, accent: "notif-accent-success", label: "Payout" },
  approval: { icon: ShieldCheck, accent: "notif-accent-accent", label: "Approval" },
  trending: { icon: Flame, accent: "notif-accent-warning", label: "Trending" },
  upload: { icon: UploadCloud, accent: "notif-accent-primary", label: "Upload" },
};

const FILTERS = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: AlertCircle },
  { id: "qna", label: "Q&A", icon: MessageSquare },
  { id: "review", label: "Reviews", icon: Star },
  { id: "enrollment", label: "Enrollments", icon: Users },
  { id: "payout", label: "Payouts", icon: DollarSign },
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

export default function MentorNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
      label: "Q&A pending",
      value: notifications.filter((n) => n.type === "qna" && n.unread).length,
      sub: "Student questions",
      icon: MessageSquare,
      accent: "profile-kpi-success",
    },
    {
      label: "New reviews",
      value: notifications.filter((n) => n.type === "review").length,
      sub: "Course feedback",
      icon: Star,
      accent: "profile-kpi-warning",
    },
    {
      label: "Enrollments",
      value: notifications.filter((n) => n.type === "enrollment").length,
      sub: "New students",
      icon: TrendingUp,
      accent: "profile-kpi-accent",
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
            Mentor notification center
          </span>
          <p className="dashboard-greeting">
            Stay on top of your <span className="text-primary">teaching</span>
          </p>
          <p className="dashboard-greeting-sub">
            Student Q&amp;A, reviews, enrollments, payouts, and course updates in one place.
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
        <div
          className="profile-tabs-scroll notif-filters"
          role="tablist"
          aria-label="Filter mentor notifications"
        >
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
                    layoutId="mentor-notif-tab-bg"
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
              <h3 className="text-base font-bold text-text">All caught up!</h3>
              <p className="mt-1 max-w-xs text-sm text-muted">
                {filter === "unread"
                  ? "You have no unread notifications."
                  : "No notifications in this category."}
              </p>
            </motion.div>
          ) : (
            <ul className="notif-list">
              {filtered.map((note, i) => {
                const config = TYPE_CONFIG[note.type] || TYPE_CONFIG.qna;
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
                            <span className="notif-item-time">
                              <Clock3 className="h-3 w-3" />
                              {note.time}
                            </span>
                          </div>
                          <h3
                            className={`notif-item-title ${note.unread ? "notif-item-title-unread" : ""}`}
                          >
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
