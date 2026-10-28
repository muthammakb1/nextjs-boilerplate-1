/**
 * Adobe Data Layer — Event Helper Functions
 *
 * Pre-built event dispatchers for common analytics scenarios.
 * Each function constructs a properly-shaped payload and pushes it.
 *
 * Constants (ANALYTICS_EVENTS, ANALYTICS_DEFAULTS, ANALYTICS_INTERACTION_TYPES,
 * ANALYTICS_EVENT_INFO) are accepted as parameters from the consuming application.
 */

import setAnalyticsObj from './setAnalyticsObj';

/**
 * Track a page load.
 *
 * @param {object} params
 * @param {string} params.pageName - Logical page name (use ANALYTICS_PAGES constant)
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 * @param {object} params.analyticsDefaults - ANALYTICS_DEFAULTS constants from consuming app
 */
export const trackPageLoad = ({
  pageName,
  platform,
  userInfo,
  sessionData,
  context,
  analyticsEvents,
  analyticsDefaults,
} = {}) => {
  return setAnalyticsObj({
    event: analyticsEvents.PAGELOAD_NOFILTER,
    interactionType: analyticsEvents.PAGE_LOAD,
    page: {
      LOB: analyticsEvents.LOB,
      pageInfo: {
        pageName,
        journeyFlow: analyticsEvents.NOFILTERFLOW,
        siteSection: analyticsEvents.NOFILTERFLOW,
        language: analyticsDefaults.LANGUAGE,
        platform: platform,
      },
    },
    user: {
      customerID: userInfo?.customerNumberEncryptedForAnalytics
        ? userInfo?.customerNumberEncryptedForAnalytics
        : '',
      FFNumber: userInfo?.loyaltyMemberInfo?.FFN ? userInfo?.loyaltyMemberInfo?.FFN : '',
      tier: userInfo?.loyaltyMemberInfo?.tier ? userInfo?.loyaltyMemberInfo?.tier : '',
      type: sessionData?.rolecode ? sessionData?.rolecode : '',
      datadogSessionID: context?.session_id ? context?.session_id : '',
    },
  });
};

/**
 * Track a CTA / button click.
 *
 * @param {object} params
 * @param {string} params.eventName - Event name (e.g., "click_noFilter")
 * @param {string} params.pageName - Logical page name
 * @param {string} params.platform - "Web" or "Mweb"
 * @param {string} params.ctaName - Button/CTA label or identifier
 * @param {string} [params.ctaPosition] - Position on page
 * @param {string} [params.ctaComponent] - Component identifier
 * @param {object} [params.product] - Product-level data (e.g., { imageCount: "1" })
 * @param {object} [params.userInfo] - User info from skpv2
 * @param {object} [params.sessionData] - Session data from skpv2
 * @param {object} [params.context] - Datadog RUM context
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 * @param {object} params.analyticsDefaults - ANALYTICS_DEFAULTS constants from consuming app
 * @param {object} params.analyticsInteractionTypes - ANALYTICS_INTERACTION_TYPES constants from consuming app
 * @param {object} params.analyticsEventInfo - ANALYTICS_EVENT_INFO constants from consuming app
 */
export const trackCtaClick = ({
  eventName,
  interactionType,
  pageName,
  platform,
  ctaName,
  ctaPosition = '',
  ctaComponent,
  product,
  userInfo,
  sessionData,
  context,
  analyticsEvents,
  analyticsDefaults,
  analyticsInteractionTypes,
  analyticsEventInfo,
} = {}) => {
  const payload = {
    event: eventName || analyticsEvents.CLICK_NOFILTER,
    interactionType: interactionType || analyticsInteractionTypes.LINK_BUTTON_CLICK,
    page: {
      LOB: analyticsEvents.LOB,
      pageInfo: {
        pageName,
        journeyFlow: analyticsEvents.NOFILTERFLOW,
        siteSection: analyticsEvents.NOFILTERFLOW,
        language: analyticsDefaults.LANGUAGE,
        platform,
      },
      eventInfo: {
        name: ctaName,
        position: ctaPosition,
        component: ctaComponent || analyticsEventInfo.COMPONENT_NOFILTER,
      },
    },
    user: {
      customerID: userInfo?.customerNumberEncryptedForAnalytics || '',
      FFNumber: userInfo?.loyaltyMemberInfo?.FFN || '',
      tier: userInfo?.loyaltyMemberInfo?.tier || '',
      type: sessionData?.rolecode || '',
      datadogSessionID: context?.session_id || '',
    },
  };

  if (product) {
    payload.product = product;
  }

  return setAnalyticsObj(payload);
};

/**
 * Track navigation/link clicks.
 *
 * @param {object} params
 * @param {string} params.linkName - Display text or identifier of the link
 * @param {string} params.linkUrl - Destination URL
 * @param {string} [params.linkLocation] - Location on page (e.g., "header-nav", "footer")
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackLinkClick = ({
  linkName,
  linkUrl,
  linkLocation = '',
  extra = {},
  analyticsEvents,
} = {}) => {
  return setAnalyticsObj({
    event: analyticsEvents.LINK_CLICK,
    component: {
      linkName,
      linkUrl,
      linkLocation,
    },
    ...extra,
  });
};

/**
 * Track form interactions (start, step, submit, error).
 *
 * @param {object} params
 * @param {"formStart"|"formStep"|"formSubmit"|"formError"} params.formEvent - Form lifecycle event
 * @param {string} params.formName - Logical form name
 * @param {number} [params.formStep] - Current step number (for multi-step forms)
 * @param {string} [params.formStepName] - Current step label
 * @param {string} [params.errorMessage] - Error details (for formError)
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackFormEvent = ({
  formEvent,
  formName,
  formStep,
  formStepName = '',
  errorMessage = '',
  extra = {},
  analyticsEvents,
} = {}) => {
  const event = formEvent || analyticsEvents.FORM_START;
  return setAnalyticsObj({
    event,
    form: {
      formName,
      formStep: formStep || undefined,
      formStepName,
      ...(event === analyticsEvents.FORM_ERROR && { errorMessage }),
    },
    ...extra,
  });
};

/**
 * Track user authentication events.
 *
 * @param {object} params
 * @param {"loginSuccess"|"loginFail"|"logout"} params.authEvent - Auth event type
 * @param {string} [params.userId] - Hashed/anonymized user ID (never PII)
 * @param {string} [params.authMethod] - e.g., "email", "sso", "otp"
 * @param {string} [params.errorMessage] - Error reason for login failure
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackAuthEvent = ({
  authEvent,
  userId = '',
  authMethod = '',
  errorMessage = '',
  extra = {},
  analyticsEvents,
} = {}) => {
  const event = authEvent || analyticsEvents.LOGIN_SUCCESS;
  return setAnalyticsObj({
    event,
    user: {
      userId,
      authMethod,
      ...(event === analyticsEvents.LOGIN_FAIL && { errorMessage }),
    },
    ...extra,
  });
};

/**
 * Track modal open/close events.
 *
 * @param {object} params
 * @param {"modalOpen"|"modalClose"} params.modalEvent - Modal lifecycle event
 * @param {string} params.modalName - Identifier for the modal
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackModalEvent = ({ modalEvent, modalName, extra = {}, analyticsEvents } = {}) => {
  return setAnalyticsObj({
    event: modalEvent || analyticsEvents.MODAL_OPEN,
    component: {
      modalName,
    },
    ...extra,
  });
};

/**
 * Track video interactions.
 *
 * @param {object} params
 * @param {"videoPlay"|"videoPause"|"videoComplete"} params.videoEvent - Video lifecycle event
 * @param {string} params.videoName - Video title or identifier
 * @param {number} [params.videoDuration] - Total duration in seconds
 * @param {number} [params.videoCurrentTime] - Current position in seconds
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackVideoEvent = ({
  videoEvent,
  videoName,
  videoDuration,
  videoCurrentTime,
  extra = {},
  analyticsEvents,
} = {}) => {
  return setAnalyticsObj({
    event: videoEvent || analyticsEvents.VIDEO_PLAY,
    component: {
      videoName,
      videoDuration,
      videoCurrentTime,
    },
    ...extra,
  });
};

/**
 * Track errors (JS errors, API errors, etc.).
 *
 * @param {object} params
 * @param {string} params.errorMessage - Human-readable error description
 * @param {string} [params.errorCode] - Error code or HTTP status
 * @param {string} [params.errorSource] - Where the error occurred (e.g., "api", "form", "runtime")
 * @param {object} [params.extra] - Additional custom key-values
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackError = ({
  errorMessage,
  errorCode = '',
  errorSource = '',
  extra = {},
  analyticsEvents,
} = {}) => {
  return setAnalyticsObj({
    event: analyticsEvents.ERROR,
    error: {
      errorMessage,
      errorCode,
      errorSource,
    },
    ...extra,
  });
};

/**
 * Push a fully custom event.
 * Use when none of the pre-built helpers fit your use case.
 *
 * @param {string} eventName - Custom event name
 * @param {object} [payload] - Arbitrary payload object
 * @param {object} analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 */
export const trackCustomEvent = (eventName, payload = {}, analyticsEvents) => {
  return setAnalyticsObj({
    event: eventName || analyticsEvents.CUSTOM,
    ...payload,
  });
};

/**
 * Track UX error events (API failures, runtime errors).
 *
 * @param {object} params
 * @param {string} params.pageName - Logical page name
 * @param {string} params.interactionType - "Error Pageload" or "Error Link/Button Click"
 * @param {string} [params.errorCode] - Application error code
 * @param {string} [params.errorType] - Error type/category
 * @param {string} [params.errorSource] - Source of error (e.g., component name)
 * @param {string} [params.errorApiURL] - API URL that failed
 * @param {string|number} [params.errorStatusCode] - HTTP status code
 * @param {string} [params.errorStatusMessage] - HTTP status message
 * @param {string} [params.errorDisplayMessage] - User-facing error message
 * @param {object} [params.userInfo] - User info from skpv2
 * @param {object} [params.sessionData] - Session data
 * @param {object} [params.context] - Datadog RUM context
 * @param {object} params.analyticsEvents - ANALYTICS_EVENTS constants from consuming app
 * @param {object} params.analyticsDefaults - ANALYTICS_DEFAULTS constants from consuming app
 * @param {object} params.analyticsInteractionTypes - ANALYTICS_INTERACTION_TYPES constants from consuming app
 */
export const trackUxError = ({
  pageName,
  interactionType,
  errorCode = '',
  errorType = '',
  errorSource = '',
  errorApiURL = '',
  errorStatusCode = '',
  errorStatusMessage = '',
  errorDisplayMessage = '',
  userInfo,
  sessionData,
  context,
  analyticsEvents,
  analyticsDefaults,
  analyticsInteractionTypes,
} = {}) => {
  return setAnalyticsObj({
    event: analyticsEvents.UXERROR,
    interactionType: interactionType || analyticsInteractionTypes.ERROR_PAGELOAD,
    page: {
      LOB: analyticsEvents.LOB,
      pageInfo: {
        pageName,
        siteSection: analyticsEvents.NOFILTERFLOW,
        language: analyticsDefaults.LANGUAGE,
      },
      error: {
        code: errorCode,
        type: errorType,
        source: errorSource,
        apiURL: errorApiURL,
        statusCode: String(errorStatusCode),
        statusMessage: errorStatusMessage,
        displayMessage: errorDisplayMessage,
      },
    },
    user: {
      FFNumber: userInfo?.loyaltyMemberInfo?.FFN || '',
      tier: userInfo?.loyaltyMemberInfo?.tier || '',
      datadogSessionID: context?.session_id || '',
    },
  });
};
