/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero-banner (simple block).
 * Source: https://vensure.com/ (.elementor-element-59f71c4)
 * Generated for xwalk project.
 *
 * Simple block model fields: image (reference), imageAlt (collapsed), text (richtext).
 * Rows = unique non-collapsed fields = 2 (image row, text row).
 *   row 1 -> image (field:image) — empty here (this is a text-only CTA banner)
 *   row 2 -> text  (field:text)  — heading, body paragraphs, and the CTA button
 */
export default function parse(element, { document }) {
  const inner = element.querySelector(':scope > .e-con-inner') || element;

  const image = element.querySelector('.elementor-widget-image img, img');

  // Collect heading/body text and the CTA button in source order.
  const textCellContent = [];
  const widgets = Array.from(
    inner.querySelectorAll('.elementor-widget-text-editor, .elementor-widget-button'),
  );
  widgets.forEach((w) => {
    if (w.classList.contains('elementor-widget-button')) {
      const a = w.querySelector('a');
      if (a) textCellContent.push(a);
    } else {
      Array.from(w.children).forEach((child) => textCellContent.push(child));
    }
  });

  if (textCellContent.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // --- Image row (field:image) ---
  const imageCell = document.createDocumentFragment();
  if (image) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
  }
  cells.push([imageCell]);

  // --- Text row (field:text) ---
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  textCellContent.forEach((node) => textCell.appendChild(node));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
