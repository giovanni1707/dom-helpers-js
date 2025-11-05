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
