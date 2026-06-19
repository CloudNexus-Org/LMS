import { useState } from "react";
import {
  Search,
  Clock,
  FileText,
  ChevronRight,
  Edit3,
  Bookmark,
  Sparkles,
  PlayCircle,
  Star,
} from "lucide-react";

const MOCK_NOTES = [
  {
    id: 1,
    courseTitle: "Advanced State Management",
    lessonTitle: "Intro to React Query",
    timestamp: "03:45",
    content:
      "React query invalidates queries automatically in the background.\n\nUse `queryClient.invalidateQueries([\"todos\"])` to trigger refetch. This is extremely important for optimistic UI updates in our dashboard systems.",
    date: "2 hours ago",
    category: "Frontend",
  },
  {
    id: 2,
    courseTitle: "Cloud Architecture Patterns",
    lessonTitle: "Microservices vs Monolith",
    timestamp: "12:20",
    content:
      "Remember: Eventual consistency is a tradeoff. Saga pattern is crucial here. We should consider using Kafka for event streaming if we scale beyond 100k requests/min.",
    date: "3 days ago",
    category: "Cloud",
  },
];

export default function NotesAndBookmarksPage() {
  const [activeNote, setActiveNote] = useState(MOCK_NOTES[0]);

  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden">
      <div className="relative mx-auto flex max-w-7xl flex-col">
        {/* HEADER */}
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div
              className="
                mb-5
                inline-flex items-center gap-2
                rounded-[5px]
              
                
                px-4 py-2

                text-[11px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#2563ff]
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              Smart Learning Notes
            </div>

            <h1 className="text-[42px] font-black tracking-tight text-text">
              Notes & Bookmarks
            </h1>

            <p className="mt-2 max-w-2xl text-[20px] leading-relaxed text-muted">
              Save important concepts,  video timestamps,
              and build your own learning.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                title: "Saved",
                value: "24",
                icon: Bookmark,
                iconColor: "text-blue-500",
                bg: "from-blue-500/30 via-blue-500/10 to-cyan-400/20",
                glow:
                  "hover:shadow-[0_20px_50px_rgba(37,99,235,0.14)]",
              },
              {
                title: "Hours",
                value: "18h",
                icon: Clock,
                iconColor: "text-emerald-500",
                bg: "from-emerald-500/30 via-emerald-500/10 to-lime-400/20",
                glow:
                  "hover:shadow-[0_20px_50px_rgba(16,185,129,0.14)]",
              },
              {
                title: "Streak",
                value: "12d",
                icon: Star,
                iconColor: "text-orange-500",
                bg: "from-orange-500/30 via-orange-500/10 to-yellow-400/20",
                glow:
                  "hover:shadow-[0_20px_50px_rgba(249,115,22,0.14)]",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`
                  group
                  relative overflow-hidden
                  rounded-[5px]
                  border border-border
                  bg-surface
                  p-4
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:border-primary/20
                  ${item.glow}
                `}
              >
                {/* GLOW */}
                <div
                  className="
                    pointer-events-none
                    absolute inset-0
                    opacity-0
                    transition duration-500
                    group-hover:opacity-100
                    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_45%)]
                  "
                />

                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    {/* ICON */}
                    <div
                      className={`
                        relative
                        flex h-11 w-11 items-center justify-center
                        rounded-[12px]
                        bg-gradient-to-br
                        ${item.bg}
                        overflow-hidden
                      `}
                    >
                      <div
                        className="
                          absolute inset-0
                          bg-gradient-to-br
                          from-white/40
                          to-transparent
                        "
                      />

                      <item.icon
                        className={`relative z-10 h-5 w-5 ${item.iconColor}`}
                      />
                    </div>

                    
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-[28px] font-black leading-none text-text">
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div
          className="
            flex h-[calc(100vh-220px)]
            overflow-hidden
            rounded-[5px]
            border border-border
            bg-surface/90
            shadow-[0_20px_60px_rgba(37,99,235,0.06)]
            backdrop-blur-xl
          "
        >
          {/* SIDEBAR */}
          <div
            className="
              flex w-full flex-col border-r border-border
              bg-bg/40 sm:w-[330px]
            "
          >
            {/* SEARCH */}
            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <input
                  type="text"
                  placeholder="Search notes..."
                  className="
                    h-[48px]
                    w-full
                    rounded-[5px]
                    border border-border
                    bg-surface
                    pl-11 pr-4

                    text-[13px]
                    font-medium
                    text-text

                    outline-none
                    transition-all duration-300

                    focus:border-[#2563ff]
                    focus:ring-2
                    focus:ring-[#2563ff]/20

                    hover:border-[#2563ff]/20
                    hover:shadow-[0_10px_25px_rgba(37,99,235,0.08)]
                  "
                />
              </div>
            </div>

            {/* NOTES LIST */}
            <div className="flex-1 overflow-y-auto">
              {MOCK_NOTES.map((note) => {
                const isActive = activeNote?.id === note.id;

                return (
                  <button
                    key={note.id}
                    onClick={() => setActiveNote(note)}
                    className={`
                      group
                      relative
                      w-full
                      border-b border-border
                      p-4
                      text-left
                      transition-all duration-500

                      ${
                        isActive
                          ? `
                            bg-[#2563ff]/8
                            shadow-[0_12px_30px_rgba(37,99,235,0.10)]
                          `
                          : `
                            hover:bg-surface
                          `
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-[3px] rounded-[5px] bg-[#2563ff]" />
                    )}

                    <div className="mb-2 flex items-center justify-between">
                      {/* CATEGORY */}
                      <span
                        className="
                          rounded-[5px]
                          border border-[#2563ff]/10
                          bg-[#2563ff]/10
                          px-2.5 py-1

                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.15em]
                          text-[#2563ff]
                        "
                      >
                        {note.category}
                      </span>

                      <span className="text-[11px] font-medium text-muted">
                        {note.date}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-1 text-[14px] font-black text-text">
                      {note.lessonTitle}
                    </h3>

                    <p className="line-clamp-2 text-[12px] leading-relaxed text-muted">
                      {note.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* TIMESTAMP */}
                      <div
                        className="
                          inline-flex items-center gap-1.5
                          rounded-[5px]
                          border border-[#2563ff]/10
                          bg-gradient-to-br
                          from-[#2563ff]/15
                          to-cyan-400/10

                          px-2.5 py-1

                          text-[11px]
                          font-bold
                          text-[#2563ff]
                        "
                      >
                        <Clock className="h-3 w-3" />
                        {note.timestamp}
                      </div>

                      <ChevronRight
                        className={`
                          h-4 w-4
                          transition-transform duration-300
                          ${
                            isActive
                              ? "translate-x-1 text-[#2563ff]"
                              : "text-muted group-hover:translate-x-1"
                          }
                        `}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENT PANEL */}
          <div
            className="
              hidden flex-1 flex-col
              bg-surface
              relative overflow-hidden
              sm:flex
            "
          >
            {activeNote ? (
              <>
                {/* TOP BAR */}
                <div
                  className="
                    flex items-center justify-between
                    border-b border-border
                    p-6
                    bg-gradient-to-r
                    from-[#2563ff]/[0.03]
                    via-transparent
                    to-violet-500/[0.03]
                  "
                >
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-muted">
                      {activeNote.courseTitle}

                      <ChevronRight className="h-3.5 w-3.5 opacity-40" />

                      {activeNote.lessonTitle}
                    </div>

                    <h2 className="flex items-center gap-4 text-[28px] font-black tracking-tight text-text">
                      {/* VIDEO TIME */}
                      <span
                        className="
                          relative
                          flex h-[52px] w-[52px]
                          items-center justify-center

                          rounded-[14px]

                          bg-gradient-to-br
                          from-blue-500
                          via-cyan-400
                          to-blue-500

                          text-[13px]
                          font-black
                          text-white

                          shadow-[0_12px_35px_rgba(37,99,235,0.30)]

                          overflow-hidden
                        "
                      >
                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-br
                            from-white/30
                            to-transparent
                          "
                        />

                        <span className="relative z-10">
                          {activeNote.timestamp}
                        </span>
                      </span>

                      Jump to Video Position
                    </h2>
                  </div>

                  {/* EDIT BUTTON */}
                  <button
                    className="
                      flex items-center gap-2
                      rounded-[5px]

                      border border-border
                      bg-bg

                      px-4 py-2.5

                      text-[13px]
                      font-bold
                      text-text

                      transition-all duration-300

                      hover:border-[#2563ff]/30
                      hover:bg-[#2563ff]/5
                      hover:text-[#2563ff]

                      hover:shadow-[0_14px_35px_rgba(37,99,235,0.10)]
                    "
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Note
                  </button>
                </div>

                {/* NOTE BODY */}
                <div className="flex-1 overflow-y-auto bg-bg/20 p-6">
                  {/* NOTE CARD */}
                  <div
                    className="
                      mx-auto max-w-4xl
                      rounded-[5px]
                      border border-border
                      bg-surface

                      p-6

                      shadow-[0_20px_50px_rgba(37,99,235,0.06)]

                      transition-all duration-500
                      hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]
                    "
                  >
                    <div className="mb-5 flex items-center gap-3">
                      {/* ICON */}
                      <div
                        className="
                          relative
                          flex h-12 w-12 items-center justify-center

                          rounded-[14px]

                          bg-gradient-to-br
                          from-blue-500/25
                          via-blue-500/10
                          to-cyan-400/10

                          overflow-hidden

                          shadow-[0_12px_30px_rgba(37,99,235,0.14)]
                        "
                      >
                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-br
                            from-white/30
                            to-transparent
                          "
                        />

                        <PlayCircle className="relative z-10 h-6 w-6 text-blue-500" />
                      </div>

                      <div>
                        <h3 className="text-[17px] font-black text-text">
                          Video Learning Note
                        </h3>

                        <p className="text-[13px] text-muted">
                          Timestamp linked note
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[5px] border border-border bg-bg/30 p-5">
                      <p className="whitespace-pre-wrap text-[14px] leading-[1.9] text-text">
                        {activeNote.content}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-muted">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[5px] bg-bg">
                  <FileText className="h-8 w-8" />
                </div>

                <h3 className="text-lg font-black text-text">
                  No note selected
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Select a note from the sidebar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}