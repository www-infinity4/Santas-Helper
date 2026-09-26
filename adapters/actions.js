function stableReference(productId){if(!productId)throw new Error('Product action requires productId');return `santas-helper:product:${productId}`;}

export async function shareProduct(product){
  const reference=stableReference(product.productId);
  const payload={title:product.title||"Santa's Helper gift",text:product.description||'Gift idea from Santa\'s Helper',url:product.destinationUrl};
  if(navigator.share){await navigator.share(payload);}
  else if(navigator.clipboard){await navigator.clipboard.writeText(payload.url);}
  else throw new Error('Sharing is not available in this browser.');
  window.ControlPhi?.recordShare?.({reference,url:payload.url,title:payload.title});
  return {reference,shared:true};
}

export async function collectProduct(product){
  const reference=stableReference(product.productId);
  const bridge=window.ControlPhi;
  if(!bridge?.ensureActionCredit) throw new Error('Shared collect authority is not connected.');
  const result=await bridge.ensureActionCredit(reference,'collect');
  return {reference,result};
}

export function productReference(productId){return stableReference(productId);}
