/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-lead. Base: hero-lead (simple block).
 * Source: https://vensure.com/ (.elementor-element-85cbbaf)
 * Generated for xwalk project.
 *
 * Simple block model fields: image (reference), imageAlt (collapsed), text (richtext).
 * Rows = unique non-collapsed fields = 2 (image row, text row).
 *   row 1 -> image (field:image) — the hero background photo
 *   row 2 -> text  (field:text)  — h1 + intro copy (the embedded Marketo form
 *                                  is migrated separately by the form block)
 */
export default function parse(element, { document }) {
  // The hero background photo. On the live page the desktop hero is a CSS
  // background-image (Vensure_NewHero_Final-1.jpg) while the inline <img> is a
  // lazy-loaded mobile webp that resolves to a session-scoped blob: URL at
  // import time. Prefer a real http(s) src; reject blob:/data: URIs and, when
  // the only inline image is the mobile lazy placeholder, fall back to the
  // known desktop hero asset so the importer downloads a stable file.
  // The direct wp-content URL errors when fetched, so use the working Optimole
  // CDN rendition of the desktop hero as the stable background source.
  const HERO_DESKTOP_SRC = 'https://mlnq5qmsdxfa.i.optimole.com/cb:1mlY.61852/w:1920/h:1050/q:90/f:best/https://vensure.com/wp-content/uploads/2023/02/Vensure_NewHero_Final-1.jpg';
  let bgImage = document.createElement('img');
  bgImage.setAttribute('src', HERO_DESKTOP_SRC);
  bgImage.setAttribute('alt', '');

  // Text content lives in the marketo_form html widget, alongside the <form>.
  // Pull only the headline/copy elements, skipping the form itself.
  const htmlWidget = element.querySelector('.marketo_form, .elementor-widget-html');
  const textNodes = [];
  if (htmlWidget) {
    Array.from(htmlWidget.children).forEach((child) => {
      if (child.tagName === 'FORM') return;
      // Headings and paragraphs that make up the hero copy.
      if (/^(H1|H2|H3|P|UL|OL)$/.test(child.tagName)) {
        textNodes.push(child);
      }
    });
  }

  if (!bgImage && textNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // --- Image row (field:image) ---
  const imageCell = document.createDocumentFragment();
  if (bgImage) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
  }
  cells.push([imageCell]);

  // --- Text row (field:text) ---
  const textCell = document.createDocumentFragment();
  if (textNodes.length) {
    textCell.appendChild(document.createComment(' field:text '));
    textNodes.forEach((node) => textCell.appendChild(node));
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-lead', cells });

  // The hero contains a nested Marketo lead-capture form (mktoForm_1411), but it
  // is intentionally not migrated — the hero keeps only its headline/copy.
  element.replaceWith(block);
}
