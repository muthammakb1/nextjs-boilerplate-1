/**
 * buildContentMap
 *
 * Converts the AEM content into an O(1) lookup Map keyed by each
 * content block's `id`.
 *
 * Accepts multiple input shapes:
 *   - Plain array: [{ id, ... }, ...]
 *   - AEM contents object: { contentRef: [{ id, ... }, ...] }
 *
 * @param {Array<{ id: string }> | { contentRef: Array<{ id: string }> }} contentInput
 * @returns {Map<string, object>}
 *
 * @example
 *   // Plain array
 *   const map = buildContentMap(aemPage.content);
 *   map.get("hero-1"); // → { id: "hero-1", title: "..." }
 *
 *   // AEM contents.contentRef shape
 *   const map2 = buildContentMap(aemPage.contents);
 *   map2.get("heroBanner-1");
 */
export function buildContentMap(contentInput) {
  let contentArray = contentInput;

  // Handle AEM `contents: { contentRef: [...] }` shape
  if (contentInput && !Array.isArray(contentInput) && typeof contentInput === 'object') {
    if (Array.isArray(contentInput.contentRef)) {
      contentArray = contentInput.contentRef;
    } else {
      return new Map();
    }
  }

  if (!Array.isArray(contentArray)) return new Map();
  return new Map(contentArray.map((c) => [c.id, c]));
}
