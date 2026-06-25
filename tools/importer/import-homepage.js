/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsServicesParser from './parsers/cards-services.js';
import cardsValueParser from './parsers/cards-value.js';
import carouselContentParser from './parsers/carousel-content.js';
import carouselLogosParser from './parsers/carousel-logos.js';
import columnsContactParser from './parsers/columns-contact.js';
import columnsTextImageParser from './parsers/columns-text-image.js';
import formParser from './parsers/form.js';
import heroBannerParser from './parsers/hero-banner.js';
import heroLeadParser from './parsers/hero-lead.js';
import videoProcessParser from './parsers/video-process.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/vensure-cleanup.js';
import sectionsTransformer from './transformers/vensure-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Vensure HR homepage with hero/lead-capture, services link grid, HR assessment intro, video, content carousel, scale CTA, value-prop cards, benefits partner logo carousel, and contact CTA',
  urls: [
    'https://vensure.com/',
  ],
  blocks: [
    { name: 'hero-lead', instances: ['.elementor-element-85cbbaf'] },
    { name: 'cards-services', instances: ['.elementor-element-40ea48d'] },
    { name: 'columns-text-image', instances: ['.elementor-element-e9ed42f'] },
    { name: 'video-process', instances: ['.elementor-element-4d121c6'] },
    { name: 'carousel-content', instances: ['.elementor-element-9811182'] },
    { name: 'hero-banner', instances: ['.elementor-element-59f71c4'] },
    { name: 'cards-value', instances: ['.elementor-element-11cadc4 .graphic-section-item'] },
    { name: 'carousel-logos', instances: ['.elementor-element-1b0b263'] },
    { name: 'columns-contact', instances: ['.elementor-element-8a970b0'] },
  ],
  sections: [
    { id: 'rc2', name: 'Hero lead-capture', selector: '.elementor-element-85cbbaf', style: 'hero-photo-dark', blocks: ['hero-lead', 'form'], defaultContent: [] },
    { id: 'rc3', name: 'Services link grid', selector: '.elementor-element-40ea48d', style: null, blocks: ['cards-services'], defaultContent: [] },
    { id: 'rc4', name: 'HR assessment intro', selector: '.elementor-element-e9ed42f', style: null, blocks: ['columns-text-image'], defaultContent: [] },
    { id: 'rc5', name: 'Understanding Our Process video', selector: '.elementor-element-23c248e', style: null, blocks: ['video-process'], defaultContent: ['.elementor-element-23c248e .elementor-widget-text-editor h2'] },
    { id: 'rc6', name: 'Content carousel', selector: '.elementor-element-9811182', style: 'light-grey', blocks: ['carousel-content'], defaultContent: [] },
    { id: 'rc7', name: 'Ready to modernize CTA', selector: '.elementor-element-59f71c4', style: 'accent', blocks: ['hero-banner'], defaultContent: [] },
    { id: 'rc8', name: 'You The Client value props', selector: '.elementor-element-11cadc4', style: null, blocks: ['cards-value'], defaultContent: ['.elementor-element-11cadc4 .elementor-widget-text-editor'] },
    { id: 'rc9', name: 'Partner logo carousel', selector: '.elementor-element-432c0fa', style: null, blocks: ['carousel-logos'], defaultContent: ['.elementor-element-432c0fa .elementor-widget-text-editor h2'] },
    { id: 'rc10', name: 'Contact CTA and testimonial', selector: '.elementor-element-8a970b0', style: 'light-grey', blocks: ['columns-contact'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-lead': heroLeadParser,
  'form': formParser,
  'cards-services': cardsServicesParser,
  'columns-text-image': columnsTextImageParser,
  'video-process': videoProcessParser,
  'carousel-content': carouselContentParser,
  'hero-banner': heroBannerParser,
  'cards-value': cardsValueParser,
  'carousel-logos': carouselLogosParser,
  'columns-contact': columnsContactParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections last
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (root "/" maps to "/index")
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
