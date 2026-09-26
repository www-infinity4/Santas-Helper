function stableReference(productId){if(!productId)throw new Error('Product action requires productId');return `santas-helper:product:${productId}`;}

export async function shareProduct(product){
  const reference=stableReference(product.productId);
  const payload={title:product.title||"Santa's Helper gift",text:product.description||'Gift idea from Santa\'s Helper',url:product.destinationUrl};
  if(!navigator.share){
    if(navigator.clipboard){await navigator.clipboard.writeText(payload.url);return {reference,shared:false,copied:true};}
    throw new Error('Sharing is not available in this browser.');
  }
  await navigator.share(payload);
  const ledger=window.StarQuestCloudLedger;
  if(!ledger?.submitShare)throw new Error('Authoritative share ledger is not connected.');
  const receipt=await ledger.submitShare({attemptId:reference,contentId:reference,method:'web_share_api',showTitle:payload.title,attributionStatus:'client_confirmed'});
  return {reference,shared:true,receipt};
}

export async function collectProduct(product){
  const reference=stableReference(product.productId);
  const bridge=window.ControlPhi;
  if(!bridge?.ensureActionCredit) throw new Error('Shared collect authority is not connected.');
  const result=await bridge.ensureActionCredit(reference,'collect');
  return {reference,result};
}

export function productReference(productId){return stableReference(productId);}
