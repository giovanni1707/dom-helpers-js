/**
 * DOM Helpers - Components System (Unified Entry Point)
 *
 * Complete component system with traditional HTML5 architecture.
 * Single import for all component features.
 *
 * Features:
 * - Component class with full lifecycle
 * - Component registration and management
 * - Custom tags support (<UserCard />)
 * - Auto-initialization from DOM
 * - Event bus for component communication
 * - Component utilities and helpers
 * - Lazy loading and caching
 * - Full DOM Helpers integration
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
    global.DOMHelpersComponents = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let ComponentCore, ComponentRegistry, ComponentRenderer, ComponentEvents, ComponentUtils, ComponentLoader;

  // Try to load modules via require (Node.js/bundlers)
  if (typeof require !== 'undefined') {
    try {
      ComponentCore = require('./component-core.js');
      ComponentRegistry = require('./component-registry.js');
      ComponentRenderer = require('./component-renderer.js');
      ComponentEvents = require('./component-events.js');
      ComponentUtils = require('./component-utils.js');
      ComponentLoader = require('./component-loader.js');
    } catch (e) {
      // Modules not available via require
    }
  }

  // Check for global modules (browser)
  if (!ComponentCore) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    const helpers = globalObj.ComponentHelpers || {};

    ComponentCore = helpers.core;
    ComponentRegistry = helpers.registry;
    ComponentRenderer = helpers.renderer;
    ComponentEvents = helpers.events;
    ComponentUtils = helpers.utils;
    ComponentLoader = helpers.loader;
  }

  // Verify core modules are available
  if (!ComponentCore) {
    console.error('[Components System] component-core.js not found. Please load it first.');
    return {};
  }

  if (!ComponentRegistry) {
    console.error('[Components System] component-registry.js not found. Please load it first.');
    return {};
  }

  if (!ComponentRenderer) {
    console.error('[Components System] component-renderer.js not found. Please load it first.');
    return {};
  }

  // ============================================================================
  // UNIFIED API
  // ============================================================================

  const { Component } = ComponentCore;

  const Components = {
    // Component class
    Component,

    // Registration
    register: ComponentRegistry.register,
    unregister: ComponentRegistry.unregister,
    isRegistered: ComponentRegistry.has,
    getRegistered: ComponentRegistry.getAll,
    clone: ComponentRegistry.clone,

    // Rendering
    render: ComponentRenderer.render,
    renderInline: ComponentRenderer.renderInline,
    getInstance: ComponentRenderer.getInstance,
    destroy: ComponentRenderer.destroy,
    destroyAll: ComponentRenderer.destroyAll,

    // Auto-initialization
    autoInit: ComponentRenderer.autoInit,
    processHTML: ComponentRenderer.processHTML,

    // Events (if available)
    on: ComponentEvents?.on,
    once: ComponentEvents?.once,
    off: ComponentEvents?.off,
    emit: ComponentEvents?.emit,
    emitSync: ComponentEvents?.emitSync,
    emitAsync: ComponentEvents?.emitAsync,

    // Utils (if available)
    scope: ComponentUtils?.scope,
    batchUpdate: ComponentUtils?.batchUpdate,
    createBinding: ComponentUtils?.createBinding,
    update: ComponentUtils?.enhancedUpdate,
    getStats: ComponentUtils?.getStats,
    findComponents: ComponentUtils?.findComponents,
    waitForComponent: ComponentUtils?.waitForComponent,
    debugComponent: ComponentUtils?.debugComponent,

    // Loader (if available)
    load: ComponentLoader?.load,
    loadByName: ComponentLoader?.loadByName,
    loadBatch: ComponentLoader?.loadBatch,
    lazy: ComponentLoader?.lazy,
    preload: ComponentLoader?.preload,

    // Module references
    modules: {
      core: ComponentCore,
      registry: ComponentRegistry,
      renderer: ComponentRenderer,
      events: ComponentEvents,
      utils: ComponentUtils,
      loader: ComponentLoader
    },

    // Configuration
    config: {},

    /**
     * Configure component system
     */
    configure(options = {}) {
      Components.config = { ...Components.config, ...options };

      // Configure loader if available
      if (ComponentLoader && options.loader) {
        ComponentLoader.configure(options.loader);
      }

      // Configure events if available
      if (ComponentEvents && options.events) {
        ComponentEvents.configure(options.events);
      }

      return Components;
    },

    /**
     * Check if DOM Helpers is available
     */
    isDOMHelpersAvailable() {
      const globalObj = typeof window !== 'undefined' ? window : global;
      return !!(globalObj.Elements || globalObj.Collections || globalObj.Selector);
    },

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // DOM HELPERS INTEGRATION
  // ============================================================================

  /**
   * Integrate with DOM Helpers Elements
   */
  function integrateWithDOMHelpers() {
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Extend Elements if available
    if (globalObj.Elements) {
      // Add enhanced update method
      if (ComponentUtils && ComponentUtils.enhancedUpdate) {
        const originalUpdate = globalObj.Elements.update;

        globalObj.Elements.update = function(updates) {
          // Try enhanced update first (supports dot notation)
          try {
            ComponentUtils.enhancedUpdate(updates);
          } catch (e) {
            // Fallback to original
            if (originalUpdate) {
              originalUpdate.call(this, updates);
            }
          }
        };
      }

      // Add component methods to Elements
      Object.assign(globalObj.Elements, {
        registerComponent: ComponentRegistry.register,
        renderComponent: ComponentRenderer.render,
        getComponent: ComponentRenderer.getInstance,
        destroyComponent: ComponentRenderer.destroy
      });
    }

    // Extend Collections if available
    if (globalObj.Collections) {
      Object.assign(globalObj.Collections, {
        registerComponent: ComponentRegistry.register,
        renderComponent: ComponentRenderer.render
      });
    }

    // Extend Selector if available
    if (globalObj.Selector) {
      Object.assign(globalObj.Selector, {
        registerComponent: ComponentRegistry.register,
        renderComponent: ComponentRenderer.render
      });
    }
  }

  // ============================================================================
  // AUTO-INITIALIZATION
  // ============================================================================

  function autoInit() {
    integrateWithDOMHelpers();

    // Auto-initialize components in DOM
    if (ComponentRenderer && ComponentRenderer.autoInit) {
      ComponentRenderer.autoInit();
    }

    // Log integration success
    if (Components.isDOMHelpersAvailable()) {
      console.log('[Components System] Successfully integrated with DOM Helpers ecosystem');
    }
  }

  // Run auto-init when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoInit, 100); // Small delay to ensure Elements is ready
      });
    } else {
      setTimeout(autoInit, 100); // Small delay to ensure Elements is ready
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (ComponentRenderer && ComponentRenderer.destroyAll) {
        ComponentRenderer.destroyAll();
      }
    });
  }

  // Force immediate integration attempt
  integrateWithDOMHelpers();

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Export to global
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    globalObj.Components = Components;
    globalObj.Component = Component;

    // Add to DOMHelpers if it exists
    if (globalObj.DOMHelpers) {
      globalObj.DOMHelpers.Components = Components;
      globalObj.DOMHelpers.Component = Component;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Components System] v2.0.0 initialized');
    console.log('[DOM Helpers Components System] Available via: Components');

    const loaded = [];
    const missing = [];

    if (ComponentCore) loaded.push('core');
    else missing.push('core');

    if (ComponentRegistry) loaded.push('registry');
    else missing.push('registry');

    if (ComponentRenderer) loaded.push('renderer');
    else missing.push('renderer');

    if (ComponentEvents) loaded.push('events');
    else missing.push('events');

    if (ComponentUtils) loaded.push('utils');
    else missing.push('utils');

    if (ComponentLoader) loaded.push('loader');
    else missing.push('loader');

    if (loaded.length > 0) {
      console.log(`[DOM Helpers Components System] Loaded modules: ${loaded.join(', ')}`);
    }

    if (missing.length > 0) {
      console.warn(`[DOM Helpers Components System] Missing optional modules: ${missing.join(', ')}`);
    }

    console.log('\n[Usage Examples]');
    console.log('  // Register a component');
    console.log('  Components.register("UserCard", `<template>...</template>`);');
    console.log('  ');
    console.log('  // Render a component');
    console.log('  await Components.render("UserCard", "#container", { name: "John" });');
    console.log('  ');
    console.log('  // Use custom tags');
    console.log('  <user-card name="John" age="30"></user-card>');
    console.log('  ');
    console.log('  // Component communication');
    console.log('  Components.on("user:login", (data) => console.log(data));');
    console.log('  Components.emit("user:login", { username: "john" });');
  }

  return Components;
});
