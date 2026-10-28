/**
 * @headless-aem/renderer
 *
 * AEM Headless layout renderer for Next.js.
 * AEM decides what/where/order; Next.js decides grid/responsive/enforcement.
 *
 * Usage:
 *   import {
 *     AemPageRenderer,
 *     AemSection,
 *     createRegistry,
 *     buildContentMap,
 *     normalizeAemResponse,
 *     validateAemPage,
 *   } from '@headless-aem/renderer';
 */

// ── Core utilities ──
export { buildContentMap } from './core/buildContentMap.js';
export { normalizeAemResponse } from './core/normalizeAemResponse.js';
export { resolveSpanClass, createSpanMap, DEFAULT_SPAN_MAP } from './core/spanMap.js';
export { resolveSectionComponents, resolvePageSections } from './core/resolveSection.js';

// ── Registry ──
export { createRegistry } from './registry/createRegistry.js';
export { RegistryProvider, useRegistry } from './registry/RegistryContext.js';

// ── Components ──
export { default as AemSection } from './components/AemSection.jsx';
export { default as AemPageRenderer } from './components/AemPageRenderer.jsx';

// ── Hooks ──
export { useAemPage } from './hooks/useAemPage.js';
export { ContentMapProvider, useContentMap } from './hooks/useContentMap.js';

// ── Validation ──
export { validateAemPage } from './validation/validateAemPage.js';
