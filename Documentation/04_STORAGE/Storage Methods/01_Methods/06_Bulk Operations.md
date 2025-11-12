# Bulk Operations

Complete documentation for bulk storage operations in the DOM Helpers Storage Module.

---

## Table of Contents

1. [Overview](#overview)
2. [Methods](#methods)
   - [setMultiple()](#setmultiple)
   - [getMultiple()](#getmultiple)
   - [removeMultiple()](#removemultiple)
3. [Use Cases](#use-cases)
4. [Examples](#examples)
5. [Performance Considerations](#performance-considerations)
6. [Best Practices](#best-practices)

---

## Overview

Bulk operations allow you to work with multiple storage items in a single method call, making your code more efficient and readable. These methods are particularly useful when:

- Initializing application state with multiple values
- Saving/loading configuration objects
- Batch processing storage operations
- Cleaning up multiple temporary keys
- Syncing data between storage and UI

All bulk operations return an object mapping each key to its operation result, allowing you to check which operations succeeded or failed.

---

## Methods

### setMultiple()

Set multiple key-value pairs at once.

#### Syntax

```javascript
storage.setMultiple(obj, options)
```

#### Parameters

- **`obj`** (object, required): Object containing key-value pairs to store
  - Keys: Storage keys (strings)
  - Values: Any serializable data
  
- **`options`** (object, optional): Configuration options applied to all items
  - `expires` (number|Date): Expiration time in seconds or Date object
  - Any other options supported by `set()`

#### Returns

**`object`** - Object mapping each key to a boolean indicating success (`true`) or failure (`false`)

#### Example

```javascript
// Basic usage
const results = Storage.setMultiple({
  username: 'alice',
  email: 'alice@example.com',
  role: 'admin',
  active: true
});

console.log(results);
// { username: true, email: true, role: true, active: true }

// Check if all succeeded
const allSucceeded = Object.values(results).every(v => v === true);
```

#### With Options

```javascript
// Apply expiry to all items
Storage.setMultiple({
  sessionId: 'abc123',
  userId: 42,
  loginTime: Date.now()
}, { expires: 3600 }); // All expire in 1 hour

// With Date expiry
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

Storage.setMultiple({
  promotion: 'SAVE20',
  banner: 'Holiday Sale',
  featured: true
}, { expires: tomorrow });
```

---

### getMultiple()

Get multiple values by their keys.

#### Syntax

```javascript
storage.getMultiple(keys, defaultValue)
```

#### Parameters

- **`keys`** (Array<string>, required): Array of storage keys to retrieve

- **`defaultValue`** (any, optional): Default value for missing or expired keys
  - Default: `null`
  - Applied to all missing keys

#### Returns

**`object`** - Object mapping each key to its stored value (or `defaultValue` if not found)

#### Example

```javascript
// Basic usage
const data = Storage.getMultiple(['username', 'email', 'role']);

console.log(data);
// { username: 'alice', email: 'alice@example.com', role: 'admin' }

// Access values
console.log(data.username); // 'alice'
console.log(data.email);    // 'alice@example.com'
```

#### With Default Value

```javascript
// Use default for missing keys
const config = Storage.getMultiple(
  ['theme', 'language', 'fontSize', 'notifications'],
  'default'
);

console.log(config);
// { 
//   theme: 'dark',           // exists in storage
//   language: 'en',          // exists in storage
//   fontSize: 'default',     // doesn't exist
//   notifications: 'default' // doesn't exist
// }
```

#### Destructuring

```javascript
// Use destructuring for clean code
const { username, email, role } = Storage.getMultiple([
  'username',
  'email', 
  'role'
]);

console.log(username); // 'alice'
console.log(email);    // 'alice@example.com'
console.log(role);     // 'admin'
```

---

### removeMultiple()

Remove multiple keys at once.

#### Syntax

```javascript
storage.removeMultiple(keys)
```

#### Parameters

- **`keys`** (Array<string>, required): Array of storage keys to remove

#### Returns

**`object`** - Object mapping each key to a boolean indicating success (`true`) or failure (`false`)

#### Example

```javascript
// Basic usage
const results = Storage.removeMultiple([
  'tempData',
  'cacheKey',
  'oldSession'
]);

console.log(results);
// { tempData: true, cacheKey: true, oldSession: true }

// Check if all succeeded
const allRemoved = Object.values(results).every(v => v === true);
if (allRemoved) {
  console.log('All items removed successfully');
}
```

#### Batch Cleanup

```javascript
// Clean up multiple related keys
Storage.removeMultiple([
  'cart:item1',
  'cart:item2',
  'cart:item3',
  'cart:total'
]);

// Clean up temporary data
Storage.removeMultiple([
  'wizard:step1',
  'wizard:step2',
  'wizard:step3',
  'wizard:currentStep'
]);
```

---

## Use Cases

### 1. Application Initialization

```javascript
// Initialize app with default settings
function initializeApp() {
  const defaults = {
    theme: 'light',
    language: 'en',
    fontSize: 16,
    notifications: true,
    autoSave: true,
    version: '1.0.0'
  };
  
  Storage.setMultiple(defaults);
}

// Load app settings
function loadAppSettings() {
  return Storage.getMultiple([
    'theme',
    'language',
    'fontSize',
    'notifications',
    'autoSave'
  ]);
}
```

### 2. User Profile Management

```javascript
// Save user profile
function saveUserProfile(profile) {
  const results = Storage.setMultiple({
    'user:name': profile.name,
    'user:email': profile.email,
    'user:avatar': profile.avatar,
    'user:bio': profile.bio,
    'user:updatedAt': new Date()
  });
  
  return Object.values(results).every(v => v === true);
}

// Load user profile
function loadUserProfile() {
  const { name, email, avatar, bio } = Storage.getMultiple([
    'user:name',
    'user:email',
    'user:avatar',
    'user:bio'
  ], '');
  
  return { name, email, avatar, bio };
}

// Clear user profile
function clearUserProfile() {
  Storage.removeMultiple([
    'user:name',
    'user:email',
    'user:avatar',
    'user:bio',
    'user:updatedAt'
  ]);
}
```

### 3. Form State Management

```javascript
// Save form state
function saveFormState(formId, values) {
  const keys = {};
  Object.entries(values).forEach(([field, value]) => {
    keys[`form:${formId}:${field}`] = value;
  });
  
  Storage.setMultiple(keys, { expires: 86400 }); // 24 hours
}

// Restore form state
function restoreFormState(formId, fields) {
  const keys = fields.map(field => `form:${formId}:${field}`);
  const data = Storage.getMultiple(keys);
  
  // Convert back to field names
  const values = {};
  Object.entries(data).forEach(([key, value]) => {
    const field = key.split(':').pop();
    values[field] = value;
  });
  
  return values;
}
```

### 4. Cache Management

```javascript
// Cache multiple API responses
function cacheAPIResponses(responses) {
  const cacheData = {};
  responses.forEach(({ endpoint, data }) => {
    cacheData[`cache:${endpoint}`] = data;
  });
  
  Storage.setMultiple(cacheData, { expires: 600 }); // 10 minutes
}

// Get cached responses
function getCachedResponses(endpoints) {
  const keys = endpoints.map(e => `cache:${e}`);
  return Storage.getMultiple(keys);
}

// Invalidate cache
function invalidateCache(endpoints) {
  const keys = endpoints.map(e => `cache:${e}`);
  Storage.removeMultiple(keys);
}
```

### 5. Session Management

```javascript
// Start session with multiple values
function startSession(sessionData) {
  Storage.session.setMultiple({
    sessionId: sessionData.id,
    userId: sessionData.userId,
    token: sessionData.token,
    startTime: Date.now(),
    expiresAt: sessionData.expiresAt
  });
}

// Get session data
function getSessionData() {
  return Storage.session.getMultiple([
    'sessionId',
    'userId',
    'token',
    'startTime',
    'expiresAt'
  ]);
}

// End session
function endSession() {
  Storage.session.removeMultiple([
    'sessionId',
    'userId',
    'token',
    'startTime',
    'expiresAt'
  ]);
}
```

---

## Examples

### Example 1: Settings Panel

```javascript
// Settings manager with bulk operations
class SettingsManager {
  constructor() {
    this.storage = Storage.namespace('settings');
    this.defaults = {
      theme: 'light',
      language: 'en',
      fontSize: 14,
      lineHeight: 1.5,
      notifications: true,
      autoSave: true,
      spellCheck: true
    };
  }
  
  // Load all settings
  load() {
    const keys = Object.keys(this.defaults);
    const settings = this.storage.getMultiple(keys);
    
    // Merge with defaults
    return { ...this.defaults, ...settings };
  }
  
  // Save all settings
  save(settings) {
    const results = this.storage.setMultiple(settings);
    const success = Object.values(results).every(v => v === true);
    return success;
  }
  
  // Reset to defaults
  reset() {
    const keys = Object.keys(this.defaults);
    this.storage.removeMultiple(keys);
    return this.save(this.defaults);
  }
  
  // Update specific settings
  update(updates) {
    const current = this.load();
    const newSettings = { ...current, ...updates };
    return this.save(newSettings);
  }
}

// Usage
const settings = new SettingsManager();

// Load settings on app start
const currentSettings = settings.load();
applySettings(currentSettings);

// Update multiple settings
settings.update({
  theme: 'dark',
  fontSize: 16,
  notifications: false
});

// Reset to defaults
settings.reset();
```

### Example 2: Shopping Cart

```javascript
// Shopping cart with bulk operations
class ShoppingCart {
  constructor() {
    this.storage = Storage.namespace('cart');
  }
  
  // Add multiple items
  addItems(items) {
    const cartData = {};
    items.forEach(item => {
      cartData[`item:${item.id}`] = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        addedAt: Date.now()
      };
    });
    
    return this.storage.setMultiple(cartData, { 
      expires: 604800 // 7 days
    });
  }
  
  // Get all items
  getItems() {
    const keys = this.storage.keys()
      .filter(key => key.startsWith('item:'));
    
    const items = this.storage.getMultiple(keys);
    return Object.values(items);
  }
  
  // Remove multiple items
  removeItems(itemIds) {
    const keys = itemIds.map(id => `item:${id}`);
    return this.storage.removeMultiple(keys);
  }
  
  // Clear cart
  clear() {
    const keys = this.storage.keys()
      .filter(key => key.startsWith('item:'));
    
    return this.storage.removeMultiple(keys);
  }
  
  // Get cart summary
  getSummary() {
    const items = this.getItems();
    return {
      itemCount: items.length,
      totalPrice: items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      )
    };
  }
}

// Usage
const cart = new ShoppingCart();

// Add multiple items at once
cart.addItems([
  { id: 1, name: 'Product A', price: 29.99, quantity: 2 },
  { id: 2, name: 'Product B', price: 49.99, quantity: 1 },
  { id: 3, name: 'Product C', price: 19.99, quantity: 3 }
]);

// Get cart summary
const summary = cart.getSummary();
console.log(`${summary.itemCount} items, Total: $${summary.totalPrice}`);

// Remove multiple items
cart.removeItems([1, 3]);

// Clear cart
cart.clear();
```

### Example 3: Feature Flags

```javascript
// Feature flags manager
class FeatureFlags {
  constructor() {
    this.storage = Storage.namespace('features');
  }
  
  // Enable multiple features
  enable(features) {
    const flags = {};
    features.forEach(feature => {
      flags[feature] = true;
    });
    
    return this.storage.setMultiple(flags);
  }
  
  // Disable multiple features
  disable(features) {
    const flags = {};
    features.forEach(feature => {
      flags[feature] = false;
    });
    
    return this.storage.setMultiple(flags);
  }
  
  // Check multiple features
  check(features) {
    return this.storage.getMultiple(features, false);
  }
  
  // Get all enabled features
  getEnabled() {
    const all = this.storage.entries();
    return all
      .filter(([_, enabled]) => enabled === true)
      .map(([feature]) => feature);
  }
  
  // Reset features
  reset(features) {
    return this.storage.removeMultiple(features);
  }
}

// Usage
const features = new FeatureFlags();

// Enable beta features
features.enable([
  'darkMode',
  'newDashboard',
  'advancedSearch',
  'exportData'
]);

// Check features
const enabled = features.check([
  'darkMode',
  'newDashboard',
  'experimentalUI'
]);

if (enabled.darkMode) {
  enableDarkMode();
}

if (enabled.newDashboard) {
  loadNewDashboard();
}

// Get all enabled features
const allEnabled = features.getEnabled();
console.log('Enabled features:', allEnabled);
```

### Example 4: Multi-language Support

```javascript
// Translations manager
class TranslationsManager {
  constructor(language = 'en') {
    this.storage = Storage.namespace(`i18n:${language}`);
  }
  
  // Load translations for multiple keys
  load(keys) {
    return this.storage.getMultiple(keys, '');
  }
  
  // Save translations
  save(translations) {
    return this.storage.setMultiple(translations, {
      expires: 86400 // Cache for 24 hours
    });
  }
  
  // Clear cached translations
  clear(keys = null) {
    if (keys) {
      return this.storage.removeMultiple(keys);
    }
    return this.storage.clear();
  }
  
  // Get translation or fallback
  t(key, fallback = '') {
    return this.storage.get(key, fallback);
  }
}

// Usage
const translations = new TranslationsManager('es');

// Cache translations
translations.save({
  'nav.home': 'Inicio',
  'nav.about': 'Acerca de',
  'nav.contact': 'Contacto',
  'btn.submit': 'Enviar',
  'btn.cancel': 'Cancelar',
  'msg.success': 'Éxito',
  'msg.error': 'Error'
});

// Load multiple translations
const navTranslations = translations.load([
  'nav.home',
  'nav.about',
  'nav.contact'
]);

// Update UI
document.getElementById('homeLink').textContent = navTranslations['nav.home'];
document.getElementById('aboutLink').textContent = navTranslations['nav.about'];

// Or use single translation
const submitText = translations.t('btn.submit', 'Submit');
```

### Example 5: Wizard Form with Steps

```javascript
// Multi-step wizard manager
class WizardManager {
  constructor(wizardId) {
    this.wizardId = wizardId;
    this.storage = Storage.namespace(`wizard:${wizardId}`);
  }
  
  // Save all steps data
  saveSteps(stepsData) {
    const data = {};
    Object.entries(stepsData).forEach(([step, values]) => {
      data[`step:${step}`] = values;
    });
    
    return this.storage.setMultiple(data, {
      expires: 86400 // 24 hours
    });
  }
  
  // Load all steps data
  loadSteps(stepNumbers) {
    const keys = stepNumbers.map(num => `step:${num}`);
    const data = this.storage.getMultiple(keys, {});
    
    // Convert back to step numbers
    const steps = {};
    Object.entries(data).forEach(([key, value]) => {
      const stepNum = key.split(':')[1];
      steps[stepNum] = value;
    });
    
    return steps;
  }
  
  // Save wizard state
  saveState(state) {
    return this.storage.setMultiple({
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      startedAt: state.startedAt || Date.now()
    });
  }
  
  // Load wizard state
  loadState() {
    return this.storage.getMultiple([
      'currentStep',
      'completedSteps',
      'startedAt'
    ]);
  }
  
  // Clear wizard data
  clear() {
    return this.storage.clear();
  }
  
  // Get completion percentage
  getProgress(totalSteps) {
    const state = this.loadState();
    const completed = state.completedSteps || [];
    return Math.round((completed.length / totalSteps) * 100);
  }
}

// Usage
const wizard = new WizardManager('registration');

// Save wizard progress
wizard.saveSteps({
  1: { firstName: 'John', lastName: 'Doe' },
  2: { email: 'john@example.com', phone: '555-0100' },
  3: { address: '123 Main St', city: 'Boston' }
});

wizard.saveState({
  currentStep: 3,
  completedSteps: [1, 2],
  startedAt: Date.now()
});

// Restore wizard on page load
const steps = wizard.loadSteps([1, 2, 3]);
const state = wizard.loadState();

console.log(`Resuming at step ${state.currentStep}`);
console.log('Progress:', wizard.getProgress(5), '%');

// Complete wizard
wizard.clear();
```

---

## Performance Considerations

### 1. Batch Size

```javascript
// Good: Reasonable batch size
Storage.setMultiple({
  setting1: 'value1',
  setting2: 'value2',
  setting3: 'value3',
  setting4: 'value4',
  setting5: 'value5'
});

// Caution: Very large batch may impact performance
// Consider chunking if dealing with hundreds of items
```

### 2. Chunking Large Operations

```javascript
// Helper function for chunked operations
function setMultipleChunked(data, chunkSize = 50) {
  const entries = Object.entries(data);
  const results = {};
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const chunkObj = Object.fromEntries(chunk);
    const chunkResults = Storage.setMultiple(chunkObj);
    Object.assign(results, chunkResults);
  }
  
  return results;
}

// Usage with large dataset
const largeDataset = {}; // 200+ items
for (let i = 0; i < 200; i++) {
  largeDataset[`key${i}`] = `value${i}`;
}

setMultipleChunked(largeDataset, 50);
```

### 3. Selective Loading

```javascript
// Good: Load only what you need
const needed = Storage.getMultiple(['theme', 'language']);

// Avoid: Loading everything when you only need a few values
const all = Storage.entries(); // Gets all items
const theme = all.find(([k]) => k === 'theme')?.[1];
```

---

## Best Practices

### 1. Validate Results

```javascript
// Always check operation results
const results = Storage.setMultiple({
  critical: 'data',
  important: 'info'
});

if (!results.critical || !results.important) {
  console.error('Failed to save critical data');
  // Implement fallback or retry logic
}
```

### 2. Use Consistent Key Patterns

```javascript
// Good: Consistent naming pattern
Storage.setMultiple({
  'user:name': 'John',
  'user:email': 'john@example.com',
  'user:role': 'admin'
});

// Better: Use namespace
const userStorage = Storage.namespace('user');
userStorage.setMultiple({
  name: 'John',
  email: 'john@example.com',
  role: 'admin'
});
```

### 3. Group Related Operations

```javascript
// Good: Group related settings
function saveUserPreferences(prefs) {
  return Storage.setMultiple({
    'prefs:theme': prefs.theme,
    'prefs:language': prefs.language,
    'prefs:notifications': prefs.notifications
  });
}

// Better: Use namespace
function saveUserPreferences(prefs) {
  const prefsStorage = Storage.namespace('prefs');
  return prefsStorage.setMultiple(prefs);
}
```

### 4. Provide Default Values

```javascript
// Good: Always provide sensible defaults
const config = Storage.getMultiple(
  ['apiUrl', 'timeout', 'retries'],
  null // or specific defaults
);

// Better: Use specific defaults per key
function loadConfig() {
  const defaults = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  };
  
  const stored = Storage.getMultiple(Object.keys(defaults));
  return { ...defaults, ...stored };
}
```

### 5. Clean Up Properly

```javascript
// Good: Remove related keys together
function logout() {
  Storage.removeMultiple([
    'authToken',
    'refreshToken',
    'userId',
    'loginTime'
  ]);
}

// Better: Use namespace for easier cleanup
function logout() {
  const authStorage = Storage.namespace('auth');
  authStorage.clear(); // Removes all auth-related keys
}
```

### 6. Handle Errors Gracefully

```javascript
// Good error handling
function saveFormData(data) {
  try {
    const results = Storage.setMultiple(data);
    const failed = Object.entries(results)
      .filter(([_, success]) => !success)
      .map(([key]) => key);
    
    if (failed.length > 0) {
      console.warn('Failed to save:', failed);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Storage error:', error);
    return false;
  }
}
```

---

## Summary

Bulk operations provide an efficient way to work with multiple storage items:

- **`setMultiple()`** - Save multiple key-value pairs with optional expiry
- **`getMultiple()`** - Retrieve multiple values with optional defaults
- **`removeMultiple()`** - Delete multiple keys at once

**Key Benefits:**
- ✅ Cleaner, more readable code
- ✅ Fewer API calls
- ✅ Atomic-like operations
- ✅ Easy result validation
- ✅ Perfect for initialization and cleanup

**Common Patterns:**
- Application initialization
- Form state management
- User profile operations
- Cache management
- Feature flags
- Session handling

Use bulk operations whenever you need to work with multiple storage items to keep your code clean and efficient.