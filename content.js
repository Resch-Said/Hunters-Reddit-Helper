// content.js

// Verbesserte Hilfsfunktion für programmatisches Öffnen/Schließen
async function forceProgrammaticOpen(details, summary, shouldBeOpen) {
  // Verhindere doppelte Ausführung
  if (details.hasAttribute("open") === shouldBeOpen) {
    return;
  }

  // Status direkt setzen
  if (shouldBeOpen) {
    details.setAttribute("open", "");
    summary.setAttribute("aria-expanded", "true");
  } else {
    details.removeAttribute("open");
    summary.setAttribute("aria-expanded", "false");
  }

  // Native Click-Funktion triggern
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

// Funktion für Recent
async function toggleRecent(show) {
  const recentPages = await waitForElement(
    "#left-sidebar > nav > reddit-recent-pages"
  );
  const shadowRoot = recentPages?.shadowRoot;
  if (shadowRoot) {
    console.log("[Hunter] Recent: Shadow Root gefunden");
    // Direkter Zugriff auf das Details-Element im Shadow DOM
    const details = shadowRoot.querySelector("faceplate-expandable-section-helper > details");
    const summary = details?.querySelector("summary");
    
    console.log("[Hunter] Recent: Details gefunden:", !!details);
    console.log("[Hunter] Recent: Summary gefunden:", !!summary);
    console.log("[Hunter] Recent: Aktueller Status:", details?.hasAttribute("open"));
    
    if (summary && details) {
      await forceProgrammaticOpen(details, summary, show);
    }
  }
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

// Verbesserte Hilfsfunktion zum Warten auf Elemente
async function waitForElement(selector, isQueryAll = false, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Sofortige Überprüfung
    const elements = isQueryAll
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);
    
    if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
      return resolve(elements);
    }

    // Timeout für Observer
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Element timeout'));
    }, timeout);

    // Optimierter Observer
    const observer = new MutationObserver((_, obs) => {
      const elements = isQueryAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);
      
      if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
        clearTimeout(timeoutId);
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
  try {
    const { [storageKey]: isEnabled = true } = await chrome.storage.sync.get(
      storageKey
    );
    const element = await waitForElement(selector, isQueryAll);
    if (element) {
      await toggleFunction(isEnabled);
    }
  } catch (error) {
    console.warn(`[Hunter] Konnte ${storageKey} nicht initialisieren:`, error);
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
    console.log("[Hunter] Storage changes:", changes);
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
