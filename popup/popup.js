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
    });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
