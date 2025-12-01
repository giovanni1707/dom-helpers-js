# Collections Module - Array-like Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 3 of 6**: Array-like Methods for Collections
> Use familiar array methods on DOM collections

---

## Table of Contents

1. [Overview](#overview)
2. [Core Array Methods](#core-array-methods)
3. [Utility Methods](#utility-methods)
4. [Quick Reference](#quick-reference)
5. [Best Practices](#best-practices)

---

## Overview

All collections are enhanced with **array-like methods** that work just like standard JavaScript array methods. This makes working with collections feel natural and familiar.

✅ **Familiar API** - Same methods as JavaScript arrays
✅ **No conversion needed** - Use directly on collections
✅ **Chainable** - Many methods return new collections or arrays
✅ **Type-safe** - Proper TypeScript support

---

## Core Array Methods

### `.toArray()` - Convert to Array

**Convert collection to a real JavaScript array.**

```javascript
collection.toArray()
```

**Returns:** Array of elements

**Examples:**
```javascript
const buttons = Collections.ClassName.button;
const buttonArray = buttons.toArray();

// Now you can use all array methods
buttonArray.reverse();
buttonArray.sort((a, b) => a.textContent.localeCompare(b.textContent));
```

**When to use:** When you need array mutation methods like `.reverse()`, `.sort()`, `.splice()`.

---

### `.forEach()` - Iterate Over Elements

**Execute a function for each element in the collection.**

```javascript
collection.forEach(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function to execute
- `thisArg` (optional) - Value to use as `this`

**Returns:** `undefined`

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Basic iteration
buttons.forEach(button => {
  console.log(button.textContent);
});

// With index
buttons.forEach((button, index) => {
  button.textContent = `Button ${index + 1}`;
});

// With thisArg
const config = { prefix: 'Btn' };
buttons.forEach(function(button, index) {
  button.textContent = `${this.prefix} ${index}`;
}, config);
```

---

### `.map()` - Transform Elements

**Create a new array with results of calling a function on every element.**

```javascript
collection.map(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function that produces an element of the new array
- `thisArg` (optional) - Value to use as `this`

**Returns:** New array with mapped values

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Get all button texts
const texts = buttons.map(btn => btn.textContent);
// ['Submit', 'Cancel', 'Reset']

// Get button IDs
const ids = buttons.map(btn => btn.id);

// Complex transformation
const buttonData = buttons.map((btn, index) => ({
  index,
  id: btn.id,
  text: btn.textContent,
  disabled: btn.disabled
}));
```

---

### `.filter()` - Filter Elements

**Create a new array with elements that pass a test.**

```javascript
collection.filter(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function to test each element
- `thisArg` (optional) - Value to use as `this`

**Returns:** New array with elements that pass the test

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Get enabled buttons
const enabled = buttons.filter(btn => !btn.disabled);

// Get buttons with specific text
const submitButtons = buttons.filter(btn =>
  btn.textContent.toLowerCase().includes('submit')
);

// Complex filtering
const activeVisibleButtons = buttons.filter(btn =>
  btn.classList.contains('active') && btn.offsetParent !== null
);
```

---

### `.find()` - Find Single Element

**Return the first element that passes a test.**

```javascript
collection.find(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function to test each element
- `thisArg` (optional) - Value to use as `this`

**Returns:** First matching element, or `undefined`

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Find first disabled button
const disabled = buttons.find(btn => btn.disabled);

// Find button by ID
const submitBtn = buttons.find(btn => btn.id === 'submitBtn');

// Find button with specific data attribute
const primary = buttons.find(btn =>
  btn.dataset.type === 'primary'
);

// Safe usage with optional chaining
const text = buttons.find(btn => btn.id === 'main')?.textContent;
```

---

### `.some()` - Test If Any Match

**Test whether at least one element passes a test.**

```javascript
collection.some(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function to test each element
- `thisArg` (optional) - Value to use as `this`

**Returns:** `true` if at least one element passes, `false` otherwise

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Check if any button is disabled
const hasDisabled = buttons.some(btn => btn.disabled);

// Check if any button has error class
const hasErrors = buttons.some(btn =>
  btn.classList.contains('error')
);

// Check if any button is visible
const hasVisible = buttons.some(btn =>
  btn.offsetParent !== null
);

if (hasDisabled) {
  console.log('Some buttons are disabled');
}
```

---

### `.every()` - Test If All Match

**Test whether all elements pass a test.**

```javascript
collection.every(callback, thisArg)
```

**Parameters:**
- `callback(element, index, collection)` - Function to test each element
- `thisArg` (optional) - Value to use as `this`

**Returns:** `true` if all elements pass, `false` otherwise

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Check if all buttons are enabled
const allEnabled = buttons.every(btn => !btn.disabled);

// Check if all buttons have IDs
const allHaveIds = buttons.every(btn => btn.id);

// Check if all buttons are visible
const allVisible = buttons.every(btn =>
  btn.offsetParent !== null
);

if (allEnabled) {
  console.log('All buttons are ready');
}
```

---

### `.reduce()` - Reduce to Single Value

**Execute a reducer function on each element, resulting in a single output value.**

```javascript
collection.reduce(callback, initialValue)
```

**Parameters:**
- `callback(accumulator, element, index, collection)` - Reducer function
- `initialValue` (optional) - Initial value for the accumulator

**Returns:** The accumulated value

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Count total characters in all button texts
const totalChars = buttons.reduce((total, btn) => {
  return total + btn.textContent.length;
}, 0);

// Collect all button texts into a single string
const allTexts = buttons.reduce((str, btn, index) => {
  return str + (index > 0 ? ', ' : '') + btn.textContent;
}, '');
// 'Submit, Cancel, Reset'

// Create an object mapping IDs to elements
const buttonMap = buttons.reduce((map, btn) => {
  if (btn.id) map[btn.id] = btn;
  return map;
}, {});

// Count buttons by type
const countByType = buttons.reduce((counts, btn) => {
  const type = btn.dataset.type || 'default';
  counts[type] = (counts[type] || 0) + 1;
  return counts;
}, {});
```

---

## Utility Methods

### `.first()` - Get First Element

**Get the first element in the collection.**

```javascript
collection.first()
```

**Returns:** First element, or `null` if empty

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

const firstButton = buttons.first();
firstButton?.update({ classList: { add: ['first'] } });

// Equivalent to:
const firstButton = buttons[0] || null;
```

---

### `.last()` - Get Last Element

**Get the last element in the collection.**

```javascript
collection.last()
```

**Returns:** Last element, or `null` if empty

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

const lastButton = buttons.last();
lastButton?.update({ classList: { add: ['last'] } });

// Equivalent to:
const lastButton = buttons[buttons.length - 1] || null;
```

---

### `.at()` - Get Element at Index

**Get element at a specific index (supports negative indices).**

```javascript
collection.at(index)
```

**Parameters:**
- `index` (number) - Index (negative counts from end)

**Returns:** Element at index, or `undefined`

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

const first = buttons.at(0);      // First element
const second = buttons.at(1);     // Second element
const last = buttons.at(-1);      // Last element
const secondLast = buttons.at(-2); // Second to last

// Safe with bounds
const outOfBounds = buttons.at(999); // undefined (no error)
```

---

### `.isEmpty()` - Check If Empty

**Check if collection has no elements.**

```javascript
collection.isEmpty()
```

**Returns:** `true` if empty, `false` otherwise

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

if (buttons.isEmpty()) {
  console.log('No buttons found');
} else {
  console.log(`Found ${buttons.length} buttons`);
}

// Equivalent to:
if (buttons.length === 0) { ... }
```

---

### `.item()` - Get Element by Index

**Standard HTMLCollection method - get element by index.**

```javascript
collection.item(index)
```

**Parameters:**
- `index` (number) - Zero-based index

**Returns:** Element at index, or `null`

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

const first = buttons.item(0);
const second = buttons.item(1);

// Usually prefer bracket notation:
const first = buttons[0];
```

---

### `.namedItem()` - Get Element by Name or ID

**Standard HTMLCollection method - get element by name or ID.**

```javascript
collection.namedItem(name)
```

**Parameters:**
- `name` (string) - Element name or ID

**Returns:** Element, or `null`

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Find by ID
const submitBtn = buttons.namedItem('submitBtn');

// Find by name attribute
const userBtn = buttons.namedItem('user-button');
```

---

## Quick Reference

### Array Methods

| Method | Returns | Use Case | Example |
|--------|---------|----------|---------|
| **toArray()** | Array | Convert to real array | `buttons.toArray()` |
| **forEach()** | undefined | Iterate elements | `buttons.forEach(btn => ...)` |
| **map()** | Array | Transform values | `buttons.map(btn => btn.id)` |
| **filter()** | Array | Filter elements | `buttons.filter(btn => !btn.disabled)` |
| **find()** | Element or undefined | Find one element | `buttons.find(btn => btn.id === 'x')` |
| **some()** | Boolean | Test if any match | `buttons.some(btn => btn.disabled)` |
| **every()** | Boolean | Test if all match | `buttons.every(btn => btn.id)` |
| **reduce()** | Any | Reduce to value | `buttons.reduce((sum, btn) => ...)` |

### Utility Methods

| Method | Returns | Use Case | Example |
|--------|---------|----------|---------|
| **first()** | Element or null | Get first element | `buttons.first()` |
| **last()** | Element or null | Get last element | `buttons.last()` |
| **at(index)** | Element or undefined | Get by index (negative OK) | `buttons.at(-1)` |
| **isEmpty()** | Boolean | Check if empty | `buttons.isEmpty()` |
| **item(index)** | Element or null | Standard method | `buttons.item(0)` |
| **namedItem(name)** | Element or null | Get by name/ID | `buttons.namedItem('submit')` |

---

## Best Practices

### 1. Use forEach for side effects, map for transformations

```javascript
const buttons = Collections.ClassName.button;

// ✅ forEach for side effects (updating DOM)
buttons.forEach(btn => {
  btn.update({ classList: { add: ['styled'] } });
});

// ✅ map for transformations (getting data)
const buttonTexts = buttons.map(btn => btn.textContent);
```

---

### 2. Chain array methods for complex operations

```javascript
const buttons = Collections.ClassName.button;

// Get texts of enabled buttons
const enabledTexts = buttons
  .filter(btn => !btn.disabled)
  .map(btn => btn.textContent);

// Find first visible button with specific class
const target = buttons
  .filter(btn => btn.offsetParent !== null)
  .find(btn => btn.classList.contains('primary'));
```

---

### 3. Use utility methods for cleaner code

```javascript
// ❌ Manual index access
const firstButton = buttons[0] || null;
const lastButton = buttons[buttons.length - 1] || null;

// ✅ Use utility methods
const firstButton = buttons.first();
const lastButton = buttons.last();
```

---

### 4. Prefer filter + forEach over manual iteration

```javascript
// ❌ Manual loop with conditionals
for (let i = 0; i < buttons.length; i++) {
  if (!buttons[i].disabled && buttons[i].offsetParent !== null) {
    buttons[i].update({ classList: { add: ['active'] } });
  }
}

// ✅ Filter then forEach
buttons
  .filter(btn => !btn.disabled && btn.offsetParent !== null)
  .forEach(btn => {
    btn.update({ classList: { add: ['active'] } });
  });
```

---

### 5. Use some/every for validation

```javascript
const inputs = Collections.TagName.input;

// ✅ Check if all fields are filled
const allFilled = inputs.every(input => input.value.trim() !== '');

// ✅ Check if any field has error
const hasErrors = inputs.some(input => input.classList.contains('error'));

if (!allFilled) {
  console.log('Please fill all fields');
}

if (hasErrors) {
  console.log('Please fix errors');
}
```

---

## Real-World Examples

### Form validation

```javascript
const inputs = Collections.ClassName.requiredField;

// Check if all required fields are filled
const allValid = inputs.every(input => {
  return input.value.trim() !== '';
});

if (!allValid) {
  // Highlight empty fields
  inputs
    .filter(input => !input.value.trim())
    .forEach(input => {
      input.update({
        classList: { add: ['error'] },
        style: { borderColor: 'red' }
      });
    });
}
```

---

### Navigation highlighting

```javascript
const navItems = Collections.ClassName.navItem;
const currentPath = window.location.pathname;

// Find and highlight current page nav item
const currentNav = navItems.find(item => {
  const href = item.getAttribute('href');
  return href === currentPath;
});

if (currentNav) {
  // Remove active from all
  navItems.forEach(item => {
    item.update({ classList: { remove: ['active'] } });
  });

  // Set current as active
  currentNav.update({
    classList: { add: ['active'] },
    setAttribute: { 'aria-current': 'page' }
  });
}
```

---

### Data collection

```javascript
const cards = Collections.ClassName.productCard;

// Collect product data
const products = cards.map(card => ({
  id: card.dataset.productId,
  name: card.querySelector('.product-name')?.textContent,
  price: parseFloat(card.dataset.price),
  inStock: card.dataset.inStock === 'true'
}));

// Calculate total inventory value
const totalValue = cards
  .filter(card => card.dataset.inStock === 'true')
  .reduce((total, card) => {
    return total + parseFloat(card.dataset.price);
  }, 0);

console.log(`Total inventory value: $${totalValue}`);
```

---

### Conditional updates

```javascript
const buttons = Collections.ClassName.button;

// Update only enabled buttons
buttons
  .filter(btn => !btn.disabled)
  .forEach(btn => {
    btn.update({
      classList: { add: ['clickable'] },
      style: { cursor: 'pointer' }
    });
  });

// Update only visible buttons
buttons
  .filter(btn => btn.offsetParent !== null)
  .forEach(btn => {
    btn.update({ classList: { add: ['visible'] } });
  });
```

---

## Next Steps

Continue to the other Collections documentation:

- **[Access Methods](01_Access-Methods.md)** - Getting collections
- **[Bulk Operations](02_Bulk-Operations.md)** - `Collections.update()`
- **[DOM Manipulation](04_DOM-Manipulation.md)** - `.addClass()`, `.setStyle()`, `.on()`
- **[Filtering Methods](05_Filtering-Methods.md)** - `.visible()`, `.hidden()`, `.enabled()`
- **[Utility & Helper Methods](06_Utility-Helper-Methods.md)** - `.stats()`, `.configure()`

---

**[Back to Documentation Home](../../README.md)**
