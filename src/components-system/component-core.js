/**
 * DOM Helpers - Component Core Module
 *
 * Core Component class with lifecycle management, template parsing,
 * scoped CSS, and rendering logic.
 *
 * Features:
 * - Comprehensive lifecycle hooks
 * - Template/styles/script parsing
 * - Scoped CSS with unique IDs
 * - Smart update system with RAF batching
 * - Error boundaries
 * - Slots support
 * - Props validation
 * - Event system
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
    global.DOMHelpersComponentCore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // SCOPED STYLES MANAGEMENT
  // ============================================================================

  const scopedStyles = new Map();
  const componentInstances = new Map();

  /**
   * Insert scoped styles into document
   */
  function insertScopedStyles(scopeId, css) {
    if (scopedStyles.has(scopeId)) {
      return;
    }

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-scope', scopeId);
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
    scopedStyles.set(scopeId, styleElement);
  }

  /**
   * Remove scoped styles from document
   */
  function removeScopedStyles(scopeId) {
    const styleElement = scopedStyles.get(scopeId);
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
      scopedStyles.delete(scopeId);
    }
  }

  // ============================================================================
  // COMPONENT CLASS
  // ============================================================================

  class Component {
    constructor(name, definition, container, data = {}) {
      this.name = name;
      this.container = container;
      this.data = data;
      this.scopeId = `component-${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.isDestroyed = false;
      this.isMounted = false;
      this.children = [];
      this.eventListeners = [];
      this._updateQueue = {};
      this._rafId = null;
      this._errorBoundary = null;

      // Parse definition
      this._parseDefinition(definition);

      // Store instance
      componentInstances.set(container, this);
    }

    /**
     * Parse component definition
     */
    _parseDefinition(definition) {
      if (typeof definition === 'string') {
        // HTML string definition
        this._parseHTMLDefinition(definition);
      } else if (typeof definition === 'object') {
        // Object definition
        this.template = definition.template || '';
        this.styles = definition.styles || '';
        this.script = definition.script || null;
        this.props = definition.props || {};
        this.methods = definition.methods || {};

        // Lifecycle hooks
        this.beforeMount = definition.beforeMount || null;
        this.mounted = definition.mounted || null;
        this.beforeUpdate = definition.beforeUpdate || null;
        this.updated = definition.updated || null;
        this.beforeDestroy = definition.beforeDestroy || null;
        this.destroyed = definition.destroyed || null;
        this.errorCaptured = definition.errorCaptured || null;
      } else {
        throw new Error(`[Component Core] Invalid component definition for "${this.name}"`);
      }

      // Validate props
      this._validateProps();
    }

    /**
     * Parse HTML string definition (Pure HTML approach)
     */
    _parseHTMLDefinition(html) {
      // Extract template (HTML without style/script tags)
      this.template = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .trim();

      // Extract styles
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      this.styles = styleMatch ? styleMatch[1].trim() : '';

      // Extract and prepare script
      const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        try {
          const scriptCode = scriptMatch[1].trim();
          // Script will be executed in component context
          this.script = new Function('component', 'data', 'Elements', 'Collections', 'Selector', scriptCode);
        } catch (error) {
          console.error(`[Component Core] Error parsing script for "${this.name}":`, error);
          this.script = null;
        }
      } else {
        this.script = null;
      }

      // Default empty objects
      this.props = {};
      this.methods = {};
    }

    /**
     * Validate props against definition
     */
    _validateProps() {
      if (!this.props || typeof this.props !== 'object') {
        return;
      }

      for (const [propName, propDef] of Object.entries(this.props)) {
        if (!propDef) continue;

        const value = this.data[propName];
        const type = propDef.type;
        const required = propDef.required;
        const validator = propDef.validator;

        // Check required
        if (required && (value === undefined || value === null)) {
          console.warn(`[Component Core] Required prop "${propName}" is missing in component "${this.name}"`);
        }

        // Check type
        if (value !== undefined && type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          const expectedType = typeof type === 'function' ? type.name.toLowerCase() : type;

          if (actualType !== expectedType) {
            console.warn(`[Component Core] Prop "${propName}" expected type "${expectedType}" but got "${actualType}" in component "${this.name}"`);
          }
        }

        // Custom validator
        if (value !== undefined && validator && typeof validator === 'function') {
          try {
            const isValid = validator(value);
            if (!isValid) {
              console.warn(`[Component Core] Prop "${propName}" failed validation in component "${this.name}"`);
            }
          } catch (error) {
            console.error(`[Component Core] Error validating prop "${propName}":`, error);
          }
        }

        // Set default if undefined
        if (value === undefined && propDef.default !== undefined) {
          this.data[propName] = typeof propDef.default === 'function'
            ? propDef.default()
            : propDef.default;
        }
      }
    }

    /**
     * Scope CSS for this component
     */
    _scopeCSS(css) {
      if (!css) return '';

      return css.replace(/([^{}]+)\{/g, (match, selector) => {
        const scopedSelectors = selector.trim().split(',')
          .map(s => {
            const trimmed = s.trim();
            // Don't scope @rules
            if (trimmed.startsWith('@')) return trimmed;
            // Scope selector
            return `[${this.scopeId}] ${trimmed}`;
          })
          .join(', ');
        return `${scopedSelectors} {`;
      });
    }

    /**
     * Process template (pure HTML - no interpolation)
     * HTML remains as-is, manipulation done via DOM Helpers and JavaScript
     */
    _processTemplate(template) {
      if (!template) return '';

      // NO template interpolation - pure HTML approach
      // Data binding is done via JavaScript after render using DOM Helpers
      // This follows the traditional HTML5 philosophy where HTML has IDs/classes
      // and JavaScript updates the DOM through Elements.update() or direct manipulation

      return template;
    }

    /**
     * Execute component script
     */
    _executeScript() {
      if (this.script && typeof this.script === 'function') {
        try {
          const globalObj = typeof window !== 'undefined' ? window : global;
          // Pass component, data, and DOM Helpers to script
          this.script.call(
            this,
            this,
            this.data,
            globalObj.Elements,
            globalObj.Collections,
            globalObj.Selector
          );
        } catch (error) {
          this._handleError(error, 'script execution');
        }
      }
    }

    /**
     * Render component
     */
    async render() {
      if (this.isDestroyed) {
        console.warn(`[Component Core] Cannot render destroyed component "${this.name}"`);
        return;
      }

      try {
        // Call beforeMount if first render
        if (!this.isMounted) {
          await this._callHook('beforeMount');
        } else {
          await this._callHook('beforeUpdate');
        }

        // Process template
        const processedTemplate = this._processTemplate(this.template);

        // Clear container
        this.container.innerHTML = '';

        // Set scope attribute
        this.container.setAttribute(this.scopeId, '');

        // Insert processed template
        this.container.innerHTML = processedTemplate;

        // Inject scoped styles
        if (this.styles) {
          const scopedCSS = this._scopeCSS(this.styles);
          insertScopedStyles(this.scopeId, scopedCSS);
        }

        // Execute script
        this._executeScript();

        // Call mounted/updated
        if (!this.isMounted) {
          this.isMounted = true;
          await this._callHook('mounted');
        } else {
          await this._callHook('updated');
        }

      } catch (error) {
        this._handleError(error, 'render');
      }
    }

    /**
     * Update component with new data (smart update without re-render)
     */
    async updateData(newData) {
      if (this.isDestroyed) {
        console.warn(`[Component Core] Cannot update destroyed component "${this.name}"`);
        return;
      }

      try {
        const oldData = { ...this.data };

        // Merge new data
        Object.assign(this.data, newData);

        // Validate new props
        this._validateProps();

        // Emit event
        this.emit('dataChanged', { oldData, newData, changes: newData });

        // Re-render
        await this.render();

      } catch (error) {
        this._handleError(error, 'updateData');
      }
    }

    /**
     * Granular DOM update with RAF batching
     */
    update(updates, options = {}) {
      if (this.isDestroyed) {
        console.warn(`[Component Core] Cannot update destroyed component "${this.name}"`);
        return this;
      }

      const { immediate = false } = options;

      // Merge updates into queue
      this._deepMergeUpdates(this._updateQueue, updates);

      if (immediate) {
        this._flushUpdates();
      } else {
        // Cancel pending RAF
        if (this._rafId) {
          cancelAnimationFrame(this._rafId);
        }

        // Schedule new RAF
        this._rafId = requestAnimationFrame(() => this._flushUpdates());
      }

      return this;
    }

    /**
     * Deep merge updates into queue
     */
    _deepMergeUpdates(target, source) {
      for (const [key, value] of Object.entries(source)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (!target[key]) target[key] = {};
          this._deepMergeUpdates(target[key], value);
        } else {
          target[key] = value;
        }
      }
    }

    /**
     * Flush queued updates to DOM
     */
    _flushUpdates() {
      if (Object.keys(this._updateQueue).length === 0) return;

      try {
        const globalObj = typeof window !== 'undefined' ? window : global;

        if (globalObj.Elements && typeof globalObj.Elements.update === 'function') {
          globalObj.Elements.update(this._updateQueue);
        }

        // Clear queue
        this._updateQueue = {};
        this._rafId = null;

      } catch (error) {
        this._handleError(error, 'flushUpdates');
      }
    }

    /**
     * Force full re-render
     */
    async refresh() {
      await this.render();
    }

    /**
     * Emit custom event
     */
    emit(eventName, detail = {}) {
      try {
        const event = new CustomEvent(`component:${eventName}`, {
          detail: { component: this, ...detail },
          bubbles: true,
          cancelable: true
        });
        this.container.dispatchEvent(event);
      } catch (error) {
        console.warn(`[Component Core] Error emitting event "${eventName}":`, error.message);
      }
    }

    /**
     * Add event listener (tracked for cleanup)
     */
    addEventListener(element, eventName, handler, options) {
      if (typeof element === 'string') {
        element = this.container.querySelector(element);
      }

      if (!element) {
        console.warn(`[Component Core] Element not found for addEventListener`);
        return;
      }

      element.addEventListener(eventName, handler, options);

      // Track for cleanup
      this.eventListeners.push({ element, eventName, handler, options });
    }

    /**
     * Call lifecycle hook
     */
    async _callHook(hookName) {
      const hook = this[hookName];
      if (hook && typeof hook === 'function') {
        try {
          await hook.call(this, this);
        } catch (error) {
          this._handleError(error, `lifecycle hook "${hookName}"`);
        }
      }
    }

    /**
     * Handle errors with error boundary
     */
    _handleError(error, context) {
      console.error(`[Component Core] Error in component "${this.name}" during ${context}:`, error);

      // Call errorCaptured hook
      if (this.errorCaptured && typeof this.errorCaptured === 'function') {
        try {
          const handled = this.errorCaptured.call(this, error, this, context);
          if (handled) return;
        } catch (e) {
          console.error(`[Component Core] Error in errorCaptured hook:`, e);
        }
      }

      // Emit error event
      this.emit('error', { error, context });

      // If no handler caught it, rethrow
      throw error;
    }

    /**
     * Destroy component
     */
    async destroy() {
      if (this.isDestroyed) return;

      try {
        // Call beforeDestroy
        await this._callHook('beforeDestroy');

        // Cancel pending RAF
        if (this._rafId) {
          cancelAnimationFrame(this._rafId);
          this._rafId = null;
        }

        // Remove event listeners
        this.eventListeners.forEach(({ element, eventName, handler, options }) => {
          try {
            element.removeEventListener(eventName, handler, options);
          } catch (e) {
            console.warn(`[Component Core] Error removing event listener:`, e.message);
          }
        });
        this.eventListeners = [];

        // Destroy children
        for (const child of this.children) {
          await child.destroy();
        }
        this.children = [];

        // Remove scoped styles
        removeScopedStyles(this.scopeId);

        // Clear container
        if (this.container) {
          this.container.removeAttribute(this.scopeId);
          this.container.innerHTML = '';
        }

        // Call destroyed
        await this._callHook('destroyed');

        // Mark as destroyed
        this.isDestroyed = true;
        this.isMounted = false;

        // Remove from instances
        componentInstances.delete(this.container);

      } catch (error) {
        console.error(`[Component Core] Error destroying component "${this.name}":`, error);
      }
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentCore = {
    Component,
    componentInstances,
    scopedStyles,

    // Utility functions
    insertScopedStyles,
    removeScopedStyles,

    // Version
    version: '2.0.0'
  };

  // ============================================================================
  // GLOBAL EXPORT
  // ============================================================================

  if (typeof window !== 'undefined' || typeof global !== 'undefined') {
    const globalObj = typeof window !== 'undefined' ? window : global;

    if (!globalObj.ComponentHelpers) {
      globalObj.ComponentHelpers = {};
    }

    globalObj.ComponentHelpers.core = ComponentCore;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Core] v2.0.0 initialized');
  }

  return ComponentCore;
});
