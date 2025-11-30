# Selector Module - Query Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 1 of 5**: Query Methods for the Selector Helper
> Use CSS selectors to find DOM elements with intelligent caching

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding CSS Selectors](#understanding-css-selectors)
3. [Selector.query() - querySelector Wrapper](#selectorquery---queryselector-wrapper)
4. [Selector.queryAll() - querySelectorAll Wrapper](#selectorqueryall---queryselectorall-wrapper)
5. [Enhanced Syntax](#enhanced-syntax)
6. [Quick Reference](#quick-reference)
7. [Best Practices](#best-practices)

---

## Overview

The **Selector Helper** provides a powerful, cached interface to `querySelector` and `querySelectorAll`. It allows you to find elements using any valid CSS selector.

✅ **Full CSS selector support** - Use any CSS selector (classes, IDs, attributes, pseudo-classes, etc.)
✅ **Intelligent caching** - Selectors are cached for better performance
✅ **Enhanced syntax** - Property-based access for common selectors
✅ **Auto-enhancement** - All results get array methods and `.update()`
✅ **Scoped queries** - Query within specific containers

---

## Understanding CSS Selectors

### What are CSS Selectors?

CSS selectors are patterns used to select elements. They're the same selectors you use in CSS stylesheets.

**Basic selectors:**
```javascript
'.button'           // Class selector
'#header'           // ID selector
'div'               // Tag selector
'[type="text"]'     // Attribute selector
'*'                 // Universal selector
```

**Combined selectors:**
```javascript
'.card.featured'         // Element with both classes
'div.container'          // Div with class container
'#main > .content'       // Direct child
'nav .menu-item'         // Descendant
'.item + .item'          // Adjacent sibling
'.item ~ .item'          // General sibling
```

**Pseudo-classes:**
```javascript
'button:hover'           // Hover state
'input:focus'            // Focused input
'li:first-child'         // First child
'li:last-child'          // Last child
'li:nth-child(2)'        // Second child
'p:not(.exclude)'        // Not matching
```

**Attribute selectors:**
```javascript
'[disabled]'             // Has attribute
'[type="text"]'          // Exact match
'[class*="btn"]'         // Contains
'[href^="https"]'        // Starts with
'[href$=".pdf"]'         // Ends with
```

---

## `Selector.query()` - querySelector Wrapper

### What it does

**Find the first element matching a CSS selector**, equivalent to `document.querySelector()`.

```javascript
Selector.query(selector)
```

**Parameters:**
- `selector` (string) - Any valid CSS selector

**Returns:** First matching element, or `null` if not found

---

### Why use this instead of querySelector?

```javascript
// Traditional querySelector
const button = document.querySelector('.button.primary');

// Selector Helper
const button = Selector.query('.button.primary');
```

**Benefits of Selector.query():**
1. **Caching** - Results are cached for faster repeated access
2. **Enhanced element** - Returned element has `.update()` method
3. **Consistent API** - Part of the DOM Helpers ecosystem
4. **Smart caching** - Cache invalidates when DOM changes

---

### Examples

#### Basic selectors
```javascript
// By class
const button = Selector.query('.button');

// By ID
const header = Selector.query('#header');

// By tag
const firstDiv = Selector.query('div');

// By attribute
const emailInput = Selector.query('[type="email"]');
```

---

#### Combined selectors
```javascript
// Class + class
const featuredCard = Selector.query('.card.featured');

// Tag + class
const mainDiv = Selector.query('div.main');

// ID + class
const activeHeader = Selector.query('#header.active');

// Multiple classes
const primaryButton = Selector.query('.btn.btn-primary');
```

---

#### Descendant selectors
```javascript
// Direct child
const firstItem = Selector.query('.menu > .menu-item');

// Any descendant
const navLink = Selector.query('nav a');

// Multiple levels
const cardTitle = Selector.query('.container .card .title');

// Complex nesting
const input = Selector.query('.form .field input[type="text"]');
```

---

#### Pseudo-class selectors
```javascript
// First/last child
const firstItem = Selector.query('li:first-child');
const lastItem = Selector.query('li:last-child');

// Nth child
const thirdItem = Selector.query('li:nth-child(3)');
const evenItems = Selector.query('li:nth-child(even)'); // Only gets first match

// Not selector
const notDisabled = Selector.query('button:not(:disabled)');
const notHidden = Selector.query('.item:not(.hidden)');

// Checked/selected
const checkedInput = Selector.query('input:checked');
const selectedOption = Selector.query('option:selected');
```

---

#### Attribute selectors
```javascript
// Has attribute
const requiredField = Selector.query('[required]');

// Exact value
const textInput = Selector.query('[type="text"]');

// Contains
const dataElement = Selector.query('[data-id]');
const pdfLink = Selector.query('[href*=".pdf"]');

// Starts with
const externalLink = Selector.query('[href^="http"]');

// Ends with
const imageFile = Selector.query('[src$=".png"]');
```

---

#### Using the result
```javascript
const button = Selector.query('.button.primary');

if (button) {
  // Element found - use .update()
  button.update({
    textContent: 'Click Me',
    style: { backgroundColor: 'blue' },
    addEventListener: ['click', handleClick]
  });
} else {
  console.log('Button not found');
}

// Safe with optional chaining
Selector.query('.button')?.update({ textContent: 'Hello' });
```

---

### Common use cases

#### Find specific form field
```javascript
const emailInput = Selector.query('input[name="email"]');
emailInput?.update({
  setAttribute: { placeholder: 'Enter your email' }
});
```

#### Find first visible element
```javascript
const firstVisibleCard = Selector.query('.card:not(.hidden)');
```

#### Find active navigation item
```javascript
const activeNav = Selector.query('.nav-item.active');
activeNav?.update({
  setAttribute: { 'aria-current': 'page' }
});
```

#### Find nested element
```javascript
const modalCloseBtn = Selector.query('#modal .close-button');
modalCloseBtn?.addEventListener('click', closeModal);
```

---

## `Selector.queryAll()` - querySelectorAll Wrapper

### What it does

**Find all elements matching a CSS selector**, equivalent to `document.querySelectorAll()`.

```javascript
Selector.queryAll(selector)
```

**Parameters:**
- `selector` (string) - Any valid CSS selector

**Returns:** Enhanced NodeList with all matching elements

---

### Why use this instead of querySelectorAll?

```javascript
// Traditional querySelectorAll
const buttons = document.querySelectorAll('.button');
Array.from(buttons).forEach(btn => {
  btn.style.padding = '10px';
});

// Selector Helper
const buttons = Selector.queryAll('.button');
buttons.forEach(btn => {
  btn.update({ style: { padding: '10px' } });
});
```

**Benefits:**
1. **Enhanced NodeList** - Has array methods (`.forEach()`, `.map()`, etc.)
2. **Update all** - Use `.update()` on the collection
3. **Caching** - Results are cached
4. **Filtering** - Use `.visible()`, `.enabled()`, etc.

---

### Examples

#### Basic selectors
```javascript
// All elements with class
const buttons = Selector.queryAll('.button');

// All elements of tag
const divs = Selector.queryAll('div');

// All with attribute
const requiredFields = Selector.queryAll('[required]');
```

---

#### Combined selectors
```javascript
// Multiple classes
const primaryButtons = Selector.queryAll('.btn.btn-primary');

// Tag + class
const navLinks = Selector.queryAll('a.nav-link');

// Complex selector
const activeCards = Selector.queryAll('.card.active:not(.disabled)');
```

---

#### Working with results
```javascript
const buttons = Selector.queryAll('.button');

// Check count
console.log(`Found ${buttons.length} buttons`);

// Use enhanced forEach
buttons.forEach(btn => {
  console.log(btn.textContent);
});

// Use enhanced map
const buttonTexts = buttons.map(btn => btn.textContent);

// Use enhanced filter
const enabledButtons = buttons.filter(btn => !btn.disabled);

// Update all at once
buttons.update({
  style: { padding: '10px' },
  classList: { add: ['styled'] }
});
```

---

#### Iteration patterns
```javascript
const items = Selector.queryAll('.item');

// forEach - side effects
items.forEach((item, index) => {
  item.update({
    textContent: `Item ${index + 1}`,
    dataset: { index }
  });
});

// map - transform
const itemData = items.map(item => ({
  id: item.id,
  text: item.textContent,
  visible: item.offsetParent !== null
}));

// filter - subset
const visibleItems = items.filter(item =>
  item.offsetParent !== null
);

// find - first match
const specificItem = items.find(item =>
  item.dataset.id === '123'
);
```

---

### Common use cases

#### Style all matching elements
```javascript
Selector.queryAll('.card').update({
  style: {
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
});
```

#### Add event listeners to all
```javascript
Selector.queryAll('.menu-item').forEach(item => {
  item.addEventListener('click', handleMenuClick);
});

// Or use shorthand
Selector.queryAll('.menu-item').on('click', handleMenuClick);
```

#### Collect data from elements
```javascript
const formData = Selector.queryAll('.form-field').map(field => ({
  name: field.name,
  value: field.value,
  valid: field.checkValidity()
}));
```

#### Filter and update
```javascript
// Update only visible items
Selector.queryAll('.item')
  .filter(item => item.offsetParent !== null)
  .forEach(item => {
    item.update({ classList: { add: ['visible'] } });
  });

// Or use filtering method
Selector.queryAll('.item')
  .visible()
  .forEach(item => item.addClass('visible'));
```

---

## Enhanced Syntax

### Property-based access

The Selector Helper supports **enhanced syntax** for quick access:

```javascript
// Property syntax (for simple selectors)
Selector.query.button      // querySelector('.button')
Selector.queryAll.card     // querySelectorAll('.card')
```

**How it works:**
```javascript
// Under the hood:
Selector.query.button === Selector.query('.button')
Selector.queryAll.card === Selector.queryAll('.card')
```

---

### When to use enhanced syntax

```javascript
// ✅ Good for simple class selectors
const button = Selector.query.button;
const cards = Selector.queryAll.card;

// ❌ Won't work for complex selectors
// Selector.query.button.primary  // ERROR
// Selector.query['#header']      // ERROR

// ✅ Use function syntax for complex selectors
const primaryButton = Selector.query('.button.primary');
const header = Selector.query('#header');
```

---

### Examples with enhanced syntax

```javascript
// Simple class selectors
const header = Selector.query.header;
const cards = Selector.queryAll.card;
const buttons = Selector.queryAll.button;

// Update using enhanced syntax
Selector.queryAll.button.update({
  style: { padding: '10px' }
});

// Iterate using enhanced syntax
Selector.queryAll.card.forEach(card => {
  card.update({ classList: { add: ['initialized'] } });
});
```

---

## Quick Reference

### Query Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **query()** | Find first element | `Selector.query('.button')` | Element or null |
| **queryAll()** | Find all elements | `Selector.queryAll('.button')` | Enhanced NodeList |
| **query.{class}** | Enhanced syntax | `Selector.query.button` | Element or null |
| **queryAll.{class}** | Enhanced syntax | `Selector.queryAll.button` | Enhanced NodeList |

---

### Common CSS Selectors

| Selector Type | Example | Matches |
|---------------|---------|---------|
| **Class** | `.button` | Elements with class="button" |
| **ID** | `#header` | Element with id="header" |
| **Tag** | `div` | All `<div>` elements |
| **Attribute** | `[type="text"]` | Elements with type="text" |
| **Multiple classes** | `.btn.primary` | Elements with both classes |
| **Descendant** | `.card .title` | .title inside .card |
| **Direct child** | `.card > .title` | .title directly in .card |
| **Pseudo-class** | `li:first-child` | First `<li>` in parent |
| **Not** | `:not(.hidden)` | Elements without .hidden |
| **Attribute contains** | `[href*="pdf"]` | href contains "pdf" |

---

### querySelector vs Selector.query

| Feature | querySelector | Selector.query |
|---------|--------------|----------------|
| **Syntax** | `document.querySelector(selector)` | `Selector.query(selector)` |
| **Caching** | None | Yes |
| **Enhanced element** | No | Yes (.update() method) |
| **Enhanced syntax** | No | Yes (property access) |
| **Consistent API** | Standalone | Part of DOM Helpers |

---

## Best Practices

### 1. Use specific selectors

```javascript
// ❌ Too broad
const div = Selector.query('div');

// ✅ More specific
const mainContent = Selector.query('.main-content');
const headerDiv = Selector.query('#header');
```

---

### 2. Prefer query() over queryAll() for single elements

```javascript
// ❌ Getting first from queryAll
const button = Selector.queryAll('.button')[0];

// ✅ Use query() directly
const button = Selector.query('.button');
```

---

### 3. Use enhanced syntax for simple selectors

```javascript
// ✅ Clean for simple selectors
const button = Selector.query.button;

// ✅ Function syntax for complex selectors
const primaryButton = Selector.query('.button.primary');
```

---

### 4. Check for null before using

```javascript
// ✅ Check existence
const button = Selector.query('.button');
if (button) {
  button.update({ textContent: 'Click' });
}

// ✅ Or use optional chaining
Selector.query('.button')?.update({ textContent: 'Click' });
```

---

### 5. Use queryAll for operations on multiple elements

```javascript
// ✅ Update all matching elements
Selector.queryAll('.card').update({
  style: { borderRadius: '8px' }
});

// ✅ Iterate all matching elements
Selector.queryAll('.item').forEach((item, index) => {
  item.update({ dataset: { index } });
});
```

---

### 6. Leverage CSS selector power

```javascript
// ✅ Use complex selectors
const firstVisibleButton = Selector.query('.button:not(.hidden):not(:disabled)');

const externalLinks = Selector.queryAll('a[href^="http"]:not([href*="mysite.com"])');

const evenRows = Selector.queryAll('table tr:nth-child(even)');
```

---

## Real-World Examples

### Form validation
```javascript
// Find all required fields
const requiredFields = Selector.queryAll('[required]');

const allFilled = requiredFields.every(field => field.value.trim() !== '');

if (!allFilled) {
  requiredFields
    .filter(field => !field.value.trim())
    .forEach(field => {
      field.update({
        classList: { add: ['error'] },
        style: { borderColor: 'red' }
      });
    });
}
```

---

### Navigation highlighting
```javascript
const currentPath = window.location.pathname;

// Find nav link matching current page
const activeLink = Selector.query(`a[href="${currentPath}"]`);

if (activeLink) {
  // Remove active from all nav items
  Selector.queryAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Add active to current
  activeLink.closest('.nav-item')?.classList.add('active');
}
```

---

### Image lazy loading
```javascript
// Find all images without lazy loading
const images = Selector.queryAll('img:not([loading])');

images.update({
  setAttribute: { loading: 'lazy' }
});

// Add error handling
images.forEach(img => {
  img.addEventListener('error', function() {
    this.src = '/images/placeholder.png';
  });
});
```

---

### Accessible modal
```javascript
// Find modal
const modal = Selector.query('[role="dialog"]');

if (modal) {
  // Find all focusable elements in modal
  const focusable = Selector.queryAll(
    '#modal button, #modal [href], #modal input, #modal select, #modal textarea, #modal [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusable.first();
  const lastFocusable = focusable.last();

  // Trap focus
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  });
}
```

---

### Dynamic content updates
```javascript
// Find all data-bound elements
const boundElements = Selector.queryAll('[data-bind]');

boundElements.forEach(element => {
  const bindPath = element.dataset.bind;
  const value = getNestedValue(data, bindPath);

  element.update({
    textContent: value,
    setAttribute: { 'data-last-update': Date.now() }
  });
});
```

---

## Next Steps

Continue to the other Selector documentation:

- **[Scoped Queries & Bulk Operations](02_Scoped-Bulk-Operations.md)** - Query within containers, bulk updates
- **[Array-like & DOM Manipulation](03_Array-DOM-Methods.md)** - Array methods and DOM shortcuts
- **[Filtering & Async Methods](04_Filtering-Async-Methods.md)** - Filter results, async waiting
- **[Utility Methods](05_Utility-Methods.md)** - Cache, configuration, statistics

---

**[Back to Documentation Home](../../README.md)**
