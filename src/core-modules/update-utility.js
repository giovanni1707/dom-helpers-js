/**
 * DOM Helpers - Update Utility Module
 * Universal .update() method with fine-grained change detection
 *
 * @module update-utility
 * @version 2.3.1
 * @license MIT
 *
 * This module provides the core update functionality used by all DOM Helpers.
 * It can be used standalone or as a dependency for other modules.
 *
 * Features:
 * - Fine-grained change detection (only updates what changed)
 * - Event listener deduplication
 * - Deep equality comparison
 * - Style property optimization
 * - ClassList operations
 * - Attribute management
 * - Dataset operations
 * - Method invocation
 *
 * @example
 * // Standalone usage
 * import { enhanceElementWithUpdate } from './update-utility.js';
 *
 * const button = document.querySelector('.button');
 * enhanceElementWithUpdate(button);
 *
 * button.update({
 *   textContent: 'Click me',
 *   style: { color: 'red' },
 *   classList: { add: ['active'] }
 * });
 */

(function (global, factory) {
  'use strict';

  // Universal Module Definition (UMD)
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS/Node.js
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], factory);
  } else {
    // Browser globals
    global.DOMHelpersUpdateUtility = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this, function () {
  'use strict';

  // ===== CONFIGURATION =====
  const isDevelopment =
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
    (typeof location !== 'undefined' && location.hostname === 'localhost');

  // ===== DATA STRUCTURES =====
  /**
   * WeakMap to store previous props for each element
   * Enables fine-grained change detection
   */
  const elementPreviousProps = new WeakMap();

  /**
   * WeakMap to store event listeners for each element
   * Prevents duplicate event listener registration
   * Structure: element -> Map { eventType -> Map { handler -> {handler, options} } }
   */
  const elementEventListeners = new WeakMap();

  // ===== INTERNAL UTILITIES =====

  /**
   * Get previous props for an element
   * @param {HTMLElement} element - DOM element
   * @returns {Object} Previous props object
   */
  function getPreviousProps(element) {
    if (!elementPreviousProps.has(element)) {
      elementPreviousProps.set(element, {});
    }
    return elementPreviousProps.get(element);
  }

  /**
   * Store props for an element
   * @param {HTMLElement} element - DOM element
   * @param {string} key - Property key
   * @param {*} value - Property value
   */
  function storePreviousProps(element, key, value) {
    const prevProps = getPreviousProps(element);
    prevProps[key] = value;
  }

  /**
   * Get stored event listeners for an element
   * @param {HTMLElement} element - DOM element
   * @returns {Map} Event listeners map
   */
  function getElementEventListeners(element) {
    if (!elementEventListeners.has(element)) {
      elementEventListeners.set(element, new Map());
    }
    return elementEventListeners.get(element);
  }

  /**
   * Deep equality comparison
   * @param {*} value1 - First value
   * @param {*} value2 - Second value
   * @returns {boolean} True if deeply equal
   */
  function isEqual(value1, value2) {
    // Handle primitives
    if (value1 === value2) return true;

    // Handle null/undefined
    if (value1 == null || value2 == null) return value1 === value2;

    // Handle different types
    if (typeof value1 !== typeof value2) return false;

    // Handle objects
    if (typeof value1 === 'object') {
      // Handle arrays
      if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) return false;
        return value1.every((val, idx) => isEqual(val, value2[idx]));
      }

      // Handle plain objects
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => isEqual(value1[key], value2[key]));
    }

    return false;
  }

  /**
   * Update style properties with change detection
   * Only updates styles that have actually changed
   * @param {HTMLElement} element - DOM element
   * @param {Object} newStyles - New style properties
   */
  function updateStyleProperties(element, newStyles) {
    const prevProps = getPreviousProps(element);
    const prevStyles = prevProps.style || {};

    Object.entries(newStyles).forEach(([property, newValue]) => {
      if (newValue === null || newValue === undefined) return;

      const currentValue = element.style[property];

      // Only update if value actually changed
      if (currentValue !== newValue && prevStyles[property] !== newValue) {
        element.style[property] = newValue;
        prevStyles[property] = newValue;
      }
    });

    prevProps.style = prevStyles;
  }

  /**
   * Add event listener only if not already present
   * Prevents duplicate event listeners
   * @param {HTMLElement} element - DOM element
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  function addEventListenerOnce(element, eventType, handler, options) {
    const listeners = getElementEventListeners(element);

    if (!listeners.has(eventType)) {
      listeners.set(eventType, new Map());
    }

    const handlersForEvent = listeners.get(eventType);
    const handlerKey = handler;

    if (!handlersForEvent.has(handlerKey)) {
      element.addEventListener(eventType, handler, options);
      handlersForEvent.set(handlerKey, { handler, options });
    }
  }

  /**
   * Remove event listener if present
   * @param {HTMLElement} element - DOM element
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  function removeEventListenerIfPresent(element, eventType, handler, options) {
    const listeners = getElementEventListeners(element);

    if (listeners.has(eventType)) {
      const handlersForEvent = listeners.get(eventType);
      const handlerKey = handler;

      if (handlersForEvent.has(handlerKey)) {
        element.removeEventListener(eventType, handler, options);
        handlersForEvent.delete(handlerKey);

        if (handlersForEvent.size === 0) {
          listeners.delete(eventType);
        }
      }
    }
  }

  /**
   * Handle classList updates
   * @param {HTMLElement} element - DOM element
   * @param {Object} classListUpdates - ClassList operations
   */
  function handleClassListUpdate(element, classListUpdates) {
    Object.entries(classListUpdates).forEach(([method, classes]) => {
      try {
        switch (method) {
          case 'add':
            if (Array.isArray(classes)) {
              element.classList.add(...classes);
            } else if (typeof classes === 'string') {
              element.classList.add(classes);
            }
            break;

          case 'remove':
            if (Array.isArray(classes)) {
              element.classList.remove(...classes);
            } else if (typeof classes === 'string') {
              element.classList.remove(classes);
            }
            break;

          case 'toggle':
            if (Array.isArray(classes)) {
              classes.forEach((cls) => element.classList.toggle(cls));
            } else if (typeof classes === 'string') {
              element.classList.toggle(classes);
            }
            break;

          case 'replace':
            if (Array.isArray(classes) && classes.length === 2) {
              element.classList.replace(classes[0], classes[1]);
            }
            break;

          case 'contains':
            if (Array.isArray(classes)) {
              classes.forEach((cls) => {
                console.log(`[DOM Helpers] classList.contains('${cls}'):`, element.classList.contains(cls));
              });
            } else if (typeof classes === 'string') {
              console.log(`[DOM Helpers] classList.contains('${classes}'):`, element.classList.contains(classes));
            }
            break;

          default:
            console.warn(`[DOM Helpers] Unknown classList method: ${method}`);
        }
      } catch (error) {
        console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
      }
    });
  }

  /**
   * Create enhanced event handler with e.target.update() and this.update() support
   * @param {Function} originalHandler - Original event handler
   * @returns {Function} Enhanced event handler
   */
  function createEnhancedEventHandler(originalHandler) {
    return function enhancedEventHandler(event) {
      // Add update method to event.target if it doesn't exist
      if (event.target && !event.target.update) {
        enhanceElementWithUpdate(event.target);
      }

      // Add update method to 'this' context if it doesn't exist
      if (this && this.nodeType === Node.ELEMENT_NODE && !this.update) {
        enhanceElementWithUpdate(this);
      }

      return originalHandler.call(this, event);
    };
  }

  /**
   * Handle addEventListener with tracking
   * @param {HTMLElement} element - DOM element
   * @param {Array|Object} value - Event listener configuration
   */
  function handleEnhancedEventListenerWithTracking(element, value) {
    // Handle array format: ['click', handler, options]
    if (Array.isArray(value) && value.length >= 2) {
      const [eventType, handler, options] = value;
      const enhancedHandler = createEnhancedEventHandler(handler);
      addEventListenerOnce(element, eventType, enhancedHandler, options);
      return;
    }

    // Handle object format: { click: handler, keydown: [handler, options] }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([eventType, handler]) => {
        if (typeof handler === 'function') {
          const enhancedHandler = createEnhancedEventHandler(handler);
          addEventListenerOnce(element, eventType, enhancedHandler);
        } else if (Array.isArray(handler) && handler.length >= 1) {
          const [handlerFunc, options] = handler;
          if (typeof handlerFunc === 'function') {
            const enhancedHandler = createEnhancedEventHandler(handlerFunc);
            addEventListenerOnce(element, eventType, enhancedHandler, options);
          }
        }
      });
      return;
    }

    console.warn('[DOM Helpers] Invalid addEventListener value format');
  }

  // ===== CORE UPDATE FUNCTIONS =====

  /**
   * Apply enhanced update to a single element
   * Handles all update operations with fine-grained change detection
   * @param {HTMLElement} element - DOM element
   * @param {string} key - Update key
   * @param {*} value - Update value
   */
  function applyEnhancedUpdate(element, key, value) {
    try {
      const prevProps = getPreviousProps(element);

      // 1. textContent/innerText - only update if different
      if (key === 'textContent' || key === 'innerText') {
        if (element[key] !== value && prevProps[key] !== value) {
          element[key] = value;
          storePreviousProps(element, key, value);
        }
        return;
      }

      // 2. innerHTML - only update if different
      if (key === 'innerHTML') {
        if (element.innerHTML !== value && prevProps.innerHTML !== value) {
          element.innerHTML = value;
          storePreviousProps(element, 'innerHTML', value);
        }
        return;
      }

      // 3. Style object - granular style property updates
      if (key === 'style' && typeof value === 'object' && value !== null) {
        updateStyleProperties(element, value);
        return;
      }

      // 4. classList methods
      if (key === 'classList' && typeof value === 'object' && value !== null) {
        handleClassListUpdate(element, value);
        return;
      }

      // 5. setAttribute - array or object format
      if (key === 'setAttribute') {
        if (Array.isArray(value) && value.length >= 2) {
          const [attrName, attrValue] = value;
          const currentValue = element.getAttribute(attrName);
          if (currentValue !== attrValue) {
            element.setAttribute(attrName, attrValue);
          }
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([attrName, attrValue]) => {
            const currentValue = element.getAttribute(attrName);
            if (currentValue !== attrValue) {
              element.setAttribute(attrName, attrValue);
            }
          });
        }
        return;
      }

      // 6. removeAttribute
      if (key === 'removeAttribute') {
        if (Array.isArray(value)) {
          value.forEach((attr) => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          });
        } else if (typeof value === 'string') {
          if (element.hasAttribute(value)) {
            element.removeAttribute(value);
          }
        }
        return;
      }

      // 7. getAttribute - for debugging
      if (key === 'getAttribute' && typeof value === 'string') {
        const attrValue = element.getAttribute(value);
        console.log(`[DOM Helpers] getAttribute('${value}'):`, attrValue);
        return;
      }

      // 8. addEventListener - with duplicate prevention
      if (key === 'addEventListener') {
        handleEnhancedEventListenerWithTracking(element, value);
        return;
      }

      // 9. removeEventListener
      if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
        const [eventType, handler, options] = value;
        removeEventListenerIfPresent(element, eventType, handler, options);
        return;
      }

      // 10. dataset
      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          if (element.dataset[dataKey] !== dataValue) {
            element.dataset[dataKey] = dataValue;
          }
        });
        return;
      }

      // 11. DOM methods
      if (typeof element[key] === 'function') {
        if (Array.isArray(value)) {
          element[key](...value);
        } else {
          element[key](value);
        }
        return;
      }

      // 12. Regular DOM properties
      if (key in element) {
        if (!isEqual(element[key], value) && !isEqual(prevProps[key], value)) {
          element[key] = value;
          storePreviousProps(element, key, value);
        }
        return;
      }

      // 13. Fallback to setAttribute
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        const currentValue = element.getAttribute(key);
        const stringValue = String(value);
        if (currentValue !== stringValue) {
          element.setAttribute(key, stringValue);
        }
        return;
      }

      console.warn(`[DOM Helpers] Unknown property or method: ${key}`);
    } catch (error) {
      console.warn(`[DOM Helpers] Failed to apply update ${key}: ${error.message}`);
    }
  }

  /**
   * Update a single DOM element
   * @param {HTMLElement} element - DOM element
   * @param {Object} updates - Updates to apply
   * @returns {HTMLElement} Element for chaining
   */
  function updateSingleElement(element, updates) {
    if (!element || !element.nodeType) {
      console.warn('[DOM Helpers] .update() called on null or invalid element');
      return element;
    }

    try {
      Object.entries(updates).forEach(([key, value]) => {
        applyEnhancedUpdate(element, key, value);
      });
    } catch (error) {
      console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
    }

    return element;
  }

  /**
   * Update a collection of DOM elements
   * @param {NodeList|HTMLCollection|Array} collection - Collection of elements
   * @param {Object} updates - Updates to apply
   * @returns {*} Collection for chaining
   */
  function updateCollection(collection, updates) {
    if (!collection) {
      console.warn('[DOM Helpers] .update() called on null collection');
      return collection;
    }

    let elements = [];

    if (collection.length !== undefined) {
      elements = Array.from(collection);
    } else if (collection._originalCollection) {
      elements = Array.from(collection._originalCollection);
    } else if (collection._originalNodeList) {
      elements = Array.from(collection._originalNodeList);
    } else {
      console.warn('[DOM Helpers] .update() called on unrecognized collection type');
      return collection;
    }

    if (elements.length === 0) {
      console.info('[DOM Helpers] .update() called on empty collection');
      return collection;
    }

    try {
      elements.forEach((element) => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          Object.entries(updates).forEach(([key, value]) => {
            applyEnhancedUpdate(element, key, value);
          });
        }
      });
    } catch (error) {
      console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
    }

    return collection;
  }

  /**
   * Create enhanced update method
   * Factory function that creates a bound update method for elements or collections
   * @param {HTMLElement|NodeList|HTMLCollection} context - Element or collection
   * @param {boolean} isCollection - Whether context is a collection
   * @returns {Function} Update method
   */
  function createEnhancedUpdateMethod(context, isCollection = false) {
    return function update(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Helpers] .update() called with invalid updates object');
        return context;
      }

      if (!isCollection) {
        return updateSingleElement(context, updates);
      }

      return updateCollection(context, updates);
    };
  }

  // ===== ENHANCEMENT FUNCTIONS =====

  /**
   * Enhance element with .update() method
   * @param {HTMLElement} element - DOM element
   * @returns {HTMLElement} Enhanced element
   */
  function enhanceElementWithUpdate(element) {
    if (!element || element._hasEnhancedUpdateMethod) {
      return element;
    }

    try {
      Object.defineProperty(element, 'update', {
        value: createEnhancedUpdateMethod(element, false),
        writable: false,
        enumerable: false,
        configurable: true,
      });

      Object.defineProperty(element, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    } catch (error) {
      element.update = createEnhancedUpdateMethod(element, false);
      element._hasEnhancedUpdateMethod = true;
    }

    return element;
  }

  /**
   * Enhance collection with .update() method
   * @param {NodeList|HTMLCollection|Array} collection - Collection
   * @returns {*} Enhanced collection
   */
  function enhanceCollectionWithUpdate(collection) {
    if (!collection || collection._hasEnhancedUpdateMethod) {
      return collection;
    }

    try {
      Object.defineProperty(collection, 'update', {
        value: createEnhancedUpdateMethod(collection, true),
        writable: false,
        enumerable: false,
        configurable: true,
      });

      Object.defineProperty(collection, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    } catch (error) {
      collection.update = createEnhancedUpdateMethod(collection, true);
      collection._hasEnhancedUpdateMethod = true;
    }

    return collection;
  }

  /**
   * Check if object is a collection
   * @param {*} obj - Object to check
   * @returns {boolean} True if collection
   */
  function isCollection(obj) {
    return (
      obj &&
      (obj.length !== undefined ||
        obj._originalCollection ||
        obj._originalNodeList ||
        obj instanceof NodeList ||
        obj instanceof HTMLCollection)
    );
  }

  /**
   * Auto-enhance element or collection
   * @param {HTMLElement|NodeList|HTMLCollection} obj - Object to enhance
   * @returns {*} Enhanced object
   */
  function autoEnhanceWithUpdate(obj) {
    if (!obj) return obj;

    if (isCollection(obj)) {
      return enhanceCollectionWithUpdate(obj);
    } else if (obj.nodeType === Node.ELEMENT_NODE) {
      return enhanceElementWithUpdate(obj);
    }

    return obj;
  }

  /**
   * Create update example for documentation
   * @returns {Object} Example update configuration
   */
  function createUpdateExample() {
    return {
      textContent: 'Enhanced Button',
      innerHTML: '<strong>Enhanced</strong> Button',
      id: 'myEnhancedButton',
      className: 'btn btn-primary',
      style: {
        color: 'white',
        backgroundColor: '#007bff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
      },
      classList: {
        add: ['fancy', 'highlight'],
        remove: ['old-class'],
        toggle: 'active',
        replace: ['btn-old', 'btn-new'],
      },
      setAttribute: ['data-role', 'button'],
      removeAttribute: 'disabled',
      dataset: {
        userId: '123',
        action: 'submit',
      },
      addEventListener: [
        'click',
        (e) => {
          console.log('Button clicked!', e);
          e.target.classList.toggle('clicked');
        },
      ],
      focus: [],
      scrollIntoView: [{ behavior: 'smooth' }],
    };
  }

  // ===== PUBLIC API =====
  const UpdateUtility = {
    // Core update functions
    createEnhancedUpdateMethod,
    updateSingleElement,
    updateCollection,
    applyEnhancedUpdate,

    // Enhancement functions
    enhanceElementWithUpdate,
    enhanceCollectionWithUpdate,
    autoEnhanceWithUpdate,

    // Utility functions
    isCollection,
    handleClassListUpdate,
    createUpdateExample,

    // Version
    version: '2.3.1',
  };

  return UpdateUtility;
});
