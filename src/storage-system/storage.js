/**
 * DOM Helpers - Storage System (Unified Entry Point)
 *
 * Complete Web Storage API wrapper with forms integration.
 * Single import for all storage features.
 *
 * Features:
 * - localStorage and sessionStorage wrappers
 * - Automatic JSON serialization/deserialization
 * - Expiry system for time-based storage
 * - Namespace support
 * - Forms integration (auto-save/restore)
 * - Dual API: shorthand and vanilla-like
 * - Bulk operations
 * - Advanced operations (increment, decrement, toggle)
 *
 * @version 2.0.0
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
    global.DOMHelpersStorage = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let StorageCore, StorageForms;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      StorageCore = require('./storage-core.js');
      StorageForms = require('./storage-forms.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!StorageCore) {
    StorageCore = typeof DOMHelpersStorageCore !== 'undefined' ? DOMHelpersStorageCore : null;
    StorageForms = typeof DOMHelpersStorageForms !== 'undefined' ? DOMHelpersStorageForms : null;
  }

  // Try to get from global Storage object
  if (!StorageCore && typeof Storage !== 'undefined') {
    StorageCore = Storage.core;
    StorageForms = Storage.forms;
  }

  // Verify core module is available
  if (!StorageCore || !StorageCore.StorageHelper) {
    console.error('[Storage System] storage-core.js not found. Please load it first.');
    return {};
  }

  // Get StorageHelper class
  const StorageHelper = StorageCore.StorageHelper;

  // ============================================================================
  // CREATE STORAGE INSTANCES
  // ============================================================================

  // Create localStorage and sessionStorage instances
  const localStorageInstance = new StorageHelper('localStorage');
  const sessionStorageInstance = new StorageHelper('sessionStorage');

  // ============================================================================
  // UNIFIED STORAGE API
  // ============================================================================

  /**
   * Main Storage object (defaults to localStorage)
   * Provides access to localStorage with convenience methods
   */
  const Storage = localStorageInstance;

  // Add session storage
  Storage.session = sessionStorageInstance;
  Storage.local = localStorageInstance;

  // Add utility methods to main Storage object
  Storage.namespace = (name) => localStorageInstance.namespace(name);

  /**
   * Cleanup expired items from both storages
   *
   * @returns {Object} Cleanup results { local, session }
   */
  Storage.cleanup = () => {
    const localCleaned = localStorageInstance.cleanup();
    const sessionCleaned = sessionStorageInstance.cleanup();
    return { local: localCleaned, session: sessionCleaned };
  };

  /**
   * Get statistics from both storages
   *
   * @returns {Object} Stats for both storages { local, session }
   */
  Storage.stats = () => ({
    local: localStorageInstance.stats(),
    session: sessionStorageInstance.stats()
  });

  // ============================================================================
  // MODULE REFERENCES
  // ============================================================================

  Storage.modules = {
    core: StorageCore,
    forms: StorageForms
  };

  // Add core utilities
  if (StorageCore) {
    Storage.core = StorageCore;
    Storage.StorageHelper = StorageHelper;
    Storage.serializeValue = StorageCore.serializeValue;
    Storage.deserializeValue = StorageCore.deserializeValue;
    Storage.isExpired = StorageCore.isExpired;
  }

  // Add forms integration
  if (StorageForms) {
    Storage.forms = StorageForms;
    Storage.enhanceForm = StorageForms.enhanceFormWithStorage;
  }

  // Version
  Storage.version = '2.0.0';

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Export to global
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Note: We're careful not to override the native Storage interface
    // So we export as DOMStorage instead
    globalObj.DOMStorage = Storage;
    globalObj.StorageHelper = StorageHelper;

    // Add to DOMHelpers if it exists
    if (globalObj.DOMHelpers) {
      globalObj.DOMHelpers.Storage = Storage;
      globalObj.DOMHelpers.StorageHelper = StorageHelper;
    }

    // Also add to global Storage namespace if safe
    if (!globalObj.Storage || typeof globalObj.Storage.set === 'undefined') {
      // Safe to add since native Storage doesn't have set() method
      globalObj.Storage = Storage;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Storage System] v2.0.0 initialized');
    console.log('[DOM Helpers Storage System] Available via: Storage or DOMStorage');

    const loaded = [];
    const missing = [];

    if (StorageCore) loaded.push('core');
    else missing.push('core');

    if (StorageForms) loaded.push('forms');
    else missing.push('forms');

    if (loaded.length > 0) {
      console.log(`[DOM Helpers Storage System] Loaded modules: ${loaded.join(', ')}`);
    }

    if (missing.length > 0) {
      console.warn(`[DOM Helpers Storage System] Missing modules: ${missing.join(', ')}`);
    }

    console.log('\n[Usage Examples]');
    console.log('  Storage.set("key", { data: "value" });');
    console.log('  Storage.get("key");');
    console.log('  Storage.set("temp", "value", { expires: 3600 }); // Expires in 1 hour');
    console.log('  const userStorage = Storage.namespace("user");');
    console.log('  Forms.myForm.autoSave("formData");');
  }

  return Storage;
});
