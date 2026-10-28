'use client';

import { RegistryProvider } from '../registry/RegistryContext.js';
import { normalizeAemResponse } from '../core/normalizeAemResponse.js';
import { buildContentMap } from '../core/buildContentMap.js';
import { resolveSectionComponents } from '../core/resolveSection.js';
import AemSection from './AemSection.jsx';

/**
 * AemPageRenderer — renders an entire AEM page from JSON.
 *
 * This is the top-level component that:
 *   1. Normalizes the AEM response (handles GraphQL wrapper or direct item)
 *   2. Builds the content map from the content array
 *   3. Iterates layout sections in order
 *   4. Resolves components per section
 *   5. Applies section-level wrappers (e.g., FormProvider) if declared
 *   6. Renders each section via <AemSection />
 *
 * Accepts either:
 *   - Raw GraphQL response: { data: { globalPageByPath: { item: { page, layout, contents } } } }
 *   - Pre-normalized: { page, layout, content }
 *   - Direct item shape: { page, layout, contents: { contentRef: [...] } }
 *
 * @param {object}  props
 * @param {object}  props.page              - AEM page JSON (raw or normalized)
 * @param {object}  props.registry          - Component registry (from createRegistry)
 * @param {object}  [props.extraProps]      - Extra props forwarded to component mapProps
 * @param {object}  [props.wrappers]        - { [componentType]: WrapperComponent } for section-level wrapping
 * @param {object}  [props.sectionWrappers] - { [sectionId]: WrapperComponent } for wrapping by section id
 * @param {object}  [props.spanMap]         - Custom span map override
 * @param {Function} [props.spanClassResolver] - Custom (token) → className function
 * @param {string}  [props.gridClassName]   - CSS class for section grids
 * @param {object}  [props.spanStyles]      - CSS module object for span classes
 * @param {string}  [props.className]       - CSS class for the outer wrapper
 * @param {string}  [props.tag]             - HTML tag for the outer wrapper (default: "main")
 * @param {Function} [props.renderSection]  - Custom section render (section, components, sectionEl) → JSX
 */
export default function AemPageRenderer({
  page: rawPage,
  registry,
  extraProps = {},
  wrappers = {},
  sectionWrappers = {},
  spanMap,
  spanClassResolver,
  gridClassName,
  spanStyles,
  className,
  tag: OuterTag = 'main',
  renderSection,
}) {
  // Normalize: handles GraphQL wrapper, contents.contentRef, or already-normalized
  const page = normalizeAemResponse(rawPage);

  if (!page || !page.layout?.sections || !page.content) {
    console.warn(
      '[aem-renderer] AemPageRenderer: could not resolve layout.sections or content from input',
    );
    return null;
  }

  const contentMap = buildContentMap(page.content);

  const resolveOptions = {};
  if (spanMap) resolveOptions.spanMap = spanMap;
  if (spanClassResolver) resolveOptions.spanClassResolver = spanClassResolver;

  return (
    <RegistryProvider registry={registry}>
      <OuterTag className={className}>
        {page.layout.sections.map((section) => {
          const components = resolveSectionComponents(section, contentMap, resolveOptions);

          if (components.length === 0) return null;

          const sectionEl = (
            <AemSection
              key={section.id}
              sectionId={section.id}
              components={components}
              registry={registry}
              extraProps={extraProps}
              gridClassName={gridClassName}
              spanStyles={spanStyles}
            />
          );

          // Check for section-level wrapper (by section id)
          if (sectionWrappers[section.id]) {
            const SectionWrapper = sectionWrappers[section.id];
            return <SectionWrapper key={section.id}>{sectionEl}</SectionWrapper>;
          }

          // Check for component-type wrapper (wraps entire section if any component matches)
          const matchedType = components.find((c) => wrappers[c.type]);
          if (matchedType) {
            const TypeWrapper = wrappers[matchedType.type];
            return <TypeWrapper key={section.id}>{sectionEl}</TypeWrapper>;
          }

          // Custom section render hook
          if (typeof renderSection === 'function') {
            return renderSection(section, components, sectionEl);
          }

          return sectionEl;
        })}
      </OuterTag>
    </RegistryProvider>
  );
}
