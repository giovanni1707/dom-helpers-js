/**
 * DOM Helpers - Form Validation Module
 *
 * Comprehensive validation system with built-in validators and custom rules.
 * Compatible with both DOM forms and Reactive forms.
 *
 * Features:
 * - HTML5 validation integration
 * - 10+ built-in validators (required, email, pattern, length, etc.)
 * - Custom validation rules
 * - Field-level and form-level validation
 * - Error display and clearing
 * - Shared validator system (DOM + Reactive compatible)
 * - Accessibility support (aria-invalid)
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
    global.DOMHelpersFormValidation = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let FormCore;

  // Try to load form-core module
  if (typeof require !== 'undefined') {
    try {
      FormCore = require('./form-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global FormCore
  if (!FormCore && typeof window !== 'undefined') {
    FormCore = window.Forms?.core || window.DOMHelpersFormCore;
  } else if (!FormCore && typeof global !== 'undefined') {
    FormCore = global.Forms?.core || global.DOMHelpersFormCore;
  }

  // Fallback function if FormCore not available
  const getFormValues = FormCore?.getFormValues || function(form) {
    const formData = new FormData(form);
    const values = {};
    for (const [name, value] of formData.entries()) {
      values[name] = value;
    }
    return values;
  };

  const getFormField = FormCore?.getFormField || function(form, name) {
    return form.querySelector(`[name="${name}"]`) || form.querySelector(`#${name}`);
  };

  // ============================================================================
  // BUILT-IN VALIDATORS
  // ============================================================================

  /**
   * Built-in validator functions
   * Each returns a validator function that returns true or error message
   */
  const Validators = {
    /**
     * Required field validator
     * @param {string} [message='This field is required'] - Error message
     */
    required(message = 'This field is required') {
      return (value, values, field) => {
        if (value === null || value === undefined) return message;
        if (typeof value === 'string' && value.trim() === '') return message;
        if (Array.isArray(value) && value.length === 0) return message;
        return true;
      };
    },

    /**
     * Email format validator
     * @param {string} [message='Invalid email address'] - Error message
     */
    email(message = 'Invalid email address') {
      return (value) => {
        if (!value) return true; // Empty is valid (use required for mandatory)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? true : message;
      };
    },

    /**
     * Minimum length validator
     * @param {number} min - Minimum length
     * @param {string} [message] - Error message
     */
    minLength(min, message) {
      return (value) => {
        if (!value) return true;
        const msg = message || `Must be at least ${min} characters`;
        return value.length >= min ? true : msg;
      };
    },

    /**
     * Maximum length validator
     * @param {number} max - Maximum length
     * @param {string} [message] - Error message
     */
    maxLength(max, message) {
      return (value) => {
        if (!value) return true;
        const msg = message || `Must be at most ${max} characters`;
        return value.length <= max ? true : msg;
      };
    },

    /**
     * Pattern (regex) validator
     * @param {RegExp|string} pattern - Regex pattern
     * @param {string} [message='Invalid format'] - Error message
     */
    pattern(pattern, message = 'Invalid format') {
      return (value) => {
        if (!value) return true;
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        return regex.test(value) ? true : message;
      };
    },

    /**
     * Minimum value validator (numbers)
     * @param {number} min - Minimum value
     * @param {string} [message] - Error message
     */
    min(min, message) {
      return (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        if (isNaN(num)) return 'Must be a number';
        const msg = message || `Must be at least ${min}`;
        return num >= min ? true : msg;
      };
    },

    /**
     * Maximum value validator (numbers)
     * @param {number} max - Maximum value
     * @param {string} [message] - Error message
     */
    max(max, message) {
      return (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        if (isNaN(num)) return 'Must be a number';
        const msg = message || `Must be at most ${max}`;
        return num <= max ? true : msg;
      };
    },

    /**
     * Match another field validator
     * @param {string} fieldName - Field name to match
     * @param {string} [message] - Error message
     */
    match(fieldName, message) {
      return (value, values) => {
        const msg = message || `Must match ${fieldName}`;
        return value === values[fieldName] ? true : msg;
      };
    },

    /**
     * URL format validator
     * @param {string} [message='Invalid URL'] - Error message
     */
    url(message = 'Invalid URL') {
      return (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return message;
        }
      };
    },

    /**
     * Number validator
     * @param {string} [message='Must be a number'] - Error message
     */
    number(message = 'Must be a number') {
      return (value) => {
        if (!value) return true;
        return !isNaN(parseFloat(value)) ? true : message;
      };
    },

    /**
     * Integer validator
     * @param {string} [message='Must be an integer'] - Error message
     */
    integer(message = 'Must be an integer') {
      return (value) => {
        if (!value) return true;
        return Number.isInteger(parseFloat(value)) ? true : message;
      };
    },

    /**
     * Custom validator
     * @param {Function} fn - Validator function (value, values, field) => true | string
     */
    custom(fn) {
      return fn;
    }
  };

  // ============================================================================
  // VALIDATION EXECUTION
  // ============================================================================

  /**
   * Validate a single field with rules
   *
   * @param {*} value - Field value
   * @param {Object|Function} rule - Validation rule(s)
   * @param {Object} values - All form values
   * @param {HTMLElement} field - Field element
   * @returns {string|true} Error message or true if valid
   */
  function validateField(value, rule, values, field) {
    // Function validator
    if (typeof rule === 'function') {
      const result = rule(value, values, field);
      return result === true || result === undefined ? true : result || 'Invalid value';
    }

    // Object with multiple validators
    if (typeof rule === 'object' && rule !== null) {
      for (const [ruleName, ruleValue] of Object.entries(rule)) {
        let isInvalid = false;
        let message = '';

        switch (ruleName) {
          case 'required':
            if (ruleValue && (!value || (typeof value === 'string' && value.trim() === ''))) {
              isInvalid = true;
              message = 'This field is required';
            }
            break;

          case 'minLength':
            if (value && value.length < ruleValue) {
              isInvalid = true;
              message = `Minimum length is ${ruleValue} characters`;
            }
            break;

          case 'maxLength':
            if (value && value.length > ruleValue) {
              isInvalid = true;
              message = `Maximum length is ${ruleValue} characters`;
            }
            break;

          case 'pattern':
            if (value && !new RegExp(ruleValue).test(value)) {
              isInvalid = true;
              message = 'Invalid format';
            }
            break;

          case 'email':
            if (ruleValue && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              isInvalid = true;
              message = 'Invalid email address';
            }
            break;

          case 'min':
            if (value && parseFloat(value) < ruleValue) {
              isInvalid = true;
              message = `Must be at least ${ruleValue}`;
            }
            break;

          case 'max':
            if (value && parseFloat(value) > ruleValue) {
              isInvalid = true;
              message = `Must be at most ${ruleValue}`;
            }
            break;

          case 'custom':
            if (typeof ruleValue === 'function') {
              const result = ruleValue(value, values, field);
              if (result !== true && result !== undefined) {
                isInvalid = true;
                message = result || 'Invalid value';
              }
            }
            break;

          case 'message':
            // Custom message for the rule
            break;

          default:
            console.warn(`[Form Validation] Unknown rule: ${ruleName}`);
        }

        if (isInvalid) {
          return rule.message || message;
        }
      }
    }

    return true;
  }

  /**
   * Validate entire form with rules
   *
   * @param {HTMLFormElement} form - Form element
   * @param {Object} rules - Validation rules for each field
   * @returns {Object} Validation result { isValid, errors, values }
   */
  function validateForm(form, rules = {}) {
    const errors = {};
    const values = getFormValues(form);

    // Clear previous validation
    clearFormValidation(form);

    // Built-in HTML5 validation
    const isValid = form.checkValidity();
    if (!isValid) {
      const invalidFields = form.querySelectorAll(':invalid');
      invalidFields.forEach(field => {
        if (field.name) {
          errors[field.name] = field.validationMessage || 'Invalid value';
          markFieldInvalid(field, errors[field.name]);
        }
      });
    }

    // Custom validation rules
    Object.entries(rules).forEach(([fieldName, rule]) => {
      const value = values[fieldName];
      const field = getFormField(form, fieldName);

      const result = validateField(value, rule, values, field);
      if (result !== true) {
        errors[fieldName] = result;
        if (field) markFieldInvalid(field, result);
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      values: values
    };
  }

  // ============================================================================
  // ERROR DISPLAY
  // ============================================================================

  /**
   * Mark field as invalid with error message
   *
   * @param {HTMLElement} field - Field element
   * @param {string} message - Error message
   */
  function markFieldInvalid(field, message) {
    field.classList.add('form-invalid');
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message element
    let errorElement = field.parentNode?.querySelector('.form-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875em';
      errorElement.style.marginTop = '0.25rem';
      field.parentNode?.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * Clear validation state from a field
   *
   * @param {HTMLElement} field - Field element
   */
  function clearFieldValidation(field) {
    field.classList.remove('form-invalid');
    field.removeAttribute('aria-invalid');

    // Remove error message
    const errorElement = field.parentNode?.querySelector('.form-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Clear all validation messages from form
   *
   * @param {HTMLFormElement} form - Form element
   */
  function clearFormValidation(form) {
    // Remove invalid classes and attributes
    const invalidFields = form.querySelectorAll('.form-invalid');
    invalidFields.forEach(field => {
      clearFieldValidation(field);
    });

    // Remove error messages
    const errorMessages = form.querySelectorAll('.form-error-message');
    errorMessages.forEach(msg => msg.remove());
  }

  // ============================================================================
  // FORM ENHANCEMENT
  // ============================================================================

  /**
   * Enhance form with validation methods
   *
   * @param {HTMLFormElement} form - Form element
   * @returns {HTMLFormElement} Enhanced form
   */
  function enhanceFormWithValidation(form) {
    if (!form || form._hasValidationMethods) {
      return form;
    }

    // Protect against double enhancement
    Object.defineProperty(form, '_hasValidationMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add validation methods
    form.validate = function(rules = {}) {
      return validateForm(form, rules);
    };

    form.clearValidation = function() {
      clearFormValidation(form);
      return form;
    };

    form.validateField = function(fieldName, rule) {
      const field = getFormField(form, fieldName);
      if (!field) return { isValid: false, error: 'Field not found' };

      const values = getFormValues(form);
      const value = values[fieldName];
      const result = validateField(value, rule, values, field);

      if (result !== true) {
        markFieldInvalid(field, result);
        return { isValid: false, error: result };
      }

      clearFieldValidation(field);
      return { isValid: true };
    };

    return form;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const FormValidation = {
    // Validators
    validators: Validators,
    v: Validators, // Shortcut

    // Validation execution
    validateForm,
    validateField,

    // Error display
    markFieldInvalid,
    clearFieldValidation,
    clearFormValidation,

    // Enhancement
    enhanceFormWithValidation,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  // Export to global namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Create Forms namespace if it doesn't exist
    if (!globalObj.Forms) {
      globalObj.Forms = {};
    }

    // Attach validation methods
    globalObj.Forms.validation = FormValidation;
    globalObj.Forms.validators = Validators;
    globalObj.Forms.v = Validators; // Shortcut
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Form Validation] v2.0.0 initialized');
  }

  return FormValidation;
});
