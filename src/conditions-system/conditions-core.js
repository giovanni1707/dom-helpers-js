/**
 * DOM Helpers - Conditions Core
 *
 * Declarative conditional rendering system with automatic reactivity
 * Supports 15+ condition matchers, 10+ property handlers, and collection-aware updates
 *
 * @version 2.3.1
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
    global.DOMHelpersConditionsCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // ENVIRONMENT DETECTION
  // ============================================================================

  const hasReactiveUtils = typeof ReactiveUtils !== 'undefined';
  const hasElements = typeof Elements !== 'undefined';
  const hasCollections = typeof Collections !== 'undefined';
  const hasSelector = typeof Selector !== 'undefined';

  // Detect reactive capabilities
  let effect, batch, isReactive;

  if (hasReactiveUtils) {
    effect = ReactiveUtils.effect;
    batch = ReactiveUtils.batch;
    isReactive = ReactiveUtils.isReactive;
  } else if (hasElements && typeof Elements.effect === 'function') {
    effect = Elements.effect;
    batch = Elements.batch;
    isReactive = Elements.isReactive;
  }

  const hasReactivity = !!(effect && batch);

  // ============================================================================
  // CONDITION MATCHERS REGISTRY (Strategy Pattern)
  // ============================================================================

  const conditionMatchers = {
    // Boolean literals
    booleanTrue: {
      test: (condition) => condition === 'true',
      match: (value) => value === true
    },
    booleanFalse: {
      test: (condition) => condition === 'false',
      match: (value) => value === false
    },
    truthy: {
      test: (condition) => condition === 'truthy',
      match: (value) => !!value
    },
    falsy: {
      test: (condition) => condition === 'falsy',
      match: (value) => !value
    },

    // Null/Undefined/Empty checks
    null: {
      test: (condition) => condition === 'null',
      match: (value) => value === null
    },
    undefined: {
      test: (condition) => condition === 'undefined',
      match: (value) => value === undefined
    },
    empty: {
      test: (condition) => condition === 'empty',
      match: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return !value;
      }
    },

    // Quoted strings
    quotedString: {
      test: (condition) =>
        (condition.startsWith('"') && condition.endsWith('"')) ||
        (condition.startsWith("'") && condition.endsWith("'")),
      match: (value, condition) => String(value) === condition.slice(1, -1)
    },

    // String pattern matching
    includes: {
      test: (condition) => condition.startsWith('includes:'),
      match: (value, condition) => {
        const searchTerm = condition.slice(9).trim();
        return String(value).includes(searchTerm);
      }
    },
    startsWith: {
      test: (condition) => condition.startsWith('startsWith:'),
      match: (value, condition) => {
        const prefix = condition.slice(11).trim();
        return String(value).startsWith(prefix);
      }
    },
    endsWith: {
      test: (condition) => condition.startsWith('endsWith:'),
      match: (value, condition) => {
        const suffix = condition.slice(9).trim();
        return String(value).endsWith(suffix);
      }
    },

    // Regex pattern matching
    regex: {
      test: (condition) =>
        condition.startsWith('/') && condition.lastIndexOf('/') > 0,
      match: (value, condition) => {
        try {
          const lastSlash = condition.lastIndexOf('/');
          const pattern = condition.slice(1, lastSlash);
          const flags = condition.slice(lastSlash + 1);
          const regex = new RegExp(pattern, flags);
          return regex.test(String(value));
        } catch (e) {
          console.warn('[Conditions] Invalid regex pattern:', condition, e);
          return false;
        }
      }
    },

    // Numeric comparisons (only if value is a number)
    numericRange: {
      test: (condition, value) =>
        typeof value === 'number' &&
        condition.includes('-') &&
        !condition.startsWith('<') &&
        !condition.startsWith('>') &&
        !condition.startsWith('='),
      match: (value, condition) => {
        const parts = condition.split('-').map(p => p.trim());
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const [min, max] = parts.map(Number);
          return value >= min && value <= max;
        }
        return false;
      }
    },
    numericExact: {
      test: (condition, value) =>
        typeof value === 'number' && !isNaN(condition),
      match: (value, condition) => value === Number(condition)
    },
    greaterThanOrEqual: {
      test: (condition, value) =>
        typeof value === 'number' && condition.startsWith('>='),
      match: (value, condition) => {
        const target = Number(condition.slice(2).trim());
        return !isNaN(target) && value >= target;
      }
    },
    lessThanOrEqual: {
      test: (condition, value) =>
        typeof value === 'number' && condition.startsWith('<='),
      match: (value, condition) => {
        const target = Number(condition.slice(2).trim());
        return !isNaN(target) && value <= target;
      }
    },
    greaterThan: {
      test: (condition, value) =>
        typeof value === 'number' && condition.startsWith('>') && !condition.startsWith('>='),
      match: (value, condition) => {
        const target = Number(condition.slice(1).trim());
        return !isNaN(target) && value > target;
      }
    },
    lessThan: {
      test: (condition, value) =>
        typeof value === 'number' && condition.startsWith('<') && !condition.startsWith('<='),
      match: (value, condition) => {
        const target = Number(condition.slice(1).trim());
        return !isNaN(target) && value < target;
      }
    },

    // Default: string equality
    stringEquality: {
      test: () => true, // Always applicable as fallback
      match: (value, condition) => String(value) === condition
    }
  };

  /**
   * Match value against condition using registered matchers
   * @param {*} value - Value to test
   * @param {string} condition - Condition string
   * @returns {boolean} true if condition matches
   * @exported Used by collections and other modules
   */
  function matchesCondition(value, condition) {
    condition = String(condition).trim();

    // Iterate through matchers and return first match
    for (const matcher of Object.values(conditionMatchers)) {
      if (matcher.test(condition, value)) {
        return matcher.match(value, condition);
      }
    }

    return false;
  }

  /**
   * Register custom condition matcher
   * @param {string} name - Unique matcher name
   * @param {Object} matcher - Matcher definition {test, match}
   */
  function registerConditionMatcher(name, matcher) {
    if (!matcher.test || !matcher.match) {
      console.error('[Conditions] Invalid matcher. Must have test() and match() methods.');
      return;
    }
    conditionMatchers[name] = matcher;
  }

  // ============================================================================
  // PROPERTY HANDLERS REGISTRY (Strategy Pattern)
  // ============================================================================

  const propertyHandlers = {
    // Style object
    style: {
      test: (key, val) => key === 'style' && typeof val === 'object' && val !== null,
      apply: (element, val) => {
        Object.entries(val).forEach(([prop, value]) => {
          if (value !== null && value !== undefined) {
            element.style[prop] = value;
          }
        });
      }
    },

    // classList operations
    classList: {
      test: (key, val) => key === 'classList' && typeof val === 'object' && val !== null,
      apply: (element, val) => {
        if (Array.isArray(val)) {
          // Replace all classes
          element.className = '';
          val.forEach(cls => cls && element.classList.add(cls));
        } else {
          // Individual operations
          const operations = {
            add: (classes) => {
              const classList = Array.isArray(classes) ? classes : [classes];
              classList.forEach(cls => cls && element.classList.add(cls));
            },
            remove: (classes) => {
              const classList = Array.isArray(classes) ? classes : [classes];
              classList.forEach(cls => cls && element.classList.remove(cls));
            },
            toggle: (classes) => {
              const classList = Array.isArray(classes) ? classes : [classes];
              classList.forEach(cls => cls && element.classList.toggle(cls));
            },
            replace: (classes) => {
              if (Array.isArray(classes) && classes.length === 2) {
                element.classList.replace(classes[0], classes[1]);
              }
            }
          };

          Object.entries(val).forEach(([method, classes]) => {
            if (operations[method]) {
              operations[method](classes);
            }
          });
        }
      }
    },

    // setAttribute / attrs (object form)
    setAttribute: {
      test: (key, val) =>
        (key === 'attrs' || key === 'setAttribute') &&
        typeof val === 'object' && val !== null,
      apply: (element, val) => {
        Object.entries(val).forEach(([attr, attrVal]) => {
          if (attrVal === null || attrVal === undefined || attrVal === false) {
            element.removeAttribute(attr);
          } else {
            element.setAttribute(attr, String(attrVal));
          }
        });
      }
    },

    // removeAttribute
    removeAttribute: {
      test: (key) => key === 'removeAttribute',
      apply: (element, val) => {
        if (Array.isArray(val)) {
          val.forEach(attr => element.removeAttribute(attr));
        } else if (typeof val === 'string') {
          element.removeAttribute(val);
        }
      }
    },

    // dataset
    dataset: {
      test: (key, val) => key === 'dataset' && typeof val === 'object' && val !== null,
      apply: (element, val) => {
        Object.entries(val).forEach(([dataKey, dataVal]) => {
          element.dataset[dataKey] = String(dataVal);
        });
      }
    },

    // addEventListener
    addEventListener: {
      test: (key, val) => key === 'addEventListener' && typeof val === 'object' && val !== null,
      apply: (element, val) => {
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
      }
    },

    // removeEventListener
    removeEventListener: {
      test: (key, val) => key === 'removeEventListener' && Array.isArray(val) && val.length >= 2,
      apply: (element, val) => {
        const [event, handler, options] = val;
        element.removeEventListener(event, handler, options);
      }
    },

    // on* event properties (onclick, onchange, etc.)
    eventProperty: {
      test: (key, val) => key.startsWith('on') && typeof val === 'function',
      apply: (element, val, key) => {
        element[key] = val;
      }
    },

    // Native DOM properties
    nativeProperty: {
      test: (key, val, element) => key in element,
      apply: (element, val, key) => {
        element[key] = val;
      }
    },

    // Default: try setAttribute for primitives
    fallback: {
      test: (key, val) =>
        typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean',
      apply: (element, val, key) => {
        element.setAttribute(key, String(val));
      }
    }
  };

  /**
   * Apply a single property to an element using registered handlers
   * @param {HTMLElement} element - Target element
   * @param {string} key - Property key
   * @param {*} val - Property value
   * @exported Used by collections and other modules
   */
  function applyProperty(element, key, val) {
    try {
      // Find and execute first matching handler
      for (const handler of Object.values(propertyHandlers)) {
        if (handler.test(key, val, element)) {
          handler.apply(element, val, key);
          return;
        }
      }
    } catch (e) {
      console.warn(`[Conditions] Failed to apply ${key}:`, e);
    }
  }

  /**
   * Register custom property handler
   * @param {string} name - Unique handler name
   * @param {Object} handler - Handler definition {test, apply}
   */
  function registerPropertyHandler(name, handler) {
    if (!handler.test || !handler.apply) {
      console.error('[Conditions] Invalid handler. Must have test() and apply() methods.');
      return;
    }
    // Insert before fallback
    const entries = Object.entries(propertyHandlers);
    const fallback = entries.pop();
    propertyHandlers[name] = handler;
    if (fallback) {
      propertyHandlers[fallback[0]] = fallback[1];
    }
  }

  // ============================================================================
  // ELEMENT SELECTOR & RETRIEVAL
  // ============================================================================

  /**
   * Safely convert any collection to array, avoiding Symbol issues
   * @param {*} collection - Collection to convert
   * @returns {Array} Array of elements
   * @exported Used by collections module
   */
  function safeArrayFrom(collection) {
    if (!collection) return [];

    // Already an array
    if (Array.isArray(collection)) {
      return collection;
    }

    // Standard NodeList or HTMLCollection
    if (collection instanceof NodeList || collection instanceof HTMLCollection) {
      return Array.from(collection);
    }

    // Custom collection with length property
    if (typeof collection === 'object' && 'length' in collection) {
      const elements = [];
      const len = Number(collection.length);
      if (!isNaN(len) && len >= 0) {
        for (let i = 0; i < len; i++) {
          // Only access numeric indices, skip Symbols
          if (Object.prototype.hasOwnProperty.call(collection, i)) {
            const item = collection[i];
            if (item instanceof Element) {
              elements.push(item);
            }
          }
        }
      }
      return elements;
    }

    return [];
  }

  /**
   * Get elements from various selector types
   * @param {string|Element|NodeList|Array} selector - Selector
   * @returns {Array<HTMLElement>} Array of elements
   * @exported Used by collections module
   */
  function getElements(selector) {
    // Single element
    if (selector instanceof Element) {
      return [selector];
    }

    // NodeList or HTMLCollection
    if (selector instanceof NodeList || selector instanceof HTMLCollection) {
      return safeArrayFrom(selector);
    }

    // Array
    if (Array.isArray(selector)) {
      return selector.filter(el => el instanceof Element);
    }

    // String selector
    if (typeof selector === 'string') {
      // ID selector
      if (selector.startsWith('#')) {
        const id = selector.slice(1);
        // Try DOM Helpers Elements first
        if (hasElements && Elements[id]) {
          return [Elements[id]];
        }
        const el = document.getElementById(id);
        return el ? [el] : [];
      }

      // Class selector
      if (selector.startsWith('.')) {
        const className = selector.slice(1);
        // Try DOM Helpers Collections first
        if (hasCollections && Collections.ClassName) {
          const collection = Collections.ClassName[className];
          if (collection) {
            return safeArrayFrom(collection);
          }
        }
        return Array.from(document.getElementsByClassName(className));
      }

      // Use Selector helper if available
      if (hasSelector && Selector.queryAll) {
        const result = Selector.queryAll(selector);
        return result ? safeArrayFrom(result) : [];
      }

      // Fallback to native querySelectorAll
      return safeArrayFrom(document.querySelectorAll(selector));
    }

    return [];
  }

  // ============================================================================
  // EVENT LISTENER CLEANUP
  // ============================================================================

  /**
   * Cleanup event listeners attached by previous conditions
   * @param {HTMLElement} element - Element to cleanup
   * @internal
   */
  function cleanupListeners(element) {
    if (element._whenStateListeners) {
      element._whenStateListeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      element._whenStateListeners = [];
    }
  }

  // ============================================================================
  // CONFIGURATION APPLICATION
  // ============================================================================

  /**
   * Apply configuration object to element
   * @param {HTMLElement} element - Target element
   * @param {Object} config - Configuration object
   * @internal
   */
  function applyConfig(element, config) {
    // Try using DOM Helpers' .update() method if available
    if (element.update && typeof element.update === 'function') {
      try {
        element.update(config);
        return;
      } catch (e) {
        console.warn('[Conditions] Error using element.update():', e);
        // Fall through to manual application
      }
    }

    // Manual application (fallback)
    Object.entries(config).forEach(([key, val]) => {
      applyProperty(element, key, val);
    });
  }

  /**
   * Apply configuration to collection with index support
   * @param {Array<HTMLElement>} elements - Target elements
   * @param {Object} config - Configuration object
   * @internal
   */
  function applyToCollection(elements, config) {
    // Separate index-specific and shared properties
    const sharedProps = {};
    const indexProps = {};

    Object.entries(config).forEach(([key, value]) => {
      // Check if key is a numeric index (including negative)
      if (/^-?\d+$/.test(key)) {
        indexProps[key] = value;
      } else {
        sharedProps[key] = value;
      }
    });

    // Apply shared properties to ALL elements
    if (Object.keys(sharedProps).length > 0) {
      elements.forEach(element => {
        applyConfig(element, sharedProps);
      });
    }

    // Apply index-specific properties
    Object.entries(indexProps).forEach(([indexStr, updates]) => {
      let index = parseInt(indexStr);

      // Handle negative indices
      if (index < 0) {
        index = elements.length + index;
      }

      // Apply if index is valid
      if (index >= 0 && index < elements.length) {
        const element = elements[index];
        applyConfig(element, updates);
      }
    });
  }

  // ============================================================================
  // CORE LOGIC
  // ============================================================================

  /**
   * Core logic: Apply conditions to elements
   * @param {Function} getValue - Function to get current value
   * @param {Object|Function} conditions - Condition mappings
   * @param {string|Element|NodeList|Array} selector - Target elements
   * @param {boolean} supportDefaultBranch - Whether to support default branch
   * @internal
   */
  function applyConditions(getValue, conditions, selector, supportDefaultBranch = false) {
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

    // Extract default branch if present and supported
    let defaultConfig = null;
    let regularConditions = conditionsObj;

    if (supportDefaultBranch && 'default' in conditionsObj) {
      const { default: extracted, ...regular } = conditionsObj;
      defaultConfig = extracted;
      regularConditions = regular;
    }

    // Find matching condition
    let matchingConfig = null;
    for (const [condition, config] of Object.entries(regularConditions)) {
      if (matchesCondition(value, condition)) {
        matchingConfig = config;
        break; // Only apply first matching condition
      }
    }

    // Fall back to default if no match found
    if (!matchingConfig && defaultConfig) {
      matchingConfig = defaultConfig;
    }

    if (!matchingConfig) {
      return;
    }

    // Cleanup previous event listeners
    elements.forEach(element => cleanupListeners(element));

    // Apply configuration to collection
    applyToCollection(elements, matchingConfig);
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const api = {
    /**
     * Reactive conditional rendering with automatic updates
     * @param {Function|*} valueFn - Function returning state value OR direct value
     * @param {Object|Function} conditions - Condition mappings
     * @param {string|Element|NodeList|Array} selector - Target elements
     * @param {Object} options - {reactive: boolean}
     * @returns {Object|void} Cleanup object or void
     */
    whenState(valueFn, conditions, selector, options = {}) {
      // Validate inputs
      if (!conditions || (typeof conditions !== 'object' && typeof conditions !== 'function')) {
        console.error('[Conditions] Second argument must be an object or function returning an object');
        return;
      }

      // Determine if we should use reactive mode
      const useReactive = options.reactive !== false && hasReactivity;
      const isFunction = typeof valueFn === 'function';

      // If valueFn is not a function, treat it as a static value
      const getValue = isFunction ? valueFn : () => valueFn;

      // Check if value is reactive state
      const valueIsReactiveState = isFunction && hasReactivity &&
                                    typeof isReactive === 'function' &&
                                    isReactive(valueFn());

      // Decide execution mode
      if (useReactive && (isFunction || valueIsReactiveState)) {
        // REACTIVE MODE: Use effect for automatic updates
        return effect(() => {
          applyConditions(getValue, conditions, selector);
        });
      } else {
        // NON-REACTIVE MODE: Execute once
        applyConditions(getValue, conditions, selector);

        // Return update function for manual updates if needed
        return {
          update: () => applyConditions(getValue, conditions, selector),
          destroy: () => {} // No cleanup needed in non-reactive mode
        };
      }
    },

    /**
     * Manual mode: Apply conditions once without reactivity
     * Supports default branch and index-specific updates
     * @param {*} value - Current value to match
     * @param {Object|Function} conditions - Condition mappings
     * @param {string|Element|NodeList|Array} selector - Target elements
     * @returns {Object} this for chaining
     */
    apply(value, conditions, selector) {
      const getValue = typeof value === 'function' ? value : () => value;
      applyConditions(getValue, conditions, selector, true); // Support default branch
      return this;
    },

    /**
     * Watch mode: Re-apply when value changes (requires reactivity)
     * @param {Function|*} valueFn - Function returning state value
     * @param {Object|Function} conditions - Condition mappings
     * @param {string|Element|NodeList|Array} selector - Target elements
     * @returns {Object|void} Cleanup object or void
     */
    watch(valueFn, conditions, selector) {
      if (!hasReactivity) {
        console.warn('[Conditions] watch() requires reactive library');
        return this.apply(valueFn, conditions, selector);
      }
      return this.whenState(valueFn, conditions, selector, { reactive: true });
    },

    /**
     * Batch multiple updates
     * @param {Function} fn - Function containing batch updates
     * @returns {*} Result of batch function
     */
    batch(fn) {
      if (batch && typeof batch === 'function') {
        return batch(fn);
      }
      return fn(); // Fallback: execute immediately
    },

    /**
     * Register custom condition matcher
     * @param {string} name - Unique matcher name
     * @param {Object} matcher - Matcher definition {test, match}
     * @returns {Object} this for chaining
     */
    registerMatcher(name, matcher) {
      registerConditionMatcher(name, matcher);
      return this;
    },

    /**
     * Register custom property handler
     * @param {string} name - Unique handler name
     * @param {Object} handler - Handler definition {test, apply}
     * @returns {Object} this for chaining
     */
    registerHandler(name, handler) {
      registerPropertyHandler(name, handler);
      return this;
    },

    /**
     * Get registered matchers (for debugging/inspection)
     * @returns {Array<string>} Matcher names
     */
    getMatchers() {
      return Object.keys(conditionMatchers);
    },

    /**
     * Get registered handlers (for debugging/inspection)
     * @returns {Array<string>} Handler names
     */
    getHandlers() {
      return Object.keys(propertyHandlers);
    },

    /**
     * Check if reactive mode is available
     * @returns {boolean}
     */
    get hasReactivity() {
      return hasReactivity;
    },

    /**
     * Get current mode
     * @returns {string} 'reactive' or 'static'
     */
    get mode() {
      return hasReactivity ? 'reactive' : 'static';
    },

    // Shared utilities (exported for other modules)
    matchesCondition,
    applyProperty,
    getElements,
    safeArrayFrom,

    // Version
    version: '2.3.1'
  };

  // ============================================================================
  // GLOBAL INTEGRATION
  // ============================================================================

  // Export to global Conditions namespace
  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    globalObj.Conditions = api;

    // Add convenience methods to DOM Helpers if available
    if (hasElements) {
      Elements.whenState = api.whenState;
      Elements.whenApply = api.apply;
      Elements.whenWatch = api.watch;
    }

    if (hasCollections) {
      Collections.whenState = api.whenState;
      Collections.whenApply = api.apply;
      Collections.whenWatch = api.watch;
    }

    if (hasSelector) {
      Selector.whenState = api.whenState;
      Selector.whenApply = api.apply;
      Selector.whenWatch = api.watch;
    }
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Conditions Core] v2.3.1 loaded successfully');
    console.log('[DOM Helpers Conditions Core] Mode:', hasReactivity ? 'Reactive + Static' : 'Static only');
    console.log('[DOM Helpers Conditions Core] Features:');
    console.log('  - 15+ condition matchers (boolean, string, regex, numeric)');
    console.log('  - 10+ property handlers (style, classList, attributes, events)');
    console.log('  - Collection-aware with index support');
    console.log('  - Default branch support in apply()');
    console.log('  - Extensible via registerMatcher() and registerHandler()');
  }

  return api;
});
