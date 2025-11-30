/**
 * 10_dh-collections-global-shortcut-bulk-update.js
 * 
 * DOM Helpers - Global Shortcuts Bulk Update Extension
 * Adds bulk update methods to ClassName, TagName, and Name global shortcuts
 * 
 * IMPORTANT: Load this AFTER:
 *   1. dh-core.js (Collections helper)
 *   2. 02_dh-collection-shortcuts.js (Global shortcuts)
 * 
 * Enables syntax like:
 *   ClassName.update({ btn: {...}, card: {...} })
 *   TagName.update({ div: {...}, p: {...} })
 *   Name.update({ username: {...}, email: {...} })
 * 
 * @version 1.1.0 - FIXED: Works with Proxy functions
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== DEPENDENCY CHECKS =====
  
  const hasClassName = typeof global.ClassName !== 'undefined';
  const hasTagName = typeof global.TagName !== 'undefined';
  const hasName = typeof global.Name !== 'undefined';

  if (!hasClassName && !hasTagName && !hasName) {
    console.error('[Global Shortcuts Bulk Update] No global shortcuts found. Please load 02_dh-collection-shortcuts.js first.');
    return;
  }

  // ===== BULK UPDATE FUNCTION FACTORY =====

  /**
   * Creates a bulk update function for a global shortcut
   * @param {string} shortcutName - Name of the shortcut (for logging)
   * @param {Proxy} shortcutProxy - The global shortcut proxy
   * @returns {Function} - Bulk update function
   */
  function createBulkUpdateMethod(shortcutName, shortcutProxy) {
    return function bulkUpdate(updates = {}) {
      // Validate input
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[${shortcutName}] update() requires an object with keys as identifiers`);
        return {};
      }

      const results = {};
      const successful = [];
      const failed = [];
      let totalElementsUpdated = 0;

      // Process each update
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
            results[identifier] = {
              success: true,
              elementsUpdated: collection.length,
              collection: collection
            };
            totalElementsUpdated += collection.length;
            successful.push(identifier);
          } else {
            // Fallback: manual update if collection doesn't have update method
            const elements = Array.from(collection);
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                if (typeof element.update === 'function') {
                  element.update(updateData);
                } else {
                  // Basic fallback
                  applyBasicUpdate(element, updateData);
                }
              }
            });
            results[identifier] = {
              success: true,
              elementsUpdated: elements.length,
              collection: collection
            };
            totalElementsUpdated += elements.length;
            successful.push(identifier);
          }
        } catch (error) {
          results[identifier] = {
            success: false,
            error: error.message
          };
          failed.push(identifier);
        }
      });

      // Log summary if there were any operations
      if (successful.length > 0 || failed.length > 0) {
        console.log(
          `[${shortcutName}] Bulk update completed: ${successful.length} successful (${totalElementsUpdated} elements), ${failed.length} failed`
        );
        if (failed.length > 0) {
          console.warn(`[${shortcutName}] Failed identifiers:`, failed);
        }
      }

      return results;
    };
  }

  // ===== BASIC UPDATE FALLBACK =====

  /**
   * Basic update implementation for elements without .update() method
   * @param {HTMLElement} element - DOM element to update
   * @param {Object} updates - Update data
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
            try {
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
            } catch (error) {
              console.warn(`[Bulk Update] Error in classList.${method}:`, error.message);
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
              element.setAttribute(attr, val);
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
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
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
              } else if (Array.isArray(handler) && handler.length >= 1) {
                element.addEventListener(event, handler[0], handler[1]);
              }
            });
          }
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
          element.setAttribute(key, String(value));
        }
      } catch (error) {
        console.warn(`[Bulk Update] Failed to apply ${key}:`, error.message);
      }
    });
  }

  // ===== WRAP PROXY FUNCTIONS WITH UPDATE METHOD =====

  /**
   * Wraps a proxy function to add an update method
   * @param {Proxy} originalProxy - The original proxy function
   * @param {string} name - Name for logging
   * @returns {Proxy} - New proxy with update method
   */
  function wrapProxyWithUpdate(originalProxy, name) {
    // Create the update method
    const updateMethod = createBulkUpdateMethod(name, originalProxy);

    // Create a new proxy that wraps the original
    const wrappedProxy = new Proxy(originalProxy, {
      get(target, prop) {
        // Intercept 'update' property
        if (prop === 'update') {
          return updateMethod;
        }
        
        // Forward all other property access to original proxy
        return target[prop];
      },

      apply(target, thisArg, args) {
        // Forward function calls to original proxy
        return Reflect.apply(target, thisArg, args);
      },

      has(target, prop) {
        // Include 'update' in property checks
        if (prop === 'update') return true;
        return Reflect.has(target, prop);
      },

      ownKeys(target) {
        // Include 'update' in key enumeration
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

    return wrappedProxy;
  }

  // ===== REPLACE GLOBAL SHORTCUTS WITH WRAPPED VERSIONS =====

  /**
   * Replace ClassName with wrapped version
   */
  if (hasClassName) {
    global.ClassName = wrapProxyWithUpdate(global.ClassName, 'ClassName');
    console.log('[Global Shortcuts Bulk Update] ✓ Enhanced ClassName with .update()');
  }

  /**
   * Replace TagName with wrapped version
   */
  if (hasTagName) {
    global.TagName = wrapProxyWithUpdate(global.TagName, 'TagName');
    console.log('[Global Shortcuts Bulk Update] ✓ Enhanced TagName with .update()');
  }

  /**
   * Replace Name with wrapped version
   */
  if (hasName) {
    global.Name = wrapProxyWithUpdate(global.Name, 'Name');
    console.log('[Global Shortcuts Bulk Update] ✓ Enhanced Name with .update()');
  }

  // ===== UPDATE DOMHELPERS REFERENCES =====

  if (typeof global.DOMHelpers !== 'undefined') {
    if (hasClassName) global.DOMHelpers.ClassName = global.ClassName;
    if (hasTagName) global.DOMHelpers.TagName = global.TagName;
    if (hasName) global.DOMHelpers.Name = global.Name;
  }

  // ===== EXPORT MODULE =====

  const GlobalShortcutsBulkUpdate = {
    version: '1.1.0',
    
    // Factory function for creating custom bulk update methods
    createBulkUpdateMethod: createBulkUpdateMethod,
    
    // Wrapper function for adding update to proxies
    wrapProxyWithUpdate: wrapProxyWithUpdate,
    
    // Utility to check if shortcuts have update methods
    hasUpdateSupport() {
      return {
        ClassName: hasClassName && typeof global.ClassName.update === 'function',
        TagName: hasTagName && typeof global.TagName.update === 'function',
        Name: hasName && typeof global.Name.update === 'function'
      };
    },
    
    // Utility to get update method stats
    getStats() {
      const stats = {
        shortcuts: 0,
        withUpdate: 0
      };
      
      if (hasClassName) stats.shortcuts++;
      if (hasTagName) stats.shortcuts++;
      if (hasName) stats.shortcuts++;
      
      if (hasClassName && typeof global.ClassName.update === 'function') stats.withUpdate++;
      if (hasTagName && typeof global.TagName.update === 'function') stats.withUpdate++;
      if (hasName && typeof global.Name.update === 'function') stats.withUpdate++;
      
      return stats;
    }
  };

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalShortcutsBulkUpdate;
  }

  // AMD
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return GlobalShortcutsBulkUpdate;
    });
  }

  // Browser global
  global.GlobalShortcutsBulkUpdate = GlobalShortcutsBulkUpdate;

  // Integrate with DOMHelpers
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.GlobalShortcutsBulkUpdate = GlobalShortcutsBulkUpdate;
  }

  // ===== FINAL LOGGING =====

  const stats = GlobalShortcutsBulkUpdate.getStats();
  console.log(`[Global Shortcuts Bulk Update] v1.1.0 loaded - ${stats.withUpdate}/${stats.shortcuts} shortcuts enhanced`);
  console.log('[Global Shortcuts Bulk Update] Usage: ClassName.update({ btn: {...}, card: {...} })');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);