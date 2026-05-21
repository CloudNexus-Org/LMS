import { useState, useCallback, useMemo } from "react";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";

const completedKey = (trackId) => `cn:progress:${trackId}`;

export function useCourseProgress({ trackId, lessons }) {
  const [completed, setCompleted] = useState(() =>
    getStoredJSON(completedKey(trackId), {})
  );

  const doneCount = useMemo(() => {
    if (!lessons) return 0;
    return lessons.filter((l) => completed[l.id]).length;
  }, [lessons, completed]);

  const progressPct = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return Math.round((doneCount / lessons.length) * 100);
  }, [doneCount, lessons]);

  const toggleLessonComplete = useCallback(
    (lessonId) => {
      setCompleted((prev) => {
        const newMap = { ...prev, [lessonId]: !prev[lessonId] };
        setStoredJSON(completedKey(trackId), newMap);
        return newMap;
      });
    },
    [trackId]
  );

  const markLessonComplete = useCallback(
    (lessonId) => {
      setCompleted((prev) => {
        const newMap = { ...prev, [lessonId]: true };
        setStoredJSON(completedKey(trackId), newMap);
        return newMap;
      });
    },
    [trackId]
  );

  return {
    completedMap: completed,
    doneCount,
    progressPct,
    toggleLessonComplete,
    markLessonComplete,
  };
}
