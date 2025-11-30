# createElement Enhancement - Complete Guide

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Enhanced element creation with automatic `.update()` method**
> Create single elements or bulk create multiple elements with configuration

---

## Table of Contents

1. [Overview](#overview)
2. [Basic Creation](#basic-creation)
3. [Bulk Creation](#bulk-creation)
4. [Bulk Result Object Methods](#bulk-result-object-methods)
5. [Configuration](#configuration)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)

---

## Overview

### What is createElement Enhancement?

The **createElement Enhancement** extends the native `document.createElement()` to:
- **Automatically add `.update()` method** to created elements
- **Support configuration objects** for instant setup
- **Enable bulk creation** of multiple elements at once
- **Provide enhanced result objects** with utility methods

---

### How it works

```javascript
// Native createElement (unchanged behavior)
const div = document.createElement('div');

// Enhanced createElement (with .update() method)
const div = document.createElement('div', {
  textContent: 'Hello',
  className: 'box',
  style: { padding: '10px' }
});

// Bulk creation
const elements = createElement.bulk([
  { tag: 'div', id: 'container' },
  { tag: 'span', textContent: 'Hello' }
]);
```

---

### Key Features

✅ **Auto-enhanced** - All created elements get `.update()` method
✅ **Configuration objects** - Set properties during creation
✅ **Bulk creation** - Create multiple elements at once
✅ **Enhanced results** - Utility methods on bulk results
✅ **Opt-in enhancement** - Can be enabled/disabled
✅ **Backward compatible** - Preserves native behavior

---

## Basic Creation

### Enhanced createElement Syntax

```javascript
document.createElement(tagName, options)
// or
createElement(tagName, options)
```

**Parameters:**
- `tagName` (string) - HTML tag name ('div', 'span', 'button', etc.)
- `options` (object) - Configuration object or native options

**Returns:** Enhanced element with `.update()` method

---

### Standard Usage (No Configuration)

```javascript
// Create element without configuration
const div = document.createElement('div');

// Element has .update() method
div.update({
  textContent: 'Hello',
  style: { padding: '10px' }
});
```

---

### Usage with Configuration Object

```javascript
// Create and configure in one call
const button = document.createElement('button', {
  textContent: 'Click Me',
  className: 'btn btn-primary',
  style: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white'
  },
  addEventListener: ['click', handleClick]
});
```

**What gets configured:**
- Any property in the configuration object
- Uses `.update()` internally for setup
- Element is ready to use immediately

---

### Examples: Basic Creation

#### Create a button
```javascript
const submitBtn = document.createElement('button', {
  id: 'submitBtn',
  textContent: 'Submit',
  className: 'btn btn-primary',
  type: 'submit',
  disabled: false,
  style: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  }
});
```

---

#### Create an input field
```javascript
const emailInput = document.createElement('input', {
  id: 'emailInput',
  type: 'email',
  placeholder: 'Enter your email',
  required: true,
  className: 'form-control',
  setAttribute: {
    autocomplete: 'email',
    'aria-label': 'Email address'
  },
  style: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  }
});
```

---

#### Create a card
```javascript
const card = document.createElement('div', {
  className: 'card',
  innerHTML: `
    <div class="card-header">Card Title</div>
    <div class="card-body">Card content here</div>
  `,
  style: {
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  dataset: {
    cardId: '123',
    type: 'info'
  }
});
```

---

#### Create an image
```javascript
const image = document.createElement('img', {
  src: '/images/photo.jpg',
  alt: 'Photo description',
  className: 'img-fluid',
  setAttribute: {
    loading: 'lazy',
    decoding: 'async'
  },
  style: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px'
  }
});
```

---

### Native Options Still Work

```javascript
// Native 'is' option (Web Components)
const myButton = document.createElement('button', { is: 'my-button' });

// Configuration is detected automatically
const configuredButton = document.createElement('button', {
  textContent: 'Click',  // Detected as config
  className: 'btn'
});
```

**How detection works:**
- If options has `is` property → treated as native options
- Otherwise, if it has config properties → treated as configuration
- Backward compatible with all native behavior

---

## Bulk Creation

### createElement.bulk() Syntax

```javascript
createElement.bulk(definitions)
// or
createElement.update(definitions)  // Alias
```

**Parameters:**
- `definitions` (array) - Array of element definition objects

**Returns:** Enhanced result object with all created elements

---

### Element Definition Object

```javascript
{
  tag: 'div',              // Required: HTML tag name
  id: 'elementId',         // Optional: Will be used as key
  textContent: 'Text',     // Optional: Any .update() property
  className: 'class',      // Optional: Any .update() property
  style: { ... },          // Optional: Any .update() property
  // ... any other .update() properties
}
```

---

### Basic Bulk Creation

```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'container' },
  { tag: 'span', id: 'label', textContent: 'Hello' },
  { tag: 'button', id: 'submitBtn', textContent: 'Submit' }
]);

// Access by ID
console.log(elements.container);  // <div id="container">
console.log(elements.label);      // <span id="label">Hello</span>
console.log(elements.submitBtn);  // <button id="submitBtn">Submit</button>
```

---

### Bulk Creation with Full Configuration

```javascript
const formElements = createElement.bulk([
  {
    tag: 'form',
    id: 'loginForm',
    className: 'login-form',
    setAttribute: { novalidate: 'true' }
  },
  {
    tag: 'input',
    id: 'email',
    type: 'email',
    placeholder: 'Email',
    required: true,
    className: 'form-control'
  },
  {
    tag: 'input',
    id: 'password',
    type: 'password',
    placeholder: 'Password',
    required: true,
    className: 'form-control'
  },
  {
    tag: 'button',
    id: 'submitBtn',
    type: 'submit',
    textContent: 'Sign In',
    className: 'btn btn-primary',
    style: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white'
    }
  }
]);

// Build form
formElements.loginForm.appendChild(formElements.email);
formElements.loginForm.appendChild(formElements.password);
formElements.loginForm.appendChild(formElements.submitBtn);
document.body.appendChild(formElements.loginForm);
```

---

### Elements Without IDs

```javascript
const elements = createElement.bulk([
  { tag: 'div', textContent: 'Item 1' },
  { tag: 'div', textContent: 'Item 2' },
  { tag: 'div', textContent: 'Item 3' }
]);

// Access by index
elements[0];  // First div
elements[1];  // Second div
elements[2];  // Third div

// Or use .all property
elements.all.forEach(el => {
  console.log(el.textContent);
});
```

---

### Mixed IDs and No IDs

```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'container', className: 'container' },
  { tag: 'h1', textContent: 'Title' },  // No ID
  { tag: 'p', textContent: 'Paragraph' },  // No ID
  { tag: 'button', id: 'closeBtn', textContent: 'Close' }
]);

// Access by ID
elements.container;  // <div id="container">
elements.closeBtn;   // <button id="closeBtn">

// Access all (including those without IDs)
elements.all;  // Array of all 4 elements
```

---

## Bulk Result Object Methods

The object returned by `createElement.bulk()` has enhanced methods:

---

### `.toArray(...tagNames)` - Convert to Array

**Get specific elements as an array in creation order.**

```javascript
result.toArray(...tagNames)
```

**Parameters:**
- `...tagNames` (strings) - Element IDs to include (optional)

**Returns:** Array of elements

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'main' },
  { tag: 'div', id: 'footer' }
]);

// Get specific elements as array
const layout = elements.toArray('header', 'main', 'footer');
// [header, main, footer]

// Append in order
layout.forEach(el => document.body.appendChild(el));
```

---

### `.ordered(...tagNames)` - Get in Specific Order

**Get elements in a specific order (different from creation order).**

```javascript
result.ordered(...tagNames)
```

**Parameters:**
- `...tagNames` (strings) - Element IDs in desired order

**Returns:** Array of elements in specified order

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'footer' },
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'main' }
]);

// Get in logical order (not creation order)
const layout = elements.ordered('header', 'main', 'footer');
// [header, main, footer]

layout.forEach(el => document.body.appendChild(el));
```

---

### `.all` - All Elements Array

**Get all created elements as an array (getter).**

```javascript
result.all
```

**Returns:** Array of all elements

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'container' },
  { tag: 'span', textContent: 'Hello' },  // No ID
  { tag: 'button', id: 'btn' }
]);

// Get all elements
console.log(elements.all);  // [div, span, button]

// Use array methods
elements.all.forEach(el => {
  el.update({ classList: { add: ['created'] } });
});

// Count
console.log(`Created ${elements.all.length} elements`);
```

---

### `.updateMultiple(updates)` - Update Multiple Elements

**Update multiple created elements at once.**

```javascript
result.updateMultiple(updates)
```

**Parameters:**
- `updates` (object) - Object mapping element IDs to update configs

**Returns:** Result object (for chaining)

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'main' },
  { tag: 'div', id: 'footer' }
]);

// Update multiple elements
elements.updateMultiple({
  header: {
    textContent: 'Header',
    style: { backgroundColor: '#333', color: 'white' }
  },
  main: {
    textContent: 'Main Content',
    style: { minHeight: '500px' }
  },
  footer: {
    textContent: 'Footer',
    style: { backgroundColor: '#f8f9fa' }
  }
});
```

---

### `.count` - Element Count

**Get the number of created elements (getter).**

```javascript
result.count
```

**Returns:** Number of elements

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'item1' },
  { tag: 'div', id: 'item2' },
  { tag: 'div', id: 'item3' }
]);

console.log(`Created ${elements.count} elements`);  // 3
```

---

### `.keys` - Element IDs

**Get array of element IDs (getter).**

```javascript
result.keys
```

**Returns:** Array of element IDs (only elements with IDs)

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'header' },
  { tag: 'div' },  // No ID
  { tag: 'div', id: 'footer' }
]);

console.log(elements.keys);  // ['header', 'footer']
```

---

### `.has(key)` - Check if Element Exists

**Check if an element with specific ID exists.**

```javascript
result.has(key)
```

**Parameters:**
- `key` (string) - Element ID to check

**Returns:** Boolean

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'footer' }
]);

console.log(elements.has('header'));   // true
console.log(elements.has('sidebar'));  // false

if (elements.has('header')) {
  elements.header.update({ textContent: 'Welcome' });
}
```

---

### `.get(key, fallback)` - Get with Fallback

**Get element by ID with optional fallback.**

```javascript
result.get(key, fallback)
```

**Parameters:**
- `key` (string) - Element ID
- `fallback` (any, optional) - Fallback value if not found

**Returns:** Element or fallback

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'header' }
]);

const header = elements.get('header');  // <div id="header">
const sidebar = elements.get('sidebar', null);  // null

// With custom fallback
const main = elements.get('main', document.createElement('div'));
```

---

### `.forEach(callback)` - Iterate Elements

**Iterate over all created elements.**

```javascript
result.forEach(callback)
```

**Parameters:**
- `callback(element, index, array)` - Callback function

**Returns:** Result object (for chaining)

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'item1' },
  { tag: 'div', id: 'item2' },
  { tag: 'div', id: 'item3' }
]);

elements.forEach((el, index) => {
  el.update({
    textContent: `Item ${index + 1}`,
    dataset: { index }
  });
});
```

---

### `.map(callback)` - Transform Elements

**Map over elements to create new array.**

```javascript
result.map(callback)
```

**Parameters:**
- `callback(element, index, array)` - Callback function

**Returns:** New array with mapped values

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'item1', textContent: 'One' },
  { tag: 'div', id: 'item2', textContent: 'Two' },
  { tag: 'div', id: 'item3', textContent: 'Three' }
]);

const texts = elements.map(el => el.textContent);
// ['One', 'Two', 'Three']

const ids = elements.map(el => el.id);
// ['item1', 'item2', 'item3']
```

---

### `.filter(callback)` - Filter Elements

**Filter elements based on condition.**

```javascript
result.filter(callback)
```

**Parameters:**
- `callback(element, index, array)` - Filter function

**Returns:** New array with filtered elements

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'visible1', className: 'visible' },
  { tag: 'div', id: 'hidden', className: 'hidden' },
  { tag: 'div', id: 'visible2', className: 'visible' }
]);

const visibleElements = elements.filter(el =>
  el.classList.contains('visible')
);
// [visible1, visible2]
```

---

### `.appendTo(container)` - Append All to Container

**Append all elements to a container.**

```javascript
result.appendTo(container)
```

**Parameters:**
- `container` (Element | string) - Container element or selector

**Returns:** Result object (for chaining)

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', textContent: 'Item 1' },
  { tag: 'div', textContent: 'Item 2' },
  { tag: 'div', textContent: 'Item 3' }
]);

// Append all to body
elements.appendTo(document.body);

// Append to specific container
elements.appendTo('#container');

// Append to element reference
const container = Elements.container;
elements.appendTo(container);
```

---

### `.appendToOrdered(container, ...tagNames)` - Append Specific Elements

**Append specific elements in order.**

```javascript
result.appendToOrdered(container, ...tagNames)
```

**Parameters:**
- `container` (Element | string) - Container element or selector
- `...tagNames` (strings) - Element IDs in order to append

**Returns:** Result object (for chaining)

**Examples:**
```javascript
const elements = createElement.bulk([
  { tag: 'div', id: 'footer' },
  { tag: 'div', id: 'header' },
  { tag: 'div', id: 'main' }
]);

// Append in logical order
elements.appendToOrdered(document.body, 'header', 'main', 'footer');
// DOM order: header, main, footer
```

---

## Configuration

### Enable/Disable Enhancement

The createElement enhancement is **opt-in** and can be controlled:

---

### Default Configuration

```javascript
const DEFAULTS = {
  autoEnhanceCreateElement: true  // Auto-enhance by default
};
```

---

### Enable Enhancement

```javascript
DOMHelpers.enableCreateElementEnhancement();
```

**What happens:**
- `document.createElement` is replaced with enhanced version
- All created elements get `.update()` method
- Configuration objects are supported

**Example:**
```javascript
// Enable enhancement
DOMHelpers.enableCreateElementEnhancement();

// Now all created elements are enhanced
const div = document.createElement('div');
div.update({ textContent: 'Hello' });  // Works!
```

---

### Disable Enhancement

```javascript
DOMHelpers.disableCreateElementEnhancement();
```

**What happens:**
- `document.createElement` is restored to native version
- No automatic `.update()` method
- Configuration objects don't work

**Example:**
```javascript
// Disable enhancement
DOMHelpers.disableCreateElementEnhancement();

// Now createElement is native
const div = document.createElement('div');
div.update({ ... });  // Error: update is not a function
```

---

### Check Enhancement Status

```javascript
// The original createElement is stored
const isEnhanced = document.createElement !== originalCreateElement;
```

---

### Global createElement Shortcut

```javascript
// Available globally
const div = createElement('div', {
  textContent: 'Hello',
  className: 'box'
});

// Same as
const div = document.createElement('div', {
  textContent: 'Hello',
  className: 'box'
});
```

---

## Complete Examples

### Example 1: Build a Form

```javascript
const form = createElement.bulk([
  {
    tag: 'form',
    id: 'registrationForm',
    className: 'registration-form',
    setAttribute: { novalidate: 'true' }
  },
  {
    tag: 'h2',
    id: 'formTitle',
    textContent: 'Register',
    style: { marginBottom: '20px' }
  },
  {
    tag: 'input',
    id: 'firstName',
    type: 'text',
    placeholder: 'First Name',
    required: true,
    className: 'form-control'
  },
  {
    tag: 'input',
    id: 'lastName',
    type: 'text',
    placeholder: 'Last Name',
    required: true,
    className: 'form-control'
  },
  {
    tag: 'input',
    id: 'email',
    type: 'email',
    placeholder: 'Email',
    required: true,
    className: 'form-control'
  },
  {
    tag: 'button',
    id: 'submitBtn',
    type: 'submit',
    textContent: 'Register',
    className: 'btn btn-primary'
  }
]);

// Build form structure
form.registrationForm.appendChild(form.formTitle);
form.registrationForm.appendChild(form.firstName);
form.registrationForm.appendChild(form.lastName);
form.registrationForm.appendChild(form.email);
form.registrationForm.appendChild(form.submitBtn);

// Add to page
document.body.appendChild(form.registrationForm);

// Add event handler
form.registrationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value
  };
  console.log('Form data:', data);
});
```

---

### Example 2: Build a Card Grid

```javascript
function createCardGrid(items) {
  // Create container
  const container = createElement('div', {
    id: 'cardGrid',
    className: 'card-grid',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      padding: '20px'
    }
  });

  // Create cards
  const cards = items.map((item, index) => {
    return createElement('div', {
      id: `card-${index}`,
      className: 'card',
      innerHTML: `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `,
      style: {
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      dataset: {
        itemId: item.id,
        category: item.category
      }
    });
  });

  // Append all cards
  cards.forEach(card => container.appendChild(card));

  return container;
}

// Usage
const items = [
  { id: 1, title: 'Item 1', description: 'Desc 1', image: '/img1.jpg', category: 'A' },
  { id: 2, title: 'Item 2', description: 'Desc 2', image: '/img2.jpg', category: 'B' },
  { id: 3, title: 'Item 3', description: 'Desc 3', image: '/img3.jpg', category: 'A' }
];

const grid = createCardGrid(items);
document.body.appendChild(grid);
```

---

### Example 3: Modal Dialog

```javascript
const modal = createElement.bulk([
  {
    tag: 'div',
    id: 'modalOverlay',
    className: 'modal-overlay',
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999'
    }
  },
  {
    tag: 'div',
    id: 'modalDialog',
    className: 'modal-dialog',
    setAttribute: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modalTitle'
    },
    style: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  },
  {
    tag: 'h2',
    id: 'modalTitle',
    textContent: 'Modal Title',
    style: { marginTop: '0' }
  },
  {
    tag: 'div',
    id: 'modalContent',
    textContent: 'Modal content goes here...'
  },
  {
    tag: 'button',
    id: 'modalClose',
    textContent: 'Close',
    className: 'btn btn-secondary',
    style: {
      marginTop: '20px',
      padding: '10px 20px'
    }
  }
]);

// Build modal structure
modal.modalDialog.appendChild(modal.modalTitle);
modal.modalDialog.appendChild(modal.modalContent);
modal.modalDialog.appendChild(modal.modalClose);
modal.modalOverlay.appendChild(modal.modalDialog);

// Add close handler
modal.modalClose.addEventListener('click', () => {
  modal.modalOverlay.remove();
});

modal.modalOverlay.addEventListener('click', (e) => {
  if (e.target === modal.modalOverlay) {
    modal.modalOverlay.remove();
  }
});

// Show modal
document.body.appendChild(modal.modalOverlay);
```

---

### Example 4: Dynamic List Builder

```javascript
function createList(items, ordered = false) {
  const listTag = ordered ? 'ol' : 'ul';

  // Create list container
  const list = createElement(listTag, {
    className: 'dynamic-list',
    style: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    }
  });

  // Create list items
  const listItems = items.map((item, index) => {
    return createElement('li', {
      textContent: item,
      className: 'list-item',
      dataset: { index },
      style: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer'
      },
      addEventListener: ['click', function() {
        console.log('Clicked:', this.textContent);
      }]
    });
  });

  // Append all items
  listItems.forEach(item => list.appendChild(item));

  return list;
}

// Usage
const myList = createList(['Apple', 'Banana', 'Cherry', 'Date']);
document.body.appendChild(myList);
```

---

## Best Practices

### 1. Use configuration objects for setup

```javascript
// ✅ Configure during creation
const button = createElement('button', {
  textContent: 'Click',
  className: 'btn',
  style: { padding: '10px' }
});

// ❌ Configure after creation
const button = createElement('button');
button.textContent = 'Click';
button.className = 'btn';
button.style.padding = '10px';
```

---

### 2. Use bulk creation for related elements

```javascript
// ✅ Create related elements together
const form = createElement.bulk([
  { tag: 'form', id: 'myForm' },
  { tag: 'input', id: 'name' },
  { tag: 'button', id: 'submit' }
]);

// ❌ Individual creation
const form = createElement('form');
const input = createElement('input');
const button = createElement('button');
```

---

### 3. Use IDs for easy access

```javascript
// ✅ With IDs
const elements = createElement.bulk([
  { tag: 'div', id: 'header', textContent: 'Header' },
  { tag: 'div', id: 'main', textContent: 'Main' }
]);
elements.header;  // Easy access

// ❌ Without IDs
const elements = createElement.bulk([
  { tag: 'div', textContent: 'Header' },
  { tag: 'div', textContent: 'Main' }
]);
elements[0];  // Index-based access
```

---

### 4. Use helper methods for ordering

```javascript
// ✅ Use .appendToOrdered()
elements.appendToOrdered(container, 'header', 'main', 'footer');

// ❌ Manual appending
container.appendChild(elements.header);
container.appendChild(elements.main);
container.appendChild(elements.footer);
```

---

### 5. Combine with Elements/Collections/Selector

```javascript
// Create elements
const modal = createElement.bulk([
  { tag: 'div', id: 'modal' },
  { tag: 'button', id: 'closeBtn' }
]);

// Add to DOM
document.body.appendChild(modal.modal);

// Now accessible via Elements helper
Elements.modal.update({ style: { display: 'block' } });
```

---

## Summary

**createElement Enhancement** provides:

✅ **Basic Creation:**
- Auto-enhanced elements with `.update()` method
- Configuration objects during creation
- Backward compatible with native behavior

✅ **Bulk Creation:**
- Create multiple elements at once
- Access by ID or index
- Configure all elements during creation

✅ **Bulk Result Methods:**
- `.toArray()`, `.ordered()` - Get elements as arrays
- `.all`, `.count`, `.keys` - Inspect results
- `.has()`, `.get()` - Safe access
- `.forEach()`, `.map()`, `.filter()` - Iterate/transform
- `.updateMultiple()` - Batch updates
- `.appendTo()`, `.appendToOrdered()` - DOM insertion

✅ **Configuration:**
- `enableCreateElementEnhancement()` - Turn on
- `disableCreateElementEnhancement()` - Turn off
- Opt-in enhancement

**Use It For:**
- Creating enhanced elements
- Building complex UI structures
- Dynamic element generation
- Component creation

---

**[Back to Documentation Home](../README.md)**
