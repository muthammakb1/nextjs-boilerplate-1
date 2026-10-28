'use client';

import { useMemo } from 'react';
import { normalizeAemResponse } from '../core/normalizeAemResponse.js';
import { buildContentMap } from '../core/buildContentMap.js';
import { resolvePageSections } from '../core/resolveSection.js';

/**
 * useAemPage — convenience hook that resolves an entire AEM page JSON
 * into a content map and resolved sections in one call.
 *
 * Accepts either:
 *   - Raw GraphQL response: { data: { globalPageByPath: { item: { page, layout, contents } } } }
 *   - Pre-normalized: { page, layout, content }
 *   - Direct item shape: { page, layout, contents: { contentRef: [...] } }
 *
 * @param {object} rawPage  - AEM page JSON (raw or normalized)
 * @param {object} [options] - { spanMap, spanClassResolver }
 * @returns {{ meta: object, contentMap: Map, sections: Array }}
 *
 * @example
 *   const { meta, contentMap, sections } = useAemPage(aemGraphQLResponse);
 *   // sections = [{ section, components: [...resolved] }, ...]
 */
export function useAemPage(rawPage, options = {}) {
  const page = useMemo(() => normalizeAemResponse(rawPage), [rawPage]);

  const contentMap = useMemo(() => buildContentMap(page?.content), [page?.content]);

  const sections = useMemo(
    () => resolvePageSections(page?.layout, contentMap, options),
    [page?.layout, contentMap, options],
  );

  return {
    meta: page?.page || {},
    contentMap,
    sections,
  };
}
