# Global Objects - Complete Guide

## Overview

The reactive library exposes several global objects and functions that provide convenient entry points for creating reactive state and accessing the full API. These globals serve as the primary interface for initializing reactive functionality in your application.

---

## Table of Contents

1. [Global Objects Overview](#global-objects-overview)
2. [ReactiveState Object](#reactivestate-object)
3. [ReactiveUtils Object](#reactiveutils-object)
4. [Global Functions](#global-functions)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [API Quick Reference](#api-quick-reference)

---

## Global Objects Overview

### Available Globals

The reactive library provides two main global objects and one global function:

1. **`ReactiveState`** - Factory object for creating different types of reactive state
2. **`ReactiveUtils`** - Complete API namespace with all reactive methods
3. **`updateAll()`** - Global unified update function

### When to Use Each

```javascript
// Use ReactiveState for quick state creation
const state = ReactiveState.create({ count: 0 });
const form = ReactiveState.form({ email: '', password: '' });
const async = ReactiveState.async(null);
const collection = ReactiveState.collection([]);

// Use ReactiveUtils for full API access
const state = ReactiveUtils.state({ count: 0 });
const computed = ReactiveUtils.computed(state, { ... });
const batch = ReactiveUtils.batch(() => { ... });

// Use updateAll() for unified state + DOM updates
updateAll(state, { count: 10, '#counter': { textContent: '10' } });
```

---

## ReactiveState Object

The `ReactiveState` object provides factory methods for creating specialized reactive state types.

### `ReactiveState.create(initialState)`

Create a basic reactive state object.

**Syntax:**
```javascript
ReactiveState.create(initialState)
```

**Parameters:**
- `initialState` (Object) - Initial state values

**Returns:** Reactive state proxy

**Example:**
```javascript
const counter = ReactiveState.create({
  count: 0,
  step: 1
});

console.log(counter.count); // 0
counter.count++; // Reactive update
console.log(counter.count); // 1
```

**Advanced Example:**
```javascript
const app = ReactiveState.create({
  user: null,
  theme: 'light',
  notifications: [],
  settings: {
    language: 'en',
    timezone: 'UTC'
  }
});

// Add computed properties
app.$computed('isAuthenticated', function() {
  return this.user !== null;
});

// Add watchers
app.$watch('theme', (newTheme) => {
  document.body.dataset.theme = newTheme;
});

// Add bindings
app.$bind({
  '#user-name': () => app.user?.name || 'Guest',
  '.theme-indicator': () => app.theme
});
```

**When to Use:**
- Creating general-purpose reactive state
- Need full instance methods
- Building custom state structures
- Simple state without special behavior

---

### `ReactiveState.form(initialValues)`

Create a reactive form state with built-in validation support.

**Syntax:**
```javascript
ReactiveState.form(initialValues)
```

**Parameters:**
- `initialValues` (Object) - Initial form field values

**Returns:** Reactive form state with specialized methods

**Example:**
```javascript
const loginForm = ReactiveState.form({
  email: '',
  password: ''
});

// Form has built-in properties
console.log(loginForm.values); // { email: '', password: '' }
console.log(loginForm.errors); // {}
console.log(loginForm.touched); // {}
console.log(loginForm.isSubmitting); // false

// Use form methods
loginForm.$setField('email', 'user@example.com');
loginForm.$validate('email', (val) => !val.includes('@') ? 'Invalid email' : null);
loginForm.$submit(async (values) => {
  await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(values)
  });
});
```

**Advanced Example:**
```javascript
const registrationForm = ReactiveState.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Add computed properties
registrationForm.$computed('isValid', function() {
  return Object.keys(this.errors).length === 0;
});

registrationForm.$computed('passwordMatch', function() {
  return this.values.password === this.values.confirmPassword;
});

// Add validation
registrationForm.$addValidation('username', (val) => {
  if (!val) return 'Username is required';
  if (val.length < 3) return 'Username must be at least 3 characters';
  return null;
});

registrationForm.$addValidation('email', (val) => {
  if (!val) return 'Email is required';
  if (!val.includes('@')) return 'Invalid email address';
  return null;
});

registrationForm.$addValidation('password', (val) => {
  if (!val) return 'Password is required';
  if (val.length < 6) return 'Password must be at least 6 characters';
  return null;
});

registrationForm.$addValidation('confirmPassword', (val) => {
  if (!val) return 'Please confirm password';
  if (!registrationForm.passwordMatch) return 'Passwords do not match';
  return null;
});

// Bind to DOM
registrationForm.$bind({
  '#username-error': () => registrationForm.errors.username || '',
  '#email-error': () => registrationForm.errors.email || '',
  '#password-error': () => registrationForm.errors.password || '',
  '#confirm-error': () => registrationForm.errors.confirmPassword || '',
  '#submit-btn': {
    disabled: () => !registrationForm.isValid || registrationForm.isSubmitting
  }
});
```

**When to Use:**
- Building forms with validation
- Need automatic error tracking
- Managing form submission state
- Tracking touched/dirty fields

---

### `ReactiveState.async(initialValue)`

Create a reactive async state for managing asynchronous operations.

**Syntax:**
```javascript
ReactiveState.async(initialValue)
```

**Parameters:**
- `initialValue` (any) - Initial value (usually `null` or `undefined`)

**Returns:** Reactive async state with loading/error tracking

**Example:**
```javascript
const userData = ReactiveState.async(null);

console.log(userData.value); // null
console.log(userData.loading); // false
console.log(userData.error); // null

// Load data
userData.$load(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

// userData.loading becomes true
// On success: userData.value is set, userData.loading becomes false
// On error: userData.error is set, userData.loading becomes false
```

**Advanced Example:**
```javascript
const userProfile = ReactiveState.async(null);

// Add computed properties
userProfile.$computed('isLoaded', function() {
  return this.value !== null && !this.loading;
});

userProfile.$computed('displayName', function() {
  return this.value?.name || 'Loading...';
});

// Watch for changes
userProfile.$watch('value', (newValue) => {
  if (newValue) {
    console.log('User loaded:', newValue.name);
  }
});

// Bind to DOM
userProfile.$bind({
  '#user-name': () => userProfile.displayName,
  '#loading-spinner': {
    style: () => ({
      display: userProfile.loading ? 'block' : 'none'
    })
  },
  '#error-message': () => userProfile.error?.message || ''
});

// Load user data
userProfile.$load(async () => {
  const response = await fetch('/api/profile');
  if (!response.ok) throw new Error('Failed to load profile');
  return response.json();
});

// Reload data
userProfile.$reload();

// Reset state
userProfile.$reset();
```

**When to Use:**
- Fetching data from APIs
- Managing async operations
- Need automatic loading/error states
- Handling retries and reloads

---

### `ReactiveState.collection(items)`

Create a reactive collection for managing lists of items.

**Syntax:**
```javascript
ReactiveState.collection(items)
```

**Parameters:**
- `items` (Array) - Initial array of items

**Returns:** Reactive collection with array methods

**Example:**
```javascript
const todos = ReactiveState.collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: true }
]);

console.log(todos.items); // Array of items
console.log(todos.length); // 2

// Add items
todos.$add({ id: 3, text: 'Task 3', done: false });

// Remove items
todos.$remove(1); // Remove by id

// Update items
todos.$update(2, { done: false });

// Clear all
todos.$clear();
```

**Advanced Example:**
```javascript
const productList = ReactiveState.collection([]);

// Add computed properties
productList.$computed('totalItems', function() {
  return this.items.length;
});

productList.$computed('totalPrice', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});

productList.$computed('categories', function() {
  return [...new Set(this.items.map(item => item.category))];
});

// Watch for changes
productList.$watch('items', (newItems) => {
  localStorage.setItem('products', JSON.stringify(newItems));
});

// Bind to DOM
productList.$bind({
  '#product-list': function() {
    return productList.items.map(product => `
      <div class="product" data-id="${product.id}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
      </div>
    `).join('');
  },
  '#total-items': () => productList.totalItems,
  '#total-price': () => `$${productList.totalPrice.toFixed(2)}`
});

// Collection operations
productList.$add({ id: 1, name: 'Product 1', price: 19.99, category: 'Electronics' });
productList.$add({ id: 2, name: 'Product 2', price: 29.99, category: 'Books' });

// Bulk operations
productList.$addMany([
  { id: 3, name: 'Product 3', price: 39.99, category: 'Electronics' },
  { id: 4, name: 'Product 4', price: 49.99, category: 'Books' }
]);

// Find and update
const product = productList.$find(p => p.id === 2);
if (product) {
  productList.$update(2, { price: 24.99 });
}

// Filter
const electronics = productList.$filter(p => p.category === 'Electronics');
console.log(electronics); // Array of electronics products

// Sort
productList.$sort((a, b) => a.price - b.price);
```

**When to Use:**
- Managing lists of items
- Need collection-specific methods
- Building dynamic lists/grids
- Shopping carts, todo lists, data tables

---

## ReactiveUtils Object

The `ReactiveUtils` object is a namespace containing the complete reactive API. It provides access to all reactive methods in one place.

### Available Methods

```javascript
// State Creation
ReactiveUtils.state(initialState)
ReactiveUtils.createState(initialState, bindingDefs)
ReactiveUtils.ref(value)
ReactiveUtils.refs(defs)
ReactiveUtils.list(items)

// Reactivity
ReactiveUtils.computed(state, defs)
ReactiveUtils.watch(state, defs)
ReactiveUtils.effect(fn)
ReactiveUtils.effects(defs)
ReactiveUtils.bindings(defs)

// Specialized
ReactiveUtils.store(initialState, options)
ReactiveUtils.component(config)
ReactiveUtils.reactive(initialState) // Returns builder

// Batch Operations
ReactiveUtils.batch(fn)
ReactiveUtils.pause()
ReactiveUtils.resume(flush)
ReactiveUtils.untrack(fn)

// Utilities
ReactiveUtils.updateAll(state, updates)
ReactiveUtils.isReactive(value)
ReactiveUtils.toRaw(value)
ReactiveUtils.notify(state, key)
```

### Example Usage

```javascript
// Create state
const app = ReactiveUtils.state({
  count: 0,
  user: null
});

// Add computed
ReactiveUtils.computed(app, {
  double() {
    return this.count * 2;
  }
});

// Add watcher
ReactiveUtils.watch(app, {
  count(val) {
    console.log('Count:', val);
  }
});

// Create effect
ReactiveUtils.effect(() => {
  document.title = `Count: ${app.count}`;
});

// Batch updates
ReactiveUtils.batch(() => {
  app.count = 10;
  app.user = { name: 'John' };
});

// Check if reactive
console.log(ReactiveUtils.isReactive(app)); // true

// Get raw value
const raw = ReactiveUtils.toRaw(app);
console.log(raw); // Plain object
```

### When to Use ReactiveUtils

- ✅ Need explicit namespace for clarity
- ✅ Avoiding global pollution
- ✅ Working with module bundlers
- ✅ TypeScript with better autocomplete
- ✅ Accessing full API in one place

---

## Global Functions

### `updateAll(state, updates)`

Unified function for updating both state properties and DOM elements in a single call.

**Syntax:**
```javascript
updateAll(state, updates)
```

**Parameters:**
- `state` (Object) - Reactive state to update
- `updates` (Object) - Object containing state updates and DOM updates

**Returns:** `undefined`

**Example:**
```javascript
const app = ReactiveState.create({
  count: 0,
  message: 'Hello'
});

// Update state and DOM together
updateAll(app, {
  // State updates
  count: 10,
  message: 'Updated',
  
  // DOM updates (selectors as keys)
  '#counter': { textContent: '10' },
  '#message': { textContent: 'Updated' },
  '.status': { className: 'active' }
});
```

**Advanced Example:**
```javascript
const userApp = ReactiveState.create({
  user: null,
  isAuthenticated: false,
  theme: 'light'
});

async function loginUser(credentials) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  
  if (response.ok) {
    const data = await response.json();
    
    // Update everything at once
    updateAll(userApp, {
      // Update state
      user: data.user,
      isAuthenticated: true,
      theme: data.user.preferences.theme,
      
      // Update DOM elements
      '#user-name': { textContent: data.user.name },
      '#user-email': { textContent: data.user.email },
      '.user-avatar': { src: data.user.avatar },
      '#user-role': { 
        textContent: data.user.role,
        className: `role-badge ${data.user.role}`
      },
      '.auth-status': { 
        textContent: 'Logged In',
        className: 'status online'
      },
      
      // Apply theme
      'body': {
        dataset: { theme: data.user.preferences.theme }
      }
    });
  }
}
```

**Use Cases:**
- Login/logout operations
- Bulk data updates from API
- Theme changes affecting multiple elements
- Complex state transitions

**When to Use:**
- ✅ Updating state and DOM together
- ✅ Avoiding multiple reactive updates
- ✅ Cleaner code for complex updates
- ✅ Performance optimization (single batch)

---

## Usage Examples

### Example 1: Complete Application Setup

```javascript
// Create main app state
const app = ReactiveState.create({
  user: null,
  isAuthenticated: false,
  theme: 'light',
  notifications: []
});

// Add computed properties
app.$computed('userName', function() {
  return this.user?.name || 'Guest';
});

app.$computed('notificationCount', function() {
  return this.notifications.length;
});

// Add watchers
app.$watch('theme', (theme) => {
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});

// Bind to DOM
app.$bind({
  '#user-name': () => app.userName,
  '#notification-count': () => app.notificationCount,
  '.auth-status': {
    textContent: () => app.isAuthenticated ? 'Logged In' : 'Guest',
    className: () => app.isAuthenticated ? 'status online' : 'status offline'
  }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  app.theme = savedTheme;
}

// Check authentication
async function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const user = await response.json();
      updateAll(app, {
        user,
        isAuthenticated: true,
        '#user-avatar': { src: user.avatar }
      });
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

checkAuth();
```

### Example 2: Form with Async Data

```javascript
// Create form
const userForm = ReactiveState.form({
  name: '',
  email: '',
  role: 'user'
});

// Create async state for roles
const roles = ReactiveState.async([]);

// Load roles
roles.$load(async () => {
  const response = await fetch('/api/roles');
  return response.json();
});

// Bind form
userForm.$bind({
  '#name-error': () => userForm.errors.name || '',
  '#email-error': () => userForm.errors.email || '',
  '#submit-btn': {
    disabled: () => !userForm.isValid || userForm.isSubmitting
  }
});

// Bind roles dropdown
roles.$bind({
  '#role-select': function() {
    if (roles.loading) return '<option>Loading...</option>';
    if (roles.error) return '<option>Error loading roles</option>';
    
    return roles.value.map(role => 
      `<option value="${role.id}">${role.name}</option>`
    ).join('');
  }
});

// Add validation
userForm.$addValidation('name', (val) => 
  !val ? 'Name is required' : null
);

userForm.$addValidation('email', (val) => {
  if (!val) return 'Email is required';
  if (!val.includes('@')) return 'Invalid email';
  return null;
});

// Handle submission
userForm.$submit(async (values) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  const user = await response.json();
  return user;
});
```

### Example 3: Product Catalog with Collection

```javascript
// Create product collection
const products = ReactiveState.collection([]);

// Create filters state
const filters = ReactiveState.create({
  category: 'all',
  minPrice: 0,
  maxPrice: 1000,
  searchQuery: ''
});

// Add computed to products
products.$computed('filtered', function() {
  return this.items.filter(product => {
    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return product.name.toLowerCase().includes(query) ||
             product.description.toLowerCase().includes(query);
    }
    
    return true;
  });
});

// Bind to DOM
products.$bind({
  '#product-grid': function() {
    return products.filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">$${product.price.toFixed(2)}</span>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },
  '#product-count': () => `${products.filtered.length} products`
});

filters.$bind({
  '#search-query': {
    value: () => filters.searchQuery
  }
});

// Load products
async function loadProducts() {
  const response = await fetch('/api/products');
  const data = await response.json();
  
  products.$clear();
  products.$addMany(data);
}

loadProducts();

// Handle filter changes
document.getElementById('category-select').addEventListener('change', (e) => {
  filters.category = e.target.value;
});

document.getElementById('search-input').addEventListener('input', (e) => {
  filters.searchQuery = e.target.value;
});

document.getElementById('price-range').addEventListener('change', (e) => {
  updateAll(filters, {
    minPrice: Number(e.target.dataset.min),
    maxPrice: Number(e.target.dataset.max)
  });
});
```

### Example 4: Using ReactiveUtils Namespace

```javascript
// Create states using ReactiveUtils
const app = ReactiveUtils.state({
  theme: 'light',
  fontSize: 16
});

const user = ReactiveUtils.state({
  name: 'John',
  email: 'john@example.com'
});

// Add computed using ReactiveUtils
ReactiveUtils.computed(app, {
  cssVars() {
    return {
      '--theme': this.theme,
      '--font-size': `${this.fontSize}px`
    };
  }
});

// Add watchers using ReactiveUtils
ReactiveUtils.watch(app, {
  theme(theme) {
    document.body.dataset.theme = theme;
  },
  fontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
  }
});

// Create effects using ReactiveUtils
ReactiveUtils.effect(() => {
  console.log('Theme:', app.theme);
  console.log('Font Size:', app.fontSize);
});

// Batch updates using ReactiveUtils
ReactiveUtils.batch(() => {
  app.theme = 'dark';
  app.fontSize = 18;
  user.name = 'Jane';
});

// Check if reactive
console.log(ReactiveUtils.isReactive(app)); // true
console.log(ReactiveUtils.isReactive({})); // false

// Get raw value
const rawApp = ReactiveUtils.toRaw(app);
console.log(rawApp); // Plain object

// Use global updateAll
updateAll(app, {
  theme: 'light',
  fontSize: 16,
  'body': { dataset: { theme: 'light' } }
});
```

---

## Best Practices

### ✅ DO

```javascript
// Use appropriate factory method
const state = ReactiveState.create({ ... });
const form = ReactiveState.form({ ... });
const async = ReactiveState.async(null);
const collection = ReactiveState.collection([]);

// Use ReactiveUtils for clarity
const state = ReactiveUtils.state({ ... });
ReactiveUtils.computed(state, { ... });

// Use updateAll for bulk updates
updateAll(state, {
  count: 10,
  '#counter': { textContent: '10' }
});

// Access full API through namespaces
ReactiveUtils.batch(() => { ... });
ReactiveUtils.isReactive(value);
```

### ❌ DON'T

```javascript
// Don't mix creation methods unnecessarily
const state = ReactiveState.create({ ... });
const same = ReactiveUtils.state({ ... }); // Inconsistent

// Don't use updateAll for simple updates
updateAll(state, { count: 10 }); // Just use state.count = 10

// Don't forget updateAll can update DOM too
state.count = 10;
document.getElementById('counter').textContent = '10';
// Use updateAll instead:
updateAll(state, {
  count: 10,
  '#counter': { textContent: '10' }
});
```

---

## API Quick Reference

### ReactiveState Methods

```javascript
ReactiveState.create(initialState)    // Create basic reactive state
ReactiveState.form(initialValues)     // Create form state
ReactiveState.async(initialValue)     // Create async state
ReactiveState.collection(items)       // Create collection
```

### ReactiveUtils (Complete API)

```javascript
// State Creation
ReactiveUtils.state(initialState)
ReactiveUtils.createState(initialState, bindings)
ReactiveUtils.ref(value)
ReactiveUtils.refs(defs)
ReactiveUtils.list(items)

// Reactivity
ReactiveUtils.computed(state, defs)
ReactiveUtils.watch(state, defs)
ReactiveUtils.effect(fn)
ReactiveUtils.effects(defs)
ReactiveUtils.bindings(defs)

// Specialized
ReactiveUtils.store(initialState, options)
ReactiveUtils.component(config)
ReactiveUtils.reactive(initialState)

// Batch Operations
ReactiveUtils.batch(fn)
ReactiveUtils.pause()
ReactiveUtils.resume(flush)
ReactiveUtils.untrack(fn)

// Utilities
ReactiveUtils.updateAll(state, updates)
ReactiveUtils.isReactive(value)
ReactiveUtils.toRaw(value)
ReactiveUtils.notify(state, key)
```

### Global Functions

```javascript
updateAll(state, updates)  // Unified state + DOM updates
```

---

## Summary

### Global Objects Overview

| Object/Function | Purpose | Common Use |
|-----------------|---------|------------|
| **ReactiveState** | Factory for specialized states | Quick state creation |
| **ReactiveUtils** | Complete API namespace | Full API access |
| **updateAll()** | Unified updates | Bulk state + DOM updates |

### ReactiveState Methods

| Method | Creates | Best For |
|--------|---------|----------|
| `.create()` | Basic reactive state | General state |
| `.form()` | Form state | Forms with validation |
| `.async()` | Async state | API calls, data loading |
| `.collection()` | Collection state | Lists, arrays, grids |

### When to Use Each

```javascript
// Quick specialized state
const form = ReactiveState.form({ email: '', password: '' });

// Full API control
const state = ReactiveUtils.state({ count: 0 });
ReactiveUtils.computed(state, { ... });

// Bulk updates
updateAll(state, {
  count: 10,
  '#counter': { textContent: '10' }
});
```

### Integration with DOM Helpers

When DOM Helpers is integrated, ReactiveUtils methods are also available through:
- `Elements.state()`, `Elements.computed()`, etc.
- `Collections.state()`, `Collections.computed()`, etc.
- `Selector.state()`, `Selector.computed()`, etc.

---
