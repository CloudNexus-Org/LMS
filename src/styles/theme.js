/**
 * Reusable theme class strings — map to CSS tokens in src/styles/theme.css.
 * Import from here instead of hardcoding bg-white / dark:bg-[#000000].
 */

/** Full-page shell (courses, cart, catalog, etc.) */
export const pageShell = 'min-h-screen bg-page text-text';

/** Section / footer / hero base background */
export const pageBg = 'bg-page';

/** Standard page content with theme text */
export const pageSurface = 'bg-page text-text';

/** Footer wrapper */
export const footerShell =
  'border-t border-border bg-page dark:border-white/10';

/** Carousel / hero edge fades */
export const fadeEdgeLeft =
  'bg-gradient-to-r from-page via-page/80 to-transparent';
export const fadeEdgeRight =
  'bg-gradient-to-l from-page via-page/80 to-transparent';

/** Hero background vertical fades */
export const heroFadeBottom = 'bg-gradient-to-t from-page to-transparent';
export const heroFadeTop =
  'bg-gradient-to-t from-page via-page/40 to-transparent';

/** Card on page background */
export const themeCard =
  'rounded-2xl border border-border bg-surface shadow-[var(--shadow-card-value)] dark:border-white/10';

/** Dark-mode inverted text block (landing courses section) */
export const sectionTextDark =
  'dark:[&_h2]:text-white dark:[&_p]:text-white/70 dark:[&_.text-text]:text-white dark:[&_.text-muted]:text-white/65';

/** Browse / outline CTA on themed section */
export const sectionCta =
  'border border-border bg-elevated text-text hover:border-primary hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-primary/10';
