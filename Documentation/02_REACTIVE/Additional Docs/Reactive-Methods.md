[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Reactive - Complete Methods Reference

**Version 2.0.2** | **Comprehensive API Documentation**

This document provides detailed documentation for every method, property, and feature available in the DOM Helpers Reactive library.

---

## 📑 Table of Contents

1. [State Creation Methods](#state-creation-methods)
2. [Instance Methods](#instance-methods)
3. [Computed Properties](#computed-properties)
4. [Watchers](#watchers)
5. [Effects](#effects)
6. [DOM Bindings](#dom-bindings)
7. [Refs](#refs)
8. [Collections](#collections)
9. [Forms](#forms)
10. [Async State](#async-state)
11. [Stores](#stores)
12. [Components](#components)
13. [Fluent Builder API](#fluent-builder-api)
14. [Utility Methods](#utility-methods)
15. [Integration APIs](#integration-apis)

---

## State Creation Methods

### `Elements.state(initialState)`
### `Collections.state(initialState)`
### `Selector.state(initialState)`

Creates a reactive state object that automatically tracks changes and updates bindings.

**Parameters:**
- `initialState` (Object) - The initial state object

**Returns:**
- Reactive proxy object with instance methods

**Features:**
- Deep reactivity for nested objects and arrays
- Automatic dependency tracking
- Instance methods ($computed, $watch, $batch, $notify, $raw)

**Example:**

```javascript
// Basic state
const state = Elements.state({
  count: 0,
  message: 'Hello'
});

// Nested state (deep reactivity)
const appState = Elements.state({
  user: {
    profile: {
      name: 'John',
      email: 'john@example.com'
    },
    preferences: {
      theme: 'light',
      language: 'en'
    }
  },
  items: [1, 2, 3]
});

// All modifications are tracked
state.count++;                          // Triggers updates
appState.user.profile.name = 'Jane';    // Deep reactivity
appState.items.push(4);                 // Array mutations tracked
```

**Best Practices:**

```javascript
// ✅ Good - Flat, simple structure
const state = Elements.state({
  username: '',
  email: '',
  isLoggedIn: false
});

// ✅ Good - Organized nested structure
const state = Elements.state({
  user: { name: '', email: '' },
  ui: { loading: false, error: null }
});

// ⚠️ Avoid - Too deeply nested
const state = Elements.state({
  app: {
    module: {
      feature: {
        data: {
          value: 'hard to access'
        }
      }
    }
  }
});
```

---

### `ReactiveState.create(initialState)`

Alias for creating reactive state without DOM Helpers integration.

**Parameters:**
- `initialState` (Object) - The initial state object

**Returns:**
- Reactive proxy object

**Example:**

```javascript
// Works without DOM Helpers core library
const state = ReactiveState.create({
  count: 0
});

// Has all instance methods
state.$computed('doubled', function() {
  return this.count * 2;
});
```

**Use Cases:**
- When using as a standalone library
- Server-side usage (Node.js)
- Testing environments

---

## Instance Methods

All reactive states have these methods available:

### `state.$computed(key, computeFn)`

Adds a computed property to the reactive state.

**Parameters:**
- `key` (String) - The property name
- `computeFn` (Function) - The computation function (called with `this` as the state)

**Returns:**
- The state object (for chaining)

**Example:**

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
});

// Add computed properties
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

state.$computed('isAdult', function() {
  return this.age >= 18;
});

// Use computed properties
console.log(state.fullName);  // "John Doe"
console.log(state.isAdult);   // true

// Computed updates automatically
state.firstName = 'Jane';
console.log(state.fullName);  // "Jane Doe"
```

**Chaining:**

```javascript
state
  .$computed('doubled', function() {
    return this.count * 2;
  })
  .$computed('squared', function() {
    return this.count ** 2;
  });
```

**Important Notes:**
- Computed properties are cached and only recalculate when dependencies change
- Don't modify state inside computed functions (will cause infinite loops)
- Can depend on other computed properties
- Always use `function() {}` syntax to access `this`

---

### `state.$watch(keyOrFunction, callback)`

Watches for changes to a specific property or computed value.

**Parameters:**
- `keyOrFunction` (String | Function) - Property name or function to watch
- `callback` (Function) - Called with `(newValue, oldValue)` when value changes

**Returns:**
- Cleanup function to stop watching

**Example:**

```javascript
const state = Elements.state({
  count: 0,
  message: 'Hello'
});

// Watch a property
const unwatch = state.$watch('count', (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

state.count = 10; // Logs: "Count changed from 0 to 10"

// Stop watching
unwatch();

// Watch a computed value
state.$watch(() => state.count * 2, (newVal, oldVal) => {
  console.log(`Doubled changed from ${oldVal} to ${newVal}`);
});

state.count = 5; // Logs: "Doubled changed from 20 to 10"
```

**Common Use Cases:**

```javascript
// Sync to localStorage
state.$watch('user', (newUser) => {
  localStorage.setItem('user', JSON.stringify(newUser));
});

// Track navigation
state.$watch('currentPage', (newPage, oldPage) => {
  console.log(`Navigated from ${oldPage} to ${newPage}`);
  // Analytics tracking
});

// Validate on change
state.$watch('email', (email) => {
  if (!email.includes('@')) {
    state.errors.email = 'Invalid email';
  } else {
    delete state.errors.email;
  }
});
```

---

### `state.$batch(fn)`

Batch multiple state changes to trigger only one update.

**Parameters:**
- `fn` (Function) - Function containing state changes (called with `this` as state)

**Returns:**
- Return value of `fn`

**Example:**

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  city: 'New York'
});

// Without batching - 4 updates
state.firstName = 'Jane';
state.lastName = 'Smith';
state.age = 25;
state.city = 'Los Angeles';

// With batching - 1 update
state.$batch(function() {
  this.firstName = 'Jane';
  this.lastName = 'Smith';
  this.age = 25;
  this.city = 'Los Angeles';
});
```

**Performance Impact:**

```javascript
// Slow - 1000 individual updates
for (let i = 0; i < 1000; i++) {
  state.items.push(i);
}

// Fast - 1 batched update
state.$batch(function() {
  for (let i = 0; i < 1000; i++) {
    this.items.push(i);
  }
});
```

---

### `state.$notify(key?)`

Manually trigger updates for a property or all properties.

**Parameters:**
- `key` (String, optional) - Specific property to notify, or all if omitted

**Returns:**
- undefined

**Example:**

```javascript
const state = Elements.state({
  data: { count: 0 }
});

// Modify without triggering (bypassing proxy)
const raw = Elements.toRaw(state.data);
raw.count = 100;

// Manually trigger update
state.$notify('data');

// Notify all properties
state.$notify();
```

**Use Cases:**
- After modifying raw objects
- Force re-render when using external libraries
- Debugging reactive issues

---

### `state.$raw`

Property that returns the non-reactive raw object.

**Type:** Getter property

**Returns:**
- Non-reactive version of the state

**Example:**

```javascript
const state = Elements.state({
  user: { name: 'John' }
});

// Get raw object
const raw = state.$raw;

// Modifications don't trigger updates
raw.user.name = 'Jane'; // No update triggered

// Check if reactive
console.log(Elements.isReactive(state));      // true
console.log(Elements.isReactive(state.$raw)); // false
```

**Use Cases:**
- Passing to external libraries that don't need reactivity
- Performance optimization for read-only operations
- Debugging

---

## Computed Properties

### `Elements.computed(state, computedDefs)`
### `Collections.computed(state, computedDefs)`
### `Selector.computed(state, computedDefs)`

Adds multiple computed properties to a reactive state.

**Parameters:**
- `state` (Object) - Reactive state object
- `computedDefs` (Object) - Object mapping property names to computation functions

**Returns:**
- The state object (for chaining)

**Example:**

```javascript
const state = Elements.state({
  price: 100,
  quantity: 2,
  taxRate: 0.1,
  discountPercent: 10
});

Elements.computed(state, {
  subtotal: () => state.price * state.quantity,
  
  discount: () => state.subtotal * (state.discountPercent / 100),
  
  subtotalAfterDiscount: () => state.subtotal - state.discount,
  
  tax: () => state.subtotalAfterDiscount * state.taxRate,
  
  total: () => state.subtotalAfterDiscount + state.tax
});

console.log(state.total); // 198
state.quantity = 3;
console.log(state.total); // 297 (automatically updated)
```

**Nested Dependencies:**

```javascript
const state = Elements.state({
  users: [
    { name: 'John', active: true },
    { name: 'Jane', active: false },
    { name: 'Bob', active: true }
  ]
});

Elements.computed(state, {
  // Depends on users
  activeUsers: () => state.users.filter(u => u.active),
  
  // Depends on activeUsers computed
  activeCount: () => state.activeUsers.length,
  
  // Depends on activeCount computed
  hasActiveUsers: () => state.activeCount > 0
});
```

**Performance:**

```javascript
// ❌ Bad - Recalculates every time
Elements.bindings({
  '#total': () => {
    // This calculation runs on every render
    return state.items.reduce((sum, item) => sum + item.price, 0);
  }
});

// ✅ Good - Cached computed
Elements.computed(state, {
  total: () => state.items.reduce((sum, item) => sum + item.price, 0)
});

Elements.bindings({
  '#total': () => state.total // Only recalculates when items change
});
```

---

## Watchers

### `Elements.watch(state, watchDefs)`
### `Collections.watch(state, watchDefs)`
### `Selector.watch(state, watchDefs)`

Creates multiple watchers for state properties.

**Parameters:**
- `state` (Object) - Reactive state object
- `watchDefs` (Object) - Object mapping property names to callback functions

**Returns:**
- Cleanup function to remove all watchers

**Example:**

```javascript
const state = Elements.state({
  theme: 'light',
  language: 'en',
  fontSize: 14
});

const unwatch = Elements.watch(state, {
  theme: (newTheme, oldTheme) => {
    console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
    document.body.className = `theme-${newTheme}`;
  },
  
  language: (newLang) => {
    document.documentElement.lang = newLang;
    loadTranslations(newLang);
  },
  
  fontSize: (newSize) => {
    document.documentElement.style.fontSize = `${newSize}px`;
  }
});

// Later, stop all watchers
unwatch();
```

**Real-World Examples:**

```javascript
// Persist to localStorage
Elements.watch(state, {
  user: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  preferences: (prefs) => {
    localStorage.setItem('preferences', JSON.stringify(prefs));
  }
});

// API synchronization
Elements.watch(state, {
  todoItems: async (items) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify(items)
    });
  }
});

// Validation
Elements.watch(state, {
  email: (email) => {
    state.errors.email = validateEmail(email) ? null : 'Invalid email';
  },
  
  password: (pwd) => {
    state.errors.password = pwd.length >= 8 ? null : 'Too short';
  }
});
```

---

## Effects

### `Elements.effect(effectFn)`
### `Collections.effect(effectFn)`
### `Selector.effect(effectFn)`

Creates a reactive effect that automatically reruns when dependencies change.

**Parameters:**
- `effectFn` (Function) - Function to execute reactively

**Returns:**
- Cleanup function to stop the effect

**Example:**

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  theme: 'light'
});

// Effect automatically tracks dependencies
const cleanup = Elements.effect(() => {
  // These properties are automatically tracked
  document.title = `${state.firstName} ${state.lastName}`;
  document.body.className = `theme-${state.theme}`;
  
  console.log('Effect ran!');
});

state.firstName = 'Jane'; // Effect runs
state.theme = 'dark';     // Effect runs

// Stop the effect
cleanup();
```

**Side Effects:**

```javascript
// Update DOM
Elements.effect(() => {
  document.getElementById('status').textContent = 
    state.isOnline ? 'Online' : 'Offline';
});

// Sync to localStorage
Elements.effect(() => {
  localStorage.setItem('appState', JSON.stringify({
    theme: state.theme,
    language: state.language
  }));
});

// External library integration
Elements.effect(() => {
  if (chartInstance) {
    chartInstance.updateData(state.chartData);
  }
});
```

---

### `Elements.effects(effectDefs)`
### `Collections.effects(effectDefs)`
### `Selector.effects(effectDefs)`

Creates multiple named effects.

**Parameters:**
- `effectDefs` (Object) - Object mapping effect names to functions

**Returns:**
- Cleanup function to remove all effects

**Example:**

```javascript
const state = Elements.state({
  count: 0,
  message: 'Hello'
});

const cleanup = Elements.effects({
  updateTitle: () => {
    document.title = `Count: ${state.count}`;
  },
  
  logChanges: () => {
    console.log(`Message: ${state.message}, Count: ${state.count}`);
  },
  
  saveState: () => {
    localStorage.setItem('state', JSON.stringify({
      count: state.count,
      message: state.message
    }));
  }
});

// All effects run when dependencies change
state.count++; // All three effects run

// Stop all effects
cleanup();
```

---

## DOM Bindings

### `Elements.bindings(bindingDefs)`

Creates declarative DOM bindings that auto-update when state changes.

**Parameters:**
- `bindingDefs` (Object) - Object mapping selectors to binding functions or objects

**Returns:**
- Cleanup function to remove all bindings

**Selector Types:**
- `#id` - By element ID
- `.class` - By class name (multiple elements)
- `tag` or `[attr]` or any CSS selector - Query selector

**Binding Types:**

1. **Simple Function** - Updates element's textContent
2. **Object** - Updates specific properties

**Example:**

```javascript
const state = Elements.state({
  username: 'John',
  email: 'john@example.com',
  isOnline: true,
  theme: 'light'
});

const cleanup = Elements.bindings({
  // By ID - updates textContent
  '#username': () => state.username,
  
  // By class - updates all matching elements
  '.user-email': () => state.email,
  
  // By selector - updates specific properties
  'input[name="username"]': {
    value: () => state.username,
    disabled: () => !state.isOnline
  },
  
  // Multiple properties
  '#status-indicator': {
    textContent: () => state.isOnline ? 'Online' : 'Offline',
    className: () => `status ${state.isOnline ? 'online' : 'offline'}`,
    style: () => ({
      backgroundColor: state.isOnline ? 'green' : 'red',
      color: 'white'
    })
  },
  
  // Complex selector
  'body': {
    className: () => `theme-${state.theme}`
  }
});

// Later, remove bindings
cleanup();
```

**Value Types:**

```javascript
Elements.bindings({
  // Strings, numbers, booleans
  '#text': () => 'Hello',
  '#count': () => 42,
  '#active': () => true,
  
  // Arrays
  '#list': () => ['item1', 'item2', 'item3'], // Joins with ", "
  '#classes': {
    classList: () => ['btn', 'primary', state.isActive && 'active']
  },
  
  // Objects
  '#styled': {
    style: () => ({
      color: state.textColor,
      fontSize: `${state.fontSize}px`,
      fontWeight: state.isBold ? 'bold' : 'normal'
    }),
    dataset: () => ({
      userId: state.currentUserId,
      theme: state.theme
    })
  },
  
  // Object spread (multiple properties at once)
  '#element': () => ({
    textContent: state.message,
    className: state.className,
    title: state.tooltip,
    style: { color: state.color }
  })
});
```

**Conditional Rendering:**

```javascript
Elements.bindings({
  '#error-message': {
    textContent: () => state.error || '',
    style: () => ({
      display: state.error ? 'block' : 'none',
      color: 'red'
    })
  },
  
  '#loading-spinner': {
    style: () => ({
      display: state.isLoading ? 'block' : 'none'
    })
  },
  
  '#submit-button': {
    disabled: () => !state.isValid || state.isSubmitting,
    textContent: () => state.isSubmitting ? 'Submitting...' : 'Submit'
  }
});
```

---

### `Elements.bind(bindingDefs)`

Binds to elements by ID (convenience method).

**Parameters:**
- `bindingDefs` (Object) - Object mapping element IDs to binding functions/objects

**Example:**

```javascript
const state = Elements.state({ count: 0, message: 'Hello' });

// Bind by ID (no # prefix needed)
Elements.bind({
  counter: () => state.count,
  message: () => state.message,
  display: {
    textContent: () => `${state.message}: ${state.count}`,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});
```

---

### `Collections.bind(bindingDefs)`

Binds to elements by class name.

**Parameters:**
- `bindingDefs` (Object) - Object mapping class names to binding functions/objects

**Example:**

```javascript
// Bind to all elements with these classes
Collections.bind({
  'user-name': () => state.user.name,
  'user-email': () => state.user.email,
  'status-indicator': {
    className: () => state.isOnline ? 'online' : 'offline',
    textContent: () => state.isOnline ? '●' : '○'
  }
});
```

---

### `Selector.query.bind(bindingDefs)`

Binds to the first matching element for each selector.

**Parameters:**
- `bindingDefs` (Object) - Object mapping CSS selectors to binding functions/objects

**Example:**

```javascript
Selector.query.bind({
  'input[name="username"]': {
    value: () => state.username
  },
  '.main-heading': () => state.pageTitle,
  '[data-user-id]': {
    dataset: () => ({ userId: state.currentUser.id })
  }
});
```

---

### `Selector.queryAll.bind(bindingDefs)`

Binds to all matching elements for each selector.

**Parameters:**
- `bindingDefs` (Object) - Object mapping CSS selectors to binding functions/objects

**Example:**

```javascript
// Updates ALL matching elements
Selector.queryAll.bind({
  '.price': () => `$${state.currentPrice.toFixed(2)}`,
  '[data-theme]': {
    dataset: () => ({ theme: state.theme })
  },
  '.loading-indicator': {
    style: () => ({ display: state.isLoading ? 'block' : 'none' })
  }
});
```

---

## Refs

### `Elements.ref(initialValue)`
### `Collections.ref(initialValue)`
### `Selector.ref(initialValue)`

Creates a reactive reference to a single value.

**Parameters:**
- `initialValue` (any) - The initial value

**Returns:**
- Reactive ref object with `.value` property

**Example:**

```javascript
const count = Elements.ref(0);
const message = Elements.ref('Hello');
const user = Elements.ref({ name: 'John' });

// Access and modify via .value
console.log(count.value); // 0
count.value++;
console.log(count.value); // 1

// Use in bindings
Elements.bindings({
  '#count': () => count.value,
  '#message': () => message.value,
  '#username': () => user.value.name
});

// Refs auto-unwrap in operations
console.log(count + 5); // 6
console.log(count.toString()); // "1"
```

**When to Use Refs:**

```javascript
// ✅ Good for single values
const counter = Elements.ref(0);
const isVisible = Elements.ref(false);
const currentPage = Elements.ref('home');

// ⚠️ For multiple related values, use state instead
// Less ideal
const firstName = Elements.ref('John');
const lastName = Elements.ref('Doe');
const age = Elements.ref(30);

// Better
const user = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
});
```

---

### `Elements.refs(refDefs)`
### `Collections.refs(refDefs)`
### `Selector.refs(refDefs)`

Creates multiple refs at once.

**Parameters:**
- `refDefs` (Object) - Object mapping ref names to initial values

**Returns:**
- Object with ref properties

**Example:**

```javascript
const { count, message, isVisible } = Elements.refs({
  count: 0,
  message: 'Hello',
  isVisible: true
});

// Use the refs
count.value++;
message.value = 'Updated';
isVisible.value = false;

// Bind multiple refs
Elements.bindings({
  '#count': () => count.value,
  '#message': () => message.value,
  '#panel': {
    style: () => ({ display: isVisible.value ? 'block' : 'none' })
  }
});
```

---

## Collections

### `Elements.list(initialItems)`
### `Collections.list(initialItems)`
### `Selector.list(initialItems)`

Alias for `ReactiveState.collection()`. Creates a reactive collection/array with helper methods.

**Parameters:**
- `initialItems` (Array, optional) - Initial array items (default: [])

**Returns:**
- Reactive collection object with `.items` array and helper methods

**Methods:**
- `$add(item)` - Add item to end
- `$remove(predicate)` - Remove item by predicate or value
- `$update(predicate, updates)` - Update item
- `$clear()` - Remove all items

**Example:**

```javascript
const todos = Elements.list([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

// Add item
todos.$add({ id: 3, text: 'Read book', done: false });

// Remove by predicate
todos.$remove(todo => todo.id === 2);

// Remove by value
const itemToRemove = todos.items[0];
todos.$remove(itemToRemove);

// Update item
todos.$update(
  todo => todo.id === 1,
  { done: true, text: 'Buy milk and eggs' }
);

// Clear all
todos.$clear();

// Access items array
console.log(todos.items);
todos.items.push({ id: 4, text: 'New item', done: false });
```

**With Bindings:**

```javascript
const todoList = Elements.list([]);

Elements.bindings({
  '#todo-list': {
    innerHTML: () => todoList.items.map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        <input type="checkbox" 
               ${todo.done ? 'checked' : ''}
               onchange="todoList.$update(t => t.id === ${todo.id}, { done: !${todo.done} })">
        <span>${todo.text}</span>
        <button onclick="todoList.$remove(t => t.id === ${todo.id})">×</button>
      </li>
    `).join('')
  },
  '#count': () => `${todoList.items.length} items`
});
```

---

## Forms

### `ReactiveState.form(initialValues)`

Creates reactive form state with validation support.

**Parameters:**
- `initialValues` (Object) - Initial form field values

**Returns:**
- Reactive form object with properties and methods

**Properties:**
- `values` (Object) - Form field values
- `errors` (Object) - Validation errors
- `touched` (Object) - Touched fields
- `isSubmitting` (Boolean) - Submission state
- `isValid` (Boolean, computed) - True if no errors
- `isDirty` (Boolean, computed) - True if any field touched

**Methods:**
- `$setValue(field, value)` - Set field value and mark as touched
- `$setError(field, error)` - Set or clear field error
- `$reset(newValues?)` - Reset form

**Example:**

```javascript
const signupForm = ReactiveState.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Bind to inputs
document.getElementById('username').addEventListener('input', (e) => {
  signupForm.$setValue('username', e.target.value);
  
  // Validate
  if (e.target.value.length < 3) {
    signupForm.$setError('username', 'Username too short');
  } else {
    signupForm.$setError('username', null);
  }
});

document.getElementById('email').addEventListener('input', (e) => {
  signupForm.$setValue('email', e.target.value);
  
  if (!e.target.value.includes('@')) {
    signupForm.$setError('email', 'Invalid email');
  } else {
    signupForm.$setError('email', null);
  }
});

// Bind error messages
Elements.bindings({
  '#username-error': () => signupForm.errors.username || '',
  '#email-error': () => signupForm.errors.email || '',
  
  // Disable submit if invalid
  '#submit-btn': {
    disabled: () => !signupForm.isValid || signupForm.isSubmitting
  },
  
  // Show dirty indicator
  '#dirty-indicator': {
    style: () => ({
      display: signupForm.isDirty ? 'inline' : 'none'
    })
  }
});

// Handle submit
async function handleSubmit(e) {
  e.preventDefault();
  
  if (!signupForm.isValid) return;
  
  signupForm.isSubmitting = true;
  
  try {
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(signupForm.values)
    });
    
    alert('Signup successful!');
    signupForm.$reset();
  } catch (error) {
    signupForm.$setError('form', error.message);
  } finally {
    signupForm.isSubmitting = false;
  }
}
```

**Validation Example:**

```javascript
const form = ReactiveState.form({
  username: '',
  email: '',
  password: ''
});

// Validation rules
const validators = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers, and underscores allowed';
    return null;
  },
  
  email: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
    return null;
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
    if (!/[0-9]/.test(value)) return 'Must contain number';
    return null;
  }
};

// Watch form values and validate
Elements.watch(form, {
  values: (values) => {
    Object.entries(validators).forEach(([field, validator]) => {
      const error = validator(values[field]);
      form.$setError(field, error);
    });
  }
});
```

---

## Async State

### `ReactiveState.async(initialValue)`

Creates reactive state for managing async operations.

**Parameters:**
- `initialValue` (any, optional) - Initial data value (default: null)

**Returns:**
- Reactive async state object

**Properties:**
- `data` (any) - The fetched data
- `loading` (Boolean) - True while loading
- `error` (Error | null) - Error object if failed
- `isSuccess` (Boolean, computed) - True if loaded successfully
- `isError` (Boolean, computed) - True if error occurred

**Methods:**
- `$execute(asyncFn)` - Execute async function and track state
- `$reset()` - Reset to initial state

**Example:**

```javascript
const userData = ReactiveState.async(null);

// Load user data
async function loadUser(userId) {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to load user');
    return response.json();
  });
}

// Bind to UI
Elements.bindings({
  '#user-name': () => {
    if (userData.loading) return 'Loading...';
    if (userData.error) return `Error: ${userData.error.message}`;
    if (userData.data) return userData.data.name;
    return 'No user loaded';
  },
  
  '#loading-spinner': {
    style: () => ({
      display: userData.loading ? 'block' : 'none'
    })
  },
  
  '#error-message': {
    textContent: () => userData.error?.message || '',
    style: () => ({
      display: userData.error ? 'block' : 'none',
      color: 'red'
    })
  },
  
  '#content': {
    style: () => ({
      display: userData.isSuccess ? 'block' : 'none'
    })
  }
});

// Use it
await loadUser(123);

// Reset
userData.$reset();
```

**Real-World Example - API Calls:**

```javascript
const apiState = ReactiveState.async(null);

async function fetchData(endpoint) {
  await apiState.$execute(async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  });
}

// Use with retry logic
async function fetchWithRetry(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await fetchData(endpoint);
      break;
    } catch (error) {
      if (i === retries - 1) {
        console.error('All retries failed');
      } else {
        console.log(`Retry ${i + 1}/${retries}`);
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
}
```

---

## Stores

### `Elements.store(initialState, options)`
### `Collections.store(initialState, options)`
### `Selector.store(initialState, options)`

Creates a Vuex-like store with actions and getters.

**Parameters:**
- `initialState` (Object) - Initial state
- `options` (Object) - Configuration options
  - `getters` (Object) - Computed properties (getters)
  - `actions` (Object) - Action methods
  - `mutations` (Object, optional) - Mutation methods

**Returns:**
- Store instance

**Example:**

```javascript
const userStore = Elements.store(
  // Initial state
  {
    users: [],
    currentUser: null,
    loading: false,
    error: null
  },
  
  // Options
  {
    // Getters (computed properties)
    getters: {
      isLoggedIn: function() {
        return this.currentUser !== null;
      },
      
      userName: function() {
        return this.currentUser?.name || 'Guest';
      },
      
      userCount: function() {
        return this.users.length;
      },
      
      activeUsers: function() {
        return this.users.filter(u => u.active);
      }
    },
    
    // Actions (can be async)
    actions: {
      async fetchUsers(store) {
        store.loading = true;
        store.error = null;
        
        try {
          const response = await fetch('/api/users');
          store.users = await response.json();
        } catch (error) {
          store.error = error.message;
        } finally {
          store.loading = false;
        }
      },
      
      async login(store, credentials) {
        store.loading = true;
        
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          });
          
          store.currentUser = await response.json();
        } catch (error) {
          store.error = error.message;
          throw error;
        } finally {
          store.loading = false;
        }
      },
      
      logout(store) {
        store.currentUser = null;
      },
      
      addUser(store, user) {
        store.users.push(user);
      }
    },
    
    // Mutations (optional, for strict mode)
    mutations: {
      SET_USER(store, user) {
        store.currentUser = user;
      },
      
      SET_LOADING(store, loading) {
        store.loading = loading;
      },
      
      ADD_USER(store, user) {
        store.users.push(user);
      }
    }
  }
);

// Use actions
await userStore.fetchUsers();
await userStore.login({ email: 'user@example.com', password: 'pass123' });

// Use getters
console.log(userStore.isLoggedIn); // true
console.log(userStore.userName); // "John Doe"
console.log(userStore.userCount); // 5

// Use mutations (if defined)
userStore.$commit('SET_LOADING', true);
```

**Shopping Cart Store Example:**

```javascript
const cartStore = Elements.store(
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
      },
      
      clear(store) {
        store.items = [];
      },
      
      async checkout(store) {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          body: JSON.stringify({
            items: store.items,
            total: store.total
          })
        });
        
        if (response.ok) {
          store.clear();
        }
      }
    }
  }
);
```

---

## Components

### `Elements.component(config)`
### `Collections.component(config)`
### `Selector.component(config)`

Creates a self-contained component with state, computed, watchers, effects, bindings, and actions.

**Parameters:**
- `config` (Object) - Component configuration
  - `state` (Object) - Initial state
  - `computed` (Object, optional) - Computed properties
  - `watch` (Object, optional) - Watchers
  - `effects` (Object, optional) - Effects
  - `bindings` (Object, optional) - DOM bindings
  - `actions` (Object, optional) - Action methods
  - `mounted` (Function, optional) - Lifecycle hook called after creation
  - `unmounted` (Function, optional) - Lifecycle hook called on destroy

**Returns:**
- Component instance with `$destroy()` method

**Example:**

```javascript
const counterApp = Elements.component({
  // State
  state: {
    count: 0,
    step: 1,
    history: []
  },
  
  // Computed properties
  computed: {
    doubled: () => counterApp.count * 2,
    squared: () => counterApp.count ** 2,
    isEven: () => counterApp.count % 2 === 0,
    display: () => `Count: ${counterApp.count}`
  },
  
  // Watchers
  watch: {
    count: (newVal, oldVal) => {
      console.log(`Count changed: ${oldVal} → ${newVal}`);
      counterApp.history.push({
        from: oldVal,
        to: newVal,
        timestamp: Date.now()
      });
    }
  },
  
  // Effects
  effects: {
    updateTitle: () => {
      document.title = `Count: ${counterApp.count}`;
    },
    
    saveToStorage: () => {
      localStorage.setItem('count', counterApp.count);
    }
  },
  
  // DOM bindings
  bindings: {
    '#count-display': () => counterApp.count,
    '#doubled-display': () => counterApp.doubled,
    '#squared-display': () => counterApp.squared,
    '#status': {
      textContent: () => counterApp.isEven ? 'Even' : 'Odd',
      className: () => `status ${counterApp.isEven ? 'even' : 'odd'}`
    },
    '#history': {
      innerHTML: () => counterApp.history
        .slice(-5)
        .map(h => `<li>${h.from} → ${h.to}</li>`)
        .join('')
    }
  },
  
  // Actions
  actions: {
    increment(state, amount) {
      state.count += amount || state.step;
    },
    
    decrement(state, amount) {
      state.count -= amount || state.step;
    },
    
    reset(state) {
      state.count = 0;
      state.history = [];
    },
    
    setStep(state, step) {
      state.step = step;
    }
  },
  
  // Lifecycle hooks
  mounted() {
    console.log('Counter component mounted');
    
    // Load from localStorage
    const saved = localStorage.getItem('count');
    if (saved) {
      this.count = parseInt(saved);
    }
  },
  
  unmounted() {
    console.log('Counter component destroyed');
  }
});

// Use the component
counterApp.increment();      // count++
counterApp.increment(5);     // count += 5
counterApp.setStep(2);       // step = 2
counterApp.reset();          // count = 0

// Access computed
console.log(counterApp.doubled);

// Destroy component
counterApp.$destroy();
```

**Todo List Component:**

```javascript
const todoApp = Elements.component({
  state: {
    todos: [],
    filter: 'all',
    newTodoText: ''
  },
  
  computed: {
    filteredTodos: () => {
      if (todoApp.filter === 'active') {
        return todoApp.todos.filter(t => !t.done);
      }
      if (todoApp.filter === 'completed') {
        return todoApp.todos.filter(t => t.done);
      }
      return todoApp.todos;
    },
    
    stats: () => ({
      total: todoApp.todos.length,
      active: todoApp.todos.filter(t => !t.done).length,
      completed: todoApp.todos.filter(t => t.done).length
    })
  },
  
  effects: {
    syncStorage: () => {
      localStorage.setItem('todos', JSON.stringify(todoApp.todos));
    }
  },
  
  bindings: {
    '#todo-list': {
      innerHTML: () => todoApp.filteredTodos.map((todo, i) => `
        <li class="${todo.done ? 'done' : ''}">
          <input type="checkbox" ${todo.done ? 'checked' : ''}
                 onchange="todoApp.toggle(${i})">
          <span>${todo.text}</span>
          <button onclick="todoApp.remove(${i})">×</button>
        </li>
      `).join('')
    },
    
    '#stats': () => 
      `${todoApp.stats.active} of ${todoApp.stats.total} remaining`
  },
  
  actions: {
    add(state) {
      if (state.newTodoText.trim()) {
        state.todos.push({
          id: Date.now(),
          text: state.newTodoText.trim(),
          done: false
        });
        state.newTodoText = '';
      }
    },
    
    toggle(state, index) {
      state.todos[index].done = !state.todos[index].done;
    },
    
    remove(state, index) {
      state.todos.splice(index, 1);
    },
    
    setFilter(state, filter) {
      state.filter = filter;
    }
  },
  
  mounted() {
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos = JSON.parse(saved);
    }
  }
});
```

---

## Fluent Builder API

### `Elements.reactive(initialState)`
### `Collections.reactive(initialState)`
### `Selector.reactive(initialState)`

Creates a fluent builder for chaining reactive operations.

**Methods:**
- `.computed(defs)` - Add computed properties
- `.watch(defs)` - Add watchers
- `.effect(fn)` - Add effect
- `.bind(defs)` - Add DOM bindings
- `.action(name, fn)` - Add single action
- `.actions(defs)` - Add multiple actions
- `.build()` - Return the state object
- `.destroy()` - Cleanup all bindings

**Example:**

```javascript
const app = Elements.reactive({ count: 0, message: '' })
  .computed({
    doubled: () => app.state.count * 2,
    display: () => `${app.state.message}: ${app.state.count}`
  })
  .watch({
    count: (val) => console.log('Count:', val)
  })
  .effect(() => {
    document.title = app.state.display;
  })
  .bind({
    '#counter': () => app.state.count,
    '#doubled': () => app.state.doubled,
    '#message': () => app.state.message
  })
  .action('increment', (state, amount = 1) => {
    state.count += amount;
  })
  .actions({
    decrement: (state, amount = 1) => {
      state.count -= amount;
    },
    reset: (state) => {
      state.count = 0;
      state.message = '';
    },
    setMessage: (state, msg) => {
      state.message = msg;
    }
  })
  .build();

// Use the app
app.increment();
app.increment(5);
app.setMessage('Current');
app.reset();

// Destroy when done
app.destroy();
```

**Access to State:**

```javascript
const builder = Elements.reactive({ count: 0 });

// Access state during building
builder.state.count = 10;

// Or after building
const app = builder.build();
app.count = 20;
```

---

## Utility Methods

All utilities are available on `Elements`, `Collections`, `Selector`, and `ReactiveUtils`.

### `Elements.batch(fn)`

Batch multiple state changes to trigger only one update.

**Parameters:**
- `fn` (Function) - Function containing state changes

**Returns:**
- Return value of `fn`

**Example:**

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
});

// Batch updates
Elements.batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
  state.age = 25;
}); // Only 1 update triggered
```

---

### `Elements.pause()`

Pauses all reactive updates.

**Returns:**
- undefined

**Example:**

```javascript
Elements.pause();

// Make many changes without triggering updates
state.count = 100;
state.message = 'Hello';
state.user = { name: 'John' };

// Resume and apply changes
Elements.resume(true);
```

---

### `Elements.resume(flush)`

Resumes reactive updates.

**Parameters:**
- `flush` (Boolean, optional) - If true, applies pending updates immediately

**Returns:**
- undefined

**Example:**

```javascript
Elements.pause();
// ... make changes
Elements.resume(true);  // Apply pending updates
// or
Elements.resume(false); // Discard pending updates
```

---

### `Elements.untrack(fn)`

Execute function without tracking dependencies.

**Parameters:**
- `fn` (Function) - Function to execute

**Returns:**
- Return value of `fn`

**Example:**

```javascript
Elements.effect(() => {
  // count is tracked
  console.log('Count:', state.count);
  
  // debugData is NOT tracked
  const debug = Elements.untrack(() => state.debugData);
  console.log('Debug:', debug);
});

state.count++;      // Effect runs
state.debugData++;  // Effect does NOT run
```

---

### `Elements.isReactive(value)`

Check if a value is reactive.

**Parameters:**
- `value` (any) - Value to check

**Returns:**
- Boolean

**Example:**

```javascript
const state = Elements.state({ count: 0 });
const plain = { count: 0 };

console.log(Elements.isReactive(state)); // true
console.log(Elements.isReactive(plain)); // false
```

---

### `Elements.toRaw(value)`

Get the non-reactive raw value.

**Parameters:**
- `value` (any) - Reactive value

**Returns:**
- Raw (non-reactive) value

**Example:**

```javascript
const state = Elements.state({
  user: { name: 'John' }
});

const raw = Elements.toRaw(state.user);
raw.name = 'Jane'; // Does NOT trigger updates
```

---

### `Elements.notify(state, key?)`

Manually trigger updates for a property.

**Parameters:**
- `state` (Object) - Reactive state
- `key` (String, optional) - Property to notify, or all if omitted

**Returns:**
- undefined

**Example:**

```javascript
// Notify specific property
Elements.notify(state, 'count');

// Notify all properties
Elements.notify(state);
```

---

## Integration APIs

The reactive extension integrates with DOM Helpers core modules.

### With Elements

All reactive methods are available on `Elements`:

```javascript
Elements.state({ count: 0 });
Elements.computed(state, { doubled: () => state.count * 2 });
Elements.bindings({ '#count': () => state.count });
Elements.batch(() => { /* updates */ });
// ... etc
```

### With Collections

All reactive methods are available on `Collections`:

```javascript
Collections.state({ items: [] });
Collections.list([{ id: 1, text: 'Item 1' }]);
Collections.bind({ 'item-class': () => state.value });
// ... etc
```

### With Selector

All reactive methods are available on `Selector`:

```javascript
Selector.state({ theme: 'light' });
Selector.query.bind({ '.theme-indicator': () => state.theme });
Selector.queryAll.bind({ '.status': () => state.status });
// ... etc
```

### Standalone Usage

Use `ReactiveState` and `ReactiveUtils` without DOM Helpers:

```javascript
// Create state
const state = ReactiveState.create({ count: 0 });

// Use utilities
ReactiveUtils.batch(() => {
  state.count = 10;
});

console.log(ReactiveUtils.isReactive(state)); // true
```

---

## Summary

This comprehensive reference covers all methods and features of the DOM Helpers Reactive library. For practical examples and best practices, see [README-reactive-complete.md](./README-reactive-complete.md).

**Key Points to Remember:**

1. **State Creation** - Use `Elements.state()` for objects, `Elements.ref()` for single values
2. **Computed Properties** - Cache derived values with `Elements.computed()`
3. **Watchers** - React to changes with `Elements.watch()`
4. **DOM Bindings** - Auto-update UI with `Elements.bindings()`
5. **Performance** - Use `Elements.batch()` for multiple updates
6. **Components** - Organize code with `Elements.component()`
7. **Stores** - Manage app-wide state with `Elements.store()`

---

**Documentation Version:** 2.0.2  
**Last Updated:** October 2025  
**License:** MIT
