function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function productCard(product){
  const price=product.price!=null?`<p class="price">${esc(product.currency||'$')}${esc(product.price)}</p>`:'';
  const availability=product.availability?`<p class="availability">${esc(product.availability)}</p>`:'';
  const image=product.image?`<img src="${esc(product.image)}" alt="" loading="lazy">`:'';
  return `<article class="product-card" data-product-id="${esc(product.productId||'')}" data-product-title="${esc(product.title||'')}" data-product-url="${esc(product.destinationUrl||'')}" data-product-description="${esc(product.description||'')}">${image}<div class="card-body"><h2>${esc(product.title)}</h2>${price}${availability}<p>${esc(product.description||'')}</p><div class="card-actions"><a href="${esc(product.destinationUrl)}" rel="sponsored noopener">View at merchant</a><button type="button" data-action="share">Share</button><button type="button" data-action="collect">Collect</button></div><small>Merchant information may change. Verify price and availability at checkout.</small></div></article>`;
}
