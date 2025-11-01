# Utility Functions - Complete Guide

## Overview

Utility functions provide essential tools for working with reactive state, checking reactivity status, accessing raw values, manually triggering updates, and performing unified state/DOM updates. These functions give you fine-grained control over the reactive system.

---

## Table of Contents

1. [isReactive(value)](#isreactivevalue) - Check if value is reactive
2. [toRaw(value)](#torawvalue) - Get raw non-reactive value
3. [notify(state, key)](#notifystate-key) - Manually trigger dependency updates
4. [updateAll(state, updates)](#updateallstate-updates) - Unified state and DOM updates
5. [Use Cases](#use-cases) - When to use each utility
6. [Common Patterns](#common-patterns) - Real-world examples
7. [Best Practices](#best-practices) - Guidelines and recommendations
8. [Troubleshooting](#troubleshooting) - Common issues and solutions
9. [API Quick Reference](#api-quick-reference) - Quick lookup

---

## `isReactive(value)`

Check if a value is a reactive proxy created by the reactive system.

### Syntax
```javascript
ReactiveUtils.isReactive(value)
```

### Parameters
- **`value`** (any) - Value to check for reactivity

### Returns
- `Boolean` - `true` if value is reactive, `false` otherwise

### Example - Basic Usage
```javascript
const state = ReactiveUtils.state({ count: 0 });
const plainObject = { count: 0 };

console.log(ReactiveUtils.isReactive(state)); // true
console.log(ReactiveUtils.isReactive(plainObject)); // false
console.log(ReactiveUtils.isReactive(null)); // false
console.log(ReactiveUtils.isReactive(42)); // false
```

### Example - Type Checking
```javascript
function processData(data) {
  if (ReactiveUtils.isReactive(data)) {
    console.log('Processing reactive data');
    // Can safely use data.$computed, data.$watch, etc.
    data.$computed('total', function() {
      return this.values.reduce((sum, v) => sum + v, 0);
    });
  } else {
    console.log('Processing plain data');
    // Need to convert to reactive first
    const reactiveData = ReactiveUtils.state(data);
  }
}
```

### Advanced Example - Type Guards
```javascript
function isReactiveState(value) {
  return ReactiveUtils.isReactive(value) && typeof value === 'object';
}

function ensureReactive(value) {
  if (ReactiveUtils.isReactive(value)) {
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    return ReactiveUtils.state(value);
  }
  
  return ReactiveUtils.ref(value);
}

// Usage
const data1 = { count: 0 };
const data2 = ReactiveUtils.state({ count: 0 });

const reactive1 = ensureReactive(data1); // Creates reactive state
const reactive2 = ensureReactive(data2); // Returns as-is
```

### Example - Conditional Operations
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Task 1' }
]);

function addTodo(list, todo) {
  if (ReactiveUtils.isReactive(list)) {
    // It's a reactive collection
    list.$add(todo);
  } else if (Array.isArray(list)) {
    // It's a plain array
    list.push(todo);
  } else {
    throw new Error('Invalid list type');
  }
}

addTodo(todos, { id: 2, text: 'Task 2' }); // Uses $add
addTodo([{ id: 1 }], { id: 2 }); // Uses push
```

### Example - Debugging Helper
```javascript
function inspectValue(value, label = 'Value') {
  console.group(label);
  console.log('Type:', typeof value);
  console.log('Is Reactive:', ReactiveUtils.isReactive(value));
  
  if (ReactiveUtils.isReactive(value)) {
    console.log('Raw Value:', ReactiveUtils.toRaw(value));
    console.log('Has $computed:', typeof value.$computed === 'function');
    console.log('Has $watch:', typeof value.$watch === 'function');
  } else {
    console.log('Value:', value);
  }
  
  console.groupEnd();
}

const state = ReactiveUtils.state({ count: 0 });
inspectValue(state, 'State');
inspectValue({ count: 0 }, 'Plain Object');
```

### Example - Library Integration
```javascript
class DataStore {
  constructor(initialData) {
    // Ensure data is reactive
    if (ReactiveUtils.isReactive(initialData)) {
      this.data = initialData;
    } else {
      this.data = ReactiveUtils.state(initialData);
    }
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, value) {
    this.data[key] = value;
  }
  
  isReactive() {
    return ReactiveUtils.isReactive(this.data);
  }
}

// Usage
const store1 = new DataStore({ count: 0 });
const store2 = new DataStore(ReactiveUtils.state({ count: 0 }));

console.log(store1.isReactive()); // true
console.log(store2.isReactive()); // true
```

### Use Cases
- Type checking before operations
- Conditional reactive/non-reactive handling
- Validation in functions accepting mixed types
- Debugging and inspection tools
- Library integration
- Ensuring reactivity

### Important Notes
- Returns `false` for primitives (numbers, strings, etc.)
- Returns `false` for `null` and `undefined`
- Works with all reactive types (state, ref, collection, form, etc.)
- Does not check nested properties (only top-level)

---

## `toRaw(value)`

Get the raw, non-reactive version of a reactive value. Useful for serialization, comparisons, or operations where reactivity isn't needed.

### Syntax
```javascript
ReactiveUtils.toRaw(value)
```

### Parameters
- **`value`** (any) - Reactive value to convert to raw

### Returns
- The raw, non-reactive version of the value

### Example - Basic Usage
```javascript
const state = ReactiveUtils.state({
  count: 0,
  items: [1, 2, 3]
});

const raw = ReactiveUtils.toRaw(state);

console.log(ReactiveUtils.isReactive(state)); // true
console.log(ReactiveUtils.isReactive(raw)); // false

// Modifying raw doesn't trigger reactivity
raw.count = 100; // No effects triggered
console.log(state.count); // 100 (same reference)
```

### Example - Serialization
```javascript
const userData = ReactiveUtils.state({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  profile: {
    avatar: '/avatar.jpg',
    settings: {
      theme: 'dark'
    }
  }
});

// Save to API
async function saveUser() {
  const rawData = ReactiveUtils.toRaw(userData);
  
  // Safe to serialize
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData) // No circular references
  });
  
  return response.json();
}
```

### Advanced Example - Deep Comparison
```javascript
const state1 = ReactiveUtils.state({ a: 1, b: { c: 2 } });
const state2 = ReactiveUtils.state({ a: 1, b: { c: 2 } });

// Comparing reactive objects (always false - different proxies)
console.log(state1 === state2); // false

// Comparing raw values
const raw1 = ReactiveUtils.toRaw(state1);
const raw2 = ReactiveUtils.toRaw(state2);

console.log(JSON.stringify(raw1) === JSON.stringify(raw2)); // true
```

### Example - Performance Optimization
```javascript
const largeDataset = ReactiveUtils.state({
  items: Array(10000).fill(0).map((_, i) => ({
    id: i,
    value: Math.random()
  }))
});

// Expensive operation without triggering reactivity
function processData() {
  const raw = ReactiveUtils.toRaw(largeDataset);
  
  // Process raw data without tracking
  const result = raw.items
    .filter(item => item.value > 0.5)
    .map(item => item.value * 2)
    .reduce((sum, v) => sum + v, 0);
  
  return result;
}

console.time('process');
const result = processData();
console.timeEnd('process');
```

### Example - localStorage Integration
```javascript
const appState = ReactiveUtils.state({
  user: null,
  settings: {
    theme: 'light',
    notifications: true
  },
  preferences: {
    language: 'en',
    timezone: 'UTC'
  }
});

// Save to localStorage
function saveToLocalStorage() {
  const raw = ReactiveUtils.toRaw(appState);
  
  // Remove functions and non-serializable data
  const serializable = {
    settings: raw.settings,
    preferences: raw.preferences
  };
  
  localStorage.setItem('appState', JSON.stringify(serializable));
}

// Load from localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem('appState');
  
  if (saved) {
    const data = JSON.parse(saved);
    
    // Update state without triggering unnecessary updates
    ReactiveUtils.batch(() => {
      Object.assign(ReactiveUtils.toRaw(appState), data);
    });
  }
}

// Auto-save on changes
appState.$watch('settings', () => {
  saveToLocalStorage();
});
```

### Example - Cloning Without Reactivity
```javascript
function cloneState(state) {
  const raw = ReactiveUtils.toRaw(state);
  return JSON.parse(JSON.stringify(raw));
}

const original = ReactiveUtils.state({
  count: 0,
  data: [1, 2, 3]
});

const clone = cloneState(original);

console.log(ReactiveUtils.isReactive(original)); // true
console.log(ReactiveUtils.isReactive(clone)); // false

clone.count = 100; // Doesn't affect original
console.log(original.count); // 0
```

### Example - Snapshot/Undo
```javascript
class StateHistory {
  constructor(state) {
    this.state = state;
    this.history = [];
    this.maxHistory = 50;
  }
  
  snapshot() {
    const raw = ReactiveUtils.toRaw(this.state);
    const snapshot = JSON.parse(JSON.stringify(raw));
    
    this.history.push(snapshot);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }
  
  undo() {
    if (this.history.length === 0) return false;
    
    const previous = this.history.pop();
    const raw = ReactiveUtils.toRaw(this.state);
    
    // Restore without triggering unnecessary updates
    Object.keys(raw).forEach(key => {
      delete raw[key];
    });
    Object.assign(raw, previous);
    
    // Manually notify
    ReactiveUtils.notify(this.state);
    
    return true;
  }
  
  canUndo() {
    return this.history.length > 0;
  }
}

const editorState = ReactiveUtils.state({
  content: '',
  title: ''
});

const history = new StateHistory(editorState);

// Take snapshots
editorState.content = 'Hello';
history.snapshot();

editorState.content = 'Hello World';
history.snapshot();

// Undo
history.undo();
console.log(editorState.content); // "Hello"
```

### Use Cases
- Serialization (JSON, localStorage, API calls)
- Deep comparisons
- Performance optimization
- Cloning objects
- Snapshot/undo systems
- Debugging

### Important Notes
- Returns the original object for non-reactive values
- Safe for serialization (no proxy, no circular references)
- Changes to raw object affect reactive object (same reference)
- Use for read operations, not for bypassing reactivity intentionally

---

## `notify(state, key)`

Manually trigger dependency updates for a specific key or all keys in a reactive state.

### Syntax
```javascript
ReactiveUtils.notify(state, key)
```

### Parameters
- **`state`** (Object) - Reactive state to notify
- **`key`** (String, optional) - Specific key to notify. If omitted, notifies all dependencies.

### Returns
- `undefined`

### Example - Basic Usage
```javascript
const state = ReactiveUtils.state({
  count: 0
});

ReactiveUtils.effect(() => {
  console.log('Count:', state.count);
});

// Modify raw without triggering (for testing)
const raw = ReactiveUtils.toRaw(state);
raw.count = 10;

// Manually trigger update
ReactiveUtils.notify(state, 'count'); // Logs: "Count: 10"
```

### Example - Array Mutations
```javascript
const todos = ReactiveUtils.state({
  items: [
    { id: 1, text: 'Task 1', done: false }
  ]
});

todos.$bind({
  '#todo-list': () => {
    return todos.items.map(t => `<li>${t.text}</li>`).join('');
  }
});

// Mutate array directly (doesn't trigger automatically for some operations)
todos.items.sort((a, b) => a.text.localeCompare(b.text));

// Manually notify to update DOM
ReactiveUtils.notify(todos, 'items');
```

### Advanced Example - External Updates
```javascript
const dataStore = ReactiveUtils.state({
  data: [],
  lastSync: null
});

dataStore.$bind({
  '#data-count': () => dataStore.data.length,
  '#last-sync': () => {
    return dataStore.lastSync 
      ? dataStore.lastSync.toLocaleTimeString()
      : 'Never';
  }
});

// External update via WebSocket
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  // Get raw to update without triggering intermediate updates
  const raw = ReactiveUtils.toRaw(dataStore);
  
  if (message.type === 'bulk-update') {
    raw.data = message.data;
    raw.lastSync = new Date();
    
    // Manually trigger update once
    ReactiveUtils.notify(dataStore);
  }
};
```

### Example - Computed Invalidation
```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3],
  _cacheInvalid: false
});

state.$computed('sum', function() {
  console.log('Computing sum...');
  return this.items.reduce((sum, v) => sum + v, 0);
});

// Force recompute by notifying
function invalidateCache() {
  state._cacheInvalid = !state._cacheInvalid;
  ReactiveUtils.notify(state, '_cacheInvalid');
}

console.log(state.sum); // Logs: "Computing sum..." → 6
console.log(state.sum); // 6 (cached)
invalidateCache();
console.log(state.sum); // Logs: "Computing sum..." → 6
```

### Example - Batch with Manual Notify
```javascript
const grid = ReactiveUtils.state({
  cells: Array(100).fill(0).map(() => ({
    value: 0,
    active: false
  }))
});

grid.$bind({
  '#grid': function() {
    return this.cells.map(cell => `
      <div class="cell ${cell.active ? 'active' : ''}">
        ${cell.value}
      </div>
    `).join('');
  }
});

function updateMultipleCells(updates) {
  const raw = ReactiveUtils.toRaw(grid);
  
  // Update raw without triggering
  updates.forEach(({ index, value, active }) => {
    raw.cells[index].value = value;
    raw.cells[index].active = active;
  });
  
  // Single update
  ReactiveUtils.notify(grid, 'cells');
}

updateMultipleCells([
  { index: 0, value: 1, active: true },
  { index: 5, value: 2, active: true },
  { index: 10, value: 3, active: false }
]);
```

### Example - Notify All Dependencies
```javascript
const appState = ReactiveUtils.state({
  user: null,
  settings: {},
  theme: 'light'
});

appState.$bind({
  '#user-name': () => appState.user?.name || 'Guest',
  '#theme': () => appState.theme,
  '#settings-count': () => Object.keys(appState.settings).length
});

function reloadAppState(newState) {
  const raw = ReactiveUtils.toRaw(appState);
  
  // Update all properties
  Object.keys(raw).forEach(key => delete raw[key]);
  Object.assign(raw, newState);
  
  // Notify all watchers
  ReactiveUtils.notify(appState); // No key = notify all
}
```

### Use Cases
- Manual control over updates
- Optimizing batch operations
- External data updates
- Array method calls (sort, reverse, etc.)
- Cache invalidation
- Force recomputation

### Important Notes
- Use sparingly - reactive system usually handles updates
- Calling without `key` notifies all dependencies
- Useful after direct raw mutations
- Can be called multiple times (queued like normal updates)

---

## `updateAll(state, updates)`

Unified method for updating both reactive state and DOM elements in a single call. Combines state updates with DOM manipulations.

### Syntax
```javascript
ReactiveUtils.updateAll(state, updates)
// or
updateAll(state, updates)
```

### Parameters
- **`state`** (Object) - Reactive state to update
- **`updates`** (Object) - Object containing state properties and DOM selectors with their updates

### Returns
- The updated state

### Example - Basic Usage
```javascript
const state = ReactiveUtils.state({
  count: 0,
  message: ''
});

// Update both state and DOM
updateAll(state, {
  // State updates
  count: 10,
  message: 'Updated!',
  
  // DOM updates
  '#counter': { textContent: '10' },
  '.status': { className: 'success' }
});
```

### Example - Mixed Updates
```javascript
const appState = ReactiveUtils.state({
  user: null,
  notifications: 0,
  theme: 'light'
});

function userLogin(userData) {
  updateAll(appState, {
    // Update state
    user: userData,
    notifications: userData.unreadCount,
    
    // Update DOM
    '#user-name': { textContent: userData.name },
    '#avatar': { src: userData.avatar },
    '.notification-badge': { 
      textContent: userData.unreadCount,
      style: {
        display: userData.unreadCount > 0 ? 'block' : 'none'
      }
    }
  });
}

userLogin({
  id: 1,
  name: 'John Doe',
  avatar: '/avatar.jpg',
  unreadCount: 5
});
```

### Advanced Example - Form and Validation
```javascript
const formState = ReactiveUtils.state({
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
});

function validateAndUpdate(field, value) {
  const updates = {
    [field]: value
  };
  
  // Add validation
  if (field === 'email' && !value.includes('@')) {
    updates.errors = { ...formState.errors, email: 'Invalid email' };
    updates[`#${field}-error`] = { 
      textContent: 'Invalid email',
      style: { display: 'block', color: 'red' }
    };
    updates[`#${field}-input`] = {
      className: 'input error'
    };
  } else {
    const newErrors = { ...formState.errors };
    delete newErrors[field];
    updates.errors = newErrors;
    updates[`#${field}-error`] = { 
      textContent: '',
      style: { display: 'none' }
    };
    updates[`#${field}-input`] = {
      className: 'input valid'
    };
  }
  
  updateAll(formState, updates);
}

validateAndUpdate('email', 'test@example.com');
```

### Example - Dashboard Updates
```javascript
const dashboard = ReactiveUtils.state({
  stats: {
    users: 0,
    revenue: 0,
    orders: 0
  },
  trend: 'up',
  lastUpdate: null
});

async function refreshDashboard() {
  const data = await fetchDashboardData();
  
  updateAll(dashboard, {
    // Update state
    stats: data.stats,
    trend: data.trend,
    lastUpdate: new Date(),
    
    // Update DOM elements
    '#users-count': { textContent: data.stats.users.toLocaleString() },
    '#revenue-amount': { textContent: `$${data.stats.revenue.toLocaleString()}` },
    '#orders-count': { textContent: data.stats.orders.toLocaleString() },
    '#trend-indicator': { 
      className: `trend-${data.trend}`,
      textContent: data.trend === 'up' ? '↑' : '↓'
    },
    '#last-update': { 
      textContent: `Updated: ${new Date().toLocaleTimeString()}`
    }
  });
}
```

### Example - Nested Property Updates
```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      name: '',
      email: ''
    }
  }
});

// Use dot notation for nested updates
updateAll(state, {
  'user.profile.name': 'John Doe',
  'user.profile.email': 'john@example.com',
  
  // DOM updates
  '#profile-name': { textContent: 'John Doe' },
  '#profile-email': { textContent: 'john@example.com' }
});
```

### Example - Bulk Element Updates
```javascript
const game = ReactiveUtils.state({
  score: 0,
  level: 1,
  lives: 3,
  paused: false
});

function updateGameState(changes) {
  const updates = {
    ...changes,
    
    // Update all game displays
    '#score': { textContent: changes.score || game.score },
    '#level': { textContent: changes.level || game.level },
    '#lives': { textContent: '❤️'.repeat(changes.lives || game.lives) },
    '.game-container': {
      className: changes.paused ? 'game-container paused' : 'game-container'
    }
  };
  
  updateAll(game, updates);
}

updateGameState({ score: 1000, level: 2, lives: 2 });
```

### Example - Optimized Batch Updates
```javascript
const dataGrid = ReactiveUtils.state({
  rows: [],
  selectedRow: null,
  sortColumn: null,
  sortDirection: 'asc'
});

function loadAndDisplay(data, sortBy = null) {
  const updates = {
    rows: data
  };
  
  if (sortBy) {
    updates.sortColumn = sortBy;
    updates.sortDirection = 'asc';
  }
  
  // Update table
  const tableHTML = data.map((row, i) => `
    <tr class="${i === dataGrid.selectedRow ? 'selected' : ''}">
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.value}</td>
    </tr>
  `).join('');
  
  updates['#data-table tbody'] = { innerHTML: tableHTML };
  updates['#row-count'] = { textContent: `${data.length} rows` };
  
  updateAll(dataGrid, updates);
}
```

### Use Cases
- Synchronizing state and UI
- Form updates with validation feedback
- Dashboard data refresh
- Game state updates
- Bulk UI updates
- Reducing boilerplate code

### Important Notes
- Batches all updates automatically
- Recognizes selectors by `#`, `.`, `[`, or `>` prefix
- Can mix state property updates with DOM updates
- Supports nested property updates with dot notation
- More efficient than separate state and DOM updates

---

## Use Cases

### When to Use `isReactive()`
- ✅ Type checking before operations
- ✅ Conditional logic for mixed types
- ✅ Validation in library code
- ✅ Debugging and inspection
- ❌ Inside hot paths (performance)
- ❌ When type is known

### When to Use `toRaw()`
- ✅ Serialization (JSON, API, storage)
- ✅ Deep comparisons
- ✅ Performance-critical operations
- ✅ Cloning without reactivity
- ❌ When reactivity is needed
- ❌ For normal state updates

### When to Use `notify()`
- ✅ After raw mutations
- ✅ Manual cache invalidation
- ✅ External data updates
- ✅ Force recomputation
- ❌ For normal updates (use direct assignment)
- ❌ When automatic tracking works

### When to Use `updateAll()`
- ✅ Synchronizing state and DOM
- ✅ Bulk updates
- ✅ Form submissions
- ✅ Dashboard refreshes
- ❌ Simple state-only updates
- ❌ When bindings handle DOM

---

## Common Patterns

### Pattern 1: Safe Type Handling
```javascript
function createReactiveOrReturn(value) {
  if (ReactiveUtils.isReactive(value)) {
    return value;
  }
  
  if (value === null || value === undefined) {
    return ReactiveUtils.state({});
  }
  
  if (typeof value === 'object') {
    return ReactiveUtils.state(value);
  }
  
  return ReactiveUtils.ref(value);
}
```

### Pattern 2: Serialization Helper
```javascript
class StateSerializer {
  static save(state, key) {
    const raw = ReactiveUtils.toRaw(state);
    const json = JSON.stringify(raw);
    localStorage.setItem(key, json);
  }
  
  static load(key) {
    const json = localStorage.getItem(key);
    if (!json) return null;
    
    const data = JSON.parse(json);
    return ReactiveUtils.state(data);
  }
  
  static savePartial(state, key, fields) {
    const raw = ReactiveUtils.toRaw(state);
    const partial = {};
    
    fields.forEach(field => {
      if (field in raw) {
        partial[field] = raw[field];
      }
    });
    
    localStorage.setItem(key, JSON.stringify(partial));
  }
}
```

### Pattern 3: Optimistic Updates with Rollback
```javascript
class OptimisticState {
  constructor(initialState) {
    this.state = ReactiveUtils.state(initialState);
    this.snapshot = null;
  }
  
  beginUpdate() {
    this.snapshot = ReactiveUtils.toRaw(this.state);
    this.snapshot = JSON.parse(JSON.stringify(this.snapshot));
  }
  
  async commit(updateFn) {
    this.beginUpdate();
    
    try {
      await updateFn(this.state);
      this.snapshot = null;
      return true;
    } catch (error) {
      this.rollback();
      return false;
    }
  }
  
  rollback() {
    if (!this.snapshot) return;
    
    const raw = ReactiveUtils.toRaw(this.state);
    Object.keys(raw).forEach(k => delete raw[k]);
    Object.assign(raw, this.snapshot);
    
    ReactiveUtils.notify(this.state);
    this.snapshot = null;
  }
}
```

### Pattern 4: Unified Update Manager
```javascript
class UpdateManager {
  constructor(state) {
    this.state = state;
    this.queue = [];
    this.processing = false;
  }
  
  schedule(updates) {
    this.queue.push(updates);
    
    if (!this.processing) {
      this.process();
    }
  }
  
  process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    const batch = this.queue.splice(0, this.queue.length);
    
    const merged = batch.reduce((acc, updates) => {
      return { ...acc, ...updates };
    }, {});
    
    updateAll(this.state, merged);
    
    setTimeout(() => this.process(), 0);
  }
}
```

---

## Best Practices

### ✅ DO

```javascript
// Check reactivity before operations
if (ReactiveUtils.isReactive(value)) {
  value.$computed('sum', () => /* ... */);
}

// Use toRaw for serialization
const json = JSON.stringify(ReactiveUtils.toRaw(state));

// Manually notify after raw batch updates
const raw = ReactiveUtils.toRaw(state);
raw.items.push(...newItems);
ReactiveUtils.notify(state, 'items');

// Use updateAll for synchronized updates
updateAll(state, {
  count: 10,
  '#counter': { textContent: '10' }
});
```

### ❌ DON'T

```javascript
// Don't check reactivity in loops
for (let i = 0; i < 1000; i++) {
  if (ReactiveUtils.isReactive(items[i])) { // Slow
    // ...
  }
}

// Don't use toRaw to bypass reactivity intentionally
const raw = ReactiveUtils.toRaw(state);
raw.count++; // Wrong approach

// Don't notify unnecessarily
state.count = 10; // Automatically tracked
ReactiveUtils.notify(state, 'count'); // Unnecessary

// Don't use updateAll for simple updates
updateAll(state, { count: 10 }); // Overkill
state.count = 10; // Better
```

---

## Troubleshooting

### Issue 1: Changes Not Reflecting

```javascript
// ❌ Problem: Modifying raw without notify
const raw = ReactiveUtils.toRaw(state);
raw.count = 10;
// UI doesn't update!

// ✅ Solution: Notify after raw changes
const raw = ReactiveUtils.toRaw(state);
raw.count = 10;
ReactiveUtils.notify(state, 'count');
```

### Issue 2: False Reactivity Check

```javascript
// ❌ Problem: Checking nested properties
const state = ReactiveUtils.state({ user: { name: 'John' } });
console.log(ReactiveUtils.isReactive(state.user)); // Depends on implementation

// ✅ Solution: Check top-level object
console.log(ReactiveUtils.isReactive(state)); // true
```

### Issue 3: Serialization Errors

```javascript
// ❌ Problem: Serializing reactive object directly
const state = ReactiveUtils.state({ count: 0 });
JSON.stringify(state); // May include proxy artifacts

// ✅ Solution: Use toRaw first
const raw = ReactiveUtils.toRaw(state);
JSON.stringify(raw); // Clean serialization
```

### Issue 4: updateAll Not Working

```javascript
// ❌ Problem: Invalid selector format
updateAll(state, {
  count: 10,
  'counter': { textContent: '10' } // Missing selector prefix
});

// ✅ Solution: Use proper selector
updateAll(state, {
  count: 10,
  '#counter': { textContent: '10' } // Correct with #
});
```

### Issue 5: Notify Not Triggering

```javascript
// ❌ Problem: Wrong state reference
const state = ReactiveUtils.state({ count: 0 });
const copy = { ...state };
ReactiveUtils.notify(copy, 'count'); // Won't work

// ✅ Solution: Use original reactive object
ReactiveUtils.notify(state, 'count'); // Works
```

---

## API Quick Reference

```javascript
// Check if value is reactive
ReactiveUtils.isReactive(value)  // Returns: Boolean

// Get raw non-reactive value
ReactiveUtils.toRaw(value)       // Returns: Raw value

// Manually trigger updates
ReactiveUtils.notify(state)      // Notify all
ReactiveUtils.notify(state, key) // Notify specific key

// Unified state + DOM updates
updateAll(state, {
  // State properties
  count: 10,
  message: 'Hello',
  
  // DOM selectors
  '#element': { textContent: 'Updated' },
  '.class': { className: 'active' }
})

// Common patterns
if (ReactiveUtils.isReactive(value)) {
  // Handle reactive value
}

const raw = ReactiveUtils.toRaw(state);
const json = JSON.stringify(raw);

const raw = ReactiveUtils.toRaw(state);
raw.items.push(...newItems);
ReactiveUtils.notify(state, 'items');

updateAll(state, {
  user: userData,
  '#user-name': { textContent: userData.name }
});
```

---

## Comparison Table

| Function | Purpose | Returns | Common Use |
|----------|---------|---------|------------|
| `isReactive()` | Check if reactive | Boolean | Type checking |
| `toRaw()` | Get raw value | Raw object | Serialization |
| `notify()` | Trigger updates | undefined | Manual updates |
| `updateAll()` | State + DOM | State | Bulk updates |

---

## Complete Examples

### Example 1: State Persistence System

```javascript
class StatePersistence {
  constructor(state, storageKey) {
    this.state = state;
    this.storageKey = storageKey;
    this.saving = false;
  }
  
  save() {
    if (this.saving) return;
    
    this.saving = true;
    
    try {
      const raw = ReactiveUtils.toRaw(this.state);
      const json = JSON.stringify(raw);
      localStorage.setItem(this.storageKey, json);
      console.log('State saved');
    } catch (error) {
      console.error('Failed to save state:', error);
    } finally {
      this.saving = false;
    }
  }
  
  load() {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) return false;
      
      const data = JSON.parse(json);
      const raw = ReactiveUtils.toRaw(this.state);
      
      // Clear existing
      Object.keys(raw).forEach(key => delete raw[key]);
      
      // Load new
      Object.assign(raw, data);
      
      // Trigger updates
      ReactiveUtils.notify(this.state);
      
      console.log('State loaded');
      return true;
    } catch (error) {
      console.error('Failed to load state:', error);
      return false;
    }
  }
  
  autoSave(debounceMs = 1000) {
    let saveTimer;
    
    this.state.$watch(() => JSON.stringify(this.state), () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => this.save(), debounceMs);
    });
  }
}

// Usage
const appState = ReactiveUtils.state({
  user: null,
  settings: {}
});

const persistence = new StatePersistence(appState, 'app-state');
persistence.load();
persistence.autoSave();
```

### Example 2: Type-Safe State Wrapper

```javascript
class TypedState {
  constructor(initialState, schema) {
    this.schema = schema;
    
    if (ReactiveUtils.isReactive(initialState)) {
      this.state = initialState;
    } else {
      this.state = ReactiveUtils.state(initialState);
    }
  }
  
  get(key) {
    return this.state[key];
  }
  
  set(key, value) {
    // Validate type
    const expectedType = this.schema[key];
    const actualType = typeof value;
    
    if (expectedType && actualType !== expectedType) {
      throw new TypeError(
        `Expected ${expectedType} for ${key}, got ${actualType}`
      );
    }
    
    this.state[key] = value;
  }
  
  update(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
  
  toJSON() {
    return ReactiveUtils.toRaw(this.state);
  }
  
  isReactive() {
    return ReactiveUtils.isReactive(this.state);
  }
}

// Usage
const userState = new TypedState(
  { name: '', age: 0, active: false },
  { name: 'string', age: 'number', active: 'boolean' }
);

userState.set('name', 'John'); // OK
userState.set('age', '25'); // Throws TypeError
```

### Example 3: Smart Update Manager

```javascript
class SmartUpdater {
  constructor(state) {
    this.state = state;
    this.updateQueue = [];
    this.processing = false;
  }
  
  queueUpdate(updates) {
    this.updateQueue.push(updates);
    
    if (!this.processing) {
      this.processQueue();
    }
  }
  
  processQueue() {
    if (this.updateQueue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    
    // Merge all queued updates
    const merged = this.updateQueue.reduce((acc, updates) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (typeof value === 'function') {
          acc[key] = value(acc[key]);
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {});
    
    this.updateQueue = [];
    
    // Apply merged updates
    updateAll(this.state, merged);
    
    // Process next batch
    setTimeout(() => this.processQueue(), 0);
  }
  
  immediateUpdate(updates) {
    updateAll(this.state, updates);
  }
}

// Usage
const state = ReactiveUtils.state({ count: 0, total: 0 });
const updater = new SmartUpdater(state);

// Queue multiple updates
updater.queueUpdate({ count: 1 });
updater.queueUpdate({ count: (prev) => prev + 1 });
updater.queueUpdate({ total: 10 });

// All applied in single batch
```

---

## Summary

### Utility Functions Overview

- **`isReactive()`**: Type checking for reactive values
- **`toRaw()`**: Access raw, non-reactive data
- **`notify()`**: Manual dependency notification
- **`updateAll()`**: Unified state and DOM updates

### Key Takeaways

1. **Use `isReactive()` for type safety** - Ensure correct handling of mixed types
2. **Use `toRaw()` for serialization** - Safe JSON, localStorage, API calls
3. **Use `notify()` sparingly** - Only when automatic tracking doesn't work
4. **Use `updateAll()` for convenience** - Simplify state + DOM synchronization
5. **Combine utilities effectively** - More powerful together

### When to Use

- ✅ `isReactive()`: Type guards, conditional logic
- ✅ `toRaw()`: Serialization, comparisons, performance
- ✅ `notify()`: External updates, manual control
- ✅ `updateAll()`: Bulk operations, form submissions
- ❌ Overuse: Automatic reactivity usually sufficient

---
