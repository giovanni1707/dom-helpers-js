/**
 * DOM Helpers - Conditions Default Branch
 *
 * Adds explicit default branch support to Conditions.whenState()
 * Non-invasive wrapper that preserves all original functionality
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
    global.DOMHelpersConditionsDefault = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCY VALIDATION
  // ============================================================================

  let Conditions;

  // Try to load conditions-core module
  if (typeof require !== 'undefined') {
    try {
      Conditions = require('./conditions-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global Conditions
  if (!Conditions && typeof window !== 'undefined') {
    Conditions = window.Conditions;
  } else if (!Conditions && typeof global !== 'undefined') {
    Conditions = global.Conditions;
  }

  // Exit if Conditions not found
  if (!Conditions) {
    console.error('[Conditions.Default] Requires Conditions.js to be loaded first');
    console.error('[Conditions.Default] Please load conditions-core.js before this file');
    return {};
  }

  // ============================================================================
  // STORE ORIGINAL METHODS (DO NOT MODIFY)
  // ============================================================================

  const _originalWhenState = Conditions.whenState;
  const _originalApply = Conditions.apply;
  const _originalWatch = Conditions.watch;

  // ============================================================================
  // HELPER: PROCESS CONDITIONS WITH DEFAULT
  // ============================================================================

  /**
   * Wraps conditions object to handle default branch
   * Returns a function that processes conditions and applies default if no match
   *
   * @param {Object|Function} conditions - Conditions object or function
   * @returns {Object|Function} Wrapped conditions
   */
  function wrapConditionsWithDefault(conditions) {
    const conditionsObj = typeof conditions === 'function' ? conditions() : conditions;

    // Check if default exists
    if (!('default' in conditionsObj)) {
      // No default - return original conditions unchanged
      return conditions;
    }

    // Extract default and create new conditions object
    const { default: defaultConfig, ...regularConditions } = conditionsObj;

    // Create a wrapped conditions function that adds a catch-all matcher
    return function() {
      const currentConditions = typeof conditions === 'function' ? conditions() : conditions;
      const { default: currentDefault, ...currentRegular } = currentConditions;

      // Add a universal catch-all pattern at the end
      // This will match anything if no other condition matches first
      return {
        ...currentRegular,
        '/^[\\s\\S]*$/': currentDefault  // Regex that matches any string
      };
    };
  }

  // ============================================================================
  // NON-INVASIVE WRAPPER METHODS
  // ============================================================================

  /**
   * Enhanced whenState - wraps original without modifying it
   * @param {Function|*} valueFn - State value or function
   * @param {Object|Function} conditions - Condition mappings (can include 'default')
   * @param {string|Element|NodeList|Array} selector - Target elements
   * @param {Object} options - Options {reactive: boolean}
   * @returns {Object|void} Cleanup object or void
   */
  function whenStateEnhanced(valueFn, conditions, selector, options = {}) {
    const wrappedConditions = wrapConditionsWithDefault(conditions);
    return _originalWhenState.call(Conditions, valueFn, wrappedConditions, selector, options);
  }

  /**
   * Enhanced apply - wraps original without modifying it
   * NOTE: conditions-core.js already supports default branch in apply()
   * This wrapper ensures consistency across all methods
   *
   * @param {*} value - Current value to match
   * @param {Object|Function} conditions - Condition mappings (can include 'default')
   * @param {string|Element|NodeList|Array} selector - Target elements
   * @returns {Object} this for chaining
   */
  function applyEnhanced(value, conditions, selector) {
    // Note: core apply() already supports default branch natively
    // But we wrap it for consistency
    const wrappedConditions = wrapConditionsWithDefault(conditions);
    return _originalApply.call(Conditions, value, wrappedConditions, selector);
  }

  /**
   * Enhanced watch - wraps original without modifying it
   * @param {Function|*} valueFn - State value or function
   * @param {Object|Function} conditions - Condition mappings (can include 'default')
   * @param {string|Element|NodeList|Array} selector - Target elements
   * @returns {Object|void} Cleanup object or void
   */
  function watchEnhanced(valueFn, conditions, selector) {
    const wrappedConditions = wrapConditionsWithDefault(conditions);
    return _originalWatch.call(Conditions, valueFn, wrappedConditions, selector);
  }

  // ============================================================================
  // APPLY ENHANCEMENTS
  // ============================================================================

  // Replace methods with enhanced versions
  Conditions.whenState = whenStateEnhanced;
  Conditions.apply = applyEnhanced;
  Conditions.watch = watchEnhanced;

  // ============================================================================
  // PRESERVE ALL OTHER METHODS
  // ============================================================================

  // Ensure all other methods remain untouched
  // (batch, registerMatcher, registerHandler, etc. are preserved automatically)

  // ============================================================================
  // UPDATE DOM HELPERS INTEGRATION
  // ============================================================================

  if (typeof Elements !== 'undefined') {
    Elements.whenState = Conditions.whenState;
    Elements.whenApply = Conditions.apply;
    Elements.whenWatch = Conditions.watch;
  }

  if (typeof Collections !== 'undefined') {
    Collections.whenState = Conditions.whenState;
    Collections.whenApply = Conditions.apply;
    Collections.whenWatch = Conditions.watch;
  }

  if (typeof Selector !== 'undefined') {
    Selector.whenState = Conditions.whenState;
    Selector.whenApply = Conditions.apply;
    Selector.whenWatch = Conditions.watch;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Restore original methods if needed (for debugging)
     */
    restoreOriginal() {
      Conditions.whenState = _originalWhenState;
      Conditions.apply = _originalApply;
      Conditions.watch = _originalWatch;
      console.log('[Conditions.Default] Original methods restored');
    },

    /**
     * Version
     */
    version: '2.3.1'
  };

  // ============================================================================
  // METADATA & VERSION
  // ============================================================================

  Conditions.extensions = Conditions.extensions || {};
  Conditions.extensions.defaultBranch = {
    version: '2.3.1',
    restoreOriginal: api.restoreOriginal
  };

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Conditions Default] v2.3.1 loaded');
    console.log('[DOM Helpers Conditions Default] ✓ Non-invasive wrapper active');
    console.log('[DOM Helpers Conditions Default] ✓ Original functionality preserved');
    console.log('[DOM Helpers Conditions Default] ✓ Use Conditions.extensions.defaultBranch.restoreOriginal() to revert');
  }

  return api;
});
