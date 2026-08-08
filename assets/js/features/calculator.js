import { q } from '../core/dom.js';
const rupiah = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
function sanitizeAmount(value){const n=Number(value);return Number.isFinite(n)?Math.min(500000000,Math.max(5000000,n)):5000000;}
export function initCalculator(){
  const amountRange=q('#amountRange'),amountInput=q('#amountInput'),term=q('#term'),rate=q('#rate'),button=q('#calcBtn');
  if(!amountRange||!amountInput||!term||!rate||!button)return;
  const calculate=()=>{const P=sanitizeAmount(amountInput.value),n=Number(term.value),annual=Number(rate.value),monthly=q('#monthly');if(!Number.isFinite(n)||n<=0||!Number.isFinite(annual)||annual<0){if(monthly)monthly.textContent='Periksa input';return;}amountInput.value=P;amountRange.value=P;const display=q('#amountDisplay');if(display)display.textContent=rupiah.format(P);const r=annual/100/12,payment=r===0?P/n:P*r/(1-Math.pow(1+r,-n)),total=payment*n;if(monthly)monthly.textContent=rupiah.format(payment);const principal=q('#resultPrincipal'),resultTerm=q('#resultTerm'),resultTotal=q('#resultTotal');if(principal)principal.textContent=rupiah.format(P);if(resultTerm)resultTerm.textContent=n+' bulan';if(resultTotal)resultTotal.textContent=rupiah.format(total);};
  amountRange.addEventListener('input',()=>{amountInput.value=amountRange.value;calculate();});
  amountInput.addEventListener('input',()=>{const raw=Number(amountInput.value);if(Number.isFinite(raw)){amountRange.value=Math.min(500000000,Math.max(5000000,raw));const display=q('#amountDisplay');if(display)display.textContent=rupiah.format(Math.min(500000000,Math.max(5000000,raw)));}});
  amountInput.addEventListener('change',calculate);term.addEventListener('change',calculate);rate.addEventListener('change',calculate);button.addEventListener('click',calculate);calculate();
}
