# DOM Helpers - Storage System

**Version:** 2.0.0
**License:** MIT

Web Storage API wrapper with automatic serialization, expiry system, namespace support, and forms integration.

---

## Quick Start

```html
<script src="storage-core.js"></script>
<script src="storage-forms.js"></script>
<script src="storage.js"></script>

<script>
  // Set a value
  Storage.set('user', { name: 'John', age: 30 });

  // Get a value
  const user = Storage.get('user');
  console.log(user); // { name: 'John', age: 30 }

  // Set with expiry (1 hour)
  Storage.set('token', 'abc123', { expires: 3600 });

  // Use namespace
  const userStorage = Storage.namespace('user');
  userStorage.set('preferences', { theme: 'dark' });

  // Forms integration
  Forms.myForm.autoSave('formData');
  Forms.myForm.restore('formData');
</script>
```

---

## Features

✅ **Automatic serialization** - JSON serialization/deserialization
✅ **Expiry system** - Time-based storage with auto-cleanup
✅ **Namespace support** - Organize storage with namespaces
✅ **Forms integration** - Auto-save and restore form data
✅ **Dual API** - Shorthand (set/get) and vanilla-like (setItem/getItem)
✅ **Bulk operations** - setMultiple, getMultiple, removeMultiple
✅ **Advanced operations** - increment, decrement, toggle
✅ **Statistics** - Track storage usage
✅ **Zero dependencies** - Works standalone

---

## Installation

### Option 1: Load All Features

```html
<script src="storage-core.js"></script>
<script src="storage-forms.js"></script>
<script src="storage.js"></script>
```

### Option 2: Core Only

```html
<script src="storage-core.js"></script>
```

### Option 3: ES6 Modules

```javascript
import Storage from './storage.js';
```

---

## Module Structure

```
src/storage-system/
├── storage-core.js      ~420 lines, ~13 KB  Core wrapper
├── storage-forms.js     ~230 lines,  ~7 KB  Forms integration
└── storage.js           ~170 lines,  ~5 KB  Unified entry
```

---

## Core Features

### 1. Basic Operations

```javascript
// Set a value
Storage.set('key', 'value');
Storage.set('user', { name: 'John', age: 30 });
Storage.set('items', [1, 2, 3, 4, 5]);

// Get a value
const value = Storage.get('key');
const user = Storage.get('user');
const missing = Storage.get('nonexistent', 'default');

// Remove a value
Storage.remove('key');

// Check if exists
if (Storage.has('user')) {
  console.log('User data exists');
}

// Get all keys
const keys = Storage.keys();
// ['key', 'user', 'items']

// Get all values
const values = Storage.values();

// Get all entries
const entries = Storage.entries();
// [['key', 'value'], ['user', {...}], ...]

// Clear all
Storage.clear();

// Get size
const count = Storage.size();
```

### 2. Expiry System

```javascript
// Expires in 1 hour (3600 seconds)
Storage.set('token', 'abc123', { expires: 3600 });

// Expires at specific date
const tomorrow = new Date(Date.now() + 86400000);
Storage.set('temp', 'value', { expires: tomorrow });

// Check if still valid
if (Storage.has('token')) {
  console.log('Token is still valid');
}

// Auto-cleanup expired items
const cleaned = Storage.cleanup();
console.log(`Cleaned ${cleaned.local} items from localStorage`);
console.log(`Cleaned ${cleaned.session} items from sessionStorage`);
```

### 3. Namespace Support

```javascript
// Create namespaced storage
const userStorage = Storage.namespace('user');
const appStorage = Storage.namespace('app');

// Each namespace is isolated
userStorage.set('theme', 'dark');
appStorage.set('theme', 'light');

console.log(userStorage.get('theme')); // 'dark'
console.log(appStorage.get('theme'));  // 'light'

// Nested namespaces
const userPrefs = userStorage.namespace('preferences');
userPrefs.set('fontSize', 14);

// Keys are prefixed automatically
// Actual key in storage: 'user:preferences:fontSize'

// Clear only namespaced items
userStorage.clear(); // Only clears 'user:*' keys
```

### 4. Session Storage

```javascript
// Use sessionStorage instead of localStorage
Storage.session.set('tempData', { foo: 'bar' });
Storage.session.get('tempData');

// Session storage with namespace
const tempStorage = Storage.session.namespace('temp');
tempStorage.set('key', 'value');

// Session storage with expiry
Storage.session.set('key', 'value', { expires: 300 }); // 5 minutes
```

### 5. Vanilla-like API

```javascript
// Compatible with native Storage API
Storage.setItem('key', 'value');
Storage.getItem('key');
Storage.removeItem('key');

// But with benefits of serialization and expiry
Storage.setItem('user', { name: 'John' }); // Auto-serializes
Storage.setItem('temp', 'value', { expires: 3600 }); // With expiry
```

---

## Bulk Operations

```javascript
// Set multiple values at once
Storage.setMultiple({
  name: 'John',
  age: 30,
  city: 'New York'
});

// Set multiple with expiry
Storage.setMultiple({
  token: 'abc',
  refreshToken: 'xyz'
}, { expires: 3600 });

// Get multiple values
const data = Storage.getMultiple(['name', 'age', 'city']);
// { name: 'John', age: 30, city: 'New York' }

// Remove multiple
Storage.removeMultiple(['name', 'age', 'city']);
```

---

## Advanced Operations

```javascript
// Increment numeric values
Storage.set('counter', 0);
Storage.increment('counter');     // Returns 1
Storage.increment('counter', 5);  // Returns 6

// Decrement
Storage.decrement('counter');     // Returns 5
Storage.decrement('counter', 2);  // Returns 3

// Toggle boolean values
Storage.set('darkMode', false);
Storage.toggle('darkMode');       // Returns true
Storage.toggle('darkMode');       // Returns false
```

---

## Statistics

```javascript
// Get storage statistics
const stats = Storage.stats();

console.log(stats.local);
// {
//   keys: 15,
//   totalSize: 2048,
//   averageSize: 136,
//   namespace: 'global',
//   storageType: 'localStorage'
// }

console.log(stats.session);
// Same structure for sessionStorage

// Namespaced stats
const userStorage = Storage.namespace('user');
console.log(userStorage.stats());
// {
//   keys: 5,
//   totalSize: 512,
//   averageSize: 102,
//   namespace: 'user',
//   storageType: 'localStorage'
// }
```

---

## Forms Integration

### Auto-Save

```javascript
// Auto-save form on input/change
Forms.myForm.autoSave('formData');

// With options
Forms.myForm.autoSave('formData', {
  storage: 'sessionStorage',  // or 'localStorage' (default)
  interval: 500,              // Debounce delay in ms
  events: ['input', 'change'], // Events to listen to
  namespace: 'forms',         // Storage namespace
  expires: 3600               // Expire after 1 hour
});
```

### Restore

```javascript
// Restore saved form data
Forms.myForm.restore('formData');

// With options
Forms.myForm.restore('formData', {
  storage: 'sessionStorage',
  namespace: 'forms',
  clearAfterRestore: true  // Remove from storage after restore
});
```

### Clear Auto-Save

```javascript
// Clear auto-saved data
Forms.myForm.clearAutoSave();
```

### Complete Example

```html
<form id="contactForm">
  <input name="name" placeholder="Name">
  <input name="email" type="email" placeholder="Email">
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>

<script>
  const form = Forms.contactForm;

  // Auto-save as user types
  form.autoSave('contact-draft', {
    interval: 1000,
    expires: 86400  // Expire after 24 hours
  });

  // Restore on page load
  form.restore('contact-draft');

  // Clear on successful submit
  form.addEventListener('formsubmitsuccess', () => {
    form.clearAutoSave();
  });
</script>
```

---

## Examples

### User Preferences

```javascript
const userPrefs = Storage.namespace('user:preferences');

// Save preferences
userPrefs.setMultiple({
  theme: 'dark',
  fontSize: 14,
  language: 'en',
  notifications: true
});

// Load preferences
const theme = userPrefs.get('theme', 'light');
const fontSize = userPrefs.get('fontSize', 12);

// Toggle setting
userPrefs.toggle('notifications');
```

### Shopping Cart

```javascript
const cart = Storage.namespace('cart');

// Add item to cart
function addToCart(item) {
  const items = cart.get('items', []);
  items.push(item);
  cart.set('items', items);

  // Update count
  cart.increment('itemCount');
}

// Get cart items
const cartItems = cart.get('items', []);
const itemCount = cart.get('itemCount', 0);

// Clear cart
cart.clear();
```

### Authentication Token

```javascript
// Store token with 1-hour expiry
Storage.set('authToken', 'abc123...', { expires: 3600 });

// Check if token is still valid
if (Storage.has('authToken')) {
  const token = Storage.get('authToken');
  // Make authenticated request
} else {
  // Token expired, redirect to login
  window.location.href = '/login';
}
```

### Page Visit Counter

```javascript
// Track page visits
Storage.increment('pageViews');
const views = Storage.get('pageViews', 0);
console.log(`You've visited this page ${views} times`);

// Track last visit
Storage.set('lastVisit', new Date().toISOString());
```

### Feature Flags

```javascript
const features = Storage.namespace('features');

// Enable/disable features
features.set('darkMode', true);
features.set('betaFeatures', false);

// Toggle feature
features.toggle('darkMode');

// Check if feature is enabled
if (features.get('darkMode')) {
  document.body.classList.add('dark-mode');
}
```

### Form Draft Auto-Save

```javascript
const form = Forms.contactForm;

// Auto-save every 2 seconds
form.autoSave('contact-draft', {
  interval: 2000,
  expires: 86400  // 24 hours
});

// Restore on page load
window.addEventListener('load', () => {
  form.restore('contact-draft');
});

// Clear on submit
form.addEventListener('formsubmitsuccess', () => {
  form.clearAutoSave();
  alert('Message sent! Draft cleared.');
});

// Warn about unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (Storage.has('contact-draft')) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});
```

---

## API Reference

### Storage Object

```javascript
// Core operations
Storage.set(key, value, options)
Storage.get(key, defaultValue)
Storage.remove(key)
Storage.has(key)
Storage.keys()
Storage.values()
Storage.entries()
Storage.clear()
Storage.size()

// Vanilla-like aliases
Storage.setItem(key, value, options)
Storage.getItem(key, defaultValue)
Storage.removeItem(key)

// Bulk operations
Storage.setMultiple(obj, options)
Storage.getMultiple(keys, defaultValue)
Storage.removeMultiple(keys)

// Advanced operations
Storage.increment(key, amount)
Storage.decrement(key, amount)
Storage.toggle(key)

// Maintenance
Storage.cleanup()        // Returns { local, session }
Storage.stats()          // Returns { local, session }

// Namespace
Storage.namespace(name)  // Returns new StorageHelper

// Session storage
Storage.session          // sessionStorage instance
Storage.local            // localStorage instance
```

### StorageHelper Instance

```javascript
const storage = new StorageHelper('localStorage', 'namespace');

// All methods from Storage object available
storage.set(key, value, options)
storage.get(key, defaultValue)
// ... etc
```

### Form Methods

```javascript
// Auto-save
form.autoSave(storageKey, {
  storage: 'localStorage',    // or 'sessionStorage'
  interval: 1000,             // Debounce delay
  events: ['input', 'change'], // Events to listen to
  namespace: '',              // Storage namespace
  expires: null               // Expiry in seconds
})

// Restore
form.restore(storageKey, {
  storage: 'localStorage',
  namespace: '',
  clearAfterRestore: false
})

// Clear
form.clearAutoSave()
```

---

## Browser Support

- Modern browsers (ES6+)
- IE11+ (with polyfills for Map, WeakMap)
- Graceful fallback if localStorage/sessionStorage unavailable

---

## Bundle Size Optimization

**Core Only:** ~13 KB (storage-core.js)
**Core + Forms:** ~20 KB (+forms integration)
**Full System:** ~25 KB (all features)

**Savings:** Up to 48% by loading only core

---

## License

MIT License - See LICENSE file for details

---

**Version:** 2.0.0
**Last Updated:** December 2025
