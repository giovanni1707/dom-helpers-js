/**
 * global-query.js
 *
 * Enhancement Layer - Global Query Functions
 * Provides enhanced global querySelector and querySelectorAll functions
 *
 * Features:
 * - Global query functions with element enhancement
 * - Enhanced NodeList with array methods and utilities
 * - Automatic .update() method integration
 * - Scoped query functions (queryWithin, queryAllWithin)
 *
 * Merged from: 03_dh-global-query.js (base) + 07_dh-bulk-properties-updater-global-query.js (features)
 *
 * @version 2.3.1
 * @license MIT
 * @author DOM Helpers Team
 */

(function(root, factory) {
  'use strict';

  // UMD pattern
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['./element-enhancer-core'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS/Node
    module.exports = factory(
      typeof require === 'function' ? require('./element-enhancer-core') : null
    );
  } else {
    // Browser globals
    root.GlobalQuery = factory(root.ElementEnhancerCore);
  }
}(typeof self !== 'undefined' ? self : this, function(ElementEnhancerCore) {
  'use strict';

  // ========================================================================
  // DEPENDENCIES AND UTILITIES
  // ========================================================================

  /**
   * Check if ElementEnhancerCore is available
   * @returns {boolean}
   */
  function hasEnhancerCore() {
    return ElementEnhancerCore !== null && typeof ElementEnhancerCore === 'object';
  }

  /**
   * Check if UpdateUtility is available
   * @returns {boolean}
   */
  function hasUpdateUtility() {
    const global = typeof window !== 'undefined' ? window :
                   typeof global !== 'undefined' ? global :
                   typeof self !== 'undefined' ? self : {};
    return typeof global.EnhancedUpdateUtility !== 'undefined';
  }

  // ========================================================================
  // ELEMENT ENHANCEMENT
  // ========================================================================

  /**
   * Enhance a single element with .update() method
   * @param {HTMLElement} element - Element to enhance
   * @returns {HTMLElement} - Enhanced element
   */
  function enhanceElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Check if already enhanced
    if (element._hasGlobalQueryUpdate || element._hasEnhancedUpdateMethod) {
      return element;
    }

    // Try to use ElementEnhancerCore first
    if (hasEnhancerCore()) {
      const enhanced = ElementEnhancerCore.enhanceElement(element);

      // Mark as enhanced by global query
      try {
        Object.defineProperty(enhanced, '_hasGlobalQueryUpdate', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (e) {
        enhanced._hasGlobalQueryUpdate = true;
      }

      return enhanced;
    }

    // Fallback: check if UpdateUtility is available
    if (hasUpdateUtility()) {
      const global = typeof window !== 'undefined' ? window :
                     typeof global !== 'undefined' ? global :
                     typeof self !== 'undefined' ? self : {};

      if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
        const enhanced = global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);

        try {
          Object.defineProperty(enhanced, '_hasGlobalQueryUpdate', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
          });
        } catch (e) {
          enhanced._hasGlobalQueryUpdate = true;
        }

        return enhanced;
      }
    }

    // If no enhancement available, return as-is
    return element;
  }

  // ========================================================================
  // NODELIST ENHANCEMENT
  // ========================================================================

  /**
   * Create an empty enhanced collection
   * @returns {Object}
   */
  function createEmptyCollection() {
    return enhanceNodeList([], 'empty');
  }

  /**
   * Enhance NodeList with array methods and utilities
   * @param {NodeList|Array} nodeList - NodeList or array to enhance
   * @param {string} selector - Original selector used
   * @returns {Object} - Enhanced collection
   */
  function enhanceNodeList(nodeList, selector) {
    if (!nodeList) {
      return createEmptyCollection();
    }

    // Check if already enhanced
    if (nodeList._hasGlobalQueryUpdate || nodeList._hasEnhancedUpdateMethod) {
      return nodeList;
    }

    const collection = {
      _originalNodeList: nodeList,
      _selector: selector,
      _cachedAt: Date.now(),

      get length() {
        return nodeList.length;
      },

      // NodeList compatibility methods
      item(index) {
        return enhanceElement(nodeList.item ? nodeList.item(index) : nodeList[index]);
      },

      entries() {
        return nodeList.entries ? nodeList.entries() : [][Symbol.iterator]();
      },

      keys() {
        return nodeList.keys ? nodeList.keys() : [][Symbol.iterator]();
      },

      values() {
        return nodeList.values ? nodeList.values() : [][Symbol.iterator]();
      },

      // Conversion
      toArray() {
        return Array.from(nodeList).map(el => enhanceElement(el));
      },

      // Array-like methods
      forEach(callback, thisArg) {
        Array.from(nodeList).forEach((el, index) => {
          callback.call(thisArg, enhanceElement(el), index, collection);
        }, thisArg);
      },

      map(callback, thisArg) {
        return Array.from(nodeList).map((el, index) =>
          callback.call(thisArg, enhanceElement(el), index, collection)
        , thisArg);
      },

      filter(callback, thisArg) {
        return Array.from(nodeList).filter((el, index) =>
          callback.call(thisArg, enhanceElement(el), index, collection)
        , thisArg);
      },

      find(callback, thisArg) {
        return Array.from(nodeList).find((el, index) =>
          callback.call(thisArg, enhanceElement(el), index, collection)
        , thisArg);
      },

      some(callback, thisArg) {
        return Array.from(nodeList).some((el, index) =>
          callback.call(thisArg, enhanceElement(el), index, collection)
        , thisArg);
      },

      every(callback, thisArg) {
        return Array.from(nodeList).every((el, index) =>
          callback.call(thisArg, enhanceElement(el), index, collection)
        , thisArg);
      },

      reduce(callback, initialValue) {
        return Array.from(nodeList).reduce((acc, el, index) =>
          callback(acc, enhanceElement(el), index, collection)
        , initialValue);
      },

      // Utility methods
      first() {
        return nodeList.length > 0 ? enhanceElement(nodeList[0]) : null;
      },

      last() {
        return nodeList.length > 0 ? enhanceElement(nodeList[nodeList.length - 1]) : null;
      },

      at(index) {
        if (index < 0) index = nodeList.length + index;
        return index >= 0 && index < nodeList.length ? enhanceElement(nodeList[index]) : null;
      },

      isEmpty() {
        return nodeList.length === 0;
      },

      // DOM manipulation shortcuts
      addClass(className) {
        this.forEach(el => el.classList.add(className));
        return this;
      },

      removeClass(className) {
        this.forEach(el => el.classList.remove(className));
        return this;
      },

      toggleClass(className) {
        this.forEach(el => el.classList.toggle(className));
        return this;
      },

      setProperty(prop, value) {
        this.forEach(el => el[prop] = value);
        return this;
      },

      setAttribute(attr, value) {
        this.forEach(el => el.setAttribute(attr, value));
        return this;
      },

      setStyle(styles) {
        this.forEach(el => {
          Object.assign(el.style, styles);
        });
        return this;
      },

      on(event, handler) {
        this.forEach(el => el.addEventListener(event, handler));
        return this;
      },

      off(event, handler) {
        this.forEach(el => el.removeEventListener(event, handler));
        return this;
      }
    };

    // Add numeric index access
    for (let i = 0; i < nodeList.length; i++) {
      Object.defineProperty(collection, i, {
        get() {
          return enhanceElement(nodeList[i]);
        },
        enumerable: true
      });
    }

    // Make collection iterable
    collection[Symbol.iterator] = function*() {
      for (let i = 0; i < nodeList.length; i++) {
        yield enhanceElement(nodeList[i]);
      }
    };

    // Try to enhance with update method using ElementEnhancerCore
    if (hasEnhancerCore()) {
      ElementEnhancerCore.enhanceCollection(collection);
    } else if (hasUpdateUtility()) {
      const global = typeof window !== 'undefined' ? window :
                     typeof global !== 'undefined' ? global :
                     typeof self !== 'undefined' ? self : {};

      if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        global.EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
      }
    }

    // Mark as enhanced
    try {
      Object.defineProperty(collection, '_hasGlobalQueryUpdate', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {
      collection._hasGlobalQueryUpdate = true;
    }

    return collection;
  }

  // ========================================================================
  // QUERY FUNCTIONS
  // ========================================================================

  /**
   * Enhanced querySelector
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context to query within
   * @returns {HTMLElement|null} - Enhanced element or null
   */
  function querySelector(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[GlobalQuery] querySelector requires a string selector');
      return null;
    }

    try {
      const element = context.querySelector(selector);
      return element ? enhanceElement(element) : null;
    } catch (error) {
      console.warn(`[GlobalQuery] Invalid selector "${selector}": ${error.message}`);
      return null;
    }
  }

  /**
   * Enhanced querySelectorAll
   * @param {string} selector - CSS selector
   * @param {Element|Document} context - Context to query within
   * @returns {Object} - Enhanced NodeList collection
   */
  function querySelectorAll(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[GlobalQuery] querySelectorAll requires a string selector');
      return createEmptyCollection();
    }

    try {
      const nodeList = context.querySelectorAll(selector);
      return enhanceNodeList(nodeList, selector);
    } catch (error) {
      console.warn(`[GlobalQuery] Invalid selector "${selector}": ${error.message}`);
      return createEmptyCollection();
    }
  }

  /**
   * Alias for querySelector
   */
  const query = querySelector;

  /**
   * Alias for querySelectorAll
   */
  const queryAll = querySelectorAll;

  /**
   * Query within a container element
   * @param {string|Element} container - Container element or selector
   * @param {string} selector - CSS selector to query
   * @returns {HTMLElement|null}
   */
  function queryWithin(container, selector) {
    const containerEl = typeof container === 'string' ?
      document.querySelector(container) : container;

    if (!containerEl) {
      console.warn('[GlobalQuery] Container not found');
      return null;
    }

    return querySelector(selector, containerEl);
  }

  /**
   * Query all within a container element
   * @param {string|Element} container - Container element or selector
   * @param {string} selector - CSS selector to query
   * @returns {Object} - Enhanced NodeList collection
   */
  function queryAllWithin(container, selector) {
    const containerEl = typeof container === 'string' ?
      document.querySelector(container) : container;

    if (!containerEl) {
      console.warn('[GlobalQuery] Container not found');
      return createEmptyCollection();
    }

    return querySelectorAll(selector, containerEl);
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const GlobalQuery = {
    version: '2.3.1',

    // Query functions
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    query: query,
    queryAll: queryAll,
    queryWithin: queryWithin,
    queryAllWithin: queryAllWithin,

    // Enhancement functions
    enhanceElement: enhanceElement,
    enhanceNodeList: enhanceNodeList,

    // Utilities
    hasEnhancerCore: hasEnhancerCore,
    hasUpdateUtility: hasUpdateUtility
  };

  return GlobalQuery;
}));
