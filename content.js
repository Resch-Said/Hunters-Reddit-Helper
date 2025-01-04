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

function injectCSS() {
  const style = document.createElement("style");
  style.textContent = `
    reddit-recent-pages {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
  console.log("[Hunter] CSS für RECENT injiziert");
}

// Führe CSS Injection sofort aus
injectCSS();

function clickAllElements() {
  console.log("[Hunter] Starte zweite Klickrunde");
  Object.entries(XPATH_SELECTORS).forEach(([name, xpath]) => {
    const element = getElementByXPath(xpath);
    if (element) {
      console.log(`[Hunter] Zweiter Klick auf ${name}`);
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(clickEvent);
    }
  });
}

function collapseElements() {
  console.log("[Hunter] Start der collapseElements Funktion");
  const waitForSidebar = setInterval(() => {
    let allProcessed = true;

    // Prüfe jedes Element über XPath
    Object.entries(XPATH_SELECTORS).forEach(([name, xpath]) => {
      if (!processedElements.has(name)) {
        const element = getElementByXPath(xpath);
        if (element) {
          if (name === "RECENT") {
            console.log("[Hunter] RECENT Element gefunden, versuche Klick");
            const clickEvent = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            element.dispatchEvent(clickEvent);
            processedElements.add(name);
            console.log("[Hunter] Klick auf RECENT ausgeführt");
          } else {
            // Normale Behandlung für andere Elemente
            const details = element.querySelector("details");
            if (details?.hasAttribute("open")) {
              console.log(`[Hunter] Klappe ${name} ein`);
              details.removeAttribute("open");
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
      // Starte zweite Klickrunde nach kurzer Verzögerung
      setTimeout(clickAllElements, 500);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(waitForSidebar);
    console.log("[Hunter] Timeout erreicht");
  }, 10000);
}

// Nur einmalige Ausführung beim Laden
window.addEventListener("load", () => {
  console.log("[Hunter] Seite geladen - Starte Verarbeitung");
  setTimeout(collapseElements, 2000);
});

// Navigation innerhalb von Reddit
window.addEventListener("popstate", () => {
  console.log("[Hunter] Navigation erkannt - Setze Status zurück");
  processedElements.clear();
  setTimeout(collapseElements, 2000);
});
