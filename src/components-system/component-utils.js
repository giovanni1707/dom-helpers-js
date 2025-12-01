/**
 * DOM Helpers - Component Utils Module
 *
 * Utility functions for component management including scope, batch updates,
 * data binding, and helper methods.
 *
 * Features:
 * - Scoped element access
 * - Batch update utilities
 * - Data binding helpers
 * - Component statistics
 * - Performance monitoring
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
    global.DOMHelpersComponentUtils = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let ComponentCore, ComponentRegistry;

  // Try to load from require
  if (typeof require !== 'undefined') {
    try {
      ComponentCore = require('./component-core.js');
      ComponentRegistry = require('./component-registry.js');
    } catch (e) {
      // Not available
    }
  }

  // Try global
  if (!ComponentCore) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    ComponentCore = globalObj.ComponentHelpers?.core;
    ComponentRegistry = globalObj.ComponentHelpers?.registry;
  }

  if (!ComponentCore) {
    console.error('[Component Utils] component-core.js not found. Please load it first.');
    return {};
  }

  const { componentInstances, scopedStyles } = ComponentCore;

  // ============================================================================
  // ELEMENT UPDATE WRAPPER
  // ============================================================================

  /**
   * Wrap element for component-style updates
   */
  function wrapElementForComponentUpdate(element) {
    if (!element) return null;

    return new Proxy(element, {
      get(target, prop) {
        // Return original property if it exists
        if (prop in target) {
          return target[prop];
        }
        return undefined;
      },
      set(target, prop, value) {
        // Handle property updates
        if (prop in target) {
          target[prop] = value;
          return true;
        }
        return false;
      }
    });
  }

  // ============================================================================
  // SCOPE UTILITIES
  // ============================================================================

  /**
   * Create a scoped context for component updates
   */
  function scope(...elementIds) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    const Elements = globalObj.Elements;

    if (!Elements) {
      console.warn('[Component Utils] Elements helper not found');
      return {};
    }

    const scopeObj = {};

    if (elementIds.length === 0) {
      // No specific IDs provided - return proxy for all elements
      return new Proxy({}, {
        get(target, prop) {
          if (typeof prop === 'string') {
            const element = Elements[prop];
            return wrapElementForComponentUpdate(element);
          }
          return undefined;
        }
      });
    }

    // Create scope object with specified element IDs
    elementIds.forEach(id => {
      const element = Elements[id];
      if (element) {
        scopeObj[id] = wrapElementForComponentUpdate(element);
      } else {
        console.warn(`[Component Utils] Element "${id}" not found in scope`);
        scopeObj[id] = null;
      }
    });

    return scopeObj;
  }

  // ============================================================================
  // BATCH UPDATE
  // ============================================================================

  /**
   * Batch update helper for multiple elements
   */
  function batchUpdate(updates) {
    if (!updates || typeof updates !== 'object') {
      console.warn('[Component Utils] batchUpdate called with invalid updates object');
      return;
    }

    const globalObj = typeof window !== 'undefined' ? window : global;
    const Elements = globalObj.Elements;

    if (!Elements) {
      console.warn('[Component Utils] Elements helper not found');
      return;
    }

    Object.entries(updates).forEach(([elementId, elementUpdates]) => {
      const element = Elements[elementId];

      if (element && typeof element.update === 'function') {
        try {
          element.update(elementUpdates);
        } catch (error) {
          console.error(`[Component Utils] Error updating element "${elementId}":`, error);
        }
      } else if (!element) {
        console.warn(`[Component Utils] Element "${elementId}" not found for batchUpdate`);
      }
    });

    return true;
  }

  // ============================================================================
  // DATA BINDING
  // ============================================================================

  /**
   * Create a data binding helper for reactive updates
   */
  function createBinding(elementIds, mapFunction) {
    if (!Array.isArray(elementIds)) {
      throw new Error('[Component Utils] elementIds must be an array');
    }

    if (typeof mapFunction !== 'function') {
      throw new Error('[Component Utils] mapFunction must be a function');
    }

    const globalObj = typeof window !== 'undefined' ? window : global;
    const Elements = globalObj.Elements;

    return {
      update(data) {
        try {
          const updates = mapFunction(data);
          batchUpdate(updates);
        } catch (error) {
          console.error('[Component Utils] Error in binding update:', error);
        }
      },

      elements: elementIds.reduce((acc, id) => {
        acc[id] = Elements ? Elements[id] : null;
        return acc;
      }, {})
    };
  }

  // ============================================================================
  // ENHANCED UPDATE METHOD
  // ============================================================================

  /**
   * Enhanced update method with dot notation support
   */
  function enhancedUpdate(updates) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    const Elements = globalObj.Elements;

    if (!Elements) {
      console.warn('[Component Utils] Elements helper not found');
      return;
    }

    for (const [key, value] of Object.entries(updates)) {
      // Check for dot notation: "elementId.property"
      if (key.includes('.')) {
        const parts = key.split('.');
        const elementId = parts[0];
        const propertyPath = parts.slice(1);

        const element = Elements[elementId];
        if (!element) {
          console.warn(`[Component Utils] Element "${elementId}" not found`);
          continue;
        }

        // Navigate to the property and set value
        let target = element;
        for (let i = 0; i < propertyPath.length - 1; i++) {
          target = target[propertyPath[i]];
          if (!target) {
            console.warn(`[Component Utils] Property path "${key}" not found`);
            break;
          }
        }

        if (target) {
          target[propertyPath[propertyPath.length - 1]] = value;
        }
      } else {
        // Regular update: elementId: { props }
        const element = Elements[key];
        if (element && typeof element.update === 'function') {
          element.update(value);
        } else if (!element) {
          console.warn(`[Component Utils] Element "${key}" not found`);
        }
      }
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get component statistics
   */
  function getStats() {
    const activeComponents = Array.from(componentInstances.values())
      .filter(c => !c.isDestroyed);

    const componentsByName = {};
    activeComponents.forEach(c => {
      componentsByName[c.name] = (componentsByName[c.name] || 0) + 1;
    });

    return {
      registered: ComponentRegistry ? ComponentRegistry.getAll().length : 0,
      active: activeComponents.length,
      destroyed: componentInstances.size - activeComponents.length,
      scopedStyles: scopedStyles.size,
      byName: componentsByName
    };
  }

  // ============================================================================
  // PERFORMANCE MONITORING
  // ============================================================================

  const performanceData = {
    renders: [],
    updates: [],
    destroys: []
  };

  /**
   * Track component performance
   */
  function trackPerformance(type, componentName, duration) {
    const entry = {
      type,
      componentName,
      duration,
      timestamp: Date.now()
    };

    performanceData[type + 's'].push(entry);

    // Keep only last 100 entries per type
    if (performanceData[type + 's'].length > 100) {
      performanceData[type + 's'].shift();
    }
  }

  /**
   * Get performance statistics
   */
  function getPerformanceStats(type = null) {
    if (type) {
      const data = performanceData[type + 's'] || [];
      if (data.length === 0) return null;

      const durations = data.map(e => e.duration);
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      return { type, count: data.length, avg, min, max };
    }

    // All types
    return {
      render: getPerformanceStats('render'),
      update: getPerformanceStats('update'),
      destroy: getPerformanceStats('destroy')
    };
  }

  /**
   * Clear performance data
   */
  function clearPerformanceData() {
    performanceData.renders = [];
    performanceData.updates = [];
    performanceData.destroys = [];
  }

  // ============================================================================
  // COMPONENT HELPERS
  // ============================================================================

  /**
   * Find components by selector
   */
  function findComponents(selector) {
    const components = [];

    componentInstances.forEach((component, container) => {
      if (!component.isDestroyed) {
        if (selector === '*' || component.name === selector) {
          components.push(component);
        }
      }
    });

    return components;
  }

  /**
   * Get component by container
   */
  function getComponentByContainer(container) {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (typeof container === 'string') {
      const Elements = globalObj.Elements;
      if (Elements && Elements[container]) {
        container = Elements[container];
      } else {
        container = document.querySelector(container);
      }
    }

    return container ? componentInstances.get(container) : null;
  }

  /**
   * Wait for component to be ready
   */
  function waitForComponent(name, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const checkInterval = 100;
      let elapsed = 0;

      const check = () => {
        const components = findComponents(name);
        if (components.length > 0 && components[0].isMounted) {
          resolve(components[0]);
        } else if (elapsed >= timeout) {
          reject(new Error(`Component "${name}" did not mount within ${timeout}ms`));
        } else {
          elapsed += checkInterval;
          setTimeout(check, checkInterval);
        }
      };

      check();
    });
  }

  /**
   * Debug component
   */
  function debugComponent(nameOrContainer) {
    let component;

    if (typeof nameOrContainer === 'string') {
      const components = findComponents(nameOrContainer);
      if (components.length === 0) {
        console.log(`No components found with name "${nameOrContainer}"`);
        return null;
      }
      component = components[0];
    } else {
      component = getComponentByContainer(nameOrContainer);
    }

    if (!component) {
      console.log('Component not found');
      return null;
    }

    console.log('=== Component Debug Info ===');
    console.log('Name:', component.name);
    console.log('Scope ID:', component.scopeId);
    console.log('Mounted:', component.isMounted);
    console.log('Destroyed:', component.isDestroyed);
    console.log('Data:', component.data);
    console.log('Children:', component.children.length);
    console.log('Event Listeners:', component.eventListeners.length);
    console.log('Container:', component.container);

    return component;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentUtils = {
    // Scope
    scope,

    // Batch updates
    batchUpdate,
    enhancedUpdate,

    // Data binding
    createBinding,

    // Statistics
    getStats,

    // Performance
    trackPerformance,
    getPerformanceStats,
    clearPerformanceData,

    // Component helpers
    findComponents,
    getComponentByContainer,
    waitForComponent,
    debugComponent,

    // Utilities
    wrapElementForComponentUpdate,

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

    globalObj.ComponentHelpers.utils = ComponentUtils;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Utils] v2.0.0 initialized');
  }

  return ComponentUtils;
});
