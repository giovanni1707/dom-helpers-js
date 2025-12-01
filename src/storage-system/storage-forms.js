/**
 * DOM Helpers - Storage Forms Integration Module
 *
 * Forms integration for auto-save and restore functionality.
 * Connects DOM forms with storage for persistent form data.
 *
 * Features:
 * - Auto-save form values on input/change
 * - Restore saved form values
 * - Clear saved form data
 * - Configurable storage (localStorage/sessionStorage)
 * - Namespace support
 * - Debounced saves
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
    global.DOMHelpersStorageForms = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  // Check for Storage.core or fallback to global
  let StorageHelper;

  // Try to get StorageHelper from global
  if (typeof window !== 'undefined') {
    StorageHelper = window.StorageHelper || window.Storage?.core?.StorageHelper;
  } else if (typeof global !== 'undefined') {
    StorageHelper = global.StorageHelper || global.Storage?.core?.StorageHelper;
  }

  if (!StorageHelper) {
    console.error('[Storage Forms] StorageHelper not found. Please load storage-core.js first.');
    return {};
  }

  // ============================================================================
  // FORM ENHANCEMENT
  // ============================================================================

  /**
   * Enhance a form with storage integration methods
   *
   * @param {HTMLFormElement} form - Form element
   * @returns {HTMLFormElement} Enhanced form
   */
  function enhanceFormWithStorage(form) {
    if (!form || form._hasStorageIntegration) {
      return form;
    }

    /**
     * Auto-save form values to storage
     *
     * @param {string} storageKey - Key to store values under
     * @param {Object} options - Configuration options
     * @returns {HTMLFormElement} Form element for chaining
     */
    form.autoSave = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        interval = 1000,
        events = ['input', 'change'],
        namespace = '',
        expires = null
      } = options;

      // Get storage instance
      let storageHelper;
      if (typeof window !== 'undefined' && window.Storage) {
        if (namespace) {
          storageHelper = (storage === 'sessionStorage' ?
            window.Storage.session : window.Storage).namespace(namespace);
        } else {
          storageHelper = storage === 'sessionStorage' ?
            window.Storage.session : window.Storage;
        }
      } else {
        // Fallback: create new instance
        storageHelper = new StorageHelper(storage, namespace);
      }

      // Save current form values
      const saveValues = () => {
        // Get form values
        let values = {};
        if (form.values) {
          // Use enhanced form.values if available
          values = form.values;
        } else {
          // Fallback to FormData
          const formData = new FormData(form);
          for (const [name, value] of formData.entries()) {
            values[name] = value;
          }
        }

        // Store with optional expiry
        const storeOptions = expires ? { expires } : {};
        storageHelper.set(storageKey, values, storeOptions);
      };

      // Set up auto-save listeners
      events.forEach(eventType => {
        form.addEventListener(eventType, () => {
          clearTimeout(form._autoSaveTimeout);
          form._autoSaveTimeout = setTimeout(saveValues, interval);
        });
      });

      // Initial save
      saveValues();

      // Store reference for cleanup
      form._autoSaveKey = storageKey;
      form._autoSaveStorage = storageHelper;

      return form;
    };

    /**
     * Restore form values from storage
     *
     * @param {string} storageKey - Key where values are stored
     * @param {Object} options - Configuration options
     * @returns {HTMLFormElement} Form element for chaining
     */
    form.restore = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        namespace = '',
        clearAfterRestore = false
      } = options;

      // Get storage instance
      let storageHelper;
      if (typeof window !== 'undefined' && window.Storage) {
        if (namespace) {
          storageHelper = (storage === 'sessionStorage' ?
            window.Storage.session : window.Storage).namespace(namespace);
        } else {
          storageHelper = storage === 'sessionStorage' ?
            window.Storage.session : window.Storage;
        }
      } else {
        // Fallback: create new instance
        storageHelper = new StorageHelper(storage, namespace);
      }

      const savedValues = storageHelper.get(storageKey);

      if (savedValues) {
        // Set form values
        if (form.values) {
          // Use enhanced form.values if available
          form.values = savedValues;
        } else {
          // Fallback: set values manually
          Object.entries(savedValues).forEach(([name, value]) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field) {
              if (field.type === 'checkbox') {
                field.checked = Boolean(value);
              } else if (field.type === 'radio') {
                if (field.value === String(value)) {
                  field.checked = true;
                }
              } else {
                field.value = value;
              }
            }
          });
        }

        if (clearAfterRestore) {
          storageHelper.remove(storageKey);
        }
      }

      return form;
    };

    /**
     * Clear auto-saved form data
     *
     * @returns {HTMLFormElement} Form element for chaining
     */
    form.clearAutoSave = function() {
      if (form._autoSaveTimeout) {
        clearTimeout(form._autoSaveTimeout);
      }
      if (form._autoSaveKey && form._autoSaveStorage) {
        form._autoSaveStorage.remove(form._autoSaveKey);
      }
      return form;
    };

    // Mark as having storage integration
    Object.defineProperty(form, '_hasStorageIntegration', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    return form;
  }

  // ============================================================================
  // FORMS INTEGRATION
  // ============================================================================

  /**
   * Add storage integration to Forms helper
   * Intercepts form access to enhance with storage methods
   */
  function addFormsIntegration() {
    // Check if Forms is available
    if (typeof window === 'undefined' || !window.Forms) {
      console.log('[Storage Forms] Forms not available, skipping integration');
      return;
    }

    const Forms = window.Forms;

    // Check if Forms helper exists
    if (!Forms.helper || typeof Forms.helper._enhanceForm !== 'function') {
      console.warn('[Storage Forms] Forms helper not properly initialized');
      return;
    }

    console.log('[Storage Forms] Adding Forms integration');

    // Wrap the _enhanceForm method
    const originalEnhance = Forms.helper._enhanceForm.bind(Forms.helper);

    Forms.helper._enhanceForm = function(form) {
      // Call original enhancement
      form = originalEnhance(form);

      // Add storage integration
      if (form && !form._hasStorageIntegration) {
        form = enhanceFormWithStorage(form);
      }

      return form;
    };
  }

  /**
   * Enhance existing forms directly
   * Finds all forms with IDs and enhances them
   */
  function enhanceExistingForms() {
    if (typeof document === 'undefined') return;

    const forms = document.querySelectorAll('form[id]');
    forms.forEach(form => {
      if (!form._hasStorageIntegration) {
        enhanceFormWithStorage(form);

        // Try to update Forms cache if available
        if (typeof window !== 'undefined' && window.Forms && window.Forms.helper) {
          try {
            if (window.Forms.helper.cache) {
              window.Forms.helper.cache.set(form.id, form);
            }
          } catch (error) {
            // Cache update failed, continue
          }
        }
      }
    });
  }

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  function autoInit() {
    addFormsIntegration();
    enhanceExistingForms();
  }

  // Run auto-init when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      // DOM is already ready, delay slightly to ensure Forms is loaded
      setTimeout(autoInit, 0);
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const StorageForms = {
    // Enhancement
    enhanceFormWithStorage,
    addFormsIntegration,
    enhanceExistingForms,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  // Export to global namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Create Storage namespace if it doesn't exist
    if (!globalObj.Storage) {
      globalObj.Storage = {};
    }

    // Attach forms integration
    globalObj.Storage.forms = StorageForms;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Storage Forms] v2.0.0 initialized');
  }

  return StorageForms;
});
