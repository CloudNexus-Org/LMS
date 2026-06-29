import { featuredCourses } from '@/data/courses';
import { findExploreItem } from '@/data/exploreMenu';

function courseHaystack(course) {
  return [
    course.title,
    course.description,
    course.slug,
    course.professor,
    course.difficulty,
    ...(course.outcomes ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

export function matchesKeywords(course, keywords = []) {
  if (!keywords.length) return true;
  const haystack = courseHaystack(course);
  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export function filterCoursesByExploreItem(type, slug) {
  const item = findExploreItem(type, slug);
  if (!item?.keywords) return featuredCourses;
  return featuredCourses.filter((course) => matchesKeywords(course, item.keywords));
}

export function filterCoursesByQuery(query) {
  const q = query.trim().toLowerCase();
  if (!q) return featuredCourses;
  return featuredCourses.filter((course) => courseHaystack(course).includes(q));
}
