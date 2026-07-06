import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";
import useAuthStore from "@/store/useAuthStore";
import { completeLesson, fetchTrackProgress, finishTrackLearning } from "@/lib/api/enrollmentApi";

const completedKey = (trackId) => `cn:progress:${trackId}`;
const progressTotalKey = (trackId) => `cn:progress:${trackId}:total`;

export function lessonProgressKey(lesson) {
  if (!lesson) return null;
  return lesson.progressKey ?? lesson.id;
}

function isLessonComplete(completed, lesson) {
  if (!lesson) return false;
  const key = lessonProgressKey(lesson);
  return !!(completed[key] || completed[lesson.id]);
}

function mergeApiProgress(stored, requiredLessons, data) {
  const next = { ...stored };
  if (data.progress >= 100) {
    requiredLessons.forEach((l) => {
      const key = lessonProgressKey(l);
      if (key != null) next[key] = true;
    });
  } else {
    const count = Math.min(data.completedLessons ?? 0, requiredLessons.length);
    requiredLessons.slice(0, count).forEach((l) => {
      const key = lessonProgressKey(l);
      if (key != null) next[key] = true;
    });
  }
  return next;
}

export function useCourseProgress({ trackId, lessons, progressTotal: progressTotalProp }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const progressTotal = progressTotalProp ?? lessons?.length ?? 0;

  const [completed, setCompleted] = useState(() =>
    getStoredJSON(completedKey(trackId), {})
  );
  const finishCalled = useRef(false);

  const requiredLessons = useMemo(() => {
    if (!lessons?.length) return [];
    if (progressTotal >= lessons.length) return lessons;
    return lessons.slice(0, progressTotal);
  }, [lessons, progressTotal]);

  useEffect(() => {
    if (!lessons?.length) return;
    const stored = getStoredJSON(completedKey(trackId), {});
    let changed = false;
    const next = { ...stored };

    for (const lesson of lessons) {
      const key = lessonProgressKey(lesson);
      if (stored[lesson.id] && key && !stored[key]) {
        next[key] = true;
        changed = true;
      }
      if (key && stored[key] && !stored[lesson.id]) {
        next[lesson.id] = true;
        changed = true;
      }
    }

    if (changed) {
      setCompleted(next);
      setStoredJSON(completedKey(trackId), next);
    }
  }, [lessons, trackId]);

  useEffect(() => {
    if (!user?.id || !token || !trackId) return;
    fetchTrackProgress(user, token, trackId)
      .then((data) => {
        if (!data || !lessons?.length) return;
        const stored = getStoredJSON(completedKey(trackId), {});
        const next = mergeApiProgress(stored, requiredLessons, data);
        setCompleted(next);
        setStoredJSON(completedKey(trackId), next);
        setStoredJSON(progressTotalKey(trackId), progressTotal);
      })
      .catch(() => {});
  }, [user?.id, token, trackId, lessons, progressTotal, requiredLessons]);

  const doneCount = useMemo(() => {
    return requiredLessons.filter((l) => isLessonComplete(completed, l)).length;
  }, [requiredLessons, completed]);

  const progressPct = useMemo(() => {
    if (!progressTotal) return 0;
    return Math.min(100, Math.round((doneCount / progressTotal) * 100));
  }, [doneCount, progressTotal]);

  const trackComplete = progressPct >= 100;

  const maybeFinishTrack = useCallback(
    (nextMap) => {
      if (!requiredLessons.length || !user?.id || !token || finishCalled.current) return;
      const requiredDone = requiredLessons.every((l) => isLessonComplete(nextMap, l));
      if (!requiredDone) return;
      finishCalled.current = true;
      finishTrackLearning(user, token, trackId).catch(() => {
        finishCalled.current = false;
      });
    },
    [requiredLessons, trackId, user, token]
  );

  const syncComplete = useCallback(
    (lessonId, nextMap) => {
      setCompleted(nextMap);
      setStoredJSON(completedKey(trackId), nextMap);
      setStoredJSON(progressTotalKey(trackId), progressTotal);
      if (user?.id && token) {
        const lesson = lessons?.find((l) => String(l.id) === String(lessonId));
        const numericId = Number(lesson?.apiId ?? lessonId);
        if (!Number.isNaN(numericId)) {
          completeLesson(user, token, numericId, trackId).catch(() => {});
        }
        maybeFinishTrack(nextMap);
      }
    },
    [trackId, user, token, maybeFinishTrack, progressTotal, lessons]
  );

  const toggleLessonComplete = useCallback(
    (lessonId) => {
      const lesson = lessons?.find((l) => String(l.id) === String(lessonId));
      const key = lessonProgressKey(lesson) ?? lessonId;
      const currentlyDone = !!(completed[key] || completed[lessonId]);
      const next = { ...completed, [key]: !currentlyDone };
      if (String(key) !== String(lessonId)) {
        next[lessonId] = !currentlyDone;
      }
      if (next[key]) syncComplete(lessonId, next);
      else {
        setCompleted(next);
        setStoredJSON(completedKey(trackId), next);
        finishCalled.current = false;
      }
    },
    [completed, trackId, syncComplete, lessons]
  );

  const markLessonComplete = useCallback(
    (lessonId) => {
      const lesson = lessons?.find((l) => String(l.id) === String(lessonId));
      const key = lessonProgressKey(lesson) ?? lessonId;
      if (completed[key] || completed[lessonId]) return;
      const next = { ...completed, [key]: true };
      syncComplete(lessonId, next);
    },
    [completed, syncComplete, lessons]
  );

  const completedMap = useMemo(() => {
    if (!lessons?.length) return completed;
    const map = { ...completed };
    for (const l of lessons) {
      if (isLessonComplete(completed, l)) {
        const key = lessonProgressKey(l);
        if (key != null) map[key] = true;
        map[l.id] = true;
      }
    }
    return map;
  }, [completed, lessons]);

  return {
    completedMap,
    doneCount,
    progressPct,
    progressTotal,
    trackComplete,
    toggleLessonComplete,
    markLessonComplete,
  };
}
