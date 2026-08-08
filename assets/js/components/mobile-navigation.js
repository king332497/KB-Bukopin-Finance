import { q, qa, getFocusable } from '../core/dom.js';

export function initMobileNavigation() {
  const trigger = q('#corpMenuBtn');
  const panel = q('#mobilePanel');
  const close = q('#closeMenu');
  if (!trigger || !panel || !close) return;

  let restoreFocus = null;
  let inerted = [];

  const setBackgroundInert = (value) => {
    const siblings = [...document.body.children].filter((el) => el !== panel && el.tagName !== 'SCRIPT');
    if (value) {
      inerted = siblings.filter((el) => !el.inert);
      inerted.forEach((el) => { el.inert = true; });
    } else {
      inerted.forEach((el) => { el.inert = false; });
      inerted = [];
    }
  };

  const setOpen = (open) => {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);

    if (open) {
      restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
      setBackgroundInert(true);
      requestAnimationFrame(() => close.focus());
    } else {
      setBackgroundInert(false);
      const focusTarget = restoreFocus;
      restoreFocus = null;
      if (focusTarget instanceof HTMLElement) requestAnimationFrame(() => focusTarget.focus());
    }
  };

  trigger.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  panel.addEventListener('click', (event) => {
    if (event.target === panel) setOpen(false);
  });
  qa('a[href]', panel).forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (!panel.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = getFocusable(panel);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const desktop = matchMedia('(min-width: 901px)');
  const onDesktop = (event) => { if (event.matches && panel.classList.contains('open')) setOpen(false); };
  desktop.addEventListener?.('change', onDesktop);
}
