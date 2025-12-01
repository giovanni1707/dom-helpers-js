/**
 * DOM Helpers - Form Enhancements Module
 *
 * Advanced form submission handling with loading states, visual feedback,
 * retry logic, and reactive form bridge.
 *
 * Features:
 * - Enhanced submission with fetch integration
 * - Automatic button disabling on submit
 * - Loading states with visual feedback
 * - Success/error messages and visual states
 * - Retry logic with configurable attempts
 * - Submission queue (prevent double submits)
 * - Reactive form bridge (DOM ↔ Reactive sync)
 * - Declarative attributes (data-* configuration)
 * - Event lifecycle (formsubmitstart, formsubmitsuccess, formsubmiterror)
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
    global.DOMHelpersFormEnhancements = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let FormCore, FormValidation;

  // Try to load modules
  if (typeof require !== 'undefined') {
    try {
      FormCore = require('./form-core.js');
      FormValidation = require('./form-validation.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules
  if (!FormCore && typeof window !== 'undefined') {
    FormCore = window.Forms?.core || window.DOMHelpersFormCore;
    FormValidation = window.Forms?.validation || window.DOMHelpersFormValidation;
  } else if (!FormCore && typeof global !== 'undefined') {
    FormCore = global.Forms?.core || global.DOMHelpersFormCore;
    FormValidation = global.Forms?.validation || global.DOMHelpersFormValidation;
  }

  // Get functions from dependencies
  const getFormValues = FormCore?.getFormValues;
  const validateForm = FormValidation?.validateForm;

  // Check for ReactiveUtils
  const hasReactiveForms = typeof window !== 'undefined' && typeof window.ReactiveUtils !== 'undefined';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const defaultConfig = {
    // Submission behavior
    autoPreventDefault: true,
    autoDisableButtons: true,
    showLoadingStates: true,
    queueSubmissions: true,

    // CSS classes
    loadingClass: 'form-loading',
    buttonLoadingClass: 'button-loading',
    successClass: 'form-success',
    errorClass: 'form-error',

    // Messages
    messageTimeout: 3000,
    showSuccessMessage: true,
    showErrorMessage: true,

    // Loading indicators
    loadingText: 'Loading...',
    loadingSpinner: '⌛',
    showLoadingSpinner: true,

    // Error handling
    retryAttempts: 0,
    retryDelay: 1000,
    timeout: 30000,

    // Bridge settings
    autoSyncReactive: true,
    syncOnInput: true,
    syncOnBlur: true,

    // Debug
    enableLogging: false
  };

  let globalConfig = { ...defaultConfig };
  const submissionQueue = new Map();
  const formStates = new WeakMap();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function log(...args) {
    if (globalConfig.enableLogging) {
      console.log('[Form Enhancements]', ...args);
    }
  }

  function warn(...args) {
    console.warn('[Form Enhancements]', ...args);
  }

  function getFormState(form) {
    if (!formStates.has(form)) {
      formStates.set(form, {
        isSubmitting: false,
        submitCount: 0,
        lastSubmit: null,
        originalButtonStates: new Map(),
        reactiveForm: null,
        config: { ...globalConfig }
      });
    }
    return formStates.get(form);
  }

  function mergeConfig(formConfig, overrides = {}) {
    return { ...formConfig, ...overrides };
  }

  // ============================================================================
  // BUTTON STATE MANAGEMENT
  // ============================================================================

  function getSubmitButtons(form) {
    return Array.from(form.querySelectorAll('button[type="submit"], input[type="submit"]'));
  }

  function disableButtons(form, config) {
    const state = getFormState(form);
    const buttons = getSubmitButtons(form);

    buttons.forEach(button => {
      // Store original state
      state.originalButtonStates.set(button, {
        disabled: button.disabled,
        innerHTML: button.innerHTML,
        textContent: button.textContent
      });

      // Disable button
      button.disabled = true;
      button.classList.add(config.buttonLoadingClass);

      // Add loading indicator
      if (config.showLoadingSpinner && button.tagName === 'BUTTON') {
        const originalContent = button.innerHTML;
        button.innerHTML = `${config.loadingSpinner} ${config.loadingText}`;
        button.setAttribute('data-original-content', originalContent);
      }
    });

    log('Buttons disabled:', buttons.length);
  }

  function enableButtons(form, config) {
    const state = getFormState(form);
    const buttons = getSubmitButtons(form);

    buttons.forEach(button => {
      const originalState = state.originalButtonStates.get(button);

      if (originalState) {
        // Restore original state
        button.disabled = originalState.disabled;
        if (button.tagName === 'BUTTON') {
          const originalContent = button.getAttribute('data-original-content');
          if (originalContent) {
            button.innerHTML = originalContent;
            button.removeAttribute('data-original-content');
          } else {
            button.innerHTML = originalState.innerHTML;
          }
        }
      } else {
        button.disabled = false;
      }

      button.classList.remove(config.buttonLoadingClass);
    });

    state.originalButtonStates.clear();
    log('Buttons enabled:', buttons.length);
  }

  // ============================================================================
  // LOADING STATE MANAGEMENT
  // ============================================================================

  function addLoadingState(form, config) {
    form.classList.add(config.loadingClass);
    form.setAttribute('aria-busy', 'true');

    // Dispatch loading event
    form.dispatchEvent(new CustomEvent('formsubmitstart', {
      bubbles: true,
      detail: { form, timestamp: Date.now() }
    }));

    log('Loading state added to form:', form.id);
  }

  function removeLoadingState(form, config) {
    form.classList.remove(config.loadingClass);
    form.removeAttribute('aria-busy');

    log('Loading state removed from form:', form.id);
  }

  // ============================================================================
  // VISUAL FEEDBACK (SUCCESS/ERROR)
  // ============================================================================

  function showSuccess(form, config, message) {
    // Remove error state
    form.classList.remove(config.errorClass);

    // Add success state
    form.classList.add(config.successClass);
    form.setAttribute('data-form-state', 'success');

    // Show message if enabled
    if (config.showSuccessMessage && message) {
      showMessage(form, message, 'success', config);
    }

    // Dispatch success event
    form.dispatchEvent(new CustomEvent('formsubmitsuccess', {
      bubbles: true,
      detail: { form, message, timestamp: Date.now() }
    }));

    // Auto-remove after timeout
    if (config.messageTimeout > 0) {
      setTimeout(() => {
        form.classList.remove(config.successClass);
        form.removeAttribute('data-form-state');
        removeMessage(form);
      }, config.messageTimeout);
    }

    log('Success state shown');
  }

  function showError(form, config, error) {
    // Remove success state
    form.classList.remove(config.successClass);

    // Add error state
    form.classList.add(config.errorClass);
    form.setAttribute('data-form-state', 'error');

    // Show message if enabled
    const errorMessage = typeof error === 'string' ? error : error.message || 'Submission failed';
    if (config.showErrorMessage) {
      showMessage(form, errorMessage, 'error', config);
    }

    // Dispatch error event
    form.dispatchEvent(new CustomEvent('formsubmiterror', {
      bubbles: true,
      detail: { form, error, timestamp: Date.now() }
    }));

    // Auto-remove after timeout
    if (config.messageTimeout > 0) {
      setTimeout(() => {
        form.classList.remove(config.errorClass);
        form.removeAttribute('data-form-state');
        removeMessage(form);
      }, config.messageTimeout);
    }

    log('Error state shown:', errorMessage);
  }

  function showMessage(form, message, type, config) {
    // Remove existing message
    removeMessage(form);

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');
    messageEl.textContent = message;

    // Style the message
    Object.assign(messageEl.style, {
      padding: '12px 16px',
      marginTop: '16px',
      marginBottom: '16px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
      color: type === 'success' ? '#155724' : '#721c24',
      border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
    });

    // Insert at the beginning or end of form
    const insertPosition = form.getAttribute('data-message-position') || 'end';
    if (insertPosition === 'start') {
      form.insertBefore(messageEl, form.firstChild);
    } else {
      form.appendChild(messageEl);
    }

    log('Message shown:', message);
  }

  function removeMessage(form) {
    const messages = form.querySelectorAll('.form-message');
    messages.forEach(msg => msg.remove());
  }

  // ============================================================================
  // SUBMISSION QUEUE MANAGEMENT
  // ============================================================================

  function canSubmit(form, config) {
    if (!config.queueSubmissions) {
      return true;
    }

    const state = getFormState(form);
    return !state.isSubmitting;
  }

  function markSubmitting(form) {
    const state = getFormState(form);
    state.isSubmitting = true;
    state.lastSubmit = Date.now();
    submissionQueue.set(form, state);
  }

  function markSubmitted(form) {
    const state = getFormState(form);
    state.isSubmitting = false;
    state.submitCount++;
    submissionQueue.delete(form);
  }

  // ============================================================================
  // ERROR HANDLING WITH RETRY
  // ============================================================================

  async function handleSubmissionWithRetry(form, submitFn, config, attempt = 0) {
    try {
      const result = await submitFn();
      return { success: true, result };
    } catch (error) {
      log('Submission error:', error.message, `(attempt ${attempt + 1})`);

      // Retry logic
      if (attempt < config.retryAttempts) {
        log(`Retrying in ${config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return handleSubmissionWithRetry(form, submitFn, config, attempt + 1);
      }

      return { success: false, error };
    }
  }

  // ============================================================================
  // ENHANCED SUBMISSION HANDLER
  // ============================================================================

  async function enhancedSubmit(form, options = {}) {
    const state = getFormState(form);
    const config = mergeConfig(state.config, options);

    // Check if already submitting
    if (!canSubmit(form, config)) {
      warn('Form is already submitting');
      return { success: false, error: 'Form is already submitting' };
    }

    // Mark as submitting
    markSubmitting(form);

    // Add loading states
    if (config.showLoadingStates) {
      addLoadingState(form, config);
    }

    // Disable buttons
    if (config.autoDisableButtons) {
      disableButtons(form, config);
    }

    // Clear previous messages
    removeMessage(form);
    form.classList.remove(config.successClass, config.errorClass);

    // Get submission handler
    const submitHandler = options.onSubmit || config.onSubmit || (async (values) => {
      // Default fetch submission
      const url = form.action || options.url || window.location.href;
      const method = form.method || options.method || 'POST';

      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    });

    try {
      // Get form values
      let values = getFormValues ? getFormValues(form) : form.values || {};

      // Transform values if function provided
      if (options.transform) {
        values = options.transform(values);
      }

      // beforeSubmit hook
      if (options.beforeSubmit) {
        const shouldContinue = await options.beforeSubmit(values, form);
        if (shouldContinue === false) {
          markSubmitted(form);
          removeLoadingState(form, config);
          enableButtons(form, config);
          return { success: false, cancelled: true };
        }
      }

      // Validate if validation available and rules provided
      if (validateForm && options.validate !== false && options.validationRules) {
        const validation = validateForm(form, options.validationRules);
        if (!validation.isValid) {
          markSubmitted(form);
          removeLoadingState(form, config);
          enableButtons(form, config);
          showError(form, config, 'Validation failed');
          return { success: false, errors: validation.errors };
        }
      }

      // Validate reactive form if connected
      if (state.reactiveForm && state.reactiveForm.validate) {
        const isValid = state.reactiveForm.validate();
        if (!isValid) {
          markSubmitted(form);
          removeLoadingState(form, config);
          enableButtons(form, config);
          showError(form, config, 'Validation failed');
          return { success: false, errors: state.reactiveForm.errors };
        }
      }

      // Submit with retry
      const submitFn = () => submitHandler(values, form);
      const result = await handleSubmissionWithRetry(form, submitFn, config);

      // Handle result
      markSubmitted(form);
      removeLoadingState(form, config);
      enableButtons(form, config);

      if (result.success) {
        showSuccess(form, config, options.successMessage || 'Success!');

        // onSuccess callback
        if (options.onSuccess) {
          options.onSuccess(result.result, values);
        }

        // Reset form if requested
        if (options.resetOnSuccess) {
          setTimeout(() => {
            if (form.reset) form.reset();
            if (state.reactiveForm && state.reactiveForm.reset) {
              state.reactiveForm.reset();
            }
          }, 500);
        }

        return result;
      } else {
        showError(form, config, result.error);

        // onError callback
        if (options.onError) {
          options.onError(result.error);
        }

        return result;
      }

    } catch (error) {
      // Cleanup on error
      markSubmitted(form);
      removeLoadingState(form, config);
      enableButtons(form, config);
      showError(form, config, error);

      // onError callback
      if (options.onError) {
        options.onError(error);
      }

      log('Submission failed:', error);
      return { success: false, error };
    }
  }

  // ============================================================================
  // REACTIVE FORM BRIDGE
  // ============================================================================

  function connectReactiveForm(domForm, reactiveForm, options = {}) {
    if (!hasReactiveForms || !reactiveForm) {
      warn('Reactive forms not available or reactiveForm not provided');
      return null;
    }

    const state = getFormState(domForm);
    state.reactiveForm = reactiveForm;

    log('Connecting reactive form to DOM form:', domForm.id);

    const config = mergeConfig(state.config, options);

    // Sync DOM → Reactive on input
    if (config.syncOnInput || config.autoSyncReactive) {
      domForm.addEventListener('input', (e) => {
        const field = e.target.name || e.target.id;
        if (field && reactiveForm.setValue) {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          reactiveForm.setValue(field, value);
          log('Synced to reactive:', field, value);
        }
      });
    }

    // Sync DOM → Reactive on blur (for validation)
    if (config.syncOnBlur || config.autoSyncReactive) {
      domForm.addEventListener('blur', (e) => {
        const field = e.target.name || e.target.id;
        if (field && reactiveForm.setTouched) {
          reactiveForm.setTouched(field);
          log('Field touched in reactive:', field);
        }
      }, true); // Use capture to get blur events
    }

    log('Reactive form connected successfully');

    return {
      disconnect: () => {
        state.reactiveForm = null;
        log('Reactive form disconnected');
      }
    };
  }

  // ============================================================================
  // DECLARATIVE ATTRIBUTES HANDLER
  // ============================================================================

  function initDeclarativeForm(form) {
    const config = {
      url: form.getAttribute('data-submit-url') || form.action,
      method: form.getAttribute('data-submit-method') || form.method,
      autoDisableButtons: form.getAttribute('data-auto-disable') !== 'false',
      showLoadingStates: form.getAttribute('data-show-loading') !== 'false',
      successMessage: form.getAttribute('data-success-message'),
      errorMessage: form.getAttribute('data-error-message'),
      resetOnSuccess: form.hasAttribute('data-reset-on-success'),
      messagePosition: form.getAttribute('data-message-position') || 'end'
    };

    // Store config in form state
    const state = getFormState(form);
    state.config = mergeConfig(state.config, config);

    // Prevent default submission if enabled
    if (globalConfig.autoPreventDefault && !form.hasAttribute('data-allow-default')) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        enhancedSubmit(form, config);
      });
      log('Declarative form initialized:', form.id);
    }
  }

  // ============================================================================
  // FORM ENHANCEMENT
  // ============================================================================

  function enhanceFormWithEnhancements(form) {
    if (!form || form._hasEnhancedSubmit) {
      return form;
    }

    // Protect against double enhancement
    Object.defineProperty(form, '_hasEnhancedSubmit', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add enhanced submitData method
    form.submitData = function(options = {}) {
      return enhancedSubmit(form, options);
    };

    // Add reactive connection method
    form.connectReactive = function(reactiveForm, options = {}) {
      return connectReactiveForm(form, reactiveForm, options);
    };

    // Add configuration method
    form.configure = function(options = {}) {
      const state = getFormState(form);
      state.config = mergeConfig(state.config, options);
      return form;
    };

    return form;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const FormEnhancements = {
    // Configuration
    configure: (options) => {
      Object.assign(globalConfig, options);
      log('Configuration updated:', options);
    },

    getConfig: () => ({ ...globalConfig }),

    // Manual enhancement
    enhance: (form, options = {}) => {
      initDeclarativeForm(form);
      const state = getFormState(form);
      state.config = mergeConfig(state.config, options);
      return enhanceFormWithEnhancements(form);
    },

    // Manual submission
    submit: (form, options = {}) => {
      return enhancedSubmit(form, options);
    },

    // Bridge
    connect: (domForm, reactiveForm, options = {}) => {
      return connectReactiveForm(domForm, reactiveForm, options);
    },

    // State management
    getState: (form) => getFormState(form),
    clearQueue: () => submissionQueue.clear(),

    // Utilities
    disableButtons: (form) => disableButtons(form, globalConfig),
    enableButtons: (form) => enableButtons(form, globalConfig),
    showSuccess: (form, message) => showSuccess(form, globalConfig, message),
    showError: (form, error) => showError(form, globalConfig, error),

    // Enhancement function
    enhanceFormWithEnhancements,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  function autoInit() {
    // Initialize declarative forms
    const declarativeForms = document.querySelectorAll('form[data-enhanced]');
    declarativeForms.forEach(form => {
      initDeclarativeForm(form);
    });

    log('Auto-initialized', declarativeForms.length, 'declarative forms');
  }

  // Run auto-init when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  }

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

    // Attach enhancements
    globalObj.Forms.enhancements = FormEnhancements;
    globalObj.Forms.enhance = FormEnhancements;
    globalObj.FormEnhancements = FormEnhancements;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Form Enhancements] v2.0.0 initialized');
  }

  return FormEnhancements;
});
