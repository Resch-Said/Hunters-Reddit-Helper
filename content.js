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
            const summary = element.querySelector("summary");
            const details = element.querySelector("details");
            if (summary && details?.hasAttribute("open")) {
              console.log(`[Hunter] Klappe ${name} ein`);
              details.removeAttribute("open"); // Erst removeAttribute
              setTimeout(() => {
                // Dann Klick mit kleiner Verzögerung
                console.log(`[Hunter] Klick auf ${name}`);
                simulateClick(summary);
              }, 50);
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
