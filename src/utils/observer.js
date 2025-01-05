/**
 * Erstellt und startet einen MutationObserver für dynamische Inhalte
 * @param {Function} callback - Callback-Funktion die bei Änderungen ausgeführt wird
 * @returns {MutationObserver} Der erstellte Observer
 */
function createDynamicContentObserver(callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        callback();
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
}

/**
 * Erstellt einen Navigation Observer für Single Page Applications
 * @param {Function} callback - Callback der bei Navigation ausgeführt wird
 */
function createNavigationObserver(callback) {
  window.addEventListener("popstate", callback);
}

// Exportiere die Observer-Funktionen für globale Verfügbarkeit
window.createDynamicContentObserver = createDynamicContentObserver;
window.createNavigationObserver = createNavigationObserver;
