[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Reactive - Complete Guide

**Version 2.0.2** | **Production-Ready** | **MIT License**

A powerful, lightweight reactive state management library that brings Vue.js and React-like reactivity to vanilla JavaScript. Built with JavaScript Proxies for automatic dependency tracking and seamless DOM updates.

---

## 📚 Table of Contents

1. [What is DOM Helpers Reactive?](#what-is-dom-helpers-reactive)
2. [Why Use This Library?](#why-use-this-library)
3. [Quick Start](#quick-start)
4. [Installation](#installation)
5. [Core Concepts](#core-concepts)
6. [Basic Usage](#basic-usage)
7. [Advanced Features](#advanced-features)
8. [Real-World Examples](#real-world-examples)
9. [Best Practices](#best-practices)
10. [Performance Tips](#performance-tips)
11. [API Reference](#api-reference)
12. [Troubleshooting](#troubleshooting)

---

## What is DOM Helpers Reactive?

DOM Helpers Reactive is a state management library that makes your data "reactive" - when you change the data, the UI automatically updates. No manual DOM manipulation needed!

### Think of it like this:

```javascript
// ❌ Traditional way - Manual DOM updates
let count = 0;
function updateUI() {
  document.getElementById('counter').textContent = count;
}
function increment() {
  count++;
  updateUI(); // Don't forget this!
}

// ✅ Reactive way - Automatic updates
const state = Elements.state({ count: 0 });
Elements.bindings({
  '#counter': () => state.count
});
function increment() {
  state.count++; // UI updates automatically!
}
```

---

## Why Use This Library?

### 🎯 For Beginners

- **No Build Tools Required** - Works directly in the browser
- **Simple API** - If you know JavaScript objects, you're ready to go
- **Clear Mental Model** - Change data → UI updates. That's it!
- **Great Learning Tool** - Understand reactivity before diving into big frameworks

### 🚀 For Experienced Developers

- **Lightweight** - Only ~4KB minified + gzipped
- **Framework-Agnostic** - Use alongside React, Vue, or any framework
- **Production-Ready** - Battle-tested with comprehensive test coverage
- **TypeScript-Friendly** - Clear interfaces and predictable behavior
- **Zero Dependencies** - No bloat, just pure reactive power

### 💼 Perfect For

- Interactive forms with validation
- Real-time dashboards
- Todo apps and task managers
- Shopping carts
- Single-page applications
- Progressive enhancement of existing sites

---

## Quick Start

### 30-Second Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My First Reactive App</title>
</head>
<body>
  <h1 id="greeting"></h1>
  <input id="nameInput" type="text" placeholder="Enter your name">
  
  <!-- Load DOM Helpers Core -->
  <script src="dom-helpers.js"></script>
  <!-- Load Reactive Extension -->
  <script src="dom-helpers-reactive.js"></script>
  
  <script>
    // Create reactive state
    const state = Elements.state({
      name: 'World'
    });
    
    // Bind to DOM - updates automatically!
    Elements.bindings({
      '#greeting': () => `Hello, ${state.name}!`
    });
    
    // Connect input
    document.getElementById('nameInput').addEventListener('input', (e) => {
      state.name = e.target.value || 'World';
    });
  </script>
</body>
</html>
```

That's it! Type in the input and watch the greeting update automatically. 🎉

---

## Installation

### Option 1: CDN (Easiest for Beginners)

```html
<!-- Load DOM Helpers Core first -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js/dist/dom-helpers.min.js"></script>

<!-- Then load Reactive Extension -->
<script src="https://cdn.jsdelivr.net/npm/dom-helpers-js/dist/dom-helpers-reactive.min.js"></script>
```

### Option 2: NPM (For Build Tools)

```bash
npm install dom-helpers-js
```

```javascript
// ES6 Modules
import { Elements } from 'dom-helpers-js';
import 'dom-helpers-js/reactive';

// CommonJS
const { Elements } = require('dom-helpers-js');
require('dom-helpers-js/reactive');
```

### Option 3: Download and Host Yourself

1. Download from [GitHub releases](https://github.com/dom-helpers-js/releases)
2. Include in your HTML:

```html
<script src="js/dom-helpers.js"></script>
<script src="js/dom-helpers-reactive.js"></script>
```

---

## Core Concepts

### 1. Reactive State

When you create a state object, it becomes "reactive" - the library watches for changes:

```javascript
const state = Elements.state({
  count: 0,
  user: {
    name: 'John',
    age: 30
  }
});

// Changing any property triggers updates
state.count = 10;           // ✅ Reactive
state.user.name = 'Jane';   // ✅ Reactive (deep reactivity)
state.user.age++;           // ✅ Reactive
```

### 2. Bindings (Connecting State to DOM)

Bindings tell the library "when this state changes, update this element":

```javascript
Elements.bindings({
  '#counter': () => state.count,          // Updates element's text
  '#username': { 
    value: () => state.user.name          // Updates input value
  }
});
```

### 3. Computed Properties

Computed properties are values derived from other values, automatically recalculated when dependencies change:

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
Elements.computed(state, {
  fullName: () => `${state.firstName} ${state.lastName}`
});

console.log(state.fullName); // "John Doe"
state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe" - automatically updated!
```

### 4. Watchers

Watchers let you run code when specific state changes:

```javascript
Elements.watch(state, {
  count: (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  }
});

state.count = 10; // Logs: "Count changed from 0 to 10"
```

---

## Basic Usage

### Example 1: Simple Counter

```html
<div id="app">
  <h2 id="count"></h2>
  <button onclick="counter.increment()">+</button>
  <button onclick="counter.decrement()">-</button>
  <button onclick="counter.reset()">Reset</button>
</div>

<script>
const counter = Elements.component({
  state: {
    count: 0
  },
  
  computed: {
    doubled: () => counter.count * 2
  },
  
  bindings: {
    '#count': () => `Count: ${counter.count} (Doubled: ${counter.doubled})`
  },
  
  actions: {
    increment(state) { state.count++; },
    decrement(state) { state.count--; },
    reset(state) { state.count = 0; }
  }
});
</script>
```

### Example 2: Todo List

```html
<div id="todo-app">
  <input id="newTodo" type="text" placeholder="What needs to be done?">
  <button onclick="todos.add()">Add</button>
  
  <ul id="todoList"></ul>
  
  <p id="stats"></p>
</div>

<script>
const todos = Elements.component({
  state: {
    items: [],
    newTodo: ''
  },
  
  computed: {
    remaining: () => todos.items.filter(t => !t.done).length,
    total: () => todos.items.length
  },
  
  bindings: {
    '#todoList': {
      innerHTML: () => todos.items.map((item, index) => `
        <li>
          <input type="checkbox" 
                 ${item.done ? 'checked' : ''} 
                 onchange="todos.toggle(${index})">
          <span style="${item.done ? 'text-decoration: line-through' : ''}">
            ${item.text}
          </span>
          <button onclick="todos.remove(${index})">×</button>
        </li>
      `).join('')
    },
    '#stats': () => `${todos.remaining} of ${todos.total} remaining`
  },
  
  actions: {
    add(state) {
      const input = document.getElementById('newTodo');
      if (input.value.trim()) {
        state.items.push({
          text: input.value.trim(),
          done: false
        });
        input.value = '';
      }
    },
    
    toggle(state, index) {
      state.items[index].done = !state.items[index].done;
    },
    
    remove(state, index) {
      state.items.splice(index, 1);
    }
  }
});
</script>
```

### Example 3: Form with Validation

```html
<form id="signup-form" onsubmit="return handleSubmit(event)">
  <div>
    <input id="email" type="email" placeholder="Email">
    <span id="email-error" style="color: red;"></span>
  </div>
  
  <div>
    <input id="password" type="password" placeholder="Password">
    <span id="password-error" style="color: red;"></span>
  </div>
  
  <button id="submit-btn">Sign Up</button>
</form>

<script>
const form = ReactiveState.form({
  email: '',
  password: ''
});

// Bind form fields
document.getElementById('email').addEventListener('input', (e) => {
  form.$setValue('email', e.target.value);
  
  // Validate email
  if (!e.target.value.includes('@')) {
    form.$setError('email', 'Please enter a valid email');
  } else {
    form.$setError('email', null);
  }
});

document.getElementById('password').addEventListener('input', (e) => {
  form.$setValue('password', e.target.value);
  
  // Validate password
  if (e.target.value.length < 8) {
    form.$setError('password', 'Password must be at least 8 characters');
  } else {
    form.$setError('password', null);
  }
});

// Bind error messages and button state
Elements.bindings({
  '#email-error': () => form.errors.email || '',
  '#password-error': () => form.errors.password || '',
  '#submit-btn': {
    disabled: () => !form.isValid
  }
});

function handleSubmit(event) {
  event.preventDefault();
  if (form.isValid) {
    console.log('Form submitted:', form.values);
    alert('Sign up successful!');
    form.$reset();
  }
}
</script>
```

---

## Advanced Features

### 1. Batch Updates (Performance Optimization)

When making multiple state changes, batch them to trigger only one UI update:

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  city: 'New York'
});

// ❌ Without batching - 4 separate updates
state.firstName = 'Jane';
state.lastName = 'Smith';
state.age = 25;
state.city = 'Los Angeles';

// ✅ With batching - only 1 update
Elements.batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
  state.age = 25;
  state.city = 'Los Angeles';
});
```

### 2. Effects (Side Effects)

Effects are functions that run automatically when their dependencies change:

```javascript
const state = Elements.state({
  theme: 'light',
  fontSize: 16
});

// Effect runs automatically when theme or fontSize changes
Elements.effect(() => {
  document.body.className = `theme-${state.theme}`;
  document.body.style.fontSize = `${state.fontSize}px`;
  
  // Save to localStorage
  localStorage.setItem('userPreferences', JSON.stringify({
    theme: state.theme,
    fontSize: state.fontSize
  }));
});

state.theme = 'dark'; // Effect runs automatically
```

### 3. Refs (Simple Reactive Values)

Refs are perfect for single values:

```javascript
const count = Elements.ref(0);
const message = Elements.ref('Hello');

Elements.bindings({
  '#count': () => count.value,
  '#message': () => message.value
});

count.value++;
message.value = 'Updated!';
```

### 4. Stores (Vuex-like State Management)

For larger applications, use stores with actions and getters:

```javascript
const userStore = Elements.store(
  // Initial state
  {
    user: null,
    isLoading: false,
    error: null
  },
  
  // Options
  {
    getters: {
      isLoggedIn: function() {
        return this.user !== null;
      },
      userName: function() {
        return this.user?.name || 'Guest';
      }
    },
    
    actions: {
      async login(store, credentials) {
        store.isLoading = true;
        store.error = null;
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          
          if (!response.ok) throw new Error('Login failed');
          
          store.user = await response.json();
        } catch (error) {
          store.error = error.message;
        } finally {
          store.isLoading = false;
        }
      },
      
      logout(store) {
        store.user = null;
      }
    }
  }
);

// Use the store
await userStore.login({ email: 'user@example.com', password: 'pass123' });
console.log(userStore.isLoggedIn); // true
console.log(userStore.userName); // "John Doe"
```

### 5. Collections Helper

For managing arrays/lists:

```javascript
const myList = Elements.list([
  { id: 1, text: 'Item 1', done: false },
  { id: 2, text: 'Item 2', done: true }
]);

// Add item
myList.$add({ id: 3, text: 'Item 3', done: false });

// Remove item
myList.$remove(item => item.id === 2);

// Update item
myList.$update(
  item => item.id === 1,
  { text: 'Updated Item 1' }
);

// Clear all
myList.$clear();

// Access items
console.log(myList.items);
```

---

## Real-World Examples

### Shopping Cart

```javascript
const cart = Elements.store(
  {
    items: [],
    taxRate: 0.08,
    shippingCost: 10
  },
  {
    getters: {
      subtotal: function() {
        return this.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
      },
      
      tax: function() {
        return this.subtotal * this.taxRate;
      },
      
      total: function() {
        return this.subtotal + this.tax + this.shippingCost;
      },
      
      itemCount: function() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    
    actions: {
      addItem(store, product) {
        const existing = store.items.find(item => item.id === product.id);
        
        if (existing) {
          existing.quantity++;
        } else {
          store.items.push({ ...product, quantity: 1 });
        }
      },
      
      removeItem(store, productId) {
        store.items = store.items.filter(item => item.id !== productId);
      },
      
      updateQuantity(store, productId, quantity) {
        const item = store.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
    }
  }
);

// Bind to UI
Elements.bindings({
  '#cart-items': {
    innerHTML: () => cart.items.map(item => `
      <div class="cart-item">
        <span>${item.name}</span>
        <input type="number" value="${item.quantity}" 
               min="1"
               onchange="cart.updateQuantity(${item.id}, +this.value)">
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button onclick="cart.removeItem(${item.id})">Remove</button>
      </div>
    `).join('')
  },
  
  '#subtotal': () => `$${cart.subtotal.toFixed(2)}`,
  '#tax': () => `$${cart.tax.toFixed(2)}`,
  '#total': () => `$${cart.total.toFixed(2)}`,
  '#item-count': () => cart.itemCount
});
```

### User Dashboard with Async Data

```javascript
const dashboard = Elements.component({
  state: {
    user: null,
    stats: null,
    loading: true,
    error: null
  },
  
  computed: {
    userName: () => dashboard.user?.name || 'Guest',
    isLoggedIn: () => dashboard.user !== null
  },
  
  bindings: {
    '#username': () => dashboard.userName,
    '#user-avatar': { 
      src: () => dashboard.user?.avatar || '/default-avatar.png' 
    },
    '#loading-spinner': {
      style: () => ({ 
        display: dashboard.loading ? 'block' : 'none' 
      })
    },
    '#error-message': {
      textContent: () => dashboard.error || '',
      style: () => ({ 
        display: dashboard.error ? 'block' : 'none' 
      })
    }
  },
  
  actions: {
    async loadUser(state) {
      state.loading = true;
      state.error = null;
      
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to load user');
        
        state.user = await response.json();
        await this.loadStats(state);
      } catch (error) {
        state.error = error.message;
      } finally {
        state.loading = false;
      }
    },
    
    async loadStats(state) {
      const response = await fetch('/api/stats');
      state.stats = await response.json();
    }
  },
  
  mounted() {
    this.loadUser();
  }
});
```

---

## Best Practices

### 1. Keep State Simple

```javascript
// ✅ Good - Flat structure
const state = Elements.state({
  count: 0,
  message: 'Hello'
});

// ⚠️ Okay - Shallow nesting
const state = Elements.state({
  user: {
    name: 'John',
    email: 'john@example.com'
  }
});

// ❌ Avoid - Deep nesting makes debugging harder
const state = Elements.state({
  app: {
    module: {
      subModule: {
        feature: {
          setting: 'value'
        }
      }
    }
  }
});
```

### 2. Use Computed for Derived Values

```javascript
// ❌ Don't recalculate in bindings
Elements.bindings({
  '#total': () => {
    return state.items.reduce((sum, item) => sum + item.price, 0);
  }
});

// ✅ Use computed properties
Elements.computed(state, {
  total: () => state.items.reduce((sum, item) => sum + item.price, 0)
});

Elements.bindings({
  '#total': () => state.total
});
```

### 3. Batch Related Updates

```javascript
// ❌ Multiple separate updates
function updateUser(userData) {
  state.user.name = userData.name;
  state.user.email = userData.email;
  state.user.age = userData.age;
}

// ✅ Batch updates
function updateUser(userData) {
  Elements.batch(() => {
    state.user.name = userData.name;
    state.user.email = userData.email;
    state.user.age = userData.age;
  });
}
```

### 4. Clean Up When Done

```javascript
// ✅ Store cleanup function
const cleanup = Elements.bindings({
  '#element': () => state.value
});

// Later, when component is destroyed
cleanup();
```

### 5. Use Components for Organization

```javascript
// ✅ Well-organized component
const myFeature = Elements.component({
  state: { /* state */ },
  computed: { /* computed */ },
  bindings: { /* bindings */ },
  actions: { /* actions */ },
  mounted() { /* initialization */ },
  unmounted() { /* cleanup */ }
});
```

---

## Performance Tips

### 1. Batch Bulk Operations

```javascript
// ❌ Slow - 1000 updates
for (let i = 0; i < 1000; i++) {
  state.items.push(i);
}

// ✅ Fast - 1 update
Elements.batch(() => {
  for (let i = 0; i < 1000; i++) {
    state.items.push(i);
  }
});
```

### 2. Use Pause/Resume for Large Changes

```javascript
// Pause reactivity
Elements.pause();

// Make many changes
state.items = largeDataset;
state.filters = newFilters;
state.sorting = newSorting;

// Resume and apply all changes at once
Elements.resume(true);
```

### 3. Untrack Non-Essential Reads

```javascript
Elements.effect(() => {
  // This will trigger re-run when count changes
  console.log('Count:', state.count);
  
  // This won't trigger re-run (useful for debugging)
  const debugInfo = Elements.untrack(() => state.debugData);
  console.log('Debug:', debugInfo);
});
```

### 4. Avoid Deep Nesting in Bindings

```javascript
// ❌ Slow - Deep access in binding
Elements.bindings({
  '#element': () => state.app.module.feature.data.value
});

// ✅ Fast - Use computed
Elements.computed(state, {
  featureValue: () => state.app.module.feature.data.value
});

Elements.bindings({
  '#element': () => state.featureValue
});
```

---

## API Reference

For detailed API documentation, see [Reactive-Methods.md](./Reactive-Methods.md)

### Quick Reference

**Creating Reactive State:**
- `Elements.state(obj)` - Create reactive state
- `Elements.ref(value)` - Create reactive ref
- `ReactiveState.form(values)` - Create form state
- `ReactiveState.async(value)` - Create async state
- `Elements.list(items)` - Create reactive list

**Computed & Watchers:**
- `Elements.computed(state, defs)` - Add computed properties
- `Elements.watch(state, defs)` - Watch state changes
- `Elements.effect(fn)` - Create reactive effect

**DOM Bindings:**
- `Elements.bindings(defs)` - Declarative bindings
- `Elements.bind(defs)` - Bind by ID
- `Collections.bind(defs)` - Bind by class
- `Selector.query.bind(defs)` - Bind by selector

**Advanced:**
- `Elements.component(config)` - Create component
- `Elements.store(state, options)` - Create store
- `Elements.reactive(state)` - Fluent builder

**Utilities:**
- `Elements.batch(fn)` - Batch updates
- `Elements.pause()` / `Elements.resume()` - Pause/resume
- `Elements.untrack(fn)` - Untracked reads
- `Elements.isReactive(value)` - Check if reactive
- `Elements.toRaw(value)` - Get raw value

---

## Troubleshooting

### Issue: Bindings Not Updating

**Problem:** Changed state but UI didn't update

**Solutions:**

1. Make sure you're modifying the reactive state:
```javascript
// ❌ Wrong - Modifying raw object
const raw = Elements.toRaw(state);
raw.count = 10; // Won't trigger updates

// ✅ Correct - Modifying reactive state
state.count = 10; // Triggers updates
```

2. Check if element exists in DOM:
```javascript
// Make sure element exists when creating bindings
Elements.bindings({
  '#myElement': () => state.value
});
```

### Issue: Infinite Loop / Browser Freeze

**Problem:** Browser becomes unresponsive

**Solutions:**

1. Don't modify state inside computed properties:
```javascript
// ❌ Wrong - Modifying in computed
Elements.computed(state, {
  bad: () => {
    state.count++; // Causes infinite loop!
    return state.count;
  }
});

// ✅ Correct - Only read in computed
Elements.computed(state, {
  good: () => state.count * 2
});
```

2. Avoid circular dependencies:
```javascript
// ❌ Wrong - Circular dependency
Elements.computed(state, {
  a: () => state.b + 1,
  b: () => state.a + 1 // Circular!
});
```

### Issue: Performance Problems

**Problem:** App feels slow with many updates

**Solutions:**

1. Use batch updates:
```javascript
Elements.batch(() => {
  // All state changes here
});
```

2. Use computed properties to avoid recalculations
3. Pause/resume for bulk operations

---

## Next Steps

- 📖 Read [Reactive-Methods.md](./Reactive-Methods.md) for detailed API documentation
- 🎯 Try the [examples](../examples/) folder for more code samples
- 💬 Join our [community discussions](https://github.com/dom-helpers-js/discussions)
- 🐛 Report issues on [GitHub](https://github.com/dom-helpers-js/issues)

---

## Support

- **Documentation:** [Full Docs](https://docs.example.com)
- **GitHub:** [Repository](https://github.com/dom-helpers-js)
- **Issues:** [Bug Reports](https://github.com/dom-helpers-js/issues)
- **Discussions:** [Community](https://github.com/dom-helpers-js/discussions)

---

**Happy Coding! 🚀**

*Made with ❤️ by the DOM Helpers Team*
