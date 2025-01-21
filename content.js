// content.js

// Funktion zum Steuern der Custom Feeds
function toggleCustomFeeds(show) {
  const selector =
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9)";
  const customFeedsSection = document.querySelector(selector);

  if (customFeedsSection) {
    // Entferne direkt das open-Attribut vom faceplate-expandable-section-helper
    if (!show) {
      customFeedsSection.removeAttribute("open");
    } else {
      customFeedsSection.setAttribute("open", "");
    }
  }
}

// Funktion für Recent hinzufügen
function toggleRecent(show) {
  const recentPages = document.querySelector(
    "#left-sidebar > nav > reddit-recent-pages"
  );
  if (recentPages) {
    // Zugriff auf Shadow DOM
    const shadowRoot = recentPages.shadowRoot;
    if (shadowRoot) {
      const faceplateSection = shadowRoot.querySelector(
        "faceplate-expandable-section-helper"
      );
      if (faceplateSection) {
        if (!show) {
          faceplateSection.removeAttribute("open");
        } else {
          faceplateSection.setAttribute("open", "");
        }
      }
    }
  }
}

// Status beim Laden prüfen
chrome.storage.sync.get("customFeeds", (data) => {
  const isEnabled = data.customFeeds ?? true;

  // Interval für schnelles Finden des Elements
  const checkInterval = setInterval(() => {
    const element = document.querySelector(
      "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9)"
    );

    if (element) {
      toggleCustomFeeds(isEnabled);
      clearInterval(checkInterval);
    }
  }, 100);

  // Nach 5 Sekunden aufhören zu suchen
  setTimeout(() => clearInterval(checkInterval), 5000);
});

// Status beim Laden prüfen
chrome.storage.sync.get("recent", (data) => {
  const isEnabled = data.recent ?? true;

  const checkInterval = setInterval(() => {
    const element = document.querySelector(
      "faceplate-expandable-section-helper"
    );

    if (element) {
      toggleRecent(isEnabled);
      clearInterval(checkInterval);
    }
  }, 100);

  setTimeout(() => clearInterval(checkInterval), 5000);
});

// Auf Änderungen reagieren
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    if (changes.customFeeds) {
      toggleCustomFeeds(changes.customFeeds.newValue);
    }
    if (changes.recent) {
      toggleRecent(changes.recent.newValue);
    }
  }
});
