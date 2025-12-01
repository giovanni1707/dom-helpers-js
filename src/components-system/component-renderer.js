/**
 * DOM Helpers - Component Renderer Module
 *
 * Component rendering, custom tags processing, and auto-initialization.
 *
 * Features:
 * - Component rendering to containers
 * - Custom tag support (<user-card>, <UserCard>)
 * - Auto-initialization from DOM
 * - Props extraction from attributes
 * - Inline component rendering
 * - Optimized DOM scanning
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
    global.DOMHelpersComponentRenderer = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  let ComponentCore, ComponentRegistry;

  // Try to load from require
  if (typeof require !== 'undefined') {
    try {
      ComponentCore = require('./component-core.js');
      ComponentRegistry = require('./component-registry.js');
    } catch (e) {
      // Not available
    }
  }

  // Try global
  if (!ComponentCore) {
    const globalObj = typeof window !== 'undefined' ? window : global;
    ComponentCore = globalObj.ComponentHelpers?.core;
    ComponentRegistry = globalObj.ComponentHelpers?.registry;
  }

  if (!ComponentCore) {
    console.error('[Component Renderer] component-core.js not found. Please load it first.');
    return {};
  }

  if (!ComponentRegistry) {
    console.error('[Component Renderer] component-registry.js not found. Please load it first.');
    return {};
  }

  const { Component, componentInstances } = ComponentCore;
  const { get: getComponent, has: hasComponent, getAll: getAllComponents } = ComponentRegistry;

  // ============================================================================
  // STANDARD HTML TAGS
  // ============================================================================

  const STANDARD_TAGS = new Set([
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

  // ============================================================================
  // RENDERING FUNCTIONS
  // ============================================================================

  /**
   * Render a component to a container
   */
  async function render(name, container, data = {}) {
    if (!hasComponent(name)) {
      throw new Error(`[Component Renderer] Component "${name}" not registered`);
    }

    // Resolve container
    const resolvedContainer = _resolveContainer(container);
    if (!resolvedContainer) {
      throw new Error(`[Component Renderer] Container not found: ${container}`);
    }

    // Destroy existing component
    const existing = componentInstances.get(resolvedContainer);
    if (existing) {
      await existing.destroy();
    }

    // Create and render new component
    const definition = getComponent(name);
    const component = new Component(name, definition, resolvedContainer, data);

    await component.render();

    return component;
  }

  /**
   * Render inline component
   */
  async function renderInline(definition, container, data = {}) {
    const tempName = `inline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    ComponentRegistry.register(tempName, definition);
    return render(tempName, container, data);
  }

  /**
   * Get component instance from container
   */
  function getInstance(container) {
    const resolvedContainer = _resolveContainer(container);
    return resolvedContainer ? componentInstances.get(resolvedContainer) : null;
  }

  /**
   * Destroy component in container
   */
  async function destroy(container) {
    const component = getInstance(container);
    if (component) {
      await component.destroy();
      return true;
    }
    return false;
  }

  /**
   * Resolve container element
   */
  function _resolveContainer(container) {
    if (!container) return null;

    // Already an element
    if (container instanceof Element) {
      return container;
    }

    // String selector
    if (typeof container === 'string') {
      // Try Elements helper first
      const globalObj = typeof window !== 'undefined' ? window : global;
      if (globalObj.Elements && globalObj.Elements[container]) {
        return globalObj.Elements[container];
      }

      // Try querySelector
      return document.querySelector(container);
    }

    return null;
  }

  // ============================================================================
  // CUSTOM TAGS PROCESSING
  // ============================================================================

  /**
   * Auto-initialize components in DOM
   */
  async function autoInit(root = document) {
    // Process data-component attributes (legacy support)
    await _processDataComponents(root);

    // Process custom component tags like <UserCard />
    await _processCustomTags(root);
  }

  /**
   * Process [data-component] attributes
   */
  async function _processDataComponents(root) {
    const elements = root.querySelectorAll('[data-component]');

    for (const element of elements) {
      const componentName = element.getAttribute('data-component');

      if (componentName && hasComponent(componentName) && !componentInstances.has(element)) {
        try {
          const data = _extractDataFromElement(element);
          await render(componentName, element, data);
        } catch (error) {
          console.error(`[Component Renderer] Auto-init failed for ${componentName}:`, error);
        }
      }
    }
  }

  /**
   * Process custom component tags
   * Optimized to avoid scanning entire DOM unnecessarily
   */
  async function _processCustomTags(root = document) {
    // Get all registered components
    const registeredComponents = getAllComponents();
    if (registeredComponents.length === 0) return;

    // Build selectors for known component tags
    const selectors = [];

    registeredComponents.forEach(name => {
      // Convert component name to possible tag names
      const tagNames = _componentNameToTagNames(name);
      tagNames.forEach(tag => selectors.push(tag));
    });

    // Also scan for generic custom element patterns
    // This catches any kebab-case or long single-word tags
    const allElements = root.querySelectorAll('*');
    const customElements = [];

    for (const element of allElements) {
      const tagName = element.tagName.toLowerCase();

      // Skip if already processed
      if (componentInstances.has(element)) continue;

      // Check if it's a component tag
      if (_isComponentTag(tagName)) {
        const componentName = _tagNameToComponentName(tagName);
        if (hasComponent(componentName)) {
          customElements.push(element);
        }
      }
    }

    // Render custom elements
    for (const element of customElements) {
      const tagName = element.tagName.toLowerCase();
      const componentName = _tagNameToComponentName(tagName);

      try {
        // Extract props from attributes
        const props = _extractPropsFromElement(element);

        // Create container for component
        const container = document.createElement('div');
        container.className = `${componentName.toLowerCase()}-container`;

        // Replace custom tag with container
        element.parentNode.replaceChild(container, element);

        // Render component
        await render(componentName, container, props);

      } catch (error) {
        console.error(`[Component Renderer] Error processing custom tag <${tagName}>:`, error);
      }
    }
  }

  /**
   * Check if a tag name is a component tag
   */
  function _isComponentTag(tagName) {
    // Skip standard HTML elements
    if (STANDARD_TAGS.has(tagName)) {
      return false;
    }

    // Accept any tag that:
    // 1. Contains hyphens (kebab-case like user-card)
    // 2. Is a single word with length > 2 (like usercard, which could be UserCard)

    if (tagName.includes('-')) {
      // Kebab-case: user-card, my-component, etc.
      return /^[a-z]+(-[a-z0-9]+)+$/.test(tagName);
    } else {
      // Single word: must be longer than 2 chars to avoid false positives
      return /^[a-z][a-z0-9]*$/.test(tagName) && tagName.length > 2;
    }
  }

  /**
   * Convert tag name to component name
   */
  function _tagNameToComponentName(tagName) {
    // Convert kebab-case to PascalCase: user-card -> UserCard
    if (tagName.includes('-')) {
      return tagName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    }

    // For single-word tags, try multiple approaches
    // 1. Exact match (usercard)
    if (hasComponent(tagName)) {
      return tagName;
    }

    // 2. Simple PascalCase (Usercard)
    const simplePascal = tagName.charAt(0).toUpperCase() + tagName.slice(1);
    if (hasComponent(simplePascal)) {
      return simplePascal;
    }

    // 3. Search for case-insensitive match
    const registeredComponents = getAllComponents();
    const lowerTag = tagName.toLowerCase();

    for (const compName of registeredComponents) {
      if (compName.toLowerCase() === lowerTag) {
        return compName;
      }
    }

    // 4. Default to simple PascalCase
    return simplePascal;
  }

  /**
   * Convert component name to possible tag names
   */
  function _componentNameToTagNames(componentName) {
    const tags = [];

    // Convert PascalCase to kebab-case: UserCard -> user-card
    const kebab = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    tags.push(kebab);

    // Add lowercase version: UserCard -> usercard
    tags.push(componentName.toLowerCase());

    // Add exact name if different
    if (componentName !== kebab && componentName !== componentName.toLowerCase()) {
      tags.push(componentName);
    }

    return tags;
  }

  /**
   * Extract data from element attributes (data-* pattern)
   */
  function _extractDataFromElement(element) {
    const data = {};

    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'data-component' && attr.name.startsWith('data-')) {
        const key = attr.name
          .replace(/^data-/, '')
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

        data[key] = _parseAttributeValue(attr.value);
      }
    });

    return data;
  }

  /**
   * Extract props from element attributes (all attributes)
   */
  function _extractPropsFromElement(element) {
    const props = {};

    Array.from(element.attributes).forEach(attr => {
      const propName = _attributeNameToPropName(attr.name);
      props[propName] = _parseAttributeValue(attr.value);
    });

    // Handle element content as children prop
    if (element.innerHTML.trim()) {
      props.children = element.innerHTML.trim();
    }

    return props;
  }

  /**
   * Convert attribute name to prop name
   */
  function _attributeNameToPropName(attrName) {
    // Convert kebab-case to camelCase: user-name -> userName
    return attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Parse attribute value intelligently
   */
  function _parseAttributeValue(value) {
    // Boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Null/undefined
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;

    // Numbers
    if (!isNaN(value) && value !== '' && !isNaN(Number(value))) {
      return Number(value);
    }

    // JSON objects/arrays
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']'))) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // Keep as string
      }
    }

    return value;
  }

  /**
   * Process HTML string and replace component tags
   */
  async function processHTML(htmlString, container) {
    // Create temporary container
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlString;

    // Process custom tags in temporary container
    await _processCustomTags(tempContainer);

    // Move processed content to target container
    if (container) {
      const resolvedContainer = _resolveContainer(container);
      if (resolvedContainer) {
        resolvedContainer.innerHTML = '';
        while (tempContainer.firstChild) {
          resolvedContainer.appendChild(tempContainer.firstChild);
        }
      }
    }

    return tempContainer.innerHTML;
  }

  /**
   * Destroy all components
   */
  async function destroyAll() {
    const instances = Array.from(componentInstances.values());
    for (const instance of instances) {
      if (!instance.isDestroyed) {
        await instance.destroy();
      }
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  const ComponentRenderer = {
    // Rendering
    render,
    renderInline,
    getInstance,
    destroy,
    destroyAll,

    // Auto-initialization
    autoInit,
    processHTML,

    // Utilities
    isComponentTag: _isComponentTag,
    tagNameToComponentName: _tagNameToComponentName,
    componentNameToTagNames: _componentNameToTagNames,

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

    globalObj.ComponentHelpers.renderer = ComponentRenderer;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  if (typeof console !== 'undefined') {
    console.log('[DOM Helpers Component Renderer] v2.0.0 initialized');
  }

  return ComponentRenderer;
});
