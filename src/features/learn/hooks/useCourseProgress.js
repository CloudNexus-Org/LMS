import { useState, useCallback, useMemo, useEffect } from "react";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";
import useAuthStore from "@/store/useAuthStore";
import { completeLesson, fetchTrackProgress } from "@/lib/api/enrollmentApi";

const completedKey = (trackId) => `cn:progress:${trackId}`;

export function useCourseProgress({ trackId, lessons }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [completed, setCompleted] = useState(() =>
    getStoredJSON(completedKey(trackId), {})
  );

  useEffect(() => {
    if (!user?.id || !token || !trackId) return;
    fetchTrackProgress(user, token, trackId)
      .then((data) => {
        if (!data || !lessons?.length) return;
        const count = data.completedLessons ?? 0;
        if (count <= 0) return;
        const next = {};
        lessons.slice(0, count).forEach((l) => {
          next[l.id] = true;
        });
        setCompleted(next);
        setStoredJSON(completedKey(trackId), next);
      })
      .catch(() => {});
  }, [user?.id, token, trackId, lessons]);

  const doneCount = useMemo(() => {
    if (!lessons) return 0;
    return lessons.filter((l) => completed[l.id]).length;
  }, [lessons, completed]);

  const progressPct = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return Math.round((doneCount / lessons.length) * 100);
  }, [doneCount, lessons]);

  const syncComplete = useCallback(
    (lessonId, nextMap) => {
      setCompleted(nextMap);
      setStoredJSON(completedKey(trackId), nextMap);
      if (user?.id && token) {
        const numericId = Number(lessonId);
        if (!Number.isNaN(numericId)) {
          completeLesson(user, token, numericId, trackId).catch(() => {});
        }
      }
    },
    [trackId, user, token]
  );

  const toggleLessonComplete = useCallback(
    (lessonId) => {
      const next = { ...completed, [lessonId]: !completed[lessonId] };
      if (next[lessonId]) syncComplete(lessonId, next);
      else {
        setCompleted(next);
        setStoredJSON(completedKey(trackId), next);
      }
    },
    [completed, trackId, syncComplete]
  );

  const markLessonComplete = useCallback(
    (lessonId) => {
      const next = { ...completed, [lessonId]: true };
      syncComplete(lessonId, next);
    },
    [completed, trackId, syncComplete]
  );

  return {
    completedMap: completed,
    doneCount,
    progressPct,
    toggleLessonComplete,
    markLessonComplete,
  };
}
