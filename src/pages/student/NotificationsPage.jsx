import { useState } from "react";
import {
  MessageSquare,
  AlertCircle,
  Award,
  Check,
  Bell,
  Sparkles,
  Trash2,
  ChevronRight,
} from "lucide-react";
import useIsDarkTheme from "../../hooks/useIsDarkTheme";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "mentorship",
    icon: MessageSquare,
    title: "New reply from your Mentor",
    content:
      'Jane Doe replied to your question in "React State Architecture".',
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "system",
    icon: Award,
    title: "Certificate Unlocked!",
    content:
      "You have successfully completed Cloud Architecture Patterns. View your certificate now.",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    type: "update",
    icon: AlertCircle,
    title: "Course Content Updated",
    content:
      'New lessons have been added to "Enterprise React Systems".',
    time: "3 days ago",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] =
    useState(MOCK_NOTIFICATIONS);

  const isDark = useIsDarkTheme();

  const cardBg = isDark ? "bg-[#0d111d]" : "bg-white";

  const cardBorder = isDark
    ? "border-white/10"
    : "border-border";

  const surfaceBg = isDark
    ? "bg-[#0f172a]"
    : "bg-[#f8fbff]";

  const textPrimary = isDark
    ? "text-white"
    : "text-slate-900";

  const textSecondary = isDark
    ? "text-white/60"
    : "text-slate-500";

  const glassGlow = isDark
    ? "shadow-[0_20px_60px_rgba(37,99,235,0.18)]"
    : "shadow-[0_20px_60px_rgba(37,99,235,0.08)]";

  const markAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((n) => n.id !== id)
    );
  };

  const filtered = notifications.filter(
    (n) => filter === "all" || n.type === filter
  );

  return (
    <div className="min-h-screen bg-bg text-text p-1 sm:p-2">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div
          className={`
            relative overflow-hidden rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            ${glassGlow}
            px-6 py-7
          `}
        >
          {/* GLOW */}
          <div className="absolute right-[-100px] top-[-100px] h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[90px]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[5px] border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-blue-500">
                <Sparkles size={13} />
                Notification Center
              </div>

              <h1
                className={`
                  mt-4
                  text-[42px]
                  sm:text-[52px]
                  font-black
                  leading-[0.95]
                  tracking-[-0.05em]
                  ${textPrimary}
                `}
              >
                Notifications
              </h1>

              <p
                className={`
                  mt-3
                  max-w-[700px]
                  text-[15px]
                  leading-7
                  font-medium
                  ${textSecondary}
                `}
              >
                Stay updated with your mentors, certifications,
                course activities and platform insights.
              </p>
            </div>

            {/* ACTION */}
            <button
              onClick={markAllRead}
              className="
                relative inline-flex
                h-[52px]
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-none
                bg-blue-500
                px-7
                text-sm
                font-black
                uppercase
                tracking-[0.15em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:bg-blue-600
                shadow-[0_15px_35px_rgba(37,99,235,0.25)]
                [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]
              "
            >
              <Check className="h-4 w-4" />
              Mark All Read
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            [
              "Unread Alerts",
              notifications.filter((n) => n.unread).length,
              Bell,
            ],
            [
              "Mentor Messages",
              notifications.filter(
                (n) => n.type === "mentorship"
              ).length,
              MessageSquare,
            ],
            [
              "Achievements",
              notifications.filter(
                (n) => n.type === "system"
              ).length,
              Award,
            ],
          ].map(([title, value, Icon], i) => (
            <div
              key={i}
              className={`
                relative overflow-hidden rounded-[6px]
                border
                ${cardBorder}
                ${cardBg}
                ${glassGlow}
                group p-6
                transition-all duration-300
                hover:-translate-y-1
                hover:scale-[1.01]
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-cyan-400/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${textSecondary}`}>
                    {title}
                  </p>

                  <h3 className="mt-3 text-4xl font-black">
                    {value}
                  </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-blue-500/10 text-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.18)] transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CARD */}
        <div
          className={`
            overflow-hidden rounded-[6px]
            border
            ${cardBorder}
            ${cardBg}
            ${glassGlow}
          `}
        >
          {/* FILTERS */}
          <div
            className={`
              flex items-center gap-6 overflow-x-auto
              border-b
              ${cardBorder}
              px-6
              py-2
              ${surfaceBg}
            `}
          >
            {["all", "mentorship", "system", "update"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    relative py-4 text-sm font-black uppercase tracking-[0.15em]
                    transition-all duration-300 whitespace-nowrap
                    ${
                      filter === f
                        ? "text-blue-500"
                        : `${textSecondary} hover:text-blue-500`
                    }
                  `}
                >
                  {f}

                  {filter === f && (
                    <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-500" />
                  )}
                </button>
              )
            )}
          </div>

          {/* NOTIFICATION LIST */}
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Bell className="mx-auto h-14 w-14 text-muted opacity-20" />

                <p className="mt-4 font-bold text-muted">
                  No notifications found.
                </p>
              </div>
            ) : (
              filtered.map((note) => {
                const Icon = note.icon;

                return (
                  <div
                    key={note.id}
                    className={`
                      group relative overflow-hidden
                      px-6 py-6
                      transition-all duration-300
                      hover:bg-blue-500/[0.03]

                      ${
                        note.unread
                          ? isDark
                            ? "bg-blue-500/[0.05]"
                            : "bg-blue-500/[0.02]"
                          : ""
                      }
                    `}
                  >
                    {/* HOVER GLOW */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex gap-5">
                      {/* ICON */}
                      <div
                        className={`
                          relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px]
                          transition-all duration-300
                          group-hover:scale-110

                          ${
                            note.unread
                              ? "bg-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                              : isDark
                              ? "bg-[#111827] border border-white/10 text-white/60"
                              : "bg-[#f3f7ff] border border-blue-100 text-slate-500"
                          }
                        `}
                      >
                        <Icon className="h-6 w-6" />

                        {note.unread && (
                          <div className="absolute right-[-2px] top-[-2px] h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3
                              className={`
                                text-[17px]
                                font-black
                                ${
                                  note.unread
                                    ? textPrimary
                                    : textSecondary
                                }
                              `}
                            >
                              {note.title}
                            </h3>

                            <p
                              className={`
                                mt-2
                                text-[14px]
                                leading-7
                                font-medium
                                ${textSecondary}
                              `}
                            >
                              {note.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] text-muted">
                              {note.time}
                            </span>

                            <button
                              onClick={() =>
                                removeNotification(note.id)
                              }
                              className="text-muted transition-all duration-300 hover:text-red-500 hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* ACTION */}
                        <div className="mt-5 flex items-center gap-4">
                          {note.type === "mentorship" && (
                            <button
                              className="
                                inline-flex items-center gap-2
                                text-sm font-black text-blue-500
                                transition-all duration-300
                                hover:gap-3
                              "
                            >
                              Reply to Mentor
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}

                          {note.type === "system" && (
                            <button
                              className="
                                inline-flex items-center gap-2
                                text-sm font-black text-cyan-400
                                transition-all duration-300
                                hover:gap-3
                              "
                            >
                              View Certificate
                              <ChevronRight className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
}