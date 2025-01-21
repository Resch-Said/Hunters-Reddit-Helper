document.addEventListener("DOMContentLoaded", function () {
  const elements = ["customFeeds", "recent", "communities", "resources"];

  // Lade gespeicherte Einstellungen
  elements.forEach((id) => {
    chrome.storage.sync.get(id, (data) => {
      document.getElementById(id).checked = data[id] ?? true;
    });
  });

  // Event Listener für Änderungen
  elements.forEach((id) => {
    document.getElementById(id).addEventListener("change", function (e) {
      let value = e.target.checked;
      chrome.storage.sync.set({ [id]: value });

      // Wenn customFeeds oder recent geändert wird
      if (id === "customFeeds" || id === "recent") {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0].url.includes("reddit.com")) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function:
                  id === "customFeeds" ? toggleCustomFeeds : toggleRecent,
                args: [value],
              });
            }
          }
        );
      }
    });
  });

  function toggleRecent(show) {
    const recentSections = document.querySelectorAll(
      "faceplate-expandable-section-helper"
    );
    if (recentSections && recentSections.length >= 2) {
      const recentSection = recentSections[1];
      const parentDetails = recentSection.querySelector("details");
      if (parentDetails) {
        if (!show) {
          parentDetails.removeAttribute("open");
        } else {
          parentDetails.setAttribute("open", "");
        }
      }
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
