/**
 * DOM Helpers Async Module
 * High-performance vanilla JavaScript async utilities with seamless DOM integration
 * 
 * Features:
 * - Debounce & Throttle utilities
 * - Enhanced Fetch with error handling, retries, timeouts
 * - Form submission helpers with validation
 * - Input sanitization for XSS protection
 * - Async event handlers
 * - Parallel request management
 * - Full integration with Elements, Collections, and Selector
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== CORE ASYNC UTILITIES =====

  /**
   * Debounce function - delays execution until after delay has passed since last call
   */
  function debounce(func, delay = 300, options = {}) {
    if (typeof func !== 'function') {
      throw new Error('[DOM Helpers Async] debounce: func must be a function');
    }

    const { immediate = false, maxWait = null } = options;
    let timeoutId = null;
    let maxTimeoutId = null;
    let lastCallTime = null;

    const debounced = function(...args) {
      const callNow = immediate && !timeoutId;
      const now = Date.now();
      
      if (lastCallTime === null) {
        lastCallTime = now;
      }

      const clearTimeouts = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
          maxTimeoutId = null;
        }
      };

      const execute = () => {
        lastCallTime = null;
        clearTimeouts();
        return func.apply(this, args);
      };

      clearTimeouts();

      if (callNow) {
        return execute();
      }

      timeoutId = setTimeout(execute, delay);

      // Handle maxWait if specified
      if (maxWait && (now - lastCallTime >= maxWait)) {
        return execute();
      } else if (maxWait && !maxTimeoutId) {
        maxTimeoutId = setTimeout(execute, maxWait - (now - lastCallTime));
      }
    };

    debounced.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = null;
      }
      lastCallTime = null;
    };

    debounced.flush = function(...args) {
      if (timeoutId || maxTimeoutId) {
        const result = func.apply(this, args);
        debounced.cancel();
        return result;
      }
    };

    return debounced;
  }

  /**
   * Throttle function - ensures function is called at most once per delay period
   */
  function throttle(func, delay = 200, options = {}) {
    if (typeof func !== 'function') {
      throw new Error('[DOM Helpers Async] throttle: func must be a function');
    }

    const { leading = true, trailing = true } = options;
    let lastCallTime = null;
    let timeoutId = null;
    let result = null;

    const throttled = function(...args) {
      const now = Date.now();
      
      if (!lastCallTime && !leading) {
        lastCallTime = now;
      }

      const remaining = delay - (now - (lastCallTime || 0));

      if (remaining <= 0 || remaining > delay) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastCallTime = now;
        result = func.apply(this, args);
      } else if (!timeoutId && trailing) {
        timeoutId = setTimeout(() => {
          lastCallTime = !leading ? null : Date.now();
          timeoutId = null;
          result = func.apply(this, args);
        }, remaining);
      }

      return result;
    };

    throttled.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = null;
      result = null;
    };

    return throttled;
  }

  /**
   * Input sanitization for XSS protection
   */
  function sanitize(input, options = {}) {
    if (typeof input !== 'string') {
      return input;
    }

    const {
      allowedTags = [],
      allowedAttributes = [],
      removeScripts = true,
      removeEvents = true,
      removeStyles = false
    } = options;

    let sanitized = input;

    // Remove script tags and their content
    if (removeScripts) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }

    // Remove event attributes
    if (removeEvents) {
      sanitized = sanitized.replace(/\s*on[a-z]+\s*=\s*["'][^"']*["']/gi, '');
    }

    // Remove style attributes if specified
    if (removeStyles) {
      sanitized = sanitized.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
    }

    // If specific tags are allowed, remove all others
    if (allowedTags.length > 0) {
      const allowedTagsRegex = new RegExp(`<(?!/?(?:${allowedTags.join('|')})\\b)[^>]+>`, 'gi');
      sanitized = sanitized.replace(allowedTagsRegex, '');
    } else {
      // Basic HTML entity encoding for common XSS vectors
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    return sanitized;
  }

  /**
   * Sleep/delay utility
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== FETCH UTILITIES =====

  /**
   * Enhanced fetch with retries, timeout, and loading indicators
   */
  async function enhancedFetch(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      timeout = 10000,
      retries = 0,
      retryDelay = 1000,
      loadingIndicator = null,
      onSuccess = null,
      onError = null,
      onStart = null,
      onFinally = null,
      signal = null
    } = options;

    // Show loading indicator
    if (loadingIndicator) {
      try {
        if (loadingIndicator.style) {
          loadingIndicator.style.display = 'block';
        } else if (loadingIndicator.update) {
          loadingIndicator.update({ style: { display: 'block' } });
        }
      } catch (e) {
        console.warn('[DOM Helpers Async] Failed to show loading indicator:', e.message);
      }
    }

    // Call onStart callback
    if (onStart && typeof onStart === 'function') {
      try {
        onStart();
      } catch (e) {
        console.warn('[DOM Helpers Async] Error in onStart callback:', e.message);
      }
    }

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    let lastError = null;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        // Create timeout controller
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

        // Combine signals if provided
        const combinedController = new AbortController();
        if (signal) {
          signal.addEventListener('abort', () => combinedController.abort());
        }
        timeoutController.signal.addEventListener('abort', () => combinedController.abort());

        fetchOptions.signal = combinedController.signal;

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Hide loading indicator
        if (loadingIndicator) {
          try {
            if (loadingIndicator.style) {
              loadingIndicator.style.display = 'none';
            } else if (loadingIndicator.update) {
              loadingIndicator.update({ style: { display: 'none' } });
            }
          } catch (e) {
            console.warn('[DOM Helpers Async] Failed to hide loading indicator:', e.message);
          }
        }

        // Call success callback
        if (onSuccess && typeof onSuccess === 'function') {
          try {
            onSuccess(data, response);
          } catch (e) {
            console.warn('[DOM Helpers Async] Error in onSuccess callback:', e.message);
          }
        }

        // Call finally callback
        if (onFinally && typeof onFinally === 'function') {
          try {
            onFinally();
          } catch (e) {
            console.warn('[DOM Helpers Async] Error in onFinally callback:', e.message);
          }
        }

        return data;

      } catch (error) {
        lastError = error;
        attempt++;

        if (attempt <= retries) {
          await sleep(retryDelay * attempt); // Exponential backoff
        }
      }
    }

    // Hide loading indicator on error
    if (loadingIndicator) {
      try {
        if (loadingIndicator.style) {
          loadingIndicator.style.display = 'none';
        } else if (loadingIndicator.update) {
          loadingIndicator.update({ style: { display: 'none' } });
        }
      } catch (e) {
        console.warn('[DOM Helpers Async] Failed to hide loading indicator:', e.message);
      }
    }

    // Call error callback
    if (onError && typeof onError === 'function') {
      try {
        onError(lastError);
      } catch (e) {
        console.warn('[DOM Helpers Async] Error in onError callback:', e.message);
      }
    }

    // Call finally callback
    if (onFinally && typeof onFinally === 'function') {
      try {
        onFinally();
      } catch (e) {
        console.warn('[DOM Helpers Async] Error in onFinally callback:', e.message);
      }
    }

    throw lastError;
  }

  /**
   * Convenience methods for different response types
   */
  async function fetchJSON(url, options = {}) {
    return enhancedFetch(url, options);
  }

  async function fetchText(url, options = {}) {
    const response = await enhancedFetch(url, { ...options, parseJSON: false });
    return response.text();
  }

  async function fetchBlob(url, options = {}) {
    const response = await enhancedFetch(url, { ...options, parseJSON: false });
    return response.blob();
  }

  // ===== FORM UTILITIES =====

  /**
   * Async event handler wrapper
   */
  function asyncHandler(handler, options = {}) {
    const { 
      errorHandler = null,
      loadingClass = 'loading',
      loadingAttribute = 'data-loading'
    } = options;

    return async function(event, ...args) {
      if (typeof handler !== 'function') {
        console.error('[DOM Helpers Async] asyncHandler: handler must be a function');
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
        console.warn('[DOM Helpers Async] Failed to set loading state:', e.message);
      }

      try {
        const result = await handler.call(this, event, ...args);
        return result;
      } catch (error) {
        console.error('[DOM Helpers Async] Error in async handler:', error);
        
        if (errorHandler && typeof errorHandler === 'function') {
          try {
            errorHandler(error, event, ...args);
          } catch (e) {
            console.error('[DOM Helpers Async] Error in error handler:', e);
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
          console.warn('[DOM Helpers Async] Failed to remove loading state:', e.message);
        }
      }
    };
  }

  /**
   * Form validation utility
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
          console.warn('[DOM Helpers Async] Error in custom validator:', e.message);
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

  /**
   * Extract form data as object
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
        console.warn('[DOM Helpers Async] Error in form data transformation:', e.message);
        return data;
      }
    }

    return data;
  }

  /**
   * Show form message utility
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

  // ===== PARALLEL REQUESTS =====

  /**
   * Enhanced Promise.all with progress tracking
   */
  async function parallelAll(promises, options = {}) {
    const { 
      onProgress = null,
      failFast = true 
    } = options;

    if (!Array.isArray(promises)) {
      throw new Error('[DOM Helpers Async] parallelAll: promises must be an array');
    }

    if (failFast) {
      return Promise.all(promises);
    }

    const results = [];
    let completed = 0;

    for (let i = 0; i < promises.length; i++) {
      try {
        const result = await promises[i];
        results[i] = { status: 'fulfilled', value: result };
      } catch (error) {
        results[i] = { status: 'rejected', reason: error };
      }
      
      completed++;
      
      if (onProgress && typeof onProgress === 'function') {
        try {
          onProgress(completed, promises.length, results[i]);
        } catch (e) {
          console.warn('[DOM Helpers Async] Error in progress callback:', e.message);
        }
      }
    }

    return results;
  }

  /**
   * Promise race with timeout
   */
  async function raceWithTimeout(promises, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeout);
    });

    return Promise.race([...promises, timeoutPromise]);
  }

  // ===== INTEGRATION WITH DOM HELPERS =====

  /**
   * Enhance Elements, Collections, and Selector with async methods
   */
  function integrateWithDOMHelpers() {
    // Add async methods to global scope for use in .update()
    if (typeof global !== 'undefined') {
      // Make utilities available globally for .update() integration
      global.AsyncHelpers = {
        debounce,
        throttle,
        sanitize,
        sleep,
        fetch: enhancedFetch,
        fetchJSON,
        fetchText,
        fetchBlob,
        asyncHandler,
        validateForm,
        getFormData,
        showFormMessage,
        parallelAll,
        raceWithTimeout
      };

      // Extend Elements if available
      if (global.Elements) {
        Object.assign(global.Elements, {
          debounce,
          throttle,
          sanitize,
          sleep,
          fetch: enhancedFetch,
          fetchJSON,
          fetchText,
          fetchBlob,
          asyncHandler,
          validateForm: (form, rules) => validateForm(form, rules),
          getFormData: (form, options) => getFormData(form, options),
          showFormMessage: (form, message, type, options) => showFormMessage(form, message, type, options),
          parallelAll,
          raceWithTimeout
        });

        // Add form-specific methods to elements
        if (global.Elements.helper && global.Elements.helper._enhanceElementWithUpdate) {
          const originalEnhance = global.Elements.helper._enhanceElementWithUpdate;
          global.Elements.helper._enhanceElementWithUpdate = function(element) {
            const enhanced = originalEnhance.call(this, element);
            
            if (enhanced && enhanced.tagName === 'FORM') {
              // Add form-specific methods
              enhanced.validate = function(rules) {
                return validateForm(this, rules);
              };
              
              enhanced.getData = function(options) {
                return getFormData(this, options);
              };
              
              enhanced.showMessage = function(message, type, options) {
                return showFormMessage(this, message, type, options);
              };
              
              enhanced.submitAsync = function(options = {}) {
                const {
                  validate: shouldValidate = true,
                  validationRules = {},
                  onSuccess = null,
                  onError = null,
                  ...fetchOptions
                } = options;
                
                return asyncHandler(async (e) => {
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
                  const result = await enhancedFetch(this.action || window.location.href, {
                    method: this.method || 'POST',
                    body: data,
                    onSuccess,
                    onError,
                    ...fetchOptions
                  });
                  
                  return result;
                }).call(enhanced);
              };
            }
            
            return enhanced;
          };
        }
      }

      // Extend Collections if available
      if (global.Collections) {
        Object.assign(global.Collections, {
          debounce,
          throttle,
          sanitize,
          sleep,
          fetch: enhancedFetch,
          fetchJSON,
          fetchText,
          fetchBlob,
          asyncHandler,
          parallelAll,
          raceWithTimeout
        });
      }

      // Extend Selector if available
      if (global.Selector) {
        Object.assign(global.Selector, {
          debounce,
          throttle,
          sanitize,
          sleep,
          fetch: enhancedFetch,
          fetchJSON,
          fetchText,
          fetchBlob,
          asyncHandler,
          parallelAll,
          raceWithTimeout
        });
      }
    }
  }

  // ===== ASYNC MODULE API =====

  const AsyncModule = {
    // Core utilities
    debounce,
    throttle,
    sanitize,
    sleep,
    
    // Fetch utilities
    fetch: enhancedFetch,
    fetchJSON,
    fetchText,
    fetchBlob,
    
    // Form utilities
    asyncHandler,
    validateForm,
    getFormData,
    showFormMessage,
    
    // Parallel utilities
    parallelAll,
    raceWithTimeout,
    
    // Integration
    integrate: integrateWithDOMHelpers,
    
    // Configuration
    configure: (options = {}) => {
      // Configure default options for utilities
      const {
        debounceDelay = 300,
        throttleDelay = 200,
        fetchTimeout = 10000,
        fetchRetries = 0
      } = options;

      // Store configuration
      AsyncModule.config = {
        debounceDelay,
        throttleDelay,
        fetchTimeout,
        fetchRetries
      };

      return AsyncModule;
    },
    
    // Version and metadata
    version: '1.0.0',
    
    // Check if DOM Helpers is available
    isDOMHelpersAvailable() {
      return !!(global.Elements || global.Collections || global.Selector);
    }
  };

  // Auto-integrate with DOM Helpers if available
  if (typeof document !== 'undefined') {
    // Wait for DOM to be ready if needed
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(integrateWithDOMHelpers, 100); // Small delay to ensure Elements is ready
      });
    } else {
      setTimeout(integrateWithDOMHelpers, 100); // Small delay to ensure Elements is ready
    }
  }

  // Force immediate integration attempt
  integrateWithDOMHelpers();

  // Log integration success
  setTimeout(() => {
    if (typeof console !== 'undefined' && AsyncModule.isDOMHelpersAvailable()) {
      console.log('[DOM Helpers Async] Successfully integrated with DOM Helpers ecosystem');
    }
  }, 200);

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = AsyncModule;
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return AsyncModule;
    });
  } else {
    // Browser globals
    global.AsyncHelpers = AsyncModule;
    
    // Also make individual utilities available globally for convenience
    global.debounce = debounce;
    global.throttle = throttle;
    global.sanitize = sanitize;
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
