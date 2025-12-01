/**
 * DOM Helpers - Async Core Module
 *
 * Core async utilities including debounce, throttle, sanitization,
 * and parallel request management.
 *
 * Features:
 * - Debounce with cancel, flush, and maxWait
 * - Throttle with leading and trailing options
 * - Input sanitization for XSS protection
 * - Sleep utility
 * - Parallel request utilities (parallelAll, raceWithTimeout)
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
    global.DOMHelpersAsyncCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEBOUNCE
  // ============================================================================

  /**
   * Debounce function - delays execution until after delay has passed since last call
   *
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @param {Object} options - Options (immediate, maxWait)
   * @returns {Function} Debounced function with cancel and flush methods
   */
  function debounce(func, delay = 300, options = {}) {
    if (typeof func !== 'function') {
      throw new Error('[Async Core] debounce: func must be a function');
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

    /**
     * Cancel pending execution
     */
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

    /**
     * Immediately execute pending call
     */
    debounced.flush = function(...args) {
      if (timeoutId || maxTimeoutId) {
        const result = func.apply(this, args);
        debounced.cancel();
        return result;
      }
    };

    return debounced;
  }

  // ============================================================================
  // THROTTLE
  // ============================================================================

  /**
   * Throttle function - ensures function is called at most once per delay period
   *
   * @param {Function} func - Function to throttle
   * @param {number} delay - Delay in milliseconds
   * @param {Object} options - Options (leading, trailing)
   * @returns {Function} Throttled function with cancel method
   */
  function throttle(func, delay = 200, options = {}) {
    if (typeof func !== 'function') {
      throw new Error('[Async Core] throttle: func must be a function');
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

    /**
     * Cancel pending execution
     */
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

  // ============================================================================
  // SANITIZATION
  // ============================================================================

  /**
   * Input sanitization for XSS protection
   *
   * @param {string} input - Input string to sanitize
   * @param {Object} options - Sanitization options
   * @returns {string} Sanitized string
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

  // ============================================================================
  // SLEEP
  // ============================================================================

  /**
   * Sleep/delay utility
   *
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after delay
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // PARALLEL UTILITIES
  // ============================================================================

  /**
   * Enhanced Promise.all with progress tracking
   *
   * @param {Array<Promise>} promises - Array of promises
   * @param {Object} options - Options (onProgress, failFast)
   * @returns {Promise} Promise that resolves with results
   */
  async function parallelAll(promises, options = {}) {
    const {
      onProgress = null,
      failFast = true
    } = options;

    if (!Array.isArray(promises)) {
      throw new Error('[Async Core] parallelAll: promises must be an array');
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
          console.warn('[Async Core] Error in progress callback:', e.message);
        }
      }
    }

    return results;
  }

  /**
   * Promise race with timeout
   *
   * @param {Array<Promise>} promises - Array of promises
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise} Promise that resolves with first result or times out
   */
  async function raceWithTimeout(promises, timeout = 5000) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeout);
    });

    return Promise.race([...promises, timeoutPromise]);
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AsyncCore = {
    // Core utilities
    debounce,
    throttle,
    sanitize,
    sleep,

    // Parallel utilities
    parallelAll,
    raceWithTimeout,

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

    // Attach core utilities
    globalObj.AsyncHelpers.core = AsyncCore;

    // Also export individual utilities for convenience
    globalObj.debounce = debounce;
    globalObj.throttle = throttle;
    globalObj.sanitize = sanitize;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Async Core] v2.0.0 initialized');
  }

  return AsyncCore;
});
