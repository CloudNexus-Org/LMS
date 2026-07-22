import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";
import useAuthStore from "@/store/useAuthStore";
import {
  completeLesson,
  fetchTrackProgress,
  finishTrackLearning,
  submitQuizAttempt,
} from "@/lib/api/enrollmentApi";

const completedKey = (trackId) => `cn:progress:${trackId}`;
const quizPassedKey = (trackId) => `cn:quiz-passed:${trackId}`;
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

function lessonHasQuiz(lesson) {
  return !!(lesson?.hasQuiz || lesson?.quiz?.questions?.length);
}

function mergeApiProgress(stored, requiredLessons, data) {
  const next = { ...stored };
  if (Array.isArray(data.completedLessonIds) && data.completedLessonIds.length) {
    const idSet = new Set(data.completedLessonIds.map(String));
    requiredLessons.forEach((l) => {
      if (idSet.has(String(l.id)) || idSet.has(String(l.apiId))) {
        const key = lessonProgressKey(l);
        if (key != null) next[key] = true;
        next[l.id] = true;
      }
    });
    return next;
  }
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
  const [quizPassed, setQuizPassed] = useState(() =>
    getStoredJSON(quizPassedKey(trackId), {})
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

        if (Array.isArray(data.quizPassedLessonIds)) {
          const qp = { ...getStoredJSON(quizPassedKey(trackId), {}) };
          const idSet = new Set(data.quizPassedLessonIds.map(String));
          requiredLessons.forEach((l) => {
            if (idSet.has(String(l.id)) || idSet.has(String(l.apiId))) {
              qp[l.id] = true;
              const key = lessonProgressKey(l);
              if (key != null) qp[key] = true;
            }
          });
          setQuizPassed(qp);
          setStoredJSON(quizPassedKey(trackId), qp);
        }
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

  const lessonCleared = useCallback(
    (lesson) => {
      if (!lesson) return false;
      const done = isLessonComplete(completed, lesson);
      if (!done) return false;
      if (!lessonHasQuiz(lesson)) return true;
      const key = lessonProgressKey(lesson);
      return !!(quizPassed[key] || quizPassed[lesson.id]);
    },
    [completed, quizPassed]
  );

  const isLessonUnlocked = useCallback(
    (lessonOrIndex) => {
      if (!requiredLessons.length) return true;
      const index =
        typeof lessonOrIndex === "number"
          ? lessonOrIndex
          : requiredLessons.findIndex((l) => String(l.id) === String(lessonOrIndex?.id));
      if (index <= 0) return true;
      if (index < 0) return true;
      return lessonCleared(requiredLessons[index - 1]);
    },
    [requiredLessons, lessonCleared]
  );

  const getLessonStatus = useCallback(
    (lesson) => {
      const unlocked = isLessonUnlocked(lesson);
      const done = isLessonComplete(completed, lesson);
      const hasQuiz = lessonHasQuiz(lesson);
      const key = lessonProgressKey(lesson);
      const passed = !!(quizPassed[key] || quizPassed[lesson?.id]);
      if (!unlocked) return "locked";
      if (done && hasQuiz && !passed) return "quiz_pending";
      if (done && (!hasQuiz || passed)) return "completed";
      if (passed) return "quiz_passed";
      return "available";
    },
    [completed, quizPassed, isLessonUnlocked]
  );

  const maybeFinishTrack = useCallback(
    (nextMap, nextQuiz) => {
      if (!requiredLessons.length || !user?.id || !token || finishCalled.current) return;
      const requiredDone = requiredLessons.every((l) => {
        if (!isLessonComplete(nextMap, l)) return false;
        if (!lessonHasQuiz(l)) return true;
        const key = lessonProgressKey(l);
        return !!(nextQuiz[key] || nextQuiz[l.id]);
      });
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
        maybeFinishTrack(nextMap, quizPassed);
      }
    },
    [trackId, user, token, maybeFinishTrack, progressTotal, lessons, quizPassed]
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
      if (String(key) !== String(lessonId)) next[lessonId] = true;
      syncComplete(lessonId, next);
    },
    [completed, syncComplete, lessons]
  );

  const markQuizPassed = useCallback(
    async (lessonId, attemptPayload = {}) => {
      const lesson = lessons?.find((l) => String(l.id) === String(lessonId));
      const key = lessonProgressKey(lesson) ?? lessonId;
      const nextQuiz = { ...quizPassed, [key]: true, [lessonId]: true };
      setQuizPassed(nextQuiz);
      setStoredJSON(quizPassedKey(trackId), nextQuiz);

      if (user?.id && token) {
        const numericId = Number(lesson?.apiId ?? lessonId);
        if (!Number.isNaN(numericId)) {
          try {
            await submitQuizAttempt(user, token, numericId, {
              trackId,
              score: attemptPayload.score ?? attemptPayload.correct ?? 0,
              totalQuestions: attemptPayload.total ?? attemptPayload.totalQuestions ?? 1,
              passingScore: attemptPayload.passingScore ?? 70,
              passed: true,
              answers: attemptPayload.answers,
            });
          } catch {
            /* local state still updated */
          }
        }
      }

      // Ensure lesson is marked complete when quiz is passed
      if (!(completed[key] || completed[lessonId])) {
        const nextCompleted = { ...completed, [key]: true, [lessonId]: true };
        syncComplete(lessonId, nextCompleted);
        maybeFinishTrack(nextCompleted, nextQuiz);
      } else {
        maybeFinishTrack(completed, nextQuiz);
      }
    },
    [quizPassed, trackId, user, token, lessons, completed, syncComplete, maybeFinishTrack]
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

  const quizPassedMap = useMemo(() => {
    if (!lessons?.length) return quizPassed;
    const map = { ...quizPassed };
    for (const l of lessons) {
      const key = lessonProgressKey(l);
      if (quizPassed[key] || quizPassed[l.id]) {
        if (key != null) map[key] = true;
        map[l.id] = true;
      }
    }
    return map;
  }, [quizPassed, lessons]);

  return {
    completedMap,
    quizPassedMap,
    doneCount,
    progressPct,
    progressTotal,
    trackComplete,
    toggleLessonComplete,
    markLessonComplete,
    markQuizPassed,
    isLessonUnlocked,
    getLessonStatus,
    lessonHasQuiz,
  };
}
