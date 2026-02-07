// scripts/model-viewer.js
// Loader model-viewer: importuje moduł z CDN i zapewnia diagnostykę.
(async function loadModelViewer() {
  try {
    // Jeśli element już istnieje, nic nie robimy
    if (window.customElements && window.customElements.get('model-viewer')) {
      console.log('model-viewer already registered');
      return;
    }

    // Import modułu (top-level await w module jest wspierany, ale używamy IIFE dla kompatybilności)
    await import('https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js');

    // Sprawdzenie rejestracji elementu
    if (window.customElements && window.customElements.get('model-viewer')) {
      console.log('model-viewer loaded successfully');
    } else {
      console.warn('model-viewer script loaded but custom element not registered');
    }
  } catch (err) {
    console.error('Failed to load model-viewer from CDN:', err);
  }
})();
