/**
 * DOM Helpers - Animation Chain Module
 *
 * Animation chaining system for sequential animations.
 *
 * @version 2.0.0
 * @license MIT
 */

(function (global, factory) {
  'use strict';

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.DOMHelpersAnimationChain = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let AnimationEffects;

  if (typeof require !== 'undefined') {
    try {
      AnimationEffects = require('./animation-effects.js');
    } catch (e) {}
  }

  if (!AnimationEffects) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    AnimationEffects = globalObj.AnimationHelpers?.effects;
  }

  if (!AnimationEffects) {
    console.error('[Animation Chain] animation-effects.js not found');
    return {};
  }

  const { fadeIn, fadeOut, slideUp, slideDown, slideToggle, transform } = AnimationEffects;

  // ============================================================================
  // ANIMATION CHAIN CLASS
  // ============================================================================

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
        console.error('[Animation Chain] Execution failed:', error);
        throw error;
      }
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AnimationChainModule = {
    AnimationChain,
    create: (element) => new AnimationChain(element),
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

    globalObj.AnimationHelpers.chain = AnimationChainModule;
  }

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Animation Chain] v2.0.0 initialized');
  }

  return AnimationChainModule;
});
