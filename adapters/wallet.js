function esc(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

export async function mountWallet(host,_runtime){
  const bridge=window.ControlPhi;
  if(!bridge?.wallet){
    host.innerHTML='<div class="empty"><h2>Unified Wallet unavailable</h2><p>The shared wallet module could not be loaded. Santa’s Helper will not substitute a local balance.</p></div>';
    return host;
  }
  bridge.refreshWallet?.();
  const state=bridge.wallet();
  const starCoins=state?.starCoins??state?.tokens??0;
  const pending=state?.pendingShareCredits??0;
  const quants=state?.quants??state?.assets?.quants??0;
  const infinity=state?.infinity??state?.assets?.infinity??0;
  host.innerHTML=`<section class="wallet-panel"><div><p class="eyebrow">Unified Wallet</p><h2>${esc(starCoins)} StarCoins</h2><p>${esc(pending)} / 10 pending share credits</p></div><div class="wallet-assets"><span><strong>${esc(quants)}</strong> Quants</span><span><strong>${esc(infinity)}</strong> Infinity</span></div><small>Displayed from the shared wallet surface. Santa’s Helper does not calculate or persist the authoritative balance.</small></section>`;
  return host;
}
