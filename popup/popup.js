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

      // Wenn customFeeds, recent, communities oder resources geändert wird
      if (
        id === "customFeeds" ||
        id === "recent" ||
        id === "communities" ||
        id === "resources"
      ) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0].url.includes("reddit.com")) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: getToggleFunction(id),
                args: [value],
              });
            }
          }
        );
      }
    });
  });
});

function getToggleFunction(id) {
  if (id === "customFeeds") return toggleCustomFeeds;
  if (id === "recent") return toggleRecent;
  if (id === "communities") return toggleCommunities;
  return toggleResources;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
