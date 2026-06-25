/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Vensure (vensure.com) section breaks + section metadata.
 *
 * Template-driven (homepage has 9 sections, 4 with styles), so it reads
 * payload.template.sections rather than hard-coded selectors. For each section,
 * in reverse document order:
 *   - inserts an <hr> before the section element when it is not the first section
 *   - appends a "Section Metadata" block (style cell) after the section element
 *     when the section defines a `style`.
 *
 * Section selectors come from page-templates.json (all verified present in
 * migration-work/cleaned.html). Runs in afterTransform only, after parsers have
 * built their blocks.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each template section to its DOM element (if present on the page).
  const resolved = sections.map((section) => ({
    section,
    el: section.selector ? element.querySelector(section.selector) : null,
  }));

  // Process in reverse so inserting nodes does not disturb earlier indices.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el) continue;

    // Section Metadata block after the section (only when a style is defined).
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (el.parentNode) {
        el.parentNode.insertBefore(block, el.nextSibling);
      }
    }

    // Section break before every section except the first.
    if (i > 0 && el.parentNode) {
      const hr = doc.createElement('hr');
      el.parentNode.insertBefore(hr, el);
    }
  }
}
