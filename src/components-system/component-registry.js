/**
 * DOM Helpers - Component Registry Module
 *
 * Component registration, lookup, and management system.
 *
 * Features:
 * - Component registration with validation
 * - Component lookup and retrieval
 * - Namespace support
 * - Component versioning
 * - Hot reload support
 * - Registration hooks
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
    global.DOMHelpersComponentRegistry = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // COMPONENT REGISTRY
  // ============================================================================

  const componentRegistry = new Map();
  const componentMetadata = new Map();
  const namespaces = new Map();
  const registrationHooks = [];

  /**
   * Register a component
   */
  function register(name, definition, options = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('[Component Registry] Component name must be a non-empty string');
    }

    if (!definition) {
      throw new Error('[Component Registry] Component definition is required');
    }

    const {
      namespace = null,
      version = '1.0.0',
      replace = false,
      metadata = {}
    } = options;

    // Check if already registered
    if (componentRegistry.has(name) && !replace) {
      console.warn(`[Component Registry] Component "${name}" is already registered. Use replace: true to override.`);
      return false;
    }

    // Validate definition
    if (!_validateDefinition(definition)) {
      throw new Error(`[Component Registry] Invalid component definition for "${name}"`);
    }

    // Store component
    componentRegistry.set(name, definition);

    // Store metadata
    componentMetadata.set(name, {
      name,
      version,
      namespace,
      registeredAt: Date.now(),
      ...metadata
    });

    // Add to namespace if specified
    if (namespace) {
      if (!namespaces.has(namespace)) {
        namespaces.set(namespace, new Set());
      }
      namespaces.get(namespace).add(name);
    }

    // Call registration hooks
    _callRegistrationHooks(name, definition, options);

    console.log(`[Component Registry] Component "${name}" registered successfully`);
    return true;
  }

  /**
   * Validate component definition
   */
  function _validateDefinition(definition) {
    // String definition (HTML)
    if (typeof definition === 'string') {
      return definition.trim().length > 0;
    }

    // Object definition
    if (typeof definition === 'object' && definition !== null) {
      // Must have at least template or render method
      return definition.template || definition.render;
    }

    return false;
  }

  /**
   * Call registration hooks
   */
  function _callRegistrationHooks(name, definition, options) {
    registrationHooks.forEach(hook => {
      try {
        hook(name, definition, options);
      } catch (error) {
        console.error('[Component Registry] Error in registration hook:', error);
      }
    });
  }

  /**
   * Unregister a component
   */
  function unregister(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }

    const existed = componentRegistry.delete(name);

    if (existed) {
      // Remove metadata
      const meta = componentMetadata.get(name);
      componentMetadata.delete(name);

      // Remove from namespace
      if (meta && meta.namespace) {
        const ns = namespaces.get(meta.namespace);
        if (ns) {
          ns.delete(name);
          if (ns.size === 0) {
            namespaces.delete(meta.namespace);
          }
        }
      }

      console.log(`[Component Registry] Component "${name}" unregistered`);
    }

    return existed;
  }

  /**
   * Get component definition
   */
  function get(name) {
    return componentRegistry.get(name);
  }

  /**
   * Check if component is registered
   */
  function has(name) {
    return componentRegistry.has(name);
  }

  /**
   * Get all registered component names
   */
  function getAll() {
    return Array.from(componentRegistry.keys());
  }

  /**
   * Get component metadata
   */
  function getMetadata(name) {
    return componentMetadata.get(name);
  }

  /**
   * Get components by namespace
   */
  function getByNamespace(namespace) {
    const ns = namespaces.get(namespace);
    return ns ? Array.from(ns) : [];
  }

  /**
   * Get all namespaces
   */
  function getNamespaces() {
    return Array.from(namespaces.keys());
  }

  /**
   * Register multiple components
   */
  function registerBulk(components) {
    const results = [];

    for (const [name, definition] of Object.entries(components)) {
      try {
        const success = register(name, definition);
        results.push({ name, success });
      } catch (error) {
        console.error(`[Component Registry] Error registering "${name}":`, error);
        results.push({ name, success: false, error });
      }
    }

    return results;
  }

  /**
   * Unregister multiple components
   */
  function unregisterBulk(names) {
    const results = [];

    for (const name of names) {
      const success = unregister(name);
      results.push({ name, success });
    }

    return results;
  }

  /**
   * Clear all components (optionally by namespace)
   */
  function clear(namespace = null) {
    if (namespace) {
      const components = getByNamespace(namespace);
      return unregisterBulk(components);
    }

    componentRegistry.clear();
    componentMetadata.clear();
    namespaces.clear();
    console.log('[Component Registry] All components cleared');
    return true;
  }

  /**
   * Add registration hook
   */
  function addRegistrationHook(hook) {
    if (typeof hook !== 'function') {
      throw new Error('[Component Registry] Hook must be a function');
    }
    registrationHooks.push(hook);
  }

  /**
   * Remove registration hook
   */
  function removeRegistrationHook(hook) {
    const index = registrationHooks.indexOf(hook);
    if (index > -1) {
      registrationHooks.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get registry statistics
   */
  function getStats() {
    return {
      total: componentRegistry.size,
      namespaces: namespaces.size,
      components: getAll(),
      byNamespace: Array.from(namespaces.entries()).map(([ns, components]) => ({
        namespace: ns,
        count: components.size,
        components: Array.from(components)
      }))
    };
  }

  /**
   * Search components by pattern
   */
  function search(pattern) {
    const regex = new RegExp(pattern, 'i');
    return getAll().filter(name => regex.test(name));
  }

  /**
   * Export components for backup/transfer
   */
  function exportComponents(names = null) {
    const toExport = names || getAll();
    const exported = {};

    toExport.forEach(name => {
      if (componentRegistry.has(name)) {
        exported[name] = {
          definition: componentRegistry.get(name),
          metadata: componentMetadata.get(name)
        };
      }
    });

    return exported;
  }

  /**
   * Import components from backup
   */
  function importComponents(data, options = {}) {
    const { replace = false, namespace = null } = options;
    const results = [];

    for (const [name, { definition, metadata }] of Object.entries(data)) {
      try {
        const success = register(name, definition, {
          ...metadata,
          namespace: namespace || metadata.namespace,
          replace
        });
        results.push({ name, success });
      } catch (error) {
        console.error(`[Component Registry] Error importing "${name}":`, error);
        results.push({ name, success: false, error });
      }
    }

    return results;
  }

  /**
   * Clone a component with a new name
   */
  function clone(sourceName, targetName, options = {}) {
    if (!has(sourceName)) {
      throw new Error(`[Component Registry] Source component "${sourceName}" not found`);
    }

    const definition = get(sourceName);
    const metadata = getMetadata(sourceName);

    return register(targetName, definition, {
      ...options,
      metadata: {
        ...metadata,
        clonedFrom: sourceName,
        clonedAt: Date.now()
      }
    });
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentRegistry = {
    // Core operations
    register,
    unregister,
    get,
    has,
    getAll,

    // Metadata
    getMetadata,

    // Namespace operations
    getByNamespace,
    getNamespaces,

    // Bulk operations
    registerBulk,
    unregisterBulk,
    clear,

    // Hooks
    addRegistrationHook,
    removeRegistrationHook,

    // Utilities
    getStats,
    search,
    exportComponents,
    importComponents,
    clone,

    // Direct access (for advanced use)
    componentRegistry,
    componentMetadata,
    namespaces,

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

    globalObj.ComponentHelpers.registry = ComponentRegistry;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Registry] v2.0.0 initialized');
  }

  return ComponentRegistry;
});
