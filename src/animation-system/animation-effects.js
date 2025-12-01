/**
 * DOM Helpers - Animation Effects Module
 *
 * Animation effects including fade, slide, and transform.
 *
 * Features:
 * - fadeIn/fadeOut effects
 * - slideUp/slideDown/slideToggle effects
 * - transform (translate, scale, rotate, skew)
 * - Automatic cleanup
 * - Callback support
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
    global.DOMHelpersAnimationEffects = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let AnimationCore;

  // Try to load from require
  if (typeof require !== 'undefined') {
    try {
      AnimationCore = require('./animation-core.js');
    } catch (e) {
      // Not available
    }
  }

  // Try global
  if (!AnimationCore) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    AnimationCore = globalObj.AnimationHelpers?.core;
  }

  if (!AnimationCore) {
    console.error('[Animation Effects] animation-core.js not found. Please load it first.');
    return {};
  }

  const {
    parseConfig,
    getComputedStyleValue,
    setElementStyle,
    createTransition,
    waitForTransition,
    cleanupAnimation,
    BROWSER_SUPPORT
  } = AnimationCore;

  // ============================================================================
  // FADE EFFECTS
  // ============================================================================

  async function fadeIn(element, options = {}) {
    const config = parseConfig(options);

    return new Promise(async (resolve, reject) => {
      try {
        // Store original values
        const originalDisplay = getComputedStyleValue(element, 'display');

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

  // ============================================================================
  // SLIDE EFFECTS
  // ============================================================================

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

  // ============================================================================
  // TRANSFORM EFFECTS
  // ============================================================================

  async function transform(element, transformations, options = {}) {
    const config = parseConfig(options);

    return new Promise(async (resolve, reject) => {
      try {
        if (!BROWSER_SUPPORT.transforms) {
          // Fallback for browsers without transform support
          console.warn('[Animation Effects] Transform not supported in this browser');
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
              console.warn(`[Animation Effects] Unknown transform property: ${property}`);
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

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const AnimationEffects = {
    // Fade effects
    fadeIn,
    fadeOut,

    // Slide effects
    slideUp,
    slideDown,
    slideToggle,

    // Transform effects
    transform,

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

    globalObj.AnimationHelpers.effects = AnimationEffects;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Animation Effects] v2.0.0 initialized');
  }

  return AnimationEffects;
});
