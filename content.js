console.log("[Hunter] Content Script wurde geladen");

const processedElements = new Set();

function collapseElements() {
  console.log("[Hunter] Start der collapseElements Funktion");
  const waitForSidebar = setInterval(() => {
    const elements = document.querySelectorAll(
      "faceplate-expandable-section-helper"
    );
    console.log("[Hunter] Gefundene Elemente:", elements.length);

    if (elements.length > 0) {
      let allProcessed = true;

      elements.forEach((element, index) => {
        const titleSpan = element.querySelector(
          ".text-12.text-secondary-weak.tracking-widest"
        );

        if (titleSpan) {
          const text = titleSpan.textContent;
          const elementId = `${text}-${index}`;

          if (!processedElements.has(elementId)) {
            console.log("[Hunter] Verarbeite neues Element:", text);

            if (
              text === "CUSTOM FEEDS" ||
              text === "RECENT" ||
              text === "COMMUNITIES" ||
              text === "RESOURCES"
            ) {
              const summary = element.querySelector("summary");
              const details = element.querySelector("details");

              if (summary && details && details.hasAttribute("open")) {
                console.log(`[Hunter] Klappe ${text} ein`);
                const clickEvent = new MouseEvent("click", {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                });
                summary.dispatchEvent(clickEvent);
                processedElements.add(elementId);
              }
            }
            allProcessed = false;
          }
        }
      });

      if (allProcessed) {
        console.log("[Hunter] Alle Elemente verarbeitet");
        clearInterval(waitForSidebar);
      }
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
