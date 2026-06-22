import { useState, useMemo } from "react";
import {
  Bell,
  Check,
  MessageSquare,
  Star,
  DollarSign,
  UploadCloud,
  Users,
  Flame,
  Trash2,
  ChevronRight,
  Sparkles,
  CheckCheck,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "qna",
    icon: MessageSquare,
    title: "New Q&A Question",
    content:
      'A student asked a question in "Advanced State Management" Lesson 3 — about Redux vs Zustand.',
    time: "2 hours ago",
    unread: true,
    actionLabel: "Reply Now",
  },
  {
    id: 2,
    type: "review",
    icon: Star,
    title: "5-Star Review Received",
    content:
      'Sarah M. just left a 5-star review on your "Cloud Architecture Patterns" course — "Best course ever!"',
    time: "5 hours ago",
    unread: true,
    actionLabel: "View Review",
  },
  {
    id: 3,
    type: "enrollment",
    icon: Users,
    title: "New Student Enrolled",
    content:
      'Alex Chen enrolled in your "Advanced State Management" course. You now have 1,249 students total.',
    time: "8 hours ago",
    unread: true,
    actionLabel: "View Student",
  },
  {
    id: 4,
    type: "payout",
    icon: DollarSign,
    title: "Payout Processed",
    content:
      "Your monthly payout of $4,250 has been processed and will arrive in 1–2 business days.",
    time: "1 day ago",
    unread: false,
    actionLabel: "View Details",
  },
  {
    id: 5,
    type: "approval",
    icon: ShieldCheck,
    title: "Course Approved & Live",
    content:
      '"Rust for Frontend Devs" passed QA review and is now live on the marketplace.',
    time: "2 days ago",
    unread: false,
    actionLabel: "View Course",
  },
  {
    id: 6,
    type: "trending",
    icon: Flame,
    title: "Course is Trending 🔥",
    content:
      '"Cloud Architecture Patterns" is trending in the top 5 today — 84 new enrollments in 24 hours!',
    time: "3 days ago",
    unread: false,
    actionLabel: "See Analytics",
  },
  {
    id: 7,
    type: "upload",
    icon: UploadCloud,
    title: "Course Under Review",
    content:
      '"TypeScript Deep Dive" has been submitted and is currently under QA review. Expected: 24–48 hours.',
    time: "4 days ago",
    unread: false,
    actionLabel: null,
  },
];

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "qna", label: "Q&A" },
  { key: "review", label: "Reviews" },
  { key: "enrollment", label: "Enrollments" },
  { key: "payout", label: "Payouts" },
];

const TYPE_CONFIG = {
  qna: {
    iconColor: "text-blue-500",
    bg: "from-blue-500/30 via-blue-500/10 to-cyan-400/20",
    actionColor: "text-blue-500 hover:text-cyan-400",
    unreadBg: { dark: "bg-blue-500/[0.05]", light: "bg-blue-500/[0.02]" },
  },
  review: {
    iconColor: "text-amber-500",
    bg: "from-amber-500/30 via-amber-500/10 to-yellow-400/20",
    actionColor: "text-amber-500 hover:text-yellow-400",
    unreadBg: { dark: "bg-amber-500/[0.05]", light: "bg-amber-500/[0.02]" },
  },
  enrollment: {
    iconColor: "text-emerald-500",
    bg: "from-emerald-500/30 via-emerald-500/10 to-lime-400/20",
    actionColor: "text-emerald-500 hover:text-lime-400",
    unreadBg: {
      dark: "bg-emerald-500/[0.05]",
      light: "bg-emerald-500/[0.02]",
    },
  },
  payout: {
    iconColor: "text-emerald-500",
    bg: "from-emerald-500/30 via-emerald-500/10 to-teal-400/20",
    actionColor: "text-emerald-500 hover:text-teal-400",
    unreadBg: {
      dark: "bg-emerald-500/[0.05]",
      light: "bg-emerald-500/[0.02]",
    },
  },
  approval: {
    iconColor: "text-violet-500",
    bg: "from-violet-500/30 via-violet-500/10 to-fuchsia-400/20",
    actionColor: "text-violet-500 hover:text-fuchsia-400",
    unreadBg: {
      dark: "bg-violet-500/[0.05]",
      light: "bg-violet-500/[0.02]",
    },
  },
  trending: {
    iconColor: "text-orange-500",
    bg: "from-orange-500/30 via-orange-500/10 to-yellow-400/20",
    actionColor: "text-orange-500 hover:text-yellow-400",
    unreadBg: {
      dark: "bg-orange-500/[0.05]",
      light: "bg-orange-500/[0.02]",
    },
  },
  upload: {
    iconColor: "text-cyan-500",
    bg: "from-cyan-500/30 via-cyan-500/10 to-blue-400/20",
    actionColor: "text-cyan-500 hover:text-blue-400",
    unreadBg: { dark: "bg-cyan-500/[0.05]", light: "bg-cyan-500/[0.02]" },
  },
};

export default function MentorNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const isDark = useIsDarkTheme();

  const cardBg = isDark ? "bg-[#0d0f12]" : "bg-white";
  const cardBorder = isDark ? "border-white/8" : "border-gray-200";
  const surfaceBg = isDark ? "bg-[#0f1117]" : "bg-gray-50";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textSecondary = isDark ? "text-white/60" : "text-slate-500";

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markOneRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = useMemo(
    () =>
      filter === "all"
        ? notifications
        : notifications.filter((n) => n.type === filter),
    [filter, notifications]
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const STATS = [
    {
      title: "Unread",
      value: unreadCount,
      Icon: Bell,
      iconColor: "text-blue-500",
      bg: "from-blue-500/30 via-blue-500/10 to-cyan-400/20",
      glow: "hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)]",
    },
    {
      title: "Q&A Pending",
      value: notifications.filter((n) => n.type === "qna").length,
      Icon: MessageSquare,
      iconColor: "text-emerald-500",
      bg: "from-emerald-500/30 via-emerald-500/10 to-lime-400/20",
      glow: "hover:shadow-[0_25px_60px_rgba(16,185,129,0.18)]",
    },
    {
      title: "New Reviews",
      value: notifications.filter((n) => n.type === "review").length,
      Icon: Star,
      iconColor: "text-amber-500",
      bg: "from-amber-500/30 via-amber-500/10 to-yellow-400/20",
      glow: "hover:shadow-[0_25px_60px_rgba(245,158,11,0.18)]",
    },
    {
      title: "Enrollments",
      value: notifications.filter((n) => n.type === "enrollment").length,
      Icon: TrendingUp,
      iconColor: "text-violet-500",
      bg: "from-violet-500/30 via-violet-500/10 to-fuchsia-400/20",
      glow: "hover:shadow-[0_25px_60px_rgba(139,92,246,0.18)]",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text -ml-11 -mt-5">
      <div className="mx-auto max-w-6xl space-y-6 px-1 py-4 sm:px-2">
        {/* ── HERO ─────────────────────────────────── */}
        <div
          className={`
            relative overflow-hidden rounded-[5px]
            border ${cardBorder} ${cardBg}
            px-6 py-8
            transition-all duration-500
            hover:shadow-[0_30px_70px_rgba(37,99,235,0.14)]
            animate-in fade-in slide-in-from-bottom-4 duration-500
          `}
        >
          {/* GLOW */}
          <div className="absolute right-[-100px] top-[-100px] h-[260px] w-[260px] rounded-lg bg-blue-500/8 blur-[90px]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-500">
                <Sparkles size={13} />
                Mentor Notification Center
              </div>

              <h1
                className={`
                  mt-4 text-[42px] font-black leading-[0.95] tracking-[-0.05em]
                  ${textPrimary}
                `}
              >
                Notifications
              </h1>

              <p
                className={`
                  mt-3 max-w-[680px] text-[15px] leading-7 font-medium
                  ${textSecondary}
                `}
              >
                Stay on top of student Q&amp;A, new reviews, enrollments, payout
                updates, and course approval statuses — all in one place.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={markAllRead}
                className="
                  relative inline-flex h-[52px] min-w-[180px]
                  items-center justify-center gap-2
                  overflow-hidden rounded-lg
                  border border-border dark:border-border
                  bg-primary dark:bg-primary
                  px-7
                  text-sm font-black uppercase tracking-[0.12em]
                  text-white dark:text-white
                  shadow-[0_10px_30px_rgba(37,99,235,0.08)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  transition-all duration-300
                  hover:-translate-y-[2px]
                  hover:border-primary/40 dark:hover:border-primary/60
                "
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS GRID ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {STATS.map((item, i) => (
            <div
              key={i}
              className={`
                group relative overflow-hidden rounded-[5px]
                border ${cardBorder} ${cardBg}
                p-6
                transition-all duration-500
                hover:-translate-y-2 hover:border-primary/20
                ${item.glow}
              `}
            >
              {/* hover shimmer */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_45%)]" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${textSecondary}`}>
                    {item.title}
                  </p>
                  <h3 className="mt-3 text-4xl font-black">{item.value}</h3>
                </div>

                <div
                  className={`
                    relative flex h-14 w-14 items-center justify-center
                    rounded-[5px]
                    bg-gradient-to-br ${item.bg}
                    overflow-hidden
                    shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                  <item.Icon
                    className={`relative z-10 h-7 w-7 ${item.iconColor}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN CARD ─────────────────────────────── */}
        <div
          className={`
            overflow-hidden rounded-[5px]
            border ${cardBorder} ${cardBg}
            transition-all duration-500
            hover:shadow-[0_30px_70px_rgba(37,99,235,0.10)]
          `}
        >
          {/* FILTER TABS */}
          <div
            className={`
              flex items-center gap-1 overflow-x-auto hide-scrollbar
              border-b ${cardBorder}
              px-4 py-0
              ${surfaceBg}
            `}
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  relative shrink-0 px-5 py-4
                  text-sm font-black uppercase tracking-[0.12em]
                  transition-all duration-300 whitespace-nowrap

                  ${
                    filter === tab.key
                      ? "text-blue-500"
                      : `${textSecondary} hover:text-blue-500`
                  }
                `}
              >
                {tab.label}

                {filter === tab.key && (
                  <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-lg bg-blue-500" />
                )}

                {/* unread dot on tab */}
                {tab.key !== "all" &&
                  notifications.some(
                    (n) => n.type === tab.key && n.unread
                  ) && (
                    <span className="ml-1.5 inline-flex h-2 w-2 rounded-lg bg-blue-500" />
                  )}
              </button>
            ))}

            {/* right: unread count badge */}
            <div className="ml-auto shrink-0 px-4">
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-[5px] bg-blue-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.15em] text-blue-500">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* NOTIFICATION LIST */}
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <Bell className="mx-auto h-14 w-14 text-muted opacity-20" />
                <p className="mt-5 font-bold text-muted">
                  No notifications in this category.
                </p>
                <p className="mt-1 text-sm text-muted/70">
                  You're all caught up!
                </p>
              </div>
            ) : (
              filtered.map((note) => {
                const Icon = note.icon;
                const cfg = TYPE_CONFIG[note.type] ?? TYPE_CONFIG.upload;
                const unreadBg = isDark
                  ? cfg.unreadBg.dark
                  : cfg.unreadBg.light;

                return (
                  <div
                    key={note.id}
                    className={`
                      group relative overflow-hidden
                      px-6 py-6
                      transition-all duration-500
                      hover:-translate-y-[1px]
                      hover:shadow-[0_18px_45px_rgba(37,99,235,0.08)]
                      ${note.unread ? unreadBg : ""}
                    `}
                  >
                    {/* unread left accent bar */}
                    {note.unread && (
                      <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />
                    )}

                    {/* hover glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex gap-5">
                      {/* ICON */}
                      <div
                        className={`
                          relative flex h-14 w-14 shrink-0 items-center justify-center
                          rounded-[5px] overflow-hidden
                          bg-gradient-to-br ${cfg.bg}
                          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                          transition-all duration-500
                          group-hover:scale-110
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                        <Icon
                          className={`relative z-10 h-6 w-6 ${cfg.iconColor}`}
                        />

                        {/* unread glowing dot */}
                        {note.unread && (
                          <div className="absolute right-[-2px] top-[-2px] h-3 w-3 rounded-lg bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3
                              className={`
                                text-[16px] font-black leading-snug
                                ${note.unread ? textPrimary : textSecondary}
                              `}
                            >
                              {note.title}
                            </h3>

                            <p
                              className={`
                                mt-2 text-[14px] leading-7 font-medium
                                ${textSecondary}
                              `}
                            >
                              {note.content}
                            </p>
                          </div>

                          {/* TIME + DELETE */}
                          <div className="flex shrink-0 items-center gap-3 sm:ml-6">
                            <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                              {note.time}
                            </span>

                            <button
                              onClick={() => removeNotification(note.id)}
                              className="text-muted transition-all duration-300 hover:text-red-500 hover:scale-110"
                              title="Dismiss"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* ACTIONS ROW */}
                        <div className="mt-5 flex flex-wrap items-center gap-4">
                          {note.actionLabel && (
                            <button
                              className={`
                                inline-flex items-center gap-1.5
                                text-sm font-black
                                transition-all duration-300
                                hover:gap-2.5
                                ${cfg.actionColor}
                              `}
                            >
                              {note.actionLabel}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}

                          {note.unread && (
                            <button
                              onClick={() => markOneRead(note.id)}
                              className={`
                                inline-flex items-center gap-1.5
                                text-xs font-bold uppercase tracking-[0.12em]
                                transition-all duration-300
                                ${textSecondary} hover:text-text
                              `}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Mark read
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

          {/* FOOTER */}
          {filtered.length > 0 && (
            <div
              className={`
                flex items-center justify-between
                border-t ${cardBorder}
                px-6 py-4
                ${surfaceBg}
              `}
            >
              <p className={`text-xs font-bold ${textSecondary}`}>
                Showing {filtered.length} notification
                {filtered.length !== 1 ? "s" : ""}
              </p>

              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.unread)
                  )
                }
                className={`
                  inline-flex items-center gap-1.5
                  text-xs font-black uppercase tracking-[0.12em]
                  transition-all duration-300
                  ${textSecondary} hover:text-red-500
                `}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear read
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
