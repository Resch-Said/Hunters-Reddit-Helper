// content.js

// Neue Hilfsfunktion für Click mit Retry
async function tryClickUntilStateChange(
  element,
  summary,
  targetState,
  maxAttempts = 5
) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    if (element.hasAttribute("open") !== targetState) {
      summary.click();
      // Kurz warten und prüfen ob der Zustand sich geändert hat
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (element.hasAttribute("open") === targetState) {
        return true;
      }
    } else {
      return true;
    }
    attempts++;
  }
  return false;
}

// Funktion zum Steuern der Custom Feeds
async function toggleCustomFeeds(show) {
  const customFeedsSection = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9)"
  );
  const summary = customFeedsSection?.querySelector("summary");
  if (summary) {
    await tryClickUntilStateChange(customFeedsSection, summary, show);
  }
}

// Funktion für Recent
async function toggleRecent(show) {
  const recentPages = await waitForElement(
    "#left-sidebar > nav > reddit-recent-pages"
  );
  const shadowRoot = recentPages?.shadowRoot;
  if (shadowRoot) {
    const faceplateSection = shadowRoot.querySelector(
      "faceplate-expandable-section-helper"
    );
    const summary = faceplateSection?.querySelector("summary");
    if (summary) {
      await tryClickUntilStateChange(faceplateSection, summary, show);
    }
  }
}

// Funktion zum Steuern der Communities
async function toggleCommunities(show) {
  const communitiesSection = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)"
  );
  const summary = communitiesSection?.querySelector("summary");
  if (summary) {
    await tryClickUntilStateChange(communitiesSection, summary, show);
  }
}

// Funktion zum Steuern der Resources
async function toggleResources(show) {
  const elements = await waitForElement(
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper",
    true
  );
  for (const element of elements) {
    const summary = element.querySelector("summary");
    if (summary) {
      await tryClickUntilStateChange(element, summary, show);
    }
  }
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
