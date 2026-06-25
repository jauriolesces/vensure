/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form. Base: form.
 * Source: https://vensure.com/ (form#mktoForm_1411 / .mktoForm)
 * Generated for xwalk project.
 *
 * The EDS form block does not inline field markup. At render time
 * blocks/form/form.js reads two anchors from the block:
 *   - a same-origin link ending in `.json`  -> the form definition  (model: reference)
 *   - a second link                          -> the submit/action URL (model: action)
 *
 * The Marketo form is migrated to a form definition document separately
 * (forms workflow). Here we emit the two model rows with field hints so the
 * Universal Editor model is populated; the forms workflow fills in the final
 * JSON path and Marketo submit endpoint.
 *
 * Simple block -> one row per model field:
 *   row: field:reference  (link to the form definition JSON)
 *   row: field:action     (submit/action URL)
 */
export default function parse(element, { document }) {
  // Derive a stable form-definition path from the form id when available.
  const formEl = element.matches && element.matches('form')
    ? element
    : element.querySelector('form');
  const formId = (formEl && formEl.getAttribute('id')) || 'form';
  const referencePath = `/forms/${formId.toLowerCase()}.json`;

  // Marketo posts via its JS API; use its standard submit endpoint as the action.
  const actionUrl = formEl && formEl.getAttribute('action')
    ? formEl.getAttribute('action')
    : 'https://app-ab27.marketo.com/index.php/leadCapture/save2';

  // --- Reference row (field:reference) ---
  const referenceCell = document.createDocumentFragment();
  referenceCell.appendChild(document.createComment(' field:reference '));
  const refLink = document.createElement('a');
  refLink.setAttribute('href', referencePath);
  refLink.textContent = referencePath;
  referenceCell.appendChild(refLink);

  // --- Action row (field:action) ---
  const actionCell = document.createDocumentFragment();
  actionCell.appendChild(document.createComment(' field:action '));
  const actionLink = document.createElement('a');
  actionLink.setAttribute('href', actionUrl);
  actionLink.textContent = actionUrl;
  actionCell.appendChild(actionLink);

  const cells = [
    [referenceCell],
    [actionCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
