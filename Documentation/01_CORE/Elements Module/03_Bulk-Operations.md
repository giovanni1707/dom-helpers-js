# Elements Module - Bulk Operations

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 3 of 4**: Bulk Operations for the Elements Helper
> Update multiple elements at once with a single method call

---

## Table of Contents

1. [Overview](#overview)
2. [Elements.update() - The Power Method](#elementsupdate---the-power-method)
3. [Update Object Structure](#update-object-structure)
4. [Single Element Updates](#single-element-updates)
5. [Multiple Element Updates](#multiple-element-updates)
6. [Available Update Operations](#available-update-operations)
7. [Advanced Patterns](#advanced-patterns)
8. [Performance Considerations](#performance-considerations)
9. [Best Practices](#best-practices)
10. [Real-World Examples](#real-world-examples)

---

## Overview

The **`Elements.update()` method** is the most powerful feature of DOM Helpers. It allows you to:

✅ **Update multiple elements** with a single method call
✅ **Batch multiple changes** to reduce DOM operations
✅ **Use declarative syntax** for cleaner, more readable code
✅ **Apply changes efficiently** with fine-grained change detection

---

## `Elements.update()` - The Power Method

### What it does

**Update one or more elements** by ID with a declarative configuration object.

```javascript
Elements.update(updates)
```

**Parameters:**
- `updates` (object) - Configuration object mapping element IDs to their updates

**Returns:** The Elements helper (for chaining)

---

### Two modes of operation

#### Mode 1: Single Element Update (via element instance)

```javascript
// Get element first, then update
const header = Elements.header;
header.update({
  textContent: 'Welcome!',
  style: { color: 'blue' }
});
```

#### Mode 2: Bulk Update (via Elements.update)

```javascript
// Update multiple elements at once
Elements.update({
  header: {
    textContent: 'Welcome!',
    style: { color: 'blue' }
  },
  footer: {
    textContent: 'Copyright 2024',
    style: { fontSize: '14px' }
  }
});
```

**Both modes use the same update syntax**, just applied differently.

---

## Update Object Structure

The update object follows this pattern:

```javascript
{
  elementId: {
    // Property updates
    textContent: 'string',
    value: 'string',
    disabled: true,

    // Style updates
    style: {
      color: 'red',
      fontSize: '16px'
    },

    // Class updates
    classList: {
      add: ['class1', 'class2'],
      remove: 'oldClass',
      toggle: 'active'
    },

    // Attribute updates
    setAttribute: {
      src: 'image.png',
      'data-id': '123'
    },

    // Event listeners
    addEventListener: ['click', handlerFunction],

    // And more...
  }
}
```

---

## Single Element Updates

### Basic syntax

```javascript
const element = Elements.myElement;

element.update({
  textContent: 'New content',
  className: 'active'
});
```

### Why use `.update()` instead of direct property assignment?

```javascript
// ❌ Traditional approach (multiple DOM operations)
const header = document.getElementById('header');
header.textContent = 'Welcome';
header.className = 'active';
header.style.color = 'blue';
header.style.fontSize = '24px';

// ✅ DOM Helpers approach (batched, optimized)
Elements.header.update({
  textContent: 'Welcome',
  className: 'active',
  style: {
    color: 'blue',
    fontSize: '24px'
  }
});
```

**Benefits:**
- **Cleaner syntax** - Everything in one object
- **Fine-grained updates** - Only changed properties are modified
- **Reduced reflows** - DOM operations are optimized
- **Chainable** - Can chain multiple operations

---

### Examples: Single Element Updates

#### Text updates
```javascript
Elements.header.update({
  textContent: 'Welcome to our site!'
});

Elements.description.update({
  innerHTML: '<strong>Important:</strong> Read the docs'
});
```

#### Form inputs
```javascript
Elements.emailInput.update({
  value: 'user@example.com',
  disabled: false,
  setAttribute: { placeholder: 'Enter your email' }
});

Elements.agreeCheckbox.update({
  checked: true
});
```

#### Styling
```javascript
Elements.banner.update({
  style: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '20px',
    borderRadius: '8px'
  }
});
```

#### Class manipulation
```javascript
Elements.modal.update({
  classList: {
    add: ['visible', 'fade-in'],
    remove: 'hidden'
  }
});
```

---

## Multiple Element Updates

### Bulk update syntax

Update **multiple elements at once** using `Elements.update()`:

```javascript
Elements.update({
  elementId1: { /* updates */ },
  elementId2: { /* updates */ },
  elementId3: { /* updates */ }
});
```

---

### Examples: Multiple Element Updates

#### Page initialization
```javascript
Elements.update({
  header: {
    textContent: 'My Application',
    style: { backgroundColor: '#333', color: 'white' }
  },
  nav: {
    classList: { add: ['sticky'] }
  },
  main: {
    style: { minHeight: '80vh' }
  },
  footer: {
    textContent: '© 2024 My Company',
    style: { textAlign: 'center' }
  }
});
```

#### Form setup
```javascript
Elements.update({
  loginForm: {
    setAttribute: { novalidate: 'true' }
  },
  emailInput: {
    value: '',
    setAttribute: {
      placeholder: 'Email address',
      autocomplete: 'email'
    }
  },
  passwordInput: {
    value: '',
    setAttribute: {
      placeholder: 'Password',
      autocomplete: 'current-password'
    }
  },
  submitBtn: {
    disabled: false,
    textContent: 'Sign In'
  },
  errorMsg: {
    textContent: '',
    style: { display: 'none' }
  }
});
```

#### Theme switching
```javascript
function applyDarkTheme() {
  Elements.update({
    body: {
      classList: { add: ['dark-theme'] }
    },
    header: {
      style: { backgroundColor: '#1a1a1a', color: '#fff' }
    },
    sidebar: {
      style: { backgroundColor: '#2a2a2a', color: '#ddd' }
    },
    main: {
      style: { backgroundColor: '#333', color: '#fff' }
    }
  });
}
```

#### State management
```javascript
function setLoadingState(isLoading) {
  Elements.update({
    submitBtn: {
      disabled: isLoading,
      textContent: isLoading ? 'Loading...' : 'Submit'
    },
    spinner: {
      style: { display: isLoading ? 'block' : 'none' }
    },
    form: {
      classList: {
        [isLoading ? 'add' : 'remove']: ['loading']
      }
    }
  });
}
```

---

## Available Update Operations

### 1. Text Content

```javascript
element.update({
  textContent: 'Plain text content',
  innerText: 'Rendered text',
  innerHTML: '<strong>HTML</strong> content'
});
```

**Notes:**
- `textContent` - Fastest, no HTML parsing
- `innerText` - Respects CSS styling (hidden elements excluded)
- `innerHTML` - Parses HTML (slower, potential XSS risk)

---

### 2. Style Updates

```javascript
element.update({
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    fontSize: '16px',
    marginTop: '20px',
    // Use camelCase for multi-word properties
    borderRadius: '8px'
  }
});
```

**Features:**
- **Granular updates** - Only changed styles are applied
- **Automatic units** - Some properties accept numbers (converted to px)
- **Vendor prefixes** - Handle manually if needed

---

### 3. Class Manipulation

```javascript
element.update({
  classList: {
    add: 'single-class',           // String
    add: ['class1', 'class2'],     // Array
    remove: 'old-class',
    remove: ['class3', 'class4'],
    toggle: 'active',
    toggle: ['class5', 'class6'],
    replace: ['oldClass', 'newClass']
  }
});
```

**Operations:**
- `add` - Add one or more classes
- `remove` - Remove one or more classes
- `toggle` - Toggle one or more classes
- `replace` - Replace old class with new class

---

### 4. Attribute Updates

```javascript
element.update({
  // Set attributes (object format - recommended)
  setAttribute: {
    src: '/images/photo.jpg',
    alt: 'Photo description',
    'data-user-id': '123',
    'aria-label': 'Close button'
  },

  // Set attributes (legacy array format)
  setAttribute: ['src', '/images/photo.jpg'],

  // Remove attributes
  removeAttribute: 'disabled',
  removeAttribute: ['disabled', 'hidden']
});
```

---

### 5. Dataset (Data Attributes)

```javascript
element.update({
  dataset: {
    userId: '123',           // Sets data-user-id="123"
    productId: '456',        // Sets data-product-id="456"
    status: 'active'         // Sets data-status="active"
  }
});

// Read later with:
const userId = element.dataset.userId;  // "123"
```

---

### 6. Event Listeners

```javascript
function handleClick(e) {
  console.log('Clicked!', e);
}

element.update({
  // Array format: [eventType, handler, options]
  addEventListener: ['click', handleClick, { once: true }],

  // Object format (for multiple events)
  addEventListener: {
    click: handleClick,
    mouseover: [handleMouseOver, { passive: true }]
  }
});
```

**Features:**
- **Automatic deduplication** - Prevents adding the same listener twice
- **Options support** - Pass event listener options
- **Multiple events** - Add multiple listeners at once

**Remove listeners:**
```javascript
element.update({
  removeEventListener: ['click', handleClick]
});
```

---

### 7. DOM Properties

```javascript
element.update({
  // Form elements
  value: 'input value',
  checked: true,
  disabled: false,
  selectedIndex: 2,

  // Common properties
  id: 'newId',
  className: 'class1 class2',
  title: 'Tooltip text',
  hidden: false,

  // Any valid DOM property
  tabIndex: 0,
  contentEditable: true
});
```

---

### 8. Method Calls

```javascript
element.update({
  // Call methods with no arguments
  focus: [],
  click: [],
  blur: [],

  // Call methods with arguments
  scrollIntoView: [{ behavior: 'smooth', block: 'center' }],
  setAttribute: ['data-id', '123'],
  scrollTo: [0, 100]
});
```

---

## Advanced Patterns

### Conditional updates

```javascript
const isActive = true;
const theme = 'dark';

Elements.button.update({
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

### Dynamic element IDs

```javascript
function updateCard(cardId, data) {
  Elements.update({
    [cardId]: {
      textContent: data.title,
      dataset: { id: data.id },
      classList: { add: [data.status] }
    }
  });
}

updateCard('card-1', { title: 'Title', id: 123, status: 'active' });
```

---

### Chaining updates

```javascript
Elements.header
  .update({ textContent: 'Welcome!' })
  .update({ style: { color: 'blue' } })
  .update({ classList: { add: ['header-active'] } });
```

**Note:** Usually better to combine into one update call for performance.

---

### Computed values

```javascript
const baseSize = 16;
const multiplier = 1.5;

Elements.heading.update({
  style: {
    fontSize: `${baseSize * multiplier}px`,
    lineHeight: `${baseSize * multiplier * 1.2}px`
  }
});
```

---

### Reusable update configs

```javascript
const activeButtonStyle = {
  style: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  },
  classList: { add: ['active'] }
};

const disabledButtonStyle = {
  disabled: true,
  style: { opacity: '0.5', cursor: 'not-allowed' }
};

// Apply configs
Elements.submitBtn.update(activeButtonStyle);
Elements.cancelBtn.update(disabledButtonStyle);
```

---

## Performance Considerations

### 1. Fine-grained change detection

DOM Helpers only updates **what actually changed**:

```javascript
// First update
Elements.header.update({
  textContent: 'Welcome',
  style: { color: 'blue' }
});

// Second update (only textContent changes)
Elements.header.update({
  textContent: 'Hello',
  style: { color: 'blue' }  // Skipped - no change
});
```

Internally, DOM Helpers compares values and skips unchanged properties.

---

### 2. Batch multiple changes

```javascript
// ❌ Multiple updates (slower)
Elements.header.update({ textContent: 'Welcome' });
Elements.header.update({ style: { color: 'blue' } });
Elements.header.update({ classList: { add: ['active'] } });

// ✅ Single update (faster)
Elements.header.update({
  textContent: 'Welcome',
  style: { color: 'blue' },
  classList: { add: ['active'] }
});
```

---

### 3. Bulk updates vs individual

```javascript
// ❌ Individual updates (multiple method calls)
Elements.header.update({ textContent: 'Header' });
Elements.footer.update({ textContent: 'Footer' });
Elements.sidebar.update({ textContent: 'Sidebar' });

// ✅ Bulk update (single method call)
Elements.update({
  header: { textContent: 'Header' },
  footer: { textContent: 'Footer' },
  sidebar: { textContent: 'Sidebar' }
});
```

---

### 4. Avoid unnecessary updates

```javascript
// ❌ Updating with same value
Elements.header.update({ textContent: currentText });

// ✅ Check before updating
if (newText !== currentText) {
  Elements.header.update({ textContent: newText });
}

// ✅✅ Don't worry! DOM Helpers does this automatically
Elements.header.update({ textContent: newText });
// Internally skips if newText === currentText
```

---

## Best Practices

### 1. Use bulk updates for initialization

```javascript
// ✅ Initialize multiple elements at once
function initializePage() {
  Elements.update({
    header: {
      textContent: config.appName,
      style: { backgroundColor: config.headerColor }
    },
    nav: {
      classList: { add: ['initialized'] }
    },
    main: {
      style: { minHeight: '100vh' }
    }
  });
}
```

---

### 2. Create reusable style configs

```javascript
const styles = {
  primaryButton: {
    style: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px'
    }
  },
  errorMessage: {
    style: { color: 'red', fontWeight: 'bold' },
    setAttribute: { role: 'alert' }
  }
};

Elements.submitBtn.update(styles.primaryButton);
Elements.errorMsg.update(styles.errorMessage);
```

---

### 3. Combine with destructuring for clean code

```javascript
const { header, nav, footer } = Elements.destructure('header', 'nav', 'footer');

header.update({ textContent: 'Welcome!' });
nav.update({ classList: { add: ['active'] } });
footer.update({ textContent: '© 2024' });

// Or update all at once:
Elements.update({
  header: { textContent: 'Welcome!' },
  nav: { classList: { add: ['active'] } },
  footer: { textContent: '© 2024' }
});
```

---

### 4. Use semantic update objects

```javascript
// ✅ Clear, semantic updates
const loginFormConfig = {
  loginForm: {
    setAttribute: { novalidate: 'true' }
  },
  emailInput: {
    setAttribute: {
      placeholder: 'Email',
      type: 'email',
      autocomplete: 'email'
    }
  },
  submitBtn: {
    textContent: 'Sign In',
    disabled: false
  }
};

Elements.update(loginFormConfig);
```

---

## Real-World Examples

### Application theme switcher

```javascript
function applyTheme(theme) {
  const themes = {
    light: {
      body: {
        style: { backgroundColor: '#fff', color: '#000' }
      },
      header: {
        style: { backgroundColor: '#f8f9fa', color: '#212529' }
      },
      sidebar: {
        style: { backgroundColor: '#e9ecef', color: '#495057' }
      }
    },
    dark: {
      body: {
        style: { backgroundColor: '#212529', color: '#fff' }
      },
      header: {
        style: { backgroundColor: '#343a40', color: '#fff' }
      },
      sidebar: {
        style: { backgroundColor: '#495057', color: '#f8f9fa' }
      }
    }
  };

  Elements.update(themes[theme]);
}
```

---

### Form validation feedback

```javascript
function showValidationErrors(errors) {
  // Reset all error states
  Elements.update({
    emailError: { textContent: '', style: { display: 'none' } },
    passwordError: { textContent: '', style: { display: 'none' } },
    emailInput: { classList: { remove: ['error'] } },
    passwordInput: { classList: { remove: ['error'] } }
  });

  // Show specific errors
  if (errors.email) {
    Elements.update({
      emailError: {
        textContent: errors.email,
        style: { display: 'block' }
      },
      emailInput: {
        classList: { add: ['error'] }
      }
    });
  }

  if (errors.password) {
    Elements.update({
      passwordError: {
        textContent: errors.password,
        style: { display: 'block' }
      },
      passwordInput: {
        classList: { add: ['error'] }
      }
    });
  }
}
```

---

### Dashboard widget system

```javascript
function renderDashboard(widgets) {
  const updates = {};

  widgets.forEach(widget => {
    updates[widget.id] = {
      innerHTML: widget.html,
      dataset: {
        widgetType: widget.type,
        widgetId: widget.id
      },
      classList: {
        add: ['widget', `widget-${widget.type}`]
      },
      style: {
        gridColumn: widget.column,
        gridRow: widget.row
      }
    };
  });

  Elements.update(updates);
}
```

---

### Loading state management

```javascript
class LoadingStateManager {
  setLoading(elementIds) {
    const updates = {};

    elementIds.forEach(id => {
      updates[id] = {
        disabled: true,
        classList: { add: ['loading'] },
        setAttribute: { 'aria-busy': 'true' }
      };
    });

    Elements.update(updates);
  }

  clearLoading(elementIds) {
    const updates = {};

    elementIds.forEach(id => {
      updates[id] = {
        disabled: false,
        classList: { remove: ['loading'] },
        removeAttribute: ['aria-busy']
      };
    });

    Elements.update(updates);
  }
}

const loadingManager = new LoadingStateManager();
loadingManager.setLoading(['submitBtn', 'cancelBtn', 'resetBtn']);
```

---

## Summary

The **`Elements.update()` method** is the cornerstone of DOM Helpers, providing:

✅ **Declarative updates** - Describe what you want, not how to do it
✅ **Performance optimization** - Fine-grained change detection and batching
✅ **Clean syntax** - Readable, maintainable code
✅ **Bulk operations** - Update multiple elements efficiently
✅ **Type safety** - Handles all property types correctly

**Key takeaway:** Use `.update()` for all DOM modifications to leverage automatic optimization and cleaner code.

---

## Next Steps

Continue to the other Elements documentation:

- **[Access Methods](01_Access-Methods.md)** - Getting elements by ID
- **[Property Methods](02_Property-Methods.md)** - `setProperty`, `getProperty`, `setAttribute`, `getAttribute`
- **[Utility Methods](04_Utility-Methods.md)** - `stats()`, `clear()`, `destroy()`, `configure()`

---

**[Back to Documentation Home](../../README.md)**
