import { qa, q } from '../core/dom.js';

const productData = {
  usaha:{badge:'PEMBIAYAAN USAHA',title:'Modal Usaha',desc:'Informasi pembiayaan untuk membantu kebutuhan modal kerja, penambahan stok, operasional, dan pengembangan usaha.',f1:'Modal kerja & pengembangan',f2:'Identitas & data usaha',f3:'Kemampuan bayar & profil risiko',note:'Plafon, tenor, bunga, jaminan, dan biaya tidak ditetapkan pada halaman ini karena harus mengikuti produk serta ketentuan resmi yang berlaku.'},
  multiguna:{badge:'PEMBIAYAAN MULTIGUNA',title:'Multiguna',desc:'Informasi fasilitas pembiayaan untuk kebutuhan yang memenuhi kriteria dan ketentuan penyedia layanan.',f1:'Kebutuhan sesuai ketentuan',f2:'Identitas & dokumen pendukung',f3:'Verifikasi & analisis kelayakan',note:'Jenis penggunaan dana, kebutuhan jaminan, tenor, biaya, dan persyaratan dapat berbeda menurut fasilitas yang digunakan.'},
  properti:{badge:'PEMBIAYAAN PROPERTI',title:'Properti / KPR',desc:'Informasi pembiayaan terkait pembelian rumah atau properti yang memenuhi kriteria produk.',f1:'Pembelian rumah / properti',f2:'Identitas, penghasilan & properti',f3:'Analisis pemohon & objek',note:'Nama produk, uang muka, bunga, tenor, appraisal, dan biaya harus merujuk pada informasi resmi terbaru dari penyedia layanan.'}
};

export function initProductExplorer(){
  const tabs = qa('.product-tab');
  if (!tabs.length) return;
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    const d = productData[tab.dataset.product]; if (!d) return;
    const map = {productBadge:'badge',productTitle:'title',productDesc:'desc',feature1:'f1',feature2:'f2',feature3:'f3',productNote:'note'};
    Object.entries(map).forEach(([id,key]) => { const el=q('#'+id); if(el) el.textContent=d[key]; });
  }));
}
