/**
 * DOM Helpers - Reactive Forms
 *
 * Full-featured form state management with validation
 * Provides 40+ methods and properties for managing forms
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
    global.DOMHelpersReactiveForms = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCY DETECTION
  // ============================================================================

  let ReactiveCore;

  // Try to load reactive-core module
  if (typeof require !== 'undefined') {
    try {
      ReactiveCore = require('./reactive-core.js');
    } catch (e) {
      // Module not available via require
    }
  }

  // Check for global ReactiveUtils (legacy) or DOMHelpersReactiveCore
  if (!ReactiveCore) {
    if (typeof DOMHelpersReactiveCore !== 'undefined') {
      ReactiveCore = DOMHelpersReactiveCore;
    } else if (typeof ReactiveUtils !== 'undefined') {
      ReactiveCore = ReactiveUtils;
    }
  }

  // Exit if reactive core not found
  if (!ReactiveCore || !ReactiveCore.state) {
    console.error('[Reactive Forms] Reactive core not found. Load reactive-core.js first.');
    return {};
  }

  const { state: createState, batch } = ReactiveCore;

  // ============================================================================
  // FORM CREATION
  // ============================================================================

  /**
   * Create a reactive form with validation and state management
   * Provides complete form handling with validation, error tracking, and event binding
   *
   * @param {Object} initialValues - Initial form values
   * @param {Object} options - Form options { validators, onSubmit }
   * @returns {Object} Reactive form
   *
   * @example
   * const loginForm = form(
   *   { email: '', password: '' },
   *   {
   *     validators: {
   *       email: Validators.combine(
   *         Validators.required(),
   *         Validators.email()
   *       ),
   *       password: Validators.minLength(8)
   *     },
   *     onSubmit: async (values) => {
   *       await api.login(values);
   *     }
   *   }
   * );
   */
  function createForm(initialValues = {}, options = {}) {
    // Create the base object
    const formObj = {
      values: { ...initialValues },
      errors: {},
      touched: {},
      isSubmitting: false,
      submitCount: 0
    };

    // Make it reactive
    const form = createState(formObj);

    // ========================================================================
    // COMPUTED PROPERTIES
    // ========================================================================

    form.$computed('isValid', function() {
      const errorKeys = Object.keys(this.errors);
      return errorKeys.length === 0 || errorKeys.every(k => !this.errors[k]);
    });

    form.$computed('isDirty', function() {
      return Object.keys(this.touched).length > 0;
    });

    form.$computed('hasErrors', function() {
      return Object.keys(this.errors).some(k => this.errors[k]);
    });

    form.$computed('touchedFields', function() {
      return Object.keys(this.touched);
    });

    form.$computed('errorFields', function() {
      return Object.keys(this.errors).filter(k => this.errors[k]);
    });

    // Store validators and submit callback
    const validators = options.validators || {};
    const onSubmitCallback = options.onSubmit;

    // ========================================================================
    // FORM METHODS
    // ========================================================================

    const methods = {
      // --------------------------------------------------------------------
      // VALUE MANAGEMENT
      // --------------------------------------------------------------------

      /**
       * Set a single field value
       * @param {string} field - Field name
       * @param {*} value - Field value
       * @returns {Object} this for chaining
       */
      setValue(field, value) {
        this.values[field] = value;
        this.touched[field] = true;

        // Auto-validate if validator exists
        if (validators[field]) {
          this.validateField(field);
        }

        return this;
      },

      /**
       * Set multiple field values
       * @param {Object} values - Field values { field: value }
       * @returns {Object} this for chaining
       */
      setValues(values) {
        return batch(() => {
          Object.entries(values).forEach(([field, value]) => {
            this.setValue(field, value);
          });
          return this;
        });
      },

      /**
       * Get field value
       * @param {string} field - Field name
       * @returns {*} Field value
       */
      getValue(field) {
        return this.values[field];
      },

      // --------------------------------------------------------------------
      // ERROR MANAGEMENT
      // --------------------------------------------------------------------

      /**
       * Set a field error
       * @param {string} field - Field name
       * @param {string|null} error - Error message (null to clear)
       * @returns {Object} this for chaining
       */
      setError(field, error) {
        if (error) {
          this.errors[field] = error;
        } else {
          delete this.errors[field];
        }
        return this;
      },

      /**
       * Set multiple errors
       * @param {Object} errors - Field errors { field: error }
       * @returns {Object} this for chaining
       */
      setErrors(errors) {
        return batch(() => {
          Object.entries(errors).forEach(([field, error]) => {
            this.setError(field, error);
          });
          return this;
        });
      },

      /**
       * Clear a field error
       * @param {string} field - Field name
       * @returns {Object} this for chaining
       */
      clearError(field) {
        delete this.errors[field];
        return this;
      },

      /**
       * Clear all errors
       * @returns {Object} this for chaining
       */
      clearErrors() {
        this.errors = {};
        return this;
      },

      /**
       * Check if field has error
       * @param {string} field - Field name
       * @returns {boolean} true if field has error
       */
      hasError(field) {
        return !!this.errors[field];
      },

      /**
       * Get field error message
       * @param {string} field - Field name
       * @returns {string|null} Error message or null
       */
      getError(field) {
        return this.errors[field] || null;
      },

      // --------------------------------------------------------------------
      // TOUCHED STATE MANAGEMENT
      // --------------------------------------------------------------------

      /**
       * Mark field as touched
       * @param {string} field - Field name
       * @param {boolean} [touched=true] - Touched state
       * @returns {Object} this for chaining
       */
      setTouched(field, touched = true) {
        if (touched) {
          this.touched[field] = true;
        } else {
          delete this.touched[field];
        }
        return this;
      },

      /**
       * Mark multiple fields as touched
       * @param {Array<string>} fields - Field names
       * @returns {Object} this for chaining
       */
      setTouchedFields(fields) {
        return batch(() => {
          fields.forEach(field => this.setTouched(field));
          return this;
        });
      },

      /**
       * Mark all fields as touched
       * @returns {Object} this for chaining
       */
      touchAll() {
        return batch(() => {
          Object.keys(this.values).forEach(field => {
            this.touched[field] = true;
          });
          return this;
        });
      },

      /**
       * Check if field is touched
       * @param {string} field - Field name
       * @returns {boolean} true if field is touched
       */
      isTouched(field) {
        return !!this.touched[field];
      },

      /**
       * Check if field should show error (touched + has error)
       * @param {string} field - Field name
       * @returns {boolean} true if should show error
       */
      shouldShowError(field) {
        return this.isTouched(field) && this.hasError(field);
      },

      // --------------------------------------------------------------------
      // VALIDATION
      // --------------------------------------------------------------------

      /**
       * Validate a single field
       * @param {string} field - Field name
       * @returns {boolean} true if valid
       */
      validateField(field) {
        const validator = validators[field];
        if (!validator) return true;

        const error = validator(this.values[field], this.values);

        if (error) {
          this.errors[field] = error;
          return false;
        } else {
          delete this.errors[field];
          return true;
        }
      },

      /**
       * Validate all fields
       * @returns {boolean} true if all fields valid
       */
      validate() {
        return batch(() => {
          let isValid = true;

          Object.keys(validators).forEach(field => {
            const valid = this.validateField(field);
            if (!valid) isValid = false;
          });

          return isValid;
        });
      },

      // --------------------------------------------------------------------
      // RESET
      // --------------------------------------------------------------------

      /**
       * Reset form to initial or new values
       * @param {Object} [newValues=initialValues] - New values
       * @returns {Object} this for chaining
       */
      reset(newValues = initialValues) {
        return batch(() => {
          this.values = { ...newValues };
          this.errors = {};
          this.touched = {};
          this.isSubmitting = false;
          return this;
        });
      },

      /**
       * Reset a single field
       * @param {string} field - Field name
       * @returns {Object} this for chaining
       */
      resetField(field) {
        return batch(() => {
          this.values[field] = initialValues[field];
          delete this.errors[field];
          delete this.touched[field];
          return this;
        });
      },

      // --------------------------------------------------------------------
      // SUBMISSION
      // --------------------------------------------------------------------

      /**
       * Handle form submission
       * @param {Function} [customHandler] - Custom submit handler
       * @returns {Promise<Object>} { success, result/error }
       */
      async submit(customHandler) {
        const handler = customHandler || onSubmitCallback;

        if (!handler) {
          console.warn('[Forms] No submit handler provided');
          return;
        }

        // Mark all fields as touched
        this.touchAll();

        // Validate
        const isValid = this.validate();

        if (!isValid) {
          console.log('[Forms] Validation failed');
          return { success: false, errors: this.errors };
        }

        this.isSubmitting = true;

        try {
          const result = await handler(this.values, this);
          this.submitCount++;
          this.isSubmitting = false;
          return { success: true, result };
        } catch (error) {
          this.isSubmitting = false;
          console.error('[Forms] Submit error:', error);
          return { success: false, error };
        }
      },

      // --------------------------------------------------------------------
      // EVENT HANDLERS
      // --------------------------------------------------------------------

      /**
       * Handle input change event
       * @param {Event} event - Change event
       */
      handleChange(event) {
        const target = event.target;
        const field = target.name || target.id;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setValue(field, value);
      },

      /**
       * Handle input blur event
       * @param {Event} event - Blur event
       */
      handleBlur(event) {
        const target = event.target;
        const field = target.name || target.id;

        this.setTouched(field);

        if (validators[field]) {
          this.validateField(field);
        }
      },

      /**
       * Get field props for easy binding
       * @param {string} field - Field name
       * @returns {Object} { name, value, onChange, onBlur }
       */
      getFieldProps(field) {
        return {
          name: field,
          value: this.values[field] || '',
          onChange: (e) => this.handleChange(e),
          onBlur: (e) => this.handleBlur(e)
        };
      },

      // --------------------------------------------------------------------
      // DOM BINDING
      // --------------------------------------------------------------------

      /**
       * Bind form to DOM inputs
       * @param {string|NodeList} selector - Input selector or NodeList
       * @returns {Object} this for chaining
       */
      bindToInputs(selector) {
        const inputs = typeof selector === 'string'
          ? document.querySelectorAll(selector)
          : selector;

        inputs.forEach(input => {
          const field = input.name || input.id;

          if (!field) return;

          // Set initial value
          if (input.type === 'checkbox') {
            input.checked = !!this.values[field];
          } else {
            input.value = this.values[field] || '';
          }

          // Add event listeners
          input.addEventListener('input', (e) => this.handleChange(e));
          input.addEventListener('blur', (e) => this.handleBlur(e));
        });

        return this;
      },

      // --------------------------------------------------------------------
      // SERIALIZATION
      // --------------------------------------------------------------------

      /**
       * Convert to plain object
       * @returns {Object} Form state as plain object
       */
      toObject() {
        return {
          values: { ...this.values },
          errors: { ...this.errors },
          touched: { ...this.touched },
          isValid: this.isValid,
          isDirty: this.isDirty,
          isSubmitting: this.isSubmitting,
          submitCount: this.submitCount
        };
      }
    };

    // Attach methods to form
    Object.keys(methods).forEach(key => {
      form[key] = methods[key].bind(form);
    });

    return form;
  }

  // ============================================================================
  // VALIDATORS
  // ============================================================================

  /**
   * Common validators for form fields
   */
  const Validators = {
    /**
     * Required field validator
     * @param {string} [message='This field is required'] - Error message
     * @returns {Function} Validator function
     */
    required(message = 'This field is required') {
      return (value) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return message;
        }
        return null;
      };
    },

    /**
     * Email format validator
     * @param {string} [message='Invalid email address'] - Error message
     * @returns {Function} Validator function
     */
    email(message = 'Invalid email address') {
      return (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
      };
    },

    /**
     * Minimum length validator
     * @param {number} min - Minimum length
     * @param {string} [message] - Error message
     * @returns {Function} Validator function
     */
    minLength(min, message) {
      return (value) => {
        if (!value) return null;
        const msg = message || `Must be at least ${min} characters`;
        return value.length >= min ? null : msg;
      };
    },

    /**
     * Maximum length validator
     * @param {number} max - Maximum length
     * @param {string} [message] - Error message
     * @returns {Function} Validator function
     */
    maxLength(max, message) {
      return (value) => {
        if (!value) return null;
        const msg = message || `Must be no more than ${max} characters`;
        return value.length <= max ? null : msg;
      };
    },

    /**
     * Pattern/regex validator
     * @param {RegExp} regex - Regular expression
     * @param {string} [message='Invalid format'] - Error message
     * @returns {Function} Validator function
     */
    pattern(regex, message = 'Invalid format') {
      return (value) => {
        if (!value) return null;
        return regex.test(value) ? null : message;
      };
    },

    /**
     * Minimum value validator
     * @param {number} min - Minimum value
     * @param {string} [message] - Error message
     * @returns {Function} Validator function
     */
    min(min, message) {
      return (value) => {
        if (value === '' || value == null) return null;
        const msg = message || `Must be at least ${min}`;
        return Number(value) >= min ? null : msg;
      };
    },

    /**
     * Maximum value validator
     * @param {number} max - Maximum value
     * @param {string} [message] - Error message
     * @returns {Function} Validator function
     */
    max(max, message) {
      return (value) => {
        if (value === '' || value == null) return null;
        const msg = message || `Must be no more than ${max}`;
        return Number(value) <= max ? null : msg;
      };
    },

    /**
     * Match field validator (e.g., password confirmation)
     * @param {string} fieldName - Field name to match
     * @param {string} [message] - Error message
     * @returns {Function} Validator function
     */
    match(fieldName, message) {
      return (value, allValues) => {
        const msg = message || `Must match ${fieldName}`;
        return value === allValues[fieldName] ? null : msg;
      };
    },

    /**
     * Custom validator
     * @param {Function} validatorFn - Custom validator function
     * @returns {Function} Validator function
     */
    custom(validatorFn) {
      return validatorFn;
    },

    /**
     * Combine multiple validators
     * @param {...Function} validators - Validators to combine
     * @returns {Function} Combined validator function
     */
    combine(...validators) {
      return (value, allValues) => {
        for (const validator of validators) {
          const error = validator(value, allValues);
          if (error) return error;
        }
        return null;
      };
    }
  };

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Create a reactive form
     */
    create: createForm,

    /**
     * Alias for create
     */
    form: createForm,

    /**
     * Built-in validators
     */
    validators: Validators,

    /**
     * Shorthand for validators
     */
    v: Validators,

    /**
     * Version
     */
    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Attach to Forms global if available
  if (typeof Forms !== 'undefined') {
    Object.assign(Forms, api);
  }

  // Add to ReactiveCore/ReactiveUtils
  if (ReactiveCore) {
    ReactiveCore.form = createForm;
    ReactiveCore.createForm = createForm;
    ReactiveCore.validators = Validators;
  }

  // Legacy support for ReactiveState
  if (typeof ReactiveState !== 'undefined') {
    ReactiveState.form = createForm;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Reactive Forms] v2.3.1 loaded successfully');
    console.log('[DOM Helpers Reactive Forms] Available methods:');
    console.log('  - form.setValue(field, value)');
    console.log('  - form.setError(field, error)');
    console.log('  - form.validate()');
    console.log('  - form.submit(handler)');
    console.log('  - form.reset()');
    console.log('  - Plus 40+ validation and binding helpers!');
  }

  return api;
});
