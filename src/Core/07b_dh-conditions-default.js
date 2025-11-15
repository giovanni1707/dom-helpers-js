/**
 * Conditions.js - Default Condition Enhancement
 * @version 1.0.0
 * @description Adds explicit 'default' condition support to Conditions module
 * @requires Conditions.js v4.0.0+
 * @license MIT
 */

(function(global) {
  'use strict';

  // ============================================================================
  // VALIDATION
  // ============================================================================

  if (!global.Conditions) {
    console.error('[Conditions.Default] Conditions module not found. Please load Conditions.js first.');
    return;
  }

  const Conditions = global.Conditions;

  // ============================================================================
  // REGISTER DEFAULT MATCHER
  // ============================================================================

  /**
   * Register 'default' condition matcher that always matches
   * This allows explicit default fallback behavior
   */
  Conditions.registerMatcher('default', {
    test: (condition) => condition === 'default' || condition === '*',
    match: () => true // Always matches as fallback
  });

  // ============================================================================
  // ENHANCED APPLY CONDITIONS WITH DEFAULT SUPPORT
  // ============================================================================

  /**
   * Store original whenState method
   */
  const originalWhenState = Conditions.whenState.bind(Conditions);

  /**
   * Enhanced whenState with explicit default handling
   * Checks for 'default' key after no matches and applies it
   */
  Conditions.whenState = function(valueFn, conditions, selector, options = {}) {
    // Validate inputs
    if (!conditions || (typeof conditions !== 'object' && typeof conditions !== 'function')) {
      console.error('[Conditions] Second argument must be an object or function returning an object');
      return;
    }

    // Determine if we should use reactive mode
    const hasReactivity = Conditions.hasReactivity;
    const useReactive = options.reactive !== false && hasReactivity;
    const isFunction = typeof valueFn === 'function';
    
    // If valueFn is not a function, treat it as a static value
    const getValue = isFunction ? valueFn : () => valueFn;

    // Enhanced apply function with default support
    const enhancedApply = () => {
      // Get target elements
      const elements = getElements(selector);
      
      if (!elements || elements.length === 0) {
        console.warn('[Conditions] No elements found for selector:', selector);
        return;
      }
      
      // Get current value
      let value;
      try {
        value = getValue();
      } catch (e) {
        console.error('[Conditions] Error getting value:', e);
        return;
      }
      
      // Get conditions (support dynamic conditions via function)
      let conditionsObj;
      try {
        conditionsObj = typeof conditions === 'function' ? conditions() : conditions;
      } catch (e) {
        console.error('[Conditions] Error evaluating conditions:', e);
        return;
      }
      
      // Apply to all matching elements
      elements.forEach(element => {
        // Cleanup previous event listeners
        cleanupListeners(element);
        
        // Track if any condition matched
        let matched = false;
        
        // Find matching condition and apply config
        for (const [condition, config] of Object.entries(conditionsObj)) {
          // Skip 'default' in first pass
          if (condition === 'default' || condition === '*') {
            continue;
          }
          
          if (matchesCondition(value, condition)) {
            applyConfig(element, config, value);
            matched = true;
            break; // Only apply first matching condition
          }
        }
        
        // If no match, apply default if it exists
        if (!matched) {
          const defaultConfig = conditionsObj.default || conditionsObj['*'];
          if (defaultConfig) {
            applyConfig(element, defaultConfig, value);
          }
        }
      });
    };

    // Use reactive mode if available and appropriate
    if (useReactive && hasReactivity && isFunction) {
      // Get effect function from Conditions internal or global
      const effect = global.ReactiveUtils?.effect || global.Elements?.effect;
      
      if (effect) {
        return effect(() => {
          enhancedApply();
        });
      }
    }
    
    // Non-reactive mode: Execute once
    enhancedApply();
    
    // Return update function for manual updates
    return {
      update: () => enhancedApply(),
      destroy: () => {} // No cleanup needed in non-reactive mode
    };
  };

  // ============================================================================
  // HELPER FUNCTIONS (from original Conditions module)
  // ============================================================================

  /**
   * Get elements from various selector types
   */
  function getElements(selector) {
    // Already an element or NodeList
    if (selector instanceof Element) {
      return [selector];
    }
    if (selector instanceof NodeList || selector instanceof HTMLCollection) {
      return Array.from(selector);
    }
    if (Array.isArray(selector)) {
      return selector.filter(el => el instanceof Element);
    }

    // String selector
    if (typeof selector === 'string') {
      // Use DOM Helpers if available
      const hasElements = !!global.Elements;
      const hasCollections = !!global.Collections;
      const hasSelector = !!global.Selector;

      if (selector.startsWith('#')) {
        const id = selector.slice(1);
        if (hasElements && global.Elements[id]) {
          return [global.Elements[id]];
        }
        const el = document.getElementById(id);
        return el ? [el] : [];
      }
      
      if (selector.startsWith('.')) {
        const className = selector.slice(1);
        if (hasCollections && global.Collections.ClassName) {
          const collection = global.Collections.ClassName[className];
          return collection ? Array.from(collection) : [];
        }
        return Array.from(document.getElementsByClassName(className));
      }

      // Use Selector helper if available
      if (hasSelector && global.Selector.queryAll) {
        const result = global.Selector.queryAll(selector);
        return result ? Array.from(result) : [];
      }

      // Fallback to native querySelectorAll
      return Array.from(document.querySelectorAll(selector));
    }

    return [];
  }

  /**
   * Cleanup event listeners
   */
  function cleanupListeners(element) {
    if (element._whenStateListeners) {
      element._whenStateListeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      element._whenStateListeners = [];
    }
  }

  /**
   * Match value against condition (using Conditions internal logic)
   */
  function matchesCondition(value, condition) {
    // This relies on the registered matchers in Conditions module
    // We'll use a simple approach that delegates to string comparison
    condition = String(condition).trim();
    
    // Check common patterns
    if (condition === 'true') return value === true;
    if (condition === 'false') return value === false;
    if (condition === 'truthy') return !!value;
    if (condition === 'falsy') return !value;
    if (condition === 'null') return value === null;
    if (condition === 'undefined') return value === undefined;
    if (condition === 'empty') {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return value.length === 0;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return !value;
    }
    
    // Quoted strings
    if ((condition.startsWith('"') && condition.endsWith('"')) ||
        (condition.startsWith("'") && condition.endsWith("'"))) {
      return String(value) === condition.slice(1, -1);
    }
    
    // String pattern matching
    if (condition.startsWith('includes:')) {
      const searchTerm = condition.slice(9).trim();
      return String(value).includes(searchTerm);
    }
    if (condition.startsWith('startsWith:')) {
      const prefix = condition.slice(11).trim();
      return String(value).startsWith(prefix);
    }
    if (condition.startsWith('endsWith:')) {
      const suffix = condition.slice(9).trim();
      return String(value).endsWith(suffix);
    }
    
    // Regex
    if (condition.startsWith('/') && condition.lastIndexOf('/') > 0) {
      try {
        const lastSlash = condition.lastIndexOf('/');
        const pattern = condition.slice(1, lastSlash);
        const flags = condition.slice(lastSlash + 1);
        const regex = new RegExp(pattern, flags);
        return regex.test(String(value));
      } catch (e) {
        return false;
      }
    }
    
    // Numeric comparisons
    if (typeof value === 'number') {
      if (!isNaN(condition)) {
        return value === Number(condition);
      }
      if (condition.startsWith('>=')) {
        const target = Number(condition.slice(2).trim());
        return !isNaN(target) && value >= target;
      }
      if (condition.startsWith('<=')) {
        const target = Number(condition.slice(2).trim());
        return !isNaN(target) && value <= target;
      }
      if (condition.startsWith('>') && !condition.startsWith('>=')) {
        const target = Number(condition.slice(1).trim());
        return !isNaN(target) && value > target;
      }
      if (condition.startsWith('<') && !condition.startsWith('<=')) {
        const target = Number(condition.slice(1).trim());
        return !isNaN(target) && value < target;
      }
      if (condition.includes('-') && !condition.startsWith('<') && !condition.startsWith('>')) {
        const parts = condition.split('-').map(p => p.trim());
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const [min, max] = parts.map(Number);
          return value >= min && value <= max;
        }
      }
    }
    
    // Default: string equality
    return String(value) === condition;
  }

  /**
   * Apply configuration to element
   */
  function applyConfig(element, config, currentValue) {
    // Use DOM Helpers' .update() method if available
    if (element.update && typeof element.update === 'function') {
      try {
        element.update(config);
        return;
      } catch (e) {
        console.warn('[Conditions] Error using element.update():', e);
      }
    }
    
    // Manual application (fallback)
    Object.entries(config).forEach(([key, val]) => {
      try {
        applyProperty(element, key, val);
      } catch (e) {
        console.warn(`[Conditions] Failed to apply ${key}:`, e);
      }
    });
  }

  /**
   * Apply property to element (simplified version)
   */
  function applyProperty(element, key, val) {
    // Style object
    if (key === 'style' && typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([prop, value]) => {
        if (value !== null && value !== undefined) {
          element.style[prop] = value;
        }
      });
      return;
    }
    
    // classList operations
    if (key === 'classList' && typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        element.className = '';
        val.forEach(cls => cls && element.classList.add(cls));
      } else {
        Object.entries(val).forEach(([method, classes]) => {
          const classList = Array.isArray(classes) ? classes : [classes];
          if (method === 'add') {
            classList.forEach(cls => cls && element.classList.add(cls));
          } else if (method === 'remove') {
            classList.forEach(cls => cls && element.classList.remove(cls));
          } else if (method === 'toggle') {
            classList.forEach(cls => cls && element.classList.toggle(cls));
          } else if (method === 'replace' && Array.isArray(classes) && classes.length === 2) {
            element.classList.replace(classes[0], classes[1]);
          }
        });
      }
      return;
    }
    
    // setAttribute / attrs
    if ((key === 'attrs' || key === 'setAttribute') && typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([attr, attrVal]) => {
        if (attrVal === null || attrVal === undefined || attrVal === false) {
          element.removeAttribute(attr);
        } else {
          element.setAttribute(attr, String(attrVal));
        }
      });
      return;
    }
    
    // removeAttribute
    if (key === 'removeAttribute') {
      if (Array.isArray(val)) {
        val.forEach(attr => element.removeAttribute(attr));
      } else if (typeof val === 'string') {
        element.removeAttribute(val);
      }
      return;
    }
    
    // dataset
    if (key === 'dataset' && typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([dataKey, dataVal]) => {
        element.dataset[dataKey] = String(dataVal);
      });
      return;
    }
    
    // addEventListener
    if (key === 'addEventListener' && typeof val === 'object' && val !== null) {
      if (!element._whenStateListeners) {
        element._whenStateListeners = [];
      }
      
      Object.entries(val).forEach(([event, handlerConfig]) => {
        let handler, options;
        
        if (typeof handlerConfig === 'function') {
          handler = handlerConfig;
          options = undefined;
        } else if (typeof handlerConfig === 'object' && handlerConfig !== null) {
          handler = handlerConfig.handler;
          options = handlerConfig.options;
        }
        
        if (handler && typeof handler === 'function') {
          element.addEventListener(event, handler, options);
          element._whenStateListeners.push({ event, handler, options });
        }
      });
      return;
    }
    
    // removeEventListener
    if (key === 'removeEventListener' && Array.isArray(val) && val.length >= 2) {
      const [event, handler, options] = val;
      element.removeEventListener(event, handler, options);
      return;
    }
    
    // on* event properties
    if (key.startsWith('on') && typeof val === 'function') {
      element[key] = val;
      return;
    }
    
    // Native DOM properties
    if (key in element) {
      element[key] = val;
      return;
    }
    
    // Fallback: setAttribute
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      element.setAttribute(key, String(val));
    }
  }

  // ============================================================================
  // UPDATE CONVENIENCE METHODS
  // ============================================================================

  // Update convenience methods in DOM Helpers if they exist
  if (global.Elements) {
    global.Elements.whenState = Conditions.whenState;
  }
  
  if (global.Collections) {
    global.Collections.whenState = Conditions.whenState;
  }
  
  if (global.Selector) {
    global.Selector.whenState = Conditions.whenState;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  console.log('[Conditions.Default] Enhancement loaded successfully');
  console.log('[Conditions.Default] Features:');
  console.log('  - Explicit "default" condition support');
  console.log('  - Fallback behavior when no conditions match');
  console.log('  - Alternative "*" wildcard syntax');
  console.log('  - Full backward compatibility maintained');

})(typeof window !== 'undefined' ? window : global);
