export const AUTH_EASE = [0.16, 1, 0.3, 1];

export const authItemMotion = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: AUTH_EASE, delay },
});

export const authCardMotion = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.65, ease: AUTH_EASE },
};
