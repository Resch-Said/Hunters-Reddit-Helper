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

      // Wenn customFeeds, recent oder communities geändert wird
      if (id === "customFeeds" || id === "recent" || id === "communities") {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0].url.includes("reddit.com")) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function:
                  id === "customFeeds" ? toggleCustomFeeds : 
                  id === "recent" ? toggleRecent : 
                  toggleCommunities,
                args: [value],
              });
            }
          }
        );
      }
    });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
