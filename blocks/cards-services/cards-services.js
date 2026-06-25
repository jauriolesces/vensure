import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Source card icons are inline SVGs (not importable images). They were extracted
// to /icons/ and are injected per card here, keyed by the card's link href.
const ICON_BY_HREF = {
  '/hr-services/overview/': 'service-human-resources',
  '/payroll-administration/overview/': 'service-payroll-administration',
  '/employee-benefits/overview/': 'service-employee-benefits',
  '/risk-and-compliance/overview/': 'service-risk-and-compliance',
  '/recruiting-services/': 'service-talent-recruiting',
};

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, i) => {
      // First cell is the icon/image badge, second is the label body.
      if (i === 0) div.className = 'cards-services-card-image';
      else div.className = 'cards-services-card-body';
    });

    // Inject the service icon into the (empty) image cell based on the card link.
    const imageCell = li.querySelector('.cards-services-card-image');
    const link = li.querySelector('.cards-services-card-body a');
    if (imageCell && !imageCell.querySelector('img') && link) {
      const iconName = ICON_BY_HREF[link.getAttribute('href')];
      if (iconName) {
        const img = document.createElement('img');
        img.src = `/icons/${iconName}.svg`;
        img.alt = link.textContent.trim();
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
