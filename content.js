// content.js

// Verbesserte Hilfsfunktion für programmatisches Öffnen/Schließen
async function forceProgrammaticOpen(details, summary, shouldBeOpen) {
  if (details.hasAttribute("open") === shouldBeOpen) {
    return;
  }

  if (shouldBeOpen) {
    details.setAttribute("open", "");
    summary.setAttribute("aria-expanded", "true");
  } else {
    details.removeAttribute("open");
    summary.setAttribute("aria-expanded", "false");
  }

  summary.click();
}

// Funktion zum Steuern der Custom Feeds
async function toggleCustomFeeds(show) {
  const customFeedsDiv = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details > summary > faceplate-tracker > li > div"
  );
  const parentDetails = customFeedsDiv?.closest("details");
  const summary = parentDetails?.querySelector("summary");
  if (summary && parentDetails) {
    await forceProgrammaticOpen(parentDetails, summary, show);
  }
}

// Neue Hilfsfunktion zum Warten auf Shadow Root (unendlich)
async function waitForShadowRoot(element) {
  while (!element.shadowRoot) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return element.shadowRoot;
}

// Verbesserte Recent Funktion
async function toggleRecent(show) {
  const recentPages = await waitForElement(
    "#left-sidebar > nav > reddit-recent-pages"
  );

  if (!recentPages) {
    console.warn("[Hunter] Recent: Element nicht gefunden");
    return;
  }

  const shadowRoot = await waitForShadowRoot(recentPages);
  if (!shadowRoot) {
    console.warn("[Hunter] Recent: Shadow Root nicht verfügbar");
    return;
  }

  const details = shadowRoot.querySelector(
    "faceplate-expandable-section-helper > details"
  );

  if (!details) {
    console.warn("[Hunter] Recent: Details Element nicht gefunden");
    return;
  }

  const summary = details.querySelector("summary");
  if (!summary) {
    console.warn("[Hunter] Recent: Summary Element nicht gefunden");
    return;
  }

  await forceProgrammaticOpen(details, summary, show);
}

// Funktion zum Steuern der Communities
async function toggleCommunities(show) {
  const communitiesDiv = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14) > details > summary > faceplate-tracker > li > div"
  );
  const parentDetails = communitiesDiv?.closest("details");
  const summary = parentDetails?.querySelector("summary");
  if (summary && parentDetails) {
    await forceProgrammaticOpen(parentDetails, summary, show);
  }
}

// Funktion zum Steuern der Resources
async function toggleResources(show) {
  const elements = await waitForElement(
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper > details > summary > faceplate-tracker > li > div",
    true
  );

  for (const element of elements) {
    const parentDetails = element.closest("details");
    const summary = parentDetails?.querySelector("summary");
    if (summary && parentDetails) {
      await forceProgrammaticOpen(parentDetails, summary, show);
    }
  }
}

// Vereinfachte Hilfsfunktion zum Warten auf Elemente
async function waitForElement(selector, isQueryAll = false) {
  return new Promise((resolve) => {
    const elements = isQueryAll
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);

    if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
      return resolve(elements);
    }

    const observer = new MutationObserver((_, obs) => {
      const elements = isQueryAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);

      if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
        obs.disconnect();
        resolve(elements);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
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
    await toggleFunction(isEnabled);
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  // Initialisiere Elemente
  initializeElement(
    "customFeeds",
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details > summary > faceplate-tracker > li > div",
    toggleCustomFeeds
  );

  initializeElement(
    "recent",
    "#left-sidebar > nav > reddit-recent-pages",
    toggleRecent
  );

  initializeElement(
    "communities",
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14) > details > summary > faceplate-tracker > li > div",
    toggleCommunities
  );

  initializeElement(
    "resources",
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper > details > summary > faceplate-tracker > li > div",
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
