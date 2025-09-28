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

      // 3. setAttribute - enhanced support for both array and object formats
      if (key === 'setAttribute') {
        if (Array.isArray(value) && value.length >= 2) {
          // Legacy array format: ['src', 'image.png']
          element.setAttribute(value[0], value[1]);
        } else if (typeof value === 'object' && value !== null) {
          // New object format: { src: 'image.png', alt: 'Description' }
          Object.entries(value).forEach(([attrName, attrValue]) => {
            element.setAttribute(attrName, attrValue);
          });
        }
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

                // Handle setAttribute - enhanced support for both array and object formats
                if (key === 'setAttribute') {
                  if (Array.isArray(value) && value.length >= 2) {
                    // Legacy array format: ['src', 'image.png']
                    element.setAttribute(value[0], value[1]);
                  } else if (typeof value === 'object' && value !== null) {
                    // New object format: { src: 'image.png', alt: 'Description' }
                    Object.entries(value).forEach(([attrName, attrValue]) => {
                      element.setAttribute(attrName, attrValue);
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

              // Handle setAttribute - enhanced support for both array and object formats
              if (key === 'setAttribute') {
                if (Array.isArray(value) && value.length >= 2) {
                  // Legacy array format: ['src', 'image.png']
                  element.setAttribute(value[0], value[1]);
                } else if (typeof value === 'object' && value !== null) {
                  // New object format: { src: 'image.png', alt: 'Description' }
                  Object.entries(value).forEach(([attrName, attrValue]) => {
                    element.setAttribute(attrName, attrValue);
                  });
                }
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

/**
 * DOM Helpers - Animation Module
 * Modular JavaScript Animations/Transitions helper that integrates seamlessly with DOM Helpers
 * 
 * Features:
 * - Declarative animation methods: fadeIn, fadeOut, slideUp, slideDown, slideToggle, transform
 * - Animation chaining support
 * - Configurable durations, delays, easing, and callbacks
 * - Compatible with .update({}) method from DOM Helpers
 * - Works with dynamic content (AJAX-loaded elements)
 * - Automatic cleanup of inline styles after animation completes
 * - Browser compatibility with graceful fallbacks
 * - Stays close to vanilla JavaScript using traditional DOM APIs
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if main DOM Helpers library is loaded
  if (typeof global.Elements === 'undefined' && typeof Elements === 'undefined') {
    console.warn('[DOM Helpers Animation] Main DOM Helpers library must be loaded before the Animation module');
    return;
  }

  /**
   * Default animation configuration
   */
  const DEFAULT_CONFIG = {
    duration: 300,
    delay: 0,
    easing: 'ease',
    cleanup: true,
    queue: true
  };

  /**
   * CSS easing functions mapping
   */
  const EASING_FUNCTIONS = {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    'ease-in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    'ease-in-quart': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    'ease-out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    'ease-in-out-quart': 'cubic-bezier(0.77, 0, 0.175, 1)',
    'ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
    'ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',
    'ease-in-sine': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
    'ease-out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
    'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
    'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
    'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
    'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  };

  /**
   * Browser compatibility detection
   */
  const BROWSER_SUPPORT = {
    transitions: (function() {
      const el = document.createElement('div');
      const transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      
      for (let t in transitions) {
        if (el.style[t] !== undefined) {
          return { property: t, event: transitions[t] };
        }
      }
      return false;
    })(),
    
    transforms: (function() {
      const el = document.createElement('div');
      const transforms = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
      
      for (let i = 0; i < transforms.length; i++) {
        if (el.style[transforms[i]] !== undefined) {
          return transforms[i];
        }
      }
      return false;
    })()
  };

  /**
   * Animation queue manager for elements
   */
  class AnimationQueue {
    constructor() {
      this.queues = new WeakMap();
    }

    add(element, animation) {
      if (!this.queues.has(element)) {
        this.queues.set(element, []);
      }
      this.queues.get(element).push(animation);
      
      if (this.queues.get(element).length === 1) {
        this.process(element);
      }
    }

    process(element) {
      const queue = this.queues.get(element);
      if (!queue || queue.length === 0) return;

      const animation = queue[0];
      animation().then(() => {
        queue.shift();
        if (queue.length > 0) {
          this.process(element);
        }
      }).catch(() => {
        queue.shift();
        if (queue.length > 0) {
          this.process(element);
        }
      });
    }

    clear(element) {
      if (this.queues.has(element)) {
        this.queues.set(element, []);
      }
    }

    isEmpty(element) {
      const queue = this.queues.get(element);
      return !queue || queue.length === 0;
    }
  }

  // Global animation queue
  const animationQueue = new AnimationQueue();

  /**
   * Utility functions
   */
  function parseConfig(options = {}) {
    const config = { ...DEFAULT_CONFIG, ...options };
    
    // Normalize easing
    if (typeof config.easing === 'string' && EASING_FUNCTIONS[config.easing]) {
      config.easing = EASING_FUNCTIONS[config.easing];
    }
    
    return config;
  }

  function getComputedStyleValue(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  function setElementStyle(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  }

  function removeElementStyles(element, properties) {
    properties.forEach(property => {
      element.style.removeProperty(property);
    });
  }

  function createTransition(element, properties, config) {
    const transitionValue = properties.map(prop => 
      `${prop} ${config.duration}ms ${config.easing} ${config.delay}ms`
    ).join(', ');
    
    if (BROWSER_SUPPORT.transitions) {
      element.style[BROWSER_SUPPORT.transitions.property] = transitionValue;
    }
  }

  function waitForTransition(element, config) {
    return new Promise((resolve) => {
      if (!BROWSER_SUPPORT.transitions) {
        // Fallback for browsers without transition support
        setTimeout(resolve, config.duration + config.delay);
        return;
      }

      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      }, config.duration + config.delay + 50); // Add small buffer

      const cleanup = () => {
        element.removeEventListener(BROWSER_SUPPORT.transitions.event, onTransitionEnd);
        clearTimeout(timeout);
      };

      const onTransitionEnd = (event) => {
        if (event.target === element && !resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      };

      element.addEventListener(BROWSER_SUPPORT.transitions.event, onTransitionEnd);
    });
  }

  function cleanupAnimation(element, config, propertiesToClean = []) {
    if (config.cleanup) {
      // Remove transition property
      if (BROWSER_SUPPORT.transitions) {
        element.style.removeProperty(BROWSER_SUPPORT.transitions.property);
      }
      
      // Remove specified properties
      removeElementStyles(element, propertiesToClean);
    }
  }

  /**
   * Core animation functions
   */
  async function fadeIn(element, options = {}) {
    const config = parseConfig(options);
    
    return new Promise(async (resolve, reject) => {
      try {
        // Store original values
        const originalDisplay = getComputedStyleValue(element, 'display');
        const originalOpacity = getComputedStyleValue(element, 'opacity');
        
        // Set initial state
        if (originalDisplay === 'none') {
          element.style.display = 'block';
        }
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        // Setup transition
        createTransition(element, ['opacity'], config);
        
        // Start animation
        element.style.opacity = '1';
        
        // Wait for completion
        await waitForTransition(element, config);
        
        // Cleanup
        cleanupAnimation(element, config, ['opacity']);
        
        // Call callback
        if (typeof config.onComplete === 'function') {
          config.onComplete(element);
        }
        
        resolve(element);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function fadeOut(element, options = {}) {
    const config = parseConfig(options);
    
    return new Promise(async (resolve, reject) => {
      try {
        // Store original values
        const originalOpacity = getComputedStyleValue(element, 'opacity');
        
        // Setup transition
        createTransition(element, ['opacity'], config);
        
        // Start animation
        element.style.opacity = '0';
        
        // Wait for completion
        await waitForTransition(element, config);
        
        // Hide element if requested
        if (config.hide !== false) {
          element.style.display = 'none';
        }
        
        // Cleanup
        cleanupAnimation(element, config, config.hide !== false ? ['opacity'] : []);
        
        // Call callback
        if (typeof config.onComplete === 'function') {
          config.onComplete(element);
        }
        
        resolve(element);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function slideUp(element, options = {}) {
    const config = parseConfig(options);
    
    return new Promise(async (resolve, reject) => {
      try {
        // Store original values
        const originalHeight = element.offsetHeight;
        const originalPaddingTop = getComputedStyleValue(element, 'padding-top');
        const originalPaddingBottom = getComputedStyleValue(element, 'padding-bottom');
        const originalMarginTop = getComputedStyleValue(element, 'margin-top');
        const originalMarginBottom = getComputedStyleValue(element, 'margin-bottom');
        const originalOverflow = getComputedStyleValue(element, 'overflow');
        
        // Set initial state
        setElementStyle(element, {
          height: originalHeight + 'px',
          paddingTop: originalPaddingTop,
          paddingBottom: originalPaddingBottom,
          marginTop: originalMarginTop,
          marginBottom: originalMarginBottom,
          overflow: 'hidden'
        });
        
        // Force reflow
        element.offsetHeight;
        
        // Setup transition
        createTransition(element, ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'], config);
        
        // Start animation
        setElementStyle(element, {
          height: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '0px',
          marginBottom: '0px'
        });
        
        // Wait for completion
        await waitForTransition(element, config);
        
        // Hide element
        element.style.display = 'none';
        
        // Cleanup
        cleanupAnimation(element, config, [
          'height', 'padding-top', 'padding-bottom', 
          'margin-top', 'margin-bottom', 'overflow'
        ]);
        
        // Call callback
        if (typeof config.onComplete === 'function') {
          config.onComplete(element);
        }
        
        resolve(element);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function slideDown(element, options = {}) {
    const config = parseConfig(options);
    
    return new Promise(async (resolve, reject) => {
      try {
        // Show element to measure dimensions
        const originalDisplay = getComputedStyleValue(element, 'display');
        if (originalDisplay === 'none') {
          element.style.display = 'block';
        }
        
        // Measure target dimensions
        const targetHeight = element.offsetHeight;
        const targetPaddingTop = getComputedStyleValue(element, 'padding-top');
        const targetPaddingBottom = getComputedStyleValue(element, 'padding-bottom');
        const targetMarginTop = getComputedStyleValue(element, 'margin-top');
        const targetMarginBottom = getComputedStyleValue(element, 'margin-bottom');
        
        // Set initial collapsed state
        setElementStyle(element, {
          height: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '0px',
          marginBottom: '0px',
          overflow: 'hidden'
        });
        
        // Force reflow
        element.offsetHeight;
        
        // Setup transition
        createTransition(element, ['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'], config);
        
        // Start animation
        setElementStyle(element, {
          height: targetHeight + 'px',
          paddingTop: targetPaddingTop,
          paddingBottom: targetPaddingBottom,
          marginTop: targetMarginTop,
          marginBottom: targetMarginBottom
        });
        
        // Wait for completion
        await waitForTransition(element, config);
        
        // Cleanup
        cleanupAnimation(element, config, [
          'height', 'padding-top', 'padding-bottom', 
          'margin-top', 'margin-bottom', 'overflow'
        ]);
        
        // Call callback
        if (typeof config.onComplete === 'function') {
          config.onComplete(element);
        }
        
        resolve(element);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function slideToggle(element, options = {}) {
    const config = parseConfig(options);
    const isVisible = getComputedStyleValue(element, 'display') !== 'none' && element.offsetHeight > 0;
    
    if (isVisible) {
      return slideUp(element, config);
    } else {
      return slideDown(element, config);
    }
  }

  async function transform(element, transformations, options = {}) {
    const config = parseConfig(options);
    
    return new Promise(async (resolve, reject) => {
      try {
        if (!BROWSER_SUPPORT.transforms) {
          // Fallback for browsers without transform support
          console.warn('[DOM Helpers Animation] Transform not supported in this browser');
          setTimeout(() => resolve(element), config.duration + config.delay);
          return;
        }
        
        // Build transform string
        let transformString = '';
        Object.entries(transformations).forEach(([property, value]) => {
          switch (property) {
            case 'translateX':
            case 'translateY':
            case 'translateZ':
              transformString += `${property}(${value}) `;
              break;
            case 'translate':
              if (Array.isArray(value)) {
                transformString += `translate(${value[0]}, ${value[1]}) `;
              } else {
                transformString += `translate(${value}) `;
              }
              break;
            case 'translate3d':
              if (Array.isArray(value) && value.length >= 3) {
                transformString += `translate3d(${value[0]}, ${value[1]}, ${value[2]}) `;
              }
              break;
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'scaleZ':
              transformString += `${property}(${value}) `;
              break;
            case 'rotate':
            case 'rotateX':
            case 'rotateY':
            case 'rotateZ':
              transformString += `${property}(${value}) `;
              break;
            case 'skew':
            case 'skewX':
            case 'skewY':
              transformString += `${property}(${value}) `;
              break;
            default:
              console.warn(`[DOM Helpers Animation] Unknown transform property: ${property}`);
          }
        });
        
        // Setup transition
        createTransition(element, [BROWSER_SUPPORT.transforms], config);
        
        // Apply transform
        element.style[BROWSER_SUPPORT.transforms] = transformString.trim();
        
        // Wait for completion
        await waitForTransition(element, config);
        
        // Cleanup
        if (config.cleanup) {
          cleanupAnimation(element, config, [BROWSER_SUPPORT.transforms]);
        }
        
        // Call callback
        if (typeof config.onComplete === 'function') {
          config.onComplete(element);
        }
        
        resolve(element);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Animation chaining system
   */
  class AnimationChain {
    constructor(element) {
      this.element = element;
      this.animations = [];
    }

    fadeIn(options = {}) {
      this.animations.push(() => fadeIn(this.element, options));
      return this;
    }

    fadeOut(options = {}) {
      this.animations.push(() => fadeOut(this.element, options));
      return this;
    }

    slideUp(options = {}) {
      this.animations.push(() => slideUp(this.element, options));
      return this;
    }

    slideDown(options = {}) {
      this.animations.push(() => slideDown(this.element, options));
      return this;
    }

    slideToggle(options = {}) {
      this.animations.push(() => slideToggle(this.element, options));
      return this;
    }

    transform(transformations, options = {}) {
      this.animations.push(() => transform(this.element, transformations, options));
      return this;
    }

    delay(ms) {
      this.animations.push(() => new Promise(resolve => setTimeout(resolve, ms)));
      return this;
    }

    then(callback) {
      this.animations.push(() => {
        if (typeof callback === 'function') {
          return Promise.resolve(callback(this.element));
        }
        return Promise.resolve();
      });
      return this;
    }

    async play() {
      try {
        for (const animation of this.animations) {
          await animation();
        }
        return this.element;
      } catch (error) {
        console.error('[DOM Helpers Animation] Chain execution failed:', error);
        throw error;
      }
    }
  }

  /**
   * Enhanced element with animation methods
   */
  function enhanceElementWithAnimation(element) {
    if (!element || element._hasAnimationMethods) {
      return element;
    }

    // Protect against double enhancement
    Object.defineProperty(element, '_hasAnimationMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add animation methods
    element.fadeIn = function(options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => fadeIn(element, options).then(resolve));
        });
      }
      return fadeIn(element, options);
    };

    element.fadeOut = function(options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => fadeOut(element, options).then(resolve));
        });
      }
      return fadeOut(element, options);
    };

    element.slideUp = function(options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => slideUp(element, options).then(resolve));
        });
      }
      return slideUp(element, options);
    };

    element.slideDown = function(options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => slideDown(element, options).then(resolve));
        });
      }
      return slideDown(element, options);
    };

    element.slideToggle = function(options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => slideToggle(element, options).then(resolve));
        });
      }
      return slideToggle(element, options);
    };

    element.transform = function(transformations, options = {}) {
      const config = parseConfig(options);
      if (config.queue && !animationQueue.isEmpty(element)) {
        return new Promise((resolve) => {
          animationQueue.add(element, () => transform(element, transformations, options).then(resolve));
        });
      }
      return transform(element, transformations, options);
    };

    // Animation chaining
    element.animate = function() {
      return new AnimationChain(element);
    };

    // Stop all animations
    element.stopAnimations = function() {
      animationQueue.clear(element);
      
      // Remove any transition properties
      if (BROWSER_SUPPORT.transitions) {
        element.style.removeProperty(BROWSER_SUPPORT.transitions.property);
      }
      
      return element;
    };

    return element;
  }

  /**
   * Enhanced collection with animation methods
   */
  function enhanceCollectionWithAnimation(collection) {
    if (!collection || collection._hasAnimationMethods) {
      return collection;
    }

    // Protect against double enhancement
    Object.defineProperty(collection, '_hasAnimationMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Helper function to apply animation to all elements in collection
    function applyToCollection(animationFn, options = {}) {
      const elements = collection._originalCollection || collection._originalNodeList || collection;
      const promises = Array.from(elements).map((element, index) => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          // Add stagger delay if specified
          const elementOptions = { ...options };
          if (options.stagger && index > 0) {
            elementOptions.delay = (elementOptions.delay || 0) + (options.stagger * index);
          }
          
          // Enhance element if not already enhanced
          if (!element._hasAnimationMethods) {
            enhanceElementWithAnimation(element);
          }
          
          return animationFn(element, elementOptions);
        }
        return Promise.resolve();
      });
      
      return Promise.all(promises).then(() => collection);
    }

    // Add animation methods to collection
    collection.fadeIn = function(options = {}) {
      return applyToCollection(fadeIn, options);
    };

    collection.fadeOut = function(options = {}) {
      return applyToCollection(fadeOut, options);
    };

    collection.slideUp = function(options = {}) {
      return applyToCollection(slideUp, options);
    };

    collection.slideDown = function(options = {}) {
      return applyToCollection(slideDown, options);
    };

    collection.slideToggle = function(options = {}) {
      return applyToCollection(slideToggle, options);
    };

    collection.transform = function(transformations, options = {}) {
      return applyToCollection((el, opts) => transform(el, transformations, opts), options);
    };

    collection.stopAnimations = function() {
      const elements = collection._originalCollection || collection._originalNodeList || collection;
      Array.from(elements).forEach(element => {
        if (element && element.nodeType === Node.ELEMENT_NODE) {
          animationQueue.clear(element);
          if (BROWSER_SUPPORT.transitions) {
            element.style.removeProperty(BROWSER_SUPPORT.transitions.property);
          }
        }
      });
      return collection;
    };

    return collection;
  }

  /**
   * Enhanced update method that handles animation operations
   */
  function createAnimationUpdateMethod(originalUpdate, isCollection = false) {
    return function animationUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Helpers Animation] .update() called with invalid updates object');
        return isCollection ? this : this;
      }

      // Handle animation-specific updates first
      const animationUpdates = { ...updates };
      const promises = [];

      // Handle fadeIn
      if (animationUpdates.fadeIn !== undefined) {
        const options = animationUpdates.fadeIn === true ? {} : animationUpdates.fadeIn;
        if (isCollection) {
          promises.push(this.fadeIn(options));
        } else {
          promises.push(this.fadeIn(options));
        }
        delete animationUpdates.fadeIn;
      }

      // Handle fadeOut
      if (animationUpdates.fadeOut !== undefined) {
        const options = animationUpdates.fadeOut === true ? {} : animationUpdates.fadeOut;
        if (isCollection) {
          promises.push(this.fadeOut(options));
        } else {
          promises.push(this.fadeOut(options));
        }
        delete animationUpdates.fadeOut;
      }

      // Handle slideUp
      if (animationUpdates.slideUp !== undefined) {
        const options = animationUpdates.slideUp === true ? {} : animationUpdates.slideUp;
        if (isCollection) {
          promises.push(this.slideUp(options));
        } else {
          promises.push(this.slideUp(options));
        }
        delete animationUpdates.slideUp;
      }

      // Handle slideDown
      if (animationUpdates.slideDown !== undefined) {
        const options = animationUpdates.slideDown === true ? {} : animationUpdates.slideDown;
        if (isCollection) {
          promises.push(this.slideDown(options));
        } else {
          promises.push(this.slideDown(options));
        }
        delete animationUpdates.slideDown;
      }

      // Handle slideToggle
      if (animationUpdates.slideToggle !== undefined) {
        const options = animationUpdates.slideToggle === true ? {} : animationUpdates.slideToggle;
        if (isCollection) {
          promises.push(this.slideToggle(options));
        } else {
          promises.push(this.slideToggle(options));
        }
        delete animationUpdates.slideToggle;
      }

      // Handle transform
      if (animationUpdates.transform !== undefined) {
        const { transformations, options = {} } = animationUpdates.transform;
        if (transformations) {
          if (isCollection) {
            promises.push(this.transform(transformations, options));
          } else {
            promises.push(this.transform(transformations, options));
          }
        }
        delete animationUpdates.transform;
      }

      // Handle stopAnimations
      if (animationUpdates.stopAnimations) {
        this.stopAnimations();
        delete animationUpdates.stopAnimations;
      }

      // Handle remaining updates with original update method
      let result = this;
      if (Object.keys(animationUpdates).length > 0 && originalUpdate) {
        result = originalUpdate.call(this, animationUpdates);
      }

      // If there were animations, return a promise that resolves when all animations complete
      if (promises.length > 0) {
        return Promise.all(promises).then(() => result);
      }

      return result;
    };
  }

  /**
   * Main integration function
   */
  function integrateWithDOMHelpers() {
    // Enhance Elements helper
    if (global.Elements && global.Elements.helper) {
      const originalEnhanceElement = global.Elements.helper._enhanceElementWithUpdate;
      if (originalEnhanceElement) {
        global.Elements.helper._enhanceElementWithUpdate = function(element) {
          element = originalEnhanceElement.call(this, element);
          element = enhanceElementWithAnimation(element);
          
          // Replace update method with animation-aware version
          if (element.update) {
            const originalUpdate = element.update;
            element.update = createAnimationUpdateMethod(originalUpdate, false);
          }
          
          return element;
        };
      }

      // Also enhance the proxy getter to ensure all elements get animation methods
      const originalProxy = global.Elements;
      if (originalProxy && typeof originalProxy === 'object') {
        // Wrap the Elements proxy to auto-enhance elements
        const ElementsHandler = {
          get: function(target, prop) {
            const element = target[prop];
            if (element && element.nodeType === Node.ELEMENT_NODE && !element._hasAnimationMethods) {
              return enhanceElementWithAnimation(element);
            }
            return element;
          }
        };
        
        // Try to enhance existing Elements proxy behavior
        try {
          if (global.Elements.helper && global.Elements.helper._getElement) {
            const originalGetElement = global.Elements.helper._getElement;
            global.Elements.helper._getElement = function(prop) {
              const element = originalGetElement.call(this, prop);
              if (element && element.nodeType === Node.ELEMENT_NODE && !element._hasAnimationMethods) {
                return enhanceElementWithAnimation(element);
              }
              return element;
            };
          }
        } catch (error) {
          console.warn('[DOM Helpers Animation] Could not enhance Elements proxy:', error.message);
        }
      }
    }

    // Enhance Collections helper
    if (global.Collections && global.Collections.helper) {
      const originalEnhanceCollection = global.Collections.helper._enhanceCollectionWithUpdate;
      if (originalEnhanceCollection) {
        global.Collections.helper._enhanceCollectionWithUpdate = function(collection) {
          collection = originalEnhanceCollection.call(this, collection);
          collection = enhanceCollectionWithAnimation(collection);
          
          // Replace update method with animation-aware version
          if (collection.update) {
            const originalUpdate = collection.update;
            collection.update = createAnimationUpdateMethod(originalUpdate, true);
          }
          
          return collection;
        };
      }
    }

    // Enhance Selector helper
    if (global.Selector && global.Selector.helper) {
      const originalEnhanceElement = global.Selector.helper._enhanceElementWithUpdate;
      if (originalEnhanceElement) {
        global.Selector.helper._enhanceElementWithUpdate = function(element) {
          element = originalEnhanceElement.call(this, element);
          element = enhanceElementWithAnimation(element);
          
          // Replace update method with animation-aware version
          if (element.update) {
            const originalUpdate = element.update;
            element.update = createAnimationUpdateMethod(originalUpdate, false);
          }
          
          return element;
        };
      }

      const originalEnhanceCollection = global.Selector.helper._enhanceCollectionWithUpdate;
      if (originalEnhanceCollection) {
        global.Selector.helper._enhanceCollectionWithUpdate = function(collection) {
          collection = originalEnhanceCollection.call(this, collection);
          collection = enhanceCollectionWithAnimation(collection);
          
          // Replace update method with animation-aware version
          if (collection.update) {
            const originalUpdate = collection.update;
            collection.update = createAnimationUpdateMethod(originalUpdate, true);
          }
          
          return collection;
        };
      }
    }

    // Enhance Forms helper if available
    if (global.Forms && global.Forms.helper) {
      const originalEnhanceForm = global.Forms.helper._enhanceForm;
      if (originalEnhanceForm) {
        global.Forms.helper._enhanceForm = function(form) {
          form = originalEnhanceForm.call(this, form);
          form = enhanceElementWithAnimation(form);
          
          // Replace update method with animation-aware version
          if (form.update) {
            const originalUpdate = form.update;
            form.update = createAnimationUpdateMethod(originalUpdate, false);
          }
          
          return form;
        };
      }
    }
  }

  /**
   * Animation utilities for standalone use
   */
  const Animation = {
    // Core animation functions
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    slideUp: slideUp,
    slideDown: slideDown,
    slideToggle: slideToggle,
    transform: transform,

    // Configuration
    setDefaults: function(config) {
      Object.assign(DEFAULT_CONFIG, config);
      return this;
    },

    getDefaults: function() {
      return { ...DEFAULT_CONFIG };
    },

    // Browser support detection
    isSupported: function(feature) {
      switch (feature) {
        case 'transitions':
          return !!BROWSER_SUPPORT.transitions;
        case 'transforms':
          return !!BROWSER_SUPPORT.transforms;
        default:
          return false;
      }
    },

    // Queue management
    clearQueue: function(element) {
      animationQueue.clear(element);
      return this;
    },

    // Enhance elements manually
    enhance: function(element) {
      if (element && element.nodeType === Node.ELEMENT_NODE) {
        return enhanceElementWithAnimation(element);
      } else if (element && (element.length !== undefined || element._originalCollection || element._originalNodeList)) {
        return enhanceCollectionWithAnimation(element);
      }
      return element;
    },

    // Create animation chain
    chain: function(element) {
      return new AnimationChain(element);
    },

    // Easing functions
    easing: EASING_FUNCTIONS,

    // Version
    version: '1.0.0'
  };

  // Auto-integrate with DOM Helpers if available
  if (typeof global.Elements !== 'undefined' || typeof global.Collections !== 'undefined' || typeof global.Selector !== 'undefined') {
    integrateWithDOMHelpers();
    console.log('[DOM Helpers Animation] Animation module integrated successfully');
  } else {
    console.log('[DOM Helpers Animation] Animation module loaded in standalone mode');
  }

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Animation };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Animation };
    });
  } else {
    // Browser globals
    global.Animation = Animation;
  }

  // Add Animation to the main DOMHelpers object if it exists
  if (global.DOMHelpers) {
    global.DOMHelpers.Animation = Animation;
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

/**
 * DOM Helpers - Form Module
 * Specialized form handling utilities that integrate with the main DOM Helpers library
 * 
 * Features:
 * - Forms object for accessing forms by ID
 * - Automatic form value extraction and setting
 * - Declarative form handling with .update() method
 * - Seamless integration with Elements, Collections, and Selector
 * - Enhanced form validation and submission handling
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if main DOM Helpers library is loaded
  if (typeof global.Elements === 'undefined' && typeof Elements === 'undefined') {
    console.warn('[DOM Helpers Form] Main DOM Helpers library must be loaded before the Form module');
    return;
  }

  /**
   * Enhanced form element wrapper that adds form-specific functionality
   */
  function enhanceFormWithFormMethods(form) {
    if (!form || form._hasFormMethods) {
      return form;
    }

    // Protect against double enhancement
    Object.defineProperty(form, '_hasFormMethods', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    // Add values getter/setter
    Object.defineProperty(form, 'values', {
      get: function() {
        return getFormValues(form);
      },
      set: function(values) {
        setFormValues(form, values);
      },
      enumerable: true,
      configurable: true
    });

    // Add enhanced reset method
    const originalReset = form.reset;
    form.reset = function(options = {}) {
      if (options.clearCustom !== false) {
        // Clear any custom validation messages
        clearFormValidation(form);
      }
      
      // Call original reset
      originalReset.call(form);
      
      // Trigger custom reset event
      form.dispatchEvent(new CustomEvent('formreset', { 
        detail: { form: form },
        bubbles: true 
      }));
      
      return form;
    };

    // Add validation methods
    form.validate = function(rules = {}) {
      return validateForm(form, rules);
    };

    form.clearValidation = function() {
      clearFormValidation(form);
      return form;
    };

    // Add submission helper
    form.submitData = function(options = {}) {
      return submitFormData(form, options);
    };

    // Add field access helpers
    form.getField = function(name) {
      return getFormField(form, name);
    };

    form.setField = function(name, value) {
      setFormField(form, name, value);
      return form;
    };

    // Add serialization methods
    form.serialize = function(format = 'object') {
      return serializeForm(form, format);
    };

    return form;
  }

  /**
   * Get all form values as an object
   */
  function getFormValues(form) {
    const values = {};
    const formData = new FormData(form);
    
    // Handle regular form fields
    for (const [name, value] of formData.entries()) {
      if (values[name]) {
        // Handle multiple values (checkboxes, multi-select)
        if (Array.isArray(values[name])) {
          values[name].push(value);
        } else {
          values[name] = [values[name], value];
        }
      } else {
        values[name] = value;
      }
    }

    // Handle unchecked checkboxes and radio buttons
    const inputs = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    inputs.forEach(input => {
      if (!input.checked && input.name && !values.hasOwnProperty(input.name)) {
        if (input.type === 'checkbox') {
          values[input.name] = false;
        }
        // Radio buttons without selection are omitted
      }
    });

    return values;
  }

  /**
   * Set form values from an object
   */
  function setFormValues(form, values) {
    if (!values || typeof values !== 'object') {
      console.warn('[DOM Helpers Form] Invalid values object provided to setFormValues');
      return;
    }

    Object.entries(values).forEach(([name, value]) => {
      setFormField(form, name, value);
    });
  }

  /**
   * Get a specific form field
   */
  function getFormField(form, name) {
    // Try by name first
    let field = form.querySelector(`[name="${name}"]`);
    
    // Try by id if name doesn't work
    if (!field) {
      field = form.querySelector(`#${name}`);
    }
    
    return field;
  }

  /**
   * Set a specific form field value
   */
  function setFormField(form, name, value) {
    const fields = form.querySelectorAll(`[name="${name}"]`);
    
    if (fields.length === 0) {
      // Try by ID if name doesn't work
      const field = form.querySelector(`#${name}`);
      if (field) {
        setFieldValue(field, value);
      }
      return;
    }

    if (fields.length === 1) {
      setFieldValue(fields[0], value);
    } else {
      // Handle multiple fields (radio buttons, checkboxes)
      fields.forEach(field => {
        if (field.type === 'radio') {
          field.checked = field.value === String(value);
        } else if (field.type === 'checkbox') {
          if (Array.isArray(value)) {
            field.checked = value.includes(field.value);
          } else {
            field.checked = Boolean(value);
          }
        } else {
          setFieldValue(field, value);
        }
      });
    }
  }

  /**
   * Set individual field value based on field type
   */
  function setFieldValue(field, value) {
    if (!field) return;

    switch (field.type) {
      case 'checkbox':
        field.checked = Boolean(value);
        break;
      case 'radio':
        field.checked = field.value === String(value);
        break;
      case 'file':
        // File inputs can't be set programmatically for security reasons
        console.warn('[DOM Helpers Form] Cannot set file input values programmatically');
        break;
      case 'select-multiple':
        if (Array.isArray(value)) {
          Array.from(field.options).forEach(option => {
            option.selected = value.includes(option.value);
          });
        }
        break;
      default:
        field.value = value;
        break;
    }

    // Trigger change event
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Validate form with optional rules
   */
  function validateForm(form, rules = {}) {
    const errors = {};
    const values = getFormValues(form);

    // Clear previous validation
    clearFormValidation(form);

    // Built-in HTML5 validation
    const isValid = form.checkValidity();
    if (!isValid) {
      const invalidFields = form.querySelectorAll(':invalid');
      invalidFields.forEach(field => {
        if (field.name) {
          errors[field.name] = field.validationMessage || 'Invalid value';
          markFieldInvalid(field, errors[field.name]);
        }
      });
    }

    // Custom validation rules
    Object.entries(rules).forEach(([fieldName, rule]) => {
      const value = values[fieldName];
      const field = getFormField(form, fieldName);

      if (typeof rule === 'function') {
        const result = rule(value, values, field);
        if (result !== true && result !== undefined) {
          errors[fieldName] = result || 'Invalid value';
          if (field) markFieldInvalid(field, errors[fieldName]);
        }
      } else if (typeof rule === 'object') {
        // Rule object with multiple validators
        Object.entries(rule).forEach(([ruleName, ruleValue]) => {
          if (errors[fieldName]) return; // Skip if already invalid

          let isInvalid = false;
          let message = '';

          switch (ruleName) {
            case 'required':
              if (ruleValue && (!value || (typeof value === 'string' && value.trim() === ''))) {
                isInvalid = true;
                message = 'This field is required';
              }
              break;
            case 'minLength':
              if (value && value.length < ruleValue) {
                isInvalid = true;
                message = `Minimum length is ${ruleValue} characters`;
              }
              break;
            case 'maxLength':
              if (value && value.length > ruleValue) {
                isInvalid = true;
                message = `Maximum length is ${ruleValue} characters`;
              }
              break;
            case 'pattern':
              if (value && !new RegExp(ruleValue).test(value)) {
                isInvalid = true;
                message = 'Invalid format';
              }
              break;
            case 'email':
              if (ruleValue && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isInvalid = true;
                message = 'Invalid email address';
              }
              break;
            case 'custom':
              if (typeof ruleValue === 'function') {
                const result = ruleValue(value, values, field);
                if (result !== true && result !== undefined) {
                  isInvalid = true;
                  message = result || 'Invalid value';
                }
              }
              break;
          }

          if (isInvalid) {
            errors[fieldName] = message;
            if (field) markFieldInvalid(field, message);
          }
        });
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors,
      values: values
    };
  }

  /**
   * Mark field as invalid with error message
   */
  function markFieldInvalid(field, message) {
    field.classList.add('form-invalid');
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message element
    let errorElement = field.parentNode.querySelector('.form-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875em';
      errorElement.style.marginTop = '0.25rem';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * Clear form validation messages
   */
  function clearFormValidation(form) {
    // Remove invalid classes and attributes
    const invalidFields = form.querySelectorAll('.form-invalid');
    invalidFields.forEach(field => {
      field.classList.remove('form-invalid');
      field.removeAttribute('aria-invalid');
    });

    // Remove error messages
    const errorMessages = form.querySelectorAll('.form-error-message');
    errorMessages.forEach(msg => msg.remove());
  }

  /**
   * Submit form data with enhanced options
   */
  async function submitFormData(form, options = {}) {
    const {
      url = form.action || window.location.href,
      method = form.method || 'POST',
      validate = true,
      validationRules = {},
      beforeSubmit = null,
      onSuccess = null,
      onError = null,
      transform = null
    } = options;

    try {
      // Validate if requested
      if (validate) {
        const validation = validateForm(form, validationRules);
        if (!validation.isValid) {
          if (onError) onError(new Error('Validation failed'), validation.errors);
          return { success: false, errors: validation.errors };
        }
      }

      // Get form data
      let data = getFormValues(form);

      // Transform data if function provided
      if (typeof transform === 'function') {
        data = transform(data);
      }

      // Call beforeSubmit hook
      if (typeof beforeSubmit === 'function') {
        const shouldContinue = await beforeSubmit(data, form);
        if (shouldContinue === false) {
          return { success: false, cancelled: true };
        }
      }

      // Prepare request
      const requestOptions = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (method.toUpperCase() !== 'GET') {
        requestOptions.body = JSON.stringify(data);
      }

      // Make request
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (response.ok) {
        if (onSuccess) onSuccess(result, data);
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (error) {
      if (onError) onError(error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Serialize form data in different formats
   */
  function serializeForm(form, format = 'object') {
    const values = getFormValues(form);

    switch (format) {
      case 'json':
        return JSON.stringify(values);
      case 'formdata':
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
        return formData;
      case 'urlencoded':
        return new URLSearchParams(values).toString();
      case 'object':
      default:
        return values;
    }
  }

  /**
   * Enhanced form update method that handles form-specific operations
   */
  function createFormUpdateMethod(form) {
    const originalUpdate = form.update;

    return function formUpdate(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Helpers Form] .update() called with invalid updates object');
        return form;
      }

      // Handle form-specific updates first
      const formUpdates = { ...updates };
      
      // Handle values setting
      if (formUpdates.values) {
        setFormValues(form, formUpdates.values);
        delete formUpdates.values;
      }

      // Handle validation
      if (formUpdates.validate) {
        const rules = formUpdates.validate === true ? {} : formUpdates.validate;
        validateForm(form, rules);
        delete formUpdates.validate;
      }

      // Handle reset
      if (formUpdates.reset) {
        const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
        form.reset(resetOptions);
        delete formUpdates.reset;
      }

      // Handle submission
      if (formUpdates.submit) {
        const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
        form.submitData(submitOptions);
        delete formUpdates.submit;
      }

      // Handle remaining updates with original update method
      if (Object.keys(formUpdates).length > 0) {
        return originalUpdate.call(form, formUpdates);
      }

      return form;
    };
  }

  /**
   * Production Forms Helper Class
   */
  class ProductionFormsHelper {
    constructor(options = {}) {
      this.cache = new Map();
      this.options = {
        enableLogging: options.enableLogging ?? false,
        autoCleanup: options.autoCleanup ?? true,
        cleanupInterval: options.cleanupInterval ?? 30000,
        maxCacheSize: options.maxCacheSize ?? 500,
        autoValidation: options.autoValidation ?? false,
        ...options
      };

      this.stats = {
        hits: 0,
        misses: 0,
        cacheSize: 0,
        lastCleanup: Date.now()
      };

      this.cleanupTimer = null;
      this.isDestroyed = false;

      this._initProxy();
      this._initMutationObserver();
      this._scheduleCleanup();
    }

    _initProxy() {
      this.Forms = new Proxy(this, {
        get: (target, prop) => {
          // Handle internal methods and symbols
          if (typeof prop === 'symbol' || 
              prop.startsWith('_') || 
              typeof target[prop] === 'function') {
            return target[prop];
          }
          
          return target._getForm(prop);
        },
        
        has: (target, prop) => target._hasForm(prop),
        
        ownKeys: (target) => target._getKeys(),
        
        getOwnPropertyDescriptor: (target, prop) => {
          if (target._hasForm(prop)) {
            return { 
              enumerable: true, 
              configurable: true, 
              value: target._getForm(prop) 
            };
          }
          return undefined;
        }
      });
    }

    _getForm(prop) {
      if (typeof prop !== 'string') {
        this._warn(`Invalid form property type: ${typeof prop}`);
        return null;
      }

      // Check cache first
      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          this.stats.hits++;
          // Return cached form without re-enhancing to avoid circular references
          return form._isEnhancedForm ? form : this._enhanceForm(form);
        } else {
          this.cache.delete(prop);
        }
      }

      // Get form by ID
      const form = document.getElementById(prop);
      if (form && form.tagName.toLowerCase() === 'form') {
        // Check if already enhanced before adding to cache
        const enhancedForm = form._isEnhancedForm ? form : this._enhanceForm(form);
        this._addToCache(prop, enhancedForm);
        this.stats.misses++;
        return enhancedForm;
      }

      this.stats.misses++;
      if (this.options.enableLogging) {
        this._warn(`Form with id '${prop}' not found`);
      }
      return null;
    }

    _hasForm(prop) {
      if (typeof prop !== 'string') return false;
      
      if (this.cache.has(prop)) {
        const form = this.cache.get(prop);
        if (form && form.nodeType === Node.ELEMENT_NODE && document.contains(form)) {
          return true;
        }
        this.cache.delete(prop);
      }
      
      const form = document.getElementById(prop);
      return form && form.tagName.toLowerCase() === 'form';
    }

    _getKeys() {
      // Return all form IDs in the document
      const forms = document.querySelectorAll("form[id]");
      return Array.from(forms).map(form => form.id).filter(id => id);
    }

    _enhanceForm(form) {
      if (!form || form._isEnhancedForm) {
        return form;
      }

      // First enhance with standard DOM helpers functionality
      try {
        if (global.Elements && global.Elements.helper) {
          form = global.Elements.helper._enhanceElementWithUpdate(form);
        } else if (typeof Elements !== 'undefined' && Elements.helper) {
          form = Elements.helper._enhanceElementWithUpdate(form);
        }
      } catch (error) {
        console.warn('[DOM Helpers Form] Could not enhance with Elements helper:', error.message);
      }

      // Then add form-specific enhancements
      form = enhanceFormWithFormMethods(form);

      // Add or replace update method with form-aware version
      if (form.update) {
        // Replace existing update method with form-aware version
        form.update = createFormUpdateMethod(form);
      } else {
        // Create a basic update method if none exists
        form.update = function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[DOM Helpers Form] .update() called with invalid updates object');
            return form;
          }

          // Handle form-specific updates
          const formUpdates = { ...updates };
          
          // Handle values setting
          if (formUpdates.values) {
            setFormValues(form, formUpdates.values);
            delete formUpdates.values;
          }

          // Handle validation
          if (formUpdates.validate) {
            const rules = formUpdates.validate === true ? {} : formUpdates.validate;
            validateForm(form, rules);
            delete formUpdates.validate;
          }

          // Handle reset
          if (formUpdates.reset) {
            const resetOptions = formUpdates.reset === true ? {} : formUpdates.reset;
            form.reset(resetOptions);
            delete formUpdates.reset;
          }

          // Handle submission
          if (formUpdates.submit) {
            const submitOptions = formUpdates.submit === true ? {} : formUpdates.submit;
            form.submitData(submitOptions);
            delete formUpdates.submit;
          }

          // Handle addEventListener with enhanced functionality
          if (formUpdates.addEventListener) {
            if (typeof handleEnhancedEventListener === 'function') {
              handleEnhancedEventListener(form, formUpdates.addEventListener);
            } else {
              // Fallback to basic event handling
              if (typeof formUpdates.addEventListener === 'object') {
                Object.entries(formUpdates.addEventListener).forEach(([eventType, handler]) => {
                  if (typeof handler === 'function') {
                    form.addEventListener(eventType, handler);
                  }
                });
              }
            }
            delete formUpdates.addEventListener;
          }

          // Handle remaining basic DOM updates
          Object.entries(formUpdates).forEach(([key, value]) => {
            try {
              if (key in form) {
                form[key] = value;
              } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                form.setAttribute(key, value);
              }
            } catch (error) {
              console.warn(`[DOM Helpers Form] Could not set ${key}:`, error.message);
            }
          });

          return form;
        };
      }

      // Mark as enhanced
      Object.defineProperty(form, '_isEnhancedForm', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      return form;
    }

    _addToCache(id, form) {
      if (this.cache.size >= this.options.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(id, form);
      this.stats.cacheSize = this.cache.size;
    }

    _initMutationObserver() {
      this.observer = new MutationObserver((mutations) => {
        this._processMutations(mutations);
      });
      
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id'],
          attributeOldValue: true
        });
      } else {
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
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            addedIds.add(node.id);
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'form' && node.id) {
            removedIds.add(node.id);
          }
        });

        // Handle ID attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          const target = mutation.target;
          if (target.tagName.toLowerCase() === 'form') {
            const oldId = mutation.oldValue;
            const newId = target.id;
            
            if (oldId && oldId !== newId) {
              removedIds.add(oldId);
            }
            if (newId && newId !== oldId) {
              addedIds.add(newId);
            }
          }
        }
      });

      // Update cache
      addedIds.forEach(id => {
        const form = document.getElementById(id);
        if (form && form.tagName.toLowerCase() === 'form') {
          this._addToCache(id, form);
        }
      });

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

      const staleIds = [];

      for (const [id, form] of this.cache) {
        if (!form || 
            form.nodeType !== Node.ELEMENT_NODE || 
            !document.contains(form) ||
            form.id !== id ||
            form.tagName.toLowerCase() !== 'form') {
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

    _log(message) {
      if (this.options.enableLogging) {
        console.log(`[Forms] ${message}`);
      }
    }

    _warn(message) {
      if (this.options.enableLogging) {
        console.warn(`[Forms] ${message}`);
      }
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
      this._log('Forms helper destroyed');
    }

    // Utility methods
    getAllForms() {
      const forms = document.querySelectorAll('form[id]');
      return Array.from(forms).map(form => {
        // Don't re-enhance if already enhanced to avoid circular references
        if (form._isEnhancedForm) {
          return form;
        }
        return this._enhanceForm(form);
      });
    }

    validateAll(rules = {}) {
      const results = {};
      this.getAllForms().forEach(form => {
        if (form.id) {
          results[form.id] = form.validate(rules[form.id] || {});
        }
      });
      return results;
    }

    resetAll() {
      this.getAllForms().forEach(form => form.reset());
    }
  }

  // Auto-initialize with sensible defaults
  const FormsHelper = new ProductionFormsHelper({
    enableLogging: false,
    autoCleanup: true,
    cleanupInterval: 30000,
    maxCacheSize: 500
  });

  // Global API - Clean and intuitive
  const Forms = FormsHelper.Forms;

  // Additional utilities
  Forms.helper = FormsHelper;
  Forms.stats = () => FormsHelper.getStats();
  Forms.clear = () => FormsHelper.clearCache();
  Forms.destroy = () => FormsHelper.destroy();
  Forms.getAllForms = () => FormsHelper.getAllForms();
  Forms.validateAll = (rules) => FormsHelper.validateAll(rules);
  Forms.resetAll = () => FormsHelper.resetAll();
  Forms.configure = (options) => {
    Object.assign(FormsHelper.options, options);
    return Forms;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Forms, ProductionFormsHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Forms, ProductionFormsHelper };
    });
  } else {
    // Browser globals
    global.Forms = Forms;
    global.ProductionFormsHelper = ProductionFormsHelper;
  }

  // Auto-cleanup on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      FormsHelper.destroy();
    });
  }

  // Add Forms to the main DOMHelpers object if it exists
  if (global.DOMHelpers) {
    global.DOMHelpers.Forms = Forms;
    global.DOMHelpers.ProductionFormsHelper = ProductionFormsHelper;
  }

  console.log('[DOM Helpers Form] Form module loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

/**
 * DOM Helpers - Storage Module
 * Web Storage API utilities that integrate with the main DOM Helpers library
 * 
 * Features:
 * - Storage object for localStorage and sessionStorage
 * - Automatic JSON serialization/deserialization
 * - Expiry system for time-based storage
 * - Namespace support for organized storage
 * - Forms integration for auto-save/restore
 * - Dual API: shorthand (set/get) and vanilla-like (setItem/getItem)
 * - Seamless integration with Elements, Collections, Selector, and Forms
 * 
 * @version 1.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check if main DOM Helpers library is loaded
  if (typeof global.Elements === 'undefined' && typeof Elements === 'undefined') {
    console.warn('[DOM Helpers Storage] Main DOM Helpers library should be loaded before the Storage module for full integration');
  }

  /**
   * Storage utility functions
   */
  
  /**
   * Serialize value for storage
   */
  function serializeValue(value, options = {}) {
    const data = {
      value: value,
      type: typeof value,
      timestamp: Date.now()
    };

    // Add expiry if specified
    if (options.expires) {
      if (typeof options.expires === 'number') {
        // Expires is in seconds
        data.expires = Date.now() + (options.expires * 1000);
      } else if (options.expires instanceof Date) {
        data.expires = options.expires.getTime();
      }
    }

    return JSON.stringify(data);
  }

  /**
   * Deserialize value from storage
   */
  function deserializeValue(serialized) {
    if (!serialized) return null;

    try {
      const data = JSON.parse(serialized);
      
      // Check if expired
      if (data.expires && Date.now() > data.expires) {
        return null; // Expired
      }

      return data.value;
    } catch (error) {
      // Fallback for non-JSON values (legacy support)
      return serialized;
    }
  }

  /**
   * Check if a stored value is expired
   */
  function isExpired(serialized) {
    if (!serialized) return true;

    try {
      const data = JSON.parse(serialized);
      return data.expires && Date.now() > data.expires;
    } catch (error) {
      return false; // Non-JSON values don't expire
    }
  }

  /**
   * Storage Helper Class
   */
  class StorageHelper {
    constructor(storageType = 'localStorage', namespace = '') {
      this.storageType = storageType;
      this.namespace = namespace;
      this.storage = global[storageType];
      
      if (!this.storage) {
        console.warn(`[DOM Helpers Storage] ${storageType} is not available`);
        this.storage = {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          key: () => null,
          length: 0
        };
      }
    }

    /**
     * Get the full key with namespace
     */
    _getKey(key) {
      return this.namespace ? `${this.namespace}:${key}` : key;
    }

    /**
     * Remove namespace from key
     */
    _stripNamespace(key) {
      if (!this.namespace) return key;
      const prefix = `${this.namespace}:`;
      return key.startsWith(prefix) ? key.slice(prefix.length) : key;
    }

    /**
     * Set a value in storage
     */
    set(key, value, options = {}) {
      try {
        const fullKey = this._getKey(key);
        const serialized = serializeValue(value, options);
        this.storage.setItem(fullKey, serialized);
        return true;
      } catch (error) {
        console.warn(`[DOM Helpers Storage] Failed to set ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Get a value from storage
     */
    get(key, defaultValue = null) {
      try {
        const fullKey = this._getKey(key);
        const serialized = this.storage.getItem(fullKey);
        
        if (serialized === null) {
          return defaultValue;
        }

        // Check if expired and remove if so
        if (isExpired(serialized)) {
          this.storage.removeItem(fullKey);
          return defaultValue;
        }

        const value = deserializeValue(serialized);
        return value !== null ? value : defaultValue;
      } catch (error) {
        console.warn(`[DOM Helpers Storage] Failed to get ${key}:`, error.message);
        return defaultValue;
      }
    }

    /**
     * Remove a value from storage
     */
    remove(key) {
      try {
        const fullKey = this._getKey(key);
        this.storage.removeItem(fullKey);
        return true;
      } catch (error) {
        console.warn(`[DOM Helpers Storage] Failed to remove ${key}:`, error.message);
        return false;
      }
    }

    /**
     * Check if a key exists in storage
     */
    has(key) {
      try {
        const fullKey = this._getKey(key);
        const serialized = this.storage.getItem(fullKey);
        
        if (serialized === null) {
          return false;
        }

        // Check if expired
        if (isExpired(serialized)) {
          this.storage.removeItem(fullKey);
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    }

    /**
     * Get all keys (within namespace if set)
     */
    keys() {
      try {
        const keys = [];
        const prefix = this.namespace ? `${this.namespace}:` : '';
        
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && (!this.namespace || key.startsWith(prefix))) {
            // Check if expired and remove if so
            if (isExpired(this.storage.getItem(key))) {
              this.storage.removeItem(key);
              continue;
            }
            keys.push(this._stripNamespace(key));
          }
        }
        
        return keys;
      } catch (error) {
        console.warn('[DOM Helpers Storage] Failed to get keys:', error.message);
        return [];
      }
    }

    /**
     * Get all values (within namespace if set)
     */
    values() {
      try {
        const values = [];
        const keys = this.keys();
        
        keys.forEach(key => {
          const value = this.get(key);
          if (value !== null) {
            values.push(value);
          }
        });
        
        return values;
      } catch (error) {
        console.warn('[DOM Helpers Storage] Failed to get values:', error.message);
        return [];
      }
    }

    /**
     * Get all entries as key-value pairs
     */
    entries() {
      try {
        const entries = [];
        const keys = this.keys();
        
        keys.forEach(key => {
          const value = this.get(key);
          if (value !== null) {
            entries.push([key, value]);
          }
        });
        
        return entries;
      } catch (error) {
        console.warn('[DOM Helpers Storage] Failed to get entries:', error.message);
        return [];
      }
    }

    /**
     * Clear all storage (within namespace if set)
     */
    clear() {
      try {
        if (this.namespace) {
          // Clear only namespaced keys
          const keys = this.keys();
          keys.forEach(key => this.remove(key));
        } else {
          // Clear all storage
          this.storage.clear();
        }
        return true;
      } catch (error) {
        console.warn('[DOM Helpers Storage] Failed to clear storage:', error.message);
        return false;
      }
    }

    /**
     * Get storage size (number of items)
     */
    size() {
      return this.keys().length;
    }

    /**
     * Create a namespaced storage instance
     */
    namespace(name) {
      const namespacedName = this.namespace ? `${this.namespace}:${name}` : name;
      return new StorageHelper(this.storageType, namespacedName);
    }

    /**
     * Vanilla-like aliases
     */
    setItem(key, value, options) {
      return this.set(key, value, options);
    }

    getItem(key, defaultValue) {
      return this.get(key, defaultValue);
    }

    removeItem(key) {
      return this.remove(key);
    }

    /**
     * Bulk operations
     */
    setMultiple(obj, options = {}) {
      const results = {};
      Object.entries(obj).forEach(([key, value]) => {
        results[key] = this.set(key, value, options);
      });
      return results;
    }

    getMultiple(keys, defaultValue = null) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.get(key, defaultValue);
      });
      return results;
    }

    removeMultiple(keys) {
      const results = {};
      keys.forEach(key => {
        results[key] = this.remove(key);
      });
      return results;
    }

    /**
     * Advanced operations
     */
    increment(key, amount = 1) {
      const current = this.get(key, 0);
      const newValue = (typeof current === 'number' ? current : 0) + amount;
      this.set(key, newValue);
      return newValue;
    }

    decrement(key, amount = 1) {
      return this.increment(key, -amount);
    }

    toggle(key) {
      const current = this.get(key, false);
      const newValue = !current;
      this.set(key, newValue);
      return newValue;
    }

    /**
     * Cleanup expired items
     */
    cleanup() {
      try {
        let cleaned = 0;
        const prefix = this.namespace ? `${this.namespace}:` : '';
        
        for (let i = this.storage.length - 1; i >= 0; i--) {
          const key = this.storage.key(i);
          if (key && (!this.namespace || key.startsWith(prefix))) {
            if (isExpired(this.storage.getItem(key))) {
              this.storage.removeItem(key);
              cleaned++;
            }
          }
        }
        
        return cleaned;
      } catch (error) {
        console.warn('[DOM Helpers Storage] Failed to cleanup:', error.message);
        return 0;
      }
    }

    /**
     * Get statistics about storage usage
     */
    stats() {
      try {
        const keys = this.keys();
        const values = this.values();
        const totalSize = JSON.stringify(values).length;
        
        return {
          keys: keys.length,
          totalSize: totalSize,
          averageSize: keys.length > 0 ? Math.round(totalSize / keys.length) : 0,
          namespace: this.namespace || 'global',
          storageType: this.storageType
        };
      } catch (error) {
        return {
          keys: 0,
          totalSize: 0,
          averageSize: 0,
          namespace: this.namespace || 'global',
          storageType: this.storageType
        };
      }
    }
  }

  /**
   * Forms Integration
   */
  function addFormsIntegration() {
    // Only add if Forms is available
    if (typeof global.Forms === 'undefined' && typeof Forms === 'undefined') {
      console.log('[DOM Helpers Storage] Forms not available, skipping integration');
      return;
    }

    const FormsObject = global.Forms || Forms;

    // Check if Forms helper exists and has _getForm method
    if (!FormsObject.helper || typeof FormsObject.helper._getForm !== 'function') {
      console.warn('[DOM Helpers Storage] Forms helper not properly initialized, trying alternative approach');
      
      // Alternative approach: Try to enhance forms directly
      if (FormsObject && typeof FormsObject === 'object') {
        // Create a proxy to intercept form access
        const originalProxy = FormsObject;
        
        // Try to wrap the proxy getter
        try {
          const handler = {
            get: function(target, prop) {
              const form = Reflect.get(target, prop);
              if (form && form.tagName && form.tagName.toLowerCase() === 'form') {
                return enhanceFormWithStorageIntegration(form);
              }
              return form;
            }
          };
          
          // This won't work with existing proxy, so let's try a different approach
          console.log('[DOM Helpers Storage] Using direct form enhancement approach');
        } catch (error) {
          console.warn('[DOM Helpers Storage] Could not wrap Forms proxy:', error.message);
        }
      }
      return;
    }

    console.log('[DOM Helpers Storage] Adding Forms integration');

    // Add autoSave method to form objects
    const originalGetForm = FormsObject.helper._getForm.bind(FormsObject.helper);
    FormsObject.helper._getForm = function(prop) {
      const form = originalGetForm(prop);
      return enhanceFormWithStorageIntegration(form);
    };
  }

  /**
   * Enhance a form with storage integration methods
   */
  function enhanceFormWithStorageIntegration(form) {
    if (!form || form._hasStorageIntegration) {
      return form;
    }

    // Add storage integration methods
    form.autoSave = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        interval = 1000,
        events = ['input', 'change'],
        namespace = ''
      } = options;

      const storageHelper = namespace ? 
        Storage.namespace(namespace) : 
        (storage === 'sessionStorage' ? Storage.session : Storage);

      // Save current form values
      const saveValues = () => {
        const values = form.values;
        storageHelper.set(storageKey, values, options);
      };

      // Set up auto-save listeners
      events.forEach(eventType => {
        form.addEventListener(eventType, () => {
          clearTimeout(form._autoSaveTimeout);
          form._autoSaveTimeout = setTimeout(saveValues, interval);
        });
      });

      // Initial save
      saveValues();

      // Store reference for cleanup
      form._autoSaveKey = storageKey;
      form._autoSaveStorage = storageHelper;

      return form;
    };

    form.restore = function(storageKey, options = {}) {
      const {
        storage = 'localStorage',
        namespace = '',
        clearAfterRestore = false
      } = options;

      const storageHelper = namespace ? 
        Storage.namespace(namespace) : 
        (storage === 'sessionStorage' ? Storage.session : Storage);

      const savedValues = storageHelper.get(storageKey);
      
      if (savedValues) {
        form.values = savedValues;
        
        if (clearAfterRestore) {
          storageHelper.remove(storageKey);
        }
      }

      return form;
    };

    form.clearAutoSave = function() {
      if (form._autoSaveTimeout) {
        clearTimeout(form._autoSaveTimeout);
      }
      if (form._autoSaveKey && form._autoSaveStorage) {
        form._autoSaveStorage.remove(form._autoSaveKey);
      }
      return form;
    };

    // Mark as having storage integration
    Object.defineProperty(form, '_hasStorageIntegration', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    return form;
  }

  // Create storage instances
  const localStorage = new StorageHelper('localStorage');
  const sessionStorage = new StorageHelper('sessionStorage');

  // Main Storage object with localStorage as default
  const Storage = localStorage;

  // Add session storage
  Storage.session = sessionStorage;

  // Add utility methods to main Storage object
  Storage.local = localStorage;
  Storage.namespace = (name) => localStorage.namespace(name);
  Storage.cleanup = () => {
    const localCleaned = localStorage.cleanup();
    const sessionCleaned = sessionStorage.cleanup();
    return { local: localCleaned, session: sessionCleaned };
  };

  Storage.stats = () => ({
    local: localStorage.stats(),
    session: sessionStorage.stats()
  });

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    // Node.js/CommonJS
    module.exports = { Storage, StorageHelper };
  } else if (typeof define === 'function' && define.amd) {
    // AMD/RequireJS
    define([], function() {
      return { Storage, StorageHelper };
    });
  } else {
    // Browser globals
    global.Storage = Storage;
    global.StorageHelper = StorageHelper;
  }

  // Add Forms integration if available
  if (typeof document !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        addFormsIntegration();
        // Also try to enhance forms directly after a delay
        setTimeout(enhanceExistingForms, 100);
      });
    } else {
      // DOM is already ready
      setTimeout(function() {
        addFormsIntegration();
        enhanceExistingForms();
      }, 0);
    }
  }

  /**
   * Enhance existing forms directly
   */
  function enhanceExistingForms() {
    // Try to enhance forms directly by finding the actual DOM elements
    const forms = document.querySelectorAll('form[id]');
    forms.forEach(form => {
      if (!form._hasStorageIntegration) {
        console.log(`[DOM Helpers Storage] Enhancing DOM form ${form.id} directly`);
        enhanceFormWithStorageIntegration(form);
        
        // Now try to make sure the Forms proxy returns this enhanced form
        if (typeof global.Forms !== 'undefined' || typeof Forms !== 'undefined') {
          const FormsObject = global.Forms || Forms;
          
          // Try to intercept the proxy getter for this specific form
          try {
            // Store a reference to the enhanced form
            if (FormsObject && FormsObject.helper && FormsObject.helper.cache) {
              // Try to update the cache if it exists
              FormsObject.helper.cache.set(form.id, form);
            }
          } catch (error) {
            console.warn(`[DOM Helpers Storage] Could not update Forms cache for ${form.id}:`, error.message);
          }
        }
      }
    });
  }

  // Add Storage to the main DOMHelpers object if it exists
  if (global.DOMHelpers) {
    global.DOMHelpers.Storage = Storage;
    global.DOMHelpers.StorageHelper = StorageHelper;
  }

  console.log('[DOM Helpers Storage] Storage module loaded successfully');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

