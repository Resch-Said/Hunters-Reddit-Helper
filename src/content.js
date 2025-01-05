log("Content Script wurde geladen");

const processedElements = new Set();

const XPATH_SELECTORS = {
  CUSTOM_FEEDS:
    '//*[@id="left-sidebar"]/nav/faceplate-expandable-section-helper[1]',
  RECENT: '//*[@id="left-sidebar"]/nav/reddit-recent-pages',
  COMMUNITIES:
    '//*[@id="left-sidebar"]/nav/faceplate-expandable-section-helper[2]',
  RESOURCES:
    '//*[@id="left-sidebar"]/nav/nav/faceplate-expandable-section-helper',
};

// Direkt ausführen
collapseElements(XPATH_SELECTORS, processedElements);

// MutationObserver für dynamische Inhalte
createDynamicContentObserver(() => {
  collapseElements(XPATH_SELECTORS, processedElements);
});

// Navigation Observer
createNavigationObserver(() => {
  log("Navigation erkannt - Setze Status zurück");
  processedElements.clear();
  collapseElements(XPATH_SELECTORS, processedElements);
});

// Read user preferences from chrome.storage
chrome.storage.sync.get(
  ["customFeeds", "recent", "communities", "resources"],
  (result) => {
    if (result.customFeeds !== undefined && !result.customFeeds) {
      processedElements.add("CUSTOM_FEEDS");
    }
    if (result.recent !== undefined && result.recent) {
      const recentElement = getElementByXPath(XPATH_SELECTORS.RECENT);
      if (recentElement) {
        recentElement.style.display = "block";
      }
      processedElements.add("RECENT");
    } else if (result.recent !== undefined && !result.recent) {
      const recentElement = getElementByXPath(XPATH_SELECTORS.RECENT);
      if (recentElement) {
        recentElement.style.display = "none";
      }
      processedElements.add("RECENT");
    }
    if (result.communities !== undefined && !result.communities) {
      processedElements.add("COMMUNITIES");
    }
    if (result.resources !== undefined && !result.resources) {
      processedElements.add("RESOURCES");
    }
    collapseElements(XPATH_SELECTORS, processedElements);
  }
);
