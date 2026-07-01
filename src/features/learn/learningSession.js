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

export function getResumeUrlForTrack(trackId) {
  const track = getTrackById(trackId);
  const lessons = getLessonsByTrack(trackId);
  if (!track || !lessons.length) return `/learn/${trackId}`;

  const session = getLastLearningSession();
  if (session?.trackId === trackId && lessons.some((l) => l.id === session.lessonId)) {
    return `/learn/${trackId}/${session.lessonId}`;
  }

  const completed = getStoredJSON(progressKey(trackId), {});
  const nextLesson = lessons.find((l) => !completed[l.id]) || lessons[0];
  return `/learn/${trackId}/${nextLesson.id}`;
}

export function getContinueLearningUrl() {
  const session = getLastLearningSession();
  if (session?.trackId) {
    const track = getTrackById(session.trackId);
    const lessons = getLessonsByTrack(session.trackId);
    if (track && lessons.length) {
      if (session.lessonId && lessons.some((l) => l.id === session.lessonId)) {
        return `/learn/${session.trackId}/${session.lessonId}`;
      }
      return getResumeUrlForTrack(session.trackId);
    }
  }

  return getResumeUrlForTrack(DEFAULT_TRACK_ID);
}
