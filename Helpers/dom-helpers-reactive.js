/**
 * DOM Helpers - Reactive State Extension
 * Smart reactivity system for declarative DOM updates
 * 
 * Features:
 * - Reactive state with Proxy (nested objects/arrays)
 * - Unified binding API across Elements, Collections, Selector
 * - Fine-grained updates with dependency tracking
 * - Automatic cleanup with WeakMap and MutationObserver
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if DOM Helpers is loaded
  if (!global.Elements || !global.Collections || !global.Selector) {
    console.error('[DOM Helpers Reactive] Core DOM Helpers library must be loaded first');
    return;
  }

  // ===== REACTIVE STATE SYSTEM =====

  /**
   * WeakMap to store reactive metadata for each proxy
   */
  const reactiveMetadata = new WeakMap();

  /**
   * Set to track currently executing bindings (for dependency tracking)
   */
  let currentBinding = null;

  /**
   * WeakMap to store bindings for each element
   * Key: element, Value: Set of binding metadata
   */
  const elementBindings = new WeakMap();

  /**
   * Map to store all active bindings by state
   * Key: state proxy, Value: Set of binding functions
   */
  const stateBindings = new WeakMap();

  /**
   * WeakMap to cache nested proxies
   */
  const nestedProxies = new WeakMap();

  /**
   * Create a reactive proxy for an object or array
   */
  function createReactiveProxy(target, path = [], parent = null) {
    // Return primitives as-is
    if (target === null || typeof target !== 'object') {
      return target;
    }

    // If already reactive, return it
    if (reactiveMetadata.has(target)) {
      return target;
    }

    // Check if we already have a proxy for this target
    if (nestedProxies.has(target)) {
      return nestedProxies.get(target);
    }

    // Create reactive proxy
    const proxy = new Proxy(target, {
      get(obj, key) {
        // Track dependency if we're in a binding
        if (currentBinding) {
          trackDependency(proxy, key, currentBinding);
        }

        const value = obj[key];

        // Intercept array methods to make them reactive
        if (Array.isArray(obj) && typeof value === 'function') {
          return function(...args) {
            const result = value.apply(obj, args);
            
            // Trigger updates for mutating array methods
            if (['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(key)) {
              // Trigger update on the array itself
              triggerUpdate(proxy, 'length');
              // Also trigger general update
              const metadata = reactiveMetadata.get(proxy);
              if (metadata && metadata.dependencies.size > 0) {
                // Trigger all dependencies for this proxy
                metadata.dependencies.forEach((bindings, depKey) => {
                  bindings.forEach(binding => {
                    try {
                      executeBinding(binding);
                    } catch (error) {
                      console.error('[DOM Helpers Reactive] Error executing binding:', error);
                    }
                  });
                });
              }
            }
            
            return result;
          };
        }

        // Wrap nested objects/arrays in proxies (cached)
        if (value !== null && typeof value === 'object') {
          if (!nestedProxies.has(value)) {
            const nestedProxy = createReactiveProxy(value, [...path, key], proxy);
            nestedProxies.set(value, nestedProxy);
          }
          return nestedProxies.get(value);
        }

        return value;
      },

      set(obj, key, value) {
        const oldValue = obj[key];

        // Only update if value changed
        if (oldValue === value) {
          return true;
        }

        // Wrap nested objects/arrays
        if (value !== null && typeof value === 'object' && !reactiveMetadata.has(value)) {
          const nestedProxy = createReactiveProxy(value, [...path, key], proxy);
          nestedProxies.set(value, nestedProxy);
          obj[key] = value; // Store original, return proxy on get
        } else {
          obj[key] = value;
        }

        // Trigger updates for this property
        triggerUpdate(proxy, key);

        return true;
      },

      deleteProperty(obj, key) {
        if (key in obj) {
          delete obj[key];
          triggerUpdate(proxy, key);
        }
        return true;
      }
    });

    // Store metadata
    reactiveMetadata.set(proxy, {
      target,
      path,
      parent,
      dependencies: new Map() // key -> Set of bindings
    });

    // Cache the proxy
    nestedProxies.set(target, proxy);

    return proxy;
  }

  /**
   * Track a dependency between a state property and a binding
   */
  function trackDependency(state, key, binding) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    if (!metadata.dependencies.has(key)) {
      metadata.dependencies.set(key, new Set());
    }

    metadata.dependencies.get(key).add(binding);
  }

  /**
   * Trigger updates for all bindings dependent on a property
   */
  function triggerUpdate(state, key) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    const bindings = metadata.dependencies.get(key);
    if (!bindings) return;

    // Execute all dependent bindings
    bindings.forEach(binding => {
      try {
        executeBinding(binding);
      } catch (error) {
        console.error('[DOM Helpers Reactive] Error executing binding:', error);
      }
    });
  }

  /**
   * Execute a single binding
   */
  function executeBinding(binding) {
    const { element, property, fn, lastValue } = binding;

    // Check if element still exists in DOM
    if (!document.contains(element)) {
      cleanupBinding(binding);
      return;
    }

    // Set current binding for dependency tracking
    const prevBinding = currentBinding;
    currentBinding = binding;

    try {
      const value = fn();

      // Skip if value hasn't changed (using deep comparison for objects)
      if (isEqual(value, lastValue)) {
        return;
      }

      // Store new value
      binding.lastValue = deepClone(value);

      // Apply the value to the DOM
      applyBindingValue(element, property, value);

    } finally {
      currentBinding = prevBinding;
    }
  }

  /**
   * Apply a binding value to an element
   */
  function applyBindingValue(element, property, value) {
    // Handle different value types
    if (value === null || value === undefined) {
      // Clear content
      if (property === 'textContent') {
        element.textContent = '';
      }
      return;
    }

    // Primitive → textContent
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      if (property) {
        if (property === 'style' && typeof value === 'string') {
          element.style.cssText = value;
        } else if (property in element) {
          element[property] = value;
        } else {
          element.setAttribute(property, value);
        }
      } else {
        element.textContent = String(value);
      }
      return;
    }

    // Array → join and assign to textContent
    if (Array.isArray(value)) {
      if (property) {
        element[property] = value;
      } else {
        element.textContent = value.join(', ');
      }
      return;
    }

    // DOM Node → replace children
    if (value instanceof Node) {
      if (property) {
        // Can't assign node to a property, skip
        console.warn('[DOM Helpers Reactive] Cannot assign DOM node to property:', property);
      } else {
        element.innerHTML = '';
        element.appendChild(value);
      }
      return;
    }

    // Object → apply properties/attributes
    if (typeof value === 'object') {
      if (property) {
        // If binding to a specific property and value is object
        if (property === 'style') {
          // Apply style properties
          Object.entries(value).forEach(([styleProp, styleValue]) => {
            if (styleValue !== null && styleValue !== undefined) {
              element.style[styleProp] = styleValue;
            }
          });
        } else if (property === 'dataset') {
          Object.entries(value).forEach(([dataProp, dataValue]) => {
            element.dataset[dataProp] = dataValue;
          });
        } else {
          // Try to assign the whole object
          element[property] = value;
        }
      } else {
        // Apply multiple properties from object
        Object.entries(value).forEach(([key, val]) => {
          if (key === 'style' && typeof val === 'object') {
            Object.entries(val).forEach(([styleProp, styleValue]) => {
              if (styleValue !== null && styleValue !== undefined) {
                element.style[styleProp] = styleValue;
              }
            });
          } else if (key === 'dataset' && typeof val === 'object') {
            Object.entries(val).forEach(([dataProp, dataValue]) => {
              element.dataset[dataProp] = dataValue;
            });
          } else if (key in element) {
            element[key] = val;
          } else {
            element.setAttribute(key, val);
          }
        });
      }
    }
  }

  /**
   * Deep clone a value for comparison
   */
  function deepClone(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(item => deepClone(item));
    }

    if (value instanceof Node) {
      return value; // Don't clone DOM nodes
    }

    const cloned = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        cloned[key] = deepClone(value[key]);
      }
    }
    return cloned;
  }

  /**
   * Deep equality check
   */
  function isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object') {
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((val, idx) => isEqual(val, b[idx]));
      }

      if (a instanceof Node || b instanceof Node) {
        return a === b;
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => isEqual(a[key], b[key]));
    }

    return false;
  }

  /**
   * Cleanup a binding
   */
  function cleanupBinding(binding) {
    const { element } = binding;

    // Remove from element bindings
    if (elementBindings.has(element)) {
      elementBindings.get(element).delete(binding);
    }

    // Remove from dependency tracking
    // (This is handled automatically when bindings are no longer in the Set)
  }

  /**
   * Get or create bindings set for an element
   */
  function getElementBindings(element) {
    if (!elementBindings.has(element)) {
      elementBindings.set(element, new Set());
    }
    return elementBindings.get(element);
  }

  /**
   * Create a binding between an element and a reactive function
   */
  function createBinding(element, property, fn) {
    const binding = {
      element,
      property,
      fn,
      lastValue: undefined
    };

    // Add to element bindings
    getElementBindings(element).add(binding);

    // Execute immediately
    executeBinding(binding);

    return binding;
  }

  /**
   * Bind functions to elements by ID
   */
  function bindElements(bindings) {
    Object.entries(bindings).forEach(([id, bindingDef]) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`[DOM Helpers Reactive] Element with id "${id}" not found`);
        return;
      }

      applyBindingDef(element, bindingDef);
    });
  }

  /**
   * Bind functions to elements by class name
   */
  function bindCollections(bindings) {
    Object.entries(bindings).forEach(([className, bindingDef]) => {
      const elements = document.getElementsByClassName(className);
      
      Array.from(elements).forEach(element => {
        applyBindingDef(element, bindingDef);
      });
    });
  }

  /**
   * Bind functions to first matching element by selector
   */
  function bindQuerySingle(bindings) {
    Object.entries(bindings).forEach(([selector, bindingDef]) => {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`[DOM Helpers Reactive] No element found for selector "${selector}"`);
        return;
      }

      applyBindingDef(element, bindingDef);
    });
  }

  /**
   * Bind functions to all matching elements by selector
   */
  function bindQueryAll(bindings) {
    Object.entries(bindings).forEach(([selector, bindingDef]) => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        applyBindingDef(element, bindingDef);
      });
    });
  }

  /**
   * Apply a binding definition to an element
   */
  function applyBindingDef(element, bindingDef) {
    if (typeof bindingDef === 'function') {
      // Simple function binding (no property specified)
      createBinding(element, null, bindingDef);
    } else if (typeof bindingDef === 'object' && bindingDef !== null) {
      // Object with properties
      Object.entries(bindingDef).forEach(([property, fn]) => {
        if (typeof fn === 'function') {
          createBinding(element, property, fn);
        }
      });
    }
  }

  /**
   * Unbind all bindings for an element by ID
   */
  function unbindElements(id) {
    const element = document.getElementById(id);
    if (!element) return;

    unbindElement(element);
  }

  /**
   * Unbind all bindings for elements by class name
   */
  function unbindCollections(className) {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(element => unbindElement(element));
  }

  /**
   * Unbind all bindings for a selector
   */
  function unbindQuery(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => unbindElement(element));
  }

  /**
   * Unbind all bindings for a specific element
   */
  function unbindElement(element) {
    if (!elementBindings.has(element)) return;

    const bindings = elementBindings.get(element);
    bindings.forEach(binding => cleanupBinding(binding));
    elementBindings.delete(element);
  }

  // ===== MUTATION OBSERVER FOR AUTO-CLEANUP =====

  /**
   * Set up MutationObserver to auto-clean bindings when elements are removed
   */
  function setupAutoCleanup() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Clean up this element
            unbindElement(node);

            // Clean up child elements
            const children = node.querySelectorAll('*');
            children.forEach(child => unbindElement(child));
          }
        });
      });
    });

    // Start observing when DOM is ready
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }

    return observer;
  }

  // Initialize auto-cleanup
  const cleanupObserver = setupAutoCleanup();

  // ===== PUBLIC API =====

  /**
   * Create reactive state
   */
  const ReactiveState = {
    create(initialState) {
      return createReactiveProxy(initialState);
    }
  };

  // Add to Elements
  if (global.Elements) {
    global.Elements.state = function(initialState) {
      return createReactiveProxy(initialState);
    };

    global.Elements.bind = bindElements;
    global.Elements.unbind = unbindElements;
  }

  // Add to Collections
  if (global.Collections) {
    global.Collections.bind = bindCollections;
    global.Collections.unbind = unbindCollections;
  }

  // Add to Selector.query
  if (global.Selector && global.Selector.query) {
    // Store original query function
    const originalQuery = global.Selector.query;

    // Add bind/unbind methods
    originalQuery.bind = bindQuerySingle;
    originalQuery.unbind = unbindQuery;
  }

  // Add to Selector.queryAll
  if (global.Selector && global.Selector.queryAll) {
    // Store original queryAll function
    const originalQueryAll = global.Selector.queryAll;

    // Add bind/unbind methods
    originalQueryAll.bind = bindQueryAll;
    originalQueryAll.unbind = unbindQuery;
  }

  // Export reactive utilities
  global.ReactiveState = ReactiveState;

  // Cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      if (cleanupObserver) {
        cleanupObserver.disconnect();
      }
    });
  }

  console.log('[DOM Helpers Reactive] Reactive state system loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
