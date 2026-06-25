import { getMetadata } from '../../scripts/aem.js';

const SOCIAL_HOSTS = ['facebook', 'twitter', 'x.com', 'linkedin', 'instagram', 'youtube'];

/**
 * Fetch the footer fragment markup.
 * Dual-fetch: local/aem-up serves /content/footer.plain.html; DA/EDS serves the footer doc.
 */
async function fetchFooter() {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/**
 * Identify the social-links list (the <ul> whose links point at social hosts) and tag it.
 */
function decorateSocial(footer) {
  footer.querySelectorAll('ul').forEach((ul) => {
    const links = Array.from(ul.querySelectorAll('a'));
    if (links.length
      && links.every((a) => SOCIAL_HOSTS.some((h) => (a.getAttribute('href') || '').includes(h)))) {
      ul.classList.add('footer-social');
      links.forEach((a) => {
        const href = a.getAttribute('href') || '';
        const name = SOCIAL_HOSTS.find((h) => href.includes(h)) || 'link';
        const key = name === 'x.com' ? 'twitter' : name;
        a.classList.add('footer-social-icon', `footer-social-${key}`);
        a.setAttribute('aria-label', a.textContent.trim());
      });
    }
  });
}

/**
 * Tag the legal links list (terms/privacy/sitemap) for inline styling.
 */
function decorateLegal(footer) {
  const brand = footer.querySelector(':scope > div');
  if (!brand) return;
  brand.querySelectorAll('ul').forEach((ul) => {
    if (ul.classList.contains('footer-social')) return;
    const labels = Array.from(ul.querySelectorAll('a')).map((a) => a.textContent.trim().toLowerCase());
    if (labels.some((l) => /terms|privacy|sitemap/.test(l))) {
      ul.classList.add('footer-legal');
    }
  });
}

/**
 * Style the Subscribe and Request a call links as buttons.
 */
function decorateButtons(footer) {
  footer.querySelectorAll('a').forEach((a) => {
    const label = a.textContent.trim().toLowerCase();
    if (label === 'subscribe') a.classList.add('footer-btn', 'footer-btn-outline');
    else if (label === 'request a call') a.classList.add('footer-btn', 'footer-btn-solid');
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer-content';
  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  // tag the column sections
  const columns = footer.querySelectorAll(':scope > div');
  columns.forEach((col, i) => {
    col.classList.add('footer-column');
    if (i === 0) col.classList.add('footer-brand');
  });

  decorateSocial(footer);
  decorateLegal(footer);
  decorateButtons(footer);

  block.append(footer);
}
