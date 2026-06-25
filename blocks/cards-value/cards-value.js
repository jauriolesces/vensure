import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Each value card's themed icon is an inline SVG on the source (not importable),
// so the field:image cell is empty. The 4 distinct icons were extracted to
// /icons/ and are injected per card here, matched by the card's title text.
const ICON_BY_LABEL = [
  { match: /expert/i, icon: 'value-expert-solutions' },
  { match: /benefit/i, icon: 'value-robust-benefits' },
  { match: /data|technology/i, icon: 'value-data-technology' },
  { match: /support|24\/7/i, icon: 'value-support' },
];

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    // First cell is the icon/image, second is the title body (positional).
    [...li.children].forEach((div, i) => {
      if (i === 0) div.className = 'cards-value-card-image';
      else div.className = 'cards-value-card-body';
    });

    // Inject the themed icon into the (empty) image cell, matched by title.
    const imageCell = li.querySelector('.cards-value-card-image');
    const title = (li.querySelector('.cards-value-card-body')?.textContent || '').trim();
    if (imageCell && !imageCell.querySelector('img')) {
      const entry = ICON_BY_LABEL.find((e) => e.match.test(title));
      if (entry) {
        const img = document.createElement('img');
        img.src = `/icons/${entry.icon}.svg`;
        img.alt = title;
        img.loading = 'lazy';
        imageCell.replaceChildren(img);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
