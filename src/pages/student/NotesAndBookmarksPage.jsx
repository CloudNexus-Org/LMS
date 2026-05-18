import { useState } from 'react';
import { Search, Clock, FileText, ChevronRight, Edit3 } from 'lucide-react';

const MOCK_NOTES = [
  {
    id: 1,
    courseTitle: 'Advanced State Management',
    lessonTitle: 'Intro to React Query',
    timestamp: '03:45',
    content: 'React query invalidates queries automatically in the background.\n\nUse `queryClient.invalidateQueries(["todos"])` to trigger refetch. This is extremely important for optimistic UI updates in our dashboard systems.',
    date: '2 hours ago'
  },
  {
    id: 2,
    courseTitle: 'Cloud Architecture Patterns',
    lessonTitle: 'Microservices vs Monolith',
    timestamp: '12:20',
    content: 'Remember: Eventual consistency is a tradeoff. Saga pattern is crucial here. We should consider using Kafka for event streaming if we scale beyond 100k requests/min.',
    date: '3 days ago'
  }
];

export default function NotesAndBookmarksPage() {
  const [activeNote, setActiveNote] = useState(MOCK_NOTES[0]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Notes & Bookmarks</h1>
        <p className="text-muted mt-1 font-medium">Your personal knowledge base tied to video timestamps.</p>
      </div>

      <div className="flex flex-1 overflow-hidden border border-border rounded-2xl bg-surface shadow-card">
        
        {/* Sidebar List */}
        <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-border bg-bg/30 flex flex-col h-full">
          <div className="p-4 border-b border-border bg-surface shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                className="w-full bg-bg border border-border rounded-lg pl-9 pr-3 py-2.5 text-[13px] font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {MOCK_NOTES.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveNote(note)}
                className={`w-full text-left p-5 border-b border-border transition-colors ${
                  activeNote?.id === note.id 
                    ? 'bg-surface border-l-[3px] border-l-primary' 
                    : 'border-l-[3px] border-l-transparent hover:bg-surface/50'
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1.5 truncate">
                  {note.courseTitle}
                </div>
                <div className="text-[14px] font-bold text-text mb-3 line-clamp-1">
                  {note.lessonTitle}
                </div>
                <div className="flex items-center justify-between text-xs text-muted font-semibold">
                  <span className="flex items-center gap-1.5 bg-primary-soft text-primary px-2 py-1 rounded border border-primary/10">
                    <Clock className="h-3.5 w-3.5" /> {note.timestamp}
                  </span>
                  <span>{note.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Editor/Viewer */}
        <div className="hidden sm:flex flex-1 flex-col h-full bg-surface">
          {activeNote ? (
            <>
              <div className="p-6 lg:p-8 border-b border-border flex items-center justify-between bg-surface shrink-0">
                <div>
                  <div className="flex items-center gap-2 text-[13px] text-muted font-bold mb-3 uppercase tracking-wider">
                    {activeNote.courseTitle} <ChevronRight className="h-4 w-4 opacity-50" /> {activeNote.lessonTitle}
                  </div>
                  <h2 className="text-2xl font-bold text-text flex items-center gap-4 font-display">
                    <span className="bg-primary text-white px-2.5 py-1 rounded-md text-base shadow-sm">
                      {activeNote.timestamp}
                    </span>
                    Jump to Video Position
                  </h2>
                </div>
                <button className="flex items-center gap-2 bg-bg border border-border px-4 py-2.5 rounded-lg text-[13px] font-bold text-text hover:border-primary hover:text-primary transition-all hover:shadow-sm">
                  <Edit3 className="h-4 w-4" /> Edit Note
                </button>
              </div>
              <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-bg/10">
                <div className="prose prose-sm sm:prose lg:prose-base dark:prose-invert max-w-3xl text-text font-medium leading-relaxed bg-surface p-8 rounded-xl border border-border shadow-sm">
                  <p className="whitespace-pre-wrap">{activeNote.content}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted">
              <div className="h-16 w-16 bg-bg rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted" />
              </div>
              <p className="font-bold text-text">Select a note to view</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
