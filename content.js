// content.js

// Funktion zum Steuern der Custom Feeds
function toggleCustomFeeds(show) {
  const selector =
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details";
  const customFeedsSection = document.querySelector(selector);

  if (customFeedsSection) {
    if (show) {
      customFeedsSection.classList.remove("custom-feeds-hidden");
    } else {
      customFeedsSection.classList.add("custom-feeds-hidden");
      customFeedsSection.removeAttribute("open");
    }
  }
}

// Status beim Laden prüfen
chrome.storage.sync.get("customFeeds", (data) => {
  const isEnabled = data.customFeeds ?? true;

  // Interval für schnelles Finden des Elements
  const checkInterval = setInterval(() => {
    const element = document.querySelector(
      "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details"
    );

    if (element) {
      toggleCustomFeeds(isEnabled);
      clearInterval(checkInterval);
    }
  }, 100);

  // Nach 5 Sekunden aufhören zu suchen
  setTimeout(() => clearInterval(checkInterval), 5000);
});

// Auf Änderungen reagieren
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.customFeeds) {
    toggleCustomFeeds(changes.customFeeds.newValue);
  }
});
