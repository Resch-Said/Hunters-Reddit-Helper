function handleMessage(request, sender, sendResponse) {
    if (request.action === "getData") {
        // Hier können Sie Daten verarbeiten und zurücksenden
        sendResponse({ data: "Hier sind Ihre Daten!" });
    }
}

chrome.runtime.onMessage.addListener(handleMessage);