/**
 * DOM Helpers - Async Forms Module
 *
 * Form utilities for async operations including validation, data extraction,
 * async event handlers, and message display.
 *
 * Features:
 * - Async event handler wrapper with loading states
 * - Form validation with multiple rule types
 * - Form data extraction
 * - Form message display
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
    global.DOMHelpersAsyncForms = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // ASYNC EVENT HANDLER
  // ============================================================================

  /**
   * Async event handler wrapper
   * Adds loading states and error handling to async handlers
   *
   * @param {Function} handler - Async handler function
   * @param {Object} options - Options (errorHandler, loadingClass, loadingAttribute)
   * @returns {Function} Wrapped async handler
   */
  function asyncHandler(handler, options = {}) {
    const {
      errorHandler = null,
      loadingClass = 'loading',
      loadingAttribute = 'data-loading'
    } = options;

    return async function(event, ...args) {
      if (typeof handler !== 'function') {
        console.error('[Async Forms] asyncHandler: handler must be a function');
        return;
      }

      const element = event.target || event.currentTarget;

      // Add loading state
      try {
        if (element) {
          if (loadingClass) {
            element.classList.add(loadingClass);
          }
          if (loadingAttribute) {
            element.setAttribute(loadingAttribute, 'true');
          }
        }
      } catch (e) {
        console.warn('[Async Forms] Failed to set loading state:', e.message);
      }

      try {
        const result = await handler.call(this, event, ...args);
        return result;
      } catch (error) {
        console.error('[Async Forms] Error in async handler:', error);

        if (errorHandler && typeof errorHandler === 'function') {
          try {
            errorHandler(error, event, ...args);
          } catch (e) {
            console.error('[Async Forms] Error in error handler:', e);
          }
        }

        throw error;
      } finally {
        // Remove loading state
        try {
          if (element) {
            if (loadingClass) {
              element.classList.remove(loadingClass);
            }
            if (loadingAttribute) {
              element.removeAttribute(loadingAttribute);
            }
          }
        } catch (e) {
          console.warn('[Async Forms] Failed to remove loading state:', e.message);
        }
      }
    };
  }

  // ============================================================================
  // FORM VALIDATION
  // ============================================================================

  /**
   * Form validation utility
   *
   * @param {HTMLFormElement} form - Form element
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation result { isValid, errors }
   */
  function validateForm(form, rules = {}) {
    if (!form || !form.elements) {
      return { isValid: false, errors: ['Invalid form element'] };
    }

    const errors = [];
    const elements = Array.from(form.elements);

    elements.forEach(element => {
      const name = element.name;
      if (!name || !rules[name]) return;

      const rule = rules[name];
      const value = element.value.trim();

      // Required validation
      if (rule.required && !value) {
        errors.push(`${rule.label || name} is required`);
        element.classList.add('error');
        return;
      }

      // Skip other validations if empty and not required
      if (!value) return;

      // Type validations
      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`${rule.label || name} must be a valid email`);
        element.classList.add('error');
      }

      if (rule.type === 'url' && !/^https?:\/\/.+/.test(value)) {
        errors.push(`${rule.label || name} must be a valid URL`);
        element.classList.add('error');
      }

      if (rule.type === 'number' && isNaN(parseFloat(value))) {
        errors.push(`${rule.label || name} must be a number`);
        element.classList.add('error');
      }

      // Length validations
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.label || name} must be at least ${rule.minLength} characters`);
        element.classList.add('error');
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.label || name} must be no more than ${rule.maxLength} characters`);
        element.classList.add('error');
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(rule.message || `${rule.label || name} format is invalid`);
        element.classList.add('error');
      }

      // Custom validation
      if (rule.validator && typeof rule.validator === 'function') {
        try {
          const customResult = rule.validator(value, element);
          if (customResult !== true && typeof customResult === 'string') {
            errors.push(customResult);
            element.classList.add('error');
          }
        } catch (e) {
          console.warn('[Async Forms] Error in custom validator:', e.message);
        }
      }

      // Remove error class if no errors for this field
      if (!errors.some(error => error.includes(rule.label || name))) {
        element.classList.remove('error');
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ============================================================================
  // FORM DATA EXTRACTION
  // ============================================================================

  /**
   * Extract form data as object
   *
   * @param {HTMLFormElement} form - Form element
   * @param {Object} options - Options (includeEmpty, transform, excludeDisabled)
   * @returns {Object} Form data
   */
  function getFormData(form, options = {}) {
    if (!form || !form.elements) {
      return {};
    }

    const {
      includeEmpty = false,
      transform = null,
      excludeDisabled = true
    } = options;

    const data = {};
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      const element = form.elements[key];

      // Skip disabled elements if specified
      if (excludeDisabled && element && element.disabled) {
        continue;
      }

      // Skip empty values if not including them
      if (!includeEmpty && (!value || value.toString().trim() === '')) {
        continue;
      }

      // Handle multiple values (checkboxes, multi-select)
      if (data.hasOwnProperty(key)) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Apply transformation if provided
    if (transform && typeof transform === 'function') {
      try {
        return transform(data);
      } catch (e) {
        console.warn('[Async Forms] Error in form data transformation:', e.message);
        return data;
      }
    }

    return data;
  }

  // ============================================================================
  // FORM MESSAGE DISPLAY
  // ============================================================================

  /**
   * Show form message utility
   *
   * @param {HTMLFormElement} form - Form element
   * @param {string} message - Message to display
   * @param {string} type - Message type (info, success, error, warning)
   * @param {Object} options - Options (duration, className, container)
   * @returns {HTMLElement} Message element
   */
  function showFormMessage(form, message, type = 'info', options = {}) {
    const {
      duration = 5000,
      className = 'form-message',
      container = null
    } = options;

    // Find or create message container
    let messageElement = container || form.querySelector(`.${className}`);

    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = `${className} ${className}--${type}`;

      // Insert at the beginning of the form
      if (form.firstChild) {
        form.insertBefore(messageElement, form.firstChild);
      } else {
        form.appendChild(messageElement);
      }
    } else {
      messageElement.className = `${className} ${className}--${type}`;
    }

    messageElement.textContent = message;
    messageElement.style.display = 'block';

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        if (messageElement && messageElement.parentNode) {
          messageElement.style.display = 'none';
        }
      }, duration);
    }

    return messageElement;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AsyncForms = {
    // Async handler
    asyncHandler,

    // Form validation
    validateForm,

    // Form data
    getFormData,

    // Form messages
    showFormMessage,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  // Export to global namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Create AsyncHelpers namespace if it doesn't exist
    if (!globalObj.AsyncHelpers) {
      globalObj.AsyncHelpers = {};
    }

    // Attach forms utilities
    globalObj.AsyncHelpers.forms = AsyncForms;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Async Forms] v2.0.0 initialized');
  }

  return AsyncForms;
});
