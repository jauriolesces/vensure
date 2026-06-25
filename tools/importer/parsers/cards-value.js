/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-value. Base: cards (container).
 * Source: https://vensure.com/ (.elementor-element-11cadc4 .graphic-section-item)
 * Generated for xwalk project.
 *
 * The instance selector targets each .graphic-section-item value-prop card.
 * Each card row has 2 cells:
 *   cell 1 -> image (field:image)  (icon-box icon; data-URI SVG renders empty in markdown)
 *   cell 2 -> text (field:text)    (the value-prop title as rich text)
 *
 * Handles both being called on a single .graphic-section-item and on a
 * container that holds several .graphic-section-item children.
 */
export default function parse(element, { document }) {
  // Collect the value-prop items. If element itself is an item, use it alone.
  let items;
  if (element.matches && element.matches('.graphic-section-item')) {
    items = [element];
  } else {
    items = Array.from(element.querySelectorAll('.graphic-section-item'));
    if (items.length === 0) items = [element];
  }

  const cells = [];

  items.forEach((item) => {
    // Prefer the icon-box icon image; fall back to any image in the item.
    const icon = item.querySelector('.elementor-icon-box-icon img, .elementor-icon img, img');
    const titleEl = item.querySelector(
      '.elementor-icon-box-title span, .elementor-icon-box-title, .elementor-icon-box-content',
    );

    // --- Image cell (field:image) ---
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) {
      imageCell.appendChild(icon);
    }

    // --- Text cell (field:text) ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    const titleText = titleEl ? (titleEl.textContent || '').replace(/\s+/g, ' ').trim() : '';
    if (titleText) {
      const h = document.createElement('h3');
      h.textContent = titleText;
      textCell.appendChild(h);
    }

    cells.push([imageCell, textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-value', cells });
  element.replaceWith(block);
}
