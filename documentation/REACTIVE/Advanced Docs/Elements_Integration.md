# Elements Integration Methods - Complete Guide

## Overview

When the reactive library is integrated with DOM Helpers, all reactive functionality becomes available through the `Elements` namespace. This provides seamless integration between reactive state management and DOM manipulation, allowing you to use reactive features alongside core DOM helper methods.

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [State Creation Methods](#state-creation-methods)
3. [Reactivity Methods](#reactivity-methods)
4. [Specialized Constructors](#specialized-constructors)
5. [Batch Operations](#batch-operations)
6. [Utility Methods](#utility-methods)
7. [Special Integration Methods](#special-integration-methods)
8. [Usage Examples](#usage-examples)
9. [Best Practices](#best-practices)
10. [API Quick Reference](#api-quick-reference)

---

## Integration Overview

### What is Elements Integration?

The reactive library automatically integrates with DOM Helpers when both are loaded, exposing all reactive functionality through the `Elements` namespace. This allows you to:

- Use reactive methods alongside DOM manipulation
- Create reactive state with DOM bindings
- Leverage both ecosystems together seamlessly

### Checking Integration

```javascript
// Check if reactive library is integrated
if (Elements.state) {
  console.log('Reactive library is integrated!');
}

// All reactive methods available on Elements
console.log(typeof Elements.state);         // 'function'
console.log(typeof Elements.computed);      // 'function'
console.log(typeof Elements.batch);         // 'function'
```

### Namespace Availability

The same reactive functionality is available through multiple namespaces:

```javascript
// All equivalent (when integrated)
Elements.state({ count: 0 })
Collections.state({ count: 0 })
Selector.state({ count: 0 })
ReactiveUtils.state({ count: 0 })

// Use whichever fits your coding style
const state1 = Elements.state({ count: 0 });      // Using Elements
const state2 = ReactiveUtils.state({ count: 0 }); // Using ReactiveUtils
```

---

## State Creation Methods

### `Elements.state(initialState)`

Create reactive state through Elements namespace.

**Syntax:**
```javascript
Elements.state(initialState)
```

**Example:**
```javascript
const counter = Elements.state({
  count: 0,
  step: 1
});

// Use with DOM helpers
Elements('#increment').on('click', () => {
  counter.count += counter.step;
});

// Bind to display
counter.$bind({
  '#count-display': () => counter.count
});
```

---

### `Elements.createState(initialState, bindingDefs)`

Create reactive state with automatic DOM bindings.

**Syntax:**
```javascript
Elements.createState(initialState, bindingDefs)
```

**Example:**
```javascript
const app = Elements.createState(
  { count: 0, message: 'Hello' },
  {
    '#count': () => app.count,
    '#message': () => app.message
  }
);

// State automatically updates DOM
app.count = 10;  // Updates #count element
app.message = 'Updated!'; // Updates #message element
```

---

### `Elements.ref(value)`

Create a single ref value.

**Syntax:**
```javascript
Elements.ref(value)
```

**Example:**
```javascript
const count = Elements.ref(0);

Elements('#increment').on('click', () => {
  count.value++;
});

// Bind to DOM
count.$bind({
  '#counter': () => count.value
});
```

---

### `Elements.refs(defs)`

Create multiple refs at once.

**Syntax:**
```javascript
Elements.refs(defs)
```

**Example:**
```javascript
const refs = Elements.refs({
  count: 0,
  name: 'John',
  active: false
});

console.log(refs.count.value); // 0
console.log(refs.name.value); // 'John'
console.log(refs.active.value); // false
```

---

### `Elements.list(items)`

Create a reactive collection.

**Syntax:**
```javascript
Elements.list(items)
```

**Example:**
```javascript
const todos = Elements.list([
  { id: 1, text: 'Task 1', done: false }
]);

Elements('#add-todo').on('click', () => {
  todos.$add({
    id: Date.now(),
    text: Elements('#todo-input').val(),
    done: false
  });
});

todos.$bind({
  '#todo-list': function() {
    return this.items.map(t => `
      <li class="${t.done ? 'done' : ''}">
        ${t.text}
      </li>
    `).join('');
  }
});
```

---

## Reactivity Methods

### `Elements.computed(state, defs)`

Add computed properties to state.

**Syntax:**
```javascript
Elements.computed(state, defs)
```

**Example:**
```javascript
const state = Elements.state({
  firstName: 'John',
  lastName: 'Doe'
});

Elements.computed(state, {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  initials() {
    return `${this.firstName[0]}${this.lastName[0]}`;
  }
});

console.log(state.fullName); // 'John Doe'
console.log(state.initials); // 'JD'
```

---

### `Elements.watch(state, defs)`

Add watchers to state.

**Syntax:**
```javascript
Elements.watch(state, defs)
```

**Example:**
```javascript
const state = Elements.state({
  count: 0
});

Elements.watch(state, {
  count(newVal, oldVal) {
    console.log(`Count changed from ${oldVal} to ${newVal}`);
    Elements('#status').text(`Count: ${newVal}`);
  }
});

state.count = 5; // Logs and updates DOM
```

---

### `Elements.effect(fn)`

Create a reactive effect.

**Syntax:**
```javascript
Elements.effect(fn)
```

**Example:**
```javascript
const state = Elements.state({ count: 0 });

Elements.effect(() => {
  Elements('#counter').text(state.count);
  console.log('Count updated:', state.count);
});

state.count = 10; // Updates DOM and logs
```

---

### `Elements.effects(defs)`

Create multiple effects from object.

**Syntax:**
```javascript
Elements.effects(defs)
```

**Example:**
```javascript
const state = Elements.state({
  count: 0,
  message: ''
});

Elements.effects({
  updateCounter() {
    Elements('#counter').text(state.count);
  },
  updateMessage() {
    Elements('#message').text(state.message);
  }
});
```

---

### `Elements.bindings(defs)`

Create DOM bindings with selectors.

**Syntax:**
```javascript
Elements.bindings(defs)
```

**Example:**
```javascript
const state = Elements.state({
  user: { name: 'John', email: 'john@example.com' },
  count: 0
});

Elements.bindings({
  '#user-name': () => state.user.name,
  '#user-email': () => state.user.email,
  '#counter': () => state.count,
  '.status': {
    textContent: () => `Count: ${state.count}`,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});
```

---

## Specialized Constructors

### `Elements.store(initialState, options)`

Create a store with getters and actions.

**Syntax:**
```javascript
Elements.store(initialState, options)
```

**Example:**
```javascript
const userStore = Elements.store(
  { 
    user: null,
    isAuthenticated: false 
  },
  {
    getters: {
      userName() {
        return this.user?.name || 'Guest';
      }
    },
    actions: {
      login(state, userData) {
        state.user = userData;
        state.isAuthenticated = true;
        Elements('#user-area').show();
      },
      logout(state) {
        state.user = null;
        state.isAuthenticated = false;
        Elements('#user-area').hide();
      }
    }
  }
);

// Use actions
Elements('#login-btn').on('click', () => {
  userStore.login({ name: 'John', id: 1 });
});
```

---

### `Elements.component(config)`

Create a component with state, computed, watchers, and lifecycle.

**Syntax:**
```javascript
Elements.component(config)
```

**Example:**
```javascript
const todoApp = Elements.component({
  state: {
    todos: [],
    filter: 'all'
  },
  
  computed: {
    filteredTodos() {
      if (this.filter === 'all') return this.todos;
      if (this.filter === 'active') return this.todos.filter(t => !t.done);
      return this.todos.filter(t => t.done);
    },
    stats() {
      return {
        total: this.todos.length,
        active: this.todos.filter(t => !t.done).length,
        completed: this.todos.filter(t => t.done).length
      };
    }
  },
  
  actions: {
    addTodo(state, text) {
      state.todos.push({
        id: Date.now(),
        text,
        done: false
      });
    },
    toggleTodo(state, id) {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    }
  },
  
  bindings: {
    '#todo-list': function() {
      return this.filteredTodos.map(t => `
        <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
          ${t.text}
        </li>
      `).join('');
    },
    '#stats': () => {
      const s = todoApp.stats;
      return `Total: ${s.total}, Active: ${s.active}, Done: ${s.completed}`;
    }
  },
  
  mounted() {
    Elements('#add-todo').on('click', () => {
      const text = Elements('#todo-input').val();
      if (text) {
        this.addTodo(text);
        Elements('#todo-input').val('');
      }
    });
  }
});
```

---

### `Elements.reactive(initialState)`

Fluent builder for reactive state.

**Syntax:**
```javascript
Elements.reactive(initialState)
```

**Example:**
```javascript
const builder = Elements.reactive({ count: 0, name: '' })
  .computed({
    display() {
      return `${this.name}: ${this.count}`;
    }
  })
  .watch({
    count(val) {
      console.log('Count changed:', val);
    }
  })
  .effect(() => {
    Elements('#display').text(builder.state.display);
  })
  .action('increment', (state) => {
    state.count++;
  })
  .action('reset', (state) => {
    state.count = 0;
    state.name = '';
  });

const state = builder.build();

// Use with DOM helpers
Elements('#inc-btn').on('click', () => {
  state.increment();
});
```

---

## Batch Operations

### `Elements.batch(fn)`

Batch multiple updates into one.

**Syntax:**
```javascript
Elements.batch(fn)
```

**Example:**
```javascript
const state = Elements.state({
  x: 0,
  y: 0,
  rotation: 0
});

state.$bind({
  '#position': () => `X: ${state.x}, Y: ${state.y}, Rotation: ${state.rotation}°`
});

Elements('#update-all').on('click', () => {
  Elements.batch(() => {
    state.x = 100;
    state.y = 200;
    state.rotation = 45;
  });
  // Updates DOM only once
});
```

---

### `Elements.pause()`

Pause reactivity.

**Syntax:**
```javascript
Elements.pause()
```

**Example:**
```javascript
const items = Elements.list([]);

Elements('#import').on('click', async () => {
  const data = await fetchLargeDataset();
  
  Elements.pause();
  
  try {
    data.forEach(item => items.$add(item));
  } finally {
    Elements.resume(true);
  }
});
```

---

### `Elements.resume(flush)`

Resume reactivity.

**Syntax:**
```javascript
Elements.resume(flush)
```

**Example:**
```javascript
Elements.pause();
state.count = 10;
state.message = 'Updated';
Elements.resume(true); // Flush all updates
```

---

### `Elements.untrack(fn)`

Run function without tracking dependencies.

**Syntax:**
```javascript
Elements.untrack(fn)
```

**Example:**
```javascript
const state = Elements.state({
  data: [],
  debugMode: false
});

Elements.effect(() => {
  console.log('Data updated:', state.data.length);
  
  // Check debug mode without tracking it
  const debug = Elements.untrack(() => state.debugMode);
  if (debug) {
    console.log('Debug info:', state.data);
  }
});
```

---

## Utility Methods

### `Elements.updateAll(state, updates)`

Unified state and DOM updates.

**Syntax:**
```javascript
Elements.updateAll(state, updates)
```

**Example:**
```javascript
const app = Elements.state({
  user: null,
  notifications: 0
});

Elements('#login-btn').on('click', async () => {
  const userData = await login();
  
  Elements.updateAll(app, {
    // Update state
    user: userData,
    notifications: userData.unreadCount,
    
    // Update DOM
    '#user-name': { textContent: userData.name },
    '#notifications': { textContent: userData.unreadCount },
    '.user-avatar': { src: userData.avatar }
  });
});
```

---

### `Elements.isReactive(value)`

Check if value is reactive.

**Syntax:**
```javascript
Elements.isReactive(value)
```

**Example:**
```javascript
const state = Elements.state({ count: 0 });
const plain = { count: 0 };

console.log(Elements.isReactive(state)); // true
console.log(Elements.isReactive(plain)); // false

function processData(data) {
  if (Elements.isReactive(data)) {
    // Use reactive features
    data.$computed('double', function() {
      return this.value * 2;
    });
  }
}
```

---

### `Elements.toRaw(value)`

Get raw non-reactive value.

**Syntax:**
```javascript
Elements.toRaw(value)
```

**Example:**
```javascript
const state = Elements.state({
  user: { name: 'John', email: 'john@example.com' }
});

Elements('#save').on('click', async () => {
  const raw = Elements.toRaw(state);
  
  await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raw)
  });
});
```

---

### `Elements.notify(state, key)`

Manually notify dependencies.

**Syntax:**
```javascript
Elements.notify(state, key)
```

**Example:**
```javascript
const grid = Elements.state({
  cells: Array(100).fill(0)
});

Elements('#sort').on('click', () => {
  const raw = Elements.toRaw(grid);
  raw.cells.sort((a, b) => a - b);
  Elements.notify(grid, 'cells');
});
```

---

## Special Integration Methods

### `Elements.bind(bindingDefs)` - ID-Based Bindings

Special method for ID-based bindings (without `#` prefix).

**Syntax:**
```javascript
Elements.bind(bindingDefs)
```

**Key Difference:**
- `Elements.bindings()` - Uses full selectors (`#id`, `.class`)
- `Elements.bind()` - Uses IDs directly (without `#`)

**Example:**
```javascript
const state = Elements.state({
  count: 0,
  message: 'Hello'
});

// ID-based bindings (no # needed)
Elements.bind({
  'counter': () => state.count,
  'message-display': () => state.message,
  'status': {
    textContent: () => `Count: ${state.count}`,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});

// Equivalent to:
Elements.bindings({
  '#counter': () => state.count,
  '#message-display': () => state.message,
  '#status': {
    textContent: () => `Count: ${state.count}`,
    className: () => state.count > 10 ? 'high' : 'low'
  }
});
```

**When to Use:**
```javascript
// Use Elements.bind() when working primarily with IDs
Elements.bind({
  'user-name': () => user.name,
  'user-email': () => user.email
});

// Use Elements.bindings() for mixed selectors
Elements.bindings({
  '#user-name': () => user.name,
  '.status-badge': () => user.status,
  'div[data-role="admin"]': () => user.isAdmin ? 'Admin' : 'User'
});
```

---

## Usage Examples

### Example 1: Todo App with Elements Integration

```javascript
// Create reactive state
const app = Elements.state({
  todos: [],
  filter: 'all',
  newTodo: ''
});

// Add computed properties
Elements.computed(app, {
  filteredTodos() {
    if (this.filter === 'all') return this.todos;
    if (this.filter === 'active') return this.todos.filter(t => !t.done);
    return this.todos.filter(t => t.done);
  },
  stats() {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.done).length,
      done: this.todos.filter(t => t.done).length
    };
  }
});

// Set up DOM bindings
Elements.bind({
  'todo-list': function() {
    return app.filteredTodos.map(todo => `
      <li class="${todo.done ? 'done' : ''}" data-id="${todo.id}">
        <input type="checkbox" ${todo.done ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete">×</button>
      </li>
    `).join('');
  },
  'stats': () => {
    const s = app.stats;
    return `${s.active} active, ${s.done} done, ${s.total} total`;
  }
});

// Set up event handlers with Elements
Elements('#add-todo').on('click', () => {
  if (!app.newTodo.trim()) return;
  
  app.todos.push({
    id: Date.now(),
    text: app.newTodo,
    done: false
  });
  
  app.newTodo = '';
  Elements('#todo-input').val('');
});

Elements('#todo-list').on('change', 'input[type="checkbox"]', function() {
  const id = Number(Elements(this).parent().data('id'));
  const todo = app.todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
});

Elements('#todo-list').on('click', '.delete', function() {
  const id = Number(Elements(this).parent().data('id'));
  const index = app.todos.findIndex(t => t.id === id);
  if (index !== -1) app.todos.splice(index, 1);
});

Elements('.filter-btn').on('click', function() {
  app.filter = Elements(this).data('filter');
  Elements('.filter-btn').removeClass('active');
  Elements(this).addClass('active');
});
```

### Example 2: Form with Validation

```javascript
const form = Elements.state({
  email: '',
  password: '',
  errors: {},
  isSubmitting: false
});

Elements.computed(form, {
  isValid() {
    return Object.keys(this.errors).length === 0;
  },
  canSubmit() {
    return this.isValid && !this.isSubmitting && 
           this.email && this.password;
  }
});

// Watch for validation
Elements.watch(form, {
  email(val) {
    if (!val) {
      form.errors.email = 'Email is required';
    } else if (!val.includes('@')) {
      form.errors.email = 'Invalid email';
    } else {
      delete form.errors.email;
    }
  },
  password(val) {
    if (!val) {
      form.errors.password = 'Password is required';
    } else if (val.length < 6) {
      form.errors.password = 'Password must be at least 6 characters';
    } else {
      delete form.errors.password;
    }
  }
});

// Set up bindings
Elements.bind({
  'email-error': () => form.errors.email || '',
  'password-error': () => form.errors.password || '',
  'submit-btn': {
    disabled: () => !form.canSubmit,
    textContent: () => form.isSubmitting ? 'Submitting...' : 'Login'
  }
});

// Set up event handlers
Elements('#email').on('input', function() {
  form.email = Elements(this).val();
});

Elements('#password').on('input', function() {
  form.password = Elements(this).val();
});

Elements('#login-form').on('submit', async (e) => {
  e.preventDefault();
  
  if (!form.canSubmit) return;
  
  form.isSubmitting = true;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Elements.toRaw(form))
    });
    
    if (response.ok) {
      const user = await response.json();
      Elements.updateAll(form, {
        email: '',
        password: '',
        errors: {},
        '#success': { textContent: 'Login successful!' }
      });
    } else {
      form.errors.form = 'Login failed';
    }
  } catch (error) {
    form.errors.form = 'Network error';
  } finally {
    form.isSubmitting = false;
  }
});
```

### Example 3: Real-Time Dashboard

```javascript
const dashboard = Elements.component({
  state: {
    metrics: { users: 0, revenue: 0, orders: 0 },
    trend: 'up',
    lastUpdate: null,
    autoRefresh: true
  },
  
  computed: {
    formattedMetrics() {
      return {
        users: this.metrics.users.toLocaleString(),
        revenue: `$${this.metrics.revenue.toLocaleString()}`,
        orders: this.metrics.orders.toLocaleString()
      };
    },
    lastUpdateText() {
      return this.lastUpdate 
        ? this.lastUpdate.toLocaleTimeString()
        : 'Never';
    }
  },
  
  actions: {
    async refresh(state) {
      try {
        const data = await fetch('/api/metrics').then(r => r.json());
        
        Elements.batch(() => {
          state.metrics = data.metrics;
          state.trend = data.trend;
          state.lastUpdate = new Date();
        });
      } catch (error) {
        console.error('Failed to refresh:', error);
      }
    },
    
    toggleAutoRefresh(state) {
      state.autoRefresh = !state.autoRefresh;
    }
  },
  
  bindings: {
    '#users-count': () => dashboard.formattedMetrics.users,
    '#revenue-amount': () => dashboard.formattedMetrics.revenue,
    '#orders-count': () => dashboard.formattedMetrics.orders,
    '#trend-indicator': {
      className: () => `trend-${dashboard.trend}`,
      textContent: () => dashboard.trend === 'up' ? '↑' : '↓'
    },
    '#last-update': () => dashboard.lastUpdateText,
    '#auto-refresh': {
      className: () => dashboard.autoRefresh ? 'active' : ''
    }
  },
  
  mounted() {
    // Initial load
    this.refresh();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
      if (this.autoRefresh) {
        this.refresh();
      }
    }, 30000);
    
    // Set up controls
    Elements('#refresh-btn').on('click', () => {
      this.refresh();
    });
    
    Elements('#toggle-auto').on('click', () => {
      this.toggleAutoRefresh();
    });
  }
});
```

---

## Best Practices

### ✅ DO

```javascript
// Use Elements namespace consistently
const state = Elements.state({ count: 0 });
Elements.computed(state, { double() { return this.count * 2; } });
Elements('#btn').on('click', () => state.count++);

// Combine with DOM helpers naturally
Elements('#list').empty();
items.forEach(item => {
  Elements('#list').append(`<li>${item}</li>`);
});

// Use Elements.bind() for ID-only bindings
Elements.bind({
  'counter': () => state.count,
  'display': () => state.message
});

// Batch updates with DOM operations
Elements.batch(() => {
  state.x = 10;
  state.y = 20;
  Elements('#status').text('Updated');
});
```

### ❌ DON'T

```javascript
// Don't mix namespaces unnecessarily
const state = Elements.state({ count: 0 });
ReactiveUtils.computed(state, { ... }); // Confusing
Collections.watch(state, { ... }); // Inconsistent

// Don't forget Elements is integrated
Elements.someMethod(); // ✅ Works
SomeMethod(); // ❌ Won't work

// Don't use full selectors with Elements.bind()
Elements.bind({
  '#counter': () => state.count // ❌ # not needed
});

// Use Elements.bindings() instead
Elements.bindings({
  '#counter': () => state.count // ✅ Correct
});
```

---

## API Quick Reference

```javascript
// State Creation
Elements.state(initialState)
Elements.createState(initialState, bindings)
Elements.ref(value)
Elements.refs(defs)
Elements.list(items)

// Reactivity
Elements.computed(state, defs)
Elements.watch(state, defs)
Elements.effect(fn)
Elements.effects(defs)
Elements.bindings(defs)

// Specialized
Elements.store(initialState, options)
Elements.component(config)
Elements.reactive(initialState) // Returns builder

// Batch Operations
Elements.batch(fn)
Elements.pause()
Elements.resume(flush)
Elements.untrack(fn)

// Utilities
Elements.updateAll(state, updates)
Elements.isReactive(value)
Elements.toRaw(value)
Elements.notify(state, key)

// Special
Elements.bind(bindingDefs) // ID-based (no # needed)
```

---

## Summary

### Key Benefits of Elements Integration

1. **Unified API** - Use reactive features alongside DOM manipulation
2. **Seamless Integration** - No context switching between libraries
3. **Consistent Naming** - All methods available through Elements namespace
4. **Enhanced Productivity** - Combine strengths of both ecosystems

### Common Workflows

```javascript
// 1. Create state
const state = Elements.state({ ... });

// 2. Add reactivity
Elements.computed(state, { ... });
Elements.watch(state, { ... });

// 3. Set up bindings
Elements.bind({ ... });

// 4. Handle DOM events
Elements('#btn').on('click', () => {
  state.value++;
});

// 5. Batch updates
Elements.batch(() => {
  // Multiple updates
});
```

### When to Use Elements Integration

- ✅ Building DOM-heavy applications
- ✅ Need both reactive state and DOM manipulation
- ✅ Want unified, consistent API
- ✅ Prefer namespace-based organization
- ❌ Only need reactive features (use ReactiveUtils)
- ❌ Not using DOM helpers

---
