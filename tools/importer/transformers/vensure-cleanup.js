/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Vensure (vensure.com) site-wide cleanup.
 *
 * Source site is WordPress / Elementor. All selectors below were verified
 * against migration-work/cleaned.html (line references in comments) — none are
 * guessed. Removes non-authorable chrome (CookieYes consent banner, Zoom Live
 * SDK chat widget, Elementor header/footer/skip-link, tracking pixels/iframes,
 * Marketo cross-domain helper iframes, lightbox <link>, leftover <iframe>/
 * <noscript>) so the import contains only page-level authorable content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // CookieYes consent banner / overlay / preference modal (cleaned.html lines 2-60).
    // Removed before block parsing so its imagery/buttons can't be matched into blocks.
    WebImporter.DOMUtils.remove(element, [
      '.cky-overlay',
      '.cky-consent-container',
      '.cky-modal',
      '.cky-btn-revisit-wrapper',
    ]);

    // Zoom Live SDK chat widget (cleaned.html line 1298).
    WebImporter.DOMUtils.remove(element, ['#livesdk__campaign']);

    // Decorative corner graphic (banner-corner-right.png) is a CSS background on
    // the "Understanding Our Process" section container (.elementor-element-63c1bad,
    // bottom-right, behind heading+video). WebImporter.rules.transformBackgroundImages
    // would otherwise convert it into a stray inline <img> in the default content.
    // Strip the inline background here so it is NOT extracted; the decorative
    // corner is re-applied via the video-process section CSS instead.
    element.querySelectorAll('[style*="banner-corner-right"]').forEach((el) => {
      el.style.backgroundImage = 'none';
    });

    // "Your Gateway to Top-Tier Benefits" (logo carousel) section: a decorative
    // ring.png CSS background and a lazy-loaded blob image would otherwise be
    // extracted as stray inline images in the default content above the carousel.
    // Strip the ring background (decorative chrome) and remove any lazy/empty
    // images in that section so only the heading + carousel-logos block remain.
    element.querySelectorAll('[style*="ring.png"]').forEach((el) => {
      el.style.backgroundImage = 'none';
    });
    element.querySelectorAll('.elementor-element-432c0fa img, .elementor-element-1b0b263 img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      // remove lazy placeholders / data-URI / non-resolved imgs in this section;
      // the carousel-logos parser supplies the real logo URLs itself.
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) img.remove();
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable Elementor site shell: header + footer regions and the
    // accessibility skip link (cleaned.html lines 66, 1257).
    WebImporter.DOMUtils.remove(element, [
      'header.elementor-location-header',
      'footer.elementor-location-footer',
      '.skip-link',
    ]);

    // Tracking / cross-domain helper iframes and Elementor/Marketo runtime
    // artifacts (cleaned.html lines 1281-1296).
    WebImporter.DOMUtils.remove(element, [
      '#universal_pixel_ra8xeap',
      '#universal_pixel_azjayts',
      '#MktoForms2XDIframe',
      '#mktoStyleLoaded',
      '#elementor-device-mode',
    ]);

    // Generic leftover non-authorable elements (reCAPTCHA/TTD/Zoom iframes at
    // lines 1098-1296, Elementor lightbox <link> at line 1290, any <noscript>).
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Strip Elementor inline lazy-load / tracking attributes left on elements.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-elementor-type');
      el.removeAttribute('data-elementor-id');
      el.removeAttribute('data-element_type');
      el.removeAttribute('data-settings');
      el.removeAttribute('onclick');
    });
  }
}
