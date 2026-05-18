import posthog from 'posthog-js';

// In a real application, you would put this in your .env file
// VITE_POSTHOG_KEY=phc_XXXXXXXXXXXX
// VITE_POSTHOG_HOST=https://app.posthog.com
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'mock_key_for_development';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

export const initTelemetry = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Enable debug mode in development
      loaded: (posthog) => {
        if (import.meta.env.DEV) posthog.debug(false);
      },
      // Automatically capture pageviews
      capture_pageview: false, // We'll handle this manually via React Router
      capture_pageleave: true,
    });
  }
};

export const captureEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties);
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

export default posthog;
