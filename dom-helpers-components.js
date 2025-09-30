/**
 * DOM Helpers Components - Traditional HTML5 Component System
 * Extends DOM Helpers with vanilla JavaScript component architecture
 * Fully compatible with all DOM Helpers libraries (async, form, storage, animation)
 * 
 * Features:
 * - Traditional HTML5 structure with IDs and classes
 * - Seamless Elements, Collections, Selector integration
 * - Component-based architecture with vanilla JavaScript
 * - Scoped CSS with automatic isolation
 * - Event delegation and custom events
 * - Full DOM Helpers .update() compatibility
 * - Lifecycle management
 * - Data binding through DOM Helpers philosophy
 * 
 * @version 2.0.0
 * @license MIT
 */

(function(global) {
  'use strict';

  // Check for dom-helpers dependencies
  const requiredLibraries = ['Elements', 'Collections', 'Selector'];
  const missingLibraries = requiredLibraries.filter(lib => typeof global[lib] === 'undefined');
  
  if (missingLibraries.length > 0) {
    console.warn('[DOM Components] Missing DOM Helpers libraries:', missingLibraries.join(', '));
  }

  // Component registry and management
  const componentRegistry = new Map();
  const componentInstances = new WeakMap();
  const scopedStyles = new Map();
  const componentData = new WeakMap();
  let componentIdCounter = 0;

  /**
   * Component Class - Traditional HTML5 Component
   */
  class Component {
    constructor(name, definition, container, data = {}) {
      this.id = `comp-${++componentIdCounter}`;
      this.name = name;
      this.definition = definition;
      this.container = container;
      this.data = { ...data };
      this.children = new Set();
      this.isDestroyed = false;
      this.isMounted = false;
      
      // Component scope for CSS
      this.scopeId = `data-component-${this.id}`;
      
      // Lifecycle callbacks
      this.lifecycle = {
        beforeMount: [],
        mounted: [],
        beforeUpdate: [],
        updated: [],
        beforeDestroy: [],
        destroyed: []
      };

      // Parse component definition
      this._parseDefinition();
      
      // Store instance reference
      componentInstances.set(container, this);
      componentData.set(this, this.data);
    }

    /**
     * Parse component definition from HTML file or object
     */
    _parseDefinition() {
      if (typeof this.definition === 'string') {
        // Parse HTML file content
        this.template = this._extractTemplate(this.definition);
        this.styles = this._extractStyles(this.definition);
        this.script = this._extractScript(this.definition);
      } else if (typeof this.definition === 'object') {
        // Object definition
        this.template = this.definition.template || '';
        this.styles = this.definition.styles || '';
        this.script = this.definition.script || '';
      }
    }

    /**
     * Extract template from component definition
     */
    _extractTemplate(content) {
      // Remove <style> and <script> sections to get clean HTML
      return content
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .trim();
    }

    /**
     * Extract styles from component definition
     */
    _extractStyles(content) {
      const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      return styleMatch ? styleMatch[1].trim() : '';
    }

    /**
     * Extract script from component definition
     */
    _extractScript(content) {
      const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      return scriptMatch ? scriptMatch[1].trim() : '';
    }

    /**
     * Render the component
     */
    async render() {
      if (this.isDestroyed) return;

      try {
        // Call beforeMount lifecycle
        await this._callLifecycle('beforeMount');

        // Process and inject styles
        if (this.styles) {
          this._injectScopedStyles();
        }

        // Create DOM structure
        this._createDOM();

        // Apply scoped attributes
        if (this.styles) {
          this._applyScopeAttributes();
        }

        // Execute component script
        if (this.script) {
          await this._executeScript();
        }

        // Process nested components
        await this._processNestedComponents();

        // Enhance with DOM Helpers
        this._enhanceWithDOMHelpers();

        this.isMounted = true;

        // Call mounted lifecycle
        await this._callLifecycle('mounted');

        return this;

      } catch (error) {
        console.error(`[DOM Components] Error rendering component ${this.name}:`, error);
        throw error;
      }
    }

    /**
     * Create DOM structure from template
     */
    _createDOM() {
      // Clear container
      this.container.innerHTML = '';
      
      // Set template HTML
      this.container.innerHTML = this.template;
      
      // Store reference to root (could be container itself or first child)
      this.root = this.container.children.length === 1 ? this.container.firstElementChild : this.container;
    }

    /**
     * Inject scoped styles
     */
    _injectScopedStyles() {
      if (scopedStyles.has(this.scopeId)) return;

      // Process CSS with scoping
      const scopedCSS = this._scopeCSS(this.styles);
      
      // Create style element
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-component', this.name);
      styleElement.setAttribute('data-scope', this.scopeId);
      styleElement.textContent = scopedCSS;
      
      // Inject into head
      document.head.appendChild(styleElement);
      scopedStyles.set(this.scopeId, styleElement);
    }

    /**
     * Scope CSS rules to this component instance
     */
    _scopeCSS(css) {
      return css.replace(/([^{}]+)\{/g, (match, selector) => {
        const trimmedSelector = selector.trim();
        
        // Skip @rules, keyframes, comments
        if (trimmedSelector.startsWith('@') || 
            trimmedSelector.startsWith('/*') ||
            trimmedSelector.includes('keyframes')) {
          return match;
        }
        
        // Add scope attribute to selectors
        const scopedSelectors = trimmedSelector
          .split(',')
          .map(s => `[${this.scopeId}] ${s.trim()}`)
          .join(', ');
        
        return `${scopedSelectors} {`;
      });
    }

    /**
     * Apply scope attributes to all elements
     */
    _applyScopeAttributes() {
      // Apply to container
      this.container.setAttribute(this.scopeId, '');
      
      // Apply to all child elements
      const elements = this.container.querySelectorAll('*');
      elements.forEach(element => {
        element.setAttribute(this.scopeId, '');
      });
    }

    /**
     * Execute component script with proper context
     */
    async _executeScript() {
      try {
        // Create component context with DOM Helpers integration
        const context = {
          // Component properties
          component: this,
          container: this.container,
          root: this.root,
          data: this.data,
          
          // DOM Helpers integration
          Elements: global.Elements,
          Collections: global.Collections,
          Selector: global.Selector,
          
          // Component methods
          getData: () => this.data,
          setData: (newData) => this.updateData(newData),
          emit: (eventName, detail) => this.emit(eventName, detail),
          destroy: () => this.destroy(),
          
          // Lifecycle registration
          onBeforeMount: (callback) => this.lifecycle.beforeMount.push(callback),
          onMounted: (callback) => this.lifecycle.mounted.push(callback),
          onBeforeUpdate: (callback) => this.lifecycle.beforeUpdate.push(callback),
          onUpdated: (callback) => this.lifecycle.updated.push(callback),
          onBeforeDestroy: (callback) => this.lifecycle.beforeDestroy.push(callback),
          onDestroyed: (callback) => this.lifecycle.destroyed.push(callback),
          
          // Utilities
          console,
          setTimeout,
          setInterval,
          clearTimeout,
          clearInterval,
          fetch: typeof fetch !== 'undefined' ? fetch : undefined,
          
          // DOM Helpers async library if available
          ...( global.DOMHelpersAsync ? { Async: global.DOMHelpersAsync } : {} ),
          
          // DOM Helpers form library if available
          ...( global.DOMHelpersForm ? { Form: global.DOMHelpersForm } : {} ),
          
          // DOM Helpers storage library if available
          ...( global.DOMHelpersStorage ? { Storage: global.DOMHelpersStorage } : {} ),
          
          // DOM Helpers animation library if available
          ...( global.DOMHelpersAnimation ? { Animation: global.DOMHelpersAnimation } : {} )
        };

        // Execute script with context
        const scriptFunction = new Function(
          ...Object.keys(context),
          this.script
        );
        
        await scriptFunction.apply(this, Object.values(context));
        
      } catch (error) {
        console.error(`[DOM Components] Error executing script for ${this.name}:`, error);
        throw error;
      }
    }

    /**
     * Process nested components in template
     */
    async _processNestedComponents() {
      // Look for elements with data-component attribute
      const nestedElements = this.container.querySelectorAll('[data-component]');
      
      for (const element of nestedElements) {
        const componentName = element.getAttribute('data-component');
        
        if (componentName && Components.isRegistered(componentName)) {
          try {
            // Extract data from attributes
            const componentData = this._extractDataFromElement(element);
            
            // Render nested component
            const childComponent = await Components.render(componentName, element, componentData);
            
            if (childComponent) {
              this.children.add(childComponent);
            }
          } catch (error) {
            console.error(`[DOM Components] Error rendering nested component ${componentName}:`, error);
          }
        }
      }
    }

    /**
     * Extract data from element attributes
     */
    _extractDataFromElement(element) {
      const data = {};
      
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'data-component') {
          const key = attr.name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          
          // Try to parse as JSON, fallback to string
          let value = attr.value;
          try {
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(value) && value !== '') value = Number(value);
            else if ((value.startsWith('{') && value.endsWith('}')) ||
                     (value.startsWith('[') && value.endsWith(']'))) {
              value = JSON.parse(value);
            }
          } catch (e) {
            // Keep as string
          }
          
          data[key] = value;
        }
      });
      
      return data;
    }

    /**
     * Enhance elements with DOM Helpers functionality
     */
    _enhanceWithDOMHelpers() {
      // Enhance all elements in component with .update() method
      const elements = this.container.querySelectorAll('*');
      elements.forEach(element => {
        if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
          global.EnhancedUpdateUtility.enhanceElementWithUpdate(element);
        }
      });

      // Enhance container as well
      if (global.EnhancedUpdateUtility && global.EnhancedUpdateUtility.enhanceElementWithUpdate) {
        global.EnhancedUpdateUtility.enhanceElementWithUpdate(this.container);
      }
    }

    /**
     * Update component data
     */
    async updateData(newData) {
      if (this.isDestroyed) return;

      try {
        await this._callLifecycle('beforeUpdate');

        // Update data
        Object.assign(this.data, newData);
        componentData.set(this, this.data);

        // Trigger re-render if needed
        await this.render();

        await this._callLifecycle('updated');
        
      } catch (error) {
        console.error(`[DOM Components] Error updating component ${this.name}:`, error);
      }
    }

    /**
     * Emit custom event
     */
    emit(eventName, detail = {}) {
      const event = new CustomEvent(`component:${eventName}`, {
        detail: {
          component: this,
          componentName: this.name,
          data: detail
        },
        bubbles: true,
        cancelable: true
      });

      // Dispatch from container
      this.container.dispatchEvent(event);
      
      // Also dispatch from document for global listening
      document.dispatchEvent(event);
    }

    /**
     * Add lifecycle callback
     */
    on(lifecycle, callback) {
      if (this.lifecycle[lifecycle]) {
        this.lifecycle[lifecycle].push(callback);
      }
    }

    /**
     * Call lifecycle callbacks
     */
    async _callLifecycle(name) {
      const callbacks = this.lifecycle[name] || [];
      
      for (const callback of callbacks) {
        try {
          await callback.call(this);
        } catch (error) {
          console.error(`[DOM Components] Error in ${name} lifecycle:`, error);
        }
      }
    }

    /**
     * Destroy component and cleanup
     */
    async destroy() {
      if (this.isDestroyed) return;

      try {
        await this._callLifecycle('beforeDestroy');

        // Destroy child components
        for (const child of this.children) {
          await child.destroy();
        }
        this.children.clear();

        // Remove scoped styles if no other instances
        if (scopedStyles.has(this.scopeId)) {
          const styleElement = scopedStyles.get(this.scopeId);
          if (styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
          }
          scopedStyles.delete(this.scopeId);
        }

        // Clear container
        if (this.container) {
          this.container.innerHTML = '';
        }

        // Remove references
        componentInstances.delete(this.container);
        componentData.delete(this);

        this.isDestroyed = true;
        this.isMounted = false;

        await this._callLifecycle('destroyed');

      } catch (error) {
        console.error(`[DOM Components] Error destroying component ${this.name}:`, error);
      }
    }
  }

  /**
   * Enhanced Elements.update() for component-friendly syntax
   * Supports multiple syntaxes including dot notation
   */
  function createEnhancedElementsUpdate() {
    return function(updates = {}) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Components] .update() called with invalid updates object');
        return;
      }

      // Process each key
      Object.entries(updates).forEach(([key, value]) => {
        // Check if key contains dot notation (e.g., "userName.textContent")
        if (key.includes('.')) {
          // Parse dot notation: "userName.textContent" -> elementId: "userName", property: "textContent"
          const dotIndex = key.indexOf('.');
          const elementId = key.substring(0, dotIndex);
          const property = key.substring(dotIndex + 1);
          
          const element = Elements[elementId];
          
          if (element) {
            // Check if property contains nested dots (e.g., "style.color")
            if (property.includes('.')) {
              const parts = property.split('.');
              let target = element;
              
              // Navigate to the nested property
              for (let i = 0; i < parts.length - 1; i++) {
                if (target[parts[i]]) {
                  target = target[parts[i]];
                } else {
                  console.warn(`[DOM Components] Property "${parts[i]}" not found on element "${elementId}"`);
                  return;
                }
              }
              
              // Set the final property
              const finalProp = parts[parts.length - 1];
              target[finalProp] = value;
            } else {
              // Direct property assignment
              if (property in element) {
                element[property] = value;
              } else {
                // Try as attribute
                element.setAttribute(property, value);
              }
            }
          } else {
            console.warn(`[DOM Components] Element with id "${elementId}" not found`);
          }
        } else {
          // Regular element ID key (no dot notation)
          const element = Elements[key];
          
          if (element) {
            // Element found - apply updates to it
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              // Check if value contains a nested .update() call result
              if (value._isUpdateCall) {
                // This is a deferred update - execute it now
                element.update(value._updates);
              } else {
                // Direct property updates - declarative style
                element.update(value);
              }
            } else {
              // Single value update
              console.warn(`[DOM Components] Invalid update value for element "${key}"`);
            }
          } else {
            console.warn(`[DOM Components] Element with id "${key}" not found`);
          }
        }
      });
    };
  }

  /**
   * Create a deferred update object for method chaining style
   * This allows: userName.update({ ... }) to be captured and executed later
   */
  function createDeferredUpdate(updates) {
    return {
      _isUpdateCall: true,
      _updates: updates
    };
  }

  /**
   * Enhanced element wrapper for component context
   * Wraps elements to support the method chaining style
   */
  function wrapElementForComponentUpdate(element) {
    if (!element) return null;
    
    return new Proxy(element, {
      get(target, prop) {
        if (prop === 'update') {
          // Return wrapped update that creates a deferred call
          return function(updates) {
            return createDeferredUpdate(updates);
          };
        }
        return target[prop];
      }
    });
  }

  /**
   * Components API - Main interface
   */
  const Components = {
    /**
     * Enhanced update method for declarative component updates
     * Supports multiple syntaxes:
     * 
     * 1. Declarative object style (recommended):
     *    Elements.update({
     *      userName: { textContent: data.name },
     *      userEmail: { textContent: data.email },
     *      userAvatar: { 
     *        src: data.avatar, 
     *        alt: data.name || "User Avatar" 
     *      }
     *    });
     * 
     * 2. Dot notation style (concise):
     *    Elements.update({
     *      "userName.textContent": data.name,
     *      "userEmail.textContent": data.email,
     *      userAvatar: { 
     *        src: data.avatar,
     *        alt: data.name || "User Avatar"
     *      }
     *    });
     * 
     * 3. Method chaining style:
     *    Elements.update({
     *      "userName.textContent": data.name,
     *      "userEmail.textContent": data.email,
     *      userAvatar: Elements.userAvatar.update({
     *        src: data.avatar,
     *        alt: data.name || "User Avatar"
     *      })
     *    });
     * 
     * 4. Nested property style:
     *    Elements.update({
     *      "myElement.style.color": "red",
     *      "myElement.style.fontSize": "16px"
     *    });
     */
    update: createEnhancedElementsUpdate(),

    /**
     * Register a component
     */
    register(name, definition) {
      if (typeof name !== 'string') {
        throw new Error('[DOM Components] Component name must be a string');
      }

      if (componentRegistry.has(name)) {
        console.warn(`[DOM Components] Component "${name}" already registered. Overwriting.`);
      }

      componentRegistry.set(name, definition);
      console.log(`[DOM Components] Component "${name}" registered`);
      
      return this;
    },

    /**
     * Load component from external file
     */
    async load(name, url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const content = await response.text();
        this.register(name, content);
        
        return this;
      } catch (error) {
        console.error(`[DOM Components] Failed to load component "${name}" from ${url}:`, error);
        throw error;
      }
    },

    /**
     * Render component
     */
    async render(name, container, data = {}) {
      if (!componentRegistry.has(name)) {
        throw new Error(`[DOM Components] Component "${name}" not registered`);
      }

      // Resolve container
      if (typeof container === 'string') {
        container = Elements[container] || document.querySelector(container);
        if (!container) {
          throw new Error(`[DOM Components] Container not found: ${container}`);
        }
      }

      // Destroy existing component
      const existing = componentInstances.get(container);
      if (existing) {
        await existing.destroy();
      }

      // Create and render new component
      const definition = componentRegistry.get(name);
      const component = new Component(name, definition, container, data);
      
      await component.render();
      
      return component;
    },

    /**
     * Render inline component
     */
    async renderInline(definition, container, data = {}) {
      const tempName = `inline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.register(tempName, definition);
      return this.render(tempName, container, data);
    },

    /**
     * Create a scoped context for component updates
     * This provides a more intuitive way to update multiple elements
     * 
     * @example
     * const { userName, userEmail, userAvatar } = Components.scope();
     * Components.update({
     *   userName: { textContent: data.name },
     *   userEmail: { textContent: data.email },
     *   userAvatar: { src: data.avatar, alt: data.name }
     * });
     */
    scope(...elementIds) {
      const scope = {};
      
      if (elementIds.length === 0) {
        // No specific IDs provided - return all available elements
        return new Proxy({}, {
          get(target, prop) {
            if (typeof prop === 'string') {
              const element = Elements[prop];
              return wrapElementForComponentUpdate(element);
            }
            return undefined;
          }
        });
      }
      
      // Create scope object with specified element IDs
      elementIds.forEach(id => {
        const element = Elements[id];
        if (element) {
          scope[id] = wrapElementForComponentUpdate(element);
        } else {
          console.warn(`[DOM Components] Element "${id}" not found in scope`);
          scope[id] = null;
        }
      });
      
      return scope;
    },

    /**
     * Batch update helper for multiple elements
     * Provides a cleaner syntax for updating multiple elements at once
     * 
     * @example
     * Components.batchUpdate({
     *   userName: { textContent: data.name },
     *   userEmail: { textContent: data.email },
     *   userStatus: { 
     *     textContent: data.status,
     *     classList: { toggle: 'active' }
     *   }
     * });
     */
    batchUpdate(updates) {
      if (!updates || typeof updates !== 'object') {
        console.warn('[DOM Components] batchUpdate called with invalid updates object');
        return;
      }

      Object.entries(updates).forEach(([elementId, elementUpdates]) => {
        const element = Elements[elementId];
        
        if (element && typeof element.update === 'function') {
          try {
            element.update(elementUpdates);
          } catch (error) {
            console.error(`[DOM Components] Error updating element "${elementId}":`, error);
          }
        } else if (!element) {
          console.warn(`[DOM Components] Element "${elementId}" not found for batchUpdate`);
        }
      });
      
      return this;
    },

    /**
     * Create a data binding helper for reactive updates
     * 
     * @example
     * const userBinding = Components.createBinding(['userName', 'userEmail'], (data) => ({
     *   userName: { textContent: data.name },
     *   userEmail: { textContent: data.email }
     * }));
     * 
     * userBinding.update({ name: 'John', email: 'john@example.com' });
     */
    createBinding(elementIds, mapFunction) {
      return {
        update(data) {
          const updates = mapFunction(data);
          Components.batchUpdate(updates);
        },
        
        elements: elementIds.reduce((acc, id) => {
          acc[id] = Elements[id];
          return acc;
        }, {})
      };
    },

    /**
     * Get component instance
     */
    getInstance(container) {
      if (typeof container === 'string') {
        container = Elements[container] || document.querySelector(container);
      }
      return componentInstances.get(container);
    },

    /**
     * Destroy component
     */
    async destroy(container) {
      const component = this.getInstance(container);
      if (component) {
        await component.destroy();
        return true;
      }
      return false;
    },

    /**
     * Check if component is registered
     */
    isRegistered(name) {
      return componentRegistry.has(name);
    },

    /**
     * Get registered components
     */
    getRegistered() {
      return Array.from(componentRegistry.keys());
    },

    /**
     * Unregister component
     */
    unregister(name) {
      const result = componentRegistry.delete(name);
      if (result) {
        console.log(`[DOM Components] Component "${name}" unregistered`);
      }
      return result;
    },

    /**
     * Auto-initialize components in DOM
     */
    async autoInit(root = document) {
      // Process data-component attributes (legacy support)
      const dataComponentElements = root.querySelectorAll('[data-component]');
      
      for (const element of dataComponentElements) {
        const componentName = element.getAttribute('data-component');
        
        if (componentName && this.isRegistered(componentName) && !componentInstances.has(element)) {
          try {
            const data = this._extractDataFromElement(element);
            await this.render(componentName, element, data);
          } catch (error) {
            console.error(`[DOM Components] Auto-init failed for ${componentName}:`, error);
          }
        }
      }

      // Process custom component tags like <UserCard />
      await this._processCustomTags(root);
    },

    /**
     * Process custom component tags
     */
    async _processCustomTags(root = document) {
      const allElements = root.querySelectorAll('*');
      
      const customElements = Array.from(allElements).filter(element => {
        const tagName = element.tagName.toLowerCase();
        return (this._isComponentTag(tagName) && !componentInstances.has(element));
      });

      for (const element of customElements) {
        const tagName = element.tagName.toLowerCase();
        const componentName = this._tagNameToComponentName(tagName);
        
        if (this.isRegistered(componentName)) {
          try {
            // Extract props from attributes
            const props = this._extractPropsFromElement(element);
            
            // Create container for component
            const container = document.createElement('div');
            container.className = `${componentName.toLowerCase()}-container`;
            
            // Replace custom tag with container
            element.parentNode.replaceChild(container, element);
            
            // Render component
            await this.render(componentName, container, props);
            
          } catch (error) {
            console.error(`[DOM Components] Error processing custom tag <${tagName}>:`, error);
          }
        }
      }
    },

    /**
     * Check if a tag name is a component tag
     */
    _isComponentTag(tagName) {
      // Skip standard HTML elements
      const standardTags = new Set([
        'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 
        'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 
        'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 
        'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 
        'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 
        'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 
        'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 
        'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 
        'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 
        'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 
        'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 
        'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 
        'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
      ]);

      if (standardTags.has(tagName)) {
        return false;
      }

      // Check if it looks like a component tag
      // Accept any tag that:
      // 1. Contains hyphens (kebab-case like user-card)
      // 2. Is a single word with length > 2 (like usercard, which could be UserCard)
      // 3. This allows both <user-card> and <usercard> / <UserCard> (browsers convert to lowercase)
      
      if (tagName.includes('-')) {
        // Kebab-case: user-card, my-component, etc.
        return /^[a-z]+(-[a-z0-9]+)+$/.test(tagName);
      } else {
        // Single word: must be longer than 2 chars to avoid false positives
        // This catches tags like: usercard, todolist, navbar, etc.
        // (which are UserCard, TodoList, NavBar in PascalCase)
        return /^[a-z][a-z0-9]*$/.test(tagName) && tagName.length > 2;
      }
    },

    /**
     * Convert tag name to component name
     */
    _tagNameToComponentName(tagName) {
      // Convert kebab-case to PascalCase
      // user-card -> UserCard
      // usercard -> UserCard (if registered as UserCard)
      
      if (tagName.includes('-')) {
        return tagName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      } else {
        // For single-word tags like "usercard", try multiple approaches:
        // 1. Exact match (usercard)
        if (this.isRegistered(tagName)) {
          return tagName;
        }
        
        // 2. Simple PascalCase (Usercard)
        const simplePascal = tagName.charAt(0).toUpperCase() + tagName.slice(1);
        if (this.isRegistered(simplePascal)) {
          return simplePascal;
        }
        
        // 3. Search through all registered components for a case-insensitive match
        const registeredComponents = this.getRegistered();
        const lowerTag = tagName.toLowerCase();
        
        for (const compName of registeredComponents) {
          if (compName.toLowerCase() === lowerTag) {
            return compName;
          }
        }
        
        // 4. Default to simple PascalCase
        return simplePascal;
      }
    },

    /**
     * Extract props from element attributes
     */
    _extractPropsFromElement(element) {
      const props = {};
      
      Array.from(element.attributes).forEach(attr => {
        const propName = this._attributeNameToPropName(attr.name);
        let value = attr.value;
        
        // Try to parse value intelligently
        try {
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          else if (value === 'null') value = null;
          else if (value === 'undefined') value = undefined;
          else if (!isNaN(value) && value !== '' && !isNaN(Number(value))) value = Number(value);
          else if ((value.startsWith('{') && value.endsWith('}')) ||
                   (value.startsWith('[') && value.endsWith(']'))) {
            value = JSON.parse(value);
          }
        } catch (e) {
          // Keep as string if parsing fails
        }
        
        props[propName] = value;
      });
      
      // Handle element content as children prop
      if (element.innerHTML.trim()) {
        props.children = element.innerHTML.trim();
      }
      
      return props;
    },

    /**
     * Convert attribute name to prop name
     */
    _attributeNameToPropName(attrName) {
      // Convert kebab-case to camelCase
      // user-name -> userName
      // data-user-id -> dataUserId
      return attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    },

    /**
     * Process HTML string and replace component tags
     */
    async processHTML(htmlString, container) {
      // Create temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlString;
      
      // Process custom tags in temporary container
      await this._processCustomTags(tempContainer);
      
      // Move processed content to target container
      if (container) {
        container.innerHTML = '';
        while (tempContainer.firstChild) {
          container.appendChild(tempContainer.firstChild);
        }
      }
      
      return tempContainer.innerHTML;
    },

    /**
     * Extract data from element for auto-init
     */
    _extractDataFromElement(element) {
      const data = {};
      
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'data-component' && attr.name.startsWith('data-')) {
          const key = attr.name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          
          let value = attr.value;
          try {
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(value) && value !== '') value = Number(value);
            else if ((value.startsWith('{') && value.endsWith('}')) ||
                     (value.startsWith('[') && value.endsWith(']'))) {
              value = JSON.parse(value);
            }
          } catch (e) {
            // Keep as string
          }
          
          data[key] = value;
        }
      });
      
      return data;
    },

    /**
     * Get component statistics
     */
    getStats() {
      return {
        registered: componentRegistry.size,
        active: Array.from(componentInstances.values()).filter(c => !c.isDestroyed).length,
        scopedStyles: scopedStyles.size
      };
    },

    /**
     * Destroy all components
     */
    async destroyAll() {
      const instances = Array.from(componentInstances.values());
      for (const instance of instances) {
        if (!instance.isDestroyed) {
          await instance.destroy();
        }
      }
    },

    /**
     * Configure component system
     */
    configure(options = {}) {
      // Future configuration options
      return this;
    }
  };

  // Auto-initialize components when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Delay auto-init slightly to allow inline scripts to register components first
        setTimeout(() => Components.autoInit(), 0);
      });
    } else {
      // DOM already loaded, initialize after a short delay to allow registration
      setTimeout(() => Components.autoInit(), 0);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      Components.destroyAll();
    });
  }

  // Extend Elements with the enhanced update method
  if (typeof global.Elements !== 'undefined' && global.Elements) {
    // Add the enhanced update method to Elements
    global.Elements.update = Components.update;
    console.log('[DOM Components] Elements.update() enhanced with dot notation support');
  }

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Components, Component };
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return { Components, Component };
    });
  } else {
    global.Components = Components;
    global.Component = Component;
  }

  console.log('[DOM Components] Traditional HTML5 component system loaded');

})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
