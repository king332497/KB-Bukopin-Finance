export const q = (selector, root = document) => root.querySelector(selector);
export const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

export function getFocusable(root) {
  return qa('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => !el.hidden && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
}
