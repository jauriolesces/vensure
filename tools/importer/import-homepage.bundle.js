/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-services.js
  function parse(element, { document }) {
    const cardLinks = Array.from(
      element.querySelectorAll(":scope > .e-con-inner > a, :scope > a, a.e-child")
    );
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const href = cardLink.getAttribute("href");
      const icon = cardLink.querySelector(".elementor-icon img, img");
      const textWidget = cardLink.querySelector(".elementor-widget-text-editor, p");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (icon) {
        imageCell.appendChild(icon);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      let labelText = "";
      if (textWidget) {
        const clone = textWidget.cloneNode(true);
        clone.querySelectorAll("br").forEach((br) => br.replaceWith(document.createTextNode(" ")));
        labelText = (clone.textContent || "").replace(/\s+/g, " ").trim();
      }
      if (href && labelText) {
        const a = document.createElement("a");
        a.setAttribute("href", href);
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-services", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-value.js
  function parse2(element, { document }) {
    let items;
    if (element.matches && element.matches(".graphic-section-item")) {
      items = [element];
    } else {
      items = Array.from(element.querySelectorAll(".graphic-section-item"));
      if (items.length === 0) items = [element];
    }
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector(".elementor-icon-box-icon img, .elementor-icon img, img");
      const titleEl = item.querySelector(
        ".elementor-icon-box-title span, .elementor-icon-box-title, .elementor-icon-box-content"
      );
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (icon) {
        imageCell.appendChild(icon);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const titleText = titleEl ? (titleEl.textContent || "").replace(/\s+/g, " ").trim() : "";
      if (titleText) {
        const h = document.createElement("h3");
        h.textContent = titleText;
        textCell.appendChild(h);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-value", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-content.js
  var SLIDE_IMAGE_BY_HEADING = {
    "hr solutions that power your business\u2019s success": "https://vensure.com/wp-content/uploads/2025/05/business-solution-1.png",
    "benefits": "https://vensure.com/wp-content/uploads/2025/05/benefits-1.png",
    "compliance and risk exposure": "https://vensure.com/wp-content/uploads/2025/05/risk-exposure-1.png",
    "business processes": "https://vensure.com/wp-content/uploads/2025/05/business-process-1.png"
  };
  function normalizeHeading(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function parse3(element, { document }) {
    const allSlides = Array.from(element.querySelectorAll(".swiper-slide"));
    const slides = allSlides.filter((s) => !s.classList.contains("swiper-slide-duplicate"));
    const cells = [];
    slides.forEach((slide) => {
      const textWidget = slide.querySelector(".elementor-widget-text-editor");
      const headingEl = slide.querySelector("h1, h2, h3, h4");
      const headingKey = normalizeHeading(headingEl && headingEl.textContent);
      const mappedSrc = SLIDE_IMAGE_BY_HEADING[headingKey];
      let image = null;
      if (mappedSrc) {
        image = document.createElement("img");
        image.setAttribute("src", mappedSrc);
        image.setAttribute("alt", headingEl ? headingEl.textContent.trim() : "");
      } else {
        const imgs = Array.from(slide.querySelectorAll("img"));
        image = imgs.find((img) => {
          const src = img.getAttribute("src") || "";
          return src && !src.startsWith("data:") && !src.startsWith("blob:") && !/\.svg($|\?)/i.test(src);
        }) || null;
      }
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (image) imageCell.appendChild(image);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (textWidget) {
        Array.from(textWidget.childNodes).forEach((node) => textCell.appendChild(node));
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-content", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-logos.js
  var LOGOS = [
    { alt: "AFLAC", src: "https://vensure.com/wp-content/uploads/2025/05/AFLAC-LOGO-VHRweb.png" },
    { alt: "Empire", src: "https://vensure.com/wp-content/uploads/2025/05/Empire-Logo-VHRweb.svg" },
    { alt: "Guardian", src: "https://vensure.com/wp-content/uploads/2025/05/Guardian-logo-VHRweb.svg" },
    { alt: "Nationwide", src: "https://vensure.com/wp-content/uploads/2025/05/nationwide-logo-VHRweb.svg" },
    { alt: "Slavic401k", src: "https://vensure.com/wp-content/uploads/2025/05/Slavic401K-Vertical-Logo-VHRweb.svg" }
  ];
  function parse4(element, { document }) {
    const cells = [];
    LOGOS.forEach(({ alt, src }) => {
      const img = document.createElement("img");
      img.setAttribute("src", src);
      img.setAttribute("alt", alt);
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      imageCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse5(element, { document }) {
    const inner = element.querySelector(":scope > .e-con-inner") || element;
    let columns = Array.from(inner.querySelectorAll(":scope > .e-con.e-child, :scope > .e-con"));
    if (columns.length < 2) {
      columns = Array.from(inner.children).filter((c) => c.classList.contains("e-con"));
    }
    const buildCell = (col) => {
      const cell = [];
      if (!col) return cell;
      const widgets = Array.from(
        col.querySelectorAll(
          ".elementor-widget-image, .elementor-widget-text-editor, .elementor-widget-button"
        )
      );
      widgets.forEach((w) => {
        if (w.classList.contains("elementor-widget-image")) {
          const link = w.querySelector("a");
          const img = w.querySelector("img");
          if (link) {
            cell.push(link);
          } else if (img) {
            cell.push(img);
          }
        } else if (w.classList.contains("elementor-widget-button")) {
          const a = w.querySelector("a");
          if (a) cell.push(a);
        } else {
          Array.from(w.children).forEach((child) => cell.push(child));
        }
      });
      return cell;
    };
    const col1 = buildCell(columns[0]);
    const col2 = buildCell(columns[1]);
    if (col1.length === 0 && col2.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-text-image.js
  function parse6(element, { document }) {
    const inner = element.querySelector(":scope > .e-con-inner") || element;
    let columns = Array.from(inner.querySelectorAll(":scope > .e-con.e-child, :scope > .e-con"));
    if (columns.length < 2) {
      columns = Array.from(inner.children).filter((c) => c.classList.contains("e-con"));
    }
    const buildCell = (col) => {
      const cell = [];
      if (!col) return cell;
      const widgets = Array.from(
        col.querySelectorAll(
          ".elementor-widget-image, .elementor-widget-text-editor, .elementor-widget-button"
        )
      );
      widgets.forEach((w) => {
        if (w.classList.contains("elementor-widget-image")) {
          const link = w.querySelector("a");
          const img = w.querySelector("img");
          if (link) cell.push(link);
          else if (img) cell.push(img);
        } else if (w.classList.contains("elementor-widget-button")) {
          const a = w.querySelector("a");
          if (a) cell.push(a);
        } else {
          Array.from(w.children).forEach((child) => cell.push(child));
        }
      });
      return cell;
    };
    const col1 = buildCell(columns[0]);
    const col2 = buildCell(columns[1]);
    if (col1.length === 0 && col2.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-text-image", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse7(element, { document }) {
    const formEl = element.matches && element.matches("form") ? element : element.querySelector("form");
    const formId = formEl && formEl.getAttribute("id") || "form";
    const referencePath = `/forms/${formId.toLowerCase()}.json`;
    const actionUrl = formEl && formEl.getAttribute("action") ? formEl.getAttribute("action") : "https://app-ab27.marketo.com/index.php/leadCapture/save2";
    const referenceCell = document.createDocumentFragment();
    referenceCell.appendChild(document.createComment(" field:reference "));
    const refLink = document.createElement("a");
    refLink.setAttribute("href", referencePath);
    refLink.textContent = referencePath;
    referenceCell.appendChild(refLink);
    const actionCell = document.createDocumentFragment();
    actionCell.appendChild(document.createComment(" field:action "));
    const actionLink = document.createElement("a");
    actionLink.setAttribute("href", actionUrl);
    actionLink.textContent = actionUrl;
    actionCell.appendChild(actionLink);
    const cells = [
      [referenceCell],
      [actionCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse8(element, { document }) {
    const inner = element.querySelector(":scope > .e-con-inner") || element;
    const image = element.querySelector(".elementor-widget-image img, img");
    const textCellContent = [];
    const widgets = Array.from(
      inner.querySelectorAll(".elementor-widget-text-editor, .elementor-widget-button")
    );
    widgets.forEach((w) => {
      if (w.classList.contains("elementor-widget-button")) {
        const a = w.querySelector("a");
        if (a) textCellContent.push(a);
      } else {
        Array.from(w.children).forEach((child) => textCellContent.push(child));
      }
    });
    if (textCellContent.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(image);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    textCellContent.forEach((node) => textCell.appendChild(node));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-lead.js
  function parse9(element, { document }) {
    const HERO_DESKTOP_SRC = "https://mlnq5qmsdxfa.i.optimole.com/cb:1mlY.61852/w:1920/h:1050/q:90/f:best/https://vensure.com/wp-content/uploads/2023/02/Vensure_NewHero_Final-1.jpg";
    let bgImage = document.createElement("img");
    bgImage.setAttribute("src", HERO_DESKTOP_SRC);
    bgImage.setAttribute("alt", "");
    const htmlWidget = element.querySelector(".marketo_form, .elementor-widget-html");
    const textNodes = [];
    if (htmlWidget) {
      Array.from(htmlWidget.children).forEach((child) => {
        if (child.tagName === "FORM") return;
        if (/^(H1|H2|H3|P|UL|OL)$/.test(child.tagName)) {
          textNodes.push(child);
        }
      });
    }
    if (!bgImage && textNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageCell = document.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(bgImage);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    if (textNodes.length) {
      textCell.appendChild(document.createComment(" field:text "));
      textNodes.forEach((node) => textCell.appendChild(node));
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-lead", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-process.js
  function parse10(element, { document }) {
    let videoUrl = "";
    const lightboxAnchor = element.querySelector("a[href]");
    if (lightboxAnchor) videoUrl = lightboxAnchor.getAttribute("href") || "";
    if (!videoUrl) {
      const lb = element.querySelector("[data-elementor-lightbox], [data-elementor-open-lightbox]");
      const raw = lb && (lb.getAttribute("data-elementor-lightbox") || "");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.url) videoUrl = parsed.url;
        } catch (e) {
        }
      }
    }
    const imgs = Array.from(element.querySelectorAll("img"));
    let poster = imgs.find((img) => {
      const src = img.getAttribute("src") || "";
      return src && !src.startsWith("data:");
    });
    if (!poster && imgs.length) poster = imgs[0];
    if (!videoUrl && !poster) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const uriCell = document.createDocumentFragment();
    if (videoUrl) {
      uriCell.appendChild(document.createComment(" field:uri "));
      const a = document.createElement("a");
      a.setAttribute("href", videoUrl);
      a.textContent = videoUrl;
      uriCell.appendChild(a);
    }
    cells.push([uriCell]);
    const posterCell = document.createDocumentFragment();
    if (poster) {
      posterCell.appendChild(document.createComment(" field:placeholder_image "));
      posterCell.appendChild(poster);
    }
    cells.push([posterCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "video-process", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vensure-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cky-overlay",
        ".cky-consent-container",
        ".cky-modal",
        ".cky-btn-revisit-wrapper"
      ]);
      WebImporter.DOMUtils.remove(element, ["#livesdk__campaign"]);
      element.querySelectorAll('[style*="banner-corner-right"]').forEach((el) => {
        el.style.backgroundImage = "none";
      });
      element.querySelectorAll('[style*="ring.png"]').forEach((el) => {
        el.style.backgroundImage = "none";
      });
      element.querySelectorAll(".elementor-element-432c0fa img, .elementor-element-1b0b263 img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (!src || src.startsWith("data:") || src.startsWith("blob:")) img.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.elementor-location-header",
        "footer.elementor-location-footer",
        ".skip-link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#universal_pixel_ra8xeap",
        "#universal_pixel_azjayts",
        "#MktoForms2XDIframe",
        "#mktoStyleLoaded",
        "#elementor-device-mode"
      ]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-elementor-type");
        el.removeAttribute("data-elementor-id");
        el.removeAttribute("data-element_type");
        el.removeAttribute("data-settings");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/vensure-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolved = sections.map((section) => ({
      section,
      el: section.selector ? element.querySelector(section.selector) : null
    }));
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) continue;
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (el.parentNode) {
          el.parentNode.insertBefore(block, el.nextSibling);
        }
      }
      if (i > 0 && el.parentNode) {
        const hr = doc.createElement("hr");
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Vensure HR homepage with hero/lead-capture, services link grid, HR assessment intro, video, content carousel, scale CTA, value-prop cards, benefits partner logo carousel, and contact CTA",
    urls: [
      "https://vensure.com/"
    ],
    blocks: [
      { name: "hero-lead", instances: [".elementor-element-85cbbaf"] },
      { name: "cards-services", instances: [".elementor-element-40ea48d"] },
      { name: "columns-text-image", instances: [".elementor-element-e9ed42f"] },
      { name: "video-process", instances: [".elementor-element-4d121c6"] },
      { name: "carousel-content", instances: [".elementor-element-9811182"] },
      { name: "hero-banner", instances: [".elementor-element-59f71c4"] },
      { name: "cards-value", instances: [".elementor-element-11cadc4 .graphic-section-item"] },
      { name: "carousel-logos", instances: [".elementor-element-1b0b263"] },
      { name: "columns-contact", instances: [".elementor-element-8a970b0"] }
    ],
    sections: [
      { id: "rc2", name: "Hero lead-capture", selector: ".elementor-element-85cbbaf", style: "hero-photo-dark", blocks: ["hero-lead", "form"], defaultContent: [] },
      { id: "rc3", name: "Services link grid", selector: ".elementor-element-40ea48d", style: null, blocks: ["cards-services"], defaultContent: [] },
      { id: "rc4", name: "HR assessment intro", selector: ".elementor-element-e9ed42f", style: null, blocks: ["columns-text-image"], defaultContent: [] },
      { id: "rc5", name: "Understanding Our Process video", selector: ".elementor-element-23c248e", style: null, blocks: ["video-process"], defaultContent: [".elementor-element-23c248e .elementor-widget-text-editor h2"] },
      { id: "rc6", name: "Content carousel", selector: ".elementor-element-9811182", style: "light-grey", blocks: ["carousel-content"], defaultContent: [] },
      { id: "rc7", name: "Ready to modernize CTA", selector: ".elementor-element-59f71c4", style: "accent", blocks: ["hero-banner"], defaultContent: [] },
      { id: "rc8", name: "You The Client value props", selector: ".elementor-element-11cadc4", style: null, blocks: ["cards-value"], defaultContent: [".elementor-element-11cadc4 .elementor-widget-text-editor"] },
      { id: "rc9", name: "Partner logo carousel", selector: ".elementor-element-432c0fa", style: null, blocks: ["carousel-logos"], defaultContent: [".elementor-element-432c0fa .elementor-widget-text-editor h2"] },
      { id: "rc10", name: "Contact CTA and testimonial", selector: ".elementor-element-8a970b0", style: "light-grey", blocks: ["columns-contact"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-lead": parse9,
    "form": parse7,
    "cards-services": parse,
    "columns-text-image": parse6,
    "video-process": parse10,
    "carousel-content": parse3,
    "hero-banner": parse8,
    "cards-value": parse2,
    "carousel-logos": parse4,
    "columns-contact": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
