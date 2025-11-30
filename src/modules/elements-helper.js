/**
 * DOM Helpers - Elements Helper Module
 * High-performance element access with caching, mutation observation, and auto-enhancement
 *
 * @module elements-helper
 * @version 2.3.1
 * @license MIT
 *
 * This module provides the Elements helper functionality used by DOM Helpers.
 * It can be used standalone or as a dependency for other modules.
 *
 * Features:
 * - Proxy-based element access via Elements.elementId
 * - Intelligent caching with automatic cleanup
 * - MutationObserver for DOM sync
 * - Automatic .update() method enhancement
 * - Batch operations and destructuring
 * - Safe element access with fallbacks
 * - Performance monitoring and stats
 *
 * @example
 * // Standalone usage
 * import { Elements } from './elements-helper.js';
 *
 * // Access elements
 * const button = Elements.myButton;
 * button.update({ textContent: 'Click me' });
 *
 * // Destructuring
 * const { header, footer } = Elements.destructure('header', 'footer');
 *
 * // Bulk updates
 * Elements.update({
 *   title: { textContent: 'New Title' },
 *   description: { style: { color: 'blue' } }
 * });
 */

(function (global, factory) {
  'use strict';

  // Universal Module Definition (UMD)
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS/Node.js
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], factory);
  } else {
    // Browser globals
    const exports = factory();
    global.Elements = exports.Elements;
    global.ProductionElementsHelper = exports.ProductionElementsHelper;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  'use strict';

  // ===== UPDATE UTILITY DETECTION =====
  // Try to import UpdateUtility if available
  let UpdateUtility;
  if (typeof require !== 'undefined') {
    try {
      UpdateUtility = require('./update-utility.js');
    } catch (e) {
      // UpdateUtility not available in this environment
    }
  } else if (typeof global !== 'undefined' && global.DOMHelpersUpdateUtility) {
    UpdateUtility = global.DOMHelpersUpdateUtility;
  } else if (typeof window !== 'undefined' && window.DOMHelpersUpdateUtility) {
    UpdateUtility = window.DOMHelpersUpdateUtility;
  }

  // ===== HELPER FUNCTIONS =====

  /**
   * Creates an enhanced event handler that adds .update() method to event.target and this
   * @param {Function} originalHandler - Original event handler
   * @param {Function} enhanceElementFn - Function to enhance elements
   * @returns {Function} Enhanced event handler
   */
  function createEnhancedEventHandler(originalHandler, enhanceElementFn) {
    return function enhancedEventHandler(event) {
      // Add update method to event.target if it doesn't exist
      if (event.target && !event.target.update) {
        enhanceElementFn(event.target);
      }

      // Add update method to 'this' context if it doesn't exist (for non-arrow functions)
      if (this && this.nodeType === Node.ELEMENT_NODE && !this.update) {
        enhanceElementFn(this);
      }

      // Call the original handler with the enhanced context
      return originalHandler.call(this, event);
    };
  }

  /**
   * Handles enhanced event listener with support for multiple formats
   * @param {HTMLElement} element - Target element
   * @param {*} value - Event listener configuration
   * @param {Function} enhanceElementFn - Function to enhance elements
   */
  function handleEnhancedEventListener(element, value, enhanceElementFn) {
    // Handle legacy array format: ['click', handler, options]
    if (Array.isArray(value) && value.length >= 2) {
      const [eventType, handler, options] = value;
      const enhancedHandler = createEnhancedEventHandler(handler, enhanceElementFn);
      element.addEventListener(eventType, enhancedHandler, options);
      return;
    }

    // Handle new object format for multiple events
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([eventType, handler]) => {
        if (typeof handler === 'function') {
          const enhancedHandler = createEnhancedEventHandler(handler, enhanceElementFn);
          element.addEventListener(eventType, enhancedHandler);
        } else if (Array.isArray(handler) && handler.length >= 1) {
          // Support [handlerFunction, options] format
          const [handlerFunc, options] = handler;
          if (typeof handlerFunc === 'function') {
            const enhancedHandler = createEnhancedEventHandler(handlerFunc, enhanceElementFn);
            element.addEventListener(eventType, enhancedHandler, options);
          }
        }
      });
      return;
    }

    console.warn('[Elements] Invalid addEventListener format');
  }

  /**
   * Applies a single update to an element (fallback when UpdateUtility is not available)
   * @param {HTMLElement} element - Target element
   * @param {string} key - Property/attribute key
   * @param {*} value - Value to apply
   */
  function applyEnhancedUpdate(element, key, value) {
    try {
      // Handle style object
      if (key === 'style' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([styleProperty, styleValue]) => {
          if (styleValue !== null && styleValue !== undefined) {
            element.style[styleProperty] = styleValue;
          }
        });
        return;
      }

      // Handle classList methods
      if (key === 'classList' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([method, classes]) => {
          try {
            switch (method) {
              case 'add':
                if (Array.isArray(classes)) {
                  element.classList.add(...classes);
                } else if (typeof classes === 'string') {
                  element.classList.add(classes);
                }
                break;
              case 'remove':
                if (Array.isArray(classes)) {
                  element.classList.remove(...classes);
                } else if (typeof classes === 'string') {
                  element.classList.remove(classes);
                }
                break;
              case 'toggle':
                if (Array.isArray(classes)) {
                  classes.forEach((cls) => element.classList.toggle(cls));
                } else if (typeof classes === 'string') {
                  element.classList.toggle(classes);
                }
                break;
              case 'replace':
                if (Array.isArray(classes) && classes.length === 2) {
                  element.classList.replace(classes[0], classes[1]);
                }
                break;
            }
          } catch (error) {
            console.warn(`[Elements] Error in classList.${method}: ${error.message}`);
          }
        });
        return;
      }

      // Handle setAttribute - enhanced support for both array and object formats
      if (key === 'setAttribute') {
        if (Array.isArray(value) && value.length >= 2) {
          // Legacy array format: ['src', 'image.png']
          element.setAttribute(value[0], value[1]);
        } else if (typeof value === 'object' && value !== null) {
          // New object format: { src: 'image.png', alt: 'Description' }
          Object.entries(value).forEach(([attrName, attrValue]) => {
            element.setAttribute(attrName, attrValue);
          });
        }
        return;
      }

      // Handle removeAttribute
      if (key === 'removeAttribute') {
        if (Array.isArray(value)) {
          value.forEach((attr) => element.removeAttribute(attr));
        } else if (typeof value === 'string') {
          element.removeAttribute(value);
        }
        return;
      }

      // Handle dataset
      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
        return;
      }

      // Handle addEventListener - enhanced
      if (key === 'addEventListener') {
        // Note: enhanceElementFn will be bound when used
        console.warn('[Elements] addEventListener requires enhanced handler');
        return;
      }

      // Handle removeEventListener
      if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
        const [eventType, handler, options] = value;
        element.removeEventListener(eventType, handler, options);
        return;
      }

      // Handle DOM methods
      if (typeof element[key] === 'function') {
        if (Array.isArray(value)) {
          element[key](...value);
        } else {
          element[key](value);
        }
        return;
      }

      // Handle regular properties
      if (key in element) {
        element[key] = value;
        return;
      }

      // Fallback to setAttribute
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        element.setAttribute(key, value);
      }
    } catch (error) {
      console.warn(`[Elements] Error updating ${key}: ${error.message}`);
    }
  }

  // ===== PRODUCTION ELEMENTS HELPER CLASS =====

  class ProductionElementsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        ...options,
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now(),
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Elements = new Proxy(this, {
        get: (target, prop) => {
          // Handle internal methods and symbols
          if (
            typeof prop === 'symbol' ||
            prop.startsWith('_') ||
            typeof target[prop] === 'function'
          ) {
            return target[prop];
          }

          return target._getElement(prop);
        },

        has: (target, prop) => target._hasElement(prop),

        ownKeys: (target) => target._getKeys(),

        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasElement(prop)) {
            return {
              enumerable: true,
              configurable: true,
              value: target._getElement(prop),
            };
          }
          return undefined;
        },
      });
    }

    _getElement(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid element property type: ${typeof prop}`);
        return null;
      }

      // Check cache first
      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (
          element &&
          element.nodeType === Node.ELEMENT_NODE &&
          document.contains(element)
        ) {
          this.stats.hits++;
          return this._enhanceElementWithUpdate(element);
        } else {
          this.cache.delete(prop);
        }
      }

      // Use exact ID matching - no conversion
      const element = document.getElementById(prop);
      if (element) {
        this._addToCache(prop, element);
        this.stats.misses++;
        return this._enhanceElementWithUpdate(element);
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Element with id '${prop}' not found`);
      }
      return null;
    }

    _hasElement(prop) {
      if (typeof prop !== 'string') return false;

      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (
          element &&
          element.nodeType === Node.ELEMENT_NODE &&
          document.contains(element)
        ) {
          return true;
        }
        this.cache.delete(prop);
      }

      return !!document.getElementById(prop);
    }

    _getKeys() {
      // Return all element IDs in the document
      const elements = document.querySelectorAll('[id]');
      return Array.from(elements)
        .map((el) => el.id)
        .filter((id) => id);
    }

    _addToCache(id, element) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, element);
      this.stats.cacheSize = this.cache.size;

      this.weakCache.set(element, {
        id,
        cachedAt: Date.now(),
        accessCount: 1,
      });
    }

    _initMutationObserver() {
      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);

      // Only observe if document.body exists
      if (typeof document !== 'undefined' && document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id'],
          attributeOldValue: true,
        });
      } else if (typeof document !== 'undefined') {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id'],
              attributeOldValue: true,
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const addedIds = new Set();
      const removedIds = new Set();

      mutations.forEach((mutation) => {
        // Handle added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) addedIds.add(node.id);

            // Check child elements
            try {
              const childrenWithIds = node.querySelectorAll
                ? node.querySelectorAll('[id]')
                : [];
              childrenWithIds.forEach((child) => {
                if (child.id) addedIds.add(child.id);
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) removedIds.add(node.id);

            // Check child elements
            try {
              const childrenWithIds = node.querySelectorAll
                ? node.querySelectorAll('[id]')
                : [];
              childrenWithIds.forEach((child) => {
                if (child.id) removedIds.add(child.id);
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle ID attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const oldId = mutation.oldValue;
          const newId = mutation.target.id;

          if (oldId && oldId !== newId) {
            removedIds.add(oldId);
          }
          if (newId && newId !== oldId) {
            addedIds.add(newId);
          }
        }
      });

      // Update cache for added elements
      addedIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          this._addToCache(id, element);
        }
      });

      // Remove cached elements that are no longer valid
      removedIds.forEach((id) => {
        this.cache.delete(id);
      });

      this.stats.cacheSize = this.cache.size;
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const beforeSize = this.cache.size;
      const staleIds = [];

      for (const [id, element] of this.cache) {
        if (
          !element ||
          element.nodeType !== Node.ELEMENT_NODE ||
          !document.contains(element) ||
          element.id !== id
        ) {
          staleIds.push(id);
        }
      }

      staleIds.forEach((id) => this.cache.delete(id));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleIds.length > 0) {
        this._log(
          `Cleanup completed. Removed ${staleIds.length} stale entries.`
        );
      }
    }

    _debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Elements] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Elements] ${message}`);
      }
    }

    // Enhanced element with update method
    _enhanceElementWithUpdate(element) {
      if (!element || element._hasUpdateMethod) {
        return element;
      }

      // Use UpdateUtility if available
      if (UpdateUtility && UpdateUtility.enhanceElementWithUpdate) {
        return UpdateUtility.enhanceElementWithUpdate(element);
      }

      // Simplified fallback: create basic update method inline
      try {
        const self = this;
        Object.defineProperty(element, 'update', {
          value: (updates = {}) => {
            if (!updates || typeof updates !== 'object') {
              console.warn('[Elements] .update() called with invalid updates object');
              return element;
            }

            try {
              Object.entries(updates).forEach(([key, value]) => {
                // Handle addEventListener with enhanced handler
                if (key === 'addEventListener') {
                  handleEnhancedEventListener(element, value, (el) => self._enhanceElementWithUpdate(el));
                  return;
                }

                // Use applyEnhancedUpdate for other updates
                applyEnhancedUpdate(element, key, value);
              });
            } catch (error) {
              console.warn(`[Elements] Error in .update(): ${error.message}`);
            }

            return element; // Return for chaining
          },
          writable: false,
          enumerable: false,
          configurable: true,
        });

        // Mark as enhanced
        Object.defineProperty(element, '_hasUpdateMethod', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      } catch (error) {
        // Fallback: attach as regular property
        const self = this;
        element.update = (updates = {}) => {
          if (!updates || typeof updates !== 'object') {
            console.warn('[Elements] .update() called with invalid updates object');
            return element;
          }

          try {
            Object.entries(updates).forEach(([key, value]) => {
              if (key === 'addEventListener') {
                handleEnhancedEventListener(element, value, (el) => self._enhanceElementWithUpdate(el));
                return;
              }
              applyEnhancedUpdate(element, key, value);
            });
          } catch (error) {
            console.warn(`[Elements] Error in .update(): ${error.message}`);
          }

          return element;
        };
        element._hasUpdateMethod = true;
      }

      return element;
    }

    // Public API
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup,
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Elements helper destroyed');
    }

    isCached(id) {
      return this.cache.has(id);
    }

    getCacheSnapshot() {
      return Array.from(this.cache.keys());
    }

    // Enhanced methods for destructuring support
    destructure(...ids) {
      const result = {};
      const missing = [];

      ids.forEach((id) => {
        const element = this._getElement(id);
        if (element) {
          result[id] = element;
        } else {
          missing.push(id);
          result[id] = null;
        }
      });

      if (missing.length > 0 && this.options.enableLogging) {
        this._warn(
          `Missing elements during destructuring: ${missing.join(', ')}`
        );
      }

      return result;
    }

    getRequired(...ids) {
      const elements = this.destructure(...ids);
      const missing = ids.filter((id) => !elements[id]);

      if (missing.length > 0) {
        throw new Error(`Required elements not found: ${missing.join(', ')}`);
      }

      return elements;
    }

    async waitFor(...ids) {
      const maxWait = 5000;
      const checkInterval = 100;
      const startTime = Date.now();

      while (Date.now() - startTime < maxWait) {
        const elements = this.destructure(...ids);
        const allFound = ids.every((id) => elements[id]);

        if (allFound) {
          return elements;
        }

        await new Promise((resolve) => setTimeout(resolve, checkInterval));
      }

      throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
    }

    // Safe element access with fallbacks
    get(id, fallback = null) {
      const element = this._getElement(id);
      return element || fallback;
    }

    exists(id) {
      return !!this._getElement(id);
    }

    // Batch operations
    getMultiple(...ids) {
      return this.destructure(...ids);
    }

    // Enhanced element manipulation
    setProperty(id, property, value) {
      const element = this._getElement(id);
      if (element && property in element) {
        element[property] = value;
        return true;
      }
      return false;
    }

    getProperty(id, property, fallback = undefined) {
      const element = this._getElement(id);
      if (element && property in element) {
        return element[property];
      }
      return fallback;
    }

    setAttribute(id, attribute, value) {
      const element = this._getElement(id);
      if (element) {
        element.setAttribute(attribute, value);
        return true;
      }
      return false;
    }

    getAttribute(id, attribute, fallback = null) {
      const element = this._getElement(id);
      if (element) {
        return element.getAttribute(attribute) || fallback;
      }
      return fallback;
    }
  }

  // ===== AUTO-INITIALIZE =====
  // Auto-initialize with sensible defaults
  const ElementsHelper = new ProductionElementsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
  });

  // Global API - Simple and clean
  const Elements = ElementsHelper.Elements;

  // Additional utilities
  Elements.helper = ElementsHelper;
  Elements.stats = () => ElementsHelper.getStats();
  Elements.clear = () => ElementsHelper.clearCache();
  Elements.destroy = () => ElementsHelper.destroy();

  // Direct implementations to avoid proxy recursion issues
  Elements.destructure = (...ids) => {
    const obj = {};
    ids.forEach((id) => {
      obj[id] = document.getElementById(id);
      if (obj[id]) {
        ElementsHelper._enhanceElementWithUpdate(obj[id]);
      }
    });
    return obj;
  };

  Elements.getRequired = (...ids) => {
    const elements = Elements.destructure(...ids);
    const missing = ids.filter((id) => !elements[id]);
    if (missing.length > 0) {
      throw new Error(`Required elements not found: ${missing.join(', ')}`);
    }
    return elements;
  };

  Elements.waitFor = async (...ids) => {
    const maxWait = 5000;
    const checkInterval = 100;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const elements = Elements.destructure(...ids);
      const allFound = ids.every((id) => elements[id]);

      if (allFound) {
        return elements;
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
  };

  Elements.isCached = (id) => ElementsHelper.cache.has(id);

  // Direct implementations to avoid proxy recursion issues
  Elements.get = (id, fallback = null) => {
    const element = document.getElementById(id);
    if (element) {
      ElementsHelper._enhanceElementWithUpdate(element);
      return element;
    }
    return fallback;
  };

  Elements.exists = (id) => !!document.getElementById(id);

  Elements.getMultiple = (...ids) => {
    const obj = {};
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        ElementsHelper._enhanceElementWithUpdate(element);
      }
      obj[id] = element;
    });
    return obj;
  };

  Elements.setProperty = (id, property, value) =>
    ElementsHelper.setProperty(id, property, value);

  Elements.getProperty = (id, property, fallback) =>
    ElementsHelper.getProperty(id, property, fallback);

  Elements.setAttribute = (id, attribute, value) =>
    ElementsHelper.setAttribute(id, attribute, value);

  Elements.getAttribute = (id, attribute, fallback) =>
    ElementsHelper.getAttribute(id, attribute, fallback);

  Elements.configure = (options) => {
    Object.assign(ElementsHelper.options, options);
    return Elements;
  };

  /**
   * Bulk update method for Elements helper
   * Allows updating multiple elements by their IDs in a single call
   *
   * @param {Object} updates - Object where keys are element IDs and values are update objects
   * @returns {Object} - Object with results for each element ID
   *
   * @example
   * Elements.update({
   *   title: { textContent: 'New Title', style: { color: 'red' } },
   *   description: { textContent: 'New Description', style: { fontSize: '16px' } },
   *   submitBtn: {
   *     textContent: 'Submit',
   *     addEventListener: ['click', () => console.log('Clicked!')]
   *   }
   * });
   */
  Elements.update = (updates = {}) => {
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn(
        '[Elements] Elements.update() requires an object with element IDs as keys'
      );
      return {};
    }

    const results = {};
    const successful = [];
    const failed = [];

    Object.entries(updates).forEach(([elementId, updateData]) => {
      try {
        // Get the element using the Elements helper
        const element = Elements[elementId];

        if (element && element.nodeType === Node.ELEMENT_NODE) {
          // Apply updates using the element's update method
          if (typeof element.update === 'function') {
            element.update(updateData);
            results[elementId] = { success: true, element };
            successful.push(elementId);
          } else {
            // Fallback if update method doesn't exist
            Object.entries(updateData).forEach(([key, value]) => {
              applyEnhancedUpdate(element, key, value);
            });
            results[elementId] = { success: true, element };
            successful.push(elementId);
          }
        } else {
          results[elementId] = {
            success: false,
            error: `Element with ID '${elementId}' not found`,
          };
          failed.push(elementId);
        }
      } catch (error) {
        results[elementId] = {
          success: false,
          error: error.message,
        };
        failed.push(elementId);
      }
    });

    // Log summary if logging is enabled
    if (ElementsHelper.options.enableLogging) {
      console.log(
        `[Elements] Bulk update completed: ${successful.length} successful, ${failed.length} failed`
      );
      if (failed.length > 0) {
        console.warn(`[Elements] Failed IDs:`, failed);
      }
    }

    return results;
  };

  // ===== AUTO-CLEANUP =====
  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      ElementsHelper.destroy();
    });
  }

  // ===== EXPORTS =====
  return {
    Elements,
    ProductionElementsHelper,
    version: '2.3.1',
  };
});
