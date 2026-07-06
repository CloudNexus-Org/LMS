import { getLessonsByTrack } from '@/data/tracks';

/**
 * Full track curriculum from static data, enriched with API lesson content where available.
 * Keeps the complete sidebar list (all videos/readings/quizzes) even when the API
 * only has a subset of lessons seeded in the database.
 */
export function mergeTrackLessons(trackId, apiLessons) {
  const staticLessons = getLessonsByTrack(trackId);
  if (!staticLessons.length) return apiLessons || [];
  if (!apiLessons?.length) {
    return staticLessons.map((l) => ({ ...l, progressKey: l.id }));
  }

  const apiByTitle = new Map(
    apiLessons.map((l) => [l.title?.trim().toLowerCase(), l])
  );

  return staticLessons.map((staticLesson, index) => {
    const apiLesson =
      apiLessons[index] ||
      apiByTitle.get(staticLesson.title?.trim().toLowerCase()) ||
      null;

    if (!apiLesson) return staticLesson;

    return {
      ...staticLesson,
      ...apiLesson,
      id: apiLesson.id ?? staticLesson.id,
      progressKey: staticLesson.id,
      apiId: apiLesson.id,
      courseIndex: staticLesson.courseIndex,
      courseTitle: staticLesson.courseTitle,
      courseId: staticLesson.courseId ?? apiLesson.courseId,
      summary: apiLesson.summary || staticLesson.summary,
    };
  });
}

export function apiLessonCount(apiLessons) {
  return apiLessons?.length ?? 0;
}
