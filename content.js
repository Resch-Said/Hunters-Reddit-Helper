console.log("[Hunter] Content Script wurde geladen");

function collapseElements() {
  console.log("[Hunter] Start der collapseElements Funktion");
  const waitForSidebar = setInterval(() => {
    const elements = document.querySelectorAll(
      "faceplate-expandable-section-helper"
    );
    console.log("[Hunter] Gefundene Elemente:", elements.length);

    if (elements.length > 0) {
      elements.forEach((element, index) => {
        console.log(`[Hunter] Prüfe Element ${index + 1}`);
        const titleSpan = element.querySelector(
          ".text-12.text-secondary-weak.tracking-widest"
        );

        if (titleSpan && titleSpan.textContent === "CUSTOM FEEDS") {
          console.log("[Hunter] CUSTOM FEEDS Element gefunden");
          const summary = element.querySelector("summary");

          if (summary) {
            console.log("[Hunter] Simuliere Klick auf Summary Element");
            // Erstelle und dispatche ein Klick-Event
            const clickEvent = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            summary.dispatchEvent(clickEvent);
            console.log("[Hunter] Klick-Event gesendet");
          }
        }
      });
      clearInterval(waitForSidebar);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(waitForSidebar);
    console.warn(
      "[Hunter] Timeout erreicht - Element möglicherweise nicht gefunden"
    );
  }, 10000);
}

// Sofortige Ausführung
collapseElements();

// Event Listener mit verzögerter Ausführung
window.addEventListener("load", () => {
  console.log("[Hunter] Seite vollständig geladen");
  setTimeout(collapseElements, 2000);
});

// Führe die Funktion aus, wenn die Seite geladen ist
document.addEventListener("DOMContentLoaded", collapseElements);
// Führe die Funktion auch bei AJAX-Navigation aus
window.addEventListener("popstate", collapseElements);
