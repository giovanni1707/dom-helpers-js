/**
 * DOM Helpers - Animation System (Unified Entry Point)
 *
 * Complete animation system with DOM Helpers integration.
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
    global.DOMHelpersAnimation = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // MODULE LOADING
  // ============================================================================

  let AnimationCore, AnimationEffects, AnimationChainModule;

  if (typeof require !== 'undefined') {
    try {
      AnimationCore = require('./animation-core.js');
      AnimationEffects = require('./animation-effects.js');
      AnimationChainModule = require('./animation-chain.js');
    } catch (e) {}
  }

  if (!AnimationCore) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    const helpers = globalObj.AnimationHelpers || {};
    AnimationCore = helpers.core;
    AnimationEffects = helpers.effects;
    AnimationChainModule = helpers.chain;
  }

  if (!AnimationCore || !AnimationEffects) {
    console.error('[Animation System] Required modules not found');
    return {};
  }

  // ============================================================================
  // UNIFIED API
  // ============================================================================

  const Animation = {
    // Effects
    fadeIn: AnimationEffects.fadeIn,
    fadeOut: AnimationEffects.fadeOut,
    slideUp: AnimationEffects.slideUp,
    slideDown: AnimationEffects.slideDown,
    slideToggle: AnimationEffects.slideToggle,
    transform: AnimationEffects.transform,

    // Chaining
    chain: AnimationChainModule?.create || ((el) => new AnimationChainModule.AnimationChain(el)),

    // Configuration
    setDefaults: AnimationCore.setDefaults,
    getDefaults: AnimationCore.getDefaults,
    easing: AnimationCore.EASING_FUNCTIONS,

    // Queue management
    clearQueue: (element) => AnimationCore.animationQueue.clear(element),

    // Browser support
    isSupported: (feature) => {
      switch (feature) {
        case 'transitions': return !!AnimationCore.BROWSER_SUPPORT.transitions;
        case 'transforms': return !!AnimationCore.BROWSER_SUPPORT.transforms;
        default: return false;
      }
    },

    // Module references
    modules: {
      core: AnimationCore,
      effects: AnimationEffects,
      chain: AnimationChainModule
    },

    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    globalObj.Animation = Animation;

    if (globalObj.DOMHelpers) {
      globalObj.DOMHelpers.Animation = Animation;
    }
  }

  console.log('[DOM Helpers Animation System] v2.0.0 initialized');
  console.log('[Animation System] Loaded modules:', Object.keys(Animation.modules).filter(k => Animation.modules[k]));

  return Animation;
});
