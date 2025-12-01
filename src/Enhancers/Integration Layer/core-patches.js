/**
 * core-patches.js
 *
 * Integration Layer - Core Helper Patches
 * Patches Collections and Selector helpers with indexed update support
 *
 * Features:
 * - Patches Collections.update() with indexed update support
 * - Patches Selector.update() with indexed update support
 * - Patches Selector.queryAll() to return enhanced collections
 * - Patches global querySelectorAll with indexed updates
 *
 * Merged from: 04_dh-indexed-collection-updates.js + 05_dh-index-selection.js + 08_dh-selector-update-patch.js
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
    define(['./indexed-update-core', './element-enhancer-core'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS/Node
    module.exports = factory(
      typeof require === 'function' ? require('./indexed-update-core') : null,
      typeof require === 'function' ? require('./element-enhancer-core') : null
    );
  } else {
    // Browser globals
    root.CorePatches = factory(
      root.IndexedUpdateCore,
      root.ElementEnhancerCore
    );
  }
}(typeof self !== 'undefined' ? self : this, function(IndexedUpdateCore, ElementEnhancerCore) {
  'use strict';

  // ========================================================================
  // DEPENDENCIES AND UTILITIES
  // ========================================================================

  const global = typeof window !== 'undefined' ? window :
                 typeof global !== 'undefined' ? global :
                 typeof self !== 'undefined' ? self : {};

  /**
   * Check if IndexedUpdateCore is available
   * @returns {boolean}
   */
  function hasIndexedUpdateCore() {
    return IndexedUpdateCore !== null && typeof IndexedUpdateCore === 'object';
  }

  /**
   * Check if ElementEnhancerCore is available
   * @returns {boolean}
   */
  function hasEnhancerCore() {
    return ElementEnhancerCore !== null && typeof ElementEnhancerCore === 'object';
  }

  // ========================================================================
  // ELEMENT UPDATE APPLICATION
  // ========================================================================

  /**
   * Apply updates to a single element
   * @param {HTMLElement} element - Element to update
   * @param {Object} updates - Updates to apply
   */
  function applyUpdatesToElement(element, updates) {
    if (!element || !updates) return;

    // Try element's own update method
    if (typeof element.update === 'function') {
      element.update(updates);
      return;
    }

    // Try ElementEnhancerCore
    if (hasEnhancerCore()) {
      ElementEnhancerCore.applyUpdate(element, updates);
      return;
    }

    // Try UpdateUtility
    if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.applyEnhancedUpdate) {
      Object.entries(updates).forEach(([key, value]) => {
        global.EnhancedUpdateUtility.applyEnhancedUpdate(element, key, value);
      });
      return;
    }

    // Basic fallback
    applyBasicUpdate(element, updates);
  }

  /**
   * Basic update implementation (fallback)
   * @param {HTMLElement} element - Element to update
   * @param {Object} updates - Updates to apply
   */
  function applyBasicUpdate(element, updates) {
    Object.entries(updates).forEach(([key, value]) => {
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
            }
          });
          return;
        }

        // Handle dataset
        if (key === 'dataset' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
          return;
        }

        // Handle attributes
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

        // Handle setAttribute
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

        // Handle addEventListener
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

        // Handle direct properties
        if (key in element) {
          element[key] = value;
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          element.setAttribute(key, String(value));
        }
      } catch (error) {
        console.warn(`[CorePatches] Failed to apply ${key}:`, error.message);
      }
    });
  }

  // ========================================================================
  // COLLECTION UPDATE WITH INDICES
  // ========================================================================

  /**
   * Update a collection with both indexed and bulk updates
   * @param {Object} collection - Collection to update
   * @param {Object} updates - Updates object
   * @returns {Object} - The collection (for chaining)
   */
  function updateCollectionWithIndices(collection, updates) {
    if (!collection) {
      console.warn('[CorePatches] .update() called on null collection');
      return collection;
    }

    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[CorePatches] .update() requires an updates object');
      return collection;
    }

    // Try to use IndexedUpdateCore
    if (hasIndexedUpdateCore()) {
      IndexedUpdateCore.updateCollectionWithIndices(collection, updates, applyUpdatesToElement);
      return collection;
    }

    // Fallback implementation
    const elements = [];

    // Extract elements from collection
    if (collection.length !== undefined) {
      try {
        elements.push(...Array.from(collection));
      } catch (e) {
        for (let i = 0; i < collection.length; i++) {
          elements.push(collection[i]);
        }
      }
    } else if (collection._originalCollection) {
      elements.push(...Array.from(collection._originalCollection));
    } else if (collection._originalNodeList) {
      elements.push(...Array.from(collection._originalNodeList));
    } else {
      console.warn('[CorePatches] .update() called on unrecognized collection type');
      return collection;
    }

    if (elements.length === 0) {
      return collection;
    }

    // Separate indexed from bulk updates
    const indexUpdates = {};
    const bulkUpdates = {};
    let hasIndexUpdates = false;
    let hasBulkUpdates = false;

    Object.keys(updates).forEach(key => {
      if (typeof key === 'symbol') return;

      const asNumber = Number(key);
      if (Number.isFinite(asNumber) && Number.isInteger(asNumber) && String(asNumber) === key) {
        indexUpdates[key] = updates[key];
        hasIndexUpdates = true;
      } else {
        bulkUpdates[key] = updates[key];
        hasBulkUpdates = true;
      }
    });

    // Apply bulk updates first
    if (hasBulkUpdates) {
      elements.forEach(element => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          applyUpdatesToElement(element, bulkUpdates);
        }
      });
    }

    // Apply indexed updates
    if (hasIndexUpdates) {
      Object.entries(indexUpdates).forEach(([key, elementUpdates]) => {
        let index = Number(key);

        // Handle negative indices
        if (index < 0) {
          index = elements.length + index;
        }

        const element = elements[index];
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          if (elementUpdates && typeof elementUpdates === 'object') {
            applyUpdatesToElement(element, elementUpdates);
          }
        }
      });
    }

    return collection;
  }

  // ========================================================================
  // ENHANCED COLLECTION CREATION
  // ========================================================================

  /**
   * Create enhanced collection proxy with index access
   * @param {Object} collection - Original collection
   * @returns {Proxy} - Enhanced collection
   */
  function createEnhancedCollectionProxy(collection) {
    if (!collection) return collection;

    // Check if already enhanced
    if (collection._indexSelectionEnhanced) {
      return collection;
    }

    return new Proxy(collection, {
      get(target, prop) {
        // Handle numeric index access
        if (!isNaN(prop) && parseInt(prop) >= 0) {
          const index = parseInt(prop);
          let element;

          // Get element from appropriate source
          if (target._originalCollection) {
            element = target._originalCollection[index];
          } else if (target._originalNodeList) {
            element = target._originalNodeList[index];
          } else if (target[index]) {
            element = target[index];
          }

          // Enhance element before returning
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (hasEnhancerCore()) {
              return ElementEnhancerCore.enhanceElement(element);
            } else if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
              return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
            }
          }

          return element;
        }

        return target[prop];
      }
    });
  }

  // ========================================================================
  // PATCHING FUNCTIONS
  // ========================================================================

  /**
   * Patch Collections helper with indexed update support
   * @param {Object} Collections - Collections helper object
   * @returns {Object} - Patched Collections helper
   */
  function patchCollectionsHelper(Collections) {
    if (!Collections) {
      console.warn('[CorePatches] Collections helper not found');
      return null;
    }

    // Store original update method if it exists
    const originalUpdate = Collections.update;

    // Override update method with indexed support
    Collections.update = function(updates) {
      // Get the collection
      const collection = this;

      // Apply indexed update
      return updateCollectionWithIndices(collection, updates);
    };

    // Mark as patched
    Collections._hasIndexedUpdatePatch = true;

    return Collections;
  }

  /**
   * Patch Selector helper with indexed update support
   * @param {Object} Selector - Selector helper object
   * @returns {Object} - Patched Selector helper
   */
  function patchSelectorHelper(Selector) {
    if (!Selector) {
      console.warn('[CorePatches] Selector helper not found');
      return null;
    }

    // Store original update method if it exists
    const originalUpdate = Selector.update;

    // Override update method with indexed support
    if (typeof Selector.update === 'function') {
      Selector.update = function(updates) {
        const collection = this;
        return updateCollectionWithIndices(collection, updates);
      };
    }

    // Patch queryAll to return enhanced collections
    if (typeof Selector.queryAll === 'function') {
      const originalQueryAll = Selector.queryAll;

      Selector.queryAll = function(...args) {
        const result = originalQueryAll.apply(this, args);

        // Add update method to result if it doesn't have one
        if (result && !result.update) {
          try {
            Object.defineProperty(result, 'update', {
              value: function(updates) {
                return updateCollectionWithIndices(this, updates);
              },
              writable: false,
              enumerable: false,
              configurable: true
            });
          } catch (e) {
            result.update = function(updates) {
              return updateCollectionWithIndices(this, updates);
            };
          }
        }

        return result;
      };
    }

    // Mark as patched
    Selector._hasIndexedUpdatePatch = true;

    return Selector;
  }

  /**
   * Patch global query functions with indexed update support
   * @param {Function} querySelector - Global querySelector function
   * @param {Function} querySelectorAll - Global querySelectorAll function
   */
  function patchGlobalQuery(querySelector, querySelectorAll) {
    if (!querySelectorAll) {
      console.warn('[CorePatches] querySelectorAll not found');
      return;
    }

    // Store original
    const originalQSA = querySelectorAll;

    // Override with enhanced version
    const enhancedQSA = function(selector, context = document) {
      const result = originalQSA.call(context, selector);

      // Add update method if not present
      if (result && !result.update && !result._hasGlobalQueryUpdate) {
        try {
          Object.defineProperty(result, 'update', {
            value: function(updates) {
              return updateCollectionWithIndices(this, updates);
            },
            writable: false,
            enumerable: false,
            configurable: true
          });
        } catch (e) {
          result.update = function(updates) {
            return updateCollectionWithIndices(this, updates);
          };
        }
      }

      return result;
    };

    // Replace global
    if (typeof window !== 'undefined') {
      window.querySelectorAll = enhancedQSA;
    } else if (typeof global !== 'undefined') {
      global.querySelectorAll = enhancedQSA;
    }
  }

  /**
   * Patch all helpers at once
   * @param {Object} Collections - Collections helper
   * @param {Object} Selector - Selector helper
   */
  function patchAll(Collections, Selector) {
    if (Collections) {
      patchCollectionsHelper(Collections);
    }

    if (Selector) {
      patchSelectorHelper(Selector);
    }

    // Patch global query if available
    const qs = typeof window !== 'undefined' ? window.querySelector :
               typeof global !== 'undefined' ? global.querySelector : null;
    const qsa = typeof window !== 'undefined' ? window.querySelectorAll :
                typeof global !== 'undefined' ? global.querySelectorAll : null;

    if (qsa) {
      patchGlobalQuery(qs, qsa);
    }
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const CorePatches = {
    version: '2.3.1',

    // Patching functions
    patchCollectionsHelper: patchCollectionsHelper,
    patchSelectorHelper: patchSelectorHelper,
    patchGlobalQuery: patchGlobalQuery,
    patchAll: patchAll,

    // Utilities
    updateCollectionWithIndices: updateCollectionWithIndices,
    createEnhancedCollectionProxy: createEnhancedCollectionProxy,
    applyUpdatesToElement: applyUpdatesToElement,

    // Dependency checks
    hasIndexedUpdateCore: hasIndexedUpdateCore,
    hasEnhancerCore: hasEnhancerCore
  };

  return CorePatches;
}));
