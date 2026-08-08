import { whatsappConfig } from '../config/whatsapp-config.js';

const normalizeNumber = (value = '') => String(value).replace(/\D/g, '');

const buildMessage = (context = '') => {
  if (!context) return whatsappConfig.defaultMessage;
  return `Halo, saya sudah membaca informasi mengenai ${context} di website dan ingin mendapatkan informasi lebih lanjut mengenai persyaratan dan proses pengajuan.`;
};

const buildWhatsAppUrl = (context = '') => {
  const number = normalizeNumber(whatsappConfig.businessNumber);
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(buildMessage(context))}`;
};

export function initWhatsAppConversion() {
  const links = [...document.querySelectorAll('[data-whatsapp]')];

  links.forEach((link) => {
    const context = link.dataset.whatsappContext || '';
    const url = buildWhatsAppUrl(context);

    if (!url) {
      link.setAttribute('aria-disabled', 'true');
      link.dataset.whatsappUnconfigured = 'true';

      link.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('#whatsappSetupNotice')?.focus();
      });
      return;
    }

    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    delete link.dataset.whatsappUnconfigured;
  });
}
