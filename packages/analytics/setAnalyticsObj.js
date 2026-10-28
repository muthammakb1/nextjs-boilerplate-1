/**
 * Core Adobe Data Layer push utility.
 *
 * Pushes a single event object to window.adobeDataLayer.
 * Safe for SSR — no-ops when window is unavailable.
 *
 * @param {object} analyticsData - Object containing at least the `event` key.
 * @returns {Promise<void|string>} Resolves after push or with error message.
 */
const setAnalyticsObj = (analyticsData = {}) => {
  return new Promise((resolve) => {
    try {
      if (typeof window !== 'undefined' && Array.isArray(window?.adobeDataLayer)) {
        window?.adobeDataLayer?.push(analyticsData);
        setTimeout(() => resolve(), 300);
      } else {
        resolve('adobeDataLayer not available');
      }
    } catch (error) {
      resolve('adobeDataLayer not available');
    }
  });
};

export default setAnalyticsObj;
