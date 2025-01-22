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

// Funktion zum Steuern der Communities
function toggleCommunities(show) {
  const selector = "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)";
  const communitiesSection = document.querySelector(selector);

  if (communitiesSection) {
    if (!show) {
      communitiesSection.removeAttribute("open");
    } else {
      communitiesSection.setAttribute("open", "");
    }
  }
}

// Funktion zum Steuern der Resources
function toggleResources(show) {
  const selector = "#left-sidebar > nav > nav > faceplate-expandable-section-helper";
  const resourcesSection = document.querySelector(selector);

  if (resourcesSection) {
    if (!show) {
      resourcesSection.removeAttribute("open");
    } else {
      resourcesSection.setAttribute("open", "");
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

// Storage Listener für Recent Toggle
chrome.storage.sync.get("recent", (data) => {
  const isEnabled = data.recent ?? true;

  const checkInterval = setInterval(() => {
    const recentPages = document.querySelector(
      "#left-sidebar > nav > reddit-recent-pages"
    );
    if (
      recentPages?.shadowRoot?.querySelector(
        "faceplate-expandable-section-helper"
      )
    ) {
      toggleRecent(isEnabled);
      clearInterval(checkInterval);
    }
  }, 100);

  setTimeout(() => clearInterval(checkInterval), 5000);
});

// Status beim Laden prüfen für Communities
chrome.storage.sync.get("communities", (data) => {
  const isEnabled = data.communities ?? true;

  const checkInterval = setInterval(() => {
    const element = document.querySelector(
      "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)"
    );

    if (element) {
      toggleCommunities(isEnabled);
      clearInterval(checkInterval);
    }
  }, 100);

  setTimeout(() => clearInterval(checkInterval), 5000);
});

// Status beim Laden prüfen für Resources
chrome.storage.sync.get("resources", (data) => {
  const isEnabled = data.resources ?? true;

  const checkInterval = setInterval(() => {
    const element = document.querySelector(
      "#left-sidebar > nav > nav > faceplate-expandable-section-helper"
    );

    if (element) {
      toggleResources(isEnabled);
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
    if (changes.communities) {
      toggleCommunities(changes.communities.newValue);
    }
    if (changes.resources) {
      toggleResources(changes.resources.newValue);
    }
  }
});
