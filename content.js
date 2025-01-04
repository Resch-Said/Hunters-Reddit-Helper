console.log("[Hunter] Content Script wurde geladen");

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

function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function showElement(element) {
  if (element && element.tagName.toLowerCase() !== "reddit-recent-pages") {
    element.classList.add("hunter-visible");
    console.log("[Hunter] Element sichtbar gemacht:", element);
  }
}

// Direkt mit collapseElements() fortfahren
collapseElements();

function simulateClick(element) {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(clickEvent);
}

function collapseElements() {
  console.log("[Hunter] Start der collapseElements Funktion");
  const waitForSidebar = setInterval(() => {
    let allProcessed = true;

    Object.entries(XPATH_SELECTORS).forEach(([name, xpath]) => {
      if (!processedElements.has(name)) {
        const element = getElementByXPath(xpath);
        if (element) {
          if (name === "RECENT") {
            processedElements.add(name);
          } else {
            const details = element.querySelector("details");
            if (details) {
              details.removeAttribute("open");
              showElement(element);
              processedElements.add(name);
            }
          }
          allProcessed = false;
        }
      }
    });

    if (
      allProcessed &&
      processedElements.size === Object.keys(XPATH_SELECTORS).length
    ) {
      console.log("[Hunter] Alle Elemente verarbeitet");
      clearInterval(waitForSidebar);
    }
  }, 50);
}

// MutationObserver für dynamisch nachgeladene Elemente
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      collapseElements();
    }
  });
});

// Observer starten
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// Sofortige Ausführung ohne Backup
collapseElements();

// Navigation innerhalb von Reddit - sofortiger Restart
window.addEventListener("popstate", () => {
  console.log("[Hunter] Navigation erkannt - Setze Status zurück");
  processedElements.clear();
  collapseElements(); // Direkter Aufruf ohne Verzögerung
});
