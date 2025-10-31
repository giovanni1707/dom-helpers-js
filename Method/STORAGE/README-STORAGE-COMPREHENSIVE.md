[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)


# DOM Helpers - Storage Module - Comprehensive Documentation

Web Storage API utilities with automatic JSON serialization, expiry system, and Forms integration.

**Version:** 1.0.0  
**License:** MIT

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Basic Operations](#basic-operations)
4. [Storage Types](#storage-types)
5. [Expiry System](#expiry-system)
6. [Namespace Support](#namespace-support)
7. [Bulk Operations](#bulk-operations)
8. [Advanced Operations](#advanced-operations)
9. [Storage Management](#storage-management)
10. [Forms Integration](#forms-integration)
11. [Complete Examples](#complete-examples)

---

## Installation & Setup

### Prerequisites

The Storage module works standalone but integrates with the main DOM Helpers library for enhanced functionality.

### Include the Libraries

```html
<!-- Load main DOM Helpers first (optional but recommended) -->
<script src="path/to/dom-helpers.js"></script>

<!-- Load Storage module -->
<script src="path/to/dom-helpers-storage.js"></script>
```

### Basic Usage

```javascript
// Save data
Storage.set('username', 'John');
Storage.set('preferences', { theme: 'dark', lang: 'en' });

// Retrieve data
const username = Storage.get('username');
const prefs = Storage.get('preferences');

// Remove data
Storage.remove('username');

// Clear all storage
Storage.clear();
```

---

## Core Concepts

The Storage module provides:

- **Automatic JSON Serialization** - Objects/arrays are automatically serialized
- **Expiry System** - Set TTL (time to live) for stored values
- **Namespace Support** - Organize storage with namespaces
- **Dual API** - Shorthand (set/get) and vanilla-like (setItem/getItem)
- **Session & Local Storage** - Work with both storage types
- **Forms Integration** - Auto-save and restore form values
- **Type Preservation** - Maintains data types (numbers, booleans, objects, arrays)

---

## Basic Operations

### Storage.set(key, value, options)

Store a value in localStorage with optional configuration.

**Parameters:**
- `key` (string): Storage key
- `value` (any): Value to store (automatically serialized)
- `options` (Object, optional): Storage options
  - `expires` (number | Date): Expiry time in seconds or Date object

**Returns:** boolean (success/failure)

**Example:**
```javascript
// Store simple values
Storage.set('username', 'John');
Storage.set('age', 25);
Storage.set('isActive', true);

// Store objects/arrays
Storage.set('user', {
  name: 'John',
  email: 'john@example.com'
});

Storage.set('tags', ['javascript', 'react', 'node']);

// With expiry (expires in 1 hour)
Storage.set('tempToken', 'abc123', { expires: 3600 });

// With expiry date
const expiryDate = new Date('2024-12-31');
Storage.set('subscription', { plan: 'pro' }, { expires: expiryDate });
```

---

### Storage.get(key, defaultValue)

Retrieve a value from localStorage.

**Parameters:**
- `key` (string): Storage key
- `defaultValue` (any, optional): Value to return if key doesn't exist (default: null)

**Returns:** Stored value or defaultValue

**Example:**
```javascript
// Get simple values
const username = Storage.get('username');
const age = Storage.get('age');
const isActive = Storage.get('isActive');

// Get objects/arrays
const user = Storage.get('user');
const tags = Storage.get('tags');

// With default value
const theme = Storage.get('theme', 'light');
const settings = Storage.get('settings', { notifications: true });

// Check if value exists
const token = Storage.get('token');
if (token) {
  console.log('Token exists:', token);
} else {
  console.log('No token found');
}
```

---

### Storage.remove(key)

Remove a value from localStorage.

**Parameters:**
- `key` (string): Storage key to remove

**Returns:** boolean (success/failure)

**Example:**
```javascript
// Remove single key
Storage.remove('username');
Storage.remove('tempToken');

// Check if removed
const result = Storage.remove('oldData');
if (result) {
  console.log('Successfully removed');
} else {
  console.log('Failed to remove');
}
```

---

### Storage.has(key)

Check if a key exists in storage (and is not expired).

**Parameters:**
- `key` (string): Storage key to check

**Returns:** boolean

**Example:**
```javascript
// Check if key exists
if (Storage.has('username')) {
  console.log('Username is stored');
} else {
  console.log('No username found');
}

// Use for conditional logic
if (!Storage.has('preferences')) {
  Storage.set('preferences', getDefaultPreferences());
}

// Expired items return false
Storage.set('temp', 'value', { expires: 1 }); // 1 second
setTimeout(() => {
  console.log(Storage.has('temp')); // false (expired)
}, 2000);
```

---

### Storage.keys()

Get all storage keys (automatically filters expired items).

**Parameters:** None

**Returns:** Array of strings

**Example:**
```javascript
// Get all keys
const keys = Storage.keys();
console.log(keys); // ['username', 'preferences', 'theme']

// Iterate over keys
Storage.keys().forEach(key => {
  console.log(`${key}:`, Storage.get(key));
});

// Count items
const count = Storage.keys().length;
console.log(`Storage has ${count} items`);
```

---

### Storage.values()

Get all stored values.

**Parameters:** None

**Returns:** Array of values

**Example:**
```javascript
// Get all values
const values = Storage.values();
console.log(values);

// Process all values
Storage.values().forEach(value => {
  console.log(value);
});
```

---

### Storage.entries()

Get all storage entries as key-value pairs.

**Parameters:** None

**Returns:** Array of [key, value] pairs

**Example:**
```javascript
// Get all entries
const entries = Storage.entries();
console.log(entries);
// [['username', 'John'], ['age', 25], ['theme', 'dark']]

// Iterate entries
Storage.entries().forEach(([key, value]) => {
  console.log(`${key}: ${JSON.stringify(value)}`);
});

// Convert to object
const storageObj = Object.fromEntries(Storage.entries());
console.log(storageObj);
```

---

### Storage.clear()

Clear all items from localStorage.

**Parameters:** None

**Returns:** boolean (success/failure)

**Example:**
```javascript
// Clear all storage
Storage.clear();

// Confirm clear
if (Storage.clear()) {
  console.log('Storage cleared successfully');
}

// Clear before setting defaults
Storage.clear();
Storage.set('theme', 'light');
Storage.set('lang', 'en');
```

---

### Storage.size()

Get the number of items in storage.

**Parameters:** None

**Returns:** number

**Example:**
```javascript
// Get storage size
const size = Storage.size();
console.log(`Storage contains ${size} items`);

// Check if empty
if (Storage.size() === 0) {
  console.log('Storage is empty');
}

// Monitor storage growth
Storage.set('item1', 'value');
console.log(Storage.size()); // 1
Storage.set('item2', 'value');
console.log(Storage.size()); // 2
```

---

## Storage Types

### Storage (localStorage)

Default storage using localStorage (persistent across sessions).

**Example:**
```javascript
// Use default localStorage
Storage.set('username', 'John');
const username = Storage.get('username');

// Data persists across page reloads
window.location.reload();
console.log(Storage.get('username')); // Still 'John'
```

---

### Storage.session (sessionStorage)

Use sessionStorage (cleared when session ends).

**Example:**
```javascript
// Use sessionStorage
Storage.session.set('tempData', 'temporary');
const tempData = Storage.session.get('tempData');

// Data cleared when tab/window closes
// But persists during page reloads in same tab
window.location.reload();
console.log(Storage.session.get('tempData')); // Still there

// Close tab and reopen - data is gone
```

---

### Storage.local (localStorage alias)

Explicit localStorage access.

**Example:**
```javascript
// Explicit localStorage
Storage.local.set('permanent', 'data');
const data = Storage.local.get('permanent');

// Same as Storage.set/get
Storage.set('key', 'value') === Storage.local.set('key', 'value');
```

---

### Choosing Storage Type

**Example:**
```javascript
// Use localStorage for persistent data
Storage.set('userPreferences', {
  theme: 'dark',
  language: 'en'
});

// Use sessionStorage for temporary data
Storage.session.set('wizardStep', 2);
Storage.session.set('formDraft', {
  field1: 'value1',
  field2: 'value2'
});

// All methods work the same way
Storage.session.keys();
Storage.session.values();
Storage.session.clear();
```

---

## Expiry System

### Setting Expiry Time (seconds)

**Example:**
```javascript
// Expire in 1 hour (3600 seconds)
Storage.set('accessToken', 'token123', { expires: 3600 });

// Expire in 5 minutes
Storage.set('otp', '123456', { expires: 300 });

// Expire in 1 day
Storage.set('cache', data, { expires: 86400 });

// Check after expiry
setTimeout(() => {
  const token = Storage.get('accessToken');
  console.log(token); // null (expired and auto-removed)
}, 3601000);
```

---

### Setting Expiry Date

**Example:**
```javascript
// Expire at specific date/time
const expiryDate = new Date('2024-12-31T23:59:59');
Storage.set('subscription', { plan: 'premium' }, { expires: expiryDate });

// Expire tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
Storage.set('dailyQuote', 'Be awesome!', { expires: tomorrow });

// Expire at midnight
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
Storage.set('todayStats', stats, { expires: midnight });
```

---

### Auto-Cleanup of Expired Items

**Example:**
```javascript
// Expired items are automatically removed when accessed
Storage.set('temp', 'value', { expires: 1 }); // 1 second

setTimeout(() => {
  // Item is automatically removed when we try to get it
  const value = Storage.get('temp'); // null
  console.log(Storage.has('temp')); // false
}, 2000);

// Manual cleanup
const cleaned = Storage.cleanup();
console.log(`Cleaned ${cleaned.local} expired items from localStorage`);
console.log(`Cleaned ${cleaned.session} expired items from sessionStorage`);
```

---

## Namespace Support

### Storage.namespace(name)

Create a namespaced storage instance for organized storage.

**Parameters:**
- `name` (string): Namespace name

**Returns:** StorageHelper instance with namespace

**Example:**
```javascript
// Create namespace for user data
const userStorage = Storage.namespace('user');
userStorage.set('profile', { name: 'John', age: 25 });
userStorage.set('settings', { theme: 'dark' });

// Create namespace for app data
const appStorage = Storage.namespace('app');
appStorage.set('version', '1.0.0');
appStorage.set('config', { api: 'https://api.example.com' });

// Namespaces are isolated
console.log(userStorage.keys()); // ['profile', 'settings']
console.log(appStorage.keys());  // ['version', 'config']

// Clear only one namespace
userStorage.clear(); // Only clears user:* keys
```

---

### Nested Namespaces

**Example:**
```javascript
// Create nested namespaces
const api = Storage.namespace('api');
const v1 = api.namespace('v1');
const v2 = api.namespace('v2');

// Each namespace is independent
v1.set('endpoint', '/api/v1/users');
v2.set('endpoint', '/api/v2/users');

console.log(v1.get('endpoint')); // '/api/v1/users'
console.log(v2.get('endpoint')); // '/api/v2/users'
```

---

### Namespace Best Practices

**Example:**
```javascript
// Organize by feature
const auth = Storage.namespace('auth');
auth.set('token', 'abc123');
auth.set('refreshToken', 'def456');

const cart = Storage.namespace('cart');
cart.set('items', [{ id: 1, qty: 2 }]);
cart.set('total', 99.99);

// Organize by user
const user1 = Storage.namespace('user_123');
const user2 = Storage.namespace('user_456');

user1.set('preferences', { theme: 'dark' });
user2.set('preferences', { theme: 'light' });

// Easy cleanup per namespace
auth.clear(); // Only clears auth data
cart.clear(); // Only clears cart data
```

---

## Bulk Operations

### Storage.setMultiple(obj, options)

Set multiple key-value pairs at once.

**Parameters:**
- `obj` (Object): Object with key-value pairs to store
- `options` (Object, optional): Storage options applied to all items

**Returns:** Object with success/failure for each key

**Example:**
```javascript
// Set multiple values
const results = Storage.setMultiple({
  username: 'John',
  email: 'john@example.com',
  age: 25,
  preferences: { theme: 'dark', lang: 'en' }
});

console.log(results);
// { username: true, email: true, age: true, preferences: true }

// With expiry for all items
Storage.setMultiple({
  token1: 'abc',
  token2: 'def',
  token3: 'ghi'
}, { expires: 3600 });

// Check results
if (results.username) {
  console.log('Username saved successfully');
}
```

---

### Storage.getMultiple(keys, defaultValue)

Get multiple values at once.

**Parameters:**
- `keys` (Array): Array of keys to retrieve
- `defaultValue` (any, optional): Default value for missing keys

**Returns:** Object with key-value pairs

**Example:**
```javascript
// Get multiple values
const values = Storage.getMultiple(['username', 'email', 'age']);
console.log(values);
// { username: 'John', email: 'john@example.com', age: 25 }

// With default value
const settings = Storage.getMultiple(
  ['theme', 'lang', 'notifications'],
  'default'
);
console.log(settings);
// { theme: 'dark', lang: 'en', notifications: 'default' }

// Destructure result
const { username, email } = Storage.getMultiple(['username', 'email']);
```

---

### Storage.removeMultiple(keys)

Remove multiple keys at once.

**Parameters:**
- `keys` (Array): Array of keys to remove

**Returns:** Object with success/failure for each key

**Example:**
```javascript
// Remove multiple keys
const results = Storage.removeMultiple(['oldData1', 'oldData2', 'oldData3']);
console.log(results);
// { oldData1: true, oldData2: true, oldData3: false }

// Remove all user-related keys
Storage.removeMultiple(['username', 'email', 'age', 'preferences']);

// Check results
if (results.oldData1) {
  console.log('oldData1 removed successfully');
}
```

---

## Advanced Operations

### Storage.increment(key, amount)

Increment a numeric value.

**Parameters:**
- `key` (string): Storage key
- `amount` (number, optional): Amount to increment (default: 1)

**Returns:** New value

**Example:**
```javascript
// Initialize counter
Storage.set('visitCount', 0);

// Increment by 1
Storage.increment('visitCount');
console.log(Storage.get('visitCount')); // 1

// Increment by specific amount
Storage.increment('visitCount', 5);
console.log(Storage.get('visitCount')); // 6

// Works with non-existent keys (starts at 0)
Storage.increment('newCounter');
console.log(Storage.get('newCounter')); // 1

// Track page views
Storage.increment('pageViews');
console.log(`Page viewed ${Storage.get('pageViews')} times`);
```

---

### Storage.decrement(key, amount)

Decrement a numeric value.

**Parameters:**
- `key` (string): Storage key
- `amount` (number, optional): Amount to decrement (default: 1)

**Returns:** New value

**Example:**
```javascript
// Initialize counter
Storage.set('attempts', 5);

// Decrement by 1
Storage.decrement('attempts');
console.log(Storage.get('attempts')); // 4

// Decrement by specific amount
Storage.decrement('attempts', 2);
console.log(Storage.get('attempts')); // 2

// Track remaining tries
const remaining = Storage.decrement('triesLeft');
if (remaining === 0) {
  console.log('No tries left!');
}
```

---

### Storage.toggle(key)

Toggle a boolean value.

**Parameters:**
- `key` (string): Storage key

**Returns:** New value

**Example:**
```javascript
// Initialize boolean
Storage.set('darkMode', false);

// Toggle value
Storage.toggle('darkMode');
console.log(Storage.get('darkMode')); // true

// Toggle again
Storage.toggle('darkMode');
console.log(Storage.get('darkMode')); // false

// Works with non-existent keys (starts as false, returns true)
const isEnabled = Storage.toggle('featureFlag');
console.log(isEnabled); // true

// Use for UI toggles
document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = Storage.toggle('darkMode');
  document.body.classList.toggle('dark-mode', isDark);
});
```

---

## Storage Management

### Storage.cleanup()

Manually remove all expired items from storage.

**Parameters:** None

**Returns:** Object with cleanup counts for local and session storage

**Example:**
```javascript
// Manual cleanup
const cleaned = Storage.cleanup();
console.log(`Cleaned ${cleaned.local} items from localStorage`);
console.log(`Cleaned ${cleaned.session} items from sessionStorage`);

// Run cleanup on page load
window.addEventListener('load', () => {
  Storage.cleanup();
});

// Periodic cleanup
setInterval(() => {
  const result = Storage.cleanup();
  if (result.local > 0 || result.session > 0) {
    console.log('Cleaned expired items:', result);
  }
}, 3600000); // Every hour
```

---

### Storage.stats()

Get statistics about storage usage.

**Parameters:** None

**Returns:** Object with stats for local and session storage

**Example:**
```javascript
// Get storage statistics
const stats = Storage.stats();
console.log(stats);
/*
{
  local: {
    keys: 15,
    totalSize: 2048,
    averageSize: 136,
    namespace: 'global',
    storageType: 'localStorage'
  },
  session: {
    keys: 3,
    totalSize: 256,
    averageSize: 85,
    storageType: 'sessionStorage',
    namespace: 'global'
  }
}
*/

// Display storage info
console.log(`localStorage has ${stats.local.keys} items (${stats.local.totalSize} bytes)`);
console.log(`sessionStorage has ${stats.session.keys} items`);

// Check if storage is getting full
if (stats.local.totalSize > 5000000) { // 5MB
  console.warn('Storage is getting full!');
}
```

---

### Vanilla-Like Aliases

The module provides vanilla Web Storage API compatible methods.

**Example:**
```javascript
// setItem (alias for set)
Storage.setItem('key', 'value');

// getItem (alias for get)
const value = Storage.getItem('key');

// removeItem (alias for remove)
Storage.removeItem('key');

// These work identically to set/get/remove
Storage.setItem('user', { name: 'John' });
const user = Storage.getItem('user', {});
Storage.removeItem('user');
```

---

## Forms Integration

The Storage module automatically integrates with the Forms module for form auto-save and restore functionality.

### form.autoSave(storageKey, options)

Automatically save form values to storage as user types.

**Parameters:**
- `storageKey` (string): Key to store form data under
- `options` (Object, optional): Auto-save options
  - `storage` (string): 'localStorage' or 'sessionStorage' (default: 'localStorage')
  - `interval` (number): Debounce interval in ms (default: 1000)
  - `events` (Array): Events to trigger save (default: ['input', 'change'])
  - `namespace` (string): Storage namespace
  - `expires` (number|Date): Expiry time

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.contactForm;

// Basic auto-save
form.autoSave('contact-form-draft');

// User types... data is automatically saved

// With options
form.autoSave('wizard-step-1', {
  storage: 'sessionStorage',
  interval: 500, // Save after 500ms of inactivity
  events: ['input', 'change', 'blur'],
  expires: 3600 // Expire in 1 hour
});

// With namespace
form.autoSave('form-data', {
  namespace: 'drafts'
});
```

---

### form.restore(storageKey, options)

Restore previously saved form values from storage.

**Parameters:**
- `storageKey` (string): Key where form data is stored
- `options` (Object, optional): Restore options
  - `storage` (string): 'localStorage' or 'sessionStorage' (default: 'localStorage')
  - `namespace` (string): Storage namespace
  - `clearAfterRestore` (boolean): Remove from storage after restoring (default: false)

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.contactForm;

// Restore saved values
form.restore('contact-form-draft');

// With options
form.restore('wizard-step-1', {
  storage: 'sessionStorage',
  clearAfterRestore: true // Remove after restoring
});

// With namespace
form.restore('form-data', {
  namespace: 'drafts'
});

// Restore on page load
window.addEventListener('load', () => {
  Forms.contactForm.restore('contact-draft');
});
```

---

### form.clearAutoSave()

Stop auto-saving and remove saved form data.

**Parameters:** None

**Returns:** Form element for chaining

**Example:**
```javascript
const form = Forms.contactForm;

// Start auto-save
form.autoSave('contact-draft');

// Later, stop and clear
form.clearAutoSave();

// Use after successful submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const result = await submitForm(form.values);
  
  if (result.success) {
    form.clearAutoSave(); // Clear draft
    form.reset();
  }
});
```

---

### Complete Forms Integration Example

**Example:**
```javascript
const registrationForm = Forms.registrationForm;

// Auto-save to sessionStorage while user fills form
registrationForm.autoSave('registration-draft', {
  storage: 'sessionStorage',
  interval: 1000,
  expires: 3600 // Draft expires in 1 hour
});

// Restore draft on page load
window.addEventListener('load', () => {
  if (Storage.session.has('registration-draft')) {
    registrationForm.restore('registration-draft', {
      storage: 'sessionStorage'
    });
    
    // Show notification
    alert('Draft restored! Continue where you left off.');
  }
});

// Clear draft on successful submission
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const result = await registrationForm.submitData({
    url: '/api/register'
  });
  
  if (result.success) {
    // Clear the draft
    registrationForm.clearAutoSave();
    
    // Save user preferences to localStorage
    Storage.set('userRegistered', true);
    
    window.location.href = '/welcome';
  }
});

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (Storage.session.has('registration-draft')) {
    e.preventDefault();
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  }
});
```

---

## Complete Examples

### Example 1: User Preferences

```javascript
// Save user preferences
function savePreferences(prefs) {
  Storage.set('userPreferences', prefs);
}

// Load preferences
function loadPreferences() {
  return Storage.get('userPreferences', {
    theme: 'light',
    language: 'en',
    notifications: true,
    fontSize: 'medium'
  });
}

// Apply preferences
function applyPreferences() {
  const prefs = loadPreferences();
  
  document.body.setAttribute('data-theme', prefs.theme);
  document.documentElement.lang = prefs.language;
  document.body.style.fontSize = prefs.fontSize;
}

// Update single preference
function updatePreference(key, value) {
  const prefs = loadPreferences();
  prefs[key] = value;
  savePreferences(prefs);
  applyPreferences();
}

// Initialize
applyPreferences();

// Update theme
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = loadPreferences().theme;
  updatePreference('theme', current === 'light' ? 'dark' : 'light');
});
```

---

### Example 2: Shopping Cart

```javascript
// Cart namespace
const cartStorage = Storage.namespace('cart');

// Add item to cart
function addToCart(product) {
  const cart = cartStorage.get('items', []);
  
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      addedAt: Date.now()
    });
  }
  
  cartStorage.set('items', cart);
  updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = cartStorage.get('items', []);
  const filtered = cart.filter(item => item.id !== productId);
  cartStorage.set('items', filtered);
  updateCartUI();
}

// Get cart total
function getCartTotal() {
  const cart = cartStorage.get('items', []);
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Clear cart
function clearCart() {
  cartStorage.clear();
  updateCartUI();
}

// Update UI
function updateCartUI() {
  const cart = cartStorage.get('items', []);
  document.getElementById('cartCount').textContent = cart.length;
  document.getElementById('cartTotal').textContent = 
    `$${getCartTotal().toFixed(2)}`;
}

// Initialize
updateCartUI();
```

---

### Example 3: Authentication with Token Expiry

```javascript
// Auth namespace
const authStorage = Storage.namespace('auth');

// Login and save token
async function login(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save token with 1 hour expiry
      authStorage.set('accessToken', data.token, { expires: 3600 });
      
      // Save refresh token with 7 days expiry
      authStorage.set('refreshToken', data.refreshToken, {
        expires: 604800
      });
      
      // Save user info permanently
      authStorage.set('user', data.user);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return authStorage.has('accessToken');
}

// Get current user
function getCurrentUser() {
  return authStorage.get('user', null);
}

// Logout
function logout() {
  authStorage.clear();
  window.location.href = '/login';
}

// Add auth token to API requests
function fetchWithAuth(url, options = {}) {
  const token = authStorage.get('accessToken');
  
  if (!token) {
    logout();
    return Promise.reject('Not authenticated');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}

// Check auth on page load
if (!isAuthenticated() && !window.location.pathname.includes('/login')) {
  window.location.href = '/login';
}
```

---

### Example 4: Form Draft Auto-Save

```javascript
// Multi-step form with auto-save
const wizardStorage = Storage.namespace('wizard');

let currentStep = 1;

// Auto-save current step data
function saveStep(stepNumber) {
  const form = Forms[`step${stepNumber}Form`];
  if (form) {
    wizardStorage.set(`step${stepNumber}`, form.values, {
      expires: 7200 // 2 hours
    });
    wizardStorage.set('currentStep', stepNumber);
  }
}

// Restore step data
function restoreStep(stepNumber) {
  const data = wizardStorage.get(`step${stepNumber}`);
  if (data) {
    const form = Forms[`step${stepNumber}Form`];
    if (form) {
      form.values = data;
    }
  }
}

// Navigate to next step
function nextStep() {
  saveStep(currentStep);
  currentStep++;
  showStep(currentStep);
  restoreStep(currentStep);
}

// Navigate to previous step
function previousStep() {
  saveStep(currentStep);
  currentStep--;
  showStep(currentStep);
  restoreStep(currentStep);
}

// Initialize wizard
window.addEventListener('load', () => {
  const savedStep = wizardStorage.get('currentStep', 1);
  currentStep = savedStep;
  showStep(currentStep);
  restoreStep(currentStep);
});

// Clear draft after completion
function completeWizard() {
  // Submit all data
  const allData = {
    step1: wizardStorage.get('step1'),
    step2: wizardStorage.get('step2'),
    step3: wizardStorage.get('step3')
  };
  
  // Send to server
  submitWizard(allData).then(() => {
    // Clear all saved data
    wizardStorage.clear();
  });
}
```

---

### Example 5: Activity Tracker

```javascript
// Track user activity with expiry
const activityStorage = Storage.namespace('activity');

// Log activity
function logActivity(action, data = {}) {
  const activities = activityStorage.get('log', []);
  
  activities.push({
    action,
    data,
    timestamp: Date.now()
  });
  
  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.shift();
  }
  
  activityStorage.set('log', activities);
}

// Get recent activities
function getRecentActivities(limit = 10) {
  const activities = activityStorage.get('log', []);
  return activities.slice(-limit);
}

// Track page views
logActivity('page_view', {
  url: window.location.pathname
});

// Track clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('a, button')) {
    logActivity('click', {
      element: e.target.tagName,
      text: e.target.textContent
    });
  }
});

// Display activity stats
function showStats() {
  const activities = activityStorage.get('log', []);
  const pageViews = activities.filter(a => a.action === 'page_view').length;
  const clicks = activities.filter(a => a.action === 'click').length;
  
  console.log(`Page views: ${pageViews}`);
  console.log(`Clicks: ${clicks}`);
  console.log(`Total activities: ${activities.length}`);
}
```

---

## Best Practices

1. **Use Namespaces** - Organize storage with namespaces for different features
2. **Set Expiry** - Use expiry for temporary data (tokens, cache, etc.)
3. **Handle Errors** - Always provide default values when getting data
4. **Regular Cleanup** - Run cleanup periodically to remove expired items
5. **Check Existence** - Use `has()` before getting to avoid unnecessary operations
6. **Type Safety** - The module preserves types, but always validate retrieved data
7. **Storage Limits** - Be aware of 5-10MB storage limits in browsers
8. **Session vs Local** - Choose appropriate storage type for your data lifetime

---

## Performance Tips

1. **Batch Operations** - Use setMultiple/getMultiple for multiple keys
2. **Minimize Storage** - Store only necessary data
3. **Use Expiry** - Let expired items clean up automatically
4. **Namespace Isolation** - Use namespaces to limit clear() scope
5. **Avoid Frequent Updates** - Debounce writes for frequently changing data

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage/sessionStorage support required
- JSON serialization/parsing support required
- Falls back to no-op storage if Web Storage API unavailable

---

## Integration with Main Library

The Storage module seamlessly integrates with the main DOM Helpers library:

```javascript
// Use with Forms
const form = Forms.myForm;
form.autoSave('form-draft');
form.restore('form-draft');

// Use with Elements
Storage.set('theme', 'dark');
Elements.body.className = Storage.get('theme', 'light');

// Combine with Reactive State
const state = ReactiveState.create({
  count: Storage.get('count', 0)
});

// Save state changes
Elements.bind({
  counter: () => {
    Storage.set('count', state.count);
    return state.count;
  }
});
```

---

## Error Handling

```javascript
// Storage operations return boolean for success/failure
const success = Storage.set('key', 'value');
if (!success) {
  console.error('Failed to save data');
}

// Always provide defaults when getting
const data = Storage.get('important', {
  // Fallback default value
  critical: true,
  value: 0
});

// Check existence before using
if (Storage.has('userData')) {
  const user = Storage.get('userData');
  displayUser(user);
} else {
  showLoginPrompt();
}
```

---

## Troubleshooting

### Storage quota exceeded
```javascript
// Check storage size
const stats = Storage.stats();
if (stats.local.totalSize > 4000000) { // Near 5MB limit
  console.warn('Storage nearly full');
  // Clean up old data
  Storage.cleanup();
}
```

### Data not persisting
```javascript
// Ensure you're using localStorage, not sessionStorage
Storage.set('permanent', data); // localStorage
// Not: Storage.session.set('permanent', data); // sessionStorage
```

### Expired data issues
```javascript
// Check if data has expiry
Storage.set('data', value, { expires: 3600 });

// Will return null after 1 hour
const data = Storage.get('data');
if (!data) {
  console.log('Data expired or not found');
}
```

---

## Security Considerations

1. **No Sensitive Data** - Don't store passwords, credit cards, or sensitive info
2. **Token Expiry** - Always use expiry for auth tokens
3. **Validate Data** - Always validate data retrieved from storage
4. **XSS Protection** - Storage is vulnerable to XSS attacks
5. **User-Specific Data** - Use namespaces for multi-user environments

```javascript
// Good - token with expiry
Storage.set('accessToken', token, { expires: 3600 });

// Bad - sensitive data without expiry
// Storage.set('password', userPassword); // DON'T DO THIS

// Good - validate retrieved data
const age = Storage.get('userAge', 0);
if (typeof age === 'number' && age > 0 && age < 150) {
  console.log('Valid age:', age);
}
```

---

## License

MIT License - See LICENSE file for details

---

## Support

For issues, questions, or contributions, visit the GitHub repository.

---

**End of Documentation**

