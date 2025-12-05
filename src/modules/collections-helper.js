/**
 * DOM Helpers - Collections Helper Module
 * High-performance collection access with caching, mutation observation, and auto-enhancement
 *
 * @module collections-helper
 * @version 2.3.1
 * @license MIT
 *
 * This module provides the Collections helper functionality used by DOM Helpers.
 * It can be used standalone or as a dependency for other modules.
 *
 * Features:
 * - Proxy-based collection access (ClassName, TagName, Name)
 * - Intelligent caching with automatic cleanup
 * - MutationObserver for DOM sync
 * - Enhanced collections with array-like methods
 * - DOM manipulation methods (addClass, removeClass, setStyle, etc.)
 * - Filtering methods (visible, hidden, enabled, disabled)
 * - Automatic .update() method enhancement
 * - Batch operations and bulk updates
 * - Performance monitoring and stats
 *
 * @example
 * // Standalone usage
 * import { Collections } from './collections-helper.js';
 *
 * // Access collections
 * const buttons = Collections.ClassName.btn;
 * buttons.addClass('active');
 *
 * // Array-like methods
 * const divs = Collections.TagName.div;
 * divs.forEach(el => console.log(el));
 *
 * // Bulk updates
 * Collections.update({
 *   'class:btn': { style: { padding: '10px' } },
 *   'tag:p': { style: { lineHeight: '1.6' } },
 *   'name:username': { disabled: false }
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
    global.Collections = exports.Collections;
    global.ProductionCollectionHelper = exports.ProductionCollectionHelper;
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

  // ===== FALLBACK UPDATE FUNCTION =====
  /**
   * Fallback applyEnhancedUpdate function when UpdateUtility is not available
   * Provides basic update functionality for collection elements
   */
  function applyEnhancedUpdate(element, key, value) {
    if (!element || !element.nodeType) return;

    try {
      // Handle special cases
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key === 'classList' && typeof value === 'object') {
        Object.entries(value).forEach(([method, classes]) => {
          if (Array.isArray(classes)) {
            element.classList[method](...classes);
          } else {
            element.classList[method](classes);
          }
        });
      } else if (key === 'dataset' && typeof value === 'object') {
        Object.assign(element.dataset, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2), value);
      } else {
        element[key] = value;
      }
    } catch (error) {
      console.warn(`[Collections] Error updating ${key}:`, error.message);
    }
  }

  // Use UpdateUtility's applyEnhancedUpdate if available
  if (UpdateUtility && UpdateUtility.applyEnhancedUpdate) {
    applyEnhancedUpdate = UpdateUtility.applyEnhancedUpdate;
  }

  // ===== PRODUCTION COLLECTION HELPER CLASS =====

  /**
   * ProductionCollectionHelper - High-performance collection management
   * Provides intelligent caching, mutation observation, and enhanced collection features
   */
  class ProductionCollectionHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
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

      this._initProxies();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    // ===== PROXY INITIALIZATION =====

    _initProxies() {
      // Create function-style proxy for ClassName
      this.ClassName = this._createCollectionProxy("className");

      // Create function-style proxy for TagName
      this.TagName = this._createCollectionProxy("tagName");

      // Create function-style proxy for Name
      this.Name = this._createCollectionProxy("name");
    }

    _createCollectionProxy(type) {
      // Base function for direct calls: Collections.ClassName('item')
      const baseFunction = (value) => {
        const collection = this._getCollection(type, value);

        // Return enhanced collection with proxy if enhanced syntax is enabled
        if (this.options.enableEnhancedSyntax) {
          return this._createEnhancedCollectionProxy(collection);
        }

        return collection;
      };

      // Create proxy for property access: Collections.ClassName.item
      return new Proxy(baseFunction, {
        get: (target, prop) => {
          // Handle function properties and symbols
          if (
            typeof prop === "symbol" ||
            prop === "constructor" ||
            prop === "prototype" ||
            prop === "apply" ||
            prop === "call" ||
            prop === "bind" ||
            typeof target[prop] === "function"
          ) {
            return target[prop];
          }

          // Get collection for property name
          const collection = this._getCollection(type, prop);

          // Return enhanced collection if enhanced syntax is enabled
          if (this.options.enableEnhancedSyntax) {
            return this._createEnhancedCollectionProxy(collection);
          }

          return collection;
        },

        apply: (target, thisArg, args) => {
          if (args.length > 0) {
            return target(args[0]);
          }
          return this._createEmptyCollection();
        },
      });
    }

    _createEnhancedCollectionProxy(collection) {
      if (!collection || !this.options.enableEnhancedSyntax) return collection;

      return new Proxy(collection, {
        get: (target, prop) => {
          // Handle numeric indices
          if (!isNaN(prop) && parseInt(prop) >= 0) {
            const index = parseInt(prop);
            const element = target[index];

            if (element) {
              // Return enhanced element proxy
              return this._createElementProxy(element);
            }
            return element;
          }

          // Return collection methods and properties
          return target[prop];
        },

        set: (target, prop, value) => {
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(
              `Failed to set collection property ${prop}: ${e.message}`
            );
            return false;
          }
        },
      });
    }

    _createElementProxy(element) {
      if (!element || !this.options.enableEnhancedSyntax) return element;

      return new Proxy(element, {
        get: (target, prop) => {
          // Return the actual property value
          return target[prop];
        },
        set: (target, prop, value) => {
          // Set the property value
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(`Failed to set element property ${prop}: ${e.message}`);
            return false;
          }
        },
      });
    }

    // ===== COLLECTION MANAGEMENT =====

    _createCacheKey(type, value) {
      return `${type}:${value}`;
    }

    _getCollection(type, value) {
      if (typeof value !== "string") {
        this._warn(`Invalid ${type} property type: ${typeof value}`);
        return this._createEmptyCollection();
      }

      const cacheKey = this._createCacheKey(type, value);

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cachedCollection = this.cache.get(cacheKey);
        if (this._isValidCollection(cachedCollection)) {
          this.stats.hits++;
          return cachedCollection;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      // Get fresh collection from DOM
      let htmlCollection;
      try {
        switch (type) {
          case "className":
            htmlCollection = document.getElementsByClassName(value);
            break;
          case "tagName":
            htmlCollection = document.getElementsByTagName(value);
            break;
          case "name":
            htmlCollection = document.getElementsByName(value);
            break;
          default:
            this._warn(`Unknown collection type: ${type}`);
            return this._createEmptyCollection();
        }
      } catch (error) {
        this._warn(
          `Error getting ${type} collection for "${value}": ${error.message}`
        );
        return this._createEmptyCollection();
      }

      const collection = this._enhanceCollection(htmlCollection, type, value);
      this._addToCache(cacheKey, collection);
      this.stats.misses++;
      return collection;
    }

    _isValidCollection(collection) {
      // Check if collection is still valid by testing if first element is still in DOM
      if (!collection || !collection._originalCollection) return false;

      const live = collection._originalCollection;
      if (live.length === 0) return true; // Empty collections are valid

      // Check if first element is still in DOM and matches criteria
      const firstElement = live[0];
      return (
        firstElement &&
        firstElement.nodeType === Node.ELEMENT_NODE &&
        document.contains(firstElement)
      );
    }

    // ===== COLLECTION ENHANCEMENT =====

    _enhanceCollection(htmlCollection, type, value) {
      const collection = {
        _originalCollection: htmlCollection,
        _type: type,
        _value: value,
        _cachedAt: Date.now(),

        // Array-like properties and methods
        get length() {
          return htmlCollection.length;
        },

        item(index) {
          return htmlCollection.item(index);
        },

        namedItem(name) {
          return htmlCollection.namedItem
            ? htmlCollection.namedItem(name)
            : null;
        },

        // Array conversion and iteration
        toArray() {
          return Array.from(htmlCollection);
        },

        forEach(callback, thisArg) {
          Array.from(htmlCollection).forEach(callback, thisArg);
        },

        map(callback, thisArg) {
          return Array.from(htmlCollection).map(callback, thisArg);
        },

        filter(callback, thisArg) {
          return Array.from(htmlCollection).filter(callback, thisArg);
        },

        find(callback, thisArg) {
          return Array.from(htmlCollection).find(callback, thisArg);
        },

        some(callback, thisArg) {
          return Array.from(htmlCollection).some(callback, thisArg);
        },

        every(callback, thisArg) {
          return Array.from(htmlCollection).every(callback, thisArg);
        },

        reduce(callback, initialValue) {
          return Array.from(htmlCollection).reduce(callback, initialValue);
        },

        // Utility methods
        first() {
          return htmlCollection.length > 0 ? htmlCollection[0] : null;
        },

        last() {
          return htmlCollection.length > 0
            ? htmlCollection[htmlCollection.length - 1]
            : null;
        },

        at(index) {
          if (index < 0) index = htmlCollection.length + index;
          return index >= 0 && index < htmlCollection.length
            ? htmlCollection[index]
            : null;
        },

        isEmpty() {
          return htmlCollection.length === 0;
        },

        // DOM manipulation helpers
        addClass(className) {
          this.forEach((el) => el.classList.add(className));
          return this;
        },

        removeClass(className) {
          this.forEach((el) => el.classList.remove(className));
          return this;
        },

        toggleClass(className) {
          this.forEach((el) => el.classList.toggle(className));
          return this;
        },

        setProperty(prop, value) {
          this.forEach((el) => (el[prop] = value));
          return this;
        },

        setAttribute(attr, value) {
          this.forEach((el) => el.setAttribute(attr, value));
          return this;
        },

        setStyle(styles) {
          this.forEach((el) => {
            Object.assign(el.style, styles);
          });
          return this;
        },

        on(event, handler) {
          this.forEach((el) => el.addEventListener(event, handler));
          return this;
        },

        off(event, handler) {
          this.forEach((el) => el.removeEventListener(event, handler));
          return this;
        },

        // Filtering helpers
        visible() {
          return this.filter((el) => {
            const style = window.getComputedStyle(el);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0"
            );
          });
        },

        hidden() {
          return this.filter((el) => {
            const style = window.getComputedStyle(el);
            return (
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.opacity === "0"
            );
          });
        },

        enabled() {
          return this.filter(
            (el) => !el.disabled && !el.hasAttribute("disabled")
          );
        },

        disabled() {
          return this.filter(
            (el) => el.disabled || el.hasAttribute("disabled")
          );
        },
      };

      // Add indexed access
      for (let i = 0; i < htmlCollection.length; i++) {
        Object.defineProperty(collection, i, {
          get() {
            return htmlCollection[i];
          },
          enumerable: true,
        });
      }

      // Make it iterable
      collection[Symbol.iterator] = function* () {
        for (let i = 0; i < htmlCollection.length; i++) {
          yield htmlCollection[i];
        }
      };

      // Add update method to collection
      return this._enhanceCollectionWithUpdate(collection);
    }

    _createEmptyCollection() {
      const emptyCollection = {
        length: 0,
        item: () => null,
        namedItem: () => null,
      };
      return this._enhanceCollection(emptyCollection, "empty", "");
    }

    // ===== UPDATE METHOD ENHANCEMENT =====

    _enhanceCollectionWithUpdate(collection) {
      if (!collection || collection._hasEnhancedUpdateMethod) {
        return collection;
      }

      // Use UpdateUtility if available
      if (UpdateUtility && UpdateUtility.enhanceCollectionWithUpdate) {
        return UpdateUtility.enhanceCollectionWithUpdate(collection);
      }

      // Comprehensive fallback: create enhanced update method inline
      try {
        Object.defineProperty(collection, "update", {
          value: (updates = {}) => {
            if (!updates || typeof updates !== "object") {
              console.warn(
                "[Collections] .update() called with invalid updates object"
              );
              return collection;
            }

            // Get elements from collection
            let elements = [];
            if (collection._originalCollection) {
              elements = Array.from(collection._originalCollection);
            } else if (collection.length !== undefined) {
              elements = Array.from(collection);
            }

            if (elements.length === 0) {
              console.info(
                "[Collections] .update() called on empty collection"
              );
              return collection;
            }

            try {
              // Apply updates to each element in the collection
              elements.forEach((element) => {
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                  Object.entries(updates).forEach(([key, value]) => {
                    applyEnhancedUpdate(element, key, value);
                  });
                }
              });
            } catch (error) {
              console.warn(
                `[Collections] Error in collection .update(): ${error.message}`
              );
            }

            return collection; // Return for chaining
          },
          writable: false,
          enumerable: false,
          configurable: true,
        });

        // Mark as enhanced
        Object.defineProperty(collection, "_hasEnhancedUpdateMethod", {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      } catch (error) {
        // Fallback: attach as regular property
        collection.update = (updates = {}) => {
          if (!updates || typeof updates !== "object") {
            console.warn(
              "[Collections] .update() called with invalid updates object"
            );
            return collection;
          }

          let elements = [];
          if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
          } else if (collection.length !== undefined) {
            elements = Array.from(collection);
          }

          if (elements.length === 0) {
            console.info("[Collections] .update() called on empty collection");
            return collection;
          }

          try {
            elements.forEach((element) => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updates).forEach(([key, value]) => {
                  applyEnhancedUpdate(element, key, value);
                });
              }
            });
          } catch (error) {
            console.warn(
              `[Collections] Error in collection .update(): ${error.message}`
            );
          }

          return collection;
        };
        collection._hasEnhancedUpdateMethod = true;
      }

      return collection;
    }

    // ===== CACHE MANAGEMENT =====

    _addToCache(cacheKey, collection) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(cacheKey, collection);
      this.stats.cacheSize = this.cache.size;

      // Store metadata in weak cache
      this.weakCache.set(collection, {
        cacheKey,
        cachedAt: Date.now(),
        accessCount: 1,
      });
    }

    // ===== MUTATION OBSERVER =====

    _initMutationObserver() {
      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);

      // Only observe if document.body exists
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class", "name"],
          attributeOldValue: true,
        });
      } else {
        // Wait for DOM to be ready
        document.addEventListener("DOMContentLoaded", () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ["class", "name"],
              attributeOldValue: true,
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const affectedClasses = new Set();
      const affectedNames = new Set();
      const affectedTags = new Set();

      mutations.forEach((mutation) => {
        // Handle added/removed nodes
        [...mutation.addedNodes, ...mutation.removedNodes].forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Collect classes
            if (node.className) {
              node.className.split(/\s+/).forEach((cls) => {
                if (cls) affectedClasses.add(cls);
              });
            }

            // Collect names
            if (node.name) {
              affectedNames.add(node.name);
            }

            // Collect tag names
            affectedTags.add(node.tagName.toLowerCase());

            // Handle child elements
            try {
              const children = node.querySelectorAll
                ? node.querySelectorAll("*")
                : [];
              children.forEach((child) => {
                if (child.className) {
                  child.className.split(/\s+/).forEach((cls) => {
                    if (cls) affectedClasses.add(cls);
                  });
                }
                if (child.name) {
                  affectedNames.add(child.name);
                }
                affectedTags.add(child.tagName.toLowerCase());
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle attribute changes
        if (mutation.type === "attributes") {
          const target = mutation.target;

          if (mutation.attributeName === "class") {
            // Handle class changes
            const oldClasses = mutation.oldValue
              ? mutation.oldValue.split(/\s+/)
              : [];
            const newClasses = target.className
              ? target.className.split(/\s+/)
              : [];

            [...oldClasses, ...newClasses].forEach((cls) => {
              if (cls) affectedClasses.add(cls);
            });
          }

          if (mutation.attributeName === "name") {
            // Handle name changes
            if (mutation.oldValue) affectedNames.add(mutation.oldValue);
            if (target.name) affectedNames.add(target.name);
          }
        }
      });

      // Invalidate affected cache entries
      const keysToDelete = [];

      for (const key of this.cache.keys()) {
        const [type, value] = key.split(":", 2);

        if (
          (type === "className" && affectedClasses.has(value)) ||
          (type === "name" && affectedNames.has(value)) ||
          (type === "tagName" && affectedTags.has(value))
        ) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => this.cache.delete(key));
      this.stats.cacheSize = this.cache.size;

      if (keysToDelete.length > 0 && this.options.enableLogging) {
        this._log(
          `Invalidated ${keysToDelete.length} cache entries due to DOM changes`
        );
      }
    }

    // ===== CLEANUP AND MAINTENANCE =====

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
      const staleKeys = [];

      for (const [key, collection] of this.cache) {
        if (!this._isValidCollection(collection)) {
          staleKeys.push(key);
        }
      }

      staleKeys.forEach((key) => this.cache.delete(key));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleKeys.length > 0) {
        this._log(
          `Cleanup completed. Removed ${staleKeys.length} stale entries.`
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

    // ===== LOGGING =====

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Collections] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Collections] ${message}`);
      }
    }

    // ===== PUBLIC API =====

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
      this._log("Cache cleared manually");
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
      this._log("Collections helper destroyed");
    }

    isCached(type, value) {
      return this.cache.has(this._createCacheKey(type, value));
    }

    getCacheSnapshot() {
      return Array.from(this.cache.keys());
    }

    // ===== BATCH OPERATIONS =====

    getMultiple(requests) {
      const results = {};

      requests.forEach(({ type, value, as }) => {
        const key = as || `${type}_${value}`;
        switch (type) {
          case "className":
            results[key] = this.ClassName[value];
            break;
          case "tagName":
            results[key] = this.TagName[value];
            break;
          case "name":
            results[key] = this.Name[value];
            break;
        }
      });

      return results;
    }

    async waitForElements(type, value, minCount = 1, timeout = 5000) {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        let collection;
        switch (type) {
          case "className":
            collection = this.ClassName[value];
            break;
          case "tagName":
            collection = this.TagName[value];
            break;
          case "name":
            collection = this.Name[value];
            break;
          default:
            throw new Error(`Unknown collection type: ${type}`);
        }

        if (collection && collection.length >= minCount) {
          return collection;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      throw new Error(
        `Timeout waiting for ${type}="${value}" (min: ${minCount})`
      );
    }

    // ===== CONFIGURATION METHODS =====

    enableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = true;
      return this;
    }

    disableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = false;
      return this;
    }
  }

  // ===== AUTO-INITIALIZE =====
  // Auto-initialize with sensible defaults
  const CollectionHelper = new ProductionCollectionHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
    enableEnhancedSyntax: true,
  });

  // ===== GLOBAL COLLECTIONS API =====

  /**
   * Global Collections object - Clean and intuitive API
   * Provides access to three collection types: ClassName, TagName, Name
   */
  const Collections = {
    ClassName: CollectionHelper.ClassName,
    TagName: CollectionHelper.TagName,
    Name: CollectionHelper.Name,

    // Utility methods
    helper: CollectionHelper,
    stats: () => CollectionHelper.getStats(),
    clear: () => CollectionHelper.clearCache(),
    destroy: () => CollectionHelper.destroy(),
    isCached: (type, value) => CollectionHelper.isCached(type, value),
    getMultiple: (requests) => CollectionHelper.getMultiple(requests),
    waitFor: (type, value, minCount, timeout) =>
      CollectionHelper.waitForElements(type, value, minCount, timeout),
    enableEnhancedSyntax: () => CollectionHelper.enableEnhancedSyntax(),
    disableEnhancedSyntax: () => CollectionHelper.disableEnhancedSyntax(),
    configure: (options) => {
      Object.assign(CollectionHelper.options, options);
      return Collections;
    },
  };

  // ===== BULK UPDATE METHOD =====

  /**
   * Bulk update method for Collections helper
   * Allows updating multiple collections (class, tag, name) in a single call
   *
   * @param {Object} updates - Object where keys are collection identifiers and values are update objects
   * @returns {Object} - Object with results for each collection
   *
   * @example
   * Collections.update({
   *   'class:btn': { style: { padding: '10px', color: 'white' } },
   *   'tag:p': { style: { lineHeight: '1.6' } },
   *   'name:username': { disabled: false }
   * });
   */
  Collections.update = (updates = {}) => {
    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      console.warn(
        "[Collections] Collections.update() requires an object with collection identifiers as keys"
      );
      return {};
    }

    const results = {};
    const successful = [];
    const failed = [];

    Object.entries(updates).forEach(([identifier, updateData]) => {
      try {
        // Parse identifier format: "type:value" (e.g., "class:btn", "tag:div", "name:username")
        let type, value, collection;

        if (identifier.includes(":")) {
          [type, value] = identifier.split(":", 2);

          // Get collection based on type
          switch (type.toLowerCase()) {
            case "class":
            case "classname":
              collection = Collections.ClassName[value];
              break;
            case "tag":
            case "tagname":
              collection = Collections.TagName[value];
              break;
            case "name":
              collection = Collections.Name[value];
              break;
            default:
              results[identifier] = {
                success: false,
                error: `Unknown collection type: ${type}. Use 'class', 'tag', or 'name'`,
              };
              failed.push(identifier);
              return;
          }
        } else {
          // Assume it's a class name if no type specified
          collection = Collections.ClassName[identifier];
          value = identifier;
        }

        if (collection && collection.length > 0) {
          // Apply updates using the collection's update method
          if (typeof collection.update === "function") {
            collection.update(updateData);
            results[identifier] = {
              success: true,
              collection,
              elementsUpdated: collection.length,
            };
            successful.push(identifier);
          } else {
            // Fallback if update method doesn't exist
            const elements = Array.from(collection);
            elements.forEach((element) => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updateData).forEach(([key, val]) => {
                  applyEnhancedUpdate(element, key, val);
                });
              }
            });
            results[identifier] = {
              success: true,
              collection,
              elementsUpdated: elements.length,
            };
            successful.push(identifier);
          }
        } else if (collection) {
          results[identifier] = {
            success: true,
            collection,
            elementsUpdated: 0,
            warning: "Collection is empty - no elements to update",
          };
          successful.push(identifier);
        } else {
          results[identifier] = {
            success: false,
            error: `Collection '${identifier}' not found or invalid`,
          };
          failed.push(identifier);
        }
      } catch (error) {
        results[identifier] = {
          success: false,
          error: error.message,
        };
        failed.push(identifier);
      }
    });

    // Log summary if logging is enabled
    if (CollectionHelper.options.enableLogging) {
      const totalElements = successful.reduce((sum, id) => {
        return sum + (results[id].elementsUpdated || 0);
      }, 0);
      console.log(
        `[Collections] Bulk update completed: ${successful.length} collections (${totalElements} elements), ${failed.length} failed`
      );
      if (failed.length > 0) {
        console.warn(`[Collections] Failed identifiers:`, failed);
      }
    }

    return results;
  };

  // ===== AUTO-CLEANUP ON PAGE UNLOAD =====
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      CollectionHelper.destroy();
    });
  }

  // ===== MODULE EXPORTS =====
  return {
    Collections,
    ProductionCollectionHelper,
    version: '2.3.1',
  };
});
