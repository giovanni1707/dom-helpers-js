# DOM Helpers Storage - StorageHelper Class Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Operations (Shorthand API)](#basic-operations-shorthand-api)
   - [set() - Store Values](#set---store-values)
   - [get() - Retrieve Values](#get---retrieve-values)
   - [remove() - Delete Values](#remove---delete-values)
   - [has() - Check Existence](#has---check-existence)
   - [clear() - Clear Storage](#clear---clear-storage)
4. [Complete API Reference](#complete-api-reference)
5. [Practical Examples](#practical-examples)
   - [User Authentication](#user-authentication)
   - [Shopping Cart](#shopping-cart)
   - [User Preferences](#user-preferences)
   - [Form Auto-Save](#form-auto-save)
6. [Advanced Techniques](#advanced-techniques)
7. [Common Patterns](#common-patterns)
8. [Error Handling](#error-handling)
9. [Performance Tips](#performance-tips)
10. [Best Practices](#best-practices)

---

## Introduction

The **StorageHelper Class** provides the core functionality for DOM Helpers Storage. Every storage instance (whether `Storage`, `Storage.local`, `Storage.session`, or a namespaced instance) is a `StorageHelper` object with these powerful methods.

### Key Features

- ✅ **Automatic Serialization** - Objects, arrays, and primitives handled seamlessly
- ✅ **Type Preservation** - Numbers, booleans, and null values maintain their types
- ✅ **Expiry Support** - Time-based storage with automatic cleanup
- ✅ **Namespace Aware** - Keys are automatically scoped to namespaces
- ✅ **Fallback Values** - Default values when keys don't exist
- ✅ **Chainable API** - Methods support method chaining

---

## Getting Started

```javascript
// Global storage instance
Storage.set('key', 'value');

// Namespaced instance
const appStorage = Storage.namespace('myApp');
appStorage.set('key', 'value');

// Session storage instance
Storage.session.set('key', 'value');

// All instances have the same methods!
```

---

## Basic Operations (Shorthand API)

### `set()` - Store Values

Store any value in storage with optional expiry time.

#### Syntax

```javascript
storage.set(key, value, options)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key identifier |
| `value` | any | ✅ Yes | Value to store (any JSON-serializable type) |
| `options` | object | ❌ No | Configuration options |
| `options.expires` | number\|Date | ❌ No | Expiry time (seconds or Date object) |

#### Returns

`boolean` - `true` if successful, `false` if failed

#### Examples

**Basic String Storage:**
```javascript
Storage.set('username', 'Alice');
// Returns: true
// Stored: { value: 'Alice', type: 'string', timestamp: 1234567890 }
```

**Number Storage (Type Preserved):**
```javascript
Storage.set('count', 42);
Storage.set('price', 19.99);
Storage.set('quantity', 0);

console.log(Storage.get('count'));    // 42 (number)
console.log(Storage.get('price'));    // 19.99 (number)
console.log(Storage.get('quantity')); // 0 (number, not falsy string)
```

**Boolean Storage (Type Preserved):**
```javascript
Storage.set('isActive', true);
Storage.set('isCompleted', false);

console.log(Storage.get('isActive'));    // true (boolean)
console.log(Storage.get('isCompleted')); // false (boolean, not string 'false')
```

**Object Storage:**
```javascript
Storage.set('user', {
  id: 123,
  name: 'Alice',
  email: 'alice@example.com',
  roles: ['admin', 'user'],
  settings: {
    theme: 'dark',
    notifications: true
  }
});

const user = Storage.get('user');
console.log(user.settings.theme); // 'dark'
```

**Array Storage:**
```javascript
Storage.set('tags', ['javascript', 'storage', 'api']);
Storage.set('todos', [
  { id: 1, text: 'Buy milk', done: false },
  { id: 2, text: 'Walk dog', done: true }
]);

const tags = Storage.get('tags');
console.log(tags[0]); // 'javascript'
```

**Null and Undefined:**
```javascript
Storage.set('nullValue', null);
Storage.set('emptyValue', undefined);

console.log(Storage.get('nullValue')); // null (preserved)
console.log(Storage.get('emptyValue')); // undefined
```

**With Expiry (Seconds):**
```javascript
// Expires in 1 hour (3600 seconds)
Storage.set('tempToken', 'abc123', { expires: 3600 });

// Expires in 5 minutes
Storage.set('flashMessage', 'Welcome!', { expires: 300 });

// Expires in 24 hours
Storage.set('dailyQuote', 'Carpe Diem', { expires: 86400 });
```

**With Expiry (Date Object):**
```javascript
// Expires at midnight
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
Storage.set('dailyData', { date: Date.now() }, { expires: midnight });

// Expires in 1 week
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
Storage.set('weeklyReport', reportData, { expires: nextWeek });

// Expires tomorrow at 9 AM
const tomorrow9AM = new Date();
tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
tomorrow9AM.setHours(9, 0, 0, 0);
Storage.set('appointment', appointmentData, { expires: tomorrow9AM });
```

**Namespaced Storage:**
```javascript
const userStorage = Storage.namespace('user');

userStorage.set('profile', {
  name: 'Alice',
  avatar: 'avatar.jpg'
});

// Stored as: 'user:profile' in localStorage
```

**Error Handling:**
```javascript
const success = Storage.set('key', 'value');

if (!success) {
  console.error('Failed to store value (quota exceeded?)');
  
  // Try cleanup and retry
  Storage.cleanup();
  Storage.set('key', 'value');
}
```

**Method Chaining (Not directly, but pattern):**
```javascript
// Store multiple values
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');

// Or use setMultiple for batch operations
Storage.setMultiple({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
});
```

---

### `get()` - Retrieve Values

Retrieve a value from storage with optional default fallback.

#### Syntax

```javascript
storage.get(key, defaultValue)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key to retrieve |
| `defaultValue` | any | ❌ No | Value to return if key doesn't exist (default: `null`) |

#### Returns

`any` - The stored value, or `defaultValue` if not found

#### Automatic Behaviors

- ✅ Returns `null` for non-existent keys
- ✅ Returns `null` for expired keys (and removes them)
- ✅ Returns `defaultValue` if provided and key doesn't exist
- ✅ Automatically deserializes JSON
- ✅ Preserves original data types

#### Examples

**Basic Retrieval:**
```javascript
Storage.set('username', 'Alice');
const username = Storage.get('username');
console.log(username); // 'Alice'
```

**Non-Existent Keys:**
```javascript
const missing = Storage.get('nonExistent');
console.log(missing); // null
```

**Default Values:**
```javascript
// Key doesn't exist - return default
const theme = Storage.get('theme', 'light');
console.log(theme); // 'light'

// Key exists - return actual value
Storage.set('theme', 'dark');
const actualTheme = Storage.get('theme', 'light');
console.log(actualTheme); // 'dark'
```

**Type Preservation:**
```javascript
Storage.set('count', 42);
Storage.set('isActive', true);
Storage.set('items', ['a', 'b', 'c']);
Storage.set('config', { mode: 'production' });

console.log(typeof Storage.get('count'));    // 'number'
console.log(typeof Storage.get('isActive')); // 'boolean'
console.log(Array.isArray(Storage.get('items'))); // true
console.log(typeof Storage.get('config'));   // 'object'
```

**Complex Objects:**
```javascript
Storage.set('user', {
  id: 123,
  name: 'Alice',
  roles: ['admin', 'user'],
  settings: {
    theme: 'dark',
    language: 'en'
  }
});

const user = Storage.get('user');
console.log(user.settings.theme); // 'dark'
console.log(user.roles[0]); // 'admin'
```

**Expired Keys:**
```javascript
// Store with 5 second expiry
Storage.set('temp', 'value', { expires: 5 });

// Immediately accessible
console.log(Storage.get('temp')); // 'value'

// After 6 seconds
setTimeout(() => {
  console.log(Storage.get('temp')); // null (expired and auto-removed)
}, 6000);
```

**Default Values for Different Types:**
```javascript
// String default
const name = Storage.get('userName', 'Guest');

// Number default
const count = Storage.get('pageViews', 0);

// Boolean default
const isEnabled = Storage.get('featureFlag', false);

// Array default
const items = Storage.get('cartItems', []);

// Object default
const settings = Storage.get('userSettings', {
  theme: 'light',
  language: 'en'
});
```

**Namespaced Retrieval:**
```javascript
const appStorage = Storage.namespace('myApp');

appStorage.set('version', '1.2.3');
console.log(appStorage.get('version')); // '1.2.3'

// Global storage doesn't see namespaced keys
console.log(Storage.get('version')); // null
```

**Safe Property Access:**
```javascript
// Instead of this (error if undefined):
// const theme = Storage.get('settings').theme; // Error if null!

// Do this:
const settings = Storage.get('settings', {});
const theme = settings.theme || 'light';

// Or with optional chaining:
const theme = Storage.get('settings')?.theme ?? 'light';
```

**Conditional Logic:**
```javascript
const token = Storage.get('authToken');

if (token) {
  // User is authenticated
  api.setAuthHeader(token);
} else {
  // Redirect to login
  window.location.href = '/login';
}
```

---

### `remove()` - Delete Values

Remove a specific key from storage.

#### Syntax

```javascript
storage.remove(key)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key to remove |

#### Returns

`boolean` - `true` if successful, `false` if failed

#### Examples

**Basic Removal:**
```javascript
Storage.set('username', 'Alice');
console.log(Storage.get('username')); // 'Alice'

Storage.remove('username');
console.log(Storage.get('username')); // null
```

**Remove Multiple Keys:**
```javascript
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');

// Remove one by one
Storage.remove('key1');
Storage.remove('key2');
Storage.remove('key3');

// Or use removeMultiple for batch
Storage.removeMultiple(['key1', 'key2', 'key3']);
```

**Logout Example:**
```javascript
function logout() {
  // Remove authentication data
  Storage.remove('authToken');
  Storage.remove('refreshToken');
  Storage.remove('userId');
  Storage.remove('userRole');
  
  // Redirect to login
  window.location.href = '/login';
}
```

**Clear User Session:**
```javascript
function clearUserSession() {
  const sessionKeys = [
    'authToken',
    'userData',
    'preferences',
    'lastActivity'
  ];
  
  sessionKeys.forEach(key => Storage.remove(key));
  console.log('Session cleared');
}
```

**Namespaced Removal:**
```javascript
const appStorage = Storage.namespace('myApp');

appStorage.set('cache', { data: [...] });
appStorage.remove('cache');

// Only removes from 'myApp' namespace
// Global storage unaffected
```

**Conditional Removal:**
```javascript
// Remove if expired manually
const data = Storage.get('cachedData');
if (!data || isStale(data)) {
  Storage.remove('cachedData');
}
```

**Remove After Read:**
```javascript
function getOnce(key) {
  const value = Storage.get(key);
  if (value) {
    Storage.remove(key);
  }
  return value;
}

// Usage: flash messages
const message = getOnce('flashMessage');
if (message) {
  showNotification(message);
}
```

---

### `has()` - Check Existence

Check if a key exists in storage (and is not expired).

#### Syntax

```javascript
storage.has(key)
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | ✅ Yes | Storage key to check |

#### Returns

`boolean` - `true` if key exists and is not expired, `false` otherwise

#### Automatic Behaviors

- ✅ Returns `false` for non-existent keys
- ✅ Returns `false` for expired keys (and removes them)
- ✅ More efficient than `get()` for existence checks

#### Examples

**Basic Existence Check:**
```javascript
Storage.set('username', 'Alice');

console.log(Storage.has('username')); // true
console.log(Storage.has('email'));    // false
```

**Before/After Operations:**
```javascript
// Check before getting
if (Storage.has('cachedData')) {
  const data = Storage.get('cachedData');
  displayData(data);
} else {
  fetchDataFromAPI();
}
```

**Avoid Overwriting:**
```javascript
// Only set if doesn't exist
if (!Storage.has('firstVisit')) {
  Storage.set('firstVisit', new Date().toISOString());
  showWelcomeMessage();
}
```

**Expired Keys:**
```javascript
// Store with 5 second expiry
Storage.set('temp', 'value', { expires: 5 });

console.log(Storage.has('temp')); // true

// After 6 seconds
setTimeout(() => {
  console.log(Storage.has('temp')); // false (expired)
}, 6000);
```

**Authentication Check:**
```javascript
function isAuthenticated() {
  return Storage.has('authToken');
}

if (isAuthenticated()) {
  loadDashboard();
} else {
  redirectToLogin();
}
```

**Feature Flag Check:**
```javascript
function isFeatureEnabled(featureName) {
  const key = `feature:${featureName}`;
  return Storage.has(key) && Storage.get(key) === true;
}

if (isFeatureEnabled('darkMode')) {
  enableDarkMode();
}
```

**Cache Validation:**
```javascript
function getCachedOrFetch(key, fetchFn) {
  if (Storage.has(key)) {
    return Promise.resolve(Storage.get(key));
  }
  
  return fetchFn().then(data => {
    Storage.set(key, data, { expires: 300 });
    return data;
  });
}

// Usage
getCachedOrFetch('users', () => fetch('/api/users').then(r => r.json()))
  .then(users => displayUsers(users));
```

**Multiple Key Check:**
```javascript
function hasAllKeys(...keys) {
  return keys.every(key => Storage.has(key));
}

// Check if user setup is complete
if (hasAllKeys('username', 'email', 'preferences')) {
  console.log('User setup complete');
} else {
  console.log('Please complete your profile');
}
```

**Namespaced Check:**
```javascript
const authStorage = Storage.namespace('auth');

authStorage.set('token', 'abc123');

console.log(authStorage.has('token')); // true
console.log(Storage.has('token'));     // false (different namespace)
```

---

### `clear()` - Clear Storage

Remove all items from storage. Respects namespaces.

#### Syntax

```javascript
storage.clear()
```

#### Parameters

None

#### Returns

`boolean` - `true` if successful, `false` if failed

#### Behaviors

- ✅ **Namespace-Aware:** Only clears keys in current namespace
- ✅ **Safe:** Global `clear()` clears everything, namespaced `clear()` only clears that namespace
- ✅ **Irreversible:** All data is permanently deleted

#### Examples

**Clear All Storage:**
```javascript
Storage.set('key1', 'value1');
Storage.set('key2', 'value2');
Storage.set('key3', 'value3');

Storage.clear();

console.log(Storage.get('key1')); // null
console.log(Storage.get('key2')); // null
console.log(Storage.get('key3')); // null
```

**Clear Namespace Only:**
```javascript
// Global storage
Storage.set('globalKey', 'global value');

// Namespaced storage
const appStorage = Storage.namespace('myApp');
appStorage.set('appKey1', 'value1');
appStorage.set('appKey2', 'value2');

// Clear only the namespace
appStorage.clear();

console.log(appStorage.get('appKey1')); // null
console.log(appStorage.get('appKey2')); // null
console.log(Storage.get('globalKey'));  // 'global value' (still exists!)
```

**Logout - Clear Session:**
```javascript
function logout() {
  // Clear authentication namespace
  const authStorage = Storage.namespace('auth');
  authStorage.clear();
  
  // Clear user-specific data
  const userStorage = Storage.namespace('user');
  userStorage.clear();
  
  // Keep global app settings
  // (don't clear global Storage)
  
  window.location.href = '/login';
}
```

**Reset Application State:**
```javascript
function resetApp() {
  if (confirm('Reset all application data?')) {
    Storage.clear(); // Clear everything
    location.reload();
  }
}
```

**Clear Cache Only:**
```javascript
function clearCache() {
  const cacheStorage = Storage.namespace('cache');
  cacheStorage.clear();
  console.log('Cache cleared');
}
```

**Clear Expired and Old Data:**
```javascript
function deepClean() {
  // First, cleanup expired items
  Storage.cleanup();
  
  // Then, clear specific namespaces
  const tempStorage = Storage.namespace('temp');
  tempStorage.clear();
  
  const cacheStorage = Storage.namespace('cache');
  cacheStorage.clear();
  
  console.log('Deep clean complete');
}
```

**Development Reset:**
```javascript
// Add to development console
window.resetStorage = function() {
  Storage.clear();
  Storage.session.clear();
  console.log('All storage cleared (dev mode)');
  location.reload();
};
```

**Selective Clear:**
```javascript
// Clear everything except specific keys
function clearExcept(keysToKeep) {
  const values = {};
  
  // Save keys to keep
  keysToKeep.forEach(key => {
    if (Storage.has(key)) {
      values[key] = Storage.get(key);
    }
  });
  
  // Clear everything
  Storage.clear();
  
  // Restore saved keys
  Object.entries(values).forEach(([key, value]) => {
    Storage.set(key, value);
  });
}

// Keep user preferences but clear everything else
clearExcept(['theme', 'language', 'fontSize']);
```

**Confirmation Before Clear:**
```javascript
function safeClear(namespace = null) {
  const storage = namespace ? Storage.namespace(namespace) : Storage;
  const count = storage.keys().length;
  
  if (count === 0) {
    console.log('Nothing to clear');
    return;
  }
  
  const message = namespace 
    ? `Clear ${count} items from '${namespace}' namespace?`
    : `Clear all ${count} items?`;
  
  if (confirm(message)) {
    storage.clear();
    console.log('Storage cleared');
  }
}
```

---

## Complete API Reference

### Quick Reference Table

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `set(key, value, options)` | key, value, [options] | boolean | Store a value |
| `get(key, defaultValue)` | key, [defaultValue] | any | Retrieve a value |
| `remove(key)` | key | boolean | Delete a value |
| `has(key)` | key | boolean | Check if key exists |
| `clear()` | none | boolean | Clear all storage |

### Method Comparison

```javascript
// Setting values
Storage.set('key', 'value');           // Store
Storage.setItem('key', 'value');       // Alias (vanilla-like)

// Getting values
Storage.get('key');                    // Retrieve
Storage.getItem('key');                // Alias (vanilla-like)

// Removing values
Storage.remove('key');                 // Delete
Storage.removeItem('key');             // Alias (vanilla-like)

// Checking existence
Storage.has('key');                    // Check

// Clearing storage
Storage.clear();                       // Clear all
```

---

## Practical Examples

### User Authentication

```javascript
const authStorage = Storage.namespace('auth');

// Login
function login(credentials) {
  return fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(data => {
    // Store tokens with expiry
    authStorage.set('accessToken', data.accessToken, { 
      expires: 3600 // 1 hour
    });
    
    authStorage.set('refreshToken', data.refreshToken, { 
      expires: 604800 // 7 days
    });
    
    authStorage.set('userId', data.userId);
    authStorage.set('userRole', data.role);
    
    return data;
  });
}

// Check authentication
function isAuthenticated() {
  return authStorage.has('accessToken');
}

// Get current user
function getCurrentUser() {
  if (!isAuthenticated()) {
    return null;
  }
  
  return {
    id: authStorage.get('userId'),
    role: authStorage.get('userRole'),
    token: authStorage.get('accessToken')
  };
}

// Logout
function logout() {
  authStorage.clear();
  window.location.href = '/login';
}

// Refresh token
async function refreshAuthToken() {
  const refreshToken = authStorage.get('refreshToken');
  
  if (!refreshToken) {
    logout();
    return;
  }
  
  try {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    authStorage.set('accessToken', data.accessToken, { 
      expires: 3600 
    });
    
    return data.accessToken;
  } catch (error) {
    logout();
  }
}
```

### Shopping Cart

```javascript
const cartStorage = Storage.namespace('cart');

// Add item to cart
function addToCart(product) {
  const cart = cartStorage.get('items', []);
  
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  cartStorage.set('items', cart);
  updateCartBadge();
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = cartStorage.get('items', []);
  const filtered = cart.filter(item => item.id !== productId);
  cartStorage.set('items', filtered);
  updateCartBadge();
}

// Get cart total
function getCartTotal() {
  const cart = cartStorage.get('items', []);
  return cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// Get cart count
function getCartCount() {
  const cart = cartStorage.get('items', []);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
  cartStorage.clear();
  updateCartBadge();
}

// Update UI
function updateCartBadge() {
  const count = getCartCount();
  document.getElementById('cartBadge').textContent = count;
}
```

### User Preferences

```javascript
const prefsStorage = Storage.namespace('preferences');

// Default preferences
const defaultPrefs = {
  theme: 'light',
  language: 'en',
  fontSize: 16,
  notifications: true,
  autoSave: true
};

// Get preference
function getPreference(key) {
  const prefs = prefsStorage.get('user', defaultPrefs);
  return prefs[key];
}

// Set preference
function setPreference(key, value) {
  const prefs = prefsStorage.get('user', defaultPrefs);
  prefs[key] = value;
  prefsStorage.set('user', prefs);
  applyPreference(key, value);
}

// Apply preference
function applyPreference(key, value) {
  switch (key) {
    case 'theme':
      document.body.className = `theme-${value}`;
      break;
    case 'fontSize':
      document.body.style.fontSize = `${value}px`;
      break;
    case 'language':
      loadLanguage(value);
      break;
  }
}

// Initialize preferences
function initPreferences() {
  const prefs = prefsStorage.get('user', defaultPrefs);
  Object.entries(prefs).forEach(([key, value]) => {
    applyPreference(key, value);
  });
}

// Reset to defaults
function resetPreferences() {
  prefsStorage.set('user', defaultPrefs);
  initPreferences();
}
```

### Form Auto-Save

```javascript
const formStorage = Storage.namespace('forms');

// Auto-save form
function enableAutoSave(formId) {
  const form = document.getElementById(formId);
  const saveKey = `draft:${formId}`;
  
  // Save on input
  form.addEventListener('input', debounce(() => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    formStorage.set(saveKey, data, { 
      expires: 86400 // 24 hours
    });
    
    showSaveIndicator('Draft saved');
  }, 1000));
  
  // Restore draft
  if (formStorage.has(saveKey)) {
    const draft = formStorage.get(saveKey);
    Object.entries(draft).forEach(([name, value]) => {
      const field = form.elements[name];
      if (field) field.value = value;
    });
    showSaveIndicator('Draft restored');
  }
  
  // Clear draft on submit
  form.addEventListener('submit', () => {
    formStorage.remove(saveKey);
  });
}

// Helper: debounce
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Helper: show save indicator
function showSaveIndicator(message) {
  const indicator = document.getElementById('saveIndicator');
  indicator.textContent = message;
  indicator.style.opacity = '1';
  setTimeout(() => {
    indicator.style.opacity = '0';
  }, 2000);
}
```

---

## Advanced Techniques

### Versioned Storage

```javascript
const STORAGE_VERSION = '2.0';

function migrateStorage() {
  const version = Storage.get('_version');
  
  if (version !== STORAGE_VERSION) {
    console.log(`Migrating storage from ${version} to ${STORAGE_VERSION}`);
    
    // Perform migrations
    if (!version || version === '1.0') {
      migrateFrom1To2();
    }
    
    Storage.set('_version', STORAGE_VERSION);
  }
}

function migrateFrom1To2() {
  // Example: rename keys
  if (Storage.has('oldKey')) {
    const value = Storage.get('oldKey');
    Storage.set('newKey', value);
    Storage.remove('oldKey');
  }
}
```

### Storage Wrapper Class

```javascript
class StorageManager {
  constructor(namespace) {
    this.storage = Storage.namespace(namespace);
  }
  
  save(key, value, ttl = null) {
    const options = ttl ? { expires: ttl } : {};
    return this.storage.set(key, value, options);
  }
  
  load(key, defaultValue = null) {
    return this.storage.get(key, defaultValue);
  }
  
  delete(key) {
    return this.storage.remove(key);
  }
  
  exists(key) {
    return this.storage.has(key);
  }
  
  reset() {
    return this.storage.clear();
  }
  
  export() {
    const keys = this.storage.keys();
    const data = {};
    keys.forEach(key => {
      data[key] = this.storage.get(key);
    });
    return data;
  }
  
  import(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  }
}

// Usage
const userManager = new StorageManager('user');
userManager.save('profile', { name: 'Alice' });
```

---

## Common Patterns

### Singleton Pattern

```javascript
class ConfigManager {
  static instance = null;
  
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    
    this.storage = Storage.namespace('config');
    ConfigManager.instance = this;
  }
  
  get(key, defaultValue) {
    return this.storage.get(key, defaultValue);
  }
  
  set(key, value) {
    return this.storage.set(key, value);
  }
}

// Usage
const config1 = new ConfigManager();
const config2 = new ConfigManager();
console.log(config1 === config2); // true (same instance)
```

### Cache with TTL

```javascript
class CacheManager {
  constructor(namespace, defaultTTL = 300) {
    this.storage = Storage.namespace(namespace);
    this.defaultTTL = defaultTTL;
  }
  
  set(key, value, ttl = this.defaultTTL) {
    return this.storage.set(key, value, { expires: ttl });
  }
  
  get(key) {
    return this.storage.get(key);
  }
  
  has(key) {
    return this.storage.has(key);
  }
  
  async getOrFetch(key, fetchFn, ttl = this.defaultTTL) {
    // Check cache first
    if (this.has(key)) {
      return this.get(key);
    }
    
    // Fetch and cache
    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error('Fetch failed:', error);
      throw error;
    }
  }
  
  invalidate(key) {
    return this.storage.remove(key);
  }
  
  invalidateAll() {
    return this.storage.clear();
  }
}

// Usage
const apiCache = new CacheManager('api', 300); // 5 min default

async function getUsers() {
  return apiCache.getOrFetch('users', async () => {
    const response = await fetch('/api/users');
    return response.json();
  });
}

// First call: fetches from API
const users1 = await getUsers();

// Second call within 5 min: returns cached data
const users2 = await getUsers();

// Invalidate cache
apiCache.invalidate('users');

// Next call: fetches fresh data
const users3 = await getUsers();
```

### Observer Pattern

```javascript
class StorageObserver {
  constructor() {
    this.observers = new Map();
  }
  
  subscribe(key, callback) {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.observers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }
  
  notify(key, value) {
    const callbacks = this.observers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(value));
    }
  }
  
  set(key, value, options) {
    const success = Storage.set(key, value, options);
    if (success) {
      this.notify(key, value);
    }
    return success;
  }
  
  get(key, defaultValue) {
    return Storage.get(key, defaultValue);
  }
}

// Usage
const observable = new StorageObserver();

// Subscribe to changes
const unsubscribe = observable.subscribe('theme', (newTheme) => {
  console.log('Theme changed to:', newTheme);
  document.body.className = `theme-${newTheme}`;
});

// Update will notify subscribers
observable.set('theme', 'dark');

// Unsubscribe when done
unsubscribe();
```

### Repository Pattern

```javascript
class UserRepository {
  constructor() {
    this.storage = Storage.namespace('users');
  }
  
  findById(id) {
    return this.storage.get(`user:${id}`);
  }
  
  save(user) {
    return this.storage.set(`user:${user.id}`, user);
  }
  
  delete(id) {
    return this.storage.remove(`user:${id}`);
  }
  
  findAll() {
    const keys = this.storage.keys();
    return keys
      .filter(key => key.startsWith('user:'))
      .map(key => this.storage.get(key))
      .filter(Boolean);
  }
  
  exists(id) {
    return this.storage.has(`user:${id}`);
  }
  
  count() {
    return this.findAll().length;
  }
  
  clear() {
    return this.storage.clear();
  }
}

// Usage
const userRepo = new UserRepository();

// Save users
userRepo.save({ id: 1, name: 'Alice', email: 'alice@example.com' });
userRepo.save({ id: 2, name: 'Bob', email: 'bob@example.com' });

// Find by ID
const user = userRepo.findById(1);
console.log(user.name); // 'Alice'

// Find all
const allUsers = userRepo.findAll();
console.log(allUsers.length); // 2

// Check existence
if (userRepo.exists(1)) {
  console.log('User 1 exists');
}

// Delete user
userRepo.delete(1);
```

### State Machine Pattern

```javascript
class StateMachine {
  constructor(initialState, namespace = 'state') {
    this.storage = Storage.namespace(namespace);
    this.transitions = new Map();
    
    if (!this.storage.has('current')) {
      this.storage.set('current', initialState);
    }
  }
  
  defineTransition(from, to, action) {
    const key = `${from}->${to}`;
    this.transitions.set(key, action);
  }
  
  getCurrentState() {
    return this.storage.get('current');
  }
  
  canTransition(to) {
    const from = this.getCurrentState();
    return this.transitions.has(`${from}->${to}`);
  }
  
  transition(to) {
    const from = this.getCurrentState();
    const key = `${from}->${to}`;
    
    if (!this.transitions.has(key)) {
      throw new Error(`Invalid transition: ${from} -> ${to}`);
    }
    
    const action = this.transitions.get(key);
    
    try {
      action();
      this.storage.set('current', to);
      this.storage.set('history', [
        ...this.getHistory(),
        { from, to, timestamp: Date.now() }
      ]);
      return true;
    } catch (error) {
      console.error('Transition failed:', error);
      return false;
    }
  }
  
  getHistory() {
    return this.storage.get('history', []);
  }
  
  reset(initialState) {
    this.storage.clear();
    this.storage.set('current', initialState);
  }
}

// Usage: Order state machine
const orderState = new StateMachine('pending', 'order');

orderState.defineTransition('pending', 'processing', () => {
  console.log('Starting order processing...');
});

orderState.defineTransition('processing', 'shipped', () => {
  console.log('Order shipped!');
});

orderState.defineTransition('shipped', 'delivered', () => {
  console.log('Order delivered!');
});

// Transition through states
console.log(orderState.getCurrentState()); // 'pending'
orderState.transition('processing');
console.log(orderState.getCurrentState()); // 'processing'
orderState.transition('shipped');
console.log(orderState.getCurrentState()); // 'shipped'

// View history
console.log(orderState.getHistory());
```

---

## Error Handling

### Quota Exceeded

```javascript
function safeSave(key, value, options) {
  try {
    return Storage.set(key, value, options);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded');
      
      // Strategy 1: Cleanup expired items
      const cleaned = Storage.cleanup();
      if (cleaned.local > 0) {
        console.log(`Cleaned ${cleaned.local} items, retrying...`);
        try {
          return Storage.set(key, value, options);
        } catch (retryError) {
          console.error('Still out of space after cleanup');
        }
      }
      
      // Strategy 2: Clear old cache
      const cacheStorage = Storage.namespace('cache');
      cacheStorage.clear();
      console.log('Cache cleared, retrying...');
      
      try {
        return Storage.set(key, value, options);
      } catch (finalError) {
        console.error('Failed after all attempts');
        return false;
      }
    }
    
    console.error('Storage error:', error);
    return false;
  }
}

// Usage
const success = safeSave('largeData', hugeObject);
if (!success) {
  showNotification('Unable to save data - storage full');
}
```

### Graceful Degradation

```javascript
class StorageWithFallback {
  constructor(namespace) {
    this.storage = null;
    this.fallback = new Map();
    this.available = false;
    
    try {
      this.storage = Storage.namespace(namespace);
      // Test storage
      this.storage.set('__test__', 'test');
      this.storage.remove('__test__');
      this.available = true;
    } catch (error) {
      console.warn('Storage not available, using fallback');
      this.available = false;
    }
  }
  
  set(key, value, options) {
    if (this.available) {
      try {
        return this.storage.set(key, value, options);
      } catch (error) {
        console.warn('Falling back to memory storage');
        this.available = false;
      }
    }
    
    // Fallback to in-memory storage
    this.fallback.set(key, value);
    return true;
  }
  
  get(key, defaultValue = null) {
    if (this.available) {
      try {
        return this.storage.get(key, defaultValue);
      } catch (error) {
        console.warn('Falling back to memory storage');
        this.available = false;
      }
    }
    
    return this.fallback.has(key) ? this.fallback.get(key) : defaultValue;
  }
  
  has(key) {
    if (this.available) {
      try {
        return this.storage.has(key);
      } catch (error) {
        this.available = false;
      }
    }
    
    return this.fallback.has(key);
  }
  
  remove(key) {
    if (this.available) {
      try {
        return this.storage.remove(key);
      } catch (error) {
        this.available = false;
      }
    }
    
    return this.fallback.delete(key);
  }
  
  clear() {
    if (this.available) {
      try {
        return this.storage.clear();
      } catch (error) {
        this.available = false;
      }
    }
    
    this.fallback.clear();
    return true;
  }
}

// Usage
const reliableStorage = new StorageWithFallback('app');
reliableStorage.set('key', 'value'); // Works in any environment
```

### Error Logging

```javascript
class LoggedStorage {
  constructor(namespace) {
    this.storage = Storage.namespace(namespace);
    this.errors = [];
  }
  
  set(key, value, options) {
    try {
      const success = this.storage.set(key, value, options);
      if (!success) {
        this.logError('set', key, 'Operation returned false');
      }
      return success;
    } catch (error) {
      this.logError('set', key, error.message);
      throw error;
    }
  }
  
  get(key, defaultValue) {
    try {
      return this.storage.get(key, defaultValue);
    } catch (error) {
      this.logError('get', key, error.message);
      return defaultValue;
    }
  }
  
  logError(operation, key, message) {
    const error = {
      operation,
      key,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.errors.push(error);
    console.error('[Storage Error]', error);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift();
    }
  }
  
  getErrors() {
    return [...this.errors];
  }
  
  clearErrors() {
    this.errors = [];
  }
}

// Usage
const loggedStorage = new LoggedStorage('app');

try {
  loggedStorage.set('key', 'value');
} catch (error) {
  console.log('Recent errors:', loggedStorage.getErrors());
}
```

---

## Performance Tips

### Batch Operations

```javascript
// ❌ Bad: Multiple individual operations
function saveManyItemsSlow(items) {
  items.forEach(item => {
    Storage.set(`item:${item.id}`, item);
  });
}

// ✅ Good: Use setMultiple
function saveManyItemsFast(items) {
  const data = {};
  items.forEach(item => {
    data[`item:${item.id}`] = item;
  });
  Storage.setMultiple(data);
}

// Benchmark
const items = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
}));

console.time('slow');
saveManyItemsSlow(items);
console.timeEnd('slow'); // ~50ms

console.time('fast');
saveManyItemsFast(items);
console.timeEnd('fast'); // ~10ms
```

### Minimize Serialization

```javascript
// ❌ Bad: Storing large objects frequently
function updateUserActivityBad() {
  const activity = Storage.get('userActivity', {});
  activity.clicks = (activity.clicks || 0) + 1;
  activity.lastUpdate = Date.now();
  Storage.set('userActivity', activity); // Full serialization
}

// ✅ Good: Use counters for frequent updates
function updateUserActivityGood() {
  Storage.increment('clicks'); // Just increment
  Storage.set('lastUpdate', Date.now()); // Simple value
}

// Periodically consolidate
setInterval(() => {
  const activity = {
    clicks: Storage.get('clicks', 0),
    lastUpdate: Storage.get('lastUpdate')
  };
  Storage.set('userActivity', activity);
  Storage.remove('clicks');
  Storage.remove('lastUpdate');
}, 60000); // Every minute
```

### Lazy Loading

```javascript
class LazyStorage {
  constructor(namespace) {
    this.storage = Storage.namespace(namespace);
    this.cache = new Map();
    this.loaded = new Set();
  }
  
  get(key, defaultValue = null) {
    // Return from memory cache if available
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Load from storage
    if (!this.loaded.has(key)) {
      const value = this.storage.get(key, defaultValue);
      this.cache.set(key, value);
      this.loaded.add(key);
    }
    
    return this.cache.get(key);
  }
  
  set(key, value, options) {
    // Update memory cache
    this.cache.set(key, value);
    this.loaded.add(key);
    
    // Write to storage
    return this.storage.set(key, value, options);
  }
  
  invalidate(key) {
    this.cache.delete(key);
    this.loaded.delete(key);
  }
  
  flush() {
    this.cache.clear();
    this.loaded.clear();
  }
}

// Usage
const lazyStorage = new LazyStorage('app');

// First access: loads from storage
const value1 = lazyStorage.get('config');

// Subsequent accesses: returns from cache
const value2 = lazyStorage.get('config'); // Much faster!
```

### Debounced Saves

```javascript
class DebouncedStorage {
  constructor(namespace, delay = 1000) {
    this.storage = Storage.namespace(namespace);
    this.pending = new Map();
    this.timers = new Map();
    this.delay = delay;
  }
  
  set(key, value, options) {
    // Store in pending
    this.pending.set(key, { value, options });
    
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      this.flush(key);
    }, this.delay);
    
    this.timers.set(key, timer);
  }
  
  flush(key) {
    if (this.pending.has(key)) {
      const { value, options } = this.pending.get(key);
      this.storage.set(key, value, options);
      this.pending.delete(key);
      this.timers.delete(key);
    }
  }
  
  flushAll() {
    this.pending.forEach((_, key) => this.flush(key));
  }
  
  get(key, defaultValue) {
    // Check pending first
    if (this.pending.has(key)) {
      return this.pending.get(key).value;
    }
    
    return this.storage.get(key, defaultValue);
  }
}

// Usage: Auto-save form
const autoSave = new DebouncedStorage('formDraft', 1000);

document.getElementById('myForm').addEventListener('input', (e) => {
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  
  // Saves after 1 second of inactivity
  autoSave.set('draft', data);
});

// Flush on submit
document.getElementById('myForm').addEventListener('submit', () => {
  autoSave.flushAll();
});
```

---

## Best Practices

### 1. Use Namespaces

```javascript
// ✅ Good: Organized with namespaces
const auth = Storage.namespace('auth');
const cache = Storage.namespace('cache');
const ui = Storage.namespace('ui');

auth.set('token', 'abc123');
cache.set('users', userData);
ui.set('theme', 'dark');

// ❌ Bad: Everything in global namespace
Storage.set('authToken', 'abc123');
Storage.set('cachedUsers', userData);
Storage.set('uiTheme', 'dark');
```

### 2. Always Set Expiry for Temporary Data

```javascript
// ✅ Good: Expiry for auth tokens
Storage.set('authToken', token, { expires: 3600 });
Storage.set('refreshToken', refreshToken, { expires: 604800 });

// ✅ Good: Expiry for cache
Storage.set('apiCache', data, { expires: 300 });

// ❌ Bad: No expiry for temporary data
Storage.set('authToken', token); // Never expires!
```

### 3. Use Default Values

```javascript
// ✅ Good: Always provide defaults
const theme = Storage.get('theme', 'light');
const language = Storage.get('language', 'en');
const settings = Storage.get('settings', {});

// ❌ Bad: No defaults (can cause errors)
const theme = Storage.get('theme');
if (theme) { // Extra null check needed
  applyTheme(theme);
}
```

### 4. Check Existence Before Getting

```javascript
// ✅ Good: Check with has()
if (Storage.has('userData')) {
  const user = Storage.get('userData');
  displayUser(user);
} else {
  fetchUser();
}

// ⚠️ Okay: Use default value
const user = Storage.get('userData', null);
if (user) {
  displayUser(user);
} else {
  fetchUser();
}
```

### 5. Clear Sensitive Data

```javascript
// ✅ Good: Clear on logout
function logout() {
  const authStorage = Storage.namespace('auth');
  authStorage.clear();
  
  // Or remove specific keys
  Storage.remove('authToken');
  Storage.remove('refreshToken');
  Storage.remove('userId');
}

// ❌ Bad: Leave sensitive data
function logout() {
  // Just redirect, data remains!
  window.location.href = '/login';
}
```

### 6. Handle Quota Errors

```javascript
// ✅ Good: Try-catch for large data
function saveData(key, data) {
  try {
    Storage.set(key, data);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      Storage.cleanup();
      try {
        Storage.set(key, data);
      } catch (retryError) {
        showNotification('Storage full, please clear some data');
      }
    }
  }
}

// ❌ Bad: No error handling
function saveData(key, data) {
  Storage.set(key, data); // Might crash!
}
```

### 7. Validate Retrieved Data

```javascript
// ✅ Good: Validate structure
function getUser() {
  const user = Storage.get('user');
  
  if (!user || !user.id || !user.email) {
    return null; // Invalid structure
  }
  
  return user;
}

// ❌ Bad: Assume structure
function getUser() {
  const user = Storage.get('user');
  return user.email; // Might crash if null!
}
```

### 8. Use TypeScript Types (if applicable)

```typescript
// ✅ Good: Type-safe storage
interface User {
  id: number;
  name: string;
  email: string;
}

class TypedStorage<T> {
  constructor(private key: string) {}
  
  set(value: T, options?: any): boolean {
    return Storage.set(this.key, value, options);
  }
  
  get(defaultValue?: T): T | null {
    return Storage.get(this.key, defaultValue) as T;
  }
}

const userStorage = new TypedStorage<User>('user');
const user = userStorage.get(); // Type: User | null
```

---

## Summary

The **StorageHelper Class** provides these essential methods:

| Method | Purpose | Best For |
|--------|---------|----------|
| `set()` | Store values | Any data with optional expiry |
| `get()` | Retrieve values | Reading with fallback defaults |
| `remove()` | Delete values | Cleanup, logout, cache invalidation |
| `has()` | Check existence | Conditional logic, validation |
| `clear()` | Clear all | Namespace cleanup, reset |

**Key Takeaways:**

✅ All data types are preserved (numbers, booleans, objects, arrays)  
✅ Automatic JSON serialization/deserialization  
✅ Built-in expiry system with automatic cleanup  
✅ Namespace-aware operations  
✅ Fallback values prevent null errors  
✅ Safe and chainable API  

Use these methods to build robust, maintainable storage solutions in your web applications!