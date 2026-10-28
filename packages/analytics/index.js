/**
 * Adobe Data Layer Analytics — Barrel Export
 *
 * Usage:
 *   import setAnalyticsObj from "@indigo-shared-lib/analytics";
 *   import { trackPageLoad, trackCtaClick } from "@indigo-shared-lib/analytics";
 */

export { default } from './setAnalyticsObj';
export {
  trackPageLoad,
  trackCtaClick,
  trackLinkClick,
  trackFormEvent,
  trackAuthEvent,
  trackModalEvent,
  trackVideoEvent,
  trackError,
  trackCustomEvent,
  trackUxError,
} from './events';
