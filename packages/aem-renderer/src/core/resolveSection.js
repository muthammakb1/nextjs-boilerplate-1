import { resolveSpanClass, DEFAULT_SPAN_MAP } from './spanMap.js';

/**
 * Resolve all components in a section:
 *   1. Sort by `order`
 *   2. Attach resolved CSS span class
 *   3. Attach content data from the content map
 *
 * @param {object}  section    - An AEM layout section
 * @param {Map}     contentMap - O(1) content lookup (from buildContentMap)
 * @param {object}  [options]
 * @param {object}  [options.spanMap]           - Custom span map
 * @param {Function} [options.spanClassResolver] - Custom (token) → className function
 * @returns {Array<object>} Resolved component descriptors
 *
 * @example
 *   const components = resolveSectionComponents(section, contentMap);
 *   // [{ id, type, span, order, contentRef, spanClass, data }]
 */
export function resolveSectionComponents(section, contentMap, options = {}) {
  const { spanMap = DEFAULT_SPAN_MAP, spanClassResolver } = options;

  if (!section?.components || !Array.isArray(section.components)) return [];

  return [...section.components]
    .sort((a, b) => a.order - b.order)
    .map((cmp) => ({
      ...cmp,
      spanClass: spanClassResolver
        ? spanClassResolver(cmp.span)
        : resolveSpanClass(cmp.span, spanMap),
      data: contentMap.get(cmp.contentRef) || null,
    }));
}

/**
 * Resolve all sections in a page layout.
 *
 * @param {object} layout     - The AEM `layout` object containing `sections`
 * @param {Map}    contentMap - O(1) content lookup
 * @param {object} [options]  - Same options as resolveSectionComponents
 * @returns {Array<{ section: object, components: Array }>}
 */
export function resolvePageSections(layout, contentMap, options = {}) {
  if (!layout?.sections || !Array.isArray(layout.sections)) return [];

  return layout.sections.map((section) => ({
    section,
    components: resolveSectionComponents(section, contentMap, options),
  }));
}
