import pushDDCustomAction from './pushDDCustomAction';

/**
 * Tracks a Datadog RUM event for an API call.
 *
 * @param {object} params
 * @param {string} params.action - DD action string (from DD_API_ACTIONS)
 * @param {string} params.apiurl - Full API URL called
 * @param {string} params.method - HTTP method (GET, POST, etc.)
 * @param {string} params.mfname - Module/feature name (from DD_MF_NAMES)
 * @param {object|null} [params.requestbody] - Request body (null for GET)
 * @param {object|null} [params.response] - Parsed response data
 * @param {number} params.responseTime - Time taken in seconds
 * @param {number} params.statusCode - HTTP status code
 * @param {string} [params.error] - Error string (empty on success)
 * @param {string} [params.errorCode] - Error code from API
 * @param {string} [params.errorMessage] - Error message from API
 * @param {string} [params.errorMessageForUser] - User-facing error message
 */
const trackDDApiEvent = ({
  action,
  apiurl,
  method,
  mfname,
  requestbody = null,
  response = null,
  responseTime = 0,
  statusCode = 0,
  error = '',
  errorCode = '',
  errorMessage = '',
  errorMessageForUser = '',
}) => {
  if (!action) return;

  const payload = {
    apiurl,
    method,
    mfname,
    requestbody,
    response,
    responseTime,
    error,
    statusCode,
    errorCode,
    errorMessage,
    errorMessageForUser,
  };

  pushDDCustomAction(action, payload);
};

export default trackDDApiEvent;
