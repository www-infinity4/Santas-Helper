import { runtime } from '../../config/runtime.js';
import { searchProducts } from '../../adapters/commerce.js';
import { mountWallet } from '../../adapters/wallet.js';
import { shareProduct, collectProduct } from '../../adapters/actions.js';
import { productCard } from '../../components/product-card.js';
const BUNDLE_KEY='santasHelper:bundle:v1';
function readBundle(){try{return JSON.parse(localStorage.getItem(BUNDLE_KEY)||'[]')}catch{return[]}}
function saveBundle(items){localStorage.setItem(BUNDLE_KEY,JSON.stringify(items.slice(-100)))}
function rememberProduct(product){
 const items=readBundle(),key=String(product.productId||product.destinationUrl||product.title||'');
 if(!key)return;const next=items.filter(x=>x.key!==key);
 next.push({key,title:product.title||'',description:product.description||'',destinationUrl:product.destinationUrl||'',collectedAt:new Date().toISOString()});
 saveBundle(next);renderBundle();
}
function bundleCategory(item){const s=(item.title+' '+item.description).toLowerCase();if(/shirt|pant|sock|shoe|jacket|dress|clothing|apparel/.test(s))return'Clothing';if(/grocery|food|coffee|cereal|snack|toiletr|soap|shampoo|paper towel|detergent/.test(s))return'Household & grocery';if(/cd|dvd|vinyl|album|music|movie|pink floyd/.test(s))return'Music & movies';if(/phone|tv|computer|electronic|headphone|speaker/.test(s))return'Electronics';return'Shopping';
}
function renderBundle(){let host=document.querySelector('#bundleHost');if(!host){host=document.createElement('section');host.id='bundleHost';document.querySelector('main')?.appendChild(host)}
 const items=readBundle();if(!items.length){host.innerHTML='';return}
 const groups={};items.forEach(x=>(groups[bundleCategory(x)]??=[]).push(x));
 host.innerHTML='<h2>Your collected bundles</h2><p>Built only from products you explicitly collect. Prices and checkout remain with the merchant.</p>'+Object.entries(groups).map(([name,list])=>'<article class="bundle-card"><h3>'+name+' bundle</h3><p>'+list.length+' saved item'+(list.length===1?'':'s')+'</p><ul>'+list.slice(-15).map(x=>'<li>'+String(x.title||'Saved product').replace(/[&<>]/g,'')+'</li>').join('')+'</ul></article>').join('');
}
const form=document.querySelector('#giftSearch'),queryInput=document.querySelector('#query'),results=document.querySelector('#results'),walletButton=document.querySelector('#walletButton'),walletHost=document.querySelector('#walletHost');
async function runSearch(query){if(!query)return;results.innerHTML='<div class="empty">Looking for gifts…</div>';try{const products=await searchProducts(query,runtime);results.innerHTML=products.length?'<div class="product-grid">'+products.map(productCard).join('')+'</div>':'<div class="empty">No connected merchant results yet.</div>';}catch{results.innerHTML='<div class="empty">Product service is not connected yet. The page is ready for the shared Commerce-Phi adapter.</div>';}}
form.addEventListener('submit',e=>{e.preventDefault();runSearch(new FormData(form).get('q')?.trim());});
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{queryInput.value=button.dataset.query;runSearch(button.dataset.query);}));
walletButton.addEventListener('click',async()=>{walletHost.hidden=false;await mountWallet(walletHost,runtime);});
results.addEventListener('click',async event=>{const button=event.target.closest('button[data-action]');if(!button)return;const card=button.closest('[data-product-id]');const product={productId:card?.dataset.productId,title:card?.dataset.productTitle,destinationUrl:card?.dataset.productUrl,description:card?.dataset.productDescription};button.disabled=true;const original=button.textContent;try{if(button.dataset.action==='share'){await shareProduct(product);button.textContent='Shared';}else if(button.dataset.action==='collect'){await collectProduct(product);rememberProduct(product);button.textContent='Collected';}}catch(error){button.textContent='Unavailable';console.warn(error);}finally{setTimeout(()=>{button.disabled=false;button.textContent=original;},1800);}});

document.addEventListener('DOMContentLoaded',renderBundle);
