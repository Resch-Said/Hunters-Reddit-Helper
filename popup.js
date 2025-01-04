document.addEventListener("DOMContentLoaded", () => {
  const toggleCustomFeeds = document.getElementById("toggleCustomFeeds");
  const toggleRecent = document.getElementById("toggleRecent");
  const toggleCommunities = document.getElementById("toggleCommunities");
  const toggleResources = document.getElementById("toggleResources");

  // Load saved states
  chrome.storage.sync.get(
    {
      customFeeds: true, // default values
      recent: true,
      communities: true,
      resources: true,
    },
    (items) => {
      toggleCustomFeeds.checked = items.customFeeds;
      toggleRecent.checked = items.recent;
      toggleCommunities.checked = items.communities;
      toggleResources.checked = items.resources;
    }
  );

  // Save states on change
  toggleCustomFeeds.addEventListener("change", () => {
    chrome.storage.sync.set({ customFeeds: toggleCustomFeeds.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateState",
        type: "customFeeds",
        state: toggleCustomFeeds.checked,
      });
    });
  });

  toggleRecent.addEventListener("change", () => {
    chrome.storage.sync.set({ recent: toggleRecent.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateState",
        type: "recent",
        state: toggleRecent.checked,
      });
    });
  });

  toggleCommunities.addEventListener("change", () => {
    chrome.storage.sync.set({ communities: toggleCommunities.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateState",
        type: "communities",
        state: toggleCommunities.checked,
      });
    });
  });

  toggleResources.addEventListener("change", () => {
    chrome.storage.sync.set({ resources: toggleResources.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateState",
        type: "resources",
        state: toggleResources.checked,
      });
    });
  });
});
