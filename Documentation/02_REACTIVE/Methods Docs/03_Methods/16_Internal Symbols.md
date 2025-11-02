# Internal Symbols - Technical Reference

## Overview

The reactive library uses JavaScript Symbols internally to manage reactive state and track reactivity. These symbols are implementation details and **not intended for direct use** in application code. This document provides technical reference for advanced users and contributors who need to understand the internal workings of the reactivity system.

---

## Table of Contents

1. [Symbol Overview](#symbol-overview)
2. [Internal Symbols](#internal-symbols)
3. [Use Cases](#use-cases)
4. [Advanced Examples](#advanced-examples)
5. [Best Practices](#best-practices)
6. [Technical Details](#technical-details)

---

## Symbol Overview

### What are Symbols?

JavaScript Symbols are unique, immutable primitive values that can be used as object property keys. The reactive library uses symbols to store metadata and internal state without conflicting with user-defined properties.

```javascript
// Symbols are unique
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false

// Symbols as object keys
const obj = {};
obj[sym1] = 'value';
console.log(obj[sym1]); // 'value'
```

### Why Symbols?

- **Uniqueness**: Symbols never conflict with string property names
- **Privacy**: Symbol-keyed properties don't appear in normal enumeration
- **Metadata**: Perfect for storing internal implementation details
- **Type Safety**: Clearly separate internal data from user data

---

## Internal Symbols

### `RAW`

Symbol for accessing the raw (non-reactive) object from a reactive proxy.

**Type:** `Symbol`

**Purpose:** Internal symbol used to retrieve the original object from a reactive proxy without triggering reactivity.

**Location:** Used internally by `toRaw()` utility function

**Description:**

The `RAW` symbol is attached to reactive proxies as a hidden property that points back to the original object. When the reactive system needs to access the underlying object without triggering dependency tracking, it uses this symbol.

**Internal Usage:**

```javascript
// Internal implementation (simplified)
function reactive(target) {
  const proxy = new Proxy(target, {
    get(target, key) {
      if (key === RAW) {
        return target; // Return raw object
      }
      // ... normal reactive get logic
    }
  });
  return proxy;
}

function toRaw(observed) {
  // Access the raw object using the RAW symbol
  return observed[RAW] || observed;
}
```

**What Developers Should Use Instead:**

```javascript
// ❌ DON'T access RAW directly
const raw = reactiveObj[RAW];

// ✅ DO use ReactiveUtils.toRaw()
const raw = ReactiveUtils.toRaw(reactiveObj);
```

**Example of Correct Usage:**

```javascript
const state = ReactiveUtils.state({
  user: { name: 'John', age: 30 },
  items: [1, 2, 3]
});

// Get raw object using the utility function
const rawState = ReactiveUtils.toRaw(state);

console.log(rawState); // Plain object
console.log(rawState === state); // false (different references)

// Modifications to raw object don't trigger reactivity
rawState.user.name = 'Jane'; // No reactive updates
```

**Why RAW Exists:**

1. **Performance**: Access raw data without reactivity overhead
2. **Serialization**: Convert reactive objects to plain objects for JSON
3. **Comparison**: Compare actual data values, not proxies
4. **Debugging**: Inspect original objects in development

**Internal Details:**

```javascript
// Conceptual implementation
const RAW = Symbol('raw');
const IS_REACTIVE = Symbol('isReactive');

function createReactiveProxy(target) {
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // Special case: accessing the RAW symbol
      if (key === RAW) {
        return target;
      }
      
      // Special case: checking if reactive
      if (key === IS_REACTIVE) {
        return true;
      }
      
      // Normal property access with dependency tracking
      track(target, key);
      const value = Reflect.get(target, key, receiver);
      
      // Recursively make nested objects reactive
      if (isObject(value)) {
        return reactive(value);
      }
      
      return value;
    },
    
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      
      if (oldValue !== value) {
        trigger(target, key);
      }
      
      return result;
    }
  });
  
  return proxy;
}
```

---

### `IS_REACTIVE`

Symbol for checking if an object is reactive.

**Type:** `Symbol`

**Purpose:** Internal symbol used to identify reactive proxies and distinguish them from plain objects.

**Location:** Used internally by `isReactive()` utility function

**Description:**

The `IS_REACTIVE` symbol is used as a marker on reactive proxies. When accessed, it returns `true` for reactive objects and `undefined` for non-reactive objects. This allows the reactive system to quickly determine if an object is already reactive.

**Internal Usage:**

```javascript
// Internal implementation (simplified)
function reactive(target) {
  // Check if already reactive
  if (target[IS_REACTIVE]) {
    return target;
  }
  
  const proxy = new Proxy(target, {
    get(target, key) {
      if (key === IS_REACTIVE) {
        return true; // Mark as reactive
      }
      // ... normal reactive get logic
    }
  });
  return proxy;
}

function isReactive(value) {
  return !!(value && value[IS_REACTIVE]);
}
```

**What Developers Should Use Instead:**

```javascript
// ❌ DON'T check IS_REACTIVE directly
if (obj[IS_REACTIVE]) {
  console.log('Is reactive');
}

// ✅ DO use ReactiveUtils.isReactive()
if (ReactiveUtils.isReactive(obj)) {
  console.log('Is reactive');
}
```

**Example of Correct Usage:**

```javascript
const plainObject = { count: 0 };
const reactiveObject = ReactiveUtils.state({ count: 0 });

// Check if objects are reactive
console.log(ReactiveUtils.isReactive(plainObject)); // false
console.log(ReactiveUtils.isReactive(reactiveObject)); // true

// Useful for conditional logic
function processData(data) {
  if (ReactiveUtils.isReactive(data)) {
    // Work with reactive data
    console.log('Working with reactive data');
  } else {
    // Convert to reactive if needed
    data = ReactiveUtils.state(data);
  }
  
  return data;
}
```

**Why IS_REACTIVE Exists:**

1. **Type Checking**: Distinguish reactive from non-reactive objects
2. **Duplicate Prevention**: Avoid wrapping reactive objects twice
3. **Conditional Logic**: Handle reactive and non-reactive data differently
4. **Debugging**: Identify reactive objects during development

**Internal Details:**

```javascript
// Conceptual implementation
const IS_REACTIVE = Symbol('isReactive');

function isReactive(value) {
  // Check for symbol marker
  return !!(value && value[IS_REACTIVE]);
}

function reactive(target) {
  // Don't double-wrap reactive objects
  if (isReactive(target)) {
    return target;
  }
  
  // Create proxy with IS_REACTIVE marker
  return new Proxy(target, {
    get(target, key) {
      if (key === IS_REACTIVE) {
        return true;
      }
      
      // ... rest of get trap
    }
  });
}

// Usage in nested reactivity
function makeReactive(value) {
  if (isObject(value)) {
    // Only make reactive if not already reactive
    return isReactive(value) ? value : reactive(value);
  }
  return value;
}
```

---

## Use Cases

### When You Might Encounter These Symbols

#### 1. Debugging Reactive Objects

```javascript
const state = ReactiveUtils.state({ count: 0 });

// In browser console or debugger
console.log(state);
// You might see Symbol properties in the object inspector

// Use utility functions instead
console.log(ReactiveUtils.isReactive(state)); // true
console.log(ReactiveUtils.toRaw(state)); // { count: 0 }
```

#### 2. Serializing Reactive State

```javascript
const state = ReactiveUtils.state({
  user: { name: 'John' },
  settings: { theme: 'dark' }
});

// ❌ Don't try to access symbols directly
// const raw = state[RAW];

// ✅ Use toRaw() for serialization
const rawState = ReactiveUtils.toRaw(state);
const json = JSON.stringify(rawState);

// Save to localStorage
localStorage.setItem('app-state', json);

// Load and make reactive again
const loaded = JSON.parse(localStorage.getItem('app-state'));
const newState = ReactiveUtils.state(loaded);
```

#### 3. Type Guards in Functions

```javascript
function updateData(data, updates) {
  // Check if data is reactive
  if (ReactiveUtils.isReactive(data)) {
    // Direct update will trigger reactivity
    Object.assign(data, updates);
  } else {
    // Need to make it reactive first
    const reactive = ReactiveUtils.state(data);
    Object.assign(reactive, updates);
    return reactive;
  }
}
```

#### 4. Performance Optimization

```javascript
function bulkUpdate(state, items) {
  // Get raw object for non-reactive bulk updates
  const raw = ReactiveUtils.toRaw(state);
  
  // Batch operations on raw object (no reactivity overhead)
  items.forEach(item => {
    raw.items.push(item);
  });
  
  // Manually trigger reactivity once
  ReactiveUtils.notify(state, 'items');
}
```

---

## Advanced Examples

### Example 1: Custom Reactive Wrapper

```javascript
// Advanced: Creating a custom reactive wrapper
function createTrackedState(initialState) {
  const state = ReactiveUtils.state(initialState);
  const history = [];
  
  // Wrap in proxy to track changes
  return new Proxy(state, {
    set(target, key, value) {
      // Check if target is reactive
      if (ReactiveUtils.isReactive(target)) {
        const oldValue = target[key];
        
        // Record change in history
        history.push({
          key,
          oldValue: ReactiveUtils.toRaw(oldValue),
          newValue: ReactiveUtils.toRaw(value),
          timestamp: Date.now()
        });
        
        // Perform the actual set
        target[key] = value;
        return true;
      }
      
      return Reflect.set(target, key, value);
    },
    
    get(target, key) {
      if (key === 'getHistory') {
        return () => history;
      }
      return target[key];
    }
  });
}

// Usage
const state = createTrackedState({ count: 0 });
state.count = 1;
state.count = 2;
console.log(state.getHistory());
```

### Example 2: Deep Cloning Reactive Objects

```javascript
function deepClone(obj) {
  // Get raw object if reactive
  const source = ReactiveUtils.isReactive(obj) 
    ? ReactiveUtils.toRaw(obj) 
    : obj;
  
  // Deep clone
  const clone = JSON.parse(JSON.stringify(source));
  
  // Make clone reactive if original was reactive
  return ReactiveUtils.isReactive(obj) 
    ? ReactiveUtils.state(clone) 
    : clone;
}

// Usage
const state = ReactiveUtils.state({ user: { name: 'John' } });
const cloned = deepClone(state);

console.log(ReactiveUtils.isReactive(cloned)); // true
console.log(cloned === state); // false (different objects)
```

### Example 3: Reactive State Comparison

```javascript
function statesEqual(state1, state2) {
  // Compare raw values, not proxies
  const raw1 = ReactiveUtils.toRaw(state1);
  const raw2 = ReactiveUtils.toRaw(state2);
  
  return JSON.stringify(raw1) === JSON.stringify(raw2);
}

// Usage
const state1 = ReactiveUtils.state({ count: 10 });
const state2 = ReactiveUtils.state({ count: 10 });
const state3 = state1; // Same reference

console.log(state1 === state2); // false (different proxies)
console.log(state1 === state3); // true (same proxy)
console.log(statesEqual(state1, state2)); // true (same values)
```

### Example 4: Conditional Reactivity

```javascript
function ensureReactive(data) {
  // Only make reactive if not already reactive
  if (ReactiveUtils.isReactive(data)) {
    return data;
  }
  
  return ReactiveUtils.state(data);
}

function processBatch(items) {
  // Work with non-reactive data for performance
  const rawItems = items.map(item => 
    ReactiveUtils.isReactive(item) 
      ? ReactiveUtils.toRaw(item) 
      : item
  );
  
  // Process without reactivity overhead
  const processed = rawItems.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
  
  // Make reactive again
  return processed.map(item => ReactiveUtils.state(item));
}
```

---

## Best Practices

### ✅ DO

```javascript
// Use utility functions
const raw = ReactiveUtils.toRaw(reactiveObj);
const isReactive = ReactiveUtils.isReactive(obj);

// Check reactivity before operations
if (ReactiveUtils.isReactive(data)) {
  // Handle reactive data
}

// Convert to raw for serialization
const json = JSON.stringify(ReactiveUtils.toRaw(state));

// Use for performance-critical operations
const raw = ReactiveUtils.toRaw(state);
// ... many operations on raw
ReactiveUtils.notify(state, 'propertyName');
```

### ❌ DON'T

```javascript
// Don't access symbols directly
const raw = obj[RAW]; // ❌
const isReactive = obj[IS_REACTIVE]; // ❌

// Don't try to modify symbol properties
obj[RAW] = someValue; // ❌
obj[IS_REACTIVE] = true; // ❌

// Don't rely on symbol enumeration
for (let key in obj) {
  // Symbols won't appear here
}

// Don't create your own RAW/IS_REACTIVE symbols
const MY_RAW = Symbol('raw'); // ❌ Won't work
```

---

## Technical Details

### Symbol Properties

```javascript
// Symbols have descriptions but are unique
const RAW = Symbol('raw');
const ANOTHER_RAW = Symbol('raw');

console.log(RAW === ANOTHER_RAW); // false
console.log(RAW.description); // 'raw'
console.log(typeof RAW); // 'symbol'
```

### Symbol Enumeration

```javascript
const obj = {
  normalProp: 'value',
  [Symbol('hidden')]: 'hidden value'
};

// Symbols don't appear in normal iteration
console.log(Object.keys(obj)); // ['normalProp']
console.log(Object.getOwnPropertyNames(obj)); // ['normalProp']

// Need special method to get symbols
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(hidden)]
```

### Proxy Trap Behavior

```javascript
// How symbols work in proxies
const proxy = new Proxy({}, {
  get(target, key) {
    if (typeof key === 'symbol') {
      console.log('Accessing symbol:', key.description);
    }
    return target[key];
  }
});

const sym = Symbol('test');
proxy[sym]; // Logs: "Accessing symbol: test"
```

### Performance Considerations

```javascript
// Symbol access is very fast
const obj = { [Symbol('test')]: 'value' };
const sym = Symbol('test');

// Direct access (fast)
console.time('symbol');
for (let i = 0; i < 1000000; i++) {
  obj[sym];
}
console.timeEnd('symbol');

// String property access (also fast)
console.time('string');
for (let i = 0; i < 1000000; i++) {
  obj['normalProp'];
}
console.timeEnd('string');
// Both are similarly performant
```

---

## Summary

### Key Points

- **RAW**: Symbol for accessing non-reactive original object
  - Use `ReactiveUtils.toRaw()` instead of direct access
  - Useful for serialization and performance
  
- **IS_REACTIVE**: Symbol for checking if object is reactive
  - Use `ReactiveUtils.isReactive()` instead of direct access
  - Useful for type checking and conditional logic

### Why Symbols?

1. **Uniqueness** - Never conflict with user properties
2. **Privacy** - Hidden from normal enumeration
3. **Performance** - Fast property access
4. **Safety** - Clear separation of concerns

### Best Practices Summary

| Scenario | ❌ Don't Do | ✅ Do This |
|----------|-------------|-----------|
| Get raw object | `obj[RAW]` | `ReactiveUtils.toRaw(obj)` |
| Check reactivity | `obj[IS_REACTIVE]` | `ReactiveUtils.isReactive(obj)` |
| Serialize state | Access symbols | Use `toRaw()` then `JSON.stringify()` |
| Type checking | Manual symbol checks | Use utility functions |

### When to Care About Symbols

- ✅ Building advanced utilities
- ✅ Debugging reactive system
- ✅ Performance optimization
- ✅ Understanding internals
- ❌ Normal application development
- ❌ Basic reactive usage

### Remember

These symbols are **internal implementation details**. Always use the provided utility functions (`toRaw()`, `isReactive()`) instead of accessing symbols directly. This ensures:

- Code compatibility with future versions
- Proper behavior and type safety
- Better readability and maintainability
- Adherence to library best practices

---
