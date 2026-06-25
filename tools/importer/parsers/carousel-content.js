/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-content. Base: carousel (container).
 * Source: https://vensure.com/ (.elementor-element-9811182)
 * Generated for xwalk project.
 *
 * Container block: each real swiper slide is one carousel-content-item row.
 * Per-slide model fields:
 *   media_image     (field:media_image)  -> the slide's product/illustration image
 *   media_imageAlt  (collapsed onto img) -> alt text
 *   content_text    (field:content_text) -> heading + bullet list rich text
 *
 * Swiper clones slides for looping (.swiper-slide-duplicate); those are skipped
 * so each unique slide appears exactly once.
 */
// Each slide's main illustration is a lazy-loaded image that resolves to a
// session blob: URL at import time, and the slide also contains decorative
// magnify-glass / arrow SVGs. Map each slide (by heading) to its stable source
// illustration so the importer downloads the correct per-slide image.
const SLIDE_IMAGE_BY_HEADING = {
  'hr solutions that power your business’s success': 'https://vensure.com/wp-content/uploads/2025/05/business-solution-1.png',
  'benefits': 'https://vensure.com/wp-content/uploads/2025/05/benefits-1.png',
  'compliance and risk exposure': 'https://vensure.com/wp-content/uploads/2025/05/risk-exposure-1.png',
  'business processes': 'https://vensure.com/wp-content/uploads/2025/05/business-process-1.png',
};

function normalizeHeading(text) {
  return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

export default function parse(element, { document }) {
  const allSlides = Array.from(element.querySelectorAll('.swiper-slide'));
  // Drop swiper-generated duplicate clones; keep unique real slides.
  const slides = allSlides.filter((s) => !s.classList.contains('swiper-slide-duplicate'));

  const cells = [];

  slides.forEach((slide) => {
    // --- Text content: heading + list (field:content_text) ---
    const textWidget = slide.querySelector('.elementor-widget-text-editor');

    // --- Image: resolve the slide's illustration by its heading. ---
    const headingEl = slide.querySelector('h1, h2, h3, h4');
    const headingKey = normalizeHeading(headingEl && headingEl.textContent);
    const mappedSrc = SLIDE_IMAGE_BY_HEADING[headingKey];

    let image = null;
    if (mappedSrc) {
      image = document.createElement('img');
      image.setAttribute('src', mappedSrc);
      image.setAttribute('alt', headingEl ? headingEl.textContent.trim() : '');
    } else {
      // Fallback: a real (non data-/blob:) image that isn't a decorative SVG.
      const imgs = Array.from(slide.querySelectorAll('img'));
      image = imgs.find((img) => {
        const src = img.getAttribute('src') || '';
        return src && !src.startsWith('data:') && !src.startsWith('blob:') && !/\.svg($|\?)/i.test(src);
      }) || null;
    }

    // --- Image cell (field:media_image) ---
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (image) imageCell.appendChild(image);

    // --- Text cell (field:content_text) ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));
    if (textWidget) {
      Array.from(textWidget.childNodes).forEach((node) => textCell.appendChild(node));
    }

    cells.push([imageCell, textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-content', cells });
  element.replaceWith(block);
}
