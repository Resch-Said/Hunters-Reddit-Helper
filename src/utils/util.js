/**
 * Generische Logging-Funktion
 * @param {string} message - Die zu loggende Nachricht
 */
function log(message) {
  console.log(`[Hunter] ${message}`);
}

/**
 * Wartet auf ein Element im DOM
 * @param {string} selector - CSS Selector des Elements
 * @param {number} timeout - Optional: Timeout in ms
 * @returns {Promise<Element>} Das gefundene Element
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(`Element ${selector} nicht gefunden nach ${timeout}ms`);
    }, timeout);
  });
}

/**
 * Prüft ob ein Element sichtbar ist
 * @param {Element} element - Das zu prüfende Element
 * @returns {boolean} true wenn das Element sichtbar ist
 */
function isVisible(element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Findet ein Element anhand eines XPath-Ausdrucks
 * @param {string} xpath - Der XPath-Ausdruck
 * @returns {Element|null} Das gefundene Element oder null
 */
function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
