/**
 * DOM Helpers - Conditions Collections
 *
 * Collection-level conditional updates with index support
 * Adds whenStateCollection() method for collection-aware conditional rendering
 *
 * @version 2.3.1
 * @license MIT
 */

(function (global, factory) {
  'use strict';

  // UMD pattern for universal module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.DOMHelpersConditionsCollections = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCY DETECTION
  // ============================================================================

  let ConditionsCore;

  // Try to load conditions-core module
  if (typeof require !== 'undefined') {
    try {
      ConditionsCore = require('./conditions-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global Conditions
  if (!ConditionsCore && typeof window !== 'undefined') {
    ConditionsCore = window.Conditions;
  } else if (!ConditionsCore && typeof global !== 'undefined') {
    ConditionsCore = global.Conditions;
  }

  // Exit if Conditions not found
  if (!ConditionsCore) {
    console.error('[Conditions.Collections] Requires Conditions.js to be loaded first');
    console.error('[Conditions.Collections] Please load conditions-core.js before this file');
    return {};
  }

  // Get shared utilities from core
  const {
    matchesCondition,
    getElements,
    safeArrayFrom
  } = ConditionsCore;

  // ============================================================================
  // COLLECTION-AWARE CONDITIONAL RENDERING
  // ============================================================================

  /**
   * Apply conditions to a collection (supports bulk + index updates)
   *
   * @param {Function|*} valueFn - State value or function returning value
   * @param {Object|Function} conditions - Condition mappings with update objects
   * @param {string|Element|NodeList|Array} selector - Target collection
   * @param {Object} options - {reactive: boolean}
   * @returns {Object|void} Cleanup object or void
   *
   * @example
   * whenStateCollection(state.size, {
   *   'small': {
   *     0: { textContent: 'First' },      // Index-specific
   *     -1: { textContent: 'Last' },      // Negative index
   *     style: { padding: '5px' }         // All items
   *   },
   *   'large': {
   *     style: { padding: '20px' }
   *   }
   * }, '.items');
   */
  function whenStateCollection(valueFn, conditions, selector, options = {}) {
    const hasReactivity = ConditionsCore.hasReactivity;
    const useReactive = options.reactive !== false && hasReactivity;

    // Get value function
    const getValue = typeof valueFn === 'function' ? valueFn : () => valueFn;

    // Core logic: apply conditions to collection
    function applyToCollection() {
      // Get collection
      let collection;

      if (typeof selector === 'string') {
        // Try global shortcuts first
        if (selector.startsWith('.') && typeof ClassName !== 'undefined') {
          const className = selector.slice(1);
          collection = ClassName[className];
        } else if (selector.startsWith('#')) {
          // Single element, use regular whenState
          return ConditionsCore.whenState(valueFn, conditions, selector, options);
        } else {
          collection = getElements(selector);
        }
      } else if (selector instanceof Element) {
        // Single element
        collection = [selector];
      } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
        collection = safeArrayFrom(selector);
      } else if (Array.isArray(selector)) {
        collection = selector;
      } else {
        console.warn('[Conditions.Collection] Invalid selector');
        return;
      }

      if (!collection || (Array.isArray(collection) && collection.length === 0)) {
        console.warn('[Conditions.Collection] No elements found');
        return;
      }

      // Convert collection to array if needed
      const elements = Array.isArray(collection) ? collection : safeArrayFrom(collection);

      // Get current value
      let value;
      try {
        value = getValue();
      } catch (e) {
        console.error('[Conditions.Collection] Error getting value:', e);
        return;
      }

      // Get conditions object
      let conditionsObj;
      try {
        conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
      } catch (e) {
        console.error('[Conditions.Collection] Error evaluating conditions:', e);
        return;
      }

      // Find matching condition
      let matchingConfig = null;
      for (const [condition, config] of Object.entries(conditionsObj)) {
        if (matchesCondition(value, condition)) {
          matchingConfig = config;
          break;
        }
      }

      if (!matchingConfig) {
        return;
      }

      // Apply to collection using .update() if available
      if (collection.update && typeof collection.update === 'function') {
        try {
          collection.update(matchingConfig);
          return;
        } catch (e) {
          console.warn('[Conditions.Collection] Error using collection.update():', e);
          // Fall through to manual application
        }
      }

      // Manual application: separate index and bulk updates
      applyManually(elements, matchingConfig);
    }

    // Manual application fallback
    function applyManually(elements, config) {
      // Separate index and bulk updates
      const indexUpdates = {};
      const bulkUpdates = {};

      Object.entries(config).forEach(([key, value]) => {
        if (/^-?\d+$/.test(key)) {
          indexUpdates[key] = value;
        } else {
          bulkUpdates[key] = value;
        }
      });

      // Apply bulk to all
      if (Object.keys(bulkUpdates).length > 0) {
        elements.forEach(element => {
          if (element && element.update) {
            element.update(bulkUpdates);
          } else if (element) {
            // Fallback: apply properties directly
            Object.entries(bulkUpdates).forEach(([key, val]) => {
              try {
                if (ConditionsCore.applyProperty) {
                  ConditionsCore.applyProperty(element, key, val);
                } else if (key in element) {
                  element[key] = val;
                }
              } catch (e) {
                console.warn(`[Conditions.Collection] Failed to apply ${key}:`, e);
              }
            });
          }
        });
      }

      // Apply index-specific
      Object.entries(indexUpdates).forEach(([indexStr, updates]) => {
        let index = parseInt(indexStr);
        if (index < 0) index = elements.length + index;

        const element = elements[index];
        if (element && element.update) {
          element.update(updates);
        } else if (element) {
          // Fallback: apply properties directly
          Object.entries(updates).forEach(([key, val]) => {
            try {
              if (ConditionsCore.applyProperty) {
                ConditionsCore.applyProperty(element, key, val);
              } else if (key in element) {
                element[key] = val;
              }
            } catch (e) {
              console.warn(`[Conditions.Collection] Failed to apply ${key}:`, e);
            }
          });
        }
      });
    }

    // Execute
    if (useReactive) {
      if (typeof ReactiveUtils !== 'undefined' && ReactiveUtils.effect) {
        return ReactiveUtils.effect(applyToCollection);
      } else if (typeof Elements !== 'undefined' && Elements.effect) {
        return Elements.effect(applyToCollection);
      } else if (ConditionsCore.effect) {
        return ConditionsCore.effect(applyToCollection);
      }
    }

    // Non-reactive
    applyToCollection();
    return {
      update: applyToCollection,
      destroy: () => {}
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Collection-aware conditional rendering
     */
    whenStateCollection,

    /**
     * Alias for whenStateCollection
     */
    whenCollection: whenStateCollection,

    /**
     * Version
     */
    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Add to Conditions namespace
  if (ConditionsCore) {
    ConditionsCore.whenStateCollection = whenStateCollection;
    ConditionsCore.whenCollection = whenStateCollection;
  }

  // Export to global
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (globalObj.Conditions) {
      globalObj.Conditions.whenStateCollection = whenStateCollection;
      globalObj.Conditions.whenCollection = whenStateCollection;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Conditions Collections] v2.3.1 loaded');
    console.log('[DOM Helpers Conditions Collections] ✓ Supports bulk + index updates in conditions');
    console.log('[DOM Helpers Conditions Collections] ✓ whenStateCollection() available');
  }

  return api;
});
