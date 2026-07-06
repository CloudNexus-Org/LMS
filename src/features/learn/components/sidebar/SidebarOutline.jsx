import { useMemo, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  X,
  ArrowUpRight,
  PlayCircle,
  BookOpen,
  ListChecks,
  Award,
  Radio,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

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
      const courseIndex = items[0]?.courseIndex ?? 0;
      return { title, items, courseIndex };
    });
  }, [lessons]);

  const current = lessons.find((l) => String(l.id) === String(currentId));
  const [collapsed, setCollapsed] = useState(() => new Set());

  useEffect(() => {
    if (current != null) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        const gi = grouped.findIndex((g) =>
          g.items.some((l) => String(l.id) === String(currentId))
        );
        if (gi >= 0) next.delete(gi);
        return next;
      });
    }
  }, [currentId, grouped]);

  const toggleSection = (gi) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(gi)) next.delete(gi);
      else next.add(gi);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="learn-sidebar-head">
        <div className="min-w-0">
          <p className="learn-sidebar-eyebrow">Career track</p>
          <Link to={`/tracks/${track.id}`} className="learn-sidebar-track">
            {track.name}
            <ArrowUpRight size={12} className="shrink-0" aria-hidden />
          </Link>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close curriculum"
            className="learn-sidebar-close"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      <div className="learn-sidebar-scroll flex-1 overflow-y-auto">
        {grouped.map((g, gi) => {
          const isOpen = !collapsed.has(gi);
          const courseLessons = g.items;
          const doneInCourse = courseLessons.filter((l) => completedMap[l.id]).length;
          const sectionPct = Math.round((doneInCourse / courseLessons.length) * 100);

          return (
            <div key={`${g.courseIndex}-${g.title}`} className="learn-section">
              <button
                type="button"
                onClick={() => toggleSection(gi)}
                aria-expanded={isOpen}
                className="learn-section-header"
              >
                <div className="min-w-0 flex-1">
                  <p className="learn-section-title">
                    {String(gi + 1).padStart(2, "0")} · {g.title}
                  </p>
                  <div className="learn-section-bar">
                    <div
                      className="learn-section-bar-fill"
                      style={{ width: `${sectionPct}%` }}
                    />
                  </div>
                </div>
                <span className="learn-section-count">
                  {doneInCourse}/{courseLessons.length}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    {courseLessons.map((l) => {
                      const isActive = String(l.id) === String(currentId);
                      const isDone = !!completedMap[l.id];
                      const Icon = TYPE_ICON[l.type] || PlayCircle;

                      return (
                        <li key={l.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setCollapsed((prev) => {
                                const next = new Set(prev);
                                next.delete(gi);
                                return next;
                              });
                              onPick(l);
                            }}
                            aria-current={isActive ? "true" : undefined}
                            className={`learn-lesson-row ${isActive ? "learn-lesson-row-active" : ""}`}
                          >
                            <span
                              className={`learn-lesson-status ${isDone ? "learn-lesson-done" : isActive ? "learn-lesson-playing" : ""}`}
                              aria-hidden
                            >
                              {isDone ? (
                                <CheckCircle2 size={14} />
                              ) : isActive ? (
                                <Radio size={14} className="learn-now-playing" />
                              ) : (
                                <Circle size={14} />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="learn-lesson-name">{l.title}</span>
                              <span className="learn-lesson-meta-row">
                                <Icon size={10} aria-hidden />
                                {TYPE_LABEL[l.type]}
                                <span aria-hidden>·</span>
                                {l.duration}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
});
