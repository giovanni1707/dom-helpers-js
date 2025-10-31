[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers Storage Module - Complete Method Reference

## 🗄️ Storage Object (Main API)

### Basic Operations (Shorthand API)
- `Storage.set(key, value, options)` - Set a value with optional expiry
- `Storage.get(key, defaultValue)` - Get a value with optional default
- `Storage.remove(key)` - Remove a value
- `Storage.has(key)` - Check if key exists
- `Storage.clear()` - Clear all storage (respects namespace)

### Vanilla-like API (Alternative Syntax)
- `Storage.setItem(key, value, options)` - Alias for `set()`
- `Storage.getItem(key, defaultValue)` - Alias for `get()`
- `Storage.removeItem(key)` - Alias for `remove()`

### Bulk Operations
- `Storage.setMultiple(obj, options)` - Set multiple key-value pairs
- `Storage.getMultiple(keys, defaultValue)` - Get multiple values
- `Storage.removeMultiple(keys)` - Remove multiple keys

### Advanced Operations
- `Storage.increment(key, amount)` - Increment numeric value (default +1)
- `Storage.decrement(key, amount)` - Decrement numeric value (default -1)
- `Storage.toggle(key)` - Toggle boolean value

### Collection Methods
- `Storage.keys()` - Get all keys (respects namespace)
- `Storage.values()` - Get all values
- `Storage.entries()` - Get key-value pairs as array

### Information & Utilities
- `Storage.size()` - Get number of items
- `Storage.stats()` - Get storage statistics (combined local + session)
- `Storage.cleanup()` - Remove expired items (both local and session)

### Namespace Management
- `Storage.namespace(name)` - Create namespaced storage instance
- `Storage.local` - Access localStorage directly
- `Storage.session` - Access sessionStorage directly

---

## 📦 Storage.session (Session Storage)

All the same methods as the main Storage object, but uses sessionStorage:

### Basic Operations
- `Storage.session.set(key, value, options)`
- `Storage.session.get(key, defaultValue)`
- `Storage.session.remove(key)`
- `Storage.session.has(key)`
- `Storage.session.clear()`

### Vanilla-like API
- `Storage.session.setItem(key, value, options)`
- `Storage.session.getItem(key, defaultValue)`
- `Storage.session.removeItem(key)`

### Bulk Operations
- `Storage.session.setMultiple(obj, options)`
- `Storage.session.getMultiple(keys, defaultValue)`
- `Storage.session.removeMultiple(keys)`

### Advanced Operations
- `Storage.session.increment(key, amount)`
- `Storage.session.decrement(key, amount)`
- `Storage.session.toggle(key)`

### Collection Methods
- `Storage.session.keys()`
- `Storage.session.values()`
- `Storage.session.entries()`

### Information & Utilities
- `Storage.session.size()`
- `Storage.session.stats()`
- `Storage.session.cleanup()`
- `Storage.session.namespace(name)`

---

## 🏷️ Namespaced Storage Instance

Created via `Storage.namespace('myNamespace')` or `Storage.session.namespace('myNamespace')`:

### All Standard Methods Available
- `.set(key, value, options)`
- `.get(key, defaultValue)`
- `.remove(key)`
- `.has(key)`
- `.clear()` - Clears only items in this namespace
- `.setItem(key, value, options)`
- `.getItem(key, defaultValue)`
- `.removeItem(key)`
- `.setMultiple(obj, options)`
- `.getMultiple(keys, defaultValue)`
- `.removeMultiple(keys)`
- `.increment(key, amount)`
- `.decrement(key, amount)`
- `.toggle(key)`
- `.keys()` - Returns only keys in this namespace
- `.values()`
- `.entries()`
- `.size()`
- `.stats()`
- `.cleanup()`
- `.namespace(name)` - Create nested namespace

---

## 📝 Form Storage Integration

When a form is accessed through the Forms helper, it gains these storage methods:

### Form Auto-Save Methods
- `form.autoSave(storageKey, options)` - Enable auto-save for form
  ```javascript
  // Options:
  {
    storage: 'localStorage' | 'sessionStorage',
    interval: 1000, // debounce delay in ms
    events: ['input', 'change'], // events to trigger save
    namespace: '', // optional namespace
    expires: 3600 // optional expiry in seconds
  }
  ```

- `form.restore(storageKey, options)` - Restore form from storage
  ```javascript
  // Options:
  {
    storage: 'localStorage' | 'sessionStorage',
    namespace: '',
    clearAfterRestore: false // remove from storage after restore
  }
  ```

- `form.clearAutoSave()` - Clear auto-save timer and stored data

### Form Storage Integration Properties
- `form._autoSaveKey` - Stored key for auto-save
- `form._autoSaveStorage` - Storage helper instance
- `form._autoSaveTimeout` - Timeout reference
- `form._hasStorageIntegration` - Flag indicating integration is active

---

## 🛠️ StorageHelper Class

If you need to create custom storage instances:

```javascript
const customStorage = new StorageHelper('localStorage', 'myNamespace');
```

### Constructor
- `new StorageHelper(storageType, namespace)` - Create storage instance
  - `storageType`: `'localStorage'` or `'sessionStorage'`
  - `namespace`: Optional namespace prefix

### All Instance Methods
Same as the main Storage object methods listed above.

---

## ⚙️ Storage Options Object

Used in `set()`, `setItem()`, `setMultiple()`, `autoSave()`:

```javascript
{
  expires: 3600, // Expiry in seconds (number)
  expires: new Date('2025-12-31'), // Expiry as Date object
}
```

---

## 📊 Statistics Object

Returned by `Storage.stats()`:

```javascript
{
  local: {
    keys: 10,
    totalSize: 5000,
    averageSize: 500,
    namespace: 'global',
    storageType: 'localStorage'
  },
  session: {
    keys: 5,
    totalSize: 2000,
    averageSize: 400,
    namespace: 'global',
    storageType: 'sessionStorage'
  }
}
```

For namespaced instances, `stats()` returns a single object:
```javascript
{
  keys: 10,
  totalSize: 5000,
  averageSize: 500,
  namespace: 'myNamespace',
  storageType: 'localStorage'
}
```

---

## 🔄 Cleanup Results

Returned by `Storage.cleanup()`:

```javascript
{
  local: 5,  // number of expired items removed from localStorage
  session: 3 // number of expired items removed from sessionStorage
}
```

For namespaced instances, returns a number:
```javascript
5 // number of expired items removed
```

---

## 🌐 Integration with DOMHelpers

If the main DOMHelpers object is available:

- `DOMHelpers.Storage` - Main Storage object
- `DOMHelpers.StorageHelper` - StorageHelper class

---

## 📋 Complete Example Usage

```javascript
// Basic usage
Storage.set('username', 'John');
Storage.get('username'); // 'John'

// With expiry (expires in 1 hour)
Storage.set('token', 'abc123', { expires: 3600 });

// Namespaced storage
const userStorage = Storage.namespace('user');
userStorage.set('preferences', { theme: 'dark' });

// Session storage
Storage.session.set('tempData', { foo: 'bar' });

// Form auto-save
Forms.loginForm.autoSave('login-draft', {
  storage: 'sessionStorage',
  interval: 2000
});

// Restore form
Forms.loginForm.restore('login-draft', {
  clearAfterRestore: true
});

// Bulk operations
Storage.setMultiple({
  name: 'Alice',
  age: 30,
  city: 'NYC'
});

// Advanced operations
Storage.increment('pageViews');
Storage.toggle('darkMode');

// Cleanup expired items
Storage.cleanup(); // { local: 3, session: 1 }

// Get statistics
Storage.stats();
```

---

**Total Methods: 60+** across all storage types and integrations! 🎉