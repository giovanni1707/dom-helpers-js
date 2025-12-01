/**
 * DOM Helpers - Conditions System (Unified Entry Point)
 *
 * Complete conditional rendering system with declarative syntax
 * Single import for all conditional features
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
    global.DOMHelpersConditions = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let ConditionsCore, ConditionsDefault, ConditionsCollections, ConditionsShortcuts;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      ConditionsCore = require('./conditions-core.js');
      ConditionsDefault = require('./conditions-default.js');
      ConditionsCollections = require('./conditions-collections.js');
      ConditionsShortcuts = require('./conditions-shortcuts.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!ConditionsCore) {
    ConditionsCore = typeof DOMHelpersConditionsCore !== 'undefined' ? DOMHelpersConditionsCore : null;
    ConditionsDefault = typeof DOMHelpersConditionsDefault !== 'undefined' ? DOMHelpersConditionsDefault : null;
    ConditionsCollections = typeof DOMHelpersConditionsCollections !== 'undefined' ? DOMHelpersConditionsCollections : null;
    ConditionsShortcuts = typeof DOMHelpersConditionsShortcuts !== 'undefined' ? DOMHelpersConditionsShortcuts : null;
  }

  // Try to get from global Conditions object
  if (!ConditionsCore && typeof Conditions !== 'undefined') {
    ConditionsCore = Conditions;
  }

  // Verify core module is available
  if (!ConditionsCore) {
    console.error('[Conditions System] conditions-core.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // CONVENIENCE LOADERS
  // ============================================================================

  /**
   * Load all conditions modules
   * Ensures all features are available
   */
  function loadAll() {
    const modules = {
      core: ConditionsCore,
      default: ConditionsDefault,
      collections: ConditionsCollections,
      shortcuts: ConditionsShortcuts
    };

    const loaded = [];
    const missing = [];

    Object.entries(modules).forEach(([name, module]) => {
      if (module) {
        loaded.push(name);
      } else {
        missing.push(name);
      }
    });

    if (missing.length > 0) {
      console.warn(`[Conditions System] Missing modules: ${missing.join(', ')}`);
    }

    console.log(`[Conditions System] Loaded modules: ${loaded.join(', ')}`);

    return {
      loaded,
      missing,
      allLoaded: missing.length === 0
    };
  }

  /**
   * Load only core conditions features
   */
  function loadCore() {
    if (!ConditionsCore) {
      console.error('[Conditions System] Core module not found');
      return false;
    }
    console.log('[Conditions System] Core module loaded');
    return true;
  }

  /**
   * Load default branch support
   */
  function loadDefault() {
    if (!ConditionsDefault) {
      console.warn('[Conditions System] Default module not found');
      return false;
    }
    console.log('[Conditions System] Default branch support loaded');
    return true;
  }

  /**
   * Load collections support
   */
  function loadCollections() {
    if (!ConditionsCollections) {
      console.warn('[Conditions System] Collections module not found');
      return false;
    }
    console.log('[Conditions System] Collections support loaded');
    return true;
  }

  /**
   * Load global shortcuts
   */
  function loadShortcuts() {
    if (!ConditionsShortcuts) {
      console.warn('[Conditions System] Shortcuts module not found');
      return false;
    }
    console.log('[Conditions System] Global shortcuts loaded');
    return true;
  }

  // ============================================================================
  // UNIFIED API
  // ============================================================================

  const api = {
    // ========================================================================
    // MODULE LOADERS
    // ========================================================================

    loadAll,
    loadCore,
    loadDefault,
    loadCollections,
    loadShortcuts,

    // ========================================================================
    // CORE FEATURES (from conditions-core.js)
    // ========================================================================

    // Main methods
    whenState: ConditionsCore.whenState,
    apply: ConditionsCore.apply,
    watch: ConditionsCore.watch,
    batch: ConditionsCore.batch,

    // Extension registration
    registerMatcher: ConditionsCore.registerMatcher,
    registerHandler: ConditionsCore.registerHandler,
    getMatchers: ConditionsCore.getMatchers,
    getHandlers: ConditionsCore.getHandlers,

    // Shared utilities
    matchesCondition: ConditionsCore.matchesCondition,
    applyProperty: ConditionsCore.applyProperty,
    getElements: ConditionsCore.getElements,
    safeArrayFrom: ConditionsCore.safeArrayFrom,

    // Properties
    hasReactivity: ConditionsCore.hasReactivity,
    mode: ConditionsCore.mode,

    // ========================================================================
    // COLLECTIONS FEATURES (from conditions-collections.js)
    // ========================================================================

    whenStateCollection: ConditionsCollections?.whenStateCollection,
    whenCollection: ConditionsCollections?.whenCollection,

    // ========================================================================
    // SHORTCUTS (from conditions-shortcuts.js - if loaded)
    // ========================================================================

    // Note: Shortcuts are exported to global scope directly
    // Access them via: whenState(), whenApply(), registerMatcher(), etc.
    // Or via: Conditions.shortcuts.*

    // ========================================================================
    // MODULE REFERENCES
    // ========================================================================

    modules: {
      core: ConditionsCore,
      default: ConditionsDefault,
      collections: ConditionsCollections,
      shortcuts: ConditionsShortcuts
    },

    // ========================================================================
    // EXTENSIONS METADATA
    // ========================================================================

    extensions: ConditionsCore.extensions || {},

    // ========================================================================
    // VERSION
    // ========================================================================

    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Attach to global Conditions namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Main export
    globalObj.Conditions = api;

    // Ensure shortcuts are available if loaded
    if (ConditionsShortcuts) {
      // Shortcuts module handles its own global exports
      // Just ensure reference is available
      api.shortcuts = ConditionsShortcuts;
    }
  }

  // ============================================================================
  // AUTO-LOAD CHECK
  // ============================================================================

  // Auto-check what's loaded
  const status = loadAll();

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Conditions System] v2.3.1 initialized');
    console.log('[DOM Helpers Conditions System] Available via: Conditions');

    if (status.allLoaded) {
      console.log('[DOM Helpers Conditions System] All modules loaded successfully!');
    } else {
      console.log('[DOM Helpers Conditions System] Partial load - some modules missing');
    }

    console.log('\n[Usage Examples]');
    console.log('  Conditions.whenState(() => state.status, conditions, "#element");');
    console.log('  Conditions.apply("active", conditions, ".items");');
    console.log('  Conditions.whenStateCollection(() => state.size, conditions, ".list");');
    if (ConditionsShortcuts) {
      console.log('  whenState(() => state.status, conditions, "#element"); // Global shortcut');
    }
  }

  return api;
});
