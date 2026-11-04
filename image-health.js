/* Phase 2 stability: accessible fallbacks and reconnect retries for remote artwork. */
'use strict';
(() => {
  const FALLBACK = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#2b1b25"/><stop offset="1" stop-color="#100a0e"/></linearGradient></defs><rect width="1200" height="900" fill="url(#g)"/><circle cx="600" cy="385" r="145" fill="none" stroke="#b77a8b" stroke-opacity=".42" stroke-width="3"/><path d="M600 270c-85 75-95 145 0 230 95-85 85-155 0-230Z" fill="none" stroke="#d5a0ad" stroke-opacity=".62" stroke-width="3"/><text x="600" y="635" fill="#f2e8e9" fill-opacity=".9" font-family="Arial,sans-serif" font-size="34" text-anchor="middle" letter-spacing="5">IMAGE UNAVAILABLE</text><text x="600" y="690" fill="#c7aeb5" fill-opacity=".8" font-family="Arial,sans-serif" font-size="22" text-anchor="middle">Reconnect to try again</text></svg>'
  );
  const failed = new Set();

  function isImage(node) {
    return node instanceof HTMLImageElement;
  }

  function remember(img) {
    if (!isImage(img)) return;
    const source = img.getAttribute('src') || '';
    if (!source || source === FALLBACK) return;
    let absolute = source;
    try { absolute = new URL(source, document.baseURI).href; } catch { /* Keep original source for diagnostics. */ }
    if (img.dataset.bpOriginalSrc !== absolute) {
      img.dataset.bpOriginalSrc = absolute;
      img.dataset.bpRetryCount = '0';
      img.dataset.bpFallbackActive = 'false';
    }
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (!img.hasAttribute('loading') && img.getAttribute('fetchpriority') !== 'high') img.loading = 'lazy';
  }

  function showFallback(img) {
    if (!isImage(img) || img.dataset.bpFallbackActive === 'true') return;
    if (!img.dataset.bpOriginalSrc) remember(img);
    img.dataset.bpFallbackActive = 'true';
    if (!img.alt || !img.alt.trim()) img.alt = 'Image unavailable. Reconnect to try again.';
    img.classList.add('bp-image-fallback');
    failed.add(img);
    img.src = FALLBACK;
  }

  document.addEventListener('error', event => {
    if (isImage(event.target)) showFallback(event.target);
  }, true);

  document.addEventListener('load', event => {
    const img = event.target;
    if (!isImage(img) || img.dataset.bpFallbackActive === 'true') return;
    img.classList.remove('bp-image-fallback');
    img.dataset.bpRetryCount = '0';
    failed.delete(img);
  }, true);

  function inspect(node) {
    if (isImage(node)) remember(node);
    if (node instanceof Element) node.querySelectorAll('img').forEach(remember);
  }

  document.querySelectorAll('img').forEach(remember);
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && isImage(mutation.target)) remember(mutation.target);
      mutation.addedNodes?.forEach(inspect);
    }
  });
  observer.observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['src']});

  window.addEventListener('online', () => {
    for (const img of [...failed]) {
      if (!img.isConnected) { failed.delete(img); continue; }
      const retries = Number(img.dataset.bpRetryCount || 0);
      if (retries >= 2 || !img.dataset.bpOriginalSrc) continue;
      img.dataset.bpRetryCount = String(retries + 1);
      img.dataset.bpFallbackActive = 'false';
      img.src = img.dataset.bpOriginalSrc;
    }
  });
})();
