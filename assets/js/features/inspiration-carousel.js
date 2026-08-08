import { inspirationArticles } from '../data/inspiration-data.js';

const escapeHtml = (value = '') =>
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
        href="${escapeHtml(article.url)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${escapeHtml(article.title)} — ${escapeHtml(article.dateLabel)}"
      >
        <img
          class="inspiration-card__media"
          src="${escapeHtml(article.image)}"
          alt=""
          width="1200"
          height="760"
          loading="lazy"
          decoding="async"
        >
        <span class="inspiration-card__shade" aria-hidden="true"></span>
        <span class="inspiration-card__content">
          <time class="inspiration-card__date" datetime="${escapeHtml(article.date)}">
            ${escapeHtml(article.dateLabel)}
          </time>
          <strong class="inspiration-card__title">${escapeHtml(article.title)}</strong>
        </span>
      </a>
    </article>
  `).join('');
}
