/**
 * normalizeAemResponse
 *
 * Normalizes the raw AEM GraphQL response into the flat shape
 * the renderer expects: { page, layout, content }.
 *
 * Handles both:
 *   - Raw GraphQL wrapper: { data: { globalPageByPath: { item: { page, layout, contents } } } }
 *   - Already-normalized: { page, layout, content }
 *
 * The AEM response stores content under `contents.contentRef` (an array),
 * which this normalizer flattens to a plain `content` array.
 *
 * @param {object} raw - Raw AEM JSON response or already-normalized page object
 * @returns {{ page: object, layout: object, content: Array } | null}
 *
 * @example
 *   // From GraphQL response
 *   const normalized = normalizeAemResponse(graphqlResponse);
 *   // → { page: {...}, layout: {...}, content: [...] }
 *
 *   // Already normalized — passes through
 *   const same = normalizeAemResponse({ page, layout, content });
 */
export function normalizeAemResponse(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Already normalized (has page + layout + content at top level)
  if (raw.page && raw.layout && Array.isArray(raw.content)) {
    return raw;
  }

  // Unwrap GraphQL response: data.globalPageByPath.item
  const item = raw?.data?.globalPageByPath?.item;
  if (item) {
    return extractFromItem(item);
  }

  // Direct item shape (without GraphQL data wrapper)
  if (raw.page && raw.layout && raw.contents) {
    return extractFromItem(raw);
  }

  // Fallback: try to use as-is if it has page and layout
  if (raw.page && raw.layout) {
    return {
      page: raw.page,
      layout: raw.layout,
      content: raw.content || [],
    };
  }

  return null;
}

/**
 * Extracts and normalizes data from the AEM item shape.
 *
 * @param {object} item - { page, layout, contents: { contentRef: [...] } }
 * @returns {{ page: object, layout: object, content: Array }}
 */
function extractFromItem(item) {
  const page = item.page || {};
  const layout = item.layout || {};

  // Content lives at `contents.contentRef` in AEM response
  let content = [];
  if (item.contents) {
    if (Array.isArray(item.contents.contentRef)) {
      content = item.contents.contentRef;
    } else if (Array.isArray(item.contents)) {
      content = item.contents;
    }
  } else if (Array.isArray(item.content)) {
    content = item.content;
  }

  return { page, layout, content };
}
