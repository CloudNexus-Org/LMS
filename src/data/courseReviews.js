export const STUDENT_COURSES_FOR_REVIEW = [
  {
    id: 1,
    slug: "aws-solution-architect",
    title: "AWS Solution Architect",
    instructor: "Dr. Arjan Singh",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    progress: 65,
    status: "in-progress",
    platformRating: 4.8,
  },
  {
    id: 2,
    slug: "azure-generative-ai",
    title: "Azure Generative AI Services",
    instructor: "Sarah Jenkins",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop",
    progress: 100,
    status: "completed",
    platformRating: 4.9,
  },
  {
    id: 3,
    slug: "modern-javascript",
    title: "Modern JavaScript",
    instructor: "Prof. David Miller",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    progress: 12,
    status: "in-progress",
    platformRating: 4.7,
  },
  {
    id: 5,
    slug: "python-data-engineering",
    title: "Python for Data Engineering",
    instructor: "Dr. Angela Yu",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    progress: 100,
    status: "completed",
    platformRating: 4.8,
  },
  {
    id: 7,
    slug: "docker-essentials",
    title: "Docker Essentials",
    instructor: "Michael Chang",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=800&auto=format&fit=crop",
    progress: 82,
    status: "in-progress",
    platformRating: 4.6,
  },
];

const STORAGE_KEY = "lms-student-course-reviews";

const SEED_REVIEWS = {
  2: {
    courseId: 2,
    rating: 5,
    title: "Excellent deep dive into Azure AI",
    body: "Clear explanations on RAG pipelines and Azure OpenAI. Projects felt production-ready.",
    createdAt: "2026-05-18T10:00:00.000Z",
    helpful: 12,
  },
};

export function loadStudentReviews() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return { ...SEED_REVIEWS };
}

export function saveStudentReviews(reviews) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function upsertCourseReview(reviews, courseId, payload) {
  const next = {
    ...reviews,
    [courseId]: {
      courseId,
      rating: payload.rating,
      title: payload.title.trim(),
      body: payload.body.trim(),
      createdAt: reviews[courseId]?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpful: reviews[courseId]?.helpful ?? 0,
    },
  };
  saveStudentReviews(next);
  return next;
}

export function deleteCourseReview(reviews, courseId) {
  const next = { ...reviews };
  delete next[courseId];
  saveStudentReviews(next);
  return next;
}

export function getReviewStats(reviews, courses) {
  const values = Object.values(reviews);
  const reviewedCount = values.length;
  const pendingCount = courses.filter((c) => !reviews[c.id]).length;
  const avgRating =
    reviewedCount > 0
      ? +(values.reduce((sum, r) => sum + r.rating, 0) / reviewedCount).toFixed(1)
      : 0;

  return { reviewedCount, pendingCount, avgRating, totalHelpful: values.reduce((s, r) => s + (r.helpful ?? 0), 0) };
}
