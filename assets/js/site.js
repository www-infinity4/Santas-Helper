import { runtime } from '../../config/runtime.js';
import { searchProducts } from '../../adapters/commerce.js';
import { mountWallet } from '../../adapters/wallet.js';
import { productCard } from '../../components/product-card.js';
const form=document.querySelector('#giftSearch'),queryInput=document.querySelector('#query'),results=document.querySelector('#results'),walletButton=document.querySelector('#walletButton'),walletHost=document.querySelector('#walletHost');
async function runSearch(query){if(!query)return;results.innerHTML='<div class="empty">Looking for gifts…</div>';try{const products=await searchProducts(query,runtime);results.innerHTML=products.length?'<div class="product-grid">'+products.map(productCard).join('')+'</div>':'<div class="empty">No connected merchant results yet.</div>';}catch{results.innerHTML='<div class="empty">Product service is not connected yet. The page is ready for the shared Commerce-Phi adapter.</div>';}}
form.addEventListener('submit',e=>{e.preventDefault();runSearch(new FormData(form).get('q')?.trim());});
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{queryInput.value=button.dataset.query;runSearch(button.dataset.query);}));
walletButton.addEventListener('click',async()=>{walletHost.hidden=false;await mountWallet(walletHost,runtime);});
results.addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;const card=button.closest('[data-product-id]');document.dispatchEvent(new CustomEvent('santas-helper:product-action',{detail:{action:button.dataset.action,productId:card?.dataset.productId||null}}));});