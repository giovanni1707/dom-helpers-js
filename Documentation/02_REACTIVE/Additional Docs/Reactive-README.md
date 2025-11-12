[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


<document>
# DOM Helpers - Reactive State Extension

**Version 2.0.2** | **License: MIT**

A powerful, lightweight reactive state management library that seamlessly integrates with DOM Helpers. Built with a smart reactivity system using JavaScript Proxies for fine-grained dependency tracking and automatic DOM updates.

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [API Reference](#-api-reference)
  - [Creating Reactive State](#creating-reactive-state)
  - [Computed Properties](#computed-properties)
  - [Watchers](#watchers)
  - [Effects](#effects)
  - [Refs](#refs)
  - [Bindings](#bindings)
  - [Stores](#stores)
  - [Components](#components)
  - [Collections](#collections)
  - [Forms](#forms)
  - [Async State](#async-state)
- [Advanced Features](#-advanced-features)
- [Utilities](#-utilities)
- [Performance](#-performance)
- [Examples](#-examples)
- [Migration Guide](#-migration-guide)
- [FAQ](#-faq)

---

## ✨ Features

- **🎯 Fine-grained Reactivity** - Proxy-based reactivity with automatic dependency tracking
- **🔄 Nested Object Support** - Deep reactivity for nested objects and arrays
- **💻 Computed Properties** - Cached computed values with automatic invalidation
- **👀 Watchers** - React to state changes with watchers
- **⚡ Batch Updates** - Optimize performance by batching multiple updates
- **🧹 Automatic Cleanup** - MutationObserver-based cleanup when elements are removed
- **🎨 Flexible API** - Instance methods, standalone functions, and fluent builder patterns
- **📦 Zero Dependencies** - Works standalone or with DOM Helpers
- **🐛 Debug Tools** - Built-in debugging utilities
- **🎭 Multiple Patterns** - Support for collections, forms, async state, and stores
- **🔌 Universal Integration** - Works with Elements, Collections, and Selector APIs

---

## 📦 Installation

### Using CDN

```html
<!-- Load DOM Helpers Core first -->
<script src="https://cdn.example.com/dom-helpers-core.js"></script>

<!-- Then load Reactive Extension -->
<script src="https://cdn.example.com/dom-helpers-reactive.js"></script>
```

### Using npm

```bash
npm install dom-helpers-reactive
```

```javascript
// ES6 Module
import { ReactiveState } from 'dom-helpers-reactive';

// CommonJS
const { ReactiveState } = require('dom-helpers-reactive');
```

---

## 🚀 Quick Start

### Basic Example

```javascript
// Create reactive state
const state = Elements.state({
  count: 0,
  message: 'Hello World'
});

// Add computed property
Elements.computed(state, {
  doubled: () => state.count * 2
});

// Bind to DOM
Elements.bindings({
  '#counter': () => state.count,
  '#doubled': () => state.doubled,
  '#message': () => state.message
});

// Update state (DOM updates automatically)
state.count = 10;
state.message = 'Updated!';

console.log(state.doubled); // 20
```

### Todo List Example

```javascript
const todos = Collections.state({
  items: [],
  filter: 'all'
});

Collections.computed(todos, {
  filtered: () => {
    if (todos.filter === 'active') {
      return todos.items.filter(item => !item.done);
    }
    if (todos.filter === 'completed') {
      return todos.items.filter(item => item.done);
    }
    return todos.items;
  },
  stats: () => ({
    total: todos.items.length,
    active: todos.items.filter(item => !item.done).length,
    completed: todos.items.filter(item => item.done).length
  })
});

Collections.bindings({
  '.todo-count': () => `${todos.stats.completed} / ${todos.stats.total} completed`,
  '.todo-list': {
    innerHTML: () => todos.filtered.map(item => `
      <li class="${item.done ? 'done' : ''}">
        ${item.text}
      </li>
    `).join('')
  }
});

// Add a todo
todos.items.push({ text: 'Learn Reactive State', done: false });

// Change filter
todos.filter = 'active';
```

---

## 🧠 Core Concepts

### Reactivity

The library uses **JavaScript Proxies** to intercept property access and mutations, enabling automatic dependency tracking and updates.

```javascript
const state = Elements.state({ count: 0 });

// Accessing a property tracks the dependency
const value = state.count; // Tracked!

// Modifying triggers updates
state.count = 10; // Updates all dependent bindings
```

### Dependency Tracking

When you access a reactive property inside a binding, watcher, or computed property, the library automatically tracks that dependency.

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe'
});

Elements.computed(state, {
  // This computed property depends on firstName and lastName
  fullName: () => `${state.firstName} ${state.lastName}`
});

// Changing either firstName or lastName will update fullName
state.firstName = 'Jane'; // fullName automatically updates to "Jane Doe"
```

### Batch Updates

Multiple state changes can be batched to avoid unnecessary re-renders.

```javascript
Elements.batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
  state.age = 30;
  state.city = 'New York';
});
// All bindings update only once after the batch completes
```

---

## 📚 API Reference

### Creating Reactive State

#### `Elements.state(initialState)`
#### `Collections.state(initialState)`
#### `Selector.state(initialState)`

Creates a reactive state object.

```javascript
const state = Elements.state({
  count: 0,
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  items: ['a', 'b', 'c']
});

// Nested objects are automatically reactive
state.user.name = 'Jane';

// Array methods trigger updates
state.items.push('d');
```

**Parameters:**
- `initialState` (Object): Initial state object

**Returns:**
- Reactive proxy object

---

### Computed Properties

Computed properties are cached values that automatically update when their dependencies change.

#### Instance Method: `state.$computed(key, computeFn)`

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe'
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // "John Doe"
state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe"
```

#### Standalone Method: `Elements.computed(state, computedDefs)`
#### `Collections.computed(state, computedDefs)`
#### `Selector.computed(state, computedDefs)`

```javascript
const state = Elements.state({
  price: 100,
  quantity: 2,
  taxRate: 0.1
});

Elements.computed(state, {
  subtotal: () => state.price * state.quantity,
  tax: () => state.subtotal * state.taxRate,
  total: () => state.subtotal + state.tax
});

console.log(state.total); // 220
```

**Parameters:**
- `state` (Object): Reactive state object
- `computedDefs` (Object): Object with computed property definitions

**Returns:**
- The state object (for chaining)

**Features:**
- ✅ Automatic caching
- ✅ Smart invalidation
- ✅ Nested computed dependencies
- ✅ Circular dependency detection

---

### Watchers

Watchers allow you to react to state changes.

#### Instance Method: `state.$watch(keyOrFn, callback)`

```javascript
const state = Elements.state({ count: 0 });

// Watch a specific property
const unwatch = state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count = 10; // Logs: "Count changed from 0 to 10"

// Stop watching
unwatch();

// Watch a computed value
state.$watch(() => state.count * 2, (newValue, oldValue) => {
  console.log(`Doubled changed from ${oldValue} to ${newValue}`);
});
```

#### Standalone Method: `Elements.watch(state, watchDefs)`
#### `Collections.watch(state, watchDefs)`
#### `Selector.watch(state, watchDefs)`

```javascript
const state = Elements.state({
  theme: 'light',
  lang: 'en'
});

const unwatch = Elements.watch(state, {
  theme: (newTheme, oldTheme) => {
    console.log(`Theme changed from ${oldTheme} to ${newTheme}`);
    document.body.className = `theme-${newTheme}`;
  },
  lang: (newLang) => {
    document.documentElement.lang = newLang;
  }
});

state.theme = 'dark'; // Updates body class

// Stop all watchers
unwatch();
```

**Parameters:**
- `state` (Object): Reactive state object
- `watchDefs` (Object): Object with watch definitions

**Returns:**
- Cleanup function

---

### Effects

Effects automatically track dependencies and re-run when any dependency changes.

#### `Elements.effect(effectFn)`
#### `Collections.effect(effectFn)`
#### `Selector.effect(effectFn)`

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Effect automatically tracks firstName and lastName
const cleanup = Elements.effect(() => {
  document.title = `${state.firstName} ${state.lastName}`;
});

state.firstName = 'Jane'; // Document title updates automatically

// Stop the effect
cleanup();
```

#### Multiple Effects: `Elements.effects(effectDefs)`

```javascript
Elements.effects({
  updateTitle: () => {
    document.title = `${state.firstName} ${state.lastName}`;
  },
  saveToStorage: () => {
    localStorage.setItem('user', JSON.stringify({
      firstName: state.firstName,
      lastName: state.lastName
    }));
  },
  logChanges: () => {
    console.log('State changed:', state);
  }
});
```

**Parameters:**
- `effectFn` (Function): Function to execute reactively
- `effectDefs` (Object): Object with named effects

**Returns:**
- Cleanup function

---

### Refs

Refs are simple reactive values, similar to Vue's `ref()`.

#### `Elements.ref(initialValue)`
#### `Collections.ref(initialValue)`
#### `Selector.ref(initialValue)`

```javascript
const count = Elements.ref(0);
const message = Elements.ref('Hello');

// Access/modify via .value
count.value = 10;
console.log(count.value); // 10

// Use in bindings
Elements.bindings({
  '#counter': () => count.value,
  '#message': () => message.value
});

// Refs automatically convert to primitive values
console.log(count + 5); // 15
```

#### Multiple Refs: `Elements.refs(refDefs)`

```javascript
const { x, y, z } = Elements.refs({
  x: 0,
  y: 10,
  z: 20
});

x.value = 100;
y.value = 200;
```

**Parameters:**
- `initialValue` (any): Initial value
- `refDefs` (Object): Object with ref definitions

**Returns:**
- Reactive ref object with `.value` property

---

### Bindings

Bindings connect reactive state to DOM elements.

#### `Elements.bind(bindings)` - By ID
#### `Collections.bind(bindings)` - By Class Name
#### `Selector.query.bind(bindings)` - By Selector (single)
#### `Selector.queryAll.bind(bindings)` - By Selector (all)

```javascript
const state = Elements.state({
  message: 'Hello',
  count: 0,
  isActive: false
});

// Bind by ID
Elements.bind({
  output: () => state.message,
  counter: {
    textContent: () => state.count,
    className: () => state.count > 5 ? 'high' : 'low'
  }
});

// Bind by class name
Collections.bind({
  'status-indicator': {
    className: () => state.isActive ? 'active' : 'inactive'
  }
});

// Bind by selector
Selector.query.bind({
  '#display': () => `Count: ${state.count}`
});
```

#### Declarative Bindings: `Elements.bindings(bindingDefs)`

```javascript
const state = Elements.state({
  user: { name: 'John', email: 'john@example.com' },
  theme: 'light'
});

const cleanup = Elements.bindings({
  // By ID (starts with #)
  '#username': () => state.user.name,
  
  // By class (starts with .)
  '.user-email': () => state.user.email,
  
  // By CSS selector
  '[data-theme]': {
    dataset: () => ({ theme: state.theme }),
    className: () => `theme-${state.theme}`
  },
  
  // Multiple properties
  'button.submit': {
    disabled: () => !state.user.name,
    textContent: () => state.user.name ? 'Submit' : 'Please enter name'
  }
});

// Cleanup all bindings
cleanup();
```

**Binding Values:**

```javascript
// Primitive values
Elements.bindings({
  '#text': () => 'Hello', // Sets textContent
  '#input': { value: () => state.inputValue }
});

// Arrays
Elements.bindings({
  '#list': () => ['item1', 'item2', 'item3'], // Joins with ", "
  '#classes': { classList: () => ['btn', 'primary', 'large'] }
});

// Objects
Elements.bindings({
  '#styled': {
    style: () => ({
      color: state.theme === 'dark' ? 'white' : 'black',
      backgroundColor: state.theme === 'dark' ? 'black' : 'white'
    })
  }
});

// DOM Nodes
Elements.bindings({
  '#container': () => document.createElement('div')
});

// Object spread (multiple properties)
Elements.bindings({
  '#element': () => ({
    textContent: state.message,
    className: state.isActive ? 'active' : '',
    style: { color: 'red' },
    dataset: { id: state.id }
  })
});
```

**Parameters:**
- `bindings` (Object): Binding definitions

**Returns:**
- Cleanup function (for declarative bindings)

---

### Stores

Stores provide Vuex-like state management with actions and getters.

#### `Elements.store(initialState, options)`
#### `Collections.store(initialState, options)`
#### `Selector.store(initialState, options)`

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
    // Getters (computed properties)
    getters: {
      isLoggedIn: function() {
        return this.user !== null;
      },
      userName: function() {
        return this.user?.name || 'Guest';
      },
      hasError: function() {
        return this.error !== null;
      }
    },
    
    // Actions (can be async)
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
        store.error = null;
      }
    },
    
    // Mutations (for strict mode)
    mutations: {
      SET_USER(store, user) {
        store.user = user;
      },
      SET_LOADING(store, loading) {
        store.isLoading = loading;
      },
      SET_ERROR(store, error) {
        store.error = error;
      }
    }
  }
);

// Use actions
await userStore.login({ email: 'user@example.com', password: 'pass123' });

// Use getters
console.log(userStore.isLoggedIn); // true
console.log(userStore.userName); // "John Doe"

// Use mutations
userStore.$commit('SET_LOADING', true);

// Logout
userStore.logout();
```

**Options:**
- `getters` (Object): Computed properties
- `actions` (Object): Action methods (can be async)
- `mutations` (Object): Mutation methods (used with `$commit`)

**Returns:**
- Store instance

---

### Components

Components combine state, computed properties, watchers, effects, and bindings into a single unit.

#### `Elements.component(config)`
#### `Collections.component(config)`
#### `Selector.component(config)`

```javascript
const counter = Elements.component({
  // Initial state
  state: {
    count: 0,
    step: 1
  },
  
  // Computed properties
  computed: {
    doubled: () => counter.count * 2,
    isEven: () => counter.count % 2 === 0,
    display: () => `Count: ${counter.count} (doubled: ${counter.doubled})`
  },
  
  // Watchers
  watch: {
    count: (newVal, oldVal) => {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
    }
  },
  
  // Effects
  effects: {
    updateTitle: () => {
      document.title = `Count: ${counter.count}`;
    },
    saveToStorage: () => {
      localStorage.setItem('count', counter.count);
    }
  },
  
  // DOM bindings
  bindings: {
    '#counter-display': () => counter.count,
    '#doubled-display': () => counter.doubled,
    '#status': {
      textContent: () => counter.isEven ? 'Even' : 'Odd',
      className: () => counter.isEven ? 'even' : 'odd'
    }
  },
  
  // Actions
  actions: {
    increment(state, amount = 1) {
      state.count += amount;
    },
    decrement(state, amount = 1) {
      state.count -= amount;
    },
    reset(state) {
      state.count = 0;
    },
    setStep(state, step) {
      state.step = step;
    }
  },
  
  // Lifecycle hooks
  mounted() {
    console.log('Component mounted');
    const saved = localStorage.getItem('count');
    if (saved) {
      this.count = parseInt(saved);
    }
  },
  
  unmounted() {
    console.log('Component destroyed');
  }
});

// Use the component
counter.increment();
counter.increment(5);
counter.setStep(2);

console.log(counter.doubled); // Access computed
console.log(counter.isEven); // Access computed

// Destroy the component
counter.$destroy();
```

**Todo List Component Example:**

```javascript
const todoApp = Collections.component({
  state: {
    todos: [],
    filter: 'all',
    newTodo: ''
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
    saveToStorage: () => {
      localStorage.setItem('todos', JSON.stringify(todoApp.todos));
    }
  },
  
  bindings: {
    '.todo-list': {
      innerHTML: () => todoApp.filteredTodos.map(todo => `
        <li data-id="${todo.id}" class="${todo.done ? 'done' : ''}">
          <input type="checkbox" ${todo.done ? 'checked' : ''}>
          <span>${todo.text}</span>
          <button class="delete">×</button>
        </li>
      `).join('')
    },
    
    '.todo-count': () => 
      `${todoApp.stats.completed} / ${todoApp.stats.total} completed`,
    
    '.filter-all': {
      className: () => todoApp.filter === 'all' ? 'active' : ''
    },
    '.filter-active': {
      className: () => todoApp.filter === 'active' ? 'active' : ''
    },
    '.filter-completed': {
      className: () => todoApp.filter === 'completed' ? 'active' : ''
    }
  },
  
  actions: {
    addTodo(state) {
      if (state.newTodo.trim()) {
        state.todos.push({
          id: Date.now(),
          text: state.newTodo.trim(),
          done: false
        });
        state.newTodo = '';
      }
    },
    
    toggleTodo(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    
    removeTodo(state, id) {
      const index = state.todos.findIndex(t => t.id === id);
      if (index !== -1) state.todos.splice(index, 1);
    },
    
    setFilter(state, filter) {
      state.filter = filter;
    },
    
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.done);
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

**Configuration Options:**
- `state` (Object): Initial state
- `computed` (Object): Computed properties
- `watch` (Object): Watchers
- `effects` (Object): Effects
- `bindings` (Object): DOM bindings
- `actions` (Object): Action methods
- `mounted` (Function): Lifecycle hook called after creation
- `unmounted` (Function): Lifecycle hook called on destroy

**Returns:**
- Component instance with `$destroy()` method

---

### Collections

Helper for managing reactive arrays/lists.

#### `Elements.list(initialItems)`
#### `Collections.list(initialItems)`
#### `Selector.list(initialItems)`

Alias for `ReactiveState.collection()`.

```javascript
const myList = Collections.list([
  { id: 1, text: 'Item 1', done: false },
  { id: 2, text: 'Item 2', done: true }
]);

// Add item
myList.$add({ id: 3, text: 'Item 3', done: false });

// Remove item by predicate
myList.$remove(item => item.id === 2);

// Remove by value
myList.$remove(myList.items[0]);

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

**Methods:**
- `$add(item)` - Add item to the list
- `$remove(predicate)` - Remove item by predicate or value
- `$update(predicate, updates)` - Update item by predicate
- `$clear()` - Clear all items

---

### Forms

Helper for managing form state with validation.

#### `ReactiveState.form(initialValues)`

```javascript
const loginForm = ReactiveState.form({
  email: '',
  password: ''
});

// Computed properties automatically added
console.log(loginForm.isValid);  // true if no errors
console.log(loginForm.isDirty);  // true if any field touched

// Set field value
loginForm.$setValue('email', 'user@example.com');

// Set field error
if (!loginForm.values.email.includes('@')) {
  loginForm.$setError('email', 'Invalid email address');
}

// Clear error
loginForm.$setError('email', null);

// Bind to inputs
Elements.bindings({
  '#email': { value: () => loginForm.values.email },
  '#password': { value: () => loginForm.values.password },
  '.email-error': () => loginForm.errors.email || '',
  '#submit': { disabled: () => !loginForm.isValid }
});

// Handle input
document.getElementById('email').addEventListener('input', (e) => {
  loginForm.$setValue('email', e.target.value);
  
  // Validate
  if (!e.target.value.includes('@')) {
    loginForm.$setError('email', 'Invalid email');
  } else {
    loginForm.$setError('email', null);
  }
});

// Reset form
loginForm.$reset();

// Reset with new values
loginForm.$reset({ email: 'new@example.com', password: '' });
```

**State Properties:**
- `values` (Object): Form field values
- `errors` (Object): Field errors
- `touched` (Object): Touched fields
- `isSubmitting` (Boolean): Submission state

**Computed Properties:**
- `isValid` (Boolean): True if no errors
- `isDirty` (Boolean): True if any field touched

**Methods:**
- `$setValue(field, value)` - Set field value and mark as touched
- `$setError(field, error)` - Set or clear field error
- `$reset(newValues?)` - Reset form to initial or new values

---

### Async State

Helper for managing async operations.

#### `ReactiveState.async(initialValue)`

```javascript
const userData = ReactiveState.async(null);

// Execute async operation
const loadUser = async (userId) => {
  await userData.$execute(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to load user');
    return response.json();
  });
};

// Bind to DOM
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
      display: userData.error ? 'block' : 'none'
    })
  }
});

// Load user
await loadUser(123);

// Reset
userData.$reset();
```

**State Properties:**
- `data` (any): The fetched data
- `loading` (Boolean): True while loading
- `error` (Error|null): Error object if failed

**Computed Properties:**
- `isSuccess` (Boolean): True if loaded successfully
- `isError` (Boolean): True if error occurred

**Methods:**
- `$execute(asyncFn)` - Execute async function and track state
- `$reset()` - Reset to initial state

---

## 🔧 Advanced Features

### Fluent Builder API

Chain multiple operations for complex setups.

#### `Elements.reactive(initialState)`
#### `Collections.reactive(initialState)`
#### `Selector.reactive(initialState)`

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
    '#display': () => app.state.display
  })
  .action('increment', (state, amount = 1) => {
    state.count += amount;
  })
  .action('setMessage', (state, msg) => {
    state.message = msg;
  })
  .actions({
    reset: (state) => {
      state.count = 0;
      state.message = '';
    },
    incrementBy10: (state) => {
      state.count += 10;
    }
  })
  .build();

// Use the app
app.increment();
app.setMessage('Current count');
app.reset();

// Destroy
app.destroy();
```

**Methods:**
- `.computed(defs)` - Add computed properties
- `.watch(defs)` - Add watchers
- `.effect(fn)` - Add effect
- `.bind(defs)` - Add DOM bindings
- `.action(name, fn)` - Add single action
- `.actions(defs)` - Add multiple actions
- `.build()` - Return the state object
- `.destroy()` - Cleanup all bindings

---

### Batch Updates

Optimize performance by batching multiple state changes.

```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  city: 'New York'
});

// Without batching - triggers 4 updates
state.firstName = 'Jane';
state.lastName = 'Smith';
state.age = 25;
state.city = 'Los Angeles';

// With batching - triggers only 1 update
Elements.batch(() => {
  state.firstName = 'Jane';
  state.lastName = 'Smith';
  state.age = 25;
  state.city = 'Los Angeles';
});

// Instance method
state.$batch(() => {
  state.firstName = 'Bob';
  state.lastName = 'Johnson';
});
```

---

### Untracked Reads

Read state without tracking dependencies.

```javascript
const state = Elements.state({ count: 0, temp: 0 });

Elements.effect(() => {
  // count is tracked
  console.log('Count:', state.count);
  
  // temp is NOT tracked (won't trigger re-run)
  const tempValue = Elements.untrack(() => state.temp);
  console.log('Temp (untracked):', tempValue);
});

state.count++; // Effect runs
state.temp++;  // Effect does NOT run
```

---

### Pause/Resume Reactivity

Temporarily pause reactivity for bulk operations.

```javascript
const state = Elements.state({ items: [] });

Elements.bindings({
  '#list': () => state.items.join(', ')
});

// Pause updates
Elements.pause();

```javascript
// Add 1000 items (no DOM updates yet)
for (let i = 0; i < 1000; i++) {
  state.items.push(`Item ${i}`);
}

// Resume and flush all updates at once
Elements.resume(true); // Pass true to flush pending updates

// Or resume without flushing
Elements.resume(false); // Updates won't be applied
```

**Also available on Collections and Selector:**

```javascript
Collections.pause();
// ... bulk operations
Collections.resume(true);

Selector.pause();
// ... bulk operations
Selector.resume(true);
```

---

### Manual Notifications

Manually trigger updates for a property.

```javascript
const state = Elements.state({
  internalData: { count: 0 }
});

Elements.bindings({
  '#display': () => state.internalData.count
});

// Modify without triggering (bypassing proxy)
const raw = Elements.toRaw(state.internalData);
raw.count = 100;

// Manually notify to trigger updates
Elements.notify(state, 'internalData');

// Or use instance method
state.$notify('internalData');

// Notify all properties
Elements.notify(state); // or state.$notify()
```

---

### Raw Values

Get non-reactive raw values from reactive objects.

```javascript
const state = Elements.state({
  user: {
    name: 'John',
    email: 'john@example.com'
  }
});

// Get raw (non-reactive) value
const rawUser = Elements.toRaw(state.user);
rawUser.name = 'Jane'; // Does NOT trigger updates

// Also works with instance property
const rawState = state.$raw;

// Check if reactive
console.log(Elements.isReactive(state));        // true
console.log(Elements.isReactive(rawUser));      // false
console.log(Elements.isReactive(state.user));   // true
```

---

### Circular Dependency Detection

The library automatically detects and warns about circular dependencies.

```javascript
const state = Elements.state({ a: 1, b: 2 });

state.$computed('x', function() {
  return this.y + 1; // Depends on y
});

state.$computed('y', function() {
  return this.x + 1; // Depends on x - CIRCULAR!
});

// Console warning: "Circular dependency detected in binding"

// Configure max depth
ReactiveState.configure({
  maxDependencyDepth: 50 // Default is 100
});
```

---

### Custom Error Handling

Set a global error handler for reactive operations.

```javascript
ReactiveState.configure({
  errorHandler: (error, context, data) => {
    console.error(`[Custom Handler] Error in ${context}:`, error);
    
    // Send to error tracking service
    if (window.errorTracker) {
      window.errorTracker.log(error, { context, data });
    }
    
    // Show user-friendly message
    if (context === 'executeBinding') {
      alert('An error occurred while updating the page.');
    }
  }
});
```

---

## 🛠️ Utilities

### Reactive Utilities

All utilities are available on `Elements`, `Collections`, `Selector`, and `ReactiveUtils`.

#### `batch(fn)`

Batch multiple updates.

```javascript
Elements.batch(() => {
  state.prop1 = 'a';
  state.prop2 = 'b';
  state.prop3 = 'c';
});
```

#### `untrack(fn)`

Read state without tracking dependencies.

```javascript
const value = Elements.untrack(() => {
  return state.someProperty;
});
```

#### `pause()` / `resume(flush)`

Pause and resume reactivity.

```javascript
Elements.pause();
// ... operations
Elements.resume(true);
```

#### `isReactive(value)`

Check if a value is reactive.

```javascript
const state = Elements.state({ count: 0 });
console.log(Elements.isReactive(state)); // true
console.log(Elements.isReactive({ count: 0 })); // false
```

#### `toRaw(value)`

Get the raw (non-reactive) value.

```javascript
const state = Elements.state({ user: { name: 'John' } });
const raw = Elements.toRaw(state.user);
raw.name = 'Jane'; // No reactivity
```

#### `notify(state, key?)`

Manually trigger updates.

```javascript
Elements.notify(state, 'propertyName');
Elements.notify(state); // All properties
```

---

### Debug Utilities

#### Enable Debug Mode

```javascript
ReactiveState.debug.setDebugMode(true);

// Now all updates are logged
state.count = 10;
// Console: "[DOM Helpers Reactive Debug] Triggered 2 binding(s) for key "count""
```

#### Get State Dependencies

```javascript
const deps = ReactiveState.debug.getStateDependencies(state);
console.log(deps);
/*
{
  count: {
    count: 2,
    bindings: [
      { element: <div>, property: 'textContent', isComputed: false },
      { element: <span>, property: null, isComputed: false }
    ]
  }
}
*/
```

#### Get Element Bindings

```javascript
const element = document.getElementById('counter');
const info = ReactiveState.debug.getElementBindingInfo(element);
console.log(info);
/*
{
  count: 2,
  bindings: [
    { property: 'textContent', hasTrackedStates: true, trackedStateCount: 1 },
    { property: 'className', hasTrackedStates: true, trackedStateCount: 1 }
  ]
}
*/
```

#### Get Reactive Stats

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
```

#### Debug State

```javascript
// Log state structure and dependencies
state.$debug('My State');
// or
ReactiveState.debug.debugState(state, 'My State');

/*
Console output:
[DOM Helpers Reactive Debug] My State
  Raw value: { count: 10, message: 'Hello' }
  Dependencies: { ... }
  Computed properties: ['doubled', 'display']
*/
```

---

### Configuration

Configure reactive behavior globally.

```javascript
ReactiveState.configure({
  // Maximum dependency depth (circular dependency detection)
  maxDependencyDepth: 100,
  
  // Enable debug mode
  enableDebugMode: false,
  
  // Custom error handler
  errorHandler: (error, context, data) => {
    console.error('Error:', error);
  }
});
```

---

## ⚡ Performance

### Performance Tips

1. **Use Batch Updates**
   ```javascript
   // Bad: 100 updates
   for (let i = 0; i < 100; i++) {
     state.items.push(i);
   }
   
   // Good: 1 update
   Elements.batch(() => {
     for (let i = 0; i < 100; i++) {
       state.items.push(i);
     }
   });
   ```

2. **Use Computed Properties for Derived State**
   ```javascript
   // Bad: Recalculates on every access
   Elements.bindings({
     '#total': () => {
       return state.items.reduce((sum, item) => sum + item.price, 0);
     }
   });
   
   // Good: Cached computed property
   Elements.computed(state, {
     total: () => state.items.reduce((sum, item) => sum + item.price, 0)
   });
   
   Elements.bindings({
     '#total': () => state.total
   });
   ```

3. **Untrack Non-Essential Reads**
   ```javascript
   Elements.effect(() => {
     console.log('Count:', state.count);
     
     // Don't track debug info
     const debugInfo = Elements.untrack(() => state.debugData);
     console.log('Debug:', debugInfo);
   });
   ```

4. **Pause During Bulk Operations**
   ```javascript
   Elements.pause();
   // Load 10,000 items
   state.items = largeDataset;
   Elements.resume(true);
   ```

5. **Clean Up Watchers and Effects**
   ```javascript
   const cleanup1 = Elements.watch(state, { ... });
   const cleanup2 = Elements.effect(() => { ... });
   
   // When done
   cleanup1();
   cleanup2();
   ```

### Performance Monitoring

When debug mode is enabled, the library monitors performance:

```javascript
ReactiveState.debug.setDebugMode(true);

// Slow binding executions (>16ms) are logged
state.count = 10;
// Console warning: "[DOM Helpers Reactive Performance] Slow binding execution: 23.45ms"

// High update frequency is logged every 5 seconds
// Console warning: "[DOM Helpers Reactive Performance] High update frequency: 85.5 updates/second"
```

---

## 📖 Examples

### Counter App

```javascript
const counter = Elements.component({
  state: { count: 0 },
  
  computed: {
    doubled: () => counter.count * 2,
    squared: () => counter.count ** 2
  },
  
  bindings: {
    '#count': () => counter.count,
    '#doubled': () => counter.doubled,
    '#squared': () => counter.squared
  },
  
  actions: {
    increment(state) { state.count++; },
    decrement(state) { state.count--; },
    reset(state) { state.count = 0; }
  }
});

document.getElementById('inc').onclick = () => counter.increment();
document.getElementById('dec').onclick = () => counter.decrement();
document.getElementById('reset').onclick = () => counter.reset();
```

### Todo List

```javascript
const todos = Collections.component({
  state: {
    items: [],
    filter: 'all',
    newTodo: ''
  },
  
  computed: {
    filtered: () => {
      const { items, filter } = todos;
      if (filter === 'active') return items.filter(t => !t.done);
      if (filter === 'completed') return items.filter(t => t.done);
      return items;
    },
    
    remaining: () => todos.items.filter(t => !t.done).length
  },
  
  bindings: {
    '#todo-list': {
      innerHTML: () => todos.filtered.map(t => `
        <li data-id="${t.id}" class="${t.done ? 'done' : ''}">
          <input type="checkbox" ${t.done ? 'checked' : ''} 
                 onchange="todos.toggle(${t.id})">
          <span>${t.text}</span>
          <button onclick="todos.remove(${t.id})">×</button>
        </li>
      `).join('')
    },
    
    '#todo-count': () => `${todos.remaining} item${todos.remaining !== 1 ? 's' : ''} left`,
    
    '.filter-all': { className: () => todos.filter === 'all' ? 'selected' : '' },
    '.filter-active': { className: () => todos.filter === 'active' ? 'selected' : '' },
    '.filter-completed': { className: () => todos.filter === 'completed' ? 'selected' : '' }
  },
  
  actions: {
    add(state) {
      if (state.newTodo.trim()) {
        state.items.push({
          id: Date.now(),
          text: state.newTodo.trim(),
          done: false
        });
        state.newTodo = '';
      }
    },
    
    toggle(state, id) {
      const todo = state.items.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    
    remove(state, id) {
      state.items = state.items.filter(t => t.id !== id);
    },
    
    setFilter(state, filter) {
      state.filter = filter;
    },
    
    clearCompleted(state) {
      state.items = state.items.filter(t => !t.done);
    }
  },
  
  mounted() {
    const saved = localStorage.getItem('todos');
    if (saved) this.items = JSON.parse(saved);
  }
});

// Bind to localStorage
Elements.watch(todos, {
  items: () => {
    localStorage.setItem('todos', JSON.stringify(todos.items));
  }
});
```

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
          if (quantity <= 0) {
            store.removeItem(productId);
          } else {
            item.quantity = quantity;
          }
        }
      },
      
      clear(store) {
        store.items = [];
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
               onchange="cart.updateQuantity(${item.id}, +this.value)">
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button onclick="cart.removeItem(${item.id})">Remove</button>
      </div>
    `).join('')
  },
  
  '#subtotal': () => `$${cart.subtotal.toFixed(2)}`,
  '#tax': () => `$${cart.tax.toFixed(2)}`,
  '#shipping': () => `$${cart.shippingCost.toFixed(2)}`,
  '#total': () => `$${cart.total.toFixed(2)}`,
  '#item-count': () => cart.itemCount
});
```

### User Dashboard

```javascript
const dashboard = Selector.component({
  state: {
    user: null,
    stats: null,
    notifications: [],
    loading: true
  },
  
  computed: {
    isLoggedIn: () => dashboard.user !== null,
    unreadCount: () => dashboard.notifications.filter(n => !n.read).length,
    userName: () => dashboard.user?.name || 'Guest'
  },
  
  watch: {
    user: (user) => {
      if (user) {
        dashboard.loadStats();
        dashboard.loadNotifications();
      }
    }
  },
  
  bindings: {
    '#username': () => dashboard.userName,
    '#avatar': { src: () => dashboard.user?.avatar || '/default-avatar.png' },
    '#notification-badge': {
      textContent: () => dashboard.unreadCount,
      style: () => ({
        display: dashboard.unreadCount > 0 ? 'inline' : 'none'
      })
    },
    '#loading': {
      style: () => ({ display: dashboard.loading ? 'block' : 'none' })
    }
  },
  
  actions: {
    async loadUser(state) {
      state.loading = true;
      try {
        const res = await fetch('/api/user');
        state.user = await res.json();
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        state.loading = false;
      }
    },
    
    async loadStats(state) {
      const res = await fetch('/api/stats');
      state.stats = await res.json();
    },
    
    async loadNotifications(state) {
      const res = await fetch('/api/notifications');
      state.notifications = await res.json();
    },
    
    async markAsRead(state, notificationId) {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) notification.read = true;
    },
    
    logout(state) {
      state.user = null;
      state.stats = null;
      state.notifications = [];
    }
  },
  
  mounted() {
    this.loadUser();
  }
});
```

### Form Validation

```javascript
const registrationForm = Elements.form({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Validation rules
const validators = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
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
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    return null;
  },
  
  confirmPassword: (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== registrationForm.values.password) return 'Passwords do not match';
    return null;
  }
};

// Validate on change
Elements.watch(registrationForm, {
  values: (newValues) => {
    Object.entries(validators).forEach(([field, validator]) => {
      const error = validator(newValues[field]);
      registrationForm.$setError(field, error);
    });
  }
});

// Bind to UI
Elements.bindings({
  '#username': {
    value: () => registrationForm.values.username,
    className: () => registrationForm.errors.username ? 'error' : ''
  },
  '#username-error': () => registrationForm.errors.username || '',
  
  '#email': {
    value: () => registrationForm.values.email,
    className: () => registrationForm.errors.email ? 'error' : ''
  },
  '#email-error': () => registrationForm.errors.email || '',
  
  '#password': {
    value: () => registrationForm.values.password,
    className: () => registrationForm.errors.password ? 'error' : ''
  },
  '#password-error': () => registrationForm.errors.password || '',
  
  '#confirm-password': {
    value: () => registrationForm.values.confirmPassword,
    className: () => registrationForm.errors.confirmPassword ? 'error' : ''
  },
  '#confirm-error': () => registrationForm.errors.confirmPassword || '',
  
  '#submit': {
    disabled: () => !registrationForm.isValid || registrationForm.isSubmitting
  }
});

// Handle form events
document.getElementById('username').addEventListener('input', (e) => {
  registrationForm.$setValue('username', e.target.value);
});

document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!registrationForm.isValid) return;
  
  registrationForm.isSubmitting = true;
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationForm.values)
    });
    
    if (response.ok) {
      alert('Registration successful!');
      registrationForm.$reset();
    } else {
      const error = await response.json();
      alert(`Registration failed: ${error.message}`);
    }
  } catch (error) {
    alert('Network error');
  } finally {
    registrationForm.isSubmitting = false;
  }
});
```

---

## 🔄 Migration Guide

### From Vue.js

```javascript
// Vue
const app = Vue.createApp({
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() { return this.count * 2; }
  },
  methods: {
    increment() { this.count++; }
  }
});

// DOM Helpers Reactive
const app = Elements.component({
  state: { count: 0 },
  computed: {
    doubled: () => app.count * 2
  },
  actions: {
    increment(state) { state.count++; }
  }
});
```

### From React

```javascript
// React
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]);

useEffect(() => {
  document.title = count;
}, [count]);

// DOM Helpers Reactive
const count = Elements.ref(0);
const doubled = Elements.ref(0);

Elements.computed({ doubled: () => count.value * 2 });
Elements.effect(() => {
  document.title = count.value;
});
```

### From Vanilla JS

```javascript
// Vanilla JS
let count = 0;

function updateUI() {
  document.getElementById('counter').textContent = count;
  document.getElementById('doubled').textContent = count * 2;
}

function increment() {
  count++;
  updateUI();
}

// DOM Helpers Reactive
const state = Elements.state({ count: 0 });

Elements.computed(state, {
  doubled: () => state.count * 2
});

Elements.bindings({
  '#counter': () => state.count,
  '#doubled': () => state.doubled
});

function increment() {
  state.count++; // UI updates automatically
}
```

---

## ❓ FAQ

### Q: Do I need the DOM Helpers core library?

**A:** The Reactive extension is designed to work with DOM Helpers core, but can also work standalone. If DOM Helpers core is not loaded, reactive features will still work, but `Elements`, `Collections`, and `Selector` APIs won't be available. Use `ReactiveState` directly instead.

### Q: How does reactivity work?

**A:** The library uses JavaScript Proxies to intercept property access and mutations. When you access a property inside a binding or computed property, it's automatically tracked. When that property changes, all dependent bindings are updated.

### Q: What's the performance impact?

**A:** The library is highly optimized with:
- Fine-grained updates (only affected bindings update)
- Computed property caching
- Batch updates
- Automatic cleanup

In most cases, the overhead is negligible. For heavy operations, use `batch()` to optimize further.

### Q: Can I use this with other frameworks?

**A:** Yes! The library is framework-agnostic. You can use it alongside React, Vue, or any other framework. Just be careful not to mix reactive updates with framework-managed DOM.

### Q: How do I handle async operations?

**A:** Use the async state helper:

```javascript
const data = ReactiveState.async(null);
await data.$execute(async () => {
  return await fetch('/api/data').then(r => r.json());
});
```

### Q: Can I nest reactive objects?

**A:** Yes! Nested objects and arrays are automatically made reactive:

```javascript
const state = Elements.state({
  user: {
    profile: {
      name: 'John'
    }
  }
});

state.user.profile.name = 'Jane'; // Triggers updates
```

### Q: How do I debug reactivity issues?

**A:** Enable debug mode:

```javascript
ReactiveState.debug.setDebugMode(true);

// View dependencies
ReactiveState.debug.debugState(state);

// View element bindings
ReactiveState.debug.getElementBindingInfo(element);
```

### Q: What about memory leaks?

**A:** The library automatically cleans up bindings when elements are removed from the DOM using a MutationObserver. You can also manually clean up:

```javascript
const cleanup = Elements.bindings({ ... });
cleanup(); // Remove all bindings
```

### Q: Can I use TypeScript?

**A:** The library is written in JavaScript, but TypeScript definitions can be added. Type definitions are planned for a future release.

### Q: How do I handle forms?

**A:** Use the form helper:

```javascript
const form = ReactiveState.form({
  username: '',
  email: ''
});

form.$setValue('username', 'john');
form.$setError('email', 'Invalid email');
```

### Q: Can I pause reactivity temporarily?

**A:** Yes, use pause/resume:

```javascript
Elements.pause();
// Bulk operations
Elements.resume(true); // Flush pending updates
```

---

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/dom-helpers-js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dom-helpers-js/discussions)
- **Email**: support@example.com

---

**Happy Coding! 🚀**

</document>
