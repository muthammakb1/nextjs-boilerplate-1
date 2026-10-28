import { normalizeAemResponse } from '../core/normalizeAemResponse.js';

/**
 * validateAemPage — runtime validation of AEM page JSON shape.
 *
 * Returns an array of error strings. Empty array = valid.
 * Designed for dev-time safety; disable in production if perf matters.
 *
 * Accepts either:
 *   - Raw GraphQL response: { data: { globalPageByPath: { item: { page, layout, contents } } } }
 *   - Pre-normalized: { page, layout, content }
 *   - Direct item shape: { page, layout, contents: { contentRef: [...] } }
 *
 * @param {object} rawPage - The AEM JSON (raw or normalized)
 * @returns {{ valid: boolean, errors: string[] }}
 *
 * @example
 *   const result = validateAemPage(json);
 *   if (!result.valid) console.error(result.errors);
 */
export function validateAemPage(rawPage) {
  const errors = [];

  if (!rawPage || typeof rawPage !== 'object') {
    return { valid: false, errors: ['Root must be a non-null object.'] };
  }

  // Normalize the response
  const page = normalizeAemResponse(rawPage);

  if (!page) {
    return {
      valid: false,
      errors: [
        'Could not normalize input. Expected GraphQL response ({ data: { globalPageByPath: { item } } }), direct item ({ page, layout, contents }), or normalized ({ page, layout, content }).',
      ],
    };
  }

  // page metadata
  if (!page.page || typeof page.page !== 'object') {
    errors.push('Missing `page` metadata object.');
  } else {
    if (!page.page.id) errors.push('`page.id` is required.');
    if (!page.page.path) errors.push('`page.path` is required.');
  }

  // layout
  if (!page.layout) {
    errors.push('Missing `layout` object.');
  } else if (!Array.isArray(page.layout.sections)) {
    errors.push('`layout.sections` must be an array.');
  } else {
    page.layout.sections.forEach((section, si) => {
      const prefix = `layout.sections[${si}]`;
      if (!section.id) errors.push(`${prefix}: missing \`id\`.`);
      if (!Array.isArray(section.components)) {
        errors.push(`${prefix}: \`components\` must be an array.`);
      } else {
        section.components.forEach((cmp, ci) => {
          const cPrefix = `${prefix}.components[${ci}]`;
          if (!cmp.id) errors.push(`${cPrefix}: missing \`id\`.`);
          if (!cmp.type) errors.push(`${cPrefix}: missing \`type\`.`);
          if (!cmp.contentRef) errors.push(`${cPrefix}: missing \`contentRef\`.`);
          if (typeof cmp.order !== 'number') errors.push(`${cPrefix}: \`order\` must be a number.`);
          if (!cmp.span) errors.push(`${cPrefix}: missing \`span\`.`);
        });
      }
    });
  }

  // content
  if (!Array.isArray(page.content)) {
    errors.push('`content` must be an array (after normalization).');
  } else {
    const ids = new Set();
    page.content.forEach((block, bi) => {
      if (!block.id) {
        errors.push(`content[${bi}]: missing \`id\`.`);
      } else if (ids.has(block.id)) {
        errors.push(`content[${bi}]: duplicate id "${block.id}".`);
      }
      ids.add(block.id);
    });

    // Cross-reference: every contentRef should point to an existing content block
    if (page.layout?.sections) {
      page.layout.sections.forEach((section) => {
        section.components?.forEach((cmp) => {
          if (cmp.contentRef && !ids.has(cmp.contentRef)) {
            errors.push(
              `Component "${cmp.id}" references contentRef "${cmp.contentRef}" which does not exist in content array.`,
            );
          }
        });
      });
    }
  }

  return { valid: errors.length === 0, errors };
}
