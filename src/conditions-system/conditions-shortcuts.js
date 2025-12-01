/**
 * DOM Helpers - Conditions Shortcuts
 *
 * Global shortcuts for conditions and extension registration
 * Provides convenient global functions without namespace prefix
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
    global.DOMHelpersConditionsShortcuts = factory();
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
    console.error('[Conditions.Shortcuts] Requires Conditions.js to be loaded first');
    console.error('[Conditions.Shortcuts] Please load conditions-core.js before this file');
    return {};
  }

  // Validate required methods exist
  const requiredMethods = ['whenState', 'apply', 'watch', 'registerMatcher', 'registerHandler'];
  const missingMethods = requiredMethods.filter(method => typeof Conditions[method] !== 'function');

  if (missingMethods.length > 0) {
    console.error('[Conditions.Shortcuts] Missing required Conditions methods:', missingMethods);
    return {};
  }

  // ============================================================================
  // CONFLICT DETECTION
  // ============================================================================

  const shortcuts = [
    'whenState', 'whenWatch', 'whenApply', 'whenBatch',
    'registerMatcher', 'registerHandler', 'registerMatchers', 'registerHandlers',
    'getMatchers', 'getHandlers', 'hasMatcher', 'hasHandler',
    'createSimpleMatcher', 'createSimpleHandler'
  ];

  const globalObj = typeof window !== 'undefined' ? window : global;
  const conflicts = shortcuts.filter(name => name in globalObj);

  let useNamespace = false;

  if (conflicts.length > 0) {
    console.warn('[Conditions.Shortcuts] ⚠️  Naming conflicts detected:', conflicts);
    console.warn('[Conditions.Shortcuts] → Using fallback namespace: CondShortcuts');
    useNamespace = true;
  }

  // ============================================================================
  // CONDITION SHORTCUTS
  // ============================================================================

  /**
   * Direct alias to Conditions.whenState()
   * Main method for conditional rendering with auto-reactive support
   *
   * @param {Function|*} valueFn - State value or function returning value
   * @param {Object|Function} conditions - Condition mappings
   * @param {string|Element|NodeList} selector - Target elements
   * @param {Object} options - {reactive: boolean}
   * @returns {Object|void} Cleanup object or void
   */
  function whenState(valueFn, conditions, selector, options) {
    return Conditions.whenState(valueFn, conditions, selector, options);
  }

  /**
   * Direct alias to Conditions.watch()
   * Explicit reactive watching (requires reactive library)
   *
   * @param {Function|*} valueFn - State value or function returning value
   * @param {Object|Function} conditions - Condition mappings
   * @param {string|Element|NodeList} selector - Target elements
   * @returns {Object|void} Cleanup object or void
   */
  function whenWatch(valueFn, conditions, selector) {
    return Conditions.watch(valueFn, conditions, selector);
  }

  /**
   * Direct alias to Conditions.apply()
   * One-time static application without reactivity
   *
   * @param {*} value - Current value to match
   * @param {Object|Function} conditions - Condition mappings
   * @param {string|Element|NodeList} selector - Target elements
   * @returns {Object} Chainable Conditions object
   */
  function whenApply(value, conditions, selector) {
    return Conditions.apply(value, conditions, selector);
  }

  /**
   * Direct alias to Conditions.batch()
   * Batch multiple condition updates
   *
   * @param {Function} fn - Function containing batch updates
   * @returns {*} Result of batch function
   */
  function whenBatch(fn) {
    return Conditions.batch(fn);
  }

  // ============================================================================
  // EXTENSION REGISTRATION SHORTCUTS
  // ============================================================================

  /**
   * Register a custom condition matcher
   *
   * @param {string} name - Unique name for the matcher
   * @param {Object} matcher - Matcher definition
   * @param {Function} matcher.test - (condition, value?) => boolean
   * @param {Function} matcher.match - (value, condition) => boolean
   * @returns {Object} Chainable API
   *
   * @example
   * registerMatcher('weekday', {
   *   test: (condition) => condition === 'weekday',
   *   match: (value) => {
   *     const day = new Date(value).getDay();
   *     return day >= 1 && day <= 5;
   *   }
   * });
   */
  function registerMatcher(name, matcher) {
    // Validate matcher structure
    if (!matcher || typeof matcher !== 'object') {
      console.error(`[registerMatcher] Matcher must be an object, got ${typeof matcher}`);
      return API;
    }

    if (typeof matcher.test !== 'function') {
      console.error(`[registerMatcher] Matcher.test must be a function for "${name}"`);
      return API;
    }

    if (typeof matcher.match !== 'function') {
      console.error(`[registerMatcher] Matcher.match must be a function for "${name}"`);
      return API;
    }

    // Register with Conditions
    try {
      Conditions.registerMatcher(name, matcher);
      console.log(`[registerMatcher] ✓ Registered: ${name}`);
    } catch (e) {
      console.error(`[registerMatcher] Failed to register "${name}":`, e);
    }

    return API;
  }

  /**
   * Register a custom property handler
   *
   * @param {string} name - Unique name for the handler
   * @param {Object} handler - Handler definition
   * @param {Function} handler.test - (key, val, element?) => boolean
   * @param {Function} handler.apply - (element, val, key) => void
   * @returns {Object} Chainable API
   *
   * @example
   * registerHandler('animate', {
   *   test: (key, val) => key === 'animate' && typeof val === 'object',
   *   apply: (element, val) => {
   *     element.animate(val.keyframes, val.options);
   *   }
   * });
   */
  function registerHandler(name, handler) {
    // Validate handler structure
    if (!handler || typeof handler !== 'object') {
      console.error(`[registerHandler] Handler must be an object, got ${typeof handler}`);
      return API;
    }

    if (typeof handler.test !== 'function') {
      console.error(`[registerHandler] Handler.test must be a function for "${name}"`);
      return API;
    }

    if (typeof handler.apply !== 'function') {
      console.error(`[registerHandler] Handler.apply must be a function for "${name}"`);
      return API;
    }

    // Register with Conditions
    try {
      Conditions.registerHandler(name, handler);
      console.log(`[registerHandler] ✓ Registered: ${name}`);
    } catch (e) {
      console.error(`[registerHandler] Failed to register "${name}":`, e);
    }

    return API;
  }

  /**
   * Get list of all registered matchers
   * @returns {Array<string>} Matcher names
   */
  function getMatchers() {
    if (typeof Conditions.getMatchers === 'function') {
      return Conditions.getMatchers();
    }
    console.warn('[getMatchers] Not available in this version of Conditions.js');
    return [];
  }

  /**
   * Get list of all registered handlers
   * @returns {Array<string>} Handler names
   */
  function getHandlers() {
    if (typeof Conditions.getHandlers === 'function') {
      return Conditions.getHandlers();
    }
    console.warn('[getHandlers] Not available in this version of Conditions.js');
    return [];
  }

  /**
   * Check if a matcher is already registered
   * @param {string} name - Matcher name to check
   * @returns {boolean}
   */
  function hasMatcher(name) {
    return getMatchers().includes(name);
  }

  /**
   * Check if a handler is already registered
   * @param {string} name - Handler name to check
   * @returns {boolean}
   */
  function hasHandler(name) {
    return getHandlers().includes(name);
  }

  /**
   * Batch register multiple matchers at once
   * @param {Object} matchers - Map of name => matcher definitions
   * @returns {Object} Chainable API
   */
  function registerMatchers(matchers) {
    if (!matchers || typeof matchers !== 'object') {
      console.error('[registerMatchers] Argument must be an object');
      return API;
    }

    let registered = 0;
    let failed = 0;

    Object.entries(matchers).forEach(([name, matcher]) => {
      try {
        registerMatcher(name, matcher);
        registered++;
      } catch (e) {
        console.error(`[registerMatchers] Failed to register "${name}":`, e);
        failed++;
      }
    });

    console.log(`[registerMatchers] ✓ Registered ${registered} matchers${failed ? `, ${failed} failed` : ''}`);
    return API;
  }

  /**
   * Batch register multiple handlers at once
   * @param {Object} handlers - Map of name => handler definitions
   * @returns {Object} Chainable API
   */
  function registerHandlers(handlers) {
    if (!handlers || typeof handlers !== 'object') {
      console.error('[registerHandlers] Argument must be an object');
      return API;
    }

    let registered = 0;
    let failed = 0;

    Object.entries(handlers).forEach(([name, handler]) => {
      try {
        registerHandler(name, handler);
        registered++;
      } catch (e) {
        console.error(`[registerHandlers] Failed to register "${name}":`, e);
        failed++;
      }
    });

    console.log(`[registerHandlers] ✓ Registered ${registered} handlers${failed ? `, ${failed} failed` : ''}`);
    return API;
  }

  /**
   * Helper: Create a simple equality matcher quickly
   * @param {string} name - Matcher name
   * @param {string} keyword - Condition keyword to match
   * @param {Function} checkFn - (value) => boolean
   * @returns {Object} Chainable API
   */
  function createSimpleMatcher(name, keyword, checkFn) {
    return registerMatcher(name, {
      test: (condition) => condition === keyword,
      match: (value) => checkFn(value)
    });
  }

  /**
   * Helper: Create a simple property handler quickly
   * @param {string} name - Handler name
   * @param {string} propertyKey - Property name to handle
   * @param {Function} applyFn - (element, value) => void
   * @returns {Object} Chainable API
   */
  function createSimpleHandler(name, propertyKey, applyFn) {
    return registerHandler(name, {
      test: (key) => key === propertyKey,
      apply: (element, val) => applyFn(element, val)
    });
  }

  /**
   * Print all registered extensions to console
   */
  function printExtensions() {
    console.group('[Conditions] Registered Extensions');
    console.log('Matchers:', getMatchers());
    console.log('Handlers:', getHandlers());
    console.log('Reactivity:', Conditions.hasReactivity ? 'Available' : 'Not available');
    console.groupEnd();
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const API = {
    // Condition shortcuts
    whenState,
    whenWatch,
    whenApply,
    whenBatch,

    // Extension shortcuts
    registerMatcher,
    registerHandler,
    registerMatchers,
    registerHandlers,
    getMatchers,
    getHandlers,
    hasMatcher,
    hasHandler,
    createSimpleMatcher,
    createSimpleHandler,

    // Utilities
    printExtensions,

    // Version
    version: '2.3.1'
  };

  // ============================================================================
  // EXPORT STRATEGY
  // ============================================================================

  if (useNamespace) {
    // FALLBACK: Export to CondShortcuts namespace
    globalObj.CondShortcuts = API;

    // Also attach to Conditions for discoverability
    Conditions.shortcuts = API;

    console.log('[Conditions.Shortcuts] v2.3.1 loaded (namespace mode)');
    console.log('[Conditions.Shortcuts] ✓ Available via: CondShortcuts.whenState()');
    console.log('[Conditions.Shortcuts] ✓ Available via: Conditions.shortcuts.whenState()');
    console.log('[Conditions.Shortcuts] ℹ️  Direct globals unavailable due to conflicts');

  } else {
    // PRIMARY: Export to global scope directly
    globalObj.whenState = whenState;
    globalObj.whenWatch = whenWatch;
    globalObj.whenApply = whenApply;
    globalObj.whenBatch = whenBatch;
    globalObj.registerMatcher = registerMatcher;
    globalObj.registerHandler = registerHandler;
    globalObj.registerMatchers = registerMatchers;
    globalObj.registerHandlers = registerHandlers;
    globalObj.getMatchers = getMatchers;
    globalObj.getHandlers = getHandlers;
    globalObj.hasMatcher = hasMatcher;
    globalObj.hasHandler = hasHandler;
    globalObj.createSimpleMatcher = createSimpleMatcher;
    globalObj.createSimpleHandler = createSimpleHandler;
    globalObj.printExtensions = printExtensions;

    // Also keep reference in Conditions for programmatic access
    Conditions.shortcuts = API;

    console.log('[Conditions.Shortcuts] v2.3.1 loaded');
    console.log('[Conditions.Shortcuts] ✓ Condition shortcuts: whenState(), whenWatch(), whenApply(), whenBatch()');
    console.log('[Conditions.Shortcuts] ✓ Extension shortcuts: registerMatcher(), registerHandler()');
    console.log('[Conditions.Shortcuts] ✓ Utilities: getMatchers(), getHandlers(), printExtensions()');
    console.log('[Conditions.Shortcuts] ℹ️  Fallback: Conditions.shortcuts.*');
  }

  // ============================================================================
  // CLEANUP UTILITY
  // ============================================================================

  /**
   * Remove shortcuts from global scope (cleanup utility)
   * Useful for testing or conflict resolution
   */
  API.removeShortcuts = function() {
    if (!useNamespace) {
      shortcuts.forEach(name => {
        delete globalObj[name];
      });
      console.log('[Conditions.Shortcuts] Global shortcuts removed');
    } else {
      delete globalObj.CondShortcuts;
      console.log('[Conditions.Shortcuts] CondShortcuts namespace removed');
    }
    delete Conditions.shortcuts;
  };

  // ============================================================================
  // METADATA & VERSION
  // ============================================================================

  Conditions.extensions = Conditions.extensions || {};
  Conditions.extensions.shortcuts = {
    version: '2.3.1',
    mode: useNamespace ? 'namespace' : 'global',
    conflicts: conflicts.length > 0 ? conflicts : null,
    removeShortcuts: API.removeShortcuts
  };

  // ============================================================================
  // DEVELOPMENT HELPERS
  // ============================================================================

  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    /**
     * Print current shortcuts configuration
     */
    API.printConfig = function() {
      console.group('[Conditions.Shortcuts] Configuration');
      console.log('Version:', Conditions.extensions.shortcuts.version);
      console.log('Mode:', Conditions.extensions.shortcuts.mode);
      console.log('Conflicts:', Conditions.extensions.shortcuts.conflicts || 'None');
      console.log('Available methods:', Object.keys(API));
      console.log('Reactivity:', Conditions.hasReactivity ? 'Available' : 'Not available');
      console.groupEnd();
    };
  }

  return API;
});
