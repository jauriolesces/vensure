export default function decorate(block) {
  const rows = [...block.children];
  // Row 1 = background image cell, Row 2 = text/content cell
  const imageRow = rows[0];
  const contentRow = rows[1];

  // Promote the picture into a dedicated background layer
  const picture = block.querySelector('picture');
  if (picture && imageRow) {
    imageRow.classList.add('hero-lead-bg');
  }

  // Build the overlay content card from the second row's cell
  if (contentRow) {
    contentRow.classList.add('hero-lead-content');
    const cell = contentRow.firstElementChild;
    if (cell) cell.classList.add('hero-lead-card');

    // The "Request a Call" eyebrow is authored as <p><strong>…</strong></p>.
    // Mark it so it can be styled as the orange uppercase eyebrow.
    const eyebrow = [...(cell?.querySelectorAll('p') || [])].find(
      (p) => p.firstElementChild
        && p.firstElementChild.tagName === 'STRONG'
        && p.children.length === 1,
    );
    if (eyebrow) {
      eyebrow.classList.add('hero-lead-eyebrow');
    }
  }
}
