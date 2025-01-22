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
  const selector =
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14)";
  const communitiesSection = document.querySelector(selector);

  if (communitiesSection) {
    if (!show) {
      communitiesSection.removeAttribute("open");
    } else {
      communitiesSection.setAttribute("open", "");
    }
  }
}

// Funktion zum Steuern der Resources (vereinfacht)
function toggleResources(show) {
  const elements = document.querySelectorAll(
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper"
  );
  elements.forEach((element) => {
    if (!show) {
      element.removeAttribute("open");
    } else {
      element.setAttribute("open", "");
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
