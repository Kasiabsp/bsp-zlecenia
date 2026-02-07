// scripts/model-viewer.js
// Robust loader for @google/model-viewer with CDN import and blob fallback.
// Najpierw próbujemy dynamicznie zaimportować moduł z CDN.
// Jeśli to się nie powiedzie (np. blokada MIME lub CORS), pobieramy skrypt jako tekst,
// tworzymy Blob z poprawnym typem i importujemy z URL.createObjectURL(blob).

(async function loadModelViewer() {
  const CDN_URL = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';

  function isRegistered() {
    return window.customElements && !!window.customElements.get('model-viewer');
  }

  if (isRegistered()) {
    console.log('model-viewer: already registered');
    return;
  }

  // 1) Spróbuj zwykłego dynamicznego importu
  try {
    await import(CDN_URL);
    if (isRegistered()) {
      console.log('model-viewer: loaded from CDN (direct import)');
      return;
    } else {
      console.warn('model-viewer: direct import succeeded but custom element not registered');
    }
  } catch (err) {
    console.warn('model-viewer: direct import failed:', err);
  }

  // 2) Fallback: fetch -> Blob -> import(blobURL)
  try {
    const resp = await fetch(CDN_URL, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
    const scriptText = await resp.text();

    // Optional quick sanity check: jeśli serwer zwrócił HTML zamiast JS, odrzuć
    const trimmed = scriptText.trim();
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      throw new Error('Fetched resource looks like HTML, not JS');
    }

    const blob = new Blob([scriptText], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    try {
      await import(blobUrl);
      if (isRegistered()) {
        console.log('model-viewer: loaded from CDN via blob fallback');
        return;
      } else {
        console.warn('model-viewer: blob import succeeded but custom element not registered');
      }
    } finally {
      // zwolnij URL blob po imporcie
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.error('model-viewer: blob fallback failed:', err);
  }

  // 3) Ostateczny komunikat o błędzie
  console.error('model-viewer: failed to load module. Sprawdź połączenie z CDN i nagłówki serwera (MIME).');
})();
