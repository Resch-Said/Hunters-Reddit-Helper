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

      // Wenn customFeeds geändert wird, sende Message an Content Script
      if (id === "customFeeds") {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0].url.includes("reddit.com")) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleCustomFeeds,
                args: [value],
              });
            }
          }
        );
      }
    });
  });

  function toggleCustomFeeds(show) {
    const customFeedsSection = document.querySelector(
      "#left-sidebar > nav > faceplate-expandable-section-helper:nth-child(9) > details > summary > faceplate-tracker > li > div"
    );
    if (customFeedsSection) {
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
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Erweiterung installiert!");
});
