[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Reactive Module - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Basic Usage](#basic-usage)
5. [Computed Properties](#computed-properties)
6. [Batching Updates](#batching-updates)
7. [Watch API](#watch-api)
8. [Helper Methods](#helper-methods)
9. [Binding to DOM](#binding-to-dom)
10. [Advanced Features](#advanced-features)
11. [Debug Utilities](#debug-utilities)
12. [Best Practices](#best-practices)
13. [API Reference](#api-reference)

---

## Introduction

The **DOM Helpers Reactive Module** is a lightweight, production-ready reactivity system that provides fine-grained state management with automatic DOM updates. It uses JavaScript Proxies to track dependencies and update the DOM efficiently.

### Key Features

- ✨ **Reactive State** - Automatic dependency tracking
- 🧮 **Computed Properties** - Cached derived values
- 📦 **Batching** - Optimize multiple updates
- 👀 **Watch API** - Subscribe to changes
- 🎯 **Fine-grained Updates** - Only update what changed
- 🧹 **Auto Cleanup** - Prevents memory leaks
- 🔧 **Helper Methods** - Collections, Forms, Async states
- 🐛 **Debug Tools** - Inspect reactivity graph
- ⚡ **High Performance** - Minimal overhead

---

## Installation

### Include the Script

```html
<!-- Include core DOM Helpers first -->
<script src="dom-helpers-core.js"></script>

<!-- Then include Reactive module -->
<script src="dom-helpers-reactive.js"></script>
```

### Verify Installation

```javascript
console.log(ReactiveState); // Should output the ReactiveState object
console.log(Elements.state); // Should be a function
```

---

## Core Concepts

### Reactive Proxy

The module wraps your state in a JavaScript Proxy that intercepts property access and modifications.

```javascript
const state = ReactiveState.create({
  count: 0
});

// Behind the scenes: Proxy intercepts this access
console.log(state.count); // 0
```

### Dependency Tracking

When you access properties inside a binding, the reactive system tracks which properties the binding depends on.

```javascript
Elements.bind({
  'display': () => {
    // Accessing state.count creates a dependency
    return state.count;
  }
});

// Now when count changes, the binding automatically re-runs
state.count = 5;
```

### Fine-grained Updates

Only bindings that depend on changed properties are re-executed.

```javascript
const state = ReactiveState.create({
  firstName: 'John',
  lastName: 'Doe'
});

Elements.bind({
  'first': () => state.firstName,
  'last': () => state.lastName
});

// Only updates the 'first' element
state.firstName = 'Jane';
```

---

## Basic Usage

### Creating Reactive State

```javascript
// Simple state
const state = ReactiveState.create({
  count: 0,
  message: 'Hello World'
});

// Nested objects
const user = ReactiveState.create({
  profile: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
});

// Arrays
const todos = ReactiveState.create({
  items: [
    { id: 1, text: 'Learn Reactive', done: false },
    { id: 2, text: 'Build App', done: false }
  ]
});
```

### Reading State

```javascript
const state = ReactiveState.create({
  count: 0,
  user: {
    name: 'John'
  }
});

// Direct access
console.log(state.count); // 0
console.log(state.user.name); // 'John'

// Nested access
const userName = state.user.name;
```

### Updating State

```javascript
const state = ReactiveState.create({
  count: 0,
  user: {
    name: 'John',
    age: 30
  }
});

// Update primitives
state.count = 10;

// Update nested properties
state.user.name = 'Jane';
state.user.age = 25;

// Add new properties
state.newProperty = 'value';

// Delete properties
delete state.user.age;
```

### Working with Arrays

```javascript
const state = ReactiveState.create({
  items: [1, 2, 3]
});

// Array methods (all reactive)
state.items.push(4);           // [1, 2, 3, 4]
state.items.pop();             // [1, 2, 3]
state.items.shift();           // [2, 3]
state.items.unshift(1);        // [1, 2, 3]
state.items.splice(1, 1);      // [1, 3]
state.items.sort();            // [1, 3]
state.items.reverse();         // [3, 1]

// Index assignment
state.items[0] = 10;           // [10, 1]

// Length modification
state.items.length = 0;        // []
```

### Checking Reactivity

```javascript
const state = ReactiveState.create({ count: 0 });
const plain = { count: 0 };

ReactiveState.isReactive(state); // true
ReactiveState.isReactive(plain); // false

// Nested objects are also reactive
ReactiveState.isReactive(state.user); // true
```

### Getting Raw Values

```javascript
const state = ReactiveState.create({
  count: 0,
  user: { name: 'John' }
});

// Get raw (non-reactive) value
const raw = ReactiveState.toRaw(state);
console.log(ReactiveState.isReactive(raw)); // false

// Using $raw property
const rawValue = state.$raw;
console.log(ReactiveState.isReactive(rawValue)); // false

// Useful for passing to non-reactive contexts
sendToAPI(state.$raw);
```

---

## Computed Properties

### Basic Computed Properties

```javascript
const state = ReactiveState.create({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // 'John Doe'

// Updates automatically
state.firstName = 'Jane';
console.log(state.fullName); // 'Jane Doe'
```

### Computed with Complex Logic

```javascript
const cart = ReactiveState.create({
  items: [
    { name: 'Item 1', price: 10, quantity: 2 },
    { name: 'Item 2', price: 20, quantity: 1 }
  ],
  taxRate: 0.1
});

cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('tax', function() {
  return this.subtotal * this.taxRate;
});

cart.$computed('total', function() {
  return this.subtotal + this.tax;
});

console.log(cart.subtotal); // 40
console.log(cart.tax);      // 4
console.log(cart.total);    // 44

// Update quantity
cart.items[0].quantity = 3;

console.log(cart.subtotal); // 50
console.log(cart.total);    // 55
```

### Chained Computed Properties

```javascript
const state = ReactiveState.create({
  celsius: 0
});

state.$computed('fahrenheit', function() {
  return (this.celsius * 9/5) + 32;
});

state.$computed('kelvin', function() {
  return this.celsius + 273.15;
});

state.$computed('temperatureStatus', function() {
  if (this.celsius < 0) return 'Freezing';
  if (this.celsius < 20) return 'Cold';
  if (this.celsius < 30) return 'Warm';
  return 'Hot';
});

console.log(state.fahrenheit);        // 32
console.log(state.kelvin);            // 273.15
console.log(state.temperatureStatus); // 'Freezing'

state.celsius = 25;

console.log(state.fahrenheit);        // 77
console.log(state.temperatureStatus); // 'Warm'
```

### Computed with Conditional Logic

```javascript
const user = ReactiveState.create({
  role: 'guest',
  subscription: 'free',
  verified: false
});

user.$computed('canAccessPremium', function() {
  return this.subscription === 'premium' && this.verified;
});

user.$computed('permissions', function() {
  const perms = ['read'];
  
  if (this.role === 'admin') {
    perms.push('write', 'delete', 'manage');
  } else if (this.role === 'editor') {
    perms.push('write');
  }
  
  if (this.canAccessPremium) {
    perms.push('premium-features');
  }
  
  return perms;
});

console.log(user.permissions); // ['read']

user.role = 'editor';
console.log(user.permissions); // ['read', 'write']

user.subscription = 'premium';
user.verified = true;
console.log(user.permissions); // ['read', 'write', 'premium-features']
```

### Caching Behavior

```javascript
const state = ReactiveState.create({
  count: 0
});

let computeCount = 0;

state.$computed('doubled', function() {
  computeCount++;
  console.log('Computing...');
  return this.count * 2;
});

// First access - computes
console.log(state.doubled); // Logs: 'Computing...', Returns: 0
console.log(computeCount);  // 1

// Subsequent accesses - uses cache
console.log(state.doubled); // No log, Returns: 0
console.log(state.doubled); // No log, Returns: 0
console.log(computeCount);  // Still 1

// Dependency changes - recomputes
state.count = 5;
console.log(state.doubled); // Logs: 'Computing...', Returns: 10
console.log(computeCount);  // 2
```

---

## Batching Updates

### Basic Batching

```javascript
const state = ReactiveState.create({
  count: 0,
  name: 'John'
});

Elements.bind({
  'display': () => `${state.name}: ${state.count}`
});

// Without batching - multiple DOM updates
state.count = 1;
state.count = 2;
state.count = 3;
// DOM updated 3 times

// With batching - single DOM update
ReactiveState.batch(() => {
  state.count = 1;
  state.count = 2;
  state.count = 3;
});
// DOM updated once with final value
```

### Batching Multiple Properties

```javascript
const state = ReactiveState.create({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  email: 'john@example.com'
});

Elements.bind({
  'user-info': () => `${state.firstName} ${state.lastName}, ${state.age}`
});

// Batch multiple property updates
ReactiveState.batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
  state.age = 25;
  state.email = 'jane@example.com';
});
// Only 1 DOM update instead of 4
```

### Nested Batching

```javascript
const state = ReactiveState.create({
  count: 0
});

ReactiveState.batch(() => {
  state.count = 1;
  
  ReactiveState.batch(() => {
    state.count = 2;
    state.count = 3;
  });
  
  state.count = 4;
});
// Still only 1 DOM update
```

### Batching with Return Values

```javascript
const state = ReactiveState.create({
  items: []
});

const result = ReactiveState.batch(() => {
  state.items.push(1);
  state.items.push(2);
  state.items.push(3);
  
  return state.items.length;
});

console.log(result); // 3
```

### Using $batch Method

```javascript
const state = ReactiveState.create({
  x: 0,
  y: 0
});

// Batch using state method
state.$batch(() => {
  state.x = 10;
  state.y = 20;
});

// With return value
const sum = state.$batch(() => {
  state.x = 5;
  state.y = 10;
  return state.x + state.y;
});

console.log(sum); // 15
```

### Batching in Event Handlers

```javascript
const state = ReactiveState.create({
  formData: {
    name: '',
    email: '',
    age: 0
  }
});

function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  
  // Batch all form updates
  ReactiveState.batch(() => {
    state.formData.name = formData.get('name');
    state.formData.email = formData.get('email');
    state.formData.age = parseInt(formData.get('age'));
  });
}
```

### Batching Array Operations

```javascript
const state = ReactiveState.create({
  items: []
});

Elements.bind({
  'list': () => state.items.join(', ')
});

// Batch multiple array operations
ReactiveState.batch(() => {
  state.items.push(1);
  state.items.push(2);
  state.items.push(3);
  state.items.sort();
  state.items.reverse();
});
// Single DOM update
```

---

## Watch API

### Watching Properties

```javascript
const state = ReactiveState.create({
  count: 0
});

// Watch a specific property
const unwatch = state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count = 5;
// Logs: "Count changed from 0 to 5"

state.count = 10;
// Logs: "Count changed from 5 to 10"

// Stop watching
unwatch();

state.count = 15;
// No log (unwatched)
```

### Watching Computed Values

```javascript
const state = ReactiveState.create({
  temperature: 20
});

// Watch a computed condition
state.$watch(
  function() { return this.temperature > 30; },
  (isHot) => {
    if (isHot) {
      console.log('Temperature is too hot!');
    } else {
      console.log('Temperature is OK');
    }
  }
);

state.temperature = 35;
// Logs: "Temperature is too hot!"

state.temperature = 25;
// Logs: "Temperature is OK"
```

### Watching Nested Properties

```javascript
const state = ReactiveState.create({
  user: {
    profile: {
      name: 'John'
    }
  }
});

// Watch nested property
state.$watch(
  function() { return this.user.profile.name; },
  (newName, oldName) => {
    console.log(`Name changed from ${oldName} to ${newName}`);
  }
);

state.user.profile.name = 'Jane';
// Logs: "Name changed from John to Jane"
```

### Multiple Watchers

```javascript
const state = ReactiveState.create({
  count: 0
});

// Watcher 1: Log changes
const unwatch1 = state.$watch('count', (newVal) => {
  console.log('Logger:', newVal);
});

// Watcher 2: Update localStorage
const unwatch2 = state.$watch('count', (newVal) => {
  localStorage.setItem('count', newVal);
});

// Watcher 3: Trigger side effects
const unwatch3 = state.$watch('count', (newVal) => {
  if (newVal > 10) {
    console.log('Count exceeded 10!');
  }
});

state.count = 15;
// All three watchers execute
```

### Watching for Validation

```javascript
const form = ReactiveState.create({
  email: '',
  password: '',
  errors: {}
});

// Watch email for validation
form.$watch('email', (email) => {
  if (!email.includes('@')) {
    form.errors.email = 'Invalid email address';
  } else {
    delete form.errors.email;
  }
});

// Watch password for validation
form.$watch('password', (password) => {
  if (password.length < 8) {
    form.errors.password = 'Password must be at least 8 characters';
  } else {
    delete form.errors.password;
  }
});

form.email = 'invalid';
// Sets error: form.errors.email = 'Invalid email address'

form.email = 'valid@example.com';
// Clears error: delete form.errors.email
```

### Async Watchers

```javascript
const state = ReactiveState.create({
  searchQuery: ''
});

// Watch with debounced API call
let debounceTimer;
state.$watch('searchQuery', (query) => {
  clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(async () => {
    if (query) {
      const results = await fetch(`/api/search?q=${query}`);
      console.log('Search results:', await results.json());
    }
  }, 300);
});
```

### Watching Complex Conditions

```javascript
const store = ReactiveState.create({
  items: [],
  filter: 'all',
  sortBy: 'name'
});

// Watch multiple properties
store.$watch(
  function() {
    return {
      itemCount: this.items.length,
      filter: this.filter,
      sortBy: this.sortBy
    };
  },
  (newState, oldState) => {
    console.log('Store state changed:', newState);
    // Refetch or recompute filtered/sorted items
  }
);
```

---

## Helper Methods

### Collection Helper

The Collection helper provides convenient methods for managing arrays.

#### Creating Collections

```javascript
// Create empty collection
const todos = ReactiveState.collection();

// Create with initial data
const users = ReactiveState.collection([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
]);

// Access items
console.log(users.items); // Array of users
```

#### Adding Items

```javascript
const todos = ReactiveState.collection([
  { id: 1, text: 'Task 1', done: false }
]);

// Add new item
todos.$add({ id: 2, text: 'Task 2', done: false });

console.log(todos.items.length); // 2
```

#### Removing Items

```javascript
const todos = ReactiveState.collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: true },
  { id: 3, text: 'Task 3', done: false }
]);

// Remove by predicate
todos.$remove(item => item.done);

// Remove by value
todos.$remove(todos.items[0]);

console.log(todos.items.length); // 2
```

#### Updating Items

```javascript
const users = ReactiveState.collection([
  { id: 1, name: 'John', active: false },
  { id: 2, name: 'Jane', active: false }
]);

// Update specific item
users.$update(
  user => user.id === 1,
  { active: true }
);

console.log(users.items[0].active); // true
```

#### Clearing Collection

```javascript
const items = ReactiveState.collection([1, 2, 3, 4, 5]);

items.$clear();

console.log(items.items.length); // 0
```

#### Complete Todo Example

```javascript
const todoList = ReactiveState.collection([
  { id: 1, text: 'Learn Reactive', done: false },
  { id: 2, text: 'Build App', done: false }
]);

// Computed properties
todoList.$computed('remaining', function() {
  return this.items.filter(t => !t.done).length;
});

todoList.$computed('completed', function() {
  return this.items.filter(t => t.done).length;
});

// Add todo
function addTodo(text) {
  todoList.$add({
    id: Date.now(),
    text,
    done: false
  });
}

// Toggle todo
function toggleTodo(id) {
  todoList.$update(
    todo => todo.id === id,
    todo => ({ done: !todo.done })
  );
}

// Remove todo
function removeTodo(id) {
  todoList.$remove(todo => todo.id === id);
}

// Bind to DOM
Elements.bind({
  'todo-count': () => `${todoList.remaining} remaining`
});
```

### Form Helper

The Form helper simplifies form state management with validation support.

#### Creating Forms

```javascript
const loginForm = ReactiveState.form({
  email: '',
  password: ''
});

// Access form properties
console.log(loginForm.values);      // { email: '', password: '' }
console.log(loginForm.errors);      // {}
console.log(loginForm.touched);     // {}
console.log(loginForm.isSubmitting); // false
```

#### Setting Values

```javascript
const form = ReactiveState.form({
  username: '',
  email: ''
});

// Set individual field
form.$setValue('username', 'johndoe');
form.$setValue('email', 'john@example.com');

console.log(form.values.username); // 'johndoe'
console.log(form.touched.username); // true
```

#### Setting Errors

```javascript
const form = ReactiveState.form({
  email: '',
  password: ''
});

// Set error
form.$setError('email', 'Invalid email format');

// Clear error
form.$setError('email', null);

console.log(form.errors.email); // undefined
```

#### Form Validation

```javascript
const registrationForm = ReactiveState.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Watch for validation
registrationForm.$watch('values', (values) => {
  // Username validation
  if (values.username.length < 3) {
    registrationForm.$setError('username', 'Username must be at least 3 characters');
  } else {
    registrationForm.$setError('username', null);
  }
  
  // Email validation
  if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    registrationForm.$setError('email', 'Invalid email address');
  } else {
    registrationForm.$setError('email', null);
  }
  
  // Password validation
  if (values.password.length < 8) {
    registrationForm.$setError('password', 'Password must be at least 8 characters');
  } else {
    registrationForm.$setError('password', null);
  }
  
  // Confirm password
  if (values.password !== values.confirmPassword) {
    registrationForm.$setError('confirmPassword', 'Passwords do not match');
  } else {
    registrationForm.$setError('confirmPassword', null);
  }
});

// Check if form is valid
console.log(registrationForm.isValid); // Computed property
console.log(registrationForm.isDirty); // Computed property
```

#### Resetting Forms

```javascript
const form = ReactiveState.form({
  name: '',
  email: ''
});

// User fills out form
form.$setValue('name', 'John');
form.$setValue('email', 'john@example.com');
form.$setError('email', 'Email taken');

// Reset to initial values
form.$reset();

console.log(form.values.name);  // ''
console.log(form.errors);       // {}
console.log(form.touched);      // {}

// Reset with new values
form.$reset({
  name: 'Jane',
  email: 'jane@example.com'
});
```

#### Complete Form Example

```javascript
const contactForm = ReactiveState.form({
  name: '',
  email: '',
  message: ''
});

// Validation
contactForm.$watch('values', (values) => {
  if (!values.name) {
    contactForm.$setError('name', 'Name is required');
  } else {
    contactForm.$setError('name', null);
  }
  
  if (!values.email || !values.email.includes('@')) {
    contactForm.$setError('email', 'Valid email is required');
  } else {
    contactForm.$setError('email', null);
  }
  
  if (values.message.length < 10) {
    contactForm.$setError('message', 'Message must be at least 10 characters');
  } else {
    contactForm.$setError('message', null);
  }
});

// Bind to DOM
Elements.bind({
  'name-error': () => contactForm.errors.name || '',
  'email-error': () => contactForm.errors.email || '',
  'message-error': () => contactForm.errors.message || '',
  'submit-btn': {
    disabled: () => !contactForm.isValid || contactForm.isSubmitting
  }
});

// Handle submission
async function handleSubmit(event) {
  event.preventDefault();
  
  if (!contactForm.isValid) return;
  
  contactForm.isSubmitting = true;
  
  try {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactForm.values)
    });
    
    alert('Form submitted successfully!');
    contactForm.$reset();
  } catch (error) {
    alert('Submission failed');
  } finally {
    contactForm.isSubmitting = false;
  }
}
```

### Async Helper

The Async helper manages asynchronous operations with loading and error states.

#### Creating Async State

```javascript
const userData = ReactiveState.async(null);

console.log(userData.data);    // null
console.log(userData.loading); // false
console.log(userData.error);   // null
```

#### Executing Async Operations

```javascript
const userData = ReactiveState.async(null);

// Execute async function
await userData.$execute(async () => {
  const response = await fetch('/api/user/123');
  return await response.json();
});

console.log(userData.data);    // { id: 123, name: 'John' }
console.log(userData.loading); // false
console.log(userData.error);   // null
```

#### Handling Errors

```javascript
const userData = ReactiveState.async(null);

try {
  await userData.$execute(async () => {
    const response = await fetch('/api/user/999');
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  });
} catch (error) {
  console.error('Failed to load user');
}

console.log(userData.error); // Error object
console.log(userData.loading); // false
```

#### Resetting Async State

```javascript
const userData = ReactiveState.async(null);

await userData.$execute(async () => {
  return { name: 'John' };
});

// Reset to initial state
userData.$reset();

console.log(userData.data);    // null
console.log(userData.loading); // false
console.log(userData.error);   // null
```

#### Using Computed Properties

```javascript
const apiData = ReactiveState.async(null);

// isSuccess computed property
console.log(apiData.isSuccess); // false (no data yet)

await apiData.$execute(async () => {
  return { result: 'success' };
});

console.log(apiData.isSuccess); // true (has data, no error)

// isError computed property
try {
  await apiData.$execute(async () => {
    throw new Error('API Error');
  });
} catch (e) {}

console.log(apiData.isError); // true (has error)
```

#### Complete Async Example

```javascript
const userProfile = ReactiveState.async(null);

// Bind loading state
Elements.bind({
  'profile-container': () => {
    if (userProfile.loading) {
      return '<div class="spinner">Loading...</div>';
    }
    
    if (userProfile.error) {
      return `<div class="error">Error: ${userProfile.error.message}</div>`;
    }
    
    if (userProfile.data) {
      const user = userProfile.data;
      return `
        <div class="profile">
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <p>Member since: ${user.joined}</p>
        </div>
      `;
    }
    
    return '<div>No user data</div>';
  }
});

// Load user
async function loadUser(userId) {
  await userProfile.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to load user: ${response.statusText}`);
    }
    return await response.json();
  });
}

// Refresh user
async function refreshUser() {
  if (userProfile.data) {
    await loadUser(userProfile.data.id);
  }
}

// Initial load
loadUser(123);
```

#### Multiple Async States

```javascript
const posts = ReactiveState.async([]);
const comments = ReactiveState.async([]);
const user = ReactiveState.async(null);

// Load all data
async function loadPageData(userId, postId) {
  await Promise.all([
    user.$execute(async () => {
      const res = await fetch(`/api/users/${userId}`);
      return await res.json();
    }),
    posts.$execute(async () => {
      const res = await fetch(`/api/posts?userId=${userId}`);
      return await res.json();
    }),
    comments.$execute(async () => {
      const res = await fetch(`/api/posts/${postId}/comments`);
      return await res.json();
    })
  ]);
}

// Bind combined loading state
Elements.bind({
  'loading-indicator': () => {
    const isLoading = user.loading || posts.loading || comments.loading;
    return isLoading ? 'Loading...' : '';
  }
});
```

---

## Binding to DOM

### Binding by ID

```javascript
const state = ReactiveState.create({
  message: 'Hello World',
  count: 0
});

// Simple binding
Elements.bind({
  'message-display': () => state.message,
  'counter': () => state.count
});

// HTML
<div id="message-display"></div>
<div id="counter"></div>
```

### Binding Multiple Properties

```javascript
const state = ReactiveState.create({
  text: 'Hello',
  color: 'red',
  size: '20px'
});

Elements.bind({
  'styled-text': {
    textContent: () => state.text,
    style: () => `color: ${state.color}; font-size: ${state.size};`
  }
});

// HTML
<div id="styled-text"></div>
```

### Binding Style Objects

```javascript
const state = ReactiveState.create({
  theme: {
    background: '#333',
    color: '#fff',
    padding: '20
    ```javascript
const state = ReactiveState.create({
  theme: {
    background: '#333',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px'
  }
});

Elements.bind({
  'themed-box': {
    style: () => ({
      backgroundColor: state.theme.background,
      color: state.theme.color,
      padding: state.theme.padding,
      borderRadius: state.theme.borderRadius
    })
  }
});

// Change theme dynamically
state.theme.background = '#fff';
state.theme.color = '#333';

// HTML
<div id="themed-box">Themed Content</div>
```

### Binding Classes

```javascript
const state = ReactiveState.create({
  isActive: false,
  isDisabled: false,
  theme: 'dark'
});

// Using classList object
Elements.bind({
  'button': {
    classList: () => ({
      'active': state.isActive,
      'disabled': state.isDisabled,
      [`theme-${state.theme}`]: true
    })
  }
});

// Using className string
Elements.bind({
  'container': {
    className: () => {
      const classes = ['container'];
      if (state.isActive) classes.push('active');
      if (state.isDisabled) classes.push('disabled');
      classes.push(`theme-${state.theme}`);
      return classes.join(' ');
    }
  }
});

// Using classList array
Elements.bind({
  'box': {
    classList: () => [
      'box',
      state.isActive && 'active',
      state.isDisabled && 'disabled'
    ].filter(Boolean)
  }
});

// HTML
<button id="button">Click Me</button>
<div id="container">Container</div>
<div id="box">Box</div>
```

### Binding Attributes

```javascript
const state = ReactiveState.create({
  imageUrl: '/images/photo.jpg',
  altText: 'Photo',
  linkUrl: 'https://example.com',
  inputValue: '',
  isDisabled: false
});

Elements.bind({
  'image': {
    src: () => state.imageUrl,
    alt: () => state.altText
  },
  'link': {
    href: () => state.linkUrl
  },
  'input': {
    value: () => state.inputValue,
    disabled: () => state.isDisabled
  }
});

// HTML
<img id="image" />
<a id="link">Click Here</a>
<input id="input" type="text" />
```

### Binding Data Attributes

```javascript
const state = ReactiveState.create({
  userId: '123',
  userRole: 'admin',
  itemCount: 5
});

Elements.bind({
  'user-card': {
    dataset: () => ({
      userId: state.userId,
      role: state.userRole,
      count: state.itemCount
    })
  }
});

// Accessing in JavaScript
const card = document.getElementById('user-card');
console.log(card.dataset.userId);  // '123'
console.log(card.dataset.role);    // 'admin'
console.log(card.dataset.count);   // '5'

// HTML
<div id="user-card"></div>
<!-- Renders as: -->
<div id="user-card" data-user-id="123" data-role="admin" data-count="5"></div>
```

### Binding Complex HTML

```javascript
const state = ReactiveState.create({
  users: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]
});

Elements.bind({
  'user-list': () => {
    return state.users.map(user => `
      <div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
      </div>
    `).join('');
  }
});

// HTML
<div id="user-list"></div>
```

### Binding by Class Name

```javascript
const state = ReactiveState.create({
  status: 'Ready'
});

// Bind to all elements with class
Collections.bind({
  'status-badge': () => state.status
});

// HTML
<span class="status-badge"></span>
<div class="status-badge"></div>
<p class="status-badge"></p>
<!-- All will show "Ready" -->
```

### Binding with Selectors

```javascript
const state = ReactiveState.create({
  title: 'My Application',
  description: 'A reactive app'
});

// Query single element
Selector.query.bind({
  'h1.main-title': () => state.title,
  '.app-description': () => state.description
});

// Query all matching elements
Selector.queryAll.bind({
  '.update-timestamp': () => new Date().toLocaleString()
});

// HTML
<h1 class="main-title"></h1>
<p class="app-description"></p>
<span class="update-timestamp"></span>
<div class="update-timestamp"></div>
```

### Conditional Rendering

```javascript
const state = ReactiveState.create({
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null
});

Elements.bind({
  'app-content': () => {
    if (state.loading) {
      return '<div class="spinner">Loading...</div>';
    }
    
    if (state.error) {
      return `<div class="error">${state.error}</div>`;
    }
    
    if (state.isLoggedIn && state.user) {
      return `
        <div class="dashboard">
          <h2>Welcome, ${state.user.name}!</h2>
          <p>Last login: ${state.user.lastLogin}</p>
        </div>
      `;
    }
    
    return `
      <div class="login-prompt">
        <p>Please log in to continue</p>
      </div>
    `;
  }
});

// HTML
<div id="app-content"></div>
```

### List Rendering

```javascript
const todos = ReactiveState.collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: true },
  { id: 3, text: 'Task 3', done: false }
]);

Elements.bind({
  'todo-list': () => {
    if (todos.items.length === 0) {
      return '<p class="empty">No todos yet</p>';
    }
    
    return `
      <ul>
        ${todos.items.map(todo => `
          <li class="${todo.done ? 'done' : ''}">
            <input type="checkbox" 
                   data-id="${todo.id}" 
                   ${todo.done ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button data-id="${todo.id}">Delete</button>
          </li>
        `).join('')}
      </ul>
    `;
  }
});

// HTML
<div id="todo-list"></div>
```

### Filtering and Sorting

```javascript
const store = ReactiveState.create({
  items: [
    { id: 1, name: 'Apple', category: 'fruit', price: 1.5 },
    { id: 2, name: 'Bread', category: 'bakery', price: 2.0 },
    { id: 3, name: 'Orange', category: 'fruit', price: 1.8 },
    { id: 4, name: 'Milk', category: 'dairy', price: 3.0 }
  ],
  filterCategory: 'all',
  sortBy: 'name'
});

store.$computed('filteredItems', function() {
  let items = this.items;
  
  // Filter
  if (this.filterCategory !== 'all') {
    items = items.filter(item => item.category === this.filterCategory);
  }
  
  // Sort
  items = [...items].sort((a, b) => {
    if (this.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (this.sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });
  
  return items;
});

Elements.bind({
  'product-list': () => {
    return store.filteredItems.map(item => `
      <div class="product">
        <h3>${item.name}</h3>
        <span class="category">${item.category}</span>
        <span class="price">$${item.price.toFixed(2)}</span>
      </div>
    `).join('');
  }
});

// HTML
<select id="category-filter">
  <option value="all">All Categories</option>
  <option value="fruit">Fruit</option>
  <option value="bakery">Bakery</option>
  <option value="dairy">Dairy</option>
</select>
<select id="sort-select">
  <option value="name">Sort by Name</option>
  <option value="price">Sort by Price</option>
</select>
<div id="product-list"></div>

<script>
document.getElementById('category-filter').addEventListener('change', (e) => {
  store.filterCategory = e.target.value;
});

document.getElementById('sort-select').addEventListener('change', (e) => {
  store.sortBy = e.target.value;
});
</script>
```

### Two-Way Binding (Forms)

```javascript
const form = ReactiveState.create({
  username: '',
  email: '',
  age: 18,
  newsletter: false,
  country: 'US'
});

// Bind form values
Elements.bind({
  'username-input': {
    value: () => form.username
  },
  'email-input': {
    value: () => form.email
  },
  'age-input': {
    value: () => form.age
  },
  'newsletter-checkbox': {
    checked: () => form.newsletter
  },
  'country-select': {
    value: () => form.country
  }
});

// Update state from form
document.getElementById('username-input').addEventListener('input', (e) => {
  form.username = e.target.value;
});

document.getElementById('email-input').addEventListener('input', (e) => {
  form.email = e.target.value;
});

document.getElementById('age-input').addEventListener('input', (e) => {
  form.age = parseInt(e.target.value);
});

document.getElementById('newsletter-checkbox').addEventListener('change', (e) => {
  form.newsletter = e.target.checked;
});

document.getElementById('country-select').addEventListener('change', (e) => {
  form.country = e.target.value;
});

// HTML
<form>
  <input id="username-input" type="text" />
  <input id="email-input" type="email" />
  <input id="age-input" type="number" />
  <input id="newsletter-checkbox" type="checkbox" />
  <select id="country-select">
    <option value="US">United States</option>
    <option value="UK">United Kingdom</option>
    <option value="CA">Canada</option>
  </select>
</form>
```

### Unbinding Elements

```javascript
const state = ReactiveState.create({ count: 0 });

// Bind
Elements.bind({
  'counter': () => state.count
});

// Later: unbind to stop updates
Elements.unbind('counter');

// State changes won't update the element anymore
state.count = 100;

// Unbind by class
Collections.unbind('status-badge');

// Unbind by selector
Selector.query.unbind('h1.main-title');
Selector.queryAll.unbind('.update-timestamp');
```

---

## Advanced Features

### Untracked Reads

Sometimes you want to read state without creating a dependency.

```javascript
const state = ReactiveState.create({
  count: 0,
  multiplier: 2
});

Elements.bind({
  'result': () => {
    // This creates a dependency
    const count = state.count;
    
    // This does NOT create a dependency
    const multiplier = ReactiveState.untrack(() => state.multiplier);
    
    return count * multiplier;
  }
});

// This triggers update
state.count = 5;

// This does NOT trigger update
state.multiplier = 10;
```

#### Use Case: Logging Without Dependencies

```javascript
const state = ReactiveState.create({
  user: { name: 'John', visits: 0 }
});

Elements.bind({
  'welcome': () => {
    // Track user.name
    const name = state.user.name;
    
    // Don't track visits (just for logging)
    const visits = ReactiveState.untrack(() => state.user.visits);
    console.log(`User has ${visits} visits`);
    
    return `Welcome, ${name}!`;
  }
});

// Triggers update
state.user.name = 'Jane';

// Does NOT trigger update (only logs)
state.user.visits++;
```

### Pause and Resume Tracking

Temporarily disable reactivity for bulk operations.

```javascript
const state = ReactiveState.create({
  items: []
});

Elements.bind({
  'item-count': () => state.items.length
});

// Pause tracking
ReactiveState.pauseTracking();

// These won't trigger updates
state.items.push(1);
state.items.push(2);
state.items.push(3);
state.items.push(4);
state.items.push(5);

// Resume and flush all pending updates
ReactiveState.resumeTracking(true);
// DOM updates once with final state

// Resume without flushing
ReactiveState.pauseTracking();
state.items.push(6);
ReactiveState.resumeTracking(false);
// No update yet

state.items.push(7);
// Now updates (next change triggers it)
```

#### Use Case: Importing Data

```javascript
const state = ReactiveState.create({
  users: []
});

async function importUsers(csvData) {
  // Parse CSV
  const rows = csvData.split('\n').slice(1); // Skip header
  
  // Pause reactivity during import
  ReactiveState.pauseTracking();
  
  rows.forEach(row => {
    const [id, name, email] = row.split(',');
    state.users.push({ id, name, email });
  });
  
  // Resume and update once
  ReactiveState.resumeTracking(true);
  
  console.log(`Imported ${state.users.length} users`);
}
```

### Manual Notifications

Force updates when modifying raw state.

```javascript
const state = ReactiveState.create({
  count: 0,
  items: []
});

Elements.bind({
  'display': () => state.count
});

// Modify raw state (bypasses proxy)
state.$raw.count = 100;

// No update yet (didn't go through proxy)

// Manually notify
state.$notify('count');
// Now updates

// Notify all properties
state.$notify();
```

#### Use Case: External Libraries

```javascript
const state = ReactiveState.create({
  chart: {
    data: [1, 2, 3, 4, 5],
    config: { type: 'line' }
  }
});

function updateChart() {
  // External library modifies raw data
  const chart = state.$raw.chart;
  chart.data = externalLibrary.processData(chart.data);
  
  // Manually notify to trigger reactivity
  state.$notify('chart');
}
```

### Deep Reactivity with Nested Objects

```javascript
const state = ReactiveState.create({
  company: {
    name: 'Acme Corp',
    employees: [
      {
        id: 1,
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'New York',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }
      }
    ]
  }
});

// All levels are reactive
state.company.name = 'New Acme';
state.company.employees[0].name = 'Jane';
state.company.employees[0].address.city = 'Boston';
state.company.employees[0].address.coordinates.lat = 42.3601;

// All trigger updates if watched
```

### Custom Error Handling

```javascript
// Configure global error handler
ReactiveState.configure({
  errorHandler: (error, context, data) => {
    // Log to error tracking service
    console.error('Reactive Error:', {
      message: error.message,
      stack: error.stack,
      context: context,
      element: data?.element?.id,
      property: data?.property
    });
    
    // Send to monitoring service
    errorTracker.captureException(error, {
      tags: { context },
      extra: { data }
    });
    
    // Show user-friendly message
    if (context === 'executeBinding') {
      showNotification('Something went wrong. Please refresh the page.', 'error');
    }
  }
});

// Now all reactive errors are handled
const state = ReactiveState.create({ count: 0 });

Elements.bind({
  'display': () => {
    if (state.count > 10) {
      throw new Error('Count too high!');
    }
    return state.count;
  }
});

state.count = 15; // Error is caught and handled
```

### Circular Dependency Prevention

The module automatically detects and prevents circular dependencies.

```javascript
const state = ReactiveState.create({
  a: 1,
  b: 2
});

state.$computed('sumA', function() {
  return this.a + this.sumB; // References sumB
});

state.$computed('sumB', function() {
  return this.b + this.sumA; // References sumA - CIRCULAR!
});

// Warning logged: "Maximum dependency depth exceeded"
// Prevents infinite loop
```

### Performance Configuration

```javascript
// Configure reactivity system
ReactiveState.configure({
  // Max dependency depth (prevents infinite loops)
  maxDependencyDepth: 100,
  
  // Enable debug mode
  enableDebugMode: true,
  
  // Custom error handler
  errorHandler: (error, context, data) => {
    console.error('Error:', error);
  }
});
```

---

## Debug Utilities

### Enable Debug Mode

```javascript
// Enable debug logging
ReactiveState.debug.setDebugMode(true);

// Now you'll see logs like:
// "[DOM Helpers Reactive Debug] Triggered 2 binding(s) for key "count""
```

### Inspect State Dependencies

```javascript
const state = ReactiveState.create({
  count: 0,
  name: 'John'
});

Elements.bind({
  'counter': () => state.count,
  'display': () => `${state.name}: ${state.count}`
});

// Get all dependencies for state
const deps = ReactiveState.debug.getStateDependencies(state);

console.log(deps);
/*
{
  count: {
    count: 2,
    bindings: [
      { element: <div#counter>, property: null, isComputed: false },
      { element: <div#display>, property: null, isComputed: false }
    ]
  },
  name: {
    count: 1,
    bindings: [
      { element: <div#display>, property: null, isComputed: false }
    ]
  }
}
*/
```

### Inspect Element Bindings

```javascript
const element = document.getElementById('counter');

const info = ReactiveState.debug.getElementBindingInfo(element);

console.log(info);
/*
{
  count: 1,
  bindings: [
    {
      property: null,
      hasTrackedStates: true,
      trackedStateCount: 1
    }
  ]
}
*/
```

### Get Reactive Statistics

```javascript
const stats = ReactiveState.debug.getReactiveStats();

console.log(stats);
/*
{
  pendingUpdates: 0,
  batchDepth: 0,
  isFlushing: false,
  isPaused: false,
  pausedUpdatesCount: 0
}
*/

// During batch
ReactiveState.batch(() => {
  state.count = 1;
  state.count = 2;
  
  const stats = ReactiveState.debug.getReactiveStats();
  console.log(stats.batchDepth);      // 1
  console.log(stats.pendingUpdates);  // 1+
});
```

### Debug State Structure

```javascript
const state = ReactiveState.create({
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  count: 0
});

state.$computed('displayName', function() {
  return this.user.name.toUpperCase();
});

// Debug state
state.$debug('User State');

/*
Console output:
[DOM Helpers Reactive Debug] User State
  Raw value: { user: {...}, count: 0 }
  Dependencies: { user: {...}, count: {...} }
  Computed properties: ['displayName']
*/

// Or use global function
ReactiveState.debug.debugState(state, 'My State Label');
```

### Performance Monitoring

When debug mode is enabled, the module monitors performance:

```javascript
ReactiveState.debug.setDebugMode(true);

const state = ReactiveState.create({ items: [] });

Elements.bind({
  'list': () => {
    // Slow operation
    return state.items.map(item => {
      return expensiveCalculation(item);
    }).join('');
  }
});

// If binding takes > 16ms:
// "[DOM Helpers Reactive Performance] Slow binding execution: 45.23ms"
```

### Inspecting Computed Properties

```javascript
const state = ReactiveState.create({ count: 0 });

state.$computed('doubled', function() {
  return this.count * 2;
});

state.$computed('quadrupled', function() {
  return this.doubled * 2;
});

// Inspect
const deps = ReactiveState.debug.getStateDependencies(state);

console.log('Computed properties:', deps);
// Shows dependency graph of computed properties
```

---

## Best Practices

### 1. Use Batching for Multiple Updates

```javascript
// ❌ Bad: Multiple separate updates
state.user.firstName = 'Jane';
state.user.lastName = 'Smith';
state.user.email = 'jane@example.com';
state.user.age = 25;
// Triggers 4 DOM updates

// ✅ Good: Batch updates
state.$batch(() => {
  state.user.firstName = 'Jane';
  state.user.lastName = 'Smith';
  state.user.email = 'jane@example.com';
  state.user.age = 25;
});
// Triggers 1 DOM update
```

### 2. Use Computed for Derived Values

```javascript
// ❌ Bad: Recalculate every time
Elements.bind({
  'total': () => {
    return state.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
});

// ✅ Good: Use computed property
state.$computed('total', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

Elements.bind({
  'total': () => state.total
});
```

### 3. Avoid Unnecessary Dependencies

```javascript
// ❌ Bad: Creates unnecessary dependency
Elements.bind({
  'username': () => {
    console.log('User visits:', state.user.visits); // Creates dependency
    return state.user.name;
  }
});

// ✅ Good: Use untrack for non-dependencies
Elements.bind({
  'username': () => {
    const visits = ReactiveState.untrack(() => state.user.visits);
    console.log('User visits:', visits); // No dependency
    return state.user.name;
  }
});
```

### 4. Clean Up Watchers

```javascript
// ❌ Bad: Watcher never cleaned up
state.$watch('count', (val) => {
  console.log(val);
});

// ✅ Good: Clean up when done
const unwatch = state.$watch('count', (val) => {
  console.log(val);
});

// Later, when component unmounts or is no longer needed
unwatch();
```

### 5. Use Helper Methods

```javascript
// ❌ Bad: Manual array management
const state = ReactiveState.create({ todos: [] });

function addTodo(text) {
  state.todos.push({
    id: Date.now(),
    text,
    done: false
  });
}

function removeTodo(id) {
  const index = state.todos.findIndex(t => t.id === id);
  if (index !== -1) {
    state.todos.splice(index, 1);
  }
}

// ✅ Good: Use collection helper
const todos = ReactiveState.collection([]);

function addTodo(text) {
  todos.$add({
    id: Date.now(),
    text,
    done: false
  });
}

function removeTodo(id) {
  todos.$remove(t => t.id === id);
}
```

### 6. Normalize State Structure

```javascript
// ❌ Bad: Nested arrays (hard to update)
const state = ReactiveState.create({
  posts: [
    {
      id: 1,
      title: 'Post 1',
      comments: [
        { id: 1, text: 'Comment 1' },
        { id: 2, text: 'Comment 2' }
      ]
    }
  ]
});

// ✅ Good: Normalized structure
const state = ReactiveState.create({
  posts: {
    1: { id: 1, title: 'Post 1', commentIds: [1, 2] }
  },
  comments: {
    1: { id: 1, postId: 1, text: 'Comment 1' },
    2: { id: 2, postId: 1, text: 'Comment 2' }
  }
});
```

### 7. Separate Concerns

```javascript
// ❌ Bad: Mixed concerns
const state = ReactiveState.create({
  userData: null,
  loading: false,
  error: null,
  formData: { name: '', email: '' },
  formErrors: {},
  cart: []
});

// ✅ Good: Separate states
const user = ReactiveState.async(null);
const form = ReactiveState.form({ name: '', email: '' });
const cart = ReactiveState.collection([]);
```

### 8. Use TypeScript (Optional)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
}

const state = ReactiveState.create<AppState>({
  user: null,
  isLoggedIn: false,
  theme: 'light'
});

// Now you get type checking and autocomplete
state.user = { id: 1, name: 'John', email: 'john@example.com' };
```

### 9. Handle Async Properly

```javascript
// ❌ Bad: No loading/error states
async function loadUser(id) {
  const response = await fetch(`/api/users/${id}`);
  state.user = await response.json();
}

// ✅ Good: Use async helper
const user = ReactiveState.async(null);

async function loadUser(id) {
  await user.$execute(async () => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to load user');
    return await response.json();
  });
}

// Bind with proper states
Elements.bind({
  'user-display': () => {
    if (user.loading) return 'Loading...';
    if (user.error) return `Error: ${user.error.message}`;
    if (user.data) return user.data.name;
    return 'No user';
  }
});
```

### 10. Avoid Large Lists in Bindings

```javascript
// ❌ Bad: Re-render entire large list
Elements.bind({
  'list': () => {
    return state.items.map(item => `
      <div>${item.name}</div>
    `).join('');
  }
});

// ✅ Better: Virtual scrolling or pagination
const state = ReactiveState.create({
  allItems: [...],  // 10,000 items
  page: 0,
  pageSize: 50
});

state.$computed('visibleItems', function() {
  const start = this.page * this.pageSize;
  return this.allItems.slice(start, start + this.pageSize);
});

Elements.bind({
  'list': () => {
    return state.visibleItems.map(item => `
      <div>${item.name}</div>
    `).join('');
  }
});
```

---

## API Reference

### ReactiveState

#### `ReactiveState.create(initialState)`
Creates a reactive state object.

**Parameters:**
- `initialState` (Object): Initial state values

**Returns:** Reactive proxy object

```javascript
const state = ReactiveState.create({ count: 0 });
```

#### `ReactiveState.collection(initialArray)`
Creates a reactive collection with helper methods.

**Parameters:**
- `initialArray` (Array, optional): Initial array items

**Returns:** Reactive collection object with `$add`, `$remove`, `$update`, `$clear` methods

```javascript
const todos = ReactiveState.collection([]);
```

#### `ReactiveState.form(initialValues)`
Creates a reactive form state with validation support.

**Parameters:**
- `initialValues` (Object): Initial form field values

**Returns:** Reactive form object with `$setValue`, `$setError`, `$reset` methods

```javascript
const form = ReactiveState.form({ email: '', password: '' });
```

#### `ReactiveState.async(initialValue)`
Creates a reactive async state for handling promises.

**Parameters:**
- `initialValue` (any, optional): Initial data value

**Returns:** Reactive async object with `$execute`, `$reset` methods

```javascript
const userData = ReactiveState.async(null);
```

#### `ReactiveState.batch(fn)`
Batches multiple state updates into a single DOM update.

**Parameters:**
- `fn` (Function): Function containing state updates

**Returns:** Return value of `fn`

```javascript
ReactiveState.batch(() => {
  state.a = 1;
  state.b = 2;
});
```

#### `ReactiveState.untrack(fn)`
Reads state without creating dependencies.

**Parameters:**
- `fn` (Function): Function that accesses state

**Returns:** Return value of `fn`

```javascript
const value = ReactiveState.untrack(() => state.count);
```

#### `ReactiveState.pauseTracking()`
Pauses all reactivity.

```javascript
ReactiveState.pauseTracking();
```

#### `ReactiveState.resumeTracking(flush)`
Resumes reactivity.

**Parameters:**
- `flush` (Boolean, optional): Whether to flush pending updates (default: true)

```javascript
ReactiveState.resumeTracking(true);
```

#### `ReactiveState.notify(state, key)`
Manually triggers updates for a property.

**Parameters:**
- `state` (Object): Reactive state object
- `key` (String, optional): Property key to notify. If omitted, notifies all properties.

```javascript
```javascript
ReactiveState.notify(state, 'count');
```

#### `ReactiveState.isReactive(value)`
Checks if a value is reactive.

**Parameters:**
- `value` (any): Value to check

**Returns:** Boolean

```javascript
const isReactive = ReactiveState.isReactive(state); // true
```

#### `ReactiveState.toRaw(value)`
Extracts raw (non-reactive) value from a reactive proxy.

**Parameters:**
- `value` (any): Reactive proxy or regular value

**Returns:** Raw value

```javascript
const raw = ReactiveState.toRaw(state);
```

#### `ReactiveState.configure(options)`
Configures the reactive system.

**Parameters:**
- `options` (Object): Configuration options
  - `maxDependencyDepth` (Number): Maximum dependency depth
  - `enableDebugMode` (Boolean): Enable debug logging
  - `errorHandler` (Function): Custom error handler

```javascript
ReactiveState.configure({
  maxDependencyDepth: 100,
  enableDebugMode: true,
  errorHandler: (error, context, data) => {
    console.error('Reactive error:', error);
  }
});
```

### State Instance Methods

#### `state.$computed(key, computeFn)`
Adds a computed property to the state.

**Parameters:**
- `key` (String): Property name
- `computeFn` (Function): Function that computes the value

**Returns:** The state object (chainable)

```javascript
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});
```

#### `state.$watch(keyOrFn, callback)`
Watches a property or computed value for changes.

**Parameters:**
- `keyOrFn` (String|Function): Property key or computed function
- `callback` (Function): Callback with `(newValue, oldValue)` parameters

**Returns:** Unwatch function

```javascript
const unwatch = state.$watch('count', (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`);
});

// Stop watching
unwatch();
```

#### `state.$notify(key)`
Manually notifies watchers of a property change.

**Parameters:**
- `key` (String, optional): Property to notify. If omitted, notifies all.

```javascript
state.$notify('count');
state.$notify(); // Notify all
```

#### `state.$raw`
Gets the raw (non-reactive) underlying object.

**Returns:** Raw object

```javascript
const rawState = state.$raw;
```

#### `state.$batch(fn)`
Batches updates on this state.

**Parameters:**
- `fn` (Function): Function containing state updates

**Returns:** Return value of `fn`

```javascript
state.$batch(() => {
  state.count = 1;
  state.name = 'John';
});
```

#### `state.$debug(label)`
Logs debug information about the state.

**Parameters:**
- `label` (String, optional): Label for the debug output

```javascript
state.$debug('My State');
```

### Collection Instance Methods

#### `collection.$add(item)`
Adds an item to the collection.

**Parameters:**
- `item` (any): Item to add

```javascript
collection.$add({ id: 1, name: 'Item' });
```

#### `collection.$remove(predicate)`
Removes an item from the collection.

**Parameters:**
- `predicate` (Function|any): Predicate function or item to remove

```javascript
collection.$remove(item => item.id === 1);
collection.$remove(specificItem);
```

#### `collection.$update(predicate, updates)`
Updates an item in the collection.

**Parameters:**
- `predicate` (Function|any): Predicate function or item to update
- `updates` (Object|Function): Updates to apply or update function

```javascript
collection.$update(item => item.id === 1, { name: 'Updated' });
collection.$update(item => item.id === 1, item => ({ ...item, done: true }));
```

#### `collection.$clear()`
Removes all items from the collection.

```javascript
collection.$clear();
```

### Form Instance Methods

#### `form.$setValue(field, value)`
Sets a form field value and marks it as touched.

**Parameters:**
- `field` (String): Field name
- `value` (any): Field value

```javascript
form.$setValue('email', 'user@example.com');
```

#### `form.$setError(field, error)`
Sets or clears a form field error.

**Parameters:**
- `field` (String): Field name
- `error` (String|null): Error message or null to clear

```javascript
form.$setError('email', 'Invalid email');
form.$setError('email', null); // Clear error
```

#### `form.$reset(newValues)`
Resets the form to initial or new values.

**Parameters:**
- `newValues` (Object, optional): New initial values

```javascript
form.$reset();
form.$reset({ email: 'new@example.com' });
```

#### Form Computed Properties

- `form.isValid` - True if no errors
- `form.isDirty` - True if any field is touched

```javascript
console.log(form.isValid);
console.log(form.isDirty);
```

### Async Instance Methods

#### `async.$execute(asyncFn)`
Executes an async function with loading/error state management.

**Parameters:**
- `asyncFn` (Function): Async function to execute

**Returns:** Promise resolving to the result

```javascript
await async.$execute(async () => {
  const response = await fetch('/api/data');
  return await response.json();
});
```

#### `async.$reset()`
Resets the async state to initial values.

```javascript
async.$reset();
```

#### Async Computed Properties

- `async.isSuccess` - True if data loaded successfully
- `async.isError` - True if error occurred

```javascript
console.log(async.isSuccess);
console.log(async.isError);
```

### Binding Methods

#### `Elements.bind(bindings)`
Binds reactive functions to elements by ID.

**Parameters:**
- `bindings` (Object): Object mapping element IDs to binding functions

```javascript
Elements.bind({
  'element-id': () => state.value,
  'styled-element': {
    textContent: () => state.text,
    style: () => ({ color: state.color })
  }
});
```

#### `Elements.unbind(id)`
Unbinds all bindings for an element by ID.

**Parameters:**
- `id` (String): Element ID

```javascript
Elements.unbind('element-id');
```

#### `Collections.bind(bindings)`
Binds reactive functions to elements by class name.

**Parameters:**
- `bindings` (Object): Object mapping class names to binding functions

```javascript
Collections.bind({
  'status-badge': () => state.status
});
```

#### `Collections.unbind(className)`
Unbinds all bindings for elements by class name.

**Parameters:**
- `className` (String): Class name

```javascript
Collections.unbind('status-badge');
```

#### `Selector.query.bind(bindings)`
Binds reactive functions to first matching element by selector.

**Parameters:**
- `bindings` (Object): Object mapping selectors to binding functions

```javascript
Selector.query.bind({
  'h1.title': () => state.title
});
```

#### `Selector.queryAll.bind(bindings)`
Binds reactive functions to all matching elements by selector.

**Parameters:**
- `bindings` (Object): Object mapping selectors to binding functions

```javascript
Selector.queryAll.bind({
  '.status-text': () => state.status
});
```

#### `Selector.query.unbind(selector)`
#### `Selector.queryAll.unbind(selector)`
Unbinds all bindings for selector.

**Parameters:**
- `selector` (String): CSS selector

```javascript
Selector.query.unbind('h1.title');
Selector.queryAll.unbind('.status-text');
```

### Debug API

#### `ReactiveState.debug.setDebugMode(enabled)`
Enables or disables debug mode.

**Parameters:**
- `enabled` (Boolean): Enable debug mode

```javascript
ReactiveState.debug.setDebugMode(true);
```

#### `ReactiveState.debug.getStateDependencies(state)`
Gets all dependencies for a reactive state.

**Parameters:**
- `state` (Object): Reactive state object

**Returns:** Object describing dependencies

```javascript
const deps = ReactiveState.debug.getStateDependencies(state);
```

#### `ReactiveState.debug.getElementBindingInfo(element)`
Gets binding information for an element.

**Parameters:**
- `element` (HTMLElement): DOM element

**Returns:** Object describing bindings

```javascript
const info = ReactiveState.debug.getElementBindingInfo(element);
```

#### `ReactiveState.debug.getReactiveStats()`
Gets current reactive system statistics.

**Returns:** Object with statistics

```javascript
const stats = ReactiveState.debug.getReactiveStats();
console.log(stats.pendingUpdates);
console.log(stats.batchDepth);
```

#### `ReactiveState.debug.debugState(state, label)`
Logs debug information about a state.

**Parameters:**
- `state` (Object): Reactive state object
- `label` (String, optional): Label for output

```javascript
ReactiveState.debug.debugState(state, 'App State');
```

---

## Complete Real-World Examples

### Example 1: Todo Application

```javascript
// State
const app = ReactiveState.create({
  todos: [
    { id: 1, text: 'Learn Reactive', done: false },
    { id: 2, text: 'Build App', done: false }
  ],
  filter: 'all', // 'all', 'active', 'completed'
  newTodoText: ''
});

// Computed properties
app.$computed('filteredTodos', function() {
  if (this.filter === 'active') {
    return this.todos.filter(t => !t.done);
  } else if (this.filter === 'completed') {
    return this.todos.filter(t => t.done);
  }
  return this.todos;
});

app.$computed('remainingCount', function() {
  return this.todos.filter(t => !t.done).length;
});

app.$computed('completedCount', function() {
  return this.todos.filter(t => t.done).length;
});

// Bindings
Elements.bind({
  'todo-list': () => {
    if (app.filteredTodos.length === 0) {
      return '<p class="empty">No todos to display</p>';
    }
    
    return app.filteredTodos.map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        <input type="checkbox" 
               class="todo-checkbox" 
               data-id="${todo.id}"
               ${todo.done ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn" data-id="${todo.id}">×</button>
      </li>
    `).join('');
  },
  
  'remaining-count': () => `${app.remainingCount} item${app.remainingCount !== 1 ? 's' : ''} left`,
  
  'filter-all': {
    classList: () => ({ active: app.filter === 'all' })
  },
  'filter-active': {
    classList: () => ({ active: app.filter === 'active' })
  },
  'filter-completed': {
    classList: () => ({ active: app.filter === 'completed' })
  },
  
  'clear-completed': {
    style: () => ({
      display: app.completedCount > 0 ? 'block' : 'none'
    }),
    textContent: () => `Clear completed (${app.completedCount})`
  },
  
  'new-todo-input': {
    value: () => app.newTodoText
  }
});

// Actions
function addTodo() {
  const text = app.newTodoText.trim();
  if (!text) return;
  
  app.todos.push({
    id: Date.now(),
    text,
    done: false
  });
  
  app.newTodoText = '';
}

function toggleTodo(id) {
  const todo = app.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
  }
}

function deleteTodo(id) {
  const index = app.todos.findIndex(t => t.id === id);
  if (index !== -1) {
    app.todos.splice(index, 1);
  }
}

function setFilter(filter) {
  app.filter = filter;
}

function clearCompleted() {
  app.todos = app.todos.filter(t => !t.done);
}

// Event listeners
document.getElementById('new-todo-input').addEventListener('input', (e) => {
  app.newTodoText = e.target.value;
});

document.getElementById('new-todo-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

document.getElementById('add-btn').addEventListener('click', addTodo);

document.getElementById('todo-list').addEventListener('change', (e) => {
  if (e.target.classList.contains('todo-checkbox')) {
    toggleTodo(parseInt(e.target.dataset.id));
  }
});

document.getElementById('todo-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    deleteTodo(parseInt(e.target.dataset.id));
  }
});

document.getElementById('filter-all').addEventListener('click', () => setFilter('all'));
document.getElementById('filter-active').addEventListener('click', () => setFilter('active'));
document.getElementById('filter-completed').addEventListener('click', () => setFilter('completed'));
document.getElementById('clear-completed').addEventListener('click', clearCompleted);
```

### Example 2: Shopping Cart

```javascript
// State
const cart = ReactiveState.create({
  items: [],
  couponCode: '',
  discount: 0
});

// Computed properties
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

cart.$computed('discountAmount', function() {
  return this.subtotal * (this.discount / 100);
});

cart.$computed('total', function() {
  return this.subtotal - this.discountAmount;
});

cart.$computed('itemCount', function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Bindings
Elements.bind({
  'cart-items': () => {
    if (cart.items.length === 0) {
      return '<p class="empty-cart">Your cart is empty</p>';
    }
    
    return cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
          <button class="qty-decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="qty-increase" data-id="${item.id}">+</button>
        </div>
        <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `).join('');
  },
  
  'cart-badge': () => cart.itemCount,
  'subtotal': () => `$${cart.subtotal.toFixed(2)}`,
  'discount-amount': () => cart.discount > 0 ? `-$${cart.discountAmount.toFixed(2)}` : '$0.00',
  'total': () => `$${cart.total.toFixed(2)}`,
  
  'discount-row': {
    style: () => ({
      display: cart.discount > 0 ? 'flex' : 'none'
    })
  },
  
  'checkout-btn': {
    disabled: () => cart.items.length === 0
  }
});

// Actions
function addToCart(product) {
  const existing = cart.items.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity++;
  } else {
    cart.items.push({
      ...product,
      quantity: 1
    });
  }
}

function updateQuantity(id, delta) {
  const item = cart.items.find(item => item.id === id);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    removeFromCart(id);
  }
}

function removeFromCart(id) {
  const index = cart.items.findIndex(item => item.id === id);
  if (index !== -1) {
    cart.items.splice(index, 1);
  }
}

function applyCoupon(code) {
  const coupons = {
    'SAVE10': 10,
    'SAVE20': 20,
    'SAVE50': 50
  };
  
  cart.discount = coupons[code.toUpperCase()] || 0;
  cart.couponCode = code;
}

function clearCart() {
  cart.items = [];
  cart.discount = 0;
  cart.couponCode = '';
}

// Event listeners
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('qty-increase')) {
    updateQuantity(parseInt(e.target.dataset.id), 1);
  } else if (e.target.classList.contains('qty-decrease')) {
    updateQuantity(parseInt(e.target.dataset.id), -1);
  } else if (e.target.classList.contains('remove-btn')) {
    removeFromCart(parseInt(e.target.dataset.id));
  }
});

document.getElementById('apply-coupon-btn').addEventListener('click', () => {
  const code = document.getElementById('coupon-input').value;
  applyCoupon(code);
});
```

### Example 3: User Dashboard with API

```javascript
// States
const user = ReactiveState.async(null);
const posts = ReactiveState.async([]);
const notifications = ReactiveState.async([]);

const ui = ReactiveState.create({
  activeTab: 'posts', // 'posts', 'profile', 'settings'
  theme: 'light',
  sidebarOpen: true
});

// Load user data
async function loadUserData(userId) {
  await Promise.all([
    user.$execute(async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to load user');
      return await res.json();
    }),
    
    posts.$execute(async () => {
      const res = await fetch(`/api/users/${userId}/posts`);
      if (!res.ok) throw new Error('Failed to load posts');
      return await res.json();
    }),
    
    notifications.$execute(async () => {
      const res = await fetch(`/api/users/${userId}/notifications`);
      if (!res.ok) throw new Error('Failed to load notifications');
      return await res.json();
    })
  ]);
}

// Computed
user.$computed('unreadNotifications', function() {
  if (!notifications.data) return 0;
  return notifications.data.filter(n => !n.read).length;
});

// Bindings
Elements.bind({
  'user-avatar': {
    src: () => user.data?.avatar || '/default-avatar.png',
    alt: () => user.data?.name || 'User'
  },
  
  'user-name': () => {
    if (user.loading) return 'Loading...';
    if (user.error) return 'Error';
    return user.data?.name || 'Guest';
  },
  
  'notification-badge': {
    textContent: () => user.unreadNotifications,
    style: () => ({
      display: user.unreadNotifications > 0 ? 'block' : 'none'
    })
  },
  
  'posts-content': () => {
    if (posts.loading) return '<div class="loader">Loading posts...</div>';
    if (posts.error) return `<div class="error">${posts.error.message}</div>`;
    if (!posts.data || posts.data.length === 0) {
      return '<p class="empty">No posts yet</p>';
    }
    
    return posts.data.map(post => `
      <article class="post">
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <time>${new Date(post.createdAt).toLocaleDateString()}</time>
      </article>
    `).join('');
  },
  
  'main-content': {
    classList: () => ({
      'sidebar-open': ui.sidebarOpen,
      [`theme-${ui.theme}`]: true
    })
  }
});

// Tab switching
Collections.bind({
  'tab-btn': {
    classList: function() {
      const tabName = this.dataset.tab;
      return { active: ui.activeTab === tabName };
    }
  }
});

// Event listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    ui.activeTab = e.target.dataset.tab;
  });
});

document.getElementById('toggle-sidebar').addEventListener('click', () => {
  ui.sidebarOpen = !ui.sidebarOpen;
});

document.getElementById('toggle-theme').addEventListener('click', () => {
  ui.theme = ui.theme === 'light' ? 'dark' : 'light';
});

// Initial load
loadUserData(123);

// Auto-refresh notifications every 30 seconds
setInterval(() => {
  if (user.data) {
    notifications.$execute(async () => {
      const res = await fetch(`/api/users/${user.data.id}/notifications`);
      return await res.json();
    });
  }
}, 30000);
```

---

## Conclusion

The **DOM Helpers Reactive Module** provides a powerful yet simple way to build reactive applications. Key takeaways:

1. **Create reactive state** with `ReactiveState.create()`
2. **Use computed properties** for derived values
3. **Batch updates** for performance
4. **Watch for changes** with `$watch()`
5. **Use helper methods** (Collection, Form, Async) for common patterns
6. **Bind to DOM** with `Elements.bind()`, `Collections.bind()`, `Selector.bind()`
7. **Debug easily** with built-in debug utilities
8. **Follow best practices** for optimal performance

The module handles dependency tracking, memory management, and DOM updates automatically, letting you focus on building your application logic.

For more examples and updates, visit the documentation or check the test suite.

---

**Version:** 2.0.0  
**License:** MIT  
**Author:** DOM Helpers Team