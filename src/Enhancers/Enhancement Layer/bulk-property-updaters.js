/**
 * bulk-property-updaters.js
 *
 * Enhancement Layer - Bulk Property Updates
 * Adds convenient shorthand methods for bulk element updates
 *
 * Features:
 * - Bulk property updaters for Elements helper (ID-based)
 * - Index-based updaters for Collections helper
 * - Automatic element enhancement integration
 * - Support for all common properties and special objects
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
    root.BulkPropertyUpdaters = factory(root.ElementEnhancerCore);
  }
}(typeof self !== 'undefined' ? self : this, function(ElementEnhancerCore) {
  'use strict';

  // ========================================================================
  // ELEMENT ENHANCEMENT UTILITIES
  // ========================================================================

  /**
   * Detect if ElementEnhancerCore is available
   * @returns {boolean}
   */
  function hasEnhancerCore() {
    return ElementEnhancerCore !== null && typeof ElementEnhancerCore === 'object';
  }

  /**
   * Detect if UpdateUtility is available globally
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
   * Apply update to an element using best available method
   * @param {HTMLElement} element - Element to update
   * @param {Object} updates - Updates to apply
   * @returns {HTMLElement} - Updated element
   */
  function applyElementUpdate(element, updates) {
    if (!element || !updates) return element;

    // Try element's own .update() method first
    if (typeof element.update === 'function') {
      element.update(updates);
      return element;
    }

    // Try ElementEnhancerCore if available
    if (hasEnhancerCore()) {
      ElementEnhancerCore.applyUpdate(element, updates);
      return element;
    }

    // Basic fallback
    Object.entries(updates).forEach(([key, value]) => {
      try {
        if (key in element) {
          element[key] = value;
        }
      } catch (error) {
        console.warn(`[BulkPropertyUpdaters] Error setting ${key}:`, error.message);
      }
    });

    return element;
  }

  // ========================================================================
  // BULK UPDATER FACTORIES (FOR ELEMENTS HELPER)
  // ========================================================================

  /**
   * Create a bulk property updater function for simple properties
   * @param {string} propertyName - The property to update
   * @param {Function} transformer - Optional value transformer
   * @returns {Function} - Bulk updater function
   */
  function createBulkPropertyUpdater(propertyName, transformer = null) {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn(`[BulkPropertyUpdaters] ${propertyName}() requires an object with element IDs as keys`);
        return this;
      }

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            const finalValue = transformer ? transformer(value) : value;
            applyElementUpdate(element, { [propertyName]: finalValue });
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for ${propertyName} update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating ${propertyName} for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk style updater
   * @returns {Function}
   */
  function createBulkStyleUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[BulkPropertyUpdaters] style() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, styleObj]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof styleObj !== 'object' || styleObj === null) {
              console.warn(`[BulkPropertyUpdaters] style() requires style object for '${elementId}'`);
              return;
            }
            applyElementUpdate(element, { style: styleObj });
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for style update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating style for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk dataset updater
   * @returns {Function}
   */
  function createBulkDatasetUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[BulkPropertyUpdaters] dataset() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, dataObj]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof dataObj !== 'object' || dataObj === null) {
              console.warn(`[BulkPropertyUpdaters] dataset() requires data object for '${elementId}'`);
              return;
            }
            applyElementUpdate(element, { dataset: dataObj });
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for dataset update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating dataset for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk attributes updater
   * @returns {Function}
   */
  function createBulkAttributesUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[BulkPropertyUpdaters] attrs() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, attrsObj]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (typeof attrsObj !== 'object' || attrsObj === null) {
              console.warn(`[BulkPropertyUpdaters] attrs() requires attributes object for '${elementId}'`);
              return;
            }
            applyElementUpdate(element, { attrs: attrsObj });
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for attrs update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating attrs for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk classList updater
   * @returns {Function}
   */
  function createBulkClassListUpdater() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[BulkPropertyUpdaters] classes() requires an object with element IDs as keys');
        return this;
      }

      Object.entries(updates).forEach(([elementId, classConfig]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            // Handle simple string replacement
            if (typeof classConfig === 'string') {
              element.className = classConfig;
              return;
            }

            // Handle classList operations object
            if (typeof classConfig === 'object' && classConfig !== null) {
              applyElementUpdate(element, { classList: classConfig });
            }
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for classes update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating classes for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  /**
   * Create a bulk generic property updater with nested property support
   * @returns {Function}
   */
  function createBulkGenericPropertyUpdater() {
    return function(propertyPath, updates = {}) {
      if (typeof propertyPath !== 'string') {
        console.warn('[BulkPropertyUpdaters] prop() requires a property name as first argument');
        return this;
      }

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.warn('[BulkPropertyUpdaters] prop() requires an object with element IDs as keys');
        return this;
      }

      const isNested = propertyPath.includes('.');
      const pathParts = isNested ? propertyPath.split('.') : null;

      Object.entries(updates).forEach(([elementId, value]) => {
        try {
          const element = this[elementId];

          if (element && element.nodeType === Node.ELEMENT_NODE) {
            if (isNested) {
              // Handle nested property
              let obj = element;
              for (let i = 0; i < pathParts.length - 1; i++) {
                obj = obj[pathParts[i]];
                if (!obj) {
                  console.warn(`[BulkPropertyUpdaters] Invalid property path '${propertyPath}' for '${elementId}'`);
                  return;
                }
              }
              obj[pathParts[pathParts.length - 1]] = value;
            } else {
              // Direct property
              if (propertyPath in element) {
                element[propertyPath] = value;
              } else {
                console.warn(`[BulkPropertyUpdaters] Property '${propertyPath}' not found on element '${elementId}'`);
              }
            }
          } else {
            console.warn(`[BulkPropertyUpdaters] Element '${elementId}' not found for prop update`);
          }
        } catch (error) {
          console.warn(`[BulkPropertyUpdaters] Error updating prop '${propertyPath}' for '${elementId}':`, error.message);
        }
      });

      return this;
    };
  }

  // ========================================================================
  // ELEMENTS HELPER ENHANCEMENT
  // ========================================================================

  /**
   * Enhance Elements helper with bulk property update methods
   * @param {Object} Elements - The Elements helper object
   * @returns {Object} - Enhanced Elements helper
   */
  function enhanceElementsHelper(Elements) {
    if (!Elements) {
      console.warn('[BulkPropertyUpdaters] Elements helper not found');
      return null;
    }

    // Common simple properties
    Elements.textContent = createBulkPropertyUpdater('textContent');
    Elements.innerHTML = createBulkPropertyUpdater('innerHTML');
    Elements.innerText = createBulkPropertyUpdater('innerText');
    Elements.value = createBulkPropertyUpdater('value');
    Elements.placeholder = createBulkPropertyUpdater('placeholder');
    Elements.title = createBulkPropertyUpdater('title');
    Elements.disabled = createBulkPropertyUpdater('disabled');
    Elements.checked = createBulkPropertyUpdater('checked');
    Elements.readonly = createBulkPropertyUpdater('readOnly');
    Elements.hidden = createBulkPropertyUpdater('hidden');
    Elements.selected = createBulkPropertyUpdater('selected');

    // Media properties
    Elements.src = createBulkPropertyUpdater('src');
    Elements.href = createBulkPropertyUpdater('href');
    Elements.alt = createBulkPropertyUpdater('alt');

    // Complex properties
    Elements.style = createBulkStyleUpdater();
    Elements.dataset = createBulkDatasetUpdater();
    Elements.attrs = createBulkAttributesUpdater();
    Elements.classes = createBulkClassListUpdater();

    // Generic property updater
    Elements.prop = createBulkGenericPropertyUpdater();

    return Elements;
  }

  // ========================================================================
  // COLLECTIONS HELPER ENHANCEMENT
  // ========================================================================

  /**
   * Enhance a Collections helper instance with bulk update methods
   * @param {Object} Collections - The Collections helper object
   * @returns {Object} - Enhanced Collections helper
   */
  function enhanceCollectionsHelper(Collections) {
    if (!Collections) {
      console.warn('[BulkPropertyUpdaters] Collections helper not found');
      return null;
    }

    // Collections already have .update() method from indexed-update integration
    // This function is here for completeness and future extensions

    return Collections;
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  /**
   * Initialize bulk property updaters
   * @param {Object} Elements - Elements helper
   * @param {Object} Collections - Collections helper
   */
  function init(Elements, Collections) {
    if (Elements) {
      enhanceElementsHelper(Elements);
    }

    if (Collections) {
      enhanceCollectionsHelper(Collections);
    }
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const BulkPropertyUpdaters = {
    version: '2.3.1',

    // Enhancement functions
    enhanceElementsHelper: enhanceElementsHelper,
    enhanceCollectionsHelper: enhanceCollectionsHelper,

    // Initialization
    init: init,

    // Utilities
    hasEnhancerCore: hasEnhancerCore,
    hasUpdateUtility: hasUpdateUtility
  };

  return BulkPropertyUpdaters;
}));
