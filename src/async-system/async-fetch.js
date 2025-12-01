/**
 * DOM Helpers - Async Fetch Module
 *
 * Enhanced fetch with retries, timeout, loading indicators, and callbacks.
 *
 * Features:
 * - Automatic retries with exponential backoff
 * - Configurable timeout
 * - Loading indicator support
 * - Success/error/start/finally callbacks
 * - AbortController support
 * - Convenience methods (fetchJSON, fetchText, fetchBlob)
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
    global.DOMHelpersAsyncFetch = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  // Check for sleep utility from core
  let sleep;

  if (typeof window !== 'undefined' && window.AsyncHelpers && window.AsyncHelpers.core) {
    sleep = window.AsyncHelpers.core.sleep;
  } else if (typeof global !== 'undefined' && global.AsyncHelpers && global.AsyncHelpers.core) {
    sleep = global.AsyncHelpers.core.sleep;
  }

  // Fallback sleep implementation
  if (!sleep) {
    sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // LOADING INDICATOR HELPERS
  // ============================================================================

  /**
   * Show loading indicator
   *
   * @param {HTMLElement|Object} indicator - Loading indicator element or object
   */
  function showLoadingIndicator(indicator) {
    if (!indicator) return;

    try {
      if (indicator.style) {
        indicator.style.display = 'block';
      } else if (indicator.update) {
        indicator.update({ style: { display: 'block' } });
      }
    } catch (e) {
      console.warn('[Async Fetch] Failed to show loading indicator:', e.message);
    }
  }

  /**
   * Hide loading indicator
   *
   * @param {HTMLElement|Object} indicator - Loading indicator element or object
   */
  function hideLoadingIndicator(indicator) {
    if (!indicator) return;

    try {
      if (indicator.style) {
        indicator.style.display = 'none';
      } else if (indicator.update) {
        indicator.update({ style: { display: 'none' } });
      }
    } catch (e) {
      console.warn('[Async Fetch] Failed to hide loading indicator:', e.message);
    }
  }

  // ============================================================================
  // ENHANCED FETCH
  // ============================================================================

  /**
   * Enhanced fetch with retries, timeout, and loading indicators
   *
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} Promise that resolves with data
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
    showLoadingIndicator(loadingIndicator);

    // Call onStart callback
    if (onStart && typeof onStart === 'function') {
      try {
        onStart();
      } catch (e) {
        console.warn('[Async Fetch] Error in onStart callback:', e.message);
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
        hideLoadingIndicator(loadingIndicator);

        // Call success callback
        if (onSuccess && typeof onSuccess === 'function') {
          try {
            onSuccess(data, response);
          } catch (e) {
            console.warn('[Async Fetch] Error in onSuccess callback:', e.message);
          }
        }

        // Call finally callback
        if (onFinally && typeof onFinally === 'function') {
          try {
            onFinally();
          } catch (e) {
            console.warn('[Async Fetch] Error in onFinally callback:', e.message);
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
    hideLoadingIndicator(loadingIndicator);

    // Call error callback
    if (onError && typeof onError === 'function') {
      try {
        onError(lastError);
      } catch (e) {
        console.warn('[Async Fetch] Error in onError callback:', e.message);
      }
    }

    // Call finally callback
    if (onFinally && typeof onFinally === 'function') {
      try {
        onFinally();
      } catch (e) {
        console.warn('[Async Fetch] Error in onFinally callback:', e.message);
      }
    }

    throw lastError;
  }

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  /**
   * Fetch JSON data (alias for enhancedFetch)
   *
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} Promise that resolves with JSON data
   */
  async function fetchJSON(url, options = {}) {
    return enhancedFetch(url, options);
  }

  /**
   * Fetch text data
   *
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} Promise that resolves with text
   */
  async function fetchText(url, options = {}) {
    const { headers = {}, ...rest } = options;

    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'text/plain',
        ...headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.text();
  }

  /**
   * Fetch blob data (for files/images)
   *
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} Promise that resolves with blob
   */
  async function fetchBlob(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AsyncFetch = {
    // Main fetch
    enhancedFetch,
    fetch: enhancedFetch, // Alias

    // Convenience methods
    fetchJSON,
    fetchText,
    fetchBlob,

    // Helpers
    showLoadingIndicator,
    hideLoadingIndicator,

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

    // Attach fetch utilities
    globalObj.AsyncHelpers.fetch = AsyncFetch;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Async Fetch] v2.0.0 initialized');
  }

  return AsyncFetch;
});
