console.log('[Hunter] Content Script wurde geladen');

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

        if (titleSpan) {
          console.log("[Hunter] Gefundener Text:", titleSpan.textContent);
          if (titleSpan.textContent === "CUSTOM FEEDS") {
            console.log("[Hunter] CUSTOM FEEDS Element gefunden");
            const details = element.querySelector("details");

            if (details) {
              console.log(
                "[Hunter] Details Element Status:",
                details.hasAttribute("open") ? "offen" : "geschlossen"
              );
              if (details.hasAttribute("open")) {
                details.removeAttribute("open");
                const animator = element.querySelector(
                  "faceplate-auto-height-animator"
                );

                if (animator) {
                  console.log("[Hunter] Schließe Animation");
                  animator.style.height = "0px";
                  const content = animator.querySelector(
                    "[faceplate-auto-height-animator-content]"
                  );
                  if (content) {
                    content.style.opacity = "0";
                    content.style.display = "none";
                    console.log("[Hunter] Element erfolgreich geschlossen");
                  }
                }
              }
            } else {
              console.warn("[Hunter] Details Element nicht gefunden");
            }
          }
        } else {
          console.warn("[Hunter] TitleSpan nicht gefunden");
        }
      });
      clearInterval(waitForSidebar);
      console.log("[Hunter] Interval gestoppt");
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
window.addEventListener('load', () => {
    console.log('[Hunter] Seite vollständig geladen');
    setTimeout(collapseElements, 2000);
});

// Führe die Funktion aus, wenn die Seite geladen ist
document.addEventListener("DOMContentLoaded", collapseElements);
// Führe die Funktion auch bei AJAX-Navigation aus
window.addEventListener("popstate", collapseElements);
