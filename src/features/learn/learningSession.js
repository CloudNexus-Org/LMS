import { getTrackById, getLessonsByTrack } from "@/data/tracks";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";

const SESSION_KEY = "cn:last-learning";
const progressKey = (trackId) => `cn:progress:${trackId}`;

const DEFAULT_TRACK_ID = "cloud";

export function saveLastLearningSession({ trackId, lessonId, trackName, lessonTitle }) {
  if (!trackId || !lessonId) return;
  const payload = {
    trackId,
    lessonId,
    trackName: trackName || "",
    lessonTitle: lessonTitle || "",
    updatedAt: Date.now(),
  };
  setStoredJSON(SESSION_KEY, payload);

  import("@/store/useAuthStore").then(({ default: useAuthStore }) => {
    const { user, token } = useAuthStore.getState();
    if (!user?.id || !token) return;
    import("@/lib/api/learningApi").then(({ saveLearningSession }) => {
      const numericLessonId = Number(lessonId);
      saveLearningSession(user, token, {
        trackId,
        lastLessonId: Number.isNaN(numericLessonId) ? undefined : numericLessonId,
        lastPositionSec: 0,
      }).catch(() => {});
    });
  });
}

export function getLastLearningSession() {
  return getStoredJSON(SESSION_KEY, null);
}

function numericProgressUrls(trackId, completed) {
  const doneIds = Object.keys(completed)
    .filter((k) => completed[k] && /^\d+$/.test(String(k)))
    .map(Number)
    .sort((a, b) => a - b);

  if (!doneIds.length) return null;

  const total = getStoredJSON(`${progressKey(trackId)}:total`, null);

  if (total && doneIds.length >= total) {
    return `/learn/${trackId}/1`;
  }

  const next = doneIds[doneIds.length - 1] + 1;
  if (total && next <= total) {
    return `/learn/${trackId}/${next}`;
  }
  if (!total) {
    return `/learn/${trackId}/${next}`;
  }
  return `/learn/${trackId}/1`;
}

export function getResumeUrlForTrack(trackId) {
  if (!trackId) return "/student/courses";

  const session = getLastLearningSession();
  if (session?.trackId === trackId && session.lessonId != null) {
    return `/learn/${trackId}/${session.lessonId}`;
  }

  const completed = getStoredJSON(progressKey(trackId), {});
  const apiUrl = numericProgressUrls(trackId, completed);
  if (apiUrl) return apiUrl;

  const track = getTrackById(trackId);
  if (track) {
    const lessons = getLessonsByTrack(trackId);
    if (lessons.length) {
      const nextLesson = lessons.find((l) => !completed[l.id]) || lessons[0];
      return `/learn/${trackId}/${nextLesson.id}`;
    }
  }

  return `/learn/${trackId}/1`;
}

/** Resume URL for a My Learning enrollment (prefers course-scoped track id). */
export function getResumeUrlForCourse({ trackId, courseId }) {
  const resolvedTrackId =
    courseId != null ? `course-${courseId}` : trackId;
  if (!resolvedTrackId) return "/student/courses";
  return getResumeUrlForTrack(resolvedTrackId);
}

export function getContinueLearningUrl() {
  const session = getLastLearningSession();
  if (session?.trackId && session.lessonId != null) {
    return `/learn/${session.trackId}/${session.lessonId}`;
  }

  if (session?.trackId) {
    return getResumeUrlForTrack(session.trackId);
  }

  return getResumeUrlForTrack(DEFAULT_TRACK_ID);
}
