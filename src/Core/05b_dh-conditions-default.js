/**
 * Conditions.js - Default Condition Enhancement
 * @version 1.0.0
 * @description Adds explicit 'default' condition support to Conditions module
 * @requires Conditions.js v4.0.0+
 * @license MIT
 */

(function(global) {
  'use strict';

  // ============================================================================
  // VALIDATION
  // ============================================================================

  if (!global.Conditions) {
    console.error('[Conditions.Default] Conditions module not found. Please load Conditions.js first.');
    return;
  }

  // ============================================================================
  // REGISTER DEFAULT MATCHER
  // ============================================================================

  global.Conditions.registerMatcher('default', {
    test: (condition) => condition === 'default' || condition === '*',
    match: () => true // Always matches as fallback
  });

  // ============================================================================
  // LOGGING
  // ============================================================================

  console.log('[Conditions.Default] Enhancement loaded successfully');
  console.log('[Conditions.Default] "default" and "*" conditions now available as fallbacks');

})(typeof window !== 'undefined' ? window : global);
