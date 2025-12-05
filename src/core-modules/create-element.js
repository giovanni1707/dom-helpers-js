/**
 * DOM Helpers - Create Element Module
 *
 * Enhanced element creation with automatic .update() method enhancement
 * Supports single and bulk element creation with comprehensive configuration
 *
 * Features:
 * - createElement(tagName, options) - Create single element with optional configuration
 * - createElementsBulk(definitions) - Create multiple elements at once
 * - Automatic .update() method enhancement using UpdateUtility
 * - Bulk creation result object with helper methods
 * - Opt-in enhancement system
 *
 * @module create-element
 * @version 2.3.1
 */

(function (root, factory) {
  'use strict';

  // UMD wrapper for multiple module systems
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    root.DOMHelpersCreateElement = factory();

    // Also attach to DOMHelpers if it exists
    if (typeof root.DOMHelpers === 'object') {
      root.DOMHelpers.createElement = factory().createElement;
      root.DOMHelpers.createElementsBulk = factory().createElementsBulk;
    }
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ===== CONFIGURATION =====
  const config = {
    autoEnhance: false, // Opt-in only
    debug: false
  };

  // ===== UPDATE UTILITY DETECTION =====
  let UpdateUtility = null;
  let enhanceElementWithUpdate = null;

  // Try to detect UpdateUtility
  if (typeof window !== 'undefined') {
    // Check for EnhancedUpdateUtility
    if (typeof window.EnhancedUpdateUtility !== 'undefined') {
      UpdateUtility = window.EnhancedUpdateUtility;
      enhanceElementWithUpdate = UpdateUtility.enhanceElementWithUpdate;
    }
    // Check for global enhanceElementWithUpdate function
    else if (typeof window.enhanceElementWithUpdate === 'function') {
      enhanceElementWithUpdate = window.enhanceElementWithUpdate;
    }
  }

  // ===== FALLBACK: BASIC UPDATE METHOD =====
  /**
   * Adds a basic .update() method to an element when UpdateUtility is not available
   * @param {HTMLElement} element - Element to enhance
   * @returns {HTMLElement} Enhanced element
   */
  function addBasicUpdateMethod(element) {
    if (!element || element._hasUpdateMethod) {
      return element;
    }

    try {
      Object.defineProperty(element, 'update', {
        value: function (updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return element;
          }

          try {
            Object.entries(updates).forEach(([key, value]) => {
              // Handle style object
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([styleProperty, styleValue]) => {
                  if (styleValue !== null && styleValue !== undefined) {
                    element.style[styleProperty] = styleValue;
                  }
                });
                return;
              }

              // Handle classList methods
              if (key === 'classList' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
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
                          classes.forEach(cls => element.classList.toggle(cls));
                        } else if (typeof classes === 'string') {
                          element.classList.toggle(classes);
                        }
                        break;
                      case 'replace':
                        if (Array.isArray(classes) && classes.length === 2) {
                          element.classList.replace(classes[0], classes[1]);
                        }
                        break;
                    }
                  } catch (error) {
                    console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                  }
                });
                return;
              }

              // Handle setAttribute - support both array and object formats
              if (key === 'setAttribute') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                  // Object format: { src: 'image.png', alt: 'Description' }
                  Object.entries(value).forEach(([attr, attrValue]) => {
                    element.setAttribute(attr, attrValue);
                  });
                } else if (Array.isArray(value) && value.length >= 2) {
                  // Array format: ['src', 'image.png']
                  element.setAttribute(value[0], value[1]);
                }
                return;
              }

              // Handle removeAttribute
              if (key === 'removeAttribute') {
                if (Array.isArray(value)) {
                  value.forEach(attr => element.removeAttribute(attr));
                } else if (typeof value === 'string') {
                  element.removeAttribute(value);
                }
                return;
              }

              // Handle dataset
              if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                  element.dataset[dataKey] = dataValue;
                });
                return;
              }

              // Handle addEventListener
              if (key === 'addEventListener') {
                if (Array.isArray(value) && value.length >= 2) {
                  const [eventType, handler, options] = value;
                  element.addEventListener(eventType, handler, options);
                } else if (typeof value === 'object' && value !== null) {
                  // Object format for multiple events
                  Object.entries(value).forEach(([eventType, handler]) => {
                    if (typeof handler === 'function') {
                      element.addEventListener(eventType, handler);
                    } else if (Array.isArray(handler) && handler.length >= 1) {
                      const [handlerFunc, options] = handler;
                      element.addEventListener(eventType, handlerFunc, options);
                    }
                  });
                }
                return;
              }

              // Handle DOM methods
              if (typeof element[key] === 'function') {
                if (Array.isArray(value)) {
                  element[key](...value);
                } else {
                  element[key](value);
                }
                return;
              }

              // Handle regular properties
              if (key in element) {
                element[key] = value;
                return;
              }

              // Fallback to setAttribute
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                element.setAttribute(key, String(value));
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
          }

          return element; // Return for chaining
        },
        writable: false,
        enumerable: false,
        configurable: true
      });

      // Mark as enhanced
      Object.defineProperty(element, '_hasUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback: attach as regular property if defineProperty fails
      element.update = function (updates = {}) {
        if (!updates || typeof updates !== 'object') {
          return element;
        }

        Object.entries(updates).forEach(([key, value]) => {
          try {
            if (key === 'style' && typeof value === 'object') {
              Object.assign(element.style, value);
            } else if (key in element) {
              element[key] = value;
            } else {
              element.setAttribute(key, String(value));
            }
          } catch (e) {
            console.warn(`[DOM Helpers] Failed to apply ${key}:`, e.message);
          }
        });

        return element;
      };
      element._hasUpdateMethod = true;
    }

    return element;
  }

  // ===== ELEMENT ENHANCEMENT =====
  /**
   * Enhances an element with the .update() method
   * Uses UpdateUtility if available, otherwise falls back to basic implementation
   * @param {HTMLElement} element - Element to enhance
   * @returns {HTMLElement} Enhanced element
   */
  function enhanceElement(element) {
    if (!element) return element;

    // Skip if already enhanced
    if (element._hasUpdateMethod) {
      return element;
    }

    // Try to use UpdateUtility
    if (enhanceElementWithUpdate && typeof enhanceElementWithUpdate === 'function') {
      try {
        return enhanceElementWithUpdate(element);
      } catch (error) {
        if (config.debug) {
          console.warn('[DOM Helpers] UpdateUtility enhancement failed, using fallback:', error.message);
        }
      }
    }

    // Fallback to basic update method
    return addBasicUpdateMethod(element);
  }

  // ===== CREATE ELEMENT =====
  /**
   * Creates a new HTML element with optional configuration
   * Automatically enhances the element with .update() method
   *
   * @param {string} tagName - HTML tag name (e.g., 'div', 'span', 'button')
   * @param {Object} [options] - Configuration object or native options
   * @returns {HTMLElement} Created and enhanced element
   *
   * @example
   * // Create simple element
   * const div = createElement('div');
   *
   * // Create with configuration
   * const button = createElement('button', {
   *   textContent: 'Click me',
   *   className: 'btn btn-primary',
   *   style: { color: 'blue', fontSize: '16px' },
   *   addEventListener: ['click', handleClick]
   * });
   *
   * // Create with native options (Web Components)
   * const customEl = createElement('custom-element', { is: 'my-element' });
   */
  function createElement(tagName, options) {
    if (!tagName || typeof tagName !== 'string') {
      console.warn('[DOM Helpers] createElement requires a valid tag name');
      return null;
    }

    // Check if options is a configuration object (not native options)
    const isConfigObject = options &&
                          typeof options === 'object' &&
                          !options.is && // Native option check
                          (options.textContent ||
                           options.className ||
                           options.style ||
                           options.id ||
                           options.classList ||
                           options.setAttribute ||
                           options.dataset ||
                           options.addEventListener);

    let element;

    if (isConfigObject) {
      // Create element without options
      element = document.createElement(tagName);

      // Enhance it first
      element = enhanceElement(element);

      // Apply configuration using .update()
      if (element.update) {
        element.update(options);
      }
    } else {
      // Standard createElement behavior (supports native options like { is: 'my-element' })
      element = document.createElement(tagName, options);

      // Enhance it
      element = enhanceElement(element);
    }

    return element;
  }

  // ===== BULK ELEMENT CREATION =====
  /**
   * Creates multiple elements with configurations in a single call
   * Returns an object with direct element access and helper methods
   *
   * @param {Object} definitions - Object where keys are tag names and values are configuration objects
   * @returns {Object} Object with created elements and helper methods
   *
   * @example
   * const elements = createElementsBulk({
   *   P: { textContent: 'Hello', style: { color: 'red' } },
   *   H1: { textContent: 'Title', className: 'header' },
   *   DIV_1: { className: 'container' },
   *   DIV_2: { className: 'sidebar' }
   * });
   *
   * // Direct access
   * elements.P              // The P element
   * elements.H1             // The H1 element
   * elements.DIV_1          // First DIV
   *
   * // Array methods
   * elements.all            // Array of all elements
   * elements.toArray('P', 'H1')       // Get specific elements as array
   * elements.ordered('H1', 'P')       // Get elements in specific order
   *
   * // Utility methods
   * elements.count          // Number of elements
   * elements.keys           // Array of all keys
   * elements.has('P')       // Check if element exists
   * elements.get('P', null) // Get with fallback
   *
   * // Array-like operations
   * elements.forEach((el, key, index) => { ... })
   * elements.map((el, key, index) => { ... })
   * elements.filter((el, key, index) => { ... })
   *
   * // DOM operations
   * elements.appendTo('#container')
   * elements.appendToOrdered('#container', 'H1', 'P')
   *
   * // Bulk updates
   * elements.updateMultiple({
   *   P: { textContent: 'Updated text' },
   *   H1: { style: { color: 'blue' } }
   * });
   */
  function createElementsBulk(definitions = {}) {
    if (!definitions || typeof definitions !== 'object') {
      console.warn('[DOM Helpers] createElementsBulk() requires an object');
      return null;
    }

    const createdElements = {};
    const elementsList = [];

    // Create all elements
    Object.entries(definitions).forEach(([tagName, configOptions]) => {
      try {
        // Handle numbered instances: DIV_1, DIV_2, etc.
        let actualTagName = tagName;
        const match = tagName.match(/^([A-Z]+)(_\d+)?$/i);
        if (match) {
          actualTagName = match[1];
        }

        // Create element
        const element = document.createElement(actualTagName);

        // Apply configuration if provided
        if (configOptions && typeof configOptions === 'object') {
          Object.entries(configOptions).forEach(([key, value]) => {
            try {
              // Handle style object
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.assign(element.style, value);
                return;
              }

              // Handle classList methods
              if (key === 'classList' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([method, classes]) => {
                  try {
                    switch (method) {
                      case 'add':
                        const addClasses = Array.isArray(classes) ? classes : [classes];
                        element.classList.add(...addClasses);
                        break;
                      case 'remove':
                        const removeClasses = Array.isArray(classes) ? classes : [classes];
                        element.classList.remove(...removeClasses);
                        break;
                      case 'toggle':
                        const toggleClasses = Array.isArray(classes) ? classes : [classes];
                        toggleClasses.forEach(cls => element.classList.toggle(cls));
                        break;
                      case 'replace':
                        if (Array.isArray(classes) && classes.length === 2) {
                          element.classList.replace(classes[0], classes[1]);
                        }
                        break;
                    }
                  } catch (error) {
                    console.warn(`[DOM Helpers] Error in classList.${method}: ${error.message}`);
                  }
                });
                return;
              }

              // Handle setAttribute - support both array and object formats
              if (key === 'setAttribute') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                  // Object format: { src: 'image.png', alt: 'Description' }
                  Object.entries(value).forEach(([attr, attrValue]) => {
                    element.setAttribute(attr, attrValue);
                  });
                } else if (Array.isArray(value) && value.length >= 2) {
                  // Array format: ['src', 'image.png']
                  element.setAttribute(value[0], value[1]);
                }
                return;
              }

              // Handle dataset
              if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                  element.dataset[dataKey] = dataValue;
                });
                return;
              }

              // Handle addEventListener
              if (key === 'addEventListener') {
                if (Array.isArray(value) && value.length >= 2) {
                  const [eventType, handler, options] = value;
                  element.addEventListener(eventType, handler, options);
                } else if (typeof value === 'object' && value !== null) {
                  // Object format for multiple events
                  Object.entries(value).forEach(([eventType, handler]) => {
                    if (typeof handler === 'function') {
                      element.addEventListener(eventType, handler);
                    } else if (Array.isArray(handler) && handler.length >= 1) {
                      const [handlerFunc, options] = handler;
                      element.addEventListener(eventType, handlerFunc, options);
                    }
                  });
                }
                return;
              }

              // Handle removeAttribute
              if (key === 'removeAttribute') {
                if (Array.isArray(value)) {
                  value.forEach(attr => element.removeAttribute(attr));
                } else if (typeof value === 'string') {
                  element.removeAttribute(value);
                }
                return;
              }

              // Handle DOM methods
              if (typeof element[key] === 'function') {
                if (Array.isArray(value)) {
                  element[key](...value);
                } else {
                  element[key](value);
                }
                return;
              }

              // Handle regular properties
              if (key in element) {
                element[key] = value;
                return;
              }

              // Fallback to setAttribute
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                element.setAttribute(key, String(value));
              }
            } catch (error) {
              console.warn(`[DOM Helpers] Failed to apply config ${key} to ${tagName}:`, error.message);
            }
          });
        }

        // Enhance element with update method
        enhanceElement(element);

        createdElements[tagName] = element;
        elementsList.push({ key: tagName, element });
      } catch (error) {
        console.warn(`[DOM Helpers] Failed to create element ${tagName}:`, error.message);
      }
    });

    // Return object with elements and helper methods
    return {
      ...createdElements,

      /**
       * Get elements as array in specified order
       * If no arguments provided, returns all elements in creation order
       * @param {...string} tagNames - Element keys to retrieve
       * @returns {Array} Array of elements
       */
      toArray(...tagNames) {
        if (tagNames.length === 0) {
          return elementsList.map(({ element }) => element);
        }
        return tagNames.map(key => createdElements[key]).filter(Boolean);
      },

      /**
       * Get elements in specified order (alias for toArray)
       * @param {...string} tagNames - Element keys to retrieve
       * @returns {Array} Array of elements in specified order
       */
      ordered(...tagNames) {
        return this.toArray(...tagNames);
      },

      /**
       * Get all elements as array (getter)
       */
      get all() {
        return elementsList.map(({ element }) => element);
      },

      /**
       * Update multiple elements at once
       * @param {Object} updates - Object where keys are element keys and values are update objects
       * @returns {Object} This object for chaining
       */
      updateMultiple(updates = {}) {
        Object.entries(updates).forEach(([tagName, updateData]) => {
          const element = createdElements[tagName];
          if (element) {
            // Use element's update method if available
            if (typeof element.update === 'function') {
              element.update(updateData);
            } else {
              // Fallback to applying updates directly
              Object.entries(updateData).forEach(([key, value]) => {
                try {
                  if (key === 'style' && typeof value === 'object' && value !== null) {
                    Object.assign(element.style, value);
                  } else if (key in element) {
                    element[key] = value;
                  } else if (typeof value === 'string' || typeof value === 'number') {
                    element.setAttribute(key, value);
                  }
                } catch (error) {
                  console.warn(`[DOM Helpers] Failed to update ${key} on ${tagName}:`, error.message);
                }
              });
            }
          }
        });
        return this;
      },

      /**
       * Get count of created elements (getter)
       */
      get count() {
        return elementsList.length;
      },

      /**
       * Get array of all element keys (getter)
       */
      get keys() {
        return elementsList.map(({ key }) => key);
      },

      /**
       * Check if an element exists by key
       * @param {string} key - Element key to check
       * @returns {boolean}
       */
      has(key) {
        return key in createdElements;
      },

      /**
       * Get element by key with fallback
       * @param {string} key - Element key
       * @param {*} fallback - Fallback value if element not found
       * @returns {Element|*}
       */
      get(key, fallback = null) {
        return createdElements[key] || fallback;
      },

      /**
       * Execute a callback for each element
       * @param {Function} callback - Callback function(element, key, index)
       */
      forEach(callback) {
        elementsList.forEach(({ key, element }, index) => {
          callback(element, key, index);
        });
      },

      /**
       * Map over elements
       * @param {Function} callback - Callback function(element, key, index)
       * @returns {Array}
       */
      map(callback) {
        return elementsList.map(({ key, element }, index) => {
          return callback(element, key, index);
        });
      },

      /**
       * Filter elements
       * @param {Function} callback - Callback function(element, key, index)
       * @returns {Array}
       */
      filter(callback) {
        return elementsList
          .filter(({ key, element }, index) => callback(element, key, index))
          .map(({ element }) => element);
      },

      /**
       * Append all elements to a container
       * @param {Element|string} container - Container element or selector
       * @returns {Object} This object for chaining
       */
      appendTo(container) {
        const containerEl = typeof container === 'string'
          ? document.querySelector(container)
          : container;

        if (containerEl) {
          this.all.forEach(element => containerEl.appendChild(element));
        }
        return this;
      },

      /**
       * Append specific elements to a container in specified order
       * @param {Element|string} container - Container element or selector
       * @param {...string} tagNames - Element keys to append
       * @returns {Object} This object for chaining
       */
      appendToOrdered(container, ...tagNames) {
        const containerEl = typeof container === 'string'
          ? document.querySelector(container)
          : container;

        if (containerEl) {
          this.ordered(...tagNames).forEach(element => {
            if (element) containerEl.appendChild(element);
          });
        }
        return this;
      }
    };
  }

  // ===== ENHANCEMENT CONTROL =====
  /**
   * Enable automatic enhancement of createElement
   * This makes all document.createElement calls use the enhanced version
   * @returns {Object} API object for chaining
   */
  function enableEnhancement() {
    config.autoEnhance = true;

    if (typeof window !== 'undefined' && typeof window.DOMHelpers === 'object') {
      if (typeof window.DOMHelpers.enableCreateElementEnhancement === 'function') {
        window.DOMHelpers.enableCreateElementEnhancement();
      }
    }

    return API;
  }

  /**
   * Disable automatic enhancement of createElement
   * Restores original document.createElement behavior
   * @returns {Object} API object for chaining
   */
  function disableEnhancement() {
    config.autoEnhance = false;

    if (typeof window !== 'undefined' && typeof window.DOMHelpers === 'object') {
      if (typeof window.DOMHelpers.disableCreateElementEnhancement === 'function') {
        window.DOMHelpers.disableCreateElementEnhancement();
      }
    }

    return API;
  }

  // ===== API EXPORT =====

  // Attach bulk as a property of createElement function
createElement.bulk = createElementsBulk;
/*
*createElement.bulk({}) is now available to use 

const elements = createElement.bulk({
  DIV: { className: 'container' },
  P: { textContent: 'Hello' }
}); 
*/

  
  const API = {
    createElement,
    createElementsBulk,
    bulk: createElementsBulk, // Alias
    enableEnhancement,
    disableEnhancement,
    version: '2.3.1'
  };

  return API;
}));
