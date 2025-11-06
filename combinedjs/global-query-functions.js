/**
 * DOM Helpers - Global Query Functions Enhancement
 * Adds global querySelector and querySelectorAll functions with .update() support
 * 
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
  'use strict';

  // Check if EnhancedUpdateUtility is available
  const hasUpdateUtility = typeof global.EnhancedUpdateUtility !== 'undefined';
  const hasBulkUpdaters = typeof global.BulkPropertyUpdaters !== 'undefined';

  /**
   * Enhance a single element with .update() method
   */
  function enhanceElement(element) {
    if (!element || element._hasGlobalQueryUpdate) {
      return element;
    }

    if (hasUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
      return global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
    }

    // Fallback implementation
    try {
      Object.defineProperty(element, 'update', {
        value: function(updates = {}) {
          if (!updates || typeof updates !== 'object') {
            console.warn('[Global Query] .update() called with invalid updates object');
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
                    console.warn(`[Global Query] Error in classList.${method}: ${error.message}`);
                  }
                });
                return;
              }

              if (key === 'setAttribute') {
                if (Array.isArray(value) && value.length >= 2) {
                  element.setAttribute(value[0], value[1]);
                } else if (typeof value === 'object' && value !== null) {
                  Object.entries(value).forEach(([attrName, attrValue]) => {
                    element.setAttribute(attrName, attrValue);
                  });
                }
                return;
              }

              if (key === 'removeAttribute') {
                if (Array.isArray(value)) {
                  value.forEach(attr => element.removeAttribute(attr));
                } else if (typeof value === 'string') {
                  element.removeAttribute(value);
                }
                return;
              }

              if (key === 'dataset' && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                  element.dataset[dataKey] = dataValue;
                });
                return;
              }

              if (key === 'addEventListener' && Array.isArray(value) && value.length >= 2) {
                const [eventType, handler, options] = value;
                element.addEventListener(eventType, handler, options);
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

              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                element.setAttribute(key, value);
              }
            });
          } catch (error) {
            console.warn(`[Global Query] Error in .update(): ${error.message}`);
          }

          return element;
        },
        writable: false,
        enumerable: false,
        configurable: true
      });

      Object.defineProperty(element, '_hasGlobalQueryUpdate', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (error) {
      element.update = function(updates = {}) {
        Object.entries(updates).forEach(([key, value]) => {
          if (key in element) {
            element[key] = value;
          }
        });
        return element;
      };
      element._hasGlobalQueryUpdate = true;
    }

    return element;
  }

  /**
   * Enhance a NodeList with .update() and bulk methods
   */
  function enhanceNodeList(nodeList, selector) {
    if (!nodeList || nodeList._hasGlobalQueryUpdate) {
      return nodeList;
    }

    // Create enhanced collection wrapper
    const collection = {
      _originalNodeList: nodeList,
      _selector: selector,
      _cachedAt: Date.now(),

      get length() {
        return nodeList.length;
      },

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

      // Convenience methods
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

      // Main update method
      update(updates = {}) {
        if (!updates || typeof updates !== 'object') {
          console.warn('[Global Query] .update() called with invalid updates object');
          return this;
        }

        const elements = Array.from(nodeList);
        
        if (elements.length === 0) {
          console.info('[Global Query] .update() called on empty collection');
          return this;
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

                if (key === 'classList' && typeof value === 'object' && value !== null) {
                  Object.entries(value).forEach(([method, classes]) => {
                    const classList = Array.isArray(classes) ? classes : [classes];
                    switch (method) {
                      case 'add': element.classList.add(...classList); break;
                      case 'remove': element.classList.remove(...classList); break;
                      case 'toggle': classList.forEach(cls => element.classList.toggle(cls)); break;
                      case 'replace': 
                        if (classList.length === 2) element.classList.replace(classList[0], classList[1]);
                        break;
                    }
                  });
                  return;
                }

                if (key === 'setAttribute') {
                  if (Array.isArray(value) && value.length >= 2) {
                    element.setAttribute(value[0], value[1]);
                  } else if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([attrName, attrValue]) => {
                      element.setAttribute(attrName, attrValue);
                    });
                  }
                  return;
                }

                if (key === 'removeAttribute') {
                  if (Array.isArray(value)) {
                    value.forEach(attr => element.removeAttribute(attr));
                  } else if (typeof value === 'string') {
                    element.removeAttribute(value);
                  }
                  return;
                }

                if (key === 'dataset' && typeof value === 'object' && value !== null) {
                  Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                  });
                  return;
                }

                if (key === 'addEventListener') {
                  if (Array.isArray(value) && value.length >= 2) {
                    const [eventType, handler, options] = value;
                    element.addEventListener(eventType, handler, options);
                  } else if (typeof value === 'object' && value !== null) {
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
          console.warn(`[Global Query] Error in collection .update(): ${error.message}`);
        }

        return this;
      }
    };

    // Add array-like indexed access
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

    // Apply bulk property updaters if available
    if (hasBulkUpdaters && global.BulkPropertyUpdaters.enhanceCollectionInstance) {
      global.BulkPropertyUpdaters.enhanceCollectionInstance(collection);
    }

    // Mark as enhanced
    try {
      Object.defineProperty(collection, '_hasGlobalQueryUpdate', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    } catch (e) {
      collection._hasGlobalQueryUpdate = true;
    }

    return collection;
  }

  /**
   * Global querySelector function
   * @param {string} selector - CSS selector
   * @param {Element|Document} [context=document] - Context to query within
   * @returns {Element|null} Enhanced element with .update() method
   */
  function querySelector(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[Global Query] querySelector requires a string selector');
      return null;
    }

    const element = context.querySelector(selector);
    return element ? enhanceElement(element) : element;
  }

  /**
   * Global querySelectorAll function
   * @param {string} selector - CSS selector
   * @param {Element|Document} [context=document] - Context to query within
   * @returns {Object} Enhanced NodeList with .update() and collection methods
   */
  function querySelectorAll(selector, context = document) {
    if (typeof selector !== 'string') {
      console.warn('[Global Query] querySelectorAll requires a string selector');
      return enhanceNodeList([], selector);
    }

    const nodeList = context.querySelectorAll(selector);
    return enhanceNodeList(nodeList, selector);
  }

  /**
   * Shorthand alias for querySelector
   */
  const qs = querySelector;

  /**
   * Shorthand alias for querySelectorAll
   */
  const qsa = querySelectorAll;

  /**
   * Query within a specific container
   * @param {string|Element} container - Container selector or element
   * @param {string} selector - CSS selector
   * @returns {Element|null} Enhanced element
   */
  function queryWithin(container, selector) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!containerEl) {
      console.warn('[Global Query] Container not found');
      return null;
    }

    return querySelector(selector, containerEl);
  }

  /**
   * Query all within a specific container
   * @param {string|Element} container - Container selector or element
   * @param {string} selector - CSS selector
   * @returns {Object} Enhanced NodeList
   */
  function queryAllWithin(container, selector) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!containerEl) {
      console.warn('[Global Query] Container not found');
      return enhanceNodeList([], selector);
    }

    return querySelectorAll(selector, containerEl);
  }

  // Expose to global scope
  global.querySelector = querySelector;
  global.querySelectorAll = querySelectorAll;
  global.qs = qs;
  global.qsa = qsa;
  global.queryWithin = queryWithin;
  global.queryAllWithin = queryAllWithin;

  // Create namespace object
  const GlobalQuery = {
    version: '1.0.0',
    querySelector,
    querySelectorAll,
    qs,
    qsa,
    queryWithin,
    queryAllWithin,
    enhanceElement,
    enhanceNodeList
  };

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalQuery;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return GlobalQuery;
    });
  } else {
    global.GlobalQuery = GlobalQuery;
  }

  // Add to DOMHelpers if available
  if (typeof global.DOMHelpers !== 'undefined') {
    global.DOMHelpers.GlobalQuery = GlobalQuery;
    global.DOMHelpers.querySelector = querySelector;
    global.DOMHelpers.querySelectorAll = querySelectorAll;
    global.DOMHelpers.qs = qs;
    global.DOMHelpers.qsa = qsa;
  }

  // Log initialization in development
  if (typeof console !== 'undefined' && console.log) {
    console.log('[DOM Helpers] Global querySelector/querySelectorAll functions available');
  }

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);