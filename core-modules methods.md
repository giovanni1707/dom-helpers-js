[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# DOM Helpers Library - Complete Method Reference v2.3.1

## 🎯 Core Helpers

### 1. **Elements Helper** (ID-based DOM access)
Access elements by their ID with automatic caching and the `.update()` method.

#### Access Methods
- `Elements.{id}` - Get element by ID (e.g., `Elements.myButton`)
- `Elements.get(id, fallback)` - Safe access with fallback
- `Elements.exists(id)` - Check if element exists
- `Elements.isCached(id)` - Check if element is cached
- `Elements.getMultiple(...ids)` - Get multiple elements
- `Elements.destructure(...ids)` - Destructure multiple elements into object
- `Elements.getRequired(...ids)` - Get required elements (throws if missing)
- `Elements.waitFor(...ids)` - Wait for elements to appear (async, 5s timeout)

#### Property Methods
- `Elements.setProperty(id, property, value)` - Set element property
- `Elements.getProperty(id, property, fallback)` - Get element property
- `Elements.setAttribute(id, attribute, value)` - Set attribute
- `Elements.getAttribute(id, attribute, fallback)` - Get attribute

#### Bulk Operations
- `Elements.update(updates)` - Update multiple elements by ID
  ```javascript
  Elements.update({
    title: { textContent: 'New Title', style: { color: 'red' } },
    submitBtn: { disabled: false }
  });
  ```

#### Utility Methods
- `Elements.stats()` - Get cache statistics
- `Elements.clear()` - Clear cache
- `Elements.destroy()` - Destroy helper
- `Elements.configure(options)` - Configure helper

---

### 2. **Collections Helper** (Class/Tag/Name-based access)
Access collections of elements by class, tag name, or name attribute.

#### Access Methods
- `Collections.ClassName.{className}` or `Collections.ClassName(className)`
- `Collections.TagName.{tagName}` or `Collections.TagName(tagName)`
- `Collections.Name.{name}` or `Collections.Name(name)`

#### Bulk Operations
- `Collections.update(updates)` - Update multiple collections with type prefixes
  ```javascript
  Collections.update({
    'class:btn': { style: { padding: '10px' } },
    'tag:p': { style: { lineHeight: '1.6' } },
    'name:username': { disabled: false },
    'btn': { style: { color: 'blue' } } // assumes class if no prefix
  });
  ```
  **Type Prefixes:** `class:`, `classname:`, `tag:`, `tagname:`, `name:`

#### Array-like Methods (on collections)
- `.toArray()` - Convert to array
- `.forEach(callback, thisArg)` - Iterate
- `.map(callback, thisArg)` - Map
- `.filter(callback, thisArg)` - Filter
- `.find(callback, thisArg)` - Find element
- `.some(callback, thisArg)` - Test if some match
- `.every(callback, thisArg)` - Test if all match
- `.reduce(callback, initialValue)` - Reduce

#### Utility Methods (on collections)
- `.first()` - Get first element
- `.last()` - Get last element
- `.at(index)` - Get element at index (supports negative)
- `.isEmpty()` - Check if empty
- `.item(index)` - Get element by index
- `.namedItem(name)` - Get element by name (if supported)

#### DOM Manipulation (on collections)
- `.addClass(className)` - Add class to all
- `.removeClass(className)` - Remove class from all
- `.toggleClass(className)` - Toggle class on all
- `.setProperty(prop, value)` - Set property on all
- `.setAttribute(attr, value)` - Set attribute on all
- `.setStyle(styles)` - Set styles on all
- `.on(event, handler)` - Add event listener to all
- `.off(event, handler)` - Remove event listener from all

#### Filtering Methods (on collections)
- `.visible()` - Filter visible elements
- `.hidden()` - Filter hidden elements
- `.enabled()` - Filter enabled elements
- `.disabled()` - Filter disabled elements

#### Helper Methods
- `Collections.stats()` - Get statistics
- `Collections.clear()` - Clear cache
- `Collections.destroy()` - Destroy helper
- `Collections.isCached(type, value)` - Check if cached
- `Collections.getMultiple(requests)` - Get multiple collections
  ```javascript
  Collections.getMultiple([
    { type: 'className', value: 'btn', as: 'buttons' },
    { type: 'tagName', value: 'div', as: 'divs' }
  ]);
  ```
- `Collections.waitFor(type, value, minCount, timeout)` - Wait for elements (async, default 5s)
- `Collections.enableEnhancedSyntax()` - Enable enhanced syntax
- `Collections.disableEnhancedSyntax()` - Disable enhanced syntax
- `Collections.configure(options)` - Configure helper

---

### 3. **Selector Helper** (querySelector/querySelectorAll with caching)
Query elements using CSS selectors with intelligent caching.

#### Query Methods
- `Selector.query(selector)` - querySelector (single element)
- `Selector.query.{property}` - Property-based access (enhanced syntax)
- `Selector.queryAll(selector)` - querySelectorAll (multiple elements)
- `Selector.queryAll.{property}` - Property-based collection access

#### Scoped Query Methods
- `Selector.Scoped.within(container, selector)` - Query within container (single)
- `Selector.Scoped.withinAll(container, selector)` - Query within container (multiple)

#### Bulk Operations
- `Selector.update(updates)` - Update multiple selectors
  ```javascript
  Selector.update({
    '#header': { textContent: 'Welcome!' },
    '.btn': { style: { padding: '10px 20px' } },
    'input[type="text"]': { placeholder: 'Enter text...' }
  });
  ```

#### Array-like Methods (on queryAll results)
Same as Collections: `.toArray()`, `.forEach()`, `.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`, `.first()`, `.last()`, `.at()`, `.isEmpty()`, `.item()`, `.entries()`, `.keys()`, `.values()`

#### DOM Manipulation (on queryAll results)
Same as Collections: `.addClass()`, `.removeClass()`, `.toggleClass()`, `.setProperty()`, `.setAttribute()`, `.setStyle()`, `.on()`, `.off()`

#### Filtering Methods (on queryAll results)
Same as Collections: `.visible()`, `.hidden()`, `.enabled()`, `.disabled()`, plus:
- `.within(selector)` - Query within results

#### Async Methods
- `Selector.waitFor(selector, timeout)` - Wait for selector (async, default 5s)
- `Selector.waitForAll(selector, minCount, timeout)` - Wait for multiple (async, default 5s)

#### Utility Methods
- `Selector.stats()` - Get statistics (includes selector type breakdown)
- `Selector.clear()` - Clear cache
- `Selector.destroy()` - Destroy helper
- `Selector.enableEnhancedSyntax()` - Enable enhanced syntax
- `Selector.disableEnhancedSyntax()` - Disable enhanced syntax
- `Selector.configure(options)` - Configure helper

---

## 4. 🔄 Universal `.update()` Method
Available on all elements and collections. Uses fine-grained change detection to only update what changed.

### Property Updates
- `textContent` - Set text content
- `innerHTML` - Set HTML content
- `innerText` - Set inner text
- `id`, `className`, `value`, etc. - Set any DOM property

### Style Updates
```javascript
style: { color: 'red', fontSize: '16px', backgroundColor: '#007bff' }
```
**Note:** Only updates style properties that have actually changed.

### classList Operations
```javascript
classList: {
  add: ['class1', 'class2'],        // or single: 'class1'
  remove: ['oldClass'],              // or single: 'oldClass'
  toggle: ['active'],                // or single: 'active'
  replace: ['old', 'new'],           // must be array with 2 elements
  contains: 'someClass'              // for debugging (logs to console)
}
```

### Attribute Operations
```javascript
// Object format (recommended)
setAttribute: { src: 'image.png', alt: 'Description', 'data-id': '123' }

// Legacy array format (single attribute)
setAttribute: ['src', 'image.png']

// Remove attributes
removeAttribute: ['disabled', 'hidden']  // or single: 'disabled'

// Get attribute (debugging)
getAttribute: 'data-id'  // logs to console
```

### Dataset Operations
```javascript
dataset: { userId: '123', action: 'submit', customValue: 'data' }
```

### Event Listener Operations
**Important:** Event listeners are automatically deduplicated. The same handler won't be added twice.

```javascript
// Array format (single event)
addEventListener: ['click', handler, { passive: true }]

// Object format (multiple events)
addEventListener: {
  click: handler,
  mouseover: [handler, { passive: true }],
  keydown: anotherHandler
}

// Remove listener
removeEventListener: ['click', handler, options]
```

**Enhanced Event Context:** Inside event handlers, both `e.target` and `this` automatically have the `.update()` method available.

### Method Calls
```javascript
focus: []
scrollIntoView: [{ behavior: 'smooth', block: 'center' }]
click: []
blur: []
select: []
// Any element method that accepts parameters
```

### Chaining
All `.update()` calls return the element/collection for chaining:
```javascript
Elements.myButton
  .update({ textContent: 'Click me' })
  .update({ style: { color: 'red' } });
```

---

## 5. 🏗️ createElement Enhancement

### Basic Creation
```javascript
// Native-style (always available)
const div = document.createElement('div');

// Enhanced shortcut (if imported)
const button = createElement('button', {
  textContent: 'Click me',
  className: 'btn btn-primary',
  style: { color: 'blue' }
});

// With native options (Web Components)
const customEl = createElement('custom-element', { is: 'my-element' });
```

### Bulk Creation
```javascript
const elements = createElementsBulk({
  HEADER: { textContent: 'Title', className: 'header' },
  P: { textContent: 'Paragraph', style: { color: 'red' } },
  DIV_1: { className: 'container' },
  DIV_2: { className: 'sidebar' },
  BUTTON: {
    textContent: 'Submit',
    addEventListener: ['click', handleClick]
  }
});

// Also available as:
// createElement.bulk(definitions)
// DOMHelpers.createElementsBulk(definitions)
```

#### Bulk Result Object Methods
- `.P`, `.HEADER`, `.DIV_1` - Direct element access
- `.toArray(...tagNames)` - Get elements as array
  ```javascript
  elements.toArray('HEADER', 'P')  // [headerEl, pEl]
  elements.toArray()               // all elements
  ```
- `.ordered(...tagNames)` - Alias for toArray
- `.all` - All elements array (getter)
- `.updateMultiple(updates)` - Update multiple elements
  ```javascript
  elements.updateMultiple({
    HEADER: { style: { fontSize: '24px' } },
    P: { textContent: 'Updated' }
  });
  ```
- `.count` - Element count (getter)
- `.keys` - Array of keys (getter)
- `.has(key)` - Check if element exists
- `.get(key, fallback)` - Get with fallback
- `.forEach(callback)` - callback(element, key, index)
- `.map(callback)` - callback(element, key, index)
- `.filter(callback)` - callback(element, key, index)
- `.appendTo(container)` - Append all to container
- `.appendToOrdered(container, ...tagNames)` - Append specific elements in order

### Global Enhancement (Opt-in)
```javascript
// Enable enhancement for ALL document.createElement calls
DOMHelpers.enableCreateElementEnhancement();

// Now all elements have .update()
const div = document.createElement('div');
div.update({ textContent: 'Enhanced!' });

// Disable enhancement
DOMHelpers.disableCreateElementEnhancement();

// Check status
DOMHelpers.isCreateElementEnhanced();  // true/false
```

**Warning:** Global enhancement modifies native `document.createElement`. Use with caution.

---

## 6. 🌐 DOMHelpers Global Object

### Properties
- `DOMHelpers.Elements` - Elements helper
- `DOMHelpers.Collections` - Collections helper
- `DOMHelpers.Selector` - Selector helper
- `DOMHelpers.createElement` - Enhanced createElement (if available)
- `DOMHelpers.createElementsBulk` - Bulk creation (if available)
- `DOMHelpers.bulk` - Alias for createElementsBulk
- `DOMHelpers.version` - Library version (2.3.1)

### Helper Classes (Advanced)
- `DOMHelpers.ProductionElementsHelper`
- `DOMHelpers.ProductionCollectionHelper`
- `DOMHelpers.ProductionSelectorHelper`

### Methods
- `DOMHelpers.isReady()` - Check if all core helpers available
- `DOMHelpers.getStats()` - Get combined statistics from all helpers
- `DOMHelpers.clearAll()` - Clear all caches
- `DOMHelpers.destroyAll()` - Destroy all helpers and clean up
- `DOMHelpers.configure(options)` - Configure all helpers at once
  ```javascript
  // Global config (applies to all)
  DOMHelpers.configure({
    enableLogging: true,
    maxCacheSize: 500
  });
  
  // Per-helper config
  DOMHelpers.configure({
    elements: { maxCacheSize: 100 },
    collections: { enableLogging: false },
    selector: { enableSmartCaching: true }
  });
  ```
- `DOMHelpers.enableCreateElementEnhancement()` - Enable global createElement enhancement
- `DOMHelpers.disableCreateElementEnhancement()` - Disable enhancement
- `DOMHelpers.isCreateElementEnhanced()` - Check enhancement status
- `DOMHelpers.getInfo()` - Get comprehensive state information
- `DOMHelpers.debug()` - Print diagnostic information to console

---

## 7. 📊 Statistics & Cache Management

### Available on all helpers:
- `.stats()` - Get performance statistics
  ```javascript
  {
    hits: 150,
    misses: 50,
    hitRate: 0.75,
    cacheSize: 45,
    uptime: 30000,
    lastCleanup: 1234567890,
    // Selector only:
    selectorBreakdown: { id: 10, class: 20, tag: 5, ... }
  }
  ```
- `.clear()` - Clear cache manually
- `.destroy()` - Clean up and remove observers
- `.configure(options)` - Update configuration

### Configuration Options
```javascript
{
  // Logging
  enableLogging: false,           // Enable console logging
  
  // Caching
  autoCleanup: true,              // Automatic cache cleanup
  cleanupInterval: 30000,         // Cleanup interval (ms)
  maxCacheSize: 1000,             // Maximum cache entries
  enableSmartCaching: true,       // Selector only: intelligent cache invalidation
  
  // Performance
  debounceDelay: 16,              // Mutation observer debounce (ms)
  
  // Features
  enableEnhancedSyntax: true      // Enable proxy-based syntax
}
```

### Cache Behavior
- **Elements:** Caches by element ID, invalidates on ID changes or removal
- **Collections:** Caches by type:value pairs, invalidates on DOM mutations
- **Selector:** Intelligent invalidation based on selector patterns and affected attributes

### Automatic Cleanup
- MutationObserver tracks DOM changes
- Stale cache entries removed automatically
- Configurable cleanup intervals
- Manual cleanup available via `.clear()`

---

## 8. 🔧 Advanced Features

### Change Detection
The `.update()` method uses fine-grained change detection:
- Compares new values with current values
- Only applies updates that actually changed
- Deep equality comparison for objects
- Prevents unnecessary DOM operations

### Event Listener Deduplication
```javascript
// This handler is only added once, even if called multiple times
element.update({
  addEventListener: ['click', myHandler]
});
element.update({
  addEventListener: ['click', myHandler]  // Ignored (already added)
});
```

### Proxy-Based Access
Enhanced syntax uses JavaScript Proxies for intuitive property access:
```javascript
// These are equivalent:
Elements.myButton
Elements['myButton']

// Property normalization in Selector:
Selector.query.myButton      // becomes querySelector('#myButton')
Selector.query.btnPrimary    // becomes querySelector('.btn-primary')
```

### MutationObserver Integration
All helpers use MutationObserver to:
- Track DOM changes automatically
- Invalidate stale cache entries
- Maintain cache accuracy
- Debounce updates for performance

### Memory Management
- WeakMap storage for element metadata
- Automatic cleanup on page unload
- Configurable cache size limits
- Manual cache clearing available

---

## 9. 📚 Module System Support

### UMD (Universal Module Definition)
Works in all environments:
- **Browser globals:** `window.DOMHelpers`, `window.Elements`, etc.
- **CommonJS/Node.js:** `const { Elements } = require('./dom-helpers.js');`
- **AMD/RequireJS:** `define(['dom-helpers'], function(DOMHelpers) { ... });`
- **ES Modules:** `import { Elements } from './dom-helpers.js';`

### Individual Module Imports
```javascript
// Import specific helpers
import UpdateUtility from './update-utility.js';
import { Elements } from './elements-helper.js';
import { Collections } from './collections-helper.js';
import { Selector } from './selector-helper.js';
import { createElement } from './create-element.js';

// Or import everything
import DOMHelpers from './dom-helpers.js';
```

---

## 10. 🎨 Usage Examples

### Quick Start
```javascript
// Access element by ID
const button = Elements.myButton;

// Update element
button.update({
  textContent: 'Click me!',
  style: { color: 'blue', padding: '10px' },
  addEventListener: ['click', () => alert('Clicked!')]
});

// Access collection by class
const buttons = Collections.ClassName.btn;
buttons.update({
  style: { borderRadius: '5px' }
});

// Query with CSS selector
const inputs = Selector.queryAll('input[type="text"]');
inputs.setProperty('placeholder', 'Enter text...');
```

### Bulk Operations
```javascript
// Update multiple elements at once
Elements.update({
  header: { textContent: 'New Header' },
  footer: { textContent: 'Copyright 2024' },
  sidebar: { style: { width: '250px' } }
});

// Update multiple collections
Collections.update({
  'class:btn': { style: { padding: '8px 16px' } },
  'tag:p': { style: { lineHeight: '1.6' } }
});

// Update multiple selectors
Selector.update({
  '#main-nav': { style: { position: 'fixed' } },
  '.card': { classList: { add: 'shadow' } }
});
```

### Element Creation
```javascript
// Create single element
const div = createElement('div', {
  className: 'container',
  style: { maxWidth: '1200px' },
  innerHTML: '<h1>Hello</h1>'
});

// Create multiple elements
const ui = createElementsBulk({
  HEADER: { className: 'header', textContent: 'My App' },
  MAIN: { className: 'main' },
  FOOTER: { className: 'footer' }
});

// Append in order
ui.appendToOrdered(document.body, 'HEADER', 'MAIN', 'FOOTER');
```

### Async Operations
```javascript
// Wait for elements to appear
const { loginForm, submitBtn } = await Elements.waitFor('loginForm', 'submitBtn');

// Wait for collection
const buttons = await Collections.waitFor('className', 'btn', 3, 5000);

// Wait for selector
const modal = await Selector.waitFor('#modal', 10000);
```

---

## 📊 Summary

**Total Public Methods: 150+**

- **Elements Helper:** 20+ methods
- **Collections Helper:** 40+ methods (including collection methods)
- **Selector Helper:** 40+ methods (including queryAll methods)
- **Universal .update():** 15+ operation types
- **createElement:** 20+ methods (including bulk result methods)
- **DOMHelpers Global:** 15+ methods
- **Statistics & Config:** 10+ methods per helper

**Key Features:**
✅ Intelligent caching with automatic invalidation  
✅ Fine-grained change detection  
✅ Event listener deduplication  
✅ MutationObserver integration  
✅ Proxy-based enhanced syntax  
✅ Universal `.update()` method  
✅ Bulk operations support  
✅ Async element waiting  
✅ UMD module support  
✅ Memory-efficient WeakMap storage  
✅ Configurable performance options  
✅ Comprehensive statistics tracking  

---

**Version:** 2.3.1  
**License:** MIT  
**Author:** DOM Helpers Team
