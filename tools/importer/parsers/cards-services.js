/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-services. Base: cards (container).
 * Source: https://vensure.com/ (.elementor-element-40ea48d)
 * Generated for xwalk project.
 *
 * Container block: each child <a> is a service card linking to a service page.
 * Each card row has 2 cells:
 *   cell 1 -> image (field:image) with imageAlt collapsed onto the img
 *   cell 2 -> text (field:text) as a rich-text CTA link wrapping the label
 */
export default function parse(element, { document }) {
  // Each card is a direct child anchor (.e-child) inside the inner container.
  const cardLinks = Array.from(
    element.querySelectorAll(':scope > .e-con-inner > a, :scope > a, a.e-child'),
  );

  const cells = [];

  cardLinks.forEach((cardLink) => {
    const href = cardLink.getAttribute('href');
    // Source icons are inline <svg>, which the importer can't capture. The image
    // cell stays empty; blocks/cards-services/cards-services.js injects the
    // extracted /icons/service-*.svg per card at render time (keyed by href).
    const icon = cardLink.querySelector('.elementor-icon img, img');
    const textWidget = cardLink.querySelector('.elementor-widget-text-editor, p');

    // --- Image cell (field:image) ---
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (icon) {
      imageCell.appendChild(icon);
    }

    // --- Text cell (field:text) as a CTA link ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Build a link whose text is the card label, pointing at the card href.
    // Convert <br> to spaces so multi-line labels don't run together.
    let labelText = '';
    if (textWidget) {
      const clone = textWidget.cloneNode(true);
      clone.querySelectorAll('br').forEach((br) => br.replaceWith(document.createTextNode(' ')));
      labelText = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    }
    if (href && labelText) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = labelText;
      textCell.appendChild(a);
    } else if (textWidget) {
      textCell.appendChild(textWidget);
    } else if (labelText) {
      textCell.appendChild(document.createTextNode(labelText));
    }

    cells.push([imageCell, textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-services', cells });
  element.replaceWith(block);
}
