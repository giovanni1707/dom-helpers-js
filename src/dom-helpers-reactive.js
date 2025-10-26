/**
 * DOM Helpers - Reactive State Extension
 * Smart reactivity system for declarative DOM updates
 * 
 * Features:
 * - Reactive state with Proxy (nested objects/arrays)
 * - Unified binding API across Elements, Collections, Selector
 * - Fine-grained updates with dependency tracking
 * - Automatic cleanup with WeakMap and MutationObserver
 * - Computed properties with caching
 * - Batch updates for performance
 * - Debug utilities
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if DOM Helpers is loaded
  if (!global.Elements || !global.Collections || !global.Selector) {
    console.error('[DOM Helpers Reactive] Core DOM Helpers library must be loaded first');
    return;
  }

  // ===== CONFIGURATION =====
  
  const config = {
    maxDependencyDepth: 100,
    enableDebugMode: false,
    errorHandler: null
  };

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
   * Stack to track binding depth (for circular dependency detection)
   */
  const bindingStack = [];

  /**
   * WeakMap to store bindings for each element
   * Key: element, Value: Set of binding metadata
   */
  const elementBindings = new WeakMap();

  /**
   * WeakMap to cache nested proxies
   */
  const nestedProxies = new WeakMap();

  /**
   * WeakMap to store original targets for proxies
   */
  const proxyToTarget = new WeakMap();

  /**
   * Symbol to access raw state
   */
  const RAW = Symbol('raw');

  /**
   * Symbol to mark reactive proxies
   */
  const IS_REACTIVE = Symbol('isReactive');

  // ===== BATCHING SYSTEM =====

  let batchDepth = 0;
  let pendingUpdates = new Set();
  let isFlushing = false;

  /**
   * Batch multiple state updates to optimize rendering
   */
  function batch(fn) {
    batchDepth++;
    try {
      return fn();
    } finally {
      batchDepth--;
      if (batchDepth === 0 && !isFlushing) {
        flushUpdates();
      }
    }
  }

  /**
   * Flush all pending updates
   */
  function flushUpdates() {
    if (isFlushing || pendingUpdates.size === 0) return;

    isFlushing = true;
    const updates = Array.from(pendingUpdates);
    pendingUpdates.clear();

    // Sort updates to ensure parent elements update before children
    updates.sort((a, b) => {
      if (a.element && b.element) {
        return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      }
      return 0;
    });

    updates.forEach(binding => {
      try {
        executeBinding(binding);
      } catch (error) {
        handleError(error, 'flushUpdates', binding);
      }
    });

    isFlushing = false;
  }

  // ===== ERROR HANDLING =====

  /**
   * Handle errors with custom error handler
   */
  function handleError(error, context, data) {
    if (config.errorHandler) {
      config.errorHandler(error, context, data);
    } else {
      console.error(`[DOM Helpers Reactive] Error in ${context}:`, error, data);
    }
  }

  // ===== REACTIVE PROXY CREATION =====

  /**
   * Check if value is reactive
   */
  function isReactive(value) {
    return !!(value && typeof value === 'object' && value[IS_REACTIVE]);
  }

  /**
   * Get raw (non-reactive) value
   */
  function toRaw(value) {
    if (value && value[RAW]) {
      return value[RAW];
    }
    return value;
  }

  /**
   * Create a reactive proxy for an object or array
   */
  function createReactiveProxy(target, path = [], parent = null) {
    // Return primitives as-is
    if (target === null || typeof target !== 'object') {
      return target;
    }

    // If already reactive, return it
    if (isReactive(target)) {
      return target;
    }

    // Check if we already have a proxy for this target
    if (nestedProxies.has(target)) {
      return nestedProxies.get(target);
    }

    // Create reactive proxy
    const proxy = new Proxy(target, {
      get(obj, key) {
        // Return raw target
        if (key === RAW) {
          return target;
        }

        // Return reactive marker
        if (key === IS_REACTIVE) {
          return true;
        }

        // Track dependency if we're in a binding
        if (currentBinding && typeof key !== 'symbol') {
          trackDependency(proxy, key, currentBinding);
        }

        const value = obj[key];

        // Intercept array methods to make them reactive
        if (Array.isArray(obj) && typeof value === 'function') {
          return function(...args) {
            const oldLength = obj.length;
            const result = value.apply(obj, args);
            
            // Trigger updates for mutating array methods
            const mutatingMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin'];
            if (mutatingMethods.includes(key)) {
              batch(() => {
                // Trigger length update if changed
                if (obj.length !== oldLength) {
                  triggerUpdate(proxy, 'length');
                }
                
                // Trigger updates for affected indices
                if (['push', 'unshift', 'splice'].includes(key)) {
                  // Items were added/modified, trigger general array update
                  const metadata = reactiveMetadata.get(proxy);
                  if (metadata) {
                    // Trigger all dependencies for comprehensive update
                    const allDeps = new Set();
                    metadata.dependencies.forEach(bindings => {
                      bindings.forEach(binding => allDeps.add(binding));
                    });
                    allDeps.forEach(binding => scheduleUpdate(binding));
                  }
                }
              });
            }
            
            return result;
          };
        }

        // Wrap nested objects/arrays in proxies (cached)
        if (value !== null && typeof value === 'object' && !isReactive(value)) {
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

        // If setting a reactive value, extract raw value
        const rawValue = toRaw(value);

        // Remove old nested proxy if exists
        if (oldValue !== null && typeof oldValue === 'object') {
          nestedProxies.delete(oldValue);
        }

        // Set the raw value
        obj[key] = rawValue;

        // Cache new nested proxy if needed
        if (rawValue !== null && typeof rawValue === 'object' && !isReactive(rawValue)) {
          const nestedProxy = createReactiveProxy(rawValue, [...path, key], proxy);
          nestedProxies.set(rawValue, nestedProxy);
        }

        // Trigger updates for this property
        triggerUpdate(proxy, key);

        return true;
      },

      deleteProperty(obj, key) {
        const hadKey = key in obj;
        const oldValue = obj[key];
        
        const result = delete obj[key];
        
        if (result && hadKey) {
          // Clean up nested proxy
          if (oldValue !== null && typeof oldValue === 'object') {
            nestedProxies.delete(oldValue);
          }
          
          triggerUpdate(proxy, key);
        }
        
        return result;
      }
    });

    // Store metadata
    const metadata = {
      target,
      path,
      parent,
      dependencies: new Map(), // key -> Set of bindings
      computedProperties: new Map() // key -> computed metadata
    };
    
    reactiveMetadata.set(proxy, metadata);
    proxyToTarget.set(proxy, target);

    // Cache the proxy
    nestedProxies.set(target, proxy);

    return proxy;
  }

  // ===== DEPENDENCY TRACKING =====

  /**
   * Track a dependency between a state property and a binding
   */
  function trackDependency(state, key, binding) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    // Check for circular dependencies
    if (bindingStack.length > config.maxDependencyDepth) {
      console.warn('[DOM Helpers Reactive] Maximum dependency depth exceeded. Possible circular dependency.');
      return;
    }

    if (!metadata.dependencies.has(key)) {
      metadata.dependencies.set(key, new Set());
    }

    metadata.dependencies.get(key).add(binding);

    // Store reverse reference for cleanup
    if (!binding.trackedStates) {
      binding.trackedStates = new Map();
    }
    if (!binding.trackedStates.has(state)) {
      binding.trackedStates.set(state, new Set());
    }
    binding.trackedStates.get(state).add(key);
  }

  /**
   * Schedule an update (with batching support)
   */
  function scheduleUpdate(binding) {
    if (batchDepth > 0) {
      pendingUpdates.add(binding);
    } else if (!isFlushing) {
      try {
        executeBinding(binding);
      } catch (error) {
        handleError(error, 'scheduleUpdate', binding);
      }
    }
  }

  /**
   * Trigger updates for all bindings dependent on a property
   */
  function triggerUpdate(state, key) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) return;

    const bindings = metadata.dependencies.get(key);
    if (!bindings || bindings.size === 0) return;

    // Schedule all dependent bindings
    bindings.forEach(binding => {
      // Skip computed property bindings (they handle updates differently)
      if (binding.isComputed) {
        binding.fn(); // Just mark as dirty
      } else {
        scheduleUpdate(binding);
      }
    });

    // Log in debug mode
    if (config.enableDebugMode) {
      console.log(`[DOM Helpers Reactive Debug] Triggered ${bindings.size} binding(s) for key "${String(key)}"`);
    }
  }

  // ===== BINDING EXECUTION =====

  /**
   * Execute a single binding
   */
  function executeBinding(binding) {
    const { element, property, fn, lastValue } = binding;

    // Skip computed bindings (they execute on access)
    if (binding.isComputed) return;

    // Check if element still exists in DOM (skip for non-DOM bindings)
    if (element && !document.contains(element)) {
      cleanupBinding(binding);
      return;
    }

    // Check for circular dependencies
    if (bindingStack.includes(binding)) {
      console.warn('[DOM Helpers Reactive] Circular dependency detected in binding');
      return;
    }

    // Clear previous dependencies
    clearBindingDependencies(binding);

    // Set current binding for dependency tracking
    const prevBinding = currentBinding;
    currentBinding = binding;
    bindingStack.push(binding);

    try {
      const value = fn();

      // Skip if value hasn't changed (using deep comparison for objects)
      if (isEqual(value, lastValue)) {
        return;
      }

      // Store new value
      binding.lastValue = deepClone(value);

      // Apply the value to the DOM (skip for non-DOM bindings)
      if (element) {
        applyBindingValue(element, property, value);
      }

    } catch (error) {
      handleError(error, 'executeBinding', { element, property });
    } finally {
      bindingStack.pop();
      currentBinding = prevBinding;
    }
  }

  /**
   * Clear dependencies tracked by a binding
   */
  function clearBindingDependencies(binding) {
    if (!binding.trackedStates) return;

    binding.trackedStates.forEach((keys, state) => {
      const metadata = reactiveMetadata.get(state);
      if (!metadata) return;

      keys.forEach(key => {
        const bindings = metadata.dependencies.get(key);
        if (bindings) {
          bindings.delete(binding);
          if (bindings.size === 0) {
            metadata.dependencies.delete(key);
          }
        }
      });
    });

    binding.trackedStates.clear();
  }

  // ===== APPLY BINDING VALUES =====

  /**
   * Apply a binding value to an element
   */
  function applyBindingValue(element, property, value) {
    // Handle null/undefined
    if (value === null || value === undefined) {
      applyNullValue(element, property);
      return;
    }

    // Handle primitives
    if (isPrimitive(value)) {
      applyPrimitiveValue(element, property, value);
      return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      applyArrayValue(element, property, value);
      return;
    }

    // Handle DOM nodes
    if (value instanceof Node) {
      applyNodeValue(element, property, value);
      return;
    }

    // Handle objects
    if (typeof value === 'object') {
      applyObjectValue(element, property, value);
      return;
    }
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive(value) {
    const type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
  }

  /**
   * Apply null/undefined value
   */
  function applyNullValue(element, property) {
    if (property === 'textContent' || !property) {
      element.textContent = '';
    } else if (property === 'value') {
      element.value = '';
    } else if (property === 'innerHTML') {
      element.innerHTML = '';
    }
  }

  /**
   * Apply primitive value
   */
  function applyPrimitiveValue(element, property, value) {
    if (property) {
      if (property === 'style' && typeof value === 'string') {
        element.style.cssText = value;
      } else if (property === 'class' || property === 'className') {
        element.className = value;
      } else if (property.startsWith('data-')) {
        const dataKey = property.slice(5);
        element.dataset[dataKey] = value;
      } else if (property in element) {
        element[property] = value;
      } else {
        element.setAttribute(property, String(value));
      }
    } else {
      element.textContent = String(value);
    }
  }

  /**
   * Apply array value
   */
  function applyArrayValue(element, property, value) {
    if (property) {
      // Special handling for classList
      if (property === 'classList' || property === 'class' || property === 'className') {
        element.className = value.filter(Boolean).join(' ');
      } else if (property in element) {
        element[property] = value;
      } else {
        element.setAttribute(property, value.join(' '));
      }
    } else {
      element.textContent = value.join(', ');
    }
  }

  /**
   * Apply DOM node value
   */
  function applyNodeValue(element, property, value) {
    if (property) {
      console.warn('[DOM Helpers Reactive] Cannot assign DOM node to property:', property);
    } else {
      element.innerHTML = '';
      element.appendChild(value);
    }
  }

  /**
   * Apply object value
   */
  function applyObjectValue(element, property, value) {
    if (property) {
      if (property === 'style') {
        applyStyleObject(element, value);
      } else if (property === 'dataset') {
        applyDatasetObject(element, value);
      } else if (property === 'classList') {
        applyClassListObject(element, value);
      } else {
        // Try to assign the whole object
        try {
          element[property] = value;
        } catch (e) {
          console.warn('[DOM Helpers Reactive] Could not assign object to property:', property);
        }
      }
    } else {
      // Apply multiple properties from object
      Object.entries(value).forEach(([key, val]) => {
        if (key === 'style' && typeof val === 'object') {
          applyStyleObject(element, val);
        } else if (key === 'dataset' && typeof val === 'object') {
          applyDatasetObject(element, val);
        } else if (key === 'classList' && (typeof val === 'object' || Array.isArray(val))) {
          applyClassListObject(element, val);
        } else if (key.startsWith('on') && typeof val === 'function') {
          // Event listener
          const eventName = key.slice(2).toLowerCase();
          element.addEventListener(eventName, val);
        } else if (key in element) {
          element[key] = val;
        } else {
          element.setAttribute(key, String(val));
        }
      });
    }
  }

  /**
   * Apply style object
   */
  function applyStyleObject(element, styleObj) {
    Object.entries(styleObj).forEach(([styleProp, styleValue]) => {
      if (styleValue === null || styleValue === undefined || styleValue === '') {
        element.style.removeProperty(styleProp);
      } else {
        element.style[styleProp] = styleValue;
      }
    });
  }

  /**
   * Apply dataset object
   */
  function applyDatasetObject(element, dataObj) {
    Object.entries(dataObj).forEach(([dataProp, dataValue]) => {
      if (dataValue === null || dataValue === undefined) {
        delete element.dataset[dataProp];
      } else {
        element.dataset[dataProp] = String(dataValue);
      }
    });
  }

  /**
   * Apply classList object (for toggling classes)
   */
  function applyClassListObject(element, classObj) {
    if (Array.isArray(classObj)) {
      element.className = classObj.filter(Boolean).join(' ');
    } else {
      Object.entries(classObj).forEach(([className, shouldAdd]) => {
        if (shouldAdd) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      });
    }
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Deep clone a value for comparison
   */
  function deepClone(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    if (value instanceof RegExp) {
      return new RegExp(value.source, value.flags);
    }

    if (Array.isArray(value)) {
      return value.map(item => deepClone(item));
    }

    if (value instanceof Node) {
      return value; // Don't clone DOM nodes
    }

    if (isReactive(value)) {
      return value; // Don't clone reactive proxies
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

      if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      }

      if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
      }

      if (a instanceof Node || b instanceof Node) {
        return a === b;
      }

      if (isReactive(a) || isReactive(b)) {
        return toRaw(a) === toRaw(b);
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => isEqual(a[key], b[key]));
    }

    return false;
  }

  // ===== BINDING MANAGEMENT =====

  /**
   * Cleanup a binding
   */
  function cleanupBinding(binding) {
    const { element } = binding;

    // Clear dependencies
    clearBindingDependencies(binding);

    // Remove from element bindings
    if (element && elementBindings.has(element)) {
      elementBindings.get(element).delete(binding);
      if (elementBindings.get(element).size === 0) {
        elementBindings.delete(element);
      }
    }

    // Remove from pending updates
    pendingUpdates.delete(binding);
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
  function createBinding(element, property, fn, options = {}) {
    const binding = {
      element,
      property,
      fn,
      lastValue: undefined,
      trackedStates: new Map(),
      isComputed: options.isComputed || false
    };

    // Add to element bindings (if element exists)
    if (element) {
      getElementBindings(element).add(binding);
    }

    // Execute immediately (unless deferred)
    if (!options.defer) {
      executeBinding(binding);
    }

    return binding;
  }

  // ===== COMPUTED PROPERTIES =====

  /**
   * Add computed property to reactive state
   */
  function addComputedProperty(state, key, computeFn) {
    const metadata = reactiveMetadata.get(state);
    if (!metadata) {
      console.error('[DOM Helpers Reactive] Cannot add computed property to non-reactive state');
      return;
    }

    let cachedValue;
    let isDirty = true;
    const dependencies = new Set();

    // Create a special binding for computed property
    const computedBinding = {
      element: null,
      property: key,
      isComputed: true,
      fn: () => {
        isDirty = true;
        // Trigger any bindings that depend on this computed property
        triggerUpdate(state, key);
      },
      trackedStates: new Map()
    };

    // Store computed metadata
    metadata.computedProperties.set(key, {
      computeFn,
      binding: computedBinding,
      get isDirty() { return isDirty; },
      get cachedValue() { return cachedValue; }
    });

    // Define the computed property
    Object.defineProperty(state, key, {
      get() {
        // Recalculate if dirty
        if (isDirty) {
          // Clear old dependencies
          clearBindingDependencies(computedBinding);
          
          // Track new dependencies
          const prevBinding = currentBinding;
          currentBinding = computedBinding;
          
          try {
            cachedValue = computeFn.call(state);
            isDirty = false;
          } catch (error) {
            handleError(error, 'computed property', { key, state });
            throw error;
          } finally {
            currentBinding = prevBinding;
          }
        }

        // Track this computed property as dependency for outer bindings
        if (currentBinding && currentBinding !== computedBinding) {
          trackDependency(state, key, currentBinding);
        }

        return cachedValue;
      },
      enumerable: true,
      configurable: true
    });

    // Initial computation
    isDirty = true;
  }

  // ===== BINDING FUNCTIONS =====

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

  // ===== MANUAL UPDATE TRIGGER =====

  /**
   * Manually trigger updates for a state property
   */
  function notify(state, key) {
    if (!isReactive(state)) {
      console.warn('[DOM Helpers Reactive] notify() called on non-reactive state');
      return;
    }

    if (key) {
      triggerUpdate(state, key);
    } else {
      // Trigger all dependencies
      const metadata = reactiveMetadata.get(state);
      if (metadata) {
        metadata.dependencies.forEach((bindings, depKey) => {
          triggerUpdate(state, depKey);
        });
      }
    }
  }

  // ===== UNTRACKED READS =====

  /**
   * Read state without tracking dependencies
   */
  function untrack(fn) {
    const prevBinding = currentBinding;
    currentBinding = null;

    try {
      return fn();
    } finally {
      currentBinding = prevBinding;
    }
  }

  // ===== PAUSE/RESUME REACTIVITY =====

  let isPaused = false;
  let pausedUpdates = [];

  /**
   * Pause reactivity
   */
  function pauseTracking() {
    isPaused = true;
  }

  /**
   * Resume reactivity
   */
  function resumeTracking(flush = true) {
    isPaused = false;
    
    if (flush && pausedUpdates.length > 0) {
      batch(() => {
        pausedUpdates.forEach(({ state, key }) => {
          triggerUpdate(state, key);
        });
      });
      pausedUpdates = [];
    }
  }

  // Modify triggerUpdate to respect pause
  const originalTriggerUpdate = triggerUpdate;
  triggerUpdate = function(state, key) {
    if (isPaused) {
      pausedUpdates.push({ state, key });
      return;
    }
    originalTriggerUpdate(state, key);
  };

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

  // ===== DEBUG UTILITIES =====

  /**
   * Get all bindings for a state
   */
  function getStateDependencies(state) {
    if (!isReactive(state)) {
      console.warn('[DOM Helpers Reactive] getStateDependencies() called on non-reactive state');
      return null;
    }

    const metadata = reactiveMetadata.get(state);
    if (!metadata) return null;

    const result = {};
    metadata.dependencies.forEach((bindings, key) => {
      result[key] = {
        count: bindings.size,
        bindings: Array.from(bindings).map(b => ({
          element: b.element,
          property: b.property,
          isComputed: b.isComputed
        }))
      };
    });

    return result;
  }

  /**
   * Get all bindings for an element
   */
  function getElementBindingInfo(element) {
    if (!elementBindings.has(element)) {
      return { count: 0, bindings: [] };
    }

    const bindings = elementBindings.get(element);
    return {
      count: bindings.size,
      bindings: Array.from(bindings).map(b => ({
        property: b.property,
        hasTrackedStates: b.trackedStates && b.trackedStates.size > 0,
        trackedStateCount: b.trackedStates ? b.trackedStates.size : 0
      }))
    };
  }

  /**
   * Get reactive state statistics
   */
  function getReactiveStats() {
    return {
      pendingUpdates: pendingUpdates.size,
      batchDepth,
      isFlushing,
      isPaused,
      pausedUpdatesCount: pausedUpdates.length
    };
  }

  /**
   * Enable or disable debug mode
   */
  function setDebugMode(enabled) {
    config.enableDebugMode = enabled;
  }

  /**
   * Log reactive state structure
   */
  function debugState(state, label = 'State') {
    if (!isReactive(state)) {
      console.log(`[DOM Helpers Reactive Debug] ${label} is not reactive`);
      return;
    }

    const metadata = reactiveMetadata.get(state);
    console.group(`[DOM Helpers Reactive Debug] ${label}`);
    console.log('Raw value:', toRaw(state));
    console.log('Dependencies:', getStateDependencies(state));
    console.log('Computed properties:', Array.from(metadata.computedProperties.keys()));
    console.groupEnd();
  }

  // ===== REACTIVE STATE API =====

  /**
   * Create reactive state with enhanced API
   */
  const ReactiveState = {
    /**
     * Create a new reactive state
     */
    create(initialState) {
      const proxy = createReactiveProxy(initialState);
      
      // Add utility methods
      Object.defineProperty(proxy, '$computed', {
        value: function(key, computeFn) {
          addComputedProperty(this, key, computeFn);
          return this;
        },
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(proxy, '$watch', {
        value: function(keyOrFn, callback) {
          if (typeof keyOrFn === 'function') {
            // Watch computed value
            const binding = createBinding(null, null, () => {
              const value = keyOrFn.call(this);
              if (binding.lastValue !== undefined) {
                callback(value, binding.lastValue);
              }
              return value;
            });
            return () => cleanupBinding(binding);
          } else {
            // Watch specific key
            const binding = createBinding(null, null, () => {
              const value = this[keyOrFn];
              if (binding.lastValue !== undefined) {
                callback(value, binding.lastValue);
              }
              return value;
            });
            return () => cleanupBinding(binding);
          }
        },
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(proxy, '$notify', {
        value: function(key) {
          notify(this, key);
        },
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(proxy, '$raw', {
        get() {
          return toRaw(this);
        },
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(proxy, '$batch', {
        value: function(fn) {
          return batch(() => fn.call(this));
        },
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.defineProperty(proxy, '$debug', {
        value: function(label) {
          debugState(this, label);
        },
        writable: false,
        enumerable: false,
        configurable: false
      });

      return proxy;
    },

    /**
     * Check if value is reactive
     */
    isReactive,

    /**
     * Get raw value
     */
    toRaw,

    /**
     * Batch updates
     */
    batch,

    /**
     * Untracked reads
     */
    untrack,

    /**
     * Pause/resume tracking
     */
    pauseTracking,
    resumeTracking,

    /**
     * Manual notification
     */
    notify,

    /**
     * Debug utilities
     */
    debug: {
      getStateDependencies,
      getElementBindingInfo,
      getReactiveStats,
      setDebugMode,
      debugState
    },

    /**
     * Configure reactivity
     */
    configure(options) {
      if (options.maxDependencyDepth !== undefined) {
        config.maxDependencyDepth = options.maxDependencyDepth;
      }
      if (options.enableDebugMode !== undefined) {
        config.enableDebugMode = options.enableDebugMode;
      }
      if (options.errorHandler !== undefined) {
        config.errorHandler = options.errorHandler;
      }
    }
  };

  // ===== INTEGRATE WITH DOM HELPERS =====

  // Add to Elements
  if (global.Elements) {
    global.Elements.state = function(initialState) {
      return ReactiveState.create(initialState);
    };

    global.Elements.bind = bindElements;
    global.Elements.unbind = unbindElements;

    // Add batch method
    global.Elements.batch = batch;
  }

  // Add to Collections
  if (global.Collections) {
    global.Collections.bind = bindCollections;
    global.Collections.unbind = unbindCollections;
  }

  // Add to Selector.query
  if (global.Selector && global.Selector.query) {
    const originalQuery = global.Selector.query;

    originalQuery.bind = bindQuerySingle;
    originalQuery.unbind = unbindQuery;
  }

  // Add to Selector.queryAll
  if (global.Selector && global.Selector.queryAll) {
    const originalQueryAll = global.Selector.queryAll;

    originalQueryAll.bind = bindQueryAll;
    originalQueryAll.unbind = unbindQuery;
  }

  // ===== EXPORT TO GLOBAL =====

  global.ReactiveState = ReactiveState;

  // Export utility functions for advanced use cases
  global.ReactiveUtils = {
    batch,
    untrack,
    pauseTracking,
    resumeTracking,
    isReactive,
    toRaw,
    notify
  };

  // ===== CLEANUP ON UNLOAD =====

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      if (cleanupObserver) {
        cleanupObserver.disconnect();
      }
      
      // Clear all bindings
      elementBindings.forEach((bindings, element) => {
        bindings.forEach(binding => cleanupBinding(binding));
      });
      elementBindings.clear();
      
      // Clear pending updates
      pendingUpdates.clear();
    });
  }

  // ===== HELPER METHODS FOR COMMON PATTERNS =====

  /**
   * Create a reactive collection with array helpers
   */
  ReactiveState.collection = function(initialArray = []) {
    const state = ReactiveState.create({ items: initialArray });

    Object.defineProperty(state, '$add', {
      value: function(item) {
        this.items.push(item);
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$remove', {
      value: function(predicate) {
        const index = typeof predicate === 'function'
          ? this.items.findIndex(predicate)
          : this.items.indexOf(predicate);
        
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$update', {
      value: function(predicate, updates) {
        const index = typeof predicate === 'function'
          ? this.items.findIndex(predicate)
          : this.items.indexOf(predicate);
        
        if (index !== -1) {
          Object.assign(this.items[index], updates);
        }
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$clear', {
      value: function() {
        this.items.length = 0;
      },
      writable: false,
      enumerable: false
    });

    return state;
  };

  /**
   * Create a reactive form state helper
   */
  ReactiveState.form = function(initialValues = {}) {
    const state = ReactiveState.create({
      values: { ...initialValues },
      errors: {},
      touched: {},
      isSubmitting: false
    });

    Object.defineProperty(state, '$setValue', {
      value: function(field, value) {
        this.values[field] = value;
        this.touched[field] = true;
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$setError', {
      value: function(field, error) {
        if (error) {
          this.errors[field] = error;
        } else {
          delete this.errors[field];
        }
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$reset', {
      value: function(newValues = initialValues) {
        this.values = { ...newValues };
        this.errors = {};
        this.touched = {};
        this.isSubmitting = false;
      },
      writable: false,
      enumerable: false
    });

    state.$computed('isValid', function() {
      return Object.keys(this.errors).length === 0;
    });

    state.$computed('isDirty', function() {
      return Object.keys(this.touched).length > 0;
    });

    return state;
  };

  /**
   * Create a reactive async state helper
   */
  ReactiveState.async = function(initialValue = null) {
    const state = ReactiveState.create({
      data: initialValue,
      loading: false,
      error: null
    });

    Object.defineProperty(state, '$execute', {
      value: async function(asyncFn) {
        this.loading = true;
        this.error = null;

        try {
          const result = await asyncFn();
          this.data = result;
          return result;
        } catch (error) {
          this.error = error;
          throw error;
        } finally {
          this.loading = false;
        }
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(state, '$reset', {
      value: function() {
        this.data = initialValue;
        this.loading = false;
        this.error = null;
      },
      writable: false,
      enumerable: false
    });

    state.$computed('isSuccess', function() {
      return !this.loading && !this.error && this.data !== null;
    });

    state.$computed('isError', function() {
      return !this.loading && this.error !== null;
    });

    return state;
  };

  // ===== PERFORMANCE MONITORING =====

  if (config.enableDebugMode) {
    let updateCount = 0;
    let lastResetTime = Date.now();

    const originalExecuteBinding = executeBinding;
    executeBinding = function(binding) {
      const start = performance.now();
      originalExecuteBinding.call(this, binding);
      const duration = performance.now() - start;

      updateCount++;

      if (duration > 16) { // Longer than one frame
        console.warn(`[DOM Helpers Reactive Performance] Slow binding execution: ${duration.toFixed(2)}ms`, binding);
      }
    };

    // Reset counter every 5 seconds
    setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastResetTime) / 1000;
      const updatesPerSecond = updateCount / elapsed;

      if (updatesPerSecond > 60) {
        console.warn(`[DOM Helpers Reactive Performance] High update frequency: ${updatesPerSecond.toFixed(2)} updates/second`);
      }

      updateCount = 0;
      lastResetTime = now;
    }, 5000);
  }

  // ===== LOGGING =====

  console.log('[DOM Helpers Reactive] v2.0.0 loaded successfully');
  console.log('[DOM Helpers Reactive] Features: Computed properties, Batching, Debug utilities, Helper methods');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);