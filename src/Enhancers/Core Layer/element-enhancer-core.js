/**
 * element-enhancer-core.js
 *
 * Core Element Enhancement Module
 * Provides comprehensive .update() method enhancement for elements and collections
 *
 * Features:
 * - Element .update() method enhancement
 * - Collection .update() method enhancement with index-based updates
 * - Comprehensive fallback implementation (when UpdateUtility not available)
 * - Automatic detection and usage of UpdateUtility (from core modules)
 * - Support for all update types: style, classList, attributes, dataset, addEventListener, properties
 *
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  'use strict';

  // UMD pattern
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.ElementEnhancerCore = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // ===== UTILITY DETECTION =====

  /**
   * Detect if EnhancedUpdateUtility is available globally
   * @returns {boolean}
   */
  function hasUpdateUtility() {
    const global = typeof window !== 'undefined' ? window :
                   typeof global !== 'undefined' ? global :
                   typeof self !== 'undefined' ? self : {};
    return typeof global.EnhancedUpdateUtility !== 'undefined' &&
           typeof global.EnhancedUpdateUtility.enhanceElementWithUpdate === 'function';
  }

  /**
   * Get reference to global UpdateUtility if available
   * @returns {Object|null}
   */
  function getUpdateUtility() {
    if (!hasUpdateUtility()) return null;
    const global = typeof window !== 'undefined' ? window :
                   typeof global !== 'undefined' ? global :
                   typeof self !== 'undefined' ? self : {};
    return global.EnhancedUpdateUtility;
  }

  /**
   * Check if element already has update method
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function hasUpdateMethod(element) {
    if (!element) return false;
    return element._hasUpdateMethod === true ||
           element._hasEnhancedUpdateMethod === true ||
           element._hasGlobalQueryUpdate === true ||
           element._domHelpersEnhanced === true;
  }

  // ===== COMPREHENSIVE FALLBACK UPDATE IMPLEMENTATION =====

  /**
   * Apply comprehensive update to a single element (fallback implementation)
   * Handles: style, classList, attributes, dataset, addEventListener, event properties, methods, properties
   * @param {HTMLElement} element - Target element
   * @param {Object} updates - Updates to apply
   * @returns {HTMLElement} - The updated element
   */
  function applyUpdate(element, updates) {
    if (!element || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[ElementEnhancerCore] applyUpdate requires a valid element and updates object');
      return element;
    }

    Object.entries(updates).forEach(([key, value]) => {
      try {
        // Handle style object
        if (key === 'style' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([prop, val]) => {
            if (val !== null && val !== undefined) {
              element.style[prop] = val;
            }
          });
          return;
        }

        // Handle classList operations
        if (key === 'classList' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([method, classes]) => {
            const classList = Array.isArray(classes) ? classes : [classes];
            switch (method) {
              case 'add':
                element.classList.add(...classList);
                break;
              case 'remove':
                element.classList.remove(...classList);
                break;
              case 'toggle':
                classList.forEach(cls => element.classList.toggle(cls));
                break;
              case 'replace':
                if (classList.length === 2) {
                  element.classList.replace(classList[0], classList[1]);
                }
                break;
              default:
                console.warn(`[ElementEnhancerCore] Unknown classList method: ${method}`);
            }
          });
          return;
        }

        // Handle attributes (attrs or attributes)
        if ((key === 'attrs' || key === 'attributes') && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([attrName, attrValue]) => {
            if (attrValue === null || attrValue === false) {
              element.removeAttribute(attrName);
            } else {
              element.setAttribute(attrName, String(attrValue));
            }
          });
          return;
        }

        // Handle setAttribute (supports array or object format)
        if (key === 'setAttribute') {
          if (Array.isArray(value) && value.length >= 2) {
            element.setAttribute(value[0], value[1]);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([attr, val]) => {
              element.setAttribute(attr, String(val));
            });
          }
          return;
        }

        // Handle removeAttribute
        if (key === 'removeAttribute') {
          const attrs = Array.isArray(value) ? value : [value];
          attrs.forEach(attr => element.removeAttribute(attr));
          return;
        }

        // Handle dataset
        if (key === 'dataset' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([dataKey, dataVal]) => {
            element.dataset[dataKey] = dataVal;
          });
          return;
        }

        // Handle addEventListener (supports array or object format)
        if (key === 'addEventListener') {
          if (Array.isArray(value) && value.length >= 2) {
            element.addEventListener(value[0], value[1], value[2]);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([event, handler]) => {
              if (typeof handler === 'function') {
                element.addEventListener(event, handler);
              } else if (Array.isArray(handler)) {
                element.addEventListener(event, handler[0], handler[1]);
              }
            });
          }
          return;
        }

        // Handle event properties (onclick, onchange, etc.)
        if (key.startsWith('on') && typeof value === 'function') {
          element[key] = value;
          return;
        }

        // Handle methods (call the method with value as argument(s))
        if (typeof element[key] === 'function') {
          if (Array.isArray(value)) {
            element[key](...value);
          } else {
            element[key](value);
          }
          return;
        }

        // Handle direct property assignment
        if (key in element) {
          element[key] = value;
          return;
        }

        // Fallback: setAttribute for string/number/boolean values
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          element.setAttribute(key, String(value));
        } else {
          console.warn(`[ElementEnhancerCore] Cannot apply property '${key}' to element`);
        }

      } catch (error) {
        console.warn(`[ElementEnhancerCore] Error updating property '${key}': ${error.message}`);
      }
    });

    return element;
  }

  // ===== ELEMENT ENHANCEMENT =====

  /**
   * Enhance a single element with .update() method
   * Uses UpdateUtility if available, otherwise adds comprehensive fallback
   * @param {HTMLElement} element - Element to enhance
   * @returns {HTMLElement} - Enhanced element
   */
  function enhanceElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return element;
    }

    // Don't re-enhance if already enhanced
    if (hasUpdateMethod(element)) {
      return element;
    }

    // Try to use UpdateUtility if available
    const utility = getUpdateUtility();
    if (utility && utility.enhanceElementWithUpdate) {
      const enhanced = utility.enhanceElementWithUpdate(element);

      // Mark as enhanced by this module
      try {
        Object.defineProperty(enhanced, '_hasEnhancedUpdateMethod', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (e) {
        enhanced._hasEnhancedUpdateMethod = true;
      }

      return enhanced;
    }

    // Fallback: add comprehensive update method
    addUpdateMethod(element);
    return element;
  }

  /**
   * Add comprehensive update method to element (fallback implementation)
   * @param {HTMLElement} element
   * @returns {HTMLElement}
   */
  function addUpdateMethod(element) {
    if (!element || hasUpdateMethod(element)) {
      return element;
    }

    const updateMethod = function(updates) {
      return applyUpdate(this, updates);
    };

    try {
      Object.defineProperty(element, 'update', {
        value: updateMethod,
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(element, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback if defineProperty fails
      element.update = updateMethod;
      element._hasEnhancedUpdateMethod = true;
    }

    return element;
  }

  // ===== COLLECTION ENHANCEMENT =====

  /**
   * Enhance multiple elements (array or array-like)
   * @param {Array|NodeList|HTMLCollection} elements - Elements to enhance
   * @returns {Array} - Array of enhanced elements
   */
  function enhanceElements(elements) {
    if (!elements) return [];

    const array = Array.isArray(elements) ? elements : Array.from(elements);
    return array.map(el => enhanceElement(el));
  }

  /**
   * Check if collection already has enhanced update method
   * @param {Object} collection
   * @returns {boolean}
   */
  function hasCollectionUpdate(collection) {
    if (!collection) return false;
    return collection._hasCollectionUpdate === true ||
           collection._hasEnhancedUpdateMethod === true ||
           collection._hasGlobalQueryUpdate === true ||
           collection._indexSelectionEnhanced === true;
  }

  /**
   * Create index-aware update method for collections
   * Supports both index-based updates (e.g., { 0: {...}, 2: {...} })
   * and bulk updates (e.g., { style: {...}, textContent: 'value' })
   * @param {Object} collection - Collection object
   * @returns {Function} - Update function
   */
  function createCollectionUpdateMethod(collection) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[ElementEnhancerCore] Collection .update() requires an object');
        return collection;
      }

      // Get elements array
      let elements = [];
      if (collection._originalCollection) {
        elements = Array.from(collection._originalCollection);
      } else if (collection._originalNodeList) {
        elements = Array.from(collection._originalNodeList);
      } else if (collection.length !== undefined) {
        elements = Array.from(collection);
      }

      if (elements.length === 0) {
        return collection;
      }

      const length = elements.length;
      const indexUpdates = {};
      const bulkUpdates = {};
      let hasIndexUpdates = false;
      let hasBulkUpdates = false;

      // Separate index-based updates from bulk updates
      Object.entries(updates).forEach(([key, value]) => {
        // Check if key is numeric (including negative indices)
        if (/^-?\d+$/.test(key)) {
          indexUpdates[key] = value;
          hasIndexUpdates = true;
        } else {
          bulkUpdates[key] = value;
          hasBulkUpdates = true;
        }
      });

      // Apply bulk updates to all elements
      if (hasBulkUpdates) {
        elements.forEach(element => {
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const enhanced = enhanceElement(element);
            if (enhanced.update) {
              enhanced.update(bulkUpdates);
            } else {
              applyUpdate(element, bulkUpdates);
            }
          }
        });
      }

      // Apply index-specific updates
      if (hasIndexUpdates) {
        Object.entries(indexUpdates).forEach(([indexStr, updateData]) => {
          let index = parseInt(indexStr, 10);

          // Handle negative indices
          if (index < 0) {
            index = length + index;
          }

          if (index >= 0 && index < length) {
            const element = elements[index];
            if (element && element.nodeType === Node.ELEMENT_NODE) {
              const enhanced = enhanceElement(element);
              if (enhanced.update) {
                enhanced.update(updateData);
              } else {
                applyUpdate(element, updateData);
              }
            }
          } else {
            console.warn(`[ElementEnhancerCore] Index ${indexStr} out of bounds (length: ${length})`);
          }
        });
      }

      return collection;
    };
  }

  /**
   * Enhance a collection with .update() method
   * Uses UpdateUtility if available, otherwise adds comprehensive fallback
   * @param {Object} collection - Collection to enhance
   * @returns {Object} - Enhanced collection
   */
  function enhanceCollection(collection) {
    if (!collection) return collection;

    // Don't re-enhance if already enhanced
    if (hasCollectionUpdate(collection)) {
      return collection;
    }

    // Try to use UpdateUtility if available
    const utility = getUpdateUtility();
    if (utility && utility.enhanceCollectionWithUpdate) {
      const enhanced = utility.enhanceCollectionWithUpdate(collection);

      // Mark as enhanced
      try {
        Object.defineProperty(enhanced, '_hasCollectionUpdate', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (e) {
        enhanced._hasCollectionUpdate = true;
      }

      return enhanced;
    }

    // Fallback: add index-aware update method
    const updateMethod = createCollectionUpdateMethod(collection);

    try {
      Object.defineProperty(collection, 'update', {
        value: updateMethod,
        writable: true,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasCollectionUpdate', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      collection.update = updateMethod;
      collection._hasCollectionUpdate = true;
    }

    return collection;
  }

  // ===== PUBLIC API =====

  const ElementEnhancerCore = {
    /**
     * Version
     */
    version: '1.0.0',

    /**
     * Enhance a single element with .update() method
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    enhanceElement: enhanceElement,

    /**
     * Enhance multiple elements with .update() methods
     * @param {Array|NodeList|HTMLCollection} elements
     * @returns {Array}
     */
    enhanceElements: enhanceElements,

    /**
     * Enhance a collection with index-aware .update() method
     * @param {Object} collection
     * @returns {Object}
     */
    enhanceCollection: enhanceCollection,

    /**
     * Apply update to an element without enhancing it
     * @param {HTMLElement} element
     * @param {Object} updates
     * @returns {HTMLElement}
     */
    applyUpdate: applyUpdate,

    /**
     * Check if object has update method
     * @param {Object} obj
     * @returns {boolean}
     */
    hasUpdateMethod: function(obj) {
      if (!obj) return false;
      return hasUpdateMethod(obj) || hasCollectionUpdate(obj);
    },

    /**
     * Check if UpdateUtility is available
     * @returns {boolean}
     */
    hasUpdateUtility: hasUpdateUtility,

    /**
     * Get UpdateUtility reference if available
     * @returns {Object|null}
     */
    getUpdateUtility: getUpdateUtility
  };

  return ElementEnhancerCore;
}));
