/**
 * DOM Helpers - Reactive System (Unified Entry Point)
 *
 * Complete reactive state management system with Vue/React-like reactivity
 * Single import for all reactive features
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
    global.DOMHelpersReactive = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let ReactiveCore, ReactiveArraySupport, ReactiveCollections, ReactiveForms;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      ReactiveCore = require('./reactive-core.js');
      ReactiveArraySupport = require('./reactive-array-support.js');
      ReactiveCollections = require('./reactive-collections.js');
      ReactiveForms = require('./reactive-forms.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!ReactiveCore) {
    ReactiveCore = typeof DOMHelpersReactiveCore !== 'undefined' ? DOMHelpersReactiveCore : null;
    ReactiveArraySupport = typeof DOMHelpersReactiveArraySupport !== 'undefined' ? DOMHelpersReactiveArraySupport : null;
    ReactiveCollections = typeof DOMHelpersReactiveCollections !== 'undefined' ? DOMHelpersReactiveCollections : null;
    ReactiveForms = typeof DOMHelpersReactiveForms !== 'undefined' ? DOMHelpersReactiveForms : null;
  }

  // Verify core module is available
  if (!ReactiveCore) {
    console.error('[Reactive System] reactive-core.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // CONVENIENCE LOADERS
  // ============================================================================

  /**
   * Load all reactive modules
   * Ensures all features are available
   */
  function loadAll() {
    const modules = {
      core: ReactiveCore,
      arraySupport: ReactiveArraySupport,
      collections: ReactiveCollections,
      forms: ReactiveForms
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
      console.warn(`[Reactive System] Missing modules: ${missing.join(', ')}`);
    }

    console.log(`[Reactive System] Loaded modules: ${loaded.join(', ')}`);

    return {
      loaded,
      missing,
      allLoaded: missing.length === 0
    };
  }

  /**
   * Load only core reactive features
   */
  function loadCore() {
    if (!ReactiveCore) {
      console.error('[Reactive System] Core module not found');
      return false;
    }
    console.log('[Reactive System] Core module loaded');
    return true;
  }

  /**
   * Load array support (makes array mutations reactive)
   */
  function loadArraySupport() {
    if (!ReactiveArraySupport) {
      console.warn('[Reactive System] Array support module not found');
      return false;
    }
    console.log('[Reactive System] Array support loaded');
    return true;
  }

  /**
   * Load collections (reactive array management)
   */
  function loadCollections() {
    if (!ReactiveCollections) {
      console.warn('[Reactive System] Collections module not found');
      return false;
    }
    console.log('[Reactive System] Collections loaded');
    return true;
  }

  /**
   * Load forms (form state management with validation)
   */
  function loadForms() {
    if (!ReactiveForms) {
      console.warn('[Reactive System] Forms module not found');
      return false;
    }
    console.log('[Reactive System] Forms loaded');
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
    loadArraySupport,
    loadCollections,
    loadForms,

    // ========================================================================
    // CORE FEATURES (from reactive-core.js)
    // ========================================================================

    // State creation
    state: ReactiveCore.state,
    createState: ReactiveCore.createState,
    ref: ReactiveCore.ref,
    refs: ReactiveCore.refs,

    // Advanced state
    store: ReactiveCore.store,
    component: ReactiveCore.component,
    reactive: ReactiveCore.reactive,
    async: ReactiveCore.async,

    // Computed & Watch
    computed: ReactiveCore.computed,
    watch: ReactiveCore.watch,

    // Effects
    effect: ReactiveCore.effect,
    effects: ReactiveCore.effects,

    // Bindings
    bindings: ReactiveCore.bindings,

    // Updates
    updateAll: ReactiveCore.updateAll,

    // Utilities
    batch: ReactiveCore.batch,
    isReactive: ReactiveCore.isReactive,
    toRaw: ReactiveCore.toRaw,
    notify: ReactiveCore.notify,
    pause: ReactiveCore.pause,
    resume: ReactiveCore.resume,
    untrack: ReactiveCore.untrack,

    // Shared utilities
    getNestedProperty: ReactiveCore.getNestedProperty,
    setNestedProperty: ReactiveCore.setNestedProperty,
    applyValue: ReactiveCore.applyValue,

    // ========================================================================
    // ARRAY SUPPORT (from reactive-array-support.js)
    // ========================================================================

    patchArray: ReactiveArraySupport?.patchArray,

    // ========================================================================
    // COLLECTIONS (from reactive-collections.js)
    // ========================================================================

    collection: ReactiveCollections?.collection,
    list: ReactiveCollections?.list,
    createCollection: ReactiveCollections?.create,
    createCollectionWithComputed: ReactiveCollections?.createWithComputed,
    createFilteredCollection: ReactiveCollections?.createFiltered,

    // ========================================================================
    // FORMS (from reactive-forms.js)
    // ========================================================================

    form: ReactiveForms?.form,
    createForm: ReactiveForms?.create,
    validators: ReactiveForms?.validators,
    v: ReactiveForms?.v,

    // ========================================================================
    // MODULE REFERENCES
    // ========================================================================

    modules: {
      core: ReactiveCore,
      arraySupport: ReactiveArraySupport,
      collections: ReactiveCollections,
      forms: ReactiveForms
    },

    // ========================================================================
    // VERSION
    // ========================================================================

    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Attach to global Reactive namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Main export
    globalObj.Reactive = api;

    // Legacy compatibility
    if (!globalObj.ReactiveUtils) {
      globalObj.ReactiveUtils = api;
    }
    if (!globalObj.ReactiveState) {
      globalObj.ReactiveState = {
        create: api.state,
        async: api.async,
        collection: api.collection,
        form: api.form
      };
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
    console.log('[DOM Helpers Reactive System] v2.3.1 initialized');
    console.log('[DOM Helpers Reactive System] Available via: Reactive or ReactiveUtils');

    if (status.allLoaded) {
      console.log('[DOM Helpers Reactive System] All modules loaded successfully!');
    } else {
      console.log('[DOM Helpers Reactive System] Partial load - some modules missing');
    }

    console.log('\n[Usage Examples]');
    console.log('  const state = Reactive.state({ count: 0 });');
    console.log('  const todos = Reactive.collection([...]);');
    console.log('  const loginForm = Reactive.form({ email: "", password: "" });');
    console.log('  Reactive.effect(() => console.log(state.count));');
  }

  return api;
});
