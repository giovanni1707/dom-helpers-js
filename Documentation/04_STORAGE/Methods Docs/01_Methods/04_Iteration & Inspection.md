# DOM Helpers Storage - Iteration & Inspection Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Why Iteration & Inspection?](#why-iteration--inspection)
3. [Iteration Methods](#iteration-methods)
   - [keys() - Get All Keys](#keys---get-all-keys)
   - [values() - Get All Values](#values---get-all-values)
   - [entries() - Get Key-Value Pairs](#entries---get-key-value-pairs)
   - [size() - Get Item Count](#size---get-item-count)
4. [Namespace Awareness](#namespace-awareness)
5. [Practical Examples](#practical-examples)
   - [Debugging & Logging](#debugging--logging)
   - [Data Export](#data-export)
   - [Storage Analysis](#storage-analysis)
   - [Bulk Operations](#bulk-operations)
6. [Advanced Patterns](#advanced-patterns)
7. [Performance Considerations](#performance-considerations)
8. [Best Practices](#best-practices)
9. [Comparison with Native API](#comparison-with-native-api)
10. [Real-World Use Cases](#real-world-use-cases)

---

## Introduction

The **Iteration & Inspection** methods provide powerful ways to examine and work with stored data. Unlike native storage APIs, DOM Helpers Storage offers convenient methods to iterate over keys, values, and entries with full namespace support and automatic expiry handling.

### Key Features

- ✅ **Namespace Aware** - Operations respect namespace boundaries
- ✅ **Expiry Handling** - Automatically skips expired items
- ✅ **Array Returns** - Easy to work with JavaScript array methods
- ✅ **Type Preservation** - Values maintain their original types
- ✅ **No Manual Parsing** - Objects and arrays returned ready to use

---

## Why Iteration & Inspection?

### Native Storage Limitations

```javascript
// Native storage is limited
localStorage.length; // Just a count
localStorage.key(0); // Get key by index (not useful)

// To get all keys, you need this:
const keys = [];
for (let i = 0; i < localStorage.length; i++) {
  keys.push(localStorage.key(i));
}

// To get all values, even more work:
const values = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  values.push(JSON.parse(value));
}
```

### DOM Helpers Solution

```javascript
// Simple and clean
const keys = Storage.keys();        // ['key1', 'key2', 'key3']
const values = Storage.values();    // [value1, value2, value3]
const entries = Storage.entries();  // [['key1', value1], ...]
const count = Storage.size();       // 3
```

---

## Iteration Methods

### `keys()` - Get All Keys

Get an array of all storage keys within the current namespace.

#### Syntax

```javascript
storage.keys()
```

#### Parameters

None

#### Returns

`Array<string>` - Array of key names

#### Behaviors

- ✅ Returns only keys in current namespace
- ✅ Automatically excludes expired keys (and removes them)
- ✅ Returns empty array if no keys exist
- ✅ Keys are in storage order (not guaranteed to be sorted)

#### Examples

**Basic Usage:**

```javascript
Storage.set('username', 'Alice');
Storage.set('email', 'alice@example.com');
Storage.set('age', 30);

const keys = Storage.keys();
console.log(keys);
// ['username', 'email', 'age']
```

**Empty Storage:**

```javascript
Storage.clear();

const keys = Storage.keys();
console.log(keys); // []
console.log(keys.length); // 0
```

**With Namespace:**

```javascript
// Global storage
Storage.set('globalKey1', 'value1');
Storage.set('globalKey2', 'value2');

// Namespaced storage
const appStorage = Storage.namespace('myApp');
appStorage.set('appKey1', 'value1');
appStorage.set('appKey2', 'value2');

console.log(Storage.keys());
// ['globalKey1', 'globalKey2']

console.log(appStorage.keys());
// ['appKey1', 'appKey2']

// Namespaces are isolated!
```

**Expired Keys Excluded:**

```javascript
// Store items
Storage.set('permanent', 'value1');
Storage.set('temporary', 'value2', { expires: 5 }); // 5 seconds

console.log(Storage.keys());
// ['permanent', 'temporary']

// After 6 seconds
setTimeout(() => {
  console.log(Storage.keys());
  // ['permanent']
  // 'temporary' automatically excluded and removed
}, 6000);
```

**Check Specific Keys:**

```javascript
const keys = Storage.keys();

if (keys.includes('username')) {
  console.log('Username exists');
}

if (keys.includes('authToken')) {
  console.log('User is authenticated');
}
```

**Count Keys:**

```javascript
const keyCount = Storage.keys().length;
console.log(`Storage contains ${keyCount} items`);
```

**Filter Keys:**

```javascript
Storage.set('user_name', 'Alice');
Storage.set('user_email', 'alice@example.com');
Storage.set('user_age', 30);
Storage.set('config_theme', 'dark');
Storage.set('config_language', 'en');

// Get all user-related keys
const userKeys = Storage.keys().filter(key => key.startsWith('user_'));
console.log(userKeys);
// ['user_name', 'user_email', 'user_age']

// Get all config keys
const configKeys = Storage.keys().filter(key => key.startsWith('config_'));
console.log(configKeys);
// ['config_theme', 'config_language']
```

**Sort Keys:**

```javascript
const keys = Storage.keys().sort();
console.log(keys);
// Alphabetically sorted: ['age', 'email', 'username']

// Reverse sort
const reversedKeys = Storage.keys().sort().reverse();
console.log(reversedKeys);
// ['username', 'email', 'age']
```

**Map Over Keys:**

```javascript
// Get all key-length pairs
const keyLengths = Storage.keys().map(key => ({
  key,
  length: key.length
}));

console.log(keyLengths);
// [
//   { key: 'username', length: 8 },
//   { key: 'email', length: 5 },
//   { key: 'age', length: 3 }
// ]
```

**Find Keys:**

```javascript
// Find first key containing 'user'
const userKey = Storage.keys().find(key => key.includes('user'));
console.log(userKey); // 'username'

// Check if any key starts with 'auth'
const hasAuth = Storage.keys().some(key => key.startsWith('auth'));
console.log(hasAuth); // true/false

// Check if all keys are prefixed
const allPrefixed = Storage.keys().every(key => key.includes('_'));
console.log(allPrefixed); // true/false
```

---

### `values()` - Get All Values

Get an array of all storage values within the current namespace.

#### Syntax

```javascript
storage.values()
```

#### Parameters

None

#### Returns

`Array<any>` - Array of stored values (with original types preserved)

#### Behaviors

- ✅ Returns values in same order as keys
- ✅ Automatically excludes expired values
- ✅ Types preserved (objects, arrays, numbers, booleans)
- ✅ Returns empty array if no values exist

#### Examples

**Basic Usage:**

```javascript
Storage.set('username', 'Alice');
Storage.set('age', 30);
Storage.set('isActive', true);

const values = Storage.values();
console.log(values);
// ['Alice', 30, true]

// Types preserved!
console.log(typeof values[1]); // 'number'
console.log(typeof values[2]); // 'boolean'
```

**Complex Values:**

```javascript
Storage.set('user', { name: 'Alice', email: 'alice@example.com' });
Storage.set('tags', ['javascript', 'storage', 'api']);
Storage.set('settings', { theme: 'dark', language: 'en' });

const values = Storage.values();
console.log(values);
// [
//   { name: 'Alice', email: 'alice@example.com' },
//   ['javascript', 'storage', 'api'],
//   { theme: 'dark', language: 'en' }
// ]

// Values are ready to use (no parsing needed)
console.log(values[0].name); // 'Alice'
console.log(values[1][0]);   // 'javascript'
console.log(values[2].theme); // 'dark'
```

**With Namespace:**

```javascript
const userStorage = Storage.namespace('user');

userStorage.set('profile', { name: 'Alice' });
userStorage.set('preferences', { theme: 'dark' });

const values = userStorage.values();
console.log(values);
// [
//   { name: 'Alice' },
//   { theme: 'dark' }
// ]
```

**Filter Values:**

```javascript
Storage.set('price1', 10);
Storage.set('price2', 25);
Storage.set('price3', 5);
Storage.set('name', 'Product');

// Get only numeric values
const prices = Storage.values().filter(v => typeof v === 'number');
console.log(prices); // [10, 25, 5]

// Get only string values
const strings = Storage.values().filter(v => typeof v === 'string');
console.log(strings); // ['Product']
```

**Calculate Statistics:**

```javascript
Storage.set('score1', 85);
Storage.set('score2', 92);
Storage.set('score3', 78);
Storage.set('score4', 95);

const scores = Storage.values().filter(v => typeof v === 'number');

const total = scores.reduce((sum, score) => sum + score, 0);
const average = total / scores.length;
const max = Math.max(...scores);
const min = Math.min(...scores);

console.log({
  total,    // 350
  average,  // 87.5
  max,      // 95
  min       // 78
});
```

**Find Values:**

```javascript
Storage.set('user1', { name: 'Alice', role: 'admin' });
Storage.set('user2', { name: 'Bob', role: 'user' });
Storage.set('user3', { name: 'Charlie', role: 'admin' });

// Find first admin
const admin = Storage.values()
  .filter(v => typeof v === 'object' && v !== null)
  .find(user => user.role === 'admin');

console.log(admin); // { name: 'Alice', role: 'admin' }

// Get all admins
const admins = Storage.values()
  .filter(v => typeof v === 'object' && v !== null)
  .filter(user => user.role === 'admin');

console.log(admins);
// [
//   { name: 'Alice', role: 'admin' },
//   { name: 'Charlie', role: 'admin' }
// ]
```

**Transform Values:**

```javascript
Storage.set('product1', { name: 'Laptop', price: 999 });
Storage.set('product2', { name: 'Mouse', price: 25 });
Storage.set('product3', { name: 'Keyboard', price: 75 });

// Extract product names
const names = Storage.values()
  .filter(v => v && v.name)
  .map(product => product.name);

console.log(names);
// ['Laptop', 'Mouse', 'Keyboard']

// Calculate total price
const totalPrice = Storage.values()
  .filter(v => v && typeof v.price === 'number')
  .reduce((sum, product) => sum + product.price, 0);

console.log(totalPrice); // 1099
```

---

### `entries()` - Get Key-Value Pairs

Get an array of all [key, value] pairs within the current namespace.

#### Syntax

```javascript
storage.entries()
```

#### Parameters

None

#### Returns

`Array<[string, any]>` - Array of [key, value] tuples

#### Behaviors

- ✅ Returns entries in storage order
- ✅ Automatically excludes expired entries
- ✅ Compatible with `Object.fromEntries()`
- ✅ Compatible with `Map` constructor
- ✅ Values maintain original types

#### Examples

**Basic Usage:**

```javascript
Storage.set('username', 'Alice');
Storage.set('age', 30);
Storage.set('isActive', true);

const entries = Storage.entries();
console.log(entries);
// [
//   ['username', 'Alice'],
//   ['age', 30],
//   ['isActive', true]
// ]
```

**Convert to Object:**

```javascript
Storage.set('theme', 'dark');
Storage.set('language', 'en');
Storage.set('fontSize', 16);

// Get all entries as object
const settings = Object.fromEntries(Storage.entries());
console.log(settings);
// {
//   theme: 'dark',
//   language: 'en',
//   fontSize: 16
// }
```

**Convert to Map:**

```javascript
const entries = Storage.entries();
const map = new Map(entries);

console.log(map.get('username')); // 'Alice'
console.log(map.has('age'));      // true
console.log(map.size);            // 3
```

**Iterate with forEach:**

```javascript
Storage.entries().forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Output:
// username: Alice
// age: 30
// isActive: true
```

**Iterate with for...of:**

```javascript
for (const [key, value] of Storage.entries()) {
  console.log(`Key: ${key}, Value: ${value}, Type: ${typeof value}`);
}

// Output:
// Key: username, Value: Alice, Type: string
// Key: age, Value: 30, Type: number
// Key: isActive, Value: true, Type: boolean
```

**Filter Entries:**

```javascript
Storage.set('config_theme', 'dark');
Storage.set('config_language', 'en');
Storage.set('user_name', 'Alice');
Storage.set('user_email', 'alice@example.com');

// Get only config entries
const configEntries = Storage.entries()
  .filter(([key]) => key.startsWith('config_'));

console.log(configEntries);
// [
//   ['config_theme', 'dark'],
//   ['config_language', 'en']
// ]

// Convert to object
const config = Object.fromEntries(configEntries);
console.log(config);
// { config_theme: 'dark', config_language: 'en' }
```

**Transform Entries:**

```javascript
Storage.set('price', 100);
Storage.set('quantity', 5);
Storage.set('discount', 10);

// Transform values
const transformed = Storage.entries()
  .map(([key, value]) => {
    if (typeof value === 'number') {
      return [key, value * 1.1]; // Add 10%
    }
    return [key, value];
  });

console.log(Object.fromEntries(transformed));
// { price: 110, quantity: 5.5, discount: 11 }
```

**Find Entry:**

```javascript
Storage.set('user1', { name: 'Alice', active: true });
Storage.set('user2', { name: 'Bob', active: false });
Storage.set('user3', { name: 'Charlie', active: true });

// Find first active user entry
const activeEntry = Storage.entries()
  .find(([key, value]) => value && value.active);

console.log(activeEntry);
// ['user1', { name: 'Alice', active: true }]

const [userId, userData] = activeEntry;
console.log(`Active user: ${userData.name} (ID: ${userId})`);
```

**Group Entries:**

```javascript
Storage.set('product_laptop', { category: 'electronics', price: 999 });
Storage.set('product_mouse', { category: 'electronics', price: 25 });
Storage.set('product_desk', { category: 'furniture', price: 200 });
Storage.set('product_chair', { category: 'furniture', price: 150 });

// Group by category
const grouped = Storage.entries()
  .filter(([key]) => key.startsWith('product_'))
  .reduce((acc, [key, value]) => {
    const category = value.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, ...value });
    return acc;
  }, {});

console.log(grouped);
// {
//   electronics: [
//     { key: 'product_laptop', category: 'electronics', price: 999 },
//     { key: 'product_mouse', category: 'electronics', price: 25 }
//   ],
//   furniture: [
//     { key: 'product_desk', category: 'furniture', price: 200 },
//     { key: 'product_chair', category: 'furniture', price: 150 }
//   ]
// }
```

**Sort Entries:**

```javascript
Storage.set('zebra', 3);
Storage.set('alpha', 1);
Storage.set('beta', 2);

// Sort by key
const byKey = Storage.entries().sort((a, b) => a[0].localeCompare(b[0]));
console.log(byKey);
// [['alpha', 1], ['beta', 2], ['zebra', 3]]

// Sort by value
const byValue = Storage.entries().sort((a, b) => a[1] - b[1]);
console.log(byValue);
// [['alpha', 1], ['beta', 2], ['zebra', 3]]
```

---

### `size()` - Get Item Count

Get the number of items in storage within the current namespace.

#### Syntax

```javascript
storage.size()
```

#### Parameters

None

#### Returns

`number` - Count of items in storage

#### Behaviors

- ✅ Counts only non-expired items
- ✅ Respects namespace boundaries
- ✅ Automatically excludes expired items from count
- ✅ More efficient than `keys().length`

#### Examples

**Basic Usage:**

```javascript
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');

const count = Storage.size();
console.log(count); // 3
```

**Empty Storage:**

```javascript
Storage.clear();

const count = Storage.size();
console.log(count); // 0
```

**With Namespace:**

```javascript
// Global storage
Storage.set('global1', 'value1');
Storage.set('global2', 'value2');

// Namespaced storage
const appStorage = Storage.namespace('app');
appStorage.set('app1', 'value1');
appStorage.set('app2', 'value2');
appStorage.set('app3', 'value3');

console.log(Storage.size());     // 2 (global items)
console.log(appStorage.size());  // 3 (app namespace items)
```

**Check if Empty:**

```javascript
if (Storage.size() === 0) {
  console.log('Storage is empty');
} else {
  console.log(`Storage contains ${Storage.size()} items`);
}
```

**Compare Sizes:**

```javascript
const before = Storage.size();
console.log(`Before: ${before} items`);

Storage.set('newKey', 'newValue');

const after = Storage.size();
console.log(`After: ${after} items`);
console.log(`Added: ${after - before} items`);
```

**Monitor Storage Growth:**

```javascript
function monitorStorage() {
  const size = Storage.size();
  const maxSize = 100;
  const percentage = (size / maxSize) * 100;
  
  console.log(`Storage: ${size}/${maxSize} (${percentage.toFixed(1)}%)`);
  
  if (size >= maxSize) {
    console.warn('Storage limit reached!');
  } else if (size >= maxSize * 0.8) {
    console.warn('Storage 80% full');
  }
}

// Monitor periodically
setInterval(monitorStorage, 60000);
```

**Equivalent to keys().length:**

```javascript
// These give the same result:
const size1 = Storage.size();
const size2 = Storage.keys().length;

console.log(size1 === size2); // true

// But size() is more efficient
// (doesn't need to build array of keys)
```

**Track Changes:**

```javascript
class StorageTracker {
  constructor(namespace) {
    this.storage = Storage.namespace(namespace);
    this.previousSize = this.storage.size();
  }
  
  checkChanges() {
    const currentSize = this.storage.size();
    const delta = currentSize - this.previousSize;
    
    if (delta > 0) {
      console.log(`Added ${delta} items`);
    } else if (delta < 0) {
      console.log(`Removed ${Math.abs(delta)} items`);
    } else {
      console.log('No changes');
    }
    
    this.previousSize = currentSize;
    return delta;
  }
}

// Usage
const tracker = new StorageTracker('app');
Storage.namespace('app').set('key', 'value');
tracker.checkChanges(); // "Added 1 items"
```

**Conditional Operations:**

```javascript
// Only add if space available
function addIfSpace(key, value, maxItems = 100) {
  if (Storage.size() < maxItems) {
    Storage.set(key, value);
    return true;
  } else {
    console.warn('Storage full');
    return false;
  }
}

// Cleanup if too full
function cleanupIfFull(threshold = 90) {
  if (Storage.size() >= threshold) {
    console.log('Storage full, cleaning up...');
    Storage.cleanup();
    
    // If still full after cleanup, clear old items
    if (Storage.size() >= threshold) {
      const entries = Storage.entries();
      const toRemove = Math.ceil(entries.length * 0.2); // Remove 20%
      
      entries.slice(0, toRemove).forEach(([key]) => {
        Storage.remove(key);
      });
    }
  }
}
```

---

## Namespace Awareness

All iteration methods respect namespace boundaries:

```javascript
// Setup different namespaces
Storage.set('globalKey', 'global value');

const auth = Storage.namespace('auth');
auth.set('token', 'abc123');
auth.set('userId', 42);

const cache = Storage.namespace('cache');
cache.set('users', [{ id: 1 }]);
cache.set('posts', [{ id: 1 }]);

// Global iteration
console.log(Storage.keys());     // ['globalKey']
console.log(Storage.size());     // 1

// Auth namespace iteration
console.log(auth.keys());        // ['token', 'userId']
console.log(auth.values());      // ['abc123', 42]
console.log(auth.size());        // 2

// Cache namespace iteration
console.log(cache.keys());       // ['users', 'posts']
console.log(cache.entries());    // [['users', [...]], ['posts', [...]]]
console.log(cache.size());       // 2

// Each namespace is completely isolated!
```

---

## Practical Examples

### Debugging & Logging

```javascript
// Debug storage contents
function debugStorage(namespace = null) {
  const storage = namespace ? Storage.namespace(namespace) : Storage;
  const name = namespace || 'Global';
  
  console.group(`${name} Storage Contents`);
  console.log(`Total items: ${storage.size()}`);
  console.log('Keys:', storage.keys());
  
  console.table(
    Object.fromEntries(storage.entries())
  );
  
  console.groupEnd();
}

// Usage
debugStorage();
debugStorage('auth');
debugStorage('cache');
```

### Data Export

```javascript
// Export all storage data
function exportStorage() {
  const data = {
    timestamp: new Date().toISOString(),
    items: Object.fromEntries(Storage.entries()),
    count: Storage.size()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `storage-export-${Date.now()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Export specific namespace
function exportNamespace(namespace) {
  const storage = Storage.namespace(namespace);
  
  const data = {
    namespace,
    timestamp: new Date().toISOString(),
    items: Object.fromEntries(storage.entries()),
    count: storage.size()
  };
  
  return data;
}
```

### Storage Analysis

```javascript
// Analyze storage usage
function analyzeStorage() {
  const keys = Storage.keys();
  const values = Storage.values();
  const entries = Storage.entries();
  
  // Type breakdown
  const types = values.reduce((acc, value) => {
    const type = Array.isArray(value) ? 'array' : typeof value;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Size calculation (approximate)
  const totalSize = JSON.stringify(values).length;
  const averageSize = Math.round(totalSize / values.length);
  
  // Key patterns
  const patterns = keys.reduce((acc, key) => {
    const prefix = key.split('_')[0] || key.split(':')[0] || 'other';
    acc[prefix] = (acc[prefix] || 0) + 1;
    return acc;
  }, {});
  
  return {
    count: Storage.size(),
    types,
    size: {
      total: totalSize,
      average: averageSize,
      totalKB: (totalSize / 1024).toFixed(2)
    },
    patterns,
    keys: keys.slice(0, 10) // First 10 keys
  };
}

// Usage
console.log(analyzeStorage());
// {
//   count: 15,
//   types: { string: 8, number: 4, object: 2, boolean: 1 },
//   size: { total: 2048, average: 136, totalKB: '2.00' },
//   patterns: { user: 5, config: 3, cache: 7 },
//   keys: ['user_name', 'user_email', ...]
// }
```

### Bulk Operations

```javascript
// Clear specific keys
function clearMatching(pattern) {
  const keys = Storage.keys().filter(key => key.includes(pattern));
  
  keys.forEach(key => Storage.remove(key));
  
  return keys.length;
}

// Usage
const cleared = clearMatching('temp_');
console.log(`Cleared ${cleared} temporary items`);

// Copy namespace to another
function copyNamespace(from, to) {
  const source = Storage.namespace(from);
  const target = Storage.namespace(to);
  
  source.entries().forEach(([key, value]) => {
    target.set(key, value);
  });
  
  return source.size();
}

// Usage
const copied = copyNamespace('dev', 'prod');
console.log(`Copied ${copied} items from dev to prod`);

// Merge namespaces
function mergeNamespaces(...namespaces) {
  const merged = {};
  
  namespaces.forEach(ns => {
    const storage = Storage.namespace(ns);
    storage.entries().forEach(([key, value]) => {
      merged[`${ns}:${key}`] = value;
    });
  });
  
  return merged;
}

// Usage
const allData = mergeNamespaces('auth', 'cache', 'ui');
console.log(allData);
```

---

## Advanced Patterns

### Storage Iterator

```javascript
class StorageIterator {
  constructor(storage) {
    this.storage = storage;
    this.entries = storage.entries();
    this.index = 0;
  }
  
  next() {
    if (this.index < this.entries.length) {
      const [key, value] = this.entries[this.index++];
      return { key, value, done: false };
    }
    return { done: true };
  }
  
  hasNext() {
    return this.index < this.entries.length;
  }
  
  reset() {
    this.index = 0;
  }
  
  forEach(callback) {
    this.reset();
    while (this.hasNext()) {
      const { key, value } = this.next();
      callback(key, value);
    }
  }
}

// Usage
const iterator = new StorageIterator(Storage);
iterator.forEach((key, value) => {
  console.log(`${key}: ${value}`);
});
```

### Storage Diff

```javascript
// Compare storage states
class StorageDiff {
  constructor(namespace) {
    this.storage = namespace ? Storage.namespace(namespace) : Storage;
    this.snapshot = this.takeSnapshot();
  }
  
  takeSnapshot() {
    return new Map(this.storage.entries());
  }
  
  getDiff() {
    const current = new Map(this.storage.entries());
    const diff = {
      added: [],
      removed: [],
      modified: []
    };
    
    // Check for added and modified
    current.forEach((value, key) => {
      if (!this.snapshot.has(key)) {
        diff.added.push({ key, value });
      } else if (JSON.stringify(this.snapshot.get(key)) !== JSON.stringify(value)) {
        diff.modified.push({
          key,
          oldValue: this.snapshot.get(key),
          newValue: value
        });
      }
    });
    
    // Check for removed
    this.snapshot.forEach((value, key) => {
      if (!current.has(key)) {
        diff.removed.push({ key, value });
      }
    });
    
    return diff;
  }
  
  reset() {
    this.snapshot = this.takeSnapshot();
  }
}

// Usage
const diff = new StorageDiff();

Storage.set('newKey', 'newValue');
Storage.set('existingKey', 'modifiedValue');
Storage.remove('oldKey');

const changes = diff.getDiff();
console.log(changes);
// {
//   added: [{ key: 'newKey', value: 'newValue' }],
//   modified: [{ key: 'existingKey', oldValue: '...', newValue: '...' }],
//   removed: [{ key: 'oldKey', value: '...' }]
// }
```

### Storage Query

```javascript
class StorageQuery {
  constructor(storage) {
    this.storage = storage;
    this.results = storage.entries();
  }
  
  where(predicate) {
    this.results = this.results.filter(([key, value]) => 
      predicate(key, value)
    );
    return this;
  }
  
  orderBy(keyOrFn, direction = 'asc') {
    this.results.sort((a, b) => {
      const aVal = typeof keyOrFn === 'function' ? keyOrFn(a) : a[1][keyOrFn];
      const bVal = typeof keyOrFn === 'function' ? keyOrFn(b) : b[1][keyOrFn];
      
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return direction === 'desc' ? -comparison : comparison;
    });
    return this;
  }
  
  limit(count) {
    this.results = this.results.slice(0, count);
    return this;
  }
  
  skip(count) {
    this.results = this.results.slice(count);
    return this;
  }
  
  select(fields) {
    if (!fields) {
      return this.results;
    }
    
    return this.results.map(([key, value]) => {
      if (Array.isArray(fields)) {
        const selected = { _key: key };
        fields.forEach(field => {
          if (value && typeof value === 'object' && field in value) {
            selected[field] = value[field];
          }
        });
        return selected;
      }
      return [key, value];
    });
  }
  
  toObject() {
    return Object.fromEntries(this.results);
  }
  
  toArray() {
    return this.results;
  }
  
  count() {
    return this.results.length;
  }
}

// Usage
Storage.set('user1', { name: 'Alice', age: 30, role: 'admin' });
Storage.set('user2', { name: 'Bob', age: 25, role: 'user' });
Storage.set('user3', { name: 'Charlie', age: 35, role: 'admin' });
Storage.set('user4', { name: 'David', age: 28, role: 'user' });

// Query: Get admins, order by age, limit 2
const admins = new StorageQuery(Storage)
  .where((key, value) => key.startsWith('user') && value.role === 'admin')
  .orderBy('age', 'desc')
  .limit(2)
  .select(['name', 'age']);

console.log(admins);
// [
//   { _key: 'user3', name: 'Charlie', age: 35 },
//   { _key: 'user1', name: 'Alice', age: 30 }
// ]

// Query: Count users under 30
const youngUsers = new StorageQuery(Storage)
  .where((key, value) => value && value.age < 30)
  .count();

console.log(youngUsers); // 2
```

### Storage Validator

```javascript
class StorageValidator {
  constructor(storage) {
    this.storage = storage;
    this.errors = [];
  }
  
  validate(rules) {
    this.errors = [];
    
    this.storage.entries().forEach(([key, value]) => {
      if (rules.keyPattern && !rules.keyPattern.test(key)) {
        this.errors.push({
          key,
          error: 'Invalid key pattern',
          rule: 'keyPattern'
        });
      }
      
      if (rules.valueType) {
        const expectedType = rules.valueType;
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        
        if (actualType !== expectedType) {
          this.errors.push({
            key,
            error: `Expected ${expectedType}, got ${actualType}`,
            rule: 'valueType'
          });
        }
      }
      
      if (rules.required) {
        if (value === null || value === undefined || value === '') {
          this.errors.push({
            key,
            error: 'Required value is missing',
            rule: 'required'
          });
        }
      }
      
      if (rules.custom && typeof rules.custom === 'function') {
        const result = rules.custom(key, value);
        if (result !== true) {
          this.errors.push({
            key,
            error: result || 'Custom validation failed',
            rule: 'custom'
          });
        }
      }
    });
    
    return this.errors.length === 0;
  }
  
  getErrors() {
    return this.errors;
  }
  
  isValid() {
    return this.errors.length === 0;
  }
}

// Usage
const validator = new StorageValidator(Storage.namespace('config'));

const isValid = validator.validate({
  keyPattern: /^[a-z_]+$/,
  valueType: 'string',
  custom: (key, value) => {
    if (value.length < 3) {
      return 'Value must be at least 3 characters';
    }
    return true;
  }
});

if (!isValid) {
  console.log('Validation errors:', validator.getErrors());
}
```

### Storage Migrator

```javascript
class StorageMigrator {
  constructor(storage) {
    this.storage = storage;
    this.migrations = [];
  }
  
  addMigration(name, up, down) {
    this.migrations.push({ name, up, down });
  }
  
  async migrate() {
    const currentVersion = this.storage.get('_version', 0);
    
    for (let i = currentVersion; i < this.migrations.length; i++) {
      const migration = this.migrations[i];
      
      console.log(`Running migration: ${migration.name}`);
      
      try {
        await migration.up(this.storage);
        this.storage.set('_version', i + 1);
        console.log(`✓ Migration ${migration.name} completed`);
      } catch (error) {
        console.error(`✗ Migration ${migration.name} failed:`, error);
        throw error;
      }
    }
  }
  
  async rollback(steps = 1) {
    const currentVersion = this.storage.get('_version', 0);
    
    for (let i = currentVersion - 1; i >= currentVersion - steps && i >= 0; i--) {
      const migration = this.migrations[i];
      
      console.log(`Rolling back: ${migration.name}`);
      
      try {
        await migration.down(this.storage);
        this.storage.set('_version', i);
        console.log(`✓ Rollback ${migration.name} completed`);
      } catch (error) {
        console.error(`✗ Rollback ${migration.name} failed:`, error);
        throw error;
      }
    }
  }
}

// Usage
const migrator = new StorageMigrator(Storage);

// Add migrations
migrator.addMigration(
  'add_user_roles',
  async (storage) => {
    // Upgrade: Add role to all users
    storage.entries()
      .filter(([key]) => key.startsWith('user_'))
      .forEach(([key, user]) => {
        user.role = user.role || 'user';
        storage.set(key, user);
      });
  },
  async (storage) => {
    // Downgrade: Remove role from all users
    storage.entries()
      .filter(([key]) => key.startsWith('user_'))
      .forEach(([key, user]) => {
        delete user.role;
        storage.set(key, user);
      });
  }
);

migrator.addMigration(
  'rename_config_keys',
  async (storage) => {
    // Upgrade: Rename old keys
    const entries = storage.entries();
    entries.forEach(([key, value]) => {
      if (key.startsWith('old_')) {
        const newKey = key.replace('old_', 'new_');
        storage.set(newKey, value);
        storage.remove(key);
      }
    });
  },
  async (storage) => {
    // Downgrade: Rename back
    const entries = storage.entries();
    entries.forEach(([key, value]) => {
      if (key.startsWith('new_')) {
        const oldKey = key.replace('new_', 'old_');
        storage.set(oldKey, value);
        storage.remove(key);
      }
    });
  }
);

// Run migrations
await migrator.migrate();
```

---

## Performance Considerations

### Efficient Iteration

```javascript
// ❌ Bad: Multiple iterations
const keys = Storage.keys();
const values = Storage.values();
const count = Storage.size();

// ✅ Good: Single iteration
const entries = Storage.entries();
const keys = entries.map(([key]) => key);
const values = entries.map(([, value]) => value);
const count = entries.length;
```

### Caching Results

```javascript
class CachedStorage {
  constructor(namespace) {
    this.storage = Storage.namespace(namespace);
    this.cache = null;
    this.cacheTime = 0;
    this.ttl = 1000; // 1 second
  }
  
  entries() {
    const now = Date.now();
    
    if (!this.cache || (now - this.cacheTime) > this.ttl) {
      this.cache = this.storage.entries();
      this.cacheTime = now;
    }
    
    return this.cache;
  }
  
  keys() {
    return this.entries().map(([key]) => key);
  }
  
  values() {
    return this.entries().map(([, value]) => value);
  }
  
  size() {
    return this.entries().length;
  }
  
  invalidate() {
    this.cache = null;
  }
}

// Usage
const cached = new CachedStorage('app');

// First call: reads from storage
const keys1 = cached.keys(); // Slow

// Second call within 1 second: uses cache
const keys2 = cached.keys(); // Fast!

// After modification
Storage.namespace('app').set('newKey', 'value');
cached.invalidate(); // Clear cache
const keys3 = cached.keys(); // Reads fresh data
```

### Lazy Loading

```javascript
class LazyStorageView {
  constructor(storage) {
    this.storage = storage;
    this._keys = null;
    this._values = null;
    this._entries = null;
  }
  
  keys() {
    if (!this._keys) {
      this._keys = this.storage.keys();
    }
    return this._keys;
  }
  
  values() {
    if (!this._values) {
      this._values = this.storage.values();
    }
    return this._values;
  }
  
  entries() {
    if (!this._entries) {
      this._entries = this.storage.entries();
    }
    return this._entries;
  }
  
  refresh() {
    this._keys = null;
    this._values = null;
    this._entries = null;
  }
}

// Usage
const view = new LazyStorageView(Storage);

// Only loads what you need
const keys = view.keys(); // Keys loaded
// Values and entries not loaded yet

const values = view.values(); // Now values loaded
```

---

## Best Practices

### 1. Use Appropriate Method

```javascript
// ✅ Good: Use size() for counting
if (Storage.size() > 100) {
  console.log('Storage is full');
}

// ❌ Bad: Unnecessary array creation
if (Storage.keys().length > 100) {
  console.log('Storage is full');
}
```

### 2. Filter Early

```javascript
// ✅ Good: Filter during iteration
const userKeys = Storage.keys().filter(k => k.startsWith('user_'));

// ❌ Bad: Get all, then filter
const allEntries = Storage.entries();
const userEntries = allEntries.filter(([k]) => k.startsWith('user_'));
```

### 3. Use Namespace for Organization

```javascript
// ✅ Good: Separate namespaces
const users = Storage.namespace('users');
const posts = Storage.namespace('posts');

console.log(`Users: ${users.size()}`);
console.log(`Posts: ${posts.size()}`);

// ❌ Bad: Mixed in global
const allKeys = Storage.keys();
const userKeys = allKeys.filter(k => k.startsWith('user_'));
const postKeys = allKeys.filter(k => k.startsWith('post_'));
```

### 4. Cache When Appropriate

```javascript
// ✅ Good: Cache for multiple operations
const entries = Storage.entries();
const keys = entries.map(([k]) => k);
const values = entries.map(([, v]) => v);
const count = entries.length;

// ❌ Bad: Multiple storage reads
const keys = Storage.keys();
const values = Storage.values();
const count = Storage.size();
```

### 5. Handle Empty Storage

```javascript
// ✅ Good: Check before processing
if (Storage.size() > 0) {
  const entries = Storage.entries();
  processEntries(entries);
} else {
  console.log('No data to process');
}

// ❌ Bad: No check
const entries = Storage.entries();
entries.forEach(processEntry); // Works but unnecessary if empty
```

---

## Comparison with Native API

### Getting All Keys

```javascript
// ==================== NATIVE ====================
const nativeKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  nativeKeys.push(localStorage.key(i));
}
console.log(nativeKeys);

// ==================== DOM HELPERS ====================
const keys = Storage.keys();
console.log(keys);
```

### Getting All Values

```javascript
// ==================== NATIVE ====================
const nativeValues = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  try {
    nativeValues.push(JSON.parse(value));
  } catch {
    nativeValues.push(value);
  }
}

// ==================== DOM HELPERS ====================
const values = Storage.values();
// Already parsed and typed!
```

### Getting All Entries

```javascript
// ==================== NATIVE ====================
const nativeEntries = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  try {
    nativeEntries.push([key, JSON.parse(value)]);
  } catch {
    nativeEntries.push([key, value]);
  }
}

// ==================== DOM HELPERS ====================
const entries = Storage.entries();
```

### Counting Items

```javascript
// ==================== NATIVE ====================
const nativeCount = localStorage.length;

// ==================== DOM HELPERS ====================
const count = Storage.size();
// Excludes expired items automatically!
```

---

## Real-World Use Cases

### Use Case 1: Storage Dashboard

```javascript
function createStorageDashboard() {
  const dashboard = {
    global: {
      count: Storage.size(),
      keys: Storage.keys(),
      sizeKB: (JSON.stringify(Storage.values()).length / 1024).toFixed(2)
    },
    namespaces: {}
  };
  
  // Detect namespaces
  const allKeys = Storage.keys();
  const namespaces = new Set(
    allKeys
      .filter(k => k.includes(':'))
      .map(k => k.split(':')[0])
  );
  
  namespaces.forEach(ns => {
    const storage = Storage.namespace(ns);
    dashboard.namespaces[ns] = {
      count: storage.size(),
      keys: storage.keys(),
      sizeKB: (JSON.stringify(storage.values()).length / 1024).toFixed(2)
    };
  });
  
  return dashboard;
}

// Usage
console.table(createStorageDashboard());
```

### Use Case 2: Storage Search

```javascript
function searchStorage(query) {
  query = query.toLowerCase();
  const results = [];
  
  Storage.entries().forEach(([key, value]) => {
    // Search in key
    if (key.toLowerCase().includes(query)) {
      results.push({
        key,
        value,
        matchType: 'key'
      });
      return;
    }
    
    // Search in value (if string)
    if (typeof value === 'string' && value.toLowerCase().includes(query)) {
      results.push({
        key,
        value,
        matchType: 'value'
      });
      return;
    }
    
    // Search in object properties
    if (typeof value === 'object' && value !== null) {
      const jsonStr = JSON.stringify(value).toLowerCase();
      if (jsonStr.includes(query)) {
        results.push({
          key,
          value,
          matchType: 'object'
        });
      }
    }
  });
  
  return results;
}

// Usage
const results = searchStorage('alice');
console.log(results);
// [
//   { key: 'user_name', value: 'Alice', matchType: 'value' },
//   { key: 'user_profile', value: {...}, matchType: 'object' }
// ]
```

### Use Case 3: Storage Backup & Restore

```javascript
class StorageBackup {
  backup(namespace = null) {
    const storage = namespace ? Storage.namespace(namespace) : Storage;
    
    return {
      timestamp: new Date().toISOString(),
      namespace: namespace || 'global',
      version: '1.0',
      count: storage.size(),
      data: Object.fromEntries(storage.entries())
    };
  }
  
  restore(backup, namespace = null) {
    const storage = namespace ? Storage.namespace(namespace) : Storage;
    
    if (backup.version !== '1.0') {
      throw new Error('Unsupported backup version');
    }
    
    // Clear existing data
    storage.clear();
    
    // Restore data
    Object.entries(backup.data).forEach(([key, value]) => {
      storage.set(key, value);
    });
    
    return storage.size();
  }
  
  export() {
    const backups = {
      global: this.backup()
    };
    
    // Detect and backup all namespaces
    const allKeys = Storage.keys();
    const namespaces = new Set(
      allKeys
        .filter(k => k.includes(':'))
        .map(k => k.split(':')[0])
    );
    
    namespaces.forEach(ns => {
      backups[ns] = this.backup(ns);
    });
    
    return backups;
  }
  
  download(filename = 'storage-backup.json') {
    const data = this.export();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// Usage
const backup = new StorageBackup();

// Create backup
const data = backup.backup();
console.log(`Backed up ${data.count} items`);

// Restore backup
backup.restore(data);

// Download all data
backup.download('my-storage-backup.json');
```

---

## Summary

The **Iteration & Inspection** methods provide powerful tools for examining and working with storage:

| Method | Returns | Purpose |
|--------|---------|---------|
| `keys()` | `Array<string>` | Get all storage keys |
| `values()` | `Array<any>` | Get all storage values |
| `entries()` | `Array<[string, any]>` | Get all key-value pairs |
| `size()` | `number` | Get count of items |

**Key Benefits:**

✅ **Namespace Aware** - All methods respect namespace boundaries  
✅ **Expiry Handling** - Automatically excludes expired items  
✅ **Type Preservation** - Values maintain original types  
✅ **Array Methods** - Easy to use with map, filter, reduce  
✅ **Performance** - Optimized for efficiency  

Use these methods to build powerful storage management, debugging, and analysis tools!