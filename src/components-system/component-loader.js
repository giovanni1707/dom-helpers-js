/**
 * DOM Helpers - Component Loader Module
 *
 * Component loading, lazy loading, caching, and dynamic imports.
 *
 * Features:
 * - Load components from external files
 * - Lazy loading with dynamic imports
 * - Component caching
 * - Preloading support
 * - Loading states and indicators
 * - Batch loading
 * - CDN support
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
    global.DOMHelpersComponentLoader = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let ComponentRegistry;

  // Try to load from require
  if (typeof require !== 'undefined') {
    try {
      ComponentRegistry = require('./component-registry.js');
    } catch (e) {
      // Not available
    }
  }

  // Try global
  if (!ComponentRegistry) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    ComponentRegistry = globalObj.ComponentHelpers?.registry;
  }

  if (!ComponentRegistry) {
    console.error('[Component Loader] component-registry.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // LOADER STATE
  // ============================================================================

  const loadingCache = new Map();
  const componentCache = new Map();
  const loadingPromises = new Map();

  let config = {
    baseURL: '',
    extension: '.html',
    cache: true,
    timeout: 10000,
    retries: 2
  };

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Configure loader
   */
  function configure(options = {}) {
    config = { ...config, ...options };
    return config;
  }

  /**
   * Get current configuration
   */
  function getConfig() {
    return { ...config };
  }

  // ============================================================================
  // LOADING FUNCTIONS
  // ============================================================================

  /**
   * Load component from URL
   */
  async function load(name, url, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('[Component Loader] Component name is required');
    }

    if (!url || typeof url !== 'string') {
      throw new Error('[Component Loader] URL is required');
    }

    const {
      cache = config.cache,
      timeout = config.timeout,
      retries = config.retries,
      register = true
    } = options;

    // Check cache
    if (cache && componentCache.has(name)) {
      console.log(`[Component Loader] Component "${name}" loaded from cache`);
      return componentCache.get(name);
    }

    // Check if already loading
    if (loadingPromises.has(name)) {
      console.log(`[Component Loader] Waiting for "${name}" to finish loading...`);
      return loadingPromises.get(name);
    }

    // Start loading
    const loadPromise = _loadWithRetry(url, retries, timeout);
    loadingPromises.set(name, loadPromise);

    try {
      const content = await loadPromise;

      // Cache if enabled
      if (cache) {
        componentCache.set(name, content);
      }

      // Register if enabled
      if (register) {
        ComponentRegistry.register(name, content);
      }

      console.log(`[Component Loader] Component "${name}" loaded successfully`);
      return content;

    } catch (error) {
      console.error(`[Component Loader] Failed to load component "${name}" from ${url}:`, error);
      throw error;

    } finally {
      loadingPromises.delete(name);
    }
  }

  /**
   * Load with retry logic
   */
  async function _loadWithRetry(url, retries, timeout) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await _fetchWithTimeout(url, timeout);
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          console.warn(`[Component Loader] Retry ${attempt + 1}/${retries} for ${url}`);
          await _sleep(1000 * (attempt + 1)); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  /**
   * Fetch with timeout
   */
  async function _fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();

    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Sleep utility
   */
  function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // LAZY LOADING
  // ============================================================================

  /**
   * Lazy load component (load when needed)
   */
  function lazy(name, url, options = {}) {
    return {
      name,
      url,
      loaded: false,
      component: null,

      async load() {
        if (!this.loaded) {
          this.component = await load(name, url, options);
          this.loaded = true;
        }
        return this.component;
      }
    };
  }

  /**
   * Preload component (load in background)
   */
  async function preload(name, url, options = {}) {
    return load(name, url, { ...options, register: false });
  }

  /**
   * Batch load multiple components
   */
  async function loadBatch(components, options = {}) {
    const {
      parallel = true,
      onProgress = null
    } = options;

    const results = [];
    let completed = 0;

    if (parallel) {
      // Load in parallel
      const promises = components.map(async ({ name, url, ...opts }) => {
        try {
          const content = await load(name, url, { ...options, ...opts });
          completed++;
          if (onProgress) onProgress(completed, components.length, name);
          return { name, success: true, content };
        } catch (error) {
          completed++;
          if (onProgress) onProgress(completed, components.length, name);
          return { name, success: false, error };
        }
      });

      return Promise.all(promises);

    } else {
      // Load sequentially
      for (const { name, url, ...opts } of components) {
        try {
          const content = await load(name, url, { ...options, ...opts });
          results.push({ name, success: true, content });
        } catch (error) {
          results.push({ name, success: false, error });
        }

        completed++;
        if (onProgress) onProgress(completed, components.length, name);
      }

      return results;
    }
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Get cached component
   */
  function getFromCache(name) {
    return componentCache.get(name);
  }

  /**
   * Check if component is cached
   */
  function isCached(name) {
    return componentCache.has(name);
  }

  /**
   * Clear cache for specific component or all
   */
  function clearCache(name = null) {
    if (name) {
      return componentCache.delete(name);
    }
    componentCache.clear();
    return true;
  }

  /**
   * Get cache size
   */
  function getCacheSize() {
    return componentCache.size;
  }

  /**
   * Get all cached components
   */
  function getCachedComponents() {
    return Array.from(componentCache.keys());
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  /**
   * Check if component is currently loading
   */
  function isLoading(name) {
    return loadingPromises.has(name);
  }

  /**
   * Get all currently loading components
   */
  function getLoadingComponents() {
    return Array.from(loadingPromises.keys());
  }

  /**
   * Wait for all loading to complete
   */
  async function waitForAll() {
    const promises = Array.from(loadingPromises.values());
    return Promise.allSettled(promises);
  }

  // ============================================================================
  // URL HELPERS
  // ============================================================================

  /**
   * Resolve component URL
   */
  function resolveURL(name, options = {}) {
    const {
      baseURL = config.baseURL,
      extension = config.extension
    } = options;

    // Absolute URL
    if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('//')) {
      return name;
    }

    // Relative URL with extension
    if (name.includes('.')) {
      return baseURL ? `${baseURL}/${name}` : name;
    }

    // Component name - convert to path
    // UserCard -> user-card.html
    const fileName = name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();

    return baseURL
      ? `${baseURL}/${fileName}${extension}`
      : `${fileName}${extension}`;
  }

  /**
   * Load from name (resolves URL automatically)
   */
  async function loadByName(name, options = {}) {
    const url = resolveURL(name, options);
    return load(name, url, options);
  }

  // ============================================================================
  // DYNAMIC IMPORTS (ES6)
  // ============================================================================

  /**
   * Load component using dynamic import (if supported)
   */
  async function loadModule(name, modulePath, options = {}) {
    if (typeof import !== 'function') {
      throw new Error('[Component Loader] Dynamic imports not supported in this environment');
    }

    try {
      const module = await import(modulePath);

      // Extract component definition
      const definition = module.default || module[name];

      if (!definition) {
        throw new Error(`Component "${name}" not found in module`);
      }

      // Register
      const { register = true } = options;
      if (register) {
        ComponentRegistry.register(name, definition);
      }

      return definition;

    } catch (error) {
      console.error(`[Component Loader] Failed to load module for "${name}":`, error);
      throw error;
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get loader statistics
   */
  function getStats() {
    return {
      cached: componentCache.size,
      loading: loadingPromises.size,
      cachedComponents: getCachedComponents(),
      loadingComponents: getLoadingComponents()
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentLoader = {
    // Configuration
    configure,
    getConfig,

    // Loading
    load,
    loadByName,
    loadBatch,
    loadModule,

    // Lazy loading
    lazy,
    preload,

    // Cache
    getFromCache,
    isCached,
    clearCache,
    getCacheSize,
    getCachedComponents,

    // Loading state
    isLoading,
    getLoadingComponents,
    waitForAll,

    // Utilities
    resolveURL,
    getStats,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (!globalObj.ComponentHelpers) {
      globalObj.ComponentHelpers = {};
    }

    globalObj.ComponentHelpers.loader = ComponentLoader;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Loader] v2.0.0 initialized');
  }

  return ComponentLoader;
});
