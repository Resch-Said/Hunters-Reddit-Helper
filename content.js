// content.js

// Funktion zum Steuern der Custom Feeds
async function toggleCustomFeeds(show) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const customFeedsSection = document.querySelector(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9)"
  );
  if (customFeedsSection) {
    const summary = customFeedsSection.querySelector("summary");
    if (summary && customFeedsSection.hasAttribute("open") !== show) {
      summary.click();
    }
  }
}

// Funktion für Recent
async function toggleRecent(show) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const recentPages = document.querySelector(
    "#left-sidebar > nav > reddit-recent-pages"
  );
  if (recentPages) {
    const shadowRoot = recentPages.shadowRoot;
    if (shadowRoot) {
      const faceplateSection = shadowRoot.querySelector(
        "faceplate-expandable-section-helper"
      );
      const summary = faceplateSection?.querySelector("summary");
      if (summary && faceplateSection.hasAttribute("open") !== show) {
        summary.click();
      }
    }
  }
}

// Funktion zum Steuern der Communities
async function toggleCommunities(show) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const communitiesSection = document.querySelector(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)"
  );
  if (communitiesSection) {
    const summary = communitiesSection.querySelector("summary");
    if (summary && communitiesSection.hasAttribute("open") !== show) {
      summary.click();
    }
  }
}

// Funktion zum Steuern der Resources
async function toggleResources(show) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const elements = document.querySelectorAll(
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper"
  );
  if (elements.length === 0) {
    setTimeout(() => toggleResources(show), 500);
    return;
  }
  elements.forEach((element) => {
    const summary = element.querySelector("summary");
    if (summary && element.hasAttribute("open") !== show) {
      summary.click();
    }
  });
}

// Verbesserte Hilfsfunktion zum Warten auf Elemente
async function waitForElement(selector, isQueryAll = false) {
  return new Promise((resolve) => {
    // Prüfe ob Element(e) bereits existieren
    const elements = isQueryAll
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);
    if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
      return resolve(elements);
    }

    // Observer für neue Elemente
    const observer = new MutationObserver(() => {
      const elements = isQueryAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
      if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
        observer.disconnect();
        resolve(elements);
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  });
}

// Vereinfachte Initialisierungsfunktion
async function initializeElement(
  storageKey,
  selector,
  toggleFunction,
  isQueryAll = false
) {
  const { [storageKey]: isEnabled = true } = await chrome.storage.sync.get(
    storageKey
  );
  const element = await waitForElement(selector, isQueryAll);
  if (element) {
    toggleFunction(isEnabled);
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  // Initialisiere Elemente
  initializeElement(
    "customFeeds",
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9)",
    toggleCustomFeeds
  );

  initializeElement(
    "recent",
    "#left-sidebar > nav > reddit-recent-pages",
    toggleRecent
  );

  initializeElement(
    "communities",
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)",
    toggleCommunities
  );

  initializeElement(
    "resources",
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper",
    toggleResources,
    true // querySelectorAll für Resources
  );
});

// Vereinfachter Storage Listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    const toggleMap = {
      customFeeds: toggleCustomFeeds,
      recent: toggleRecent,
      communities: toggleCommunities,
      resources: toggleResources,
    };

    Object.entries(changes).forEach(([key, { newValue }]) => {
      if (toggleMap[key]) {
        toggleMap[key](newValue);
      }
    });
  }
});
