# Universal `.update()` Method - Complete Guide

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **The most powerful feature of DOM Helpers**
> One method to update everything - properties, styles, classes, attributes, events, and more

---

## Table of Contents

1. [Overview](#overview)
2. [Property Updates](#property-updates)
3. [Style Updates](#style-updates)
4. [classList Operations](#classlist-operations)
5. [Attribute Operations](#attribute-operations)
6. [Dataset Operations](#dataset-operations)
7. [Event Listener Operations](#event-listener-operations)
8. [Method Calls](#method-calls)
9. [Advanced Patterns](#advanced-patterns)
10. [Performance & Best Practices](#performance--best-practices)
11. [Complete Examples](#complete-examples)

---

## Overview

### What is the `.update()` method?

The **`.update()` method** is a universal DOM manipulation method available on:
- **Single elements** (from Elements or Selector helpers)
- **Collections** (from Collections or Selector helpers)
- **Created elements** (from enhanced createElement)

It provides a **declarative, object-based syntax** for making any DOM changes.

---

### Why use `.update()`?

```javascript
// ❌ Traditional approach (verbose, imperative)
const button = document.getElementById('submitBtn');
button.textContent = 'Submit';
button.disabled = false;
button.className = 'btn btn-primary';
button.style.padding = '10px 20px';
button.style.backgroundColor = '#007bff';
button.style.color = 'white';
button.setAttribute('type', 'button');
button.setAttribute('aria-label', 'Submit form');
button.dataset.action = 'submit';
button.addEventListener('click', handleSubmit);

// ✅ DOM Helpers approach (clean, declarative)
Elements.submitBtn.update({
  textContent: 'Submit',
  disabled: false,
  className: 'btn btn-primary',
  style: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white'
  },
  setAttribute: {
    type: 'button',
    'aria-label': 'Submit form'
  },
  dataset: { action: 'submit' },
  addEventListener: ['click', handleSubmit]
});
```

**Benefits:**
✅ **80% less code** - One method call vs many statements
✅ **Declarative** - Describe what you want, not how to do it
✅ **Optimized** - Fine-grained change detection
✅ **Chainable** - Returns element for further operations
✅ **Type-safe** - Works with all property types
✅ **Comprehensive** - Handles everything in one place

---

### How it works

```javascript
element.update(updates)
collection.update(updates)
```

**Parameters:**
- `updates` (object) - Configuration object with desired changes

**Returns:**
- For single elements: the element (for chaining)
- For collections: the collection (for chaining)

**Features:**
- **Fine-grained updates** - Only changed properties are modified
- **Automatic type handling** - Correctly handles strings, numbers, booleans, objects, arrays
- **Event deduplication** - Prevents adding duplicate event listeners
- **Style optimization** - Only updates changed CSS properties
- **Safe operations** - Handles missing elements gracefully

---

## Property Updates

### Text Content

Set text content or HTML:

```javascript
element.update({
  textContent: 'Plain text content',
  // or
  innerText: 'Rendered text (respects CSS)',
  // or
  innerHTML: '<strong>HTML</strong> content'
});
```

**Examples:**
```javascript
// Set heading text
Elements.pageTitle.update({
  textContent: 'Welcome to Our Site'
});

// Set paragraph HTML
Elements.intro.update({
  innerHTML: 'This is <strong>important</strong> information.'
});

// Set rendered text
Elements.displayText.update({
  innerText: 'This respects\nhidden elements'
});
```

**Differences:**
- `textContent` - Fastest, no HTML parsing, includes hidden elements
- `innerText` - Respects CSS (hidden elements excluded), triggers reflow
- `innerHTML` - Parses HTML, slower, potential XSS risk if not sanitized

---

### Form Properties

Set form input values and states:

```javascript
element.update({
  value: 'input value',
  checked: true,
  disabled: false,
  selected: true,
  selectedIndex: 2
});
```

**Examples:**
```javascript
// Text input
Elements.emailInput.update({
  value: 'user@example.com',
  disabled: false,
  placeholder: 'Enter email'
});

// Checkbox
Elements.agreeCheckbox.update({
  checked: true,
  disabled: false
});

// Radio button
Elements.genderRadio.update({
  checked: true
});

// Select dropdown
Elements.countrySelect.update({
  selectedIndex: 5,
  disabled: false
});

// Textarea
Elements.messageArea.update({
  value: 'Message content',
  rows: 10
});
```

---

### Element Properties

Set any DOM element property:

```javascript
element.update({
  id: 'newId',
  className: 'class1 class2',
  title: 'Tooltip text',
  tabIndex: 0,
  hidden: false,
  contentEditable: true,
  dir: 'rtl',
  lang: 'en'
});
```

**Examples:**
```javascript
// Visibility
element.update({
  hidden: false
});

// Tooltip
element.update({
  title: 'Click to expand'
});

// Accessibility
element.update({
  tabIndex: 0,
  contentEditable: true,
  lang: 'en'
});

// Layout direction
element.update({
  dir: 'rtl'  // Right-to-left
});
```

---

## Style Updates

### Basic Styles

Set individual CSS properties:

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    padding: '10px',
    margin: '20px',
    border: '1px solid #ccc'
  }
});
```

**Examples:**
```javascript
// Typography
Elements.heading.update({
  style: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: '1.5',
    fontFamily: 'Arial, sans-serif'
  }
});

// Box model
Elements.card.update({
  style: {
    padding: '20px',
    margin: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px'
  }
});

// Colors
Elements.button.update({
  style: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#0056b3'
  }
});
```

---

### Layout & Positioning

```javascript
element.update({
  style: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1000'
  }
});
```

**Examples:**
```javascript
// Flexbox
Elements.container.update({
  style: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px'
  }
});

// Grid
Elements.gallery.update({
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  }
});

// Positioning
Elements.modal.update({
  style: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '9999'
  }
});
```

---

### Animations & Transitions

```javascript
element.update({
  style: {
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease-in-out',
    transform: 'scale(1.05)',
    opacity: '1'
  }
});
```

**Examples:**
```javascript
// Smooth transitions
Elements.button.update({
  style: {
    transition: 'background-color 0.3s ease, transform 0.2s ease'
  }
});

// Transform
Elements.card.update({
  style: {
    transform: 'rotate(5deg) scale(1.1)',
    transformOrigin: 'center center'
  }
});

// Opacity animation
Elements.fadeElement.update({
  style: {
    opacity: '0',
    transition: 'opacity 0.5s ease'
  }
});
```

---

### Multiple Units & Values

```javascript
element.update({
  style: {
    width: '50%',
    maxWidth: '600px',
    height: '100vh',
    padding: '1rem 2rem',
    margin: '0 auto',
    fontSize: '1.2em',
    lineHeight: '1.5'
  }
});
```

---

### Fine-Grained Style Updates

**Only changed styles are applied:**

```javascript
// First update
element.update({
  style: { color: 'blue', padding: '10px' }
});

// Second update - only color changes
element.update({
  style: { color: 'red', padding: '10px' }
});
// Internally: only color is updated, padding is skipped
```

---

## classList Operations

### Add Classes

```javascript
element.update({
  classList: {
    add: 'single-class'
    // or
    add: ['class1', 'class2', 'class3']
  }
});
```

**Examples:**
```javascript
// Add single class
Elements.button.update({
  classList: { add: 'active' }
});

// Add multiple classes
Elements.card.update({
  classList: { add: ['featured', 'highlighted', 'visible'] }
});

// Add utility classes
Elements.container.update({
  classList: { add: ['flex', 'items-center', 'justify-between'] }
});
```

---

### Remove Classes

```javascript
element.update({
  classList: {
    remove: 'single-class'
    // or
    remove: ['class1', 'class2', 'class3']
  }
});
```

**Examples:**
```javascript
// Remove single class
Elements.button.update({
  classList: { remove: 'loading' }
});

// Remove multiple classes
Elements.modal.update({
  classList: { remove: ['hidden', 'invisible', 'opacity-0'] }
});

// Remove state classes
Elements.form.update({
  classList: { remove: ['error', 'warning', 'success'] }
});
```

---

### Toggle Classes

```javascript
element.update({
  classList: {
    toggle: 'single-class'
    // or
    toggle: ['class1', 'class2']
  }
});
```

**Examples:**
```javascript
// Toggle single class
Elements.menu.update({
  classList: { toggle: 'open' }
});

// Toggle multiple classes
Elements.panel.update({
  classList: { toggle: ['expanded', 'visible'] }
});

// Toggle state
Elements.themeToggle.update({
  classList: { toggle: 'dark-mode' }
});
```

---

### Replace Classes

```javascript
element.update({
  classList: {
    replace: ['oldClass', 'newClass']
  }
});
```

**Examples:**
```javascript
// Replace size class
Elements.button.update({
  classList: { replace: ['btn-sm', 'btn-lg'] }
});

// Replace theme class
Elements.container.update({
  classList: { replace: ['theme-light', 'theme-dark'] }
});

// Replace state class
Elements.status.update({
  classList: { replace: ['status-pending', 'status-complete'] }
});
```

---

### Combined Operations

```javascript
element.update({
  classList: {
    add: ['new-class', 'another-class'],
    remove: ['old-class'],
    toggle: 'active',
    replace: ['size-sm', 'size-lg']
  }
});
```

**Example:**
```javascript
// Complex class manipulation
Elements.card.update({
  classList: {
    add: ['initialized', 'fade-in'],
    remove: ['loading', 'skeleton'],
    toggle: 'expanded',
    replace: ['theme-light', 'theme-dark']
  }
});
```

---

## Attribute Operations

### Set Attributes (Object Format - Recommended)

```javascript
element.update({
  setAttribute: {
    'attr-name': 'attr-value',
    'data-id': '123',
    'aria-label': 'Button label'
  }
});
```

**Examples:**
```javascript
// Image attributes
Elements.banner.update({
  setAttribute: {
    src: '/images/banner.jpg',
    alt: 'Hero banner image',
    loading: 'lazy',
    decoding: 'async'
  }
});

// Link attributes
Elements.downloadLink.update({
  setAttribute: {
    href: '/files/document.pdf',
    download: 'document.pdf',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
});

// Form attributes
Elements.emailInput.update({
  setAttribute: {
    type: 'email',
    placeholder: 'Enter your email',
    required: 'true',
    autocomplete: 'email',
    pattern: '[^@]+@[^@]+\\.[^@]+'
  }
});
```

---

### Set Attributes (Legacy Array Format)

```javascript
element.update({
  setAttribute: ['attribute-name', 'attribute-value']
});
```

**Example:**
```javascript
// Single attribute (legacy format)
Elements.image.update({
  setAttribute: ['src', '/images/photo.jpg']
});

// Prefer object format for multiple attributes
Elements.image.update({
  setAttribute: {
    src: '/images/photo.jpg',
    alt: 'Photo description'
  }
});
```

---

### Remove Attributes

```javascript
element.update({
  removeAttribute: 'single-attribute'
  // or
  removeAttribute: ['attr1', 'attr2', 'attr3']
});
```

**Examples:**
```javascript
// Remove single attribute
Elements.button.update({
  removeAttribute: 'disabled'
});

// Remove multiple attributes
Elements.input.update({
  removeAttribute: ['disabled', 'readonly', 'hidden']
});

// Remove data attributes
Elements.card.update({
  removeAttribute: ['data-temp-id', 'data-loading']
});
```

---

### ARIA Attributes

```javascript
element.update({
  setAttribute: {
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
    'aria-describedby': 'modal-description',
    'aria-hidden': 'false',
    'aria-expanded': 'true',
    'aria-selected': 'true',
    'aria-live': 'polite',
    'aria-atomic': 'true'
  }
});
```

**Examples:**
```javascript
// Modal accessibility
Elements.modal.update({
  setAttribute: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modalTitle',
    'aria-hidden': 'false'
  }
});

// Button accessibility
Elements.menuButton.update({
  setAttribute: {
    'aria-expanded': 'true',
    'aria-controls': 'menu',
    'aria-haspopup': 'true',
    'aria-label': 'Toggle menu'
  }
});

// Live region
Elements.alertBox.update({
  setAttribute: {
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true'
  }
});
```

---

## Dataset Operations

### Set Data Attributes

```javascript
element.update({
  dataset: {
    userId: '123',
    userName: 'John Doe',
    status: 'active',
    created: '2024-01-01'
  }
});
```

This sets: `data-user-id="123"`, `data-user-name="John Doe"`, etc.

**Examples:**
```javascript
// User data
Elements.userCard.update({
  dataset: {
    userId: '12345',
    userName: 'john_doe',
    userRole: 'admin',
    userStatus: 'active'
  }
});

// Product data
Elements.productCard.update({
  dataset: {
    productId: '98765',
    productName: 'Widget',
    productPrice: '29.99',
    inStock: 'true'
  }
});

// State data
Elements.component.update({
  dataset: {
    initialized: 'true',
    version: '2.0.1',
    lastUpdate: Date.now()
  }
});
```

---

### Reading Dataset

```javascript
// After setting:
element.update({
  dataset: { userId: '123' }
});

// Read:
const userId = element.dataset.userId;  // "123"
```

---

### Dataset with Complex Values

```javascript
element.update({
  dataset: {
    config: JSON.stringify({ theme: 'dark', lang: 'en' }),
    items: JSON.stringify(['item1', 'item2', 'item3']),
    timestamp: Date.now().toString()
  }
});
```

---

## Event Listener Operations

### Add Event Listeners (Array Format)

```javascript
element.update({
  addEventListener: ['eventType', handlerFunction, options]
});
```

**Parameters:**
- `eventType` (string) - Event name ('click', 'change', etc.)
- `handlerFunction` (function) - Event handler
- `options` (object, optional) - Event options

**Examples:**
```javascript
// Click handler
Elements.button.update({
  addEventListener: ['click', function(e) {
    console.log('Button clicked');
  }]
});

// With options
Elements.scrollContainer.update({
  addEventListener: ['scroll', handleScroll, { passive: true }]
});

// Multiple events (separate update calls)
Elements.input.update({
  addEventListener: ['focus', handleFocus]
});
Elements.input.update({
  addEventListener: ['blur', handleBlur]
});
```

---

### Add Event Listeners (Object Format)

```javascript
element.update({
  addEventListener: {
    click: handlerFunction,
    mouseover: [handlerFunction, { passive: true }]
  }
});
```

**Examples:**
```javascript
// Multiple events at once
Elements.card.update({
  addEventListener: {
    click: handleCardClick,
    mouseenter: handleCardHover,
    mouseleave: handleCardUnhover
  }
});

// With options
Elements.draggable.update({
  addEventListener: {
    dragstart: [handleDragStart, { passive: false }],
    dragend: handleDragEnd
  }
});
```

---

### Event Handler Context

```javascript
// Regular function - 'this' is the element
Elements.button.update({
  addEventListener: ['click', function() {
    console.log(this);  // The button element
  }]
});

// Arrow function - 'this' is lexical scope
const self = this;
Elements.button.update({
  addEventListener: ['click', (e) => {
    console.log(e.target);  // The button element
    console.log(this);      // Lexical this
  }]
});
```

---

### Remove Event Listeners

```javascript
element.update({
  removeEventListener: ['eventType', handlerFunction, options]
});
```

**Important:** Must use the **same function reference**

**Examples:**
```javascript
// Define handler
function handleClick(e) {
  console.log('Clicked');
}

// Add listener
Elements.button.update({
  addEventListener: ['click', handleClick]
});

// Remove listener (same reference required)
Elements.button.update({
  removeEventListener: ['click', handleClick]
});

// ❌ Won't work - different function reference
Elements.button.update({
  addEventListener: ['click', function() { console.log('Click'); }]
});
Elements.button.update({
  removeEventListener: ['click', function() { console.log('Click'); }]  // Different function!
});
```

---

### Automatic Event Deduplication

DOM Helpers **prevents adding duplicate listeners**:

```javascript
function handleClick() {
  console.log('Clicked');
}

// Add first time
element.update({
  addEventListener: ['click', handleClick]
});

// Try to add again (automatically prevented)
element.update({
  addEventListener: ['click', handleClick]  // Skipped - already exists
});

// Only one listener is attached
```

---

### Common Event Patterns

```javascript
// Form submission
Elements.loginForm.update({
  addEventListener: ['submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    submitLogin(formData);
  }]
});

// Input validation
Elements.emailInput.update({
  addEventListener: ['blur', function() {
    validateEmail(this.value);
  }]
});

// Hover effects
Elements.card.update({
  addEventListener: {
    mouseenter: function() {
      this.style.transform = 'scale(1.05)';
    },
    mouseleave: function() {
      this.style.transform = 'scale(1)';
    }
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    saveDocument();
  }
});
```

---

## Method Calls

### Calling Element Methods

Execute element methods by passing arguments:

```javascript
element.update({
  methodName: [arg1, arg2, arg3]
  // or for no arguments:
  methodName: []
});
```

---

### Focus & Scroll Methods

```javascript
element.update({
  focus: [],
  blur: [],
  click: [],
  scrollIntoView: [{ behavior: 'smooth', block: 'center' }],
  scrollTo: [0, 100]
});
```

**Examples:**
```javascript
// Focus input
Elements.emailInput.update({
  focus: []
});

// Smooth scroll to element
Elements.targetSection.update({
  scrollIntoView: [{
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  }]
});

// Trigger click
Elements.hiddenButton.update({
  click: []
});
```

---

### Selection Methods

```javascript
// Select text in input
Elements.searchInput.update({
  select: [],
  setSelectionRange: [0, 10]
});
```

---

### Custom Methods

```javascript
// If element has custom methods
element.update({
  customMethod: [arg1, arg2],
  anotherMethod: []
});
```

---

## Advanced Patterns

### Conditional Updates

```javascript
const isActive = true;
const theme = 'dark';

element.update({
  classList: {
    add: isActive ? ['active'] : [],
    remove: !isActive ? ['active'] : []
  },
  style: {
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000'
  }
});
```

---

### Computed Values

```javascript
const baseSize = 16;
const multiplier = 1.5;

element.update({
  style: {
    fontSize: `${baseSize * multiplier}px`,
    lineHeight: `${baseSize * multiplier * 1.2}px`,
    padding: `${baseSize * 0.5}px ${baseSize}px`
  }
});
```

---

### State-Based Updates

```javascript
const states = {
  loading: {
    disabled: true,
    textContent: 'Loading...',
    classList: { add: ['loading'] },
    style: { opacity: '0.5' }
  },
  success: {
    disabled: false,
    textContent: 'Success!',
    classList: { add: ['success'], remove: ['loading'] },
    style: { opacity: '1' }
  },
  error: {
    disabled: false,
    textContent: 'Error!',
    classList: { add: ['error'], remove: ['loading'] },
    style: { opacity: '1', backgroundColor: '#dc3545' }
  }
};

function setState(state) {
  Elements.submitBtn.update(states[state]);
}

setState('loading');
```

---

### Reusable Update Configs

```javascript
const buttonStyles = {
  style: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

const primaryButton = {
  ...buttonStyles,
  style: {
    ...buttonStyles.style,
    backgroundColor: '#007bff',
    color: 'white'
  }
};

const secondaryButton = {
  ...buttonStyles,
  style: {
    ...buttonStyles.style,
    backgroundColor: '#6c757d',
    color: 'white'
  }
};

Elements.submitBtn.update(primaryButton);
Elements.cancelBtn.update(secondaryButton);
```

---

### Chaining Updates

```javascript
Elements.card
  .update({ textContent: 'Card Title' })
  .update({ style: { padding: '20px' } })
  .update({ classList: { add: ['featured'] } });

// Better: combine into one update
Elements.card.update({
  textContent: 'Card Title',
  style: { padding: '20px' },
  classList: { add: ['featured'] }
});
```

---

## Performance & Best Practices

### 1. Batch Updates

```javascript
// ❌ Multiple update calls
element.update({ textContent: 'Text' });
element.update({ style: { color: 'blue' } });
element.update({ classList: { add: ['active'] } });

// ✅ Single batched update
element.update({
  textContent: 'Text',
  style: { color: 'blue' },
  classList: { add: ['active'] }
});
```

---

### 2. Fine-Grained Updates Only Change What's Different

```javascript
// First update
element.update({
  style: { color: 'blue', padding: '10px' },
  textContent: 'Hello'
});

// Second update - only color and text change
element.update({
  style: { color: 'red', padding: '10px' },  // Only color updated
  textContent: 'World'
});
// padding is NOT reapplied (no change detected)
```

---

### 3. Use Specific Selectors

```javascript
// ❌ Updating too many elements
Selector.queryAll('div').update({ ... });

// ✅ More specific
Selector.queryAll('.content-div').update({ ... });
```

---

### 4. Avoid Unnecessary Updates

```javascript
// ❌ Updating with same value
const currentText = element.textContent;
element.update({ textContent: currentText });  // Unnecessary

// ✅ Check before updating
if (newText !== currentText) {
  element.update({ textContent: newText });
}

// ✅✅ Don't worry! DOM Helpers does this automatically
element.update({ textContent: newText });  // Skipped if same
```

---

### 5. Reuse Update Configs

```javascript
// ✅ Define once, reuse many times
const cardConfig = {
  style: { borderRadius: '8px', padding: '20px' },
  classList: { add: ['card'] }
};

Selector.queryAll('.product').forEach(product => {
  product.update(cardConfig);
});
```

---

## Complete Examples

### Example 1: Form Setup
```javascript
Elements.update({
  loginForm: {
    setAttribute: { novalidate: 'true' },
    addEventListener: ['submit', handleSubmit]
  },
  emailInput: {
    value: '',
    setAttribute: {
      type: 'email',
      placeholder: 'Email address',
      autocomplete: 'email',
      required: 'true'
    },
    addEventListener: ['blur', validateEmail]
  },
  passwordInput: {
    value: '',
    setAttribute: {
      type: 'password',
      placeholder: 'Password',
      autocomplete: 'current-password',
      required: 'true'
    }
  },
  submitBtn: {
    textContent: 'Sign In',
    disabled: false,
    style: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px'
    }
  }
});
```

---

### Example 2: Modal Initialization
```javascript
Elements.modal.update({
  style: {
    display: 'block',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: '9999'
  },
  classList: { add: ['modal', 'fade-in'] },
  setAttribute: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modalTitle'
  },
  dataset: {
    initialized: 'true',
    openedAt: Date.now()
  }
});
```

---

### Example 3: Theme Switcher
```javascript
function applyTheme(theme) {
  const config = theme === 'dark' ? {
    body: {
      style: { backgroundColor: '#1a1a1a', color: '#e0e0e0' }
    },
    header: {
      style: { backgroundColor: '#2a2a2a', borderColor: '#444' }
    }
  } : {
    body: {
      style: { backgroundColor: '#ffffff', color: '#333333' }
    },
    header: {
      style: { backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }
    }
  };

  Elements.update(config);
}
```

---

### Example 4: Loading State
```javascript
function setLoadingState(isLoading) {
  Elements.update({
    submitBtn: {
      disabled: isLoading,
      textContent: isLoading ? 'Loading...' : 'Submit',
      classList: {
        add: isLoading ? ['loading'] : [],
        remove: isLoading ? [] : ['loading']
      },
      style: { opacity: isLoading ? '0.6' : '1' }
    },
    spinner: {
      style: { display: isLoading ? 'block' : 'none' }
    },
    form: {
      classList: {
        add: isLoading ? ['submitting'] : [],
        remove: isLoading ? [] : ['submitting']
      }
    }
  });
}
```

---

## Summary

The **Universal `.update()` Method** is the most powerful feature of DOM Helpers:

✅ **7 Operation Types:**
1. Property Updates - text, values, element properties
2. Style Updates - any CSS property
3. classList Operations - add, remove, toggle, replace
4. Attribute Operations - set and remove attributes
5. Dataset Operations - data attributes
6. Event Listeners - add and remove with deduplication
7. Method Calls - execute any element method

✅ **Key Benefits:**
- Declarative syntax
- Fine-grained change detection
- Automatic optimization
- Chainable operations
- Type-safe handling

✅ **Use It For:**
- Everything! It's the recommended way to update any DOM element

---

**[Back to Documentation Home](../README.md)**
