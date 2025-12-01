/**
 * collection-shortcuts-enhanced.js
 *
 * Integration Layer - Collection Shortcuts Enhancement
 * Adds .update() method and indexed updates to global collection shortcuts
 *
 * Features:
 * - Indexed updates (ClassName.btn.update({ 0: {...}, 1: {...} }))
 * - Bulk updates (ClassName.btn.update({ style: {...} }))
 * - Shortcut-level bulk updates (ClassName.update({ btn: {...}, card: {...} }))
 * - Integration with IndexedUpdateCore
 *
 * Merged from: 06_dh-global-collection-indexed-updates.js + 10_dh-collections-global-shortcut-bulk-update.js
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
    root.CollectionShortcutsEnhanced = factory(
      root.IndexedUpdateCore,
      root.ElementEnhancerCore
    );
  }
}(typeof self !== 'undefined' ? self : this, function(IndexedUpdateCore, ElementEnhancerCore) {
  'use strict';

  // ========================================================================
  // DEPENDENCIES AND UTILITIES
  // ========================================================================

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

        // Handle direct properties
        if (key in element) {
          element[key] = value;
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          element.setAttribute(key, String(value));
        }
      } catch (error) {
        console.warn(`[CollectionShortcutsEnhanced] Failed to apply ${key}:`, error.message);
      }
    });
  }

  // ========================================================================
  // COLLECTION UPDATE WITH INDICES
  // ========================================================================

  /**
   * Update a collection with both indexed and bulk updates
   * Uses IndexedUpdateCore if available, otherwise fallback implementation
   * @param {Object} collection - Collection to update
   * @param {Object} updates - Updates object
   * @returns {Object} - The collection (for chaining)
   */
  function updateCollectionWithIndices(collection, updates) {
    if (!collection) {
      console.warn('[CollectionShortcutsEnhanced] .update() called on null collection');
      return collection;
    }

    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      console.warn('[CollectionShortcutsEnhanced] .update() requires an updates object');
      return collection;
    }

    // Try to use IndexedUpdateCore
    if (hasIndexedUpdateCore()) {
      IndexedUpdateCore.updateCollectionWithIndices(collection, updates, applyUpdatesToElement);
      return collection;
    }

    // Fallback implementation
    const elements = Array.from(collection.length !== undefined ? collection : []);

    if (elements.length === 0) {
      return collection;
    }

    const indexUpdates = {};
    const bulkUpdates = {};
    let hasIndexUpdates = false;
    let hasBulkUpdates = false;

    // Separate indexed from bulk
    Object.entries(updates).forEach(([key, value]) => {
      if (/^-?\d+$/.test(key)) {
        indexUpdates[key] = value;
        hasIndexUpdates = true;
      } else {
        bulkUpdates[key] = value;
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
      Object.entries(indexUpdates).forEach(([indexStr, elementUpdates]) => {
        let index = parseInt(indexStr, 10);

        // Handle negative indices
        if (index < 0) {
          index = elements.length + index;
        }

        if (index >= 0 && index < elements.length) {
          const element = elements[index];
          if (element && element.nodeType === Node.ELEMENT_NODE) {
            applyUpdatesToElement(element, elementUpdates);
          }
        }
      });
    }

    return collection;
  }

  // ========================================================================
  // BULK UPDATE FOR SHORTCUTS
  // ========================================================================

  /**
   * Create bulk update method for a collection shortcut
   * Allows updating multiple collections at once
   * @param {string} shortcutName - Name of the shortcut (for logging)
   * @param {Proxy} shortcutProxy - The shortcut proxy function
   * @returns {Function} - Bulk update function
   */
  function createBulkUpdateMethod(shortcutName, shortcutProxy) {
    return function bulkUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[${shortcutName}] update() requires an object with keys as identifiers`);
        return {};
      }

      const results = {};
      const successful = [];
      const failed = [];
      let totalElementsUpdated = 0;

      // Process each collection update
      Object.entries(updates).forEach(([identifier, updateData]) => {
        try {
          // Get collection using the shortcut proxy
          const collection = shortcutProxy[identifier];

          if (!collection) {
            results[identifier] = {
              success: false,
              error: `Collection not found for "${identifier}"`
            };
            failed.push(identifier);
            return;
          }

          // Check if collection has elements
          if (collection.length === 0) {
            results[identifier] = {
              success: true,
              elementsUpdated: 0,
              warning: `No elements found for "${identifier}"`
            };
            successful.push(identifier);
            return;
          }

          // Apply updates using collection's update method
          if (typeof collection.update === 'function') {
            collection.update(updateData);
          } else {
            // Fallback: manual update
            const elements = Array.from(collection);
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                applyUpdatesToElement(element, updateData);
              }
            });
          }

          results[identifier] = {
            success: true,
            elementsUpdated: collection.length,
            collection: collection
          };
          totalElementsUpdated += collection.length;
          successful.push(identifier);

        } catch (error) {
          results[identifier] = {
            success: false,
            error: error.message
          };
          failed.push(identifier);
        }
      });

      return results;
    };
  }

  // ========================================================================
  // ENHANCEMENT FUNCTIONS
  // ========================================================================

  /**
   * Add .update() method to a collection
   * @param {Object} collection - Collection to enhance
   * @returns {Object} - Enhanced collection
   */
  function addCollectionUpdateMethod(collection) {
    if (!collection || collection._hasIndexedUpdateSupport) {
      return collection;
    }

    try {
      Object.defineProperty(collection, 'update', {
        value: function(updates = {}) {
          return updateCollectionWithIndices(this, updates);
        },
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(collection, '_hasIndexedUpdateSupport', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {
      // Fallback if defineProperty fails
      collection.update = function(updates = {}) {
        return updateCollectionWithIndices(this, updates);
      };
      collection._hasIndexedUpdateSupport = true;
    }

    return collection;
  }

  /**
   * Add bulk update method to a collection shortcut proxy
   * @param {Proxy} shortcutProxy - The shortcut proxy to enhance
   * @param {string} shortcutName - Name of the shortcut
   * @returns {Proxy} - Wrapped proxy with update method
   */
  function addBulkUpdateMethod(shortcutProxy, shortcutName) {
    const updateMethod = createBulkUpdateMethod(shortcutName, shortcutProxy);

    return new Proxy(shortcutProxy, {
      get(target, prop) {
        if (prop === 'update') {
          return updateMethod;
        }

        // Get the collection
        const result = Reflect.get(target, prop);

        // If it's a collection, ensure it has update method
        if (result && typeof result === 'object' && result.length !== undefined) {
          return addCollectionUpdateMethod(result);
        }

        return result;
      },

      apply(target, thisArg, args) {
        const result = Reflect.apply(target, thisArg, args);

        // If it's a collection, ensure it has update method
        if (result && typeof result === 'object' && result.length !== undefined) {
          return addCollectionUpdateMethod(result);
        }

        return result;
      },

      has(target, prop) {
        if (prop === 'update') return true;
        return Reflect.has(target, prop);
      },

      ownKeys(target) {
        const keys = Reflect.ownKeys(target);
        if (!keys.includes('update')) {
          keys.push('update');
        }
        return keys;
      },

      getOwnPropertyDescriptor(target, prop) {
        if (prop === 'update') {
          return {
            configurable: true,
            enumerable: false,
            value: updateMethod,
            writable: false
          };
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      }
    });
  }

  /**
   * Enhance collection shortcuts with update methods
   * @param {Proxy} ClassName - ClassName shortcut
   * @param {Proxy} TagName - TagName shortcut
   * @param {Proxy} Name - Name shortcut
   * @returns {Object} - Enhanced shortcuts
   */
  function enhanceCollectionShortcuts(ClassName, TagName, Name) {
    const enhanced = {};

    if (ClassName) {
      enhanced.ClassName = addBulkUpdateMethod(ClassName, 'ClassName');
    }

    if (TagName) {
      enhanced.TagName = addBulkUpdateMethod(TagName, 'TagName');
    }

    if (Name) {
      enhanced.Name = addBulkUpdateMethod(Name, 'Name');
    }

    return enhanced;
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const CollectionShortcutsEnhanced = {
    version: '2.3.1',

    // Main enhancement function
    enhanceCollectionShortcuts: enhanceCollectionShortcuts,

    // Individual enhancement functions
    addCollectionUpdateMethod: addCollectionUpdateMethod,
    addBulkUpdateMethod: addBulkUpdateMethod,

    // Update functions
    updateCollectionWithIndices: updateCollectionWithIndices,
    createBulkUpdateMethod: createBulkUpdateMethod,

    // Utilities
    hasIndexedUpdateCore: hasIndexedUpdateCore,
    hasEnhancerCore: hasEnhancerCore
  };

  return CollectionShortcutsEnhanced;
}));
