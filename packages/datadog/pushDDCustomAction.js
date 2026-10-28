/**
 * Core Datadog RUM custom action push utility.
 *
 * Pushes a named action with payload to window.DD_RUM.
 * Safe for SSR — no-ops when window or DD_RUM is unavailable.
 *
 * @param {string} action - The action name to log in Datadog RUM.
 * @param {object} [payload={}] - Key-value payload associated with the action.
 */
const pushDDCustomAction = (action, payload = {}) => {
  try {
    console.log('dataDog', { action, payload });
    if (!action || typeof action !== 'string') {
      return;
    }

    if (!payload || typeof payload !== 'object') {
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.DD_RUM &&
      typeof window.DD_RUM.onReady === 'function'
    ) {
      window.DD_RUM.onReady(() => {
        if (typeof window.DD_RUM.addAction === 'function') {
          window.DD_RUM.addAction(action, { ...payload });
        }
      });
    }
  } catch (error) {
    // Silently fail — Datadog RUM not available
  }
};

export default pushDDCustomAction;
