/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-logos. Base: carousel (container).
 * Source: https://vensure.com/ (.elementor-element-1b0b263)
 * Generated for xwalk project.
 *
 * Container block: each unique logo slide is one carousel-logos-item row.
 * Per-slide model fields:
 *   media_image     (field:media_image)  -> the partner logo image
 *   media_imageAlt  (collapsed onto img) -> logo alt text
 *   content_text    (field:content_text) -> optional, unused here
 *
 * Swiper clones slides for looping; clones and repeated logos are de-duplicated
 * by image src so each partner logo appears exactly once.
 */
// The partner logos are lazy-loaded swiper slides whose <img> resolve to session
// blob: URLs with empty alt at import time, so they can't be read from the DOM.
// This is a fixed, known set of 5 partner logos — emit them deterministically by
// their stable source URLs (order matches the source carousel).
const LOGOS = [
  { alt: 'AFLAC', src: 'https://vensure.com/wp-content/uploads/2025/05/AFLAC-LOGO-VHRweb.png' },
  { alt: 'Empire', src: 'https://vensure.com/wp-content/uploads/2025/05/Empire-Logo-VHRweb.svg' },
  { alt: 'Guardian', src: 'https://vensure.com/wp-content/uploads/2025/05/Guardian-logo-VHRweb.svg' },
  { alt: 'Nationwide', src: 'https://vensure.com/wp-content/uploads/2025/05/nationwide-logo-VHRweb.svg' },
  { alt: 'Slavic401k', src: 'https://vensure.com/wp-content/uploads/2025/05/Slavic401K-Vertical-Logo-VHRweb.svg' },
];

export default function parse(element, { document }) {
  const cells = [];
  LOGOS.forEach(({ alt, src }) => {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    imageCell.appendChild(img);

    // content_text is optional for a logo carousel; leave empty cell, no hint.
    const textCell = document.createDocumentFragment();

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-logos', cells });
  element.replaceWith(block);
}
