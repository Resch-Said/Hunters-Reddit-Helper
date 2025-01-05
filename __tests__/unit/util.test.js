const { log, waitForElement, isVisible, getElementByXPath, showElement, simulateClick, collapseElement, collapseElements } = require('../../src/utils/util');

describe('Utility Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('log', () => {
    it('should log a message with the correct prefix', () => {
      console.log = jest.fn();
      log('Test message');
      expect(console.log).toHaveBeenCalledWith('[Hunter] Test message');
    });
  });

  describe('waitForElement', () => {
    it('should resolve when the element is found', async () => {
      setTimeout(() => {
        document.body.innerHTML = '<div id="test"></div>';
      }, 100);
      const element = await waitForElement('#test');
      expect(element).not.toBeNull();
      expect(element.id).toBe('test');
    });

    it('should reject when the element is not found within the timeout', async () => {
      await expect(waitForElement('#nonexistent', 100)).rejects.toMatch('Element #nonexistent nicht gefunden nach 100ms');
    });
  });

  describe('isVisible', () => {
    it('should return true for visible elements', () => {
      document.body.innerHTML = '<div id="test" style="display: block;"></div>';
      const element = document.getElementById('test');
      expect(isVisible(element)).toBe(true);
    });

    it('should return false for hidden elements', () => {
      document.body.innerHTML = '<div id="test" style="display: none;"></div>';
      const element = document.getElementById('test');
      expect(isVisible(element)).toBe(false);
    });
  });

  describe('getElementByXPath', () => {
    it('should return the correct element for a valid XPath', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = getElementByXPath('//*[@id="test"]');
      expect(element).not.toBeNull();
      expect(element.id).toBe('test');
    });

    it('should return null for an invalid XPath', () => {
      const element = getElementByXPath('//*[@id="nonexistent"]');
      expect(element).toBeNull();
    });
  });

  describe('showElement', () => {
    it('should add the hunter-visible class to the element', () => {
      document.body.innerHTML = '<div id="test"></div>';
      const element = document.getElementById('test');
      showElement(element);
      expect(element.classList.contains('hunter-visible')).toBe(true);
    });

    it('should not add the hunter-visible class to reddit-recent-pages elements', () => {
      document.body.innerHTML = '<reddit-recent-pages id="test"></reddit-recent-pages>';
      const element = document.getElementById('test');
      showElement(element);
      expect(element.classList.contains('hunter-visible')).toBe(false);
    });
  });

  describe('simulateClick', () => {
    it('should dispatch a click event on the element', () => {
      const element = document.createElement('div');
      const clickHandler = jest.fn();
      element.addEventListener('click', clickHandler);
      simulateClick(element);
      expect(clickHandler).toHaveBeenCalled();
    });
  });

  describe('collapseElement', () => {
    it('should collapse the element and return true', () => {
      document.body.innerHTML = '<details open><summary>Test</summary></details>';
      const element = document.querySelector('details');
      const result = collapseElement(element, 'TEST');
      expect(result).toBe(true);
      expect(element.hasAttribute('open')).toBe(false);
    });

    it('should return false if the element is null', () => {
      const result = collapseElement(null, 'TEST');
      expect(result).toBe(false);
    });
  });

  describe('collapseElements', () => {
    it('should collapse all elements based on the provided XPath selectors', () => {
      document.body.innerHTML = `
        <details id="customFeeds" open><summary>Custom Feeds</summary></details>
        <details id="communities" open><summary>Communities</summary></details>
      `;
      const xpathSelectors = {
        CUSTOM_FEEDS: '//*[@id="customFeeds"]',
        COMMUNITIES: '//*[@id="communities"]',
      };
      const processedElements = new Set();
      collapseElements(xpathSelectors, processedElements);
      expect(processedElements.has('CUSTOM_FEEDS')).toBe(true);
      expect(processedElements.has('COMMUNITIES')).toBe(true);
    });
  });
});
