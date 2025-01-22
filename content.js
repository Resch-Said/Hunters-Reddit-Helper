// content.js

// Verbesserte Hilfsfunktion für programmatisches Öffnen/Schließen
async function forceProgrammaticOpen(details, summary, shouldBeOpen) {
  console.log("[Hunter] Force Open:", {
    shouldBeOpen,
    currentState: details.hasAttribute("open"),
  });

  // Verhindere doppelte Ausführung
  if (details.hasAttribute("open") === shouldBeOpen) {
    console.log("[Hunter] Status bereits korrekt, keine Aktion nötig");
    return;
  }

  console.log("[Hunter] Ändere Status...");
  // Status direkt setzen
  if (shouldBeOpen) {
    details.setAttribute("open", "");
    summary.setAttribute("aria-expanded", "true");
  } else {
    details.removeAttribute("open");
    summary.setAttribute("aria-expanded", "false");
  }

  console.log("[Hunter] Führe nativen Click aus");
  summary.click();
  console.log("[Hunter] Neuer Status:", details.hasAttribute("open"));
}

// Funktion zum Steuern der Custom Feeds
async function toggleCustomFeeds(show) {
  console.log("[Hunter] Toggle Custom Feeds:", show);
  const customFeedsDiv = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details > summary > faceplate-tracker > li > div"
  );
  console.log("[Hunter] Custom Feeds Element gefunden");
  const parentDetails = customFeedsDiv?.closest("details");
  const summary = parentDetails?.querySelector("summary");
  if (summary && parentDetails) {
    await forceProgrammaticOpen(parentDetails, summary, show);
  }
}

// Funktion für Recent
async function toggleRecent(show) {
  console.log("[Hunter] Toggle Recent:", show);
  const recentPages = await waitForElement(
    "#left-sidebar > nav > reddit-recent-pages"
  );
  const shadowRoot = recentPages?.shadowRoot;
  if (shadowRoot) {
    console.log("[Hunter] Recent: Shadow Root gefunden");
    // Direkter Zugriff auf das Details-Element im Shadow DOM
    const details = shadowRoot.querySelector(
      "faceplate-expandable-section-helper > details"
    );
    const summary = details?.querySelector("summary");

    console.log("[Hunter] Recent: Details gefunden:", !!details);
    console.log("[Hunter] Recent: Summary gefunden:", !!summary);
    console.log(
      "[Hunter] Recent: Aktueller Status:",
      details?.hasAttribute("open")
    );

    if (summary && details) {
      await forceProgrammaticOpen(details, summary, show);
    }
  }
}

// Funktion zum Steuern der Communities
async function toggleCommunities(show) {
  console.log("[Hunter] Toggle Communities:", show);
  const communitiesDiv = await waitForElement(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(14) > details > summary > faceplate-tracker > li > div"
  );
  console.log("[Hunter] Communities Element gefunden");
  const parentDetails = communitiesDiv?.closest("details");
  const summary = parentDetails?.querySelector("summary");
  if (summary && parentDetails) {
    await forceProgrammaticOpen(parentDetails, summary, show);
  }
}

// Funktion zum Steuern der Resources
async function toggleResources(show) {
  console.log("[Hunter] Toggle Resources:", show);
  const elements = await waitForElement(
    "#left-sidebar > nav > nav > faceplate-expandable-section-helper > details > summary > faceplate-tracker > li > div",
    true
  );
  console.log("[Hunter] Resources Elemente gefunden:", elements.length);

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
  console.log("[Hunter] Warte auf Element:", { selector, isQueryAll });
  return new Promise((resolve) => {
    const elements = isQueryAll
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);

    if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
      console.log("[Hunter] Element sofort gefunden");
      return resolve(elements);
    }

    console.log("[Hunter] Element nicht sofort gefunden, starte Observer");
    const observer = new MutationObserver((_, obs) => {
      const elements = isQueryAll
        ? document.querySelectorAll(selector)
        : document.querySelector(selector);

      if ((isQueryAll && elements.length > 0) || (!isQueryAll && elements)) {
        console.log("[Hunter] Element durch Observer gefunden");
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
  console.log("[Hunter] Initialisiere Element:", storageKey);
  const { [storageKey]: isEnabled = true } = await chrome.storage.sync.get(
    storageKey
  );
  console.log("[Hunter] Storage Status für", storageKey, ":", isEnabled);

  const element = await waitForElement(selector, isQueryAll);
  if (element) {
    console.log("[Hunter] Führe Toggle aus für", storageKey);
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
    console.log("[Hunter] Storage Änderungen erkannt:", changes);
    const toggleMap = {
      customFeeds: toggleCustomFeeds,
      recent: toggleRecent,
      communities: toggleCommunities,
      resources: toggleResources,
    };

    Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
      console.log("[Hunter] Verarbeite Änderung:", { key, oldValue, newValue });
      if (toggleMap[key]) {
        toggleMap[key](newValue);
      }
    });
  }
});
