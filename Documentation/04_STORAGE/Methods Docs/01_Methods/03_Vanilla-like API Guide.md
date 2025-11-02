# DOM Helpers Storage - Vanilla-like API Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Why Vanilla-like API?](#why-vanilla-like-api)
3. [API Compatibility](#api-compatibility)
4. [Vanilla-like Methods](#vanilla-like-methods)
   - [setItem() - Store Values](#setitem---store-values)
   - [getItem() - Retrieve Values](#getitem---retrieve-values)
   - [removeItem() - Delete Values](#removeitem---delete-values)
5. [Comparison with Native API](#comparison-with-native-api)
6. [Migration Guide](#migration-guide)
7. [Mixed API Usage](#mixed-api-usage)
8. [Practical Examples](#practical-examples)
9. [Best Practices](#best-practices)
10. [Interoperability](#interoperability)

---

## Introduction

The **Vanilla-like API** provides familiar method names that match the native Web Storage API (`localStorage` and `sessionStorage`). These are **aliases** for the shorthand methods, making DOM Helpers Storage a drop-in replacement for native storage with enhanced features.

### Key Features

- ✅ **Drop-in Replacement** - Same method names as native storage
- ✅ **Enhanced Functionality** - All DOM Helpers features work
- ✅ **Easy Migration** - Minimal code changes required
- ✅ **Familiar Syntax** - Use what you already know
- ✅ **100% Compatible** - Works exactly like shorthand API

---

## Why Vanilla-like API?

### Familiarity

If you're used to native storage:

```javascript
// Native localStorage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');
```

DOM Helpers Storage provides the same interface:

```javascript
// DOM Helpers Storage
Storage.setItem('key', 'value');
const value = Storage.getItem('key');
Storage.removeItem('key');
```

### Easy Migration

Convert existing code with minimal changes:

```javascript
// Before: Native storage
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));

// After: DOM Helpers Storage (no JSON needed!)
Storage.setItem('user', { name: 'Alice' });
const user = Storage.getItem('user');
```

### Team Consistency

Teams familiar with native APIs can adopt DOM Helpers Storage without learning new method names.

---

## API Compatibility

### Method Mapping

| Native API | DOM Helpers (Vanilla) | DOM Helpers (Shorthand) |
|------------|----------------------|-------------------------|
| `setItem(key, value)` | `setItem(key, value, options)` | `set(key, value, options)` |
| `getItem(key)` | `getItem(key, defaultValue)` | `get(key, defaultValue)` |
| `removeItem(key)` | `removeItem(key)` | `remove(key)` |
| `clear()` | `clear()` | `clear()` |
| `key(index)` | N/A | `keys()` (returns array) |
| `length` | N/A | `size()` (returns count) |

### Enhanced Over Native

DOM Helpers adds these improvements:

✅ **Automatic Serialization** - No manual `JSON.stringify/parse`  
✅ **Type Preservation** - Numbers, booleans, objects stay typed  
✅ **Expiry System** - Time-based storage  
✅ **Default Values** - Fallback when key doesn't exist  
✅ **Namespacing** - Organized storage  
✅ **Better Error Handling** - Returns boolean instead of throwing  

---

## Vanilla-like Methods

### `setItem()` - Store Values

Store a value in storage using the familiar `setItem` method name.

#### Syntax

```javascript
storage.setItem(key, value, options)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key identifier |
| `value` | any | ✅ Yes | Value to store (any JSON-serializable type) |
| `options` | object | ❌ No | Configuration options (DOM Helpers enhancement) |
| `options.expires` | number\|Date | ❌ No | Expiry time in seconds or Date object |

#### Returns

`boolean` - `true` if successful, `false` if failed

> **Note:** Native `localStorage.setItem()` returns `undefined` and throws errors. DOM Helpers returns `boolean` for safer error handling.

#### Examples

**Basic Usage (Native-style):**

```javascript
// Exactly like native localStorage
Storage.setItem('username', 'Alice');
Storage.setItem('count', '42'); // Note: still stored as string in native

// But with DOM Helpers, types are preserved!
Storage.setItem('count', 42); // Stored as number
console.log(typeof Storage.getItem('count')); // 'number'
```

**With Objects (Enhanced):**

```javascript
// Native way: Manual serialization required
localStorage.setItem('user', JSON.stringify({ name: 'Alice', age: 30 }));

// DOM Helpers way: Automatic serialization
Storage.setItem('user', { name: 'Alice', age: 30 });

// Retrieve without parsing
const user = Storage.getItem('user');
console.log(user.name); // 'Alice'
```

**With Expiry (DOM Helpers Feature):**

```javascript
// Not possible with native storage!
// DOM Helpers adds expiry support
Storage.setItem('tempToken', 'abc123', { expires: 3600 }); // 1 hour

// After 1 hour, automatically removed
setTimeout(() => {
  console.log(Storage.getItem('tempToken')); // null
}, 3700000);
```

**With Arrays:**

```javascript
// Native: Manual serialization
localStorage.setItem('tags', JSON.stringify(['js', 'storage', 'api']));

// DOM Helpers: Automatic
Storage.setItem('tags', ['js', 'storage', 'api']);

const tags = Storage.getItem('tags');
console.log(Array.isArray(tags)); // true
```

**Type Preservation:**

```javascript
// Numbers
Storage.setItem('price', 19.99);
console.log(typeof Storage.getItem('price')); // 'number'

// Booleans
Storage.setItem('isActive', true);
console.log(typeof Storage.getItem('isActive')); // 'boolean'

// Objects
Storage.setItem('config', { theme: 'dark' });
console.log(typeof Storage.getItem('config')); // 'object'

// Arrays
Storage.setItem('items', [1, 2, 3]);
console.log(Array.isArray(Storage.getItem('items'))); // true
```

**Equivalent to `set()`:**

```javascript
// These are exactly the same:
Storage.setItem('key', 'value');
Storage.set('key', 'value');

// Both support options:
Storage.setItem('key', 'value', { expires: 300 });
Storage.set('key', 'value', { expires: 300 });
```

**Error Handling:**

```javascript
// Native way: Try-catch required
try {
  localStorage.setItem('key', 'value');
} catch (error) {
  console.error('Storage failed:', error);
}

// DOM Helpers way: Boolean return
const success = Storage.setItem('key', 'value');
if (!success) {
  console.error('Storage failed');
}
```

**Namespace Support:**

```javascript
const userStorage = Storage.namespace('user');

// Vanilla-like API works with namespaces
userStorage.setItem('profile', { name: 'Alice' });
userStorage.setItem('preferences', { theme: 'dark' });

// Stored as 'user:profile' and 'user:preferences'
```

---

### `getItem()` - Retrieve Values

Retrieve a value from storage using the familiar `getItem` method name.

#### Syntax

```javascript
storage.getItem(key, defaultValue)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key to retrieve |
| `defaultValue` | any | ❌ No | Value to return if key doesn't exist (DOM Helpers enhancement) |

#### Returns

`any` - The stored value, `defaultValue` if provided and key doesn't exist, or `null` if neither

> **Note:** Native `localStorage.getItem()` always returns a string or `null`. DOM Helpers preserves the original data type.

#### Examples

**Basic Usage (Native-style):**

```javascript
// Set and get
Storage.setItem('username', 'Alice');
const username = Storage.getItem('username');
console.log(username); // 'Alice'
```

**Non-Existent Keys:**

```javascript
// Native behavior: Returns null
const missing = Storage.getItem('nonExistent');
console.log(missing); // null

// DOM Helpers enhancement: Default values
const theme = Storage.getItem('theme', 'light');
console.log(theme); // 'light' (default)
```

**No JSON Parsing Needed:**

```javascript
// Native way: Manual parsing
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

// DOM Helpers way: Automatic deserialization
const user = Storage.getItem('user');
// Already an object, no parsing needed!
```

**Type Preservation:**

```javascript
Storage.setItem('count', 42);
Storage.setItem('isActive', true);
Storage.setItem('items', ['a', 'b', 'c']);

// Types preserved
console.log(typeof Storage.getItem('count'));    // 'number'
console.log(typeof Storage.getItem('isActive')); // 'boolean'
console.log(Array.isArray(Storage.getItem('items'))); // true

// Compare to native (always strings):
localStorage.setItem('count', '42');
console.log(typeof localStorage.getItem('count')); // 'string'
```

**Default Values (Enhanced):**

```javascript
// Not available in native storage!
// DOM Helpers enhancement

// String default
const name = Storage.getItem('userName', 'Guest');

// Number default
const count = Storage.getItem('pageViews', 0);

// Object default
const settings = Storage.getItem('userSettings', {
  theme: 'light',
  language: 'en'
});

// Array default
const tags = Storage.getItem('tags', []);
```

**Expired Items:**

```javascript
// Store with 5-second expiry
Storage.setItem('temp', 'value', { expires: 5 });

// Within 5 seconds
console.log(Storage.getItem('temp')); // 'value'

// After 5 seconds
setTimeout(() => {
  console.log(Storage.getItem('temp')); // null (auto-removed)
}, 6000);
```

**Equivalent to `get()`:**

```javascript
// These are exactly the same:
Storage.getItem('key');
Storage.get('key');

// With default values:
Storage.getItem('key', 'default');
Storage.get('key', 'default');
```

**Complex Objects:**

```javascript
Storage.setItem('user', {
  id: 123,
  name: 'Alice',
  email: 'alice@example.com',
  settings: {
    theme: 'dark',
    notifications: true
  }
});

// Retrieve and use directly
const user = Storage.getItem('user');
console.log(user.settings.theme); // 'dark'
console.log(user.settings.notifications); // true
```

**Safe Access Pattern:**

```javascript
// With default value
const user = Storage.getItem('user', {});
const userName = user.name || 'Anonymous';

// Or with optional chaining
const theme = Storage.getItem('user')?.settings?.theme ?? 'light';
```

---

### `removeItem()` - Delete Values

Remove a value from storage using the familiar `removeItem` method name.

#### Syntax

```javascript
storage.removeItem(key)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key to remove |

#### Returns

`boolean` - `true` if successful, `false` if failed

> **Note:** Native `localStorage.removeItem()` returns `undefined`. DOM Helpers returns `boolean` for better error handling.

#### Examples

**Basic Usage (Native-style):**

```javascript
// Set a value
Storage.setItem('username', 'Alice');

// Remove it
Storage.removeItem('username');

// Verify removal
console.log(Storage.getItem('username')); // null
```

**Removing Non-Existent Keys:**

```javascript
// Safe to remove non-existent keys
Storage.removeItem('nonExistent'); // No error

// Native behavior is the same
localStorage.removeItem('nonExistent'); // No error
```

**Logout Flow:**

```javascript
function logout() {
  // Remove authentication data
  Storage.removeItem('authToken');
  Storage.removeItem('refreshToken');
  Storage.removeItem('userId');
  Storage.removeItem('userRole');
  
  // Redirect
  window.location.href = '/login';
}
```

**Clear Specific Data:**

```javascript
function clearUserData() {
  const keysToRemove = [
    'userData',
    'userPreferences',
    'userSettings',
    'lastLogin'
  ];
  
  keysToRemove.forEach(key => {
    Storage.removeItem(key);
  });
}
```

**Equivalent to `remove()`:**

```javascript
// These are exactly the same:
Storage.removeItem('key');
Storage.remove('key');

// Both work with namespaces:
const appStorage = Storage.namespace('app');
appStorage.removeItem('cache');
appStorage.remove('cache'); // Same thing
```

**Conditional Removal:**

```javascript
// Remove if expired (manual check)
function removeIfExpired(key, maxAge) {
  const item = Storage.getItem(key);
  if (item && item.timestamp) {
    const age = Date.now() - item.timestamp;
    if (age > maxAge) {
      Storage.removeItem(key);
      return true;
    }
  }
  return false;
}

// Usage
removeIfExpired('cachedData', 300000); // Remove if older than 5 minutes
```

**Remove After Read:**

```javascript
function getAndRemove(key) {
  const value = Storage.getItem(key);
  if (value !== null) {
    Storage.removeItem(key);
  }
  return value;
}

// Usage: One-time messages
const flashMessage = getAndRemove('flashMessage');
if (flashMessage) {
  showNotification(flashMessage);
}
```

**Namespace Support:**

```javascript
const cacheStorage = Storage.namespace('cache');

cacheStorage.setItem('users', userData);
cacheStorage.setItem('posts', postData);

// Remove from namespace
cacheStorage.removeItem('users');

// Global storage unaffected
console.log(Storage.getItem('users')); // null (different namespace)
```

**Error Handling:**

```javascript
// Native: No return value
localStorage.removeItem('key');
// Can't tell if it succeeded

// DOM Helpers: Boolean return
const success = Storage.removeItem('key');
if (success) {
  console.log('Item removed successfully');
} else {
  console.log('Failed to remove item');
}
```

---

## Comparison with Native API

### Side-by-Side Comparison

#### Storing Data

```javascript
// ==================== NATIVE ====================
// Store string
localStorage.setItem('name', 'Alice');

// Store number (becomes string!)
localStorage.setItem('age', '30');

// Store object (manual serialization)
localStorage.setItem('user', JSON.stringify({
  name: 'Alice',
  age: 30
}));

// Store array (manual serialization)
localStorage.setItem('tags', JSON.stringify(['js', 'api']));

// ==================== DOM HELPERS ====================
// Store string
Storage.setItem('name', 'Alice');

// Store number (stays number!)
Storage.setItem('age', 30);

// Store object (automatic serialization)
Storage.setItem('user', {
  name: 'Alice',
  age: 30
});

// Store array (automatic serialization)
Storage.setItem('tags', ['js', 'api']);

// BONUS: Add expiry (not possible with native)
Storage.setItem('tempData', 'value', { expires: 300 });
```

#### Retrieving Data

```javascript
// ==================== NATIVE ====================
// Get string
const name = localStorage.getItem('name'); // 'Alice'

// Get number (still a string!)
const age = localStorage.getItem('age'); // '30' (string)
const ageNum = parseInt(age); // Need to parse

// Get object (manual parsing)
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

// Get non-existent key
const missing = localStorage.getItem('missing'); // null
// No default value support

// ==================== DOM HELPERS ====================
// Get string
const name = Storage.getItem('name'); // 'Alice'

// Get number (automatically typed)
const age = Storage.getItem('age'); // 30 (number)
// No parsing needed!

// Get object (automatic deserialization)
const user = Storage.getItem('user'); // { name: 'Alice', age: 30 }
// No parsing needed!

// Get non-existent key with default
const missing = Storage.getItem('missing', 'default'); // 'default'
```

#### Removing Data

```javascript
// ==================== NATIVE ====================
// Remove item (no return value)
localStorage.removeItem('key');

// Clear all
localStorage.clear();

// ==================== DOM HELPERS ====================
// Remove item (returns boolean)
const success = Storage.removeItem('key'); // true/false

// Clear all
Storage.clear();

// BONUS: Clear namespace only
const appStorage = Storage.namespace('app');
appStorage.clear(); // Only clears 'app' namespace
```

#### Checking Existence

```javascript
// ==================== NATIVE ====================
// Check if key exists
const exists = localStorage.getItem('key') !== null;

// ==================== DOM HELPERS ====================
// Check if key exists (cleaner)
const exists = Storage.has('key'); // true/false

// BONUS: Automatically handles expired items
Storage.setItem('temp', 'value', { expires: 5 });
setTimeout(() => {
  console.log(Storage.has('temp')); // false (expired)
}, 6000);
```

### Feature Comparison Table

| Feature | Native Storage | DOM Helpers (Vanilla API) |
|---------|---------------|---------------------------|
| **Basic storage** | ✅ Yes | ✅ Yes |
| **Type preservation** | ❌ No (strings only) | ✅ Yes |
| **Auto serialization** | ❌ No | ✅ Yes |
| **Expiry system** | ❌ No | ✅ Yes |
| **Default values** | ❌ No | ✅ Yes |
| **Namespacing** | ❌ No | ✅ Yes |
| **Boolean returns** | ❌ No | ✅ Yes |
| **Error handling** | ⚠️ Throws | ✅ Returns false |
| **Cleanup utilities** | ❌ No | ✅ Yes |
| **Statistics** | ❌ No | ✅ Yes |

---

## Migration Guide

### Step 1: Replace `localStorage` with `Storage`

```javascript
// Before
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');

// After
Storage.setItem('key', 'value');
const value = Storage.getItem('key');
Storage.removeItem('key');
```

### Step 2: Remove Manual JSON Handling

```javascript
// Before
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

// After
Storage.setItem('user', { name: 'Alice' });
const user = Storage.getItem('user'); // Already an object!
```

### Step 3: Add Default Values

```javascript
// Before
const theme = localStorage.getItem('theme');
if (!theme) {
  theme = 'light'; // Default
}

// After
const theme = Storage.getItem('theme', 'light'); // Cleaner!
```

### Step 4: Use Namespaces for Organization

```javascript
// Before
localStorage.setItem('auth_token', 'abc');
localStorage.setItem('auth_refresh', 'xyz');
localStorage.setItem('cache_users', userData);

// After
const auth = Storage.namespace('auth');
const cache = Storage.namespace('cache');

auth.setItem('token', 'abc');
auth.setItem('refresh', 'xyz');
cache.setItem('users', userData);
```

### Step 5: Add Expiry Where Needed

```javascript
// Before (no expiry possible)
localStorage.setItem('tempData', 'value');
// Must manually check and remove later

// After
Storage.setItem('tempData', 'value', { expires: 300 }); // 5 minutes
// Automatically removed after expiry
```

### Complete Migration Example

**Before (Native):**

```javascript
// Authentication
function login(credentials) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  });
}

function getUser() {
  const userStr = localStorage.getItem('userData');
  return userStr ? JSON.parse(userStr) : null;
}

function isAuthenticated() {
  return localStorage.getItem('authToken') !== null;
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userData');
  window.location.href = '/login';
}
```

**After (DOM Helpers):**

```javascript
// Authentication with namespace
const auth = Storage.namespace('auth');

function login(credentials) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(data => {
    // Auto-serialization, type preservation, expiry
    auth.setItem('token', data.token, { expires: 3600 });
    auth.setItem('userId', data.userId); // Number stays number
    auth.setItem('userData', data.user); // Object stays object
    return data;
  });
}

function getUser() {
  return auth.getItem('userData'); // Already an object!
}

function isAuthenticated() {
  return auth.has('token'); // Cleaner, handles expiry
}

function logout() {
  auth.clear(); // Clear entire namespace
  window.location.href = '/login';
}
```

---

## Mixed API Usage

You can mix vanilla-like and shorthand APIs freely:

```javascript
// Vanilla-like methods
Storage.setItem('key1', 'value1');
Storage.setItem('key2', 'value2');

// Shorthand methods
Storage.set('key3', 'value3');
Storage.set('key4', 'value4');

// Mix them
Storage.setItem('key5', 'value5');
const value = Storage.get('key5'); // Works perfectly!

// They're completely interchangeable
Storage.remove('key1');
Storage.removeItem('key2');
```

### Choose Based on Preference

```javascript
// Team prefers vanilla-like
class UserManager {
  saveUser(user) {
    Storage.setItem('user', user);
  }
  
  getUser() {
    return Storage.getItem('user');
  }
  
  deleteUser() {
    Storage.removeItem('user');
  }
}

// Team prefers shorthand
class CacheManager {
  save(key, data, ttl) {
    Storage.set(key, data, { expires: ttl });
  }
  
  load(key) {
    return Storage.get(key);
  }
  
  delete(key) {
    Storage.remove(key);
  }
}

// Both work together perfectly!
```

---

## Practical Examples

### Example 1: Shopping Cart (Vanilla-like)

```javascript
const cart = Storage.namespace('cart');

function addToCart(product) {
  const items = cart.getItem('items', []);
  
  const existing = items.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  cart.setItem('items', items);
}

function getCartItems() {
  return cart.getItem('items', []);
}

function removeFromCart(productId) {
  const items = cart.getItem('items', []);
  const filtered = items.filter(item => item.id !== productId);
  cart.setItem('items', filtered);
}

function clearCart() {
  cart.removeItem('items');
}

function getCartTotal() {
  const items = getCartItems();
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}
```

### Example 2: User Sessions (Vanilla-like)

```javascript
const session = Storage.namespace('session');

function createSession(userData) {
  // Set session with 1-hour expiry
  session.setItem('user', userData, { expires: 3600 });
  session.setItem('startTime', Date.now());
  session.setItem('isActive', true);
}

function getSession() {
  return session.getItem('user');
}

function isSessionActive() {
  return session.getItem('isActive', false);
}

function extendSession() {
  const user = session.getItem('user');
  if (user) {
    // Refresh session with new expiry
    session.setItem('user', user, { expires: 3600 });
  }
}

function endSession() {
  session.removeItem('user');
  session.removeItem('startTime');
  session.removeItem('isActive');
}

function getSessionDuration() {
  const startTime = session.getItem('startTime');
  return startTime ? Date.now() - startTime : 0;
}
```

### Example 3: Theme Manager (Vanilla-like)

```javascript
const ui = Storage.namespace('ui');

const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#0d6efd'
  }
};

function setTheme(themeName) {
  if (!themes[themeName]) {
    console.error('Invalid theme:', themeName);
    return;
  }
  
  ui.setItem('theme', themeName);
  applyTheme(themeName);
}

function getTheme() {
  return ui.getItem('theme', 'light');
}

function applyTheme(themeName) {
  const theme = themes[themeName];
  Object.entries(theme).forEach(([property, value]) => {
    document.documentElement.style.setProperty(`--${property}`, value);
  });
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}

// Initialize theme
applyTheme(getTheme());
```

---

## Best Practices

### 1. Be Consistent

Choose one style for your project:

```javascript
// ✅ Good: Consistent vanilla-like
Storage.setItem('key1', 'value1');
Storage.getItem('key1');
Storage.removeItem('key1');

// ✅ Good: Consistent shorthand
Storage.set('key2', 'value2');
Storage.get('key2');
Storage.remove('key2');

// ⚠️ Okay but inconsistent
Storage.setItem('key3', 'value3');
Storage.get('key3'); // Mixed styles
```

### 2. Use Namespaces

```javascript
// ✅ Good: Organized with namespaces
const auth = Storage.namespace('auth');
auth.setItem('token', 'abc123');

// ❌ Bad: Everything in global
Storage.setItem('authToken', 'abc123');
```

### 3. Always Use Expiry for Temporary Data

```javascript
// ✅ Good: Expiry for auth tokens
Storage.setItem('authToken', token, { expires: 3600 });

// ❌ Bad: No expiry
Storage.setItem('authToken', token);
```

### 4. Provide Default Values

```javascript
// ✅ Good: Default values
const theme = Storage.getItem('theme', 'light');
const settings = Storage.getItem('settings', {});

// ❌ Bad: No defaults
const theme = Storage.getItem('theme');
if (!theme) theme = 'light'; // Extra code
```

### 5. Document Your Choice

```javascript
/**
 * Storage Manager
 * Uses vanilla-like API (setItem/getItem) for familiarity
 * with native localStorage API.
 */
class StorageManager {
  setItem(key, value, options) {
    return Storage.setItem(key, value, options);
  }
  
  getItem(key, defaultValue) {
    return Storage.getItem(key, defaultValue);
  }
  
  removeItem(key) {
    return Storage.removeItem(key);
  }
}
```

---

## Interoperability

### Works with All Storage Features

The vanilla-like API is fully compatible with all DOM Helpers Storage features:

```javascript
// Namespacing
const app = Storage.namespace('myApp');
app.setItem('config', { theme: 'dark' });
app.getItem('config'); // { theme: 'dark' }

// Session Storage
Storage.session.setItem('tempData', 'value');
Storage.session.getItem('tempData'); // 'value'

// Statistics
Storage.setItem('key1', 'value1');
Storage.setItem('key2', 'value2');
console.log(Storage.stats());

// Cleanup
Storage.setItem('temp', 'value', { expires: 5 });
setTimeout(() => Storage.cleanup(), 6000);

// Bulk operations
Storage.setMultiple({
  key1: 'value1',
  key2: 'value2'
});

// All storage methods
Storage.setItem('a', '1');
console.log(Storage.keys()); // ['a']
console.log(Storage.values()); // ['1']
console.log(Storage.entries()); // [['a', '1']]
```

---

## Summary

The **Vanilla-like API** provides familiar method names that make DOM Helpers Storage a drop-in replacement for native storage:

| Method | Purpose | Enhancement |
|--------|---------|-------------|
| `setItem()` | Store values | + Expiry, auto-serialization, type preservation |
| `getItem()` | Retrieve values | + Default values, auto-deserialization |
| `removeItem()` | Delete values | + Boolean return, namespace support |

**Key Benefits:**

✅ **Familiar Syntax** - Same method names as native storage  
✅ **Enhanced Features** - All DOM Helpers benefits included  
✅ **Easy Migration** - Minimal code changes required  
✅ **100% Compatible** - Works with all DOM Helpers features  
✅ **Your Choice** - Use vanilla-like or shorthand, or mix both!  

Choose the API style that fits your team's preference and enjoy the enhanced functionality of DOM