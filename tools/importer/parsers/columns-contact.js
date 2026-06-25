/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns.
 * Source: https://vensure.com/ (.elementor-element-8a970b0)
 * Generated for xwalk project.
 *
 * This is a Columns block (core/franklin/components/columns): 2 columns, 1 row.
 * Per the field-hinting rules, Columns blocks must NOT contain field comments —
 * cells hold default content only.
 *   column 1 -> contact CTA (image, heading, copy, button)
 *   column 2 -> testimonial (quote, button, video-thumbnail link)
 */
export default function parse(element, { document }) {
  const inner = element.querySelector(':scope > .e-con-inner') || element;
  // The two direct child containers are the two columns.
  let columns = Array.from(inner.querySelectorAll(':scope > .e-con.e-child, :scope > .e-con'));
  if (columns.length < 2) {
    columns = Array.from(inner.children).filter((c) => c.classList.contains('e-con'));
  }

  // Build a content cell per column, collecting meaningful widgets in order.
  const buildCell = (col) => {
    const cell = [];
    if (!col) return cell;

    // Images (foreground / decorative), headings + text, buttons, and
    // linked video thumbnails — preserve source order.
    const widgets = Array.from(
      col.querySelectorAll(
        '.elementor-widget-image, .elementor-widget-text-editor, .elementor-widget-button',
      ),
    );

    widgets.forEach((w) => {
      if (w.classList.contains('elementor-widget-image')) {
        // Keep linked-image wrappers (e.g. video lightbox) intact; else the img.
        const link = w.querySelector('a');
        const img = w.querySelector('img');
        if (link) {
          cell.push(link);
        } else if (img) {
          cell.push(img);
        }
      } else if (w.classList.contains('elementor-widget-button')) {
        const a = w.querySelector('a');
        if (a) cell.push(a);
      } else {
        // text editor: push its child nodes (h3 / p / em)
        Array.from(w.children).forEach((child) => cell.push(child));
      }
    });
    return cell;
  };

  const col1 = buildCell(columns[0]);
  const col2 = buildCell(columns[1]);

  if (col1.length === 0 && col2.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
