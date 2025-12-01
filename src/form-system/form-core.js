/**
 * DOM Helpers - Form Core Module
 *
 * Core form handling functionality including value extraction, field access,
 * and serialization. Foundation for all other form modules.
 *
 * Features:
 * - Form value extraction and setting
 * - Field access helpers (by name or ID)
 * - Multiple serialization formats (object, JSON, FormData, URLencoded)
 * - Type-aware field value handling
 * - Enhanced form methods
 * - Shared utilities for other modules
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
    global.DOMHelpersFormCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // FORM VALUE EXTRACTION
  // ============================================================================

  /**
   * Get all form values as an object
   * Handles checkboxes, radio buttons, multi-select, and file inputs
   *
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Form values as key-value pairs
   */
  function getFormValues(form) {
    if (!form || !form.elements) {
      console.warn('[Form Core] Invalid form element provided to getFormValues');
      return {};
    }

    const values = {};
    const formData = new FormData(form);

    // Handle regular form fields
    for (const [name, value] of formData.entries()) {
      if (values[name]) {
        // Handle multiple values (checkboxes, multi-select)
        if (Array.isArray(values[name])) {
          values[name].push(value);
        } else {
          values[name] = [values[name], value];
        }
      } else {
        values[name] = value;
      }
    }

    // Handle unchecked checkboxes and radio buttons
    const inputs = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => {
      if (!input.checked && input.name && !values.hasOwnProperty(input.name)) {
        if (input.type === 'checkbox') {
          values[input.name] = false;
        }
        // Radio buttons without selection are omitted
      }
    });

    return values;
  }

  /**
   * Set form values from an object
   * Intelligently handles all input types
   *
   * @param {HTMLFormElement} form - Form element
   * @param {Object} values - Values to set
   */
  function setFormValues(form, values) {
    if (!form || !form.elements) {
      console.warn('[Form Core] Invalid form element provided to setFormValues');
      return;
    }

    if (!values || typeof values !== 'object') {
      console.warn('[Form Core] Invalid values object provided to setFormValues');
      return;
    }

    Object.entries(values).forEach(([name, value]) => {
      setFormField(form, name, value);
    });
  }

  // ============================================================================
  // FIELD ACCESS HELPERS
  // ============================================================================

  /**
   * Get a specific form field by name or ID
   *
   * @param {HTMLFormElement} form - Form element
   * @param {string} name - Field name or ID
   * @returns {HTMLElement|null} Field element or null
   */
  function getFormField(form, name) {
    if (!form || !name) return null;

    // Try by name first
    let field = form.querySelector(`[name="${name}"]`);

    // Try by id if name doesn't work
    if (!field) {
      field = form.querySelector(`#${name}`);
    }

    return field;
  }

  /**
   * Set a specific form field value
   * Handles single fields, radio groups, and checkbox groups
   *
   * @param {HTMLFormElement} form - Form element
   * @param {string} name - Field name or ID
   * @param {*} value - Value to set
   */
  function setFormField(form, name, value) {
    if (!form || !name) return;

    const fields = form.querySelectorAll(`[name="${name}"]`);

    if (fields.length === 0) {
      // Try by ID if name doesn't work
      const field = form.querySelector(`#${name}`);
      if (field) {
        setFieldValue(field, value);
      }
      return;
    }

    if (fields.length === 1) {
      setFieldValue(fields[0], value);
    } else {
      // Handle multiple fields (radio buttons, checkboxes)
      fields.forEach(field => {
        if (field.type === 'radio') {
          field.checked = field.value === String(value);
        } else if (field.type === 'checkbox') {
          if (Array.isArray(value)) {
            field.checked = value.includes(field.value);
          } else {
            field.checked = Boolean(value);
          }
        } else {
          setFieldValue(field, value);
        }
      });
    }
  }

  /**
   * Set individual field value based on field type
   * Type-aware value setting with change event dispatch
   *
   * @param {HTMLElement} field - Field element
   * @param {*} value - Value to set
   */
  function setFieldValue(field, value) {
    if (!field) return;

    switch (field.type) {
      case 'checkbox':
        field.checked = Boolean(value);
        break;
      case 'radio':
        field.checked = field.value === String(value);
        break;
      case 'file':
        // File inputs can't be set programmatically for security reasons
        console.warn('[Form Core] Cannot set file input values programmatically');
        break;
      case 'select-multiple':
        if (Array.isArray(value)) {
          Array.from(field.options).forEach(option => {
            option.selected = value.includes(option.value);
          });
        }
        break;
      default:
        field.value = value ?? '';
        break;
    }

    // Trigger change event
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ============================================================================
  // SERIALIZATION
  // ============================================================================

  /**
   * Serialize form data in different formats
   *
   * @param {HTMLFormElement} form - Form element
   * @param {string} format - 'object', 'json', 'formdata', or 'urlencoded'
   * @returns {Object|string|FormData} Serialized form data
   */
  function serializeForm(form, format = 'object') {
    if (!form || !form.elements) {
      console.warn('[Form Core] Invalid form element provided to serializeForm');
      return format === 'object' ? {} : '';
    }

    const values = getFormValues(form);

    switch (format) {
      case 'json':
        return JSON.stringify(values);

      case 'formdata':
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
        return formData;

      case 'urlencoded':
        return new URLSearchParams(values).toString();

      case 'object':
      default:
        return values;
    }
  }

  // ============================================================================
  // FORM ENHANCEMENT
  // ============================================================================

  /**
   * Enhance a form element with core form methods
   * Adds values getter/setter and helper methods
   *
   * @param {HTMLFormElement} form - Form element to enhance
   * @returns {HTMLFormElement} Enhanced form element
   */
  function enhanceFormWithCoreMethods(form) {
    if (!form || form._hasCoreFormMethods) {
      return form;
    }

    // Protect against double enhancement
    Object.defineProperty(form, '_hasCoreFormMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add values getter/setter
    Object.defineProperty(form, 'values', {
      get: function() {
        return getFormValues(form);
      },
      set: function(values) {
        setFormValues(form, values);
      },
      enumerable: true,
      configurable: true
    });

    // Add field access helpers
    form.getField = function(name) {
      return getFormField(form, name);
    };

    form.setField = function(name, value) {
      setFormField(form, name, value);
      return form;
    };

    // Add serialization methods
    form.serialize = function(format = 'object') {
      return serializeForm(form, format);
    };

    form.toJSON = function() {
      return getFormValues(form);
    };

    form.toFormData = function() {
      return serializeForm(form, 'formdata');
    };

    form.toURLEncoded = function() {
      return serializeForm(form, 'urlencoded');
    };

    // Add enhanced reset method
    const originalReset = form.reset;
    form.reset = function(options = {}) {
      // Call original reset
      originalReset.call(form);

      // Trigger custom reset event
      form.dispatchEvent(new CustomEvent('formreset', {
        detail: { form: form },
        bubbles: true
      }));

      return form;
    };

    return form;
  }

  // ============================================================================
  // FORM UPDATE METHOD
  // ============================================================================

  /**
   * Create form-aware update method
   * Handles form-specific updates (values, reset, etc.)
   *
   * @param {HTMLFormElement} form - Form element
   * @param {Function} [originalUpdate] - Original update method if exists
   * @returns {Function} Form update method
   */
  function createFormUpdateMethod(form, originalUpdate = null) {
    return function formUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[Form Core] .update() called with invalid updates object');
        return form;
      }

      // Handle form-specific updates first
      const formUpdates = { ...updates };

      // Handle values setting
      if (formUpdates.values) {
        setFormValues(form, formUpdates.values);
        delete formUpdates.values;
      }

      // Handle reset
      if (formUpdates.reset) {
        const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
        form.reset(resetOptions);
        delete formUpdates.reset;
      }

      // Handle remaining updates with original update method if available
      if (Object.keys(formUpdates).length > 0 && originalUpdate) {
        return originalUpdate.call(form, formUpdates);
      }

      // Fallback: Apply remaining updates as properties/attributes
      if (Object.keys(formUpdates).length > 0) {
        Object.entries(formUpdates).forEach(([key, value]) => {
          try {
            if (key in form) {
              form[key] = value;
            } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              form.setAttribute(key, value);
            }
          } catch (error) {
            console.warn(`[Form Core] Could not set ${key}:`, error.message);
          }
        });
      }

      return form;
    };
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Check if element is a form
   *
   * @param {*} element - Element to check
   * @returns {boolean} True if element is a form
   */
  function isForm(element) {
    return element &&
           element.nodeType === Node.ELEMENT_NODE &&
           element.tagName.toLowerCase() === 'form';
  }

  /**
   * Get all forms in document with IDs
   *
   * @returns {Array<HTMLFormElement>} Array of form elements
   */
  function getAllForms() {
    return Array.from(document.querySelectorAll('form[id]'));
  }

  /**
   * Find form by ID
   *
   * @param {string} id - Form ID
   * @returns {HTMLFormElement|null} Form element or null
   */
  function getFormById(id) {
    const form = document.getElementById(id);
    return isForm(form) ? form : null;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const FormCore = {
    // Core methods
    getFormValues,
    setFormValues,
    getFormField,
    setFormField,
    setFieldValue,
    serializeForm,

    // Enhancement
    enhanceFormWithCoreMethods,
    createFormUpdateMethod,

    // Utilities
    isForm,
    getAllForms,
    getFormById,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  // Export to global Conditions-like namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Create Forms namespace if it doesn't exist
    if (!globalObj.Forms) {
      globalObj.Forms = {};
    }

    // Attach core methods
    globalObj.Forms.core = FormCore;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Form Core] v2.0.0 initialized');
  }

  return FormCore;
});
