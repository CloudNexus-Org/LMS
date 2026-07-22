// Telemetry is optional and must never block first paint.
// Dynamic-import posthog after the browser is idle.

let posthogInstance = null;

export const initTelemetry = () => {
  if (typeof window === 'undefined') return;

  const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
  const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
  if (!POSTHOG_KEY || POSTHOG_KEY.includes('mock')) return;

  const boot = () => {
    import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          loaded: (ph) => {
            if (import.meta.env.DEV) ph.debug(false);
          },
          capture_pageview: false,
          capture_pageleave: true,
        });
        posthogInstance = posthog;
      })
      .catch(() => {
        /* telemetry must never break the app */
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(boot, { timeout: 4000 });
  } else {
    setTimeout(boot, 2000);
  }
};

const posthogProxy = new Proxy(
  {},
  {
    get(_t, prop) {
      if (posthogInstance && typeof posthogInstance[prop] !== 'undefined') {
        const val = posthogInstance[prop];
        return typeof val === 'function' ? val.bind(posthogInstance) : val;
      }
      if (prop === 'capture' || prop === 'identify' || prop === 'reset') {
        return () => {};
      }
      return undefined;
    },
  }
);

export default posthogProxy;
