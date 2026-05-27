import { useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, CheckCircle2, Circle, X, ArrowUpRight, PlayCircle, BookOpen, ListChecks, Award } from "lucide-react";

const TYPE_LABEL = {
  video: "Video",
  reading: "Reading",
  quiz: "Quiz",
  project: "Project",
};

const TYPE_ICON = {
  video: PlayCircle,
  reading: BookOpen,
  quiz: ListChecks,
  project: Award,
};

export const SidebarOutline = memo(function SidebarOutline({
  track,
  lessons,
  currentId,
  completedMap,
  onPick,
  onClose,
}) {
  const grouped = useMemo(() => {
    const m = new Map();
    for (const l of lessons) {
      const key = `${l.courseIndex}::${l.courseTitle}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(l);
    }
    return Array.from(m.entries()).map(([key, items]) => {
      const [, title] = key.split("::");
      return { title, items };
    });
  }, [lessons]);

  const current = lessons.find((l) => l.id === currentId);
  const [openCourse, setOpenCourse] = useState(current?.courseIndex ?? 0);

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Career track
          </div>
          <Link
            to={`/tracks/${track.id}`}
            className="mt-1 inline-flex items-center gap-1 truncate font-display text-[14.5px] font-bold tracking-tight text-text transition-colors hover:text-primary"
          >
            {track.name}
            <ArrowUpRight size={12} className="shrink-0" aria-hidden />
          </Link>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close curriculum"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {/* Scrollable lesson list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {grouped.map((g, gi) => {
          const isOpen = openCourse === gi;
          const courseLessons = g.items;
          const doneInCourse = courseLessons.filter(
            (l) => completedMap[l.id]
          ).length;
          return (
            <div key={g.title} className="mb-2">
              <button
                type="button"
                onClick={() => setOpenCourse(isOpen ? -1 : gi)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface"
              >
                <span className="font-display text-[12.5px] font-bold uppercase tracking-[0.12em] text-text">
                  {String(gi + 1).padStart(2, "0")} · {g.title}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-subtle">
                  <span className="font-medium text-muted">
                    {doneInCourse}/{courseLessons.length}
                  </span>
                  <ChevronDown
                    size={13}
                    aria-hidden
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-0.5">
                  {courseLessons.map((l) => {
                    const isActive = l.id === currentId;
                    const isDone = !!completedMap[l.id];
                    const Icon = TYPE_ICON[l.type] || PlayCircle;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          onClick={() => onPick(l)}
                          aria-current={isActive ? "true" : undefined}
                          className={`group/lesson flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            isActive
                              ? "bg-primary-soft"
                              : "hover:bg-surface"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              isDone
                                ? "text-success"
                                : isActive
                                  ? "text-primary"
                                  : "text-subtle"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Circle size={14} />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[13px] font-medium leading-5 ${
                                isActive ? "text-primary" : "text-text"
                              } ${isDone ? "line-through opacity-70" : ""}`}
                            >
                              {l.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle">
                              <Icon size={10} aria-hidden />
                              <span>{TYPE_LABEL[l.type]}</span>
                              <span aria-hidden>·</span>
                              <span>{l.duration}</span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
