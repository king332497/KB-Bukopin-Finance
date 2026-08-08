import { loanPrograms } from '../data/loan-programs.js';

const escapeLoanHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

export function initLoanProgramGallery() {
  const track = document.querySelector('#loanProgramTrack');
  if (!track) return;

  track.innerHTML = loanPrograms.map((program, index) => `
    <article class="loan-program-card">
      <button
        class="loan-program-card__button"
        type="button"
        data-loan-program="${index}"
        aria-label="Perbesar materi ${escapeLoanHtml(program.title)}"
      >
        <img
          class="loan-program-card__media"
          src="${escapeLoanHtml(program.image)}"
          alt="${escapeLoanHtml(program.alt)}"
          width="${program.width}"
          height="${program.height}"
          loading="lazy"
          decoding="async"
        >
        <span class="loan-program-card__caption">${escapeLoanHtml(program.title)}</span>
      </button>
    </article>
  `).join('');

  const prev = document.querySelector('[data-loan-gallery-prev]');
  const next = document.querySelector('[data-loan-gallery-next]');

  const getStep = () => {
    const card = track.querySelector('.loan-program-card');
    if (!card) return track.clientWidth * .75;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    return card.getBoundingClientRect().width + gap;
  };

  prev?.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next?.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'loan-program-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="loan-program-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Pratinjau materi program">
      <img class="loan-program-lightbox__image" alt="">
      <button class="loan-program-lightbox__close" type="button" aria-label="Tutup pratinjau">×</button>
    </div>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector('.loan-program-lightbox__image');
  const closeButton = lightbox.querySelector('.loan-program-lightbox__close');
  let lastTrigger = null;

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  track.addEventListener('click', (event) => {
    const button = event.target.closest('[data-loan-program]');
    if (!button) return;
    const program = loanPrograms[Number(button.dataset.loanProgram)];
    if (!program || !lightboxImage) return;

    lastTrigger = button;
    lightboxImage.src = program.image;
    lightboxImage.alt = program.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  });

  closeButton?.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}
