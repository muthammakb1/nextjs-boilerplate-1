'use client';

/**
 * AemSection — renders one AEM layout section inside a CSS grid row.
 *
 * This is the core rendering unit:
 *   - Iterates resolved components
 *   - Looks up each type in the registry
 *   - Renders the matched Component inside a span wrapper
 *   - Silently skips unregistered types (AEM removal = no render)
 *
 * @param {object}  props
 * @param {string}  props.sectionId     - AEM section id (used as HTML id)
 * @param {Array}   props.components    - Resolved component descriptors (from resolveSectionComponents)
 * @param {object}  props.registry      - Component registry (from createRegistry)
 * @param {object}  [props.extraProps]  - Extra props forwarded to each component's mapProps
 * @param {string}  [props.gridClassName]  - CSS class for the grid container (default: "aem-section-grid")
 * @param {object}  [props.spanStyles]     - CSS module object for span classes (e.g. styles from grid.module.css)
 * @param {string}  [props.sectionTag]     - HTML tag for the section (default: "section")
 * @param {Function} [props.renderComponent] - Custom render function (cmp, Component, props) → JSX
 */
export default function AemSection({
  sectionId,
  components,
  registry,
  extraProps = {},
  gridClassName = 'aem-section-grid',
  spanStyles = null,
  sectionTag: Tag = 'section',
  renderComponent,
}) {
  if (!components || components.length === 0) return null;

  return (
    <Tag id={sectionId} className={gridClassName}>
      {components.map((cmp) => {
        const entry = registry.get ? registry.get(cmp.type) : registry[cmp.type];
        if (!entry) return null;

        const { Component, mapProps } = entry;
        const componentProps =
          typeof mapProps === 'function' ? mapProps(cmp.data, extraProps) : cmp.data || {};

        // Resolve span class: prefer CSS module lookup, fallback to plain class
        const spanClass = spanStyles ? spanStyles[cmp.spanClass] || cmp.spanClass : cmp.spanClass;

        // Allow custom rendering
        if (typeof renderComponent === 'function') {
          return renderComponent(cmp, Component, componentProps, spanClass);
        }

        return (
          <div key={cmp.id} className={spanClass}>
            <Component {...componentProps} />
          </div>
        );
      })}
    </Tag>
  );
}
