document.addEventListener('DOMContentLoaded', () => {
  const toggleCustomFeeds = document.getElementById('toggleCustomFeeds');
  const toggleRecent = document.getElementById('toggleRecent');
  const toggleCommunities = document.getElementById('toggleCommunities');
  const toggleResources = document.getElementById('toggleResources');

  // Load saved preferences and set toggle states
  chrome.storage.sync.get(['customFeeds', 'recent', 'communities', 'resources'], (result) => {
    toggleCustomFeeds.checked = result.customFeeds !== undefined ? result.customFeeds : true;
    toggleRecent.checked = result.recent !== undefined ? result.recent : true;
    toggleCommunities.checked = result.communities !== undefined ? result.communities : true;
    toggleResources.checked = result.resources !== undefined ? result.resources : true;
  });

  // Save preferences when toggles are changed
  toggleCustomFeeds.addEventListener('change', () => {
    chrome.storage.sync.set({customFeeds: toggleCustomFeeds.checked});
  });

  toggleRecent.addEventListener('change', () => {
    chrome.storage.sync.set({recent: toggleRecent.checked});
  });

  toggleCommunities.addEventListener('change', () => {
    chrome.storage.sync.set({communities: toggleCommunities.checked});
  });

  toggleResources.addEventListener('change', () => {
    chrome.storage.sync.set({resources: toggleResources.checked});
  });
});
