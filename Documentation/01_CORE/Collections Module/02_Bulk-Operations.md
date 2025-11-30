# Collections Module - Bulk Operations

[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)
[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

> **Part 2 of 6**: Bulk Operations for the Collections Helper
> Update multiple collections and all their elements efficiently

---

## Table of Contents

1. [Overview](#overview)
2. [Collections.update() - The Power Method](#collectionsupdate---the-power-method)
3. [Update Object Structure](#update-object-structure)
4. [Single Collection Updates](#single-collection-updates)
5. [Multiple Collection Updates](#multiple-collection-updates)
6. [Available Update Operations](#available-update-operations)
7. [Advanced Patterns](#advanced-patterns)
8. [Performance Considerations](#performance-considerations)
9. [Best Practices](#best-practices)
10. [Real-World Examples](#real-world-examples)

---

## Overview

The **`Collections.update()` method** allows you to update multiple collections and all their elements with a single method call.

✅ **Update entire collections** - Apply changes to all elements in a collection
✅ **Update multiple collections** - Change many collections at once
✅ **Declarative syntax** - Clean, readable configuration objects
✅ **Fine-grained updates** - Only changed properties are modified
✅ **Chainable** - Return collection for further operations

---

## `Collections.update()` - The Power Method

### What it does

**Update one or more collections** by applying changes to all elements within each collection.

```javascript
Collections.update(updates)
```

**Parameters:**
- `updates` (object) - Configuration object mapping collection types and names to their updates

**Returns:** The Collections helper (for chaining)

---

### Two modes of operation

#### Mode 1: Single Collection Update (via collection instance)

```javascript
// Get collection first, then update all elements in it
const buttons = Collections.ClassName.button;

buttons.update({
  style: { padding: '10px' },
  classList: { add: ['styled'] }
});
```

This applies the update to **all buttons** in the collection.

---

#### Mode 2: Bulk Update (via Collections.update)

```javascript
// Update multiple collections at once
Collections.update({
  ClassName: {
    button: {
      style: { padding: '10px' },
      classList: { add: ['styled'] }
    },
    card: {
      style: { borderRadius: '8px' }
    }
  },
  TagName: {
    img: {
      setAttribute: { loading: 'lazy' }
    }
  }
});
```

This updates multiple collections in a single call.

---

## Update Object Structure

The update object for Collections follows this pattern:

```javascript
{
  // By collection type
  ClassName: {
    button: { /* updates for all .button elements */ },
    card: { /* updates for all .card elements */ }
  },

  TagName: {
    div: { /* updates for all <div> elements */ },
    img: { /* updates for all <img> elements */ }
  },

  Name: {
    email: { /* updates for all name="email" elements */ },
    country: { /* updates for all name="country" elements */ }
  }
}
```

---

## Single Collection Updates

### Basic syntax

```javascript
// Get a collection
const buttons = Collections.ClassName.button;

// Update all elements in the collection
buttons.update({
  textContent: 'Click Me',
  style: { backgroundColor: 'blue', color: 'white' }
});
```

This applies the updates to **every button** with the class "button".

---

### Why use `.update()` on collections?

```javascript
// ❌ Traditional approach (manual iteration)
const buttons = document.getElementsByClassName('button');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].style.padding = '10px';
  buttons[i].style.backgroundColor = 'blue';
  buttons[i].classList.add('styled');
}

// ✅ DOM Helpers approach (one call)
Collections.ClassName.button.update({
  style: {
    padding: '10px',
    backgroundColor: 'blue'
  },
  classList: { add: ['styled'] }
});
```

**Benefits:**
- **Less code** - Single method call
- **Cleaner syntax** - Declarative updates
- **Optimized** - Fine-grained change detection
- **Readable** - Clear intent

---

### Examples: Single Collection Updates

#### Style all buttons
```javascript
Collections.ClassName.button.update({
  style: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
});
```

#### Add class to all cards
```javascript
Collections.ClassName.card.update({
  classList: { add: ['initialized', 'fade-in'] }
});
```

#### Set attributes on all images
```javascript
Collections.TagName.img.update({
  setAttribute: {
    loading: 'lazy',
    decoding: 'async'
  }
});
```

#### Disable all inputs
```javascript
Collections.TagName.input.update({
  disabled: true,
  style: { opacity: '0.5' }
});
```

---

### Chaining updates

```javascript
Collections.ClassName.button
  .update({ classList: { add: ['btn'] } })
  .update({ style: { padding: '10px' } });

// Better: combine into one update
Collections.ClassName.button.update({
  classList: { add: ['btn'] },
  style: { padding: '10px' }
});
```

---

## Multiple Collection Updates

### Bulk update syntax

Update **multiple collections** at once using `Collections.update()`:

```javascript
Collections.update({
  ClassName: {
    collectionName1: { /* updates */ },
    collectionName2: { /* updates */ }
  },
  TagName: {
    tag1: { /* updates */ }
  }
});
```

---

### Examples: Multiple Collection Updates

#### Page initialization
```javascript
Collections.update({
  ClassName: {
    navItem: {
      style: { padding: '10px 15px', cursor: 'pointer' },
      classList: { add: ['nav-initialized'] }
    },
    card: {
      style: { borderRadius: '8px', padding: '20px' },
      classList: { add: ['card-styled'] }
    },
    button: {
      style: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none'
      }
    }
  },
  TagName: {
    img: {
      setAttribute: { loading: 'lazy' }
    },
    a: {
      setAttribute: { rel: 'noopener noreferrer' }
    }
  }
});
```

---

#### Form styling
```javascript
Collections.update({
  TagName: {
    input: {
      style: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }
    },
    textarea: {
      style: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontFamily: 'inherit'
      }
    },
    select: {
      style: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }
    }
  },
  ClassName: {
    required: {
      style: { borderLeft: '3px solid red' },
      setAttribute: { 'aria-required': 'true' }
    }
  }
});
```

---

#### Accessibility enhancements
```javascript
Collections.update({
  TagName: {
    button: {
      setAttribute: { type: 'button' }  // Prevent form submission
    },
    img: {
      // Ensure all images have alt text
      setAttribute: { alt: 'Image' }  // Default alt
    }
  },
  ClassName: {
    interactive: {
      setAttribute: { tabindex: '0' }
    },
    hidden: {
      setAttribute: { 'aria-hidden': 'true' }
    }
  }
});
```

---

## Available Update Operations

All update operations available for Elements also work on Collections. Each element in the collection receives the same updates.

### 1. Text Content

```javascript
collection.update({
  textContent: 'Same text for all',
  // or innerHTML for HTML content
  innerHTML: '<strong>Same HTML</strong> for all'
});
```

**Note:** Setting textContent/innerHTML on all elements may not always make sense. Often better for individual element updates.

---

### 2. Style Updates

```javascript
collection.update({
  style: {
    color: 'red',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px'
  }
});
```

**Common use:** Apply consistent styling to all elements in a collection.

---

### 3. Class Manipulation

```javascript
collection.update({
  classList: {
    add: ['class1', 'class2'],
    remove: 'oldClass',
    toggle: 'active'
  }
});
```

**Very common use:** Add/remove classes from groups of elements.

---

### 4. Attribute Updates

```javascript
collection.update({
  setAttribute: {
    'data-initialized': 'true',
    'aria-label': 'Button'
  },
  removeAttribute: ['disabled', 'hidden']
});
```

---

### 5. Dataset (Data Attributes)

```javascript
collection.update({
  dataset: {
    initialized: 'true',
    version: '2.0'
  }
});
```

---

### 6. Event Listeners

```javascript
function handleClick(e) {
  console.log('Clicked:', e.target);
}

collection.update({
  addEventListener: ['click', handleClick]
});
```

**Note:** The same handler function is added to **all elements** in the collection.

---

### 7. DOM Properties

```javascript
collection.update({
  disabled: true,
  checked: false,
  value: 'default',
  hidden: false
});
```

---

### 8. Method Calls

```javascript
collection.update({
  focus: [],           // Focus all (usually only makes sense for one)
  scrollIntoView: [{ behavior: 'smooth' }]
});
```

---

## Advanced Patterns

### Conditional updates based on collection

```javascript
const buttons = Collections.ClassName.button;

if (buttons.length > 0) {
  buttons.update({
    style: { display: 'block' },
    classList: { add: ['visible'] }
  });
} else {
  console.log('No buttons found');
}
```

---

### Dynamic collection names

```javascript
function updateCollectionByName(className, updates) {
  Collections.ClassName(className).update(updates);
}

updateCollectionByName('card', {
  style: { borderRadius: '8px' }
});

updateCollectionByName('button', {
  style: { padding: '10px' }
});
```

---

### Combining with filtering

```javascript
const allButtons = Collections.ClassName.button;

// Update only visible buttons
const visibleButtons = allButtons.visible();
visibleButtons.update({
  style: { opacity: '1' }
});

// Update only enabled buttons
const enabledButtons = allButtons.enabled();
enabledButtons.update({
  classList: { add: ['clickable'] }
});
```

---

### Per-element customization

For cases where each element needs different updates:

```javascript
const cards = Collections.ClassName.card;

cards.forEach((card, index) => {
  card.update({
    textContent: `Card ${index + 1}`,
    dataset: { index: index },
    style: { animationDelay: `${index * 0.1}s` }
  });
});
```

---

### Reusable update configs

```javascript
const buttonStyles = {
  style: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

const cardStyles = {
  style: {
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

// Apply reusable configs
Collections.ClassName.button.update(buttonStyles);
Collections.ClassName.card.update(cardStyles);

// Or in bulk
Collections.update({
  ClassName: {
    button: buttonStyles,
    card: cardStyles
  }
});
```

---

## Performance Considerations

### 1. Fine-grained change detection

DOM Helpers only updates **what actually changed**:

```javascript
// First update
Collections.ClassName.button.update({
  style: { color: 'blue', padding: '10px' }
});

// Second update - only color changes
Collections.ClassName.button.update({
  style: { color: 'red', padding: '10px' }
});
// padding is NOT reapplied (no change detected)
```

---

### 2. Batch updates

```javascript
// ❌ Multiple update calls
Collections.ClassName.button.update({ style: { color: 'blue' } });
Collections.ClassName.button.update({ classList: { add: ['btn'] } });
Collections.ClassName.button.update({ disabled: false });

// ✅ Single batched update
Collections.ClassName.button.update({
  style: { color: 'blue' },
  classList: { add: ['btn'] },
  disabled: false
});
```

---

### 3. Bulk updates vs individual collection updates

```javascript
// ❌ Individual collection updates
Collections.ClassName.button.update({ style: { padding: '10px' } });
Collections.ClassName.card.update({ style: { padding: '20px' } });
Collections.ClassName.navItem.update({ style: { padding: '5px' } });

// ✅ Bulk update (cleaner, single method call)
Collections.update({
  ClassName: {
    button: { style: { padding: '10px' } },
    card: { style: { padding: '20px' } },
    navItem: { style: { padding: '5px' } }
  }
});
```

---

### 4. Avoid updating large collections unnecessarily

```javascript
// ❌ May be expensive if many divs
Collections.TagName.div.update({ style: { color: 'blue' } });

// ✅ Be more specific
Collections.ClassName.contentDiv.update({ style: { color: 'blue' } });
```

---

## Best Practices

### 1. Use bulk updates for initialization

```javascript
// ✅ Initialize multiple collections on page load
function initializePage() {
  Collections.update({
    ClassName: {
      button: {
        classList: { add: ['btn', 'btn-initialized'] },
        style: { transition: 'all 0.3s' }
      },
      card: {
        classList: { add: ['card-initialized'] },
        style: { opacity: '1' }
      }
    },
    TagName: {
      img: { setAttribute: { loading: 'lazy' } },
      a: { setAttribute: { rel: 'noopener' } }
    }
  });
}
```

---

### 2. Keep updates semantic and organized

```javascript
// ✅ Organized by purpose
const formStyles = {
  TagName: {
    input: {
      style: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }
    },
    select: {
      style: {
        padding: '8px',
        border: '1px solid #ccc'
      }
    }
  }
};

Collections.update(formStyles);
```

---

### 3. Use specific selectors

```javascript
// ❌ Too broad
Collections.TagName.div.update({ style: { padding: '10px' } });

// ✅ More specific
Collections.ClassName.contentDiv.update({ style: { padding: '10px' } });
```

---

### 4. Combine with array methods for complex logic

```javascript
const buttons = Collections.ClassName.button;

// Filter and update
buttons
  .filter(btn => !btn.disabled)
  .forEach(btn => {
    btn.update({ classList: { add: ['enabled'] } });
  });

// Or use enhanced filtering
buttons.enabled().update({ classList: { add: ['active'] } });
```

---

## Real-World Examples

### Theme switcher

```javascript
function applyTheme(theme) {
  const themes = {
    light: {
      ClassName: {
        card: {
          style: { backgroundColor: 'white', color: 'black' }
        },
        button: {
          style: { backgroundColor: '#007bff', color: 'white' }
        }
      },
      TagName: {
        body: {
          style: { backgroundColor: '#f5f5f5', color: '#333' }
        }
      }
    },
    dark: {
      ClassName: {
        card: {
          style: { backgroundColor: '#2a2a2a', color: 'white' }
        },
        button: {
          style: { backgroundColor: '#0d6efd', color: 'white' }
        }
      },
      TagName: {
        body: {
          style: { backgroundColor: '#1a1a1a', color: '#e0e0e0' }
        }
      }
    }
  };

  Collections.update(themes[theme]);
}

applyTheme('dark');
```

---

### Form state management

```javascript
function setFormState(state) {
  const states = {
    loading: {
      TagName: {
        input: { disabled: true, style: { opacity: '0.5' } },
        button: { disabled: true, textContent: 'Loading...' }
      },
      ClassName: {
        spinner: { style: { display: 'block' } }
      }
    },
    ready: {
      TagName: {
        input: { disabled: false, style: { opacity: '1' } },
        button: { disabled: false, textContent: 'Submit' }
      },
      ClassName: {
        spinner: { style: { display: 'none' } }
      }
    },
    error: {
      ClassName: {
        errorField: {
          classList: { add: ['error'] },
          style: { borderColor: 'red' }
        },
        errorMessage: {
          style: { display: 'block', color: 'red' }
        }
      }
    }
  };

  Collections.update(states[state]);
}

setFormState('loading');
```

---

### Accessibility audit fix

```javascript
function enhanceAccessibility() {
  Collections.update({
    TagName: {
      button: {
        setAttribute: { type: 'button' }
      },
      img: {
        // Check and add alt if missing (do this per-element)
      },
      a: {
        // Add rel for external links (per-element logic needed)
      }
    },
    ClassName: {
      interactive: {
        setAttribute: { tabindex: '0', role: 'button' }
      },
      modal: {
        setAttribute: {
          role: 'dialog',
          'aria-modal': 'true'
        }
      },
      alert: {
        setAttribute: {
          role: 'alert',
          'aria-live': 'polite'
        }
      }
    }
  });
}
```

---

### Navigation states

```javascript
function setActiveNav(activeId) {
  const navItems = Collections.ClassName.navItem;

  // Reset all
  navItems.update({
    classList: { remove: ['active'] },
    setAttribute: { 'aria-current': 'false' }
  });

  // Set active (need individual element access)
  navItems.forEach(item => {
    if (item.id === activeId) {
      item.update({
        classList: { add: ['active'] },
        setAttribute: { 'aria-current': 'page' }
      });
    }
  });
}
```

---

### Image gallery optimization

```javascript
function optimizeImages() {
  Collections.TagName.img.update({
    setAttribute: {
      loading: 'lazy',
      decoding: 'async'
    },
    addEventListener: ['error', function() {
      this.src = '/images/placeholder.png';
    }]
  });
}
```

---

## Summary

The **`Collections.update()` method** enables powerful bulk operations:

✅ **Update entire collections** - Apply changes to all elements at once
✅ **Update multiple collections** - Single method call for many collections
✅ **Declarative syntax** - Clean, readable configuration
✅ **Fine-grained updates** - Only changed properties are modified
✅ **Optimized performance** - Batched DOM operations

**Key takeaway:** Use `Collections.update()` for efficient bulk DOM manipulation.

---

## Next Steps

Continue to the other Collections documentation:

- **[Access Methods](01_Access-Methods.md)** - Getting collections by class/tag/name
- **[Array-like Methods](03_Array-like-Methods.md)** - `.forEach()`, `.map()`, `.filter()`, etc.
- **[DOM Manipulation](04_DOM-Manipulation.md)** - `.addClass()`, `.setStyle()`, `.on()`, etc.
- **[Filtering Methods](05_Filtering-Methods.md)** - `.visible()`, `.hidden()`, `.enabled()`, etc.
- **[Utility & Helper Methods](06_Utility-Helper-Methods.md)** - `.stats()`, `.configure()`, etc.

---

**[Back to Documentation Home](../../README.md)**
