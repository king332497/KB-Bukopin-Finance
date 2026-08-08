import { inspirationArticles } from '../data/inspiration-data.js';

const escapeInspirationHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

export function initInspirationCarousel() {
  const track = document.querySelector('#inspirationTrack');
  if (!track) return;

  track.innerHTML = inspirationArticles.map((article) => `
    <article class="inspiration-card">
      <a
        class="inspiration-card__link"
        href="${escapeInspirationHtml(article.url)}"
        aria-label="${escapeInspirationHtml(article.title)}"
      >
        <img
          class="inspiration-card__media"
          src="${escapeInspirationHtml(article.image)}"
          alt=""
          width="1200"
          height="760"
          loading="lazy"
          decoding="async"
        >
        <span class="inspiration-card__shade" aria-hidden="true"></span>
        <span class="inspiration-card__content">
          <strong class="inspiration-card__title">${escapeInspirationHtml(article.title)}</strong>
        </span>
      </a>
    </article>
  `).join('');

  const section = track.closest('.inspiration-section');
  const next = section?.querySelector('[data-inspiration-next]');
  const prev = section?.querySelector('[data-inspiration-prev]');

  const getStep = () => {
    const card = track.querySelector('.inspiration-card');
    if (!card) return track.clientWidth * .8;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    return card.getBoundingClientRect().width + gap;
  };

  next?.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
}
