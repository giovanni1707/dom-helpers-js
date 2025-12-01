# DOM Helpers - Reactive System

**Version:** 2.3.1
**License:** MIT

A complete reactive state management system with Vue/React-like reactivity for vanilla JavaScript applications.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Module Structure](#module-structure)
- [Core Features](#core-features)
  - [Reactive State](#reactive-state)
  - [Effects](#effects)
  - [Computed Properties](#computed-properties)
  - [Watchers](#watchers)
  - [DOM Bindings](#dom-bindings)
- [Collections](#collections)
- [Forms](#forms)
- [Array Support](#array-support)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Migration Guide](#migration-guide)

---

## Features

✅ **Vue/React-like Reactivity** - Proxy-based reactive state with automatic dependency tracking
✅ **Modular Architecture** - Load only what you need
✅ **Zero Dependencies** - Standalone modules
✅ **Full TypeScript Support** - Complete type definitions (coming soon)
✅ **30+ Collection Methods** - Comprehensive array management
✅ **40+ Form Methods** - Complete form handling with validation
✅ **Reactive Arrays** - Array mutations automatically trigger updates
✅ **DOM Bindings** - Automatic UI synchronization
✅ **Computed Properties** - Lazy evaluation with caching
✅ **Batched Updates** - Performance optimization
✅ **Deep Reactivity** - Nested objects are automatically reactive

---

## Quick Start

### Load All Modules (Browser)

```html
<script src="reactive-core.js"></script>
<script src="reactive-array-support.js"></script>
<script src="reactive-collections.js"></script>
<script src="reactive-forms.js"></script>
<script src="reactive.js"></script>

<script>
  // Create reactive state
  const state = Reactive.state({ count: 0 });

  // Create effect that runs automatically
  Reactive.effect(() => {
    console.log('Count:', state.count);
  });

  // Update triggers effect
  state.count++; // Logs: "Count: 1"
</script>
```

### ES6 Modules

```javascript
import Reactive from './reactive.js';

const state = Reactive.state({ count: 0 });

Reactive.effect(() => {
  document.getElementById('counter').textContent = state.count;
});

state.count++;
```

### Individual Modules

```javascript
import ReactiveCore from './reactive-core.js';
import ReactiveCollections from './reactive-collections.js';

const state = ReactiveCore.state({ items: [] });
const todos = ReactiveCollections.collection([]);
```

---

## Installation

### Option 1: Direct Download

Download the files from `src/reactive-system/` and include them in your project:

```
reactive-system/
├── reactive-core.js          (Required)
├── reactive-array-support.js (Optional)
├── reactive-collections.js   (Optional)
├── reactive-forms.js         (Optional)
└── reactive.js               (Unified entry point)
```

### Option 2: Load from CDN (when available)

```html
<script src="https://cdn.example.com/dom-helpers/reactive.min.js"></script>
```

### Option 3: NPM/Bundler (when published)

```bash
npm install @dom-helpers/reactive
```

```javascript
import { state, effect, collection, form } from '@dom-helpers/reactive';
```

---

## Module Structure

The reactive system is split into 5 modules:

### 1. **reactive-core.js** (~900 lines, ~28 KB)
Core reactive state management with automatic dependency tracking.

**Features:**
- `state()` - Create reactive state
- `effect()` - Automatic side effects
- `computed()` - Computed properties
- `watch()` - Property watchers
- `bindings()` - DOM bindings
- `ref()`, `store()`, `component()`, `reactive()`

### 2. **reactive-array-support.js** (~270 lines, ~8 KB)
Makes array mutation methods reactive.

**Features:**
- Patches `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`
- Automatic reactivity for array mutations
- Manual patching via `patchArray()`

### 3. **reactive-collections.js** (~530 lines, ~18 KB)
Full-featured reactive collections.

**Features:**
- 30+ methods for array management
- `add()`, `remove()`, `update()`, `clear()`
- `find()`, `filter()`, `map()`, `forEach()`
- `toggle()`, `removeWhere()`, `updateWhere()`
- Filtered collections

### 4. **reactive-forms.js** (~680 lines, ~24 KB)
Form state management with validation.

**Features:**
- 40+ methods and properties
- Built-in validators
- Error tracking
- Touched state
- Auto-validation
- DOM binding

### 5. **reactive.js** (~280 lines, ~8 KB)
Unified entry point that combines all modules.

**Features:**
- Single import for all features
- Convenience loaders
- Module status checking

---

## Core Features

### Reactive State

Create reactive state that automatically tracks dependencies:

```javascript
const state = Reactive.state({
  count: 0,
  user: {
    name: 'John',
    age: 30
  }
});

// Deep reactivity - nested objects are automatically reactive
state.user.age = 31; // Triggers updates
```

### Effects

Effects run automatically when their dependencies change:

```javascript
const state = Reactive.state({ count: 0 });

// Effect runs immediately and whenever state.count changes
Reactive.effect(() => {
  console.log('Count:', state.count);
  document.getElementById('display').textContent = state.count;
});

state.count++; // Effect runs again
```

### Computed Properties

Computed properties are lazily evaluated and cached:

```javascript
const state = Reactive.state({
  firstName: 'John',
  lastName: 'Doe'
});

// Add computed property
state.$computed('fullName', function() {
  return `${this.firstName} ${this.lastName}`;
});

console.log(state.fullName); // "John Doe"

state.firstName = 'Jane';
console.log(state.fullName); // "Jane Doe" (automatically updated)
```

### Watchers

Watch specific properties for changes:

```javascript
const state = Reactive.state({ count: 0 });

// Watch property
state.$watch('count', (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

state.count = 5; // Logs: "Count changed from 0 to 5"
```

### DOM Bindings

Automatically sync state with DOM elements:

```javascript
const state = Reactive.state({
  message: 'Hello',
  count: 0
});

// Simple binding
state.$bind({
  '#message': 'message',           // Bind state.message to #message textContent
  '#counter': () => state.count,   // Computed binding
  '.status': {                     // Multiple properties
    textContent: () => `Count: ${state.count}`,
    className: () => state.count > 5 ? 'high' : 'low'
  }
});

state.message = 'Hello World'; // #message updates automatically
state.count = 10;              // #counter and .status update automatically
```

---

## Collections

Reactive collections with 30+ methods for array management:

### Basic Usage

```javascript
const todos = Reactive.collection([
  { id: 1, text: 'Learn Reactive', done: false },
  { id: 2, text: 'Build App', done: false }
]);

// Add item
todos.add({ id: 3, text: 'Deploy', done: false });

// Remove item
todos.remove(item => item.id === 1);

// Update item
todos.update(item => item.id === 2, { done: true });

// Toggle boolean field
todos.toggle(item => item.id === 3, 'done');

// Clear all
todos.clear();
```

### Array Methods

Collections support all array methods:

```javascript
// Iteration
todos.forEach(item => console.log(item.text));
const texts = todos.map(item => item.text);
const completed = todos.filter(item => item.done);

// Searching
const item = todos.find(item => item.id === 2);
const index = todos.indexOf(item);
const exists = todos.includes(item);

// Sorting
todos.sort((a, b) => a.text.localeCompare(b.text));
todos.reverse();

// Modification
todos.push({ id: 4, text: 'New Task', done: false });
todos.pop();
todos.shift();
todos.unshift({ id: 0, text: 'First', done: false });
```

### Advanced Operations

```javascript
// Remove all matching items
todos.removeWhere(item => item.done);

// Update all matching items
todos.updateWhere(item => !item.done, { priority: 'high' });

// Reset with new items
todos.reset([...newItems]);

// Get plain array
const array = todos.toArray();

// Check if empty
if (todos.isEmpty()) {
  console.log('No todos');
}
```

### Getters

```javascript
console.log(todos.length);  // Number of items
console.log(todos.first);   // First item
console.log(todos.last);    // Last item
```

### Computed Collections

```javascript
const todos = Reactive.collectionWithComputed(
  [...items],
  {
    completed: function() {
      return this.items.filter(t => t.done);
    },
    pending: function() {
      return this.items.filter(t => !t.done);
    },
    completedCount: function() {
      return this.completed.length;
    }
  }
);

console.log(todos.completedCount); // Computed value
```

### Filtered Collections

```javascript
const todos = Reactive.collection([...]);
const completedTodos = Reactive.createFilteredCollection(
  todos,
  item => item.done
);

// completedTodos automatically updates when todos changes
todos.add({ text: 'New', done: true });
console.log(completedTodos.length); // Includes new item
```

---

## Forms

Complete form state management with validation:

### Basic Usage

```javascript
const loginForm = Reactive.form(
  { email: '', password: '' },
  {
    validators: {
      email: Reactive.validators.combine(
        Reactive.validators.required(),
        Reactive.validators.email()
      ),
      password: Reactive.validators.minLength(8)
    },
    onSubmit: async (values) => {
      await api.login(values);
    }
  }
);

// Set values
loginForm.setValue('email', 'user@example.com');
loginForm.setValues({ email: 'user@example.com', password: 'password123' });

// Validate
const isValid = loginForm.validate();

// Submit
const result = await loginForm.submit();
if (result.success) {
  console.log('Login successful');
} else {
  console.log('Errors:', result.errors);
}
```

### Validators

Built-in validators:

```javascript
const { validators: v } = Reactive;

const signupForm = Reactive.form(
  { username: '', email: '', password: '', confirmPassword: '', age: '' },
  {
    validators: {
      username: v.combine(
        v.required(),
        v.minLength(3),
        v.maxLength(20),
        v.pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
      ),
      email: v.combine(
        v.required(),
        v.email()
      ),
      password: v.combine(
        v.required(),
        v.minLength(8, 'Password must be at least 8 characters')
      ),
      confirmPassword: v.combine(
        v.required(),
        v.match('password', 'Passwords must match')
      ),
      age: v.combine(
        v.required(),
        v.min(18, 'Must be 18 or older'),
        v.max(120, 'Invalid age')
      )
    }
  }
);
```

### Error Management

```javascript
// Set error
form.setError('email', 'Email already exists');

// Set multiple errors
form.setErrors({
  email: 'Invalid email',
  password: 'Too weak'
});

// Clear errors
form.clearError('email');
form.clearErrors();

// Check errors
if (form.hasError('email')) {
  console.log(form.getError('email'));
}

// Get error fields
console.log(form.errorFields); // ['email', 'password']
```

### Touched State

```javascript
// Mark as touched
form.setTouched('email');
form.setTouchedFields(['email', 'password']);
form.touchAll();

// Check touched
if (form.isTouched('email')) {
  console.log('Field was touched');
}

// Show error only if touched
if (form.shouldShowError('email')) {
  console.log('Show error');
}

// Get touched fields
console.log(form.touchedFields); // ['email', 'password']
```

### Computed Properties

```javascript
console.log(form.isValid);      // All fields valid
console.log(form.isDirty);      // Any field touched
console.log(form.hasErrors);    // Has any errors
console.log(form.isSubmitting); // Currently submitting
console.log(form.submitCount);  // Number of submissions
```

### DOM Binding

```javascript
// Manual event handlers
<input
  name="email"
  value={form.values.email}
  onChange={(e) => form.handleChange(e)}
  onBlur={(e) => form.handleBlur(e)}
/>

// Or use field props
const emailProps = form.getFieldProps('email');
<input {...emailProps} />

// Auto-bind all inputs
form.bindToInputs('form input, form textarea, form select');
```

### Reset

```javascript
// Reset to initial values
form.reset();

// Reset to new values
form.reset({ email: '', password: '' });

// Reset single field
form.resetField('email');
```

### Serialization

```javascript
const data = form.toObject();
console.log(data);
// {
//   values: { email: 'user@example.com', password: '...' },
//   errors: {},
//   touched: { email: true },
//   isValid: true,
//   isDirty: true,
//   isSubmitting: false,
//   submitCount: 0
// }
```

---

## Array Support

Array mutation methods automatically trigger reactivity:

```javascript
const state = Reactive.state({
  items: [1, 2, 3]
});

Reactive.effect(() => {
  console.log('Items:', state.items);
});

// These all trigger the effect:
state.items.push(4);        // [1, 2, 3, 4]
state.items.pop();          // [1, 2, 3]
state.items.shift();        // [2, 3]
state.items.unshift(0);     // [0, 2, 3]
state.items.splice(1, 1);   // [0, 3]
state.items.sort();         // [0, 3]
state.items.reverse();      // [3, 0]
```

### Manual Patching

If you add an array after state creation:

```javascript
const state = Reactive.state({ });

state.newArray = [1, 2, 3];

// Manually patch the array
Reactive.patchArray(state, 'newArray');

// Now mutations are reactive
state.newArray.push(4); // Triggers updates
```

---

## Advanced Usage

### Batched Updates

Batch multiple updates for performance:

```javascript
const state = Reactive.state({ count: 0, name: '' });

Reactive.batch(() => {
  state.count = 10;
  state.name = 'John';
  state.count = 20;
  state.name = 'Jane';
  // Effects run only once after batch completes
});
```

Or use the instance method:

```javascript
state.$batch(() => {
  state.count = 10;
  state.name = 'John';
});
```

### Mixed State + DOM Updates

Update both state and DOM in one operation:

```javascript
const state = Reactive.state({ count: 0 });

state.$update({
  count: 10,                    // Update state
  '#counter': { textContent: '10' },  // Update DOM
  '.status': { className: 'active' }
});
```

### Functional Updates

Use functions to compute new values:

```javascript
state.$set({
  count: (prev) => prev + 1,
  items: (prev) => [...prev, newItem]
});
```

### Store Pattern

Create a store with getters and actions:

```javascript
const store = Reactive.store(
  { count: 0 },
  {
    getters: {
      double() {
        return this.count * 2;
      }
    },
    actions: {
      increment(state) {
        state.count++;
      },
      incrementBy(state, amount) {
        state.count += amount;
      }
    }
  }
);

console.log(store.double); // Getter
store.increment();         // Action
store.incrementBy(5);      // Action with parameter
```

### Component Pattern

Create a component with lifecycle:

```javascript
const counter = Reactive.component({
  state: { count: 0 },

  computed: {
    double() {
      return this.count * 2;
    }
  },

  watch: {
    count(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
    }
  },

  effects: {
    updateDOM() {
      document.getElementById('count').textContent = this.count;
    }
  },

  bindings: {
    '#count': 'count'
  },

  actions: {
    increment(state) {
      state.count++;
    }
  },

  mounted() {
    console.log('Component mounted');
  },

  unmounted() {
    console.log('Component unmounted');
  }
});

counter.increment();
counter.$destroy(); // Cleanup
```

### Builder Pattern

Fluent API for building reactive state:

```javascript
const state = Reactive.reactive({ count: 0 })
  .computed({
    double() { return this.count * 2; }
  })
  .watch({
    count(val) { console.log('Count:', val); }
  })
  .effect(() => {
    console.log('Effect running');
  })
  .bind({
    '#count': 'count'
  })
  .action('increment', (state) => {
    state.count++;
  })
  .build();

state.increment();
state.destroy(); // Cleanup
```

### Async State

Manage async operations:

```javascript
const userData = Reactive.async(null);

console.log(userData.loading);   // false
console.log(userData.error);     // null
console.log(userData.data);      // null
console.log(userData.isSuccess); // false (computed)
console.log(userData.isError);   // false (computed)

// Execute async operation
await userData.$execute(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

console.log(userData.loading);   // false
console.log(userData.data);      // User data
console.log(userData.isSuccess); // true

// Reset
userData.$reset();
```

### Untracking

Run code without tracking dependencies:

```javascript
Reactive.effect(() => {
  console.log(state.count);

  // This won't create a dependency
  Reactive.untrack(() => {
    console.log(state.name);
  });
});

state.name = 'John'; // Effect doesn't run
state.count = 10;    // Effect runs
```

### Pause/Resume

Pause and resume reactivity:

```javascript
Reactive.pause();
state.count = 1;
state.count = 2;
state.count = 3;
Reactive.resume(true); // true = flush pending updates
```

### Manual Notification

Manually trigger updates:

```javascript
state.$notify('count');  // Notify specific property
state.$notify();         // Notify all properties
```

---

## API Reference

### ReactiveCore

#### State Creation
- `state(obj)` - Create reactive state
- `createState(obj, bindings)` - Create state with bindings
- `ref(value)` - Create reactive reference
- `refs(defs)` - Create multiple refs
- `store(state, options)` - Create store
- `component(config)` - Create component
- `reactive(state)` - Builder pattern
- `async(initialValue)` - Async state

#### Effects & Computed
- `effect(fn)` - Create effect
- `effects(defs)` - Create multiple effects
- `computed(state, defs)` - Add computed properties
- `watch(state, defs)` - Add watchers

#### Bindings
- `bindings(defs)` - Create DOM bindings

#### Updates
- `updateAll(state, updates)` - Mixed updates

#### Utilities
- `batch(fn)` - Batch updates
- `isReactive(value)` - Check if reactive
- `toRaw(value)` - Get raw value
- `notify(state, key)` - Manual notification
- `pause()` - Pause reactivity
- `resume(flush)` - Resume reactivity
- `untrack(fn)` - Run without tracking

#### Instance Methods
- `state.$computed(key, fn)` - Add computed
- `state.$watch(key, callback)` - Add watcher
- `state.$batch(fn)` - Batch updates
- `state.$notify(key)` - Trigger updates
- `state.$update(updates)` - Mixed updates
- `state.$set(updates)` - Functional updates
- `state.$bind(bindings)` - Create bindings
- `state.$raw` - Get raw object

### ReactiveCollections

#### Creation
- `collection(items)` - Create collection
- `createCollection(items)` - Alias
- `createCollectionWithComputed(items, computed)` - With computed
- `createFilteredCollection(source, predicate)` - Filtered view

#### Methods
- `add(item)` - Add item
- `remove(predicate)` - Remove item
- `update(predicate, updates)` - Update item
- `clear()` - Clear all
- `find(predicate)` - Find item
- `filter(predicate)` - Filter items
- `map(fn)` - Map items
- `forEach(fn)` - Iterate items
- `sort(compareFn)` - Sort items
- `reverse()` - Reverse items
- `at(index)` - Get at index
- `includes(item)` - Check includes
- `indexOf(item)` - Get index
- `slice(start, end)` - Slice items
- `splice(start, count, ...items)` - Splice items
- `push(...items)` - Push items
- `pop()` - Pop item
- `shift()` - Shift item
- `unshift(...items)` - Unshift items
- `toggle(predicate, field)` - Toggle field
- `removeWhere(predicate)` - Remove all matching
- `updateWhere(predicate, updates)` - Update all matching
- `reset(items)` - Reset with new items
- `toArray()` - Convert to array
- `isEmpty()` - Check if empty

#### Getters
- `collection.length` - Number of items
- `collection.first` - First item
- `collection.last` - Last item

### ReactiveForms

#### Creation
- `form(initialValues, options)` - Create form
- `createForm(initialValues, options)` - Alias

#### Values
- `setValue(field, value)` - Set value
- `setValues(values)` - Set multiple values
- `getValue(field)` - Get value

#### Errors
- `setError(field, error)` - Set error
- `setErrors(errors)` - Set multiple errors
- `clearError(field)` - Clear error
- `clearErrors()` - Clear all errors
- `hasError(field)` - Check error
- `getError(field)` - Get error

#### Touched
- `setTouched(field, touched)` - Set touched
- `setTouchedFields(fields)` - Set multiple touched
- `touchAll()` - Touch all fields
- `isTouched(field)` - Check touched
- `shouldShowError(field)` - Should show error

#### Validation
- `validateField(field)` - Validate field
- `validate()` - Validate all fields

#### Submission
- `submit(handler)` - Submit form
- `reset(values)` - Reset form
- `resetField(field)` - Reset field

#### Events
- `handleChange(event)` - Handle change
- `handleBlur(event)` - Handle blur
- `getFieldProps(field)` - Get field props

#### Binding
- `bindToInputs(selector)` - Bind to inputs

#### Serialization
- `toObject()` - Convert to object

#### Computed
- `form.isValid` - Is valid
- `form.isDirty` - Is dirty
- `form.hasErrors` - Has errors
- `form.touchedFields` - Touched fields
- `form.errorFields` - Error fields

#### Validators
- `validators.required(message)` - Required
- `validators.email(message)` - Email
- `validators.minLength(min, message)` - Min length
- `validators.maxLength(max, message)` - Max length
- `validators.pattern(regex, message)` - Pattern
- `validators.min(min, message)` - Min value
- `validators.max(max, message)` - Max value
- `validators.match(field, message)` - Match field
- `validators.custom(fn)` - Custom validator
- `validators.combine(...validators)` - Combine validators

---

## Migration Guide

### From Original Files

The modular reactive system refines the original reactive files:

**Old:**
```javascript
// Load 01_dh-reactive.js
const state = ReactiveUtils.state({ count: 0 });
```

**New:**
```javascript
// Load reactive-core.js or reactive.js
const state = Reactive.state({ count: 0 });
// or
const state = ReactiveCore.state({ count: 0 });
```

### Collection Migration

**Old (01_dh-reactive.js - deprecated):**
```javascript
const todos = ReactiveUtils.collection([...]);
todos.$add(item);
todos.$remove(predicate);
```

**New (reactive-collections.js):**
```javascript
const todos = Reactive.collection([...]);
todos.add(item);      // No $ prefix
todos.remove(predicate);
```

### Form Migration

**Old (01_dh-reactive.js - deprecated):**
```javascript
const form = ReactiveUtils.form({ email: '' });
form.$setValue('email', 'test@example.com');
```

**New (reactive-forms.js):**
```javascript
const form = Reactive.form({ email: '' });
form.setValue('email', 'test@example.com'); // No $ prefix
```

### Key Changes

1. **Deprecated basic collection() and form()** from reactive-core.js
2. **Use reactive-collections.js** for full-featured collections
3. **Use reactive-forms.js** for full-featured forms
4. **Method names** - No `$` prefix for collection/form methods
5. **Unified entry point** - Use `reactive.js` for all features

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues and feature requests, please visit the GitHub repository.

---

**Version:** 2.3.1
**Last Updated:** December 2025
