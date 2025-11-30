# Collections Module - Access Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 1 of 6**: Access Methods for the Collections Helper
> Get collections of DOM elements by class name, tag name, or name attribute

---

## Table of Contents

1. [Overview](#overview)
2. [Understanding Collections](#understanding-collections)
3. [Collections.ClassName - Access by Class](#collectionsclassname---access-by-class)
4. [Collections.TagName - Access by Tag](#collectionstagname---access-by-tag)
5. [Collections.Name - Access by Name Attribute](#collectionsname---access-by-name-attribute)
6. [Enhanced Collections](#enhanced-collections)
7. [Quick Reference Table](#quick-reference-table)
8. [Best Practices](#best-practices)

---

## Overview

The **Collections Helper** provides access to **groups of DOM elements** using three different selectors:

✅ **ClassName** - Get elements by CSS class (like `getElementsByClassName`)
✅ **TagName** - Get elements by HTML tag (like `getElementsByTagName`)
✅ **Name** - Get elements by name attribute (like `getElementsByName`)

**Key Features:**
- **Intelligent caching** - Collections are cached for performance
- **Live collections** - Automatically reflect DOM changes
- **Enhanced syntax** - Two ways to access: property or function style
- **Auto-enhancement** - All collections get array-like methods and `.update()`

---

## Understanding Collections

### What is a Collection?

A **collection** is a group of DOM elements that match a specific criteria:

```javascript
// All elements with class "button"
const buttons = Collections.ClassName.button;

// All <div> elements
const divs = Collections.TagName.div;

// All elements with name="country"
const countries = Collections.Name.country;
```

---

### Collections vs Single Elements

| Feature | Single Element (Elements) | Collection (Collections) |
|---------|--------------------------|--------------------------|
| **Returns** | One element or null | Multiple elements (array-like) |
| **Selector** | ID attribute | Class, tag, or name attribute |
| **Count** | 0 or 1 | 0 to many |
| **Access** | `Elements.header` | `Collections.ClassName.button` |
| **Use case** | Unique elements | Groups of similar elements |

---

### Live vs Static Collections

**Live collections** automatically update when DOM changes:

```javascript
const buttons = Collections.ClassName.button;
console.log(buttons.length);  // 3

// Add a new button to DOM
document.body.appendChild(newButton);

console.log(buttons.length);  // 4 (automatically updated!)
```

This is the native browser behavior that Collections Helper preserves.

---

## `Collections.ClassName` - Access by Class

### What it does

**Get all elements with a specific CSS class**, equivalent to `document.getElementsByClassName()`.

```javascript
// Property syntax
Collections.ClassName.button

// Function syntax
Collections.ClassName('button')
```

**Parameters:**
- Class name (string) - The CSS class to search for (without the dot)

**Returns:** Enhanced HTMLCollection with all matching elements

---

### Why use this?

Instead of:
```javascript
const buttons = document.getElementsByClassName('button');

// Then manually iterate
for (let i = 0; i < buttons.length; i++) {
  buttons[i].style.color = 'blue';
}
```

Use Collections:
```javascript
const buttons = Collections.ClassName.button;

// Use .update() on the entire collection
buttons.update({ style: { color: 'blue' } });
```

---

### Examples

#### Basic access
```javascript
// Get all elements with class "card"
const cards = Collections.ClassName.card;

console.log(cards.length);           // Number of cards
console.log(cards[0]);               // First card
console.log(cards[cards.length - 1]); // Last card
```

#### Property vs Function syntax
```javascript
// Both are equivalent:
const buttons1 = Collections.ClassName.button;
const buttons2 = Collections.ClassName('button');

// Property syntax is cleaner
const cards = Collections.ClassName.card;

// Function syntax for dynamic class names
const className = 'product-' + category;
const products = Collections.ClassName(className);
```

#### Multiple classes on elements
```javascript
// HTML: <div class="card featured"></div>

// Get by "card" class
const cards = Collections.ClassName.card;  // Includes the div

// Get by "featured" class
const featured = Collections.ClassName.featured;  // Also includes the div

// Both collections include elements that have EITHER class
```

**Note:** Unlike CSS selectors, you **cannot** combine classes:
```javascript
// ❌ This won't work
Collections.ClassName('card featured')

// ✅ Use Selector helper instead for complex queries
Selector.queryAll('.card.featured')
```

---

#### Working with the collection
```javascript
const buttons = Collections.ClassName.button;

// Check if empty
if (buttons.length === 0) {
  console.log('No buttons found');
}

// Iterate over elements
for (let i = 0; i < buttons.length; i++) {
  console.log(buttons[i].textContent);
}

// Or use array methods (after converting)
Array.from(buttons).forEach(button => {
  console.log(button.textContent);
});

// Or use enhanced methods (covered in Array-like Methods doc)
buttons.forEach(button => {
  console.log(button.textContent);
});
```

---

#### Dynamic class names
```javascript
function getItemsByCategory(category) {
  return Collections.ClassName(`item-${category}`);
}

const electronics = getItemsByCategory('electronics');
const books = getItemsByCategory('books');

electronics.update({ style: { backgroundColor: '#e0e0e0' } });
```

---

### Common use cases

#### Navigation items
```javascript
const navItems = Collections.ClassName.navItem;

navItems.update({
  classList: { add: ['initialized'] },
  style: { transition: 'all 0.3s' }
});
```

#### Form fields with validation
```javascript
const requiredFields = Collections.ClassName.required;

requiredFields.forEach(field => {
  if (!field.value) {
    field.update({ classList: { add: ['error'] } });
  }
});
```

#### Cards/tiles layout
```javascript
const cards = Collections.ClassName.card;

cards.update({
  style: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  }
});
```

---

## `Collections.TagName` - Access by Tag

### What it does

**Get all elements with a specific HTML tag**, equivalent to `document.getElementsByTagName()`.

```javascript
// Property syntax
Collections.TagName.div

// Function syntax
Collections.TagName('div')
```

**Parameters:**
- Tag name (string) - The HTML tag to search for (case-insensitive)

**Returns:** Enhanced HTMLCollection with all matching elements

---

### Examples

#### Basic tag access
```javascript
// Get all divs
const divs = Collections.TagName.div;

// Get all paragraphs
const paragraphs = Collections.TagName.p;

// Get all buttons
const buttons = Collections.TagName.button;

// Get all images
const images = Collections.TagName.img;
```

#### Common tags
```javascript
// Headings
const h1s = Collections.TagName.h1;
const h2s = Collections.TagName.h2;

// Lists
const lists = Collections.TagName.ul;
const listItems = Collections.TagName.li;

// Forms
const forms = Collections.TagName.form;
const inputs = Collections.TagName.input;
const textareas = Collections.TagName.textarea;

// Tables
const tables = Collections.TagName.table;
const rows = Collections.TagName.tr;
const cells = Collections.TagName.td;
```

---

#### Dynamic tag names
```javascript
function getAllByTag(tagName) {
  return Collections.TagName(tagName);
}

const elements = getAllByTag(userSelectedTag);
```

---

#### Working with specific tags

**Images:**
```javascript
const images = Collections.TagName.img;

images.update({
  setAttribute: { loading: 'lazy' },
  style: { maxWidth: '100%', height: 'auto' }
});
```

**Links:**
```javascript
const links = Collections.TagName.a;

// Add target="_blank" to external links
links.forEach(link => {
  if (link.hostname !== window.location.hostname) {
    link.update({
      setAttribute: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    });
  }
});
```

**Form inputs:**
```javascript
const inputs = Collections.TagName.input;

inputs.update({
  style: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  }
});
```

---

### Common use cases

#### Typography styling
```javascript
const headings = Collections.TagName.h2;

headings.update({
  style: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    marginBottom: '1rem'
  }
});
```

#### Image optimization
```javascript
const images = Collections.TagName.img;

images.forEach(img => {
  // Add loading="lazy" if not already set
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }

  // Add alt if missing
  if (!img.hasAttribute('alt')) {
    img.setAttribute('alt', 'Image');
  }
});
```

#### Table enhancements
```javascript
const tables = Collections.TagName.table;

tables.update({
  classList: { add: ['styled-table'] },
  style: {
    borderCollapse: 'collapse',
    width: '100%'
  }
});
```

---

## `Collections.Name` - Access by Name Attribute

### What it does

**Get all elements with a specific name attribute**, equivalent to `document.getElementsByName()`.

```javascript
// Property syntax
Collections.Name.username

// Function syntax
Collections.Name('username')
```

**Parameters:**
- Name value (string) - The name attribute value to search for

**Returns:** Enhanced NodeList with all matching elements

---

### Understanding the name attribute

The `name` attribute is used primarily in forms:

```html
<input type="text" name="username">
<input type="email" name="email">
<input type="radio" name="gender" value="male">
<input type="radio" name="gender" value="female">
<select name="country">...</select>
```

**Key uses:**
- **Form submission** - Name is sent as the key in form data
- **Radio groups** - Radio buttons share the same name
- **Form field grouping** - Logically group related fields

---

### Examples

#### Form inputs by name
```javascript
// Get all inputs with name="email"
const emailInputs = Collections.Name.email;

// Get all inputs with name="username"
const usernameInputs = Collections.Name.username;
```

---

#### Radio button groups
```javascript
// HTML:
// <input type="radio" name="gender" value="male">
// <input type="radio" name="gender" value="female">

const genderRadios = Collections.Name.gender;

console.log(genderRadios.length);  // 2

// Find which one is checked
genderRadios.forEach(radio => {
  if (radio.checked) {
    console.log('Selected:', radio.value);
  }
});

// Or use .find() (enhanced method)
const selected = genderRadios.find(radio => radio.checked);
console.log(selected?.value);
```

---

#### Dynamic name access
```javascript
function getFormField(fieldName) {
  return Collections.Name(fieldName);
}

const emailFields = getFormField('email');
const phoneFields = getFormField('phone');
```

---

#### Form validation
```javascript
// Validate all email inputs
const emailInputs = Collections.Name.email;

emailInputs.forEach(input => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);

  input.update({
    classList: {
      add: [isValid ? 'valid' : 'invalid'],
      remove: [isValid ? 'invalid' : 'valid']
    }
  });
});
```

---

#### Bulk field updates
```javascript
// Set all 'country' select elements to default
const countrySelects = Collections.Name.country;

countrySelects.update({
  value: 'US',
  disabled: false
});
```

---

### Common use cases

#### Radio button management
```javascript
function getSelectedRadio(radioName) {
  const radios = Collections.Name(radioName);
  return radios.find(radio => radio.checked);
}

function setSelectedRadio(radioName, value) {
  const radios = Collections.Name(radioName);

  radios.forEach(radio => {
    radio.checked = (radio.value === value);
  });
}

// Usage
const selected = getSelectedRadio('gender');
console.log(selected?.value);

setSelectedRadio('gender', 'female');
```

---

#### Form field styling
```javascript
const requiredFields = Collections.Name('required[]');

requiredFields.update({
  style: { borderLeft: '3px solid red' },
  setAttribute: { 'aria-required': 'true' }
});
```

---

#### Multi-select handling
```javascript
// HTML: <select name="interests" multiple>...</select>

const interestSelects = Collections.Name.interests;

interestSelects.forEach(select => {
  const selected = Array.from(select.selectedOptions)
    .map(opt => opt.value);

  console.log('Selected interests:', selected);
});
```

---

## Enhanced Collections

### What makes collections "enhanced"?

All collections returned by the Collections Helper are **enhanced** with additional features:

1. **Array-like methods** - `.forEach()`, `.map()`, `.filter()`, etc.
2. **Utility methods** - `.first()`, `.last()`, `.at()`, `.isEmpty()`
3. **DOM manipulation** - `.addClass()`, `.setStyle()`, `.on()`
4. **Update method** - Universal `.update()` for bulk changes
5. **Filtering** - `.visible()`, `.hidden()`, `.enabled()`, `.disabled()`

These are covered in detail in the other Collections documentation files.

---

### Example of enhanced features

```javascript
const buttons = Collections.ClassName.button;

// Array-like methods
buttons.forEach(btn => console.log(btn.textContent));
const texts = buttons.map(btn => btn.textContent);
const activeButtons = buttons.filter(btn => btn.classList.contains('active'));

// Utility methods
const firstButton = buttons.first();
const lastButton = buttons.last();
const isEmpty = buttons.isEmpty();

// DOM manipulation
buttons.addClass('styled');
buttons.setStyle({ padding: '10px' });
buttons.on('click', handleClick);

// Update method
buttons.update({
  style: { backgroundColor: 'blue' },
  classList: { add: ['enhanced'] }
});

// Filtering
const visibleButtons = buttons.visible();
const enabledButtons = buttons.enabled();
```

---

## Quick Reference Table

### Access Methods Comparison

| Method | Selector | Example | Returns | Use Case |
|--------|----------|---------|---------|----------|
| **ClassName** | CSS class | `Collections.ClassName.button` | HTMLCollection | Elements with class="button" |
| **TagName** | HTML tag | `Collections.TagName.div` | HTMLCollection | All `<div>` elements |
| **Name** | name attribute | `Collections.Name.username` | NodeList | Elements with name="username" |

---

### Syntax Styles

| Style | ClassName | TagName | Name |
|-------|-----------|---------|------|
| **Property** | `Collections.ClassName.button` | `Collections.TagName.div` | `Collections.Name.email` |
| **Function** | `Collections.ClassName('button')` | `Collections.TagName('div')` | `Collections.Name('email')` |
| **Dynamic** | `Collections.ClassName(varName)` | `Collections.TagName(varName)` | `Collections.Name(varName)` |

---

### When to Use What

| Use Case | Best Method | Example |
|----------|-------------|---------|
| **Style all buttons** | ClassName or TagName | `Collections.ClassName.button` |
| **Get all divs** | TagName | `Collections.TagName.div` |
| **Radio button group** | Name | `Collections.Name.gender` |
| **Form fields** | Name | `Collections.Name.email` |
| **Cards/tiles** | ClassName | `Collections.ClassName.card` |
| **Navigation items** | ClassName | `Collections.ClassName.navItem` |
| **All images** | TagName | `Collections.TagName.img` |

---

## Best Practices

### 1. Choose the right selector

```javascript
// ✅ Use ClassName for styled groups
const cards = Collections.ClassName.card;

// ✅ Use TagName for all elements of a type
const images = Collections.TagName.img;

// ✅ Use Name for form fields
const emailInputs = Collections.Name.email;

// ❌ Don't use TagName when ClassName is more specific
const buttons = Collections.TagName.button;  // Gets ALL buttons
const primaryButtons = Collections.ClassName.primaryButton;  // Better
```

---

### 2. Use property syntax for static values

```javascript
// ✅ Clean property syntax
const buttons = Collections.ClassName.button;

// ❌ Unnecessary function call
const buttons = Collections.ClassName('button');

// ✅ Use function syntax for dynamic values
const className = getClassName();
const elements = Collections.ClassName(className);
```

---

### 3. Check collection length before iterating

```javascript
const buttons = Collections.ClassName.button;

// ✅ Check first
if (buttons.length > 0) {
  buttons.forEach(btn => {
    // Process buttons
  });
}

// Or use enhanced .isEmpty()
if (!buttons.isEmpty()) {
  buttons.forEach(btn => {
    // Process buttons
  });
}
```

---

### 4. Remember collections are live

```javascript
const items = Collections.ClassName.item;
console.log(items.length);  // 5

// Add new item to DOM
document.body.appendChild(newItem);

console.log(items.length);  // 6 (automatically updated!)

// ✅ Be aware when iterating
// This can cause infinite loop if you add items in the loop:
for (let i = 0; i < items.length; i++) {
  // ❌ DON'T add items with class "item" here
}

// ✅ Convert to array first if you need to add items
Array.from(items).forEach(item => {
  // Safe to add new items here
});
```

---

### 5. Use enhanced methods for cleaner code

```javascript
const buttons = Collections.ClassName.button;

// ❌ Manual iteration
for (let i = 0; i < buttons.length; i++) {
  buttons[i].style.color = 'blue';
}

// ✅ Use .update()
buttons.update({ style: { color: 'blue' } });

// ✅ Use enhanced methods
buttons.forEach(btn => console.log(btn.textContent));
const firstBtn = buttons.first();
```

---

### 6. Combine with Elements for complete control

```javascript
// Get a specific container
const container = Elements.cardContainer;

// Get all cards within that container
const cards = Collections.ClassName.card;

// Or use scoped queries (Selector helper)
const cardsInContainer = Selector.Scoped.withinAll(container, '.card');
```

---

## Real-World Examples

### Navigation menu styling

```javascript
const navItems = Collections.ClassName.navItem;

navItems.update({
  style: {
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  addEventListener: ['mouseenter', function() {
    this.style.backgroundColor = '#f0f0f0';
  }],
  addEventListener: ['mouseleave', function() {
    this.style.backgroundColor = '';
  }]
});
```

---

### Form validation

```javascript
function validateForm() {
  const requiredFields = Collections.ClassName.required;
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.update({
        classList: { add: ['error'] },
        style: { borderColor: 'red' }
      });
      isValid = false;
    } else {
      field.update({
        classList: { remove: ['error'] },
        style: { borderColor: '' }
      });
    }
  });

  return isValid;
}
```

---

### Image lazy loading

```javascript
const images = Collections.TagName.img;

images.forEach(img => {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }

  // Add error handling
  img.addEventListener('error', function() {
    this.src = '/images/placeholder.png';
  });
});
```

---

### Radio button group

```javascript
function setupRadioGroup(groupName, defaultValue) {
  const radios = Collections.Name(groupName);

  // Set default
  radios.forEach(radio => {
    radio.checked = (radio.value === defaultValue);
  });

  // Add change handler
  radios.on('change', function() {
    console.log(`${groupName} changed to:`, this.value);
  });

  return {
    getValue: () => radios.find(r => r.checked)?.value,
    setValue: (value) => {
      radios.forEach(r => { r.checked = (r.value === value); });
    }
  };
}

const gender = setupRadioGroup('gender', 'male');
console.log(gender.getValue());  // 'male'
gender.setValue('female');
```

---

## Next Steps

Continue to the other Collections documentation:

- **[Bulk Operations](02_Bulk-Operations.md)** - `Collections.update()` for multiple collections
- **[Array-like Methods](03_Array-like-Methods.md)** - `.forEach()`, `.map()`, `.filter()`, etc.
- **[DOM Manipulation](04_DOM-Manipulation.md)** - `.addClass()`, `.setStyle()`, `.on()`, etc.
- **[Filtering Methods](05_Filtering-Methods.md)** - `.visible()`, `.hidden()`, `.enabled()`, etc.
- **[Utility & Helper Methods](06_Utility-Helper-Methods.md)** - `.stats()`, `.configure()`, etc.

---

**[Back to Documentation Home](../../README.md)**
