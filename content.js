function toggleCustomFeeds(show) {
  const customFeedsSection = document.querySelector(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details"
  );
  if (customFeedsSection) {
    customFeedsSection.style.visibility = "visible"; // Mache es wieder sichtbar
    const parentDetails = customFeedsSection.closest("details");
    if (parentDetails) {
      if (!show) {
        parentDetails.removeAttribute("open");
      } else {
        parentDetails.setAttribute("open", "");
      }
    }
  }
}

// Listen beim Laden der Seite
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("customFeeds", (data) => {
    const isEnabled = data.customFeeds ?? true;
    // Warte kurz, bis Reddit seine Komponenten geladen hat
    setTimeout(() => toggleCustomFeeds(isEnabled), 1000);
  });
});

// MutationObserver für dynamisch geladene Elemente
const observer = new MutationObserver((mutations, obs) => {
  const customFeedsSection = document.querySelector(
    "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details"
  );

  if (customFeedsSection) {
    chrome.storage.sync.get("customFeeds", (data) => {
      const isEnabled = data.customFeeds ?? true;
      toggleCustomFeeds(isEnabled);
    });
    obs.disconnect(); // Observer stoppen nach Fund
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Auf Änderungen hören
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.customFeeds) {
    toggleCustomFeeds(changes.customFeeds.newValue);
  }
});
