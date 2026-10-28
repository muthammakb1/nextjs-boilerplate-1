/**
 * Merges multiple class name strings, filtering out falsy values.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Type-safe check if a value is not null or undefined.
 */
export function isNotNil(value) {
  return value !== null && value !== undefined;
}

/**
 * Creates a debounced version of a function.
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Creates a throttled version of a function.
 */
export function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generates a unique ID string.
 */
export function generateId(prefix = 'indigo') {
  const array = new Uint8Array(5);
  (typeof crypto !== 'undefined' ? crypto : require('crypto').webcrypto).getRandomValues(array);
  const id = Array.from(array, (b) => b.toString(36).padStart(2, '0'))
    .join('')
    .substring(0, 7);
  return `${prefix}-${id}`;
}

/**
 * Checks if code is running in a browser environment.
 */
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Checks if code is running on the server (SSR).
 */
export function isServer() {
  return !isBrowser();
}

/**
 * Safely access nested object properties.
 */
export function get(obj, path, defaultValue) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  return result ?? defaultValue;
}

export * from './helpers/user';
export * from '../localStorageUtils';
