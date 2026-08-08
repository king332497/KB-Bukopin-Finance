export function initKurOverview() {
  const trigger = document.querySelector('[data-kur-overview-open]');
  if (!trigger) return;

  const sourceImage = trigger.querySelector('.kur-overview__media');
  if (!sourceImage) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'kur-overview-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="kur-overview-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Pratinjau Daftar Jenis KUR">
      <img class="kur-overview-lightbox__image" alt="">
      <button class="kur-overview-lightbox__close" type="button" aria-label="Tutup pratinjau">×</button>
    </div>
  `;
  document.body.append(lightbox);

  const image = lightbox.querySelector('.kur-overview-lightbox__image');
  const closeButton = lightbox.querySelector('.kur-overview-lightbox__close');

  const open = () => {
    image.src = sourceImage.src;
    image.alt = sourceImage.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    trigger.focus();
  };

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}
