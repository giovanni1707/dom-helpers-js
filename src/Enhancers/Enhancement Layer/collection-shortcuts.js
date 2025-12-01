/**
 * collection-shortcuts.js
 *
 * Enhancement Layer - Collection Shortcuts
 * Provides ClassName, TagName, Name globally with index selection
 *
 * Features:
 * - Property access (ClassName.button)
 * - Function calls (ClassName('button'))
 * - Numeric index access (ClassName.button[0], ClassName.button[-1])
 * - Element enhancement integration
 *
 * @version 2.3.1
 * @license MIT
 * @author DOM Helpers Team
 * @requires Collections helper from DOM Helpers core
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
    root.CollectionShortcuts = factory(root.ElementEnhancerCore);
  }
}(typeof self !== 'undefined' ? self : this, function(ElementEnhancerCore) {
  'use strict';

  // ========================================================================
  // DEPENDENCY CHECK
  // ========================================================================

  const global = typeof window !== 'undefined' ? window :
                 typeof global !== 'undefined' ? global :
                 typeof self !== 'undefined' ? self : {};

  if (typeof global.Collections === 'undefined') {
    console.error('[CollectionShortcuts] Collections helper not found. Please load DOM Helpers library first.');
    return null;
  }

  // ========================================================================
  // UTILITIES
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
    return typeof global.EnhancedUpdateUtility !== 'undefined' &&
           typeof global.EnhancedUpdateUtility.enhanceElementWithUpdate === 'function';
  }

  /**
   * Enhance an element with update method
   * @param {HTMLElement} element
   * @returns {HTMLElement}
   */
  function enhanceElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Try ElementEnhancerCore first
    if (hasEnhancerCore()) {
      return ElementEnhancerCore.enhanceElement(element);
    }

    // Fallback to UpdateUtility
    if (hasUpdateUtility() && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
      return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
    }

    return element;
  }

  // ========================================================================
  // ENHANCED COLLECTION WRAPPER
  // ========================================================================

  /**
   * Creates an enhanced collection wrapper with index access
   * @param {Object} collection - The original collection from Collections helper
   * @returns {Proxy} - Enhanced collection with index support
   */
  function createEnhancedCollectionWrapper(collection) {
    if (!collection) return collection;

    // If it's already a proxy or enhanced, return as is
    if (collection._isEnhancedWrapper) {
      return collection;
    }

    // Create a proxy that intercepts numeric index access
    return new Proxy(collection, {
      get(target, prop) {
        // CRITICAL: Handle symbols BEFORE isNaN check
        if (typeof prop === 'symbol') {
          return target[prop];
        }

        // Handle special properties that should pass through directly
        if (prop === 'constructor' ||
            prop === 'prototype' ||
            prop === 'length' ||
            prop === 'toString' ||
            prop === 'valueOf' ||
            prop === 'toLocaleString' ||
            prop === '_isEnhancedWrapper' ||
            prop === '_originalCollection' ||
            prop === '_originalNodeList' ||
            prop === '_hasIndexedUpdateSupport' ||
            prop === 'update' ||
            prop === 'item' ||
            prop === 'entries' ||
            prop === 'keys' ||
            prop === 'values' ||
            prop === 'forEach' ||
            prop === 'namedItem') {
          return target[prop];
        }

        // Handle numeric indices (including negative indices)
        if (!isNaN(prop)) {
          const index = parseInt(prop);
          let element;

          // Handle negative indices (e.g., -1 for last element)
          if (index < 0) {
            const positiveIndex = target.length + index;
            element = target[positiveIndex];
          } else {
            element = target[index];
          }

          // Enhance the element
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            return enhanceElement(element);
          }

          return element;
        }

        // Return the original property
        return target[prop];
      },

      set(target, prop, value) {
        // Handle symbols
        if (typeof prop === 'symbol') {
          return false;
        }

        // Allow setting numeric indices
        if (!isNaN(prop)) {
          const index = parseInt(prop);
          if (index >= 0 && index < target.length) {
            // Can't directly set elements in a live collection
            console.warn('[CollectionShortcuts] Cannot set element at index in live collection');
            return false;
          }
        }

        // Try to set other properties
        try {
          target[prop] = value;
          return true;
        } catch (e) {
          return false;
        }
      }
    });
  }

  // ========================================================================
  // PROXY CREATION HELPER
  // ========================================================================

  /**
   * Creates a global proxy that forwards to Collections[type]
   * @param {string} type - The collection type (ClassName, TagName, or Name)
   * @returns {Proxy|null} - Global proxy function with property access
   */
  function createGlobalCollectionProxy(type) {
    const collectionHelper = global.Collections[type];

    if (!collectionHelper) {
      console.warn(`[CollectionShortcuts] Collections.${type} not found`);
      return null;
    }

    // Base function for function-style calls
    const baseFunction = function(value) {
      const collection = collectionHelper(value);
      return createEnhancedCollectionWrapper(collection);
    };

    // Create proxy for both function calls and property access
    return new Proxy(baseFunction, {
      /**
       * Handle property access (e.g., ClassName.button)
       */
      get: (target, prop) => {
        // Handle function intrinsics
        if (typeof prop === 'symbol' ||
            prop === 'constructor' ||
            prop === 'prototype' ||
            prop === 'apply' ||
            prop === 'call' ||
            prop === 'bind' ||
            prop === 'length' ||
            prop === 'name') {
          return target[prop];
        }

        // Handle toString/valueOf
        if (prop === 'toString' || prop === 'valueOf') {
          return target[prop];
        }

        // Get collection from Collections helper
        const collection = collectionHelper[prop];

        // Return enhanced wrapper
        return createEnhancedCollectionWrapper(collection);
      },

      /**
       * Handle function calls (e.g., ClassName('button'))
       */
      apply: (target, thisArg, args) => {
        const collection = collectionHelper(...args);
        return createEnhancedCollectionWrapper(collection);
      },

      /**
       * Handle 'in' operator
       */
      has: (target, prop) => {
        return prop in collectionHelper;
      },

      /**
       * Handle Object.keys(), for...in, etc.
       */
      ownKeys: (target) => {
        return Reflect.ownKeys(collectionHelper);
      },

      /**
       * Handle Object.getOwnPropertyDescriptor()
       */
      getOwnPropertyDescriptor: (target, prop) => {
        return Reflect.getOwnPropertyDescriptor(collectionHelper, prop);
      }
    });
  }

  // ========================================================================
  // CREATE GLOBAL SHORTCUTS
  // ========================================================================

  /**
   * Global ClassName - Access elements by class name with index support
   * @example
   *   ClassName.button              // All buttons
   *   ClassName.button[0]           // First button
   *   ClassName.button[2]           // Third button
   *   ClassName.button[-1]          // Last button
   *   ClassName['container.item'][1] // Second item in container
   */
  const ClassName = createGlobalCollectionProxy('ClassName');

  /**
   * Global TagName - Access elements by tag name with index support
   * @example
   *   TagName.div              // All divs
   *   TagName.div[0]           // First div
   *   TagName.p[-1]            // Last paragraph
   */
  const TagName = createGlobalCollectionProxy('TagName');

  /**
   * Global Name - Access elements by name attribute with index support
   * @example
   *   Name.username              // All elements with name="username"
   *   Name.username[0]           // First username input
   */
  const Name = createGlobalCollectionProxy('Name');

  // ========================================================================
  // INITIALIZATION FUNCTION
  // ========================================================================

  /**
   * Initialize collection shortcuts with Collections helper
   * @param {Object} Collections - The Collections helper object
   * @returns {Object} - Object with ClassName, TagName, Name
   */
  function init(Collections) {
    if (!Collections) {
      console.error('[CollectionShortcuts] Collections helper is required');
      return null;
    }

    // Store reference to Collections
    global.Collections = Collections;

    // Recreate proxies
    const shortcuts = {
      ClassName: createGlobalCollectionProxy('ClassName'),
      TagName: createGlobalCollectionProxy('TagName'),
      Name: createGlobalCollectionProxy('Name')
    };

    return shortcuts;
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const CollectionShortcuts = {
    version: '2.3.1',

    // Global proxies
    ClassName: ClassName,
    TagName: TagName,
    Name: Name,

    // Initialization
    init: init,

    // Utilities
    hasEnhancerCore: hasEnhancerCore,
    hasUpdateUtility: hasUpdateUtility
  };

  return CollectionShortcuts;
}));
