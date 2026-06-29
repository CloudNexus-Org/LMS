/**
 * Explore navigation — trimmed to Cloud Nexus course & track catalog.
 */

export const EXPLORE_TYPES = {
  roles: 'roles',
  categories: 'categories',
  skills: 'skills',
  certificates: 'certificates',
  degrees: 'degrees',
  certifications: 'certifications',
};

export const EXPLORE_ROLES = [
  { slug: 'cloud-architect', label: 'Cloud Architect', keywords: ['aws', 'azure', 'gcp', 'cloud', 'architect', 'solution'] },
  { slug: 'devops-engineer', label: 'DevOps Engineer', keywords: ['devops', 'docker', 'kubernetes', 'container'] },
  { slug: 'data-analyst', label: 'Data Analyst', keywords: ['data', 'python', 'analytics', 'pipeline'] },
  { slug: 'ml-engineer', label: 'Machine Learning Engineer', keywords: ['ai', 'machine', 'generative', 'azure'] },
  { slug: 'full-stack-developer', label: 'Full Stack Developer', keywords: ['javascript', 'react', 'frontend', 'modern'] },
  { slug: 'backend-developer', label: 'Backend Developer', keywords: ['go', 'golang', 'microservice', 'grpc'] },
];

export const EXPLORE_CATEGORIES = [
  { slug: 'artificial-intelligence', label: 'Artificial Intelligence', keywords: ['ai', 'generative', 'machine', 'neural'] },
  { slug: 'cloud-computing', label: 'Cloud Computing', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
  { slug: 'data-science', label: 'Data Science', keywords: ['data', 'python', 'pipeline', 'spark'] },
  { slug: 'devops', label: 'DevOps & Infrastructure', keywords: ['devops', 'docker', 'kubernetes', 'container'] },
  { slug: 'software-development', label: 'Software Development', keywords: ['javascript', 'go', 'python', 'golang'] },
  { slug: 'containers', label: 'Container Technologies', keywords: ['docker', 'kubernetes', 'container'] },
];

export const EXPLORE_SKILLS = [
  { slug: 'python', label: 'Python', keywords: ['python'] },
  { slug: 'aws', label: 'AWS', keywords: ['aws'] },
  { slug: 'kubernetes', label: 'Kubernetes', keywords: ['kubernetes', 'k8s'] },
  { slug: 'docker', label: 'Docker', keywords: ['docker', 'container'] },
  { slug: 'javascript', label: 'JavaScript', keywords: ['javascript', 'es6'] },
  { slug: 'azure', label: 'Azure', keywords: ['azure'] },
];

export const EXPLORE_CERTIFICATES = [
  { slug: 'cloud', label: 'Cloud Certifications', keywords: ['aws', 'azure', 'gcp', 'cloud', 'exam'] },
  { slug: 'devops', label: 'DevOps Certifications', keywords: ['docker', 'kubernetes', 'devops', 'container'] },
  { slug: 'ai-ml', label: 'AI & ML Certifications', keywords: ['ai', 'generative', 'machine', 'azure'] },
];

export const EXPLORE_DEGREES = [
  { slug: 'learning-paths', label: 'Career Learning Paths', to: '/tracks' },
  { slug: 'cloud-track', label: 'Cloud Engineer Track', to: '/tracks/cloud' },
  { slug: 'ai-track', label: 'AI Engineer Track', to: '/tracks/ai' },
  { slug: 'fullstack-track', label: 'Full Stack Track', to: '/tracks/fullstack' },
];

export const EXPLORE_CERTIFICATIONS = [
  { slug: 'aws-saa', label: 'AWS Solutions Architect', keywords: ['aws', 'solution architect', 'exam'] },
  { slug: 'gcp-ace', label: 'GCP Cloud Engineer', keywords: ['gcp', 'cloud engineer', 'exam'] },
  { slug: 'cka', label: 'Kubernetes Administrator', keywords: ['kubernetes', 'k8s', 'exam'] },
];

/** Sections shown in the desktop mega-menu (compact, no scroll). */
export const MEGA_MENU_SECTIONS = [
  { id: 'roles', title: 'Explore roles', type: 'roles', items: EXPLORE_ROLES },
  { id: 'categories', title: 'Explore categories', type: 'categories', items: EXPLORE_CATEGORIES },
  { id: 'skills', title: 'Trending skills', type: 'skills', items: EXPLORE_SKILLS },
];

export const EXPLORE_SECTIONS = {
  roles: EXPLORE_ROLES,
  categories: EXPLORE_CATEGORIES,
  skills: EXPLORE_SKILLS,
  certificates: EXPLORE_CERTIFICATES,
  certifications: EXPLORE_CERTIFICATIONS,
};

export const EXPLORE_SECTION_LABELS = {
  roles: 'Explore roles',
  categories: 'Explore categories',
  skills: 'Explore trending skills',
  certificates: 'Earn a Professional Certificate',
  certifications: 'Prepare for a certification exam',
  degrees: 'Earn a career track',
};

export function explorePath(type, slug) {
  if (type === 'degrees') return slug ? `/tracks/${slug}` : '/tracks';
  if (slug) return `/explore/${type}/${slug}`;
  return `/explore/${type}`;
}

export function findExploreItem(type, slug) {
  if (type === 'degrees') {
    return EXPLORE_DEGREES.find((item) => item.slug === slug) ?? null;
  }
  const list = EXPLORE_SECTIONS[type];
  if (!list) return null;
  return list.find((item) => item.slug === slug) ?? null;
}

export function getExploreSectionItems(type) {
  if (type === 'degrees') return EXPLORE_DEGREES;
  return EXPLORE_SECTIONS[type] ?? [];
}
