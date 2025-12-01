/**
 * DOM Helpers - Animation Core Module
 *
 * Core animation utilities including browser detection, configuration,
 * queue management, and base animation helpers.
 *
 * Features:
 * - Browser capability detection (transitions, transforms)
 * - Easing functions library
 * - Animation queue management
 * - Configuration management
 * - Base animation utilities
 *
 * @version 2.0.0
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
    global.DOMHelpersAnimationCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const DEFAULT_CONFIG = {
    duration: 300,
    delay: 0,
    easing: 'ease',
    cleanup: true,
    queue: true
  };

  // ============================================================================
  // EASING FUNCTIONS
  // ============================================================================

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

  // ============================================================================
  // BROWSER SUPPORT DETECTION
  // ============================================================================

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

  // ============================================================================
  // ANIMATION QUEUE
  // ============================================================================

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

  const animationQueue = new AnimationQueue();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

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

  // ============================================================================
  // CONFIGURATION MANAGEMENT
  // ============================================================================

  function setDefaults(config) {
    Object.assign(DEFAULT_CONFIG, config);
  }

  function getDefaults() {
    return { ...DEFAULT_CONFIG };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AnimationCore = {
    // Configuration
    DEFAULT_CONFIG,
    EASING_FUNCTIONS,
    BROWSER_SUPPORT,

    // Queue
    animationQueue,
    AnimationQueue,

    // Utilities
    parseConfig,
    getComputedStyleValue,
    setElementStyle,
    removeElementStyles,
    createTransition,
    waitForTransition,
    cleanupAnimation,

    // Configuration management
    setDefaults,
    getDefaults,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (!globalObj.AnimationHelpers) {
      globalObj.AnimationHelpers = {};
    }

    globalObj.AnimationHelpers.core = AnimationCore;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Animation Core] v2.0.0 initialized');
  }

  return AnimationCore;
});
