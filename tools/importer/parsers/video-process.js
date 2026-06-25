/* eslint-disable */
/* global WebImporter */
/**
 * Parser for video-process. Base: video-process (simple block).
 * Source: https://vensure.com/ (.elementor-element-4d121c6)
 * Generated for xwalk project.
 *
 * Model fields:
 *   uri                   (aem-content)  -> the video link
 *   classes               (multiselect)  -> SKIPPED per hinting rules (no row/hint)
 *   placeholder_image     (reference)    -> poster image  } grouped (same prefix)
 *   placeholder_imageAlt  (collapsed)    -> poster alt     } into one cell
 *
 * Rows (unique non-collapsed, non-skipped fields):
 *   row 1 -> uri               (field:uri)
 *   row 2 -> placeholder_image (field:placeholder_image)
 */
export default function parse(element, { document }) {
  // --- Video URL: from a lightbox anchor or elementor lightbox settings ---
  let videoUrl = '';
  const lightboxAnchor = element.querySelector('a[href]');
  if (lightboxAnchor) videoUrl = lightboxAnchor.getAttribute('href') || '';
  if (!videoUrl) {
    // Elementor stores the embedded video URL in lightbox settings JSON.
    const lb = element.querySelector('[data-elementor-lightbox], [data-elementor-open-lightbox]');
    const raw = lb && (lb.getAttribute('data-elementor-lightbox') || '');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.url) videoUrl = parsed.url;
      } catch (e) {
        /* ignore malformed settings */
      }
    }
  }

  // --- Poster / placeholder image (the non data-URI overlay image) ---
  const imgs = Array.from(element.querySelectorAll('img'));
  let poster = imgs.find((img) => {
    const src = img.getAttribute('src') || '';
    return src && !src.startsWith('data:');
  });
  if (!poster && imgs.length) poster = imgs[0];

  if (!videoUrl && !poster) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // --- uri row (field:uri) ---
  const uriCell = document.createDocumentFragment();
  if (videoUrl) {
    uriCell.appendChild(document.createComment(' field:uri '));
    const a = document.createElement('a');
    a.setAttribute('href', videoUrl);
    a.textContent = videoUrl;
    uriCell.appendChild(a);
  }
  cells.push([uriCell]);

  // --- placeholder_image row (field:placeholder_image) ---
  const posterCell = document.createDocumentFragment();
  if (poster) {
    posterCell.appendChild(document.createComment(' field:placeholder_image '));
    posterCell.appendChild(poster);
  }
  cells.push([posterCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-process', cells });
  element.replaceWith(block);
}
