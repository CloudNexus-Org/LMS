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
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden px-4 py-6 lg:px-0">
      
      
   

      <div className="relative mx-auto flex max-w-7xl flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="mb-2 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-[5px] border border-[#2563ff]/20 bg-[#2563ff]/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#2563ff]">
              <Sparkles className="h-4 w-4" />
              Smart Learning Notes
            </div>

            <h1 className="text-4xl font-black tracking-tight text-text">
              Notes & Bookmarks
            </h1>

            <p className="mt-2 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
              Save important concepts, bookmark video timestamps, and build your
              own powerful cloud learning knowledge base.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            
            <div className="rounded-[5px] border border-border bg-surface p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-[#2563ff]" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Saved
                </span>
              </div>

              <h3 className="text-2xl font-black text-text">24</h3>
            </div>

            <div className="rounded-[5px] border border-border bg-surface p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#2563ff]" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hours
                </span>
              </div>

              <h3 className="text-2xl font-black text-text">18h</h3>
            </div>

            <div className="rounded-[5px] border border-border bg-surface p-5 shadow-sm col-span-2 sm:col-span-1">
              <div className="mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-[#2563ff]" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Streak
                </span>
              </div>

              <h3 className="text-2xl font-black text-text">12d</h3>
            </div>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded-[5px] border border-border bg-surface/90 shadow-[0_20px_80px_rgba(37,99,235,0.08)] backdrop-blur-xl">
          
          {/* SIDEBAR */}
          <div className="flex w-full flex-col border-r border-border bg-bg/40 sm:w-[340px]">
            
            {/* SEARCH */}
            <div className="border-b border-border p-5">
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
                    text-[14px]
                    font-semibold
                    text-text
                    outline-none
                    transition-all
                    focus:border-[#2563ff]
                    focus:ring-2
                    focus:ring-[#2563ff]/20
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
                      p-5
                      text-left
                      transition-all duration-300

                      ${
                        isActive
                          ? `
                            bg-[#2563ff]/8
                          `
                          : `
                            hover:bg-surface
                          `
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-[4px] rounded-[5px] bg-[#2563ff]" />
                    )}

                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-[5px] bg-[#2563ff]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#2563ff]">
                        {note.category}
                      </span>

                      <span className="text-xs font-semibold text-muted">
                        {note.date}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-1 text-[15px] font-black text-text">
                      {note.lessonTitle}
                    </h3>

                    <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
                      {note.content}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-[5px] border border-[#2563ff]/10 bg-[#2563ff]/10 px-3 py-1.5 text-[12px] font-bold text-[#2563ff]">
                        <Clock className="h-3.5 w-3.5" />
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

          {/* CONTENT */}
          <div className="hidden flex-1 flex-col bg-surface sm:flex">
            {activeNote ? (
              <>
                {/* TOP BAR */}
                <div className="flex items-center justify-between border-b border-border p-6 lg:p-8">
                  
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-muted">
                      {activeNote.courseTitle}

                      <ChevronRight className="h-4 w-4 opacity-40" />

                      {activeNote.lessonTitle}
                    </div>

                    <h2 className="flex items-center gap-4 text-3xl font-black tracking-tight text-text">
                      
                      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[5px] bg-[#2563ff] text-[15px] font-black text-white shadow-lg shadow-[#2563ff]/30">
                        {activeNote.timestamp}
                      </span>

                      Jump to Video Position
                    </h2>
                  </div>

                  <button
                    className="
                      flex items-center gap-2
                      rounded-[5px]
                      border border-border
                      bg-bg
                      px-5 py-3
                      text-[14px]
                      font-bold
                      text-text
                      transition-all duration-300
                      hover:border-[#2563ff]/30
                      hover:bg-[#2563ff]/5
                      hover:text-[#2563ff]
                    "
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Note
                  </button>
                </div>

                {/* NOTE BODY */}
                <div className="flex-1 overflow-y-auto bg-bg/20 p-6 lg:p-8">
                  
                  <div className="mx-auto max-w-4xl rounded-[5px] border border-border bg-surface p-8 shadow-lg">
                    
                    <div className="mb-6 flex items-center gap-3">
                      
                      <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#2563ff]/10">
                        <PlayCircle className="h-6 w-6 text-[#2563ff]" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-text">
                          Video Learning Note
                        </h3>

                        <p className="text-sm font-medium text-muted">
                          Timestamp linked note for quick revision
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[5px] border border-border bg-bg/30 p-6">
                      <p className="whitespace-pre-wrap text-[15px] font-medium leading-[2] text-text">
                        {activeNote.content}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-muted">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[5px] bg-bg">
                  <FileText className="h-10 w-10" />
                </div>

                <h3 className="text-xl font-black text-text">
                  No note selected
                </h3>

                <p className="mt-2 text-sm font-medium text-muted">
                  Select a note from the sidebar to start learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}