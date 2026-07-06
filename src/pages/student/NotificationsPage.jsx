import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useTransform, useInView } from "framer-motion";
import {
  AlertCircle,
  Award,
  Bell,
  BellOff,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { getContinueLearningUrl } from "@/features/learn/learningSession";
import useAuthStore from "@/store/useAuthStore";
import {
  deleteNotification as deleteNotificationApi,
  emitNotificationsChanged,
  fetchMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notificationApi";

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
    type: "mentorship",
    title: "New reply from your mentor",
    content: 'Jane Doe replied to your question in "React State Architecture".',
    time: "2 hours ago",
    unread: true,
    action: { label: "Reply to mentor", to: "/student/courses" },
  },
  {
    id: 2,
    type: "achievement",
    title: "Certificate unlocked!",
    content: "You completed Cloud Architecture Patterns. Your certificate is ready to download.",
    time: "1 day ago",
    unread: true,
    action: { label: "View certificate", to: "/student/certificates" },
  },
  {
    id: 3,
    type: "course",
    title: "Course content updated",
    content: '3 new lessons added to "Enterprise React Systems" — hooks, context, and performance.',
    time: "2 days ago",
    unread: true,
    action: { label: "Continue course", resolveTo: getContinueLearningUrl },
  },
  {
    id: 4,
    type: "assignment",
    title: "Assignment due tomorrow",
    content: "Submit your Cloud Architecture diagram before 11:59 PM PT.",
    time: "3 days ago",
    unread: false,
    action: { label: "Open assignment", to: "/student/assignments" },
  },
  {
    id: 5,
    type: "live",
    title: "Live class starting soon",
    content: "React Masterclass begins in 30 minutes. Join the session from your dashboard.",
    time: "4 days ago",
    unread: false,
    action: { label: "Join live class", to: "/student/notifications" },
  },
  {
    id: 6,
    type: "quiz",
    title: "Quiz results available",
    content: "You scored 92% on the Cloud Architecture Quiz. Review your answers and feedback.",
    time: "5 days ago",
    unread: false,
    action: { label: "View results", to: "/student/assignments" },
  },
  {
    id: 7,
    type: "system",
    title: "Weekly learning summary",
    content: "You studied 7 hours this week — 70% of your goal. Keep the streak going!",
    time: "1 week ago",
    unread: false,
    action: { label: "View progress", to: "/student/courses" },
  },
  {
    id: 8,
    type: "mentorship",
    title: "Mentor feedback on your project",
    content: 'Dr. Arjan Singh left detailed feedback on your "AWS VPC Design" submission. Great work on subnet planning!',
    time: "35 min ago",
    unread: true,
    action: { label: "Read feedback", to: "/student/courses" },
  },
  {
    id: 9,
    type: "course",
    title: "New module unlocked",
    content: 'You unlocked Module 4 in "Azure Generative AI" — explore prompt engineering and RAG pipelines.',
    time: "5 hours ago",
    unread: true,
    action: { label: "Start module", to: "/learn/ai" },
  },
  {
    id: 10,
    type: "achievement",
    title: "7-day learning streak!",
    content: "You've studied every day this week. Earn the Consistency Champion badge at 14 days.",
    time: "Yesterday",
    unread: true,
    action: { label: "View badges", to: "/student/profile" },
  },
  {
    id: 11,
    type: "live",
    title: "Recording available",
    content: 'Missed "Docker & Kubernetes Workshop"? The full recording is now in your course library.',
    time: "2 days ago",
    unread: false,
    action: { label: "Watch recording", to: "/learn/devops" },
  },
  {
    id: 12,
    type: "assignment",
    title: "Assignment graded",
    content: 'Your "React Component Library" assignment received an A (96%). Review mentor comments.',
    time: "3 days ago",
    unread: false,
    action: { label: "View grade", to: "/learn/fullstack" },
  },
  {
    id: 13,
    type: "quiz",
    title: "New practice quiz",
    content: 'A new self-paced quiz is available for "Python for Data Engineering" — 15 questions, no time limit.',
    time: "4 days ago",
    unread: false,
    action: { label: "Take quiz", to: "/student/assignments" },
  },
  {
    id: 14,
    type: "system",
    title: "Profile 85% complete",
    content: "Add a bio and portfolio link to unlock personalized course recommendations.",
    time: "5 days ago",
    unread: false,
    action: { label: "Complete profile", to: "/student/settings" },
  },
  {
    id: 15,
    type: "mentorship",
    title: "1-on-1 session confirmed",
    content: "Your mentor session with Sarah Jenkins is scheduled for Friday, 3:00 PM IST. Calendar invite sent.",
    time: "6 days ago",
    unread: false,
    action: { label: "View details", to: "/student/notifications" },
  },
  {
    id: 16,
    type: "course",
    title: "Wishlist course on sale",
    content: '"Full-Stack Development Bootcamp" is 30% off for 48 hours. Enroll before the offer ends.',
    time: "1 week ago",
    unread: false,
    action: { label: "View offer", to: "/student/wishlist" },
  },
];

const TYPE_CONFIG = {
  mentorship: { icon: MessageSquare, accent: "notif-accent-primary", label: "Mentor" },
  achievement: { icon: Award, accent: "notif-accent-warning", label: "Achievement" },
  course: { icon: BookOpen, accent: "notif-accent-success", label: "Course" },
  assignment: { icon: GraduationCap, accent: "notif-accent-accent", label: "Assignment" },
  live: { icon: Video, accent: "notif-accent-primary", label: "Live" },
  quiz: { icon: Star, accent: "notif-accent-success", label: "Quiz" },
  system: { icon: Sparkles, accent: "notif-accent-accent", label: "Insight" },
};

const FILTERS = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: AlertCircle },
  { id: "mentorship", label: "Mentors", icon: MessageSquare },
  { id: "achievement", label: "Achievements", icon: Award },
  { id: "course", label: "Courses", icon: BookOpen },
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

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id || !token) return;
    fetchMyNotifications(user, token)
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user?.id, token]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.unread;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (user?.id && token) {
      markAllNotificationsRead(user, token)
        .then(() => emitNotificationsChanged())
        .catch(() => {});
    }
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    if (user?.id && token) {
      markNotificationRead(user, token, id)
        .then(() => emitNotificationsChanged())
        .catch(() => {});
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (user?.id && token) {
      deleteNotificationApi(user, token, id)
        .then(() => emitNotificationsChanged())
        .catch(() => {});
    }
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
      label: "Mentor msgs",
      value: notifications.filter((n) => n.type === "mentorship").length,
      sub: "Conversations",
      icon: MessageSquare,
      accent: "profile-kpi-success",
    },
    {
      label: "Achievements",
      value: notifications.filter((n) => n.type === "achievement").length,
      sub: "Certs & badges",
      icon: Award,
      accent: "profile-kpi-warning",
    },
    {
      label: "Course updates",
      value: notifications.filter((n) => ["course", "assignment", "live"].includes(n.type)).length,
      sub: "Learning activity",
      icon: BookOpen,
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
      {/* Header */}
      <motion.section className="notif-header dashboard-analytics-bar" variants={item}>
        <div className="dashboard-analytics-intro">
          <span className="dashboard-pill">
            <Sparkles className="h-3 w-3" />
            Notification center
          </span>
          <p className="dashboard-greeting">
            Stay on top of your <span className="text-primary">learning</span>
          </p>
          <p className="dashboard-greeting-sub">
            Mentors, certificates, course updates, and live sessions in one place.
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

      {/* Stats */}
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

      {/* Filters */}
      <motion.div className="profile-tabs-shell dashboard-card" variants={item}>
        <div className="profile-tabs-scroll notif-filters" role="tablist" aria-label="Filter notifications">
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
                    layoutId="notif-tab-bg"
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

      {/* List */}
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
                    transition={{ delay: i * 0.05, duration: 0.38, ease: EASE }}
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
                        <Link
                          to={note.action.resolveTo ? note.action.resolveTo() : note.action.to}
                          className="notif-item-cta group"
                          onClick={() => { if (note.unread) markRead(note.id); }}
                        >
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
