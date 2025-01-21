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

  chrome.storage.sync.get("recent", (data) => {
    const isEnabled = data.recent ?? true;

    const checkInterval = setInterval(() => {
      const recentPages = document.querySelector(
        "#left-sidebar > nav > reddit-recent-pages"
      );
      if (
        recentPages?.shadowRoot?.querySelector(
          "faceplate-expandable-section-helper"
        )
      ) {
        toggleRecent(isEnabled);
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => clearInterval(checkInterval), 5000);
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
