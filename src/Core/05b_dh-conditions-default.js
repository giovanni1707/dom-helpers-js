/**
 * Conditions.js - Default Condition Enhancement
 * @version 1.0.0
 * @description Adds explicit 'default' condition support to Conditions module
 * @requires Conditions.js v4.0.0+
 * @license MIT
 */
(function(global) {
  'use strict';

  // ============================================================================
  // VALIDATION
  // ============================================================================

  if (!global.Conditions) {
    console.error('[Conditions.Default] Conditions module not found. Please load Conditions.js first.');
    return;
  }

  // ============================================================================
  // WRAPPER AROUND ORIGINAL METHODS
  // ============================================================================

  const _originalWhenState = global.Conditions.whenState;
  const _originalApply = global.Conditions.apply;
  const _originalWatch = global.Conditions.watch;

  /**
   * Reorder conditions to ensure 'default' is evaluated last
   */
  function reorderConditions(conditions) {
    if (typeof conditions === 'function') {
      return function() {
        return reorderConditions(conditions());
      };
    }

    if (!conditions || typeof conditions !== 'object') {
      return conditions;
    }

    // Check if default exists
    const hasDefault = 'default' in conditions || '*' in conditions;
    
    if (!hasDefault) {
      return conditions; // No reordering needed
    }

    // Extract default/wildcard
    const defaultKey = 'default' in conditions ? 'default' : '*';
    const defaultConfig = conditions[defaultKey];
    
    // Create new object with default at the end
    const { [defaultKey]: _, ...rest } = conditions;
    
    return {
      ...rest,
      [defaultKey]: defaultConfig
    };
  }

  // ============================================================================
  // ENHANCED METHODS
  // ============================================================================

  global.Conditions.whenState = function(valueFn, conditions, selector, options = {}) {
    const reordered = reorderConditions(conditions);
    return _originalWhenState.call(this, valueFn, reordered, selector, options);
  };

  global.Conditions.apply = function(value, conditions, selector) {
    const reordered = reorderConditions(conditions);
    return _originalApply.call(this, value, reordered, selector);
  };

  global.Conditions.watch = function(valueFn, conditions, selector) {
    const reordered = reorderConditions(conditions);
    return _originalWatch.call(this, valueFn, reordered, selector);
  };

  // ============================================================================
  // REGISTER DEFAULT MATCHER (will be checked in order)
  // ============================================================================

  global.Conditions.registerMatcher('default', {
    test: (condition) => condition === 'default' || condition === '*',
    match: () => true // Always matches as fallback
  });

  // ============================================================================
  // UPDATE DOM HELPERS INTEGRATION
  // ============================================================================

  if (global.Elements) {
    global.Elements.whenState = global.Conditions.whenState;
    global.Elements.whenApply = global.Conditions.apply;
    global.Elements.whenWatch = global.Conditions.watch;
  }
  
  if (global.Collections) {
    global.Collections.whenState = global.Conditions.whenState;
    global.Collections.whenApply = global.Conditions.apply;
    global.Collections.whenWatch = global.Conditions.watch;
  }
  
  if (global.Selector) {
    global.Selector.whenState = global.Conditions.whenState;
    global.Selector.whenApply = global.Conditions.apply;
    global.Selector.whenWatch = global.Conditions.watch;
  }

  // ============================================================================
  // VERSION INFO
  // ============================================================================

  global.Conditions.extensions = global.Conditions.extensions || {};
  global.Conditions.extensions.defaultBranch = '1.0.0';

  // ============================================================================
  // LOGGING
  // ============================================================================

  console.log('[Conditions.Default] v1.0.0 loaded successfully');
  console.log('[Conditions.Default] ✓ "default" and "*" conditions available as fallbacks');
  console.log('[Conditions.Default] ✓ Automatic reordering ensures default is checked last');

})(typeof window !== 'undefined' ? window : global);
