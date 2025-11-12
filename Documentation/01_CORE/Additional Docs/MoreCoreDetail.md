[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Library - Complete Documentation

**Version:** 2.3.1  
**License:** MIT  


---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
   - [Elements Helper](#elements-helper)
   - [Collections Helper](#collections-helper)
   - [Selector Helper](#selector-helper)
   - [Update System](#update-system)
   - [createElement Enhancement](#createelement-enhancement)
6. [Advanced Usage](#advanced-usage)
7. [Performance & Optimization](#performance--optimization)
8. [Migration Guide](#migration-guide)
9. [Troubleshooting](#troubleshooting)
10. [Examples & Recipes](#examples--recipes)

---

## Introduction

DOM Helpers is a high-performance vanilla JavaScript library that provides intelligent caching, fine-grained change detection, and a unified `.update()` API for DOM manipulation. It eliminates repetitive DOM queries and optimizes updates automatically.

### Why DOM Helpers?

**Before:**
```javascript
// Repetitive, verbose, error-prone
const button = document.getElementById('submit-btn');
button.textContent = 'Loading...';
button.disabled = true;
button.style.backgroundColor = '#ccc';
button.classList.add('loading');

const items = document.getElementsByClassName('list-item');
for (let i = 0; i < items.length; i++) {
  items[i].style.color = 'blue';
  items[i].setAttribute('data-processed', 'true');
}
```

**After:**
```javascript
// Clean, declarative, optimized
Elements.submitBtn.update({
  textContent: 'Loading...',
  disabled: true,
  style: { backgroundColor: '#ccc' },
  classList: { add: 'loading' }
});

Collections.ClassName.listItem.update({
  style: { color: 'blue' },
  dataset: { processed: 'true' }
});
```

### Key Features

✅ **Intelligent Caching** - Elements cached and auto-invalidated on DOM changes  
✅ **Fine-Grained Updates** - Only applies changes when values actually differ  
✅ **Unified `.update()` API** - One method for all DOM manipulations  
✅ **Zero Dependencies** - Pure vanilla JavaScript  
✅ **Framework Agnostic** - Works with React, Vue, Angular, or plain JS  
✅ **TypeScript Ready** - Full type definitions included  
✅ **Production Tested** - Battle-tested caching and memory management

---

## Installation

### Via CDN

```html
<!-- Unminified (development) -->
<script src="https://cdn.example.com/dom-helpers@2.3.1/dom-helpers.js"></script>

<!-- Minified (production) -->
<script src="https://cdn.example.com/dom-helpers@2.3.1/dom-helpers.min.js"></script>
```

### Via NPM

```bash
npm install dom-helpers-js
```

```javascript
// ES6 Module
import { Elements, Collections, Selector } from 'dom-helpers-js';

// CommonJS
const { Elements, Collections, Selector } = require('dom-helpers-js');
```

### Direct Download

Download `dom-helpers.js` and include it in your HTML:

```html
<script src="path/to/dom-helpers.js"></script>
<script>
  // Global variables available: Elements, Collections, Selector, DOMHelpers
  console.log(Elements, Collections, Selector);
</script>
```

---

## Quick Start

### Basic Usage (5-Minute Guide)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="dom-helpers.js"></script>
</head>
<body>
  <h1 id="title">Hello World</h1>
  <button id="myButton">Click Me</button>
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  
  <script>
    // 1. Access elements by ID (cached automatically)
    Elements.title.update({
      textContent: 'Welcome to DOM Helpers!',
      style: { color: 'blue', fontSize: '32px' }
    });

    // 2. Add event listener with enhanced features
    Elements.myButton.update({
      addEventListener: ['click', (e) => {
        // e.target.update() is automatically available!
        e.target.update({
          textContent: 'Clicked!',
          classList: { add: 'active' }
        });
      }]
    });

    // 3. Update all elements with same class
    Collections.ClassName.card.update({
      style: { 
        padding: '20px', 
        border: '1px solid #ddd',
        borderRadius: '8px'
      }
    });

    // 4. Query with CSS selectors
    Selector.query('.card').update({
      textContent: 'Updated Card'
    });
  </script>
</body>
</html>
```

---

## Core Concepts

### 1. Intelligent Caching

DOM Helpers caches element references and automatically invalidates them when the DOM changes:

```javascript
// First access: queries DOM
const btn1 = Elements.myButton; // DOM query executed

// Subsequent access: returns cached element
const btn2 = Elements.myButton; // Cache hit (instant)

// When DOM changes, cache auto-invalidates
document.getElementById('myButton').remove();
const btn3 = Elements.myButton; // null (cache was invalidated)
```

### 2. The `.update()` Method

Every element and collection gets a universal `.update()` method:

```javascript
element.update({
  // Standard properties
  textContent: 'New text',
  innerHTML: '<strong>Bold</strong>',
  value: 'input value',
  disabled: true,
  
  // Styles (object notation)
  style: {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '16px'
  },
  
  // Classes (multiple operations)
  classList: {
    add: ['class1', 'class2'],
    remove: 'oldClass',
    toggle: 'active'
  },
  
  // Attributes (multiple formats)
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Button'
  },
  
  // Event listeners
  addEventListener: {
    click: (e) => console.log('clicked'),
    mouseover: (e) => console.log('hover')
  },
  
  // Dataset
  dataset: {
    userId: '456',
    action: 'submit'
  },
  
  // Any DOM method
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

### 3. Three Access Patterns

**Elements Helper** - Access by ID:
```javascript
Elements.myButton        // Get element with id="myButton"
Elements['my-button']    // Get element with id="my-button"
Elements.get('myButton') // Explicit get with fallback option
```

**Collections Helper** - Access by class/tag/name:
```javascript
Collections.ClassName.card     // All elements with class="card"
Collections.TagName.div        // All <div> elements
Collections.Name.username      // All elements with name="username"
```

**Selector Helper** - Access by CSS selector:
```javascript
Selector.query('.my-class')           // First matching element
Selector.queryAll('.my-class')        // All matching elements
Selector.Scoped.within('#container', '.item') // Scoped query
```

---

## API Reference

## Elements Helper

Access DOM elements by their `id` attribute with intelligent caching.

### Basic Access

```javascript
// Property access (most common)
const button = Elements.myButton;  // Gets element with id="myButton"

// Bracket notation (for IDs with special characters)
const nav = Elements['main-nav'];  // Gets element with id="main-nav"

// Explicit get method
const title = Elements.get('title', fallbackElement);
```

### Methods

#### `Elements.update(updates)`

Bulk update multiple elements by their IDs in a single call.

```javascript
Elements.update({
  title: { 
    textContent: 'New Title',
    style: { color: 'blue' }
  },
  subtitle: { 
    textContent: 'New Subtitle',
    style: { fontSize: '18px' }
  },
  submitBtn: { 
    disabled: false,
    textContent: 'Submit'
  }
});

// Returns results object:
// {
//   title: { success: true, element: <h1> },
//   subtitle: { success: true, element: <p> },
//   submitBtn: { success: true, element: <button> }
// }
```

#### `Elements.destructure(...ids)`

Get multiple elements as an object (useful for destructuring).

```javascript
const { header, footer, sidebar } = Elements.destructure(
  'header', 
  'footer', 
  'sidebar'
);

// Use the elements
header.update({ textContent: 'My App' });
footer.update({ style: { padding: '20px' } });
```

#### `Elements.getRequired(...ids)`

Get multiple elements, throws error if any are missing.

```javascript
try {
  const { loginForm, emailInput, passwordInput } = Elements.getRequired(
    'loginForm',
    'emailInput', 
    'passwordInput'
  );
  
  // All elements guaranteed to exist here
  loginForm.addEventListener('submit', handleLogin);
  
} catch (error) {
  console.error('Missing required elements:', error.message);
}
```

#### `Elements.waitFor(...ids)`

Wait for elements to appear in the DOM (useful for dynamic content).

```javascript
// Wait up to 5 seconds for elements
const { dynamicContent } = await Elements.waitFor('dynamicContent');

// Custom timeout
const elements = await Elements.waitFor('lazyElement', { timeout: 10000 });
```

#### `Elements.get(id, fallback)`

Safely get an element with a fallback value.

```javascript
const button = Elements.get('myButton', null);
if (button) {
  button.update({ disabled: true });
}

// With fallback element
const defaultDiv = document.createElement('div');
const container = Elements.get('container', defaultDiv);
```

#### `Elements.exists(id)`

Check if an element exists.

```javascript
if (Elements.exists('modal')) {
  Elements.modal.update({ style: { display: 'block' } });
}
```

#### `Elements.getMultiple(...ids)`

Get multiple elements (alias for destructure).

```javascript
const elements = Elements.getMultiple('btn1', 'btn2', 'btn3');
// Returns: { btn1: <button>, btn2: <button>, btn3: <button> }
```

#### `Elements.setProperty(id, property, value)`

Set a property on an element by ID.

```javascript
Elements.setProperty('myInput', 'value', 'New Value');
Elements.setProperty('myButton', 'disabled', true);
```

#### `Elements.getProperty(id, property, fallback)`

Get a property value from an element.

```javascript
const value = Elements.getProperty('myInput', 'value', '');
const isDisabled = Elements.getProperty('myButton', 'disabled', false);
```

#### `Elements.setAttribute(id, attribute, value)`

Set an attribute on an element.

```javascript
Elements.setAttribute('myImage', 'src', 'new-image.jpg');
Elements.setAttribute('myLink', 'href', 'https://example.com');
```

#### `Elements.getAttribute(id, attribute, fallback)`

Get an attribute value from an element.

```javascript
const src = Elements.getAttribute('myImage', 'src', 'default.jpg');
const href = Elements.getAttribute('myLink', 'href', '#');
```

### Utility Methods

#### `Elements.stats()`

Get cache statistics.

```javascript
const stats = Elements.stats();
console.log(stats);
// {
//   hits: 150,        // Cache hits
//   misses: 45,       // Cache misses
//   hitRate: 0.77,    // Hit rate (77%)
//   cacheSize: 23,    // Number of cached elements
//   uptime: 45000     // Time since last cleanup (ms)
// }
```

#### `Elements.clear()`

Manually clear the cache.

```javascript
Elements.clear(); // Clears all cached elements
```

#### `Elements.isCached(id)`

Check if an element is in the cache.

```javascript
if (Elements.isCached('myButton')) {
  console.log('Button is cached');
}
```

#### `Elements.configure(options)`

Configure Elements helper options.

```javascript
Elements.configure({
  enableLogging: true,       // Enable console logging
  autoCleanup: true,         // Auto cleanup stale cache
  cleanupInterval: 30000,    // Cleanup every 30 seconds
  maxCacheSize: 1000         // Maximum cache size
});
```

### Element `.update()` Method

Every element accessed through Elements helper has an `.update()` method:

```javascript
Elements.myButton.update({
  // Text content
  textContent: 'Click Me',
  innerHTML: '<strong>Click</strong> Me',
  
  // Properties
  value: 'input value',
  disabled: true,
  checked: true,
  
  // Styles
  style: {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '16px',
    padding: '10px 20px'
  },
  
  // Classes
  classList: {
    add: 'btn-primary',              // Add single class
    add: ['btn', 'btn-large'],       // Add multiple classes
    remove: 'old-class',             // Remove class
    toggle: 'active',                // Toggle class
    replace: ['old', 'new']          // Replace class
  },
  
  // Attributes
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Submit button',
    'data-action': 'submit'
  },
  
  // Or array format (legacy)
  setAttribute: ['src', 'image.jpg'],
  
  // Remove attributes
  removeAttribute: 'disabled',
  removeAttribute: ['disabled', 'hidden'],
  
  // Dataset
  dataset: {
    userId: '456',
    action: 'submit',
    timestamp: Date.now()
  },
  
  // Event listeners
  addEventListener: ['click', handleClick],
  addEventListener: ['click', handleClick, { once: true }],
  
  // Multiple events (object format)
  addEventListener: {
    click: handleClick,
    mouseover: handleHover,
    focus: [handleFocus, { once: true }]
  },
  
  // Remove event listeners
  removeEventListener: ['click', handleClick],
  
  // Call DOM methods
  focus: [],
  blur: [],
  click: [],
  scrollIntoView: [{ behavior: 'smooth', block: 'center' }],
  remove: []
});

// Chaining is supported
Elements.myButton
  .update({ textContent: 'Step 1' })
  .update({ classList: { add: 'active' } })
  .update({ style: { color: 'green' } });
```

---

## Collections Helper

Access collections of elements by class name, tag name, or name attribute.

### Basic Access

```javascript
// By class name
const cards = Collections.ClassName.card;
const buttons = Collections.ClassName['btn-primary'];

// By tag name
const divs = Collections.TagName.div;
const paragraphs = Collections.TagName.p;

// By name attribute
const radios = Collections.Name.gender;
const checkboxes = Collections.Name.interests;

// Function-style access
const items = Collections.ClassName('list-item');
```

### Collection Properties

Every collection has these properties:

```javascript
const cards = Collections.ClassName.card;

// Length
console.log(cards.length);  // Number of elements

// Array-like access
console.log(cards[0]);      // First element
console.log(cards[1]);      // Second element

// Iteration
for (const card of cards) {
  console.log(card);
}
```

### Collection Methods

#### Array Methods

```javascript
const cards = Collections.ClassName.card;

// toArray() - Convert to array
const cardsArray = cards.toArray();

// forEach() - Iterate over elements
cards.forEach((card, index) => {
  console.log(`Card ${index}:`, card);
});

// map() - Transform elements
const texts = cards.map(card => card.textContent);

// filter() - Filter elements
const activeCards = cards.filter(card => card.classList.contains('active'));

// find() - Find first match
const firstActive = cards.find(card => card.classList.contains('active'));

// some() - Test if any match
const hasActive = cards.some(card => card.classList.contains('active'));

// every() - Test if all match
const allActive = cards.every(card => card.classList.contains('active'));

// reduce() - Reduce to single value
const totalHeight = cards.reduce((sum, card) => sum + card.offsetHeight, 0);
```

#### Utility Methods

```javascript
const cards = Collections.ClassName.card;

// first() - Get first element
const firstCard = cards.first();

// last() - Get last element
const lastCard = cards.last();

// at(index) - Get element at index (supports negative)
const thirdCard = cards.at(2);
const lastCard = cards.at(-1);

// isEmpty() - Check if collection is empty
if (cards.isEmpty()) {
  console.log('No cards found');
}
```

#### DOM Manipulation Methods

```javascript
const cards = Collections.ClassName.card;

// addClass() - Add class to all elements
cards.addClass('highlight');

// removeClass() - Remove class from all elements
cards.removeClass('old-class');

// toggleClass() - Toggle class on all elements
cards.toggleClass('expanded');

// setProperty() - Set property on all elements
cards.setProperty('textContent', 'Updated Card');

// setAttribute() - Set attribute on all elements
cards.setAttribute('data-processed', 'true');

// setStyle() - Set styles on all elements
cards.setStyle({
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px'
});

// on() - Add event listener to all elements
cards.on('click', (e) => {
  console.log('Card clicked:', e.target);
});

// off() - Remove event listener from all elements
cards.off('click', handleClick);
```

#### Filtering Methods

```javascript
const elements = Collections.ClassName.item;

// visible() - Get only visible elements
const visibleItems = elements.visible();

// hidden() - Get only hidden elements
const hiddenItems = elements.hidden();

// enabled() - Get only enabled elements
const enabledInputs = Collections.TagName.input.enabled();

// disabled() - Get only disabled elements
const disabledInputs = Collections.TagName.input.disabled();
```

### Collection `.update()` Method

Update all elements in a collection at once:

```javascript
Collections.ClassName.card.update({
  style: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  classList: {
    add: 'card-styled',
    remove: 'unstyled'
  },
  dataset: {
    processed: 'true',
    version: '2.0'
  }
});
```

### Bulk Update

Update multiple collections in one call:

```javascript
Collections.update({
  'class:card': {
    style: { padding: '20px' }
  },
  'tag:button': {
    classList: { add: 'styled-btn' }
  },
  'name:email': {
    placeholder: 'Enter email...'
  }
});

// Returns results:
// {
//   'class:card': { success: true, elementsUpdated: 5 },
//   'tag:button': { success: true, elementsUpdated: 3 },
//   'name:email': { success: true, elementsUpdated: 1 }
// }
```

### Configuration

```javascript
Collections.configure({
  enableLogging: true,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  enableEnhancedSyntax: true
});

// Get statistics
const stats = Collections.stats();
console.log(stats);

// Clear cache
Collections.clear();
```

---

## Selector Helper

Query DOM elements using CSS selectors with intelligent caching.

### Basic Queries

```javascript
// query() - Get first matching element
const button = Selector.query('.btn-primary');
const header = Selector.query('#header');
const firstPara = Selector.query('p');

// queryAll() - Get all matching elements
const buttons = Selector.queryAll('.btn');
const paragraphs = Selector.queryAll('p');
const inputs = Selector.queryAll('input[type="text"]');

// Property access (enhanced syntax)
const button = Selector.query.btnPrimary;  // Converts to .btn-primary
const header = Selector.query.idHeader;    // Converts to #header
```

### Scoped Queries

Query within a specific container:

```javascript
// within() - Query within container, return first match
const item = Selector.Scoped.within('#sidebar', '.item');
const link = Selector.Scoped.within(containerElement, 'a.active');

// withinAll() - Query within container, return all matches
const items = Selector.Scoped.withinAll('#sidebar', '.item');
const links = Selector.Scoped.withinAll(containerElement, 'a');
```

### Collection Methods

Results from `queryAll()` have all the same methods as Collections:

```javascript
const buttons = Selector.queryAll('.btn');

// Array methods
buttons.forEach(btn => console.log(btn));
const texts = buttons.map(btn => btn.textContent);
const activeButtons = buttons.filter(btn => btn.classList.contains('active'));

// Utility methods
const firstBtn = buttons.first();
const lastBtn = buttons.last();
const thirdBtn = buttons.at(2);

// DOM manipulation
buttons.addClass('styled');
buttons.setStyle({ padding: '10px' });
buttons.on('click', handleClick);

// Filtering
const visible = buttons.visible();
const enabled = buttons.enabled();

// Query within results
const icons = buttons.within('.icon');
```

### Update Methods

```javascript
// Single element update
Selector.query('.btn-primary').update({
  textContent: 'Click Me',
  style: { backgroundColor: 'blue' }
});

// Multiple elements update
Selector.queryAll('.btn').update({
  classList: { add: 'styled' },
  disabled: false
});

// Bulk update with selectors
Selector.update({
  '.btn-primary': {
    textContent: 'Submit',
    style: { padding: '10px 20px' }
  },
  'input[type="text"]': {
    placeholder: 'Enter text...',
    style: { fontSize: '14px' }
  },
  '#header': {
    textContent: 'Welcome!',
    style: { color: 'blue' }
  }
});
```

### Async Methods

#### `Selector.waitFor(selector, timeout)`

Wait for an element to appear in the DOM.

```javascript
try {
  // Wait up to 5 seconds (default)
  const element = await Selector.waitFor('.dynamic-content');
  element.update({ style: { display: 'block' } });
  
  // Custom timeout (10 seconds)
  const modal = await Selector.waitFor('#modal', 10000);
  
} catch (error) {
  console.error('Element not found:', error.message);
}
```

#### `Selector.waitForAll(selector, minCount, timeout)`

Wait for multiple elements to appear.

```javascript
try {
  // Wait for at least 3 items (within 5 seconds)
  const items = await Selector.waitForAll('.list-item', 3);
  items.update({ classList: { add: 'loaded' } });
  
  // Custom timeout
  const cards = await Selector.waitForAll('.card', 5, 10000);
  
} catch (error) {
  console.error('Not enough elements found:', error.message);
}
```

### Configuration

```javascript
Selector.configure({
  enableLogging: true,
  autoCleanup: true,
  cleanupInterval: 30000,
  maxCacheSize: 1000,
  enableSmartCaching: true,
  enableEnhancedSyntax: true
});

// Get statistics (includes selector type breakdown)
const stats = Selector.stats();
console.log(stats);
// {
//   hits: 200,
//   misses: 50,
//   hitRate: 0.80,
//   selectorBreakdown: {
//     id: 50,
//     class: 80,
//     tag: 30,
//     complex: 40
//   }
// }

// Clear cache
Selector.clear();

// Enable/disable enhanced syntax
Selector.enableEnhancedSyntax();
Selector.disableEnhancedSyntax();
```

---

## Update System

The `.update()` method is the core of DOM Helpers. It provides a unified, declarative API for all DOM manipulations.

### Supported Update Operations

#### 1. Text Content

```javascript
element.update({
  textContent: 'Plain text',
  innerHTML: '<strong>HTML</strong> content',
  innerText: 'Text with formatting'
});
```

#### 2. Properties

```javascript
element.update({
  value: 'input value',
  checked: true,
  disabled: false,
  selectedIndex: 2,
  href: 'https://example.com',
  src: 'image.jpg'
});
```

#### 3. Styles

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '16px',
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center'
  }
});
```

#### 4. Classes

```javascript
element.update({
  classList: {
    // Add single or multiple classes
    add: 'active',
    add: ['btn', 'btn-primary', 'btn-large'],
    
    // Remove single or multiple classes
    remove: 'inactive',
    remove: ['old', 'deprecated'],
    
    // Toggle single or multiple classes
    toggle: 'expanded',
    toggle: ['visible', 'highlighted'],
    
    // Replace a class
    replace: ['btn-old', 'btn-new'],
    
    // Check if class exists (logs to console)
    contains: 'active',
    contains: ['active', 'visible']
  }
});
```

#### 5. Attributes

```javascript
element.update({
  // Object format (recommended)
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Submit button',
    'data-action': 'submit',
    'src': 'image.jpg',
    'alt': 'Description'
  },
  
  // Array format (legacy)
  setAttribute: ['src', 'image.jpg'],
  
  // Remove attributes
  removeAttribute: 'disabled',
  removeAttribute: ['disabled', 'hidden', 'readonly'],
  
  // Read attribute (logs to console)
  getAttribute: 'data-id'
});
```

#### 6. Dataset

```javascript
element.update({
  dataset: {
    userId: '456',
    action: 'submit',
    timestamp: Date.now(),
    config: JSON.stringify({ theme: 'dark' })
  }
});

// Reads as:
// element.dataset.userId = '456'
// element.getAttribute('data-user-id') = '456'
```

#### 7. Event Listeners

```javascript
element.update({
  // Array format: [eventType, handler, options]
  addEventListener: ['click', handleClick],
  addEventListener: ['click', handleClick, { once: true }],
  
  // Object format (multiple events)
  addEventListener: {
    click: handleClick,
    mouseover: handleHover,
    focus: handleFocus,
    blur: [handleBlur, { passive: true }]
  },
  
  // Remove event listener
  removeEventListener: ['click', handleClick],
  removeEventListener: ['click', handleClick, { capture: true }]
});
```

**Enhanced Event Handlers:**

Event handlers automatically get `.update()` support on `e.target` and `this`:

```javascript
element.update({
  addEventListener: ['click', function(e) {
    // e.target.update() is automatically available!
    e.target.update({
      textContent: 'Clicked!',
      classList: { add: 'clicked' }
    });
    
    // this.update() also works (for non-arrow functions)
    this.update({
      style: { backgroundColor: 'green' }
    });
  }]
});
```

#### 8. DOM Methods

Call any DOM method using the `.update()` API:

```javascript
element.update({
  // Methods without arguments
  focus: [],
  blur: [],
  click: [],
  remove: [],
  
  // Methods with arguments
  scrollIntoView: [{ behavior: 'smooth', block: 'center' }],
  setAttribute: ['data-id', '123'],
  appendChild: [childElement],
  insertBefore: [newElement, referenceElement],
  
  // Multiple method calls
  focus: [],
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

### Fine-Grained Change Detection

DOM Helpers only applies updates when values actually change:

```javascript
// First update: all properties applied
element.update({
  textContent: 'Hello',
  style: { color: 'red' }
});

// Second update: only textContent changes (style stays same)
element.update({
  textContent: 'World',
  style: { color: 'red' }  // Skipped (no change)
});

// This optimization happens automatically!
```

### Chaining Updates

All `.update()` calls return the element/collection for chaining:

```javascript
Elements.myButton
  .update({ textContent: 'Loading...' })
  .update({ disabled: true })
  .update({ classList: { add: 'loading' } })
  .update({ style: { opacity: 0.5 } });

// Or chain with native methods
Elements.myForm
  .update({ style: { display: 'block' } })
  .addEventListener('submit', handleSubmit);
```

### Error Handling

Updates fail gracefully with warnings:

```javascript
element.update({
  validProperty: 'works',
  invalidProperty: 'fails silently',  // Warns but doesn't throw
  style: { color: 'red' }              // Other updates still apply
});

// Check console for warnings:
// [DOM Helpers] Unknown property or method: invalidProperty
```

---

## createElement Enhancement

DOM Helpers optionally enhances `document.createElement()` to automatically add `.update()` support and enable declarative element creation.

### Opt-In Enhancement

```javascript
// Enable enhancement (opt-in)
DOMHelpers.enableCreateElementEnhancement();

// Now createElement returns enhanced elements
const button = document.createElement('button');
button.update({ textContent: 'Click Me' }); // Works!

// Disable enhancement
DOMHelpers.disableCreateElementEnhancement();
```

### Direct Usage (Recommended)

Use `createElement` directly without overriding native method:

```javascript
const button = createElement('button', {
  textContent: 'Click Me',
  className: 'btn btn-primary',
  style: {
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white'
  },
  addEventListener: {
    click: () => console.log('clicked')
  }
});

document.body.appendChild(button);
```

### Bulk Element Creation

Create multiple elements with configuration in one call:

```javascript
```javascript
const elements = createElement.bulk({
  // Single elements
  H1: {
    textContent: 'Welcome!',
    className: 'title',
    style: { color: 'blue', fontSize: '32px' }
  },
  
  P: {
    textContent: 'This is a paragraph',
    className: 'description'
  },
  
  BUTTON: {
    textContent: 'Submit',
    className: 'btn btn-primary',
    addEventListener: {
      click: () => console.log('Button clicked')
    }
  },
  
  // Multiple instances with numbered suffixes
  DIV_1: {
    className: 'card',
    style: { padding: '20px' }
  },
  
  DIV_2: {
    className: 'card',
    style: { padding: '20px' }
  },
  
  INPUT_1: {
    type: 'text',
    placeholder: 'Email',
    name: 'email'
  },
  
  INPUT_2: {
    type: 'password',
    placeholder: 'Password',
    name: 'password'
  }
});

// Access created elements
console.log(elements.H1);      // <h1> element
console.log(elements.BUTTON);  // <button> element
console.log(elements.DIV_1);   // First <div>
console.log(elements.DIV_2);   // Second <div>

// Helper methods
console.log(elements.all);           // Array of all elements
console.log(elements.count);         // Number of elements (7)
console.log(elements.keys);          // ['H1', 'P', 'BUTTON', 'DIV_1', ...]

// Get specific elements as array
const [h1, para] = elements.toArray('H1', 'P');

// Get elements in specific order
const ordered = elements.ordered('BUTTON', 'H1', 'P');

// Check if element exists
if (elements.has('BUTTON')) {
  console.log('Button was created');
}

// Get with fallback
const span = elements.get('SPAN', document.createElement('span'));

// Update multiple elements at once
elements.updateMultiple({
  H1: { style: { color: 'red' } },
  P: { style: { fontSize: '16px' } },
  BUTTON: { disabled: true }
});

// Iterate over elements
elements.forEach((element, key, index) => {
  console.log(`${index}: ${key}`, element);
});

// Map over elements
const textContents = elements.map((el, key) => el.textContent);

// Filter elements
const visibleElements = elements.filter(el => el.style.display !== 'none');

// Append all to container
elements.appendTo('#container');
// or
elements.appendTo(document.getElementById('container'));

// Append specific elements in order
elements.appendToOrdered('#form', 'INPUT_1', 'INPUT_2', 'BUTTON');
```

### Complete Example: Building a Form

```javascript
// Create form elements
const formElements = createElement.bulk({
  FORM: {
    id: 'login-form',
    className: 'form'
  },
  
  H2: {
    textContent: 'Login',
    className: 'form-title'
  },
  
  LABEL_1: {
    textContent: 'Email:',
    setAttribute: { for: 'email' }
  },
  
  INPUT_1: {
    type: 'email',
    id: 'email',
    name: 'email',
    placeholder: 'Enter your email',
    required: true
  },
  
  LABEL_2: {
    textContent: 'Password:',
    setAttribute: { for: 'password' }
  },
  
  INPUT_2: {
    type: 'password',
    id: 'password',
    name: 'password',
    placeholder: 'Enter your password',
    required: true
  },
  
  BUTTON: {
    type: 'submit',
    textContent: 'Login',
    className: 'btn btn-primary'
  },
  
  DIV: {
    className: 'error-message',
    style: { display: 'none', color: 'red' }
  }
});

// Assemble the form
formElements.FORM.appendChild(formElements.H2);
formElements.FORM.appendChild(formElements.LABEL_1);
formElements.FORM.appendChild(formElements.INPUT_1);
formElements.FORM.appendChild(formElements.LABEL_2);
formElements.FORM.appendChild(formElements.INPUT_2);
formElements.FORM.appendChild(formElements.BUTTON);
formElements.FORM.appendChild(formElements.DIV);

// Or use appendToOrdered for cleaner code
formElements.appendToOrdered('FORM', 
  'H2', 'LABEL_1', 'INPUT_1', 
  'LABEL_2', 'INPUT_2', 'BUTTON', 'DIV'
);

// Add form handler
formElements.FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = formElements.INPUT_1.value;
  const password = formElements.INPUT_2.value;
  
  if (!email || !password) {
    formElements.DIV.update({
      textContent: 'Please fill in all fields',
      style: { display: 'block' }
    });
    return;
  }
  
  // Submit form...
  console.log('Submitting:', { email, password });
});

// Append to page
document.body.appendChild(formElements.FORM);
```

---

## Advanced Usage

### 1. Complex Form Validation

```javascript
// Get form elements
const { emailInput, passwordInput, submitBtn, errorMsg } = Elements.destructure(
  'emailInput',
  'passwordInput', 
  'submitBtn',
  'errorMsg'
);

// Validation function
function validateForm() {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  let isValid = true;
  let errors = [];
  
  // Email validation
  if (!email || !email.includes('@')) {
    errors.push('Valid email required');
    emailInput.update({
      classList: { add: 'error' },
      style: { borderColor: 'red' }
    });
    isValid = false;
  } else {
    emailInput.update({
      classList: { remove: 'error' },
      style: { borderColor: '#ddd' }
    });
  }
  
  // Password validation
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
    passwordInput.update({
      classList: { add: 'error' },
      style: { borderColor: 'red' }
    });
    isValid = false;
  } else {
    passwordInput.update({
      classList: { remove: 'error' },
      style: { borderColor: '#ddd' }
    });
  }
  
  // Update error message
  if (!isValid) {
    errorMsg.update({
      textContent: errors.join(', '),
      style: { display: 'block', color: 'red' }
    });
    submitBtn.update({ disabled: true });
  } else {
    errorMsg.update({ style: { display: 'none' } });
    submitBtn.update({ disabled: false });
  }
  
  return isValid;
}

// Add real-time validation
emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

// Form submission
Elements.loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    submitBtn.update({
      textContent: 'Logging in...',
      disabled: true
    });
    
    // Submit to server...
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        errorMsg.update({
          textContent: data.message,
          style: { display: 'block' }
        });
        submitBtn.update({
          textContent: 'Login',
          disabled: false
        });
      }
    });
  }
});
```

### 2. Dynamic List Management

```javascript
class TodoList {
  constructor(containerId) {
    this.container = Elements[containerId];
    this.items = [];
  }
  
  addItem(text) {
    const id = `todo-${Date.now()}`;
    
    const item = createElement('div', {
      id: id,
      className: 'todo-item',
      style: {
        padding: '10px',
        margin: '5px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    });
    
    const textSpan = createElement('span', {
      textContent: text,
      className: 'todo-text'
    });
    
    const deleteBtn = createElement('button', {
      textContent: 'Delete',
      className: 'btn-delete',
      addEventListener: {
        click: () => this.removeItem(id)
      }
    });
    
    const completeBtn = createElement('button', {
      textContent: 'Complete',
      className: 'btn-complete',
      addEventListener: {
        click: () => this.toggleComplete(id)
      }
    });
    
    item.appendChild(textSpan);
    item.appendChild(completeBtn);
    item.appendChild(deleteBtn);
    
    this.container.appendChild(item);
    this.items.push({ id, text, completed: false });
  }
  
  removeItem(id) {
    Elements[id].update({ remove: [] });
    this.items = this.items.filter(item => item.id !== id);
  }
  
  toggleComplete(id) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.completed = !item.completed;
      
      Elements[id].update({
        classList: { toggle: 'completed' },
        style: {
          opacity: item.completed ? '0.5' : '1',
          textDecoration: item.completed ? 'line-through' : 'none'
        }
      });
    }
  }
  
  clearCompleted() {
    this.items
      .filter(item => item.completed)
      .forEach(item => this.removeItem(item.id));
  }
  
  updateAll(updates) {
    Collections.ClassName.todoItem.update(updates);
  }
}

// Usage
const todoList = new TodoList('todoContainer');
todoList.addItem('Buy groceries');
todoList.addItem('Walk the dog');
todoList.addItem('Finish project');

// Update all items at once
todoList.updateAll({
  style: { backgroundColor: '#f0f0f0' }
});
```

### 3. Modal System

```javascript
class Modal {
  constructor(options = {}) {
    this.options = {
      title: options.title || 'Modal',
      content: options.content || '',
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
      showCancel: options.showCancel !== false
    };
    
    this.create();
  }
  
  create() {
    const modal = createElement.bulk({
      OVERLAY: {
        className: 'modal-overlay',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000'
        },
        addEventListener: {
          click: (e) => {
            if (e.target === modal.OVERLAY) {
              this.close();
            }
          }
        }
      },
      
      CONTAINER: {
        className: 'modal-container',
        style: {
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
          maxWidth: '500px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      },
      
      HEADER: {
        className: 'modal-header',
        style: {
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        },
        textContent: this.options.title
      },
      
      CONTENT: {
        className: 'modal-content',
        style: {
          marginBottom: '20px'
        },
        innerHTML: this.options.content
      },
      
      FOOTER: {
        className: 'modal-footer',
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }
      },
      
      CONFIRM_BTN: {
        textContent: 'Confirm',
        className: 'btn btn-primary',
        addEventListener: {
          click: () => {
            this.options.onConfirm();
            this.close();
          }
        }
      },
      
      CANCEL_BTN: {
        textContent: 'Cancel',
        className: 'btn btn-secondary',
        style: {
          display: this.options.showCancel ? 'block' : 'none'
        },
        addEventListener: {
          click: () => {
            this.options.onCancel();
            this.close();
          }
        }
      }
    });
    
    // Assemble modal
    modal.CONTAINER.appendChild(modal.HEADER);
    modal.CONTAINER.appendChild(modal.CONTENT);
    modal.FOOTER.appendChild(modal.CANCEL_BTN);
    modal.FOOTER.appendChild(modal.CONFIRM_BTN);
    modal.CONTAINER.appendChild(modal.FOOTER);
    modal.OVERLAY.appendChild(modal.CONTAINER);
    
    document.body.appendChild(modal.OVERLAY);
    
    this.elements = modal;
  }
  
  open() {
    this.elements.OVERLAY.update({
      style: { display: 'flex' }
    });
  }
  
  close() {
    this.elements.OVERLAY.update({
      style: { display: 'none' }
    });
  }
  
  destroy() {
    this.elements.OVERLAY.remove();
  }
  
  updateContent(html) {
    this.elements.CONTENT.update({
      innerHTML: html
    });
  }
}

// Usage
const confirmModal = new Modal({
  title: 'Confirm Action',
  content: '<p>Are you sure you want to delete this item?</p>',
  onConfirm: () => {
    console.log('Item deleted');
  },
  onCancel: () => {
    console.log('Cancelled');
  }
});

confirmModal.open();
```

### 4. Tabs System

```javascript
class Tabs {
  constructor(containerId) {
    this.container = Elements[containerId];
    this.tabs = [];
    this.activeTab = null;
    this.init();
  }
  
  init() {
    const tabsHeader = createElement('div', {
      className: 'tabs-header',
      style: {
        display: 'flex',
        borderBottom: '2px solid #ddd',
        marginBottom: '20px'
      }
    });
    
    const tabsContent = createElement('div', {
      className: 'tabs-content'
    });
    
    this.container.appendChild(tabsHeader);
    this.container.appendChild(tabsContent);
    
    this.header = tabsHeader;
    this.content = tabsContent;
  }
  
  addTab(label, content) {
    const tabId = `tab-${this.tabs.length}`;
    const contentId = `content-${this.tabs.length}`;
    
    const tabButton = createElement('button', {
      id: tabId,
      textContent: label,
      className: 'tab-button',
      style: {
        padding: '10px 20px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderBottom: '2px solid transparent'
      },
      addEventListener: {
        click: () => this.switchTab(tabId)
      }
    });
    
    const tabContent = createElement('div', {
      id: contentId,
      className: 'tab-content',
      style: { display: 'none' },
      innerHTML: content
    });
    
    this.header.appendChild(tabButton);
    this.content.appendChild(tabContent);
    
    this.tabs.push({ tabId, contentId, button: tabButton, content: tabContent });
    
    // Activate first tab
    if (this.tabs.length === 1) {
      this.switchTab(tabId);
    }
  }
  
  switchTab(tabId) {
    // Deactivate all tabs
    this.tabs.forEach(tab => {
      tab.button.update({
        classList: { remove: 'active' },
        style: { borderBottomColor: 'transparent' }
      });
      
      tab.content.update({
        style: { display: 'none' }
      });
    });
    
    // Activate selected tab
    const selectedTab = this.tabs.find(tab => tab.tabId === tabId);
    if (selectedTab) {
      selectedTab.button.update({
        classList: { add: 'active' },
        style: { borderBottomColor: 'blue' }
      });
      
      selectedTab.content.update({
        style: { display: 'block' }
      });
      
      this.activeTab = tabId;
    }
  }
  
  removeTab(tabId) {
    const index = this.tabs.findIndex(tab => tab.tabId === tabId);
    if (index !== -1) {
      const tab = this.tabs[index];
      tab.button.remove();
      tab.content.remove();
      this.tabs.splice(index, 1);
      
      // Switch to first tab if active tab was removed
      if (this.activeTab === tabId && this.tabs.length > 0) {
        this.switchTab(this.tabs[0].tabId);
      }
    }
  }
}

// Usage
const tabs = new Tabs('tabsContainer');
tabs.addTab('Home', '<h2>Home Content</h2><p>Welcome to the home tab!</p>');
tabs.addTab('Profile', '<h2>Profile</h2><p>Your profile information</p>');
tabs.addTab('Settings', '<h2>Settings</h2><p>Configure your preferences</p>');
```

### 5. Infinite Scroll

```javascript
class InfiniteScroll {
  constructor(containerId, options = {}) {
    this.container = Elements[containerId];
    this.options = {
      threshold: options.threshold || 200,
      loadMore: options.loadMore || (() => {}),
      ...options
    };
    
    this.loading = false;
    this.hasMore = true;
    
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => {
      if (this.shouldLoadMore()) {
        this.load();
      }
    });
  }
  
  shouldLoadMore() {
    if (!this.hasMore || this.loading) return false;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    return scrollTop + clientHeight >= scrollHeight - this.options.threshold;
  }
  
  async load() {
    this.loading = true;
    this.showLoader();
    
    try {
      const items = await this.options.loadMore();
      
      if (items.length === 0) {
        this.hasMore = false;
        this.showEndMessage();
      } else {
        this.renderItems(items);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      this.loading = false;
      this.hideLoader();
    }
  }
  
  renderItems(items) {
    items.forEach(item => {
      const element = createElement('div', {
        className: 'list-item',
        innerHTML: `<h3>${item.title}</h3><p>${item.description}</p>`,
        style: {
          padding: '20px',
          margin: '10px 0',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }
      });
      
      this.container.appendChild(element);
    });
  }
  
  showLoader() {
    if (!this.loader) {
      this.loader = createElement('div', {
        className: 'loader',
        textContent: 'Loading...',
        style: {
          padding: '20px',
          textAlign: 'center',
          color: '#666'
        }
      });
      this.container.appendChild(this.loader);
    }
    
    this.loader.update({ style: { display: 'block' } });
  }
  
  hideLoader() {
    if (this.loader) {
      this.loader.update({ style: { display: 'none' } });
    }
  }
  
  showEndMessage() {
    const endMessage = createElement('div', {
      className: 'end-message',
      textContent: 'No more items to load',
      style: {
        padding: '20px',
        textAlign: 'center',
        color: '#999'
      }
    });
    
    this.container.appendChild(endMessage);
  }
}

// Usage
const infiniteScroll = new InfiniteScroll('contentContainer', {
  threshold: 300,
  loadMore: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      { title: 'Item 1', description: 'Description 1' },
      { title: 'Item 2', description: 'Description 2' },
      { title: 'Item 3', description: 'Description 3' }
    ];
  }
});
```

---

## Performance & Optimization

### Caching Strategy

DOM Helpers uses a multi-layered caching approach:

1. **Map Cache**: Fast O(1) lookups for element references
2. **WeakMap Cache**: Metadata storage that doesn't prevent garbage collection
3. **Automatic Invalidation**: MutationObserver tracks DOM changes
4. **Debounced Updates**: Batch processing to reduce overhead

### Cache Statistics

Monitor cache performance:

```javascript
// Get detailed statistics
const elementsStats = Elements.stats();
console.log('Elements Cache:', elementsStats);
// {
//   hits: 500,
//   misses: 100,
//   hitRate: 0.83,  // 83% cache hit rate
//   cacheSize: 45,
//   uptime: 120000
// }

const collectionsStats = Collections.stats();
console.log('Collections Cache:', collectionsStats);

const selectorStats = Selector.stats();
console.log('Selector Cache:', selectorStats);
// {
//   ...
//   selectorBreakdown: {
//     id: 150,      // #id selectors
//     class: 200,   // .class selectors
//     tag: 50,      // tag selectors
//     complex: 100  // complex selectors
//   }
// }

// Get combined statistics
const allStats = DOMHelpers.getStats();
console.log('All Helpers:', allStats);
```

### Memory Management

```javascript
// Manual cache cleanup
Elements.clear();      // Clear Elements cache
Collections.clear();   // Clear Collections cache
Selector.clear();      // Clear Selector cache
DOMHelpers.clearAll(); // Clear all caches

// Automatic cleanup runs every 30 seconds (configurable)
Elements.configure({
  autoCleanup: true,
  cleanupInterval: 30000  // 30 seconds
});

// Check if element is cached
if (Elements.isCached('myButton')) {
  console.log('Button is cached');
}

// Get cache snapshot
const cachedIds = Elements.helper.getCacheSnapshot();
console.log('Cached element IDs:', cachedIds);
```

### Fine-Grained Updates

Only changed properties are applied:

```javascript
// Scenario: Update button 1000 times
for (let i = 0; i < 1000; i++) {
  Elements.myButton.update({
    textContent: 'Click Me',      // Applied once
    style: { color: 'red' },      // Applied once
    disabled: false               // Applied once
  });
}

// Without fine-grained detection: 3000 DOM operations
// With fine-grained detection: 3 DOM operations (999 skipped)
```

### Best Practices

#### 1. Batch Updates

```javascript
// ❌ Bad: Multiple individual updates
Elements.btn1.update({ style: { color: 'red' } });
Elements.btn2.update({ style: { color: 'red' } });
Elements.btn3.update({ style: { color: 'red' } });

// ✅ Good: Single bulk update
Elements.update({
  btn1: { style: { color: 'red' } },
  btn2: { style: { color: 'red' } },
  btn3: { style: { color: 'red' } }
});

// ✅ Best: Update collection
Collections.ClassName.btn.update({
  style: { color: 'red' }
});
```

#### 2. Reuse References

```javascript
// ❌ Bad: Repeated queries
function updateButton() {
  Elements.myButton.update({ textContent: 'Loading...' });
  Elements.myButton.update({ disabled: true });
  Elements.myButton.update({ classList: { add: 'loading' } });
}

// ✅ Good: Store reference
const button = Elements.myButton;
function updateButton() {
  button.update({ 
    textContent: 'Loading...',
    disabled: true,
    classList: { add: 'loading' }
  });
}

// ✅ Best: Single update call
function updateButton() {
  Elements.myButton.update({
    textContent: 'Loading...',
    disabled: true,
    classList: { add: 'loading' }
  });
}
```

#### 3. Use Collections for Multiple Elements

```javascript
// ❌ Bad: Loop through manual queries
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.style.color = 'blue';
  item.classList.add('processed');
});

// ✅ Good: Use Collections helper
Collections.ClassName.item.update({
  style: { color: 'blue' },
  classList: { add: 'processed' }
});
```

#### 4. Configure for Your Use Case

```javascript
// For static sites (minimal DOM changes)
DOMHelpers.configure({
  autoCleanup: false,      // Disable auto-cleanup
  maxCacheSize: 5000       // Larger cache
});

// For dynamic SPAs (frequent DOM changes)
DOMHelpers.configure({
  autoCleanup: true,
  cleanupInterval: 15000,  // More frequent cleanup
  maxCacheSize: 500        // Smaller cache
});

// For development
DOMHelpers.configure({
  enableLogging: true      // Enable console logging
});
```

### Performance Benchmarks

Typical performance improvements over vanilla JavaScript:

| Operation | Vanilla JS | DOM Helpers | Improvement |
|-----------|------------|-------------|-------------|
| Single element query (cached) | ~0.05ms | ~0.001ms | **50x faster** |
| Bulk updates (10 elements) | ~0.5ms | ~0.3ms | **1.7x faster** |
| Collection query (cached) | ~0.1ms | ~0.002ms | **50x faster** |
| Repeated updates (no change) | ~0.5ms | ~0.01ms | **50x faster** |

*Benchmarks run on Chrome 120, i7 processor, varies by browser and hardware*

---

## Migration Guide

### From Vanilla JavaScript

```javascript
// Before (Vanilla JS)
const button = document.getElementById('myButton');
button.textContent = 'Click Me';
button.disabled = false;
button.style.backgroundColor = 'blue';
button.classList.add('btn-primary');
button.addEventListener('click', handleClick);

// After (DOM Helpers)
Elements.myButton.update({
  textContent: 'Click Me',
  disabled: false,
  style: { backgroundColor: 'blue' },
  classList: { add: 'btn-primary' },
  addEventListener: ['click', handleClick]
});
```

### From jQuery

```javascript
// Before (jQuery)
$('#myButton')
  .text('Click Me')
  .prop('disabled', false)
  .css('background-color', 'blue')
  .addClass('btn-primary')
  .on('click', handleClick);

$('.card').css({ padding: '20px', border: '1px solid #ddd' });

// After (DOM Helpers)
Elements.myButton.update({
  textContent: 'Click Me',
  disabled: false,
  style: { backgroundColor: 'blue' },
  classList: { add: 'btn-primary' },
  addEventListener: ['click', handleClick]
});

Collections.ClassName.card.update({
  style: { padding: '20px', border: '1px solid #ddd' }
});
```

### From React (for non-component DOM manipulation)

```javascript
// Before (React + refs)
const buttonRef = useRef();

useEffect(() => {
  if (buttonRef.current) {
    buttonRef.current.textContent = 'Updated';
    buttonRef.current.style.color = 'red';
  }
}, []);

return <button ref={buttonRef}>Click</button>;

// After (DOM Helpers - for direct DOM access)
useEffect(() => {
  Elements.myButton?.update({
    textContent: 'Updated',
    style: { color: 'red' }
  });
}, []);

return <button id="myButton">Click</button>;
```

### Migration Checklist

- [ ] Replace `document.getElementById()` with `Elements.elementId`
- [ ] Replace `document.getElementsByClassName()` with `Collections.ClassName.className`
- [ ] Replace `document.querySelector()` with `Selector.query()`
- [ ] Replace `document.querySelectorAll()` with `Selector.queryAll()`
- [ ] Consolidate multiple property assignments into single `.update()` calls
- [ ] Replace loops over element collections with `.update()` on collections
- [ ] Update event listener attachments to use `.update()` API
- [ ] Remove manual caching code (DOM Helpers does this automatically)

---

## Troubleshooting

### Common Issues

#### 1. Element is `null` or `undefined`

**Problem:**
```javascript
const button = Elements.myButton;
console.log(button); // null
```

**Solutions:**
```javascript
// Check if element exists
if (Elements.exists('myButton')) {
  // Element exists
}

// Use fallback
const button = Elements.get('myButton', document.createElement('button'));

// Wait for element to appear
const button = await Elements.waitFor('myButton');

// Check HTML for correct ID
<button id="myButton">Click</button>  ✅
<button id="my-button">Click</button>
```javascript
// If using kebab-case IDs, use bracket notation
const button = Elements['my-button'];
```

#### 2. Updates Not Applying

**Problem:**
```javascript
Elements.myButton.update({ textContent: 'New Text' });
// Button text doesn't change
```

**Solutions:**
```javascript
// 1. Verify element exists
console.log(Elements.myButton); // Should not be null

// 2. Check for typos in property names
Elements.myButton.update({
  textContent: 'Correct',  // ✅
  textcontent: 'Wrong'     // ❌ Won't work
});

// 3. Ensure element is in the DOM
if (document.contains(Elements.myButton)) {
  Elements.myButton.update({ textContent: 'New Text' });
}

// 4. Check browser console for warnings
// DOM Helpers logs warnings for failed updates
```

#### 3. Event Listeners Not Working

**Problem:**
```javascript
Elements.myButton.update({
  addEventListener: ['click', handleClick]
});
// Click doesn't trigger handler
```

**Solutions:**
```javascript
// 1. Verify handler is defined
function handleClick(e) {
  console.log('Clicked!');
}

Elements.myButton.update({
  addEventListener: ['click', handleClick]
});

// 2. Check for duplicate listeners (they're automatically prevented)
// If you need to remove old listener first:
Elements.myButton.update({
  removeEventListener: ['click', oldHandler],
  addEventListener: ['click', newHandler]
});

// 3. Verify event type spelling
addEventListener: ['click', handler]    // ✅
addEventListener: ['onclick', handler]  // ❌

// 4. Use object format for multiple events
Elements.myButton.update({
  addEventListener: {
    click: handleClick,
    mouseover: handleHover
  }
});
```

#### 4. Cache Not Invalidating

**Problem:**
```javascript
// Element is removed from DOM but cache still returns old reference
const button = Elements.myButton;
button.remove();
const sameButton = Elements.myButton; // Still returns removed element
```

**Solutions:**
```javascript
// 1. MutationObserver takes a moment to process changes
// Wait a tick before re-querying
setTimeout(() => {
  const button = Elements.myButton; // Now null
}, 0);

// 2. Manually clear cache if needed
Elements.clear();

// 3. Use exists() to check if element is still in DOM
if (Elements.exists('myButton')) {
  // Element is valid
}

// 4. The cache auto-invalidates, but for immediate needs:
const button = document.getElementById('myButton'); // Direct query
```

#### 5. Memory Leaks

**Problem:**
```javascript
// Creating many elements without cleanup
for (let i = 0; i < 10000; i++) {
  const el = createElement('div');
  document.body.appendChild(el);
}
// Memory keeps growing
```

**Solutions:**
```javascript
// 1. Remove elements when done
for (let i = 0; i < 10000; i++) {
  const el = createElement('div');
  document.body.appendChild(el);
  // Later:
  el.remove();
}

// 2. Clear caches periodically
setInterval(() => {
  DOMHelpers.clearAll();
}, 60000); // Every minute

// 3. Use smaller cache sizes for dynamic apps
DOMHelpers.configure({
  maxCacheSize: 100
});

// 4. Destroy helpers when navigating away (SPA)
window.addEventListener('beforeunload', () => {
  DOMHelpers.destroyAll();
});
```

#### 6. TypeScript Errors

**Problem:**
```typescript
// Property 'myButton' does not exist on type 'ElementsHelper'
const button = Elements.myButton;
```

**Solutions:**
```typescript
// 1. Add type declaration
declare module 'dom-helpers-js' {
  interface ElementsHelper {
    myButton: HTMLButtonElement;
    myInput: HTMLInputElement;
    // ... other IDs
  }
}

// 2. Use explicit methods with types
const button = Elements.get('myButton') as HTMLButtonElement;

// 3. Use type assertions
const button = (Elements as any).myButton as HTMLButtonElement;

// 4. Create typed wrappers
function getElement<T extends HTMLElement>(id: string): T | null {
  return Elements.get(id) as T;
}

const button = getElement<HTMLButtonElement>('myButton');
```

#### 7. Collections Empty or Not Updating

**Problem:**
```javascript
const cards = Collections.ClassName.card;
console.log(cards.length); // 0, but cards exist in DOM
```

**Solutions:**
```javascript
// 1. Verify class name spelling
<div class="card">Card 1</div>  ✅
Collections.ClassName.card      ✅

<div class="cards">Card 1</div> 
Collections.ClassName.card      ❌ (wrong name)

// 2. Check if elements loaded (wait for DOM)
document.addEventListener('DOMContentLoaded', () => {
  const cards = Collections.ClassName.card;
  console.log(cards.length); // Now correct
});

// Or use async wait
const cards = await Collections.waitFor('className', 'card', 3);

// 3. Clear cache if DOM changed significantly
Collections.clear();

// 4. Use direct query to verify
const direct = document.getElementsByClassName('card');
console.log('Direct query:', direct.length);
```

#### 8. Selector Queries Return Null

**Problem:**
```javascript
const button = Selector.query('.btn-primary');
console.log(button); // null
```

**Solutions:**
```javascript
// 1. Verify selector syntax
Selector.query('.btn-primary')      // ✅ Class
Selector.query('#myButton')         // ✅ ID
Selector.query('button.btn')        // ✅ Element + class
Selector.query('.btn > .icon')      // ✅ Child selector

// 2. Wait for element to exist
const button = await Selector.waitFor('.btn-primary');

// 3. Check if element matches selector
const button = document.querySelector('.btn-primary');
console.log('Direct query:', button); // Verify selector works

// 4. Use more specific selector
Selector.query('.container .btn-primary')
```

### Debug Mode

Enable detailed logging to troubleshoot issues:

```javascript
// Enable logging for all helpers
DOMHelpers.configure({
  enableLogging: true
});

// Enable for specific helper
Elements.configure({ enableLogging: true });
Collections.configure({ enableLogging: true });
Selector.configure({ enableLogging: true });

// Console output will show:
// [Elements] Element with id 'myButton' not found
// [Collections] Invalidated 3 cache entries due to DOM changes
// [Selector] Cleanup completed. Removed 5 stale entries.
// [DOM Helpers] .update() called with invalid updates object
```

### Performance Debugging

```javascript
// Monitor cache performance
setInterval(() => {
  const stats = DOMHelpers.getStats();
  console.log('Cache Performance:', {
    elementsHitRate: stats.elements.hitRate,
    collectionsHitRate: stats.collections.hitRate,
    selectorHitRate: stats.selector.hitRate
  });
}, 5000);

// If hit rates are low (<50%), consider:
// 1. Elements are being created/destroyed frequently
// 2. Cache size is too small
// 3. Cleanup interval is too aggressive

// Adjust configuration
DOMHelpers.configure({
  maxCacheSize: 2000,        // Increase cache size
  cleanupInterval: 60000,    // Less frequent cleanup
  autoCleanup: false         // Disable if elements are stable
});
```

---

## Examples & Recipes

### Recipe 1: Dynamic Table with Sorting

```javascript
class SortableTable {
  constructor(containerId, data) {
    this.container = Elements[containerId];
    this.data = data;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.render();
  }
  
  render() {
    // Create table structure
    const tableElements = createElement.bulk({
      TABLE: {
        className: 'sortable-table',
        style: {
          width: '100%',
          borderCollapse: 'collapse'
        }
      },
      
      THEAD: {
        style: {
          backgroundColor: '#f5f5f5'
        }
      },
      
      TBODY: {}
    });
    
    // Create header row
    const headerRow = createElement('tr');
    const columns = Object.keys(this.data[0]);
    
    columns.forEach(column => {
      const th = createElement('th', {
        textContent: column,
        style: {
          padding: '12px',
          textAlign: 'left',
          cursor: 'pointer',
          userSelect: 'none'
        },
        addEventListener: {
          click: () => this.sort(column)
        }
      });
      
      headerRow.appendChild(th);
    });
    
    tableElements.THEAD.appendChild(headerRow);
    
    // Create data rows
    this.renderRows(tableElements.TBODY, this.data);
    
    // Assemble table
    tableElements.TABLE.appendChild(tableElements.THEAD);
    tableElements.TABLE.appendChild(tableElements.TBODY);
    this.container.appendChild(tableElements.TABLE);
    
    this.table = tableElements.TABLE;
    this.tbody = tableElements.TBODY;
  }
  
  renderRows(tbody, data) {
    tbody.innerHTML = '';
    
    data.forEach((row, index) => {
      const tr = createElement('tr', {
        style: {
          backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
        }
      });
      
      Object.values(row).forEach(value => {
        const td = createElement('td', {
          textContent: value,
          style: {
            padding: '12px',
            borderBottom: '1px solid #ddd'
          }
        });
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  }
  
  sort(column) {
    // Toggle direction if same column
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Sort data
    const sorted = [...this.data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    // Re-render rows
    this.renderRows(this.tbody, sorted);
    
    // Update header indicators
    const headers = Selector.queryAll('.sortable-table th');
    headers.forEach(th => {
      if (th.textContent === column) {
        th.update({
          textContent: `${column} ${this.sortDirection === 'asc' ? '▲' : '▼'}`,
          style: { fontWeight: 'bold' }
        });
      } else {
        th.update({
          textContent: th.textContent.replace(/[▲▼]/g, '').trim(),
          style: { fontWeight: 'normal' }
        });
      }
    });
  }
}

// Usage
const tableData = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Alice', age: 25, city: 'London' },
  { name: 'Bob', age: 35, city: 'Paris' }
];

const table = new SortableTable('tableContainer', tableData);
```

### Recipe 2: Toast Notifications

```javascript
class ToastNotification {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }
  
  createContainer() {
    const container = createElement('div', {
      id: 'toast-container',
      style: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }
    });
    
    document.body.appendChild(container);
    return container;
  }
  
  show(message, options = {}) {
    const id = `toast-${Date.now()}`;
    const type = options.type || 'info';
    const duration = options.duration || 3000;
    
    const colors = {
      success: { bg: '#4caf50', text: 'white' },
      error: { bg: '#f44336', text: 'white' },
      warning: { bg: '#ff9800', text: 'white' },
      info: { bg: '#2196f3', text: 'white' }
    };
    
    const toast = createElement('div', {
      id: id,
      className: `toast toast-${type}`,
      style: {
        padding: '16px 24px',
        backgroundColor: colors[type].bg,
        color: colors[type].text,
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '250px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
        cursor: 'pointer'
      },
      textContent: message,
      addEventListener: {
        click: () => this.hide(id)
      }
    });
    
    this.container.appendChild(toast);
    this.toasts.push(id);
    
    // Auto-hide after duration
    setTimeout(() => this.hide(id), duration);
  }
  
  hide(id) {
    const toast = Elements[id];
    if (toast) {
      toast.update({
        style: {
          animation: 'slideOut 0.3s ease-in',
          opacity: '0'
        }
      });
      
      setTimeout(() => {
        toast.remove();
        this.toasts = this.toasts.filter(t => t !== id);
      }, 300);
    }
  }
  
  success(message, options = {}) {
    this.show(message, { ...options, type: 'success' });
  }
  
  error(message, options = {}) {
    this.show(message, { ...options, type: 'error' });
  }
  
  warning(message, options = {}) {
    this.show(message, { ...options, type: 'warning' });
  }
  
  info(message, options = {}) {
    this.show(message, { ...options, type: 'info' });
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Usage
const toast = new ToastNotification();
toast.success('Operation completed successfully!');
toast.error('An error occurred');
toast.warning('Warning message', { duration: 5000 });
toast.info('Information message');
```

### Recipe 3: Autocomplete Input

```javascript
class Autocomplete {
  constructor(inputId, options = {}) {
    this.input = Elements[inputId];
    this.options = {
      minLength: options.minLength || 2,
      dataSource: options.dataSource || [],
      onSelect: options.onSelect || (() => {}),
      ...options
    };
    
    this.init();
  }
  
  init() {
    // Create dropdown container
    this.dropdown = createElement('div', {
      className: 'autocomplete-dropdown',
      style: {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderTop: 'none',
        maxHeight: '200px',
        overflowY: 'auto',
        display: 'none',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    });
    
    // Position dropdown below input
    this.input.parentElement.style.position = 'relative';
    this.input.parentElement.appendChild(this.dropdown);
    
    // Add event listeners
    this.input.update({
      addEventListener: {
        input: (e) => this.handleInput(e),
        blur: () => setTimeout(() => this.hideDropdown(), 200),
        keydown: (e) => this.handleKeydown(e)
      }
    });
  }
  
  async handleInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < this.options.minLength) {
      this.hideDropdown();
      return;
    }
    
    // Get filtered results
    let results;
    if (typeof this.options.dataSource === 'function') {
      results = await this.options.dataSource(query);
    } else {
      results = this.options.dataSource.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    this.showResults(results);
  }
  
  showResults(results) {
    if (results.length === 0) {
      this.hideDropdown();
      return;
    }
    
    this.dropdown.innerHTML = '';
    
    results.forEach((result, index) => {
      const item = createElement('div', {
        className: 'autocomplete-item',
        textContent: result,
        dataset: { index: index },
        style: {
          padding: '10px',
          cursor: 'pointer',
          borderBottom: '1px solid #f0f0f0'
        },
        addEventListener: {
          click: () => this.selectItem(result),
          mouseover: (e) => {
            e.target.update({
              style: { backgroundColor: '#f5f5f5' }
            });
          },
          mouseout: (e) => {
            e.target.update({
              style: { backgroundColor: 'white' }
            });
          }
        }
      });
      
      this.dropdown.appendChild(item);
    });
    
    this.dropdown.update({
      style: {
        display: 'block',
        width: `${this.input.offsetWidth}px`
      }
    });
    
    this.currentResults = results;
    this.selectedIndex = -1;
  }
  
  selectItem(value) {
    this.input.update({ value: value });
    this.hideDropdown();
    this.options.onSelect(value);
  }
  
  hideDropdown() {
    this.dropdown.update({
      style: { display: 'none' }
    });
  }
  
  handleKeydown(e) {
    const items = Collections.ClassName.autocompleteItem;
    
    if (items.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          items.length - 1
        );
        this.highlightItem();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.highlightItem();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectItem(this.currentResults[this.selectedIndex]);
        }
        break;
        
      case 'Escape':
        this.hideDropdown();
        break;
    }
  }
  
  highlightItem() {
    const items = Collections.ClassName.autocompleteItem;
    
    items.forEach((item, index) => {
      item.update({
        style: {
          backgroundColor: index === this.selectedIndex ? '#f5f5f5' : 'white'
        }
      });
    });
  }
}

// Usage
const autocomplete = new Autocomplete('searchInput', {
  minLength: 2,
  dataSource: async (query) => {
    // Simulate API call
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  },
  // Or use static data
  // dataSource: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
  onSelect: (value) => {
    console.log('Selected:', value);
  }
});
```

### Recipe 4: Drag and Drop List

```javascript
class DragDropList {
  constructor(listId) {
    this.list = Elements[listId];
    this.draggedItem = null;
    this.init();
  }
  
  init() {
    this.list.update({
      style: {
        listStyle: 'none',
        padding: '0'
      }
    });
    
    // Make existing items draggable
    this.makeItemsDraggable();
  }
  
  makeItemsDraggable() {
    const items = Selector.Scoped.withinAll(this.list, 'li');
    
    items.forEach(item => {
      this.makeItemDraggable(item);
    });
  }
  
  makeItemDraggable(item) {
    item.update({
      draggable: true,
      style: {
        padding: '15px',
        margin: '5px 0',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'move',
        transition: 'all 0.2s'
      },
      addEventListener: {
        dragstart: (e) => this.handleDragStart(e),
        dragend: (e) => this.handleDragEnd(e),
        dragover: (e) => this.handleDragOver(e),
        drop: (e) => this.handleDrop(e),
        dragenter: (e) => {
          e.target.update({
            style: { borderTop: '3px solid blue' }
          });
        },
        dragleave: (e) => {
          e.target.update({
            style: { borderTop: '1px solid #ddd' }
          });
        }
      }
    });
  }
  
  handleDragStart(e) {
    this.draggedItem = e.target;
    e.target.update({
      style: { opacity: '0.5' }
    });
    e.dataTransfer.effectAllowed = 'move';
  }
  
  handleDragEnd(e) {
    e.target.update({
      style: { 
        opacity: '1',
        borderTop: '1px solid #ddd'
      }
    });
    
    // Reset all items
    const items = Selector.Scoped.withinAll(this.list, 'li');
    items.update({
      style: { borderTop: '1px solid #ddd' }
    });
  }
  
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
  
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.draggedItem !== e.target) {
      // Get positions
      const draggedPos = Array.from(this.list.children).indexOf(this.draggedItem);
      const targetPos = Array.from(this.list.children).indexOf(e.target);
      
      // Reorder
      if (draggedPos < targetPos) {
        e.target.parentNode.insertBefore(this.draggedItem, e.target.nextSibling);
      } else {
        e.target.parentNode.insertBefore(this.draggedItem, e.target);
      }
    }
    
    e.target.update({
      style: { borderTop: '1px solid #ddd' }
    });
  }
  
  addItem(text) {
    const item = createElement('li', {
      textContent: text
    });
    
    this.makeItemDraggable(item);
    this.list.appendChild(item);
  }
  
  getOrder() {
    const items = Selector.Scoped.withinAll(this.list, 'li');
    return items.map(item => item.textContent);
  }
}

// Usage
const dragList = new DragDropList('myList');
dragList.addItem('Item 1');
dragList.addItem('Item 2');
dragList.addItem('Item 3');

// Get current order
console.log(dragList.getOrder());
```

### Recipe 5: Image Gallery with Lightbox

```javascript
class ImageGallery {
  constructor(containerId, images) {
    this.container = Elements[containerId];
    this.images = images;
    this.currentIndex = 0;
    this.render();
  }
  
  render() {
    // Create gallery grid
    const grid = createElement('div', {
      className: 'gallery-grid',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
        padding: '20px'
      }
    });
    
    // Create thumbnails
    this.images.forEach((image, index) => {
      const thumbnail = createElement('img', {
        src: image.thumbnail || image.src,
        alt: image.alt || '',
        className: 'gallery-thumbnail',
        dataset: { index: index },
        style: {
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'transform 0.2s'
        },
        addEventListener: {
          click: () => this.openLightbox(index),
          mouseover: (e) => {
            e.target.update({
              style: { transform: 'scale(1.05)' }
            });
          },
          mouseout: (e) => {
            e.target.update({
              style: { transform: 'scale(1)' }
            });
          }
        }
      });
      
      grid.appendChild(thumbnail);
    });
    
    this.container.appendChild(grid);
    this.createLightbox();
  }
  
  createLightbox() {
    const lightbox = createElement.bulk({
      OVERLAY: {
        id: 'lightbox-overlay',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        },
        addEventListener: {
          click: (e) => {
            if (e.target.id === 'lightbox-overlay') {
              this.closeLightbox();
            }
          }
        }
      },
      
      CONTAINER: {
        style: {
          position: 'relative',
          maxWidth: '90%',
          maxHeight: '90%'
        }
      },
      
      IMG: {
        id: 'lightbox-image',
        style: {
          maxWidth: '100%',
          maxHeight: '90vh',
          objectFit: 'contain'
        }
      },
      
      PREV_BTN: {
        textContent: '❮',
        className: 'lightbox-nav-btn',
        style: {
          position: 'absolute',
          left: '-50px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '30px',
          color: 'white',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '10px'
        },
        addEventListener: {
          click: () => this.navigate(-1)
        }
      },
      
      NEXT_BTN: {
        textContent: '❯',
        className: 'lightbox-nav-btn',
        style: {
          position: 'absolute',
          right: '-50px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '30px',
          color: 'white',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '10px'
        },
        addEventListener: {
          click: () => this.navigate(1)
        }
      },
      
      CLOSE_BTN: {
        textContent: '×',
        style: {
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '40px',
          color: 'white',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '5px 10px'
        },
        addEventListener: {
          click: () => this.closeLightbox()
        }
      },
      
      COUNTER: {
        id: 'lightbox-counter',
        style: {
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '16px'
        }
      }
    });
    
    // Assemble lightbox
    lightbox.CONTAINER.appendChild(lightbox.IMG);
    lightbox.CONTAINER.appendChild(lightbox.PREV_BTN);
    lightbox.CONTAINER.appendChild(lightbox.NEXT_BTN);
    lightbox.CONTAINER.appendChild(lightbox.CLOSE_BTN);
    lightbox.CONTAINER.appendChild(lightbox.COUNTER);
    lightbox.OVERLAY.appendChild(lightbox.CONTAINER);
    
    document.body.appendChild(lightbox.OVERLAY);
    
    this.lightboxElements = lightbox;
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.OVERLAY.style.display === 'flex') {
        if (e.key === 'ArrowLeft') this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
        if (e.key === 'Escape') this.closeLightbox();
      }
    });
  }
  
  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    
    this.lightboxElements.OVERLAY.update({
      style: { display: 'flex' }
    });
  }
  
  closeLightbox() {
    this.lightboxElements.OVERLAY.update({
      style: { display: 'none' }
    });
  }
  
  navigate(direction) {
    this.currentIndex += direction;
    
    // Loop around
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    } else if (this.currentIndex```javascript
    } else if (this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    }
    
    this.updateLightboxImage();
  }
  
  updateLightboxImage() {
    const image = this.images[this.currentIndex];
    
    this.lightboxElements.IMG.update({
      src: image.src,
      alt: image.alt || ''
    });
    
    this.lightboxElements.COUNTER.update({
      textContent: `${this.currentIndex + 1} / ${this.images.length}`
    });
  }
}

// Usage
const images = [
  { src: 'image1.jpg', thumbnail: 'thumb1.jpg', alt: 'Image 1' },
  { src: 'image2.jpg', thumbnail: 'thumb2.jpg', alt: 'Image 2' },
  { src: 'image3.jpg', thumbnail: 'thumb3.jpg', alt: 'Image 3' },
  { src: 'image4.jpg', thumbnail: 'thumb4.jpg', alt: 'Image 4' }
];

const gallery = new ImageGallery('galleryContainer', images);
```

### Recipe 6: Accordion Component

```javascript
class Accordion {
  constructor(containerId) {
    this.container = Elements[containerId];
    this.items = [];
    this.allowMultiple = false;
  }
  
  addItem(title, content) {
    const itemId = `accordion-item-${this.items.length}`;
    const headerId = `accordion-header-${this.items.length}`;
    const contentId = `accordion-content-${this.items.length}`;
    
    const item = createElement.bulk({
      ITEM: {
        id: itemId,
        className: 'accordion-item',
        style: {
          border: '1px solid #ddd',
          marginBottom: '5px',
          borderRadius: '4px',
          overflow: 'hidden'
        }
      },
      
      HEADER: {
        id: headerId,
        className: 'accordion-header',
        textContent: title,
        style: {
          padding: '15px',
          backgroundColor: '#f5f5f5',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s'
        },
        addEventListener: {
          click: () => this.toggle(itemId),
          mouseover: (e) => {
            e.target.update({
              style: { backgroundColor: '#e8e8e8' }
            });
          },
          mouseout: (e) => {
            e.target.update({
              style: { backgroundColor: '#f5f5f5' }
            });
          }
        }
      },
      
      ICON: {
        textContent: '+',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          transition: 'transform 0.3s'
        }
      },
      
      CONTENT: {
        id: contentId,
        className: 'accordion-content',
        innerHTML: content,
        style: {
          maxHeight: '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
          backgroundColor: 'white'
        }
      },
      
      CONTENT_INNER: {
        style: {
          padding: '15px'
        }
      }
    });
    
    // Assemble item
    item.HEADER.appendChild(item.ICON);
    item.CONTENT_INNER.innerHTML = content;
    item.CONTENT.appendChild(item.CONTENT_INNER);
    item.ITEM.appendChild(item.HEADER);
    item.ITEM.appendChild(item.CONTENT);
    
    this.container.appendChild(item.ITEM);
    
    this.items.push({
      id: itemId,
      headerId,
      contentId,
      isOpen: false,
      elements: item
    });
  }
  
  toggle(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.isOpen) {
      this.close(itemId);
    } else {
      if (!this.allowMultiple) {
        // Close all other items
        this.items.forEach(i => {
          if (i.id !== itemId && i.isOpen) {
            this.close(i.id);
          }
        });
      }
      this.open(itemId);
    }
  }
  
  open(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    
    const content = item.elements.CONTENT;
    const scrollHeight = content.scrollHeight;
    
    content.update({
      style: { maxHeight: `${scrollHeight}px` }
    });
    
    item.elements.ICON.update({
      textContent: '−',
      style: { transform: 'rotate(180deg)' }
    });
    
    item.isOpen = true;
  }
  
  close(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    
    item.elements.CONTENT.update({
      style: { maxHeight: '0' }
    });
    
    item.elements.ICON.update({
      textContent: '+',
      style: { transform: 'rotate(0deg)' }
    });
    
    item.isOpen = false;
  }
  
  openAll() {
    this.items.forEach(item => this.open(item.id));
  }
  
  closeAll() {
    this.items.forEach(item => this.close(item.id));
  }
  
  setAllowMultiple(allow) {
    this.allowMultiple = allow;
  }
}

// Usage
const accordion = new Accordion('accordionContainer');

accordion.addItem('Section 1', '<p>Content for section 1</p>');
accordion.addItem('Section 2', '<p>Content for section 2</p>');
accordion.addItem('Section 3', '<p>Content for section 3</p>');

// Allow multiple sections open
accordion.setAllowMultiple(true);

// Programmatic control
accordion.openAll();
accordion.closeAll();
```

### Recipe 7: Countdown Timer

```javascript
class CountdownTimer {
  constructor(containerId, targetDate) {
    this.container = Elements[containerId];
    this.targetDate = new Date(targetDate).getTime();
    this.interval = null;
    this.onComplete = null;
    this.render();
    this.start();
  }
  
  render() {
    const timer = createElement.bulk({
      CONTAINER: {
        className: 'countdown-timer',
        style: {
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }
      },
      
      DAYS_BOX: {
        className: 'time-box',
        style: this.getBoxStyle()
      },
      
      DAYS_VALUE: {
        id: 'countdown-days',
        className: 'time-value',
        textContent: '00',
        style: this.getValueStyle()
      },
      
      DAYS_LABEL: {
        textContent: 'Days',
        style: this.getLabelStyle()
      },
      
      HOURS_BOX: {
        className: 'time-box',
        style: this.getBoxStyle()
      },
      
      HOURS_VALUE: {
        id: 'countdown-hours',
        className: 'time-value',
        textContent: '00',
        style: this.getValueStyle()
      },
      
      HOURS_LABEL: {
        textContent: 'Hours',
        style: this.getLabelStyle()
      },
      
      MINUTES_BOX: {
        className: 'time-box',
        style: this.getBoxStyle()
      },
      
      MINUTES_VALUE: {
        id: 'countdown-minutes',
        className: 'time-value',
        textContent: '00',
        style: this.getValueStyle()
      },
      
      MINUTES_LABEL: {
        textContent: 'Minutes',
        style: this.getLabelStyle()
      },
      
      SECONDS_BOX: {
        className: 'time-box',
        style: this.getBoxStyle()
      },
      
      SECONDS_VALUE: {
        id: 'countdown-seconds',
        className: 'time-value',
        textContent: '00',
        style: this.getValueStyle()
      },
      
      SECONDS_LABEL: {
        textContent: 'Seconds',
        style: this.getLabelStyle()
      }
    });
    
    // Assemble timer boxes
    timer.DAYS_BOX.appendChild(timer.DAYS_VALUE);
    timer.DAYS_BOX.appendChild(timer.DAYS_LABEL);
    
    timer.HOURS_BOX.appendChild(timer.HOURS_VALUE);
    timer.HOURS_BOX.appendChild(timer.HOURS_LABEL);
    
    timer.MINUTES_BOX.appendChild(timer.MINUTES_VALUE);
    timer.MINUTES_BOX.appendChild(timer.MINUTES_LABEL);
    
    timer.SECONDS_BOX.appendChild(timer.SECONDS_VALUE);
    timer.SECONDS_BOX.appendChild(timer.SECONDS_LABEL);
    
    // Assemble container
    timer.CONTAINER.appendChild(timer.DAYS_BOX);
    timer.CONTAINER.appendChild(timer.HOURS_BOX);
    timer.CONTAINER.appendChild(timer.MINUTES_BOX);
    timer.CONTAINER.appendChild(timer.SECONDS_BOX);
    
    this.container.appendChild(timer.CONTAINER);
    this.elements = timer;
  }
  
  getBoxStyle() {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px',
      minWidth: '80px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };
  }
  
  getValueStyle() {
    return {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px'
    };
  }
  
  getLabelStyle() {
    return {
      fontSize: '14px',
      color: '#666',
      textTransform: 'uppercase'
    };
  }
  
  start() {
    this.interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;
      
      if (distance < 0) {
        this.stop();
        this.handleComplete();
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      this.update(days, hours, minutes, seconds);
    }, 1000);
  }
  
  update(days, hours, minutes, seconds) {
    Elements['countdown-days'].update({
      textContent: String(days).padStart(2, '0')
    });
    
    Elements['countdown-hours'].update({
      textContent: String(hours).padStart(2, '0')
    });
    
    Elements['countdown-minutes'].update({
      textContent: String(minutes).padStart(2, '0')
    });
    
    Elements['countdown-seconds'].update({
      textContent: String(seconds).padStart(2, '0')
    });
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  handleComplete() {
    // Update all values to 00
    this.update(0, 0, 0, 0);
    
    // Change style to indicate completion
    Collections.ClassName.timeBox.update({
      style: {
        backgroundColor: '#4caf50',
        color: 'white'
      }
    });
    
    Collections.ClassName.timeValue.update({
      style: { color: 'white' }
    });
    
    Collections.ClassName.timeLabel.update({
      style: { color: 'white' }
    });
    
    // Call completion callback if set
    if (this.onComplete) {
      this.onComplete();
    }
  }
  
  setOnComplete(callback) {
    this.onComplete = callback;
  }
}

// Usage
const countdown = new CountdownTimer('timerContainer', '2024-12-31 23:59:59');

countdown.setOnComplete(() => {
  alert('Countdown complete!');
});
```

### Recipe 8: Progress Tracker

```javascript
class ProgressTracker {
  constructor(containerId, steps) {
    this.container = Elements[containerId];
    this.steps = steps;
    this.currentStep = 0;
    this.render();
  }
  
  render() {
    const tracker = createElement('div', {
      className: 'progress-tracker',
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative'
      }
    });
    
    // Progress line
    const progressLine = createElement('div', {
      id: 'progress-line',
      style: {
        position: 'absolute',
        top: '50%',
        left: '0',
        right: '0',
        height: '4px',
        backgroundColor: '#e0e0e0',
        zIndex: '1',
        transform: 'translateY(-50%)'
      }
    });
    
    const progressFill = createElement('div', {
      id: 'progress-fill',
      style: {
        height: '100%',
        width: '0%',
        backgroundColor: '#4caf50',
        transition: 'width 0.3s ease'
      }
    });
    
    progressLine.appendChild(progressFill);
    tracker.appendChild(progressLine);
    
    // Create step circles
    this.steps.forEach((step, index) => {
      const stepElement = this.createStep(step, index);
      tracker.appendChild(stepElement);
    });
    
    this.container.appendChild(tracker);
    this.updateProgress();
  }
  
  createStep(step, index) {
    const stepId = `step-${index}`;
    
    const stepContainer = createElement('div', {
      id: stepId,
      className: 'step-container',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: '2',
        flex: '1'
      }
    });
    
    const circle = createElement('div', {
      className: 'step-circle',
      textContent: String(index + 1),
      style: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        color: '#666',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      },
      addEventListener: {
        click: () => this.goToStep(index)
      }
    });
    
    const label = createElement('div', {
      className: 'step-label',
      textContent: step,
      style: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '100px'
      }
    });
    
    stepContainer.appendChild(circle);
    stepContainer.appendChild(label);
    
    return stepContainer;
  }
  
  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateProgress();
      return true;
    }
    return false;
  }
  
  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateProgress();
      return true;
    }
    return false;
  }
  
  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      this.updateProgress();
    }
  }
  
  updateProgress() {
    // Update progress line
    const progress = (this.currentStep / (this.steps.length - 1)) * 100;
    Elements['progress-fill'].update({
      style: { width: `${progress}%` }
    });
    
    // Update step circles
    this.steps.forEach((step, index) => {
      const stepElement = Elements[`step-${index}`];
      const circle = stepElement.querySelector('.step-circle');
      const label = stepElement.querySelector('.step-label');
      
      if (index < this.currentStep) {
        // Completed step
        circle.update({
          style: {
            backgroundColor: '#4caf50',
            color: 'white'
          },
          textContent: '✓'
        });
        label.update({
          style: { color: '#4caf50' }
        });
      } else if (index === this.currentStep) {
        // Current step
        circle.update({
          style: {
            backgroundColor: '#2196f3',
            color: 'white',
            transform: 'scale(1.2)'
          },
          textContent: String(index + 1)
        });
        label.update({
          style: { 
            color: '#2196f3',
            fontWeight: 'bold'
          }
        });
      } else {
        // Future step
        circle.update({
          style: {
            backgroundColor: '#e0e0e0',
            color: '#666',
            transform: 'scale(1)'
          },
          textContent: String(index + 1)
        });
        label.update({
          style: { 
            color: '#666',
            fontWeight: 'normal'
          }
        });
      }
    });
  }
  
  reset() {
    this.currentStep = 0;
    this.updateProgress();
  }
  
  complete() {
    this.currentStep = this.steps.length - 1;
    this.updateProgress();
  }
}

// Usage
const steps = ['Personal Info', 'Address', 'Payment', 'Confirmation'];
const tracker = new ProgressTracker('progressContainer', steps);

// Navigation
Elements.nextBtn.update({
  addEventListener: ['click', () => {
    if (!tracker.next()) {
      console.log('Already at last step');
    }
  }]
});

Elements.prevBtn.update({
  addEventListener: ['click', () => {
    if (!tracker.prev()) {
      console.log('Already at first step');
    }
  }]
});
```

---

## TypeScript Support

### Type Definitions

Create a `dom-helpers.d.ts` file:

```typescript
// dom-helpers.d.ts

declare module 'dom-helpers-js' {
  // Update options interface
  interface UpdateOptions {
    textContent?: string;
    innerHTML?: string;
    innerText?: string;
    value?: string | number;
    disabled?: boolean;
    checked?: boolean;
    selected?: boolean;
    
    style?: Partial<CSSStyleDeclaration>;
    
    classList?: {
      add?: string | string[];
      remove?: string | string[];
      toggle?: string | string[];
      replace?: [string, string];
      contains?: string | string[];
    };
    
    setAttribute?: { [key: string]: string | number | boolean } | [string, string];
    removeAttribute?: string | string[];
    getAttribute?: string;
    
    dataset?: { [key: string]: string };
    
    addEventListener?: 
      | [string, EventListener, (AddEventListenerOptions | boolean)?]
      | { [eventType: string]: EventListener | [EventListener, (AddEventListenerOptions | boolean)?] };
    
    removeEventListener?: [string, EventListener, (EventListenerOptions | boolean)?];
    
    // Any DOM method
    [key: string]: any;
  }
  
  // Element with update method
  interface EnhancedElement extends HTMLElement {
    update(options: UpdateOptions): this;
  }
  
  // Collection interface
  interface EnhancedCollection<T extends HTMLElement = HTMLElement> {
    length: number;
    item(index: number): T | null;
    namedItem?(name: string): T | null;
    
    // Array methods
    toArray(): T[];
    forEach(callback: (element: T, index: number) => void, thisArg?: any): void;
    map<U>(callback: (element: T, index: number) => U, thisArg?: any): U[];
    filter(callback: (element: T, index: number) => boolean, thisArg?: any): T[];
    find(callback: (element: T, index: number) => boolean, thisArg?: any): T | undefined;
    some(callback: (element: T, index: number) => boolean, thisArg?: any): boolean;
    every(callback: (element: T, index: number) => boolean, thisArg?: any): boolean;
    reduce<U>(callback: (acc: U, element: T, index: number) => U, initialValue: U): U;
    
    // Utility methods
    first(): T | null;
    last(): T | null;
    at(index: number): T | null;
    isEmpty(): boolean;
    
    // DOM manipulation
    addClass(className: string): this;
    removeClass(className: string): this;
    toggleClass(className: string): this;
    setProperty(prop: string, value: any): this;
    setAttribute(attr: string, value: string): this;
    setStyle(styles: Partial<CSSStyleDeclaration>): this;
    on(event: string, handler: EventListener): this;
    off(event: string, handler: EventListener): this;
    
    // Filtering
    visible(): T[];
    hidden(): T[];
    enabled(): T[];
    disabled(): T[];
    
    // Update method
    update(options: UpdateOptions): this;
    
    // Indexer
    [index: number]: T;
  }
  
  // Elements Helper
  interface ElementsHelper {
    [id: string]: EnhancedElement | null;
    
    update(updates: { [id: string]: UpdateOptions }): { [id: string]: { success: boolean; element?: HTMLElement; error?: string } };
    destructure(...ids: string[]): { [id: string]: EnhancedElement | null };
    getRequired(...ids: string[]): { [id: string]: EnhancedElement };
    waitFor(...ids: string[]): Promise<{ [id: string]: EnhancedElement }>;
    get(id: string, fallback?: HTMLElement | null): EnhancedElement | null;
    exists(id: string): boolean;
    getMultiple(...ids: string[]): { [id: string]: EnhancedElement | null };
    
    setProperty(id: string, property: string, value: any): boolean;
    getProperty(id: string, property: string, fallback?: any): any;
    setAttribute(id: string, attribute: string, value: string): boolean;
    getAttribute(id: string, attribute: string, fallback?: string | null): string | null;
    
    stats(): {
      hits: number;
      misses: number;
      hitRate: number;
      cacheSize: number;
      uptime: number;
    };
    clear(): void;
    isCached(id: string): boolean;
    configure(options: HelperOptions): this;
  }
  
  // Collections Helper
  interface CollectionsHelper {
    ClassName: {
      [className: string]: EnhancedCollection;
      (className: string): EnhancedCollection;
    };
    
    TagName: {
      [tagName: string]: EnhancedCollection;
      (tagName: string): EnhancedCollection;
    };
    
    Name: {
      [name: string]: EnhancedCollection;
      (name: string): EnhancedCollection;
    };
    
    update(updates: { [identifier: string]: UpdateOptions }): { [identifier: string]: { success: boolean; elementsUpdated?: number; error?: string } };
    
    stats(): {
      hits: number;
      misses: number;
      hitRate: number;
      cacheSize: number;
      uptime: number;
    };
    clear(): void;
    configure(options: HelperOptions): this;
  }
  
  // Selector Helper
  interface SelectorHelper {
    query(selector: string): EnhancedElement | null;
    queryAll(selector: string): EnhancedCollection;
    
    Scoped: {
      within(container: string | HTMLElement, selector: string): EnhancedElement | null;
      withinAll(container: string | HTMLElement, selector: string): EnhancedCollection;
    };
    
    update(updates: { [selector: string]: UpdateOptions }): { [selector: string]: { success: boolean; elementsUpdated?: number; error?: string } };
    
    waitFor(selector: string, timeout?: number): Promise<EnhancedElement>;
    waitForAll(selector: string, minCount?: number, timeout?: number): Promise<EnhancedCollection>;
    
    stats(): {
      hits: number;
      misses: number;
      hitRate: number;
      cacheSize: number;
      uptime: number;
      selectorBreakdown: { [type: string]: number };
    };
    clear(): void;
    configure(options: HelperOptions): this;
  }
  
  // Helper options
  interface HelperOptions {
    enableLogging?: boolean;
    autoCleanup?: boolean;
    cleanupInterval?: number;
    maxCacheSize?: number;
    debounceDelay?: number;
    enableEnhancedSyntax?: boolean;
    enableSmartCaching?: boolean;
  }
  
  // DOM Helpers main interface
  interface DOMHelpersInterface {
    Elements: ElementsHelper;
    Collections: CollectionsHelper;
    Selector: SelectorHelper;
    
    version: string;
    isReady(): boolean;
    getStats(): {
      elements?: any;
      collections?: any;
      selector?: any;
    };
    clearAll(): void;
    destroyAll(): void;
    configure(options: HelperOptions): this;
    
    enableCreateElementEnhancement(): this;
    disableCreateElementEnhancement(): this;
  }
  
  // createElement enhancement
  interface CreateElementBulkResult {
    [key: string]: HTMLElement;
    all: HTMLElement[];
    count: number;
    keys: string[];
    
    toArray(...tagNames: string[]): HTMLElement[];
    ordered(...tagNames: string[]): HTMLElement[];
    updateMultiple(updates: { [tagName: string]: UpdateOptions }): this;
    has(key: string): boolean;
    get(key: string, fallback?: HTMLElement): HTMLElement;
    forEach(callback: (element: HTMLElement, key: string, index: number) => void): void;
    map<U>(callback: (element: HTMLElement, key: string, index: number) => U): U[];
    filter(callback: (element: HTMLElement, key: string, index: number) => boolean): HTMLElement[];
    appendTo(container: string | HTMLElement): this;
    appendToOrdered(container: string | HTMLElement, ...tagNames: string[]): this;
  }
  
  interface CreateElementFunction {
    (tagName: string, options?: UpdateOptions): EnhancedElement;
    bulk(definitions: { [tagName: string]: UpdateOptions }): CreateElementBulkResult;
    update(definitions: { [tagName: string]: UpdateOptions }): CreateElementBulkResult;
  }
  
  // Exports
  export const DOMHelpers: DOMHelpersInterface;
  export const Elements: ElementsHelper;
  export const Collections: CollectionsHelper;
  export const Selector: SelectorHelper;
  export const createElement: CreateElementFunction;
}
```

### Usage with TypeScript

```typescript
import { Elements, Collections, Selector, createElement } from 'dom-helpers-js';

// Type-safe element access
const button = Elements.myButton;
if (button) {
  button.update({
    textContent: 'Click Me',
    disabled: false,
    style: {
      backgroundColor: 'blue',
      color: 'white'
    }
  });
}

// Type-safe collections
const cards = Collections.ClassName.card;
cards.update({
  style: {
    padding: '20px',
    border: '1px solid #ddd'
  }
});

// Type-safe selectors
const firstButton = Selector.query('.btn-primary');
if (firstButton) {
  firstButton.update({ disabled: true });
}

// Type-safe createElement
const newDiv = createElement('div', {
  textContent: 'Hello',
  className: 'container',
  style: {
    padding: '10px'
  }
});

// Type-safe bulk creation
const elements = createElement.bulk({
  H1: { textContent: 'Title' },
  P: { textContent: 'Paragraph' },
  BUTTON: { textContent: 'Submit' }
});

// TypeScript knows these properties exist
console.log(elements.H1);
console.log(elements.P);
console.log(elements.BUTTON);
```

---

## Browser Compatibility

DOM Helpers works in all modern browsers:

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Opera 47+

### Polyfills Needed for Older Browsers

For IE11 and older browsers, include these polyfills:

```html
<!-- Polyfills for IE11 -->
<script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Promise,Array.from,Object.assign,Object.entries,Map,WeakMap,Set"></script>

<!-- Then include DOM Helpers -->
<script src="dom-helpers.js"></script>
```

---

## FAQ

### Q: Does DOM Helpers work with React/Vue/Angular?

**A:** Yes! DOM Helpers is framework-agnostic. However, it's best used for:
- Direct DOM manipulation outside component lifecycles
- Managing global UI elements (modals, toasts, etc.)
- Legacy code modernization
- Non-reactive DOM interactions

For component state, use your framework's built-in methods.

### Q: What's the performance impact?

**A:** DOM Helpers is optimized for performance:
- Caching eliminates repeated DOM queries (up to 50x faster)
- Fine-grained updates skip unchanged properties (up to 50x fewer DOM operations)
- Debounced mutation observers reduce overhead
- Typical overhead: <1ms per operation

### Q: How much does it add to my bundle size?

**A:**
- Unminified: ~80KB
- Minified: ~28KB
- Gzipped: ~8KB

Consider using tree-shaking
or loading only the helpers you need for smaller bundles.

### Q: Is DOM Helpers production-ready?

**A:** Yes, DOM Helpers is designed for production use with:
- Comprehensive error handling
- Automatic memory management
- Cache invalidation on DOM changes
- Graceful degradation
- Zero breaking changes to native DOM APIs

However, always test thoroughly in your specific environment.

### Q: Can I use DOM Helpers with Server-Side Rendering (SSR)?

**A:** DOM Helpers requires the `document` and `window` objects, so it won't work during SSR. Best practices:

```javascript
// Next.js example
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Only runs on client-side
    if (typeof window !== 'undefined') {
      const { Elements } = require('dom-helpers-js');
      Elements.myButton.update({ textContent: 'Hello' });
    }
  }, []);
  
  return <button id="myButton">Loading...</button>;
}

// Or use dynamic import
useEffect(() => {
  import('dom-helpers-js').then(({ Elements }) => {
    Elements.myButton.update({ textContent: 'Hello' });
  });
}, []);
```

### Q: How do I debug cache issues?

**A:** Enable logging and monitor statistics:

```javascript
// Enable debug mode
DOMHelpers.configure({
  enableLogging: true
});

// Monitor cache performance
const interval = setInterval(() => {
  const stats = DOMHelpers.getStats();
  
  console.table({
    'Elements Hit Rate': `${(stats.elements.hitRate * 100).toFixed(2)}%`,
    'Collections Hit Rate': `${(stats.collections.hitRate * 100).toFixed(2)}%`,
    'Selector Hit Rate': `${(stats.selector.hitRate * 100).toFixed(2)}%`,
    'Total Cache Size': stats.elements.cacheSize + stats.collections.cacheSize + stats.selector.cacheSize
  });
}, 5000);

// Low hit rates (<50%) indicate:
// 1. Elements are being created/destroyed frequently
// 2. Cache size is too small
// 3. DOM changes are invalidating cache too often

// Clean up when done debugging
clearInterval(interval);
DOMHelpers.configure({ enableLogging: false });
```

### Q: Can I customize the caching behavior?

**A:** Yes, configure each helper independently:

```javascript
// For static content (rarely changes)
Elements.configure({
  autoCleanup: false,        // Disable automatic cleanup
  maxCacheSize: 10000,       // Large cache
  cleanupInterval: 120000    // 2 minutes
});

// For dynamic SPAs (frequently changes)
Collections.configure({
  autoCleanup: true,
  maxCacheSize: 100,         // Smaller cache
  cleanupInterval: 10000     // 10 seconds
});

// For heavy selector usage
Selector.configure({
  enableSmartCaching: true,
  maxCacheSize: 500,
  debounceDelay: 50          // Longer debounce
});
```

### Q: How do I handle dynamically created elements?

**A:** DOM Helpers automatically tracks DOM changes:

```javascript
// Element doesn't exist yet
console.log(Elements.dynamicButton); // null

// Create element dynamically
const button = createElement('button', {
  id: 'dynamicButton',
  textContent: 'Click Me'
});
document.body.appendChild(button);

// Wait a moment for MutationObserver to process
setTimeout(() => {
  console.log(Elements.dynamicButton); // Now available!
  Elements.dynamicButton.update({ disabled: true });
}, 0);

// Or use waitFor for immediate access
const btn = await Elements.waitFor('dynamicButton');
btn.update({ disabled: true });
```

### Q: What about memory leaks?

**A:** DOM Helpers includes automatic memory management:

```javascript
// 1. WeakMaps don't prevent garbage collection
// 2. Auto-cleanup removes stale references
// 3. Cleanup runs on page unload

// Manual cleanup when needed
DOMHelpers.clearAll();     // Clear all caches
DOMHelpers.destroyAll();   // Destroy all helpers

// In SPAs, clean up on route changes
router.afterEach(() => {
  DOMHelpers.clearAll();
});

// Monitor memory usage
const stats = DOMHelpers.getStats();
console.log('Cache sizes:', {
  elements: stats.elements.cacheSize,
  collections: stats.collections.cacheSize,
  selector: stats.selector.cacheSize
});
```

### Q: Can I extend DOM Helpers with custom functionality?

**A:** Yes, several ways:

```javascript
// 1. Create wrapper functions
function updateButtonState(buttonId, loading) {
  Elements[buttonId].update({
    textContent: loading ? 'Loading...' : 'Submit',
    disabled: loading,
    classList: loading ? { add: 'loading' } : { remove: 'loading' }
  });
}

// 2. Extend with utility methods
Elements.updateMultipleStyles = function(ids, styles) {
  ids.forEach(id => {
    this[id]?.update({ style: styles });
  });
};

Elements.updateMultipleStyles(['btn1', 'btn2', 'btn3'], {
  color: 'red',
  padding: '10px'
});

// 3. Create custom helpers
class FormHelper {
  constructor(formId) {
    this.form = Elements[formId];
  }
  
  getValues() {
    const inputs = Selector.Scoped.withinAll(this.form, 'input, textarea, select');
    const values = {};
    inputs.forEach(input => {
      values[input.name] = input.value;
    });
    return values;
  }
  
  setValues(values) {
    Object.entries(values).forEach(([name, value]) => {
      const input = Selector.Scoped.within(this.form, `[name="${name}"]`);
      if (input) {
        input.update({ value });
      }
    });
  }
  
  validate() {
    const inputs = Selector.Scoped.withinAll(this.form, 'input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value) {
        input.update({
          classList: { add: 'error' },
          style: { borderColor: 'red' }
        });
        isValid = false;
      } else {
        input.update({
          classList: { remove: 'error' },
          style: { borderColor: '#ddd' }
        });
      }
    });
    
    return isValid;
  }
}

// Usage
const formHelper = new FormHelper('myForm');
const values = formHelper.getValues();
formHelper.setValues({ email: 'test@example.com' });
const isValid = formHelper.validate();
```

### Q: Does it conflict with other libraries?

**A:** DOM Helpers is designed to coexist peacefully:

```javascript
// Works alongside jQuery
$('#myButton').click(function() {
  Elements.myButton.update({ disabled: true });
});

// Works with vanilla JS
document.getElementById('myButton').addEventListener('click', () => {
  Elements.myButton.update({ classList: { toggle: 'active' } });
});

// Works with frameworks
// React
useEffect(() => {
  Elements.notification?.update({ style: { display: 'block' } });
}, []);

// Vue
onMounted(() => {
  Elements.sidebar?.update({ classList: { add: 'open' } });
});

// Angular
ngAfterViewInit() {
  Elements.header?.update({ style: { position: 'fixed' } });
}
```

### Q: How do I migrate from jQuery?

**A:** Use this migration guide:

```javascript
// jQuery → DOM Helpers cheatsheet

// Selecting elements
$('#button')                    → Elements.button
$('.card')                      → Collections.ClassName.card
$('div')                        → Collections.TagName.div
$('[name="email"]')             → Collections.Name.email
$('.container .item')           → Selector.queryAll('.container .item')

// Setting content
$('#button').text('Click')      → Elements.button.update({ textContent: 'Click' })
$('#button').html('<b>Hi</b>')  → Elements.button.update({ innerHTML: '<b>Hi</b>' })

// Setting attributes
$('#img').attr('src', 'a.jpg')  → Elements.img.update({ setAttribute: { src: 'a.jpg' } })
$('#input').val('text')         → Elements.input.update({ value: 'text' })

// CSS
$('#button').css('color', 'red')           → Elements.button.update({ style: { color: 'red' } })
$('#button').css({color:'red',padding:'10px'}) → Elements.button.update({ style: { color:'red', padding:'10px' } })

// Classes
$('#button').addClass('active')    → Elements.button.update({ classList: { add: 'active' } })
$('#button').removeClass('old')    → Elements.button.update({ classList: { remove: 'old' } })
$('#button').toggleClass('on')     → Elements.button.update({ classList: { toggle: 'on' } })

// Properties
$('#checkbox').prop('checked', true)  → Elements.checkbox.update({ checked: true })
$('#button').prop('disabled', false)  → Elements.button.update({ disabled: false })

// Events
$('#button').on('click', handler)     → Elements.button.update({ addEventListener: ['click', handler] })
$('#button').off('click', handler)    → Elements.button.update({ removeEventListener: ['click', handler] })

// Collections
$('.card').each((i, el) => {...})     → Collections.ClassName.card.forEach((el, i) => {...})
$('.card').hide()                     → Collections.ClassName.card.update({ style: { display: 'none' } })
$('.card').show()                     → Collections.ClassName.card.update({ style: { display: 'block' } })

// Chaining
$('#button')                          → Elements.button
  .text('Submit')                        .update({ textContent: 'Submit' })
  .addClass('primary')                   .update({ classList: { add: 'primary' } })
  .css('color', 'blue')                  .update({ style: { color: 'blue' } })
```

---

## Best Practices

### 1. **Structure Your Code**

```javascript
// ❌ Bad: Scattered updates
function initApp() {
  Elements.header.textContent = 'My App';
  Elements.header.style.color = 'blue';
  Elements.sidebar.style.width = '250px';
  Elements.footer.textContent = 'Copyright 2024';
}

// ✅ Good: Organized bulk updates
function initApp() {
  Elements.update({
    header: {
      textContent: 'My App',
      style: { color: 'blue' }
    },
    sidebar: {
      style: { width: '250px' }
    },
    footer: {
      textContent: 'Copyright 2024'
    }
  });
}
```

### 2. **Use Destructuring for Multiple Elements**

```javascript
// ❌ Bad: Repeated Elements access
function setupForm() {
  Elements.emailInput.placeholder = 'Email';
  Elements.passwordInput.placeholder = 'Password';
  Elements.submitBtn.textContent = 'Login';
}

// ✅ Good: Destructure once
function setupForm() {
  const { emailInput, passwordInput, submitBtn } = Elements.destructure(
    'emailInput',
    'passwordInput',
    'submitBtn'
  );
  
  emailInput.update({ placeholder: 'Email' });
  passwordInput.update({ placeholder: 'Password' });
  submitBtn.update({ textContent: 'Login' });
}

// ✅ Better: Bulk update
function setupForm() {
  Elements.update({
    emailInput: { placeholder: 'Email' },
    passwordInput: { placeholder: 'Password' },
    submitBtn: { textContent: 'Login' }
  });
}
```

### 3. **Prefer Collections for Multiple Elements**

```javascript
// ❌ Bad: Manual loop
document.querySelectorAll('.card').forEach(card => {
  card.style.padding = '20px';
  card.style.border = '1px solid #ddd';
  card.classList.add('styled');
});

// ✅ Good: Use Collections
Collections.ClassName.card.update({
  style: {
    padding: '20px',
    border: '1px solid #ddd'
  },
  classList: { add: 'styled' }
});
```

### 4. **Handle Async Operations Properly**

```javascript
// ❌ Bad: Assuming element exists
async function loadData() {
  const data = await fetchData();
  Elements.dataContainer.innerHTML = data; // May be null
}

// ✅ Good: Check existence
async function loadData() {
  const data = await fetchData();
  
  if (Elements.exists('dataContainer')) {
    Elements.dataContainer.update({ innerHTML: data });
  } else {
    console.warn('Data container not found');
  }
}

// ✅ Better: Wait for element
async function loadData() {
  const data = await fetchData();
  const container = await Elements.waitFor('dataContainer');
  container.update({ innerHTML: data });
}
```

### 5. **Use Appropriate Helper for Task**

```javascript
// Element by ID → Elements
Elements.myButton.update({ ... });

// Multiple elements by class → Collections
Collections.ClassName.card.update({ ... });

// Complex CSS selectors → Selector
Selector.queryAll('.container > .item:nth-child(odd)').update({ ... });

// Scoped queries → Selector.Scoped
Selector.Scoped.withinAll('#sidebar', '.menu-item').update({ ... });
```

### 6. **Combine Updates for Better Performance**

```javascript
// ❌ Bad: Multiple update calls
Elements.button.update({ textContent: 'Loading...' });
Elements.button.update({ disabled: true });
Elements.button.update({ classList: { add: 'loading' } });
Elements.button.update({ style: { opacity: '0.5' } });

// ✅ Good: Single update call
Elements.button.update({
  textContent: 'Loading...',
  disabled: true,
  classList: { add: 'loading' },
  style: { opacity: '0.5' }
});
```

### 7. **Clean Up Event Listeners**

```javascript
// ❌ Bad: Memory leak potential
function initFeature() {
  Elements.button.update({
    addEventListener: ['click', handleClick]
  });
}

// Called multiple times = multiple listeners
initFeature();
initFeature();
initFeature();

// ✅ Good: Remove old listener first
function initFeature() {
  Elements.button.update({
    removeEventListener: ['click', handleClick],
    addEventListener: ['click', handleClick]
  });
}

// ✅ Better: DOM Helpers prevents duplicates automatically
function initFeature() {
  Elements.button.update({
    addEventListener: ['click', handleClick]
  });
  // Duplicate listeners are automatically prevented!
}
```

### 8. **Use Type Safety (TypeScript)**

```typescript
// ✅ Define your element IDs as types
interface AppElements {
  header: HTMLElement;
  sidebar: HTMLElement;
  mainContent: HTMLDivElement;
  submitButton: HTMLButtonElement;
  emailInput: HTMLInputElement;
}

// Type-safe helper
function getElements<T extends AppElements>(): T {
  return Elements as any as T;
}

// Now with autocomplete and type checking
const elements = getElements<AppElements>();
elements.submitButton.update({ disabled: true }); // ✓ Type-safe
elements.emailInput.update({ value: 'test@example.com' }); // ✓ Type-safe
```

### 9. **Monitor Performance in Production**

```javascript
// Add performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Monitor cache hit rates
  setInterval(() => {
    const stats = DOMHelpers.getStats();
    
    // Send to analytics if hit rates are low
    if (stats.elements.hitRate < 0.5) {
      analytics.track('Low Cache Hit Rate', {
        helper: 'elements',
        hitRate: stats.elements.hitRate,
        cacheSize: stats.elements.cacheSize
      });
    }
  }, 60000); // Check every minute
}
```

## Contributing

We welcome contributions! Here's how to get involved:

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)
---

## License

MIT License - feel free to use in personal and commercial projects.

---

## Support

- **Documentation:** https://github.com/giovanni1707/dom-helpers/docs
- **Issues:** https://github.com/giovanni1707/dom-helpers/issues
- **Discussions:** https://github.com/giovanni1707/dom-helpers/discussions
- **Email:** giovannimarianne1@gmail.com

---

## Changelog

### Version 2.3.1 (Current)
- Fine-grained change detection
- Enhanced event listener tracking
- Bulk update methods
- createElement enhancement
- Improved TypeScript support
- Performance optimizations

### Version 2.2.0
- Added Collections helper
- Selector helper improvements
- Smart caching system
- Auto-cleanup functionality

### Version 2.1.0
- Initial public release
- Elements helper with caching
- Basic update system
- MutationObserver integration

---

## Acknowledgments

Built with ❤️ by developer, for developers.

Special thanks to:
- The JavaScript community
- Contributors and testers
- Everyone providing feedback

---

**Happy DOM manipulating! 🚀**

---

*Documentation last updated: October 2025*
*DOM Helpers v2.3.1*