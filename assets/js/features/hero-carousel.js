import { heroSlides } from '../data/hero-slides.js';

const escapeHeroHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

export function initHeroCarousel() {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root || !heroSlides.length) return;

  const track = root.querySelector('#heroPromoTrack');
  const prev = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  const pagination = root.querySelector('[data-hero-pagination]');
  if (!track || !pagination) return;

  track.innerHTML = heroSlides.map((slide, index) => `
    <article
      class="hero-promo__slide"
      role="group"
      aria-roledescription="slide"
      aria-label="${index + 1} dari ${heroSlides.length}: ${escapeHeroHtml(slide.label)}"
    >
      <a class="hero-promo__link" href="${escapeHeroHtml(slide.href)}">
        <img class="hero-promo__backdrop" src="${escapeHeroHtml(slide.image)}" alt="" aria-hidden="true">
        <img
          class="hero-promo__image"
          src="${escapeHeroHtml(slide.image)}"
          alt="${escapeHeroHtml(slide.alt)}"
          width="2172"
          height="724"
          ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
          decoding="async"
        >
        <span class="hero-promo__veil" aria-hidden="true"></span>
      </a>
    </article>
  `).join('');

  pagination.innerHTML = heroSlides.map((slide, index) => `
    <button
      class="hero-promo__dot"
      type="button"
      aria-label="Tampilkan slide ${index + 1}: ${escapeHeroHtml(slide.label)}"
      aria-current="${index === 0 ? 'true' : 'false'}"
      data-hero-dot="${index}"
    ></button>
  `).join('');

  const dots = [...pagination.querySelectorAll('[data-hero-dot]')];
  let index = 0;
  let pointerStartX = null;

  const render = (nextIndex, focus = false) => {
    index = (nextIndex + heroSlides.length) % heroSlides.length;
    track.style.transform = `translate3d(${-index * 100}%,0,0)`;

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });

    if (focus) dots[index]?.focus();
  };

  prev?.addEventListener('click', () => render(index - 1));
  next?.addEventListener('click', () => render(index + 1));
  dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => render(dotIndex)));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      render(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      render(index + 1);
    }
  });

  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    pointerStartX = event.clientX;
  }, { passive: true });

  root.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) < 45) return;
    render(distance > 0 ? index - 1 : index + 1);
  }, { passive: true });

  render(0);
}
