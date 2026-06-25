/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-text-image. Base: columns.
 * Source: https://vensure.com/ (.elementor-element-e9ed42f)
 * Generated for xwalk project.
 *
 * Columns block (core/franklin/components/columns): 2 columns, 1 row.
 * Columns blocks must NOT contain field comments — default content only.
 *   column 1 -> text (heading + paragraph)
 *   column 2 -> image
 */
export default function parse(element, { document }) {
  const inner = element.querySelector(':scope > .e-con-inner') || element;
  let columns = Array.from(inner.querySelectorAll(':scope > .e-con.e-child, :scope > .e-con'));
  if (columns.length < 2) {
    columns = Array.from(inner.children).filter((c) => c.classList.contains('e-con'));
  }

  const buildCell = (col) => {
    const cell = [];
    if (!col) return cell;
    const widgets = Array.from(
      col.querySelectorAll(
        '.elementor-widget-image, .elementor-widget-text-editor, .elementor-widget-button',
      ),
    );
    widgets.forEach((w) => {
      if (w.classList.contains('elementor-widget-image')) {
        const link = w.querySelector('a');
        const img = w.querySelector('img');
        if (link) cell.push(link);
        else if (img) cell.push(img);
      } else if (w.classList.contains('elementor-widget-button')) {
        const a = w.querySelector('a');
        if (a) cell.push(a);
      } else {
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-text-image', cells });
  element.replaceWith(block);
}
