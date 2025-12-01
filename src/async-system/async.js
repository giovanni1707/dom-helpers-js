/**
 * DOM Helpers - Async System (Unified Entry Point)
 *
 * Complete async utilities system with DOM Helpers integration.
 * Single import for all async features.
 *
 * Features:
 * - Debounce & throttle utilities
 * - Enhanced fetch with retries and timeout
 * - Form validation and async handlers
 * - Input sanitization
 * - Parallel request management
 * - Full DOM Helpers integration
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
    global.DOMHelpersAsync = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let AsyncCore, AsyncFetch, AsyncForms;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      AsyncCore = require('./async-core.js');
      AsyncFetch = require('./async-fetch.js');
      AsyncForms = require('./async-forms.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!AsyncCore) {
    AsyncCore = typeof DOMHelpersAsyncCore !== 'undefined' ? DOMHelpersAsyncCore : null;
    AsyncFetch = typeof DOMHelpersAsyncFetch !== 'undefined' ? DOMHelpersAsyncFetch : null;
    AsyncForms = typeof DOMHelpersAsyncForms !== 'undefined' ? DOMHelpersAsyncForms : null;
  }

  // Try to get from global AsyncHelpers object
  if (!AsyncCore && typeof AsyncHelpers !== 'undefined') {
    AsyncCore = AsyncHelpers.core;
    AsyncFetch = AsyncHelpers.fetch;
    AsyncForms = AsyncHelpers.forms;
  }

  // Verify core module is available
  if (!AsyncCore) {
    console.error('[Async System] async-core.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // UNIFIED API
  // ============================================================================

  const AsyncModule = {
    // Core utilities
    debounce: AsyncCore.debounce,
    throttle: AsyncCore.throttle,
    sanitize: AsyncCore.sanitize,
    sleep: AsyncCore.sleep,
    parallelAll: AsyncCore.parallelAll,
    raceWithTimeout: AsyncCore.raceWithTimeout,

    // Fetch utilities (if available)
    fetch: AsyncFetch?.enhancedFetch || AsyncFetch?.fetch,
    enhancedFetch: AsyncFetch?.enhancedFetch || AsyncFetch?.fetch,
    fetchJSON: AsyncFetch?.fetchJSON,
    fetchText: AsyncFetch?.fetchText,
    fetchBlob: AsyncFetch?.fetchBlob,

    // Form utilities (if available)
    asyncHandler: AsyncForms?.asyncHandler,
    validateForm: AsyncForms?.validateForm,
    getFormData: AsyncForms?.getFormData,
    showFormMessage: AsyncForms?.showFormMessage,

    // Module references
    modules: {
      core: AsyncCore,
      fetch: AsyncFetch,
      forms: AsyncForms
    },

    // Configuration
    config: {},

    /**
     * Configure default options
     */
    configure: (options = {}) => {
      const {
        debounceDelay = 300,
        throttleDelay = 200,
        fetchTimeout = 10000,
        fetchRetries = 0
      } = options;

      AsyncModule.config = {
        debounceDelay,
        throttleDelay,
        fetchTimeout,
        fetchRetries
      };

      return AsyncModule;
    },

    /**
     * Check if DOM Helpers is available
     */
    isDOMHelpersAvailable() {
      const globalObj = typeof window !== 'undefined' ? window : global;
      return !!(globalObj.Elements || globalObj.Collections || globalObj.Selector);
    },

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // DOM HELPERS INTEGRATION
  // ============================================================================

  /**
   * Integrate with DOM Helpers Elements, Collections, and Selector
   */
  function integrateWithDOMHelpers() {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Extend Elements if available
    if (globalObj.Elements) {
      Object.assign(globalObj.Elements, {
        debounce: AsyncCore.debounce,
        throttle: AsyncCore.throttle,
        sanitize: AsyncCore.sanitize,
        sleep: AsyncCore.sleep,
        fetch: AsyncFetch?.enhancedFetch || AsyncFetch?.fetch,
        fetchJSON: AsyncFetch?.fetchJSON,
        fetchText: AsyncFetch?.fetchText,
        fetchBlob: AsyncFetch?.fetchBlob,
        asyncHandler: AsyncForms?.asyncHandler,
        validateForm: AsyncForms?.validateForm,
        getFormData: AsyncForms?.getFormData,
        showFormMessage: AsyncForms?.showFormMessage,
        parallelAll: AsyncCore.parallelAll,
        raceWithTimeout: AsyncCore.raceWithTimeout
      });

      // Add form-specific methods to form elements
      if (globalObj.Elements.helper && globalObj.Elements.helper._enhanceElementWithUpdate) {
        const originalEnhance = globalObj.Elements.helper._enhanceElementWithUpdate;
        globalObj.Elements.helper._enhanceElementWithUpdate = function(element) {
          const enhanced = originalEnhance.call(this, element);

          if (enhanced && enhanced.tagName === 'FORM' && AsyncForms) {
            // Add form-specific methods
            enhanced.validate = function(rules) {
              return AsyncForms.validateForm(this, rules);
            };

            enhanced.getData = function(options) {
              return AsyncForms.getFormData(this, options);
            };

            enhanced.showMessage = function(message, type, options) {
              return AsyncForms.showFormMessage(this, message, type, options);
            };

            enhanced.submitAsync = function(options = {}) {
              const {
                validate: shouldValidate = true,
                validationRules = {},
                onSuccess = null,
                onError = null,
                ...fetchOptions
              } = options;

              return AsyncForms.asyncHandler(async (e) => {
                e.preventDefault();

                // Validate if required
                if (shouldValidate) {
                  const validation = this.validate(validationRules);
                  if (!validation.isValid) {
                    const errorMessage = validation.errors.join(', ');
                    this.showMessage(errorMessage, 'error');
                    return;
                  }
                }

                // Get form data
                const data = this.getData();

                // Submit
                const result = await (AsyncFetch?.enhancedFetch || AsyncFetch?.fetch)(
                  this.action || window.location.href,
                  {
                    method: this.method || 'POST',
                    body: data,
                    onSuccess,
                    onError,
                    ...fetchOptions
                  }
                );

                return result;
              }).call(enhanced);
            };
          }

          return enhanced;
        };
      }
    }

    // Extend Collections if available
    if (globalObj.Collections) {
      Object.assign(globalObj.Collections, {
        debounce: AsyncCore.debounce,
        throttle: AsyncCore.throttle,
        sanitize: AsyncCore.sanitize,
        sleep: AsyncCore.sleep,
        fetch: AsyncFetch?.enhancedFetch || AsyncFetch?.fetch,
        fetchJSON: AsyncFetch?.fetchJSON,
        fetchText: AsyncFetch?.fetchText,
        fetchBlob: AsyncFetch?.fetchBlob,
        asyncHandler: AsyncForms?.asyncHandler,
        parallelAll: AsyncCore.parallelAll,
        raceWithTimeout: AsyncCore.raceWithTimeout
      });
    }

    // Extend Selector if available
    if (globalObj.Selector) {
      Object.assign(globalObj.Selector, {
        debounce: AsyncCore.debounce,
        throttle: AsyncCore.throttle,
        sanitize: AsyncCore.sanitize,
        sleep: AsyncCore.sleep,
        fetch: AsyncFetch?.enhancedFetch || AsyncFetch?.fetch,
        fetchJSON: AsyncFetch?.fetchJSON,
        fetchText: AsyncFetch?.fetchText,
        fetchBlob: AsyncFetch?.fetchBlob,
        asyncHandler: AsyncForms?.asyncHandler,
        parallelAll: AsyncCore.parallelAll,
        raceWithTimeout: AsyncCore.raceWithTimeout
      });
    }
  }

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  function autoInit() {
    integrateWithDOMHelpers();

    // Log integration success
    if (AsyncModule.isDOMHelpersAvailable()) {
      console.log('[Async System] Successfully integrated with DOM Helpers ecosystem');
    }
  }

  // Run auto-init when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoInit, 100); // Small delay to ensure Elements is ready
      });
    } else {
      setTimeout(autoInit, 100); // Small delay to ensure Elements is ready
    }
  }

  // Force immediate integration attempt
  integrateWithDOMHelpers();

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Export to global
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    globalObj.AsyncHelpers = AsyncModule;

    // Also make individual utilities available globally for convenience
    globalObj.debounce = AsyncCore.debounce;
    globalObj.throttle = AsyncCore.throttle;
    globalObj.sanitize = AsyncCore.sanitize;

    // Add to DOMHelpers if it exists
    if (globalObj.DOMHelpers) {
      globalObj.DOMHelpers.Async = AsyncModule;
      globalObj.DOMHelpers.AsyncHelpers = AsyncModule;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Async System] v2.0.0 initialized');
    console.log('[DOM Helpers Async System] Available via: AsyncHelpers');

    const loaded = [];
    const missing = [];

    if (AsyncCore) loaded.push('core');
    else missing.push('core');

    if (AsyncFetch) loaded.push('fetch');
    else missing.push('fetch');

    if (AsyncForms) loaded.push('forms');
    else missing.push('forms');

    if (loaded.length > 0) {
      console.log(`[DOM Helpers Async System] Loaded modules: ${loaded.join(', ')}`);
    }

    if (missing.length > 0) {
      console.warn(`[DOM Helpers Async System] Missing modules: ${missing.join(', ')}`);
    }

    console.log('\n[Usage Examples]');
    console.log('  const debouncedFn = AsyncHelpers.debounce(() => console.log("Hi"), 300);');
    console.log('  const data = await AsyncHelpers.fetch("/api/data");');
    console.log('  const validation = AsyncHelpers.validateForm(form, rules);');
  }

  return AsyncModule;
});
