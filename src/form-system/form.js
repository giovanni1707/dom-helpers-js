/**
 * DOM Helpers - Form System (Unified Entry Point)
 *
 * Complete form handling system with declarative syntax.
 * Single import for all form features.
 *
 * Features:
 * - Forms.formId proxy access
 * - Automatic caching with MutationObserver
 * - Form value extraction and setting
 * - Comprehensive validation system
 * - Enhanced submission with retry
 * - Loading states and visual feedback
 * - Reactive form bridge
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
    global.DOMHelpersForms = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let FormCore, FormValidation, FormEnhancements;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      FormCore = require('./form-core.js');
      FormValidation = require('./form-validation.js');
      FormEnhancements = require('./form-enhancements.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!FormCore) {
    FormCore = typeof DOMHelpersFormCore !== 'undefined' ? DOMHelpersFormCore : null;
    FormValidation = typeof DOMHelpersFormValidation !== 'undefined' ? DOMHelpersFormValidation : null;
    FormEnhancements = typeof DOMHelpersFormEnhancements !== 'undefined' ? DOMHelpersFormEnhancements : null;
  }

  // Try to get from global Forms object
  if (!FormCore && typeof Forms !== 'undefined') {
    FormCore = Forms.core;
    FormValidation = Forms.validation;
    FormEnhancements = Forms.enhancements;
  }

  // Verify core module is available
  if (!FormCore) {
    console.error('[Forms System] form-core.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // PRODUCTION FORMS HELPER CLASS
  // ============================================================================

  class ProductionFormsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 500,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Forms = new Proxy(this, {
        get: (target, prop) => {
          // Handle internal methods and symbols
          if (typeof prop === 'symbol' ||
              prop.startsWith('_') ||
              typeof target[prop] === 'function') {
            return target[prop];
          }

          return target._getForm(prop);
        },

        has: (target, prop) => target._hasForm(prop),

        ownKeys: (target) => target._getKeys(),

        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasForm(prop)) {
            return {
              enumerable: true,
              configurable: true,
              value: target._getForm(prop)
            };
          }
          return undefined;
        }
      });
    }

    _getForm(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid form property type: ${typeof prop}`);
        return null;
      }

      // Check cache first
      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          this.stats.hits++;
          return form;
        } else {
          this.cache.delete(prop);
        }
      }

      // Get form by ID
      const form = document.getElementById(prop);
      if (form && form.tagName.toLowerCase() === 'form') {
        const enhancedForm = this._enhanceForm(form);
        this._addToCache(prop, enhancedForm);
        this.stats.misses++;
        return enhancedForm;
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Form with id '${prop}' not found`);
      }
      return null;
    }

    _hasForm(prop) {
      if (typeof prop !== 'string') return false;

      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          return true;
        }
        this.cache.delete(prop);
      }

      const form = document.getElementById(prop);
      return form && form.tagName.toLowerCase() === 'form';
    }

    _getKeys() {
      // Return all form IDs in the document
      const forms = document.querySelectorAll("form[id]");
      return Array.from(forms).map(form => form.id).filter(id => id);
    }

    _enhanceForm(form) {
      if (!form || form._isEnhancedForm) {
        return form;
      }

      // First enhance with Elements helper if available
      try {
        if (global.Elements && global.Elements.helper) {
          form = global.Elements.helper._enhanceElementWithUpdate(form);
        } else if (typeof Elements !== 'undefined' && Elements.helper) {
          form = Elements.helper._enhanceElementWithUpdate(form);
        }
      } catch (error) {
        // Elements helper not available, continue
      }

      // Enhance with core form methods
      if (FormCore.enhanceFormWithCoreMethods) {
        form = FormCore.enhanceFormWithCoreMethods(form);
      }

      // Enhance with validation methods
      if (FormValidation && FormValidation.enhanceFormWithValidation) {
        form = FormValidation.enhanceFormWithValidation(form);
      }

      // Enhance with submission enhancements
      if (FormEnhancements && FormEnhancements.enhanceFormWithEnhancements) {
        form = FormEnhancements.enhanceFormWithEnhancements(form);
      }

      // Add or replace update method with form-aware version
      if (FormCore.createFormUpdateMethod) {
        const originalUpdate = form.update;
        form.update = FormCore.createFormUpdateMethod(form, originalUpdate);
      }

      // Mark as enhanced
      Object.defineProperty(form, '_isEnhancedForm', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      return form;
    }

    _addToCache(id, form) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, form);
      this.stats.cacheSize = this.cache.size;
    }

    _initMutationObserver() {
      if (typeof MutationObserver === 'undefined') return;

      this.observer = new MutationObserver((mutations) => {
        this._processMutations(mutations);
      });

      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id'],
          attributeOldValue: true
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id'],
              attributeOldValue: true
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const addedIds = new Set();
      const removedIds = new Set();

      mutations.forEach(mutation => {
        // Handle added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            addedIds.add(node.id);
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            removedIds.add(node.id);
          }
        });

        // Handle ID attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const target = mutation.target;
          if (target.tagName.toLowerCase() === 'form') {
            const oldId = mutation.oldValue;
            const newId = target.id;

            if (oldId && oldId !== newId) {
              removedIds.add(oldId);
            }
            if (newId && newId !== oldId) {
              addedIds.add(newId);
            }
          }
        }
      });

      // Update cache
      removedIds.forEach(id => {
        this.cache.delete(id);
      });

      this.stats.cacheSize = this.cache.size;
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const staleIds = [];

      for (const [id, form] of this.cache) {
        if (!form ||
            form.nodeType !== Node.ELEMENT_NODE ||
            !document.contains(form) ||
            form.id !== id ||
            form.tagName.toLowerCase() !== 'form') {
          staleIds.push(id);
        }
      }

      staleIds.forEach(id => this.cache.delete(id));
      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleIds.length > 0) {
        this._log(`Cleanup completed. Removed ${staleIds.length} stale entries.`);
      }
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Forms] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Forms] ${message}`);
      }
    }

    // Public API
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Forms helper destroyed');
    }

    // Utility methods
    getAllForms() {
      const forms = document.querySelectorAll('form[id]');
      return Array.from(forms).map(form => this._enhanceForm(form));
    }

    validateAll(rules = {}) {
      const results = {};
      this.getAllForms().forEach(form => {
        if (form.id && form.validate) {
          results[form.id] = form.validate(rules[form.id] || {});
        }
      });
      return results;
    }

    resetAll() {
      this.getAllForms().forEach(form => {
        if (form.reset) form.reset();
      });
    }
  }

  // ============================================================================
  // AUTO-INITIALIZE
  // ============================================================================

  const FormsHelper = new ProductionFormsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 500
  });

  // ============================================================================
  // UNIFIED API
  // ============================================================================

  const Forms = FormsHelper.Forms;

  // Additional utilities
  Forms.helper = FormsHelper;
  Forms.stats = () => FormsHelper.getStats();
  Forms.clear = () => FormsHelper.clearCache();
  Forms.destroy = () => FormsHelper.destroy();
  Forms.getAllForms = () => FormsHelper.getAllForms();
  Forms.validateAll = (rules) => FormsHelper.validateAll(rules);
  Forms.resetAll = () => FormsHelper.resetAll();
  Forms.configure = (options) => {
    Object.assign(FormsHelper.options, options);
    return Forms;
  };

  // Module references
  Forms.modules = {
    core: FormCore,
    validation: FormValidation,
    enhancements: FormEnhancements
  };

  // Core methods
  if (FormCore) {
    Forms.getFormValues = FormCore.getFormValues;
    Forms.setFormValues = FormCore.setFormValues;
    Forms.getFormField = FormCore.getFormField;
    Forms.setFormField = FormCore.setFormField;
    Forms.serializeForm = FormCore.serializeForm;
  }

  // Validation
  if (FormValidation) {
    Forms.validation = FormValidation;
    Forms.validators = FormValidation.validators;
    Forms.v = FormValidation.v;
    Forms.validateForm = FormValidation.validateForm;
  }

  // Enhancements
  if (FormEnhancements) {
    Forms.enhancements = FormEnhancements;
    Forms.enhance = FormEnhancements.enhance;
    Forms.submit = FormEnhancements.submit;
    Forms.connect = FormEnhancements.connect;
  }

  // Version
  Forms.version = '2.0.0';

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Export to global
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    globalObj.Forms = Forms;
    globalObj.ProductionFormsHelper = ProductionFormsHelper;

    // Add to DOMHelpers if it exists
    if (globalObj.DOMHelpers) {
      globalObj.DOMHelpers.Forms = Forms;
      globalObj.DOMHelpers.ProductionFormsHelper = ProductionFormsHelper;
    }
  }

  // ============================================================================
  // AUTO-CLEANUP
  // ============================================================================

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      FormsHelper.destroy();
    });
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Forms System] v2.0.0 initialized');
    console.log('[DOM Helpers Forms System] Available via: Forms');

    const loaded = [];
    const missing = [];

    if (FormCore) loaded.push('core');
    else missing.push('core');

    if (FormValidation) loaded.push('validation');
    else missing.push('validation');

    if (FormEnhancements) loaded.push('enhancements');
    else missing.push('enhancements');

    if (loaded.length > 0) {
      console.log(`[DOM Helpers Forms System] Loaded modules: ${loaded.join(', ')}`);
    }

    if (missing.length > 0) {
      console.warn(`[DOM Helpers Forms System] Missing modules: ${missing.join(', ')}`);
    }

    console.log('\n[Usage Examples]');
    console.log('  Forms.myForm.values = { name: "John", email: "john@example.com" };');
    console.log('  Forms.myForm.validate({ email: Forms.v.email() });');
    console.log('  Forms.myForm.submitData({ onSuccess: (result) => console.log(result) });');
  }

  return Forms;
});
