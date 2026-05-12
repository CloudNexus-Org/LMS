/**
 * Safe localStorage helpers — never throw (private browsing, full quota,
 * disabled storage, SSR, etc. all fail gracefully).
 */

/**
 * Read a string value from localStorage.
 *
 * @param {string} key
 * @param {string | null} [fallback=null]
 * @returns {string | null}
 */
export function getStored(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Write a string value to localStorage.
 *
 * @param {string} key
 * @param {string} value
 * @returns {boolean}  true on success
 */
export function setStored(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read & JSON-parse a value from localStorage.
 *
 * @template T
 * @param {string} key
 * @param {T} fallback  returned when the key is missing or parse fails
 * @returns {T}
 */
export function getStoredJSON(key, fallback) {
  const raw = getStored(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * JSON-stringify & write a value to localStorage.
 *
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean}  true on success
 */
export function setStoredJSON(key, value) {
  try {
    return setStored(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

/**
 * Remove a key from localStorage.
 *
 * @param {string} key
 */
export function removeStored(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* swallow */
  }
}
