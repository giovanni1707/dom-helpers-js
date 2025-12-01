/**
 * DOM Helpers - Reactive Array Support
 *
 * Makes array mutation methods (push, pop, sort, etc.) reactive
 * Automatically patches arrays in reactive state to trigger updates
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
    global.DOMHelpersReactiveArraySupport = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCY DETECTION
  // ============================================================================

  let ReactiveCore;

  // Try to load reactive-core module
  if (typeof require !== 'undefined') {
    try {
      ReactiveCore = require('./reactive-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global ReactiveUtils (legacy) or DOMHelpersReactiveCore
  if (!ReactiveCore) {
    if (typeof DOMHelpersReactiveCore !== 'undefined') {
      ReactiveCore = DOMHelpersReactiveCore;
    } else if (typeof ReactiveUtils !== 'undefined') {
      ReactiveCore = ReactiveUtils;
    }
  }

  // Exit if reactive core not found
  if (!ReactiveCore || !ReactiveCore.state) {
    console.error('[Reactive Array Support] Reactive core not found. Load reactive-core.js first.');
    return {};
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  // Array methods that mutate the array and should trigger reactivity
  const ARRAY_MUTATIONS = [
    'push',       // Add to end
    'pop',        // Remove from end
    'shift',      // Remove from start
    'unshift',    // Add to start
    'splice',     // Add/remove at index
    'sort',       // Sort in place
    'reverse',    // Reverse in place
    'fill',       // Fill with value
    'copyWithin'  // Copy within array
  ];

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Get nested property value
   * Uses shared utility from ReactiveCore if available
   * @param {Object} obj - Source object
   * @param {string} path - Dot-separated property path
   * @returns {*} Property value
   */
  function getNestedProperty(obj, path) {
    if (ReactiveCore.getNestedProperty) {
      return ReactiveCore.getNestedProperty(obj, path);
    }
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested property value
   * Uses shared utility from ReactiveCore if available
   * @param {Object} obj - Target object
   * @param {string} path - Dot-separated property path
   * @param {*} value - Value to set
   */
  function setNestedProperty(obj, path, value) {
    if (ReactiveCore.setNestedProperty) {
      return ReactiveCore.setNestedProperty(obj, path, value);
    }

    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  // ============================================================================
  // ARRAY PATCHING
  // ============================================================================

  /**
   * Patch array methods on a specific property to trigger reactivity
   * @param {Object} state - Reactive state object
   * @param {string} key - Property key
   * @param {string} fullPath - Full property path (for nested arrays)
   * @internal
   */
  function patchArrayMethods(state, key, fullPath) {
    const getArray = () => {
      if (fullPath.includes('.')) {
        return getNestedProperty(state, fullPath);
      }
      return state[key];
    };

    const setArray = (newValue) => {
      if (fullPath.includes('.')) {
        setNestedProperty(state, fullPath, newValue);
      } else {
        state[key] = newValue;
      }
    };

    const checkAndPatch = () => {
      const arr = getArray();
      if (!arr || !Array.isArray(arr) || arr.__patched) return;

      // Mark as patched to avoid double-patching
      Object.defineProperty(arr, '__patched', {
        value: true,
        enumerable: false,
        configurable: false
      });

      // Patch each mutation method
      ARRAY_MUTATIONS.forEach(method => {
        const original = Array.prototype[method];

        Object.defineProperty(arr, method, {
          value: function(...args) {
            // Call original method
            const result = original.apply(this, args);

            // Trigger reactivity by reassigning array
            // This creates a new array reference, triggering reactive updates
            const updatedArray = [...this];
            setArray(updatedArray);

            return result;
          },
          enumerable: false,
          configurable: true,
          writable: true
        });
      });
    };

    // Initial patch
    checkAndPatch();

    // Watch for array replacement and re-patch
    if (state.$watch) {
      state.$watch(key, () => {
        checkAndPatch();
      });
    }
  }

  /**
   * Recursively patch all array properties in an object
   * @param {Object} state - Reactive state object
   * @param {Object} obj - Object to scan for arrays
   * @param {string} [path=''] - Current property path
   * @internal
   */
  function patchArrayProperties(state, obj, path = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const fullPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value)) {
        patchArrayMethods(state, key, fullPath);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        // Recursively patch nested objects
        patchArrayProperties(state, value, fullPath);
      }
    });
  }

  // ============================================================================
  // ENHANCED STATE CREATION
  // ============================================================================

  // Store original state creation function
  const originalCreate = ReactiveCore.state;

  /**
   * Enhanced reactive state creation with automatic array support
   * All arrays in the state will have reactive mutation methods
   * @param {Object} target - Object to make reactive
   * @returns {Object} Reactive state with patched arrays
   */
  function createReactiveWithArraySupport(target) {
    const state = originalCreate(target);

    // Patch all array properties
    patchArrayProperties(state, target);

    return state;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Enhanced state creation with array support
     */
    state: createReactiveWithArraySupport,

    /**
     * Manually patch a specific array property
     * Useful for arrays added after state creation
     * @param {Object} state - Reactive state object
     * @param {string} key - Property key containing the array
     */
    patchArray: function(state, key) {
      if (!state || !state[key]) {
        console.error('[Reactive Array Support] Invalid state or key');
        return;
      }
      patchArrayMethods(state, key, key);
    },

    /**
     * Version
     */
    version: '2.3.1'
  };

  // ============================================================================
  // AUTO-PATCHING
  // ============================================================================

  // Override ReactiveCore.state with array-aware version
  ReactiveCore.state = createReactiveWithArraySupport;

  // Also patch createState if it exists
  if (ReactiveCore.createState) {
    const originalCreateState = ReactiveCore.createState;
    ReactiveCore.createState = function(initialState, bindingDefs) {
      const state = createReactiveWithArraySupport(initialState);
      if (bindingDefs && ReactiveCore.createBindings) {
        ReactiveCore.createBindings(state, bindingDefs);
      }
      return state;
    };
  }

  // Patch DOM Helpers integration if available
  if (typeof Elements !== 'undefined' && Elements.state) {
    Elements.state = createReactiveWithArraySupport;
  }

  if (typeof Collections !== 'undefined' && Collections.state) {
    Collections.state = createReactiveWithArraySupport;
  }

  if (typeof Selector !== 'undefined' && Selector.state) {
    Selector.state = createReactiveWithArraySupport;
  }

  // ============================================================================
  // LEGACY GLOBAL EXPORTS
  // ============================================================================

  // Provide global patching function for manual use
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;
    globalObj.patchReactiveArray = api.patchArray;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Reactive Array Support] v2.3.1 loaded successfully');
    console.log('[DOM Helpers Reactive Array Support] Array methods (push, pop, sort, etc.) are now reactive!');
  }

  return api;
});
