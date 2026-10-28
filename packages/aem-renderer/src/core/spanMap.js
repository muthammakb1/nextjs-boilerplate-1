/**
 * Default semantic span tokens.
 *
 * AEM authors use these tokens to express layout *intent*.
 * The consuming project maps them to actual CSS classes via a resolver.
 *
 * Each token defines responsive column spans on a 12-column conceptual grid.
 * The `cssClass` is the default class name used by the bundled grid CSS.
 */
export const DEFAULT_SPAN_MAP = {
  full: { mobile: 12, tablet: 12, desktop: 12, cssClass: 'aem-span-full' },
  twoThird: { mobile: 12, tablet: 12, desktop: 8, cssClass: 'aem-span-twoThird' },
  half: { mobile: 12, tablet: 12, desktop: 6, cssClass: 'aem-span-half' },
  third: { mobile: 12, tablet: 12, desktop: 4, cssClass: 'aem-span-third' },
  quarter: { mobile: 6, tablet: 6, desktop: 3, cssClass: 'aem-span-quarter' },
  auto: { mobile: 12, tablet: 12, desktop: 12, cssClass: 'aem-span-auto' },
};

/**
 * Create a custom span map by merging overrides onto the defaults.
 *
 * @param {object} [overrides] - Partial or full span definitions to merge
 * @returns {object} Merged span map
 *
 * @example
 *   const spanMap = createSpanMap({
 *     wide: { mobile: 12, tablet: 10, desktop: 10, cssClass: "aem-span-wide" },
 *   });
 */
export function createSpanMap(overrides = {}) {
  return { ...DEFAULT_SPAN_MAP, ...overrides };
}

/**
 * Resolve a span token to its CSS class name.
 *
 * @param {string} spanToken - e.g. "full", "third"
 * @param {object} [spanMap] - Custom span map (defaults to DEFAULT_SPAN_MAP)
 * @returns {string} CSS class name
 */
export function resolveSpanClass(spanToken, spanMap = DEFAULT_SPAN_MAP) {
  const entry = spanMap[spanToken] || spanMap.full || DEFAULT_SPAN_MAP.full;
  return entry.cssClass;
}
