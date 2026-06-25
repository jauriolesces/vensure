import { getMetadata } from '../../scripts/aem.js';

// width at/above which the desktop horizontal nav with hover flyouts is shown
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Fetch the nav fragment markup.
 * Dual-fetch: local/aem-up serves /content/nav.plain.html; DA/EDS serves {navPath}.plain.html.
 */
async function fetchNav() {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/**
 * Collapse every open top-level dropdown.
 */
function closeAllDropdowns(navSections, except) {
  navSections.querySelectorAll(':scope > ul > li.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== except) li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggle the whole mobile menu open/closed.
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
  if (expanded || isDesktop.matches) {
    closeAllDropdowns(navSections);
  }
}

/**
 * Tag every <li> that contains a nested <ul> as a dropdown, and wire interactions.
 */
function decorateDropdowns(navSections) {
  navSections.querySelectorAll('li').forEach((li) => {
    const hasChild = li.querySelector(':scope > ul');
    if (!hasChild) return;
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    const link = li.querySelector(':scope > a');
    // A parent whose anchor is a placeholder ('#') should toggle rather than navigate.
    if (link && (link.getAttribute('href') === '#' || link.getAttribute('href') === '')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const open = li.getAttribute('aria-expanded') === 'true';
        if (!isDesktop.matches) {
          li.setAttribute('aria-expanded', open ? 'false' : 'true');
        }
      });
    }
  });

  // Top-level items: hover opens on desktop; click toggles on mobile.
  navSections.querySelectorAll(':scope > ul > li.nav-drop').forEach((topLi) => {
    topLi.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        closeAllDropdowns(navSections, topLi);
        topLi.setAttribute('aria-expanded', 'true');
      }
    });
    topLi.addEventListener('mouseleave', () => {
      if (isDesktop.matches) topLi.setAttribute('aria-expanded', 'false');
    });
    const topLink = topLi.querySelector(':scope > a');
    if (topLink) {
      topLink.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const open = topLi.getAttribute('aria-expanded') === 'true';
          closeAllDropdowns(navSections, open ? null : topLi);
          topLi.setAttribute('aria-expanded', open ? 'false' : 'true');
        }
      });
    }
  });
}

/**
 * Build the search control (icon toggles an input) inside nav-tools.
 * Form controls are created here, not in the nav fragment.
 */
function buildSearch(navTools) {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-search';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-search-toggle';
  toggle.setAttribute('aria-label', 'Toggle search');
  toggle.setAttribute('aria-expanded', 'false');

  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = '/search/';
  form.method = 'get';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 's';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  form.append(input);

  toggle.addEventListener('click', () => {
    const open = wrapper.getAttribute('data-open') === 'true';
    wrapper.setAttribute('data-open', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    if (!open) input.focus();
  });

  wrapper.append(toggle, form);
  navTools.prepend(wrapper);
}

/**
 * Style the two CTA links (Login outline, Request a call solid) in nav-tools.
 */
function decorateTools(navTools) {
  const links = navTools.querySelectorAll(':scope > p > a, :scope > a');
  links.forEach((a) => {
    const label = a.textContent.trim().toLowerCase();
    if (label === 'login') a.classList.add('nav-cta', 'nav-cta-outline');
    else if (label.includes('request')) a.classList.add('nav-cta', 'nav-cta-solid');
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  if (fragment) {
    while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  }

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    decorateDropdowns(navSections);
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    decorateTools(navTools);
    buildSearch(navTools);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // reset to desktop state and react to viewport changes (no refresh needed)
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
