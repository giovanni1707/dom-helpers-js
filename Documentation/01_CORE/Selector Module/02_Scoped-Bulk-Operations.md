# Selector Module - Scoped Queries & Bulk Operations

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 2 of 5**: Scoped Queries & Bulk Operations
> Query within specific containers and update multiple selectors at once

---

## Table of Contents

**Scoped Query Methods:**
1. [Selector.Scoped.within() - Query Within Container](#selectorscopedwithin---query-within-container)
2. [Selector.Scoped.withinAll() - Query All Within Container](#selectorscopedwithinall---query-all-within-container)

**Bulk Operations:**
3. [Selector.update() - Update Multiple Selectors](#selectorupdate---update-multiple-selectors)

4. [Quick Reference](#quick-reference)
5. [Best Practices](#best-practices)
6. [Real-World Examples](#real-world-examples)

---

## Scoped Query Methods

### `Selector.Scoped.within()` - Query Within Container

**Find the first element matching a selector within a specific container.**

```javascript
Selector.Scoped.within(container, selector)
```

**Parameters:**
- `container` (string | Element) - Container element or selector
- `selector` (string) - CSS selector to search for

**Returns:** First matching element within container, or `null`

---

### Why use scoped queries?

```javascript
// ❌ Global query (searches entire document)
const button = Selector.query('.button');

// ✅ Scoped query (searches only within #modal)
const modalButton = Selector.Scoped.within('#modal', '.button');
```

**Benefits:**
1. **Performance** - Searches smaller DOM tree
2. **Specificity** - Avoid conflicts with same class names elsewhere
3. **Encapsulation** - Work with component boundaries
4. **Clarity** - Intent is clear in code

---

### Examples

#### Basic scoped queries
```javascript
// Using selector string for container
const button = Selector.Scoped.within('#modal', '.button');

// Using element reference for container
const modal = Elements.modal;
const button = Selector.Scoped.within(modal, '.button');

// Nested scoping
const card = Selector.query('.card');
const title = Selector.Scoped.within(card, '.title');
```

---

#### Component-based queries
```javascript
// Find elements within specific components
const header = Selector.Scoped.within('#header', '.logo');
const nav = Selector.Scoped.within('#header', 'nav');
const searchBox = Selector.Scoped.within('#header', '[type="search"]');

// Modal components
const modalTitle = Selector.Scoped.within('#modal', '.modal-title');
const closeBtn = Selector.Scoped.within('#modal', '.close-button');
const form = Selector.Scoped.within('#modal', 'form');
```

---

#### Dynamic containers
```javascript
function findWithinCard(cardId, selector) {
  return Selector.Scoped.within(`#${cardId}`, selector);
}

const title = findWithinCard('card-1', '.title');
const button = findWithinCard('card-1', '.action-button');
```

---

#### Avoiding global conflicts
```javascript
// Multiple components with same class names
const headerButton = Selector.Scoped.within('#header', '.button');
const modalButton = Selector.Scoped.within('#modal', '.button');
const footerButton = Selector.Scoped.within('#footer', '.button');

// Each returns different button from its container
headerButton !== modalButton; // true
```

---

### Common use cases

#### Modal/dialog components
```javascript
function openModal(modalId) {
  const modal = Elements.get(modalId);

  // Find elements only within this modal
  const title = Selector.Scoped.within(modal, '.modal-title');
  const content = Selector.Scoped.within(modal, '.modal-content');
  const closeBtn = Selector.Scoped.within(modal, '.close-button');

  title.update({ textContent: 'Modal Title' });
  closeBtn.addEventListener('click', () => closeModal(modalId));
}
```

#### Card/tile components
```javascript
function setupCard(cardElement) {
  const image = Selector.Scoped.within(cardElement, '.card-image');
  const title = Selector.Scoped.within(cardElement, '.card-title');
  const button = Selector.Scoped.within(cardElement, '.card-action');

  image?.update({ setAttribute: { loading: 'lazy' } });
  button?.addEventListener('click', () => handleCardAction(cardElement));
}

// Apply to all cards
Selector.queryAll('.card').forEach(setupCard);
```

---

## `Selector.Scoped.withinAll()` - Query All Within Container

**Find all elements matching a selector within a specific container.**

```javascript
Selector.Scoped.withinAll(container, selector)
```

**Parameters:**
- `container` (string | Element) - Container element or selector
- `selector` (string) - CSS selector to search for

**Returns:** Enhanced NodeList with all matching elements within container

---

### Examples

#### Find multiple elements in container
```javascript
// Find all buttons in modal
const modalButtons = Selector.Scoped.withinAll('#modal', '.button');

console.log(`Modal has ${modalButtons.length} buttons`);

// Update all at once
modalButtons.update({
  classList: { add: ['modal-button'] }
});
```

---

#### Iterate scoped results
```javascript
const modal = Elements.modal;
const fields = Selector.Scoped.withinAll(modal, 'input, select, textarea');

fields.forEach((field, index) => {
  field.update({
    setAttribute: { tabindex: index + 1 },
    dataset: { fieldIndex: index }
  });
});
```

---

#### Component initialization
```javascript
function initializeCard(card) {
  const images = Selector.Scoped.withinAll(card, 'img');
  const links = Selector.Scoped.withinAll(card, 'a');
  const buttons = Selector.Scoped.withinAll(card, '.button');

  images.update({ setAttribute: { loading: 'lazy' } });
  links.update({ setAttribute: { rel: 'noopener noreferrer' } });
  buttons.on('click', handleButtonClick);
}

// Initialize all cards
Selector.queryAll('.card').forEach(initializeCard);
```

---

#### Filtering scoped results
```javascript
const modal = Elements.modal;
const inputs = Selector.Scoped.withinAll(modal, 'input');

// Get only enabled inputs
const enabledInputs = inputs.filter(input => !input.disabled);

// Get only visible inputs
const visibleInputs = inputs.filter(input => input.offsetParent !== null);

// Or use filtering methods
const visibleEnabled = inputs.visible().enabled();
```

---

### Common use cases

#### Form within container
```javascript
function validateFormInCard(cardId) {
  const fields = Selector.Scoped.withinAll(`#${cardId}`, '[required]');

  const allValid = fields.every(field => field.value.trim() !== '');

  if (!allValid) {
    fields
      .filter(field => !field.value.trim())
      .forEach(field => {
        field.update({ classList: { add: ['error'] } });
      });
  }

  return allValid;
}
```

#### Navigation within header
```javascript
const navItems = Selector.Scoped.withinAll('#header', '.nav-item');

navItems.forEach((item, index) => {
  item.update({
    setAttribute: { 'data-index': index },
    addEventListener: ['click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    }]
  });
});
```

---

## Bulk Operations

### `Selector.update()` - Update Multiple Selectors

**Update multiple selectors at once with a single method call.**

```javascript
Selector.update(updates)
```

**Parameters:**
- `updates` (object) - Object mapping selectors to their updates

**Returns:** Selector helper (for chaining)

---

### Update object structure

```javascript
Selector.update({
  '.button': {
    style: { padding: '10px' },
    classList: { add: ['styled'] }
  },
  '#header': {
    style: { backgroundColor: '#333' }
  },
  '[type="text"]': {
    setAttribute: { autocomplete: 'off' }
  }
});
```

---

### Examples

#### Page initialization
```javascript
Selector.update({
  '.button': {
    style: {
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    classList: { add: ['btn'] }
  },
  '.card': {
    style: {
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  'img': {
    setAttribute: { loading: 'lazy' }
  },
  'a[href^="http"]': {
    setAttribute: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }
});
```

---

#### Theme application
```javascript
function applyDarkTheme() {
  Selector.update({
    'body': {
      style: { backgroundColor: '#1a1a1a', color: '#fff' }
    },
    '.card': {
      style: { backgroundColor: '#2a2a2a', borderColor: '#444' }
    },
    '.button': {
      style: { backgroundColor: '#333', color: '#fff' }
    },
    'input, textarea': {
      style: { backgroundColor: '#2a2a2a', color: '#fff', borderColor: '#444' }
    }
  });
}
```

---

#### Accessibility enhancements
```javascript
Selector.update({
  'button:not([type])': {
    setAttribute: { type: 'button' }
  },
  'img:not([alt])': {
    setAttribute: { alt: '' }
  },
  'a[target="_blank"]': {
    setAttribute: { rel: 'noopener noreferrer' }
  },
  '[role="dialog"]': {
    setAttribute: { 'aria-modal': 'true' }
  }
});
```

---

#### Form styling
```javascript
Selector.update({
  'input[type="text"], input[type="email"], input[type="password"]': {
    style: {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px'
    }
  },
  'textarea': {
    style: {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontFamily: 'inherit'
    }
  },
  'select': {
    style: {
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }
  },
  '[required]': {
    style: { borderLeft: '3px solid #e74c3c' }
  }
});
```

---

### Combining with scoped queries

```javascript
// Update elements within specific container
const modal = Elements.modal;

Selector.Scoped.withinAll(modal, '.button').update({
  classList: { add: ['modal-button'] }
});

Selector.Scoped.withinAll(modal, 'input').update({
  style: { width: '100%' }
});
```

---

## Quick Reference

### Scoped Query Methods

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **Scoped.within()** | Find first in container | `Selector.Scoped.within('#modal', '.btn')` | Element or null |
| **Scoped.withinAll()** | Find all in container | `Selector.Scoped.withinAll('#modal', '.btn')` | NodeList |

### Bulk Operations

| Method | Purpose | Example | Returns |
|--------|---------|---------|---------|
| **update()** | Update multiple selectors | `Selector.update({ '.btn': {...} })` | Selector |

---

### Scoped vs Global Queries

| Feature | Global Query | Scoped Query |
|---------|-------------|--------------|
| **Search scope** | Entire document | Within container |
| **Performance** | Slower (larger tree) | Faster (smaller tree) |
| **Specificity** | May find wrong element | Targets specific context |
| **Syntax** | `Selector.query('.btn')` | `Selector.Scoped.within('#modal', '.btn')` |

---

## Best Practices

### 1. Use scoped queries for components

```javascript
// ✅ Scoped to component
function initModal(modalId) {
  const closeBtn = Selector.Scoped.within(modalId, '.close-button');
  const form = Selector.Scoped.within(modalId, 'form');
}

// ❌ Global queries (might find wrong elements)
function initModal(modalId) {
  const closeBtn = Selector.query('.close-button'); // Could be from another modal!
  const form = Selector.query('form');
}
```

---

### 2. Use bulk updates for initialization

```javascript
// ✅ Single bulk update
function initializePage() {
  Selector.update({
    '.button': { classList: { add: ['btn'] } },
    '.card': { classList: { add: ['card-init'] } },
    'img': { setAttribute: { loading: 'lazy' } }
  });
}

// ❌ Multiple individual updates
function initializePage() {
  Selector.queryAll('.button').update({ classList: { add: ['btn'] } });
  Selector.queryAll('.card').update({ classList: { add: ['card-init'] } });
  Selector.queryAll('img').update({ setAttribute: { loading: 'lazy' } });
}
```

---

### 3. Prefer element reference for repeated scoped queries

```javascript
// ✅ Store container reference
const modal = Selector.query('#modal');
const title = Selector.Scoped.within(modal, '.title');
const content = Selector.Scoped.within(modal, '.content');
const footer = Selector.Scoped.within(modal, '.footer');

// ❌ Repeated selector queries
const title = Selector.Scoped.within('#modal', '.title');
const content = Selector.Scoped.within('#modal', '.content');
const footer = Selector.Scoped.within('#modal', '.footer');
```

---

### 4. Use withinAll for multiple elements

```javascript
// ✅ Get all at once
const buttons = Selector.Scoped.withinAll('#modal', '.button');
buttons.forEach(btn => initButton(btn));

// ❌ Manual iteration
const modal = Selector.query('#modal');
const buttons = modal.querySelectorAll('.button');
Array.from(buttons).forEach(btn => initButton(btn));
```

---

## Real-World Examples

### Modal system with scoped queries

```javascript
class Modal {
  constructor(modalId) {
    this.modal = Elements.get(modalId);
    this.elements = {
      overlay: Selector.Scoped.within(this.modal, '.modal-overlay'),
      dialog: Selector.Scoped.within(this.modal, '.modal-dialog'),
      title: Selector.Scoped.within(this.modal, '.modal-title'),
      content: Selector.Scoped.within(this.modal, '.modal-content'),
      closeBtn: Selector.Scoped.within(this.modal, '.close-button'),
      buttons: Selector.Scoped.withinAll(this.modal, '.modal-button')
    };

    this.init();
  }

  init() {
    this.elements.closeBtn?.addEventListener('click', () => this.close());
    this.elements.overlay?.addEventListener('click', () => this.close());

    this.elements.buttons.forEach(btn => {
      const action = btn.dataset.action;
      btn.addEventListener('click', () => this.handleAction(action));
    });
  }

  open(title, content) {
    this.elements.title.textContent = title;
    this.elements.content.innerHTML = content;
    this.modal.update({
      style: { display: 'block' },
      classList: { add: ['open'] }
    });
  }

  close() {
    this.modal.update({
      style: { display: 'none' },
      classList: { remove: ['open'] }
    });
  }

  handleAction(action) {
    console.log('Modal action:', action);
    this.close();
  }
}

const loginModal = new Modal('loginModal');
```

---

### Multi-section page initialization

```javascript
function initializeSections() {
  // Header section
  Selector.Scoped.withinAll('#header', '.nav-item').forEach((item, index) => {
    item.update({
      setAttribute: { 'data-index': index },
      addEventListener: ['click', handleNavClick]
    });
  });

  // Main content section
  Selector.Scoped.withinAll('#main', '.card').update({
    classList: { add: ['initialized'] },
    style: { opacity: '1' }
  });

  // Sidebar section
  Selector.Scoped.withinAll('#sidebar', '.widget').forEach(widget => {
    initWidget(widget);
  });

  // Footer section
  Selector.Scoped.withinAll('#footer', 'a').update({
    setAttribute: { rel: 'noopener noreferrer' }
  });
}
```

---

### Form validation within container

```javascript
function validateSection(sectionId) {
  const fields = Selector.Scoped.withinAll(sectionId, '[required]');
  const errors = [];

  fields.forEach(field => {
    if (!field.value.trim()) {
      field.update({
        classList: { add: ['error'] },
        style: { borderColor: 'red' }
      });
      errors.push(field.name || field.id);
    } else {
      field.update({
        classList: { remove: ['error'] },
        style: { borderColor: '' }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate specific sections
const profileValid = validateSection('#profileSection');
const addressValid = validateSection('#addressSection');
```

---

### Bulk theme updates

```javascript
const themes = {
  light: {
    'body': {
      style: { backgroundColor: '#fff', color: '#000' }
    },
    '.card': {
      style: { backgroundColor: '#f9f9f9', borderColor: '#ddd' }
    },
    '.button': {
      style: { backgroundColor: '#007bff', color: '#fff' }
    },
    'input, textarea, select': {
      style: { backgroundColor: '#fff', borderColor: '#ccc', color: '#000' }
    }
  },
  dark: {
    'body': {
      style: { backgroundColor: '#1a1a1a', color: '#e0e0e0' }
    },
    '.card': {
      style: { backgroundColor: '#2a2a2a', borderColor: '#444' }
    },
    '.button': {
      style: { backgroundColor: '#0d6efd', color: '#fff' }
    },
    'input, textarea, select': {
      style: { backgroundColor: '#2a2a2a', borderColor: '#444', color: '#e0e0e0' }
    }
  }
};

function applyTheme(themeName) {
  Selector.update(themes[themeName]);
}

applyTheme('dark');
```

---

## Summary

**Scoped Query Methods** provide targeted element selection:
- `Scoped.within()` - Find first element in container
- `Scoped.withinAll()` - Find all elements in container
- Better performance, specificity, and encapsulation

**Bulk Operations** enable efficient mass updates:
- `Selector.update()` - Update multiple selectors at once
- Perfect for initialization, theming, and configuration

**Key Benefits:**
✅ Component isolation
✅ Better performance
✅ Cleaner code
✅ Batch operations

---

## Next Steps

Continue to the other Selector documentation:

- **[Query Methods](01_Query-Methods.md)** - Basic query() and queryAll()
- **[Array-like & DOM Manipulation](03_Array-DOM-Methods.md)** - Array methods and shortcuts
- **[Filtering & Async Methods](04_Filtering-Async-Methods.md)** - Filter and wait for elements
- **[Utility Methods](05_Utility-Methods.md)** - Cache, configuration, statistics

---

**[Back to Documentation Home](../../README.md)**
