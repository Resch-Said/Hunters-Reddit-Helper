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
  const selector = "faceplate-expandable-section-helper";
  const recentSections = document.querySelectorAll(selector);

  // Wir suchen das zweite faceplate-expandable-section-helper Element
  if (recentSections && recentSections.length >= 2) {
    const recentSection = recentSections[1];
    const parentDetails = recentSection.querySelector("details");

    if (parentDetails) {
      if (show) {
        parentDetails.classList.remove("recent-hidden");
      } else {
        parentDetails.classList.add("recent-hidden");
        if (parentDetails.hasAttribute("open")) {
          const summary = parentDetails.querySelector("summary");
          if (summary) {
            summary.click();
          }
        }
        parentDetails.removeAttribute("open");
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
    const elements = document.querySelectorAll(
      "faceplate-expandable-section-helper"
    );

    if (elements && elements.length >= 2) {
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
