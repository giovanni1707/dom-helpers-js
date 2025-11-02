[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Instance Methods - Complete Guide

## Overview

Every reactive state object created by the library comes with powerful instance methods. These methods are automatically added to your state objects and provide fine-grained control over reactivity, computed properties, watchers, and DOM updates.

---

## Table of Contents

1. [$computed(key, fn)](#computedkey-fn) - Add computed property
2. [$watch(keyOrFn, callback)](#watchkeyorfn-callback) - Watch for changes
3. [$batch(fn)](#batchfn) - Batch multiple updates
4. [$notify(key)](#notifykey) - Manually trigger updates
5. [$raw](#raw) - Get non-reactive raw object
6. [$update(updates)](#updateupdates) - Mixed state and DOM updates
7. [$set(updates)](#setupdates) - Functional updates
8. [$bind(bindingDefs)](#bindbindingdefs) - Create DOM bindings
9. [Method Chaining](#method-chaining) - Fluent API pattern
10. [Performance Comparison](#performance-comparison) - Optimization tips
11. [Best Practices](#best-practices) - Usage guidelines
12. [Common Patterns](#common-patterns) - Real-world examples
13. [Troubleshooting](#troubleshooting) - Common issues and solutions
14. [Advanced Techniques](#advanced-techniques) - Expert patterns
15. [API Summary](#api-summary) - Quick reference table

---

## `$computed(key, fn)`

Add a computed property that automatically recalculates when its dependencies change.

### Syntax
```javascript
state.$computed(key, computedFunction)
```

### Parameters
- **`key`** (String) - Property name for the computed value
- **`fn`** (Function) - Computation function (context `this` is the state)

### Returns
- The state object (chainable)

### Example
```javascript
const state = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  price: 100,
  quantity: 2
});

state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

state.$computed('total', function() {
  return this.price * this.quantity;
});

console.log(state.fullName); // "John Doe"
console.log(state.total); // 200

state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe" - automatically updated
```

### Features
- ✅ **Lazy evaluation** - Only computed when accessed
- ✅ **Caching** - Result cached until dependencies change
- ✅ **Automatic tracking** - Dependencies detected automatically
- ✅ **Deep dependencies** - Works with nested properties
- ✅ **Chainable computed** - Computed can depend on other computed properties

### Advanced Example
```javascript
const cart = ReactiveUtils.state({
  items: [
    { name: 'Laptop', price: 999, qty: 1, taxRate: 0.08 },
    { name: 'Mouse', price: 29, qty: 2, taxRate: 0.08 }
  ],
  discountCode: null,
  shippingFee: 10
});

// Computed: subtotal
cart.$computed('subtotal', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);
});

// Computed: tax (depends on subtotal)
cart.$computed('tax', function() {
  return this.items.reduce((sum, item) => {
    return sum + (item.price * item.qty * item.taxRate);
  }, 0);
});

// Computed: discount (depends on subtotal)
cart.$computed('discount', function() {
  if (this.discountCode === 'SAVE10') return this.subtotal * 0.1;
  if (this.discountCode === 'SAVE20') return this.subtotal * 0.2;
  return 0;
});

// Computed: grand total (depends on other computed)
cart.$computed('grandTotal', function() {
  return this.subtotal + this.tax - this.discount + this.shippingFee;
});

console.log(cart.subtotal);    // 1057
console.log(cart.tax);         // 84.56
console.log(cart.discount);    // 0
console.log(cart.grandTotal);  // 1151.56

// Apply discount
cart.discountCode = 'SAVE10';
console.log(cart.discount);    // 105.7
console.log(cart.grandTotal);  // 1045.86 - auto-recalculated
```

### Chaining Example
```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  birthYear: 1990
})
.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
})
.$computed('age', function() {
  return new Date().getFullYear() - this.birthYear;
})
.$computed('greeting', function() {
  return `Hello, ${this.fullName}! You are ${this.age} years old.`;
});

console.log(user.greeting); // "Hello, John Doe! You are 34 years old."
```

### Use Cases
- Derived values (totals, averages, counts)
- Formatted display values
- Filtered/sorted data
- Validation status
- Complex calculations

### Performance Notes
- Computed values are **cached** - computation only runs when dependencies change
- Access without dependency changes is instant
- Use computed for expensive operations instead of recalculating in templates

---

## `$watch(keyOrFn, callback)`

Watch for changes to a property or expression and execute a callback.

### Syntax
```javascript
const cleanup = state.$watch(keyOrFn, callback)
```

### Parameters
- **`keyOrFn`** (String|Function) - Property name or getter function
- **`callback`** (Function) - Called with `(newValue, oldValue)`

### Returns
- Cleanup function to stop watching

### Example - Watch Property
```javascript
const state = ReactiveUtils.state({
  count: 0,
  theme: 'light'
});

const stopWatching = state.$watch('count', (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

state.count = 1; // Logs: "Count changed from 0 to 1"
state.count = 2; // Logs: "Count changed from 1 to 2"

// Stop watching
stopWatching();
state.count = 3; // No log
```

### Example - Watch Expression
```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe'
});

user.$watch(
  function() {
    return `${this.firstName} ${this.lastName}`;
  },
  (newName, oldName) => {
    console.log(`Name changed: ${oldName} → ${newName}`);
  }
);

user.firstName = 'Jane'; // Logs: "Name changed: John Doe → Jane Doe"
```

### Advanced Example - Multiple Watchers
```javascript
const app = ReactiveUtils.state({
  user: null,
  theme: 'light',
  notifications: []
});

// Watch authentication
app.$watch('user', (newUser, oldUser) => {
  if (newUser && !oldUser) {
    console.log('User logged in:', newUser.name);
    loadUserData(newUser.id);
  } else if (!newUser && oldUser) {
    console.log('User logged out');
    clearUserData();
  }
});

// Watch theme changes
app.$watch('theme', (newTheme) => {
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
});

// Watch notification count
app.$watch(
  function() {
    return this.notifications.length;
  },
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      showNotificationBadge();
      playNotificationSound();
    }
  }
);
```

### Deep Watching
```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      name: 'John',
      age: 30
    }
  }
});

// Watch nested property
state.$watch(
  function() {
    return this.user.profile.name;
  },
  (newName) => {
    console.log('Name changed:', newName);
  }
);

state.user.profile.name = 'Jane'; // Triggers watcher
```

### Cleanup Management
```javascript
const cleanups = [];

// Store cleanup functions
cleanups.push(state.$watch('prop1', callback1));
cleanups.push(state.$watch('prop2', callback2));
cleanups.push(state.$watch('prop3', callback3));

// Later: cleanup all watchers
cleanups.forEach(cleanup => cleanup());
```

### Use Cases
- Side effects on state changes
- Persistence (localStorage, API calls)
- Analytics tracking
- Validation triggers
- Synchronizing multiple states
- Debugging state changes

### Performance Tips
- Watchers run after every change - use sparingly for expensive operations
- Use `$batch()` to group updates and reduce watcher calls
- Return cleanup function to prevent memory leaks

---

## `$batch(fn)`

Execute multiple state updates as a single batch, triggering effects only once at the end.

### Syntax
```javascript
state.$batch(function)
```

### Parameters
- **`fn`** (Function) - Function containing multiple updates (context `this` is state)

### Returns
- Result of the function

### Example
```javascript
const state = ReactiveUtils.state({ x: 0, y: 0, z: 0 });

state.$computed('sum', function() {
  console.log('Computing sum...'); // Track computation
  return this.x + this.y + this.z;
});

// Without batch - computed runs 3 times
state.x = 1; // "Computing sum..."
state.y = 2; // "Computing sum..."
state.z = 3; // "Computing sum..."

// With batch - computed runs only once
state.$batch(function() {
  this.x = 10;
  this.y = 20;
  this.z = 30;
}); // "Computing sum..." (only once)

console.log(state.sum); // 60
```

### Advanced Example - Form Submission
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  age: ''
});

// Watch logs every change
form.$watch('values', (values) => {
  console.log('Form changed:', values);
});

// Without batch - watch fires 3 times
form.$setValue('name', 'John');
form.$setValue('email', 'john@example.com');
form.$setValue('age', '30');

// With batch - watch fires only once
form.$batch(function() {
  this.$setValue('name', 'Jane');
  this.$setValue('email', 'jane@example.com');
  this.$setValue('age', '25');
});
```

### Example - Bulk Updates
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Task 1', done: false },
  { id: 2, text: 'Task 2', done: false },
  { id: 3, text: 'Task 3', done: false }
]);

// Bind to show completed count
Elements.bind({
  'completed-count': () => {
    console.log('Updating display...');
    return todos.items.filter(t => t.done).length;
  }
});

// Mark all as done - triggers once instead of 3 times
todos.$batch(function() {
  this.items.forEach(todo => {
    todo.done = true;
  });
});
```

### Nested Batching
```javascript
const state = ReactiveUtils.state({ a: 0, b: 0, c: 0 });

state.$batch(function() {
  this.a = 1;
  
  this.$batch(function() {
    this.b = 2;
    this.c = 3;
  }); // Inner batch
  
  this.a = 10;
}); // Effects fire once after outer batch completes
```

### Use Cases
- Form submissions with multiple fields
- Bulk data updates
- Animation frame updates
- Resetting state to defaults
- Import/export operations
- Performance optimization

### Performance Impact
```javascript
// Without batch: 10,000 DOM updates
for (let i = 0; i < 10000; i++) {
  state.count++;
}

// With batch: 1 DOM update
state.$batch(function() {
  for (let i = 0; i < 10000; i++) {
    this.count++;
  }
});
```

---

## `$notify(key)`

Manually trigger updates for watchers and computed properties. Useful when external changes occur.

### Syntax
```javascript
state.$notify(key)  // Notify specific property
state.$notify()     // Notify all properties
```

### Parameters
- **`key`** (String, optional) - Property name to notify (omit for all)

### Returns
- `undefined`

### Example - Specific Property
```javascript
const state = ReactiveUtils.state({
  items: [1, 2, 3]
});

state.$computed('sum', function() {
  return this.items.reduce((a, b) => a + b, 0);
});

// Mutate array directly (doesn't trigger reactivity)
state.items.push(4);

console.log(state.sum); // Still 6 (cached)

// Manually notify
state.$notify('items');
console.log(state.sum); // 10 (recalculated)
```

### Example - Notify All
```javascript
const state = ReactiveUtils.state({
  data: { nested: { value: 1 } }
});

// External modification
deepModify(state.data);

// Notify all watchers/computed
state.$notify();
```

### Advanced Example - External Data Source
```javascript
const chart = ReactiveUtils.state({
  dataSource: null,
  config: {}
});

chart.$computed('chartData', function() {
  if (!this.dataSource) return [];
  // Transform external data
  return processData(this.dataSource.getData());
});

// External library updates data
externalLib.on('data-updated', () => {
  // Data source changed but reference didn't
  chart.$notify('dataSource');
});
```

### Example - Array Mutations
```javascript
const list = ReactiveUtils.state({
  items: [1, 2, 3]
});

Elements.bind({
  'item-count': () => list.items.length
});

// These don't trigger reactivity:
list.items.push(4);
list.items.sort();
list.items.splice(1, 1);

// Notify to update bindings
list.$notify('items');
```

### Use Cases
- Working with arrays (push, splice, sort, etc.)
- External library integrations
- Manual cache invalidation
- WebSocket data updates
- Third-party object mutations
- Force recomputation

### Best Practices
```javascript
// ❌ Don't notify unnecessarily
state.count = 5;
state.$notify('count'); // Redundant - assignment already notifies

// ✅ Do notify when mutating
state.items.push(item);
state.$notify('items');

// ✅ Or better - use immutable updates
state.items = [...state.items, item]; // Automatically notifies
```

### Alternative Patterns
```javascript
// Instead of mutating + notify
state.items.push(4);
state.$notify('items');

// Use immutable updates
state.items = [...state.items, 4]; // Auto-notifies

// Or use collection methods
const items = ReactiveUtils.collection();
items.$add(4); // Built-in notification
```

---

## `$raw`

Property getter that returns the non-reactive raw version of the state object.

### Syntax
```javascript
const rawObject = state.$raw
```

### Returns
- Non-reactive plain JavaScript object

### Example
```javascript
const state = ReactiveUtils.state({
  user: { name: 'John', age: 30 },
  count: 0
});

// Get raw object
const raw = state.$raw;

// Modifications don't trigger reactivity
raw.count = 100;
raw.user.name = 'Jane';

console.log(state.count); // 100 (value changed)
// But no watchers or computed properties were triggered
```

### Use Cases

#### 1. Performance - Bulk Read Operations
```javascript
const state = ReactiveUtils.state({
  items: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }))
});

// Slow - tracks every access
const values = state.items.map(item => item.value);

// Fast - no tracking
const raw = state.$raw;
const values = raw.items.map(item => item.value);
```

#### 2. Serialize for API/Storage
```javascript
const form = ReactiveUtils.form({
  name: 'John',
  email: 'john@example.com',
  age: 30
});

// Send only data, not reactive proxies
await fetch('/api/user', {
  method: 'POST',
  body: JSON.stringify(form.$raw.values)
});

// Save to localStorage
localStorage.setItem('form', JSON.stringify(form.$raw));
```

#### 3. Deep Equality Checks
```javascript
const state1 = ReactiveUtils.state({ a: 1, b: 2 });
const state2 = ReactiveUtils.state({ a: 1, b: 2 });

// Compare raw objects
console.log(
  JSON.stringify(state1.$raw) === JSON.stringify(state2.$raw)
); // true
```

#### 4. Pass to Non-Reactive APIs
```javascript
const data = ReactiveUtils.state({
  points: [{ x: 0, y: 0 }, { x: 10, y: 10 }]
});

// Third-party library expects plain objects
const chart = new Chart(canvas, {
  data: data.$raw.points // Pass raw data
});
```

### Advanced Example - Cloning
```javascript
const original = ReactiveUtils.state({
  config: {
    theme: 'dark',
    fontSize: 14,
    features: ['autosave', 'spellcheck']
  }
});

// Clone without reactivity
const clone = structuredClone(original.$raw);

// Or with lodash
const clone = _.cloneDeep(original.$raw);

// Create new reactive state from clone
const newState = ReactiveUtils.state(clone);
```

### Comparison

```javascript
const state = ReactiveUtils.state({ count: 0 });

// Reactive access - tracked
const value1 = state.count; // Triggers dependency tracking

// Raw access - not tracked
const value2 = state.$raw.count; // No tracking

// Reactive modification - triggers updates
state.count = 5; // Watchers fire

// Raw modification - silent
state.$raw.count = 10; // No watchers fire (but value changes)
```

### When to Use `$raw`

✅ **Use `$raw` when:**
- Serializing for API calls or storage
- Passing to third-party libraries
- Performing bulk read operations
- Deep cloning state
- Debugging actual values

❌ **Don't use `$raw` when:**
- You need reactivity
- Working with computed properties
- In template bindings
- During normal state operations

---

## `$update(updates)`

Perform mixed state and DOM updates in a single batched operation. Supports nested paths and CSS selectors.

### Syntax
```javascript
state.$update(updates)
```

### Parameters
- **`updates`** (Object) - Object with state properties and/or DOM selectors

### Returns
- The state object (chainable)

### Example - State Updates
```javascript
const state = ReactiveUtils.state({
  count: 0,
  user: { name: 'John', age: 30 }
});

state.$update({
  count: 5,
  'user.name': 'Jane',
  'user.age': 25
});

console.log(state.count); // 5
console.log(state.user.name); // "Jane"
```

### Example - DOM Updates
```javascript
const state = ReactiveUtils.state({ count: 0 });

state.$update({
  count: 10,
  '#counter': { textContent: '10' },
  '.status': 'Updated!',
  '.indicator': { className: 'active' }
});
```

### Example - Mixed Updates
```javascript
const dashboard = ReactiveUtils.state({
  users: 150,
  revenue: 45000,
  status: 'online'
});

dashboard.$update({
  // State updates
  users: 200,
  revenue: 52000,
  
  // DOM updates
  '#user-count': { textContent: '200 users' },
  '#revenue': { textContent: '$52,000' },
  '.status-badge': {
    textContent: 'ONLINE',
    className: 'badge badge-success',
    style: { backgroundColor: '#22c55e' }
  }
});
```

### Nested Path Support
```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      name: 'John',
      contact: {
        email: 'john@example.com'
      }
    }
  }
});

state.$update({
  'user.profile.name': 'Jane',
  'user.profile.contact.email': 'jane@example.com'
});
```

### Advanced Example - Form Submission
```javascript
const form = ReactiveUtils.form({
  name: '',
  email: '',
  status: 'idle'
});

async function submitForm() {
  form.$update({
    status: 'submitting',
    '#submit-btn': {
      disabled: true,
      textContent: 'Submitting...'
    },
    '.form-message': {
      textContent: 'Please wait...',
      className: 'message info'
    }
  });
  
  try {
    await api.submit(form.values);
    
    form.$update({
      status: 'success',
      '#submit-btn': {
        disabled: false,
        textContent: 'Submit'
      },
      '.form-message': {
        textContent: 'Success!',
        className: 'message success'
      }
    });
  } catch (error) {
    form.$update({
      status: 'error',
      '#submit-btn': {
        disabled: false,
        textContent: 'Retry'
      },
      '.form-message': {
        textContent: error.message,
        className: 'message error'
      }
    });
  }
}
```

### Selector Types
```javascript
state.$update({
  // ID selector
  '#element': value,
  
  // Class selector
  '.elements': value,
  
  // Attribute selector
  '[data-id="123"]': value,
  
  // Complex selector
  '.container > .item:first-child': value
});
```

### DOM Update Values
```javascript
state.$update({
  // String/Number/Boolean - sets textContent
  '#counter': 42,
  
  // Object - sets multiple properties
  '#element': {
    textContent: 'Hello',
    className: 'active',
    disabled: false
  },
  
  // Style object
  '.box': {
    style: {
      backgroundColor: 'blue',
      width: '100px'
    }
  },
  
  // Dataset
  '#item': {
    dataset: {
      userId: '123',
      role: 'admin'
    }
  },
  
  // Array - for classList
  '.element': {
    classList: ['class1', 'class2', 'class3']
  }
});
```

### Use Cases
- Form submissions with UI feedback
- Dashboard updates
- Loading states
- Real-time data display
- Progress indicators
- Status notifications

---

## `$set(updates)`

Perform functional updates where values can be functions receiving the previous value.

### Syntax
```javascript
state.$set(updates)
```

### Parameters
- **`updates`** (Object) - Object with values or updater functions

### Returns
- The state object (chainable)

### Example - Functional Updates
```javascript
const state = ReactiveUtils.state({
  count: 10,
  items: [1, 2, 3]
});

state.$set({
  count: prev => prev + 5,
  items: prev => [...prev, 4, 5]
});

console.log(state.count); // 15
console.log(state.items); // [1, 2, 3, 4, 5]
```

### Example - Mixed Updates
```javascript
const cart = ReactiveUtils.state({
  subtotal: 100,
  tax: 0,
  shipping: 10
});

cart.$set({
  subtotal: prev => prev + 50,  // Increment
  tax: prev => prev * 1.08,     // Calculate
  shipping: 15                  // Direct value
});
```

### Advanced Example - Counter
```javascript
const counter = ReactiveUtils.state({
  count: 0,
  history: []
});

function increment(amount = 1) {
  counter.$set({
    count: prev => prev + amount,
    history: prev => [...prev, {
      action: 'increment',
      amount,
      timestamp: Date.now()
    }]
  });
}

function decrement(amount = 1) {
  counter.$set({
    count: prev => Math.max(0, prev - amount),
    history: prev => [...prev, {
      action: 'decrement',
      amount,
      timestamp: Date.now()
    }]
  });
}
```

### Nested Paths
```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      visits: 0,
      lastSeen: null
    }
  }
});

state.$set({
  'user.profile.visits': prev => prev + 1,
  'user.profile.lastSeen': () => new Date()
});
```

### Advanced Example - Shopping Cart
```javascript
const cart = ReactiveUtils.state({
  items: [],
  total: 0
});

function addItem(product) {
  cart.$set({
    items: prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    },
    total: prev => prev + product.price
  });
}

function removeItem(productId) {
  cart.$set({
    items: prev => {
      const item = prev.find(i => i.id === productId);
      return prev.filter(i => i.id !== productId);
    },
    total: prev => {
      const item = cart.items.find(i => i.id === productId);
      return prev - (item.price * item.qty);
    }
  });
}
```

### Use Cases
- Increment/decrement operations
- Array manipulations (add, remove, update)
- Calculated updates based on previous value
- Toggling boolean values
- Appending to histories or logs
- Complex state transitions

### Comparison with `$update`

```javascript
// $update - direct values only
state.$update({
  count: 5,
  name: 'John'
});

// $set - supports functions
state.$set({
  count: prev => prev + 1,
  name: 'John'  // Direct values also work
});
```

---

## `$bind(bindingDefs)`

Create reactive DOM bindings that automatically update when state changes.

### Syntax
```javascript
const cleanup = state.$bind(bindingDefinitions)
```

### Parameters
- **`bindingDefs`** (Object) - Binding definitions mapping selectors to state

### Returns
- Cleanup function to remove all bindings

### Example - Simple Binding
```javascript
const state = ReactiveUtils.state({
  count: 0,
  message: 'Hello'
});

state.$bind({
  '#counter': 'count',
  '#message': 'message'
});

state.count++; // Updates #counter automatically
state.message = 'World'; // Updates #message automatically
```

### Example - Computed Binding
```javascript
const user = ReactiveUtils.state({
  firstName: 'John',
  lastName: 'Doe',
  isOnline: true
});

user.$bind({
  '#full-name': function() {
    return `${this.firstName} ${this.lastName}`;
  },
  '.status': function() {
    return this.isOnline ? 'Online' : 'Offline';
  }
});
```

### Example - Multi-Property Binding
```javascript
const theme = ReactiveUtils.state({
  mode: 'dark',
  primaryColor: '#3b82f6'
});

theme.$bind({
  'body': {
    className: function() {
      return `theme-${this.mode}`;
    },
    style: function() {
      return {
        backgroundColor: this.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        color: this.mode === 'dark' ? '#ffffff' : '#000000'
      };
    }
  },
  '.primary-btn': {
    style: function() {
      return { backgroundColor: this.primaryColor };
    }
  }
});
```

### Nested Property Binding
```javascript
const state = ReactiveUtils.state({
  user: {
    profile: {
      name: 'John',
      avatar: '/images/avatar.jpg'
    }
  }
});

state.$bind({
  '#user-name': 'user.profile.name',
  '#user-avatar': {
    src: 'user.profile.avatar'
  }
});
```

### Advanced Example - Todo List
```javascript
const todos = ReactiveUtils.collection([
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

todos.$bind({
  '#todo-count': function() {
    return `${this.items.filter(t => !t.done).length} items left`;
  },
  '#todo-list': function() {
    return this.items.map(todo => `
      <li class="${todo.done ? 'done' : ''}">
        ${todo.text}
      </li>
    `).join('');
  },
  '.clear-completed': {
    style: function() {
      const hasCompleted = this.items.some(t => t.done);
      return { display: hasCompleted ? 'block' : 'none' };
    }
  }
});
```

### Cleanup Example
```javascript
const state = ReactiveUtils.state({ count: 0 });

const cleanup = state.$bind({
  '#counter': 'count'
});

// Later: remove bindings
cleanup();

// Now changes don't update DOM
state.count++; // No DOM update
```

### Multiple Elements
```javascript
const status = ReactiveUtils.state({
  online: true
});

status.$bind({
  // Binds to ALL elements with class 'status-indicator'
  '.status-indicator': function() {
    return this.online ? 'Online' : 'Offline';
  },
  '.status-icon': {
    className: function() {
      return this.online ? 'icon-online' : 'icon-offline';
    }
  }
});
```

### Use Cases
- Real-time data displays
- Form field bindings
- Status indicators
- Progress bars
- Dynamic styling
- Conditional rendering

---

## Method Chaining

Most instance methods return the state object, allowing for fluent method chaining:

```javascript
const state = ReactiveUtils.state({ count: 0, name: '' })
  .$computed('doubled', function() {
    return this.count * 2;
  })
  .$computed('greeting', function() {
    return `Hello, ${this.name}!`;
  })
  .$watch('count', (val) => {
    console.log('Count:', val);
  })
  .$bind({
    '#counter': 'count',
    '#doubled': 'doubled',
    '#greeting': 'greeting'
  });

// All set up in one expression!
```

---

## Performance Comparison

```javascript
const state = ReactiveUtils.state({
  items: Array.from({ length: 1000 }, (_, i) => i)
});

// ❌ Slow - 1000 individual updates
items.forEach((item, i) => {
  state.items[i] = item * 2;
});

// ✅ Fast - single batched update
state.$batch(function() {
  this.items = this.items.map(item => item * 2);
});

// ✅ Faster - functional update
state.$set({
  items: prev => prev.map(item => item * 2)
});
```

---

## Best Practices

### 1. Use Computed for Derived Values
```javascript
// ❌ Bad - manual calculation everywhere
const total = state.items.reduce((sum, item) => sum + item.price, 0);


// ✅ Good - computed property
state.$computed('total', function() {
  return this.items.reduce((sum, item) => sum + item.price, 0);
});
```

### 2. Batch Related Updates
```javascript
// ❌ Bad - multiple separate updates
state.firstName = 'Jane';
state.lastName = 'Smith';
state.age = 28;
state.email = 'jane@example.com';

// ✅ Good - single batched update
state.$batch(function() {
  this.firstName = 'Jane';
  this.lastName = 'Smith';
  this.age = 28;
  this.email = 'jane@example.com';
});
```

### 3. Clean Up Watchers
```javascript
// ❌ Bad - memory leak
function setupComponent() {
  state.$watch('data', callback);
  // Component destroyed but watcher still active
}

// ✅ Good - cleanup on destroy
function setupComponent() {
  const cleanup = state.$watch('data', callback);
  return {
    destroy() {
      cleanup();
    }
  };
}
```

### 4. Use $raw for Non-Reactive Operations
```javascript
// ❌ Bad - unnecessary tracking
const serialized = JSON.stringify(state);

// ✅ Good - no tracking overhead
const serialized = JSON.stringify(state.$raw);
```

### 5. Prefer Immutable Updates for Arrays
```javascript
// ❌ Bad - requires manual notification
state.items.push(newItem);
state.$notify('items');

// ✅ Good - automatic notification
state.items = [...state.items, newItem];

// ✅ Better - functional update
state.$set({
  items: prev => [...prev, newItem]
});
```

### 6. Use $update for Coordinated State+DOM Changes
```javascript
// ❌ Bad - separate operations
state.loading = true;
document.getElementById('spinner').style.display = 'block';
document.getElementById('content').style.display = 'none';

// ✅ Good - atomic update
state.$update({
  loading: true,
  '#spinner': { style: { display: 'block' } },
  '#content': { style: { display: 'none' } }
});
```

### 7. Watch Expressions for Complex Dependencies
```javascript
// ❌ Bad - watch multiple properties separately
state.$watch('firstName', updateDisplay);
state.$watch('lastName', updateDisplay);

// ✅ Good - watch computed expression
state.$watch(
  function() {
    return `${this.firstName} ${this.lastName}`;
  },
  updateDisplay
);
```

---

## Common Patterns

### Pattern 1: Loading States
```javascript
const data = ReactiveUtils.state({
  items: [],
  loading: false,
  error: null
});

async function fetchData() {
  data.$update({
    loading: true,
    error: null,
    '#loading-spinner': { style: { display: 'block' } }
  });
  
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    
    data.$update({
      items,
      loading: false,
      '#loading-spinner': { style: { display: 'none' } }
    });
  } catch (error) {
    data.$update({
      error: error.message,
      loading: false,
      '#loading-spinner': { style: { display: 'none' } },
      '#error-message': { textContent: error.message }
    });
  }
}
```

### Pattern 2: Toggle with Side Effects
```javascript
const sidebar = ReactiveUtils.state({
  isOpen: false
});

sidebar.$watch('isOpen', (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto';
});

sidebar.$bind({
  '.sidebar': {
    className: function() {
      return this.isOpen ? 'sidebar open' : 'sidebar';
    }
  },
  '.overlay': {
    style: function() {
      return { display: this.isOpen ? 'block' : 'none' };
    }
  }
});

function toggleSidebar() {
  sidebar.$set({
    isOpen: prev => !prev
  });
}
```

### Pattern 3: Form Validation
```javascript
const form = ReactiveUtils.form({
  email: '',
  password: ''
});

form.$computed('emailValid', function() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.values.email);
});

form.$computed('passwordValid', function() {
  return this.values.password.length >= 8;
});

form.$computed('canSubmit', function() {
  return this.emailValid && this.passwordValid && !this.isSubmitting;
});

form.$bind({
  '#submit-btn': {
    disabled: function() {
      return !this.canSubmit;
    }
  },
  '#email-error': {
    textContent: function() {
      return this.touched.email && !this.emailValid 
        ? 'Invalid email address' 
        : '';
    }
  },
  '#password-error': {
    textContent: function() {
      return this.touched.password && !this.passwordValid 
        ? 'Password must be at least 8 characters' 
        : '';
    }
  }
});
```

### Pattern 4: Dependent Computed Properties
```javascript
const calculator = ReactiveUtils.state({
  price: 100,
  quantity: 2,
  taxRate: 0.08,
  discountPercent: 10
});

calculator
  .$computed('subtotal', function() {
    return this.price * this.quantity;
  })
  .$computed('discount', function() {
    return this.subtotal * (this.discountPercent / 100);
  })
  .$computed('afterDiscount', function() {
    return this.subtotal - this.discount;
  })
  .$computed('tax', function() {
    return this.afterDiscount * this.taxRate;
  })
  .$computed('total', function() {
    return this.afterDiscount + this.tax;
  });

calculator.$bind({
  '#subtotal': function() { return `$${this.subtotal.toFixed(2)}`; },
  '#discount': function() { return `$${this.discount.toFixed(2)}`; },
  '#tax': function() { return `$${this.tax.toFixed(2)}`; },
  '#total': function() { return `$${this.total.toFixed(2)}`; }
});
```

### Pattern 5: Synchronized States
```javascript
const mainState = ReactiveUtils.state({
  theme: 'light'
});

const componentState = ReactiveUtils.state({
  localTheme: 'light'
});

// Keep component in sync with main state
mainState.$watch('theme', (newTheme) => {
  componentState.localTheme = newTheme;
});

// Persist changes
mainState.$watch('theme', (newTheme) => {
  localStorage.setItem('theme', newTheme);
});
```

### Pattern 6: Conditional Bindings
```javascript
const user = ReactiveUtils.state({
  role: 'guest',
  isAuthenticated: false
});

user.$bind({
  '.admin-panel': {
    style: function() {
      return { 
        display: this.role === 'admin' ? 'block' : 'none' 
      };
    }
  },
  '.user-menu': {
    style: function() {
      return { 
        display: this.isAuthenticated ? 'block' : 'none' 
      };
    }
  },
  '.login-btn': {
    style: function() {
      return { 
        display: this.isAuthenticated ? 'none' : 'block' 
      };
    }
  }
});
```

### Pattern 7: Debounced Updates
```javascript
const search = ReactiveUtils.state({
  query: '',
  results: []
});

let debounceTimer;

search.$watch('query', (newQuery) => {
  clearTimeout(debounceTimer);
  
  if (!newQuery.trim()) {
    search.results = [];
    return;
  }
  
  debounceTimer = setTimeout(async () => {
    const results = await searchAPI(newQuery);
    search.results = results;
  }, 300);
});

search.$bind({
  '#search-input': {
    value: 'query'
  },
  '#search-results': function() {
    return this.results.map(r => `<li>${r.title}</li>`).join('');
  }
});
```

---

## Troubleshooting

### Issue: Computed Not Updating

```javascript
// ❌ Problem: Computed doesn't track external variables
let externalValue = 10;
state.$computed('result', function() {
  return this.count + externalValue; // Won't update when externalValue changes
});

// ✅ Solution: Include in state
const state = ReactiveUtils.state({
  count: 0,
  externalValue: 10
});

state.$computed('result', function() {
  return this.count + this.externalValue; // Updates correctly
});
```

### Issue: Infinite Loop in Watcher

```javascript
// ❌ Problem: Watcher modifies what it's watching
state.$watch('count', (newVal) => {
  state.count = newVal + 1; // Infinite loop!
});

// ✅ Solution: Use different property or guard condition
state.$watch('count', (newVal) => {
  if (newVal < 100) {
    state.otherValue = newVal + 1;
  }
});
```

### Issue: Array Changes Not Detected

```javascript
// ❌ Problem: Direct mutation doesn't trigger
state.items.push(newItem);
// DOM doesn't update

// ✅ Solution 1: Use $notify
state.items.push(newItem);
state.$notify('items');

// ✅ Solution 2: Immutable update
state.items = [...state.items, newItem];

// ✅ Solution 3: Use collection
const items = ReactiveUtils.collection();
items.$add(newItem); // Automatic notification
```

### Issue: Binding Not Working

```javascript
// ❌ Problem: Element doesn't exist when binding created
state.$bind({
  '#dynamic-element': 'value' // Element added later by JS
});

// ✅ Solution: Bind after element exists
function createDynamicElement() {
  const el = document.createElement('div');
  el.id = 'dynamic-element';
  document.body.appendChild(el);
  
  // Now bind
  state.$bind({
    '#dynamic-element': 'value'
  });
}
```

### Issue: Performance with Large Lists

```javascript
// ❌ Problem: Rebuilding entire list on every change
state.$bind({
  '#list': function() {
    return this.items.map(item => `<li>${item.text}</li>`).join('');
  }
});

// ✅ Solution: Use virtual DOM library or targeted updates
state.$bind({
  '#item-count': function() {
    return this.items.length; // Only updates count
  }
});

// Update individual items
function updateItem(id, text) {
  const element = document.querySelector(`[data-id="${id}"]`);
  if (element) element.textContent = text;
}
```

---

## Advanced Techniques

### Technique 1: Middleware Pattern

```javascript
function createStateWithMiddleware(initialState, middleware) {
  const state = ReactiveUtils.state(initialState);
  
  // Wrap $update with middleware
  const originalUpdate = state.$update.bind(state);
  state.$update = function(updates) {
    const processedUpdates = middleware(updates, this);
    return originalUpdate(processedUpdates);
  };
  
  return state;
}

// Usage
const state = createStateWithMiddleware(
  { count: 0 },
  (updates, state) => {
    console.log('Before:', state.count);
    console.log('Updates:', updates);
    return updates;
  }
);
```

### Technique 2: Undo/Redo

```javascript
const state = ReactiveUtils.state({
  value: 0,
  history: [],
  historyIndex: -1
});

state.$computed('canUndo', function() {
  return this.historyIndex > 0;
});

state.$computed('canRedo', function() {
  return this.historyIndex < this.history.length - 1;
});

function saveToHistory(state, value) {
  state.$batch(function() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(value);
    this.historyIndex = this.history.length - 1;
  });
}

function undo() {
  if (state.canUndo) {
    state.$batch(function() {
      this.historyIndex--;
      this.value = this.history[this.historyIndex];
    });
  }
}

function redo() {
  if (state.canRedo) {
    state.$batch(function() {
      this.historyIndex++;
      this.value = this.history[this.historyIndex];
    });
  }
}
```

### Technique 3: State Snapshots

```javascript
function createSnapshot(state) {
  return JSON.parse(JSON.stringify(state.$raw));
}

function restoreSnapshot(state, snapshot) {
  state.$batch(function() {
    Object.assign(this, snapshot);
  });
}

// Usage
const state = ReactiveUtils.state({ a: 1, b: 2, c: 3 });
const snapshot = createSnapshot(state);

state.a = 100;
state.b = 200;

restoreSnapshot(state, snapshot); // Back to a: 1, b: 2, c: 3
```

---

## API Summary

| Method | Purpose | Returns | Chainable |
|--------|---------|---------|-----------|
| `$computed(key, fn)` | Add computed property | state | ✅ |
| `$watch(keyOrFn, callback)` | Watch changes | cleanup fn | ❌ |
| `$batch(fn)` | Batch updates | fn result | ❌ |
| `$notify(key)` | Manual trigger | undefined | ❌ |
| `$raw` | Get raw object | raw object | ❌ |
| `$update(updates)` | Mixed updates | state | ✅ |
| `$set(updates)` | Functional updates | state | ✅ |
| `$bind(defs)` | DOM bindings | cleanup fn | ❌ |

---
