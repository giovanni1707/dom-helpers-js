/**
 * DOM Helpers - Main Integration Module
 *
 * Unified API that imports and combines all DOM Helper modules:
 * - UpdateUtility: Core update functionality
 * - Elements: Single element operations
 * - Collections: Element collection operations
 * - Selector: CSS selector-based operations
 * - createElement: Enhanced element creation
 *
 * Provides global methods for:
 * - Configuration management across all helpers
 * - Statistics gathering from all helpers
 * - Cache clearing across all helpers
 * - Lifecycle management (destroy, cleanup)
 * - createElement enhancement control
 *
 * @module dom-helpers
 * @version 2.3.1
 */

(function (root, factory) {
  'use strict';

  // UMD wrapper for multiple module systems
  if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.js/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    const exports = factory();
    root.DOMHelpers = exports.DOMHelpers;

    // Also expose individual helpers to global
    root.Elements = exports.Elements;
    root.Collections = exports.Collections;
    root.Selector = exports.Selector;
    root.ProductionElementsHelper = exports.ProductionElementsHelper;
    root.ProductionCollectionHelper = exports.ProductionCollectionHelper;
    root.ProductionSelectorHelper = exports.ProductionSelectorHelper;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  'use strict';

  // ===== MODULE IMPORTS =====

  let UpdateUtility, ElementsModule, CollectionsModule, SelectorModule, CreateElementModule;
  let Elements, Collections, Selector, createElement, createElementsBulk;
  let ProductionElementsHelper, ProductionCollectionHelper, ProductionSelectorHelper;

  // CommonJS/Node.js environment
  if (typeof require !== 'undefined') {
    try {
      UpdateUtility = require('./update-utility.js');
      ElementsModule = require('./elements-helper.js');
      CollectionsModule = require('./collections-helper.js');
      SelectorModule = require('./selector-helper.js');
      CreateElementModule = require('./create-element.js');

      // Extract exports
      Elements = ElementsModule.Elements;
      Collections = CollectionsModule.Collections;
      Selector = SelectorModule.Selector;
      ProductionElementsHelper = ElementsModule.ProductionElementsHelper;
      ProductionCollectionHelper = CollectionsModule.ProductionCollectionHelper;
      ProductionSelectorHelper = SelectorModule.ProductionSelectorHelper;
      createElement = CreateElementModule.createElement;
      createElementsBulk = CreateElementModule.createElementsBulk || CreateElementModule.bulk;
    } catch (e) {
      console.warn('[DOM Helpers] Failed to require modules:', e.message);
    }
  }

  // Browser environment - check global scope
  if (typeof window !== 'undefined') {
    UpdateUtility = UpdateUtility || window.DOMHelpersUpdateUtility;
    Elements = Elements || window.Elements;
    Collections = Collections || window.Collections;
    Selector = Selector || window.Selector;
    ProductionElementsHelper = ProductionElementsHelper || window.ProductionElementsHelper;
    ProductionCollectionHelper = ProductionCollectionHelper || window.ProductionCollectionHelper;
    ProductionSelectorHelper = ProductionSelectorHelper || window.ProductionSelectorHelper;

    // Try to get createElement from the module or DOMHelpers namespace
    if (window.DOMHelpersCreateElement) {
      createElement = createElement || window.DOMHelpersCreateElement.createElement;
      createElementsBulk = createElementsBulk || window.DOMHelpersCreateElement.createElementsBulk || window.DOMHelpersCreateElement.bulk;
    }
  }

  // ===== STORAGE FOR ORIGINAL createElement =====
  let originalCreateElement = null;
  let enhancedCreateElement = null;
  let enhancementEnabled = false;

  // Store original createElement if available
  if (typeof document !== 'undefined' && document.createElement) {
    originalCreateElement = document.createElement;
  }

  // ===== CREATE ENHANCED createElement WRAPPER =====
  /**
   * Creates an enhanced version of createElement that auto-enhances elements
   * This wraps the native document.createElement with UpdateUtility enhancement
   */
  function createEnhancedCreateElement() {
    if (!originalCreateElement) return null;

    return function enhancedCreateElementWrapper(tagName, options) {
      // Call original createElement
      const element = originalCreateElement.call(document, tagName, options);

      // Try to enhance the element
      try {
        if (UpdateUtility && typeof UpdateUtility.enhanceElementWithUpdate === 'function') {
          return UpdateUtility.enhanceElementWithUpdate(element);
        } else if (typeof window !== 'undefined' &&
                   typeof window.EnhancedUpdateUtility !== 'undefined' &&
                   window.EnhancedUpdateUtility.enhanceElementWithUpdate) {
          return window.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
        } else if (typeof enhanceElementWithUpdate === 'function') {
          return enhanceElementWithUpdate(element);
        }
      } catch (error) {
        console.warn('[DOM Helpers] Failed to enhance createElement:', error.message);
      }

      return element;
    };
  }

  // ===== COMBINED API OBJECT =====
  const DOMHelpers = {
    // Individual helper modules
    Elements: Elements,
    Collections: Collections,
    Selector: Selector,

    // Helper classes (for advanced usage)
    ProductionElementsHelper: ProductionElementsHelper,
    ProductionCollectionHelper: ProductionCollectionHelper,
    ProductionSelectorHelper: ProductionSelectorHelper,

    // createElement functions (if available)
    createElement: createElement,
    createElementsBulk: createElementsBulk,
    bulk: createElementsBulk, // Alias

    // Library version
    version: '2.3.1',

    /**
     * Check if all core helpers are available and ready
     * @returns {boolean} True if Elements, Collections, and Selector are available
     */
    isReady() {
      return !!(this.Elements && this.Collections && this.Selector);
    },

    /**
     * Get combined statistics from all helpers
     * @returns {Object} Statistics object with elements, collections, and selector stats
     */
    getStats() {
      const stats = {};

      if (this.Elements && typeof this.Elements.stats === 'function') {
        stats.elements = this.Elements.stats();
      }

      if (this.Collections && typeof this.Collections.stats === 'function') {
        stats.collections = this.Collections.stats();
      }

      if (this.Selector && typeof this.Selector.stats === 'function') {
        stats.selector = this.Selector.stats();
      }

      return stats;
    },

    /**
     * Clear all caches across all helpers
     * Useful for memory management or when DOM structure changes significantly
     */
    clearAll() {
      if (this.Elements && typeof this.Elements.clear === 'function') {
        this.Elements.clear();
      }

      if (this.Collections && typeof this.Collections.clear === 'function') {
        this.Collections.clear();
      }

      if (this.Selector && typeof this.Selector.clear === 'function') {
        this.Selector.clear();
      }

      return this;
    },

    /**
     * Destroy all helpers and clean up resources
     * Clears caches, removes event listeners, and resets state
     */
    destroyAll() {
      if (this.Elements && typeof this.Elements.destroy === 'function') {
        this.Elements.destroy();
      }

      if (this.Collections && typeof this.Collections.destroy === 'function') {
        this.Collections.destroy();
      }

      if (this.Selector && typeof this.Selector.destroy === 'function') {
        this.Selector.destroy();
      }

      // Disable createElement enhancement if active
      if (enhancementEnabled) {
        this.disableCreateElementEnhancement();
      }

      return this;
    },

    /**
     * Configure all helpers at once
     * Supports both global configuration and per-helper overrides
     *
     * @param {Object} options - Configuration options
     * @param {Object} [options.elements] - Element helper specific options
     * @param {Object} [options.collections] - Collection helper specific options
     * @param {Object} [options.selector] - Selector helper specific options
     * @returns {Object} DOMHelpers object for chaining
     *
     * @example
     * // Global configuration (applies to all helpers)
     * DOMHelpers.configure({
     *   enableCache: true,
     *   enableLogging: false
     * });
     *
     * @example
     * // Per-helper configuration
     * DOMHelpers.configure({
     *   elements: { enableCache: true, maxCacheSize: 100 },
     *   collections: { enableCache: false },
     *   selector: { enableCache: true, enableLogging: true }
     * });
     */
    configure(options = {}) {
      // Configure Elements helper
      if (this.Elements && typeof this.Elements.configure === 'function') {
        this.Elements.configure(options.elements || options);
      }

      // Configure Collections helper
      if (this.Collections && typeof this.Collections.configure === 'function') {
        this.Collections.configure(options.collections || options);
      }

      // Configure Selector helper
      if (this.Selector && typeof this.Selector.configure === 'function') {
        this.Selector.configure(options.selector || options);
      }

      return this;
    },

    /**
     * Enable automatic createElement enhancement
     * Makes document.createElement automatically add .update() method to all created elements
     *
     * WARNING: This modifies the native document.createElement method.
     * Only enable if you want ALL created elements to be enhanced automatically.
     *
     * @returns {Object} DOMHelpers object for chaining
     *
     * @example
     * DOMHelpers.enableCreateElementEnhancement();
     *
     * // Now all elements created with document.createElement have .update()
     * const div = document.createElement('div');
     * div.update({ textContent: 'Hello', style: { color: 'red' } });
     */
    enableCreateElementEnhancement() {
      if (!originalCreateElement) {
        console.warn('[DOM Helpers] document.createElement not available');
        return this;
      }

      if (enhancementEnabled) {
        console.warn('[DOM Helpers] createElement enhancement already enabled');
        return this;
      }

      // Create enhanced version if not already created
      if (!enhancedCreateElement) {
        enhancedCreateElement = createEnhancedCreateElement();
      }

      if (!enhancedCreateElement) {
        console.warn('[DOM Helpers] Failed to create enhanced createElement');
        return this;
      }

      // Replace native createElement with enhanced version
      try {
        document.createElement = enhancedCreateElement;
        enhancementEnabled = true;

        if (console.log) {
          console.log('[DOM Helpers] createElement enhancement enabled');
        }
      } catch (error) {
        console.error('[DOM Helpers] Failed to enable createElement enhancement:', error.message);
      }

      return this;
    },

    /**
     * Disable automatic createElement enhancement
     * Restores the original document.createElement behavior
     *
     * @returns {Object} DOMHelpers object for chaining
     *
     * @example
     * DOMHelpers.disableCreateElementEnhancement();
     *
     * // Now document.createElement works normally again
     * const div = document.createElement('div');
     * // div.update() is NOT available
     */
    disableCreateElementEnhancement() {
      if (!originalCreateElement) {
        console.warn('[DOM Helpers] document.createElement not available');
        return this;
      }

      if (!enhancementEnabled) {
        console.warn('[DOM Helpers] createElement enhancement not enabled');
        return this;
      }

      // Restore original createElement
      try {
        document.createElement = originalCreateElement;
        enhancementEnabled = false;

        if (console.log) {
          console.log('[DOM Helpers] createElement enhancement disabled');
        }
      } catch (error) {
        console.error('[DOM Helpers] Failed to disable createElement enhancement:', error.message);
      }

      return this;
    },

    /**
     * Check if createElement enhancement is currently enabled
     * @returns {boolean} True if enhancement is active
     */
    isCreateElementEnhanced() {
      return enhancementEnabled;
    },

    /**
     * Get information about the current state of DOM Helpers
     * @returns {Object} State information
     */
    getInfo() {
      return {
        version: this.version,
        ready: this.isReady(),
        createElementEnhanced: enhancementEnabled,
        availableHelpers: {
          Elements: !!this.Elements,
          Collections: !!this.Collections,
          Selector: !!this.Selector,
          createElement: !!this.createElement,
          UpdateUtility: !!UpdateUtility
        },
        stats: this.getStats()
      };
    },

    /**
     * Print diagnostic information to console
     * Useful for debugging and verifying setup
     */
    debug() {
      const info = this.getInfo();
      console.group('[DOM Helpers] Debug Information');
      console.log('Version:', info.version);
      console.log('Ready:', info.ready);
      console.log('createElement Enhanced:', info.createElementEnhanced);
      console.log('Available Helpers:', info.availableHelpers);
      console.log('Statistics:', info.stats);
      console.groupEnd();
      return info;
    }
  };

  // ===== AUTO-CLEANUP ON PAGE UNLOAD =====
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      DOMHelpers.destroyAll();
    });
  }

  // ===== EXPORTS =====
  return {
    // Main combined API
    DOMHelpers,

    // Individual helpers for direct access
    Elements,
    Collections,
    Selector,

    // Helper classes
    ProductionElementsHelper,
    ProductionCollectionHelper,
    ProductionSelectorHelper,

    // createElement functions
    createElement,
    createElementsBulk,

    // UpdateUtility (if available)
    UpdateUtility,

    // Version
    version: '2.3.1'
  };
}));
