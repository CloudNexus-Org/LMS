import {
  addLesson,
  addModule,
  createCourseDraft,
  updateCourse,
  updateLesson,
  updateModule,
} from './contentApi';

export const CONTENT_CHANGED = 'lms:content-changed';

export function emitContentChanged() {
  window.dispatchEvent(new Event(CONTENT_CHANGED));
}

export const CATEGORY_TRACK = {
  'Frontend Engineering': 'frontend',
  'Cloud & DevOps': 'cloud',
  'Backend Systems': 'backend',
  'Data & AI': 'data',
  'System Design': 'systems',
  'Mobile Dev': 'mobile',
};

export function trackIdForCategory(category) {
  return CATEGORY_TRACK[category] || 'cloud';
}

export function parseDurationMin(duration) {
  if (!duration) return 10;
  const str = String(duration);
  if (str.includes(':')) {
    const [m, s] = str.split(':').map((n) => parseInt(n, 10) || 0);
    return Math.max(1, m + Math.ceil(s / 60));
  }
  const match = str.match(/(\d+)/);
  return match ? Math.max(1, parseInt(match[1], 10)) : 10;
}

export function courseToUiModules(course) {
  if (!course?.modules?.length) return null;
  return course.modules.map((m) => ({
    id: m.id,
    serverId: m.id,
    title: m.title,
    open: true,
    lessons: (m.lessons || []).map((l) => ({
      id: l.id,
      serverId: l.id,
      title: l.title,
      type: l.type || 'video',
      free: l.previewFree ?? l.free ?? false,
      duration: l.duration || (l.durationMin ? `${l.durationMin} min` : '10:00'),
      contentUrl: l.contentUrl,
      readingContent: l.readingContent,
      mediaFileId: l.mediaFileId,
      quiz: l.quiz || null,
      hasQuiz: l.hasQuiz ?? !!(l.quiz?.questions?.length),
      uploadInProgress: !!l.uploadInProgress,
    })),
  }));
}

export function mapDraftToManageCourse(course) {
  const lessons = (course.modules || []).flatMap((m) =>
    (m.lessons || []).map((l) => ({
      id: l.id,
      title: l.title,
      type: l.type || 'video',
      duration: l.duration || `${l.durationMin || 0} min`,
      free: l.previewFree ?? l.free ?? false,
      published: course.status === 'PUBLISHED' || course.status === 'Published',
    }))
  );
  const status =
    course.status === 'PUBLISHED'
      ? 'Published'
      : course.status === 'DRAFT'
        ? 'Draft'
        : course.status === 'PENDING'
          ? 'Pending'
          : course.status || 'Draft';

  return {
    id: course.id,
    catalogCourseId: course.courseId ?? course.catalogCourseId ?? null,
    title: course.title,
    status,
    category: course.category || '—',
    students: Number(course.students ?? course.enrollmentCount ?? 0) || 0,
    rating: course.rating ?? 0,
    reviews: course.reviews ?? 0,
    revenue: course.revenue ?? '$0',
    completionRate: course.completionRate ?? 0,
    thumbnail: course.thumbnailUrl || null,
    thumbnailClass: course.thumbnailUrl
      ? null
      : 'bg-gradient-to-br from-blue-500 to-cyan-400',
    lessons,
    lessonCount: course.lessonCount ?? lessons.length,
    moduleCount: course.moduleCount ?? (course.modules?.length || 0),
  };
}

export async function syncCurriculumToBackend(user, token, courseId, modules) {
  const synced = [];
  let moduleOrder = 0;

  for (const mod of modules) {
    moduleOrder += 1;
    let moduleId = mod.serverId;
    if (!moduleId) {
      const created = await addModule(user, token, courseId, {
        title: mod.title,
        orderIndex: moduleOrder,
      });
      moduleId = created.id;
    } else {
      await updateModule(user, token, courseId, moduleId, {
        title: mod.title,
        orderIndex: moduleOrder,
      });
    }

    const syncedLessons = [];
    let lessonOrder = 0;
    for (const lesson of mod.lessons) {
      lessonOrder += 1;
      const payload = {
        title: lesson.title,
        type: lesson.type || 'video',
        durationMin: parseDurationMin(lesson.duration),
        orderIndex: lessonOrder,
        previewFree: !!lesson.free,
        contentUrl: lesson.contentUrl || undefined,
        readingContent: lesson.readingContent || undefined,
        summary: lesson.summary || undefined,
        quiz: lesson.quiz || undefined,
        uploadInProgress: !!lesson.uploadInProgress,
      };

      if (!lesson.serverId) {
        const created = await addLesson(user, token, courseId, moduleId, payload);
        syncedLessons.push({ ...lesson, serverId: created.id, id: created.id });
      } else {
        await updateLesson(user, token, courseId, lesson.serverId, payload);
        syncedLessons.push(lesson);
      }
    }

    synced.push({ ...mod, serverId: moduleId, id: moduleId, lessons: syncedLessons });
  }

  return synced;
}

export function buildCoursePayload(form, thumbnailUrl) {
  return {
    title: form.title.trim(),
    subtitle: form.subtitle?.trim() || '',
    description: form.description.trim(),
    category: form.category,
    level: form.level,
    language: form.language,
    outcomes: form.outcomes.filter((o) => o.trim()),
    tags: form.tags,
    requirements: form.requirements?.trim() || '',
    trackId: trackIdForCategory(form.category),
    thumbnailUrl: thumbnailUrl || undefined,
  };
}

export async function ensureCourseOnServer(user, token, courseId, form, thumbnailUrl) {
  const payload = buildCoursePayload(form, thumbnailUrl);
  if (courseId) {
    try {
      return await updateCourse(user, token, courseId, payload);
    } catch (err) {
      // Stale courseId (DB reset, different session, etc.) — create a new draft instead
      if (err?.status === 404) {
        return createCourseDraft(user, token, payload);
      }
      throw err;
    }
  }
  return createCourseDraft(user, token, payload);
}
