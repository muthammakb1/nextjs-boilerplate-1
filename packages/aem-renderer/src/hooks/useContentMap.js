'use client';

import { createContext, useContext, useMemo } from 'react';
import { buildContentMap } from '../core/buildContentMap.js';

const ContentMapContext = createContext(new Map());

/**
 * Provider that makes the content map available to any nested component.
 *
 * Accepts either:
 *   - Plain content array: [{ id, ... }, ...]
 *   - AEM contents object: { contentRef: [{ id, ... }, ...] }
 *
 * @param {object} props
 * @param {Array | { contentRef: Array }}  props.content  - AEM content (array or contents object)
 * @param {React.ReactNode} props.children
 */
export function ContentMapProvider({ content, children }) {
  const contentMap = useMemo(() => buildContentMap(content), [content]);
  return <ContentMapContext.Provider value={contentMap}>{children}</ContentMapContext.Provider>;
}

/**
 * Access the content map from context.
 *
 * @returns {Map<string, object>}
 *
 * @example
 *   const contentMap = useContentMap();
 *   const heroData = contentMap.get("heroBanner-1");
 */
export function useContentMap() {
  return useContext(ContentMapContext);
}
