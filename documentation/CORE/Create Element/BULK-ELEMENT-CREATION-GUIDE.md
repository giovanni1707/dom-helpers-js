[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)



# Bulk Element Creation Guide

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Configuration Options](#configuration-options)
7. [Usage Examples](#usage-examples)
8. [Advanced Techniques](#advanced-techniques)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Bulk Element Creation feature is a powerful addition to the DOM Helpers library that allows developers to create multiple DOM elements in a single, declarative call. This feature significantly simplifies the process of creating complex DOM structures and reduces boilerplate code.

### Key Features

- ✅ **Create multiple elements at once** with a single function call
- ✅ **Declarative configuration** using plain JavaScript objects
- ✅ **Automatic element enhancement** with `.update()` method
- ✅ **Flexible ordering** - append elements in any order you need
- ✅ **Support for numbered instances** (e.g., `DIV_1`, `DIV_2`, `DIV_3`)
- ✅ **Rich API** with helper methods for common operations
- ✅ **Type-safe access** to created elements
- ✅ **Chainable methods** for fluent API design

### Why Use Bulk Element Creation?

**Before:**
```javascript
// Traditional approach - verbose and error-prone
const paragraph = document.createElement('p');
paragraph.textContent = 'Hello World';
paragraph.style.color = 'blue';
paragraph.style.fontSize = '16px';

const heading = document.createElement('h1');
heading.textContent = 'Title';
heading.style.color = 'green';

const container = document.createElement('div');
container.className = 'wrapper';
container.appendChild(heading);
container.appendChild(paragraph);

document.body.appendChild(container);
```

**After:**
```javascript
// Bulk creation - clean and declarative
const elements = createElement.bulk({
  H1: { textContent: 'Title', style: { color: 'green' } },
  P: { textContent: 'Hello World', style: { color: 'blue', fontSize: '16px' } },
  DIV: { className: 'wrapper' }
});

elements.DIV.append(elements.H1, elements.P);
document.body.appendChild(elements.DIV);
```

---

## Installation

The bulk element creation feature is included in the DOM Helpers library. No additional installation required.

### Include via Script Tag

```html
<script src="path/to/dom-helpers.js"></script>
```

### Verify Installation

```javascript
// Check if createElement.bulk is available
if (typeof createElement !== 'undefined' && typeof createElement.bulk === 'function') {
  console.log('Bulk element creation is ready!');
}
```

---

## Quick Start

### Basic Example

```javascript
// Create multiple elements
const elements = createElement.bulk({
  H1: {
    textContent: 'Welcome!',
    style: { color: '#333', fontSize: '28px' }
  },
  P: {
    textContent: 'This is a paragraph',
    style: { color: '#666', lineHeight: '1.6' }
  },
  BUTTON: {
    textContent: 'Click Me',
    style: { padding: '10px 20px', background: '#007bff', color: 'white' }
  }
});

// Access and use the elements
document.body.append(elements.H1, elements.P, elements.BUTTON);

// Or append all at once
document.body.append(...elements.all);
```

---

## Core Concepts

### 1. Element Definitions

Element definitions are JavaScript objects where:
- **Keys** = Element identifiers (tag names or custom names)
- **Values** = Configuration objects

```javascript
{
  TAGNAME: { /* configuration */ },
  TAGNAME_1: { /* configuration */ },
  TAGNAME_2: { /* configuration */ }
}
```

### 2. Tag Name Parsing

The function intelligently parses tag names:

```javascript
createElement.bulk({
  DIV: {},        // Creates: <div>
  P: {},          // Creates: <p>
  DIV_1: {},      // Creates: <div> (instance 1)
  DIV_2: {},      // Creates: <div> (instance 2)
  SPAN_A: {},     // Creates: <span>
});
```

### 3. Configuration Objects

Each element can be configured with any valid DOM properties:

```javascript
{
  // Text content
  textContent: 'Hello',
  innerHTML: '<strong>Bold</strong>',
  
  // Attributes
  id: 'myElement',
  className: 'btn btn-primary',
  
  // Styles (object)
  style: {
    color: 'red',
    fontSize: '16px',
    padding: '10px'
  },
  
  // Class manipulation (object)
  classList: {
    add: ['active', 'highlight'],
    remove: ['hidden'],
    toggle: 'expanded'
  },
  
  // Set attributes (object or array)
  setAttribute: {
    'data-id': '123',
    'aria-label': 'Close'
  },
  // OR
  setAttribute: ['data-id', '123'],
  
  // Dataset
  dataset: {
    userId: '42',
    action: 'submit'
  },
  
  // Event listeners
  addEventListener: ['click', handleClick, { once: true }],
  
  // Any DOM property
  disabled: false,
  checked: true,
  value: 'initial value'
}
```

---

## API Reference

### Main Function

#### `createElement.bulk(definitions)`

Creates multiple DOM elements from a definition object.

**Alias:** `createElement.update(definitions)`

**Parameters:**
- `definitions` (Object): Object mapping element identifiers to configuration objects

**Returns:** Object with created elements and helper methods

**Example:**
```javascript
const elements = createElement.bulk({
  DIV: { className: 'container' },
  P: { textContent: 'Hello' }
});
```

---

### Return Object Properties

The returned object provides direct access to elements plus helper methods:

#### Element Access

```javascript
const elements = createElement.bulk({
  DIV: {},
  P: {},
  SPAN_1: {},
  SPAN_2: {}
});

// Direct access by key
elements.DIV      // The DIV element
elements.P        // The P element
elements.SPAN_1   // First SPAN element
elements.SPAN_2   // Second SPAN element
```

---

### Return Object Methods

#### `.all` (getter)

Returns all created elements as an array in creation order.

```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {}
});

console.log(elements.all); // [h1, p, div]
document.body.append(...elements.all);
```

---

#### `.toArray(...keys)`

Returns specific elements as an array. If no keys provided, returns all elements.

**Parameters:**
- `...keys` (string): Element keys to retrieve

**Returns:** Array of elements

```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {},
  SPAN: {}
});

// Get specific elements
const subset = elements.toArray('H1', 'P');
console.log(subset); // [h1, p]

// Get all elements
const all = elements.toArray();
console.log(all); // [h1, p, div, span]
```

---

#### `.ordered(...keys)`

Returns elements in a specific order. Alias for `.toArray()`.

**Parameters:**
- `...keys` (string): Element keys in desired order

**Returns:** Array of elements in specified order

```javascript
const elements = createElement.bulk({
  P: {},
  H1: {},
  DIV: {}
});

// Normal order
console.log(elements.all); // [p, h1, div]

// Custom order
const reversed = elements.ordered('DIV', 'H1', 'P');
console.log(reversed); // [div, h1, p]

container.append(...reversed);
```

---

#### `.count` (getter)

Returns the total number of created elements.

```javascript
const elements = createElement.bulk({
  DIV_1: {},
  DIV_2: {},
  DIV_3: {}
});

console.log(elements.count); // 3
```

---

#### `.keys` (getter)

Returns an array of all element keys.

```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {}
});

console.log(elements.keys); // ['H1', 'P', 'DIV']
```

---

#### `.has(key)`

Checks if an element with the given key exists.

**Parameters:**
- `key` (string): Element key to check

**Returns:** Boolean

```javascript
const elements = createElement.bulk({
  DIV: {},
  P: {}
});

console.log(elements.has('DIV'));    // true
console.log(elements.has('SPAN'));   // false
```

---

#### `.get(key, fallback)`

Gets an element by key with an optional fallback value.

**Parameters:**
- `key` (string): Element key
- `fallback` (any): Value to return if element not found (default: null)

**Returns:** Element or fallback value

```javascript
const elements = createElement.bulk({
  DIV: {}
});

const div = elements.get('DIV');              // Returns the div
const span = elements.get('SPAN', 'N/A');     // Returns 'N/A'
```

---

#### `.updateMultiple(updates)`

Updates multiple elements at once using the `.update()` method.

**Parameters:**
- `updates` (Object): Object mapping element keys to update configurations

**Returns:** The elements object (for chaining)

```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {}
});

elements.updateMultiple({
  H1: {
    textContent: 'New Title',
    style: { color: 'blue' }
  },
  P: {
    textContent: 'Updated paragraph',
    style: { fontSize: '16px' }
  }
});
```

---

#### `.forEach(callback)`

Iterates over all elements.

**Parameters:**
- `callback` (Function): Function to execute for each element
  - `element` (Element): The current element
  - `key` (string): The element key
  - `index` (number): The iteration index

```javascript
const elements = createElement.bulk({
  DIV_1: {},
  DIV_2: {},
  DIV_3: {}
});

elements.forEach((element, key, index) => {
  console.log(`${key} at index ${index}:`, element);
  element.textContent = `Item ${index + 1}`;
});
```

---

#### `.map(callback)`

Maps over all elements and returns a new array.

**Parameters:**
- `callback` (Function): Function to execute for each element
  - `element` (Element): The current element
  - `key` (string): The element key
  - `index` (number): The iteration index

**Returns:** Array of mapped values

```javascript
const elements = createElement.bulk({
  DIV_1: {},
  DIV_2: {},
  DIV_3: {}
});

const textContents = elements.map((element, key) => {
  element.textContent = key;
  return element.textContent;
});

console.log(textContents); // ['DIV_1', 'DIV_2', 'DIV_3']
```

---

#### `.filter(callback)`

Filters elements based on a condition.

**Parameters:**
- `callback` (Function): Function to test each element
  - `element` (Element): The current element
  - `key` (string): The element key
  - `index` (number): The iteration index

**Returns:** Array of filtered elements

```javascript
const elements = createElement.bulk({
  DIV_1: { className: 'active' },
  DIV_2: { className: 'inactive' },
  DIV_3: { className: 'active' }
});

const activeElements = elements.filter((element) => {
  return element.classList.contains('active');
});

console.log(activeElements.length); // 2
```

---

#### `.appendTo(container)`

Appends all elements to a container.

**Parameters:**
- `container` (Element | string): Container element or CSS selector

**Returns:** The elements object (for chaining)

```javascript
const elements = createElement.bulk({
  H1: {},
  P: {},
  DIV: {}
});

// Append to element
elements.appendTo(document.body);

// Append using selector
elements.appendTo('#container');
```

---

#### `.appendToOrdered(container, ...keys)`

Appends specific elements to a container in the specified order.

**Parameters:**
- `container` (Element | string): Container element or CSS selector
- `...keys` (string): Element keys in desired order

**Returns:** The elements object (for chaining)

```javascript
const elements = createElement.bulk({
  P: {},
  H1: {},
  DIV: {}
});

// Append in custom order: H1, P, DIV
elements.appendToOrdered('#container', 'H1', 'P', 'DIV');
```

---

## Configuration Options

### Style Configuration

Apply inline styles using an object:

```javascript
createElement.bulk({
  DIV: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }
});
```

---

### Class List Configuration

Manipulate classes using the `classList` object:

```javascript
createElement.bulk({
  DIV: {
    className: 'container', // Initial class
    classList: {
      add: ['active', 'highlight'],      // Add multiple classes
      remove: ['hidden'],                 // Remove classes
      toggle: 'expanded',                 // Toggle a class
      replace: ['old-class', 'new-class'] // Replace class
    }
  }
});
```

---

### Attribute Configuration

Set attributes using object or array syntax:

```javascript
createElement.bulk({
  IMG: {
    // Object syntax (multiple attributes)
    setAttribute: {
      src: 'image.jpg',
      alt: 'Description',
      width: '300',
      height: '200',
      loading: 'lazy'
    }
  },
  
  INPUT: {
    // Array syntax (single attribute)
    setAttribute: ['placeholder', 'Enter your name']
  }
});
```

---

### Dataset Configuration

Set data attributes easily:

```javascript
createElement.bulk({
  DIV: {
    dataset: {
      userId: '123',
      action: 'submit',
      category: 'electronics',
      price: '99.99'
    }
  }
});

// Results in:
// <div data-user-id="123" data-action="submit" 
//      data-category="electronics" data-price="99.99"></div>
```

---

### Event Listener Configuration

Add event listeners during creation:

```javascript
createElement.bulk({
  BUTTON: {
    textContent: 'Click Me',
    addEventListener: ['click', (e) => {
      console.log('Button clicked!', e.target);
    }, { once: true }]
  },
  
  // Multiple events using object syntax
  INPUT: {
    addEventListener: {
      focus: (e) => console.log('Input focused'),
      blur: (e) => console.log('Input blurred'),
      input: (e) => console.log('Value:', e.target.value)
    }
  }
});
```

---

## Usage Examples

### Example 1: Simple Content Creation

Create a basic page structure:

```javascript
const content = createElement.bulk({
  HEADER: {
    innerHTML: '<h1>Welcome</h1>',
    style: { padding: '20px', background: '#333', color: 'white' }
  },
  MAIN: {
    className: 'content',
    style: { padding: '20px', minHeight: '400px' }
  },
  FOOTER: {
    innerHTML: '<p>&copy; 2025 Company</p>',
    style: { padding: '10px', background: '#f0f0f0', textAlign: 'center' }
  }
});

document.body.append(...content.all);
```

---

### Example 2: Create a Form

Build a complete form:

```javascript
const form = createElement.bulk({
  FORM: {
    id: 'contactForm',
    style: { maxWidth: '500px', margin: '20px auto' }
  },
  
  LABEL_NAME: {
    textContent: 'Name:',
    setAttribute: { for: 'name' },
    style: { display: 'block', marginBottom: '5px', fontWeight: 'bold' }
  },
  
  INPUT_NAME: {
    id: 'name',
    type: 'text',
    placeholder: 'Enter your name',
    required: true,
    style: { 
      width: '100%', 
      padding: '10px', 
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }
  },
  
  LABEL_EMAIL: {
    textContent: 'Email:',
    setAttribute: { for: 'email' },
    style: { display: 'block', marginBottom: '5px', fontWeight: 'bold' }
  },
  
  INPUT_EMAIL: {
    id: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    style: { 
      width: '100%', 
      padding: '10px', 
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }
  },
  
  BUTTON_SUBMIT: {
    textContent: 'Submit',
    type: 'submit',
    style: {
      padding: '12px 30px',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px'
    }
  }
});

// Assemble the form
form.FORM.append(
  form.LABEL_NAME,
  form.INPUT_NAME,
  form.LABEL_EMAIL,
  form.INPUT_EMAIL,
  form.BUTTON_SUBMIT
);

// Add form handler
form.FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: form.INPUT_NAME.value,
    email: form.INPUT_EMAIL.value
  };
  console.log('Form submitted:', data);
});

document.body.appendChild(form.FORM);
```

---

### Example 3: Create Multiple Cards

Generate a list of cards:

```javascript
const cards = createElement.bulk({
  CARD_1: {
    className: 'card',
    innerHTML: `
      <h3>Card 1</h3>
      <p>Description for card 1</p>
    `,
    style: {
      padding: '20px',
      margin: '10px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  
  CARD_2: {
    className: 'card',
    innerHTML: `
      <h3>Card 2</h3>
      <p>Description for card 2</p>
    `,
    style: {
      padding: '20px',
      margin: '10px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  
  CARD_3: {
    className: 'card',
    innerHTML: `
      <h3>Card 3</h3>
      <p>Description for card 3</p>
    `,
    style: {
      padding: '20px',
      margin: '10px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }
});

// Create container and append all cards
const container = document.createElement('div');
container.style.display = 'grid';
container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
container.style.gap = '20px';
container.append(...cards.all);

document.body.appendChild(container);
```

---

### Example 4: Dynamic List Generation

Create a list from data:

```javascript
const data = [
  { id: 1, title: 'Item 1', description: 'First item' },
  { id: 2, title: 'Item 2', description: 'Second item' },
  { id: 3, title: 'Item 3', description: 'Third item' }
];

// Build definitions object
const definitions = {};
data.forEach((item, index) => {
  definitions[`LI_${index + 1}`] = {
    innerHTML: `
      <strong>${item.title}</strong>
      <p>${item.description}</p>
    `,
    dataset: {
      id: item.id
    },
    style: {
      padding: '15px',
      margin: '10px 0',
      background: '#f8f9fa',
      borderLeft: '4px solid #007bff',
      listStyle: 'none'
    }
  };
});

const listItems = createElement.bulk(definitions);

// Create list and append items
const ul = document.createElement('ul');
ul.style.padding = '0';
ul.append(...listItems.all);

document.body.appendChild(ul);
```

---

### Example 5: Modal Dialog

Create a complete modal:

```javascript
const modal = createElement.bulk({
  OVERLAY: {
    className: 'modal-overlay',
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    }
  },
  
  DIALOG: {
    className: 'modal-dialog',
    style: {
      background: 'white',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }
  },
  
  HEADER: {
    innerHTML: '<h2>Modal Title</h2>',
    style: { marginBottom: '20px' }
  },
  
  CONTENT: {
    innerHTML: '<p>This is the modal content.</p>',
    style: { marginBottom: '20px' }
  },
  
  BUTTON_CLOSE: {
    textContent: 'Close',
    style: {
      padding: '10px 20px',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    addEventListener: ['click', () => {
      modal.OVERLAY.remove();
    }]
  }
});

// Assemble modal
modal.DIALOG.append(modal.HEADER, modal.CONTENT, modal.BUTTON_CLOSE);
modal.OVERLAY.appendChild(modal.DIALOG);

// Show modal
document.body.appendChild(modal.OVERLAY);

// Close on overlay click
modal.OVERLAY.addEventListener('click', (e) => {
  if (e.target === modal.OVERLAY) {
    modal.OVERLAY.remove();
  }
});
```

---

### Example 6: Navigation Menu

Create a navigation structure:

```javascript
const nav = createElement.bulk({
  NAV: {
    className: 'navbar',
    style: {
      display: 'flex',
      padding: '15px 30px',
      background: '#333',
      color: 'white'
    }
  },
  
  LOGO: {
    textContent: 'MyApp',
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginRight: 'auto'
    }
  },
  
  UL: {
    style: {
      display: 'flex',
      listStyle: 'none',
      gap: '20px',
      margin: '0',
      padding: '0'
    }
  },
  
  LI_HOME: {
    innerHTML: '<a href="#home">Home</a>',
    style: { color: 'white' }
  },
  
  LI_ABOUT: {
    innerHTML: '<a href="#about">About</a>',
    style: { color: 'white' }
  },
  
  LI_CONTACT: {
    innerHTML: '<a href="#contact">Contact</a>',
    style: { color: 'white' }
  }
});

// Assemble navigation
nav.UL.append(nav.LI_HOME, nav.LI_ABOUT, nav.LI_CONTACT);
nav.NAV.append(nav.LOGO, nav.UL);

document.body.appendChild(nav.NAV);
```

---

## Advanced Techniques

### 1. Conditional Element Creation

Create elements based on conditions:

```javascript
function createDashboard(user) {
  const definitions = {
    HEADER: {
      innerHTML: `<h1>Welcome, ${user.name}</h1>`
    }
  };
  
  // Add admin panel only for admins
  if (user.isAdmin) {
    definitions.ADMIN_PANEL = {
      innerHTML: '<div>Admin Controls</div>',
      style: { padding: '20px', background: '#ff0' }
    };
  }
  
  // Add premium badge for premium users
  if (user.isPremium) {
    definitions.PREMIUM_BADGE = {
      textContent: '⭐ Premium',
      style: { color: 'gold', fontWeight: 'bold' }
    };
  }
  
  return createElement.bulk(definitions);
}

const dashboard = createDashboard({
  name: 'John',
  isAdmin: true,
  isPremium: false
});
```

---

### 2. Template-Based Creation

Use templates for repetitive structures:

```javascript
function createCard(data) {
  return {
    [`CARD_${data.id}`]: {
      className: 'card',
      innerHTML: `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <button>View Details</button>
      `,
      dataset: { id: data.id },
      style: {
        padding: '20px',
        margin: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }
    }
  };
}

const items = [
  { id: 1, title: 'Item 1', description: 'Desc 1' },
  { id: 2, title: 'Item 2', description: 'Desc 2' },
  { id: 3, title: 'Item 3', description: 'Desc 3' }
];

const definitions = items.reduce((acc, item) => {
  return { ...acc, ...createCard(item) };
}, {});

const cards = createElement.bulk(definitions);
```

---

### 3. Nested Component Creation

Create complex nested structures:

```javascript
function createUserProfile(userData) {
  const profile = createElement.bulk({
    CONTAINER: {
      className: 'profile-container',
      style: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        background: 'white',
        borderRadius: '8px'
      }
    },
    
    AVATAR: {
      innerHTML: `<img src="${userData.avatar}" alt="${userData.name}">`,
      style: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        marginBottom: '15px'
      }
    },
    
    NAME: {
      innerHTML: `<h2>${userData.name}</h2>`,
      style: { marginBottom: '10px' }
    },
    
    BIO: {
      textContent: userData.bio,
      style: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '15px'
      }
    },
    
    STATS: {
      className: 'stats',
      style: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center'
      }
    }
  });
  
  // Create stats separately
  const stats = createElement.bulk({
    FOLLOWERS: {
      innerHTML: `<strong>${userData.followers}</strong><br>Followers`
    },
    FOLLOWING: {
      innerHTML: `<strong>${userData.following}</strong><br>Following`
    },
    POSTS: {
      innerHTML: `<strong>${userData.posts}</strong><br>Posts`
    }
  });
  
  // Assemble
  profile.STATS.append(...stats.all);
  profile.CONTAINER.append(
    profile.AVATAR,
    profile.NAME,
    profile.BIO,
    profile.STATS
  );
  
  return profile.CONTAINER;
}

const userProfile = createUserProfile({
  name: 'Jane Doe',
  avatar: 'avatar.jpg',
  bio: 'Web developer and designer',
  followers: 1234,
  following: 567,
  posts: 89
});

document.body.appendChild(userProfile);
```

---

### 4. Event-Driven Updates

Use `.updateMultiple()` for dynamic updates:

```javascript
const elements = createElement.bulk({
  STATUS: {
    textContent: 'Idle',
    style: { padding: '10px', background: '#f0f0f0' }
  },
  PROGRESS: {
    textContent: '0%',
    style: { padding: '10px', background: '#e0e0e0' }
  },
  BUTTON: {
    textContent: 'Start Process',
    addEventListener: ['click', startProcess]
  }
});

function startProcess() {
  let progress = 0;
  
  elements.updateMultiple({
    STATUS: { 
      textContent: 'Processing...', 
      style: { background: '#fff3cd' } 
    },
    BUTTON: { disabled: true }
  });
  
  const interval = setInterval(() => {
    progress += 10;
    elements.PROGRESS.textContent = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      elements.updateMultiple({
        STATUS: { 
          textContent: 'Complete!', 
          style: { background: '#d4edda' } 
        },
        BUTTON: { disabled: false, textContent: 'Start Again' }
      });
    }
  }, 500);
}

document.body.append(...elements.all);
```

---

## Best Practices

### 1. Use Meaningful Keys

Choose descriptive keys that make your code self-documenting:

```javascript
// ❌ Bad - unclear keys
const elements = createElement.bulk({
  D1: {},
  D2: {},
  D3: {}
});

// ✅ Good - clear, meaningful keys
const elements = createElement.bulk({
  HEADER: {},
  MAIN_CONTENT: {},
  SIDEBAR: {}
});
```

---

### 2. Group Related Elements

Keep related elements together in your definitions:

```javascript
const page = createElement.bulk({
  // Header section
  HEADER: {},
  NAV: {},
  LOGO: {},
  
  // Main content
  MAIN: {},
  ARTICLE: {},
  ASIDE: {},
  
  // Footer
  FOOTER: {},
  COPYRIGHT: {}
});
```

---

### 3. Use Numbered Instances for Lists

When creating multiple similar elements, use numbered suffixes:

```javascript
const tabs = createElement.bulk({
  TAB_1: { textContent: 'Home' },
  TAB_2: { textContent: 'About' },
  TAB_3: { textContent: 'Contact' },
  TAB_4: { textContent: 'Services' }
});
```

---

### 4. Keep Configuration Objects Clean

Break complex configurations into smaller chunks:

```javascript
// ❌ Bad - hard to read
const elements = createElement.bulk({
  DIV: {
    style: { display: 'flex', flexDirection: 'column', padding: '20px', margin: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '16px', color: '#333' }
  }
});

// ✅ Good - organized and readable
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  margin: '10px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontSize: '16px',
  color: '#333'
};

const elements = createElement.bulk({
  DIV: { style: containerStyle }
});
```

---

### 5. Cache Frequently Used Elements

Store references to frequently accessed elements:

```javascript
const ui = createElement.bulk({
  STATUS: {},
  COUNTER: {},
  BUTTON: {}
});

// Cache references
const status = ui.STATUS;
const counter = ui.COUNTER;

// Use cached references
setInterval(() => {
  counter.textContent = parseInt(counter.textContent || 0) + 1;
}, 1000);
```

---

### 6. Use Helper Functions for Complex Logic

Extract complex element creation into reusable functions:

```javascript
function createInputGroup(label, id, type = 'text') {
  return {
    [`LABEL_${id.toUpperCase()}`]: {
      textContent: label,
      setAttribute: { for: id },
      style: { display: 'block', marginBottom: '5px' }
    },
    [`INPUT_${id.toUpperCase()}`]: {
      id,
      type,
      style: {
        display: 'block',
        padding: '8px',
        marginBottom: '15px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }
    }
  };
}

// Use the helper
const formElements = createElement.bulk({
  ...createInputGroup('Name', 'name'),
  ...createInputGroup('Email', 'email', 'email'),
  ...createInputGroup('Phone', 'phone', 'tel')
});
```

---

### 7. Prefer Composition Over Monolithic Creation

Break large structures into smaller, manageable pieces:

```javascript
// Create header separately
const header = createElement.bulk({
  HEADER: {},
  LOGO: {},
  NAV: {}
});

// Create main content separately
const content = createElement.bulk({
  MAIN: {},
  ARTICLE: {},
  SIDEBAR: {}
});

// Create footer separately
const footer = createElement.bulk({
  FOOTER: {},
  COPYRIGHT: {}
});

// Assemble
document.body.append(
  header.HEADER,
  content.MAIN,
  footer.FOOTER
);
```

---

### 8. Document Complex Structures

Add comments to explain complex element hierarchies:

```javascript
const dashboard = createElement.bulk({
  // Main container
  CONTAINER: {
    className: 'dashboard-container',
    style: { display: 'grid', gridTemplateColumns: '1fr 3fr' }
  },
  
  // Sidebar navigation
  SIDEBAR: {
    className: 'sidebar',
    style: { padding: '20px', background: '#f8f9fa' }
  },
  
  // Main content area
  CONTENT: {
    className: 'main-content',
    style: { padding: '20px' }
  },
  
  // Statistics cards (3 cards)
  STAT_CARD_1: { /* Users */ },
  STAT_CARD_2: { /* Revenue */ },
  STAT_CARD_3: { /* Orders */ }
});
```

---

### 9. Use Consistent Naming Conventions

Establish and follow naming patterns:

```javascript
// Convention: ELEMENT_TYPE_DESCRIPTOR
const elements = createElement.bulk({
  BUTTON_PRIMARY: {},
  BUTTON_SECONDARY: {},
  INPUT_EMAIL: {},
  INPUT_PASSWORD: {},
  LABEL_EMAIL: {},
  LABEL_PASSWORD: {}
});
```

---

### 10. Validate Data Before Creation

Ensure data is valid before creating elements:

```javascript
function createProductCard(product) {
  // Validate data
  if (!product || !product.id || !product.name) {
    console.warn('Invalid product data');
    return null;
  }
  
  return createElement.bulk({
    CARD: {
      innerHTML: `
        <h3>${product.name}</h3>
        <p>${product.description || 'No description'}</p>
        <span>$${product.price.toFixed(2)}</span>
      `,
      dataset: { productId: product.id }
    }
  });
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Elements Not Appearing in DOM

**Problem:** Created elements don't show up on the page.

**Solution:** Make sure to append elements to the DOM:

```javascript
const elements = createElement.bulk({ DIV: {} });

// ❌ Elements created but not appended
// Nothing will appear

// ✅ Append to DOM
document.body.appendChild(elements.DIV);
// OR
document.body.append(...elements.all);
```

---

#### Issue 2: Cannot Access Element Properties

**Problem:** Getting `undefined` when accessing element keys.

**Solution:** Check that the key matches exactly (case-sensitive):

```javascript
const elements = createElement.bulk({
  DIV: {},
  MyButton: {}
});

console.log(elements.DIV);      // ✅ Works
console.log(elements.div);      // ❌ undefined (wrong case)
console.log(elements.MyButton); // ✅ Works
console.log(elements.MYBUTTON); // ❌ undefined (wrong case)
```

---

#### Issue 3: Styles Not Applied

**Problem:** Style properties don't seem to work.

**Solution:** Check style property names (use camelCase):

```javascript
// ❌ Wrong - using CSS property names
createElement.bulk({
  DIV: {
    style: {
      'background-color': 'red',  // Won't work
      'font-size': '16px'         // Won't work
    }
  }
});

// ✅ Correct - using JavaScript property names
createElement.bulk({
  DIV: {
    style: {
      backgroundColor: 'red',  // Works
      fontSize: '16px'         // Works
    }
  }
});
```

---

#### Issue 4: Event Listeners Not Working

**Problem:** Event listeners don't fire.

**Solution:** Check event listener syntax:

```javascript
// ❌ Wrong syntax
createElement.bulk({
  BUTTON: {
    addEventListener: () => console.log('clicked')  // Wrong!
  }
});

// ✅ Correct syntax (array format)
createElement.bulk({
  BUTTON: {
    addEventListener: ['click', () => console.log('clicked')]
  }
});

// ✅ Also correct (object format for multiple events)
createElement.bulk({
  BUTTON: {
    addEventListener: {
      click: () => console.log('clicked'),
      mouseenter: () => console.log('hover')
    }
  }
});
```

---

#### Issue 5: Classes Not Added

**Problem:** Classes aren't being added to elements.

**Solution:** Use correct classList syntax:

```javascript
// ❌ Wrong
createElement.bulk({
  DIV: {
    classList: 'active highlight'  // Wrong!
  }
});

// ✅ Correct - use add method
createElement.bulk({
  DIV: {
    classList: {
      add: ['active', 'highlight']
    }
  }
});

// ✅ Or use className for initial classes
createElement.bulk({
  DIV: {
    className: 'active highlight'
  }
});
```

---

#### Issue 6: Numbered Elements Not Creating Properly

**Problem:** Elements with numbers aren't created correctly.

**Solution:** Use underscore before numbers:

```javascript
// ❌ Wrong - won't parse correctly
createElement.bulk({
  DIV1: {},   // May not work as expected
  DIV2: {}
});

// ✅ Correct - use underscore
createElement.bulk({
  DIV_1: {},  // Creates <div>
  DIV_2: {}   // Creates <div>
});
```

---

#### Issue 7: Cannot Update Elements After Creation

**Problem:** Trying to update elements but changes don't apply.

**Solution:** Use the `.update()` method or direct property access:

```javascript
const elements = createElement.bulk({
  DIV: {}
});

// ✅ Using update method
elements.DIV.update({
  textContent: 'Updated!',
  style: { color: 'red' }
});

// ✅ Direct property access
elements.DIV.textContent = 'Updated!';
elements.DIV.style.color = 'red';

// ✅ Using updateMultiple for batch updates
elements.updateMultiple({
  DIV: {
    textContent: 'Updated!',
    style: { color: 'red' }
  }
});
```

---

#### Issue 8: Elements Not in Expected Order

**Problem:** Elements appear in wrong order when appended.

**Solution:** Use `.ordered()` to specify custom order:

```javascript
const elements = createElement.bulk({
  P: {},
  H1: {},
  DIV: {}
});

// ❌ Default order (creation order)
container.append(...elements.all);  // [P, H1, DIV]

// ✅ Custom order
container.append(...elements.ordered('H1', 'P', 'DIV'));  // [H1, P, DIV]
```

---

#### Issue 9: Memory Leaks with Event Listeners

**Problem:** Event listeners causing memory leaks.

**Solution:** Remove event listeners when elements are removed:

```javascript
const elements = createElement.bulk({
  BUTTON: {
    addEventListener: ['click', handleClick]
  }
});

// When removing the element
function cleanup() {
  elements.BUTTON.removeEventListener('click', handleClick);
  elements.BUTTON.remove();
}

// Or use once option for one-time listeners
createElement.bulk({
  BUTTON: {
    addEventListener: ['click', handleClick, { once: true }]
  }
});
```

---

#### Issue 10: Performance Issues with Large Bulk Creations

**Problem:** Creating hundreds of elements at once is slow.

**Solution:** Create elements in batches or use document fragments:

```javascript
// For very large lists, create in batches
function createElementsInBatches(data, batchSize = 50) {
  const batches = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const definitions = {};
    
    batch.forEach((item, index) => {
      definitions[`ITEM_${i + index}`] = {
        textContent: item.text,
        dataset: { id: item.id }
      };
    });
    
    batches.push(createElement.bulk(definitions));
  }
  
  return batches;
}

// Use RequestAnimationFrame for smooth rendering
const batches = createElementsInBatches(largeDataArray);
let currentBatch = 0;

function renderNextBatch() {
  if (currentBatch < batches.length) {
    container.append(...batches[currentBatch].all);
    currentBatch++;
    requestAnimationFrame(renderNextBatch);
  }
}

renderNextBatch();
```

---

## Additional Resources

### Related Documentation

- [DOM Helpers Main Documentation](./README.md)
- [API Reference](./API-REFERENCE.md)
- [Quick Start Guide](./QUICK-START-GUIDE.md)
- [Update Utility Guide](./BULK-UPDATE-GUIDE.md)

### Examples

- [Test File](../examples/test/bulk-element-creation-test.html) - Interactive examples
- [Component Library](../examples/test/components-test.html) - Real-world components

### Support

For issues, questions, or contributions:
- GitHub Issues: [Report a Bug](https://github.com/giovanni1707/dom-helpers-js/issues)
- Discussions: [Ask Questions](https://github.com/giovanni1707/dom-helpers-js/discussions)

---

## Changelog

### Version 2.2.1
- ✅ Initial release of bulk element creation feature
- ✅ Support for numbered instances (e.g., `DIV_1`, `DIV_2`)
- ✅ Rich API with helper methods
- ✅ Integration with existing `.update()` method
- ✅ Comprehensive documentation and examples

---

## License

MIT License - See LICENSE file for details

---
