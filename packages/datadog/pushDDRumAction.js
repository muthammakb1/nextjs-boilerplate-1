/**
 * Datadog RUM — Event-to-Action Mapper
 *
 * Maps logical event names (from DD_EVENTS) to Datadog RUM action strings
 * via DD_EVENT_ACTION_MAP, then pushes using pushDDCustomAction.
 *
 * Components use event keys for decoupling — action strings live in constants.
 *
 * @param {string} event - The event identifier (use DD_EVENTS constant values).
 * @param {object} [payload={}] - Payload associated with the event.
 * @param {object} ddEventActionMap - DD_EVENT_ACTION_MAP from consuming app constants.
 * @returns {null}
 */
import pushDDCustomAction from './pushDDCustomAction';

const pushDDRumAction = (event, payload = {}, ddEventActionMap) => {
  if (typeof event !== 'string') {
    return null;
  }

  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  if (!ddEventActionMap || typeof ddEventActionMap !== 'object') {
    return null;
  }

  const action = ddEventActionMap[event];

  if (!action) {
    return null;
  }

  try {
    pushDDCustomAction(action, { ...payload });
  } catch (error) {
    // Silently fail
  }

  return null;
};

export default pushDDRumAction;
