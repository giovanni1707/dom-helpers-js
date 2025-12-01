/**
 * enhancers.js
 *
 * Unified Entry Point - DOM Helpers Enhancers
 * Single entry point for all enhancer modules with flexible loading options
 *
 * Features:
 * - Load all enhancers at once: loadAll(DOMHelpers)
 * - Load specific layers: loadCore(), loadEnhancements(), loadIntegration()
 * - Access to all individual modules
 * - Global shortcut creation and management
 * - Backward compatible with existing code
 *
 * Architecture:
 * - Core Layer: indexed-update-core, element-enhancer-core
 * - Enhancement Layer: bulk-property-updaters, global-query, collection-shortcuts
 * - Integration Layer: collection-shortcuts-enhanced, core-patches, id-shortcut
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
    define([
      './indexed-update-core',
      './element-enhancer-core',
      './bulk-property-updaters',
      './global-query',
      './collection-shortcuts',
      './collection-shortcuts-enhanced',
      './core-patches',
      './id-shortcut'
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS/Node
    module.exports = factory(
      require('./indexed-update-core'),
      require('./element-enhancer-core'),
      require('./bulk-property-updaters'),
      require('./global-query'),
      require('./collection-shortcuts'),
      require('./collection-shortcuts-enhanced'),
      require('./core-patches'),
      require('./id-shortcut')
    );
  } else {
    // Browser globals
    root.Enhancers = factory(
      root.IndexedUpdateCore,
      root.ElementEnhancerCore,
      root.BulkPropertyUpdaters,
      root.GlobalQuery,
      root.CollectionShortcuts,
      root.CollectionShortcutsEnhanced,
      root.CorePatches,
      root.IdShortcut
    );
  }
}(typeof self !== 'undefined' ? self : this, function(
  IndexedUpdateCore,
  ElementEnhancerCore,
  BulkPropertyUpdaters,
  GlobalQuery,
  CollectionShortcuts,
  CollectionShortcutsEnhanced,
  CorePatches,
  IdShortcut
) {
  'use strict';

  // ========================================================================
  // GLOBAL REFERENCE
  // ========================================================================

  const global = typeof window !== 'undefined' ? window :
                 typeof global !== 'undefined' ? global :
                 typeof self !== 'undefined' ? self : {};

  // ========================================================================
  // STATE TRACKING
  // ========================================================================

  let state = {
    coreLoaded: false,
    enhancementsLoaded: false,
    integrationLoaded: false,
    globalsCreated: false
  };

  // ========================================================================
  // CORE LAYER LOADING
  // ========================================================================

  /**
   * Load core modules (indexed-update-core, element-enhancer-core)
   * These provide the foundational logic for all other modules
   *
   * @returns {Object} Core modules
   */
  function loadCore() {
    if (state.coreLoaded) {
      console.info('[Enhancers] Core modules already loaded');
      return { IndexedUpdateCore, ElementEnhancerCore };
    }

    // Core modules are loaded via imports, just mark as loaded
    state.coreLoaded = true;

    console.log('[Enhancers] Core modules loaded');
    return { IndexedUpdateCore, ElementEnhancerCore };
  }

  // ========================================================================
  // ENHANCEMENT LAYER LOADING
  // ========================================================================

  /**
   * Load enhancement modules (bulk-property-updaters, global-query, collection-shortcuts)
   * These add convenient features to DOM Helpers
   *
   * @param {Object} DOMHelpers - Optional DOMHelpers object with Elements/Collections
   * @returns {Object} Enhancement modules
   */
  function loadEnhancements(DOMHelpers) {
    if (state.enhancementsLoaded) {
      console.info('[Enhancers] Enhancement modules already loaded');
      return { BulkPropertyUpdaters, GlobalQuery, CollectionShortcuts };
    }

    // Get helpers from DOMHelpers or global
    const Elements = DOMHelpers?.Elements || global.Elements;
    const Collections = DOMHelpers?.Collections || global.Collections;

    // Initialize bulk property updaters
    if (BulkPropertyUpdaters && Elements) {
      BulkPropertyUpdaters.enhanceElementsHelper(Elements);
      if (Collections) {
        BulkPropertyUpdaters.enhanceCollectionsHelper(Collections);
      }
    }

    // Collection shortcuts are loaded via imports
    // They auto-initialize when Collections is available

    // Global query functions are loaded via imports
    // They work standalone

    state.enhancementsLoaded = true;

    console.log('[Enhancers] Enhancement modules loaded');
    return { BulkPropertyUpdaters, GlobalQuery, CollectionShortcuts };
  }

  // ========================================================================
  // INTEGRATION LAYER LOADING
  // ========================================================================

  /**
   * Load integration modules (collection-shortcuts-enhanced, core-patches, id-shortcut)
   * These patch and enhance existing helpers with advanced features
   *
   * @param {Object} DOMHelpers - Optional DOMHelpers object with helpers
   * @returns {Object} Integration modules
   */
  function loadIntegration(DOMHelpers) {
    if (state.integrationLoaded) {
      console.info('[Enhancers] Integration modules already loaded');
      return { CollectionShortcutsEnhanced, CorePatches, IdShortcut };
    }

    // Get helpers from DOMHelpers or global
    const Elements = DOMHelpers?.Elements || global.Elements;
    const Collections = DOMHelpers?.Collections || global.Collections;
    const Selector = DOMHelpers?.Selector || global.Selector;

    // Patch core helpers
    if (CorePatches) {
      if (Collections) {
        CorePatches.patchCollectionsHelper(Collections);
      }
      if (Selector) {
        CorePatches.patchSelectorHelper(Selector);
      }
    }

    // Enhance collection shortcuts
    if (CollectionShortcutsEnhanced && CollectionShortcuts) {
      const enhanced = CollectionShortcutsEnhanced.enhanceCollectionShortcuts(
        CollectionShortcuts.ClassName,
        CollectionShortcuts.TagName,
        CollectionShortcuts.Name
      );

      // Update global references
      if (enhanced.ClassName) global.ClassName = enhanced.ClassName;
      if (enhanced.TagName) global.TagName = enhanced.TagName;
      if (enhanced.Name) global.Name = enhanced.Name;
    }

    // Id shortcut is loaded via imports
    // It auto-initializes when Elements is available

    state.integrationLoaded = true;

    console.log('[Enhancers] Integration modules loaded');
    return { CollectionShortcutsEnhanced, CorePatches, IdShortcut };
  }

  // ========================================================================
  // GLOBAL SHORTCUTS CREATION
  // ========================================================================

  /**
   * Create global shortcuts (ClassName, TagName, Name, Id, querySelector, etc.)
   * Makes enhancers easily accessible from global scope
   */
  function createGlobalShortcuts() {
    if (state.globalsCreated) {
      console.info('[Enhancers] Global shortcuts already created');
      return;
    }

    // Collection shortcuts
    if (CollectionShortcuts) {
      if (CollectionShortcuts.ClassName) global.ClassName = CollectionShortcuts.ClassName;
      if (CollectionShortcuts.TagName) global.TagName = CollectionShortcuts.TagName;
      if (CollectionShortcuts.Name) global.Name = CollectionShortcuts.Name;
    }

    // Id shortcut
    if (IdShortcut) {
      global.Id = IdShortcut;
    }

    // Global query functions
    if (GlobalQuery) {
      global.querySelector = GlobalQuery.querySelector;
      global.querySelectorAll = GlobalQuery.querySelectorAll;
      global.query = GlobalQuery.query;
      global.queryAll = GlobalQuery.queryAll;
      global.queryWithin = GlobalQuery.queryWithin;
      global.queryAllWithin = GlobalQuery.queryAllWithin;
    }

    state.globalsCreated = true;

    console.log('[Enhancers] Global shortcuts created');
  }

  // ========================================================================
  // UNIFIED LOADING
  // ========================================================================

  /**
   * Load all enhancer modules at once
   * Convenience method that loads core, enhancements, and integration
   *
   * @param {Object} DOMHelpers - DOMHelpers object with Elements/Collections/Selector
   * @returns {Object} All loaded modules
   *
   * @example
   * import DOMHelpers from './modules/dom-helpers.js';
   * import Enhancers from './enhancers/enhancers.js';
   * Enhancers.loadAll(DOMHelpers);
   */
  function loadAll(DOMHelpers) {
    console.log('[Enhancers] Loading all modules...');

    const core = loadCore();
    const enhancements = loadEnhancements(DOMHelpers);
    const integration = loadIntegration(DOMHelpers);
    createGlobalShortcuts();

    console.log('[Enhancers] All modules loaded successfully');

    return {
      ...core,
      ...enhancements,
      ...integration
    };
  }

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  /**
   * Get current loading state
   * @returns {Object} State object
   */
  function getState() {
    return { ...state };
  }

  /**
   * Check if all modules are loaded
   * @returns {boolean}
   */
  function isFullyLoaded() {
    return state.coreLoaded &&
           state.enhancementsLoaded &&
           state.integrationLoaded &&
           state.globalsCreated;
  }

  /**
   * Get module versions
   * @returns {Object} Version information
   */
  function getVersions() {
    return {
      enhancers: '2.3.1',
      IndexedUpdateCore: IndexedUpdateCore?.version,
      ElementEnhancerCore: ElementEnhancerCore?.version,
      BulkPropertyUpdaters: BulkPropertyUpdaters?.version,
      GlobalQuery: GlobalQuery?.version,
      CollectionShortcuts: CollectionShortcuts?.version,
      CollectionShortcutsEnhanced: CollectionShortcutsEnhanced?.version,
      CorePatches: CorePatches?.version,
      IdShortcut: IdShortcut?.version
    };
  }

  /**
   * Reset state (for testing)
   */
  function reset() {
    state = {
      coreLoaded: false,
      enhancementsLoaded: false,
      integrationLoaded: false,
      globalsCreated: false
    };
  }

  // ========================================================================
  // PUBLIC API
  // ========================================================================

  const Enhancers = {
    // Version
    version: '2.3.1',

    // Core modules
    IndexedUpdateCore: IndexedUpdateCore,
    ElementEnhancerCore: ElementEnhancerCore,

    // Enhancement modules
    BulkPropertyUpdaters: BulkPropertyUpdaters,
    GlobalQuery: GlobalQuery,
    CollectionShortcuts: CollectionShortcuts,

    // Integration modules
    CollectionShortcutsEnhanced: CollectionShortcutsEnhanced,
    CorePatches: CorePatches,
    IdShortcut: IdShortcut,

    // Loading functions
    loadAll: loadAll,
    loadCore: loadCore,
    loadEnhancements: loadEnhancements,
    loadIntegration: loadIntegration,
    createGlobalShortcuts: createGlobalShortcuts,

    // Utilities
    getState: getState,
    isFullyLoaded: isFullyLoaded,
    getVersions: getVersions,
    reset: reset,

    // Global shortcut references (populated after loading)
    get ClassName() { return global.ClassName; },
    get TagName() { return global.TagName; },
    get Name() { return global.Name; },
    get Id() { return global.Id; },
    get querySelector() { return global.querySelector; },
    get querySelectorAll() { return global.querySelectorAll; },
    get query() { return global.query; },
    get queryAll() { return global.queryAll; },
    get queryWithin() { return global.queryWithin; },
    get queryAllWithin() { return global.queryAllWithin; }
  };

  // Add to DOMHelpers if available
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.Enhancers = Enhancers;
  }

  return Enhancers;
}));
