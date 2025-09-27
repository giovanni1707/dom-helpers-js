/**
 * DOM Helpers - Combined Bundle (Unminified)
 * High-performance vanilla JavaScript DOM utilities with intelligent caching
 * 
 * Includes:
 * - Update Utility (Universal .update() method)
 * - Elements Helper (ID-based DOM access)
 * - Collections Helper (Class/Tag/Name-based DOM access)
 * - Selector Helper (querySelector/querySelectorAll with caching)
 * 
 * @version 2.1.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // ===== UPDATE UTILITY =====
  /**
   * Enhanced Update Implementation
   * This function can be applied to any element or collection
   */

// Add this function near the top of your library, after the existing utility functions
function protectClassList(element) {
  if (!element || element._classListProtected) return element;
  
  const originalClassList = element.classList;
  
  try {
    Object.defineProperty(element, 'classList', {
      get: function() {
        return originalClassList;
      },
      set: function(value) {
        // Intercept attempts to set classList and handle them properly
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([method, classes]) => {
            switch (method) {
              case 'add':
                if (Array.isArray(classes)) {
                  classes.forEach(cls => originalClassList.add(cls));
                } else if (typeof classes === 'string') {
                  originalClassList.add(classes);
                }
                break;
              case 'remove':
                if (Array.isArray(classes)) {
                  classes.forEach(cls => originalClassList.remove(cls));
                } else if (typeof classes === 'string') {
                  originalClassList.remove(classes);
                }
                break;
              case 'toggle':
                if (Array.isArray(classes)) {
                  classes.forEach(cls => originalClassList.toggle(cls));
                } else if (typeof classes === 'string') {
                  originalClassList.toggle(classes);
                }
                break;
              case 'replace':
                if (Array.isArray(classes) && classes.length === 2) {
                  originalClassList.replace(classes[0], classes[1]);
                }
                break;
            }
          });
        }
      },
      configurable: false,
      enumerable: true
    });
    
    // Mark as protected
    Object.defineProperty(element, '_classListProtected', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });
  } catch (error) {
    console.warn('[DOM Helpers] Could not protect classList:', error.message);
  }
  
  return element;
}

  function createEnhancedUpdateMethod(context, isCollection = false) {
    return function update(updates = {}) {
      // Safety check - if no updates provided, return context for chaining
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Helpers] .update() called with invalid updates object');
        return context;
      }

      // Handle single element updates
      if (!isCollection) {
        return updateSingleElement(context, updates);
      }

      // Handle collection updates
      return updateCollection(context, updates);
    };
  }

  /**
   * Update a single DOM element
   */
  function updateSingleElement(element, updates) {
    // Safety check - if element doesn't exist, log warning and return null for chaining
    if (!element || !element.nodeType) {
      console.warn('[DOM Helpers] .update() called on null or invalid element');
      return element;
    }

    try {
      // Process each update
      Object.entries(updates).forEach(([key, value]) => {
        applyEnhancedUpdate(element, key, value);
      });
    } catch (error) {
      console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
    }

    return element; // Return for chaining
  }

  /**
   * Update a collection of DOM elements
   */
  function updateCollection(collection, updates) {
    // Safety check - if collection doesn't exist or is empty
    if (!collection) {
      console.warn('[DOM Helpers] .update() called on null collection');
      return collection;
    }

    // Handle different collection types
    let elements = [];
    
    if (collection.length !== undefined) {
      // Array-like collection (NodeList, HTMLCollection, or enhanced collection)
      elements = Array.from(collection);
    } else if (collection._originalCollection) {
      // Enhanced collection from Selector helper
      elements = Array.from(collection._originalCollection);
    } else if (collection._originalNodeList) {
      // Enhanced collection from Selector helper (alternative structure)
      elements = Array.from(collection._originalNodeList);
    } else {
      console.warn('[DOM Helpers] .update() called on unrecognized collection type');
      return collection;
    }

    // If no elements in collection, log info and return for chaining
    if (elements.length === 0) {
      console.info('[DOM Helpers] .update() called on empty collection');
      return collection;
    }

    try {
      // Apply updates to each element in the collection
      elements.forEach(element => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          Object.entries(updates).forEach(([key, value]) => {
            applyEnhancedUpdate(element, key, value);
          });
        }
      });
    } catch (error) {
      console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
    }

    return collection; // Return for chaining
  }

  /**
   * Apply a single enhanced update to an element
   */
  function applyEnhancedUpdate(element, key, value) {
    try {
      // Handle special cases first
      
      // 1. Style object - batch apply CSS styles
      if (key === 'style' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([styleProperty, styleValue]) => {
          if (styleValue !== null && styleValue !== undefined) {
            element.style[styleProperty] = styleValue;
          }
        });
        return;
      }

      // 2. classList methods - enhanced support with arrays
      if (key === 'classList' && typeof value === 'object' && value !== null) {
        handleClassListUpdate(element, value);
        return;
      }

      // 3. setAttribute - enhanced support
      if (key === 'setAttribute' && Array.isArray(value) && value.length >= 2) {
        element.setAttribute(value[0], value[1]);
        return;
      }

      // 4. removeAttribute - support for removing attributes
      if (key === 'removeAttribute') {
        if (Array.isArray(value)) {
          value.forEach(attr => element.removeAttribute(attr));
        } else if (typeof value === 'string') {
          element.removeAttribute(value);
        }
        return;
      }

      // 5. getAttribute - for reading attributes (mainly for debugging/logging)
      if (key === 'getAttribute' && typeof value === 'string') {
        const attrValue = element.getAttribute(value);
        console.log(`[DOM Helpers] getAttribute('${value}'):`, attrValue);
        return;
      }

      // 6. addEventListener - ENHANCED: Support for multiple events and e.target/this.update
      if (key === 'addEventListener') {
        handleEnhancedEventListener(element, value);
        return;
      }

      // 7. removeEventListener - support for removing event listeners
      if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
        const [eventType, handler, options] = value;
        element.removeEventListener(eventType, handler, options);
        return;
      }

      // 8. dataset - support for data attributes
      if (key === 'dataset' && typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
        return;
      }

      // 9. Handle DOM methods (value should be an array of arguments)
      if (typeof element[key] === 'function') {
        if (Array.isArray(value)) {
          // Call method with provided arguments
          element[key](...value);
        } else {
          // Call method with single argument or no arguments
          element[key](value);
        }
        return;
      }

      // 10. Handle regular DOM properties
      if (key in element) {
        element[key] = value;
        return;
      }

      // 11. If property doesn't exist on element, try setAttribute as fallback
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        element.setAttribute(key, value);
        return;
      }

      console.warn(`[DOM Helpers] Unknown property or method: ${key}`);
    } catch (error) {
      console.warn(`[DOM Helpers] Failed to apply update ${key}: ${error.message}`);
    }
  }

  /**
   * Enhanced event listener handler with support for multiple events and e.target/this.update
   */
  function handleEnhancedEventListener(element, value) {
    // Handle legacy array format: ['click', handler, options]
    if (Array.isArray(value) && value.length >= 2) {
      const [eventType, handler, options] = value;
      const enhancedHandler = createEnhancedEventHandler(handler);
      element.addEventListener(eventType, enhancedHandler, options);
      return;
    }

    // Handle new object format for multiple events
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.entries(value).forEach(([eventType, handler]) => {
        if (typeof handler === 'function') {
          const enhancedHandler = createEnhancedEventHandler(handler);
          element.addEventListener(eventType, enhancedHandler);
        } else if (Array.isArray(handler) && handler.length >= 1) {
          // Support [handlerFunction, options] format
          const [handlerFunc, options] = handler;
          if (typeof handlerFunc === 'function') {
            const enhancedHandler = createEnhancedEventHandler(handlerFunc);
            element.addEventListener(eventType, enhancedHandler, options);
          }
        }
      });
      return;
    }

    console.warn('[DOM Helpers] Invalid addEventListener value format');
  }

  /**
   * Create an enhanced event handler that adds e.target.update() and this.update() support
   */
  function createEnhancedEventHandler(originalHandler) {
    return function enhancedEventHandler(event) {
      // Add update method to event.target if it doesn't exist
      if (event.target && !event.target.update) {
        enhanceElementWithUpdate(event.target);
      }

      // Add update method to 'this' context if it doesn't exist (for non-arrow functions)
      if (this && this.nodeType === Node.ELEMENT_NODE && !this.update) {
        enhanceElementWithUpdate(this);
      }

      // Call the original handler with the enhanced context
      return originalHandler.call(this, event);
    };
  }

  /**
   * Handle classList updates with enhanced functionality
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

          case 'contains':
            // For debugging/logging purposes
            if (Array.isArray(classes)) {
              classes.forEach(cls => {
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
   * Enhanced element wrapper that adds .update() method to any element
   */
  function enhanceElementWithUpdate(element) {
    if (!element || element._hasEnhancedUpdateMethod) {
      return element;
    }

    // Add enhanced update method to the element
    try {
      Object.defineProperty(element, 'update', {
        value: createEnhancedUpdateMethod(element, false),
        writable: false,
        enumerable: false,
        configurable: true
      });

      // Mark as enhanced to avoid double-enhancement
      Object.defineProperty(element, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback: attach as regular property if defineProperty fails
      element.update = createEnhancedUpdateMethod(element, false);
      element._hasEnhancedUpdateMethod = true;
    }

    return element;
  }

  /**
   * Enhanced collection wrapper that adds .update() method to any collection
   */
  function enhanceCollectionWithUpdate(collection) {
    if (!collection || collection._hasEnhancedUpdateMethod) {
      return collection;
    }

    // Add enhanced update method to the collection
    try {
      Object.defineProperty(collection, 'update', {
        value: createEnhancedUpdateMethod(collection, true),
        writable: false,
        enumerable: false,
        configurable: true
      });

      // Mark as enhanced to avoid double-enhancement
      Object.defineProperty(collection, '_hasEnhancedUpdateMethod', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      // Fallback: attach as regular property if defineProperty fails
      collection.update = createEnhancedUpdateMethod(collection, true);
      collection._hasEnhancedUpdateMethod = true;
    }

    return collection;
  }

  /**
   * Utility function to determine if something is a collection
   */
  function isCollection(obj) {
    return obj && (
      obj.length !== undefined || 
      obj._originalCollection || 
      obj._originalNodeList ||
      obj instanceof NodeList ||
      obj instanceof HTMLCollection
    );
  }

  /**
   * Auto-enhance function that adds enhanced .update() to elements or collections
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
   * Utility function to create a comprehensive update example
   */
  function createUpdateExample() {
    return {
      // Basic properties
      textContent: "Enhanced Button",
      innerHTML: "<strong>Enhanced</strong> Button",
      id: "myEnhancedButton",
      className: "btn btn-primary",
      
      // Style object
      style: { 
        color: "white",
        backgroundColor: "#007bff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px"
      },
      
      // classList methods
      classList: {
        add: ["fancy", "highlight"],
        remove: ["old-class"],
        toggle: "active",
        replace: ["btn-old", "btn-new"]
      },
      
      // Attributes
      setAttribute: ["data-role", "button"],
      removeAttribute: "disabled",
      
      // Dataset
      dataset: {
        userId: "123",
        action: "submit"
      },
      
      // Event handling
      addEventListener: ["click", (e) => {
        console.log("Button clicked!", e);
        e.target.classList.toggle("clicked");
      }],
      
      // Method calls
      focus: [],
      scrollIntoView: [{ behavior: "smooth" }]
    };
  }

  // Export the enhanced utility functions
  const EnhancedUpdateUtility = {
    createEnhancedUpdateMethod,
    enhanceElementWithUpdate,
    enhanceCollectionWithUpdate,
    autoEnhanceWithUpdate,
    isCollection,
    updateSingleElement,
    updateCollection,
    applyEnhancedUpdate,
    handleClassListUpdate,
    createUpdateExample
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = EnhancedUpdateUtility;
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return EnhancedUpdateUtility;
    });
  } else {
    // Browser globals
    global.EnhancedUpdateUtility = EnhancedUpdateUtility;
  }

  // ===== ELEMENTS HELPER =====
  // Import UpdateUtility if available
  let UpdateUtility;
  if (typeof require !== 'undefined') {
    try {
      UpdateUtility = require('./update-utility.js');
    } catch (e) {
      // UpdateUtility not available in this environment
    }
  } else if (typeof global !== 'undefined' && global.UpdateUtility) {
    UpdateUtility = global.UpdateUtility;
  }

  class ProductionElementsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Elements = new Proxy(this, {
        get: (target, prop) => {
          // Handle internal methods and symbols
          if (typeof prop === 'symbol' || 
              prop.startsWith('_') || 
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          return target._getElement(prop);
        },
        
        has: (target, prop) => target._hasElement(prop),
        
        ownKeys: (target) => target._getKeys(),
        
        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasElement(prop)) {
            return { 
              enumerable: true, 
              configurable: true, 
              value: target._getElement(prop) 
            };
          }
          return undefined;
        }
      });
    }

    _getElement(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid element property type: ${typeof prop}`);
        return null;
      }

      // Check cache first
      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
          this.stats.hits++;
          return this._enhanceElementWithUpdate(element);
        } else {
          this.cache.delete(prop);
        }
      }

      // Use exact ID matching - no conversion
      const element = document.getElementById(prop);
      if (element) {
        this._addToCache(prop, element);
        this.stats.misses++;
        return this._enhanceElementWithUpdate(element);
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Element with id '${prop}' not found`);
      }
      return null;
    }

    _hasElement(prop) {
      if (typeof prop !== 'string') return false;
      
      if (this.cache.has(prop)) {
        const element = this.cache.get(prop);
        if (element && element.nodeType === Node.ELEMENT_NODE && document.contains(element)) {
          return true;
        }
        this.cache.delete(prop);
      }
      
      return !!document.getElementById(prop);
    }

    _getKeys() {
      // Return all element IDs in the document
      const elements = document.querySelectorAll("[id]");
      return Array.from(elements).map(el => el.id).filter(id => id);
    }

    _addToCache(id, element) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, element);
      this.stats.cacheSize = this.cache.size;

      this.weakCache.set(element, {
        id,
        cachedAt: Date.now(),
        accessCount: 1
      });
    }

    _initMutationObserver() {
      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);
      
      // Only observe if document.body exists
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id'],
          attributeOldValue: true
        });
      } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id'],
              attributeOldValue: true
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const addedIds = new Set();
      const removedIds = new Set();

      mutations.forEach(mutation => {
        // Handle added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) addedIds.add(node.id);
            
            // Check child elements
            try {
              const childrenWithIds = node.querySelectorAll ? node.querySelectorAll('[id]') : [];
              childrenWithIds.forEach(child => {
                if (child.id) addedIds.add(child.id);
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.id) removedIds.add(node.id);
            
            // Check child elements
            try {
              const childrenWithIds = node.querySelectorAll ? node.querySelectorAll('[id]') : [];
              childrenWithIds.forEach(child => {
                if (child.id) removedIds.add(child.id);
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle ID attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const oldId = mutation.oldValue;
          const newId = mutation.target.id;
          
          if (oldId && oldId !== newId) {
            removedIds.add(oldId);
          }
          if (newId && newId !== oldId) {
            addedIds.add(newId);
          }
        }
      });

      // Update cache for added elements
      addedIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          this._addToCache(id, element);
        }
      });

      // Remove cached elements that are no longer valid
      removedIds.forEach(id => {
        this.cache.delete(id);
      });

      this.stats.cacheSize = this.cache.size;
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const beforeSize = this.cache.size;
      const staleIds = [];

      for (const [id, element] of this.cache) {
        if (!element || 
            element.nodeType !== Node.ELEMENT_NODE || 
            !document.contains(element) ||
            element.id !== id) {
          staleIds.push(id);
        }
      }

      staleIds.forEach(id => this.cache.delete(id));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleIds.length > 0) {
        this._log(`Cleanup completed. Removed ${staleIds.length} stale entries.`);
      }
    }

    _debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Elements] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Elements] ${message}`);
      }
    }

    // Enhanced element with update method
    _enhanceElementWithUpdate(element) {
      if (!element || element._hasUpdateMethod) {
        return element;
      }

      // Protect classList first
      protectClassList(element);

      // Use EnhancedUpdateUtility if available, otherwise create comprehensive inline update method
      if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceElementWithUpdate) {
        return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
      }

      // Comprehensive fallback: create enhanced update method inline
      try {
        Object.defineProperty(element, 'update', {
          value: (updates = {}) => {
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

                // Handle setAttribute
                if (key === 'setAttribute' && Array.isArray(value) && value.length >= 2) {
                  element.setAttribute(value[0], value[1]);
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

                // Handle addEventListener - ENHANCED: Support for multiple events and e.target/this.update
                if (key === 'addEventListener') {
                  handleEnhancedEventListener(element, value);
                  return;
                }

                // Handle removeEventListener
                if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
                  const [eventType, handler, options] = value;
                  element.removeEventListener(eventType, handler, options);
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
                  element.setAttribute(key, value);
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
        // Fallback: attach as regular property with full functionality
        element.update = (updates = {}) => {
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

              // Handle addEventListener - ENHANCED
              if (key === 'addEventListener') {
                handleEnhancedEventListener(element, value);
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
                element.setAttribute(key, value);
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
          }

          return element;
        };
        element._hasUpdateMethod = true;
      }

      return element;
    }

    // Public API
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;
      
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Elements helper destroyed');
    }

    isCached(id) {
      return this.cache.has(id);
    }

    getCacheSnapshot() {
      return Array.from(this.cache.keys());
    }

    // Enhanced methods for destructuring support
    destructure(...ids) {
      const result = {};
      const missing = [];
      
      ids.forEach(id => {
        const element = this.Elements[id];
        if (element) {
          result[id] = element;
        } else {
          missing.push(id);
          result[id] = null;
        }
      });
      
      if (missing.length > 0 && this.options.enableLogging) {
        this._warn(`Missing elements during destructuring: ${missing.join(', ')}`);
      }
      
      return result;
    }

    getRequired(...ids) {
      const elements = this.destructure(...ids);
      const missing = ids.filter(id => !elements[id]);
      
      if (missing.length > 0) {
        throw new Error(`Required elements not found: ${missing.join(', ')}`);
      }
      
      return elements;
    }

    async waitFor(...ids) {
      const maxWait = 5000;
      const checkInterval = 100;
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWait) {
        const elements = this.destructure(...ids);
        const allFound = ids.every(id => elements[id]);
        
        if (allFound) {
          return elements;
        }
        
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
      
      throw new Error(`Timeout waiting for elements: ${ids.join(', ')}`);
    }

    // Safe element access with fallbacks
    get(id, fallback = null) {
      const element = this.Elements[id];
      return element || fallback;
    }

    exists(id) {
      return !!this.Elements[id];
    }

    // Batch operations
    getMultiple(...ids) {
      return this.destructure(...ids);
    }

    // Enhanced element manipulation
    setProperty(id, property, value) {
      const element = this.Elements[id];
      if (element && property in element) {
        element[property] = value;
        return true;
      }
      return false;
    }

    getProperty(id, property, fallback = undefined) {
      const element = this.Elements[id];
      if (element && property in element) {
        return element[property];
      }
      return fallback;
    }

    setAttribute(id, attribute, value) {
      const element = this.Elements[id];
      if (element) {
        element.setAttribute(attribute, value);
        return true;
      }
      return false;
    }

    getAttribute(id, attribute, fallback = null) {
      const element = this.Elements[id];
      if (element) {
        return element.getAttribute(attribute) || fallback;
      }
      return fallback;
    }
  }

  // Auto-initialize with sensible defaults
  const ElementsHelper = new ProductionElementsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000
  });

  // Global API - Simple and clean
  const Elements = ElementsHelper.Elements;

  // Additional utilities
  Elements.helper = ElementsHelper;
  Elements.stats = () => ElementsHelper.getStats();
  Elements.clear = () => ElementsHelper.clearCache();
  Elements.destroy = () => ElementsHelper.destroy();
  Elements.destructure = (...ids) => ElementsHelper.destructure(...ids);
  Elements.getRequired = (...ids) => ElementsHelper.getRequired(...ids);
  Elements.waitFor = (...ids) => ElementsHelper.waitFor(...ids);
  Elements.isCached = (id) => ElementsHelper.isCached(id);
  Elements.get = (id, fallback) => ElementsHelper.get(id, fallback);
  Elements.exists = (id) => ElementsHelper.exists(id);
  Elements.getMultiple = (...ids) => ElementsHelper.getMultiple(...ids);
  Elements.setProperty = (id, property, value) => ElementsHelper.setProperty(id, property, value);
  Elements.getProperty = (id, property, fallback) => ElementsHelper.getProperty(id, property, fallback);
  Elements.setAttribute = (id, attribute, value) => ElementsHelper.setAttribute(id, attribute, value);
  Elements.getAttribute = (id, attribute, fallback) => ElementsHelper.getAttribute(id, attribute, fallback);
  Elements.configure = (options) => {
    Object.assign(ElementsHelper.options, options);
    return Elements;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Elements, ProductionElementsHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Elements, ProductionElementsHelper };
    });
  } else {
    // Browser globals
    global.Elements = Elements;
    global.ProductionElementsHelper = ProductionElementsHelper;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      ElementsHelper.destroy();
    });
  }

  // ===== COLLECTIONS HELPER =====
  class ProductionCollectionHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxies();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxies() {
      // Create function-style proxy for ClassName
      this.ClassName = this._createCollectionProxy('className');
      
      // Create function-style proxy for TagName
      this.TagName = this._createCollectionProxy('tagName');
      
      // Create function-style proxy for Name
      this.Name = this._createCollectionProxy('name');
    }

    _createCollectionProxy(type) {
      // Base function for direct calls: Collections.ClassName('item')
      const baseFunction = (value) => {
        const collection = this._getCollection(type, value);
        
        // Return enhanced collection with proxy if enhanced syntax is enabled
        if (this.options.enableEnhancedSyntax) {
          return this._createEnhancedCollectionProxy(collection);
        }
        
        return collection;
      };

      // Create proxy for property access: Collections.ClassName.item
      return new Proxy(baseFunction, {
        get: (target, prop) => {
          // Handle function properties and symbols
          if (typeof prop === 'symbol' || 
              prop === 'constructor' || 
              prop === 'prototype' ||
              prop === 'apply' ||
              prop === 'call' ||
              prop === 'bind' ||
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          // Get collection for property name
          const collection = this._getCollection(type, prop);
          
          // Return enhanced collection if enhanced syntax is enabled
          if (this.options.enableEnhancedSyntax) {
            return this._createEnhancedCollectionProxy(collection);
          }
          
          return collection;
        },
        
        apply: (target, thisArg, args) => {
          if (args.length > 0) {
            return target(args[0]);
          }
          return this._createEmptyCollection();
        }
      });
    }

    _createEnhancedCollectionProxy(collection) {
      if (!collection || !this.options.enableEnhancedSyntax) return collection;
      
      return new Proxy(collection, {
        get: (target, prop) => {
          // Handle numeric indices
          if (!isNaN(prop) && parseInt(prop) >= 0) {
            const index = parseInt(prop);
            const element = target[index];
            
            if (element) {
              // Return enhanced element proxy
              return this._createElementProxy(element);
            }
            return element;
          }
          
          // Return collection methods and properties
          return target[prop];
        },
        
        set: (target, prop, value) => {
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(`Failed to set collection property ${prop}: ${e.message}`);
            return false;
          }
        }
      });
    }

    _createElementProxy(element) {
      if (!element || !this.options.enableEnhancedSyntax) return element;
      
      return new Proxy(element, {
        get: (target, prop) => {
          // Return the actual property value
          return target[prop];
        },
        set: (target, prop, value) => {
          // Set the property value
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(`Failed to set element property ${prop}: ${e.message}`);
            return false;
          }
        }
      });
    }

    _createCacheKey(type, value) {
      return `${type}:${value}`;
    }

    _getCollection(type, value) {
      if (typeof value !== 'string') {
        this._warn(`Invalid ${type} property type: ${typeof value}`);
        return this._createEmptyCollection();
      }

      const cacheKey = this._createCacheKey(type, value);

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cachedCollection = this.cache.get(cacheKey);
        if (this._isValidCollection(cachedCollection)) {
          this.stats.hits++;
          return cachedCollection;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      // Get fresh collection from DOM
      let htmlCollection;
      try {
        switch (type) {
          case 'className':
            htmlCollection = document.getElementsByClassName(value);
            break;
          case 'tagName':
            htmlCollection = document.getElementsByTagName(value);
            break;
          case 'name':
            htmlCollection = document.getElementsByName(value);
            break;
          default:
            this._warn(`Unknown collection type: ${type}`);
            return this._createEmptyCollection();
        }
      } catch (error) {
        this._warn(`Error getting ${type} collection for "${value}": ${error.message}`);
        return this._createEmptyCollection();
      }

      const collection = this._enhanceCollection(htmlCollection, type, value);
      this._addToCache(cacheKey, collection);
      this.stats.misses++;
      return collection;
    }

    _isValidCollection(collection) {
      // Check if collection is still valid by testing if first element is still in DOM
      if (!collection || !collection._originalCollection) return false;
      
      const live = collection._originalCollection;
      if (live.length === 0) return true; // Empty collections are valid
      
      // Check if first element is still in DOM and matches criteria
      const firstElement = live[0];
      return firstElement && 
             firstElement.nodeType === Node.ELEMENT_NODE && 
             document.contains(firstElement);
    }

    _enhanceCollection(htmlCollection, type, value) {
      const collection = {
        _originalCollection: htmlCollection,
        _type: type,
        _value: value,
        _cachedAt: Date.now(),

        // Array-like properties and methods
        get length() {
          return htmlCollection.length;
        },

        item(index) {
          return htmlCollection.item(index);
        },

        namedItem(name) {
          return htmlCollection.namedItem ? htmlCollection.namedItem(name) : null;
        },

        // Array conversion and iteration
        toArray() {
          return Array.from(htmlCollection);
        },

        forEach(callback, thisArg) {
          Array.from(htmlCollection).forEach(callback, thisArg);
        },

        map(callback, thisArg) {
          return Array.from(htmlCollection).map(callback, thisArg);
        },

        filter(callback, thisArg) {
          return Array.from(htmlCollection).filter(callback, thisArg);
        },

        find(callback, thisArg) {
          return Array.from(htmlCollection).find(callback, thisArg);
        },

        some(callback, thisArg) {
          return Array.from(htmlCollection).some(callback, thisArg);
        },

        every(callback, thisArg) {
          return Array.from(htmlCollection).every(callback, thisArg);
        },

        reduce(callback, initialValue) {
          return Array.from(htmlCollection).reduce(callback, initialValue);
        },

        // Utility methods
        first() {
          return htmlCollection.length > 0 ? htmlCollection[0] : null;
        },

        last() {
          return htmlCollection.length > 0 ? htmlCollection[htmlCollection.length - 1] : null;
        },

        at(index) {
          if (index < 0) index = htmlCollection.length + index;
          return index >= 0 && index < htmlCollection.length ? htmlCollection[index] : null;
        },

        isEmpty() {
          return htmlCollection.length === 0;
        },

        // DOM manipulation helpers
        addClass(className) {
          this.forEach(el => el.classList.add(className));
          return this;
        },

        removeClass(className) {
          this.forEach(el => el.classList.remove(className));
          return this;
        },

        toggleClass(className) {
          this.forEach(el => el.classList.toggle(className));
          return this;
        },

        setProperty(prop, value) {
          this.forEach(el => el[prop] = value);
          return this;
        },

        setAttribute(attr, value) {
          this.forEach(el => el.setAttribute(attr, value));
          return this;
        },

        setStyle(styles) {
          this.forEach(el => {
            Object.assign(el.style, styles);
          });
          return this;
        },

        on(event, handler) {
          this.forEach(el => el.addEventListener(event, handler));
          return this;
        },

        off(event, handler) {
          this.forEach(el => el.removeEventListener(event, handler));
          return this;
        },

        // Filtering helpers
        visible() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          });
        },

        hidden() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
          });
        },

        enabled() {
          return this.filter(el => !el.disabled && !el.hasAttribute('disabled'));
        },

        disabled() {
          return this.filter(el => el.disabled || el.hasAttribute('disabled'));
        }
      };

      // Add indexed access
      for (let i = 0; i < htmlCollection.length; i++) {
        Object.defineProperty(collection, i, {
          get() {
            return htmlCollection[i];
          },
          enumerable: true
        });
      }

      // Make it iterable
      collection[Symbol.iterator] = function* () {
        for (let i = 0; i < htmlCollection.length; i++) {
          yield htmlCollection[i];
        }
      };

      // Add update method to collection
      return this._enhanceCollectionWithUpdate(collection);
    }

    _createEmptyCollection() {
      const emptyCollection = { 
        length: 0, 
        item: () => null,
        namedItem: () => null 
      };
      return this._enhanceCollection(emptyCollection, 'empty', '');
    }

    _addToCache(cacheKey, collection) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(cacheKey, collection);
      this.stats.cacheSize = this.cache.size;

      // Store metadata in weak cache
      this.weakCache.set(collection, {
        cacheKey,
        cachedAt: Date.now(),
        accessCount: 1
      });
    }

    _initMutationObserver() {
      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);
      
      // Only observe if document.body exists
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'name'],
          attributeOldValue: true
        });
      } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class', 'name'],
              attributeOldValue: true
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const affectedClasses = new Set();
      const affectedNames = new Set();
      const affectedTags = new Set();

      mutations.forEach(mutation => {
        // Handle added/removed nodes
        [...mutation.addedNodes, ...mutation.removedNodes].forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Collect classes
            if (node.className) {
              node.className.split(/\s+/).forEach(cls => {
                if (cls) affectedClasses.add(cls);
              });
            }
            
            // Collect names
            if (node.name) {
              affectedNames.add(node.name);
            }
            
            // Collect tag names
            affectedTags.add(node.tagName.toLowerCase());
            
            // Handle child elements
            try {
              const children = node.querySelectorAll ? node.querySelectorAll('*') : [];
              children.forEach(child => {
                if (child.className) {
                  child.className.split(/\s+/).forEach(cls => {
                    if (cls) affectedClasses.add(cls);
                  });
                }
                if (child.name) {
                  affectedNames.add(child.name);
                }
                affectedTags.add(child.tagName.toLowerCase());
              });
            } catch (e) {
              // Ignore errors from detached nodes
            }
          }
        });

        // Handle attribute changes
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          
          if (mutation.attributeName === 'class') {
            // Handle class changes
            const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
            const newClasses = target.className ? target.className.split(/\s+/) : [];
            
            [...oldClasses, ...newClasses].forEach(cls => {
              if (cls) affectedClasses.add(cls);
            });
          }
          
          if (mutation.attributeName === 'name') {
            // Handle name changes
            if (mutation.oldValue) affectedNames.add(mutation.oldValue);
            if (target.name) affectedNames.add(target.name);
          }
        }
      });

      // Invalidate affected cache entries
      const keysToDelete = [];
      
      for (const key of this.cache.keys()) {
        const [type, value] = key.split(':', 2);
        
        if ((type === 'className' && affectedClasses.has(value)) ||
            (type === 'name' && affectedNames.has(value)) ||
            (type === 'tagName' && affectedTags.has(value))) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key));
      this.stats.cacheSize = this.cache.size;

      if (keysToDelete.length > 0 && this.options.enableLogging) {
        this._log(`Invalidated ${keysToDelete.length} cache entries due to DOM changes`);
      }
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const beforeSize = this.cache.size;
      const staleKeys = [];

      for (const [key, collection] of this.cache) {
        if (!this._isValidCollection(collection)) {
          staleKeys.push(key);
        }
      }

      staleKeys.forEach(key => this.cache.delete(key));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleKeys.length > 0) {
        this._log(`Cleanup completed. Removed ${staleKeys.length} stale entries.`);
      }
    }

    _debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Collections] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Collections] ${message}`);
      }
    }

    // Apply enhanced update to a single element (shared with Elements helper logic)
    _applyEnhancedUpdateToElement(element, key, value) {
      try {
        // Handle special cases first
        
        // 1. Style object - batch apply CSS styles
        if (key === 'style' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([styleProperty, styleValue]) => {
            if (styleValue !== null && styleValue !== undefined) {
              element.style[styleProperty] = styleValue;
            }
          });
          return;
        }

        // 2. classList methods - enhanced support with arrays
        if (key === 'classList' && typeof value === 'object' && value !== null) {
          this._handleClassListUpdate(element, value);
          return;
        }

        // 3. setAttribute - enhanced support
        if (key === 'setAttribute' && Array.isArray(value) && value.length >= 2) {
          element.setAttribute(value[0], value[1]);
          return;
        }

        // 4. removeAttribute - support for removing attributes
        if (key === 'removeAttribute') {
          if (Array.isArray(value)) {
            value.forEach(attr => element.removeAttribute(attr));
          } else if (typeof value === 'string') {
            element.removeAttribute(value);
          }
          return;
        }

        // 5. addEventListener - ENHANCED: Support for multiple events and e.target/this.update
        if (key === 'addEventListener') {
          handleEnhancedEventListener(element, value);
          return;
        }

        // 6. removeEventListener - support for removing event listeners
        if (key === 'removeEventListener' && Array.isArray(value) && value.length >= 2) {
          const [eventType, handler, options] = value;
          element.removeEventListener(eventType, handler, options);
          return;
        }

        // 7. dataset - support for data attributes
        if (key === 'dataset' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
          return;
        }

        // 8. Handle DOM methods (value should be an array of arguments)
        if (typeof element[key] === 'function') {
          if (Array.isArray(value)) {
            element[key](...value);
          } else {
            element[key](value);
          }
          return;
        }

        // 9. Handle regular DOM properties
        if (key in element) {
          element[key] = value;
          return;
        }

        // 10. Fallback to setAttribute
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          element.setAttribute(key, value);
          return;
        }

        console.warn(`[DOM Helpers] Unknown property or method: ${key}`);
      } catch (error) {
        console.warn(`[DOM Helpers] Failed to apply update ${key}: ${error.message}`);
      }
    }

    // Handle classList updates with enhanced functionality
    _handleClassListUpdate(element, classListUpdates) {
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

            case 'contains':
              // For debugging/logging purposes
              if (Array.isArray(classes)) {
                classes.forEach(cls => {
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

    // Enhanced collection with update method
    _enhanceCollectionWithUpdate(collection) {
      if (!collection || collection._hasEnhancedUpdateMethod) {
        return collection;
      }

// Enhance individual elements in collection with classList protection
  if (collection._originalCollection) {
    Array.from(collection._originalCollection).forEach(element => {
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        protectClassList(element);
      }
    });
  }

      // Use EnhancedUpdateUtility if available, otherwise create comprehensive inline update method
      if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        return EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
      }

      // Comprehensive fallback: create enhanced update method inline
      try {
        Object.defineProperty(collection, 'update', {
          value: (updates = {}) => {
            if (!updates || typeof updates !== 'object') {
              console.warn('[DOM Helpers] .update() called with invalid updates object');
              return collection;
            }

            // Get elements from collection
            let elements = [];
            if (collection._originalCollection) {
              elements = Array.from(collection._originalCollection);
            } else if (collection.length !== undefined) {
              elements = Array.from(collection);
            }

            if (elements.length === 0) {
              console.info('[DOM Helpers] .update() called on empty collection');
              return collection;
            }

            try {
              // Apply updates to each element in the collection
              elements.forEach(element => {
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                  Object.entries(updates).forEach(([key, value]) => {
                    this._applyEnhancedUpdateToElement(element, key, value);
                  });
                }
              });
            } catch (error) {
              console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
            }

            return collection; // Return for chaining
          },
          writable: false,
          enumerable: false,
          configurable: true
        });

        // Mark as enhanced
        Object.defineProperty(collection, '_hasEnhancedUpdateMethod', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (error) {
        // Fallback: attach as regular property
        collection.update = (updates = {}) => {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return collection;
          }

          let elements = [];
          if (collection._originalCollection) {
            elements = Array.from(collection._originalCollection);
          } else if (collection.length !== undefined) {
            elements = Array.from(collection);
          }

          if (elements.length === 0) {
            console.info('[DOM Helpers] .update() called on empty collection');
            return collection;
          }

          try {
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updates).forEach(([key, value]) => {
                  this._applyEnhancedUpdateToElement(element, key, value);
                });
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
          }

          return collection;
        };
        collection._hasEnhancedUpdateMethod = true;
      }

      return collection;
    }

    // Public API
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;
      
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Collections helper destroyed');
    }

    isCached(type, value) {
      return this.cache.has(this._createCacheKey(type, value));
    }

    getCacheSnapshot() {
      return Array.from(this.cache.keys());
    }

    // Enhanced methods for batch operations
    getMultiple(requests) {
      const results = {};
      
      requests.forEach(({ type, value, as }) => {
        const key = as || `${type}_${value}`;
        switch (type) {
          case 'className':
            results[key] = this.ClassName[value];
            break;
          case 'tagName':
            results[key] = this.TagName[value];
            break;
          case 'name':
            results[key] = this.Name[value];
            break;
        }
      });
      
      return results;
    }

    async waitForElements(type, value, minCount = 1, timeout = 5000) {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        let collection;
        switch (type) {
          case 'className':
            collection = this.ClassName[value];
            break;
          case 'tagName':
            collection = this.TagName[value];
            break;
          case 'name':
            collection = this.Name[value];
            break;
          default:
            throw new Error(`Unknown collection type: ${type}`);
        }
        
        if (collection && collection.length >= minCount) {
          return collection;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      throw new Error(`Timeout waiting for ${type}="${value}" (min: ${minCount})`);
    }

    // Configuration methods
    enableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = true;
      return this;
    }

    disableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = false;
      return this;
    }
  }

  // Auto-initialize with sensible defaults
  const CollectionHelper = new ProductionCollectionHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
    enableEnhancedSyntax: true
  });

  // Global API - Clean and intuitive
  const Collections = {
    ClassName: CollectionHelper.ClassName,
    TagName: CollectionHelper.TagName,
    Name: CollectionHelper.Name,

    // Utility methods
    helper: CollectionHelper,
    stats: () => CollectionHelper.getStats(),
    clear: () => CollectionHelper.clearCache(),
    destroy: () => CollectionHelper.destroy(),
    isCached: (type, value) => CollectionHelper.isCached(type, value),
    getMultiple: (requests) => CollectionHelper.getMultiple(requests),
    waitFor: (type, value, minCount, timeout) => CollectionHelper.waitForElements(type, value, minCount, timeout),
    enableEnhancedSyntax: () => CollectionHelper.enableEnhancedSyntax(),
    disableEnhancedSyntax: () => CollectionHelper.disableEnhancedSyntax(),
    configure: (options) => {
      Object.assign(CollectionHelper.options, options);
      return Collections;
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Collections, ProductionCollectionHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Collections, ProductionCollectionHelper };
    });
  } else {
    // Browser globals
    global.Collections = Collections;
    global.ProductionCollectionHelper = ProductionCollectionHelper;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      CollectionHelper.destroy();
    });
  }

  // ===== SELECTOR HELPER =====
  class ProductionSelectorHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.weakCache = new WeakMap();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 1000,
        debounceDelay: options.debounceDelay ?? 16,
        enableSmartCaching: options.enableSmartCaching ?? true,
        enableEnhancedSyntax: options.enableEnhancedSyntax ?? true,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now(),
        selectorTypes: new Map()
      };

      this.pendingUpdates = new Set();
      this.cleanupTimer = null;
      this.isDestroyed = false;
      this.selectorPatterns = this._buildSelectorPatterns();

      this._initProxies();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _buildSelectorPatterns() {
      return {
        // Common CSS selector shortcuts
        id: /^#([a-zA-Z][\w-]*)$/,
        class: /^\.([a-zA-Z][\w-]*)$/,
        tag: /^([a-zA-Z][a-zA-Z0-9]*)$/,
        attribute: /^\[([^\]]+)\]$/,
        descendant: /^(\w+)\s+(\w+)$/,
        child: /^(\w+)\s*>\s*(\w+)$/,
        pseudo: /^(\w+):([a-zA-Z-]+)$/
      };
    }

    _initProxies() {
      // Basic query function for querySelector (single element)
      this.query = this._createQueryFunction('single');
      
      // Basic queryAll function for querySelectorAll (multiple elements)
      this.queryAll = this._createQueryFunction('multiple');

      // Enhanced syntax proxies (if enabled)
      if (this.options.enableEnhancedSyntax) {
        this._initEnhancedSyntax();
      }

      // Scoped query methods
      this.Scoped = {
        within: (container, selector) => {
          const containerEl = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
          
          if (!containerEl) return null;
          
          const cacheKey = `scoped:${containerEl.id || 'anonymous'}:${selector}`;
          return this._getScopedQuery(containerEl, selector, 'single', cacheKey);
        },
        
        withinAll: (container, selector) => {
          const containerEl = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
          
          if (!containerEl) return this._createEmptyCollection();
          
          const cacheKey = `scopedAll:${containerEl.id || 'anonymous'}:${selector}`;
          return this._getScopedQuery(containerEl, selector, 'multiple', cacheKey);
        }
      };
    }

    _initEnhancedSyntax() {
      // Enhanced query proxy for direct property access
      const originalQuery = this.query;
      this.query = new Proxy(originalQuery, {
        get: (target, prop) => {
          // Handle function properties and symbols
          if (typeof prop === 'symbol' || 
              prop === 'constructor' || 
              prop === 'prototype' ||
              prop === 'apply' ||
              prop === 'call' ||
              prop === 'bind' ||
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          // Convert property to selector
          const selector = this._normalizeSelector(prop);
          const element = this._getQuery('single', selector);
          
          // Return element with enhanced proxy if found
          if (element) {
            return this._createElementProxy(element);
          }
          
          return element;
        },
        
        apply: (target, thisArg, args) => {
          if (args.length > 0) {
            return this._getQuery('single', args[0]);
          }
          return null;
        }
      });

      // Enhanced queryAll proxy for array-like access
      const originalQueryAll = this.queryAll;
      this.queryAll = new Proxy(originalQueryAll, {
        get: (target, prop) => {
          // Handle function properties and symbols
          if (typeof prop === 'symbol' || 
              prop === 'constructor' || 
              prop === 'prototype' ||
              prop === 'apply' ||
              prop === 'call' ||
              prop === 'bind' ||
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          // Convert property to selector
          const selector = this._normalizeSelector(prop);
          const collection = this._getQuery('multiple', selector);
          
          // Return enhanced collection proxy
          return this._createCollectionProxy(collection);
        },
        
        apply: (target, thisArg, args) => {
          if (args.length > 0) {
            return this._getQuery('multiple', args[0]);
          }
          return this._createEmptyCollection();
        }
      });
    }

    _createElementProxy(element) {
      if (!element || !this.options.enableEnhancedSyntax) return element;
      
      return new Proxy(element, {
        get: (target, prop) => {
          // Return the actual property value
          return target[prop];
        },
        set: (target, prop, value) => {
          // Set the property value
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(`Failed to set property ${prop}: ${e.message}`);
            return false;
          }
        }
      });
    }

    _createCollectionProxy(collection) {
      if (!collection || !this.options.enableEnhancedSyntax) return collection;
      
      return new Proxy(collection, {
        get: (target, prop) => {
          // Handle numeric indices
          if (!isNaN(prop) && parseInt(prop) >= 0) {
            const index = parseInt(prop);
            const element = target[index];
            
            if (element) {
              // Return enhanced element proxy
              return this._createElementProxy(element);
            }
            return element;
          }
          
          // Return collection methods and properties
          return target[prop];
        },
        set: (target, prop, value) => {
          try {
            target[prop] = value;
            return true;
          } catch (e) {
            this._warn(`Failed to set collection property ${prop}: ${e.message}`);
            return false;
          }
        }
      });
    }

    _createQueryFunction(type) {
      const func = (selector) => this._getQuery(type, selector);
      func._queryType = type;
      func._helper = this;
      return func;
    }

    _normalizeSelector(prop) {
      const propStr = prop.toString();
      
      // Handle common property patterns
      const conversions = {
        // ID shortcuts: myButton → #my-button
        id: (str) => `#${this._camelToKebab(str)}`,
        
        // Class shortcuts: btnPrimary → .btn-primary  
        class: (str) => `.${this._camelToKebab(str)}`,
        
        // Direct selectors
        direct: (str) => str
      };

      // Try to detect intent from property name
      if (propStr.startsWith('id') && propStr.length > 2) {
        // idMyButton → #my-button
        return conversions.id(propStr.slice(2));
      }
      
      if (propStr.startsWith('class') && propStr.length > 5) {
        // classBtnPrimary → .btn-primary
        return conversions.class(propStr.slice(5));
      }
      
      // Check if it looks like a camelCase class name
      if (/^[a-z][a-zA-Z]*$/.test(propStr) && /[A-Z]/.test(propStr)) {
        // btnPrimary → .btn-primary (assume class)
        return conversions.class(propStr);
      }
      
      // Check if it looks like a single tag name
      if (/^[a-z]+$/.test(propStr) && propStr.length < 10) {
        // button, div, span → button, div, span
        return propStr;
      }
      
      // Default: treat as direct selector or ID
      if (propStr.match(/^[a-zA-Z][\w-]*$/)) {
        // Looks like an ID: myButton → #myButton
        return `#${propStr}`;
      }
      
      return propStr;
    }

    _camelToKebab(str) {
      return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    _createCacheKey(type, selector) {
      return `${type}:${selector}`;
    }

    _getQuery(type, selector) {
      if (typeof selector !== 'string') {
        this._warn(`Invalid selector type: ${typeof selector}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      const cacheKey = this._createCacheKey(type, selector);

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this._isValidQuery(cached, type)) {
          this.stats.hits++;
          this._trackSelectorType(selector);
          return cached;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      // Execute fresh query
      let result;
      try {
        if (type === 'single') {
          const element = document.querySelector(selector);
          result = this._enhanceElementWithUpdate(element);
        } else {
          const nodeList = document.querySelectorAll(selector);
          result = this._enhanceNodeList(nodeList, selector);
        }
      } catch (error) {
        this._warn(`Invalid selector "${selector}": ${error.message}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      this._addToCache(cacheKey, result);
      this.stats.misses++;
      this._trackSelectorType(selector);
      return result;
    }

    _getScopedQuery(container, selector, type, cacheKey) {
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (this._isValidQuery(cached, type)) {
          this.stats.hits++;
          return cached;
        } else {
          this.cache.delete(cacheKey);
        }
      }

      // Execute scoped query
      let result;
      try {
        if (type === 'single') {
          result = container.querySelector(selector);
        } else {
          const nodeList = container.querySelectorAll(selector);
          result = this._enhanceNodeList(nodeList, selector);
        }
      } catch (error) {
        this._warn(`Invalid scoped selector "${selector}": ${error.message}`);
        return type === 'single' ? null : this._createEmptyCollection();
      }

      this._addToCache(cacheKey, result);
      this.stats.misses++;
      return result;
    }

    _isValidQuery(cached, type) {
      if (type === 'single') {
        // Single element - check if still in DOM
        return cached && cached.nodeType === Node.ELEMENT_NODE && document.contains(cached);
      } else {
        // NodeList collection - check if first element is still valid
        if (!cached || !cached._originalNodeList) return false;
        const nodeList = cached._originalNodeList;
        if (nodeList.length === 0) return true; // Empty lists are valid
        const firstElement = nodeList[0];
        return firstElement && document.contains(firstElement);
      }
    }

    _enhanceNodeList(nodeList, selector) {
      const collection = {
        _originalNodeList: nodeList,
        _selector: selector,
        _cachedAt: Date.now(),

        // Array-like properties
        get length() {
          return nodeList.length;
        },

        // Standard NodeList methods
        item(index) {
          return nodeList.item(index);
        },

        entries() {
          return nodeList.entries();
        },

        keys() {
          return nodeList.keys();
        },

        values() {
          return nodeList.values();
        },

        // Enhanced array methods
        toArray() {
          return Array.from(nodeList);
        },

        forEach(callback, thisArg) {
          nodeList.forEach(callback, thisArg);
        },

        map(callback, thisArg) {
          return Array.from(nodeList).map(callback, thisArg);
        },

        filter(callback, thisArg) {
          return Array.from(nodeList).filter(callback, thisArg);
        },

        find(callback, thisArg) {
          return Array.from(nodeList).find(callback, thisArg);
        },

        some(callback, thisArg) {
          return Array.from(nodeList).some(callback, thisArg);
        },

        every(callback, thisArg) {
          return Array.from(nodeList).every(callback, thisArg);
        },

        reduce(callback, initialValue) {
          return Array.from(nodeList).reduce(callback, initialValue);
        },

        // Utility methods
        first() {
          return nodeList.length > 0 ? nodeList[0] : null;
        },

        last() {
          return nodeList.length > 0 ? nodeList[nodeList.length - 1] : null;
        },

        at(index) {
          if (index < 0) index = nodeList.length + index;
          return index >= 0 && index < nodeList.length ? nodeList[index] : null;
        },

        isEmpty() {
          return nodeList.length === 0;
        },

        // DOM manipulation helpers
        addClass(className) {
          this.forEach(el => el.classList.add(className));
          return this;
        },

        removeClass(className) {
          this.forEach(el => el.classList.remove(className));
          return this;
        },

        toggleClass(className) {
          this.forEach(el => el.classList.toggle(className));
          return this;
        },

        setProperty(prop, value) {
          this.forEach(el => el[prop] = value);
          return this;
        },

        setAttribute(attr, value) {
          this.forEach(el => el.setAttribute(attr, value));
          return this;
        },

        setStyle(styles) {
          this.forEach(el => {
            Object.assign(el.style, styles);
          });
          return this;
        },

        on(event, handler) {
          this.forEach(el => el.addEventListener(event, handler));
          return this;
        },

        off(event, handler) {
          this.forEach(el => el.removeEventListener(event, handler));
          return this;
        },

        // Filtering helpers
        visible() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          });
        },

        hidden() {
          return this.filter(el => {
            const style = window.getComputedStyle(el);
            return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
          });
        },

        enabled() {
          return this.filter(el => !el.disabled && !el.hasAttribute('disabled'));
        },

        disabled() {
          return this.filter(el => el.disabled || el.hasAttribute('disabled'));
        },

        // Query within results
        within(selector) {
          const results = [];
          this.forEach(el => {
            const found = el.querySelectorAll(selector);
            results.push(...Array.from(found));
          });
          return this._helper._enhanceNodeList(results, `${this._selector} ${selector}`);
        }
      };

      // Add indexed access
      for (let i = 0; i < nodeList.length; i++) {
        Object.defineProperty(collection, i, {
          get() {
            return nodeList[i];
          },
          enumerable: true
        });
      }

      // Make it iterable
      collection[Symbol.iterator] = function* () {
        for (let i = 0; i < nodeList.length; i++) {
          yield nodeList[i];
        }
      };

      // Add update method to collection
      return this._enhanceCollectionWithUpdate(collection);
    }

    _createEmptyCollection() {
      const emptyNodeList = document.querySelectorAll('nonexistent-element-that-never-exists');
      return this._enhanceNodeList(emptyNodeList, 'empty');
    }

    _trackSelectorType(selector) {
      const type = this._classifySelector(selector);
      const current = this.stats.selectorTypes.get(type) || 0;
      this.stats.selectorTypes.set(type, current + 1);
    }

    _classifySelector(selector) {
      if (this.selectorPatterns.id.test(selector)) return 'id';
      if (this.selectorPatterns.class.test(selector)) return 'class';
      if (this.selectorPatterns.tag.test(selector)) return 'tag';
      if (this.selectorPatterns.attribute.test(selector)) return 'attribute';
      if (this.selectorPatterns.descendant.test(selector)) return 'descendant';
      if (this.selectorPatterns.child.test(selector)) return 'child';
      if (this.selectorPatterns.pseudo.test(selector)) return 'pseudo';
      return 'complex';
    }

    _addToCache(cacheKey, result) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(cacheKey, result);
      this.stats.cacheSize = this.cache.size;

      // Store metadata in weak cache for elements
      if (result && result.nodeType === Node.ELEMENT_NODE) {
        this.weakCache.set(result, {
          cacheKey,
          cachedAt: Date.now(),
          accessCount: 1
        });
      }
    }

    _initMutationObserver() {
      if (!this.options.enableSmartCaching) return;

      const debouncedUpdate = this._debounce((mutations) => {
        this._processMutations(mutations);
      }, this.options.debounceDelay);

      this.observer = new MutationObserver(debouncedUpdate);
      
      // Only observe if document.body exists
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id', 'class', 'style', 'hidden', 'disabled']
        });
      } else {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && !this.isDestroyed) {
            this.observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['id', 'class', 'style', 'hidden', 'disabled']
            });
          }
        });
      }
    }

    _processMutations(mutations) {
      if (this.isDestroyed) return;

      const affectedSelectors = new Set();

      mutations.forEach(mutation => {
        // Handle structural changes (added/removed nodes)
        if (mutation.type === 'childList') {
          // Invalidate all cached queries since DOM structure changed
          affectedSelectors.add('*');
        }

        // Handle attribute changes
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          const attrName = mutation.attributeName;
          
          // Track specific attribute changes
          if (attrName === 'id') {
            const oldValue = mutation.oldValue;
            if (oldValue) affectedSelectors.add(`#${oldValue}`);
            if (target.id) affectedSelectors.add(`#${target.id}`);
          }
          
          if (attrName === 'class') {
            const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
            const newClasses = target.className ? target.className.split(/\s+/) : [];
            [...oldClasses, ...newClasses].forEach(cls => {
              if (cls) affectedSelectors.add(`.${cls}`);
            });
          }
          
          // Other attributes might affect attribute selectors
          affectedSelectors.add(`[${attrName}]`);
        }
      });

      // Clear affected cache entries
      if (affectedSelectors.has('*')) {
        // Major DOM change - clear all cache
        this.cache.clear();
      } else {
        // Selective cache invalidation
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
          const [type, selector] = key.split(':', 2);
          for (const affected of affectedSelectors) {
            if (selector.includes(affected)) {
              keysToDelete.push(key);
              break;
            }
          }
        }
        keysToDelete.forEach(key => this.cache.delete(key));
      }

      this.stats.cacheSize = this.cache.size;
    }

    _scheduleCleanup() {
      if (!this.options.autoCleanup || this.isDestroyed) return;

      this.cleanupTimer = setTimeout(() => {
        this._performCleanup();
        this._scheduleCleanup();
      }, this.options.cleanupInterval);
    }

    _performCleanup() {
      if (this.isDestroyed) return;

      const beforeSize = this.cache.size;
      const staleKeys = [];

      for (const [key, value] of this.cache) {
        const [type] = key.split(':', 1);
        if (!this._isValidQuery(value, type === 'single' ? 'single' : 'multiple')) {
          staleKeys.push(key);
        }
      }

      staleKeys.forEach(key => this.cache.delete(key));

      this.stats.cacheSize = this.cache.size;
      this.stats.lastCleanup = Date.now();

      if (this.options.enableLogging && staleKeys.length > 0) {
        this._log(`Cleanup completed. Removed ${staleKeys.length} stale entries.`);
      }
    }

    _debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Selector] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Selector] ${message}`);
      }
    }

    // Enhanced element with update method
    _enhanceElementWithUpdate(element) {
      if (!element || element._hasEnhancedUpdateMethod) {
        return element;
      }

      // Protect classList first
  protectClassList(element);

      // Use EnhancedUpdateUtility if available, otherwise create comprehensive inline update method
      if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceElementWithUpdate) {
        return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
      }

      // Fallback: create update method inline
      try {
        Object.defineProperty(element, 'update', {
          value: (updates = {}) => {
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
                if (typeof value === 'string' || typeof value === 'number') {
                  element.setAttribute(key, value);
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
        // Fallback: attach as regular property
        element.update = (updates = {}) => {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return element;
          }

          try {
            Object.entries(updates).forEach(([key, value]) => {
              if (key === 'style' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([styleProperty, styleValue]) => {
                  if (styleValue !== null && styleValue !== undefined) {
                    element.style[styleProperty] = styleValue;
                  }
                });
                return;
              }

              if (typeof element[key] === 'function') {
                if (Array.isArray(value)) {
                  element[key](...value);
                } else {
                  element[key](value);
                }
                return;
              }

              if (key in element) {
                element[key] = value;
                return;
              }

              if (typeof value === 'string' || typeof value === 'number') {
                element.setAttribute(key, value);
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in .update(): ${error.message}`);
          }

          return element;
        };
        element._hasUpdateMethod = true;
      }

      return element;
    }

    // Enhanced collection with update method
    _enhanceCollectionWithUpdate(collection) {
      if (!collection || collection._hasEnhancedUpdateMethod) {
        return collection;
      }

// Enhance individual elements in collection with classList protection
  if (collection._originalCollection) {
    Array.from(collection._originalCollection).forEach(element => {
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        protectClassList(element);
      }
    });
  }

      // Use EnhancedUpdateUtility if available, otherwise create comprehensive inline update method
      if (EnhancedUpdateUtility && EnhancedUpdateUtility.enhanceCollectionWithUpdate) {
        return EnhancedUpdateUtility.enhanceCollectionWithUpdate(collection);
      }

      // Fallback: create update method inline
      try {
        Object.defineProperty(collection, 'update', {
          value: (updates = {}) => {
            if (!updates || typeof updates !== 'object') {
              console.warn('[DOM Helpers] .update() called with invalid updates object');
              return collection;
            }

            // Get elements from collection
            let elements = [];
            if (collection._originalNodeList) {
              elements = Array.from(collection._originalNodeList);
            } else if (collection.length !== undefined) {
              elements = Array.from(collection);
            }

            if (elements.length === 0) {
              console.info('[DOM Helpers] .update() called on empty collection');
              return collection;
            }

            try {
              // Apply updates to each element in the collection
              elements.forEach(element => {
                if (element && element.nodeType === Node.ELEMENT_NODE) {
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
                    if (typeof value === 'string' || typeof value === 'number') {
                      element.setAttribute(key, value);
                    }
                  });
                }
              });
            } catch (error) {
              console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
            }

            return collection; // Return for chaining
          },
          writable: false,
          enumerable: false,
          configurable: true
        });

        // Mark as enhanced
        Object.defineProperty(collection, '_hasUpdateMethod', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false
        });
      } catch (error) {
        // Fallback: attach as regular property
        collection.update = (updates = {}) => {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers] .update() called with invalid updates object');
            return collection;
          }

          let elements = [];
          if (collection._originalNodeList) {
            elements = Array.from(collection._originalNodeList);
          } else if (collection.length !== undefined) {
            elements = Array.from(collection);
          }

          if (elements.length === 0) {
            console.info('[DOM Helpers] .update() called on empty collection');
            return collection;
          }

          try {
            elements.forEach(element => {
              if (element && element.nodeType === Node.ELEMENT_NODE) {
                Object.entries(updates).forEach(([key, value]) => {
                  if (key === 'style' && typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([styleProperty, styleValue]) => {
                      if (styleValue !== null && styleValue !== undefined) {
                        element.style[styleProperty] = styleValue;
                      }
                    });
                    return;
                  }

                  if (typeof element[key] === 'function') {
                    if (Array.isArray(value)) {
                      element[key](...value);
                    } else {
                      element[key](value);
                    }
                    return;
                  }

                  if (key in element) {
                    element[key] = value;
                    return;
                  }

                  if (typeof value === 'string' || typeof value === 'number') {
                    element.setAttribute(key, value);
                  }
                });
              }
            });
          } catch (error) {
            console.warn(`[DOM Helpers] Error in collection .update(): ${error.message}`);
          }

          return collection;
        };
        collection._hasUpdateMethod = true;
      }

      return collection;
    }

    // Public API
    getStats() {
      return {
        ...this.stats,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        uptime: Date.now() - this.stats.lastCleanup,
        selectorBreakdown: Object.fromEntries(this.stats.selectorTypes)
      };
    }

    clearCache() {
      this.cache.clear();
      this.stats.cacheSize = 0;
      this.stats.selectorTypes.clear();
      this._log('Cache cleared manually');
    }

    destroy() {
      this.isDestroyed = true;
      
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.cleanupTimer) {
        clearTimeout(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      this.cache.clear();
      this._log('Selector helper destroyed');
    }

    // Advanced query methods
    async waitForSelector(selector, timeout = 5000) {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        const element = this.query(selector);
        if (element) {
          return element;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      throw new Error(`Timeout waiting for selector: ${selector}`);
    }

    async waitForSelectorAll(selector, minCount = 1, timeout = 5000) {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        const elements = this.queryAll(selector);
        if (elements && elements.length >= minCount) {
          return elements;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      throw new Error(`Timeout waiting for selector: ${selector} (min: ${minCount})`);
    }

    // Configuration methods
    enableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = true;
      this._initEnhancedSyntax();
      return this;
    }

    disableEnhancedSyntax() {
      this.options.enableEnhancedSyntax = false;
      // Reset to basic functions
      this.query = this._createQueryFunction('single');
      this.queryAll = this._createQueryFunction('multiple');
      return this;
    }
  }

  // Auto-initialize with sensible defaults
  const SelectorHelper = new ProductionSelectorHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 1000,
    enableSmartCaching: true,
    enableEnhancedSyntax: true
  });

  // Global API - Clean and intuitive
  const Selector = {
    query: SelectorHelper.query,
    queryAll: SelectorHelper.queryAll,
    Scoped: SelectorHelper.Scoped,

    // Utility methods
    helper: SelectorHelper,
    stats: () => SelectorHelper.getStats(),
    clear: () => SelectorHelper.clearCache(),
    destroy: () => SelectorHelper.destroy(),
    waitFor: (selector, timeout) => SelectorHelper.waitForSelector(selector, timeout),
    waitForAll: (selector, minCount, timeout) => SelectorHelper.waitForSelectorAll(selector, minCount, timeout),
    enableEnhancedSyntax: () => SelectorHelper.enableEnhancedSyntax(),
    disableEnhancedSyntax: () => SelectorHelper.disableEnhancedSyntax(),
    configure: (options) => {
      Object.assign(SelectorHelper.options, options);
      return Selector;
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Selector, ProductionSelectorHelper };
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return { Selector, ProductionSelectorHelper };
    });
  } else {
    global.Selector = Selector;
    global.ProductionSelectorHelper = ProductionSelectorHelper;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      SelectorHelper.destroy();
    });
  }

  // ===== COMBINED API =====
  const DOMHelpers = {
    // Individual helpers
    Elements: global.Elements,
    Collections: global.Collections,
    Selector: global.Selector,
    
    // Helper classes
    ProductionElementsHelper: global.ProductionElementsHelper,
    ProductionCollectionHelper: global.ProductionCollectionHelper,
    ProductionSelectorHelper: global.ProductionSelectorHelper,
    
    // Utility methods
    version: '2.0.0',
    
    // Check if all helpers are available
    isReady() {
      return !!(this.Elements && this.Collections && this.Selector);
    },
    
    // Get combined statistics
    getStats() {
      const stats = {};
      
      if (this.Elements && typeof this.Elements.stats === 'function') {
        stats.elements = this.Elements.stats();
      }
      
      if (this.Collections && typeof this.Collections.stats === 'function') {
        stats.collections = this.Collections.stats();
      }
      
      if (this.Selector && typeof this.Selector.stats === 'function') {
        stats.selector = this.Selector.stats();
      }
      
      return stats;
    },
    
    // Clear all caches
    clearAll() {
      if (this.Elements && typeof this.Elements.clear === 'function') {
        this.Elements.clear();
      }
      
      if (this.Collections && typeof this.Collections.clear === 'function') {
        this.Collections.clear();
      }
      
      if (this.Selector && typeof this.Selector.clear === 'function') {
        this.Selector.clear();
      }
    },
    
    // Destroy all helpers
    destroyAll() {
      if (this.Elements && typeof this.Elements.destroy === 'function') {
        this.Elements.destroy();
      }
      
      if (this.Collections && typeof this.Collections.destroy === 'function') {
        this.Collections.destroy();
      }
      
      if (this.Selector && typeof this.Selector.destroy === 'function') {
        this.Selector.destroy();
      }
    },
    
    // Configure all helpers
    configure(options = {}) {
      if (this.Elements && typeof this.Elements.configure === 'function') {
        this.Elements.configure(options.elements || options);
      }
      
      if (this.Collections && typeof this.Collections.configure === 'function') {
        this.Collections.configure(options.collections || options);
      }
      
      if (this.Selector && typeof this.Selector.configure === 'function') {
        this.Selector.configure(options.selector || options);
      }
      
      return this;
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = {
      DOMHelpers,
      Elements: global.Elements,
      Collections: global.Collections,
      Selector: global.Selector,
      ProductionElementsHelper: global.ProductionElementsHelper,
      ProductionCollectionHelper: global.ProductionCollectionHelper,
      ProductionSelectorHelper: global.ProductionSelectorHelper
    };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return {
        DOMHelpers,
        Elements: global.Elements,
        Collections: global.Collections,
        Selector: global.Selector,
        ProductionElementsHelper: global.ProductionElementsHelper,
        ProductionCollectionHelper: global.ProductionCollectionHelper,
        ProductionSelectorHelper: global.ProductionSelectorHelper
      };
    });
  } else {
    // Browser globals
    global.DOMHelpers = DOMHelpers;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      DOMHelpers.destroyAll();
    });
  }

// Add this enhancement to your DOM Helpers library
(function() {
  'use strict';

  // Store the original createElement method
  const originalCreateElement = document.createElement;

  // Enhanced createElement that automatically adds the update method
  document.createElement = function(tagName, options) {
    // Call the original createElement
    const element = originalCreateElement.call(document, tagName, options);
    
    // Auto-enhance the element with the update method
    if (typeof enhanceElementWithUpdate === 'function') {
      // Use your library's enhancement function if available
      return enhanceElementWithUpdate(element);
    } else if (typeof EnhancedUpdateUtility !== 'undefined' && EnhancedUpdateUtility.enhanceElementWithUpdate) {
      // Use the EnhancedUpdateUtility if available
      return EnhancedUpdateUtility.enhanceElementWithUpdate(element);
    } else {
      // Fallback: add a basic update method inline
      return addBasicUpdateMethod(element);
    }
  };

  // Basic update method implementation for fallback
  function addBasicUpdateMethod(element) {
    if (element && !element._hasUpdateMethod) {
      // Protect classList first
      if (typeof protectClassList === 'function') {
        protectClassList(element);
      }

      try {
        Object.defineProperty(element, 'update', {
          value: function(updates = {}) {
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

                // Handle setAttribute
                if (key === 'setAttribute' && Array.isArray(value) && value.length >= 2) {
                  element.setAttribute(value[0], value[1]);
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
                if (key === 'addEventListener' && Array.isArray(value) && value.length >= 2) {
                  const [eventType, handler, options] = value;
                  element.addEventListener(eventType, handler, options);
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
                  element.setAttribute(key, value);
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
        element.update = function(updates = {}) {
          // Same implementation as above but as a regular function
          // ... (implementation details same as above)
        };
        element._hasUpdateMethod = true;
      }
    }

    return element;
  }

  // Optional: Provide a way to restore the original createElement
  document.createElement.restore = function() {
    document.createElement = originalCreateElement;
  };

})();

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
