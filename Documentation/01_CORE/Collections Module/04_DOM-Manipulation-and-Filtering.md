# Collections Module - DOM Manipulation & Filtering Methods

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 4 of 6**: DOM Manipulation & Filtering Methods for Collections
> Shorthand methods for common DOM operations and element filtering

---

## Table of Contents

**DOM Manipulation Methods:**
1. [addClass() - Add Classes](#addclass---add-classes)
2. [removeClass() - Remove Classes](#removeclass---remove-classes)
3. [toggleClass() - Toggle Classes](#toggleclass---toggle-classes)
4. [setProperty() - Set Properties](#setproperty---set-properties)
5. [setAttribute() - Set Attributes](#setattribute---set-attributes)
6. [setStyle() - Set Styles](#setstyle---set-styles)
7. [on() - Add Event Listeners](#on---add-event-listeners)
8. [off() - Remove Event Listeners](#off---remove-event-listeners)

**Filtering Methods:**
9. [visible() - Filter Visible Elements](#visible---filter-visible-elements)
10. [hidden() - Filter Hidden Elements](#hidden---filter-hidden-elements)
11. [enabled() - Filter Enabled Elements](#enabled---filter-enabled-elements)
12. [disabled() - Filter Disabled Elements](#disabled---filter-disabled-elements)

13. [Quick Reference](#quick-reference)
14. [Best Practices](#best-practices)

---

## DOM Manipulation Methods

### `.addClass()` - Add Classes

**Add one or more classes to all elements in the collection.**

```javascript
collection.addClass(className)
```

**Parameters:**
- `className` (string) - Single class name or space-separated class names

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Add single class
buttons.addClass('styled');

// Add multiple classes
buttons.addClass('btn btn-primary');

// Chaining
buttons.addClass('initialized').addClass('ready');

// Equivalent to:
buttons.update({ classList: { add: ['styled'] } });
```

---

### `.removeClass()` - Remove Classes

**Remove one or more classes from all elements in the collection.**

```javascript
collection.removeClass(className)
```

**Parameters:**
- `className` (string) - Single class name or space-separated class names

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Remove single class
buttons.removeClass('loading');

// Remove multiple classes
buttons.removeClass('error warning');

// Chaining
buttons.removeClass('hidden').addClass('visible');
```

---

### `.toggleClass()` - Toggle Classes

**Toggle one or more classes on all elements in the collection.**

```javascript
collection.toggleClass(className)
```

**Parameters:**
- `className` (string) - Single class name or space-separated class names

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Toggle single class
buttons.toggleClass('active');

// Toggle multiple classes
buttons.toggleClass('expanded collapsed');

// Use case: accordion panels
const panels = Collections.ClassName.panel;
panels.toggleClass('open');
```

---

### `.setProperty()` - Set Properties

**Set a property on all elements in the collection.**

```javascript
collection.setProperty(property, value)
```

**Parameters:**
- `property` (string) - Property name
- `value` (any) - Value to set

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const inputs = Collections.TagName.input;

// Disable all inputs
inputs.setProperty('disabled', true);

// Set value
inputs.setProperty('value', '');

// Set placeholder
inputs.setProperty('placeholder', 'Enter text');

// Chaining
inputs.setProperty('disabled', false)
      .setProperty('value', 'default');
```

---

### `.setAttribute()` - Set Attributes

**Set an attribute on all elements in the collection.**

```javascript
collection.setAttribute(attribute, value)
```

**Parameters:**
- `attribute` (string) - Attribute name
- `value` (string) - Attribute value

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const images = Collections.TagName.img;

// Set loading attribute
images.setAttribute('loading', 'lazy');

// Set data attributes
const cards = Collections.ClassName.card;
cards.setAttribute('data-initialized', 'true');

// Set ARIA attributes
const buttons = Collections.ClassName.button;
buttons.setAttribute('aria-label', 'Action button');

// Chaining
images.setAttribute('loading', 'lazy')
      .setAttribute('decoding', 'async');
```

---

### `.setStyle()` - Set Styles

**Set style properties on all elements in the collection.**

```javascript
collection.setStyle(styles)
```

**Parameters:**
- `styles` (object) - Object with CSS properties

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Set single style
buttons.setStyle({ color: 'blue' });

// Set multiple styles
buttons.setStyle({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

// Chaining
buttons.setStyle({ color: 'blue' })
       .addClass('styled');
```

---

### `.on()` - Add Event Listeners

**Add an event listener to all elements in the collection.**

```javascript
collection.on(event, handler, options)
```

**Parameters:**
- `event` (string) - Event name (e.g., 'click', 'mouseover')
- `handler` (function) - Event handler function
- `options` (object, optional) - Event listener options

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

// Simple click handler
buttons.on('click', function(e) {
  console.log('Button clicked:', this.textContent);
});

// With arrow function (note: 'this' won't be the element)
buttons.on('click', (e) => {
  console.log('Button clicked:', e.target.textContent);
});

// With options
buttons.on('click', handleClick, { once: true });

// Multiple events
buttons.on('mouseenter', handleHover)
       .on('mouseleave', handleUnhover);

// Passive event listener
const scrollables = Collections.ClassName.scrollable;
scrollables.on('scroll', handleScroll, { passive: true });
```

---

### `.off()` - Remove Event Listeners

**Remove an event listener from all elements in the collection.**

```javascript
collection.off(event, handler, options)
```

**Parameters:**
- `event` (string) - Event name
- `handler` (function) - Event handler function (must be the same reference)
- `options` (object, optional) - Event listener options

**Returns:** The collection (for chaining)

**Examples:**
```javascript
const buttons = Collections.ClassName.button;

function handleClick(e) {
  console.log('Clicked');
}

// Add listener
buttons.on('click', handleClick);

// Remove listener (must use same function reference)
buttons.off('click', handleClick);

// With options
buttons.off('click', handleClick, { capture: true });
```

---

## Filtering Methods

### `.visible()` - Filter Visible Elements

**Filter collection to only visible elements.**

```javascript
collection.visible()
```

**Returns:** New array with only visible elements

**How it determines visibility:**
- Element has `offsetParent !== null`
- Element is not `display: none`
- Element is not `visibility: hidden`

**Examples:**
```javascript
const allButtons = Collections.ClassName.button;

// Get only visible buttons
const visibleButtons = allButtons.visible();

console.log(`Visible: ${visibleButtons.length} of ${allButtons.length}`);

// Update only visible buttons
visibleButtons.forEach(btn => {
  btn.update({ classList: { add: ['visible-button'] } });
});

// Chain with other array methods
const visibleEnabledButtons = allButtons
  .visible()
  .filter(btn => !btn.disabled);
```

**Use cases:**
- Update only visible UI elements
- Count visible items
- Apply animations to visible elements
- Skip hidden elements in processing

---

### `.hidden()` - Filter Hidden Elements

**Filter collection to only hidden elements.**

```javascript
collection.hidden()
```

**Returns:** New array with only hidden elements

**How it determines hidden:**
- Element has `offsetParent === null`
- Element has `display: none`
- Element has `visibility: hidden`

**Examples:**
```javascript
const allCards = Collections.ClassName.card;

// Get only hidden cards
const hiddenCards = allCards.hidden();

console.log(`Hidden: ${hiddenCards.length} cards`);

// Show all hidden cards
hiddenCards.forEach(card => {
  card.update({ style: { display: 'block' } });
});

// Find hidden elements that should be visible
const incorrectlyHidden = allCards
  .hidden()
  .filter(card => !card.classList.contains('intentionally-hidden'));
```

**Use cases:**
- Debug hidden elements
- Show/reveal hidden content
- Lazy-load hidden images
- Clean up unused hidden elements

---

### `.enabled()` - Filter Enabled Elements

**Filter collection to only enabled form elements.**

```javascript
collection.enabled()
```

**Returns:** New array with only enabled elements

**Examples:**
```javascript
const allInputs = Collections.TagName.input;

// Get only enabled inputs
const enabledInputs = allInputs.enabled();

// Validate only enabled inputs
enabledInputs.forEach(input => {
  if (!input.value) {
    input.update({ classList: { add: ['error'] } });
  }
});

// Get enabled buttons
const buttons = Collections.TagName.button;
const enabledButtons = buttons.enabled();

enabledButtons.forEach(btn => {
  btn.update({
    style: { cursor: 'pointer' },
    classList: { add: ['clickable'] }
  });
});
```

**Use cases:**
- Form validation (validate only enabled fields)
- Focus management
- Submit button logic
- Dynamic form behavior

---

### `.disabled()` - Filter Disabled Elements

**Filter collection to only disabled form elements.**

```javascript
collection.disabled()
```

**Returns:** New array with only disabled elements

**Examples:**
```javascript
const allInputs = Collections.TagName.input;

// Get only disabled inputs
const disabledInputs = allInputs.disabled();

console.log(`${disabledInputs.length} inputs are disabled`);

// Style disabled inputs differently
disabledInputs.forEach(input => {
  input.update({
    style: { opacity: '0.5', cursor: 'not-allowed' }
  });
});

// Enable all disabled inputs
disabledInputs.forEach(input => {
  input.disabled = false;
});
```

**Use cases:**
- Enable/disable form sections
- Visual styling for disabled elements
- Skip disabled fields in validation
- Accessibility improvements

---

## Quick Reference

### DOM Manipulation Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **addClass()** | Add classes | `collection.addClass('active')` | Collection |
| **removeClass()** | Remove classes | `collection.removeClass('hidden')` | Collection |
| **toggleClass()** | Toggle classes | `collection.toggleClass('open')` | Collection |
| **setProperty()** | Set property | `collection.setProperty('disabled', true)` | Collection |
| **setAttribute()** | Set attribute | `collection.setAttribute('loading', 'lazy')` | Collection |
| **setStyle()** | Set styles | `collection.setStyle({ color: 'red' })` | Collection |
| **on()** | Add event listener | `collection.on('click', handler)` | Collection |
| **off()** | Remove event listener | `collection.off('click', handler)` | Collection |

### Filtering Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **visible()** | Get visible elements | `collection.visible()` | Array |
| **hidden()** | Get hidden elements | `collection.hidden()` | Array |
| **enabled()** | Get enabled elements | `collection.enabled()` | Array |
| **disabled()** | Get disabled elements | `collection.disabled()` | Array |

---

## Best Practices

### 1. Use shorthand methods for clarity

```javascript
// ❌ Verbose
buttons.update({ classList: { add: ['active'] } });

// ✅ Clear and concise
buttons.addClass('active');
```

---

### 2. Chain methods for multiple operations

```javascript
buttons
  .addClass('initialized')
  .setStyle({ padding: '10px' })
  .on('click', handleClick);
```

---

### 3. Filter before updating

```javascript
// Update only visible, enabled buttons
buttons
  .visible()
  .filter(btn => !btn.disabled)
  .forEach(btn => {
    btn.update({ classList: { add: ['active'] } });
  });

// Or use shorthand
buttons
  .visible()
  .enabled()
  .forEach(btn => btn.addClass('active'));
```

---

### 4. Use named functions for event handlers

```javascript
// ✅ Easy to remove later
function handleClick(e) {
  console.log('Clicked');
}

buttons.on('click', handleClick);
// Later: buttons.off('click', handleClick);

// ❌ Can't remove anonymous functions
buttons.on('click', (e) => { console.log('Clicked'); });
// Can't remove this listener
```

---

### 5. Combine filtering methods

```javascript
// Get visible AND enabled inputs
const activeInputs = inputs
  .visible()
  .filter(input => !input.disabled);

// Get hidden OR disabled buttons
const inactiveButtons = buttons.filter(btn =>
  btn.offsetParent === null || btn.disabled
);
```

---

## Real-World Examples

### Interactive navigation

```javascript
const navItems = Collections.ClassName.navItem;

navItems
  .addClass('nav-initialized')
  .setStyle({ transition: 'all 0.3s' })
  .on('mouseenter', function() {
    this.style.backgroundColor = '#f0f0f0';
  })
  .on('mouseleave', function() {
    this.style.backgroundColor = '';
  })
  .on('click', function(e) {
    // Remove active from all
    navItems.removeClass('active');
    // Add active to clicked
    this.classList.add('active');
  });
```

---

### Form validation

```javascript
function validateForm() {
  const inputs = Collections.ClassName.requiredField;

  // Validate only visible, enabled inputs
  const fieldsToValidate = inputs.visible().enabled();

  let isValid = true;

  fieldsToValidate.forEach(input => {
    if (!input.value.trim()) {
      input.addClass('error').setStyle({ borderColor: 'red' });
      isValid = false;
    } else {
      input.removeClass('error').setStyle({ borderColor: '' });
    }
  });

  return isValid;
}
```

---

### Accordion/collapse system

```javascript
const accordionHeaders = Collections.ClassName.accordionHeader;
const accordionPanels = Collections.ClassName.accordionPanel;

accordionHeaders.on('click', function() {
  const targetId = this.dataset.target;
  const targetPanel = document.getElementById(targetId);

  // Close all panels
  accordionPanels.removeClass('open').setStyle({ display: 'none' });

  // Open clicked panel
  if (targetPanel) {
    targetPanel.classList.toggle('open');
    targetPanel.style.display = targetPanel.classList.contains('open') ? 'block' : 'none';
  }
});
```

---

### Image lazy loading with visibility

```javascript
const images = Collections.TagName.img;

// Set lazy loading on all images
images.setAttribute('loading', 'lazy');

// Add error handling only to visible images
images.visible().forEach(img => {
  img.on('error', function() {
    this.src = '/images/placeholder.png';
    this.alt = 'Image failed to load';
  });
});
```

---

### Disabled state management

```javascript
function setLoadingState(isLoading) {
  const buttons = Collections.TagName.button;
  const inputs = Collections.TagName.input;

  if (isLoading) {
    buttons.setProperty('disabled', true)
           .addClass('loading')
           .setStyle({ opacity: '0.5' });

    inputs.setProperty('disabled', true)
          .setStyle({ opacity: '0.5' });
  } else {
    buttons.setProperty('disabled', false)
           .removeClass('loading')
           .setStyle({ opacity: '1' });

    inputs.setProperty('disabled', false)
          .setStyle({ opacity: '1' });
  }
}
```

---

### Show/hide toggle

```javascript
function toggleVisibility(className) {
  const elements = Collections.ClassName(className);

  elements.forEach(el => {
    if (el.offsetParent === null) {
      // Currently hidden, show it
      el.setStyle({ display: 'block' });
    } else {
      // Currently visible, hide it
      el.setStyle({ display: 'none' });
    }
  });
}

// Or simpler:
function toggleVisibility(className) {
  Collections.ClassName(className).toggleClass('hidden');
}
```

---

## Summary

**DOM Manipulation Methods** provide shorthand for common operations:
- Class manipulation: `addClass()`, `removeClass()`, `toggleClass()`
- Property setting: `setProperty()`, `setAttribute()`, `setStyle()`
- Event handling: `on()`, `off()`

**Filtering Methods** enable targeted updates:
- Visibility: `visible()`, `hidden()`
- Form state: `enabled()`, `disabled()`

**Key Benefits:**
✅ Cleaner code than `.update()`
✅ Chainable for multiple operations
✅ Filter before updating for precision

---

## Next Steps

Continue to the other Collections documentation:

- **[Access Methods](01_Access-Methods.md)** - Getting collections
- **[Bulk Operations](02_Bulk-Operations.md)** - `Collections.update()`
- **[Array-like Methods](03_Array-like-Methods.md)** - `.forEach()`, `.map()`, `.filter()`
- **[Utility & Helper Methods](05_Utility-Helper-Methods.md)** - `.stats()`, `.configure()`

---

**[Back to Documentation Home](../../README.md)**
